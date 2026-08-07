---
id: osint-tools-practical-techniques
title: "OSINT Tools and Practical Techniques"
team: red-blue
domain: osint-cti
section: technical-osint
type: knowledge
angle: osint-tools-techniques-workflow
sourceTrack: osint-sekurak
tags:
  [
    "osint",
    "google-dorking",
    "opsec",
    "metadata",
    "geolocation",
    "recon",
    "wayback-machine",
    "shodan",
    "censys",
    "reverse-image-search",
    "socmint",
  ]
difficulty: medium
shortDescription: "Praktyczne wprowadzenie do OSINT: pasywne i aktywne rozpoznanie, przygotowanie środowiska i OPSEC, zaawansowane wyszukiwanie, analiza osób i firm, metadane, infrastruktura, zdjęcia, dane transportowe, geolokalizacja oraz dokumentowanie i korelacja informacji."
updatedAt: "2026-08-07"
---

# Narzędzia i praktyczne techniki OSINT

OSINT, czyli Open Source Intelligence, to proces pozyskiwania, analizowania i łączenia informacji pochodzących z legalnie dostępnych źródeł otwartych.

Nie jest to pojedyncze narzędzie, wyszukiwarka ani umiejętność odnajdywania profili w mediach społecznościowych. Jest to pełny cykl wywiadowczy obejmujący postawienie pytania, zebranie danych, ich ocenę, analizę, stworzenie wniosków oraz przedstawienie wyników.

Największą wartością OSINT-u nie jest liczba znalezionych informacji, ale możliwość połączenia pozornie niepowiązanych danych w jeden spójny obraz.

---

## Czym naprawdę jest OSINT

Źródłem informacji może być praktycznie każdy publicznie dostępny element:

- wyszukiwarka internetowa,
- profil w mediach społecznościowych,
- dokument opublikowany na stronie,
- ogłoszenie o pracę,
- certyfikat TLS,
- kod źródłowy strony,
- archiwalna wersja witryny,
- zdjęcie satelitarne,
- komentarz pracownika,
- recenzja firmy,
- nazwa użytkownika,
- metadane zdjęcia,
- ruch statku lub samolotu,
- cień widoczny na fotografii.

Pojedynczy element zwykle nie daje pełnej odpowiedzi. Dopiero jego korelacja z innymi źródłami pozwala stworzyć wartościowy wniosek.

Przykładem mogą być dane z Google Trends. Nagły wzrost liczby wyszukiwań konkretnego hasła, występujący przed określonym wydarzeniem, może sugerować, że część osób posiadała informacje wcześniej. Sam wykres nie jest dowodem wycieku, ale może stanowić punkt wyjścia do dalszej analizy.

Podobnie działała klasyczna analiza wywiadowcza. Zamiast bezpośrednio obserwować skuteczność bombardowania mostów, można było analizować ceny produktów transportowanych przez te mosty. Wzrost ceny pomarańczy mógł wskazywać na przerwanie szlaków transportowych.

OSINT często polega właśnie na obserwowaniu skutków zjawiska, którego nie możemy zobaczyć bezpośrednio.

---

## Cykl wywiadowczy

Dobre rozpoznanie zaczyna się od pytania, a nie od uruchomienia narzędzia.

Proces można przedstawić jako cykl:

```text
Pytanie
   ↓
Plan pozyskania informacji
   ↓
Zbieranie danych
   ↓
Ocena wiarygodności
   ↓
Analiza i korelacja
   ↓
Raportowanie
   ↓
Nowe pytania
```

Przed rozpoczęciem pracy należy określić:

- czego dokładnie szukamy,
- jakie informacje są potrzebne,
- jakie źródła mogą je zawierać,
- jakie działania są dozwolone,
- czy cel może zauważyć naszą aktywność,
- jaki poziom pewności musi mieć końcowy wniosek.

Bez zdefiniowanego pytania łatwo wejść w nieskończony ciąg wyszukiwania kolejnych informacji, które nie przybliżają nas do rozwiązania problemu.

---

## Dane, hipotezy i dowody

Jednym z najważniejszych elementów analizy jest oddzielenie faktów od przypuszczeń.

```text
Fakt:
Certyfikat TLS zawiera nazwę test.example.com.

Hipoteza:
Pod tą nazwą może działać środowisko testowe.

Weryfikacja:
Sprawdzenie DNS, historii certyfikatów, archiwów i ekspozycji usługi.

Wniosek:
Nazwa wskazuje na środowisko testowe, ale sama obecność
w certyfikacie nie potwierdza, że system nadal istnieje.
```

Metadane, nazwy plików, daty publikacji, wpisy w rejestrach i dane z mediów społecznościowych powinny być traktowane jako wskazówki.

Każda z tych informacji może być:

- nieaktualna,
- błędna,
- zmanipulowana,
- przypisana do innej osoby,
- wygenerowana automatycznie,
- wyrwana z kontekstu.

Prawdziwy ekspert nie próbuje udawać, że wie wszystko. Jasno określa, czego nie wie, co tylko podejrzewa i jaki materiał potwierdza jego wnioski.

---

## OSINT pasywny i aktywny

### OSINT pasywny

Pasywny OSINT polega na zbieraniu danych bez bezpośredniej interakcji z analizowanym celem.

Może obejmować:

- korzystanie z wyszukiwarek,
- analizę publicznych rejestrów,
- przeglądanie archiwalnych kopii stron,
- badanie certyfikatów TLS,
- analizę danych z zewnętrznych agregatorów,
- wykorzystanie kopii stron przygotowanych przez inne usługi.

