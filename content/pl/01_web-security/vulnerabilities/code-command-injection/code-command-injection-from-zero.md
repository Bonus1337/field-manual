---
id: code-command-injection-from-zero
title: "Code Injection i Command Injection: gdy aplikacja wykonuje coś, czego nigdy nie powinna wykonać"
team: red
domain: web-security
section: vulnerabilities
type: knowledge
angle: attacker-mindset
sourceTrack: baw
tags: ["injection", "rce", "lfi", "rfi", "webshell", "webdav", "xslt", "xml", "ssti"]
difficulty: easy
shortDescription: "Wprowadzenie do Code Injection i Command Injection od zera: czym się różnią, skąd się biorą, jak myśleć o tych podatnościach i dlaczego ich skutkiem może być pełne przejęcie serwera."
updatedAt: "2026-04-29"
---

# Code Injection i Command Injection: gdy aplikacja wykonuje coś, czego nigdy nie powinna wykonać

Są podatności, które pozwalają odczytać cudze dane.

Są podatności, które pozwalają zmienić cenę produktu, podejrzeć cudze zgłoszenie albo ominąć logikę aplikacji.

Ale są też takie podatności, które są znacznie groźniejsze, bo przekraczają granicę między:

> „wpływam na działanie aplikacji”

a

> „zaczynam wykonywać kod albo polecenia na serwerze”.

Do tej kategorii należą **Code Injection** i **Command Injection**.

To jedne z tych klas podatności, które początkującym mogą wydawać się magiczne. W praktyce nie ma tu magii. Jest tylko aplikacja, która w pewnym miejscu robi bardzo niebezpieczną rzecz:

**bierze dane od użytkownika i traktuje je jak instrukcję do wykonania.**

I właśnie to jest sedno problemu.

---

# Najprostszy model mentalny

Wyobraź sobie aplikację jako pracownika, który przyjmuje od użytkownika formularz.

Normalnie użytkownik powinien podać dane, na przykład:

```text
8.8.8.8
```

albo:

```text
contact.php
```

albo:

```text
Jan
```

Problem zaczyna się wtedy, gdy aplikacja nie traktuje tych danych jak zwykłego tekstu, tylko używa ich wewnątrz mechanizmu, który potrafi **wykonywać kod**, **uruchamiać polecenia systemowe** albo **dołączać pliki do działania aplikacji**.

Wtedy użytkownik może przestać być tylko użytkownikiem.

Może zacząć wpływać na to, co wykona serwer.

---

# Code Injection vs Command Injection

Te dwie podatności są podobne, ale nie są tym samym.

## Code Injection

**Code Injection** występuje wtedy, gdy atakujący może doprowadzić do wykonania kodu aplikacyjnego po stronie serwera.

Może to być na przykład kod:

```text
PHP
Python
JavaScript
Java
Ruby
```

Czyli problem nie polega na tym, że ktoś wpisuje tekst do formularza.

Problem polega na tym, że aplikacja ten tekst później interpretuje jako kod.

Przykładowy schemat błędu:

```php
eval($_GET["input"]);
```

Jeżeli parametr `input` pochodzi od użytkownika i nie jest bezpiecznie obsłużony, aplikacja może wykonać to, co użytkownik jej podał.

To tak, jakby aplikacja powiedziała:

> „Napisz mi kawałek kodu, a ja go uruchomię na serwerze”.

Brzmi absurdalnie?

Tak.

A jednak historycznie takie błędy pojawiały się w realnych aplikacjach.

---

## Command Injection

**Command Injection** występuje wtedy, gdy atakujący może doprowadzić do wykonania polecenia systemowego na serwerze.

Tutaj nie wstrzykujemy kodu PHP, Pythona czy Javy.

Tutaj próbujemy wpłynąć na komendę wykonywaną przez system operacyjny.

Na przykład aplikacja ma funkcję diagnostyczną, która wykonuje `ping`:

```php
shell_exec("ping -c 3 " . $_GET["host"]);
```

Programista zakłada, że użytkownik poda adres IP:

```text
8.8.8.8
```

Ale jeżeli aplikacja po prostu dokleja dane użytkownika do komendy systemowej, atakujący może spróbować zmienić znaczenie całego polecenia.

Czyli zamiast „spinguj ten adres”, serwer może dostać coś w stylu:

```text
spinguj ten adres, a potem wykonaj jeszcze inne polecenie
```

