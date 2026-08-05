---
id: gdpr-practical-data-protection-workflow
title: "RODO okiem eksperta: jak analizować przetwarzanie danych w praktyce"
team: governance
domain: governance-risk-compliance
section: data-protection
type: knowledge
angle: practical-gdpr-analysis-workflow
sourceTrack: sekurak-academy
tags:
[
"rodo",
"gdpr",
"dane-osobowe",
"privacy",
"administrator",
"procesor",
"cookies",
"monitoring",
"ai",
"edr",
"cloud",
"data-transfer",
"incident-response",
"ict-risk",
]
difficulty: medium
shortDescription: "Praktyczny sposób analizowania problemów związanych z RODO: od ustalenia, czy informacja jest daną osobową, przez role podmiotów i podstawę prawną, po chmurę, AI, monitoring, transfery i naruszenia ochrony danych."
updatedAt: "2026-08-05"
---

# RODO okiem eksperta: jak analizować przetwarzanie danych w praktyce

## Dlaczego powstała ta notatka

Ta notatka nie jest streszczeniem całego RODO.

Nie chodzi również o zapamiętywanie numerów artykułów, tworzenie kolejnych checkboxów ani automatyczne pytanie użytkownika o zgodę.

Tutaj interesuje nas praktyka.

Masz nowy system, aplikację, dostawcę, formularz, monitoring albo usługę chmurową. Wiesz, że gdzieś w procesie mogą pojawić się dane osobowe. Chcesz ustalić:

- czy rzeczywiście przetwarzasz dane osobowe,
- kto jest administratorem,
- kto jest procesorem,
- dlaczego dane są przetwarzane,
- czy zakres danych jest potrzebny,
- gdzie dane trafiają,
- kto ma do nich dostęp,
- jak długo są przechowywane,
- co się stanie w przypadku wycieku,
- czy osoba może zażądać ich usunięcia.

RODO nie powinno być pierwszym pytaniem.

Najpierw trzeba zrozumieć rzeczywisty proces.

Dopiero później można ocenić jego zgodność.

## Najważniejszy model myślenia

Nie zaczynaj od pytania:

> Czy potrzebujemy zgody?

Zacznij od pytań:

> Jakie dane są przetwarzane?

> Po co są przetwarzane?

> Kto decyduje o celu?

> Kto wykonuje operacje na danych?

> Gdzie dane trafiają?

> Jakie ryzyko powstaje dla człowieka?

Zgoda jest tylko jedną z możliwych podstaw przetwarzania.

Nie jest uniwersalnym rozwiązaniem każdego problemu.

## Krok 1: ustal, czy informacja jest daną osobową

Dane osobowe to informacje, które pozwalają bezpośrednio lub pośrednio zidentyfikować konkretną osobę.

Nie trzeba znać numeru PESEL.

Danymi osobowymi mogą być:

- imię i nazwisko,
- służbowy adres e-mail,
- numer telefonu,
- login,
- adres IP,
- zdjęcie,
- nagranie głosu,
- numer klienta,
- identyfikator urządzenia,
- historia zachowania użytkownika,
- lokalizacja,
- stanowisko połączone z nazwą organizacji.

Przykład:

```text
pawel.litwinski@example.com
```

Taki adres zwykle pozwala powiązać informację z konkretną osobą.

Przykład mniej oczywisty:

```text
misiu143
```

Dla przypadkowego użytkownika login może nie oznaczać konkretnej osoby.

Dla administratora portalu, który posiada dane konta, adres IP i historię logowania, będzie już identyfikatorem konkretnego użytkownika.

Kluczowe pytanie brzmi:

> Czy podmiot posiada lub może rozsądnie uzyskać dodatkowe informacje pozwalające rozpoznać osobę?

Dane osobowe są zależne od kontekstu.

Ta sama informacja dla jednego podmiotu może być anonimowa, a dla drugiego pozwalać na jednoznaczną identyfikację.

## Krok 2: nie myl anonimizacji z ukrywaniem części danych

Usunięcie jednej litery z nazwiska nie oznacza anonimizacji.

Cienki czarny pasek na oczach również nie powoduje, że osoba przestaje być rozpoznawalna.

Przykład:

```text
Jan Kowalsk_
```

Jeżeli informacja dotyczy pracownika niewielkiej organizacji albo mieszkańca małej miejscowości, ustalenie tożsamości może być bardzo łatwe.

Podobny problem występuje przy zdjęciach.

Nawet po zasłonięciu twarzy osoba może zostać rozpoznana po:

- ubraniu,
- miejscu,
- sylwetce,
- tatuażu,
- pojeździe,
- kontekście zdarzenia,
- towarzyszących jej osobach.

Anonimizacja jest skuteczna dopiero wtedy, gdy identyfikacja osoby nie jest już rozsądnie możliwa.