Celem jest ograniczenie liczby bezpośrednich połączeń między naszym środowiskiem a infrastrukturą badanego podmiotu.

### OSINT aktywny

Aktywny OSINT powoduje bezpośrednią interakcję z celem lub jego systemem.

Przykładami mogą być:

- wejście na stronę organizacji,
- odwiedzenie profilu społecznościowego,
- polubienie materiału,
- wysłanie wiadomości,
- próba odzyskania konta,
- odpytanie usługi należącej do celu,
- kontakt telefoniczny lub mailowy.

Aktywne działania mogą dostarczyć dokładniejszych informacji, ale zwiększają ryzyko wykrycia i mogą spowodować zmianę zachowania badanego podmiotu.

Decyzja o przejściu z działań pasywnych do aktywnych powinna zostać podjęta świadomie, zanim rozpocznie się rozpoznanie.

---

## Dokumentowanie śledztwa

Internet nie jest trwałym źródłem danych. Strona może zostać zmieniona, wpis usunięty, konto zablokowane, a wynik wyszukiwania zniknąć.

Dlatego każdą istotną informację należy zapisać w chwili jej znalezienia.

Warto zachowywać:

- pełny adres URL,
- datę i godzinę dostępu,
- zrzut ekranu,
- kopię dokumentu,
- nazwę źródła,
- kontekst znalezienia informacji,
- krótkie wyjaśnienie, dlaczego materiał jest istotny.

Do dokumentowania procesu można wykorzystać:

- Hunchly,
- Obsidian,
- XMind,
- zwykłe notatki Markdown,
- zapisane strony HTML,
- zrzuty ekranu,
- nagranie ekranu,
- lokalne repozytorium materiałów.

Mapa myśli pozwala zobaczyć powiązania pomiędzy osobami, adresami, firmami, nazwami użytkowników, domenami i numerami telefonu.

```text
Osoba
├── Imię i nazwisko
├── Nazwy użytkownika
├── Adresy e-mail
├── Numery telefonu
├── Profile społecznościowe
├── Firmy
├── Lokalizacje
└── Powiązane osoby
```

Każda informacja powinna posiadać źródło. W przeciwnym razie po kilku godzinach analizy trudno będzie odtworzyć, skąd pochodził konkretny wniosek.

---

## Archiwizowanie internetu

### Wayback Machine

Wayback Machine przechowuje historyczne kopie stron internetowych.

Pozwala sprawdzić:

- poprzednią wersję witryny,
- usunięte podstrony,
- historyczne dane kontaktowe,
- dawne dokumenty,
- zmiany w ofercie lub strukturze organizacji,
- treści usunięte po rozpoczęciu incydentu.

Strony można również zapisywać ręcznie, zlecając wykonanie nowego snapshotu.

Archiwalna kopia nie gwarantuje jednak, że wszystkie zasoby zostały zachowane. Elementy dynamiczne, skrypty, materiały wymagające logowania i zewnętrzne pliki mogą być niedostępne.

### Kopie wykonywane przez inne usługi

Jeżeli bezpośrednie wejście na stronę nie jest pożądane, można wykorzystać zewnętrzne narzędzia generujące:

- screenshot strony,
- wersję PDF,
- podgląd witryny,
- analizę technologii,
- archiwalną kopię.

Należy pamiętać, że zlecenie wykonania kopii przez zewnętrzną usługę nadal może spowodować połączenie tej usługi z analizowanym celem.

Nie jest to pełna niewidzialność. Zmienia się jedynie podmiot wykonujący żądanie.

---

## Środowisko pracy i OPSEC

Narzędzia OSINT mogą chronić badacza tylko do pewnego momentu. Najczęściej identyfikacja następuje przez błędy operacyjne, powtarzalne zachowania lub nieprzemyślane połączenie kilku tożsamości.

Przed rozpoczęciem pracy warto przygotować oddzielne środowisko:

- osobną maszynę wirtualną,
- oddzielny profil przeglądarki,
- oddzielne konto systemowe,
- osobne adresy e-mail,
- odseparowany zestaw dokumentów,
- wyłączoną synchronizację osobistych kont,
- kontrolę plików cookie i lokalnego storage,
- świadomie wybraną trasę sieciową.

Kali Linux, Tsurugi czy CSI Linux oferują wiele gotowych narzędzi, ale mogą również wyróżniać środowisko badacza. Nietypowy zestaw nagłówków, rozszerzeń, rozdzielczość ekranu oraz zachowanie przeglądarki mogą tworzyć unikalny fingerprint.

Do pracy wymagającej większej separacji można rozważyć:

- Tails,
- Whonix,
- Tor Browser,
- jednorazową maszynę wirtualną,
- system uruchamiany z nośnika USB.

VPN nie zapewnia automatycznie anonimowości. Przenosi zaufanie z operatora sieci lokalnej na operatora VPN.

Nadal możliwa jest identyfikacja przez:

- ciasteczka,
- aktywne sesje,
- fingerprint przeglądarki,
- konfigurację urządzenia,
- DNS,
- zalogowane konta,
- charakterystyczne zachowanie,
- błędnie skonfigurowane aplikacje.

Przed wyborem zabezpieczeń należy określić model zagrożeń. Innego środowiska wymaga przeglądanie publicznych rejestrów, a innego analiza podmiotu, który aktywnie próbuje identyfikować badacza.

---

## Alternatywne profile

Alternatywny profil, określany również jako sockpuppet, to odseparowana tożsamość wykorzystywana do prowadzenia rozpoznania.

