---
id: sql-injection-theory-understanding-the-problem
title: "SQL Injection: gdy dane wejściowe przestają być danymi, a zaczynają sterować logiką bazy"
team: red
domain: web-security
section: vulnerabilities
topic: sql-injection
type: knowledge
angle: attacker-mindset
sourceTrack: baw
tags: ["sqli", "injection", "database", "mysql", "postgresql", "mssql", "oracle", "web"]
difficulty: medium
shortDescription: "SQL Injection to nie tylko klasyczne 'OR 1=1'. To problem granicy zaufania między aplikacją a bazą danych. Żeby dobrze testować i dobrze bronić aplikacje, trzeba zrozumieć, kiedy wejście użytkownika staje się częścią składni zapytania i jak to zmienia logikę całego systemu."
updatedAt: "2026-04-21"
---

# SQL Injection: gdy dane wejściowe przestają być danymi, a zaczynają sterować logiką bazy

SQL Injection jest jedną z tych podatności, o których słyszał prawie każdy. Problem w tym, że bardzo wiele osób rozumie ją zbyt płytko.

Najczęściej kojarzy się z prostym scenariuszem: ktoś wpisuje specjalny ciąg znaków, baza danych „się sypie”, a atakujący wyciąga loginy i hasła. To jest tylko jeden z możliwych efektów. W rzeczywistości SQL Injection nie jest problemem “dziwnego payloadu”. To problem architektury aplikacji i błędnego modelu zaufania.

Sedno jest proste: aplikacja bierze dane od użytkownika i zamiast traktować je wyłącznie jako wartość, pozwala im wpłynąć na strukturę zapytania SQL. W tym momencie użytkownik nie podaje już tylko treści. Zaczyna współtworzyć logikę, którą baza danych wykona.

I właśnie dlatego SQL Injection jest tak groźne.

---

## O co tak naprawdę chodzi w SQL Injection

Aplikacja webowa bardzo często jest tylko warstwą pośrednią między użytkownikiem a bazą danych. Użytkownik wysyła żądanie, aplikacja buduje zapytanie SQL, baza je wykonuje, a wynik wraca do użytkownika.

Dopóki dane wejściowe trafiają do zapytania jako **dane**, wszystko jest pod kontrolą.

Problem zaczyna się wtedy, gdy trafiają do zapytania jako **fragment składni**.

To kluczowa różnica.

Jeżeli programista buduje zapytanie przez konkatenację stringów, np. dokleja wartość z parametru do tekstu zapytania, to granica między kodem SQL a danymi użytkownika przestaje być twarda. Baza nie wie, gdzie kończy się bezpieczna wartość, a gdzie zaczyna instrukcja, operator logiczny, komentarz albo kolejne zapytanie.

W praktyce oznacza to, że atakujący może:

- zmienić logikę warunków `WHERE`,
- wpłynąć na liczbę zwracanych rekordów,
- odczytać dane z innych tabel,
- wygenerować kontrolowany błąd,
- wymusić opóźnienie odpowiedzi,
- w niektórych sytuacjach doprowadzić do modyfikacji danych, odczytu plików, zapisu plików lub wykonania poleceń systemowych.

SQL Injection nie polega więc na “wpisaniu apostrofu”. Apostrof jest tylko narzędziem. Istotą problemu jest to, że wejście użytkownika dostaje możliwość współdecydowania o tym, **jakie zapytanie wykona baza**.

---

## Skąd bierze się ta podatność

Najczęściej z bardzo prostego błędu projektowego: programista ręcznie składa zapytanie SQL z fragmentów tekstu.

To wygląda niewinnie. Aplikacja ma wyszukiwarkę, filtr, sortowanie, formularz logowania albo panel administracyjny. Ktoś bierze wartość z parametru, dokleja ją do stringa i wysyła do bazy.

W teorii miało powstać coś w rodzaju:

- “znajdź użytkownika o takim loginie”,
- “pokaż posty zawierające dane słowo”,
- “posortuj wynik po wybranej kolumnie”.

Ale jeśli wejście nie zostało odseparowane od składni, to użytkownik może zacząć sterować nie tylko wartością, ale całym warunkiem logicznym.

Wtedy aplikacja przestaje zadawać własne pytania bazie. Zaczyna wykonywać pytania, które częściowo napisał atakujący.

---

## Dlaczego SQL Injection jest tak niebezpieczne

Bo uderza w samą logikę aplikacji.

