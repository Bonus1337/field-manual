---
id: email-threat-analysis-fundamentals
title: "Email Threat Analysis Fundamentals"
team: blue
category: email security
tags: ["email-security", "phishing", "spam", "email-headers", "soc", "social-engineering"]
difficulty: easy
updatedAt: "2026-02-21"
---

# Email Threat Analysis Fundamentals

## Po co w ogóle robię tę notatkę

Nie chcę robić kolejnego write-upu typu „co było w pokoju”, tylko wyciągnąć z materiału rzeczy, które faktycznie przydadzą mi się później w analizie.

To jest notatka do wracania przed pracą z podejrzanym mailem:

- co sprawdzić,
- gdzie najczęściej są pułapki,
- którym polom ufać mniej,
- co warto wyciągnąć jako IOC / materiał do detekcji.

W skrócie: **nie teoria dla teorii**, tylko fundament pod analizę phishingu i spamu.

---

## Dlaczego to jest ważne (i dlaczego sama technologia nie wystarczy)

Możesz mieć sensowne zabezpieczenia, filtrowanie, polityki, produkty do ochrony poczty - i to dalej nie daje 100%.

W praktyce często wystarczy:

- jeden pośpiech,
- jeden słabszy dzień użytkownika,
- jedno kliknięcie w link,
- jedno otwarcie załącznika.

I nagle atakujący ma foothold.

To jest dobry reminder, że email security to nie tylko „czy filtr działa”, ale też:

- **czy ktoś potrafi rozpoznać podejrzany mail**
- **czy analityk potrafi szybko ocenić sytuację**
- **czy zespół umie zareagować i zablokować kolejne wiadomości**

---

## Spam vs phishing (prosto, ale praktycznie)

### Spam

Masowe, niezamówione wiadomości. Czasem tylko irytujące, czasem początek czegoś gorszego.

### Phishing

Podszycie się pod zaufaną firmę / osobę / usługę, żeby:

- wyłudzić dane,
- skłonić do kliknięcia,
- uruchomić malware,
- wywołać określoną akcję (np. przelew, logowanie, reset hasła).

Dla mnie ważne: **spam i phishing to nie tylko „śmieci w skrzynce”**.  
To realny wektor wejścia do organizacji.

---

## Co jako analityk muszę umieć zrobić z mailem

Jak mail przejdzie przez filtry i trafi do użytkownika, moja robota to nie kończy się na „wygląda dziwnie”.

Muszę umieć:

1. **Ocenić maila** → malicious vs benign (albo przynajmniej podejrzany / wymagający eskalacji)
2. **Wyciągnąć artefakty** → domeny, adresy email, linki, IP, nazwy plików, tematy, patterny
3. **Zebrać kontekst techniczny** → skąd przyszedł, czy coś się nie zgadza w nagłówkach
4. **Przekazać materiał dalej** → tak, żeby dało się:
   - zablokować podobne wiadomości,
   - dodać reguły / detekcje,
   - ostrzec użytkowników

To jest ten moment, gdzie zwykłe „chyba phishing” już nie wystarcza.

---

## Z czego składa się adres email (prosty fundament, ale warto go mieć dobrze ułożony)

Adres email to:

- **mailbox / username** (część przed `@`)
- `@`
- **domena** (część po `@`)

Przykład:

- `billy@johndoe.com`

Tu:

- `billy` = mailbox
- `johndoe.com` = domena

### Jak to sobie wyobrażam

Domena = ulica  
Mailbox = konkretna skrzynka / dom

Niby banalne, ale to pomaga, kiedy później analizujesz:

- czy domena wygląda legit,
- czy ktoś podszywa się pod markę,
- czy `Reply-To` prowadzi gdzie indziej.

---

## Protokoły email - co warto rozumieć, a nie tylko zapamiętać nazwę

### SMTP

Protokół do **wysyłania maili**.

To mnie interesuje nie dlatego, żeby recytować definicję, tylko dlatego, że email przechodzi przez serwery i ta droga zostawia ślady w nagłówkach (głównie `Received`).

### POP3

Protokół do **pobierania** wiadomości z serwera do klienta.

W praktyce często:

- wiadomości są ściągane lokalnie,
- dostęp bardziej „na jednym urządzeniu”,
- można sobie narobić chaosu, jeśli coś znika z serwera po pobraniu.

