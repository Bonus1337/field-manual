---
id: social-engineering-incident-response-and-recovery
title: "po ataku socjotechnicznym - zgłoszenie, ograniczenie skutków i odbudowa bezpieczeństwa"
team: red-blue
domain: social-engineering
section: incident-response
type: methodology
angle: social-engineering-incident-reporting-containment-recovery-psychology-resilience
sourceTrack: social-engineering-sekurak
tags:
  [
    "social-engineering",
    "incident-response",
    "containment",
    "recovery",
    "security-awareness",
    "reporting",
    "human-factor",
  ]
difficulty: medium
shortDescription: "Praktyczne spojrzenie na działania po skutecznym ataku socjotechnicznym. Notatka pokazuje, dlaczego szybkie zgłoszenie jest ważniejsze niż ukrywanie błędu, jak ograniczać skutki techniczne i organizacyjne oraz jak budować środowisko sprzyjające reakcji zamiast obwinianiu."
updatedAt: "2026-08-02"
---

# Po ataku socjotechnicznym - zgłoszenie, ograniczenie skutków i odbudowa bezpieczeństwa

Skuteczny atak socjotechniczny nie kończy się w momencie kliknięcia linku, przekazania kodu, uruchomienia pliku albo wpuszczenia nieznanej osoby do biura.

To dopiero początek incydentu.

Prawdziwy wpływ zależy od tego, co wydarzy się później.

Czy pracownik natychmiast zgłosi sytuację?

Czy urządzenie zostanie odizolowane?

Czy konto zostanie zabezpieczone?

Czy zespół bezpieczeństwa będzie miał wystarczająco dużo informacji, aby odtworzyć przebieg zdarzenia?

Czy organizacja potraktuje zgłoszenie jako źródło wiedzy, czy jako powód do ukarania osoby, która popełniła błąd?

W pierwszych minutach po ataku najważniejsza nie jest perfekcyjna analiza.

Najważniejsze jest przerwanie dalszego działania napastnika.

---

## Zasada przewodnia: błąd trzeba zgłosić szybciej, niż atakujący zdąży go wykorzystać

Po zauważeniu, że mogło dojść do ataku, naturalną reakcją może być panika.

Pojawia się chęć:

- samodzielnego naprawienia sytuacji,
- usunięcia wiadomości,
- zamknięcia aplikacji,
- wyłączenia komputera,
- ukrycia zdarzenia,
- poczekania, czy rzeczywiście coś się stanie.

Każda minuta opóźnienia może działać na korzyść napastnika.

Atakujący może w tym czasie:

- wykorzystać przejęte hasło,
- zalogować się do kolejnych usług,
- utworzyć reguły w skrzynce pocztowej,
- przejąć sesję,
- pobrać dane,
- zainstalować trwały dostęp,
- kontaktować się z kolejnymi pracownikami,
- wykonać operację finansową.

Najbezpieczniejszym działaniem nie jest próba samodzielnego rozwiązania wszystkiego.

Jest nim natychmiastowe poinformowanie osób odpowiedzialnych za reakcję.

---

## Przyznanie się do błędu jest częścią bezpieczeństwa

Pracownik, który padł ofiarą ataku, może obawiać się konsekwencji.

Może myśleć:

> Powinienem był to zauważyć.

> Będą uważać, że się nie nadaję.

> Może nic się nie wydarzyło.

> Spróbuję najpierw sam to naprawić.

Takie podejście zwiększa ryzyko.

Szybkie zgłoszenie nie jest dowodem niekompetencji.

Jest prawidłowym działaniem po wykryciu incydentu.

W organizacji powinno być jasne, że pracownik ma zgłosić zdarzenie nawet wtedy, gdy nie ma pewności, czy atak się powiódł.

Zespół bezpieczeństwa może później ustalić skalę problemu.

Pracownik nie powinien samodzielnie podejmować decyzji, czy zdarzenie jest wystarczająco poważne.

---

## Kogo powiadomić w organizacji

W zależności od struktury firmy zgłoszenie może trafić do:

- działu IT,
- SOC,
- zespołu reagowania na incydenty,
- bezpośredniego przełożonego,
- bezpieczeństwa informacji,
- Inspektora Ochrony Danych,
- działu prawnego,
- ochrony fizycznej,
- zespołu ciągłości działania.