Profil nie powinien być powiązany z prawdziwą tożsamością operatora.

Należy unikać wykorzystywania:

- prywatnego adresu e-mail,
- osobistego numeru telefonu,
- charakterystycznej nazwy użytkownika,
- zdjęcia używanego na innych kontach,
- tych samych danych odzyskiwania,
- tej samej przeglądarki z aktywnymi sesjami,
- podobnego stylu wypowiedzi,
- powtarzalnych godzin aktywności.

Szczególnie niebezpieczne są nazwy użytkownika powiązane z prawdziwymi zainteresowaniami, historią edukacji, miejscem pracy lub innymi informacjami możliwymi do odnalezienia.

Losowy login nie musi składać się z 32 przypadkowych znaków. Powinien jednak być neutralny i niezwiązany z żadnym elementem prawdziwej tożsamości.

Zdjęcia generowane przez AI mogą wyglądać wiarygodnie, ale również pozostawiają ślady. Powtarzające się artefakty, nienaturalne proporcje, nieprawidłowe tło lub ponowne wykorzystanie tej samej twarzy mogą pozwolić zidentyfikować sztuczny profil.

---

## Narzędzia są mniej ważne niż technika

Narzędzia OSINT pojawiają się i znikają bardzo szybko.

Serwis, który działa dzisiaj, jutro może:

- zostać zamknięty,
- wprowadzić opłaty,
- ograniczyć API,
- wymagać logowania,
- przestać zwracać poprawne wyniki,
- zostać zablokowany przez analizowaną platformę.

Dlatego zamiast uzależniać proces od jednego rozwiązania, należy rozumieć:

- jakiego rodzaju dane są poszukiwane,
- skąd narzędzie je pozyskuje,
- czy wynik można uzyskać ręcznie,
- jakie istnieją alternatywne źródła,
- jak zweryfikować rezultat.

Przydatnymi katalogami narzędzi są:

- OSINT Framework,
- Otwarte Źródła,
- OSINT Techniques,
- Malfrat’s OSINT Map.

Własna lista narzędzi powinna być uporządkowana według funkcji, a nie nazw produktów.

```text
usernames/
emails/
domains/
companies/
images/
metadata/
maps/
archives/
transport/
infrastructure/
```

---

## Automatyzacja przy użyciu skryptozakładek

Bookmarklet to zakładka przeglądarki zawierająca kod JavaScript zamiast zwykłego adresu URL.

Może służyć do:

- wyciągania obrazów ze strony,
- kopiowania adresów URL,
- wyszukiwania zaznaczonego tekstu,
- zbierania adresów e-mail,
- otwierania kilku wyszukiwarek jednocześnie,
- upraszczania powtarzalnych czynności.

Przykładowy bookmarklet wyświetlający adresy wszystkich obrazów:

```javascript
javascript: (() => {
  document.querySelectorAll("img").forEach((image) => {
    console.log(image.src);
  });
})();
```

Przykład wyszukujący zaznaczony tekst w Google:

```javascript
javascript: (() => {
  const query = window.getSelection().toString().trim();

  if (!query) {
    alert("Najpierw zaznacz tekst.");
    return;
  }

  window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank");
})();
```

Bookmarklet działa w kontekście aktualnie otwartej strony. Nie należy uruchamiać kodu pochodzącego z nieznanego źródła bez wcześniejszego przeanalizowania jego działania.

---

## Skuteczne korzystanie z wyszukiwarek

Dobra technika wyszukiwania jest bardziej wartościowa niż dziesiątki przypadkowych narzędzi.

### Dokładna fraza

Cudzysłów wymusza wyszukanie konkretnej frazy.

```text
"Stefan Nowak"
```

Można w ten sposób wyszukiwać:

- imiona i nazwiska,
- fragmenty dokumentów,
- adresy e-mail,
- komunikaty błędów,
- unikalne wypowiedzi,
- fragmenty skopiowanych artykułów.

### Wykluczanie wyników

Minus usuwa wyniki zawierające określony element.

```text
"fragment artykułu" -site:sekurak.pl
```

Takie zapytanie może pomóc znaleźć kopie tekstu opublikowane poza jego pierwotnym źródłem.

### Ograniczenie do domeny

```text
OSINT site:sekurak.pl
```

Operator `site:` pozwala wyszukiwać informacje tylko w wybranej domenie.

Można połączyć go z innymi filtrami:

```text
site:example.com filetype:pdf
site:example.com "confidential"
site:example.com inurl:backup
```

### Wyszukiwanie w tytule

```text
intitle:"index of"
intitle:webcam
```

Operator `intitle:` wyszukuje strony zawierające określoną frazę w tytule.

### Wyszukiwanie w treści

```text
intext:"index of"
intext:"login successful"
```

Operator `intext:` wymusza obecność frazy w treści strony.

### Wyszukiwanie w adresie URL

```text
inurl:admin
inurl:backup
inurl:index.php
```

Operator `inurl:` pomaga znajdować określone elementy struktury adresu.

### Wyszukiwanie plików

```text
filetype:pdf
filetype:docx
filetype:xlsx
filetype:csv
```

Przykładowe połączenie:

```text
site:example.com filetype:xlsx
```

Może ujawnić publicznie zindeksowane arkusze należące do danej organizacji.

### Operator wieloznaczny

Gwiazdka może zastępować brakujący fragment frazy.

```text
"Stefan * Nowak"
```

Pozwala szukać nazwiska zawierającego drugie imię, pseudonim lub dodatkowy element.

### Operatory logiczne

