---
id: tool-burp-suite-community
title: "Burp Suite Community - workflow, mindset i manualne testowanie aplikacji webowych"
team: neutral
domain: tools
section: web-pentesting
topic: burp-suite-community
type: tool
angle: manual-web-testing-workflow
sourceTrack: field-manual
tags: ["proxy", "logger", "scope", "site-map", "idor", "sqli", "xss", "csrf", "ssrf"]
difficulty: easy
shortDescription: "Praktyczny field manual do Burp Suite Community pokazujący, jak używać Burpa jako centrum pracy w web pentestach - od ustawienia scope, zbierania ruchu i analizy HTTP history, przez eksperymenty w Repeaterze, aż po testowanie hipotez, rozpoznawanie podatności i dokumentowanie dowodów w labach oraz realnych testach."
updatedAt: "2026-03-03"
---

# Burp Suite (Community) - Field Manual

Burp Suite to moje „centrum dowodzenia” do web pentestu.  
Nie dlatego, że robi magię - tylko dlatego, że pozwala mi **zobaczyć prawdę o aplikacji**:

- co naprawdę wychodzi z przeglądarki,
- co naprawdę wraca z serwera,
- gdzie aplikacja ufa za bardzo,
- i jak zmienia się zachowanie, kiedy _delikatnie_ dotkniesz parametrów.

Ta notatka ma dwa cele:

1. **nauczyć Cię workflow**, a nie „klikologii”
2. stać się bazą, do której wracasz przed każdym labem/pentestem.

---

## Jak myśli atakujący, gdy odpala Burpa

Burp nie jest „narzędziem do łamania”. Burp jest narzędziem do:

- **modelowania logiki aplikacji** (co, gdzie, komu wolno),
- **wymuszania alternatywnych ścieżek** (co jeśli zmienię X),
- **izolowania zmiennych** (jedna zmiana → jeden wniosek).

Trzy pytania, które mam w głowie w kółko:

1. **Co jest tu „źródłem prawdy”?** (cookie? token? rola? nagłówek? parametr?)
2. **Co serwer weryfikuje, a co tylko „zakłada”?**
3. **Gdzie jest różnica między UI a API?** (UI blokuje, API przepuszcza)

---

## Setup: żeby testy były czyste i powtarzalne

`Proxy → Intercept → Open Browser`

**Proxy → Open Browser**  
![Proxy > Open Browser](/field-manual/assets/burp/01-proxy-open-browser.png)

---

## Fundament: Scope (czyli „żebyś nie debugował śmieci”)

Scope to nie jest formalność. Scope to filtr, który robi z Burpa narzędzie, a nie spam-maszynę.

**Kroki:**

1. `Target → Scope → Include in scope`
2. dodaj host/URL
3. w `Proxy` ustaw: pokazuj/łap tylko „in scope”

**Target → Scope**  
![Target scope](/field-manual/assets/burp/02-target-scope.png)

**Mój standard w Scope:**

- include: `https://app.example.com/*`
- exclude: zewnętrzne CDN, analytics, logowanie SSO jeśli nie w scope

---

## Proxy: Intercept + HTTP history (czyli „zbieram prawdę”)

### Intercept: używaj jak wyzwalacza, nie trybu życia

- **OFF**: normalne klikanie i zbieranie historii
- **ON**: łapię konkret (login, checkout, upload, zmiana roli)

**Proxy → Intercept (ON/OFF)**  
![Proxy intercept](/field-manual/assets/burp/03-proxy-intercept.png)

### HTTP History: Twoje największe źródło odkryć

Tu szukasz:

- requestów zmieniających stan (POST/PUT/PATCH/DELETE),
- endpointów API (`/api/...`, `/graphql`),
- parametrów „kontrolnych” (`id`, `role`, `file`, `redirect`, `returnUrl`, `next`, `price`, `isAdmin`),
- tokenów, cookies, nagłówków.

