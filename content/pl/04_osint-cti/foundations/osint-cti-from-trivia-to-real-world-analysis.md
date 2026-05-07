---
id: osint-cti-from-trivia-to-real-world-analysis
title: "OSINT i CTI: moment, w którym kończy się zbieranie ciekawostek, a zaczyna prawdziwa analiza"
team: red-blue
domain: osint-cti
section: foundations
type: knowledge
angle: osint-to-cti-analysis-mindset
sourceTrack: osint-sekurak
tags: ["osint", "cti", "dns", "ja3", "mitre", "ttp", "ioc", "opsec"]
difficulty: medium
shortDescription: "Wprowadzenie do OSINT i CTI jako procesu analitycznego: jak przechodzić od pojedynczych artefaktów, ruchu sieciowego, DNS, nicków, archiwów i śladów technicznych do spójnego obrazu działania przeciwnika, bez mylenia ciekawostek z realną analizą."
updatedAt: "2026-04-07"
---

# OSINT i CTI: moment, w którym kończy się zbieranie ciekawostek, a zaczyna prawdziwa analiza

Jest duża różnica między człowiekiem, który „umie szukać w internecie”, a człowiekiem, który naprawdę umie analizować zagrożenia.

Na pierwszy rzut oka to może wyglądać podobnie.  
Tu ktoś znajdzie domenę.  
Tu ktoś wyciągnie rekord TXT.  
Tu ktoś odkryje stary wpis na Reddicie.  
Tu ktoś wrzuci nick do pięciu tooli i poczuje, że zrobił OSINT.

Tylko że to dalej może być bardziej kolekcjonowanie śmieci niż analiza.

Prawdziwa wartość zaczyna się dopiero wtedy, kiedy umiesz spojrzeć na pojedyncze artefakty i zadać sobie dużo ważniejsze pytanie niż „co jeszcze znajdę”.

Pytanie brzmi:

**co z tego naprawdę wynika?**

I właśnie dlatego ten temat jest tak mocny.

Bo on nie jest o zabawie narzędziami.  
On jest o momencie, w którym OSINT przestaje być tylko rozglądaniem się po publicznych źródłach, a zaczyna dotykać czegoś znacznie bardziej konkretnego: **Cyber Threat Intelligence**.

## Problem nie leży w braku danych. Problem leży w braku procesu

To jest chyba jedna z najważniejszych rzeczy, które trzeba sobie wbić do głowy.

W cyberze bardzo rzadko problemem jest to, że nie ma danych.  
Danych zwykle jest aż za dużo.

Ruch sieciowy.  
Adres IP.  
Dziwny POST.  
Base64 w request body.  
Panel logowania na dziwnym serwerze.  
Zdjęcia.  
Chat log.  
QR.  
Stare konto na socialach.  
Archiwum usuniętego posta.  
Fingerprint TLS.  
Wzmianka w bazie.  
Nick na GitHubie.  
Nick na Reddicie.  
Historyczny DNS.

I teraz najważniejsze: to wszystko osobno jest prawie niczym.

Dopiero kiedy zaczynasz to sklejać, pojawia się sens.

To właśnie odróżnia ludzi, którzy „klikają narzędzia”, od ludzi, którzy naprawdę analizują.

## Dobre myślenie zaczyna się od artefaktu, nie od efektownej teorii

To jest błąd, który bardzo łatwo popełnić.

Widzisz coś dziwnego i od razu chcesz mieć nazwę:

- jaki malware,
- jaki actor,
- jaka kampania,
- jaki TTP,
- jaka technika z MITRE,
- jaki konkretny case.

Tylko że to jest zła kolejność.

Najpierw masz artefakt.  
Dopiero później interpretację.

I to jest bardzo ważny nawyk.

Nie próbuj być szybszy od danych.  
Najpierw patrz.  
Potem notuj.  
Potem łącz.  
Dopiero na końcu nazywaj.

## Wireshark nie jest po to, żeby „patrzeć w pakiety”

To też jest coś, co wiele osób źle rozumie.

Wireshark bardzo łatwo sprowadzić do roli okienka z kolorowymi pakietami, w którym ludzie wpisują filtry, bo tak trzeba.

A jego realna wartość jest gdzie indziej.

To jest narzędzie, które pomaga ci odpowiedzieć na pytania:

- kto z kim rozmawia,
- gdzie ruch jest nietypowy,
- co odstaje od tła,
- które hosty wymieniają więcej danych niż powinny,
- gdzie warto zejść głębiej,
- co wygląda jak pobieranie,
- co wygląda jak wysyłanie danych.

