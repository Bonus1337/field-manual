---
id: sop-cors-complete
title: "SOP i CORS: pełny model zaufania przeglądarki, błędy konfiguracji i playbook testowy"
team: red
domain: web-security
section: browser-security
type: playbook
angle: pentest-workflow
sourceTrack: baw
tags: ["sop", "cors", "csrf", "xss", "xs-leaks", "burp-suite", "web", "api"]
difficulty: medium
shortDescription: "Kompletna notatka o Same-Origin Policy i CORS: czym naprawdę są, co chronią, czego nie chronią, gdzie powstają błędy, jak myśleć o nich ofensywnie oraz jak testować je praktycznie w Burpie bez mylenia sygnału z prawdziwym exploitem."
updatedAt: "2026-04-14"
---

# SOP i CORS: pełny model zaufania przeglądarki, błędy konfiguracji i playbook testowy

CORS jest jednym z tych tematów, które bardzo często są rozumiane źle z prostego powodu: większość ludzi poznaje go od strony błędu w konsoli, a nie od strony modelu bezpieczeństwa.

Widzą:

- `No 'Access-Control-Allow-Origin' header`
- `CORS policy blocked`
- `Response to preflight request doesn't pass access control check`

i zaczynają myśleć, że CORS to po prostu zestaw nagłówków, które trzeba ustawić, żeby frontend “działał”.

To jest bardzo słabe rozumienie tematu.

CORS nie jest tematem o nagłówkach.  
CORS jest tematem o **tym, kiedy przeglądarka pozwoli jednej aplikacji czytać odpowiedzi innej aplikacji**.

A żeby to rozumieć dobrze, trzeba zacząć od fundamentu, czyli **Same-Origin Policy**.

Bo bez SOP CORS nie ma sensu.  
I bez SOP nie ma też nowoczesnego bezpieczeństwa weba.

---

# 1. Same-Origin Policy: jedna z najważniejszych granic bezpieczeństwa w webie

Same-Origin Policy, w skrócie SOP, to podstawowy mechanizm izolacji w przeglądarce.

To on sprawia, że losowa strona internetowa, którą odwiedzasz, nie może po prostu swobodnie:

- czytać danych z innej otwartej aplikacji,
- odpytywać twojego banku i odczytywać odpowiedzi,
- pobierać wiadomości z twojej poczty,
- przeglądać paneli, do których jesteś zalogowany,
- mieszać logiki jednej aplikacji z drugą.

Bez SOP cały web byłby praktycznie nie do utrzymania.

## 1.1. Czym jest origin

Origin to nie “domena”.  
Origin to dokładnie trójka:

- **schemat** – na przykład `http` albo `https`
- **host**
- **port**

To oznacza, że poniższe adresy są dla przeglądarki różnymi originami:

- `https://example.com`
- `http://example.com`
- `https://api.example.com`
- `https://example.com:8443`

To jest bardzo ważne, bo wiele osób myśli zbyt skrótowo:
“ta sama firma, ta sama domena, to pewnie to samo”.

Nie.  
`app.example.com` i `example.com` to różne originy.  
`https://example.com` i `http://example.com` to różne originy.  
Różny port też robi różnicę.

Z punktu widzenia przeglądarki origin to tożsamość aplikacji.

---

# 2. SOP nie oznacza: „nic cross-origin nie działa”

To jeden z największych błędów poznawczych.

Gdyby SOP było wdrożone absolutnie rygorystycznie, web przestałby działać tak, jak działa dzisiaj. Nie mielibyśmy wygodnie osadzanych obrazów, skryptów, części integracji, CDN-ów i całego historycznego bałaganu zgodności wstecznej.

Dlatego poprawny model myślenia wygląda tak:

- **wysłanie requestu cross-origin** bywa możliwe,
- **osadzenie zasobu cross-origin** bywa możliwe,
- **odczyt odpowiedzi cross-origin** zwykle jest blokowany.

To jest najważniejszy mental model w całym temacie.

Nie pytaj najpierw:
“czy request poleci?”