I to jest właśnie Command Injection.

---

# Najważniejsza różnica

Najprościej:

```text
Code Injection = wykonanie kodu aplikacyjnego
Command Injection = wykonanie komendy systemowej
```

Albo jeszcze prościej:

```text
Code Injection:
„Aplikacja wykonała kod, który jej podano.”

Command Injection:
„System operacyjny wykonał polecenie, które przeszło przez aplikację.”
```

W obu przypadkach skutki mogą być bardzo poważne, bo atakujący może uzyskać możliwość wykonywania operacji na serwerze.

Nie zawsze od razu jako `root`.

Częściej jako użytkownik, na którym działa aplikacja, na przykład:

```text
www-data
tomcat
apache
nginx
```

Ale nawet taki dostęp może wystarczyć do odczytu plików aplikacji, konfiguracji, sekretów, danych środowiskowych albo do dalszej eskalacji.

---

# Dlaczego te podatności są tak groźne?

Bo serwer aplikacji zwykle ma dostęp do rzeczy, których zwykły użytkownik nie powinien widzieć.

Może mieć dostęp do:

```text
kodu źródłowego aplikacji
plików konfiguracyjnych
zmiennych środowiskowych
kluczy API
haseł do bazy danych
plików użytkowników
wewnętrznych usług
sieci lokalnej
```

Jeżeli atakujący uzyska możliwość wykonywania kodu lub komend na serwerze, może próbować przejść z poziomu aplikacji do poziomu systemu.

Dlatego w raportach pentesterskich podatności prowadzące do RCE, czyli Remote Code Execution, bardzo często mają krytyczną wagę.

---

# Skąd się biorą Code Injection i Command Injection?

Najczęściej z jednego błędnego założenia:

> „Użytkownik poda dane w takim formacie, jakiego oczekujemy”.

To założenie jest niebezpieczne.

Aplikacja nie może ufać danym wejściowym.

Dane wejściowe to wszystko, co przychodzi z zewnątrz, na przykład:

```text
parametry URL
ciało żądania POST
nagłówki HTTP
ciasteczka
nazwy plików
zawartość uploadowanych plików
dane z formularzy
dane z API
dane importowane z XML, JSON, CSV
```

Z perspektywy bezpieczeństwa każda taka wartość jest potencjalnie kontrolowana przez użytkownika.

A jeżeli kontrolowana przez użytkownika wartość trafia później do niebezpiecznego mechanizmu, zaczyna się problem.

---

# Niebezpieczne miejsca w aplikacji

Szczególną uwagę trzeba zwracać na miejsca, gdzie aplikacja:

```text
wywołuje funkcje typu eval
uruchamia polecenia systemowe
dołącza pliki na podstawie parametru
przetwarza uploadowane pliki
przetwarza XML lub XSLT
korzysta z paneli administracyjnych
używa starych bibliotek
działa w trybie debug
```

To są miejsca, gdzie błąd walidacji może mieć znacznie większy wpływ niż zwykły bug.

---

# Wektor 1: eval, czyli klasyczny Code Injection

Funkcje typu `eval` są jednym z najbardziej oczywistych przykładów Code Injection.

Ich zadanie polega na tym, że przyjmują tekst i wykonują go jako kod.

W wielu językach istnieją podobne mechanizmy.

W PHP przykładem jest:

```php
eval()
```

W Pythonie:

```python
eval()
exec()
```

W JavaScripcie:

```javascript
eval();
Function();
```

Problem pojawia się wtedy, gdy do takiej funkcji trafia input użytkownika.

Przykład błędnego myślenia:

```text
Użytkownik poda tylko prostą wartość, więc możemy ją wykonać.
```

Bezpieczniejsze myślenie:

```text
Użytkownik może podać wszystko, więc nie wolno tego traktować jak kodu.
```

W praktyce stosowanie `eval` w aplikacjach webowych bardzo często jest sygnałem ostrzegawczym. Nie zawsze oznacza podatność, ale zawsze wymaga dokładnej analizy.

---

# Wektor 2: Command Injection przez polecenia systemowe

Command Injection pojawia się najczęściej tam, gdzie aplikacja wywołuje zewnętrzne programy zainstalowane na serwerze.

Przykłady takich operacji:

```text
pingowanie hosta
konwersja plików
generowanie PDF
obróbka obrazów
wywołanie grep/sed/cat
kompresowanie archiwów
uruchamianie skryptów pomocniczych
```

