---
id: phishing-email-analysis-tools-and-workflow
title: "Phishing Email Analysis - Tools & Workflow"
team: blue
domain: soc-defensive-security
section: email-security
topic: phishing-analysis-workflow
type: playbook
angle: soc-triage
sourceTrack: general
tags: ["soc", "soc-l1", "osint", "ioc", "triage", "urlscan", "cyberchef", "defanging"]
difficulty: easy
shortDescription: "Roboczy przewodnik po analizie phishingowych wiadomości e-mail, łączący konkretne narzędzia z praktycznym workflow pracy nad nagłówkami, linkami i załącznikami tak, aby z podejrzanej wiadomości szybko wyciągać IOC-i, kontekst techniczny i materiał przydatny dla całego zespołu."
updatedAt: "2026-02-23"
---

# Phishing Email Analysis - Tools & Workflow

## Po co trzymam tę notatkę

Ta notatka jest praktycznym uzupełnieniem dwóch poprzednich materiałów:

- **Email Threat Analysis Fundamentals** (fundament techniczny: header/body, raw source, nagłówki, artefakty)
- **Phishing Email Analysis Guidelines** (mindset, triage, red flagi, decyzja pod presją)

Tutaj skupiam się na trzeciej rzeczy:

**jakich narzędzi używać i jaki workflow przejść, kiedy trzeba realnie przeanalizować podejrzany mail.**

To nie jest lista „100 narzędzi do wszystkiego”.
To jest robocza mapa:

- co zbieram,
- czym to sprawdzam,
- czego nie robię pochopnie,
- jak przejść od maila do użytecznych IOC / materiału dla zespołu.

---

## Najważniejsza zasada operacyjna (zanim cokolwiek ruszę)

Pracuję na **prawdziwych próbkach**, więc traktuję wszystko jako potencjalnie złośliwe:

- domeny,
- linki,
- IP,
- załączniki,
- treść HTML,
- pliki archiwów.

### Mój default:

- **nie klikam linków**
- **nie otwieram załączników**
- **nie wchodzę bezpośrednio na domenę z maila**
- najpierw zbieram dane i używam narzędzi pośrednich / sandboxów / reputacji

Ta zasada brzmi banalnie, ale to jest dokładnie ten moment, w którym najłatwiej o błąd „tylko sprawdzę szybko”.

---

## Co chcę osiągnąć jako analityk (cel analizy)

Kiedy dostaję podejrzany mail, moim celem nie jest tylko powiedzieć:

> to wygląda jak phishing

To za mało.

Mój cel to:

1. **ocenić ryzyko**
2. **wyciągnąć artefakty (IOC)**
3. **zebrać kontekst techniczny**
4. **przekazać wynik tak, żeby zespół mógł działać** (blokady, detekcje, ostrzeżenia)

Czyli:
**nie tylko ocena, ale materiał operacyjny.**

---

# Co zbieram z maila (checklista analityka)

## 1) Z nagłówków email (header)

To jest minimum, które chcę zebrać:

- **sender email address** (adres nadawcy)
- **sender IP address** (jeśli da się ustalić z nagłówków)
- **reverse lookup / reverse DNS** dla IP nadawcy
- **subject**
- **recipient address** (czasem istotne info siedzi w `CC` / `BCC`)
- **Reply-To** (jeśli występuje)
- **date/time**

### Dlaczego to ważne

Bo część z tych informacji:

- widać w kliencie poczty,
- ale część wyciągnę dopiero z **raw/source**.

I właśnie tam często wychodzą niespójności, których nie widać w UI.

---

## 2) Z treści maila i załączników (body + attachments)

To jest drugi zestaw rzeczy, które zbieram:

- **wszystkie URL-e**
- jeśli użyto skracacza URL → **realny / rozwinięty URL**
- **nazwa załącznika**
- **hash załącznika** (najlepiej **SHA256**, ewentualnie MD5 jako pomocniczy)

