---
id: csrf-browser-as-an-untrusted-deputy
title: "CSRF: kiedy przeglądarka wykonuje cudzą wolę"
team: red
domain: web-security
section: vulnerabilities
type: knowledge
angle: pentest-workflow
sourceTrack: baw
tags: ["csrf", "xsrf", "session-riding", "cookies", "samesite", "xss", "web", "api"]
difficulty: medium
shortDescription: "CSRF nie polega na przejęciu sesji ani złamaniu hasła. Problemem jest to, że aplikacja nie odróżnia żądania świadomie wykonanego przez użytkownika od żądania wymuszonego przez kontekst przeglądarki."
updatedAt: "2026-04-15"
---

# CSRF: kiedy przeglądarka wykonuje cudzą wolę

CSRF jest jedną z tych podatności, które bardzo łatwo zrozumieć źle, jeśli patrzy się na nią tylko przez pryzmat payloadu. To nie jest problem typu „da się wysłać request”. Requesty da się wysyłać zawsze. Problem zaczyna się wtedy, gdy aplikacja uznaje za legalne żądanie, którego użytkownik wcale świadomie nie zainicjował.

Sedno CSRF jest proste: aplikacja ufa temu, że skoro przeglądarka wysłała poprawne, uwierzytelnione żądanie HTTP, to użytkownik faktycznie chciał wykonać daną akcję. A to założenie jest błędne.

W praktyce atakujący nie atakuje backendu bezpośrednio. On wykorzystuje przeglądarkę ofiary jako pośrednika. Dla serwera wszystko wygląda normalnie: poprawny request, poprawna sesja, prawidłowe ciasteczka, zwykły ruch od zalogowanego użytkownika. Tylko intencja nie pochodzi od użytkownika.

---

# Co naprawdę musi się wydarzyć, żeby CSRF zadziałał

Żeby mówić o realnym CSRF, zwykle muszą zejść się razem cztery elementy:

1. Ofiara ma aktywny kontekst uwierzytelnienia do aplikacji.
2. Aplikacja opiera autoryzację na czymś, co przeglądarka dołącza automatycznie, najczęściej na sesyjnym ciastku.
3. Istnieje endpoint zmieniający stan aplikacji.
4. Aplikacja nie weryfikuje, czy akcja została wykonana świadomie przez użytkownika.

To jest najważniejsza rzecz do zapamiętania: CSRF nie dotyczy samego requestu. Dotyczy braku dowodu intencji.

---

# To nie jest XSS, ale XSS bardzo pomaga

CSRF bywa mylony z XSS, bo oba błędy mogą prowadzić do nieautoryzowanych działań. Tylko mechanika jest inna.

W XSS atakujący wstrzykuje i uruchamia własny kod w kontekście aplikacji.
W CSRF atakujący nie musi uruchamiać JavaScriptu ani łamać originu. Wystarczy, że doprowadzi do wysłania żądania przez przeglądarkę ofiary.

Różnica jest kluczowa:

- **CSRF może istnieć bez XSS**
- **XSS często pozwala obejść zabezpieczenia anty-CSRF**
- **XSS może służyć do wykradzenia tokenu CSRF albo do wysłania requestu z prawidłowym tokenem**

Czyli CSRF i XSS to nie to samo, ale w praktyce bardzo często się wzmacniają.

---

# Dlaczego Same-Origin Policy tego nie blokuje

To jest miejsce, gdzie wiele osób mentalnie się wykłada.

Same-Origin Policy nie mówi: „przeglądarka nie może wysłać requestu do innej domeny”.
Same-Origin Policy głównie ogranicza **odczyt odpowiedzi** i dostęp do danych między originami.

To oznacza, że przeglądarka bardzo często **może wysłać** cross-origin request jako element normalnego działania HTML, np. przez:

- `img`
- `form`
- `iframe`
- `script`
- `audio`
- `video`
- `object`

