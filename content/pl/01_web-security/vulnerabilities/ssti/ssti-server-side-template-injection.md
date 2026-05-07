---
id: ssti-server-side-template-injection
title: "SSTI: gdy użytkownik przestaje wysyłać dane, a zaczyna dostarczać logikę"
team: red
domain: web-security
section: vulnerabilities
topic: server-side-template-injection
type: knowledge
angle: attacker-mindset
sourceTrack: baw
tags: ["ssti", "injection", "rce", "jinja2", "velocity", "sandbox", "tplmap", "web"]
difficulty: hard
shortDescription: "SSTI to podatność, w której aplikacja interpretuje niezaufany input jako szablon wykonywany po stronie serwera. W praktyce może to prowadzić od prostego odczytu zmiennych aż do wycieku sekretów, wykonania komend systemowych i pełnego RCE."
updatedAt: "2026-04-16"
---

# SSTI: gdy użytkownik przestaje wysyłać dane, a zaczyna dostarczać logikę

Server-Side Template Injection to jedna z tych podatności, które bardzo łatwo zignorować, jeśli patrzy się na aplikację zbyt powierzchownie. Na pierwszy rzut oka wszystko może wyglądać normalnie: formularz, kilka zmiennych, personalizowana wiadomość, wygenerowany widok, mail, opis powiadomienia. Problem zaczyna się dopiero wtedy, gdy backend nie traktuje inputu użytkownika jak zwykłego tekstu, tylko jak **szablon, który ma zostać zinterpretowany i wykonany**.

To właśnie jest sedno SSTI.

Nie chodzi o samo odbicie danych. Nie chodzi o HTML. Nie chodzi o JavaScript w przeglądarce. Chodzi o sytuację, w której użytkownik dostarcza coś, co serwer zaczyna traktować jak część logiki renderowania. W tym momencie granica między „danymi” a „kodem” przestaje być wyraźna. A kiedy aplikacja zaczyna wykonywać niezaufany szablon, skutki potrafią być bardzo poważne.

Najważniejsza zasada z całego tematu jest prosta:

> **szablon dostarczony przez użytkownika należy traktować jak kod wykonywany po stronie serwera**

Jeżeli aplikacja łamie tę zasadę, SSTI staje się realnym scenariuszem.

---

# Czym właściwie jest silnik szablonów

Silnik szablonów to narzędzie, które pozwala generować finalną treść na podstawie wzorca i przekazanych danych. Może to być HTML, wiadomość e-mail, dokument, fragment tekstu, powiadomienie albo inna warstwa prezentacji.

Zamiast ręcznie sklejać wynik jako string, programista tworzy szablon z placeholderami, a potem przekazuje do niego wartości. Przykładowo:

- szablon zawiera miejsce na nazwę użytkownika,
- backend przekazuje wartość `username`,
- silnik generuje gotowy wynik.

To jest normalne, pożądane i wygodne.

Problem nie leży więc w samym użyciu template engine. Problem pojawia się dopiero wtedy, gdy użytkownik zaczyna wpływać nie tylko na **wartości**, ale również na **samą składnię szablonu**.

To rozróżnienie jest absolutnie kluczowe.

## Bezpieczny model

Użytkownik kontroluje wyłącznie dane, które mają zostać podstawione do wcześniej przygotowanego, zaufanego szablonu.

## Niebezpieczny model

Użytkownik kontroluje cały szablon albo jego fragment, który później jest interpretowany przez silnik.

W tym drugim przypadku użytkownik bardzo często nie przekazuje już zwykłego tekstu. Przekazuje logikę, która ma zostać wykonana przez backend.

---

# Gdzie naprawdę zaczyna się SSTI

SSTI pojawia się wtedy, gdy aplikacja robi mniej więcej taki ruch:

1. pobiera input od użytkownika,
2. przekazuje go do mechanizmu renderowania,
3. pozwala silnikowi szablonów zinterpretować ten input jako składnię lub instrukcje.