### Ważne

Przy linkach i załącznikach łatwo zrobić błąd operacyjny.

Dlatego:

- linki kopiuję / wyciągam bez klikania
- załączniki zapisuję ostrożnie i analizuję dalej zgodnie z procedurą
- nie „odpalam, żeby zobaczyć co to”

---

# Gdzie co znajdę (UI klienta vs raw/source)

Niektóre dane da się zebrać „na oko” z klienta poczty / webmaila:

- `From`
- `Subject`
- `Date`
- część odbiorców
- treść / CTA / widoczne linki
- informacja o załączniku

Ale część rzeczy zwykle wymaga **raw/source**:

- ścieżka przejścia maila (`Received`)
- możliwy adres źródłowy IP
- `Reply-To`
- `Return-Path`
- techniczne informacje o treści i załącznikach

### Wniosek praktyczny

UI klienta = szybki triage  
Raw/source = realna analiza techniczna

(Techniczne podstawy i znaczenie nagłówków mam opisane w **Email Threat Analysis Fundamentals**.)

---

# Narzędzia do analizy nagłówków email (header analysis)

To są narzędzia, które pomagają szybciej czytać nagłówki i zobaczyć rzeczy, które w surowym tekście łatwo przeoczyć.

## 1) Google Admin Toolbox - Messageheader

**Zastosowanie:**

- analiza nagłówków SMTP
- pomoc w zrozumieniu trasy wiadomości
- wykrywanie problemów routingu / serwerów

**Jak używam:**

- kopiuję cały header z raw/source
- wklejam do narzędzia
- sprawdzam trasę, przeskoki, adresy, niespójności

**Plus:**
szybki punkt startowy i czytelna prezentacja.

---

## 2) Message Header Analyzer

Alternatywa / drugie źródło do analizy nagłówków.

### Dlaczego warto mieć więcej niż jedno narzędzie

Bo różne narzędzia:

- pokazują dane w inny sposób,
- czasem lepiej uwidaczniają konkretne pola,
- czasem wyciągają coś, co w innym narzędziu ginie.

---

## 3) mailheader.org

Kolejne pomocnicze narzędzie do header analysis.

### Mój wniosek

Nie przywiązuję się do jednego toola.
Ważniejsze jest:

- co potrafię zinterpretować,
- niż to, czy użyłem „najmodniejszego” narzędzia.

---

## Mała notka kontekstowa: MTA / MUA (warto kojarzyć)

Nie muszę robić z tego akademickiej definicji, ale warto wiedzieć:

- **MTA (Message Transfer Agent)** → odpowiada za transfer maili między serwerami
- **MUA (Mail User Agent)** → klient poczty używany przez użytkownika

### Po co mi ta wiedza

Bo pomaga lepiej rozumieć:

- skąd biorą się ślady w nagłówkach,
- co jest transportem,
- a co warstwą klienta użytkownika.

---

# Narzędzia do analizy IP i kontekstu nadawcy

Po zidentyfikowaniu adresu IP (jeśli jest dostępny / sensowny), chcę szybko sprawdzić kontekst.

## 1) IPinfo

**Po co używam:**

- podstawowy kontekst IP
- operator / ASN
- geolokalizacja (orientacyjnie)
- szybki pivot do dalszej oceny

### Uwaga praktyczna

Geolokalizacja to wskazówka, nie wyrok.
To ma pomóc w budowie obrazu, nie zastąpić analizy całości.

---

## 2) Talos Reputation Center

**Po co używam:**

- szybki lookup reputacji IP / domeny
- dodatkowy sygnał, czy coś ma już znany zły kontekst

To przydaje się szczególnie, gdy trzeba szybko odsiać ewidentne przypadki.

---

# Narzędzia do bezpieczniejszej oceny linków (bez klikania w ciemno)

To jest bardzo ważny etap, bo link bywa głównym payloadem.