I właśnie na tym żeruje CSRF. Atakujący zwykle nie musi zobaczyć odpowiedzi. Wystarczy mu, że akcja po stronie serwera zostanie wykonana.

To jest ważny mindset:
**w CSRF problemem nie jest odczyt danych, tylko wywołanie skutku.**

---

# Najprostszy model myślenia o CSRF

Zamiast myśleć „czy da się wysłać request?”, myśl tak:

> Czy przeglądarka zalogowanego użytkownika może zostać zmuszona do wykonania akcji, którą backend uzna za legalną?

Jeśli tak, to jesteś w rejonie CSRF.

---

# Typowe scenariusze

## 1. Akcja po GET

To klasyka i jednocześnie sygnał, że aplikacja ma bardzo słabą higienę bezpieczeństwa.

Jeśli endpoint typu:

- tworzy użytkownika,
- usuwa konto,
- zmienia hasło,
- przełącza flagę,
- resetuje konfigurację,

i robi to po **GET**, to bardzo często da się go odpalić przez zwykły element HTML, np. obrazek.

To oznacza, że wystarczy, aby ofiara odwiedziła stronę zawierającą odpowiednio spreparowany tag. Bez JavaScriptu. Bez odczytu odpowiedzi. Bez znajomości hasła ofiary.

### Wniosek

GET nie może zmieniać stanu aplikacji.
Jeśli zmienia, to prosisz się o CSRF i o chaos operacyjny.

---

## 2. Akcja po POST

Bardzo częsty mit brzmi: „jak jest POST, to nie ma CSRF”.

To nieprawda.

Formularz HTML może wysłać POST automatycznie. Wystarczy ukryty formularz i autosubmit po wejściu na stronę. Jeżeli sesja ofiary jest aktywna, backend może potraktować taki request jako prawidłowy.

### Wniosek

POST sam w sobie nie daje żadnej ochrony przed CSRF.
Zmiana metody z GET na POST bez dodatkowej walidacji niczego nie rozwiązuje.

---

## 3. Metody inne niż GET i POST

W praktyce wiele aplikacji i frameworków wspiera różne obejścia typu:

- `_method=DELETE`
- `_method=PUT`

Jeżeli backend honoruje taki parametr, to atakujący może opakować logikę DELETE lub PUT w zwykły formularz POST albo nawet w niektórych przypadkach w GET.

### Wniosek

Podczas testów nie patrz tylko na „oficjalną” metodę endpointu.
Patrz też, czy aplikacja wspiera method override.

---

## 4. Atak na zasoby w sieci prywatnej

To jeden z ciekawszych wariantów, bo dobrze pokazuje, że CSRF to nie tylko „kliknij w link do banku”.

Jeżeli ofiara siedzi w sieci LAN i jej przeglądarka może sięgnąć do panelu routera, drukarki, kamery, NAS-a czy innego urządzenia webowego, to strona atakującego może próbować wysłać request właśnie tam.

Tu uwierzytelnienie może się opierać nie tylko na ciastkach. Czasem problemem są:

- domyślne hasła,
- brak uwierzytelnienia,
- słaby interfejs administracyjny dostępny tylko z LAN,
- stare mechanizmy Basic Authentication,
- urządzenia ufające lokalnej sieci bardziej niż powinny.

### Wniosek

CSRF to nie tylko aplikacje internetowe.
To również interfejsy admina urządzeń, które ufają przeglądarce użytkownika w złym miejscu.

---

# Gdzie CSRF boli najbardziej

Nie każdy endpoint podatny na CSRF daje realną wartość atakującemu. Najgroźniejsze są funkcje zmieniające stan systemu, zwłaszcza:

- zmiana hasła,
- zmiana adresu e-mail,
- dodanie nowego administratora,
- modyfikacja uprawnień,
- wykonanie przelewu,
- dodanie zaufanego odbiorcy,
- usunięcie konta,
- zmiana konfiguracji,
- restart urządzenia,
- wygenerowanie klucza lub tokenu,
- podpięcie integracji,
- wyłączenie zabezpieczeń.

