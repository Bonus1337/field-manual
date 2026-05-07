---
id: web-http-security-headers
title: "Nagłówki HTTP w kontekście bezpieczeństwa"
team: red
domain: web-security
section: foundations
type: knowledge
angle: pentest-mindset
sourceTrack: baw
tags: ["http", "hsts", "host-header", "host-confusion", "clickjacking", "web-security"]
difficulty: medium
shortDescription: "Notatka o nagłówkach HTTP jako praktycznym źródle sygnałów bezpieczeństwa, pokazująca jak czytać je w kontekście realnych funkcji aplikacji, gdzie szukać złych założeń po stronie przeglądarki i w jaki sposób request headers mogą prowadzić do bypassów, host confusion oraz nadużyć zaufania po stronie backendu."
updatedAt: "2026-03-23"
---

# Nagłówki HTTP w kontekście bezpieczeństwa

## Po co w ogóle to sobie zapisuję

Nagłówki HTTP to jedna z tych rzeczy, które łatwo zepchnąć na bok, bo nie wyglądają jak „prawdziwa” podatność.

A potem okazuje się, że właśnie one bardzo szybko pokazują:

- czy aplikacja ma jakąkolwiek higienę bezpieczeństwa po stronie przeglądarki,
- czy da się ograniczyć skutki XSS, clickjackingu albo wycieku danych,
- czy backend ufa danym z requestu bardziej, niż powinien.

Dla mnie to nie jest temat pod hasłem: „nagłówki = bezpieczeństwo”.
To raczej temat pod hasłem:

**nagłówki mówią, jak myśli aplikacja i gdzie może mieć złe założenia.**

---

# Jak patrzę na nagłówki na teście

Nie analizuję ich jak checklisty z audytu compliance.

Patrzę prościej:

- czego tu brakuje,
- co jest ustawione za słabo,
- co to zmienia w praktyce,
- czy mogę to wykorzystać ofensywnie.

Czyli nie interesuje mnie samo:

> brakuje X-Frame-Options

Tylko raczej:

> brakuje ograniczenia framingu na panelu z akcjami użytkownika, więc clickjacking zaczyna mieć sens.

To samo z każdym innym nagłówkiem.

---

# Co jest dla mnie najważniejsze

## HSTS

Jeśli aplikacja działa po HTTPS, to chcę widzieć, że HTTPS jest traktowany serio, a nie jako „jedna z opcji”.

Nagłówek `Strict-Transport-Security` mówi przeglądarce:

> z tą stroną masz gadać tylko po HTTPS.

Najważniejsze pytanie nie brzmi:

> czy nagłówek jest?

Tylko:

> czy całość naprawdę wymusza bezpieczny transport?

Bo bardzo łatwo spotkać sytuację, gdzie:

- aplikacja ma HSTS,
- ale wejście po HTTP dalej działa dziwnie,
- albo redirect jest zrobiony byle jak,
- albo subdomeny w ogóle nie są objęte polityką.

To nie jest nagłówek, który „naprawia bezpieczeństwo”.
To jest nagłówek, który ma utrudnić zejście z bezpiecznej ścieżki.

### Co z tego pamiętam

- jeśli nie ma HSTS, patrzę uważniej na HTTPS i zachowanie po HTTP,
- jeśli nie ma `includeSubDomains`, zaczynam myśleć o subdomenach i cookies domenowych,
- jeśli wszystko wygląda dobrze tylko na głównej domenie, to jeszcze nie znaczy, że dobrze wygląda cała reszta.

---

## Referrer-Policy

To jest nagłówek, który bardzo łatwo zlekceważyć, dopóki nie pomyślisz, ile rzeczy potrafi siedzieć w URL.

Jeśli aplikacja nie kontroluje dobrze `Referer`, to przy przejściu na inną stronę mogą wyciekać:

- ścieżki paneli,
- nazwy klientów,
- identyfikatory,
- tokeny w query stringu,
- fragmenty workflow, których nikt nie chciał ujawniać.

Nie każda aplikacja od tego od razu płonie.
Ale to jest bardzo dobry sygnał jakości myślenia zespołu.

Jeśli widzę:

- linki wychodzące,
- zewnętrzne integracje,
- akcje resetu hasła,
- identyfikatory w URL,
- wewnętrzne ścieżki biznesowe,