Jeżeli istnieje dodatkowa tabela lub klucz pozwalający przywrócić tożsamość, mówimy o pseudonimizacji.

Przykład:

```text
USER-84721
```

Jeżeli organizacja ma tabelę:

```text
USER-84721 = Jan Kowalski
```

dane nadal podlegają RODO.

## Krok 3: ustal rolę każdego podmiotu

Najważniejsze role to:

- administrator,
- podmiot przetwarzający,
- subprocesor,
- niezależny administrator.

Administrator decyduje:

- po co dane są przetwarzane,
- jaki zakres danych jest potrzebny,
- jak długo dane będą używane,
- kto otrzyma dostęp,
- jakie operacje będą wykonywane.

Procesor wykonuje operacje na danych w imieniu administratora.

Przykład:

Firma posiada bazę klientów i korzysta z zewnętrznej platformy mailingowej.

Firma określa:

- do kogo wysyłany jest newsletter,
- jakie treści będą wysyłane,
- kiedy wiadomości będą wysyłane.

Platforma technicznie przechowuje adresy i wysyła wiadomości.

W tym modelu firma jest administratorem, a dostawca platformy może być procesorem.

Nie każda wymiana danych oznacza jednak powierzenie.

Jeżeli dwie firmy wymieniają służbowe dane kontaktowe swoich pracowników w celu realizacji umowy, najczęściej każda z nich działa jako niezależny administrator.

Nie trzeba automatycznie zawierać umowy powierzenia z każdą firmą, do której wysłano wiadomość e-mail.

## Jak rozpoznać powierzenie

Zadaj pytanie:

> Czy dostawca przetwarza dane we własnym celu, czy wykonuje operacje określone przez klienta?

Przykład firmy ochroniarskiej.

Jeżeli ochrona jedynie pilnuje budynku i reaguje na zdarzenia, może nie przetwarzać danych w imieniu klienta.

Jeżeli jednak:

- obsługuje monitoring,
- prowadzi książkę wejść i wyjść,
- zarządza kartami dostępu,
- przegląda nagrania,
- przechowuje listę pracowników,

to prawdopodobnie przetwarza dane w imieniu klienta.

Wtedy należy przeanalizować potrzebę zawarcia umowy powierzenia.

Najważniejsza zasada:

> Nie oceniaj roli na podstawie nazwy usługi. Sprawdź, co dostawca rzeczywiście robi z danymi.

## Krok 4: ustal cel przetwarzania

Każda operacja powinna mieć konkretny cel.

Nie wystarczy napisać:

```text
Dane przetwarzamy w celach biznesowych.
```

Cel powinien wyjaśniać, dlaczego dane są potrzebne.

Przykłady:

- realizacja zamówienia,
- prowadzenie konta użytkownika,
- obsługa reklamacji,
- zapewnienie bezpieczeństwa budynku,
- wykrywanie złośliwego oprogramowania,
- wysyłanie newslettera,
- personalizacja oferty,
- ochrona przed roszczeniami,
- spełnienie obowiązku prawnego.

Jeżeli organizacja nie potrafi wyjaśnić, do czego konkretne pole jest potrzebne, prawdopodobnie nie powinna go zbierać.

## Krok 5: sprawdź minimalizację danych

Zbieraj tylko to, co jest potrzebne do realizacji określonego celu.

Przykład programu lojalnościowego.

Do utworzenia konta może wystarczyć:

```text
adres e-mail
```

albo:

```text
numer telefonu
```

Jeżeli formularz dodatkowo wymaga:

- pełnego adresu zamieszkania,
- daty urodzenia,
- płci,
- stanu cywilnego,
- liczby dzieci,

trzeba ustalić, dlaczego te informacje są potrzebne.

Może się okazać, że prawdziwym celem nie jest wydanie karty, lecz:

- profilowanie,
- segmentacja klientów,
- marketing,
- analiza zachowań,
- personalizacja reklam.

Najważniejsze pytanie:

> Czy proces zadziała bez tej informacji?

Jeżeli odpowiedź brzmi „tak”, zbieranie danych może być nadmiarowe.

## Krok 6: wybierz właściwą podstawę prawną

Nie każde przetwarzanie wymaga zgody.

Podstawą może być między innymi:

- wykonanie umowy,
- obowiązek prawny,
- uzasadniony interes administratora,
- realizacja zadania publicznego,
- ochrona żywotnych interesów,
- zgoda osoby.

Przykład biletu imiennego na koncert.

Jeżeli regulamin przewiduje, że bilet jest przypisany do konkretnej osoby i nie może zostać przekazany, organizator może zweryfikować tożsamość uczestnika.

Pokazanie dokumentu przy wejściu może być uzasadnione realizacją umowy.

Nie oznacza to jednak automatycznie, że organizator powinien:

- kopiować dowód,
- fotografować dokument,
- przechowywać jego skan,
- zapisywać pełny numer dokumentu.

Trzeba odróżnić weryfikację tożsamości od kopiowania danych.

## Zgoda nie może być wymuszona

Zgoda powinna być:

- dobrowolna,
- świadoma,
- konkretna,
- jednoznaczna,
- możliwa do wycofania.

Jeżeli użytkownik nie może skorzystać z usługi bez zaakceptowania niepotrzebnego marketingu, trudno mówić o dobrowolności.

Nie powinno się również zbierać zgody, jeżeli przetwarzanie i tak musi nastąpić na podstawie umowy lub obowiązku prawnego.

W przeciwnym razie powstaje problem:

> Co administrator zrobi, gdy użytkownik wycofa zgodę, ale dane nadal muszą być przetwarzane?

## Krok 7: przeanalizuj mechanizm cookies

Cookies nie powinny być analizowane wyłącznie jako baner wyświetlany na stronie.

Trzeba sprawdzić rzeczywiste działanie mechanizmu.

Najpierw ustal:

- jakie pliki cookies są zapisywane,
- które są niezbędne,
- które służą analityce,
- które służą reklamie,
- jakie skrypty uruchamiają się przed wyborem,
- komu dane są przekazywane,
- czy odmowa jest respektowana.

Prawidłowy wybór powinien być równoważny.

Przykład:

```text
Akceptuję wszystkie
Odrzucam wszystkie
Dostosuj ustawienia
```

Opcja odmowy nie powinna być:

- ukryta w drugim oknie,
- napisana mniejszą czcionką,
- wyszarzona,
- trudniejsza do kliknięcia,
- zastąpiona samym zamknięciem banera.

Zgoda wymaga aktywnego działania.

Samo przewijanie strony albo dalsze korzystanie z serwisu nie powinno być traktowane jako zgoda.

## Nie zastępuj odmowy „uzasadnionym interesem”

Część platform zgód pokazuje przy konkretnych dostawcach dwa przełączniki:

```text
Zgoda
Uzasadniony interes
```

W praktyce może prowadzić to do sytuacji, w której użytkownik odmawia zgody, ale administrator nadal wykonuje podobne przetwarzanie na podstawie uzasadnionego interesu.

To podejście wymaga szczególnej ostrożności.

Nie można projektować mechanizmu tak, aby odmowa użytkownika była pozorna.

Kluczowe pytanie:

> Czy po kliknięciu „odrzucam” dane rzeczywiście przestają być przetwarzane w danym celu?

Jeżeli nie, interfejs może wprowadzać użytkownika w błąd.

## Krok 8: oddziel prywatne użycie od publicznego udostępniania

RODO może nie obejmować czynności wykonywanych wyłącznie w celach osobistych lub domowych.

Przykład:

```text
Lista numerów telefonów przechowywana prywatnie w smartfonie.
```

Sytuacja zmienia się, gdy dane zostają publicznie udostępnione.

Przykład:

```text
Publikacja nagrania z wideorejestratora w mediach społecznościowych.
```

Nie ma decydującego znaczenia, czy autor zarabia na publikacji.

Brak celu zarobkowego nie oznacza automatycznie, że można swobodnie publikować cudze dane.

Trzeba brać pod uwagę również:

- prywatność,
- wizerunek,
- dobre imię,
- dobra osobiste,
- tajemnicę komunikowania się.

RODO nie jest jedyną regulacją chroniącą człowieka.

## Monitoring i kamery

Przy monitoringu najpierw ustal:

- jaki obszar obejmuje kamera,
- po co prowadzony jest monitoring,
- kto ma dostęp do nagrań,
- jak długo są przechowywane,
- czy nagrywany jest dźwięk,
- czy kamera obejmuje przestrzeń publiczną,
- czy możliwe jest ograniczenie pola widzenia.

Monitoring własnej posesji może mieścić się w użytku osobistym.

Jeżeli jednak kamera obejmuje:

- chodnik,
- drogę,
- wejście sąsiada,
- cudzy ogród,
- przestrzeń wspólną,

sytuacja wymaga szerszej analizy.

Nie oznacza to automatycznie, że monitoring jest zakazany.

Trzeba jednak wykazać, że zakres nagrywania jest potrzebny i proporcjonalny.

## Wideorejestrator w samochodzie

Nagrywanie drogi może być uzasadnione potrzebą zabezpieczenia dowodu na wypadek kolizji lub innego zdarzenia.

Samo posiadanie nagrania różni się od jego publikowania.

Przekazanie materiału:

- policji,
- ubezpieczycielowi,
- sądowi,

ma inny cel niż wrzucenie filmu do internetu w celu ośmieszenia uczestnika ruchu.

Najważniejsze pytanie:

> Do czego nagranie zostanie wykorzystane?

Ryzyko rośnie, gdy nagrania są:

- publikowane publicznie,
- przechowywane bez ograniczenia,
- używane do identyfikowania i piętnowania osób,
- udostępniane bez konkretnego celu.

## Drony

Przy nagraniach z drona nie wystarczy zapytać, czy materiał podlega RODO.

Sam sposób obserwacji może naruszać prywatność.

Inaczej należy ocenić lot nad:

```text
drogą publiczną
```

a inaczej nad:

```text
oknem mieszkania
```

albo:

```text
ogrodem, przedszkolem lub basenem
```

Zadaj pytania:

- czy kamera celowo obserwuje konkretną osobę,
- czy osoba znajduje się w miejscu prywatnym,
- czy nagrywanie jest długotrwałe,
- czy materiał pozwala ją rozpoznać,
- czy obraz jest zapisywany,
- czy nagranie będzie udostępniane.

Nawet gdy RODO nie ma zastosowania, może dojść do naruszenia prywatności lub innych dóbr osobistych.

## Krok 9: przeanalizuj prawa osoby

Osoba może między innymi zażądać:

- dostępu do danych,
- poprawienia danych,
- usunięcia danych,
- ograniczenia przetwarzania,
- przeniesienia danych,
- wniesienia sprzeciwu.

Nie każde żądanie oznacza, że dane trzeba natychmiast usunąć.

Najpierw sprawdź:

- jakie dane są przetwarzane,
- na jakiej podstawie,
- czy cel nadal istnieje,
- czy obowiązuje okres retencji,
- czy dane są potrzebne do obrony roszczeń,
- czy obowiązek ich przechowywania wynika z prawa.

Prawo do usunięcia dotyczy danych osobowych.

Nie musi automatycznie oznaczać usunięcia każdej treści utworzonej przez użytkownika.

## Usunięcie konta w aplikacji zespołowej

Wyobraź sobie aplikację, w której kilka osób pracuje nad jednym projektem.

Jeden użytkownik żąda usunięcia konta.

Nie zaczynaj od automatycznego usuwania całego projektu.

Najpierw ustal:

- kto jest właścicielem projektu,
- czy projekt należy do całego zespołu,
- które elementy identyfikują usuwanego użytkownika,
- czy historię można zanonimizować,
- czy treść musi pozostać dostępna pozostałym osobom,
- co przewiduje regulamin usługi.

Możliwym rozwiązaniem może być:

```text
Usunięty użytkownik
```

zamiast:

```text
Jan Kowalski
```

Nie zawsze jednak taka zmiana będzie skuteczną anonimizacją.

Wszystko zależy od treści projektu i pozostałych metadanych.

## Weryfikacja osoby składającej żądanie

Żądanie może zostać przekazane różnymi kanałami, również telefonicznie.

Problemem jest ustalenie, kto rzeczywiście dzwoni.

Nie należy automatycznie żądać skanu dowodu osobistego.

Najpierw wybierz metodę proporcjonalną do ryzyka.

Przykłady:

- wiadomość z adresu przypisanego do konta,
- potwierdzenie po zalogowaniu,
- kod jednorazowy,
- ePUAP w relacji z urzędem,
- osobista weryfikacja przy sprawach wysokiego ryzyka.

Najważniejsze pytanie:

> Jak potwierdzić tożsamość bez zbierania kolejnych nadmiarowych danych?

## Krok 10: sprawdź poprawność danych

RODO wymaga, aby dane były prawidłowe.

Przykład:

Firma ubezpieczeniowa wysyła wiadomości na niewłaściwy adres, ponieważ klient błędnie wpisał e-mail innej osoby.

Powstają dwa problemy:

- dane zapisane w systemie są nieprawidłowe,
- wiadomości są kierowane do osoby, wobec której firma może nie mieć podstawy prawnej.

Organizacja powinna posiadać proces:

- zgłaszania błędnych danych,
- poprawiania informacji,
- blokowania dalszej wysyłki,
- propagowania zmiany do innych systemów,
- weryfikowania źródła błędu.

Dane nie powinny być uznawane za prawidłowe tylko dlatego, że znajdują się w systemie.

## Krok 11: przeanalizuj blog, formularze i newsletter

Prosty blog bez kont, komentarzy i newslettera może przetwarzać jedynie ograniczony zakres danych technicznych.

Przykład:

```text
adres IP w logach serwera
```

W takim przypadku może wystarczyć krótka informacja wyjaśniająca:

- kto prowadzi stronę,
- jakie dane techniczne są zapisywane,
- po co powstają logi,
- jak długo są przechowywane,
- jakie prawa posiada użytkownik.

Sytuacja zmienia się, gdy pojawiają się:

- komentarze,
- formularz kontaktowy,
- konto użytkownika,
- narzędzia analityczne,
- reklamy,
- newsletter.

Każda nowa funkcjonalność tworzy dodatkowy przepływ danych.

## Newsletter jako usługa

Newsletter nie jest tylko listą adresów e-mail.

To usługa elektroniczna świadczona użytkownikowi.

Należy ustalić:

- kto jest usługodawcą,
- kto jest administratorem,
- jak użytkownik się zapisuje,
- jak może zrezygnować,
- jakie treści będzie otrzymywać,
- czy adres zostanie przekazany dostawcy platformy mailingowej.

Jeżeli newsletter przechodzi z osoby fizycznej do spółki, może dojść do zmiany usługodawcy i administratora.

Nie wystarczy założyć, że osoba fizyczna posiada udziały w spółce.

To dwa odrębne podmioty.

Użytkownicy powinni zostać poinformowani o zmianie i jej konsekwencjach.

## Krok 12: przeanalizuj chmurę i narzędzia współdzielone

Przechowywanie danych w Teamsie, SharePoint, Google Workspace lub innym narzędziu nie jest automatycznie zgodne albo niezgodne z RODO.

Trzeba sprawdzić konfigurację i rzeczywisty model dostępu.

Zadaj pytania:

- kto może otworzyć plik,
- czy dostęp mają goście,
- czy stosowane jest MFA,
- czy link można przekazać dalej,
- czy plik można pobrać na prywatne urządzenie,
- gdzie przechowywane są dane,
- jak wygląda retencja,
- czy powstają kopie,
- czy tworzone są nagrania i transkrypcje,
- czy dostawca wykorzystuje dane we własnym celu.

Dodatkowe hasło do pliku może być zabezpieczeniem.

Nie zastępuje jednak:

- kontroli dostępu,
- umowy z dostawcą,
- właściwej podstawy prawnej,
- zasad retencji,
- kontroli transferu danych.

## Dyski współdzielone

Fakt, że dysk jest wewnętrzny, nie oznacza, że każdy pracownik powinien widzieć wszystkie pliki.

Przykład złego modelu:

```text
\\firma\wspolny\wszyscy
```

zawierający:

- dane kadrowe,
- dokumentację klientów,
- umowy,
- informacje medyczne,
- listy wynagrodzeń.

Dostęp powinien wynikać z roli i obowiązków.

Sprawdź:

- grupy uprawnień,
- właścicieli katalogów,
- dostęp byłych pracowników,
- konta techniczne,
- możliwość kopiowania,
- logowanie dostępu,
- okresowe przeglądy uprawnień.

Wewnętrzny dostęp osoby nieuprawnionej nadal może być incydentem bezpieczeństwa.

Nie zakładaj, że problem nie istnieje tylko dlatego, że dane nie opuściły firmy.

## Krok 13: przeanalizuj EDR i antywirusa

Rozwiązanie EDR może przesyłać do chmury znacznie więcej niż sam hash złośliwego pliku.

Telemetria może zawierać:

- nazwę pliku,
- pełną ścieżkę,
- nazwę użytkownika,
- nazwę urządzenia,
- adres IP,
- fragment procesu,
- argumenty linii poleceń,
- próbkę pliku,
- fragment pamięci.

Przykład:

```text
C:\Users\Jan.Kowalski\Documents\L4_depresja.pdf
```

Sama nazwa i ścieżka pliku mogą ujawniać dane osobowe, a nawet informacje o zdrowiu.

Przed wdrożeniem EDR sprawdź:

- jaki zakres telemetrii jest przesyłany,
- czy wysyłane są całe pliki,
- czy przesyłanie próbek można wyłączyć,
- gdzie znajduje się konsola,
- gdzie przetwarzane są dane,
- czy dostawca uznaje się za procesora,
- czy korzysta z subprocesorów,
- jak długo przechowuje dane,
- czy wykorzystuje próbki do własnych badań.

Nie przyjmuj automatycznie zapewnienia dostawcy:

```text
Nie przetwarzamy danych osobowych.
```

Sprawdź rzeczywisty przepływ techniczny.

## Publiczne serwisy do analizy plików

Przed przesłaniem pliku do publicznego serwisu analitycznego załóż, że próbka może zostać:

- zapisana,
- zachowana przez długi czas,
- udostępniona innym badaczom,
- wykorzystana do rozwoju produktu,
- pobrana przez płatnych użytkowników,
- przetwarzana poza EOG.

Nie przesyłaj bez analizy:

- dokumentów klientów,
- plików zawierających dane pracowników,
- konfiguracji produkcyjnych,
- plików z sekretami,
- pełnych baz danych,
- dokumentacji objętej tajemnicą.

Najpierw przygotuj minimalną próbkę.

Usuń z niej wszystko, co nie jest potrzebne do sprawdzenia zagrożenia.