```text
"Jan Kowalski" AND Warszawa
"Jan Kowalski" OR "Jan Nowak"
```

Bardziej rozbudowane zapytania warto grupować nawiasami:

```text
("Jan Kowalski" OR "J. Kowalski") AND (Warszawa OR "Nowy Dwór")
```

Nie należy ograniczać się do jednej wyszukiwarki. Google, Bing i Yandex posiadają różne indeksy, filtry i możliwości analizy obrazów.

Brak wyniku w Google nie oznacza, że dana informacja nie istnieje.

---

## Google Trends jako źródło danych

Google Trends pokazuje względną popularność zapytań w czasie i w określonym regionie.

Może pomóc analizować:

- rozwój zainteresowania wydarzeniem,
- regionalne różnice w wyszukiwaniu,
- reakcję społeczną na publikację,
- moment pojawienia się określonego tematu,
- potencjalne anomalie.

Nagły wzrost zainteresowania przed publicznym ujawnieniem informacji może być istotną wskazówką, ale nie stanowi automatycznie dowodu wcześniejszego dostępu do danych.

Analiza powinna uwzględniać również:

- kampanie medialne,
- publikacje influencerów,
- wydarzenia lokalne,
- automatyczny ruch,
- zmianę znaczenia słowa,
- błędy w próbkowaniu danych.

---

## Wyszukiwanie osób

Poszukiwanie osoby najczęściej rozpoczyna się od niewielkiej liczby identyfikatorów:

- imienia i nazwiska,
- nazwy użytkownika,
- adresu e-mail,
- numeru telefonu,
- zdjęcia,
- firmy,
- miejscowości.

Każdy identyfikator należy przekształcać w kolejne możliwe warianty.

Dla imienia i nazwiska mogą to być:

```text
Jan Kowalski
J. Kowalski
Kowalski Jan
Jan-Kowalski
jkowalski
j.kowalski
jan.kowalski
kowalski.jan
```

Należy uwzględniać:

- zdrobnienia,
- drugie imiona,
- brak polskich znaków,
- zmianę kolejności,
- cyfry,
- inicjały,
- pseudonimy.

Do automatycznego generowania wariantów można użyć narzędzi takich jak NameMash lub własnego prostego skryptu.

---

## Analiza nazw użytkownika

Ta sama nazwa użytkownika może występować na wielu platformach.

Narzędzia takie jak What’s My Name lub UserSearch automatyzują sprawdzanie wielu serwisów.

Wynik nie oznacza jednak, że wszystkie znalezione konta należą do tej samej osoby.

Profile należy porównać pod kątem:

- zdjęcia,
- wieku konta,
- lokalizacji,
- stylu wypowiedzi,
- zainteresowań,
- używanych języków,
- aktywności w podobnych godzinach,
- powiązanych adresów,
- publikowanych materiałów.

Im bardziej unikalny login, tym większa wartość korelacyjna. Popularna nazwa użytkownika może prowadzić do dziesiątek niezależnych osób.

Wiek konta również może pomóc weryfikować hipotezę. Jeżeli konto istnieje od ponad 20 lat, jego właściciel nie może być nastolatkiem.

---

## Wyszukiwanie adresów e-mail

Adres e-mail można odnaleźć lub przewidzieć na podstawie:

- strony organizacji,
- dokumentów,
- profilu zawodowego,
- repozytoriów kodu,
- wycieków danych,
- wzoru adresów firmowych,
- certyfikatów,
- ogłoszeń i publikacji.

Hunter.io może wskazać adresy powiązane z domeną oraz dominujący schemat ich tworzenia.

Przykładowy wzór:

```text
pierwsza litera imienia + nazwisko
```

Dla Jana Kowalskiego:

```text
jkowalski@example.com
```

Inne popularne schematy:

```text
jan.kowalski@example.com
j.kowalski@example.com
kowalski.jan@example.com
jan@example.com
jan-kowalski@example.com
```

Znaleziony lub wygenerowany adres nadal wymaga weryfikacji. W organizacji może pracować kilka osób o tym samym imieniu i nazwisku, a system może dodawać cyfry lub kolejne litery.

---

## Konto Google jako punkt korelacji

Adres e-mail może być powiązany z kontem Google nawet wtedy, gdy nie kończy się domeną `gmail.com`.

W zależności od ustawień konta i działania wykorzystywanej usługi możliwe może być odnalezienie:

- nazwy profilu,
- zdjęcia,
- identyfikatora konta,
- publicznych recenzji,
- aktywności w usługach Google.

Publiczne recenzje Google Maps mogą ujawniać odwiedzane miejsca, zainteresowania lub obszar, w którym dana osoba regularnie przebywa.

Należy jednak uważać na nadinterpretację. Recenzja miejsca nie musi oznaczać, że użytkownik był tam osobiście, mieszka w pobliżu lub odwiedził je w dniu publikacji.

Każdy wniosek powinien być potwierdzony przez dodatkowe źródło.

---

## Numery telefonu

Numery telefonu mogą pojawiać się w:

- ogłoszeniach,
- dokumentach,
- wizytówkach,
- profilach firmowych,
- katalogach,
- postach społecznościowych,
- aplikacjach identyfikujących dzwoniących,
- publicznych książkach adresowych.

Wyszukiwanie powinno uwzględniać różne formaty:

```text
+48 123 456 789
48123456789
123456789
123-456-789
123 456 789
```

Warto szukać również ikon telefonu, ponieważ użytkownicy często zapisują kontakt w formie:

```text
📞 123 456 789
☎ 123 456 789
```