W wielu innych podatnościach atakujący wykorzystuje błąd w walidacji, brak nagłówka bezpieczeństwa albo niewłaściwe uprawnienia. W SQL Injection problem jest głębszy: aplikacja sama przekazuje sterowanie w miejsce, które powinno pozostać nienaruszalne.

To daje bardzo szerokie skutki, bo baza danych często jest centralnym źródłem prawdy dla całego systemu.

W bazie znajdują się nie tylko rekordy biznesowe. Bardzo często są tam też:

- dane użytkowników,
- hashe haseł,
- adresy e-mail,
- tokeny resetu hasła,
- identyfikatory sesji,
- ustawienia aplikacji,
- ścieżki do plików,
- sekrety integracyjne,
- informacje o rolach i uprawnieniach.

Jeżeli ktoś przejmie kontrolę nad zapytaniami, może nie tylko “czytać tabelę”. Może realnie wpływać na bezpieczeństwo całego systemu.

---

## Najważniejszy model myślenia: dane kontra kod

Żeby dobrze rozumieć SQL Injection, trzeba myśleć w bardzo prosty sposób:

**Czy wejście użytkownika jest traktowane jako wartość, czy jako część języka zapytań?**

Jeżeli jako wartość, to baza widzi np. tekst `"John"`.

Jeżeli jako część składni, to baza może zobaczyć coś w rodzaju:

- zakończenia stringa,
- dodatkowego warunku logicznego,
- komentarza,
- nazwy kolumny,
- podzapytania,
- funkcji bazodanowej,
- drugiego zapytania.

Od tego momentu problem nie jest już “po stronie formularza”. Problem jest po stronie parsera SQL, który interpretuje wejście jako polecenie.

To właśnie odróżnia zwykły input od SQL Injection.

---

## Co atakujący chce osiągnąć

Wbrew popularnemu uproszczeniu, celem nie zawsze jest dump całej bazy.

Atakujący może chcieć różnych rzeczy, zależnie od kontekstu aplikacji:

### 1. Odczytać dane

Najbardziej klasyczny cel. Dane użytkowników, hashe, dane osobowe, dane medyczne, numery kart, tokeny, konfigurację.

### 2. Ominąć logowanie

Jeżeli mechanizm uwierzytelnienia opiera się na wyniku zapytania do bazy, ingerencja w to zapytanie może doprowadzić do zalogowania bez znajomości hasła.

### 3. Zmienić dane

Jeżeli środowisko pozwala na wykonywanie wielu zapytań albo aplikacja korzysta z nadmiarowych uprawnień, możliwa bywa zmiana rekordów, reset haseł, manipulacja stanem kont czy danymi biznesowymi.

### 4. Wykorzystać bazę jako pivot

SQL Injection może być tylko pierwszym krokiem. Z bazy można wydobyć sekrety, ścieżki, konfigurację, dane do innych systemów, a czasem nawet doprowadzić do odczytu lub zapisu plików na serwerze.

### 5. Uzyskać wykonanie kodu

To nie jest najczęstszy efekt, ale w złych konfiguracjach albo przy bardzo wysokich uprawnieniach bazy jest realny.

---

## Główne rodzaje SQL Injection i czym się różnią

To jest miejsce, które warto zrozumieć naprawdę dobrze. Nie po to, żeby pamiętać payloady, ale żeby wiedzieć, **jaki kanał informacji daje aplikacja**.

Bo rodzaj SQL Injection zależy głównie od tego, **co aplikacja zwraca atakującemu**.

---

## UNION-based: gdy aplikacja pokazuje dane z zapytania

To najszybszy i najbardziej komfortowy scenariusz dla atakującego.

Jeżeli wynik zapytania trafia do odpowiedzi HTTP w czytelnej formie, można próbować dołożyć własny `SELECT` i połączyć go z oryginalnym wynikiem za pomocą `UNION`.

W praktyce oznacza to:

- oryginalne zapytanie pobiera jakieś dane z tabeli aplikacji,
- atakujący dopisuje własne zapytanie,
- odpowiedź zaczyna zawierać dane, których aplikacja nigdy nie miała pokazać.

To działa tylko wtedy, gdy da się dopasować strukturę obu części zapytania: liczbę kolumn i ich zgodność typów.

Dlatego UNION-based SQL Injection jest szybkie, ale wymaga, żeby aplikacja spełniała kilka warunków:

- zwracała dane z bazy w odpowiedzi,
- pozwalała dołączyć własny `SELECT`,
- nie blokowała tego przez sposób budowania zapytania.