## 1) urlscan.io

To jedno z najbardziej praktycznych narzędzi w tym workflow.

### Co daje

- automatyczne „odwiedzenie” URL-a przez usługę
- zapis aktywności strony
- domeny / IP kontaktowane po drodze
- zasoby ładowane przez stronę (JS/CSS itp.)
- screenshot strony
- dodatkowe artefakty i obserwacje

### Dlaczego to jest tak przydatne

Bo mogę zobaczyć:

- jak strona wygląda,
- czy udaje znaną markę,
- jakie domeny kontaktuje,
- **bez bezpośredniego wchodzenia na nią z własnego środowiska**

To bardzo praktyczny sposób, żeby ograniczyć ryzyko i nadal zdobyć kontekst.

---

## 2) Inne narzędzia tego typu (np. screenshot/render usług)

Warto kojarzyć, że istnieją też inne usługi pokazujące podgląd strony / rendering bez bezpośredniej interakcji.

### Wniosek

Nie chodzi o przywiązanie do konkretnej marki narzędzia.
Chodzi o workflow:
**najpierw bezpieczny podgląd i analiza kontekstu, potem decyzja co dalej.**

---

## 3) Reputacja URL / domeny głównej (root domain)

Po wyciągnięciu URL-a nie patrzę tylko na pełny link.

### Sprawdzam też:

- **root domain**
- reputację domeny
- czy są inne powiązane sygnały

To ważne, bo kampanie często używają:

- wielu ścieżek,
- redirectów,
- różnych URL-i na tej samej domenie.

---

# Jak wyciągam linki z maila (bez ręcznego błądzenia)

Linki można znaleźć ręcznie:

- z HTML maila,
- z raw/source,
- kopiując adres linku (bez klikania)

Ale przy dłuższych mailach / HTML wygodniej użyć narzędzia.

## 1) URL Extractor

Praktyczne narzędzie do wyciągania URL-i z wklejonej treści / source.

### Jak używam

- wklejam raw header / raw email content
- narzędzie wyciąga URL-e
- robię przegląd wyników i notuję root domains

To oszczędza czas i zmniejsza ryzyko, że coś pominę.

---

## 2) CyberChef (Extract URLs)

Bardzo dobry wybór, jeśli i tak pracuję już w CyberChefie.

### Dlaczego lubię

- szybkie recipe
- można łączyć z innymi transformacjami
- przydaje się przy większej ilości obróbki tekstu

---

## Tip, który warto pamiętać

Przy wyciąganiu linków notuję nie tylko „pełny URL”, ale też:

- **root domain**
- ewentualne skracacze
- powtarzające się wzorce ścieżek

To później pomaga w:

- reputacji,
- korelacji kampanii,
- tworzeniu detekcji / blokad.

---

# Załączniki - jak pracować bezpiecznie i sensownie

Jeśli mail ma załącznik, to bardzo często właśnie tam siedzi payload.

## Co robię najpierw

- zapisuję plik **bez otwierania**
- notuję nazwę pliku
- wyliczam hash (najlepiej SHA256)

### Przykład (Linux)

```bash
sha256sum suspicious_attachment.doc
```

Hash daje mi bardzo dużo, bo mogę:

- sprawdzić reputację pliku,
- wyszukać znany malware,
- pivotować po tym samym pliku w innych systemach / narzędziach.

---

# Reputacja pliku (hash lookup)

## 1) Talos File Reputation

Szybki lookup hashy plików.

### Po co używam

- sprawdzenie, czy plik jest już znany
- dodatkowy sygnał reputacyjny
- szybka walidacja bez uruchamiania pliku

---

## 2) VirusTotal

Jeden z podstawowych punktów odniesienia przy plikach i URL-ach.

### Po co używam

- sprawdzenie hashy
- reputacja / detections
- dodatkowy kontekst o pliku / URL
- szybki przegląd sygnałów z wielu vendorów

