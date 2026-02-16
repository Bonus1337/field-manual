---
id: access-control-priv-esc
title: "Kontrola dostępu i eskalacja uprawnień"
team: red
category: portswigger academy
tags: ["access-control", "idor", "privilege-escalation", "authz", "misconfiguration"]
difficulty: medium
updatedAt: "2026-02-16"
---

Access control to nie “czy masz konto”, tylko **czy aplikacja ma prawo wykonać konkretną akcję dla konkretnego użytkownika**.

W praktyce to najczęstsza przyczyna “poważnych” incydentów webowych, bo zwykle prowadzi do:

- podglądu cudzych danych,
- przejęcia kont,
- wykonywania akcji admina,
- zmiany ról / uprawnień,
- kasowania zasobów.

---

## Jak to się składa: AuthN vs Session vs AuthZ

- **Authentication (AuthN)**: kim jesteś (logowanie).
- **Session management**: czy to nadal Ty (cookie/token, ciągłość żądań).
- **Authorization (AuthZ / access control)**: co wolno tej tożsamości zrobić / zobaczyć.

Błędy access control prawie zawsze wynikają z tego, że aplikacja:

- ufa temu, co kontroluje użytkownik (parametr/cookie/JS),
- albo zakłada, że “jak UI nie pokazuje, to nikt nie wejdzie”.

---

## Trzy typy kontroli dostępu, które spotkasz w realu

### 1) Vertical (rola → funkcje)

Różne role mają dostęp do różnych funkcji.
Przykłady: panel administracyjny, zarządzanie użytkownikami, zmiany ról.

**Typowy błąd:** funkcja istnieje na backendzie, ale ograniczenie jest “symboliczne” (np. tylko ukryty link w UI).

---

### 2) Horizontal (użytkownik → jego zasoby)

Każdy użytkownik ma dostęp do “swojej” części zasobów (konto, dokumenty, zamówienia).
Przykłady: `myaccount?id=...` `orders?user=...` pobieranie plików po ID.

**Typowy błąd:** aplikacja bierze identyfikator obiektu z parametru i nie sprawdza właściciela (IDOR).

---

### 3) Context-dependent (stan procesu → dostęp)

Dostęp zależy od tego, na jakim etapie procesu jesteś.
Przykłady: koszyk po płatności, zmiana danych po potwierdzeniu, workflow “krok 1 → krok 2 → confirm”.

**Typowy błąd:** kontrola jest na części kroków, ale jeden krok da się wywołać “na skróty”.

---

## Najczęstsze błędy implementacyjne (i dlaczego są groźne)

### UI ≠ kontrola dostępu

To, że czegoś nie widać w menu, nie znaczy, że backend tego nie obsłuży.
**Ukrycie linka** to nie zabezpieczenie - to tylko UX.

---

### “Security by obscurity”

Czasem funkcje są schowane pod “dziwną” ścieżką (losowy fragment URL).
Problem: taka ścieżka i tak często wycieka (w JS, w HTML, w logice UI).

---

### Uprawnienia sterowane z klienta (parametry/cookie/hidden fields)

Jeśli aplikacja podejmuje decyzję “czy jesteś adminem” na podstawie wartości, którą użytkownik może zmienić:

- cookie typu `Admin=false`
- parametr `role=1`
- pole ukryte `isAdmin=0`
  to to nie jest kontrola dostępu - to proszenie się o eskalację.

---

## IDOR w praktyce (najczęstszy wzorzec wycieku danych)

**IDOR (Insecure Direct Object Reference)** = aplikacja pozwala odwołać się do obiektu po identyfikatorze dostarczonym przez użytkownika, bez twardej walidacji uprawnień.

Najczęstsze formy:

- numeryczne ID (łatwe do zgadywania),
- GUIDy/UUID (trudniejsze do zgadywania, ale często **wyciekają w UI**: profile, posty, komentarze, linki).

**Podstępny wariant:** odpowiedź robi redirect, ale **w treści odpowiedzi nadal są dane**. Jeśli ktoś patrzy tylko na “przekierowało do loginu”, może nie zauważyć wycieku.

