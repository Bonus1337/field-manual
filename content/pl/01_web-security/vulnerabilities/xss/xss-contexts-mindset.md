---
id: xss-contexts-mindset
title: "XSS: kontekst jest wszystkim"
team: red
domain: web-security
section: vulnerabilities
topic: cross-site-scripting
type: knowledge
angle: attacker-mindset
sourceTrack: baw
tags: ["xss", "cross-site-scripting", "reflected-xss", "stored-xss", "file-upload", "csp"]
difficulty: medium
shortDescription: "XSS to nie alert w przeglądarce, tylko możliwość uruchomienia własnej logiki w cudzym kontekście. Klucz nie leży w samym payloadzie, ale w zrozumieniu miejsca, w które trafiają dane, i skutków jakie z tego wynikają."
updatedAt: "2026-04-06"
---

# XSS: kontekst jest wszystkim

XSS bardzo często jest traktowany zbyt lekko. W wielu materiałach zaczyna się i kończy na `alert(1)`, przez co łatwo wpaść w złudzenie, że to podatność efektowna, ale niekoniecznie groźna. Taki sposób patrzenia spłaszcza problem. `alert(1)` nie jest celem. To tylko najprostszy dowód, że udało się wejść ze swoim kodem w kontekst aplikacji. A skoro udało się uruchomić jedną linijkę JavaScriptu, to w tym samym miejscu można uruchomić dowolną inną logikę.

I właśnie tutaj zmienia się perspektywa. XSS to nie „popup w przeglądarce”, tylko możliwość działania jako ofiara. To oznacza czytanie tego, co widzi zalogowany użytkownik, wykonywanie akcji, które może wykonać użytkownik, i nadużywanie zaufania, jakie przeglądarka ma do kodu uruchamianego w ramach danej aplikacji. W praktyce to często nie jest bug wizualny, tylko pełne wejście w cudzy workflow.

## Najważniejsza rzecz: nie myśl o XSS jak o jednym typie błędu

Jednym z najlepszych wniosków jest to, że XSS nie powinien być analizowany jako pojedyncza kategoria „jest albo nie ma”. Dużo lepiej myśleć o nim jak o rodzinie problemów wynikających z tego, że niezaufane dane trafiają do miejsca, gdzie przeglądarka nadaje im znaczenie wykonawcze.

To może być:

- zawartość tagu HTML,
- wartość atrybutu,
- atrybut URL,
- string wewnątrz kodu JavaScript,
- kod obsługi zdarzenia,
- dynamicznie budowany fragment DOM,
- logika frontendowa oparta o `location`, `postMessage`, `cookie`, `fetch`, `eval` i podobne mechanizmy.

I to jest moment, w którym kończy się myślenie „wrzuć HTML entities i problem znika”. Nie znika. Zmienia tylko formę.

## Samo „enkodowanie HTML” nie jest strategią, tylko fragmentem strategii

To jeden z tych tematów, które bardzo łatwo zrozumieć źle. Jeśli ktoś zapamięta z XSS tylko to, że trzeba zamieniać `<` i `>` na encje, to będzie umiał obronić się przed częścią najprostszych przypadków, ale przegra przy bardziej realnych scenariuszach.

Bo problemem nie są wyłącznie znaczniki HTML. Problemem jest to, jak przeglądarka interpretuje dany fragment dokumentu.

Jeżeli input ląduje:

- między tagami - jedna metoda obrony może wystarczyć,
- w atrybucie - trzeba myśleć o wyjściu z atrybutu,
- w atrybucie bez cudzysłowów - nagle spacja staje się „specjalnym znakiem”,
- w `href` albo `src` - sam format URL staje się nośnikiem wykonania,
- w stringu JavaScript - bronimy nie HTML, tylko parser JS,
- w handlerze typu `onclick` - mamy kilka warstw kontekstu naraz.

To prowadzi do bardzo praktycznego wniosku: XSS nie broni się globalnie. XSS broni się kontekstowo.