### Ważna uwaga praktyczna

Brak detekcji ≠ plik bezpieczny.
To tylko jeden element oceny.

---

## 3) ReversingLabs (warto kojarzyć)

Kolejna usługa reputacyjna / analityczna, którą warto mieć z tyłu głowy.

---

# Malware sandboxes - kiedy chcę zrozumieć „co ten plik robi”

Nie muszę być reverse engineerem, żeby zyskać bardzo dużo informacji o złośliwym załączniku.

Do tego właśnie są sandboxy.

## Co mogę zyskać z sandboxa

Przykładowo:

- z jakimi URL-ami / domenami plik się komunikuje
- czy pobiera kolejne payloady
- jakie robi akcje w systemie
- mechanizmy persistence
- IOC do dalszej detekcji
- ogólny obraz zachowania próbki

To ogromna wartość operacyjna, nawet bez głębokiej inżynierii wstecznej.

---

## Przykładowe sandboxy warte kojarzenia

## 1) Any.Run

Bardzo praktyczny do analizy dynamicznej i obserwacji zachowania.

### Co jest mocne

- interakcja z analizą
- szybki podgląd aktywności
- czytelne artefakty i zachowanie próbki

---

## 2) Hybrid Analysis

Dobre community narzędzie do analizy nieznanych / podejrzanych plików.

---

## 3) Joe Sandbox

Mocna platforma z szerokim zakresem funkcji analitycznych.

---

## Ważna uwaga operacyjna (o uploadach)

Zanim wrzucę plik do zewnętrznej usługi, pamiętam o polityce organizacji.

Bo nie każdy plik można legalnie / proceduralnie wysłać poza firmę.

---

# PhishTool - narzędzie, które spina dużo rzeczy w jedno miejsce

To jest bardzo ciekawy tool, bo pomaga nie tylko „podejrzeć maila”, ale zrobić bardziej złożoną analizę phishingową w jednym workflow.

## Co daje (w praktyce)

Łączy w jednym miejscu m.in.:

- metadata emaila
- OSINT / kontekst
- auto-analysis pathways
- artefakty phishingowe
- integrację z narzędziami (np. VirusTotal)
- workflow z flagowaniem i zamknięciem case'a

### Dla kogo to ma sens

- SOC analyst
- threat intel
- phishing response
- email-borne fraud investigations

Czyli dokładnie tam, gdzie trzeba działać szybko i powtarzalnie.

---

## Co potrafi wyciągnąć wygodnie

Na podstawie opisu / przykładowego workflow:

- sender
- recipient(s) / listy CC
- timestamp
- originating IP + reverse DNS
- SMTP hops / relays
- wybrane X-headers
- treść maila (tekst / HTML)
- URL-e
- załączniki + nazwy plików + hashe

To jest bardzo wygodne, bo redukuje ręczne skakanie po kilku narzędziach na starcie analizy.

---

## Dodatkowa wartość

Jeśli mam integrację z VirusTotal (API key), mogę szybciej dostać feedback reputacyjny dla załączników / artefaktów.

Plus:

- flagowanie artefaktów jako malicious
- notatki
- zamknięcie / klasyfikacja case’a (jak w SOC workflow)

To już jest bardziej „operacyjne” niż zwykłe ręczne rozbieranie maila.

---

## Ważny insight z praktyki

Nawet jeśli narzędzie daje dużo automatyki, to analityk nadal musi myśleć.

To, że narzędzie:

- pokazało hash,
- wyciągnęło URL,
- dodało reputację,

nie znaczy jeszcze, że analiza jest kompletna.

Często nadal trzeba zrobić:

- ocenę root domain
- szerszy kontekst IP / domeny
- analizę załącznika w sandboxie
- decyzję o klasyfikacji kampanii / case’a

---

# Mój praktyczny workflow (tools + decyzje)