to brak sensownej `Referrer-Policy` przestaje być detalem.

### Co z tego pamiętam

Najważniejsze nie jest wyuczenie wszystkich wariantów polityki, tylko zrozumienie jednego:
**czy aplikacja ogranicza to, ile poprzedniego URL-a wypływa dalej.**

---

## X-Content-Type-Options

Ten nagłówek jest ważny głównie wtedy, gdy aplikacja serwuje treść, nad którą użytkownik ma jakiś wpływ.

Czyli klasycznie:

- uploady,
- pliki użytkownika,
- dynamiczne exporty,
- zasoby zwracane z dziwnym `Content-Type`.

`X-Content-Type-Options: nosniff` mówi przeglądarce:

> nie kombinuj, nie zgaduj, trzymaj się zadeklarowanego typu.

I to ma sens, bo bez tego przeglądarka czasem próbuje „domyślić się”, czym dany plik naprawdę jest.

To bywa niebezpieczne, jeśli aplikacja:

- źle opisuje typ pliku,
- przyjmuje nietypowe dane,
- albo pozwala hostować treść kontrolowaną przez użytkownika.

To nie jest magiczny XSS killer.
Ale w połączeniu z uploadem i błędnym serwowaniem plików potrafi zrobić różnicę.

### Co z tego pamiętam

Jeśli nie ma `nosniff`, a obok istnieje upload albo user-controlled content, to od razu zapisuję sobie to jako miejsce warte głębszego sprawdzenia.

---

## X-Frame-Options / framing

Tu pytanie jest bardzo proste:

**czy tę stronę można bez problemu osadzić w ramce?**

Jeśli tak, a strona robi coś istotnego:

- zmienia dane,
- zatwierdza akcje,
- obsługuje konto,
- ma panel administracyjny,
- ma ważne formularze,

to zaczynam myśleć o clickjackingu.

`X-Frame-Options` to prosta warstwa obrony.
Dziś często podobną rolę przejmuje też CSP z `frame-ancestors`, ale sens myślenia jest ten sam:

> czy obca strona może próbować wczytać mój panel do ramki i manipulować kliknięciem użytkownika?

To jest dokładnie ten typ rzeczy, który na zwykłej stronie marketingowej nie robi dużego wrażenia, ale na panelu operacyjnym robi już bardzo konkretny.

### Co z tego pamiętam

Brak ochrony framingu nie zawsze jest podatnością samą w sobie.
Ale przy wrażliwych akcjach daje bardzo sensowny punkt zaczepienia.

---

## Permissions-Policy

To jest temat mniej „głośny”, ale nadal przydatny do czytania aplikacji.

Ten nagłówek mówi mniej więcej:

> jakie możliwości przeglądarki ta strona naprawdę potrzebuje?

Na przykład:

- kamera,
- mikrofon,
- geolokalizacja,
- fullscreen,
- różne API urządzenia.

Nie traktuję tego jako głównej warstwy bezpieczeństwa.
Bardziej jako sygnał dojrzałości i ograniczania niepotrzebnych możliwości.

Jeśli aplikacja nie korzysta z mikrofonu, kamery czy geolokalizacji, to dobrze, gdy nie zostawia takich rzeczy otwartych „na wszelki wypadek”.

### Co z tego pamiętam

To nie jest pierwszy nagłówek, od którego zaczynam test.
Ale jeśli aplikacja jest rozbudowana, mocno frontendowa i korzysta z wielu integracji, warto go sprawdzić.

---

# Najciekawsza część: nagłówki jako wejście do ataku

To jest miejsce, gdzie temat robi się naprawdę praktyczny.

Bo nagłówki to nie tylko response.
Bardzo często to także request.
A request headers bywają przez backend traktowane jak prawda objawiona.

I wtedy zaczyna się zabawa.

Najczęstszy problem wygląda tak:

- aplikacja ogranicza coś po IP,
- proxy albo backend patrzy na nagłówek,
- klient może ten nagłówek sam ustawić,
- filtr przestaje mieć sens.

Najczęściej testuję wtedy takie rzeczy jak:

- `X-Forwarded-For`
- `X-Real-IP`
- `Client-IP`
- `X-Forwarded-Host`
- inne podobne warianty