To jest zupełnie inny mindset.

Nie „oglądam pakiety”, tylko:
**szukam punktu zaczepienia do dalszej analizy.**

I właśnie dlatego proste rzeczy są takie ważne:

- `Statistics -> Conversations`,
- filtrowanie metod HTTP,
- `Follow HTTP/TCP Stream`,
- obserwacja, czy ruch idzie po 80 czy 443,
- sprawdzenie, czy to wygląda jak normalne zachowanie, czy jak coś, czego tam być nie powinno. Sama prezentacja dosłownie prowadziła przez ten workflow: conversations, zauważenie nietypowego ruchu, filtrowanie `http.request.method`, śledzenie komunikacji i wyciągnięcie z niej zakodowanych danych.

## Base64 nie jest insightem. Insight zaczyna się po dekodowaniu

To jest następna rzecz.

Ludzie często ekscytują się tym, że „znaleźli coś zakodowanego”.  
Super. I co z tego?

Sam fakt, że coś wygląda jak Base64, nie wnosi prawie nic.

Wartość zaczyna się dopiero wtedy, kiedy:

- rozkodujesz to lokalnie,
- zrozumiesz format,
- sprawdzisz, czy to JSON, ZIP, dokument, QR albo coś jeszcze innego,
- osadzisz to w kontekście całej komunikacji.

I tutaj właśnie wchodzi CyberChef.

Nie dlatego, że jest fajny.  
Nie dlatego, że ma ładny interfejs.  
Tylko dlatego, że pozwala bardzo szybko przejść od „dziwnego blobu” do czegoś, co zaczyna mieć sens.

To samo dotyczy QR-ów.  
To samo dotyczy dziwnych plików.  
To samo dotyczy wszystkiego, co na pierwszy rzut oka wygląda tylko jak losowy ciąg znaków.

W praktyce bardzo często nie brakuje ci danych.  
Brakuje ci poprawnej transformacji danych.

## Lokalna analiza > bezmyślne wrzucanie wszystkiego gdzie popadnie

To jest temat, który wielu ludzi dalej olewa.

Znaleźli dziwny string? Wrzuć do chmury.  
Znaleźli plik? Wrzuć do online toola.  
Znaleźli QR? Zeskanuj telefonem z głównego urządzenia.  
Znaleźli dokument? Otwórz normalnie.  
Znaleźli URL? Klik bez zastanowienia.

To jest dokładnie ten moment, w którym analysis zaczyna zamieniać się w samobója.

Bo jeśli analizujesz coś podejrzanego, to musisz zakładać, że druga strona też może coś analizować - tylko ciebie.

Canary tokeny, redirecty, dokumenty z callbackiem, QR prowadzący do kontrolowanego endpointu, pliki generujące połączenia, narzędzia, które po otwarciu od razu wykonują coś w tle - to nie są egzotyczne historie. To są rzeczy, które trzeba mieć z tyłu głowy. W prezentacji było to nazwane wprost: historia o miłości i OPSECu, uwaga na narzędzia do skanowania kodów, a w szkoleniu mocno wybrzmiał wątek pracy lokalnej i izolowanej.

I właśnie tu zaczyna się dojrzałe podejście.

Nie wszystko, co możesz kliknąć, powinieneś kliknąć z własnego systemu.  
Nie wszystko, co możesz zeskanować, powinieneś zeskanować swoim telefonem.  
Nie wszystko, co możesz wrzucić do online toola, powinno ten tool zobaczyć.

## OPSEC nie jest dodatkiem. OPSEC jest częścią analizy

To trzeba powiedzieć brutalnie.

Jeśli wchodzisz w temat zagrożeń, malware’u, serwerów C2, paneli, archiwów, redirectów, profili i śladów zostawianych przez ludzi z bardzo słabym opsekiem, a sam nie myślisz o własnym opseku, to prędzej czy później sam będziesz najgłośniejszym artefaktem w swoim własnym śledztwie.

I to jest piękne, ale tylko jako lekcja.

W praktyce wygląda to tak:

- z jakiego środowiska coś otwierasz,
- czy robisz to pasywnie czy aktywnie,
- czy generujesz request,
- czy zdradzasz IP,
- czy zdradzasz user agenta,
- czy twój system robi coś automatycznie w tle,
- czy analizujesz plik w izolacji,
- czy twoje konto socialowe jest kontem operacyjnym czy prywatnym.

Ludzie lubią mówić o OPSECu w wielkich słowach.  
A często OPSEC zaczyna się od bardzo prostego pytania:

**czy naprawdę powinienem to otwierać stąd, skąd właśnie to otwieram?**