Myślowo jest to najprostsze SQL Injection: “wstrzyknij własny odczyt danych i spraw, żeby aplikacja sama go wyświetliła”.

---

## ERROR-based: gdy błędy zdradzają informacje

Jeżeli aplikacja lub serwer pokazuje szczegółowe komunikaty błędów z bazy danych, można to wykorzystać jako kanał wycieku.

Tu nie chodzi o to, że sam błąd “potwierdza podatność”. Chodzi o coś mocniejszego: pewne operacje można tak skonstruować, żeby treść błędu zawierała interesującą nas wartość.

Czyli nie wyciągamy danych z normalnego wyniku zapytania. Wyciągamy je z komunikatu diagnostycznego.

To jest bardzo ważna lekcja praktyczna: **błąd nie musi być tylko sygnałem. Może być kanałem eksfiltracji**.

ERROR-based SQL Injection zwykle działa szybko, ale wymaga jednego krytycznego warunku: aplikacja musi ujawniać użytkownikowi szczegóły błędów.

Jeżeli środowisko jest poprawnie utwardzone, ten kanał zwykle znika.

---

## BLIND content-based: gdy aplikacja nie pokazuje danych, ale pokazuje różnicę w zachowaniu

To jeden z najważniejszych wariantów do zrozumienia.

W blind SQL Injection aplikacja nie zwraca wprost danych z bazy i nie pokazuje błędów, ale nadal da się rozpoznać, czy pewien warunek logiczny był prawdziwy czy fałszywy.

Przykładowo odpowiedź może się różnić przez:

- liczbę zwróconych rekordów,
- obecność albo brak wyniku,
- inny status aplikacyjny,
- zmianę fragmentu HTML,
- różnicę w długości odpowiedzi,
- pojawienie się lub zniknięcie konkretnego elementu.

To wystarcza.

Jeżeli da się odróżnić “prawda” od “fałsz”, to da się zadawać bazie serię pytań binarnych. A jeśli da się zadawać pytania binarne, to da się wydobywać dane znak po znaku.

To brzmi powoli, i rzeczywiście takie jest, ale to bardzo potężny model.

Blind SQL Injection pokazuje fundamentalną prawdę o bezpieczeństwie: **do wycieku danych nie zawsze trzeba widzieć dane bezpośrednio. Czasem wystarczy móc obserwować efekt warunku logicznego.**

---

## BLIND time-based: gdy jedyną odpowiedzią jest czas

To wariant jeszcze bardziej pośredni.

Są sytuacje, w których aplikacja:

- nie pokazuje błędów,
- nie zmienia treści odpowiedzi,
- nie ujawnia różnic w liczbie rekordów,
- ale nadal wykonuje zapytanie podatne na manipulację.

Wtedy jedynym kanałem może być czas.

Jeżeli uda się zbudować warunek typu:

- gdy prawda → odpowiedź opóźniona,
- gdy fałsz → odpowiedź szybka,

to da się wydobywać dane na podstawie pomiaru czasu odpowiedzi.

To jest wolne, podatne na zakłócenia i zwykle bardziej męczące, ale bywa jedyną drogą.

Najważniejsza rzecz do zrozumienia: time-based SQL Injection nie polega na “spowalnianiu serwera dla zabawy”. To precyzyjne użycie opóźnienia jako kanału informacji.

---

## Stacked queries: gdy wstrzyknięcie pozwala wykonać więcej niż jedno zapytanie

To jeden z najgroźniejszych scenariuszy.

W niektórych konfiguracjach wstrzyknięcie nie kończy się na modyfikacji pojedynczego `SELECT`. Da się dołączyć kolejne zapytanie i sprawić, że baza wykona je osobno.

W tym momencie atak przestaje być tylko odczytem danych.

Pojawia się możliwość:

- `UPDATE`,
- `DELETE`,
- `INSERT`,
- tworzenia tabel,
- odczytu lub zapisu plików,
- wywoływania procedur,
- a czasem nawet działań prowadzących do wykonania poleceń systemowych.

To już nie jest tylko manipulacja logiką wyszukiwania. To może być pełna ingerencja w stan systemu.

Dlatego stacked queries dramatycznie zwiększają wpływ podatności.

---

## Dlaczego różne silniki baz danych mają znaczenie

SQL Injection nie wygląda identycznie wszędzie.

To samo zjawisko występuje w MySQL, PostgreSQL, Microsoft SQL Server czy Oracle, ale szczegóły różnią się bardzo mocno. Różnić się mogą:

- komentarze,
- operatory konkatenacji,
- funkcje zwracające wersję bazy,
- funkcje opóźniające wykonanie zapytania,
- podejście do zgodności typów,
- dostępność funkcji odczytu lub zapisu plików,
- procedury umożliwiające wykonanie poleceń systemowych,
- nazwy tabel systemowych i metadanych.

To ważna lekcja praktyczna: SQL Injection to nie jeden exploit. To klasa problemu, która materializuje się trochę inaczej zależnie od silnika.

Dlatego dobry tester nie myśli: “znam payload na SQL Injection”.
Dobry tester myśli: “rozumiem, jaki silnik stoi z tyłu, jakie są jego cechy i jaki kanał odpowiedzi mam do dyspozycji”.

---

## SQL Injection to nie tylko parametr GET albo POST

To bardzo częsty błąd początkujących: szukają SQL Injection tylko w formularzu albo w query stringu.

Tymczasem aplikacja może pobierać dane do zapytania SQL praktycznie z dowolnego miejsca żądania HTTP albo z danych już wcześniej zapisanych.

W praktyce wejściem dla SQL Injection mogą być:

- parametry GET,
- parametry POST,
- JSON body,
- ciasteczka,
- nagłówki HTTP,
- nazwy pól,
- wartości wykorzystywane do sortowania,
- identyfikatory filtrów,
- dane przechowywane wcześniej w bazie.

To prowadzi do bardzo ważnego pojęcia.

---

## Second-order SQL Injection: gdy ładunek nie wykonuje się od razu

To jeden z najbardziej zdradliwych wariantów.

W second-order SQL Injection szkodliwy input zostaje najpierw zapisany przez aplikację w sposób, który może wyglądać zupełnie bezpiecznie. Dopiero później, w innym miejscu kodu, ta wartość zostaje ponownie użyta do zbudowania nowego zapytania SQL - i dopiero wtedy dochodzi do podatności.

Czyli:

- krok pierwszy: dane trafiają do bazy,
- krok drugi: aplikacja ufa tym danym, bo “przecież pochodzą z naszej bazy”,
- krok trzeci: dane zostają użyte jako składnik kolejnego zapytania,
- krok czwarty: uruchamia się SQL Injection.

To świetnie pokazuje, że dane zapisane wcześniej w systemie nie stają się automatycznie zaufane. Źródło nadal może być kontrolowane przez użytkownika.

Second-order SQL Injection jest trudniejsze do znalezienia, bo nie daje efektu w tym samym żądaniu, w którym został wprowadzony payload. Trzeba myśleć przepływem danych przez aplikację, a nie tylko pojedynczym requestem.

---

## Jakie mogą być skutki SQL Injection

To miejsce warto czytać nie jak listę “możliwości ataku”, ale jak mapę ryzyka biznesowego i technicznego.

### Odczyt danych

Najbardziej oczywisty skutek. Ujawnienie danych użytkowników, haseł, rekordów biznesowych, danych regulowanych.

### Ominięcie uwierzytelnienia

Jeżeli logika logowania zależy od wyniku podatnego zapytania, można zalogować się bez prawidłowych poświadczeń.

### Modyfikacja danych

Zmiana haseł, ról, stanów kont, rekordów finansowych, konfiguracji.

### Usunięcie danych

Usunięcie tabel, rekordów, całej bazy lub innych krytycznych elementów.

### Odczyt plików z serwera

Jeżeli silnik i uprawnienia na to pozwalają, baza może stać się kanałem czytania systemu plików.

### Zapis plików

W niektórych konfiguracjach możliwe jest zapisanie pliku na serwerze, co może prowadzić do web shelli lub trwałych backdoorów.

### Wykonanie poleceń systemowych

Najgroźniejszy scenariusz. Zwykle wymaga wysokich uprawnień, niebezpiecznych funkcji albo bardzo złej konfiguracji, ale realnie występuje.

Najważniejszy wniosek jest taki:
**wpływ SQL Injection zależy nie tylko od samego błędu w aplikacji, ale też od uprawnień użytkownika bazy, konfiguracji silnika, dostępnych funkcji oraz architektury całego środowiska.**

---

## Dlaczego “OR 1=1” to za mało, żeby rozumieć SQL Injection

`OR 1=1` jest dobrym symbolem edukacyjnym, ale fatalnym uproszczeniem, jeśli ktoś chce naprawdę zrozumieć temat.