Sam fakt wywoływania polecenia systemowego nie musi być podatnością.

Podatność pojawia się wtedy, gdy użytkownik ma wpływ na fragment komendy.

Przykład niebezpiecznego schematu:

```php
shell_exec("ping -c 3 " . $userInput);
```

Tutaj aplikacja buduje polecenie przez doklejenie danych użytkownika.

To bardzo ryzykowne, bo systemowa powłoka potrafi interpretować specjalne znaki.

Atakujący nie musi „hakować pingu”.

Wystarczy, że wpłynie na to, jak końcowa komenda zostanie zinterpretowana przez system.

---

# Wektor 3: Local File Inclusion

**Local File Inclusion**, czyli LFI, to podatność, w której aplikacja dołącza plik lokalny na podstawie danych od użytkownika.

Przykład niebezpiecznego schematu:

```php
include("pages/" . $_GET["page"]);
```

Programista zakłada, że użytkownik poda:

```text
contact.php
```

Aplikacja wtedy dołączy:

```text
pages/contact.php
```

Ale jeżeli parametr `page` nie jest dobrze walidowany, użytkownik może spróbować wskazać inny plik z systemu.

LFI często zaczyna się od odczytu plików.

Ale w niektórych warunkach może prowadzić dalej, nawet do wykonania kodu.

Na przykład wtedy, gdy atakujący potrafi wcześniej umieścić swój plik na serwerze, a potem zmusić aplikację, żeby go dołączyła.

---

# LFI to nie zawsze od razu RCE

To ważne.

Początkujący często wrzucają wszystko do jednego worka:

```text
LFI = RCE
```

Nie zawsze.

LFI może dawać tylko odczyt plików.

Ale może stać się krokiem do RCE, jeżeli znajdziemy dodatkowy element łańcucha, na przykład:

```text
możliwość uploadu pliku
log poisoning
session file inclusion
dołączenie pliku tymczasowego
dołączenie pliku zawierającego kod
```

W pentestach ważne jest więc nie tylko znalezienie jednej podatności, ale zrozumienie, czy da się ją połączyć z innym mechanizmem aplikacji.

---

# Wektor 4: Remote File Inclusion

**Remote File Inclusion**, czyli RFI, jest podobne do LFI, ale zamiast lokalnego pliku aplikacja dołącza plik ze zdalnego adresu.

Czyli zamiast:

```text
page=contact.php
```

atakujący próbuje doprowadzić do sytuacji, w której aplikacja pobiera i wykonuje plik z zewnętrznego serwera.

Ten typ podatności jest dziś znacznie rzadszy, bo wiele technologii i konfiguracji domyślnie ogranicza takie zachowanie.

Ale sama idea jest bardzo ważna:

> jeżeli aplikacja pozwala użytkownikowi decydować, jaki plik ma zostać dołączony do wykonania, to użytkownik może próbować zmienić aplikację w mechanizm uruchamiania cudzego kodu.

---

# Wektor 5: upload plików

Mechanizmy uploadu są jednym z klasycznych miejsc, gdzie można szukać ścieżki do wykonania kodu.

Nie dlatego, że upload sam w sobie jest zły.

Upload jest normalną funkcją aplikacji.

Problem zaczyna się wtedy, gdy aplikacja:

```text
pozwala wgrać dowolny typ pliku
zapisuje pliki w katalogu dostępnym z WWW
nie zmienia nazwy pliku
nie sprawdza rzeczywistego typu pliku
sprawdza tylko rozszerzenie
używa czarnej listy zamiast białej listy
pozwala na pliki .php, .phtml, .jsp, .aspx
pozwala wpływać na ścieżkę zapisu
```

Jeżeli atakujący może wgrać plik zawierający kod i później odwołać się do niego przez przeglądarkę, może dojść do wykonania kodu na serwerze.

---

# Dlaczego sprawdzanie samego rozszerzenia nie wystarcza?

Bo rozszerzenie to tylko fragment nazwy pliku.

Atakujący może próbować różnych obejść:

```text
podwójne rozszerzenia
niestandardowe rozszerzenia interpretowane przez serwer
różnice wielkości liter
błędy parsera
niepoprawna konfiguracja serwera
pliki .htaccess
archiwa ZIP z niebezpieczną zawartością
```

Przykład:

```text
avatar.php.jpg
```