Z perspektywy atakującego oznacza to bardzo ważną zmianę. Pole, które wygląda jak zwykły input tekstowy, przestaje być zwykłym miejscem na tekst. Staje się wejściem do interpreterа działającego po stronie serwera.

To dlatego SSTI jest tak niebezpieczne.

W zależności od silnika, wersji, kontekstu i konfiguracji skutkiem może być:

- odczyt zmiennych z kontekstu aplikacji,
- wyciek sekretów, tokenów i konfiguracji,
- dostęp do obiektów wewnętrznych,
- korzystanie z mechanizmów refleksji,
- odczyt i zapis plików,
- wykonywanie komend systemowych,
- pełne **Remote Code Execution**.

To już nie jest problem warstwy prezentacji. To jest klasyczny problem wykonania niezaufanej logiki na backendzie.

---

# Dlaczego SSTI bywa niedoceniane

SSTI często ginie gdzieś pomiędzy XSS, SQL Injection i innymi bardziej rozpoznawalnymi klasami podatności. Powód jest prosty: wielu ludzi myśli o silniku szablonów jako o czymś „od wyświetlania”, a nie jak o interpreterze.

To prowadzi do bardzo groźnego złudzenia:

- „dane są kodowane do HTML, więc jest bezpiecznie”
- „nie da się wykonać JavaScriptu, więc problemu nie ma”
- „to tylko wiadomość e-mail / podgląd / stopka / CMS / personalizacja”

A tymczasem SSTI w ogóle nie musi mieć nic wspólnego z wykonaniem skryptu w przeglądarce.

---

# SSTI a XSS to nie jest to samo

To rozróżnienie trzeba mieć wbite na stałe.

## XSS

Atak działa po stronie przeglądarki. Problemem jest to, że aplikacja zwraca dane w taki sposób, że przeglądarka interpretuje je jako kod JavaScript lub aktywny HTML.

## SSTI

Atak działa po stronie serwera. Problemem jest to, że backend interpretuje input jako składnię szablonu i wykonuje logikę jeszcze zanim odpowiedź trafi do klienta.

To oznacza, że aplikacja może być dobrze zabezpieczona przed XSS i jednocześnie krytycznie podatna na SSTI.

Kodowanie outputu do HTML nie rozwiązuje tego problemu, bo ono działa dopiero na poziomie prezentacji. SSTI dzieje się wcześniej - w momencie renderowania po stronie backendu.

Dobra praktyka testerska jest więc taka:

> jeżeli użytkownik może wpływać na treść czegoś, co backend później renderuje jako template, zawsze trzeba mieć z tyłu głowy SSTI

---

# Gdzie najczęściej spotkasz SSTI

Najbardziej klasyczne miejsca to wszystkie funkcje, które brzmią „wygodnie” z perspektywy produktu:

- własne szablony maili,
- personalizowane wiadomości i powiadomienia,
- edytowalne komunikaty systemowe,
- generatory dokumentów HTML/PDF,
- CMS-y i Wiki,
- szablony raportów,
- systemy workflow i automatyzacji,
- formularze opisujące wzorce typu „użyj `username` tam, gdzie chcesz wyświetlić nazwę użytkownika”.

To są bardzo częste miejsca, bo biznesowo wyglądają sensownie. Problem polega na tym, że zbyt elastyczne rozwiązanie szybko może zamienić się w interpreter niezaufanego kodu.

---

# Trzy najczęstsze modele podatności

SSTI nie zawsze wygląda tak samo. Dobrze jest od razu rozróżniać trzy typowe przypadki.

## 1. Cały input użytkownika jest wykonywany jako szablon

To najprostszy model. Użytkownik wysyła treść, backend traktuje ją jak template i renderuje.

Przykładowo:

- użytkownik podaje treść wiadomości,
- backend przepuszcza ją przez template engine,
- wynik pokazuje użytkownikowi albo wykorzystuje dalej.

To najczytelniejszy przypadek SSTI, bo payloady testowe zwykle działają wprost.