### IMAP

Protokół do **synchronizacji** wiadomości między klientem a serwerem.

Praktycznie:

- wiadomości zostają na serwerze,
- można pracować z wielu urządzeń,
- to zwykle bardziej sensowny model w firmie.

### Krótki wniosek

Dla analityka najważniejsze jest nie „sucha definicja”, tylko rozumienie:

- **SMTP → transport**
- **POP3/IMAP → odbiór / dostęp użytkownika**

---

## POP3 vs IMAP (to, co naprawdę warto zapamiętać)

### POP3 - gdzie ludzie się mylą

POP3 nie jest „zły”, ale bywa problematyczny:

- maile często trafiają lokalnie na jedno urządzenie
- jeśli nie ma opcji trzymania kopii na serwerze, wiadomości mogą zostać usunięte z serwera
- użytkownik może mieć różny widok skrzynki na różnych urządzeniach

### IMAP - dlaczego zwykle wygrywa

- wiadomości są na serwerze
- synchronizacja między laptopem / telefonem / webmailem
- spójniejszy obraz sytuacji
- wygodniejsze w środowisku firmowym

Dla SOC/analizy to też bywa ważne, bo ma wpływ na to:

- gdzie jeszcze mail może być widoczny,
- czy użytkownik widzi to samo co admin / webmail.

---

## Jak email idzie od nadawcy do odbiorcy (i dlaczego mnie to obchodzi)

Schemat uproszczony:

1. Nadawca pisze maila.
2. Klient wysyła go do SMTP.
3. SMTP pyta DNS, gdzie dostarczyć mail dla domeny odbiorcy.
4. Mail przechodzi przez serwery po drodze.
5. Trafia do serwera docelowego.
6. Czeka na POP3/IMAP.
7. Odbiorca pobiera / synchronizuje wiadomość.

### Dlaczego to ważne w analizie

Bo ta droga zostawia ślad.  
I ten ślad widzisz później w nagłówkach.

To jest moment, w którym przestajesz patrzeć na maila tylko jak na „ładny / brzydki email”, a zaczynasz patrzeć jak na **artefakt techniczny**.

---

## Dwie części emaila, które zawsze rozdzielam w głowie

Każdy email ma dwie główne warstwy:

### 1) Header (nagłówek)

To metadane:

- skąd,
- dokąd,
- kiedy,
- którędy,
- jakie serwery go przetwarzały,
- jakie są informacje techniczne o treści.

### 2) Body (treść)

To to, co widzi użytkownik:

- tekst,
- HTML,
- linki,
- grafiki,
- call-to-action,
- czasem załączniki.

### Dlaczego to rozdzielam

Bo phishing może wyglądać bardzo dobrze w body, a nadal być podejrzany / złośliwy po nagłówkach.

I odwrotnie - sam „brzydki język” nie jest jeszcze dowodem.  
Liczy się całość.

---

## Co sprawdzam najpierw (szybki triage, zanim wejdę głębiej)

Na początku patrzę na to, co widać od razu w kliencie poczty:

- **From**
- **Subject**
- **Date**
- **To**

To jest szybki screening. Jeszcze nie wyrok.

### Czego szukam na tym etapie

- czy nadawca podszywa się pod znaną firmę / osobę
- czy temat buduje presję („urgent”, „invoice”, „suspended”, „action required”)
- czy treść jest generyczna
- czy coś wygląda „za bardzo pilnie” albo „za bardzo ważnie”
- czy styl nie pasuje do rzekomego nadawcy

### Ważne

Jeśli `From` wygląda dobrze, to **niczego nie potwierdza**.  
To dopiero początek.

---

## Raw email / source - tutaj zaczyna się realna analiza

To jest jedna z najważniejszych rzeczy do wbicia sobie do głowy:

**Nie analizuj podejrzanego maila tylko po tym, co pokazuje UI klienta poczty.**

Trzeba wejść w:

- `Show original`
- `View source`
- `Raw message`
- albo odpowiednik w danym kliencie

Dopiero tam masz pełny obraz:

- nagłówki,
- trasę przejścia,
- informacje o treści,
- załącznikach,
- kodowaniu.

Na początku to wygląda jak ściana tekstu, ale po czasie zaczynasz widzieć wzorce.

---