Dla aplikacji może wyglądać jak obrazek.

Dla źle skonfigurowanego serwera może być czymś więcej.

Dlatego bezpieczny upload nie powinien opierać się tylko na sprawdzeniu końcówki nazwy.

---

# Dobre podejście do uploadu

Bezpieczniejszy mechanizm uploadu powinien zakładać kilka warstw ochrony:

```text
biała lista dozwolonych typów plików
weryfikacja MIME type
weryfikacja magic bytes
zmiana nazwy pliku po stronie serwera
zapis poza katalogiem wykonywalnym
brak możliwości wykonania pliku jako skryptu
limity rozmiaru
skanowanie plików
oddzielenie storage od aplikacji
serwowanie plików przez bezpieczny handler
```

Najważniejsza zasada:

> uploadowany plik powinien być traktowany jak dane, nie jak kod.

---

# Wektor 6: panele administracyjne

Czasami droga do wykonania kodu nie prowadzi przez klasyczny parametr podatny na injection.

Czasami problemem jest panel administracyjny.

Przykłady:

```text
Tomcat Manager
JBoss / WildFly Console
panele CMS
WordPress admin panel
Joomla admin panel
panele do deploymentu
panele debugowania
```

Jeżeli taki panel jest dostępny publicznie i słabo zabezpieczony, atakujący może próbować uzyskać dostęp przez słabe hasła, domyślne konta albo błędy konfiguracji.

Po zalogowaniu panel może udostępniać funkcje, które z założenia są bardzo silne:

```text
wgrywanie aplikacji
instalowanie pluginów
edycja szablonów
edycja kodu
deployment paczek
zmiana konfiguracji serwera
```

Wtedy problem nie polega na „injection” w klasycznym sensie.

Problem polega na tym, że atakujący uzyskał dostęp do funkcji, które pozwalają mu doprowadzić do wykonania kodu.

---

# Wektor 7: XSS jako krok do Code Injection

Na pierwszy rzut oka XSS i Code Injection to różne światy.

XSS wykonuje JavaScript w przeglądarce użytkownika.

Code Injection wykonuje kod po stronie serwera.

Ale w praktyce XSS może być krokiem do czegoś większego.

Wyobraź sobie taki scenariusz:

1. Użytkownik wysyła wiadomość przez formularz kontaktowy.
2. Wiadomość trafia do panelu administracyjnego.
3. Administrator otwiera zgłoszenie.
4. W jego przeglądarce wykonuje się złośliwy JavaScript.
5. Ten JavaScript wykonuje operacje w panelu w imieniu administratora.

Jeżeli panel administracyjny pozwala edytować pliki, instalować pluginy albo zmieniać szablony, XSS może zostać wykorzystany jako pośredni krok do wykonania kodu po stronie serwera.

To jest bardzo ważna lekcja:

> podatność nie musi sama dawać RCE, żeby być elementem łańcucha prowadzącego do RCE.

---

# Wektor 8: tryb debug na produkcji

Tryb debug jest przydatny w środowisku deweloperskim.

Pokazuje więcej informacji o błędach, stack trace, zmienne, ścieżki plików, konfigurację i szczegóły działania aplikacji.

Problem pojawia się wtedy, gdy taki tryb zostaje włączony na produkcji.

W najlepszym przypadku prowadzi to do wycieku informacji.

W najgorszym przypadku framework lub narzędzie debugujące może udostępniać interaktywną konsolę, która pozwala wykonywać kod.

Dlatego tryb debug na produkcji to nie jest tylko „brzydki komunikat błędu”.

To może być realna droga do przejęcia aplikacji.

---

# Wektor 9: SQL Injection jako droga do RCE

SQL Injection najczęściej kojarzy się z bazą danych:

```text
odczyt danych
ominięcie logowania
modyfikacja rekordów
usunięcie danych
```

Ale w niektórych środowiskach SQL Injection może prowadzić dalej.

Może umożliwić:

```text
zapis pliku na serwerze
odczyt plików lokalnych
wywołanie funkcji systemowych
załadowanie rozszerzeń
wykonanie procedur
```

Nie każda baza danych na to pozwala.

Nie każda konfiguracja to umożliwia.

Ale jako pentester warto wiedzieć, że SQL Injection może być nie tylko błędem bazodanowym.

Czasami może być początkiem łańcucha prowadzącego do wykonania kodu.

---

# Wektor 10: XSLT i przetwarzanie XML