## Krok 14: przeanalizuj AI i zewnętrzne API

Wprowadzenie danych do systemu generatywnej AI jest operacją przekazania danych zewnętrznemu dostawcy.

Nie traktuj interfejsu czatu jak prywatnego notatnika.

Przed wysłaniem danych klientów sprawdź:

- czy treść jest przechowywana,
- czy jest wykorzystywana do trenowania,
- czy może być analizowana przez ludzi,
- czy dostawca działa jako procesor,
- gdzie dane są przetwarzane,
- jak długo są przechowywane,
- czy można je usunąć,
- czy istnieje wersja biznesowa z innymi warunkami,
- czy administrator zgodził się na taki sposób przetwarzania.

Nie przesyłaj do publicznego modelu:

- pełnych danych klientów,
- numerów PESEL,
- danych medycznych,
- danych uwierzytelniających,
- dokumentów wewnętrznych,
- tajemnic przedsiębiorstwa,
- niezanonimizowanych incydentów,
- konfiguracji zawierających sekrety.

Przykład bezpieczniejszego wejścia:

```text
Klient_A zgłosił błąd w Systemie_X.
```

zamiast:

```text
Jan Kowalski, PESEL 90010112345, zgłosił błąd w systemie bankowym...
```

Nadal trzeba jednak sprawdzić, czy pozostałe informacje nie pozwalają na ponowną identyfikację.

## Krok 15: przeanalizuj profilowanie

Profilowanie polega na analizie danych dotyczących osoby w celu przewidywania lub oceny jej zachowania, zainteresowań albo cech.

Przykład:

System zapisuje:

- odwiedzone produkty,
- długość wizyty,
- kliknięte linki,
- historię wyszukiwania,
- adres IP,
- identyfikator urządzenia.

Następnie próbuje połączyć anonimowy profil z kontem konkretnego użytkownika.

W momencie połączenia dane przestają być anonimowe.

Przed wdrożeniem sprawdź:

- jaki jest cel profilowania,
- jaka jest podstawa prawna,
- czy użytkownik został poinformowany,
- jaka jest pewność dopasowania,
- co stanie się przy błędzie,
- czy profil obejmuje dane szczególnej kategorii,
- czy decyzja wpływa istotnie na użytkownika.

Przykład ryzyka:

Z jednego urządzenia korzystają dwie osoby.

System przypisuje zachowanie pierwszej osoby do konta drugiej i pokazuje jej reklamy dotyczące:

- zdrowia,
- ciąży,
- leków,
- problemów finansowych.

Problemem nie jest tylko prywatność.

Problemem jest również prawidłowość danych.

## Krok 16: sprawdź transfer danych poza EOG

Nie analizuj transferu wyłącznie przez pytanie:

```text
Gdzie stoi serwer?
```

Znaczenie ma również:

- siedziba dostawcy,
- dostęp administratorów,
- wsparcie techniczne,
- subprocesorzy,
- kopie zapasowe,
- globalne centra operacyjne,
- zdalny dostęp z państw trzecich.

Przykład:

Serwer znajduje się w Niemczech, ale wsparcie techniczne wykonuje zespół w Indiach.

Dane mogą być dostępne poza EOG mimo europejskiej lokalizacji serwera.

Przy transferze sprawdź:

- podstawę transferu,
- standardowe klauzule umowne,
- decyzję o adekwatności,
- właściwy framework,
- ocenę ryzyka państwa trzeciego,
- dodatkowe zabezpieczenia,
- aktualną listę subprocesorów.

NDA ani raport SOC 2 samodzielnie nie legalizują transferu.

Są elementem zabezpieczeń, ale nie zastępują wymaganej podstawy prawnej.

## Krok 17: zabezpieczenia mają wynikać z ryzyka

RODO nie wskazuje jednego obowiązkowego antywirusa ani konkretnego algorytmu.

Środki powinny być dostosowane do:

- rodzaju danych,
- liczby osób,
- możliwych konsekwencji,
- sposobu przetwarzania,
- dostępności systemu,
- aktualnych zagrożeń.

Dla urządzenia przechowującego dokumentację medyczną warto rozważyć:

- pełne szyfrowanie dysku,
- MFA,
- aktualizacje,
- blokadę ekranu,
- ograniczone konto użytkownika,
- kopie zapasowe,
- zdalne wymazanie,
- kontrolę nośników,
- ochronę antymalware.

Szyfrowanie ma szczególne znaczenie przy utracie urządzenia.

Jeżeli skradziony laptop był prawidłowo zaszyfrowany, ryzyko dostępu do danych może być znacznie mniejsze.

Samo hasło do konta użytkownika nie zawsze oznacza szyfrowanie danych na dysku.

## Krok 18: ustal, czy doszło do naruszenia

Naruszenie ochrony danych może polegać na:

- utracie,
- zniszczeniu,
- zmianie,
- nieuprawnionym ujawnieniu,
- nieuprawnionym dostępie.

Nie każde zdarzenie musi zostać zgłoszone do organu.

Najpierw przeprowadź analizę ryzyka.

Sprawdź:

- jakie dane zostały objęte zdarzeniem,
- ile osób dotyczy incydent,
- kto uzyskał dostęp,
- czy dane były zaszyfrowane,
- czy można je wykorzystać do oszustwa,
- czy zawierają informacje szczególnej kategorii,
- czy dane zostały odzyskane,
- czy dostęp został potwierdzony,
- jakie mogą być konsekwencje dla osób.

Przykład:

Pracownik wysłał wewnętrzny plik do niewłaściwego działu.

Nie oznacza to automatycznie wysokiego ryzyka.

Trzeba sprawdzić:

- kto otrzymał plik,
- czy miał obowiązek poufności,
- czy otworzył dokument,
- czy usunął wiadomość,
- jakiego rodzaju dane zawierał plik.

Ocena nie może opierać się wyłącznie na słowie „wyciek”.

Liczy się rzeczywisty skutek.

## Krok 19: dokumentuj decyzje

Jeżeli organizacja wykryła problem, ale dostawca nie chce go rozwiązać, samo ignorowanie ryzyka jest najgorszą opcją.

Dokumentuj:

- opis problemu,
- ocenę ryzyka,
- korespondencję z dostawcą,
- rekomendowane działania,
- odmowę wykonania zmian,
- decyzję właściciela ryzyka,
- zastosowane zabezpieczenia zastępcze,
- termin ponownej oceny.

Dokumentacja nie sprawia, że niezgodny proces staje się zgodny.

Może jednak wykazać, że organizacja:

- rozpoznała problem,
- próbowała go ograniczyć,
- podjęła świadomą decyzję,
- zastosowała dostępne zabezpieczenia.

W kontroli liczy się nie tylko rezultat.

Liczy się również możliwość pokazania procesu decyzyjnego.

## Minimalny workflow analizy RODO

Najkrótszy praktyczny proces wygląda tak:

1. Opisz rzeczywisty proces biznesowy.
2. Zidentyfikuj wszystkie kategorie danych.
3. Sprawdź, czy można rozpoznać konkretną osobę.
4. Ustal administratora, procesorów i subprocesorów.
5. Określ cel każdej operacji.
6. Wybierz właściwą podstawę prawną.
7. Usuń dane, które nie są potrzebne.
8. Ustal odbiorców i lokalizację przetwarzania.
9. Sprawdź transfery poza EOG.
10. Określ retencję.
11. Zaprojektuj realizację praw osób.
12. Dobierz zabezpieczenia do ryzyka.
13. Przygotuj obsługę incydentów.
14. Udokumentuj analizę i decyzje.
15. Wróć do procesu po zmianie systemu lub dostawcy.

## Pytania do dostawcy usługi IT

Przy ocenie nowej usługi zapytaj:

```text
Jakie dane otrzymujecie?

Czy otrzymujecie dane osobowe?

W jakim celu wykorzystujecie dane?

Czy działacie jako procesor czy niezależny administrator?

Gdzie dane są przechowywane?

Z jakich lokalizacji pracownicy mogą uzyskać dostęp?

Czy korzystacie z subprocesorów?

Czy dane są używane do trenowania modeli lub rozwoju produktu?

Jak długo przechowujecie dane?

Jak realizowane jest usunięcie danych?

Czy przesyłacie pełne pliki lub tylko telemetrię?

Czy możemy ograniczyć zakres wysyłanych informacji?

Jak wygląda zgłaszanie incydentów?

Co dzieje się z danymi po zakończeniu umowy?
```

## Pytania do właściciela procesu

```text
Dlaczego potrzebujemy tych danych?

Co się stanie, jeśli ich nie zbierzemy?

Kto powinien mieć dostęp?

Czy użytkownik spodziewa się takiego wykorzystania?

Czy cel można osiągnąć w mniej ingerujący sposób?

Jak długo informacje są naprawdę potrzebne?

Czy użytkownik może poprawić dane?

Czy może usunąć konto?

Co stanie się z kopiami zapasowymi?

Czy dane trafiają do innych systemów?

Czy proces obejmuje AI, profilowanie lub monitoring?

Jakie konsekwencje może mieć błąd?
```

## Jak myśleć o zgodzie

Nie myśl:

> Mamy checkbox, więc jesteśmy zgodni.

Pomyśl:

> Czy użytkownik rzeczywiście miał wybór?

> Czy wiedział, na co się zgadza?

> Czy odmowa została technicznie wykonana?

> Czy zgodę można łatwo wycofać?