Bo sugeruje, że SQL Injection to jeden trick.

A to nieprawda.

W praktyce trzeba rozumieć:

- kontekst wstrzyknięcia,
- typ budowanego zapytania,
- sposób zamykania stringa,
- komentarze i nawiasy,
- różnice między silnikami,
- zachowanie aplikacji przy błędach,
- możliwość użycia `UNION`,
- dostępność kanałów blind,
- prawa użytkownika bazy,
- rolę metadanych i tabel systemowych,
- możliwość pivotu do systemu operacyjnego.

Jeżeli ktoś zna tylko `OR 1=1`, to zna mem, nie podatność.

---

## Jak myśleć o wykrywaniu SQL Injection

Na etapie teorii najważniejsze nie są jeszcze konkretne payloady, tylko sposób obserwacji.

Wykrywanie SQL Injection polega na sprawdzaniu, czy kontrolowany przez użytkownika input wpływa na:

- składnię zapytania,
- logikę zapytania,
- wynik zapytania,
- treść błędów,
- czas odpowiedzi.

Czyli nie pytasz tylko: “czy ten payload działa?”
Pytasz raczej:

- czy aplikacja reaguje inaczej na poprawną i niepoprawną składnię?
- czy wynik zmienia się zgodnie z prawdą i fałszem?
- czy wejście wygląda, jakby było interpretowane przez SQL, a nie przez samą logikę aplikacji?
- czy miejsce wejścia jest wartością, nazwą kolumny, fragmentem sortowania, filtrem albo danymi używanymi ponownie później?

To jest różnica między strzelaniem payloadami a prawdziwą analizą.

---

## Dlaczego ochrona przed SQL Injection nie kończy się na jednym fixie

Najlepszą ochroną są zapytania parametryzowane. To fundament. Ale samo hasło “używaj prepared statements” nie wyczerpuje tematu.

Powód jest prosty: nie wszystkie miejsca w SQL da się zabezpieczyć w identyczny sposób.

Przykładowo wartości danych bardzo dobrze nadają się do parametryzacji, ale już dynamiczne nazwy kolumn w `ORDER BY` nie działają tak samo. W tych miejscach trzeba stosować inne mechanizmy, np. ścisłą listę dozwolonych wartości.

Dobre bezpieczeństwo przeciwko SQL Injection to więc połączenie kilku warstw:

### 1. Parametryzacja

Dane wejściowe trafiają jako dane, nie jako składnia.

### 2. Walidacja

Aplikacja sprawdza, czy wejście ma oczekiwany typ, format i zakres.

### 3. Bezpieczne obchodzenie się z dynamicznymi fragmentami zapytania

Takie miejsca jak sortowanie, nazwy kolumn czy kierunki sortowania muszą być ograniczone przez allowlistę.

### 4. Minimalne uprawnienia bazy

Nawet jeśli podatność się pojawi, jej wpływ powinien być ograniczony.

### 5. Hardening silnika i hosta

Wyłączenie niebezpiecznych funkcji, ograniczenie dostępu do plików, brak pracy na kontach administracyjnych, separacja uprawnień.

To jest ważne, bo realne bezpieczeństwo nie polega na wierze, że nikt się nie pomyli w kodzie. Polega na założeniu, że błąd może się zdarzyć i trzeba ograniczyć blast radius.

---

## Parametryzacja: dlaczego naprawdę działa

Warto to rozumieć głębiej niż tylko “bo OWASP tak mówi”.

Zapytanie parametryzowane działa dlatego, że rozdziela:

- strukturę zapytania,
- wartości przekazywane do tej struktury.

Najpierw definiowany jest szkielet zapytania.
Dopiero później konkretne wartości są podstawiane do przygotowanych miejsc jako dane, nie jako część parsera SQL.

To sprawia, że nawet jeśli użytkownik poda apostrof, operator logiczny albo komentarz, nie zostaną one zinterpretowane jako polecenie zmieniające logikę. Zostaną potraktowane jako literalna wartość parametru.

To nie jest filtr.
To nie jest blacklista.
To jest poprawne oddzielenie warstw.

I właśnie dlatego jest tak skuteczne.

---

## Dlaczego ORM nie rozwiązuje wszystkiego

To kolejny częsty mit: “mamy ORM, więc SQL Injection nas nie dotyczy”.

ORM bardzo pomaga, bo automatyzuje generowanie zapytań i zwykle promuje bezpieczny model pracy z danymi. Ale nie eliminuje problemu magicznie.