XSLT to mechanizm transformacji dokumentów XML.

W niektórych technologiach da się skonfigurować procesor XSLT tak, aby miał dostęp do funkcji języka programowania.

Jeżeli aplikacja pozwala użytkownikowi kontrolować arkusz XSLT albo źródło danych, a jednocześnie niebezpiecznie konfiguruje parser, może dojść do wykonania kodu.

To nie jest najczęstszy wektor dla początkującego, ale jest świetnym przykładem jednej zasady:

> każda funkcja, która interpretuje dane jako instrukcje, może stać się niebezpieczna.

---

# Wektor 11: WebDAV

WebDAV rozszerza możliwości HTTP o dodatkowe metody, takie jak:

```text
PUT
COPY
MOVE
PROPFIND
MKCOL
LOCK
UNLOCK
```

Jeżeli serwer jest źle skonfigurowany, WebDAV może pozwolić na wykonywanie operacji na plikach aplikacji.

Z perspektywy atakującego szczególnie interesujące są sytuacje, w których można:

```text
wgrać plik
przenieść plik
zmienić rozszerzenie pliku
nadpisać istniejący zasób
```

Sam WebDAV nie jest podatnością.

Podatnością jest jego niekontrolowane wystawienie i błędna konfiguracja.

---

# Wektor 12: podatne biblioteki

Aplikacja może być napisana poprawnie, a mimo to korzystać z biblioteki, która ma podatność prowadzącą do RCE.

To jest bardzo częsty problem w nowoczesnym świecie web security.

Aplikacje składają się z wielu zależności:

```text
frameworki
biblioteki do obrazów
biblioteki do PDF
parsery XML
klienty mailowe
systemy szablonów
narzędzia do archiwów
pluginy CMS
```

Jeżeli jedna z tych zależności ma podatność, aplikacja może odziedziczyć problem.

Przykłady klas problemów:

```text
podatne parsery obrazów
podatne biblioteki mailowe
podatne frameworki Java
podatne pluginy WordPress
podatne biblioteki do deserializacji
podatne template engines
```

Dlatego bezpieczeństwo aplikacji to nie tylko kod napisany przez zespół.

To również zależności, konfiguracja i cały łańcuch dostaw oprogramowania.

---

# Drobne błędy, które pomagają w ataku

Nie każdy błąd od razu daje wykonanie kodu.

Ale wiele drobnych błędów pomaga atakującemu zbudować pełny obraz środowiska.

Przykłady:

```text
ujawnianie stack trace
ujawnianie wersji frameworka
ujawnianie ścieżek lokalnych
stare kopie aplikacji na serwerze
backupy w katalogu publicznym
panele testowe pozostawione na produkcji
pliki .env dostępne przez WWW
nadmiarowe nagłówki z wersjami
brak obsługi błędów
```

Dla początkującego może to wyglądać jak niski priorytet.

Dla atakującego to często mapa.

Informacje o wersjach, ścieżkach i technologiach pomagają dobrać właściwe payloady, exploity i kierunek dalszej analizy.

---

# Jak myśleć o tych podatnościach podczas testów?

Nie zaczynaj od payloadu.

Zacznij od pytania:

> czy ta funkcja aplikacji może sprawić, że moje dane zostaną potraktowane jak instrukcja?

Szukaj miejsc, gdzie aplikacja:

```text
wykonuje coś na serwerze
przetwarza plik
dołącza plik
generuje dokument
konwertuje obraz
uruchamia diagnostykę
importuje dane
parsuje XML
obsługuje upload
ma panel administracyjny
pokazuje błędy debugowe
```

Potem zadaj drugie pytanie:

> czy mam wpływ na dane przekazywane do tego mechanizmu?

Jeżeli tak, pojawia się potencjalny punkt testowy.

---

# Przykładowy tok myślenia pentestera

Załóżmy, że aplikacja ma funkcję:

```text
/sprawdz-host?ip=8.8.8.8
```

Nie myśl od razu:

```text
Jaki payload wkleić?
```

Pomyśl:

```text
Co aplikacja robi z tym parametrem?
Czy tylko zapisuje go w bazie?
Czy wysyła go do API?
Czy uruchamia ping?
Czy wynik wygląda jak output systemowy?
Czy błędy zdradzają użycie shell_exec, system, subprocess?
Czy parametr akceptuje tylko IP?
Czy można podać domenę?
Czy można podać znaki specjalne?
Czy odpowiedź zmienia się czasowo?
```