To nie jest sztywny SOP. To roboczy flow, który daje sensowny porządek.

## 1. Zabezpiecz analizę (operational safety first)

- nie klikam
- nie otwieram załączników
- pracuję na kopii / source
- defanguję artefakty przy przekazywaniu dalej

---

## 2. Zbierz dane bazowe z UI + raw/source

Zbieram:

- sender
- subject
- recipient(s)
- date/time
- reply-to (jeśli jest)
- sender IP / ślady w headerach
- treść / CTA
- info o załącznikach

---

## 3. Przerzuć header do narzędzi analitycznych

Używam np.:

- Messageheader (Google)
- Message Header Analyzer
- mailheader.org

Cel:

- szybciej zobaczyć trasę,
- wyłapać niespójności,
- uporządkować nagłówki.

---

## 4. Wyciągnij linki i oceń root domains

- ręcznie + URL Extractor / CyberChef
- notuję pełne URL-e i root domains
- sprawdzam reputację / kontekst
- używam bezpiecznych narzędzi typu urlscan zamiast wchodzić bezpośrednio

---

## 5. Obsłuż załączniki bezpiecznie

- zapis pliku bez otwierania
- nazwa pliku
- hash SHA256
- reputacja (VT / Talos itp.)
- jeśli trzeba: sandbox analysis (zgodnie z polityką)

---

## 6. Zbuduj wynik analizy pod działania zespołu

Finalnie zapisuję nie tylko „malicious / suspicious / benign”, ale też:

- **dlaczego**
- **jakie IOC**
- **jakie artefakty warto zablokować / monitorować**
- **czy wygląda na kampanię**
- **co jeszcze wymaga dalszej analizy**

To jest moment, w którym moja analiza zaczyna realnie pomagać innym.

---

# Scenariusz SOC L1 - jak myślę o tym zadaniu

Bardzo realistyczny case:

> Kilku współpracowników forwarduje podejrzane maile.
> Twoim zadaniem jako analityka L1 jest zebrać detale tak, żeby zespół mógł wdrożyć reguły i ograniczyć kolejne wiadomości.

To jest dobry reminder, że rola L1 to nie tylko „eskalować wszystko”.

To także:

- szybki triage,
- porządne zebranie artefaktów,
- sensowny opis,
- przygotowanie materiału pod dalszą obronę.

I właśnie dlatego ten workflow (header → linki → załączniki → reputacja → sandbox → IOC) jest taki ważny.

---

# Co warto zapamiętać po tym materiale

- Sama analiza „na oko” to za mało - potrzebuję narzędzi i procesu.
- Nie każde narzędzie pokaże to samo; warto mieć kilka opcji.
- Linki analizuję bezpiecznie (bez bezpośredniego klikania).
- Root domain ma znaczenie, nie tylko pełny URL.
- Załącznik traktuję jak potencjalny payload i zaczynam od hashy / reputacji.
- Sandboxy dają ogromną wartość nawet bez skillsów malware reverse engineering.
- Automatyzacja (np. PhishTool) pomaga, ale nie zastępuje myślenia analityka.
- Celem nie jest tylko wykryć phishing - celem jest **wyciągnąć użyteczne artefakty i wesprzeć obronę**.

---

# Narzędzia warte kojarzenia (shout-out / dodatkowe źródła)

Poza narzędziami z tej notatki warto kojarzyć też:

- MXToolbox
- PhishTank
- Spamhaus
- `eml_analyzer` (GitHub)

Nie muszę używać wszystkiego naraz.
Ważniejsze jest zbudowanie własnego, powtarzalnego workflow, który daje sensowne wyniki.

---

## Mój skrót mentalny do tej notatki

**Mail → Header → Linki → Załącznik → Reputacja → Sandbox → IOC → Wniosek**

I cały czas pamiętam o jednej rzeczy:

**najpierw bezpieczna analiza, potem interakcja (jeśli w ogóle).**