Nie dlatego, że „zawsze działają”.
Tylko dlatego, że bardzo często pokazują, czy aplikacja ufa danym z requestu tam, gdzie nie powinna.

---

# Co można w ten sposób znaleźć

Najczęściej myślę o takich scenariuszach:

## 1. Bypass restrykcji IP

Panel miał być „tylko z sieci wewnętrznej”, ale backend wierzy w `X-Forwarded-For`.

## 2. Internal-only logic

Czasem ruch „wewnętrzny” dostaje:

- mniej CAPTCHA,
- więcej debug informacji,
- inne funkcje,
- dodatkowe endpointy,
- łatwiejszy flow.

## 3. Host confusion / link poisoning

Jeśli aplikacja buduje linki lub redirecty na podstawie host headerów albo proxy headerów, może się okazać, że:

- link resetu hasła da się podmienić,
- redirect da się skierować gdzie indziej,
- generowane URL-e nie są oparte o zaufane źródło.

## 4. Zatruwanie logów

Jeśli logowany „adres klienta” pochodzi z podrabialnego headera, to można narobić bałaganu w śladach.

---

# Jak to testuję w praktyce

Nie wrzucam od razu piętnastu nagłówków naraz.

Najpierw pojedynczo.

Patrzę:

- czy zmienia się status code,
- czy zmienia się treść odpowiedzi,
- czy pojawia się inny redirect,
- czy dostaję inne błędy,
- czy znikają ograniczenia,
- czy backend nagle zaczyna zachowywać się jak dla „internal usera”.

To ważne, bo jeśli wyślesz wszystko naraz, trudniej zrozumieć, co naprawdę zadziałało.

---

# Jak bym to ujął jednym zdaniem

Nagłówki HTTP nie są dla mnie listą do odbębnienia.

Są szybkim sposobem, żeby zobaczyć:

- jak aplikacja myśli o bezpieczeństwie po stronie klienta,
- gdzie brakuje podstawowych ograniczeń,
- i czy backend ufa wejściu, które attacker może kontrolować.

---

# Mój roboczy workflow

## Krok 1

Patrzę na response headers i cookies.

Chcę szybko ocenić:

- czy są podstawowe zabezpieczenia,
- czy coś zdradza technologię,
- czy odpowiedź wygląda jak produkt świadomego zespołu, czy raczej chaos.

## Krok 2

Łączę to z kontekstem funkcji.

Nie interesuje mnie brak nagłówka „sam w sobie”.
Interesuje mnie brak nagłówka na:

- uploadzie,
- panelu,
- formularzu z akcją,
- stronie z danymi użytkownika,
- flow resetu hasła,
- miejscu z linkami wychodzącymi.

## Krok 3

Testuję request headers ofensywnie.

Sprawdzam, czy aplikacja:

- wierzy w IP z nagłówka,
- wierzy w host z nagłówka,
- zmienia zachowanie po prostym spoofingu.

## Krok 4

Dopiero potem decyduję, czy to:

- tylko obserwacja,
- sensowne ryzyko,
- czy realny finding z wpływem.

---

# Co chcę zapamiętać na szybko

## HSTS

Jeśli aplikacja działa po HTTPS, chcę widzieć, że HTTPS jest wymuszony serio, a nie tylko „na pokaz”.

## Referrer-Policy

Jeśli URL niesie wrażliwy kontekst, chcę widzieć, że ten kontekst nie wypływa bez sensu dalej.

## X-Content-Type-Options

Jeśli użytkownik może wpływać na treść pliku, nie chcę, żeby przeglądarka sama zgadywała jego typ.

## Framing

Jeśli strona robi ważne akcje, chcę wiedzieć, czy da się ją osadzić w ramce.

## Proxy/IP headers

Zawsze warto sprawdzić, czy backend nie wierzy temu, co klient wpisze sobie sam.

---

# Najważniejszy wniosek

Nagłówki bardzo rzadko są „całą podatnością”.
Ale bardzo często są:

- sygnałem złych założeń,
- wskaźnikiem jakości wdrożenia,
- albo wejściem do czegoś większego.

Czyli dokładnie tym, czego chcę szukać na web teście.

Nie patrzę na nie jak na ozdobę odpowiedzi.
Patrzę na nie jak na:
**mapę ograniczeń, braków i zaufania.**
