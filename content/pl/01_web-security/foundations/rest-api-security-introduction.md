---
id: rest-api-security-introduction
title: "Bezpieczeństwo API REST: gdzie kończy się zwykła aplikacja webowa, a zaczynają problemy API"
team: red-blue
domain: web-security
section: foundations
type: knowledge
angle: api-security-mindset
sourceTrack: baw
tags:
  [
    "api-security",
    "rest-api",
    "http-methods",
    "method-override",
    "content-type",
    "json",
    "xml",
    "yaml",
    "api-keys",
    "webhooks",
    "authentication",
    "authorization",
    "access-control",
    "recon",
  ]
difficulty: medium
shortDescription: "Wprowadzenie do bezpieczeństwa API REST: czym API różni się od klasycznej aplikacji webowej, dlaczego metody HTTP, alternatywne ścieżki, formaty danych, dokumentacja, klucze API i webhooki potrafią tworzyć podatności oraz jak patrzeć na API podczas testów bezpieczeństwa."
updatedAt: "2026-05-18"
---

# Bezpieczeństwo API REST: gdzie kończy się zwykła aplikacja webowa, a zaczynają problemy API

## Dlaczego zapisuję tę notatkę

API REST bardzo łatwo potraktować jak „zwykły backend do frontendu”.

Mamy endpointy, JSON-a, tokeny, metody HTTP i jakąś dokumentację. Na pierwszy rzut oka wygląda to prosto. Problem zaczyna się wtedy, gdy aplikacja nie ma jednego widocznego interfejsu, tylko dziesiątki lub setki punktów wejścia, które przyjmują dane w różnych miejscach, różnymi metodami i czasami w kilku formatach.

W klasycznej aplikacji webowej użytkownik często klika formularz, link albo przycisk. W API użytkownik, aplikacja mobilna, frontend, integracja zewnętrzna albo inny system wysyła bezpośrednie żądania HTTP.

Dla testera bezpieczeństwa to oznacza jedno: **interfejs graficzny przestaje być granicą aplikacji**.

Prawdziwa aplikacja zaczyna się tam, gdzie zaczyna się API.

## API REST to nadal aplikacja webowa

Najprościej myśleć o API REST jako o aplikacji webowej, która została ułożona według pewnej struktury.

Zamiast klasycznych podstron mamy zasoby:

```http
GET /api/users/123
GET /api/orders/555
POST /api/products
DELETE /api/comments/10
```

Zamiast formularzy HTML mamy najczęściej dane w JSON-ie:

```json
{
  "email": "user@example.com",
  "role": "user"
}
```

Zamiast kliknięcia w przycisk mamy żądanie HTTP wysłane przez frontend, aplikację mobilną, klienta API albo integrację.

To nadal jest web security. Nadal mogą pojawić się SQL Injection, Cross-Site Scripting, Server-Side Request Forgery, Path Traversal, błędy kontroli dostępu, problemy z sesją, wycieki informacji i źle obsłużone błędy.

Różnica polega na tym, że API często ma większy chaos wejść.

Parametry mogą być w URL-u, w ścieżce, w nagłówkach, w cookies, w JSON-ie, w XML-u, w YAML-u, w parametrach formularza albo w nietypowym formacie, o którym nikt w zespole już nie pamięta.

## Pierwsza pułapka: metody HTTP nie zawsze znaczą to samo

Teoretycznie metody HTTP mają jasny sens.

`GET` pobiera dane.

`POST` zwykle tworzy lub wykonuje akcję.

`PUT` często aktualizuje lub zastępuje zasób.

`PATCH` wykonuje częściową aktualizację.

`DELETE` usuwa zasób.

Problem w tym, że w realnych aplikacjach nie zawsze jest to konsekwentne. Jedno API może używać `PUT` do tworzenia zasobu, inne do aktualizacji. Jedno API może traktować `POST` jako utworzenie obiektu, inne jako dowolną operację biznesową.

Dla testera najważniejsze nie jest to, co metoda „powinna” robić według dokumentacji.

Najważniejsze jest to, **co faktycznie robi backend**.

Przykład prostego modelu myślenia:

```http
GET /api/users/123
```

Pytania testera:

Czy mogę zmienić `123` na ID innego użytkownika?

Czy endpoint wymaga uwierzytelnienia?

Czy endpoint sprawdza autoryzację do konkretnego zasobu?

Czy działa tylko z `GET`, czy również z inną metodą?