Nie każdy incydent wymaga zaangażowania wszystkich tych osób.

Pracownik powinien jednak znać jeden prosty i rozpoznawalny punkt kontaktu.

Może to być numer service desku, przycisk zgłoszenia phishingu, formularz incydentu albo dedykowany kanał w komunikatorze.

Najgorszym rozwiązaniem jest sytuacja, w której pracownik wie, że coś się wydarzyło, ale nie wie, komu o tym powiedzieć.

---

## Co powinno znaleźć się w zgłoszeniu

Zgłaszający nie musi od razu przedstawiać kompletnej analizy technicznej.

Powinien przekazać fakty.

Przydatne informacje obejmują:

- kiedy doszło do zdarzenia,
- jaki kanał wykorzystano,
- kto rzekomo się kontaktował,
- co zawierała wiadomość lub rozmowa,
- jaki link został otwarty,
- jaki plik został uruchomiony,
- jakie dane podano,
- czy wykonano płatność,
- czy zainstalowano aplikację,
- czy przekazano kod MFA,
- z jakiego urządzenia korzystano,
- czy urządzenie pozostaje połączone z siecią,
- czy pojawiły się nietypowe zachowania.

Nawet niepełne informacje są lepsze niż brak zgłoszenia.

Szczegóły można uzupełnić później.

---

## Nie należy zacierać śladów

Po wykryciu incydentu użytkownik może próbować posprzątać sytuację.

Może usunąć plik, wiadomość, aplikację albo historię przeglądarki.

Takie działania mogą utrudnić analizę.

Zespół reagowania może potrzebować:

- wiadomości wraz z nagłówkami,
- adresu linku,
- nazwy załącznika,
- historii połączeń,
- logów systemowych,
- działającego urządzenia,
- zawartości pamięci operacyjnej,
- informacji o procesach,
- czasu wykonania działań.

Użytkownik powinien więc ograniczyć dalszą aktywność i postępować zgodnie z instrukcją zespołu technicznego.

Nie powinien samodzielnie usuwać dowodów.

---

## Podejrzenie malware: odłącz sieć, ale nie wyłączaj urządzenia

Jeżeli uruchomiono podejrzany plik, makro, instalator albo aplikację, urządzenie może być zainfekowane.

Jednym z pierwszych działań może być odłączenie go od sieci:

- wyłączenie Wi-Fi,
- odłączenie kabla sieciowego,
- przerwanie połączenia VPN,
- wyłączenie transmisji mobilnej.

Celem jest ograniczenie komunikacji z infrastrukturą napastnika oraz zmniejszenie ryzyka rozprzestrzeniania się zagrożenia.

Nie należy jednak automatycznie wyłączać urządzenia.

Wyłączenie może usunąć informacje znajdujące się w pamięci operacyjnej, które mogą być istotne dla analizy.

O dalszym postępowaniu powinien zdecydować zespół reagowania.

---

## Przejęcie poświadczeń wymaga szerszej reakcji niż zmiana jednego hasła

Jeżeli dane logowania zostały wpisane na fałszywej stronie, należy założyć, że napastnik je posiada.

Zmiana hasła powinna nastąpić z zaufanego urządzenia.

Należy również:

- zakończyć aktywne sesje,
- sprawdzić historię logowań,
- usunąć obce urządzenia,
- zweryfikować ustawienia odzyskiwania,
- przejrzeć reguły skrzynki pocztowej,
- sprawdzić aplikacje z dostępem do konta,
- wymienić kody odzyskiwania,
- zweryfikować zdarzenia MFA.

Jeżeli to samo hasło było używane w innych usługach, również one mogą być zagrożone.

W takim przypadku nie wystarczy zabezpieczyć wyłącznie jednego konta.

---

## Menedżer haseł na przejętym urządzeniu

Jeżeli atakujący uzyskał dostęp do odblokowanego urządzenia lub aktywnej sesji menedżera haseł, należy rozważyć scenariusz kompromitacji całego magazynu.

Znaczenie ma:

- czy sejf był odblokowany,
- czy napastnik miał dostęp do ekranu,
- czy mógł eksportować dane,
- czy zainstalowano malware,
- czy przejęto hasło główne,
- czy aktywna była sesja przeglądarkowa.