**Proxy → HTTP history + filtry**  
![HTTP history](/field-manual/assets/burp/04-http-history.png)

**Filtry, które realnie robią robotę:**

- show only in-scope
- hide images/CSS/JS
- pokaż tylko: 4xx/5xx (na start)
- sortuj po length i patrz na odchyły

**Advanced Filter (rozwinięte)**  
![HTTP filters](/field-manual/assets/burp/05-http-filters.png)

---

## Target: Site map (czyli „buduję model aplikacji”)

Site map to nie „lista URL”. To mapa:

- modułów,
- flow,
- zależności,
- i miejsc, gdzie logika bywa dziurawa.

**Target → Site map**  
![Site map](/field-manual/assets/burp/06-site-map.png)

**Co oznaczam w głowie w Site map:**

- „wejścia” (login/register/reset),
- „pieniądze/dane” (billing, profile, orders),
- „uprawnienia” (admin, role, team),
- „integracje” (S3, webhooki, import/export),
- upload/download.

---

## Repeater: stół operacyjny (tu dzieją się prawdziwe testy)

Repeater to miejsce, gdzie uczysz się najwięcej, bo robisz **kontrolowane eksperymenty**.

**Zasada nr 1: jedna zmiana na raz**

- zmieniam 1 parametr → obserwuję różnicę
- zmieniam kolejny → obserwuję różnicę
- inaczej nie wiesz, co zadziałało

**Repeater: request/response + Inspector**  
![Repeater](/field-manual/assets/burp/07-repeater.png)

### Lista pierwszych testów, które robię prawie zawsze (manualnie)

**Access control / IDOR**

- `GET /user/123` → `GET /user/124`
- `accountId`, `orgId`, `teamId`, `invoiceId`

**Parameter tampering**

- `price=100` → `price=1`
- `role=user` → `role=admin`
- `isAdmin=false` → `true`
- `discount=0` → `99`

**Session / uprawnienia**

- usuń cookie i zobacz czy nadal działa
- zmień cookie na stare / inne
- usuń nagłówek `Authorization`
- sprawdź, czy endpointy „admin” odpowiadają inaczej bez roli

**Input handling**