Czy `POST /api/users/123` zachowa się inaczej?

Czy `PUT /api/users/123` pozwoli zmienić dane?

Czy `DELETE /api/users/123` istnieje, mimo że frontend nigdy go nie używa?

W API nie testujemy tylko parametrów.

Testujemy też metodę, format danych, nagłówki, alternatywne ścieżki i zachowanie frameworka.

## Nadpisywanie metod HTTP

Jednym z ciekawszych problemów w API REST jest możliwość nadpisania metody HTTP.

Czasami infrastruktura, proxy, firewall aplikacyjny albo stary klient pozwala tylko na `GET` i `POST`. Żeby mimo tego obsłużyć `PUT`, `PATCH` albo `DELETE`, aplikacja może wspierać mechanizmy typu:

```http
X-HTTP-Method-Override: PUT
```

albo:

```http
X-HTTP-Method: DELETE
```

albo parametr:

```http
POST /api/posts/123?_method=DELETE
```

Na poziomie aplikacji może to oznaczać:

„Technicznie przyszło żądanie POST, ale potraktuj je jak DELETE”.

To staje się groźne, jeżeli różne warstwy aplikacji inaczej rozumieją takie żądanie.

Na przykład firewall widzi:

```http
POST /api/posts/123
```

ale aplikacja po nagłówku interpretuje je jako:

```http
DELETE /api/posts/123
```

Jeszcze gorzej, jeżeli kontrola dostępu sprawdza jedną metodę, a logika biznesowa wykonuje inną.

### Minimalny test w Burpie

W Repeaterze można wziąć zwykłe żądanie do API i dodać nagłówek:

```http
X-HTTP-Method-Override: DELETE
```

Przykład:

```http
POST /api/resource/123 HTTP/1.1
Host: target.local
Content-Type: application/json
X-HTTP-Method-Override: DELETE

{}
```

Nie chodzi o to, żeby od razu usuwać dane.

Na początku obserwujemy:

Czy status odpowiedzi się zmienia?

Czy zmienia się komunikat błędu?

Czy aplikacja zwraca inny kod, na przykład `403`, `404`, `405`, `500`?

Czy endpoint zaczyna zachowywać się tak, jakby przyjął inną metodę?

Czy w odpowiedzi pojawia się informacja o obsługiwanych metodach?

Jeżeli jedna warstwa aplikacji mówi „metoda niedozwolona”, a druga zaczyna wykonywać logikę biznesową, mamy mocny sygnał do dalszego testowania.

## Alternatywne ścieżki do tej samej funkcji

Jedna z najważniejszych zasad bezpieczeństwa API brzmi:

**Do chronionych danych i operacji powinna prowadzić jedna, dobrze sprawdzona ścieżka kontroli dostępu.**

Problem zaczyna się wtedy, gdy do tej samej operacji da się dojść kilkoma drogami.

Przykład:

```http
GET /api/users/123
```

ale aplikacja obsługuje też:

```http
GET /api/v1/users/123
GET /internal_api/users/123
POST /api/users/get
POST /?rest_route=/api/users/123
GET /api/users?id=123
GET /api/users/123.json
```

Z perspektywy backendu to czasem może być ta sama funkcja.

Z perspektywy bezpieczeństwa to mogą być różne ścieżki, różne middleware, różne filtry, różna kontrola dostępu i różne bugi.

Dlatego podczas testów API nie wolno zatrzymywać się na jednym adresie.

Jeżeli frontend używa:

```http
GET /api/products/10
```

to warto sprawdzić, czy istnieją warianty:

```http
GET /api/products?id=10
GET /api/v1/products/10
GET /api/products/10.json
GET /api/products/10.xml
POST /api/products/10
POST /api/products?id=10
```

Nie dlatego, że każdy musi działać.

Dlatego, że czasami działa ten jeden, którego nikt już nie testował.

## Rekonesans API

API często nie jest widoczne od razu na stronie.

Może być używane przez frontend, aplikację mobilną, panel administracyjny, integrację zewnętrzną albo stary system, który nadal działa „bo nikt nie chce go ruszać”.

Pierwsze miejsca, które warto sprawdzać:

Źródła JavaScript:

```bash
grep -R "api" .
grep -R "internal" .
grep -R "graphql" .
grep -R "swagger" .
grep -R "token" .
```

Pliki aplikacji mobilnej po dekompilacji.

Nagłówki odpowiedzi HTTP.

Dokumentację Swagger/OpenAPI.