# Nagłówki email - pola, które naprawdę warto znać

Nie trzeba znać każdego możliwego pola na pamięć.  
Wystarczy wiedzieć, które dają realną wartość w triage.

---

## From (nadawca widoczny dla użytkownika)

Pole podstawowe i jednocześnie jedno z najbardziej zdradliwych.

### Co daje

- szybki kontekst
- informację, pod kogo ktoś się podszywa

### Gdzie jest pułapka

`From` można łatwo sfałszować.  
Dlatego:

- traktuję je jako **wskazówkę**
- nie traktuję jako **dowód**

To pole jest dobre do triage, ale za słabe do finalnego wniosku bez reszty nagłówków.

---

## Reply-To (bardzo często pomijane, a potrafi dużo powiedzieć)

To adres, na który pójdzie odpowiedź po kliknięciu „Odpowiedz”.

I to jest klasyczne miejsce na trik.

### Typowy scenariusz

- `From`: wygląda jak legalny nadawca
- `Reply-To`: prowadzi na zupełnie inny adres / domenę

W praktyce:

- użytkownik widzi „znaną markę”
- odpowiada
- rozmowa trafia do atakującego

### Mój wniosek

Jak analizuję maila i nie sprawdzę `Reply-To`, to zostawiam ślepy punkt.

---

## Received (najważniejsze pole / łańcuch pól)

Jeśli miałbym wskazać jedną rodzinę nagłówków, którą trzeba ogarniać najlepiej, to właśnie to.

`Received` pokazuje drogę maila przez serwery.

### Jak to czytać

**Od dołu do góry.**

To częsty błąd początkujących - czytają od góry i gubią sens.

- najniższe wpisy → bliżej źródła
- najwyższe wpisy → bliżej Twojego środowiska / odbiorcy

### Dlaczego to ważne

Tu można zobaczyć:

- skąd wiadomość przyszła,
- jakie hosty brały udział po drodze,
- czy coś wygląda nienaturalnie,
- czy są niespójności w trasie / czasie / nazwach hostów.

### Ważna zasada (bardzo praktyczna)

W nagłówkach wiele rzeczy da się sfałszować.  
Najbardziej ufam temu, co zostało dodane przez:

- mój serwer,
- mojego dostawcę poczty,
- infrastrukturę, którą kontrolujemy.

Czyli: **nie każdy `Received` ma ten sam poziom zaufania**.

---

## X-Originating-IP (jeśli występuje)

To pole bywa bardzo pomocne, bo może wskazywać IP źródłowe klienta / nadawcy.

### Po co mi to

- reputacja IP
- kontekst geograficzny / operator
- korelacja kampanii
- szybki pivot do dalszej analizy

### Uwaga praktyczna

Nie zawsze jest obecne.  
Jak go nie ma, wracam do analizy `Received`.

---

## Authentication-Results (oraz pola pokrewne)

To miejsce, gdzie serwer odbiorcy zapisuje wyniki swojej oceny / weryfikacji wiadomości.

W materiałach i nagłówkach można spotkać np. odniesienia do:

- `smtp.mailfrom`
- `header.from`

### Dlaczego mnie to obchodzi

Bo phishing często opiera się na tym, że:

- to, co widzi użytkownik, wygląda dobrze,
- ale techniczne szczegóły domen / nadawcy już się rozjeżdżają.

Nie zawsze trzeba od razu robić głęboką analizę wszystkich mechanizmów - ale warto umieć zauważyć, że coś się **nie spina**.

---

## Return-Path

Adres zwrotny (envelope sender).

### Po co sprawdzać

Bo może dać dodatkową warstwę kontekstu:

- inna domena niż `From`
- ślad infrastruktury wysyłkowej
- kolejny punkt do porównania spójności maila

To nie jest pole, na którym opieram całą ocenę, ale często dobrze uzupełnia obraz.

---

## Message-ID

Identyfikator wiadomości nadany przez system pocztowy.

### Po co mi to w praktyce

- korelacja w logach
- porównanie podobnych wiadomości
- dodatkowe tropy (czasem nazwa hosta / domena w ID coś mówi)

### Uwaga

Tak samo jak inne pola - może być fałszowane.  
Przydatne jako **artefakt pomocniczy**, nie jako święty graal.

---