Pytaj:
**“czy mój JavaScript będzie mógł przeczytać odpowiedź?”**

Bo bardzo często request poleci bez problemu.  
Ale to nie znaczy jeszcze, że dostaniesz dostęp do danych.

---

# 3. Dlaczego SOP jest tak ważne w praktyce

SOP to nie jest teoria. To jest warstwa, która na co dzień cicho chroni użytkownika.

Gdyby nie SOP:

- złośliwa strona mogłaby czytać odpowiedzi z twojego banku,
- każda reklama mogłaby odpytywać twoje intranetowe aplikacje,
- dowolna witryna mogłaby przeglądać dane z aplikacji, do których jesteś zalogowany,
- granica między aplikacjami w przeglądarce praktycznie by zniknęła.

I właśnie dlatego SOP jest jednym z najważniejszych mechanizmów całego browser security.

To nie jest dodatek.  
To jeden z fundamentów.

---

# 4. Dlaczego mimo SOP nadal istnieją XSS i CSRF

To jest moment, w którym wiele osób pierwszy raz naprawdę zaczyna rozumieć ten temat.

## 4.1. XSS nie obchodzi SOP. XSS działa wewnątrz zaufanego originu

Jeżeli aplikacja ma XSS, atakujący uruchamia swój JavaScript **w originie podatnej aplikacji**.

Czyli z punktu widzenia przeglądarki to nie jest już “obcy” kod.  
To jest kod działający w tym samym originie, któremu browser ufa.

Dlatego XSS jest tak potężny.

Nie dlatego, że potrafi zrobić `alert(1)`.  
Tylko dlatego, że daje atakującemu możliwość działania **jak legalny kod aplikacji**.

Czyli może:

- czytać odpowiedzi same-origin,
- wykonywać akcje jako użytkownik,
- korzystać z sesji,
- pobierać dane z API,
- wysyłać dalej wrażliwe informacje.

## 4.2. CSRF często nie potrzebuje czytać odpowiedzi

CSRF działa inaczej.

W klasycznym CSRF atakującego często w ogóle nie interesuje odpowiedź.  
Interesuje go to, żeby przeglądarka ofiary **wysłała żądanie** do podatnej aplikacji razem z cookie sesyjnym.

Czyli:

- ofiara jest zalogowana,
- odwiedza stronę atakującego,
- strona powoduje wysłanie requestu do aplikacji ofiary,
- browser dokleja cookies,
- aplikacja myśli, że to legalne żądanie użytkownika.

SOP nie eliminuje tego problemu automatycznie, bo SOP głównie ogranicza **odczyt odpowiedzi**, a nie samo istnienie każdego requestu cross-origin.

To jest bardzo ważne:

> SOP nie jest pełną ochroną przed CSRF.  
> SOP głównie utrudnia odczyt odpowiedzi i mieszanie kontekstów.

---

# 5. CORS: kontrolowany wyjątek od izolacji, a nie „wyłączenie SOP”

To jest kolejny kluczowy punkt.

Bardzo wiele osób mówi o CORS tak, jakby to było:
“wyłączamy SOP, żeby frontend działał”

To nie jest poprawne.

CORS nie wyłącza SOP.  
CORS mówi:

> “serwer może świadomie powiedzieć przeglądarce, że ufa danemu originowi i zgadza się, aby ten origin odczytał odpowiedź”

Czyli CORS to nie jest obejście bezpieczeństwa.  
To jest **standaryzowany, kontrolowany mechanizm przekazywania zaufania**.

W skrócie:

- SOP mówi: różne originy nie mogą swobodnie czytać swoich odpowiedzi
- CORS mówi: serwer może wskazać wyjątki od tej reguły

To bardzo zdrowy model.  
Ale tylko wtedy, gdy jest dobrze zrozumiany i dobrze wdrożony.

---

# 6. Kiedy CORS jest w ogóle potrzebny

CORS istnieje dlatego, że nowoczesne aplikacje realnie potrzebują komunikacji między originami.

Najczęstsze scenariusze:

- frontend SPA działa na jednym originie, backend API na innym,
- środowisko developerskie ma frontend lokalnie, a API zdalnie,
- kilka subdomen musi współpracować,
- system korzysta z usług firmy trzeciej,
- dashboard, SSO albo zewnętrzny moduł musi czytać dane z innego originu.

Bez CORS przeglądarka zablokowałaby odczyt odpowiedzi dla kodu JS.

Czyli request może polecieć, ale dane nie wrócą do klienta w użyteczny sposób.

---

# 7. Jak działa CORS naprawdę

CORS działa zawsze między trzema aktorami:

- **klientem** – kod JS działający w originie A,
- **serwerem** – zasób w originie B,
- **przeglądarką** – egzekutorem reguł.

To jest bardzo ważne.

Nie klient decyduje.  
Nie sam serwer decyduje.  
Decyduje **współpraca serwera i przeglądarki**.

Klient może jedynie próbować wykonać request.  
Przeglądarka dodaje `Origin`, robi ewentualny preflight i decyduje, czy odpowiedź oddać do JavaScriptu.  
Serwer deklaruje, komu ufa i na co się zgadza.

---

# 8. Dwa tryby CORS: simple requests i requests z preflight

To jest fundament praktyki.

## 8.1. Simple request

To request, który z perspektywy przeglądarki nie jest niczym szczególnym.

Najczęściej:

- `GET`
- `HEAD`
- `POST`

oraz tylko określone typy nagłówków i proste `Content-Type`, np.:

- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`

W takim przypadku przeglądarka zwykle:

1. wysyła request,
2. dołącza `Origin`,
3. odbiera odpowiedź,
4. sprawdza `Access-Control-Allow-Origin`,
5. decyduje, czy oddać odpowiedź JS.

Bardzo ważne:

> W simple requests request często wykona się nawet wtedy, gdy odpowiedź nie będzie dostępna dla JS.

To właśnie dlatego brak poprawnego CORS **nie oznacza**, że nie może dojść do skutku akcja zmieniająca stan aplikacji.

## 8.2. Request z preflight

Jeżeli request nie jest prosty, browser robi dodatkowy krok: **preflight**.

To jest zapytanie `OPTIONS`, które leci **przed** właściwym requestem.

Dzieje się tak najczęściej, gdy używasz:

- `PUT`
- `PATCH`
- `DELETE`
- `Content-Type: application/json`
- `Authorization`
- niestandardowych nagłówków typu `X-*`

Wtedy przeglądarka pyta serwer:

- czy ten origin jest OK,
- czy ta metoda jest OK,
- czy te nagłówki są OK,
- czy mogę w ogóle wykonać właściwy request.

Dopiero jeśli odpowiedź na preflight jest pozytywna, przeglądarka wyśle finalny request.

To jest bardzo ważna różnica:

- simple request może się wykonać, a browser tylko ukryje odpowiedź,
- request z preflight może zostać zatrzymany **przed wykonaniem właściwego żądania**.

---

# 9. Najważniejsze nagłówki CORS

Nie chodzi o to, żeby znać je jak listę słówek. Trzeba rozumieć semantykę.

## 9.1. `Origin`

Nagłówek wysyłany przez przeglądarkę.  
Mówi serwerowi, z jakiego originu pochodzi strona próbująca wykonać request.

To klucz do całego modelu.

## 9.2. `Access-Control-Allow-Origin`

Najważniejszy nagłówek odpowiedzi.

Mówi przeglądarce:
**czy temu originowi wolno dostać odpowiedź**

Może zawierać:

- konkretny origin,
- `*`

I tutaj zaczyna się większość problemów praktycznych.

## 9.3. `Access-Control-Allow-Credentials`

Mówi, czy browser może udostępniać odpowiedź requestom, które idą z credentials, np. z cookies.

To jest nagłówek bardzo wrażliwy.  
W połączeniu ze złą walidacją originu robi się bardzo niebezpiecznie.

## 9.4. `Access-Control-Allow-Methods`

Używany głównie przy preflight.  
Mówi, jakie metody są dozwolone.

## 9.5. `Access-Control-Allow-Headers`

Również głównie przy preflight.  
Mówi, jakie niestandardowe nagłówki są dozwolone.

## 9.6. `Access-Control-Expose-Headers`

Pozwala udostępnić JS-owi dodatkowe nagłówki odpowiedzi, poza małą domyślną listą.

## 9.7. `Access-Control-Max-Age`

Pozwala przeglądarce cache’ować wynik preflight.

## 9.8. `Vary: Origin`

Nie jest nagłówkiem CORS samym w sobie, ale z perspektywy bezpieczeństwa i poprawnego cachowania jest bardzo ważny, jeśli odpowiedź zależy od originu.

---

# 10. Credentials: moment, w którym CORS staje się naprawdę wrażliwy

Tu zaczyna się najciekawsza część dla pentestera.

Jeżeli aplikacja działa na cookies albo innych danych uwierzytelniających dostępnych w browserze, kluczowe staje się pytanie:

> czy zły origin może nie tylko wykonać request, ale wykonać go w kontekście zalogowanej ofiary i przeczytać odpowiedź?

To już jest bardzo poważna sytuacja.

Żeby taki scenariusz działał, zwykle muszą zagrać razem:

- request z credentials po stronie klienta,
- `Access-Control-Allow-Credentials: true` po stronie serwera,
- poprawnie dopasowany `Access-Control-Allow-Origin`,
- odpowiedni model cookies i `SameSite`.

I właśnie dlatego nie każdy “CORS bug” ma ten sam ciężar.

Reflection ACAO bez wartościowych danych może być słaba.  
Reflection ACAO + `ACAC: true` + endpoint z danymi użytkownika to już zupełnie inna historia.

---

# 11. CORS nie jest ochroną przed CSRF

To trzeba powiedzieć wprost.

CORS nie zastępuje:

- tokenów CSRF,
- poprawnego modelu metod,
- ochrony stanu aplikacji,
- sensownego użycia `SameSite`.

Jeśli endpoint zmienia stan aplikacji i da się go wywołać prostym requestem cross-origin, to sam brak poprawnego CORS w odpowiedzi niczego nie naprawia.

Bo atakującego często nie interesuje odpowiedź.  
Interesuje go skuteczne wykonanie akcji.

To bardzo częsty błąd architektoniczny:

> “skoro browser blokuje odczyt odpowiedzi, to jesteśmy bezpieczni”

Nie, jeśli akcja już została wykonana.

---

# 12. Najczęstsze błędy konfiguracji CORS

To jest część, gdzie teoria zamienia się w praktykę ofensywną.

## 12.1. `Access-Control-Allow-Origin: *`

To najczęściej pierwszy sygnał, ale nie zawsze największy problem.

Gwiazda oznacza:
“każdy origin może czytać odpowiedź”

Ale przeglądarki nie pozwalają łączyć `*` z sensownym udostępnianiem odpowiedzi z credentials.

Czyli `*` bywa problemem, ale nie zawsze automatycznie oznacza pełny wyciek sesyjnych danych użytkownika.

Mimo to często jest objawem słabego modelu zaufania.

## 12.2. Blind origin reflection

To klasyczny poważny błąd.

Serwer bierze wartość z `Origin` i bez walidacji odsyła ją w `Access-Control-Allow-Origin`.

Czyli:

- wysyłasz `Origin: https://evil.attacker`
- serwer odpowiada `ACAO: https://evil.attacker`

Jeśli obok jest `Access-Control-Allow-Credentials: true`, to może to praktycznie oznaczać zniesienie granicy SOP dla danego endpointu.

## 12.3. Prefix bypass

Programista sprawdza:

- czy origin zaczyna się od `https://trusted.example.com`

i wpuszcza:

- `https://trusted.example.com.attacker.tld`

To bardzo typowy logiczny błąd.

## 12.4. Suffix bypass

Programista sprawdza:

- czy origin kończy się na `example.com`

i wpuszcza:

- `definitelynotexample.com`

Równie typowe.

## 12.5. Złe regexy

Nieescaped kropki, brak kotwic, zbyt szerokie wildcardy, zła obsługa portu lub schematu.

Regex wygląda “sprytnie”, ale praktycznie dopuszcza za dużo.

## 12.6. Akceptacja `Origin: null`

To nie jest abstrakcja.

Pewne konteksty browsera mogą wysyłać `Origin: null`.  
Jeżeli backend ufa `null`, to trzeba to traktować poważnie i sprawdzać praktyczny exploitability.

## 12.7. Zbyt szerokie zaufanie do subdomen lub partnerów

Jeżeli aplikacja ufa:

- `*.example.com`
- systemom partnera
- starym subdomenom
- zewnętrznym usługom

to w praktyce bezpieczeństwo twojego CORS zaczyna zależeć od bezpieczeństwa wszystkich tych systemów.

A to bardzo często jest zły układ.

---

# 13. CORS nie istnieje sam. Obok niego są inne ścieżki cross-origin

To jest bardzo ważne, bo zamknięcie jednego kanału nie oznacza jeszcze szczelności całego modelu.

## 13.1. JSONP

Stary hack oparty o `<script src=...>`.  
Działał, bo skrypty można było ładować cross-origin.

Dzisiaj to raczej legacy niż dobry wzorzec.

## 13.2. `window.postMessage`

Legalny mechanizm komunikacji między oknami i ramkami.

Bezpieczny tylko wtedy, gdy:

- poprawnie ograniczasz target origin,
- poprawnie weryfikujesz origin nadawcy.

## 13.3. Proxy po stronie serwera

Bardzo praktyczne, ale łatwo zamienić je w SSRF, jeśli bierze dowolny URL bez sensownej walidacji.

## 13.4. WebSockets

Nie podlegają SOP w takim samym modelu jak klasyczne fetch/XHR.  
To daje elastyczność, ale też tworzy własne powierzchnie ataku.

---

# 14. XS-Leaks: nawet gdy nie czytasz odpowiedzi, możesz nadal wyciągać informacje

To jeden z najciekawszych fragmentów całego tematu.

Brak pełnego odczytu odpowiedzi nie oznacza jeszcze braku wycieku.  
Czasem wystarczy wyciągnąć:

- czas odpowiedzi,
- rozmiar odpowiedzi,
- sukces lub porażkę operacji,
- liczbę elementów renderowanych po stronie UI,
- różnice zachowania,
- cechy cache.

To jest świat **Cross-Site Leaks**.

Czyli:

> nawet jeśli SOP i CORS blokują ci bezpośredni odczyt body, nadal możesz czasem dostać informację pośrednią

I właśnie dlatego testowanie cross-origin nie kończy się na samym “czy `response.text()` działa”.

---

# 15. Jak myśleć o CORS ofensywnie

To jest najważniejsza zmiana mindsetu.

Nie pytaj:
“czy jest nagłówek?”

Pytaj:

- czy odpowiedź ma wartość,
- czy browser odda ją JS-owi,
- czy request idzie z kontekstem ofiary,
- czy ten trust boundary ma sens,
- czy można to zchainować z XSS, CSRF, takeoverem, cache albo XS-Leaks.

W praktyce interesują cię głównie cztery scenariusze:

## 15.1. Cross-origin read

Obcy origin może przeczytać odpowiedź.

## 15.2. Cross-origin read z credentials

Obcy origin może przeczytać odpowiedź w kontekście zalogowanej ofiary.

## 15.3. Cross-origin state change

Odpowiedź może nie być czytelna, ale akcja i tak się wykona.

## 15.4. Pivot przez trusted origin

Nie atakujesz głównej aplikacji bezpośrednio. Atakujesz origin, któremu ona ufa.

---

# 16. Jak oceniać wagę problemu

Nie każdy CORS finding jest dobry.

## Słaby sygnał

- publiczny endpoint,
- `ACAO: *`,
- brak credentials,
- brak danych wrażliwych,
- brak realnego scenariusza nadużycia.