## 2. Szablon jest budowany dynamicznie z udziałem inputu użytkownika

Tutaj programista nie renderuje bezpośrednio naszego inputu jako całego szablonu, ale „dokleja” go do większej templateki.

To nadal może być podatne, jeśli nasz input trafia do miejsca, które jest interpretowane przez silnik.

To ważne, bo część programistów uważa taki model za bezpieczny, skoro „przecież tylko składamy string”. W rzeczywistości właśnie to dynamiczne składanie często tworzy problem.

## 3. Blind SSTI

Czasem wynik renderowania nie jest nam nigdzie zwracany. To nie oznacza, że podatność nie istnieje. To oznacza tylko, że nie mamy prostego kanału obserwacji efektu.

W takim scenariuszu dalej można testować:

- opóźnienia odpowiedzi,
- zmiany zachowania aplikacji,
- błędy parsera,
- skutki uboczne,
- połączenia wychodzące,
- różnice logiczne true/false.

Blind SSTI bardzo przypomina blind SQL Injection. Zmienia się mechanika, ale sposób myślenia pozostaje podobny.

---

# Najważniejszy mindset testera

W SSTI trzeba przestać patrzeć wyłącznie na to, czy input jest odbijany. To za mało.

Zamiast tego trzeba zadawać pytania:

- czy mój input trafia do mechanizmu renderowania?
- czy backend wykonuje template po stronie serwera?
- czy mój input może stać się częścią składni?
- czy szablon jest budowany dynamicznie?
- czy wynik jest zwracany, czy renderowanie jest ślepe?
- czy kontekst zawiera ciekawe obiekty lub zmienne?

To nie jest już myślenie w stylu „czy mogę wstawić tag”.  
To jest myślenie w stylu „czy mogę wejść do interpreterа backendu”.

---

# Jak rozpoznawać SSTI w praktyce

Dobra analiza SSTI zwykle składa się z kilku etapów.

## Etap 1: znajdź miejsca, gdzie input może być renderowany

Szukasz pól i funkcji związanych z:

- templatekami,
- personalizacją treści,
- mailami,
- wiadomościami,
- dokumentami,
- generowaniem widoków,
- ustawianiem wzorców,
- opisami zawierającymi zmienne typu `{{username}}`, `${username}` albo podobne.

Sama obecność takich zmiennych jest już sygnałem, że warto testować.

## Etap 2: sprawdź, czy input jest interpretowany

Na tym etapie nie myślisz jeszcze o RCE. Chcesz tylko ustalić, czy backend traktuje input jak template.

Najczęstsze sygnały to:

- proste wyrażenie zostaje obliczone,
- odwołanie do zmiennej jest rozwijane,
- nieistniejąca zmienna znika albo wywołuje błąd,
- parser zwraca komunikat o błędzie składni,
- odpowiedź wygląda inaczej niż literalny input.

Jeżeli wysyłasz coś, a backend oddaje ci dokładnie to samo znak po znaku, zwykle oznacza to brak interpretacji.  
Jeżeli wynik się zmienia, znika albo wywala błąd parsera, to bardzo dobry trop.

## Etap 3: wymuś błąd

Bardzo często najłatwiejszym sposobem potwierdzenia SSTI jest świadome zepsucie składni.

To daje dwie rzeczy naraz:

- potwierdza, że parser rzeczywiście próbował coś wykonać,
- czasem zdradza nazwę silnika albo fragment stack trace.

A to jest już ogromna przewaga, bo kolejne payloady można dobierać pod konkretny engine.

---

# Identyfikacja silnika jest kluczowa

Nie ma jednego uniwersalnego payloadu, który działa na wszystkie template engine. Każdy silnik ma inną składnię, inny model obiektów, inne zabezpieczenia i inne prymitywy eksploatacyjne.

Dlatego po potwierdzeniu SSTI następny krok brzmi:

> **ustal, z jakim silnikiem masz do czynienia**