Najprostsze pytanie testowe brzmi:

> Co najgorszego może zrobić zalogowany użytkownik jednym requestem?

Jeśli odpowiedź brzmi „dużo”, to każdy brak ochrony anty-CSRF przy takim requestcie powinien zapalić lampkę.

---

# Wieloetapowy mindset: CSRF rzadko bywa końcem ataku

Bardzo często CSRF nie jest ostatnim krokiem, tylko wejściem do łańcucha.

Przykładowy schemat myślenia:

1. Zmuszasz administratora do wykonania jednej akcji.
2. Ta akcja osadza dane w systemie.
3. Później inne miejsce renderuje te dane niebezpiecznie.
4. Powstaje XSS, eskalacja uprawnień albo przejęcie systemu.

To ważne, bo w praktyce nie każdy CSRF będzie wyglądał „efektownie” sam w sobie. Czasem sam request zrobi pozornie mało. Prawdziwa wartość pojawia się dopiero w kolejnym etapie.

Dlatego przy analizie nigdy nie kończ myślenia na:

- „da się dodać komentarz”
- „da się zmienić nazwę”
- „da się dodać wpis”

Pytaj dalej:

- gdzie to się potem wyświetli?
- kto to zobaczy?
- czy to trafia do panelu administracyjnego?
- czy da się z tego zrobić XSS, stored action albo persistence?

---

# Jak rozpoznawać CSRF podczas testów

## Sygnały ostrzegawcze

### 1. Aplikacja używa sesyjnych cookies

Jeśli autoryzacja opiera się na ciastkach dołączanych automatycznie przez przeglądarkę, CSRF od razu staje się kandydatem do testu.

### 2. Brak tokenu anty-CSRF

W formularzu lub requestcie nie ma żadnej wartości jednorazowej powiązanej z sesją.

### 3. Token jest, ale wygląda statycznie

Ten sam token dla różnych użytkowników, dla różnych sesji albo przez długi czas może oznaczać martwe zabezpieczenie.

### 4. Endpoint zmienia stan po GET

To czerwony alarm.

### 5. Endpoint przyjmuje POST, ale nie wymaga żadnego potwierdzenia intencji

Brak tokenu, brak walidacji `Origin`, brak walidacji `Referer`, brak dodatkowego kroku.

### 6. Aplikacja wspiera `_method`

Wtedy nawet teoretycznie „bezpieczniejsze” metody mogą być osiągalne przez prostszy wektor.

### 7. Logowanie nie jest chronione

To mniej intuicyjne, ale login CSRF też istnieje. Ofiara może zostać zalogowana na konto kontrolowane przez atakującego, co potem otwiera drogę do różnych nadużyć.

---

# Prosty playbook testowy

## Krok 1. Wytypuj akcje zmieniające stan

Nie zaczynaj od wszystkiego. Najpierw znajdź najbardziej wrażliwe miejsca:

- profil
- konto
- ustawienia
- administracja
- billing
- transfery
- API write endpoints
- integracje
- uploady
- akcje moderacyjne

## Krok 2. Sprawdź, na czym opiera się sesja

Jeśli to cookies, test na CSRF ma sens od razu.
Jeśli autoryzacja używa nagłówka `Authorization: Bearer ...`, klasyczny CSRF zwykle jest trudniejszy albo nie dotyczy danego flow, bo przeglądarka nie dołącza takiego nagłówka automatycznie jak ciastek.

## Krok 3. Zobacz, czy jest token anty-CSRF

Patrz w:

- formularze HTML,
- hidden inputy,
- nagłówki custom,
- payloady AJAX,
- odpowiedzi, które dostarczają token do kolejnego requestu.

## Krok 4. Oceń, czy token jest naprawdę sprawdzany

Najczęstszy błąd juniorów: widzą token i uznają temat za zamknięty.

Trzeba sprawdzić:

- czy request bez tokenu przechodzi,
- czy request z pustym tokenem przechodzi,
- czy request z błędnym tokenem przechodzi,
- czy token jednej sesji działa w drugiej,
- czy token da się przewidzieć albo odtworzyć.

## Krok 5. Sprawdź metody alternatywne

Jeżeli endpoint działa na POST, sprawdź:

- czy nie przyjmuje tych samych parametrów po GET,
- czy nie wspiera `_method`,
- czy nie da się użyć innej ścieżki do tej samej operacji.

## Krok 6. Oceń rolę SameSite

Zobacz, jakie flagi mają ciastka sesyjne. SameSite może utrudnić część ataków cross-site, ale nie traktuj tego jako końca analizy.

## Krok 7. Szukaj łańcuchów

Nawet jeśli pojedyncza akcja wygląda niegroźnie, sprawdź:

- czy wynik trafia do panelu admina,
- czy może zmienić dane bezpieczeństwa,
- czy może posłużyć do persistence,
- czy może być etapem do XSS albo account takeover.

---

# Jak powinno wyglądać poprawne myślenie defensywne

## 1. Nie zmieniaj stanu aplikacji przez GET

To podstawowa higiena. GET ma służyć do odczytu.
Jeśli masz akcję modyfikującą stan po GET, napraw najpierw architekturę, potem resztę.

## 2. Stosuj tokeny anty-CSRF powiązane z sesją

Token musi być:

- losowy,
- trudny do odgadnięcia,
- powiązany z użytkownikiem lub sesją,
- sprawdzany po stronie serwera.

Samo generowanie tokenu nic nie daje, jeśli backend go nie waliduje.

## 3. Uważaj na wyciek tokenów

Token w GET to zły pomysł, bo może wylądować w:

- historii przeglądarki,
- logach,
- nagłówku `Referer`,
- narzędziach pośrednich.

Dlatego akcje zmieniające stan powinny iść przez POST lub inne kontrolowane mechanizmy, a nie przez URL.

## 4. Rozsądnie używaj SameSite

SameSite to dobra warstwa ochronna, ale nie jedyna.

Pomaga szczególnie wtedy, gdy sesja opiera się na ciastkach i atak jest cross-site. Nie pomaga jednak we wszystkich scenariuszach, np.:

- atak same-site,
- atak bez użycia cookies,
- atak na zasoby LAN,
- łańcuch z innymi podatnościami.

## 5. Chroń też ekran logowania

Bo login CSRF również bywa groźny.
Użytkownik zalogowany na konto atakującego może później wykonywać działania, które finalnie służą atakującemu.

## 6. Traktuj framework świadomie

Wbudowana ochrona we frameworku nie oznacza automatycznie pełnego bezpieczeństwa.

Trzeba wiedzieć:

- czy jest domyślnie włączona,
- które endpointy obejmuje,
- czy działa dla GET,
- czy programista nie wyłączył jej lokalnie,
- czy frontend nie omija standardowego flow.

---

# Gdzie zabezpieczenia często są zepsute mimo że „wyglądają dobrze”

To bardzo praktyczna sekcja, bo właśnie tu często wpadają realne bugi.

## Token istnieje, ale backend go nie sprawdza

Front pokazuje hidden input, więc wszyscy są spokojni.
Request bez tokenu dalej działa.

## Token jest globalny

Ta sama wartość dla wszystkich użytkowników albo dla wielu sesji.

## Token jest przewidywalny

Np. oparty o timestamp, user ID albo inny schemat, który da się odtworzyć.

## Token wycieka do zewnętrznego originu

Np. przez źle zrobione formularze kierujące poza aplikację.

## Aplikacja chroni tylko część endpointów

Najczęstszy przypadek: formularze webowe są chronione, ale JSON API już nie.

## SameSite daje fałszywe poczucie bezpieczeństwa

Bo zespół zakłada, że temat zniknął, mimo że istnieją scenariusze same-site albo inne nośniki autoryzacji.

---

# Praktyczne użycie tej wiedzy w pentestach