W najgorszym scenariuszu trzeba założyć, że wszystkie zapisane dane mogły zostać ujawnione.

Oznacza to konieczność priorytetowej zmiany haseł do najważniejszych usług:

- poczty,
- bankowości,
- systemów służbowych,
- kont administracyjnych,
- usług chmurowych,
- kont umożliwiających odzyskiwanie innych dostępów.

---

## Przekazanie kodu MFA również może oznaczać przejęcie konta

Kod jednorazowy nie jest mniej wrażliwy tylko dlatego, że szybko wygasa.

Jeżeli został przekazany podczas aktywnej próby logowania, napastnik mógł wykorzystać go natychmiast.

Po takim zdarzeniu należy:

- zmienić hasło,
- zakończyć aktywne sesje,
- sprawdzić urządzenia,
- zweryfikować historię logowań,
- przeanalizować operacje wykonane na koncie,
- zgłosić incydent właścicielowi systemu.

Samo wygaśnięcie kodu nie oznacza, że zagrożenie się zakończyło.

---

## Podejrzana wiadomość powinna zostać zablokowana szerzej niż pojedynczy nadawca

Jeżeli atak został przeprowadzony przez e-mail, blokowanie wyłącznie konkretnego adresu może być niewystarczające.

Atakujący może wykorzystać kolejne skrzynki w tej samej domenie albo dodatkowe subdomeny.

Analiza powinna objąć:

- adres nadawcy,
- domenę,
- subdomeny,
- linki,
- domeny przekierowujące,
- adresy IP,
- skrócone URL-e,
- załączniki,
- skróty plików,
- podobne wiadomości u innych odbiorców.

W zależności od wyników można wdrożyć blokady na bramie pocztowej, DNS, proxy, zaporze, EDR albo w systemie ochrony przeglądarki.

---

## Zgłoszenie infrastruktury może ograniczyć kolejne ataki

Podejrzane wiadomości, domeny i strony można przekazywać do odpowiednich zespołów reagowania oraz dostawców usług.

Celem jest:

- zablokowanie domeny,
- usunięcie strony,
- ostrzeżenie innych użytkowników,
- powiązanie kampanii z wcześniejszymi incydentami,
- ograniczenie zasięgu ataku.

Zgłoszenie może objąć:

- CSIRT,
- operatora telekomunikacyjnego,
- dostawcę hostingu,
- rejestratora domeny,
- właściciela przeglądarki,
- instytucję, pod którą podszywał się napastnik.

Jedno zgłoszenie może pomóc ochronić osoby, które otrzymają podobną wiadomość później.

---

## Atak finansowy wymaga natychmiastowego kontaktu z bankiem

Jeżeli przekazano dane karty, wykonano przelew, podano kod płatniczy albo zatwierdzono operację, należy jak najszybciej skontaktować się z bankiem.

Możliwe działania obejmują:

- zablokowanie karty,
- zablokowanie bankowości,
- anulowanie oczekującego przelewu,
- próbę odzyskania środków,
- zabezpieczenie rachunku,
- oznaczenie operacji jako oszustwa,
- sprawdzenie kolejnych transakcji.

Czas ma kluczowe znaczenie.

Nie należy czekać, aż transakcja zostanie ostatecznie rozliczona.

Im szybciej bank otrzyma informację, tym większa szansa na zatrzymanie części działań.

---

## Osoba prywatna również nie powinna działać samotnie

Po ataku na osobę prywatną warto skontaktować się z:

- bankiem,
- instytucją, pod którą podszywał się napastnik,
- operatorem,
- dostawcą usługi,
- policją lub innymi właściwymi organami,
- bliską osobą, która pomoże uporządkować działania.

Pod wpływem stresu łatwo pominąć ważny krok.

Druga osoba może pomóc:

- wykonać telefony,
- zapisać przebieg zdarzenia,
- zmienić hasła,
- zabezpieczyć urządzenie,
- uporządkować dokumenty,
- ograniczyć emocjonalne przeciążenie.

Prośba o pomoc jest elementem reakcji, nie oznaką słabości.

---

## Fizyczna obecność intruza zmienia priorytety

Jeżeli podejrzana osoba nadal znajduje się w biurze, domu albo w bezpośrednim otoczeniu, nie należy samodzielnie jej zatrzymywać ani konfrontować.