To jedna z najważniejszych rzeczy w całym procesie.

Można to robić na kilka sposobów:

- po charakterystycznych payloadach,
- po odpowiedziach na proste wyrażenia,
- po błędach parsera,
- po stack trace,
- po technologii użytej przez aplikację,
- po dokumentacji produktu,
- po zachowaniu na nieistniejących zmiennych.

W praktyce często właśnie różnice składni pozwalają odróżnić jeden engine od drugiego.

---

# Co dzieje się po potwierdzeniu SSTI

Gdy już wiesz, że input jest interpretowany, nie warto od razu skakać do najbardziej agresywnej eksploatacji. Lepsze podejście to stopniowa eskalacja.

## Krok 1: poznaj kontekst

Najpierw sprawdzasz, jakie zmienne i obiekty są dostępne. Czasem sam dostęp do kontekstu daje sporo informacji:

- nazwy użytkowników,
- dane sesji,
- tokeny,
- wartości konfiguracyjne,
- ścieżki systemowe,
- obiekty frameworka,
- referencje do requestu, response albo aplikacji.

## Krok 2: szukaj niebezpiecznych obiektów

Interesują cię rzeczy, które pozwalają wyjść poza zwykłe renderowanie:

- klasy,
- moduły,
- refleksja,
- obiekty systemowe,
- funkcje pomocnicze,
- metody pozwalające tworzyć nowe obiekty albo ładować kod.

## Krok 3: dopiero potem myśl o command execution

Jeżeli engine i kontekst na to pozwalają, kolejnym etapem jest:

- odczyt plików,
- zapis plików,
- wykonanie komendy,
- uruchomienie procesu,
- shell,
- callback sieciowy.

Takie sekwencyjne podejście daje dużo lepsze zrozumienie aplikacji niż bezmyślne wrzucanie payloadów na RCE.

---

# Velocity: dobry przykład tego, jak obiekt prowadzi do RCE

Velocity w świecie Javy jest bardzo dobrym przykładem tego, jak SSTI prowadzi do wykonania komend systemowych.

Kluczowa obserwacja jest tu bardzo praktyczna: jeżeli w template engine możesz operować na obiektach, to często możesz też dojść do informacji o ich klasie. A jeżeli jesteś w ekosystemie Javy, droga od klasy do refleksji i runtime potrafi być bardzo krótka.

Schemat myślenia wygląda mniej więcej tak:

1. tworzysz lub dostajesz zwykły obiekt,
2. odwołujesz się do jego klasy,
3. próbujesz uzyskać dostęp do innych klas,
4. docierasz do mechanizmu pozwalającego uruchomić proces,
5. wykonujesz komendę,
6. próbujesz odczytać output procesu.

Największa wartość tego przykładu nie leży w konkretnym payloadzie, tylko w zrozumieniu ścieżki eskalacji.

W SSTI bardzo często nie „uruchamiasz exploita” od razu.  
Bardziej przypomina to wspinanie się po obiektach, metodach i referencjach, aż dojdziesz do czegoś naprawdę niebezpiecznego.

---

# Freemarker: świetne narzędzie dla programisty, bardzo zły pomysł do niezaufanych templatek

Freemarker sam w sobie nie jest problemem. Problemem jest sposób użycia.

Jeżeli aplikacja tworzy obiekt template na podstawie inputu użytkownika i później go renderuje, to bardzo łatwo doprowadzić do sytuacji, w której użytkownik przestaje kontrolować tylko treść, a zaczyna wpływać na logikę renderowania.

W praktyce Freemarker jest o tyle niebezpieczny, że:

- ma bogate możliwości,
- pracuje po stronie serwera,
- bywa używany w aplikacjach enterprise,
- w złej konfiguracji może prowadzić do command execution, file access i innych skutków o bardzo wysokim impactcie.

Jeżeli widzisz Freemarker i dynamicznie tworzone templateki oparte o input użytkownika, powinieneś traktować ten obszar jako wysokie ryzyko.

---