---

## Warstwy po drodze: frontend, reverse proxy, backend

W realnych systemach często masz więcej niż jedną warstwę:

- CDN / WAF,
- reverse proxy,
- gateway,
- aplikacja.

To rodzi klasę błędów typu: **jedna warstwa filtruje inaczej niż druga**.

Objawy:

- jedna ścieżka blokowana, a “prawie ta sama” przechodzi,
- system toleruje inne metody HTTP,
- routing dopasowuje ścieżkę inaczej (slash na końcu, wielkość liter, rozszerzenia).

---

## X-Original-URL i X-Rewrite-URL - co to jest i czemu to ma znaczenie

### Czym są te nagłówki

`X-Original-URL` `X-Rewrite-URL` to **niestandardowe nagłówki HTTP**, które w niektórych architekturach służą do przekazywania “oryginalnej” lub “przepisanej” ścieżki żądania między warstwami.

Spotkasz je m.in. w środowiskach z reverse proxy / gateway / IIS / niektórymi frameworkami i middleware, gdzie:

- proxy przyjmuje żądanie na jednej ścieżce,
- a wewnętrznie mapuje je na inną,
- albo przekazuje backendowi informację: “tak naprawdę użytkownik chciał wejść na /X”.

### Dlaczego są ważne

Bo jeśli backend **ufa** tym nagłówkom, a filtr/ACL działa na czymś innym (np. na request line), to możesz mieć sytuację:

- **warstwa zewnętrzna** myśli, że idziesz na `/`
- **backend** widzi w nagłówku, że “oryginalny URL” to `/admin/deleteUser`

To jest klasyczny problem **rozjazdu interpretacji (discrepancy)** między warstwami.

### Co można nimi “namieszać” (realistyczne scenariusze)

1. **Ominięcie kontroli dostępu opartej o URL**
   - Proxy blokuje `/admin/*` ale backend przyjmuje `/` i interpretuje nagłówek jako ścieżkę docelową.
   - Efekt: request przechodzi do funkcji, która normalnie byłaby odcięta.

2. **Dotarcie do endpointów, które “niby nie istnieją” z zewnątrz**
   - Z zewnątrz widać tylko kilka ścieżek, reszta jest “wewnętrzna”.
   - Jeśli nagłówek pozwala wskazać wewnętrzny routing, da się go niechcący wystawić.

3. **Bypass reguł WAF / rate limiting / logging**
   - Jedna warstwa loguje i filtruje po request line,
   - druga wykonuje akcję po nagłówku,
   - co utrudnia detekcję i korelację zdarzeń (“w logach wygląda jak request do /”).

### Najważniejszy wniosek

Te nagłówki są “mechaniką infrastruktury”, ale bezpieczeństwo psuje się wtedy, gdy:

- **różne warstwy podejmują decyzje na podstawie różnych źródeł prawdy** (URL vs header),
- a przynajmniej jedna z nich nie jest konsekwentna.

---

## Jak temu zapobiegać (bez lania wody)

- **Deny by default**: jeśli zasób nie jest publiczny, domyślnie blokuj.
- **Jeden mechanizm AuthZ** (serwerowy) dla całej aplikacji, nie “tu if, tam if”.
- **Nie ufaj danym kontrolowanym przez klienta** (cookie/param/JS) do podejmowania decyzji o roli.
- **Spójny routing i spójne reguły** na wszystkich warstwach (proxy/gateway/app).
- **Testy regresyjne dla AuthZ**: role, zasoby, metody, edge-case w ścieżkach.

---

## TL;DR (save-worthy)

- Access control to _autoryzacja_, nie logowanie.
- Najczęstsze wpadki: “ukryty link”, “dziwny URL”, “rola w cookie/param”, “IDOR”.
- Wielowarstwowe architektury psują bezpieczeństwo, gdy warstwy interpretują URL inaczej.
  `X-Original-URL` `X-Rewrite-URL` są groźne, jeśli backend im ufa, a filtracja jest gdzie indziej.