Pierwszeństwo ma bezpieczeństwo ludzi.

Należy:

- zachować dystans,
- powiadomić ochronę,
- poinformować przełożonego,
- skontaktować się z odpowiednimi służbami,
- nie blokować drogi wyjścia,
- zapamiętać wygląd i kierunek przemieszczania się,
- zabezpieczyć dostęp do krytycznych stref.

Atakujący może być zdeterminowany i nieprzewidywalny.

Ochrona zasobów nie powinna prowadzić do ryzykowania zdrowiem.

---

## Incydent dotyczący danych osobowych wymaga odrębnej oceny

Nie każde kliknięcie oznacza naruszenie ochrony danych osobowych.

Należy ustalić, czy doszło do naruszenia:

- poufności,
- integralności,
- dostępności danych.

Znaczenie ma między innymi:

- jakie dane były dostępne,
- czy napastnik uzyskał rzeczywisty dostęp,
- ilu osób dotyczy zdarzenie,
- czy dane były szyfrowane,
- czy można je wykorzystać do dalszych nadużyć,
- jak długo trwał dostęp,
- czy doszło do skopiowania lub zmiany informacji.

Jeżeli incydent może dotyczyć danych osobowych, należy niezwłocznie zaangażować Inspektora Ochrony Danych albo inną osobę odpowiedzialną za ten obszar.

To ona, wraz z właściwymi zespołami, powinna uczestniczyć w ocenie ryzyka i obowiązków wynikających z przepisów.

---

## Zgłoszenie nie jest tym samym co potwierdzenie naruszenia

Pracownik zgłasza podejrzenie albo zdarzenie.

Organizacja dopiero później ustala:

- czy rzeczywiście doszło do naruszenia,
- jaki był zakres,
- jakie dane objęto incydentem,
- jakie obowiązki prawne powstają,
- czy potrzebne jest zawiadomienie organu,
- czy należy poinformować osoby, których dane dotyczą.

Pracownik nie powinien wstrzymywać zgłoszenia tylko dlatego, że nie zna odpowiedzi na te pytania.

Brak pewności jest powodem do analizy, nie do milczenia.

---

## Wczesna dokumentacja ułatwia późniejsze decyzje

W trakcie reakcji należy dokumentować:

- czas wykrycia,
- czas zgłoszenia,
- wykonane działania,
- osoby zaangażowane,
- podjęte decyzje,
- zablokowane konta,
- zabezpieczone urządzenia,
- uzyskane dowody,
- komunikację z dostawcami,
- wpływ na systemy i dane.

Dokumentacja pomaga:

- odtworzyć przebieg incydentu,
- spełnić obowiązki prawne,
- ocenić skuteczność reakcji,
- przygotować raport,
- zidentyfikować luki,
- zaplanować działania naprawcze.

Incydent nie powinien być zarządzany wyłącznie przez rozmowy i pamięć uczestników.

---

## Nie należy zakładać jednego punktu błędu

Po incydencie łatwo stworzyć prostą historię:

> Wszystko wydarzyło się dlatego, że pracownik kliknął link.

Taka narracja jest wygodna, ale często nieprawdziwa.

Atak mógł wymagać jednocześnie:

- braku filtrowania wiadomości,
- braku ochrony przed podobnymi domenami,
- niejasnej komunikacji organizacji,
- słabego procesu zgłaszania,
- niewystarczającego MFA,
- nadmiernych uprawnień użytkownika,
- braku monitoringu logowań,
- zbyt wolnej reakcji,
- kultury ukrywania błędów.

Kliknięcie mogło być jednym z etapów.

Nie musi być jedyną przyczyną.

---

## Perspektywa „oka kamery”

Pod wpływem emocji człowiek interpretuje sytuację przez własne obawy, nadzieje i założenia.

Pomocnym ćwiczeniem może być próba opisania zdarzenia jak bezstronny obserwator.

Nie:

> Technik wyglądał na wiarygodnego i chyba naprawdę chciał pomóc.

Tylko:

> Nieznana osoba powiedziała, że pracuje w IT, nie podała numeru zgłoszenia i poprosiła o dostęp do aktywnej sesji.

Nie:

> Wiadomość wyglądała jak prawdziwa.

Tylko:

> SMS zawierał nazwę banku i link prowadzący poza oficjalną aplikację.

Nie:

> Rozmówca był bardzo przekonujący.

Tylko:

> Rozmówca wywołał presję czasu i poprosił o przekazanie kodu autoryzacyjnego.

Taki opis pomaga oddzielić fakty od emocjonalnej interpretacji.

---

## Pytania przerywające automatyczną reakcję

Przed wykonaniem nietypowej czynności warto zadać sobie kilka pytań:

- Czy sam rozpocząłem ten proces?
- Czy spodziewałem się tej osoby lub wiadomości?
- Czy prośba jest zgodna z polityką organizacji?
- Czy istnieje numer zgłoszenia?
- Czy mogę potwierdzić tożsamość innym kanałem?
- Czy rozmówca próbuje wywołać presję?
- Czy podejmuję decyzję z powodu autorytetu, sympatii albo współczucia?
- Jakie będą konsekwencje, jeżeli ta historia jest fałszywa?
- Co przemawia przeciwko wykonaniu tej prośby?
- Czy mogę odłożyć decyzję o kilka minut?

Celem nie jest analizowanie każdej codziennej czynności bez końca.

Chodzi o stworzenie krótkiej przerwy przed działaniem o wysokim wpływie.

---

## Asertywność wymaga wcześniejszego zauważenia nacisku

Samo nauczenie pracowników mówienia „nie” może być niewystarczające.

Najpierw trzeba zauważyć, że ktoś wywiera wpływ.

Nacisk może być subtelny:

- pośpiech,
- uprzejmość,
- autorytet,
- obietnica pomocy,
- poczucie obowiązku,
- strach przed oceną,
- chęć uniknięcia konfliktu.

Pracownik może nie czuć, że jest zmuszany.

Może mieć wrażenie, że samodzielnie podjął logiczną decyzję.

Dlatego szkolenia powinny pokazywać nie tylko gotowe scenariusze ataków, lecz także mechanizmy wpływu.

---

## Zmęczenie i przeciążenie są elementem ryzyka

Podatność na socjotechnikę nie zależy wyłącznie od wiedzy.

Wpływ mogą mieć również:

- brak snu,
- głód,
- odwodnienie,
- stres,
- nadmiar obowiązków,
- presja czasu,
- wielozadaniowość,
- silne emocje.

Osoba dobrze przeszkolona może popełnić błąd, jeżeli działa w niekorzystnych warunkach.

Organizacja powinna więc analizować nie tylko treść szkoleń, ale również środowisko pracy.

Procedura bezpieczeństwa, której nie da się wykonać podczas normalnego dnia, nie jest skuteczną procedurą.

---

## Reakcja organizacji wpływa na przyszłe incydenty

Sposób potraktowania osoby zgłaszającej błąd staje się sygnałem dla całej organizacji.

Jeżeli pracownik zostanie publicznie ośmieszony albo ukarany, inni mogą w przyszłości ukrywać podobne zdarzenia.

Jeżeli zostanie wysłuchany, a zgłoszenie posłuży do poprawy procesu, wzrasta szansa na szybszą reakcję przy kolejnym ataku.

Nie oznacza to rezygnacji z odpowiedzialności.

Oznacza rozróżnienie między:

- celowym łamaniem zasad,
- rażącym zaniedbaniem,
- błędem popełnionym w realistycznym scenariuszu manipulacji.

Kultura bezpieczeństwa powinna zachęcać do mówienia:

> Coś wydaje mi się nie tak.

---

## Bezpieczeństwo nie może istnieć tylko w dokumentach

Organizacja może posiadać rozbudowane polityki, które nie odpowiadają codziennej praktyce.

Przykładowo polityka może zabraniać udostępniania kodów, ale prawdziwy service desk regularnie prosi pracowników o nietypowe działania.

Dokument może wymagać weryfikacji gości, ale pracownicy są krytykowani za opóźnianie spotkań.

Procedura może nakazywać zgłaszanie incydentów, ale formularz jest skomplikowany i trudno go znaleźć.

Taka niespójność uczy pracowników, że zasady są teoretyczne.

Atakujący wykorzystuje rzeczywistą praktykę, nie treść dokumentu.

---

## Każda organizacja może stać się celem

Atakujący może oceniać organizację przez pryzmat:

- wartości danych,
- dostępnych środków,
- poziomu zabezpieczeń,
- otwartości na kontakt zewnętrzny,
- wielkości,
- branży,
- potencjalnej skali wpływu,
- trudności ataku.

Mała organizacja może mieć ograniczony budżet bezpieczeństwa.

Duża może oferować więcej punktów wejścia i większą anonimowość.

Organizacja finansowa może posiadać cenne dane i środki.

Organizacja medyczna może działać pod silną presją dostępności.

Firma technologiczna może posiadać cenny kod i dostęp do klientów.

Nie istnieje organizacja automatycznie zbyt mała albo zbyt nieinteresująca.

---

## Szkolenia powinny budować zachowanie, nie tylko wiedzę

Pracownik może znać definicję phishingu, a mimo to nie wiedzieć, co zrobić po kliknięciu.

Może rozpoznawać smishing, ale nie znać numeru do zgłaszania wiadomości.

Może wiedzieć, że nie powinien podawać hasła, ale ulec osobie podającej się za administratora.

Skuteczne szkolenia powinny obejmować:

- realistyczne scenariusze,
- ćwiczenia decyzyjne,
- praktyczne kanały zgłaszania,
- przykłady prawidłowej odmowy,
- działania po popełnieniu błędu,
- mechanizmy psychologiczne,
- rolę zespołów technicznych,
- reakcję na przejęcie danych.

Najważniejsze pytanie po szkoleniu brzmi:

> Czy uczestnik będzie wiedział, co zrobić w pierwszej minucie?

---

## Analiza po incydencie powinna prowadzić do zmian

Po opanowaniu sytuacji warto przeprowadzić analizę obejmującą:

- sposób wejścia atakującego,
- wykorzystany pretekst,
- działające i nieskuteczne kontrole,
- czas wykrycia,
- czas zgłoszenia,
- czas reakcji,
- dostępne logi,
- zachowanie pracowników,
- komunikację między zespołami,
- wpływ techniczny i biznesowy.

Celem nie jest znalezienie osoby, której można przypisać całą winę.

Celem jest znalezienie miejsc, w których kolejny atak można zatrzymać wcześniej.

---

## Atak socjotechniczny jest często początkiem większego incydentu

Uzyskane przez socjotechnikę dane mogą posłużyć do:

- przejęcia poczty,
- dostępu do VPN,
- kradzieży pieniędzy,
- instalacji malware,
- eskalacji uprawnień,
- ataku na dostawcę,
- przejęcia kolejnych kont,
- kradzieży danych,
- sabotażu,
- ransomware.

Nie należy więc oceniać ataku wyłącznie na podstawie pierwszego działania.

Pozornie niewielkie ujawnienie może otworzyć drogę do znacznie poważniejszej operacji.

Reakcja musi uwzględniać możliwe kolejne etapy.

---

## Procedura reagowania musi istnieć przed incydentem

Kryzys nie jest dobrym momentem na ustalanie:

- kto podejmuje decyzje,
- kto kontaktuje się z bankiem,
- kto zabezpiecza urządzenie,
- kto ocenia naruszenie danych,
- kto informuje zarząd,
- kto kontaktuje się z organami,
- kto komunikuje się z pracownikami,
- kto dokumentuje zdarzenie.

Role powinny zostać ustalone wcześniej.

Organizacja potrzebuje:

- zespołu reagowania,
- listy kontaktów,
- scenariuszy działania,
- zasad eskalacji,
- procedur technicznych,
- procesu komunikacji,
- ćwiczeń.

Dobra procedura ogranicza chaos i pozwala skupić się na faktach.

---

## Model reakcji po ataku socjotechnicznym

### Zatrzymaj

Przerwij rozmowę, płatność, sesję albo dalsze wykonywanie poleceń.

### Odizoluj

Odłącz podejrzane urządzenie od sieci, ale nie wyłączaj go bez instrukcji.

### Zgłoś

Powiadom IT, bezpieczeństwo, przełożonego i inne wskazane osoby.

### Zabezpiecz dostęp

Zmień hasła, zakończ sesje, zablokuj konta i unieważnij kody.

### Zachowaj dowody

Nie usuwaj wiadomości, plików, logów ani aplikacji bez uzgodnienia.