## DNS dalej jest potężny, tylko trzeba wiedzieć po co na niego patrzeć

Dla wielu osób DNS to nudny temat z cyklu:
rekord A, rekord MX, rekord TXT, dobra, jedziemy dalej.

A to jest błąd.

Bo DNS bardzo często mówi ci więcej o zapleczu niż sama strona.

Pokazuje:

- dostawcę usług,
- zewnętrzne integracje,
- ślady po mailingu,
- używane platformy,
- historię hostingu,
- stare rekordy,
- możliwe pivoty,
- miejsca, gdzie infrastruktura była kiedyś bardziej odsłonięta niż dziś.

Jeśli coś dziś siedzi za reverse proxy albo WAF-em, to wcale nie znaczy, że zawsze tam siedziało.  
Historia rekordów potrafi być dużo bardziej szczera niż stan aktualny.

I to jest właśnie to myślenie, które robi różnicę:
nie tylko „sprawdzam DNS”, ale
**szukam tego, co DNS może mi powiedzieć o zapleczu, relacjach i przeszłości tej infrastruktury**.

## FFUF, Ferox i podobne rzeczy nie są po to, żeby „pykać katalogi”

To jest kolejny klasyk.

Ludzie odpalają fuzzing jak automat i myślą, że zrobili recon.  
Nie.  
Odpalili narzędzie.

Różnica jest ogromna.

W dobrym workflow katalogi, endpointy i listingi nie są celem samym w sobie.  
Są sposobem wejścia głębiej.

To właśnie dzięki temu z czegoś, co z wierzchu wygląda jak nudna domyślna strona Apache’a, możesz przejść do:

- ukrytego panelu,
- katalogu z listingiem,
- podejrzanych plików,
- artefaktów do dalszej analizy,
- rzeczy, które zaczynają łączyć technikę z człowiekiem.

I to właśnie jest najciekawsze.

Bo nagle recon przestaje być czysto techniczny.

Zaczynasz od serwera.  
Kończysz na człowieku.  
Albo odwrotnie.

## Automatyczne narzędzia są dobre do startu, ale fatalne jako wyrocznia

To jest bardzo ważne.

Sherlocki, what'smyname, różne agregatory, checkery nicków, narzędzia do pivotowania po socialach - to wszystko jest super.

Na start.

Ale jeśli zaczynasz traktować wynik z narzędzia jako prawdę objawioną, to kończysz źle.

Bo narzędzie może czegoś nie znaleźć.  
Może przegapić GitHuba.  
Może nie złapać Reddita.  
Może źle obsłużyć wzorzec URL-a.  
Może mieć nieaktualną logikę.  
Może nie ogarniać zmian w serwisie.

I wtedy człowiek, który myśli ręcznie, wygrywa z człowiekiem, który ufa dashboardowi.

To jest bardzo ważna lekcja nie tylko dla OSINT-u, ale ogólnie dla cyberbezpieczeństwa.

Tooling pomaga.  
Tooling przyspiesza.  
Tooling bywa świetny.

Ale tooling nie zwalnia z myślenia.

## Utrwalanie danych to nie detal. To część roboty

Bardzo dużo ludzi o tym zapomina.

Widzą coś dziś i zakładają, że jutro też tam będzie.

Nie będzie.

Post zniknie.  
Konto dostanie bana.  
URL padnie.  
Archiwum się zmieni.  
Domena przestanie odpowiadać.  
Katalog zostanie zamknięty.  
Screen zniknie.  
Stary redirect umrze.

I nagle okazuje się, że jedyne, co zostało, to twoja pamięć.  
A pamięć jest słabym repozytorium dowodów.

Dlatego tak ważne jest utrwalanie:

- screenów,
- URL-i,
- timestamów,
- artefaktów,
- hashy,
- tekstu,
- lokalnych kopii,
- archiwalnych wersji.

To nie jest paranoja.  
To jest higiena pracy.

## CTI to nie „fajniejszy OSINT”. CTI to OSINT z celem

To jest chyba najlepszy sposób, żeby to ująć.

CTI nie polega na tym, że masz więcej tooli i bardziej groźnie brzmiące skróty.

CTI polega na tym, że zbierasz i analizujesz informacje o zagrożeniach tak, żeby dało się z tego zrobić realny użytek:

- wykrywać wzorce,
- rozumieć zachowanie przeciwnika,
- wspierać obronę,
- poprawiać prewencję,
- budować kontekst dla incydentów,
- lepiej rozumieć, co się dzieje wokół organizacji.