## Sensowny finding

- odpowiedź zawiera wartościowe dane,
- niezaufany origin może je czytać,
- da się to potwierdzić w browserze.

## Mocny finding

- odpowiedź jest zależna od sesji ofiary,
- działa z credentials,
- można odczytać prywatne dane użytkownika.

## Bardzo mocny finding

- reflection lub bypass walidacji,
- `ACAC: true`,
- prosty PoC,
- minimalna interakcja ofiary,
- wysoka wartość biznesowa danych.

Severity nie bierze się z samego nagłówka.  
Severity bierze się z połączenia:

- danych,
- kontekstu użytkownika,
- łatwości eksploatacji,
- prostoty PoC,
- wartości biznesowej.

---

# 17. Finalny model myślenia

Jeżeli miałbyś zapamiętać tylko kilka rzeczy, to dokładnie te:

- SOP izoluje originy.
- CORS to kontrolowany wyjątek od tej izolacji.
- Request cross-origin może polecieć nawet bez możliwości odczytu odpowiedzi.
- CORS nie zastępuje autoryzacji ani ochrony przed CSRF.
- XSS działa wewnątrz zaufanego originu i przez to niszczy granicę same-origin.
- Zły CORS to zwykle nie “hack browsera”, tylko błąd zaufania po stronie serwera.
- Najciekawsze przypadki to te z credentials, danymi użytkownika i prostym browser PoC.
- Nawet bez pełnego read access nadal mogą istnieć XS-Leaks i inne kanały boczne.

To jest prawdziwy rdzeń tematu.

---

# 18. Burp Lab: praktyczny playbook testowania CORS krok po kroku

To jest sekcja operacyjna.  
Nie po to, żeby bezmyślnie klikać.  
Po to, żeby mieć uporządkowany workflow i nie gubić sensu testu.

---

## 18.1. Cel Burp Laba

Masz odpowiedzieć na pięć pytań:

1. Czy endpoint reaguje na `Origin`?
2. Czy origin jest walidowany poprawnie czy odbijany?
3. Czy można czytać odpowiedź z obcego originu?
4. Czy da się to zrobić z credentials?
5. Czy to daje realny exploit czy tylko słaby sygnał?

---

## 18.2. Wybór celu

Najpierw wybierz request do wartościowego endpointu.

Najlepsze cele:

- `/api/me`
- `/api/profile`
- `/api/account`
- `/api/billing`
- `/api/admin/*`
- `/api/user/*`
- endpointy z JSON-em i danymi użytkownika
- endpointy dostępne tylko po zalogowaniu

Słabe cele:

- publiczne assety,
- favicon,
- publiczny config bez wartości,
- analytics,
- endpointy bez danych istotnych biznesowo.

**Zasada:** najpierw wartość odpowiedzi, potem CORS.

---

## 18.3. Test bazowy

Wyślij request normalnie i zapisz odpowiedź bazową.

Patrz:

- status code,
- czy endpoint wymaga sesji,
- jakie dane zwraca,
- czy są już jakieś nagłówki CORS.

To twój punkt odniesienia.

---

## 18.4. Test 1 – obcy origin

Dodaj:

```http
Origin: https://attacker.tld
```

Sprawdź odpowiedź.

Patrz na:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Expose-Headers`
- `Vary: Origin`

### Interpretacja

- brak ACAO: słaby sygnał dla read access, ale nie kończy tematu
- `ACAO: *`: sprawdź wartość danych i credentials
- `ACAO: https://attacker.tld`: bardzo ciekawy sygnał
- dynamiczna zmiana ACAO: drąż dalej

---

## 18.5. Test 2 – reflection

Wyślij kilka requestów z różnymi originami:

```http
Origin: https://attacker.tld
Origin: https://random-123.attacker.tld
Origin: https://totally-not-trusted.example
```

Jeżeli backend za każdym razem odbija twoją wartość do `ACAO`, masz bardzo mocny sygnał blind reflection.

To jeszcze nie jest końcowy exploit.
Teraz sprawdzasz, czy:

- endpoint ma wartość,
- działa z credentials,
- browser da JS-owi czytać odpowiedź.

---

## 18.6. Test 3 – `Origin: null`

Wyślij:

```http
Origin: null
```

Jeżeli backend odpowiada:

```http
Access-Control-Allow-Origin: null
```

odnotuj to jako ważny sygnał.

Dalsze pytania:

- czy to działa na wartościowym endpointcie,
- czy działa z credentials,
- czy da się zbudować realny browser PoC.

---

## 18.7. Test 4 – prefix bypass

Podejrzewasz `startsWith`? Testuj:

```http
Origin: https://trusted.example.com.attacker.tld
Origin: https://example.com.attacker.tld
```

Jeżeli backend to wpuszcza, masz logiczny bypass walidacji originu.

---

## 18.8. Test 5 – suffix bypass

Podejrzewasz `endsWith`? Testuj:

```http
Origin: https://notexample.com
Origin: https://definitelynottrustedexample.com
```

Jeżeli backend akceptuje takie hosty, to kolejny klasyczny bypass.

---

## 18.9. Test 6 – regex bypass

Jeżeli polityka wygląda na “inteligentną”, spróbuj zachowań sugerujących zły regex:

- hosty podobne do zaufanego,
- warianty z dodatkowym znakiem zamiast kropki,
- warianty z innym portem,
- warianty z podobnym prefiksem lub sufiksem,
- warianty z nieoczywistą subdomeną.

Tu nie ma jednej magicznej listy.
Tu chodzi o myślenie jak człowiek, który napisał regex na szybko i źle.

---

## 18.10. Test 7 – preflight

Weź endpoint, który używa:

- `PUT`
- `PATCH`
- `DELETE`
- `Content-Type: application/json`
- `Authorization`
- custom header

I sprawdź, czy przeglądarka wykona preflight.

W Burpie lub przeglądarce szukasz odpowiedzi na `OPTIONS` z:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

### Pytania

- czy preflight przechodzi,
- czy backend pozwala na metodę,
- czy backend pozwala na custom header,
- czy finalny request potem naprawdę idzie,
- czy odpowiedź finalna też ma poprawne ACAO.

Bardzo ważne: sam pozytywny preflight nie oznacza jeszcze pełnego exploita.

---

## 18.11. Test 8 – credentials

To jest kluczowy test dla mocnych findingów.

Sprawdzasz, czy w odpowiedzi jest:

```http
Access-Control-Allow-Credentials: true
```

Następnie walidujesz w przeglądarce, czy:

- request rzeczywiście idzie z cookies,
- odpowiedź jest czytelna dla JS,
- działa to na zalogowanej ofierze.

To odróżnia “ciekawy sygnał” od “prawdziwego problemu z wyciekiem danych”.

---

## 18.12. Test 9 – `Access-Control-Expose-Headers`

Jeżeli endpoint zwraca niestandardowe nagłówki, sprawdź, czy są expose’owane.

Szukaj rzeczy takich jak:

- custom identyfikatory,
- debug headers,
- tokeny,
- linki do dalszych zasobów,
- metadane przydatne do chaina.

To rzadziej będzie główny finding, ale często wzmacnia obraz problemu.

---

## 18.13. Test 10 – `Vary: Origin`

Jeżeli odpowiedź zmienia się zależnie od `Origin`, a nie ma:

```http
Vary: Origin
```

odnotuj temat.

To istotne zwłaszcza wtedy, gdy odpowiedź jest cachowana i polityka zaufania zależy od nagłówka requestu.

Nie zawsze da z tego łatwy exploit, ale bezpieczeństwowo to ważny detal.

---

# 19. Browser PoC Lab

Burp daje sygnał.
Browser PoC daje dowód.

Do finalnego potwierdzenia chcesz prostą stronę hostowaną na swoim originie, która:

- robi request do celu,
- ustawia credentials, jeśli to konieczne,
- próbuje odczytać odpowiedź,
- wyświetla wynik lub eksfiltruje go dalej.