## Kontekst jest wszystkim

To chyba najważniejsza idea z całego tematu. Nie istnieje uniwersalny payload „na XSS” i nie istnieje uniwersalna obrona „przed XSS”. Wszystko zależy od miejsca osadzenia danych.

Ten sam input:

- w jednym miejscu wyświetli się jako tekst,
- w drugim rozbije atrybut,
- w trzecim stworzy nowy tag,
- w czwartym zamieni się w kod JS,
- w piątym aktywuje `javascript:` albo event handler,
- w szóstym nie dotknie serwera ani razu, a mimo to wykona się w przeglądarce.

To jest dokładnie powód, dla którego XSS wraca ciągle mimo tylu lat wiedzy, filtrów i bibliotek. Problem nie polega na tym, że programiści nie wiedzą, czym jest XSS. Problem polega na tym, że bardzo łatwo nie zauważyć, w jakim _dokładnie_ kontekście pracują dane.

## DOM XSS bardzo dobrze ustawia mindset

Klasyczny reflected albo stored XSS jeszcze daje złudzenie, że trzeba „przepchnąć payload przez backend”. DOM XSS rozbija to myślenie. Pokazuje, że czasami serwer nie musi być częścią egzekucji w ogóle.

Jeśli aplikacja bierze dane z:

- `location.hash`,
- `location.search`,
- `document.cookie`,
- `postMessage`,
- odpowiedzi z API,
- storage przeglądarki,

a potem wkłada je do:

- `innerHTML`,
- `outerHTML`,
- `insertAdjacentHTML`,
- `document.write`,
- `eval`,
- `Function`,
- `setTimeout(string)`,
- `location`,
- `href`,
- `src`,
- `action`,

to cały problem dzieje się już po stronie przeglądarki.

To jest świetna lekcja praktyczna: przy DOM XSS nie szukasz już tylko miejsca, gdzie odbija się input. Szukasz przepływu danych od źródła do sinka. Od wejścia do wykonania. Od kontrolowanego inputu do miejsca, w którym przeglądarka albo silnik JS nadaje mu specjalne znaczenie.

To jest bardziej analiza przepływu niż test jednego parametru.

## Reflected, stored i DOM to nie trzy etykiety. To trzy różne modele ataku

Warto to rozumieć nie jako nazwy do zapamiętania, ale jako różne sposoby dostarczenia własnej logiki do ofiary.

### Reflected XSS

Tutaj liczy się dostarczenie payloadu w żądaniu i doprowadzenie do jego odbicia. To najczęściej znaczy: link, socjotechnika, wiadomość, kliknięcie.

### Stored XSS

Tutaj payload czeka już na ofiarę. Nie trzeba jej specjalnie prowadzić za rękę. Wystarczy, że odwiedzi miejsce, które normalnie odwiedza.

### DOM XSS

Tutaj payload nie musi nawet przejść przez aplikację po stronie serwera. Wystarczy, że frontend sam złoży sobie bombę z własnych mechanizmów.

To ważne, bo zmienia sposób myślenia podczas testów:

- przy reflected szukasz refleksji i warunków dostarczenia,
- przy stored szukasz trwałych punktów zapisu i triggerów,
- przy DOM szukasz przepływu danych w kodzie JavaScript.

## Prawdziwy ciężar XSS nie leży w wykonaniu kodu, tylko w skutkach

Bardzo łatwo zaniżyć XSS, jeśli patrzy się na niego tylko przez pryzmat popupa. Tymczasem najważniejszy mental shift jest taki: XSS daje dostęp do tego, co może zrobić ofiara w swojej sesji.

To oznacza między innymi:

- odczyt danych widocznych w aplikacji,
- wykonywanie akcji klikanych normalnie przez użytkownika,
- wysyłanie requestów w jego kontekście,
- eksfiltrację tokenów, kluczy, danych biznesowych,
- phishing wewnątrz legalnego originu,
- modyfikację interfejsu,
- przejmowanie flow działania użytkownika.