Jeżeli deweloper:

- buduje ręczne fragmenty zapytań,
- używa dynamicznych warunków bez walidacji,
- przechodzi do natywnego SQL,
- korzysta z języków zapytań specyficznych dla ORM,
- składa fragmenty query z danych użytkownika,

to podobny problem może wrócić pod inną postacią.

Wniosek jest prosty:
ORM zmniejsza powierzchnię ryzyka, ale nie zastępuje bezpiecznego myślenia.

---

## Hardening bazy danych: ostatnia linia obrony

To temat często pomijany przez developerów, a bardzo ważny z perspektywy bezpieczeństwa.

Aplikacja nigdy nie powinna łączyć się z bazą jako administrator, jeśli nie jest to absolutnie niezbędne. Uprawnienia powinny być minimalne i rozdzielone według potrzeb.

Jeżeli jedna część aplikacji ma tylko czytać posty, nie powinna automatycznie mieć możliwości:

- czytania tabel użytkowników,
- zapisu plików,
- uruchamiania procedur administracyjnych,
- wykonywania poleceń systemowych.

To zmienia bardzo dużo.

Bo nawet jeśli SQL Injection się pojawi, to skutki mogą zostać ograniczone do jednego obszaru zamiast rozlać się po całym środowisku.

Dobrze utwardzona baza danych nie usuwa przyczyny podatności, ale potrafi radykalnie zmniejszyć jej wpływ.

---

## Najważniejsze rzeczy, które trzeba zapamiętać

### 1. SQL Injection to problem granicy zaufania

Aplikacja przestaje rozróżniać dane użytkownika od składni SQL.

### 2. To nie jest tylko “błąd formularza”

To błąd w logice budowania zapytań i w architekturze przepływu danych.

### 3. Rodzaj ataku zależy od kanału odpowiedzi

Jeżeli widzisz dane - możliwy jest UNION.
Jeżeli widzisz błędy - możliwy jest ERROR-based.
Jeżeli widzisz różnicę prawda/fałsz - możliwy jest blind.
Jeżeli widzisz tylko opóźnienie - możliwy jest time-based.

### 4. SQL Injection może dawać więcej niż odczyt danych

Może prowadzić do obejścia logowania, modyfikacji rekordów, odczytu i zapisu plików, a w złych konfiguracjach nawet do wykonania kodu.

### 5. Różne silniki baz mają różne właściwości

Trzeba rozumieć backend technologiczny, a nie tylko pamiętać pojedyncze payloady.

### 6. Parametryzacja jest fundamentem

Ale nie rozwiązuje wszystkich dynamicznych fragmentów zapytania, takich jak `ORDER BY`.

### 7. Hardening nadal ma znaczenie

Minimalne uprawnienia i wyłączenie niebezpiecznych funkcji mogą uratować system nawet wtedy, gdy aplikacja ma podatność.

---

## Finalny mindset

SQL Injection nie jest sztuką wpisania magicznego ciągu znaków.

To analiza tego, gdzie aplikacja traci kontrolę nad tym, co jest **danymi**, a co jest **kodem wykonywanym przez bazę**.

Jeżeli rozumiesz tę granicę, zaczynasz inaczej patrzeć na aplikacje:

- inaczej oceniasz formularze,
- inaczej patrzysz na filtry,
- inaczej analizujesz sortowanie,
- inaczej rozumiesz logowanie,
- inaczej podchodzisz do danych zapisanych wcześniej w systemie.

I wtedy SQL Injection przestaje być “starym OWASP-owym klasykiem”.

Zaczyna być tym, czym naprawdę jest: jednym z najczystszych przykładów sytuacji, w której aplikacja sama oddaje atakującemu część swojej logiki decyzyjnej.

---

## Co dalej

Ta notatka jest celowo teoretyczna. Jej celem nie było nauczyć gotowych payloadów, tylko zbudować poprawny model myślenia.

Dopiero na tym fundamencie ma sens część praktyczna:

- jak rozpoznawać kontekst wstrzyknięcia,
- jak testować różne typy pól,
- jak odróżniać sygnał od przypadku,
- jak dobierać technikę do zachowania aplikacji,
- jak krok po kroku przechodzić od hipotezy do potwierdzenia.

Bo w praktyce SQL Injection nie wygrywa ten, kto zna najwięcej stringów.

Wygrywa ten, kto rozumie, **co aplikacja właśnie wysyła do bazy i dlaczego baza interpretuje to inaczej, niż chciał programista**.