# Jinja2: świetna lekcja, że sandbox to nie to samo co pełne bezpieczeństwo

W Pythonie bardzo często spotkasz Jinja2, zwłaszcza we Flasku. To bardzo dobry przykład pokazujący, że SSTI nie zawsze musi wyglądać jak prosta ścieżka do RCE.

Czasem pierwszy realny zysk z eksploatacji to:

- wyciek sekretów,
- dostęp do obiektów wewnętrznych,
- informacje o środowisku,
- obejście ograniczeń sandboxa,
- odczyt danych konfiguracyjnych.

To jest bardzo ważne z praktycznego punktu widzenia.  
Wiele osób skupia się wyłącznie na pytaniu: „czy da się zrobić RCE?”. Tymczasem w realnym pentestingu wyciek:

- hasła do bazy,
- klucza API,
- sekretu aplikacji,
- tokena integracji,
- danych środowiskowych

może być równie groźny, a czasem nawet szybszy do przekucia w pełną kompromitację niż klasyczne shell access.

Jinja2 dobrze pokazuje też drugą ważną rzecz:

> sandbox jest warstwą utrudniającą atak, ale nie powinien być traktowany jako gwarancja bezpieczeństwa

Jeżeli silnik ma historię bypassów, a wersja jest stara, sandbox może tylko podnosić próg wejścia, a nie eliminować problem.

---

# Blind SSTI: jak myśleć, kiedy nic nie widzisz

Blind SSTI to sytuacja, w której backend renderuje szablon, ale wynik nie trafia do odpowiedzi. To bardzo ważne, bo wiele osób błędnie zakłada wtedy, że exploitacja się kończy.

Nie kończy się. Zmienia się tylko kanał obserwacji.

W takim scenariuszu szukasz trzech klas sygnałów.

## 1. Time-based

Czy payload powoduje opóźnienie odpowiedzi?  
Jeżeli tak, masz mocną przesłankę, że backend wykonał logikę.

## 2. Boolean-based

Czy różne payloady dają zauważalnie inne zachowanie aplikacji?  
Inny status, inna długość odpowiedzi, inna treść błędu, inny redirect.

## 3. Out-of-band

Czy da się zmusić serwer do wykonania połączenia wychodzącego?  
Jeżeli tak, callback sieciowy może być twardym potwierdzeniem wykonania logiki.

Blind SSTI wymaga cierpliwości, ale nadal może prowadzić do bardzo mocnych wyników, w tym do execution i shelly przez pośrednie kanały.

---

# Automatyzacja: gdzie naprawdę pomaga tplmap

SSTI to jedna z tych klas podatności, które w dużej części dają się sensownie automatyzować. Powód jest prosty:

- silniki mają rozpoznawalną składnię,
- testy fingerprintujące są powtarzalne,
- część exploit chainów można budować automatycznie.

Tu bardzo przydaje się `tplmap`.

Największa wartość tego narzędzia polega na tym, że szybko odpowiada na kilka kluczowych pytań:

- który parametr jest podatny,
- jaki silnik najpewniej działa po stronie backendu,
- czy mamy render-based czy blind SSTI,
- jakie capabilities są dostępne,
- czy można wykonywać komendy,
- czy możliwy jest odczyt albo zapis plików,
- czy da się uzyskać shell.

To ogromna oszczędność czasu.

Jednocześnie trzeba pamiętać o jednej rzeczy:

> automatyzacja pomaga, ale nie zastępuje rozumienia kontekstu

Jeżeli skaner nic nie znalazł, to nie znaczy, że SSTI nie istnieje. Może po prostu:

- kontekst jest nietypowy,
- trzeba zamknąć albo otworzyć składnię w inny sposób,
- wynik jest ślepy,
- parser jest częściowo filtrowany,
- payload był nieadekwatny do engine.

Najlepszy efekt daje połączenie automatyzacji z manualnym myśleniem.

---

# Dobra metodyka testowania SSTI

Najrozsądniejsze podejście wygląda tak:

## 1. Znajdź potencjalne miejsca wejścia

Szukaj funkcji pozwalających użytkownikowi wpływać na treść renderowaną po stronie backendu.

## 2. Potwierdź interpretację

Sprawdź, czy input jest traktowany jako template, a nie jako zwykły tekst.

## 3. Wymuś błąd

Parser bardzo często sam zdradza, że bierzesz dobry trop.

## 4. Rozpoznaj silnik

Bez tego łatwo stracić czas na złą składnię i złe payloady.

## 5. Ustal kontekst

Czy kontrolujesz cały template, czy tylko jego fragment? Czy jesteś w tekście, instrukcji, warunku, atrybucie, czy innym miejscu?

## 6. Enumeruj capabilities

Najpierw zmienne i obiekty. Potem klasy, refleksja, moduły, file access, command execution.

## 7. Jeżeli wynik jest ślepy, przejdź na time-based albo out-of-band

Brak bezpośredniego outputu to nie koniec, tylko zmiana strategii.

To podejście jest metodyczne, powtarzalne i dużo bardziej wartościowe niż chaotyczne wrzucanie losowych payloadów.

---

# Najczęstsze błędy po stronie testerów

## Mylenie SSTI z XSS

To inna klasa problemu, inna warstwa i inne skutki.

## Rezygnacja po jednym payloadzie

Jeden nieudany test nic nie mówi. Mogłeś trafić w zły silnik, zły kontekst albo blind case.

## Ignorowanie błędów parsera

Często właśnie błędy są najlepszym źródłem fingerprintingu.

## Skakanie od razu do RCE

Lepiej najpierw poznać kontekst, bo często prostszy wyciek sekretu daje większą wartość niż agresywny, niestabilny exploit.

## Patrzenie wyłącznie na output

Czasem sukces widać dopiero po opóźnieniu, callbacku, zmianie zachowania albo błędzie logicznym.

---

# Obrona: co naprawdę ma sens

Obrona przed SSTI nie sprowadza się do jednej magicznej flagi. Najskuteczniejsze podejście to połączenie kilku warstw.

## 1. Najlepsze rozwiązanie: nie wykonywać niezaufanych szablonów

To najważniejsza zasada projektowa.

Użytkownik może dostarczać dane do wcześniej przygotowanego szablonu.  
Nie powinien dostarczać samego szablonu ani fragmentów składni, które backend później interpretuje.

To jest najpewniejsza obrona.

## 2. Nie sklejać templatek dynamicznie z niezaufanym inputem

Bardzo częsty antywzorzec polega na doklejaniu danych do stringa, który później trafia do silnika. To nadal jest droga do SSTI.

## 3. Jeżeli biznes musi dać użytkownikowi personalizację, używać możliwie ograniczonych engine

Najlepiej takich, które wspierają głównie podstawianie zmiennych, a nie bogatą logikę, refleksję i wykonywanie kodu.

## 4. Sandboxing

Ma sens jako dodatkowa warstwa, ale nie powinien być traktowany jako jedyne zabezpieczenie. Sandbox trzeba traktować jak utrudnienie dla atakującego, a nie dowód, że problem zniknął.

## 5. Aktualizacje bibliotek

Silniki szablonów i ich sandboxy miały w historii wiele obejść. Stara wersja potrafi zamienić „teoretycznie bezpieczny” mechanizm w realny wektor ataku.

## 6. Hardening hosta

Trzeba zakładać, że kiedyś ktoś wyrwie execution. Wtedy decydujące staje się środowisko uruchomieniowe.

Dobra praktyka:

- aplikacja nie działa jako root,
- ma minimalne uprawnienia,
- działa w izolowanym środowisku,
- nie ma niepotrzebnego dostępu do plików,
- nie ma swobodnego ruchu wychodzącego,
- sekrety są ograniczone i dobrze odseparowane.

To nie usuwa SSTI, ale bardzo zmniejsza blast radius.

---