Ukryte katalogi.

Subdomeny.

Stare wersje API.

Typowe ścieżki dokumentacji:

```text
/swagger
/swagger-ui
/swagger-ui.html
/api-docs
/v2/api-docs
/v3/api-docs
/openapi.json
/openapi.yaml
/docs
/redoc
/api/jsonws
```

Dokumentacja API nie jest sama w sobie podatnością. Często ma być publiczna.

Ale z punktu widzenia testera jest mapą.

Pokazuje endpointy, parametry, typy danych, czasem role użytkowników, stare funkcje, niedokończone moduły i metody, których frontend normalnie nie używa.

## Tryb debug i nadmiarowe błędy

API w trybie debug potrafi ujawnić bardzo dużo.

Nie tylko klasyczny stack trace, ale też:

ścieżki plików,

nazwy klas i metod,

framework,

wersje bibliotek,

obsługiwane endpointy,

nazwy parametrów,

strukturę backendu,

fragmenty konfiguracji,

czasem nawet sekrety lub dane środowiskowe.

Przykład sygnału ostrzegawczego:

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "No route matches /api/user/test",
  "available_routes": [
    "/api/user/{id}",
    "/api/user/{id}/orders",
    "/api/user/{id}/admin-notes"
  ]
}
```

Dla developera to pomocny błąd.

Dla atakującego to darmowa dokumentacja.

Podczas testów warto celowo wysyłać lekko błędne żądania:

```http
GET /api/does-not-exist HTTP/1.1
Host: target.local
```

```http
POST /api/users HTTP/1.1
Host: target.local
Content-Type: application/json

