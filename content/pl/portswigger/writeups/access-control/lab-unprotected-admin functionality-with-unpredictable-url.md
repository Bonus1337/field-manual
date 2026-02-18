---
id: ps-writeup-ac-unprotected-admin-unpredictable-url
title: "Unprotected admin functionality with unpredictable URL"
team: red
category: portswigger writeups
chapter: access-control
tags: ["portswigger", "access-control", "admin-panel", "source-code", "misconfiguration"]
difficulty: apprentice
updatedAt: "2026-02-17"
---

# Lab Write-up: Unprotected admin functionality with unpredictable URL

## Cel

Usuń użytkownika **carlos**.

## Co ja tu realnie testuję (mindset)

“Unpredictable URL” to nie kontrola dostępu - to najwyżej zasłona dymna.

Sprawdzam **dwie rzeczy**:

1. **Czy aplikacja gdzieś zdradza ścieżkę do admina?** (HTML/JS/asset-y)
2. **Jeśli już tam wejdę - czy serwer faktycznie weryfikuje uprawnienia, czy po prostu serwuje panel każdemu?**

Ten lab to typowy failure mode: _admin istnieje, ale autoryzacja nie istnieje - a “losowy URL” wycieka w kodzie frontu._

---

## Recon & discovery

### Krok 1 - Przeglądam źródło strony głównej (szukam wycieku ścieżki)

Zamiast zgadywać URL, robię to, co robi atakujący:

- DevTools → **View Source / Elements**
- albo Burp → Response dla `/`

Szukam słów-kluczy:

- `admin`
- `adminPanel`
- `panel`
- `path`
- `location`
- `href`

Obserwacja:

- W source (inline JS) znajduje się fragment, który **ujawnia URL panelu admina** (losowa ścieżka).

🖼️ Evidence:
![admin-path-leak](/field-manual/assets/portswigger/access-control/unprotected-admin-unpredictable-url/01-source-leak.png)

---

## Walidacja (czy serio mam dostęp?)

### Krok 2 - Otwieram ujawniony endpoint admina

Request:

```http
GET /admin-<unpredictable> HTTP/1.1
Host: <lab-host>
```

Czego się spodziewałem:

- `302` do logowania
- `403 Forbidden`
- check roli po stronie serwera

Co się stało:

- Panel admina ładuje się normalnie dla niezalogowanego / zwykłego użytkownika.

To jest kluczowy finding:

> **Funkcjonalność administracyjna jest dostępna bez autoryzacji - “losowy URL” nie ma znaczenia.**

🖼️ Evidence:
![admin-panel-open](/field-manual/assets/portswigger/access-control/unprotected-admin-unpredictable-url/02-admin-panel.png)

---

## Exploit (akcja)

### Krok 3 - Wykonuję akcję administracyjną (usunięcie użytkownika)

Z poziomu panelu admina użyłem funkcji “delete” dla użytkownika `carlos`.

Co czyni to podatnością:

- Nie chodzi o to, że URL jest “do znalezienia”.
- Chodzi o to, że serwer przyjmuje akcje admina **bez sprawdzenia uprawnień**.

---

## Impact

Gdyby to istniało w realnej aplikacji:

- usuwanie użytkowników / resetowanie haseł / zmiana ról
- przejęcie kontroli administracyjnej (zależnie od funkcji panelu)
- wpływ na **Integrity** i **Availability**, często też **Confidentiality**

---

## Fix (co powinno było istnieć)

1. **Autoryzacja po stronie serwera** na każdym endpointcie admina (middleware/guard).
2. Deny-by-default dla tras administracyjnych.
3. Nie ujawniać ścieżek uprzywilejowanych w publicznym HTML/JS (ale to tylko hardening - core to autoryzacja).
4. Monitoring i alerty na dostęp do strefy admin (szczególnie z kont nieuprzywilejowanych).

---

## Lessons learned (portable checklist)

- Jeśli coś jest “ukryte” → sprawdź **source/JS** zanim zaczniesz zgadywać.
- UI i “sekretny URL” ≠ bezpieczeństwo. Liczy się tylko **server-side authorization**.
- Znalezienie admina to etap discovery - bug zaczyna się wtedy, gdy **działa bez uprawnień**.