- `'` / `"` / `\` / `..` / `%00` / długie stringi
- JSON: zmień typ (`"1"` vs `1`), usuń pola, dodaj nowe

---

## Intruder (Community): wolno, ale nadal wartościowo

W Community Intruder jest wolny, więc traktuj go jako:

- **mini-fuzzer** do małych zakresów,
- **enumerator** do krótkich list,
- narzędzie do nauki „jak interpretować wyniki”.

**Intruder: Positions (§…§)**  
![Intruder positions](/field-manual/assets/burp/08-intruder-positions.png)

**Intruder: Results (sort po length/status)**  
![Intruder results](/field-manual/assets/burp/09-intruder-results.png)

**Jak czytam wyniki Intrudera (mindset):**

- status ≠ sukces (czasem 200 jest błędem, a 302 jest sukcesem)
- length ≠ prawda (czasem błędy mają stałą długość)
- liczy się „odstający” response (treść, nagłówki, czas)

---

## Decoder: tłumacz „dziwnych stringów” na znaczenie

Decoder to mój szybki warsztat:

- URL encode/decode,
- Base64,
- hex,
- HTML entities.

**Decoder**  
![Decoder](/field-manual/assets/burp/10-decoder.png)

---

## Comparer: kiedy „coś się różni, ale nie wiem co”

Comparer jest świetny do:

- blind SQLi porównawczo,
- różnic w access control,
- różnic w odpowiedziach dla różnych userów.

**Comparer: diff**  
![Comparer](/field-manual/assets/burp/11-comparer.png)

---

## Logger: pełen audyt ruchu (Proxy + Repeater + Intruder)

Logger pokazuje ruch generowany przez narzędzia - bardzo ważne, gdy:

- coś „ginie” w historii,
- debugujesz Intrudera,
- chcesz mieć czysty timeline testów.

**Logger**  
![Logger](/field-manual/assets/burp/12-logger.png)

---

## Sequencer: jako ćwiczenie myślenia o tokenach

Sequencer uczy jednego: **token ma być nieprzewidywalny**.
Warto zrobić to raz/dwa, żeby zobaczyć jak wygląda analiza entropii.

**Sequencer**  
![Sequencer](/field-manual/assets/burp/13-sequencer.png)

---

# Cheat-sheet: podatność → gdzie w Burpie → co sprawdzić → jak rozpoznać „że to to”

> To jest ta sekcja, którą warto mieć otwartą obok laba.  
> Nie chodzi o payloady. Chodzi o **hipotezy i obserwacje**.

---

## 1) Broken Access Control (BAC) / IDOR

**Gdzie w Burpie:**

- Proxy → HTTP history (szukaj `id`, `userId`, `accountId`, `orgId`)
- Repeater (manualne warianty)
- Comparer (diff odpowiedzi)

**Co sprawdzić (dlaczego):**

- czy serwer autoryzuje dostęp do obiektu, czy tylko wierzy w ID z UI
- czy endpoint działa tak samo dla różnych kont

**Jak testować (minimalnie):**

- Zaloguj się jako UserA, weź request do zasobu
- Zmień tylko ID na „sąsiednie” lub takie z konta UserB
- Porównaj odpowiedź

**Red flags w odpowiedzi:**

- `200 OK` z cudzymi danymi
- `302` do loginu… ale response body ma dane
- stały `200` + „soft error” (np. `{"error": "not allowed"}`) - UI może to ukrywać

**Artefakty do PoC:**

- request A (baseline), request B (ID zmienione), response diff (Comparer)

---

## 2) Parameter Tampering (cena, rola, rabat, flagi)

**Gdzie w Burpie:**

- Proxy history (POST z JSON/form-data)
- Repeater (zmiana pojedynczego pola)
- Logger (timeline)

**Co sprawdzić:**

- czy wartości biznesowe są liczone po stronie serwera czy „przychodzą z klienta”

**Typowe pola:**

- `price`, `quantity`, `discount`, `currency`
- `role`, `isAdmin`, `isVerified`, `tier`, `plan`

**Jak rozpoznać:**

- cena w koszyku zmienia się po request/response, a nie tylko w UI
- w odpowiedzi wraca zaakceptowana wartość

---

## 3) SQL Injection (error-based / boolean-based / time-based)

**Gdzie w Burpie:**

- HTTP history (parametry w query/body)
- Repeater (manualne warianty)
- Comparer (różnice odpowiedzi)

**Co sprawdzić:**

- czy parametr wpływa na zapytanie do bazy bez poprawnego parametryzowania

**Jak testować bez „strzelania”:**

- **Error-based:** wstaw `'` i zobacz czy pojawia się błąd składni / 500 / inny response
- **Boolean-based:** porównaj `AND 1=1` vs `AND 1=2` (lub odpowiednik) i zobacz różnicę
- **Time-based:** porównaj odpowiedź „normalną” vs opóźniającą

**Red flags:**

- zmiana długości odpowiedzi / inny komunikat
- status 500 po prostym apostrofie
- wyraźne różnice w czasie

> Burp Community nie da Ci automatycznej magii jak pełen scanner, ale **manualna diagnostyka w Repeaterze** uczy 10x więcej.

---

## 4) XSS (reflected / stored) + HTML Injection

**Gdzie w Burpie:**

- HTTP history (wejścia: search, comment, profile)
- Repeater (warianty payloadów)
- Decoder (encoding)

**Co sprawdzić:**

- czy input trafia do HTML/DOM bez odpowiedniego escaping/sanitization

**Jak rozpoznać etap podatności:**

- jeśli działa `<b>test</b>` → to często **HTML injection / brak escaping**
- jeśli da się wykonać JS → **XSS** (reflected/stored/DOM)

