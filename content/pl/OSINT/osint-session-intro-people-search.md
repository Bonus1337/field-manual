---
id: osint-session-intro-people-search
title: "wprowadzenie i poszukiwanie osób"
team: red-blue
category: osint
tags: ["osint", "namint", "socmint", "opsec", "browser", "email", "phone", "image"]
difficulty: easy
updatedAt: "2026-02-25"
---

# OSINT - sesja 1: wprowadzenie i poszukiwanie osób (moje notatki + przemyślenia)

## Kontekst tej sesji (co mi „kliknęło”)

Sesja zaczęła się od mocnego case’u (realne śledztwo). I to dobrze ustawia mindset:

**OSINT to nie „klikanko po narzędziach”.**  
To jest proces, w którym:

- masz **pytanie / cel**,
- zbierasz dane,
- odszumiasz,
- łączysz kropki,
- i na końcu umiesz powiedzieć: **co wiem na pewno, co jest hipotezą i czego nie jestem w stanie potwierdzić**.

To brzmi banalnie, ale w praktyce łatwo odpłynąć w „o, fajne narzędzie, sprawdzę jeszcze to” i stracić godzinę bez wyniku.

---

> **Uwaga (ważne):** Ta notatka ma charakter **edukacyjny** i służy zrozumieniu procesu OSINT oraz higieny pracy analitycznej.  
> Nie jest to instrukcja prowadzenia działań wobec realnych osób/organizacji bez podstawy prawnej.  
> W praktyce wiele technik OSINT (zwłaszcza w trybie aktywnym: kontakt, socjotechnika, obchodzenie zabezpieczeń, próby logowania, „testowanie” usług) może naruszać **prawo**, **regulaminy serwisów** i czyjąś **prywatność**, a w niektórych scenariuszach zostać potraktowane jako czyn zabroniony.  
> **Stosuj wyłącznie w środowiskach legalnych** (CTF/laby, własne zasoby, audyt z pisemną zgodą / zleceniem) i zawsze dokumentuj zakres oraz uprawnienia.

## 1) Co to jest OSINT - definicja po ludzku

**OSINT = wyciąganie informacji z otwartych źródeł** (legalnie dostępnych; czasem płatnych).  
Kluczowe jest to słowo “intelligence”: chodzi o **odpowiedź na potrzebę informacyjną**, a nie „zrzut linków”.

### Dwa zastosowania

- **Ofensywnie:** recon pod wektor ataku / rozpoznanie celu (CTF/pentest mindset).
- **Defensywnie:** ogarnianie wycieków i ekspozycji (DLP, reputacja, incydenty).

### Pasywnie vs aktywnie (to mi porządkuje ryzyko)

- **Pasywnie:** nie dotykam celu, nie wchodzę w interakcję (szukanie, archiwa, indeksy).
- **Aktywnie:** robię coś, co może zostawić ślad (formularze, logowania, socjotechnika, skanowanie).  
  Wniosek: **aktywnie = większa odpowiedzialność + większy OPSEC + jasne ramy legalne**.

---

## 2) Cykl OSINT

Ja to sobie zapisuję jako 5 kroków, bo wtedy łatwo pilnować, gdzie jestem:

1. **Przygotowanie**  
   cel + co chcę znaleźć + OPSEC
2. **Zbieranie**  
   dużo, szybko, szeroko
3. **Przetwarzanie (odszumianie)**  
   deduplikacja, porządek, co jest wartościowe
4. **Analiza**  
   łączenie faktów, unikanie pułapek myślowych
5. **Publikacja**  
   krótkie podsumowanie + dowody + wnioski

I jeszcze rzecz, której zwykle się nie mówi na głos, a jest kluczowa:

**6. Cleanup** - czyszczenie środowiska (żeby nie zostawiać syfu i śladów u siebie).

---

## 3) OPSEC przed wejściem w teren

Tu mam proste podejście: **jeśli nie ogarnę OPSEC, to OSINT robię na kredyt**.

### Izolacja środowiska (minimum)

- VM: VirtualBox / VMware
- systemy do takich rzeczy: Kali Linux, TraceLabs OSINT VM, Ubuntu Tsurugi
- opcje „hard” pod izolację: Tails / Whonix (gdy potrzebujesz mocniejszej separacji)

### Dysk i dane (bo notatki same w sobie są wrażliwe)

- BitLocker / VeraCrypt / FileVault 2

### Sieć (bo to jest Twój odcisk palca)

- DNS: 1.1.1.1 (Cloudflare), 8.8.8.8 (Google) + **DNS over HTTPS** w przeglądarce
- VPN: np. Mullvad (albo inne sensowne rozwiązanie)
- i w tle: świadomość „5/9/14 eyes” (czyli kto z kim współpracuje wywiadowczo)

### Przeglądarka (żeby nie strzelać sobie w stopę)

- uBlock Origin
- Privacy Badger
- Location Guard
- Multi-Account Containers (oddzielanie kontekstów / kont)

### Hasła i logowanie

- KeePass / Bitwarden / 1Password
- 2FA: klucz sprzętowy (Yubico)

**Mój wniosek po sesji:** OPSEC robi się zanim zaczniesz, bo potem już tylko łatasz szkody.

---

## 4) „Zbiory narzędzi” i jak nie utopić się w toolach

To co mi się spodobało w tej sesji: narzędzi jest milion, ale sens ma podejście:

**najpierw metoda, potem narzędzie.**

Ja to sobie układam tak:

- mam typ danych (email/nick/telefon/foto),
- wybieram 2-3 narzędzia startowe,
- dopiero potem eskaluję, jeśli utknę.

### Szybka mapa „gdzie szukać narzędzia”

- gotowe listy / katalogi OSINT (zwykle oszczędzają masę czasu)
- społeczność OSINT (GitHub, checklisty, blogi)
- i dopiero na końcu „random googlowanie”

---

## 5) Poszukiwanie osób - praktyczny playbook

### A) Szukanie po pseudonimie (NAMINT)

**Cel:** znaleźć gdzie dana nazwa użytkownika występuje i czy da się ją skorelować.

Narzędzia do klikania:

- whatsmyname.app
- usersearch.org

Moje zasady:

- sprawdzam warianty (kropki, podkreślenia, liczby, stare nicki)
- szukam „kotwic”: ten sam avatar, bio, link w profilu, styl pisania

---

### B) Szukanie po adresie e-mail

**Cel:** potwierdzić ekspozycję + znaleźć ślady użycia maila.

Narzędzia do klikania:

- Epieos
- GHunt
- Hunter.io
- HaveIBeenPwned
- Dehashed

Mój mindset:

- e-mail to często **klucz do powiązań**, ale też masa false positive
- jeśli coś wygląda jak dopasowanie, to i tak staram się potwierdzić drugim źródłem

---

### C) Szukanie po numerze telefonu

**Cel:** znaleźć miejsca, gdzie numer wypłynął (ogłoszenia, profile, stopki, rejestry).

Moje zasady:

- normalizuję format (z prefiksem kraju i bez, ze spacjami/bez)
- szukam fragmentami (część numeru) i pełnym numerem

---

### D) Szukanie po danych osobowych

**Cel:** zbudować „szkielet tożsamości”: gdzie pracuje, czym się zajmuje, jakie ma powiązania.

Miejsca do klikania:

- LinkedIn (SOCMINT)
- bazy naukowe: Google Scholar, Nauka Polska, RAD-ON
- rejestry PL: KRS-online, CEIDG

Moje zasady:

- zaczynam od najstabilniejszych faktów (firma/uczelnia/miasto)
- uważam na „popularne imię + popularne nazwisko” (to klasyczna pułapka)

---

### E) Szukanie po fotografii (reverse + metadane)

**Cel:** znaleźć źródło zdjęcia / powiązane profile / czasem kontekst miejsca.

Narzędzia do klikania:

- TinEye
- Google Images
- PimEyes (rozpoznawanie twarzy - temat wrażliwy; używać świadomie i zgodnie z zasadami)
- ExifTool (metadane)
- FotoForensics
- InVID

Moje zasady:

- zanim odpalę “magiczne narzędzie”, patrzę na tło: znaki, detale, kontekst
- metadane są super, ale **często są wycięte** przez social media

---

## 6) Google Dorks - bo czasem to wygrywa szybciej niż narzędzie

To jest ten moment, gdzie zwykłe „szukaj” zamienia się w „szukaj precyzyjnie”.

Operatory, które chcę mieć w głowie:

- `site:`
- `filetype:` / `ext:`
- `intitle:`
- `inurl:`

Przykłady:

- `site:example.com filetype:pdf`
- `site:example.com intitle:"index of"`
- `site:example.com inurl:login`

---

## 7) Archiwizacja (największa różnica między „oglądałem” a „pracowałem”)

**Wszystko archiwizuję na bieżąco**, bo:

- wyniki znikają,
- strony się zmieniają,
- jutro już nie pamiętasz, dlaczego to było ważne.

Narzędzie/źródło do cofania stron:

- Wayback Machine (web.archive.org)

Mój minimalny standard notatki przy znalezisku:

- link
- data
- 1 zdanie „co tu jest”
- 1 zdanie „dlaczego to ma znaczenie”

---

## 8) Pułapki (czyli dlaczego OSINT potrafi oszukać)

Największa mina: **zakochać się w pierwszym tropie**.

Dlatego zapisuję sobie:

- co jest faktem,
- co jest hipotezą,
- co jest “brzmi podobnie, ale nie mam dowodu”.

## 9) Lista narzędzi z sesji

**VM / systemy:**

- Kali Linux
- TraceLabs OSINT VM
- Ubuntu Tsurugi
- VirtualBox / VMware
- Tails / Whonix

**Windows privacy / telemetria:**

- O&O ShutUp10++
- Diagnostic Data Viewer

**Sieć / prywatność:**

- Mullvad
- proxychains

**Przeglądarka dodatki:**

- uBlock Origin
- Privacy Badger
- Location Guard
- Multi-Account Containers

**Password / 2FA:**

- KeePass / Bitwarden / 1Password
- Yubico (klucze 2FA)

**People search (nick/email/leaks):**

- whatsmyname.app
- usersearch.org
- Epieos
- GHunt
- Hunter.io
- HaveIBeenPwned
- Dehashed

**Obrazy / metadane / wideo:**

- ExifTool
- TinEye
- Google Images
- PimEyes
- FotoForensics
- InVID

**Archiwa:**

- Wayback Machine

---

## 10) Moja prosta checklista

1. Zapisz cel w 1 zdaniu
2. Zapisz, jakie masz punkty zaczepienia (mail/nick/telefon/foto)
3. Ustal pasywnie vs aktywnie (i czy wolno)
4. Wybierz 2-3 narzędzia startowe
5. Archiwizuj każdy trop od razu
6. Na końcu: 5 zdań podsumowania + co jest pewne/niepewne