{"broken":
```

Obserwujemy, czy API odpowiada bezpiecznym komunikatem, czy zaczyna prowadzić nas za rękę po strukturze aplikacji.

## Format danych to też powierzchnia ataku

W API REST najczęściej widzimy JSON.

Ale to nie znaczy, że backend przyjmuje tylko JSON.

Aplikacja może obsługiwać również:

```http
Content-Type: application/xml
Content-Type: text/xml
Content-Type: application/yaml
Content-Type: application/x-yaml
Content-Type: application/x-www-form-urlencoded
Content-Type: multipart/form-data
Content-Type: application/vnd.php.serialized
```

To bardzo ważne, bo różne parsery mają różne klasy podatności.

JSON może prowadzić do problemów z deserializacją albo niebezpiecznym mapowaniem obiektów.

XML może prowadzić do XXE, Server-Side Request Forgery, lokalnego odczytu plików albo Denial of Service.

YAML może prowadzić do deserializacji i wykonania kodu, jeżeli aplikacja używa niebezpiecznego parsera.

Format danych to nie kosmetyka.

To czasami zupełnie inna ścieżka przetwarzania po stronie serwera.

### Prosty test Content-Type

Jeżeli normalne żądanie wygląda tak:

```http
POST /api/profile HTTP/1.1
Host: target.local
Content-Type: application/json

{"name":"test"}
```

to warto sprawdzić, jak API reaguje na zmianę typu danych:

```http
POST /api/profile HTTP/1.1
Host: target.local
Content-Type: application/xml

{"name":"test"}
```

Jeżeli aplikacja odpowie błędem parsera XML, to znaczy, że XML prawdopodobnie jest obsługiwany lub przynajmniej trafia do parsera.

To otwiera kolejny etap testów.

Nie zakładamy od razu podatności.

Najpierw potwierdzamy, że backend faktycznie próbuje przetwarzać dany format.

## XML w API

Jeżeli API akceptuje XML, trzeba myśleć o kilku klasach problemów.

Najbardziej znana to XXE, czyli XML External Entity.

W praktyce oznacza to, że parser XML może pozwolić użytkownikowi zdefiniować encję zewnętrzną, która odwołuje się do pliku lokalnego albo zasobu sieciowego.

Minimalny test koncepcyjny:

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
  <!ENTITY test SYSTEM "file:///etc/passwd">
]>
<root>&test;</root>
```

W prawdziwym teście nie chodzi tylko o wklejenie payloadu.

Trzeba obserwować:

Czy parser przyjmuje `DOCTYPE`?

Czy aplikacja zwraca błąd XML?

Czy encja jest rozwijana?

Czy odpowiedź zawiera fragment wskazanego zasobu?

Czy możliwy jest ruch wychodzący z serwera?

Czy parser blokuje zewnętrzne encje?

XML w API bywa szczególnie ciekawy wtedy, gdy frontend wysyła JSON, ale backend po zmianie `Content-Type` nadal przyjmuje XML.

To oznacza, że istnieje ukryta powierzchnia ataku, której zwykły użytkownik aplikacji nigdy nie widzi.

## YAML w API

YAML jest rzadszy, ale przez to ciekawy.

Jeżeli API przyjmuje YAML, trzeba sprawdzić, czy parser działa w trybie bezpiecznym.

Niebezpieczne parsery YAML w niektórych językach pozwalały historycznie tworzyć obiekty lub wykonywać funkcje po stronie serwera.

W Pythonie klasycznym przykładem ryzykownego podejścia było używanie `yaml.load()` na niezaufanych danych zamiast bezpieczniejszego `yaml.safe_load()`.

Z perspektywy testera najpierw interesuje nas nie payload, tylko odpowiedź na pytanie:

**Czy API w ogóle akceptuje YAML?**

Test:

```http
POST /api/import HTTP/1.1
Host: target.local
Content-Type: application/yaml

name: test
role: user
```

Jeżeli dostajemy błąd parsera YAML albo inną odpowiedź niż przy JSON-ie, warto pogłębić analizę.

## Format odpowiedzi też może zmieniać logikę

W API zwykle myślimy o tym, jaki format wysyłamy do serwera.

Ale równie ważne jest to, jaki format odpowiedzi wymuszamy.

Można to robić nagłówkiem:

```http
Accept: application/json
```

albo wariantem URL-a:

```http
/api/users/123.json
/api/users/123.xml
```

albo parametrem:

```http
/api/users/123?format=json
/api/users/123?output=xml
/api/users/123?requesttype=locreq.json
```

Dlaczego to ma znaczenie?

Bo aplikacja może mieć inną logikę dla odpowiedzi JSON, inną dla XML i jeszcze inną dla HTML.

Jeden format może ukrywać pola.

Drugi może zwracać pełny obiekt.

Trzeci może omijać część walidacji.

Czwarty może być starszą ścieżką kodu, której nikt nie aktualizował.

Podczas testów warto porównywać odpowiedzi:

```http
GET /api/users/me HTTP/1.1
Accept: application/json
```

```http
GET /api/users/me HTTP/1.1
Accept: application/xml
```

```http
GET /api/users/me.json HTTP/1.1
```

```http
GET /api/users/me.xml HTTP/1.1
```

Szukamy różnic w polach, statusach, błędach, nagłówkach i zachowaniu kontroli dostępu.

## Klucze API

Klucz API często wygląda jak prosty sekret:

```text
api_key=abc123...
```

albo:

```http
X-API-Key: abc123...
```

Czasem działa jak hasło.

Czasem jak identyfikator klienta.

Czasem jak token dostępu.

Czasem niestety jak wszystko naraz.

Największy problem z kluczami API polega na tym, że często są długowieczne. Użytkownik może się wylogować z aplikacji, ale klucz API zostaje aktywny przez miesiące albo lata.

Dlatego podczas oceny bezpieczeństwa API trzeba sprawdzić:

Czy klucz API jest przesyłany w URL-u?

Czy trafia do logów?

Czy znajduje się w JavaScript?

Czy znajduje się w aplikacji mobilnej?

Czy jest zapisany w repozytorium?

Czy jest widoczny w historii commitów?

Czy ma ograniczone uprawnienia?

Czy ma ograniczony czas życia?

Czy można go zrotować?

Czy można go unieważnić?

Czy jest powiązany z konkretnym adresem IP lub zakresem?

Czy różne klucze mają różne poziomy dostępu?

Słaby przykład:

```http
GET /api/user/data?api_key=SECRET HTTP/1.1
Host: target.local
```

Lepszy wariant:

```http
GET /api/user/data HTTP/1.1
Host: target.local
X-API-Key: SECRET
```

To nie rozwiązuje wszystkich problemów, ale ogranicza ryzyko przypadkowego zapisywania sekretu w URL-ach, historii, refererach i logach.

Ważna rzecz: klucz API to nadal parametr wejściowy.

Jeżeli backend sprawdza go w bazie danych, źle zbudowane zapytanie może być podatne na SQL Injection dokładnie tak samo jak każdy inny parametr.

## Webhooki

Webhook to mechanizm, w którym jeden system wywołuje wskazany URL w drugim systemie.

Przykład:

Sklep internetowy rejestruje webhook w bramce płatności.

Po zakończonej płatności bramka wysyła żądanie do sklepu.

```json
{
  "event": "payment.completed",
  "amount": 19900,
  "currency": "PLN",
  "callback_url": "https://shop.example.com/payment/webhook"
}
```

Najważniejszy problem bezpieczeństwa przy webhookach to Server-Side Request Forgery.

Jeżeli użytkownik może podać callback URL, a serwer później ten URL wywoła, tester powinien sprawdzić, czy można wskazać adres wewnętrzny:

```text
http://127.0.0.1/
http://localhost/
http://169.254.169.254/
http://internal-service.local/
http://10.0.0.5/
```

Nie chodzi tylko o to, czy aplikacja „przyjmie” taki adres.

Chodzi o to, czy backend później faktycznie spróbuje się z nim połączyć.

W testach przydaje się własny listener HTTP albo Burp Collaborator, bo pozwala potwierdzić, czy serwer wykonał połączenie wychodzące.

Webhooki trzeba też weryfikować od drugiej strony.

Jeżeli aplikacja przyjmuje webhook, powinna sprawdzać, czy żądanie naprawdę pochodzi od zaufanego systemu.

Samo to, że ktoś zna URL webhooka, nie powinno pozwalać mu zmienić statusu płatności, zamówienia albo procesu biznesowego.

## Uwierzytelnienie i autoryzacja w API

W API problemy z uwierzytelnieniem i autoryzacją są jednymi z najważniejszych klas podatności.

Uwierzytelnienie odpowiada na pytanie:

**Kim jesteś?**

Autoryzacja odpowiada na pytanie:

**Czy wolno ci wykonać tę akcję na tym konkretnym zasobie?**

To rozróżnienie jest krytyczne.

Aplikacja może poprawnie rozpoznawać użytkownika, ale nadal pozwalać mu pobrać dane innej osoby.

Przykład:

```http
GET /api/users/1001/orders HTTP/1.1
Authorization: Bearer TOKEN_USER_A
```

Jeżeli zmienimy `1001` na `1002`:

```http
GET /api/users/1002/orders HTTP/1.1
Authorization: Bearer TOKEN_USER_A
```

i dostaniemy dane innego użytkownika, problemem nie jest brak uwierzytelnienia.

Problemem jest brak poprawnej autoryzacji do zasobu.

To klasyczne IDOR, czyli Insecure Direct Object Reference, obecnie najczęściej rozumiane w szerszej kategorii Broken Object Level Authorization.

API jest szczególnie podatne na takie błędy, bo bardzo często operuje na identyfikatorach:

```text
user_id
account_id
order_id
invoice_id
company_id
tenant_id
organization_id
project_id
```

Każdy taki parametr powinien zapalać lampkę.

Nie pytamy tylko: „Czy endpoint wymaga tokena?”.

Pytamy: „Czy ten token ma prawo do tego konkretnego obiektu?”.

## Rate limiting

API powinno ograniczać liczbę prób dla wrażliwych operacji.

Dotyczy to szczególnie:

logowania,

resetu hasła,

weryfikacji kodów jednorazowych,

wysyłki kodów SMS,

zaproszeń,

generowania tokenów,

operacji finansowych,

enumeracji użytkowników,

pobierania dużych zbiorów danych.

Brak rate limitingu nie zawsze jest samodzielną podatnością krytyczną, ale bardzo często wzmacnia inne błędy.

Jeżeli kod resetu hasła ma sześć cyfr, ale aplikacja pozwala wykonać setki tysięcy prób z wielu adresów IP, to matematyka zaczyna działać przeciwko aplikacji.

Podczas testów nie chodzi o agresywne brute-force.

Chodzi o sprawdzenie, czy aplikacja ma widoczny mechanizm kontroli:

Czy po kilku błędnych próbach pojawia się blokada?

Czy blokada jest per konto, per adres IP, per token, per device ID?

Czy odpowiedź zmienia się po przekroczeniu limitu?

Czy limit można ominąć przez zmianę nagłówków?

Czy limit działa tak samo dla API mobilnego i webowego?

## Starsze wersje API

API często żyje dłużej niż frontend.

Frontend może używać:

```text
/api/v3/
```

ale na serwerze nadal mogą działać:

```text
/api/v1/
/api/v2/
/internal_api/
/legacy/
/mobile-api/
```

Starsza wersja API może mieć słabszą kontrolę dostępu, stary format tokenów, brak rate limitingu albo endpointy, które zostały usunięte z interfejsu, ale nie z backendu.

Podczas rekonesansu warto szukać wersji:

```text
/v1/
/v2/
/v3/
/api/v1/
/api/v2/
/rest/v1/
/legacy/
/old/
/internal/
```

W testach porównujemy:

Czy stary endpoint nadal odpowiada?

Czy wymaga tego samego uwierzytelnienia?

Czy zwraca więcej danych?

Czy używa innych nazw parametrów?

Czy pozwala wykonać tę samą operację inną ścieżką?

## Jak myśleć podczas testowania API

Testowanie API nie polega na losowym wrzucaniu payloadów.

Dobry proces wygląda bardziej jak budowanie mapy.

Najpierw trzeba zrozumieć zasoby:

```text
users
orders
payments
files
comments
roles
organizations
projects
sessions
tokens
```

Potem akcje:

```text
create
read
update
delete
export
import
approve
invite
reset
confirm
cancel
```

Potem role:

```text
guest
user
premium user
manager
admin
support
service account
```

Potem granice dostępu:

Czy użytkownik A może zobaczyć dane użytkownika B?

Czy użytkownik z organizacji A może zobaczyć dane organizacji B?

Czy zwykły użytkownik może wykonać akcję administracyjną?

Czy niezweryfikowane konto może używać endpointów wymagających weryfikacji?

Czy konto zablokowane nadal może używać API?

Czy usunięty token nadal działa?

Dopiero potem payloady mają sens.

## Minimalna checklista testera

Podczas pierwszego przejścia przez API warto sprawdzić:

Czy istnieje dokumentacja Swagger/OpenAPI.

Czy frontend lub aplikacja mobilna ujawnia ukryte endpointy.

Czy są stare wersje API.

Czy endpointy mają konsekwentną kontrolę dostępu.

Czy identyfikatory obiektów można podmieniać.

Czy można nadpisywać metody HTTP.

Czy API przyjmuje inne formaty niż JSON.

Czy format odpowiedzi zmienia zakres danych.

Czy błędy ujawniają techniczne szczegóły.

Czy klucze API nie są przesyłane w URL-u.

Czy klucze API mają zakresy uprawnień i rotację.

Czy webhooki można wykorzystać do Server-Side Request Forgery.

Czy wrażliwe operacje mają rate limiting.

Czy usunięte, stare lub mobilne endpointy nadal działają.

Czy różne role użytkowników widzą i mogą robić tylko to, co powinny.

## Praktyczny mini-workflow w Burp Suite

Najpierw przechodzę aplikację normalnie i zbieram ruch w Proxy History.

Potem filtruję żądania po:

```text
/api
/v1
/v2
/graphql
/rest
/json
/swagger
```

Następnie wybieram jeden endpoint i robię baseline w Repeaterze.

Przykład:

```http
GET /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
```

Potem zmieniam tylko jedną rzecz naraz.

ID obiektu:

```http
GET /api/orders/124 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
```

Metodę:

```http
POST /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Content-Type: application/json

{}
```

Nagłówek nadpisania metody:

```http
POST /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Content-Type: application/json
X-HTTP-Method-Override: DELETE

{}
```

Format danych:

```http
POST /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Content-Type: application/xml

<order><status>test</status></order>
```

Format odpowiedzi:

```http
GET /api/orders/123.xml HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Accept: application/xml
```

Token innego użytkownika:

```http
GET /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_B
```

Brak tokena:

```http
GET /api/orders/123 HTTP/1.1
Host: target.local
```

Na każdym kroku porównuję:

status HTTP,

długość odpowiedzi,

różnice w polach,

komunikaty błędów,

czas odpowiedzi,

nagłówki,

czy operacja faktycznie zmieniła stan aplikacji.

## Najważniejsza myśl

API REST nie jest magicznie bezpieczne dlatego, że używa JSON-a, tokenów i endpointów.

To nadal aplikacja webowa, tylko z większą liczbą wejść i mniejszą liczbą wizualnych ograniczeń.

Największe ryzyko pojawia się tam, gdzie backend akceptuje więcej, niż pokazuje frontend:

inne metody,

inne formaty,

inne wersje,

inne ścieżki,

inne role,

inne sposoby identyfikacji zasobu.

Dlatego w testach API trzeba przestać myśleć jak użytkownik klikający aplikację.

Trzeba myśleć jak ktoś, kto rozmawia bezpośrednio z backendem.