## MIME / Content-Type / Content-Transfer-Encoding (czyli techniczna warstwa treści)

Te pola mówią, z czym masz do czynienia:

- zwykły tekst?
- HTML?
- załącznik?
- jak to jest zakodowane?

### Typowe przykłady

- `Content-Type: text/plain`
- `Content-Type: text/html`
- `Content-Type: application/pdf`
- `Content-Disposition: attachment`
- `Content-Transfer-Encoding: base64`

### Dlaczego to ważne

Bo z punktu widzenia analizy:

- body może wyglądać „normalnie”, ale źródło pokaże coś więcej,
- załącznik może być osadzony i zakodowany,
- treść HTML może ukrywać rzeczy, których użytkownik nie widzi od razu.

---

# Treść emaila (body) - gdzie atakujący robi robotę „psychologiczną”

To jest warstwa, która ma skłonić ofiarę do działania.

Treść może być:

- plain text,
- HTML,
- mieszana (MIME multipart),
- z obrazkami, linkami, przyciskami, brandingiem.

### Co sprawdzam w body

- czy jest presja czasu / stres / autorytet
- czy jest żądanie logowania / płatności / potwierdzenia
- czy język jest generyczny
- czy styl pasuje do rzekomej firmy
- czy link wyświetlany ≠ link docelowy
- czy są skrócone URL-e

### Ważna obserwacja

„Brzydki phishing” istnieje, ale dziś dużo wiadomości jest wizualnie dopracowanych.  
Nie można opierać analizy na samym „to wygląda amatorsko”.

---

# Załączniki - najwięcej szkody robi ciekawość + pośpiech

Załącznik w mailu to klasyczny wektor:

- malware,
- loader,
- dokument z makrami / payloadem,
- PDF z linkiem / social engineeringiem,
- archiwum z podejrzaną zawartością.

### Co mogę zobaczyć w source

- `Content-Type`
- `Content-Disposition: attachment`
- `Content-Transfer-Encoding`
- czasem zakodowaną zawartość (np. base64)

### Najważniejsza zasada operacyjna

Nie otwieram załącznika „żeby tylko sprawdzić”.  
Najpierw:

- metadane,
- kontekst,
- procedura,
- bezpieczne środowisko (jeśli analiza ma iść dalej).

Najwięcej błędów nie bierze się z braku wiedzy, tylko z odruchu „kliknę na szybko”.

---

# Typy ataków związanych z phishingiem (warto rozróżniać, bo wpływa to na ocenę ryzyka)

## Spam

Masowa wiadomość, zwykle szeroka kampania.

## MalSpam

Spam, ale już z celem złośliwym (malware / credential theft / scam).

## Phishing

Podszycie pod zaufaną usługę / firmę / osobę.

## Spear phishing

Phishing szyty pod konkretną osobę lub organizację.

## Whaling

Wersja spear phishingu wymierzona w osoby wysokiego szczebla (CEO, CFO itd.).

## Smishing

Phishing przez wiadomości tekstowe / mobile.

## Vishing

Phishing przez połączenia głosowe.

### Dlaczego to rozróżnienie ma znaczenie

Bo inaczej oceniasz:

- masową kampanię na losowych użytkowników,
- a inaczej precyzyjny mail do CFO z tematem przelewu i kontekstem biznesowym.

---

# Typowe cechy phishingu (moja checklista mentalna)

Nie traktuję tego jak „listy obowiązkowej” - phishing nie musi mieć wszystkiego naraz.  
Ale im więcej punktów się zgadza, tym bardziej zapala się lampka.

### Częste cechy

- podszycie pod zaufaną markę / dział / osobę
- pilny temat (presja, groźba, termin)
- próba wymuszenia szybkiej akcji
- generyczne przywitanie
- linki ukrywające realny adres
- podejrzany załącznik udający dokument
- niespójności między `From`, `Reply-To`, `Return-Path`, domenami, trasą w `Received`
- treść „na emocjach” zamiast sensownego kontekstu

### Uwaga z praktyki

Brak literówek **nie oznacza**, że mail jest bezpieczny.  
Atakujący też potrafią pisać poprawnie.

---

# Defanging - mały nawyk, który realnie chroni zespół

Przy analizie i eskalacji nie przekazuję aktywnych linków / adresów „na żywo”.

### Przykłady defangingu