**Obserwacje ważniejsze niż payload:**

- czy input wraca w odpowiedzi (reflected)
- w jakim kontekście (HTML body, atrybut, JS, URL)

---

## 5) CSRF (zmiana stanu bez intencji użytkownika)

**Gdzie w Burpie:**

- HTTP history: szukaj POST/PUT/PATCH/DELETE
- Repeater: usuń/zmień tokeny
- Comparer: porównuj odpowiedzi

**Co sprawdzić:**

- czy aplikacja wymaga tokena anti-CSRF i czy wiąże go z sesją
- czy wymusza `SameSite`/Origin/Referer

**Test minimalny:**

- wyślij request zmiany stanu:
  - raz normalnie
  - raz bez tokena / ze starym tokenem
  - raz bez/ze zmienionym `Origin/Referer`
- sprawdź czy akcja przeszła

**Red flags:**

- akcja działa bez tokena
- token jest stały / przewidywalny
- serwer ignoruje Origin/Referer

---

## 6) SSRF (serwer robi requesty „w Twoim imieniu”)

**Gdzie w Burpie:**

- HTTP history: parametry typu `url=`, `callback=`, `webhook=`, `imageUrl=`
- Repeater: testuj warianty hostów/protokółów
- Logger: śledzenie prób

**Co sprawdzić:**

- czy serwer pozwala wskazać URL i potem sam go pobiera

**Red flags:**

- odpowiedź zawiera fragment pobranego zasobu
- błędy DNS/timeout (to też sygnał, że serwer próbował)

> W labach do SSRF zwykle podajesz kontrolowany adres, by zobaczyć „czy serwer uderzył”.

---

## 7) File Upload (RCE / LFI / stored XSS przez upload)

**Gdzie w Burpie:**

- Proxy history: request `multipart/form-data`
- Repeater: modyfikuj filename/content-type/content
- Comparer: porównaj odpowiedzi

**Co sprawdzić:**

- walidacja po stronie serwera (a nie tylko UI)
- czy pliki są wykonywalne / dostępne publicznie
- czy nazwy i ścieżki są bezpieczne

**Red flags:**

- serwer akceptuje „dziwne” rozszerzenia
- plik jest dostępny pod przewidywalnym URL
- Content-Type jest jedyną walidacją

---

## 8) Path Traversal / LFI (odczyt plików)

**Gdzie w Burpie:**

- HTTP history: parametry `file=`, `path=`, `download=`
- Repeater: testuj sekwencje traversal
- Decoder: encoding `../`

**Co sprawdzić:**

- czy aplikacja skleja ścieżkę z parametrem bez normalizacji i kontroli

**Jak rozpoznać:**

- zwraca inne pliki niż powinno
- błędy typu „file not found” zależne od ścieżki (to też sygnał)

---

## 9) Open Redirect (przekierowania i phishing)

**Gdzie w Burpie:**

- HTTP history: `redirect`, `next`, `returnUrl`, `continue`
- Repeater: podmień na zewnętrzny URL

**Co sprawdzić:**

- czy aplikacja pozwala przekierować na dowolną domenę

**Red flags:**

- 302 na podany adres bez walidacji whitelisty

---

## 10) JWT / Session problems (jeśli aplikacja używa tokenów)

**Gdzie w Burpie:**

- HTTP history: `Authorization: Bearer …`
- Decoder: base64 decode header/payload
- Repeater: warianty tokena

**Co sprawdzić:**

- czy token zawiera role/permissions i czy serwer je ufa „w ciemno”
- czy token jest odpowiednio weryfikowany (podpis/algorytm)

**Red flags:**

- rola w payloadzie zmienia zachowanie bez weryfikacji
- brak wygasania / brak audiencji / dziwne nagłówki

---

# Workflow pentestu w Burpie (rekon → enum → exploit → post)

## 1) Recon (zrozum aplikację)

- ustaw scope
- klikaj po flow
- zbieraj historię
- buduj mapę endpointów i parametrów