Nie zawsze wystarczy więc wyszukiwanie słów `telefon`, `tel` lub `mobile`.

---

## Wyszukiwanie obrazem

Wyszukiwanie obrazem nie jest jednolitą techniką. Poszczególne wyszukiwarki specjalizują się w różnych zadaniach.

### Google Lens

Google Lens dobrze radzi sobie z:

- rozpoznawaniem obiektów,
- tekstem widocznym na zdjęciu,
- tłumaczeniem tekstu,
- identyfikacją lokalizacji,
- logotypami,
- produktami,
- fragmentami budynków.

Można zaznaczyć tylko wybrany obszar zdjęcia, aby ograniczyć wyszukiwanie do konkretnego elementu.

### Yandex Images

Yandex może być skuteczny w:

- odnajdywaniu podobnych twarzy,
- wyszukiwaniu podobnych kompozycji,
- identyfikowaniu obróconych lub zmodyfikowanych zdjęć,
- analizie materiałów pochodzących z Europy Wschodniej i rosyjskojęzycznych platform.

### TinEye

TinEye najlepiej sprawdza się przy poszukiwaniu:

- dokładnych kopii obrazu,
- starszych wersji zdjęcia,
- zmodyfikowanych kopii,
- źródła publikacji,
- przypadków ponownego użycia materiału.

Nie analizuje zawartości zdjęcia w taki sposób jak Google Lens czy Yandex.

### Wyszukiwanie twarzy

Specjalistyczne wyszukiwarki twarzy porównują cechy biometryczne zamiast całego obrazu.

Wynik dopasowania nie powinien być traktowany jako jednoznaczne potwierdzenie tożsamości. Podobieństwo twarzy musi zostać zestawione z innymi informacjami.

---

## Deep Web, Dark Web i Darknet

Surface Web to część internetu indeksowana przez standardowe wyszukiwarki.

Deep Web obejmuje zasoby, których roboty wyszukiwarek nie mogą lub nie powinny indeksować, między innymi:

- treści za ekranem logowania,
- dynamiczne bazy danych,
- prywatne panele,
- wewnętrzne wyszukiwarki,
- niepodlinkowane zasoby,
- systemy wymagające określonych parametrów.

Darknet to odrębna sieć wymagająca specjalnego oprogramowania lub konfiguracji.

Dark Web to zasoby dostępne wewnątrz takiej sieci.

Tor jest jednym z przykładów Darknetu, ale nie jest jedynym istniejącym rozwiązaniem.

Indeksy wyszukiwarek działających w Dark Webie są zwykle mniej kompletne. Adresy często się zmieniają, serwisy znikają, a ich zawartość może być niestabilna.

Do analizy takich zasobów należy wykorzystywać odseparowane środowisko, ponieważ operatorzy stron mogą świadomie próbować identyfikować lub atakować odwiedzających.

---

## Analiza firm

OSINT organizacji powinien obejmować zarówno oficjalne, jak i nieoficjalne źródła.

Warto analizować:

- rejestry publiczne,
- strony internetowe,
- raporty finansowe,
- ogłoszenia o pracę,
- profile pracowników,
- dokumenty przetargowe,
- media społecznościowe,
- prezentacje konferencyjne,
- zdjęcia biur,
- opinie pracowników,
- certyfikaty TLS,
- domeny i subdomeny.

Rejestry mogą ujawnić:

- właścicieli,
- członków zarządu,
- beneficjentów,
- powiązane podmioty,
- historię zmian,
- wspólne adresy,
- osoby występujące w kilku organizacjach.

Wizualizacja powiązań pomaga odnaleźć relacje trudne do zauważenia podczas ręcznego porównywania dokumentów.

---

## Ogłoszenia o pracę jako źródło danych

Ogłoszenia rekrutacyjne często ujawniają więcej informacji technicznych niż oficjalna dokumentacja firmy.

Można z nich pozyskać informacje o:

- wykorzystywanych systemach operacyjnych,
- chmurze,
- bazach danych,
- frameworkach,
- rozwiązaniach sieciowych,
- narzędziach bezpieczeństwa,
- procesach CI/CD,
- dostawcach,
- modelu pracy,
- planowanych migracjach.

Przykład:

```text
Wymagana znajomość:
AWS, Kubernetes, Jenkins, PostgreSQL, FortiGate
```

Możliwe wnioski:

```text
Organizacja prawdopodobnie korzysta z AWS.
Utrzymuje środowisko kontenerowe.
Wykorzystuje Jenkins w procesie CI/CD.
Stosuje PostgreSQL.
Posiada urządzenia lub usługi Fortinet.
```

Są to hipotezy, nie potwierdzona mapa infrastruktury. Ogłoszenie może być nieaktualne albo dotyczyć tylko jednego zespołu.

---

## Opinie pracowników i klientów

Serwisy z opiniami mogą ujawniać:

- nazwy przełożonych,
- strukturę działów,
- problemy organizacyjne,
- używane systemy,
- lokalizacje biur,
- procesy wewnętrzne,
- dostawców,
- godziny pracy,
- konflikty i zmiany kadrowe.

Opinie są jednak obciążone emocjonalnie. Najczęściej publikują je osoby szczególnie zadowolone albo szczególnie niezadowolone.

Informacje należy traktować jako materiał pomocniczy, a nie jako samodzielne, bezstronne źródło.

---

## Manipulowanie przewidywalnymi adresami URL

Niektóre zasoby nie są bezpośrednio podlinkowane, ale ich adresy mają przewidywalną strukturę.

Przykład:

```text
https://example.com/reports/2026-07.pdf
```

Możliwe warianty:

```text
https://example.com/reports/2026-06.pdf
https://example.com/reports/2026-08.pdf
https://example.com/reports/2025-07.pdf
```

Podobnie można analizować:

- identyfikatory dokumentów,
- numery zdjęć,
- nazwy miesięcy,
- wersje językowe,
- rozdzielczości obrazów,
- katalogi backupów.

Publicznie dostępny, ale niepodlinkowany zasób nadal może zostać odnaleziony.

---

## robots.txt

Plik `robots.txt` informuje roboty wyszukiwarek, które ścieżki powinny zostać pominięte podczas indeksowania.

Standardowa lokalizacja:

```text
https://example.com/robots.txt
```

Przykładowa zawartość:

```text
User-agent: *
Disallow: /admin/
Disallow: /backup/
Disallow: /internal/
```

`Disallow` nie chroni katalogu. Informuje jedynie współpracujące roboty, że nie powinny go indeksować.

Plik może przez przypadek ujawnić:

- panele administracyjne,
- katalogi backupów,
- środowiska testowe,
- prywatne sekcje,
- stare aplikacje,
- interesujące ścieżki.

Dostęp do zasobu powinien być kontrolowany przez uwierzytelnianie, autoryzację i konfigurację serwera, a nie przez wpis w `robots.txt`.

---

## Analiza infrastruktury internetowej

Wyszukiwarki takie jak Shodan, Censys czy ZoomEye indeksują usługi dostępne z internetu.

Mogą ujawniać:

- adres IP,
- otwarte porty,
- banner usługi,
- wersję oprogramowania,
- certyfikat TLS,
- nazwę hosta,
- lokalizację,
- zrzut ekranu,
- typ urządzenia.

W zależności od filtrów można odnaleźć:

- kamery,
- routery,
- serwery,
- panele administracyjne,
- systemy przemysłowe,
- urządzenia IoT,
- usługi zdalnego dostępu.

Przykładowa logika wyszukiwania:

```text
produkt + port + kraj + obecność screenshotu
```

Wyniki wyszukiwarki pokazują stan zaobserwowany przez jej skaner. Usługa mogła zostać później wyłączona, zaktualizowana lub przeniesiona.

---

## Certificate Transparency

Publicznie zaufane certyfikaty TLS są rejestrowane w logach Certificate Transparency.

Dzięki temu można odnaleźć nazwy hostów, dla których organizacja wystawiała certyfikaty.

Przykładowe nazwy:

```text
vpn.example.com
mail.example.com
test.example.com
backup.example.com
dev-api.example.com
```

Dane CT mogą pomóc w:

- odnajdywaniu subdomen,
- identyfikowaniu środowisk testowych,
- analizie historycznej infrastruktury,
- wykrywaniu zmian nazw,
- korelacji dostawców.

Wystawienie certyfikatu nie potwierdza, że host obecnie działa. Nazwa może być historyczna, wewnętrzna lub nigdy nieudostępniona publicznie.

---

## Analiza kodu źródłowego strony

Kod strony może ujawnić informacje niewidoczne w interfejsie.

Podstawowe sposoby dostępu:

```text
F12
Ctrl+U
```

W kodzie można znaleźć:

- komentarze programistów,
- adresy API,
- identyfikatory analityczne,
- ścieżki do plików,
- ukryte elementy,
- nazwy środowisk,
- dane konfiguracyjne,
- wersje bibliotek,
- odwołania do zewnętrznych usług.

Narzędzia deweloperskie pozwalają również analizować:

- żądania sieciowe,
- pliki JavaScript,
- multimedia,
- ciasteczka,
- local storage,
- odpowiedzi API,
- dynamicznie wczytywane zasoby.

Zmiana HTML lub CSS w DevTools działa lokalnie w przeglądarce i nie modyfikuje strony na serwerze.

Może jednak ujawnić treść, która została jedynie wizualnie zasłonięta, ale nadal znajduje się w DOM.

---

## Metadane plików

Metadane opisują właściwości pliku i sposób jego utworzenia.

Mogą zawierać:

- autora,
- nazwę użytkownika,
- nazwę organizacji,
- czas utworzenia,
- czas modyfikacji,
- model urządzenia,
- program wykorzystany do edycji,
- współrzędne GPS,
- historię zapisu,
- ścieżki lokalne,
- nazwę drukarki,
- wersję systemu.

Do ich analizy można wykorzystać ExifTool:

```bash
exiftool evidence.jpg
```

Dla dokumentu:

```bash
exiftool report.docx
```

Dla całego katalogu:

```bash
exiftool -r ./documents/
```

Metadane mogą pomóc ustalić:

- kiedy materiał został przygotowany,
- na jakim urządzeniu,
- przy użyciu jakiego programu,
- czy był edytowany,
- czy deklarowana data jest spójna z właściwościami pliku.

Nie są jednak niepodważalnym dowodem. Większość pól można zmienić lub usunąć.

Popularne platformy społecznościowe często usuwają EXIF ze zdjęć, ale nie należy zakładać, że robi to każda platforma i dla każdego typu pliku.

---

## FOCA i analiza dokumentów organizacji

FOCA może automatycznie wyszukiwać dokumenty powiązane z domeną, pobierać je i analizować metadane.

Pozwala odnaleźć informacje takie jak:

- nazwy użytkowników,
- używane programy,
- wersje pakietów biurowych,
- drukarki,
- ścieżki katalogów,
- nazwy komputerów,
- autorzy dokumentów.

