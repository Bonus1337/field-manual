---
id: osint-maps-companies-automation
title: "OSINT: mapy, firmy, automatyzacja i zamiana sygnałów w weryfikowalne fakty"
team: red-blue
domain: osint-cti
section: people-companies
type: methodology
angle: osint-entities-geoint-automation-workflow
sourceTrack: osint-sekurak
tags: ["osint", "geoint", "maps", "metadata", "breaches", "dorking", "recon", "evidence"]
difficulty: easy
shortDescription: "Praktyczny workflow OSINT oparty na mapach, podmiotach i automatyzacji: jak budować hipotezy, wykorzystywać GEOINT, metadane, rejestry, dorki, wycieki i recon techniczny oraz zamieniać pojedyncze sygnały w weryfikowalne ustalenia."
updatedAt: "2026-03-05"
---

# OSINT - mapy, firmy, automatyzacja

Ta część jest o trzech rzeczach, które robią realną różnicę w praktyce:

1. **Mapy i geolokalizacja** - czyli jak zamieniać „ładne zdjęcie” w konkretne miejsce i czas.
2. **Informacje o podmiotach** - firma / szkoła / nieruchomość / pojazd, czyli jak z kawałka danych zbudować profil.
3. **Automatyzacja** - bo ręcznie da się zrobić 10 spraw, a narzędziami 1000 (i dopiero wtedy OSINT staje się „skalowalny”).

---

## 0) Zasada przewodnia: zanim klikniesz - ustal hipotezę

OSINT nie polega na „szukaniu czegokolwiek”. Najczęściej wygrywa ten, kto umie:

- **postawić hipotezę** (co to może być / gdzie / kiedy / kto),
- dobrać **najkrótszą ścieżkę weryfikacji**,
- **zbierać dowody** (linki, screeny, daty, archiwa),
- i dopiero potem „rozbudowywać drzewko”.

**Przykład myślenia:**

> To wygląda na magazyn przy trasie S8. Sprawdzę cień (godzina), pogodę (dzień), a potem dopasuję obiekt na mapie po układzie dróg.

---

## 1) Higiena wyszukiwania (OPSEC pod OSINT)

To nie jest paranoja - to różnica między czystymi wynikami a „bańką” i zostawianiem śladów.

**Minimum:**

- nie loguj się do kont (Google, social media) jeśli nie musisz,
- ogarnij „tożsamości przeglądarki”: profil/ kontener / inna przeglądarka,
- uważaj na IP (sieć, VPN) - nie dla „tajności”, tylko dla spójności wyników i ograniczenia profilowania,
- zapisuj źródła od razu (link + timestamp + co to udowadnia).

**Błąd #1:** robienie OSINT w tej samej przeglądarce, w której żyjesz prywatnie i zawodowo.

**Błąd #2:** „zapamiętam link” - nie, nie zapamiętasz.

---

## 2) Wyszukiwanie, które działa: dorki jako skalpel

Operatorów jest dużo, ale w praktyce wygrywa kilka, używanych dobrze.

### Dorki, które realnie robią robotę

**Zakres / domeny**

- `site:example.com`
- `site:*.example.com` (subdomeny)

**Typy plików**

- `filetype:pdf` / `ext:xls` / `ext:docx` / `ext:xml` / `ext:json`

**Gdzie szukać tekstu**

- `intitle:"..."`
- `inurl:"..."`
- `intext:"..."`

**Cache**

- `cache:...` (czasem uratuje, gdy strona już znikła)

### Gotowce (patterny)

- Dokumenty „dla ludzi”, które nie miały wyjść na świat:
  - `site:example.com (filetype:pdf OR filetype:docx OR filetype:xls) (confidential OR internal OR only)`

- Otwarte katalogi:
  - `site:example.com intitle:"index of"`

- Ślady haseł/sekretów w treści (ostrożnie, to bywa „brzydki” temat - do nauki i defensywy):
  - `site:example.com intext:"password"`
  - `site:example.com intext:"api_key"` / `intext:"secret"` / `intext:"token"`

**Błąd #3:** jeden dork i „nie ma nic” → a nie sprawdziłeś wariantów (synonimy, języki, formaty, stare wersje).

---

## 3) Metadane: cicha warstwa, która zdradza za dużo

Metadane to często „głupi błąd”, a nie „zaawansowany OSINT”.

### Co najczęściej da się wyciągnąć

- autor/organizacja (np. z Office/PDF),
- nazwy użytkowników / ścieżki plików,
- wersje narzędzi, czas tworzenia,
- w zdjęciach: parametry aparatu i czasem GPS (jeśli ktoś nie wyciął).

### Narzędzia i kiedy ich używać

- **exiftool** - szybka prawda o pliku (pierwsza rzecz jak dostajesz obraz/PDF/dokument)
- **FoCA** - hurtowe szukanie metadanych w dokumentach (szczególnie organizacje/instytucje)
- **Maltego / Recon-ng** - kiedy chcesz łączyć encje i wizualizować relacje

