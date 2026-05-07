---
id: access-control-priv-esc
title: "PortSwigger Access Control - kontrola dostępu, IDOR i eskalacja uprawnień"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: knowledge
angle: access-control-theory-and-lab-mindset
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "idor", "privilege-escalation", "authz", "misconfiguration"]
difficulty: medium
shortDescription: "Teoretyczno-praktyczne omówienie kontroli dostępu i eskalacji uprawnień w kontekście PortSwigger Academy, skupione na różnicy między uwierzytelnianiem, sesją i autoryzacją, najczęstszych błędach enforcementu, mechanice IDOR oraz sposobie myślenia potrzebnym do rozwiązywania labów access control."
updatedAt: "2026-02-16"
---

Access control (kontrola dostępu) to zestaw mechanizmów, które decydują **kto** może dostać się do **jakich zasobów** i wykonać **jakie akcje** - oraz (w dojrzałych systemach) pozwalają to sensownie rozliczyć/audytować.

W praktyce warto myśleć o tym jak o AAA:

- **Authentication**: potwierdzenie tożsamości (kim jesteś).
- **Authorization**: egzekwowanie uprawnień (co wolno tej tożsamości zrobić / zobaczyć).
- **Accountability / Accounting**: ślad działań (kto/co/kiedy zrobił; logi/audyt).

Kontrola dostępu jest częstym źródłem incydentów webowych, ale skutki są różne - od drobnych wycieków po krytyczne eskalacje. Zależy to od tego, **jakie dane/akcje** stoją za danym endpointem.

Najczęstsze konsekwencje (gdy błąd dotyczy wrażliwych funkcji) to m.in.:

- podgląd cudzych danych,
- wykonywanie akcji na cudzych zasobach,
- operacje o wyższych uprawnieniach (np. admin),
- zmiany ról / uprawnień,
- kasowanie zasobów.

---

## Jak to się składa: authentication vs session vs authorization

- **Authentication**: kim jesteś (logowanie).
- **Session management**: czy to nadal Ty (cookie/token, ciągłość żądań, wygasanie).
- **Authorization (access control)**: co wolno tej tożsamości zrobić / zobaczyć.

Błędy access control nie zawsze wynikają z „ufania danym klienta” lub „ukrytego UI”.
Najczęściej w praktyce dzieją się przez:

- **brak egzekwowania** kontroli w jakimś miejscu (ktoś nie sprawdził roli/uprawnień),
- albo **błąd w implementacji** mechanizmu autoryzacji (zły warunek, niespójne reguły, inna interpretacja zasobu).

---

## Trzy typy kontroli dostępu, które spotkasz w realu

### 1) Vertical (rola → funkcje)

Różne role mają dostęp do różnych funkcji.
Przykłady: panel administracyjny, zarządzanie użytkownikami, zmiany ról.

**Typowy błąd:** endpoint działa dla „dowolnego zalogowanego”, bo jest sprawdzenie sesji,
ale **brakuje sprawdzenia roli/uprawnienia** (albo jest niespójne).

---

### 2) Horizontal (użytkownik → jego zasoby)

Każdy użytkownik ma dostęp do “swojej” części zasobów (konto, dokumenty, zamówienia).
Przykłady: `myaccount?id=...` `orders?user=...` pobieranie plików po ID.

**Typowy błąd (sztampowy wzorzec):** aplikacja pozwala odwołać się do obiektu na podstawie
identyfikatora przekazanego przez użytkownika i **nie weryfikuje relacji** (właściciel/tenant).

To często kończy się IDOR-em jako rezultatem.

---

### 3) Context-dependent (stan procesu → dostęp)

Dostęp zależy od tego, na jakim etapie procesu jesteś.
Przykłady: koszyk po płatności, zmiana danych po potwierdzeniu, workflow “krok 1 → krok 2 → confirm”.

**Typowy błąd:** kontrola jest na części kroków, ale jeden krok da się wywołać “na skróty”
(albo warunek stanu nie jest egzekwowany po stronie serwera).

---

## Najczęstsze błędy implementacyjne (i dlaczego są groźne)

### UI ≠ kontrola dostępu

To, że czegoś nie widać w menu, nie znaczy, że backend tego nie obsłuży.
**Ukrycie linka** to nie zabezpieczenie - to tylko UX.

> To w praktyce jest ten sam rdzeń problemu co „security by obscurity”: brak serwerowego enforcementu.

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

to problemem nie jest „sam parametr”, tylko fakt, że **serwer ufa danym klienta** w decyzji autoryzacyjnej.

---

## IDOR w praktyce (najczęstszy wzorzec wycieku danych)

**IDOR (Insecure Direct Object Reference)** = sytuacja, w której użytkownik może odwołać się do obiektu
po identyfikatorze dostarczonym przez siebie, a aplikacja nie egzekwuje poprawnie uprawnień do tego obiektu.

Najczęstsze formy:

- numeryczne ID (łatwe do zgadywania),
- GUIDy/UUID (trudniejsze do zgadywania, ale często **wyciekają w UI**: profile, posty, komentarze, linki).

**Podstępny wariant (edge-case):** odpowiedź robi redirect, ale **w treści odpowiedzi nadal są dane**.
To często wynika z błędu implementacyjnego (np. brak przerwania wykonania kodu po przekierowaniu),
a skutkiem końcowym może być wyciek „jak przy IDOR”.

---

## Warstwy po drodze: reverse proxy / gateway / backend

W realnych systemach często masz więcej niż jedną warstwę po drodze (np. reverse proxy, gateway, aplikacja).
Nie każda z nich robi autoryzację - często to warstwa routingu / dostępu / ochrony, a nie AAA.

Ryzyko rośnie, gdy:

- różne warstwy **inaczej interpretują** żądanie (routing/normalizacja),
- a mechanizm egzekwowania dostępu jest niespójny albo oparty o różne “źródła prawdy”.

Objawy (przykładowe, zależne od stacku):

- jedna ścieżka blokowana, a “prawie ta sama” przechodzi,
- system toleruje inne metody HTTP,
- routing dopasowuje ścieżkę inaczej (slash na końcu, wielkość liter, rozszerzenia).

> To nie jest „broken auth sam w sobie”, tylko klasa problemów wynikająca z niespójnej architektury i egzekwowania reguł.

---

## X-Original-URL i X-Rewrite-URL - co to jest i czemu to ma znaczenie

### Czym są te nagłówki

`X-Original-URL` `X-Rewrite-URL` to **niestandardowe nagłówki HTTP**, które w niektórych architekturach
służą do przekazywania “oryginalnej” lub “przepisanej” ścieżki żądania między warstwami.

### Dlaczego są ważne

Problem pojawia się wtedy, gdy którakolwiek warstwa zaczyna podejmować decyzje o dostępie/routingu
na podstawie tych nagłówków, a klient może je dostarczyć albo nadpisać.

W skrócie: **nie powinno się budować autoryzacji o takie nagłówki**.
Jeżeli są używane, to powinny być kontrolowane wyłącznie przez zaufane komponenty (edge/proxy),
a nie przez użytkownika.

### Co można nimi “namieszać” (realistyczne scenariusze)

1. **Ominięcie kontroli dostępu opartej o URL**
   - Jedna warstwa filtruje po request line, a backend kieruje logikę po nagłówku.
   - Efekt: niespójność źródła prawdy może umożliwić dotarcie do chronionych funkcji.

2. **Dotarcie do endpointów “wewnętrznych”**
   - Z zewnątrz widać tylko część tras, reszta jest routowana wewnętrznie.
   - Jeżeli nagłówek wpływa na routing, można niechcący wystawić endpointy.

3. **Bypass reguł filtrowania/logowania**
   - Jedna warstwa loguje/filtruje po request line,
   - druga wykonuje akcję po nagłówku,
   - przez co korelacja w logach bywa trudniejsza.

### Najważniejszy wniosek

Ryzyko jest architektoniczne: psuje się wtedy, gdy:

- różne warstwy podejmują decyzje na podstawie różnych źródeł prawdy,
- a przynajmniej jedna z nich dopuszcza wpływ klienta na te „wewnętrzne” metadane.

---

## Jak temu zapobiegać (bez lania wody)

- **Centralny mechanizm uwierzytelniania i autoryzacji** (spójne miejsce decyzji i egzekwowania).
- **Nie ufaj danym kontrolowanym przez klienta** (cookie/param/JS) do podejmowania decyzji o roli/uprawnieniach.
- **Weryfikuj relację użytkownik → obiekt** (własność/tenant), nie tylko „czy user jest zalogowany”.
- **Spójne reguły routingu/normalizacji** między warstwami (żeby nie było rozjazdów interpretacji).
- **Testy regresyjne autoryzacji**: role, zasoby, metody, edge-case’y w ścieżkach i stanach procesu.

> „Deny by default” jest sensowne szczególnie dla danych i operacji wrażliwych, ale w praktyce zależy od krytyczności systemu i kontekstu (fail-closed vs fail-open).

---

## TL;DR (save-worthy)

- Kontrola dostępu to szerszy temat niż samo „czy możesz wykonać akcję” - myśl o AAA.
- Najczęstszy realny błąd: **brak / niespójny enforcement** (ktoś nie sprawdził roli/uprawnień albo zrobił to źle).
- „Ukryty link” i „dziwny URL” to nie zabezpieczenia - to sygnały, że serwer może nie egzekwować reguł.
- IDOR to często **rezultat** braku weryfikacji relacji użytkownik → obiekt.
- Nagłówki `X-Original-URL` / `X-Rewrite-URL` są problemem, gdy architektura pozwala im wpływać na routing/autoryzację
  albo gdy różne warstwy mają różne źródła prawdy.