Organizacja powinna okresowo analizować własne publiczne dokumenty dokładnie w taki sam sposób jak potencjalny przeciwnik.

---

## Analiza transportu morskiego

Statki przekazują dane pozycyjne przez AIS.

Serwisy takie jak MarineTraffic pozwalają analizować:

- aktualną pozycję,
- zadeklarowaną trasę,
- port docelowy,
- czas przybycia,
- historię ruchu,
- parametry jednostki.

Dane AIS nie powinny być automatycznie traktowane jako prawda. Sygnał może zostać:

- wyłączony,
- zmanipulowany,
- błędnie odebrany,
- retransmitowany,
- przypisany do nieprawidłowej jednostki.

Dlatego pozycję należy porównywać z:

- obrazami satelitarnymi,
- obserwacjami portowymi,
- zdjęciami załogi,
- aktywnością innych statków,
- zasięgiem odbiorników,
- czasem przejścia między lokalizacjami.

Jeżeli AIS pokazuje statek w jednym miejscu, ale zdjęcie satelitarne nie wskazuje tam żadnej jednostki, powstaje hipoteza o błędnej lub fałszywej transmisji.

---

## Analiza ruchu lotniczego

Samoloty przekazują dane m.in. za pomocą ADS-B.

Źródłami danych mogą być:

- Flightradar24,
- ADS-B Exchange,
- własny odbiornik SDR.

Dane mogą obejmować:

- pozycję,
- wysokość,
- prędkość,
- kierunek,
- numer lotu,
- trasę,
- typ maszyny.

Własny odbiornik pozwala obserwować lokalny ruch bez całkowitego uzależnienia od zewnętrznej platformy.

Brak samolotu w jednym serwisie nie oznacza, że nie nadawał danych. Poszczególne platformy mogą filtrować, ukrywać lub nie odbierać części transmisji.

---

## Mapy i zdjęcia satelitarne

Źródła geoprzestrzenne mogą obejmować:

- Google Maps,
- Google Street View,
- Google Earth Pro,
- Mapillary,
- Sentinel Hub,
- zdjęcia społecznościowe,
- komercyjne zdjęcia satelitarne.

Google Earth Pro pozwala analizować historyczne zdjęcia oraz wykonywać pomiary:

- odległości,
- powierzchni,
- kierunku,
- wysokości,
- relacji przestrzennych.

Mapillary może zawierać zdjęcia miejsc słabo pokrytych przez Google Street View.

Sentinel udostępnia stosunkowo aktualne zdjęcia dużych obszarów, ale ich rozdzielczość jest niższa niż w przypadku komercyjnych źródeł.

---

## Geolokalizacja zdjęć

Geolokalizacja polega na określeniu miejsca wykonania zdjęcia lub nagrania.

Analizowane elementy mogą obejmować:

- znaki drogowe,
- język,
- alfabet,
- numery telefonów,
- domeny internetowe,
- tablice rejestracyjne,
- ruch lewo- lub prawostronny,
- architekturę,
- roślinność,
- nawierzchnię drogi,
- słupy energetyczne,
- oznaczenia sklepów,
- pogodę,
- ukształtowanie terenu,
- góry,
- linię brzegową,
- modele pojazdów,
- anteny satelitarne,
- cienie.

Proces należy prowadzić od szerokiej klasyfikacji do dokładnego miejsca.

```text
Kontynent
   ↓
Kraj lub region
   ↓
Miasto
   ↓
Ulica
   ↓
Konkretny budynek
```

Przykład rozumowania:

```text
Widoczny język arabski.
Ruch prawostronny.
Nowoczesna zabudowa.
Pustynny krajobraz.
Charakterystyczne tablice rejestracyjne.
```

Każdy element zawęża obszar, ale dopiero ich połączenie tworzy mocną hipotezę.

---

## Analiza wnętrz

Zdjęcie wykonane wewnątrz pomieszczenia również może ujawniać lokalizację.

Warto analizować:

- widok za oknem,
- układ pomieszczenia,
- model wyposażenia,
- gniazdka elektryczne,
- system ogrzewania,
- oznaczenia przeciwpożarowe,
- instrukcje w lokalnym języku,
- logo hotelu,
- charakterystyczne meble,
- wzór wykładziny,
- elementy architektoniczne.

W przypadku hoteli zdjęcia z serwisów rezerwacyjnych mogą pozwolić porównać układ pokoju, meble, widok i dekoracje.

---

## Analiza czasu wykonania zdjęcia

Geolokalizacja odpowiada na pytanie „gdzie”, natomiast chronolokalizacja próbuje odpowiedzieć na pytanie „kiedy”.

Pomocne mogą być:

- długość i kierunek cienia,
- pozycja Słońca,
- faza Księżyca,
- położenie gwiazd,
- dane pogodowe,
- kwitnienie roślin,
- obecność śniegu,
- reklamy wydarzeń,
- rozkłady jazdy,
- stan budowy,
- historyczne zdjęcia Street View.

Cień zależy od:

- miejsca,
- daty,
- godziny,
- wysokości obiektu,
- orientacji terenu.

Jeżeli znamy lokalizację oraz przybliżoną wysokość obiektu, możemy sprawdzić, czy cień jest zgodny z deklarowanym czasem wykonania materiału.

Taka analiza zazwyczaj pozwala potwierdzić lub odrzucić zakres czasu, a nie wskazać jedną idealnie dokładną minutę.

---

## Google Maps jako źródło informacji o bezpieczeństwie fizycznym

Publiczne zdjęcia mogą ujawnić:

- wejścia do budynku,
- bramy,
- parkingi,
- ślepe punkty,
- ogrodzenie,
- rozmieszczenie kamer,
- drzwi techniczne,
- sposób dostawy,
- oznaczenia działów,
- widok przez okna.

Street View posiada również zdjęcia historyczne. Pozwala to sprawdzić, jak infrastruktura zmieniała się w czasie.

Organizacja powinna regularnie weryfikować, jakie informacje o jej obiektach można uzyskać z publicznych map i materiałów społecznościowych.

---

## OSINT wspierający socjotechnikę

Informacje pozyskane z otwartych źródeł mogą posłużyć do przygotowania wiarygodnej historii ataku.

Atakujący może zebrać:

- nazwiska pracowników,
- strukturę działów,
- nazwy dostawców,
- technologie,
- terminy projektów,
- informacje o awarii,
- planowane szkolenia,
- imiona przełożonych,
- styl komunikacji firmy.

Następnie może stworzyć wiadomość dopasowaną do bieżącej sytuacji organizacji.

```text
Ogólny phishing:
Twoje konto zostanie zablokowane.

Spear phishing:
Po wczorajszej migracji systemu Novum konieczna jest
ponowna aktywacja tokena przed godziną 12:00.
```

Druga wiadomość jest bardziej przekonująca, ponieważ zawiera elementy zgodne z rzeczywistością odbiorcy.

Najlepszą obroną jest przeprowadzenie OSINT-u własnej organizacji i sprawdzenie, jakie informacje mogą zostać wykorzystane przeciwko pracownikom.

---

## Analiza własnej ekspozycji

Jednym z najlepszych ćwiczeń dla początkującej osoby jest przeprowadzenie OSINT-u samego siebie.

Warto sprawdzić:

- jakie profile można odnaleźć,
- czy nazwy użytkownika się powtarzają,
- gdzie występuje prywatny adres e-mail,
- czy publicznie dostępny jest numer telefonu,
- jakie zdjęcia są indeksowane,
- czy dokumenty zawierają metadane,
- jakie informacje ujawniają profile zawodowe,
- czy można odtworzyć miejsca pobytu,
- jakie dane są dostępne w archiwach.

Celem nie jest tylko nauka narzędzi. Jest nim zrozumienie, jak łatwo pojedyncze informacje można połączyć w szczegółowy profil.

---

## Praktyczny workflow OSINT

### Zdefiniowanie celu

```text
Co dokładnie chcę ustalić?
Jaki poziom pewności jest wymagany?
Czy mam odpowiedni zakres działania?
```

### Zebranie identyfikatorów

```text
Imię i nazwisko
Login
E-mail
Telefon
Domena
Firma
Zdjęcie
Lokalizacja
```

### Wyszukiwanie szerokie

```text
Wyszukiwarki
Rejestry
Media społecznościowe
Archiwa
Dokumenty
```

### Rozwijanie pivotów

```text
E-mail → profil → zdjęcie → login → inne platformy
Firma → domena → certyfikaty → subdomeny → technologie
Zdjęcie → tekst → lokalizacja → mapy → dane historyczne
```

### Weryfikacja

Każdy ważny wniosek powinien być potwierdzony przez co najmniej jedno niezależne źródło.

### Dokumentacja

Zapisujemy materiał, źródło, czas i sposób pozyskania.

### Raport

Raport powinien rozdzielać:

- potwierdzone fakty,
- prawdopodobne wnioski,
- niezweryfikowane hipotezy,
- ograniczenia analizy.

---

## Najczęstsze błędy

### Zakochanie się w pierwszej hipotezie

Badacz zaczyna interpretować wszystkie kolejne informacje tak, aby potwierdzić pierwsze założenie.

### Uznawanie loginu za jednoznaczny identyfikator

Ten sam login może należeć do kilku osób.

### Traktowanie metadanych jak dowodu absolutnego

Metadane można zmienić.

### Poleganie na jednym narzędziu

Każde narzędzie może zwrócić wynik błędny, nieaktualny lub niepełny.

### Brak dokumentacji

Informacja znaleziona bez zapisania źródła szybko traci wartość.

### Łączenie środowiska badawczego z prywatną tożsamością

Jedna aktywna sesja lub powtarzający się login może ujawnić operatora.

### Brak rozróżnienia między pasywnym a aktywnym działaniem

Niektóre pozornie niewinne czynności generują bezpośredni ślad po stronie celu.

### Nadmiar danych

Duża liczba zebranych informacji nie oznacza dobrej analizy. Liczy się ich przydatność względem pytania wywiadowczego.

---

## Najważniejsze zasady

OSINT jest procesem myślowym wspieranym przez narzędzia.

Najpierw należy określić pytanie, później wybrać źródła, a dopiero na końcu uruchamiać narzędzia.

Pojedynczy wynik jest wskazówką. Wiarygodny wniosek powstaje po połączeniu kilku niezależnych źródeł.

Każdy istotny materiał należy archiwizować i opisywać w chwili jego znalezienia.

Metadane, profile, lokalizacje i dane techniczne mogą być fałszywe lub nieaktualne.

Brak informacji również może być informacją, ale wymaga ostrożnej interpretacji.

Najlepszy sposób nauki OSINT-u to praktyka, dokumentowanie procesu, sprawdzanie własnych błędów oraz regularne analizowanie własnej ekspozycji w internecie.

Najważniejszym narzędziem pozostaje nie wyszukiwarka, skrypt czy płatna platforma, ale sposób formułowania pytań i łączenia informacji.