**Workflow (prosty i skuteczny):**

1. zbierz pliki (PDF/DOCX/XLS/JPG) z domeny lub folderów,
2. `exiftool` na start, żeby zobaczyć, czy w ogóle jest co ciągnąć,
3. jeśli jest tego dużo → FoCA / automatyzacja,
4. wyniki wrzuć do mapy powiązań (kto / jaki program / jakie nazwy / jakie ścieżki).

**Błąd #4:** „metadane są zawsze” - nie, często są wyczyszczone. Ale jak są, to bywają złotem.

---

## 4) Wycieki i hasła: OSINT + weryfikacja ryzyka

To temat, gdzie łatwo popłynąć w „sensację”, a tu trzeba zimnej głowy: **weryfikacja, nie emocje**.

### Do czego to jest dobre (legalnie i sensownie)

- potwierdzenie, czy **konto** pojawia się w incydentach,
- ocena, czy organizacja ma problem z higieną haseł,
- budowanie świadomości i rekomendacji (defensywnie).

### Narzędzia i use-case

- **Have I Been Pwned** - szybki check dla maila (czy w ogóle był w wyciekach)
- **DeHashed** - bardziej „analityczne” podejście i korelacje (często płatne)
- **bezpiecznedane.gov.pl** - kontekst edukacyjno-informacyjny w PL
- **NAMINT** - generowanie wzorców loginów/nazw (super przy enumeracji tożsamości w firmie)

**Mindset:** wyciek ≠ prawda o człowieku. Wyciek = artefakt, który trzeba potwierdzić innymi źródłami.

---

## 5) GEOINT i obraz: jak zamienić zdjęcie w koordynaty

To najbardziej „detektywistyczny” fragment OSINT, ale da się go ułożyć w prosty proces.

### Reverse image search - nie polegaj na jednym silniku

- Google bywa średni na „mniej popularne” obrazy,
- **Yandex** często wygrywa na dopasowaniach wizualnych,
- **Bing** bywa mocny na obiektach/miejscach,
- **TinEye** jest dobry do historii/reuploadów,
- do twarzy (jeśli masz legalny powód i zasady) - **PimEyes**.

### Cienie + słońce + pogoda = czas i kierunek

Jeśli masz:

- cień (długość/kierunek),
- orientację obiektu,
- i miejsce (choćby przybliżone),

to:

- **suncalc.org** i **shadowmap.org** pozwalają dopasować godzinę (czasem nawet porę roku),
- archiwa pogody (Windy/IMGW/Wunderground/WeatherOnline) potwierdzają: „czy wtedy mogło być tak jasno / taka widoczność / takie chmury”.

### Pomiary na zdjęciu

- narzędzia do mierzenia (np. photo measure) pomagają, gdy musisz oszacować: wysokość, szerokość, odległość (np. „czy to 2m czy 4m?”).

### Forensyka obrazu - kiedy podejrzewasz manipulację

- 29a / FotoForensics / InVID: szukanie śladów edycji, kompresji, warstw, reuploadów.

**Workflow GEOINT (praktyczny):**

1. reverse image search (2-3 silniki),
2. wyłap „kotwice”: znaki, język, architektura, numery, roślinność, układ dróg,
3. mapy i street view (lub Mapillary) do dopasowania detali,
4. cień + słońce (czas) + pogoda (potwierdzenie),
5. dokumentuj dowody (screeny + linki + daty).

**Błąd #5:** zaczynanie od „zgaduję kraj” zamiast od kotwic na zdjęciu.

---

## 6) Pojazdy: rejestry, VIN i ślady w sieci

To „OSINT użytkowy”: weryfikacja historii, OC, specyfikacji, a czasem korelacje zdjęć tablic.

**PL - podstawowe źródła:**

- historia pojazdu, OC (UFG), bezpieczny autobus (w zależności od kontekstu)

**Tablice w sieci:**

- serwisy agregujące zdjęcia tablic (czasem pomogą przy „gdzie to było widziane”)

**VIN:**

- dekodery VIN → specyfikacja, wersja silnika, wyposażenie (świetne do potwierdzania „czy to na pewno ten model/rocznik”).

**Mindset:** pojazd to często „most” do miejsca (gdzie jeździ) albo organizacji (flota firmowa).

---

## 7) Podmioty: firma / szkoła / nieruchomości

Tu najważniejsze jest zrozumienie, że OSINT o podmiocie to zwykle 3 warstwy:

1. **rejestry formalne** (twarde dane),
2. **ludzie i role** (soft data),
3. **infrastruktura i ślady online** (techniczne dane).

### Firmy

- KRS / CEIDG / REGON: fundament (kto, kiedy, gdzie, reprezentacja)
- rejestr.io i podobne agregatory: szybkie przeglądy i skróty
- LinkedIn/Goldenline: role, działy, struktura, „kto za co”
- bazy dłużników: sygnały finansowe (zawsze jako wskazówka, nie wyrok)