## Bez zrozumienia skrótów bardzo szybko wpadasz w chaos

W pewnym momencie zaczyna pojawiać się cały słownik:

- IOC,
- TTP,
- KB,
- APT,
- CVSS,
- ATT&CK,
- kill chain.

I jeśli nie ogarniesz, co te rzeczy znaczą w praktyce, to bardzo szybko zaczniesz tylko żonglować nazwami.

Najlepszy przykład to TTP.

Wiele osób rzuca tym skrótem, bo dobrze brzmi.  
Ale realnie chodzi o to, żeby umieć odróżnić:

- poziom celu,
- poziom techniki,
- poziom konkretnego sposobu wykonania.

Czyli nie tylko „co zrobił”, ale też:

- po co to zrobił,
- jaką techniką,
- w jaki dokładnie sposób to wykonał.

I dopiero wtedy MITRE ATT&CK zaczyna mieć sens, bo przestaje być wielką mapą kolorowych kwadratów, a zaczyna być sposobem opisywania zachowania aktora.

## Kill chain i MITRE są przydatne tylko wtedy, gdy nie robisz z nich religii

To też warto powiedzieć wprost.

Nie chodzi o to, żeby każdą rzecz na siłę opisać jako idealnie pasującą do jednego frameworka.  
Nie chodzi o to, żeby cytować ATT&CK tylko po to, żeby brzmieć mądrzej.  
Nie chodzi o to, żeby każdy incydent rozrysować jak szkolny diagram.

Chodzi o coś prostszego.

Masz mieć strukturę, która pomaga ci myśleć.

Kill chain pomaga ci zobaczyć, gdzie w łańcuchu jesteś:
rekonesans, dostawa, eksploatacja, utrzymanie, C2, eksfiltracja.

MITRE pomaga ci opisać zachowanie bardziej precyzyjnie.

CVSS pomaga ci osadzić podatność w języku ryzyka.

To wszystko są narzędzia do myślenia.  
Nie ozdoby do raportu.

## Statystyki malware’u są ważne nie dlatego, że są statystykami

Tu też łatwo pójść w złą stronę.

Jak ktoś widzi statystyki typu:

- ile było testów,
- jakie rodzaje malware’u dominują,
- co wzrosło rok do roku,
- czy przeważają stealery, loadery czy RAT-y,

to często traktuje to jak ciekawostkę.

A to nie są ciekawostki.

To jest kontekst.

Jeżeli widzisz, że pewien typ zagrożeń dominuje, to zaczynasz rozumieć:

- co dziś jest opłacalne dla atakujących,
- co jest częściej wykorzystywane,
- jakie zachowania warto lepiej znać,
- czego spodziewać się w realnych przypadkach,
- na co organizacje powinny patrzeć częściej.

## Najmocniejsza rzecz w tym wszystkim: technika i człowiek w końcu się spotykają

I to jest chyba najbardziej niedoceniany element.

Na początku masz pcap.  
Potem HTTP stream.  
Potem Base64.  
Potem IP.  
Potem DNS.  
Potem ukryte zasoby.  
Potem panel.  
Potem pliki.  
Potem zdjęcia.  
Potem QR.  
Potem chat.  
Potem nick.  
Potem archiwum.  
Potem social.  
Potem osoba.

To jest piękne, bo pokazuje coś bardzo ważnego:

**cyber bardzo rzadko kończy się tylko na technice.**

Na końcu i tak bardzo często trafiasz na człowieka:

- jego błędy,
- jego emocje,
- jego relacje,
- jego ego,
- jego słaby OPSEC,
- jego ślady,
- jego potrzebę pokazania się światu.

I właśnie dlatego ten temat jest tak mocny.

Bo on pokazuje, że czasem najlepszym pivotem nie jest nowy exploit, tylko czyjaś głupota, pośpiech albo potrzeba wrzucenia czegoś do internetu.

Brutalne?  
Tak.

Prawdziwe?  
Bardzo.

## Najlepsze podejście do tej działki

Jeżeli miałbym z tego wyciągnąć jeden mindset do zapamiętania, to byłby taki:

Nie jaraj się zbyt wcześnie tym, że coś znalazłeś.  
Jaraj się dopiero wtedy, kiedy umiesz powiedzieć:

- co to znaczy,
- jak to potwierdzić,
- gdzie z tym pivotować dalej,
- jak nie zdradzić samego siebie,
- i jak zamienić to w realnie użyteczną wiedzę.

Bo właśnie wtedy OSINT przestaje być zabawą w szukanie rzeczy.

I właśnie wtedy zaczyna się robota, która naprawdę ma sens.