> Czy dane po wycofaniu rzeczywiście przestają być wykorzystywane?

Checkbox jest tylko elementem interfejsu.

Zgodność zależy od tego, co system robi z danymi.

## Jak myśleć o danych anonimowych

Nie myśl:

> Usunęliśmy imię i nazwisko, więc dane są anonimowe.

Pomyśl:

> Czy osobę można rozpoznać na podstawie pozostałych informacji?

> Czy istnieje dodatkowa tabela?

> Czy można połączyć dane z innym źródłem?

> Czy kontekst wskazuje na jedną konkretną osobę?

Anonimizacja nie jest operacją kosmetyczną.

Musi rzeczywiście uniemożliwiać identyfikację.

## Jak myśleć o chmurze

Nie myśl:

> Dane są zabezpieczone hasłem, więc RODO nas nie dotyczy.

Pomyśl:

> Kto kontroluje usługę?

> Kto może uzyskać dostęp administracyjny?

> Gdzie dane są kopiowane?

> Co zapisuje dostawca w logach?

> Czy dostęp mają podmioty spoza EOG?

> Jak usuniemy dane po zakończeniu współpracy?

Szyfrowanie i hasła są zabezpieczeniami.

Nie zastępują analizy całego procesu.

## Jak myśleć o AI

Nie myśl:

> Wklejam tylko fragment dokumentu.

Pomyśl:

> Czy fragment pozwala rozpoznać osobę?

> Czy model przechowa treść?

> Czy dostawca wykorzysta ją do własnych celów?

> Czy mogę później wymusić usunięcie?

> Czy posiadam zgodę organizacji na korzystanie z tego narzędzia?

> Czy da się osiągnąć ten sam cel na danych sztucznych?

Najbezpieczniejszą metodą jest ograniczenie wejścia do minimum i usunięcie wszystkich elementów pozwalających na identyfikację.

## Najczęstsze błędy

Pierwszym błędem jest pytanie o zgodę przed zrozumieniem procesu.

Drugim błędem jest uznanie, że każda firma otrzymująca dane jest procesorem.

Trzecim błędem jest traktowanie zamazanego nazwiska jako anonimizacji.

Czwartym błędem jest skupienie się na dokumentacji bez sprawdzenia rzeczywistych konfiguracji.

Piątym błędem jest uznanie, że wewnętrzny system jest bezpieczny tylko dlatego, że jest wewnętrzny.

Szóstym błędem jest przesyłanie rzeczywistych danych do publicznych narzędzi AI i serwisów analitycznych.

Siódmym błędem jest ocenianie transferu wyłącznie na podstawie lokalizacji serwera.

Ósmym błędem jest przyjmowanie, że każdy incydent ma takie samo ryzyko.

Dziewiątym błędem jest przechowywanie danych bez określonego terminu usunięcia.

Dziesiątym błędem jest traktowanie RODO jak projektu zakończonego po przygotowaniu polityki prywatności.

## Mental model

Nie pytaj:

> Czy RODO pozwala nam używać tego systemu?

Zapytaj:

> Co ten system rzeczywiście robi z danymi?

Czy zbiera dane osobowe?

Czy zakres danych jest konieczny?

Czy osoba spodziewa się takiego wykorzystania?

Czy dostawca ma własny cel?

Czy dane opuszczają organizację?

Czy trafiają poza EOG?

Czy można je usunąć?

Czy system pozwala poprawić błędne informacje?

Czy dostęp jest ograniczony?

Czy wiemy, co zrobimy po incydencie?

Dopiero odpowiedzi na te pytania pozwalają ocenić zgodność.

## Final checklist

Przed zaakceptowaniem procesu sprawdź:

- czy opisano cel przetwarzania,
- czy zidentyfikowano wszystkie kategorie danych,
- czy określono administratora,
- czy ustalono procesorów i subprocesorów,
- czy wybrano podstawę prawną,
- czy zakres danych jest minimalny,
- czy dane są prawidłowe,
- czy określono retencję,
- czy dostęp wynika z roli,
- czy system obsługuje prawa osób,
- czy zidentyfikowano transfery,
- czy sprawdzono chmurę, telemetrię i kopie,
- czy przeanalizowano AI i profilowanie,
- czy dobrano zabezpieczenia,
- czy istnieje procedura obsługi incydentów,
- czy decyzje zostały udokumentowane.

## Najważniejsza idea

RODO nie zaczyna się od checkboxa.

Zaczyna się od przepływu danych.

Najpierw ustalasz, jakie informacje powstają, kto je otrzymuje, po co ich używa i jakie ryzyko tworzy to dla człowieka.

Dopiero później dobierasz podstawę prawną, dokumentację i zabezpieczenia.

Jeżeli nie rozumiesz przepływu danych, nie jesteś w stanie rzetelnie ocenić zgodności procesu.
