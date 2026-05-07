---
id: ps-writeup-ac-unprotected-admin
title: "PortSwigger Access Control - publicznie dostępny panel admina z robots.txt"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: unprotected-admin-functionality
sourceTrack: portswigger-web-security-academy
tags: ["portswigger", "access-control", "admin-panel", "robots.txt", "misconfiguration"]
difficulty: apprentice
shortDescription: "Prosty write-up z labu PortSwigger pokazujący błąd kontroli dostępu, w którym ścieżka do panelu administracyjnego jest ujawniona w robots.txt, a brak serwerowej autoryzacji pozwala wejść do funkcji administracyjnych i wykonać uprzywilejowaną akcję bez roli administratora."
updatedAt: "2026-02-16"
---

# Lab Write-up: Unprotected admin functionality

## Cel

Usuń użytkownika **carlos**.

## Co ja tu realnie testuję (mindset)

Jeśli aplikacja ma jakiś “panel admina”, to nie zakładam, że jest chroniony tylko dlatego, że istnieje.
Sprawdzam **dwie rzeczy**:

1. **Czy da się odkryć endpoint admina bez bycia adminem?**
2. **Jeśli do niego dojdę - czy jest realna autoryzacja po stronie serwera, czy tylko “security by UI”?**

Ten lab to czysty przykład bardzo częstego failure mode: _funkcje administracyjne istnieją i działają, ale nikt nie wymusił kontroli dostępu._

---

## Recon & discovery

### Krok 1 - Szukam “nieludzkich” podpowiedzi

Zanim zacznę brute-force ścieżek, sprawdzam pliki, które często zdradzają strukturę aplikacji:

- `robots.txt`
- `sitemap.xml`
- typowe domyślne ścieżki frameworków (`/admin`, `/administrator`, `/manage`, itd.)

Request:

```http
GET /robots.txt HTTP/1.1
Host: <lab-host>
```

Obserwacja:

- `robots.txt` zawiera wpis **Disallow**, który ujawnia ścieżkę do panelu admina.

**Dlaczego to ma znaczenie (real-world):**
`robots.txt` nie jest “zabezpieczeniem”. To bardziej tabliczka z napisem:

> “Nie chcemy, żeby boty to indeksowały.”
> Atakujący czyta to jako:
> “Dzięki za mapę.”

🖼️ Evidence:
![robots-disallow](/field-manual/assets/portswigger/access-control/unprotected-admin/01-robots.png)

---

## Walidacja (czy serio mam dostęp?)

### Krok 2 - Otwieram ujawniony endpoint admina

Request:

```http
GET /administrator-panel HTTP/1.1
Host: <lab-host>
```

Czego się spodziewałem:

- przekierowanie do logowania (`302`)
- `403 Forbidden`
- rola/permission check po stronie serwera

Co się stało:

- Panel admina ładuje się dla niezalogowanego / zwykłego użytkownika.

To jest kluczowy finding:

> **Funkcjonalność admina jest wystawiona i dostępna bez autoryzacji.**

🖼️ Evidence:
![admin-panel-open](/field-manual/assets/portswigger/access-control/unprotected-admin/02-admin.png)

---

## Exploit (akcja)

### Krok 3 - Wykonuję akcję administracyjną (usunięcie użytkownika)

Z poziomu panelu admina użyłem funkcji “delete” dla użytkownika `carlos`.

Co czyni to podatnością:

- Tu nie chodzi o samo _znalezienie_ UI admina.
- Chodzi o to, że aplikacja przyjmuje akcje uprzywilejowane **bez sprawdzania kim jestem**.

---

## Impact

Gdyby to istniało w realnej aplikacji:

- przejęcia kont / usuwanie użytkowników / zmiana uprawnień
- pełna kontrola administracyjna (zależnie od dostępnych funkcji)
- utrata danych i wpływ operacyjny (Availability + Integrity)

---

## Fix (co powinno było istnieć)

1. **Autoryzacja po stronie serwera** na każdym endpointcie admina (nie tylko ukrywanie linków w UI).
2. Spójny mechanizm kontroli dostępu (middleware / guard) dla całej strefy admin.
3. Podejście deny-by-default dla tras administracyjnych.
4. Nie polegać na `robots.txt` (traktować jako publiczne).

---

## Lessons learned (portable checklist)

- Zawsze sprawdzaj `robots.txt` i `sitemap.xml` na starcie.
- Samo znalezienie trasy admina nie jest bugiem - **brak autoryzacji jest**.
- Ograniczenia w UI ≠ bezpieczeństwo. Liczą się tylko checki po stronie serwera.