Inaczej mówiąc: XSS często nie atakuje tylko aplikacji. Atakuje relację użytkownik–aplikacja.

I to jest dużo groźniejsze niż sam kod.

## Bardzo częsty błąd: mylenie „mogę wstrzyknąć HTML” z „mam XSS”

To ważne rozróżnienie. Nie każde HTML injection oznacza jeszcze wykonanie JavaScriptu. Ale z drugiej strony bardzo często jest to pierwszy sygnał, że granica między danymi a kodem już została naruszona.

Dla praktyka oznacza to prostą kolejność myślenia:

1. Czy input wraca?
2. Gdzie wraca?
3. Jak jest interpretowany?
4. Czy mogę zmienić kontekst?
5. Czy z tego miejsca mogę doprowadzić do wykonania kodu?

To daje dużo lepszą metodykę niż ślepe wklejanie payloadów z list.

## Najgroźniejsze są miejsca, które wyglądają „prawie bezpiecznie”

Bardzo podoba mi się w tym temacie to, że najciekawsze przypadki nie wynikają z totalnego braku zabezpieczeń, tylko z zabezpieczeń częściowych.

To są sytuacje typu:

- ktoś encoduje tylko HTML, ale nie rozumie kontekstu URL,
- ktoś filtruje `<script>`, ale zostawia event handlery,
- ktoś blokuje nawiasy, ale nie rozumie encji i escape’ów,
- ktoś ufa frameworkowi, ale obok używa `dangerouslySetInnerHTML`,
- ktoś ma templating z autoescapingiem, ale dynamicznie składa sam szablon,
- ktoś waliduje input, ale finalnie i tak ląduje on w `eval`,
- ktoś oddziela dane od HTML na backendzie, ale frontend sam skleja niebezpieczny DOM.

To wszystko prowadzi do jednego praktycznego wniosku: częściowa obrona bardzo często daje fałszywe poczucie bezpieczeństwa, a to bywa gorsze niż brak obrony, bo usypia czujność.

## Zagnieżdżone konteksty to miejsce, gdzie ludzie przegrywają

Jeden z najmocniejszych mentalnych modeli przy XSS to świadomość, że konteksty mogą się nakładać.

Przykładowo:

- HTML zawiera atrybut,
- atrybut zawiera JavaScript,
- JavaScript operuje na stringu,
- string zawiera URL,
- URL wspiera własne kodowanie.

W takim układzie nie wystarczy „jedno dobre enkodowanie”. Trzeba rozumieć każdą warstwę osobno. I właśnie tu wychodzi różnica między mechanicznym stosowaniem funkcji bezpieczeństwa a realnym zrozumieniem parserów.

To też tłumaczy, dlaczego dużo obron pada nie dlatego, że była całkiem zła, tylko dlatego, że była dobra tylko dla jednej warstwy.

## Framework nie jest tarczą absolutną

Nowoczesne frameworki pomagają, ale nie rozwiązują wszystkiego. Jeśli generowanie widoku odbywa się przez bezpieczny templating z autoescapingiem, to duża część klasycznych przypadków odpada. Ale to nadal nie chroni przed:

- niebezpiecznym DOM API,
- ręcznym wstrzykiwaniem HTML,
- błędnym obchodzeniem sanitizerów,
- dynamicznym budowaniem templatek,
- URL-ami z niebezpiecznym protokołem,
- logiką opartą o `eval` albo podobne mechanizmy.

To jest ważny wniosek dla praktyki: framework redukuje pewną klasę błędów, ale nie usuwa potrzeby myślenia. Nadal trzeba wiedzieć, gdzie kończy się bezpieczeństwo frameworka, a zaczyna ręcznie pisana logika developera.

## Jeśli musisz dopuścić HTML, to nie filtruj go „sprytem”

To jest jeden z tych tematów, gdzie własna kreatywność bywa zagrożeniem. Próby typu:

- regex na tagi,
- wycinanie słowa `script`,
- usuwanie `onerror`,
- blokowanie nawiasów,
- ręczne black listy,

bardzo często kończą się obejściem. Nie dlatego, że pomysł jest kompletnie idiotyczny, tylko dlatego, że HTML i JavaScript mają zbyt wiele parserowych niuansów, żeby ręczne filtrowanie było stabilne.

Jeśli aplikacja ma pozwalać na fragmenty HTML, to dużo rozsądniej myśleć kategoriami:

- parser,
- allowlista,
- sanitizer,
- minimalny dozwolony zestaw tagów i atrybutów.

Innymi słowy: nie próbuj zgadywać, co jest złe. Zdefiniuj, co ma być dozwolone.

## Upload plików to też powierzchnia XSS

To kolejna rzecz, którą łatwo przeoczyć. Jeśli użytkownik wrzuca plik, a aplikacja serwuje go z tego samego originu, to nagle XSS nie musi wynikać z parametru czy formularza. Wystarczy, że przeglądarka potraktuje dany format jako aktywny.

Najbardziej praktyczny wniosek jest prosty: pliki użytkowników nie powinny żyć w tym samym zaufanym kontekście co główna aplikacja. Separacja originu ma tu dużo większy sens niż próba przewidzenia wszystkich niebezpiecznych rozszerzeń i formatów.

To nie jest detal architektoniczny. To realny control bezpieczeństwa.

## Filtry przeglądarkowe nie są strategią

Bardzo łatwo wpaść w myślenie, że „przecież browser coś zablokuje”. To jest dokładnie ten rodzaj komfortu, który później kończy się podatnością w produkcji.

Mechanizmy po stronie przeglądarki mogą czasem złagodzić skutki prostych przypadków, ale:

- nie obejmują wszystkich wariantów,
- są zależne od implementacji przeglądarki,
- bywają usuwane,
- bywają obchodzone,
- nie zastępują poprawnego kodu.

To nie jest warstwa, na której można budować bezpieczeństwo. To co najwyżej awaryjna poduszka, a nie pas bezpieczeństwa.

## Jak myśleć o XSS podczas testów

Najbardziej użyteczny model mentalny wygląda dla mnie tak:

### 1. Nie pytaj od razu „czy jest XSS?”

Najpierw pytaj: gdzie trafia input i jaką rolę dostaje w dokumencie albo kodzie?

### 2. Szukaj kontekstu, nie payloadu

Payload jest wtórny. Najpierw trzeba zrozumieć parser i miejsce osadzenia.

### 3. Szukaj przepływu source → sink

Zwłaszcza w frontendzie. To często bardziej przypomina review przepływu danych niż klasyczne fuzzowanie.

### 4. Myśl o skutkach, nie tylko o triggerze

Jeśli już uda się wykonać kod, to najciekawsze pytanie brzmi: co mogę zrobić jako ofiara?

### 5. Traktuj każde „prawie bezpieczne” miejsce podejrzliwie

Najwięcej ciekawych przypadków siedzi tam, gdzie ktoś wdrożył zabezpieczenie połowicznie.

## Co warto zapamiętać

XSS to nie jeden bug. To cała klasa błędów wynikających z mieszania danych i kodu w złym miejscu.

Najważniejsze nie jest to, czy payload zawiera `<script>`, tylko:

- gdzie trafia input,
- jak interpretuje go przeglądarka,
- czy można zmienić kontekst,
- czy istnieje droga od kontrolowanych danych do wykonania kodu.

Największy błąd w myśleniu o XSS to spłycanie go do `alert(1)`.
Największa wartość w nauce XSS to zrozumienie parserów, kontekstów i skutków.
Największa przewaga w praktyce to umiejętność patrzenia na aplikację jak na system przepływu danych, a nie jak na zbiór pojedynczych pól input.

Bo w finalnym rozrachunku XSS nie polega na tym, że przeglądarka pokazała popup.
Polega na tym, że cudza aplikacja zaczęła wykonywać naszą logikę.