## Podczas reconu aplikacji

Nie patrz tylko na XSS, SQL Injection i IDOR.
Od razu kataloguj akcje state-changing i sprawdzaj, jak aplikacja dowodzi intencji użytkownika.

## Podczas analizy requestów w Burpie

Przy każdym requestcie modyfikującym stan zadawaj trzy pytania:

1. Czy to jest akcja wrażliwa?
2. Co aplikacja sprawdza poza samą sesją?
3. Czy przeglądarka mogłaby wysłać to bez świadomej akcji użytkownika?

## Podczas testów paneli administracyjnych

Szczególnie patrz na:

- dodawanie użytkowników,
- zmianę ról,
- reset haseł,
- akcje moderacyjne,
- uploady,
- konfigurację integracji,
- webhooki i API keys.

## Podczas testów urządzeń i paneli LAN

Pytaj:

- czy interfejs ufa lokalnej sieci,
- czy są domyślne hasła,
- czy akcje są wykonywane po GET,
- czy w ogóle brak uwierzytelnienia nie czyni z tego CSRF-like abuse z przeglądarki ofiary.

## Podczas raportowania

Nie opisuj CSRF jako „da się wysłać request z innej strony”. To za słabe i zbyt ogólne.

Lepiej opisać:

- jaka akcja została wymuszona,
- w jakim kontekście sesji,
- czy atak wymaga socjotechniki,
- czy działa cross-site czy same-site,
- czy prowadzi bezpośrednio do impactu, czy jest elementem łańcucha.

---

# Najważniejsze błędy mentalne przy CSRF

## „POST wystarczy”

Nie wystarczy.

## „Mamy token w formularzu”

To jeszcze nie znaczy, że jest walidowany.

## „SameSite załatwia temat”

Nie załatwia wszystkiego.

## „Brak JavaScriptu oznacza brak ryzyka”

Nie. Wiele ataków CSRF działa bez JavaScriptu.

## „Atakujący nie widzi odpowiedzi, więc to mało groźne”

W CSRF często nie trzeba widzieć odpowiedzi. Liczy się wykonanie akcji.

## „To tylko drobna akcja”

Drobna akcja może być pierwszym krokiem do pełnego przejęcia.

---

# Esencja do zapamiętania

CSRF to nie jest problem „cross-site” sam w sobie.
To jest problem **braku potwierdzenia intencji użytkownika**.

Przeglądarka:

- umie wysłać request,
- umie dołączyć sesję,
- umie działać cross-origin w wielu miejscach,
- nie gwarantuje, że użytkownik naprawdę chciał wykonać akcję.

Jeżeli backend nie ma własnego mechanizmu odróżniania intencji od automatyzmu przeglądarki, to ufa niewłaściwej rzeczy.

I właśnie tam rodzi się CSRF.

---

# Checklist operacyjny

## Dla testera

- znajdź akcje zmieniające stan,
- sprawdź, czy autoryzacja siedzi w cookies,
- sprawdź token anty-CSRF,
- sprawdź jego walidację,
- sprawdź GET/POST i method override,
- oceń SameSite,
- poszukaj łańcucha z XSS lub inną podatnością.

## Dla developera

- nie używaj GET do zmian stanu,
- stosuj per-session lub per-request tokeny,
- waliduj token po stronie serwera,
- nie dopuszczaj do wycieku tokenu,
- włącz SameSite jako dodatkową warstwę,
- nie zakładaj, że framework zrobi wszystko sam,
- chroń też login i niestandardowe flow.

---

# Finalny mindset

W web security bardzo łatwo patrzeć na requesty jak na techniczne obiekty.
CSRF zmusza do innego myślenia.

Tu nie chodzi o to, czy request jest poprawny.
Chodzi o to, **czy użytkownik naprawdę chciał go wysłać**.

Jeżeli aplikacja tego nie umie udowodnić, to bezpieczeństwo opiera na założeniu, którego przeglądarka nigdy nie gwarantowała.