Dopiero potem testujesz hipotezę.

To jest różnica między kopiowaniem payloadów a realnym testowaniem aplikacji.

---

# Co może potwierdzać Command Injection?

Sygnały ostrzegawcze:

```text
odpowiedź wygląda jak wynik komendy systemowej
pojawiają się komunikaty systemowe
aplikacja zwraca output narzędzi typu ping, nslookup, traceroute
różne znaki specjalne zmieniają zachowanie odpowiedzi
występują opóźnienia po określonych payloadach
błędy ujawniają shell, bash, sh, cmd.exe, powershell
```

W testach często zaczyna się od bezpiecznych, kontrolowanych prób, które mają pokazać, czy input wpływa na wykonywaną komendę.

Nie chodzi od razu o przejmowanie serwera.

Chodzi o odpowiedź na pytanie:

> czy dane użytkownika wydostają się z kontekstu zwykłego argumentu i wpływają na strukturę polecenia?

---

# Co może potwierdzać Code Injection?

Sygnały ostrzegawcze:

```text
input jest interpretowany jako wyrażenie
aplikacja zwraca wynik obliczenia
błędy pokazują fragmenty kodu
w odpowiedzi pojawiają się nazwy funkcji lub klas
aplikacja używa dynamicznego wywoływania funkcji
występują mechanizmy template engine
input trafia do eval/exec/create_function
```

Dobrym przykładem są podatności SSTI, czyli Server-Side Template Injection.

Tam użytkownik często zaczyna od prostego testu typu:

```text
czy aplikacja policzy wyrażenie w szablonie?
```

Jeżeli tak, to znaczy, że input nie jest zwykłym tekstem. Jest interpretowany przez silnik szablonów.

A to może być pierwszy krok do poważniejszej podatności.

---

# Skutki udanego ataku

Skutki Code Injection i Command Injection mogą być bardzo poważne.

## 1. Odczyt danych

Atakujący może próbować czytać:

```text
kod źródłowy aplikacji
pliki konfiguracyjne
sekrety
hasła do baz danych
tokeny API
pliki użytkowników
logi
zmienne środowiskowe
```

To często prowadzi do dalszej kompromitacji.

Jeden plik konfiguracyjny może zawierać dane dostępowe do bazy, Redis, S3, panelu administracyjnego albo innych usług.

---

## 2. Modyfikacja aplikacji

Jeżeli proces aplikacji ma odpowiednie uprawnienia, atakujący może próbować zmieniać pliki.

Może to prowadzić do:

```text
defacementu
podmiany treści
dodania złośliwego kodu
wgrania backdoora
zmiany konfiguracji
```

---

## 3. Webshell

Webshell to plik umieszczony na serwerze, który pozwala atakującemu wykonywać operacje przez przeglądarkę lub żądania HTTP.

To bardzo częsty sposób utrzymania dostępu po udanym ataku na aplikację webową.

Problem z webshellami polega na tym, że nie zawsze są oczywiste.

Atakujący może:

```text
dodać nowy plik
ukryć kod w istniejącym pliku
użyć nietypowego rozszerzenia
ukryć kod w katalogu uploadów
zamaskować nazwę jako legalny plik aplikacji
```

Dlatego po incydencie samo „naprawienie podatności” nie wystarcza.

Trzeba jeszcze sprawdzić, czy atakujący nie zostawił sobie furtki.

---

## 4. Eskalacja uprawnień

Aplikacja zwykle działa jako ograniczony użytkownik.

Ale jeżeli atakujący ma już możliwość wykonywania poleceń na serwerze, może próbować szukać błędów w samym systemie operacyjnym.

Może sprawdzać:

```text
wersję kernela
błędne uprawnienia plików
zadania cron
sekrety w konfiguracji
sudo rules
procesy działające jako root
podatne lokalne usługi
```

To jest przejście z poziomu aplikacji do klasycznego post-exploitation.

---

## 5. Pivoting do sieci wewnętrznej

Serwer aplikacji często widzi więcej niż użytkownik z internetu.

Może mieć dostęp do:

```text
wewnętrznych baz danych
paneli administracyjnych
mikroserwisów
API niedostępnych publicznie
sieci LAN
usług developerskich
```

Dlatego przejęty serwer może stać się punktem przesiadkowym do dalszego ataku.