### Minimalny flow PoC

1. Hostujesz plik HTML na `https://attacker.tld`
2. W JS robisz request do `https://target.tld/api/me`
3. Jeśli trzeba, używasz `credentials`
4. Czytasz body odpowiedzi
5. Wyświetlasz wynik albo wysyłasz go na swój listener

Dopiero taki test mówi ci uczciwie:
**czy browser naprawdę dał ci dane**

---

# 20. Jak odsiać false positive w Burp Labie

To jest bardzo ważne.

## False positive 1

`ACAO: *` na publicznym endpointcie.

Najczęściej noise albo niski finding.

## False positive 2

Reflection originu, ale odpowiedź nic nie wnosi.

Sygnał ciekawy, ale impact może być słaby.

## False positive 3

Pozytywna odpowiedź serwera, ale browser nie daje odczytu.

Bez browser validation nie domykaj wniosku.

## False positive 4

Request się wykonuje, ale to nie read access.

To może być CSRF, a nie klasyczny CORS read bug.

## False positive 5

Test wyłącznie cURL-em.

To nie jest dowód zachowania browsera.

---

# 21. Jak opisywać finding po teście

Dobry finding CORS powinien zawierać:

- podatny endpoint,
- zły origin, który został zaakceptowany,
- czy działa reflection albo bypass walidacji,
- czy działa z credentials,
- jakie dane dało się odczytać,
- jaki jest warunek ataku,
- prosty scenariusz nadużycia.

Zamiast pisać:

> “Possible CORS misconfiguration may allow bypassing same-origin policy”

pisz:

> Endpoint `/api/profile` akceptuje dowolny nagłówek `Origin` i odzwierciedla go w `Access-Control-Allow-Origin`. W połączeniu z `Access-Control-Allow-Credentials: true` umożliwia to stronie atakującego odczyt danych profilu zalogowanej ofiary po samym odwiedzeniu złośliwej strony.

To jest konkret.
To jest zrozumiałe.
To jest raportowalne.

---

# 22. Finalna checklista operacyjna

Przy każdym sensownym teście CORS zadaj sobie te pytania:

- Czy endpoint ma wartość?
- Czy odpowiedź zależy od sesji ofiary?
- Czy backend reaguje na `Origin`?
- Czy origin jest odbijany?
- Czy credentials są dozwolone?
- Czy browser odda odpowiedź JS-owi?
- Czy request jest simple czy z preflight?
- Czy walidacja wygląda na stringową?
- Czy `null` jest akceptowany?
- Czy trusted origin może być podatny, takeoverable lub legacy?
- Czy da się zbudować prosty browser PoC?
- Czy to samodzielny bug czy dobry chain z XSS, CSRF lub XS-Leaks?

Jeśli nie masz odpowiedzi na większość z tych pytań, test jeszcze się nie skończył.

---

# 23. Podsumowanie

Same-Origin Policy to jedna z najważniejszych granic bezpieczeństwa całego weba.

CORS nie jest jej zaprzeczeniem.
CORS to kontrolowany sposób powiedzenia przeglądarce:

> “temu originowi pozwalam czytać moje odpowiedzi”

Problem zaczyna się wtedy, gdy to zaufanie jest:

- zbyt szerokie,
- źle walidowane,
- oparte o reflection,
- połączone z credentials,
- rozszerzone na niebezpieczne subdomeny lub partnerów.

W praktyce ofensywnej CORS nie testuje się jak checklisty nagłówków.
CORS testuje się jak **granicę zaufania między originami**.

Dobry tester nie pyta:
**“czy aplikacja ma CORS?”**

Dobry tester pyta:
**“czy moja strona może sprawić, że przeglądarka zalogowanej ofiary odda mi dane z obcej aplikacji, których nie powinienem zobaczyć?”**

I dokładnie do takiego poziomu trzeba dążyć.

Bo wtedy przestajesz tylko analizować nagłówki.
Zaczynasz analizować **realny model bezpieczeństwa przeglądarki i aplikacji**.