- `test@example.com` → `test[@]example[.]com`
- `http://example.com/login` → `hxxp[://]example[.]com/login`

### Po co to robię

Żeby ktoś:

- w SOC,
- w helpdesku,
- w mailu eskalacyjnym,
- w Teams/Slacku

nie kliknął przypadkiem w coś złośliwego.

To jest mały detal, ale bardzo „zawodowy”.

---

# BEC (Business Email Compromise) - termin, który trzeba znać i rozumieć

BEC to nie jest zwykły phishing „z zewnątrz”.

To scenariusz, w którym atakujący:

1. przejmuje prawdziwe konto pracownika,
2. używa go do oszustwa wewnątrz firmy.

### Co wtedy robi

- prosi o pilny przelew
- zmienia dane do płatności
- wyciąga wrażliwe informacje
- naciska autorytetem („zrób to teraz”)

### Dlaczego to jest groźne

Bo wiadomość przychodzi z realnego, wewnętrznego konta.  
To omija część naturalnej czujności ludzi („przecież to od naszego człowieka”).

To jest jeden z tych tematów, które warto umieć wyjaśnić normalnym językiem na rozmowie technicznej.

---

# Mój manualny workflow analizy podejrzanego maila (wersja podstawowa)

To jest bardziej „jak myślę”, niż sztywny SOP.

## 1. Najpierw bezpieczeństwo

- nie klikam linków
- nie otwieram załączników
- nie odpowiadam na maila

Brzmi banalnie, ale to pierwszy filtr błędów.

## 2. Szybki triage w UI klienta

Sprawdzam:

- From
- Subject
- Date
- To
- ogólny kontekst treści

Szukam czerwonych flag, ale jeszcze nie przesądzam.

## 3. Otwieram raw/source

Bez tego analiza jest niepełna.

Patrzę na:

- `Reply-To`
- `Return-Path`
- `Received`
- `X-Originating-IP` (jeśli jest)
- pola związane z uwierzytelnianiem / oceną serwera odbiorcy
- MIME / Content-Type

## 4. Czytam `Received` od dołu do góry

Tu najłatwiej się pomylić.  
Patrzę na:

- kolejność,
- hosty,
- czasy,
- niespójności.

## 5. Analizuję treść i linki ostrożnie

- nie klikam
- defanguję
- zapisuję artefakty (IOC)

## 6. Załączniki traktuję jak potencjalnie złośliwe

Najpierw metadane i kontekst, potem ewentualna analiza zgodnie z procedurą.

## 7. Składam notatkę / wynik analizy

Nie tylko „phishing / nie phishing”, ale:

- **dlaczego**
- **jakie artefakty**
- **co warto zablokować / monitorować**
- **czy są oznaki kampanii / BEC / credential theft**

---

# Najczęstsze błędy (których sam chcę unikać)

## 1) Ocena po samym wyglądzie maila

Łatwo wpaść w:

- „wygląda legit”
- „logo jest dobre”
- „ładny HTML”

To za mało.

## 2) Zaufanie do pola From

`From` jest ważne, ale samo niczego nie dowodzi.

## 3) Pominięcie Reply-To

A to często właśnie tam wychodzi scam.

## 4) Nieczytanie Received w dobrej kolejności

`Received` czytamy **od dołu do góry**.

## 5) Klikanie „dla sprawdzenia”

To nie analiza. To ryzyko.

## 6) Przekazywanie aktywnych linków bez defangingu

Mały błąd, a może narobić problemów komuś w zespole.

## 7) Opieranie wniosku na jednym wskaźniku

Pojedyncze pole bywa mylące.  
Liczy się **spójność obrazu** z wielu elementów.

---

# Co chcę zapamiętać po tym materiale

- Email to **header + body**.
- Najwięcej wartości technicznej jest zwykle w **nagłówkach**.
- `From` może być podszyte - nie traktuję go jako dowodu.
- `Reply-To` to pole, które często zdradza intencję atakującego.
- `Received` jest kluczowe i czytam je **od dołu do góry**.
- Linki / adresy / domeny defanguję przed przekazaniem dalej.
- BEC = przejęte konto wewnętrzne użyte do oszustwa wewnątrz firmy.
- Celem analizy nie jest tylko „wykryć phishing”, ale też **wyciągnąć artefakty i poprawić obronę**.