To szczególnie groźne w środowiskach, gdzie segmentacja sieci jest słaba.

---

# Jak się przed tym bronić?

Najważniejsza zasada:

> nie pozwalaj, żeby dane użytkownika były wykonywane jako kod albo komenda.

Brzmi prosto, ale praktyka jest trudniejsza.

## 1. Unikaj eval i podobnych mechanizmów

Jeżeli aplikacja potrzebuje `eval`, warto zadać pytanie:

```text
czy naprawdę nie da się tego rozwiązać inaczej?
```

W większości przypadków się da.

Dynamiczne wykonywanie kodu na podstawie danych wejściowych to bardzo ryzykowny wzorzec.

---

## 2. Nie buduj komend przez konkatenację stringów

Niebezpieczny schemat:

```text
"ping " + userInput
```

Bezpieczniejsze podejście:

```text
oddziel komendę od argumentów
użyj bezpiecznego API
nie wywołuj powłoki, jeśli nie musisz
waliduj argumenty
```

W Javie przykładem lepszego podejścia jest `ProcessBuilder`.

W PHP istnieją funkcje typu:

```php
escapeshellarg()
escapeshellcmd()
```

Ale ważne: escapowanie to nie jest główna ochrona.

To dodatkowa warstwa.

Podstawą powinna być walidacja i unikanie niepotrzebnego shellowania.

---

## 3. Stosuj białe listy

Jeżeli parametr ma być adresem IP, to powinien być adresem IP.

Jeżeli ma być liczbą, to powinien być liczbą.

Jeżeli ma być nazwą jednej z kilku dozwolonych opcji, to wybieraj ją z mapy.

Przykład dobrego modelu:

```text
userInput = "contact"

allowedPages = {
  "home": "/templates/home.php",
  "contact": "/templates/contact.php",
  "about": "/templates/about.php"
}

include allowedPages[userInput]
```

A nie:

```text
include "templates/" + userInput
```

Różnica jest ogromna.

W pierwszym przypadku użytkownik wybiera z kontrolowanej listy.

W drugim użytkownik wpływa na ścieżkę.

---

## 4. Waliduj dane na wejściu

Sprawdzaj:

```text
typ danych
długość
format
dozwolone znaki
zakres wartości
strukturę danych
```

Przykłady:

```text
wiek powinien być liczbą z określonego zakresu
identyfikator powinien być UUID albo liczbą
adres IP powinien przejść walidację IP
nazwa pliku nie powinna być ścieżką
typ pliku powinien być jednym z dozwolonych
```

Nie chodzi o losowe filtrowanie „złych znaków”.

Chodzi o jasne określenie, co jest poprawne.

---

## 5. Ogranicz uprawnienia aplikacji

Nawet jeżeli dojdzie do podatności, jej skutki mogą być ograniczone.

Aplikacja nie powinna działać jako `root`.

Proces aplikacji powinien mieć minimalne wymagane uprawnienia.

Warto stosować:

```text
least privilege
separację użytkowników
konteneryzację
read-only filesystem tam, gdzie możliwe
ograniczenia dostępu do katalogów
segregację sekretów
segmentację sieci
```

Dobra architektura nie zakłada, że błędów nigdy nie będzie.

Dobra architektura zakłada, że błąd może się pojawić, ale jego skutki muszą być ograniczone.

---

## 6. Wyłącz debug na produkcji

Na produkcji nie powinno być:

```text
debug mode
stack trace dla użytkownika
interaktywnych konsol
testowych endpointów
paneli developerskich
nadmiarowych komunikatów błędów
```

Błędy powinny być logowane po stronie serwera, a użytkownik powinien dostać kontrolowany komunikat.

---

## 7. Aktualizuj zależności

Warto korzystać z narzędzi typu:

```text
OWASP Dependency-Check
Snyk
npm audit
Dependabot
GitHub Security Alerts
```

Ale samo narzędzie nie wystarczy.

Trzeba mieć proces:

```text
kto analizuje alerty
jak oceniamy ryzyko
kiedy aktualizujemy
jak testujemy poprawki
co robimy z false positive
```

Bez procesu skaner zależności szybko zamienia się w generator hałasu.

---

# Najczęstszy błąd początkujących

Początkujący często patrzą na Code Injection i Command Injection przez pryzmat payloadów.

Szukają listy znaków, separatorów i gotowych komend.

To zła kolejność.