# Defense in Depth: jedyna sensowna filozofia

SSTI to dobry przykład podatności, przy której pojedyncza ochrona bardzo często nie wystarcza. Najrozsądniejsze podejście to warstwy:

- brak renderowania niezaufanych templatek,
- brak dynamicznego sklejania szablonów,
- ograniczony silnik,
- sandbox tam, gdzie ma sens,
- aktualne biblioteki,
- minimalne uprawnienia procesu,
- izolacja środowiska,
- monitoring błędów parsera i nietypowych payloadów.

To właśnie tutaj bardzo dobrze widać sens podejścia Defense in Depth.  
Jeżeli jedna warstwa pęknie, inne nadal mogą ograniczyć skutki.

---

# Jak myśleć o impactcie

SSTI bardzo łatwo zaniżyć, jeśli patrzy się tylko na pierwszy test typu „czy policzyło działanie arytmetyczne”.

To jest tylko objaw.

Prawdziwy impact może obejmować:

- wyciek sekretów aplikacji,
- przejęcie konta serwisowego,
- odczyt poufnych plików,
- zapis plików po stronie serwera,
- wykonanie komend systemowych,
- pivot do innych systemów,
- trwałą kompromitację hosta aplikacyjnego.

Dlatego SSTI należy traktować jako podatność z grupy **wysokiego lub krytycznego ryzyka**, szczególnie gdy backend renderuje niezaufane templateki przy użyciu potężnego engine.

---

# Szybki playbook myślowy

## Sygnały ostrzegawcze

- „stwórz własny szablon”
- „spersonalizuj wiadomość”
- „użyj zmiennej username”
- generowanie HTML, PDF, maili, raportów
- CMS, Wiki, edytowalne treści renderowane po stronie serwera

## Pierwsze pytania

- czy input jest interpretowany?
- czy da się wymusić błąd parsera?
- czy wynik jest zwracany?
- jaki silnik działa pod spodem?
- czy mam render, czy blind?

## Kolejne kroki

- poznanie kontekstu
- enumeracja obiektów
- identyfikacja capability
- próba odczytu danych
- eskalacja do file access / command execution / shell

## Najważniejsza zasada

- nie zaczynaj od „daj RCE”
- zacznij od „zrozum, co backend wykonuje i jakim językiem mówi template engine”

---

# Najważniejsze rzeczy do zapamiętania

Jeżeli z całej notatki miałoby zostać tylko kilka zdań, to właśnie te:

1. **SSTI pojawia się wtedy, gdy backend interpretuje niezaufany input jako szablon.**
2. **Template dostarczony przez użytkownika to nie dane, tylko potencjalnie kod.**
3. **Brak XSS nie oznacza braku SSTI.**
4. **Identyfikacja silnika jest kluczowa, bo składnia i możliwości różnią się między engine.**
5. **Blind SSTI nadal może prowadzić do execution i pełnej kompromitacji.**
6. **Najlepsza obrona to nie wykonywać niezaufanych templatek.**
7. **Jeżeli biznes tego wymaga, trzeba łączyć ograniczony engine, sandbox, aktualizacje i hardening środowiska.**

---

# Podsumowanie

SSTI to podatność, która bardzo często zaczyna się od czegoś, co biznesowo wygląda zupełnie niewinnie: własny szablon maila, konfigurowalny komunikat, wygodna personalizacja, generowany dokument, pole z placeholderami.

Ale od strony bezpieczeństwa to już nie jest zwykła funkcja UX. To potencjalne otwarcie interpreterа backendu dla niezaufanego użytkownika.

I właśnie dlatego SSTI trzeba rozumieć nie jako „ciekawostkę od templatek”, tylko jako pełnoprawną, bardzo groźną klasę server-side injection.

Bo w praktyce wszystko sprowadza się do jednego:

> kiedy aplikacja pozwala użytkownikowi dostarczać logikę zamiast samych danych, granica bezpieczeństwa bardzo szybko zaczyna się rozpadać