### Oceń wpływ

Ustal, jakie konta, dane, urządzenia i procesy mogły zostać naruszone.

### Ogranicz dalszy atak

Zablokuj domeny, adresy, numery, pliki i infrastrukturę.

### Udokumentuj

Zapisz czasy, działania, decyzje i ustalenia.

### Wyciągnij wnioski

Popraw procesy, kontrole i szkolenia.

---

## Checklista dla zaatakowanej osoby

- [ ] Przerwij kontakt z napastnikiem.
- [ ] Nie próbuj samodzielnie zacierać śladów.
- [ ] Zgłoś zdarzenie natychmiast.
- [ ] Opisz dokładnie wykonane czynności.
- [ ] Odłącz urządzenie od sieci, jeżeli uruchomiono podejrzany plik.
- [ ] Nie wyłączaj urządzenia bez instrukcji.
- [ ] Zmień hasła z zaufanego urządzenia.
- [ ] Zakończ aktywne sesje.
- [ ] Skontaktuj się z bankiem, jeżeli zagrożone są środki.
- [ ] Zachowaj wiadomości, numery, linki i pliki.
- [ ] Nie konfrontuj fizycznie podejrzanej osoby.
- [ ] Poproś o pomoc, jeżeli stres utrudnia działanie.

---

## Checklista organizacji po zgłoszeniu

- [ ] Potwierdź przyjęcie zgłoszenia.
- [ ] Ustal czas i zakres zdarzenia.
- [ ] Zabezpiecz urządzenia i konta.
- [ ] Zachowaj materiał dowodowy.
- [ ] Zweryfikuj logowania i sesje.
- [ ] Sprawdź, czy podobne wiadomości trafiły do innych osób.
- [ ] Zablokuj infrastrukturę atakującego.
- [ ] Oceń wpływ na dane osobowe.
- [ ] Zaangażuj właściwe role prawne i biznesowe.
- [ ] Skontaktuj się z bankiem, dostawcami lub organami, gdy jest to potrzebne.
- [ ] Dokumentuj decyzje i czasy reakcji.
- [ ] Przekaż pracownikom niezbędne ostrzeżenie.
- [ ] Przeprowadź analizę przyczyn i kontroli.
- [ ] Zaplanuj działania naprawcze.
- [ ] Nie stygmatyzuj osoby zgłaszającej.

---

## Typowe błędy zaatakowanej osoby

### Ukrywanie zdarzenia

Napastnik otrzymuje więcej czasu.

### Samodzielne usuwanie plików i aplikacji

Materiał potrzebny do analizy zostaje utracony.

### Wyłączenie zainfekowanego urządzenia

Dane z pamięci operacyjnej mogą zniknąć.

### Zmiana hasła na przejętym komputerze

Nowe dane również mogą zostać przechwycone.

### Czekanie na widoczne skutki

Reakcja rozpoczyna się dopiero po utracie pieniędzy lub danych.

### Kontaktowanie się z napastnikiem

Osoba ponownie wchodzi pod wpływ jego narracji.

### Fizyczna konfrontacja

Bezpieczeństwo człowieka zostaje podporządkowane ochronie zasobów.

---

## Typowe błędy organizacji

### Karanie za szybkie zgłoszenie

Pracownicy zaczynają ukrywać incydenty.

### Brak jednego kanału kontaktu

Zgłoszenie krąży między działami.

### Skupienie wyłącznie na pracowniku

Pomijane są słabe kontrole techniczne i procesowe.

### Brak dokumentacji

Nie można odtworzyć przebiegu i uzasadnić decyzji.

### Brak gotowych scenariuszy

Pierwsze godziny są tracone na ustalanie odpowiedzialności.

### Zbyt późne zaangażowanie IOD lub działu prawnego

Ocena obowiązków rozpoczyna się po utracie ważnego czasu.

### Zbyt wąska blokada

Blokowany jest jeden adres, ale nie cała infrastruktura kampanii.

### Brak komunikacji do innych pracowników

Ten sam atak może odnieść kolejne sukcesy.

---

## Jedno zdanie, które zostawiam

**Po skutecznym ataku największym błędem nie zawsze jest to, że ktoś dał się oszukać, lecz to, że organizacja stworzyła warunki, w których bał się o tym natychmiast powiedzieć.**