**Workflow firmy (polecam):**

1. rejestr → dane twarde,
2. ludzie → role + powiązania,
3. domeny/subdomeny → infrastruktura,
4. dokumenty + metadane → procesy i narzędzia.

### Szkoły / uczelnie

- rejestry instytucji: potwierdzenie legalnego statusu, nazw, jednostek.

### Nieruchomości

- geoportale: działki, warstwy, mapy, granice
- GUNB: pozwolenia, inwestycje (super przy „co się buduje i gdzie”)
- księgi: ekstremalnie wrażliwy temat - tu ważny jest scope, podstawa i cel.

---

## 8) Social media i kamery: lokalizacja „na żywo” i archiwa

Social media z geotagiem to kopalnia, ale działa falami (raz jest, raz nie ma). Dlatego warto mieć listę narzędzi:

- Instagram / X / Snapchat / YouTube - wyszukiwanie po geolokalizacji (tam, gdzie da się)
- Mapillary - ulice i widoki od ludzi (czasem lepsze niż Street View)
- publiczne kamery: pogodowe/turystyczne
- Insecam - **czerwone światło**: to już zahacza o tematy ryzykowne i łatwo wejść w nielegalne obszary. Traktuj jako wiedzę o istnieniu, nie jako zachętę.

**Błąd #6:** „kamera mówi prawdę” - kamery potrafią mieć opóźnienia, archiwalne kadry, błędne opisy lokalizacji.

---

## 9) Recon techniczny: kiedy OSINT dotyka infrastruktury

Tu wchodzisz w „OSINT + recon”, czyli dalej informacja jawna, ale już techniczna.

### Shodan

- używaj, gdy chcesz znaleźć:
  - wystawione usługi,
  - urządzenia,
  - banery, wersje, porty,
  - „co widać z internetu”.

### Automatyzacja

- **Feroxbuster / FFuf** - enumeracja zasobów webowych (katalogi/pliki)
- **theHarvester** - zbieranie maili, subdomen, hostów z wielu źródeł
- **crt.sh** - subdomeny z transparentności certyfikatów (często złoto)

### Malware / analiza sieciowa (OSINT defensywny)

- VirusTotal - reputacja, relacje, pliki/domeny
- Any.run - sandbox interaktywny (ostrożnie z prywatnymi próbkami)
- PacketTotal - analiza PCAP
- Malpedia / MalwareBazaar - kontekst rodzin malware i próbki

**Mindset:** nawet w OSINT „techniczny” chodzi o korelację: domena → subdomeny → usługi → artefakty → ludzie/procesy.

---

## 10) Szybkie checklisty (do przeklejenia)

### A) „Dostałem jedno zdjęcie i mam je osadzić”

- [ ] reverse image (Google + Yandex + Bing)
- [ ] kotwice: język, znaki, architektura, roślinność, tablice, marki
- [ ] mapy + street view/Mapillary
- [ ] cień/słońce (SunCalc/ShadowMap)
- [ ] pogoda archiwalna (IMGW/Windy/etc.)
- [ ] dokumentacja: screeny + linki + daty

### B) „Mam firmę i muszę ją rozpoznać”

- [ ] rejestry: KRS/CEIDG/REGON
- [ ] domeny: wyszukiwanie + subdomeny (crt.sh)
- [ ] dokumenty: PDF/DOCX/XLS (dorki + metadane)
- [ ] ludzie: LinkedIn (role + działy + powiązania)
- [ ] infrastruktura: Shodan (co wystaje)

### C) „Chcę zrobić to szybko i skalowalnie”

- [ ] zdefiniuj pytanie i hipotezę
- [ ] wybierz 2-3 źródła (nie 20)
- [ ] automatyzuj zbieranie (theHarvester/crt.sh/dorki + eksport)
- [ ] koreluj wyniki (arkusz / graf / notatka)
- [ ] zapisuj dowody na bieżąco

---

## 11) Typowe miny i jak ich unikać

- **Mylisz „wskazówkę” z „dowodem”.**
  W OSINT dowodem jest to, co da się zweryfikować w 2-3 niezależnych źródłach.
- **Nie zapisujesz procesu.**
  Field Manual ma potem działać jak „manual do powtórki” - dlatego zapisuj też _dlaczego_ coś sprawdziłeś.
- **Zbyt szeroki scope.**
  Jak nie zawęzisz, to utoniesz w danych.
- **Zakochanie w jednym narzędziu.**
  Narzędzie jest tylko dźwignią. Proces robi wynik.

---

## 12) Jedno zdanie, które zostawiam sobie

**OSINT wygrywa nie ten, kto ma najwięcej narzędzi, tylko ten, kto najszybciej zamienia sygnały w weryfikowalne fakty.**