Najpierw trzeba zrozumieć kontekst.

Pytania, które warto sobie zadać:

```text
Co aplikacja robi z moim inputem?
Czy mój input trafia do kodu?
Czy mój input trafia do komendy systemowej?
Czy mój input trafia do ścieżki pliku?
Czy mój input trafia do parsera?
Czy mój input trafia do template engine?
Czy odpowiedź zdradza wykonanie czegoś po stronie serwera?
Czy mogę wywołać błąd i zobaczyć, co dzieje się pod spodem?
```

Payload jest tylko narzędziem.

Prawdziwa praca polega na zrozumieniu przepływu danych.

---

# Prosta mapa skojarzeń

Jeżeli widzisz funkcję:

```text
ping
traceroute
nslookup
whois
convert
ffmpeg
wkhtmltopdf
tar
zip
grep
sed
cat
```

myśl:

```text
czy tu może być Command Injection?
```

Jeżeli widzisz:

```text
eval
exec
dynamiczne funkcje
template engine
pluginy
skrypty
XSLT
deserializację
```

myśl:

```text
czy tu może być Code Injection?
```

Jeżeli widzisz:

```text
page=
file=
template=
lang=
theme=
path=
download=
include=
```

myśl:

```text
czy tu może być LFI/RFI albo Path Traversal?
```

Jeżeli widzisz:

```text
upload avataru
upload dokumentu
import ZIP
konwersję pliku
miniaturki obrazków
```

myśl:

```text
czy plik może stać się kodem?
```

---

# Jak opisać taką podatność w raporcie?

Dobra podatność nie powinna być opisana tylko jako:

```text
Parametr X jest podatny na Command Injection.
```

To za mało.

Lepszy opis powinien pokazywać:

```text
gdzie znajduje się podatność
jaki parametr jest kontrolowany przez użytkownika
jaki mechanizm wykonuje dane po stronie serwera
jak potwierdzono wykonanie
z jakimi uprawnieniami działa proces
jaki jest realny wpływ
jakie dane mogą być zagrożone
jak to naprawić
```

Przykładowy opis wpływu:

```text
Podatność pozwala atakującemu wykonać polecenia systemowe w kontekście użytkownika aplikacji webowej. W zależności od uprawnień procesu może to umożliwić odczyt kodu źródłowego, plików konfiguracyjnych, sekretów aplikacji, danych użytkowników oraz dalszą eskalację ataku w środowisku serwerowym.
```

---

# Najważniejsze rzeczy do zapamiętania

Code Injection i Command Injection nie polegają na „magicznych payloadach”.

Polegają na złamaniu granicy między danymi a instrukcjami.

Aplikacja powinna traktować input użytkownika jak dane.

Jeżeli zaczyna traktować go jak kod, komendę, ścieżkę do wykonania albo instrukcję dla parsera, pojawia się ryzyko.

Najważniejsze zdanie z tej notatki:

> Dane użytkownika nigdy nie powinny decydować o tym, jaki kod lub jaka komenda zostanie wykonana na serwerze.

To jest fundament.

Reszta to tylko różne warianty tego samego błędu.

---

# TL;DR

**Code Injection** to sytuacja, w której użytkownik może doprowadzić do wykonania kodu aplikacyjnego po stronie serwera.

**Command Injection** to sytuacja, w której użytkownik może doprowadzić do wykonania polecenia systemowego na serwerze.

Najczęstsze źródła problemów:

```text
eval i podobne funkcje
budowanie komend przez doklejanie inputu
Local File Inclusion
Remote File Inclusion
niebezpieczny upload plików
panele administracyjne
XSS w panelu administratora
tryb debug na produkcji
SQL Injection prowadzący do RCE
XSLT/XML parsery
WebDAV
podatne biblioteki
```

Najważniejsze zabezpieczenia:

```text
nie wykonywać danych użytkownika
unikać eval
unikać shellowania
nie budować komend przez konkatenację
stosować białe listy
walidować typ, format, długość i zakres danych
bezpiecznie obsługiwać upload
wyłączyć debug na produkcji
aktualizować zależności
ograniczać uprawnienia aplikacji
segmentować środowisko
```

Najważniejszy mindset:

```text
Nie pytaj najpierw: jaki payload wkleić?

Zapytaj:
gdzie mój input trafia,
jak jest interpretowany
i czy może zostać potraktowany jako instrukcja.
```