**Artefakty do zapisania:**

- top 10 endpointów zmieniających stan
- najważniejsze cookies + tokeny
- miejsca gdzie UI coś blokuje

## 2) Enumeration (znajdź „co serwer akceptuje”)

- Repeater: ręczne warianty
- Intruder: małe listy i zakresy
- Logger: potwierdzenie co wyszło

**Co enumerować:**

- identyfikatory obiektów (IDOR)
- role/permission flags
- parametry upload/download
- filtry/sort/pagination (często podatne na manipulacje)

## 3) Exploitation (udowodnij wpływ)

- minimalny PoC (najmniej ruchu, maksimum dowodu)
- porównanie response (Comparer)
- dokumentacja request/response (zanim zniknie)

## 4) Post-exploit (co dalej, w granicach labu/scope)

- czy da się eskalować? (np. odczyt danych → modyfikacja)
- czy da się przejąć konto? (reset, token, sesja)
- czy da się przejść lateralnie? (org/team)

---

# Najczęstsze błędy (i jak ich nie robić)

1. **Intercept ON cały czas**  
   → męczysz się i przestajesz myśleć. Używaj punktowo.

2. **Brak Scope**  
   → analiza staje się śmietnikiem.

3. **Zmieniasz 5 rzeczy naraz w Repeaterze**  
   → nie wiesz, co zadziałało.

4. **Patrzysz tylko na status code**  
   → często ważniejsze są: treść, nagłówki, długość, czas, redirect.

5. **Nie zapisujesz dowodu**  
   → „miałem podatność, ale teraz nie umiem odtworzyć” = klasyk.

---

# Checklista „pierwsze 10 minut z nową aplikacją”

- [ ] Start Burp (Temporary project)
- [ ] Open Browser / ustaw proxy
- [ ] Target: dodaj scope
- [ ] Proxy history: filtry (in-scope, bez śmieci)
- [ ] Kliknij: login → logout → reset hasła (jeśli jest)
- [ ] Znajdź 3 najważniejsze POST-y
- [ ] Wyślij je do Repeater
- [ ] Zmień 1 parametr i porównaj response
- [ ] Zapisz w notatkach: endpointy + parametry + obserwacje

---

# Szablon notatki z testu (kopiuj-wklej per przypadek)

## [CASE] Nazwa testu / endpoint

**Cel:** (co sprawdzam i dlaczego)

**Endpoint:**  
`METHOD /path`

**Wejście kontrolne (baseline):**

- request: (krótko, co wysyłam)
- response: (status/length/kluczowe pola)

**Wariant 1 (zmiana 1 parametru):**

- zmiana:
- wynik:
- wniosek:

**Wariant 2:**

- …

**PoC (minimalny dowód):**

- request:
- response:

**Impact (co realnie daje atakującemu):**

- (np. odczyt cudzych danych / modyfikacja / eskalacja)

**Co bym sprawdził dalej (następny krok):**

- (lista 2–4 konkretnych hipotez)

**Screenshoty/artefakty:**

- `assets/.../case-xyz-01.png`
- `assets/.../case-xyz-02.png`

---

# Ćwiczenia (żeby Burp wszedł w pamięć mięśniową)

1. **Praca bez Intercept**  
   Klikaj po aplikacji 5 minut i rób wszystko z historii + Repeater.

2. **Jedna zmiana na raz**  
   Weź jeden POST i zrób 10 wariantów, każdy z jedną zmianą.

3. **Polowanie na IDOR**  
   Znajdź request z `id=` i spróbuj 3 sąsiednie wartości + porównaj response w Comparer.

4. **Zrozum flow logowania**  
   Zapisz jakie cookies/tokeny się zmieniają: przed loginem vs po.

---

## Jedno zdanie, które sobie zostawiam na koniec

**Burp nie służy do „strzelania payloadami” - służy do rozumienia logiki serwera i łamania założeń, które UI próbuje mi wmówić.**
