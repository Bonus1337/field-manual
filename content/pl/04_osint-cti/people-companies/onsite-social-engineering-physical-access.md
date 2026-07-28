---
id: onsite-social-engineering-physical-access
title: "ataki on-site - kiedy bezpieczeństwo cyfrowe zaczyna się przy drzwiach"
team: red-blue
domain: social-engineering
section: physical-security
type: methodology
angle: onsite-recon-pretext-physical-access-human-trust-defense
sourceTrack: social-engineering-sekurak
tags:
  [
    "social-engineering",
    "physical-security",
    "onsite",
    "tailgating",
    "pretexting",
    "access-control",
    "osint",
  ]
difficulty: medium
shortDescription: "Praktyczne spojrzenie na testy socjotechniczne prowadzone bezpośrednio w siedzibie organizacji. Notatka pokazuje, jak rekonesans, wygląd, rutyna pracowników i słabe procedury kontroli dostępu mogą połączyć się w pełną ścieżkę ataku."
updatedAt: "2026-07-28"
---

# Ataki on-site - kiedy bezpieczeństwo cyfrowe zaczyna się przy drzwiach

Atak on-site nie zaczyna się przy komputerze.

Zaczyna się znacznie wcześniej: na parkingu, przy bramie wjazdowej, w recepcji, przy windzie albo w chwili, gdy pracownik automatycznie przytrzymuje drzwi osobie idącej tuż za nim.

W takich testach granica między bezpieczeństwem fizycznym, socjotechniką i bezpieczeństwem IT praktycznie przestaje istnieć.

Osoba, która dostanie się do części biurowej, może znaleźć się w bezpośrednim zasięgu:

- aktywnych stanowisk komputerowych,
- wewnętrznych portów sieciowych,
- dokumentów pozostawionych na biurkach,
- identyfikatorów i kart dostępowych,
- urządzeń mobilnych,
- sal konferencyjnych,
- pomieszczeń technicznych,
- rozmów prowadzonych przez pracowników.

Nie musi jeszcze niczego technicznie przełamywać.

Najpierw wystarczy, że zostanie uznana za osobę, która ma prawo tam być.

---

## Zasada przewodnia: nie trzeba wyglądać znajomo, wystarczy wyglądać normalnie

Pracownicy dużej organizacji nie znają wszystkich osób zatrudnionych w innych działach, oddziałach ani firmach zewnętrznych.

Atakujący nie musi więc przekonać wszystkich, że jest konkretnym pracownikiem.

Wystarczy, że jego obecność pasuje do miejsca i sytuacji.

Osoba z futerałem na projektor w pobliżu sal konferencyjnych nie wygląda podejrzanie.

Ktoś w ubraniu roboczym przy strefie remontowanej może zostać automatycznie uznany za wykonawcę.

Człowiek z laptopem, przewodem sieciowym i identyfikatorem zawieszonym na szyi może zostać potraktowany jak pracownik wsparcia technicznego.

Najsilniejszą przykrywką nie zawsze jest idealnie podrobiona tożsamość.

Czasami jest nią zwyczajność.

---

## Atak on-site jest łańcuchem drobnych decyzji

Uzyskanie dostępu do obiektu rzadko zależy od jednego spektakularnego błędu.

Znacznie częściej atak rozwija się przez serię pozornie nieistotnych sytuacji.

Ochrona przyjmuje wyjaśnienie dotyczące niespodziewanej wizyty.

Pracownik otwiera drzwi osobie, która wygląda na zagubioną.

Recepcja wydaje przepustkę bez niezależnego potwierdzenia spotkania.

Gość pozostaje bez opiekuna.

Kolejna osoba udostępnia mu stanowisko komputerowe, ponieważ zakłada, że wcześniejsze warstwy organizacji już go zweryfikowały.

Każdy z tych momentów może wydawać się drobnym odstępstwem.

Dopiero ich połączenie pokazuje pełną ścieżkę ataku:

**teren organizacji → budynek → przestrzeń biurowa → stanowisko pracy → dostęp do zasobów**

Dlatego test on-site powinien badać nie tylko to, czy można wejść do środka.

Powinien sprawdzać, ile kolejnych kontroli zawiedzie po pierwszym błędzie.

---

## Rekonesans obiektu: zanim wejdziesz, zrozum środowisko

Przygotowanie scenariusza zaczyna się od odpowiedzi na proste pytanie:

> Jak wygląda normalny dzień w tym miejscu?

Nie chodzi wyłącznie o znalezienie adresu firmy.

Trzeba zrozumieć:

- którędy wchodzą pracownicy,
- jak wygląda obsługa gości,
- kiedy występuje największy ruch,
- czy pracownicy korzystają z różnych wejść,
- jakie firmy zewnętrzne regularnie pojawiają się w obiekcie,
- gdzie znajdują się strefy wspólne,
- w jaki sposób oznaczone są osoby z zewnątrz,
- czy goście poruszają się z opiekunem,
- jak wyglądają granice między przestrzenią publiczną i chronioną.

Dobra obserwacja powinna pokazać nie tylko zabezpieczenia, ale też momenty, w których ludzie przestają zwracać na nie uwagę.

Przykładem może być pora rozpoczęcia dużego spotkania, wymiana zmian, przerwa obiadowa, dostawa wyposażenia albo trwające prace remontowe.

W takich momentach ruch osób staje się intensywniejszy, a pojedynczy nieznajomy łatwiej znika w tle.

---

## OSINT jako przygotowanie do wejścia fizycznego

Publiczne informacje o organizacji mogą bezpośrednio wpłynąć na wiarygodność scenariusza on-site.

Oferty pracy ujawniają nazwy zespołów i używane technologie.

Komunikaty prasowe pokazują aktualne inwestycje i projekty.

Wpisy dostawców mogą zdradzić, kto obsługuje monitoring, drukarki, sieć, wyposażenie biurowe lub infrastrukturę techniczną.

Profile pracowników pomagają zrozumieć strukturę organizacyjną i znaleźć osoby odpowiedzialne za konkretne obszary.

Zdjęcia z firmowych wydarzeń mogą pokazać dress code, identyfikatory, układ biura albo sposób oznaczania gości.

Takie informacje nie muszą być tajne.

Ich wartość pojawia się po połączeniu.

Atakujący nie potrzebuje kompletnej wiedzy o organizacji. Potrzebuje wystarczającej liczby prawdziwych elementów, aby jego historia zabrzmiała naturalnie.

---

## Obserwuj rytm, nie tylko zabezpieczenia

Czytnik kart nie działa w próżni.

Jego skuteczność zależy od sposobu, w jaki ludzie zachowują się wokół niego.

Podczas rekonesansu warto zwrócić uwagę, czy pracownicy:

- otwierają drzwi innym osobom,
- wchodzą większymi grupami,
- reagują na osoby bez widocznego identyfikatora,
- odkładają karty na smyczach w łatwo widocznym miejscu,
- prowadzą gości do recepcji,
- pozostawiają wejścia techniczne otwarte,
- blokują drzwi podczas dostaw,
- korzystają z tych samych przejść co wykonawcy.

Formalnie organizacja może posiadać kontrolę dostępu.

W praktyce jej działanie może opierać się na założeniu, że każdy człowiek będzie zachowywał się dokładnie zgodnie z procedurą.

To bardzo kruche zabezpieczenie.

---

## Pretekst musi pasować do konkretnej warstwy obiektu

Ta sama rola nie musi być równie skuteczna w całym budynku.

Przy bramie wjazdowej wiarygodna może być osoba związana z dostawą, serwisem lub pracami technicznymi.

W recepcji ważniejsze stanie się nazwisko pracownika odpowiedzialnego za wizytę, cel spotkania i firma zewnętrzna.

W części biurowej lepiej sprawdzi się rola osoby realizującej zadanie razem z konkretnym zespołem.

Pretekst powinien więc rozwijać się wraz z przemieszczaniem się po obiekcie.

Nie oznacza to wymyślania kilku całkowicie odrębnych historii.

Rdzeń powinien pozostawać ten sam, ale sposób jego przedstawienia musi odpowiadać rozmówcy.

Pracownik ochrony będzie zainteresowany prawem do wejścia.

Recepcja będzie chciała wiedzieć, kto odpowiada za wizytę.

Pracownik biurowy może pytać, czego dokładnie dotyczy wykonywana czynność.

Dobry scenariusz uwzględnia te różnice.

---

## Wejście na teren nie oznacza jeszcze wejścia do organizacji

Wiele obiektów składa się z kilku oddzielnych warstw:

**granica posesji → budynek → recepcja → piętro → strefa biurowa → pomieszczenie chronione**

Każda z nich może mieć innego właściciela, innego administratora i odrębny system kontroli.

To szczególnie ważne w biurowcach współdzielonych przez wiele podmiotów.

Zgoda jednej organizacji na przeprowadzenie testu nie musi obejmować:

- parkingu zarządzanego przez właściciela budynku,
- systemu wind,
- recepcji głównej,
- wspólnych korytarzy,
- systemu kontroli dostępu należącego do administratora obiektu,
- pomieszczeń innych najemców.

Zakres testu powinien dokładnie wskazywać, które warstwy można sprawdzać i kto jest uprawniony do wyrażenia na to zgody.

Nie można zakładać, że techniczna możliwość dotarcia do określonego miejsca oznacza prawo do testowania jego zabezpieczeń.

---

## Pierwsza warstwa: kontrola wejścia

Brama, recepcja lub punkt ochrony powinny zatrzymać osobę, która nie potrafi potwierdzić celu wizyty.

W praktyce często pojawia się jednak konflikt między bezpieczeństwem a płynnością działania.

Ochrona nie chce tworzyć kolejek.

Recepcja nie chce przeszkadzać ważnemu gościowi.

Pracownik nie chce odpowiadać za opóźnienie serwisu.

Atakujący może wykorzystać tę presję, przedstawiając sytuację jako rutynową, pilną albo wcześniej uzgodnioną.

Najważniejszym zabezpieczeniem nie jest zadanie dużej liczby pytań.

Jest nim niezależne potwierdzenie:

- czy wizyta została zaplanowana,
- kto odpowiada za gościa,
- jaki jest cel wejścia,
- do których stref ma zostać dopuszczony,
- kto będzie mu towarzyszył.

Jeżeli nie można znaleźć osoby odpowiedzialnej za wizytę, odpowiedzią nie powinno być automatyczne wydanie przepustki.

Brak potwierdzenia jest wynikiem weryfikacji.

---

## Przepustka gościa nie może być przepustką do samodzielności

Samo zarejestrowanie osoby w recepcji nie rozwiązuje problemu.

Gość może posiadać prawidłowo wydaną kartę, a mimo to:

- wejść do niewłaściwej strefy,
- pozostać bez nadzoru,
- wykorzystać otwarte przejście,
- dołączyć do grupy pracowników,
- uzyskać dostęp do aktywnego stanowiska,
- obserwować wewnętrzne procesy.

Identyfikator gościa powinien określać status osoby, a nie automatycznie rozszerzać jej uprawnienia.

Kluczowa jest odpowiedzialność konkretnego opiekuna.

To on powinien odebrać gościa, towarzyszyć mu i dopilnować, aby opuścił obiekt po zakończeniu wizyty.

---

## Tailgating: uprzejmość jako obejście czytnika

Tailgating wykorzystuje prosty konflikt społeczny.

Pracownik wie, że każdy powinien użyć własnej karty, ale jednocześnie nie chce zamknąć drzwi przed osobą idącą tuż za nim.

Jeżeli nieznajomy wygląda wiarygodnie, niesie sprzęt lub prowadzi rozmowę, przytrzymanie drzwi wydaje się naturalne.

Kontrola techniczna działa poprawnie.

Nie rejestruje jednak osoby, która przeszła razem z uprawnionym pracownikiem.

Problem staje się jeszcze większy, gdy system kontroli dostępu pełni również funkcję ewidencji wejść i wyjść. W logach widoczny jest wtedy wyłącznie prawowity właściciel karty.

Bezpieczna reakcja nie musi być agresywna:

> Każdy musi użyć własnej karty. Mogę pomóc skontaktować się z recepcją.

Pracownik nie powinien samodzielnie prowadzić śledztwa ani konfrontować podejrzanej osoby.

Powinien natomiast wiedzieć, jak zatrzymać przekazanie dostępu.

---

## Karta i smycz nie są dowodem tożsamości

Identyfikator wizualny działa głównie dlatego, że ludzie nie przyglądają mu się dokładnie.

Widzą charakterystyczny kształt, kolor smyczy i kartę zawieszoną na szyi. Mózg uzupełnia resztę:

> To pracownik.

Karta może być:

- nieważna,
- należeć do innej organizacji,
- być przepustką gościa,
- pustym nośnikiem,
- starym identyfikatorem,
- elementem przygotowanej stylizacji.

Z perspektywy pracownika sam fakt posiadania karty nie powinien kończyć procesu oceny.

Znaczenie ma to, czy osoba:

- pasuje do strefy,
- jest rozpoznawana,
- posiada właściwy typ identyfikatora,
- porusza się zgodnie z obowiązującymi zasadami,
- potrafi wskazać opiekuna lub cel obecności.

Wygląd buduje wiarygodność.

Nie tworzy uprawnienia.

---

## Alternatywne wejścia pokazują prawdziwą jakość ochrony

Organizacje często koncentrują zabezpieczenia na wejściu głównym.

Tymczasem obiekt może posiadać:

- wejścia dla dostawców,
- rampy załadunkowe,
- drzwi techniczne,
- przejścia z parkingu,
- połączenia z częścią magazynową,
- wyjścia ewakuacyjne,
- strefy wspólne,
- przejścia używane podczas remontów.

Każde z tych miejsc może funkcjonować według innych zasad.

Drzwi wyposażone w czytnik nie zapewniają bezpieczeństwa, jeśli są regularnie podpierane podczas dostaw.

Monitoring nie chroni obiektu, jeżeli nikt nie obserwuje obrazu w czasie rzeczywistym.

Ogrodzenie nie zatrzyma intruza, jeżeli pozostawiono niekontrolowane przejście między strefami.

Podczas testu należy patrzeć na obiekt jako na całość.

Atakujący wybiera drogę o najmniejszym oporze, nie tę przewidzianą przez projektanta procedury.

---

## „Klamkowanie” jako test podstawowej higieny fizycznej

Jedna z najprostszych metod oceny zabezpieczeń nie wymaga zaawansowanych narzędzi.

Polega na sprawdzaniu, czy drzwi, które powinny pozostawać zamknięte, rzeczywiście takie są.

Nie chodzi tylko o awarię zamka.

Drzwi mogą być:

- niedomknięte,
- zablokowane przedmiotem,
- pozostawione otwarte podczas prac,
- wyposażone w uszkodzony samozamykacz,
- regularnie otwierane dla wygody pracowników.

To fizyczny odpowiednik sprawdzania domyślnych haseł.

Kontrola istnieje, ale została osłabiona codziennym zachowaniem.

Dobre zabezpieczenie powinno wracać do stanu bezpiecznego automatycznie. Nie może zależeć wyłącznie od tego, czy ostatnia osoba pamiętała o prawidłowym zamknięciu drzwi.

---

## Poruszanie się po biurze: zachowuj się jak osoba, która ma cel

Po wejściu do przestrzeni biurowej największym zagrożeniem dla testera nie zawsze jest techniczne zabezpieczenie.

Często jest nim pytanie:

> Mogę w czymś pomóc?

Osoba poruszająca się bez celu, rozglądająca się po tablicach i sprawdzająca kolejne drzwi szybko zaczyna się wyróżniać.

Wiarygodna obecność powinna mieć kierunek.

Atakujący może wyglądać, jakby:

- szukał konkretnego pomieszczenia,
- wykonywał zadanie techniczne,
- czekał na pracownika,
- wracał ze spotkania,
- przenosił wyposażenie,
- przygotowywał przestrzeń do wydarzenia.

Najważniejsze nie jest szybkie przemieszczanie się.

Najważniejsze jest sprawianie wrażenia, że dokładnie wiadomo, dokąd się zmierza.

---

## Zmiana roli zwiększa ryzyko niespójności

W rozbudowanych scenariuszach może pojawić się potrzeba zmiany wyglądu lub sposobu działania po przejściu do kolejnej strefy.

Osoba, która wcześniej występowała jako zewnętrzny wykonawca, może próbować wyglądać później jak pracownik biurowy.

Taka zmiana zwiększa jednak liczbę elementów, które mogą ujawnić niespójność:

- strój niepasujący do nowej roli,
- niewłaściwy identyfikator,
- sprzęt pozostający z poprzedniego scenariusza,
- brak wiedzy o wewnętrznych procesach,
- sprzeczne wyjaśnienia udzielane różnym osobom.

Im więcej ról, tym większa powierzchnia błędu.

Dlatego dobra metodologia preferuje najprostszy scenariusz, który pozwala sprawdzić daną kontrolę.

---

## Small talk nie jest pustą rozmową

Krótka rozmowa o codziennych problemach może szybko zbudować poczucie znajomości.

Atakujący nie musi od razu prosić o dostęp.

Może zacząć od neutralnego komentarza dotyczącego:

- opóźnionych wind,
- problemów ze sprzętem,
- zmiany organizacji biura,
- natężenia pracy,
- działania systemów,
- wydarzenia firmowego.

Jeżeli rozmówcy znajdą wspólny temat, nieznajomy zaczyna być traktowany bardziej jak członek tej samej grupy.

Szczególnie skuteczne bywa wspólne narzekanie.

Problem z aplikacją, drukarką, klimatyzacją albo nową procedurą tworzy szybkie poczucie sojuszu:

> On rozumie mój problem, więc prawdopodobnie jest stąd.

Small talk nie daje formalnego dostępu.

Może jednak sprawić, że późniejsza prośba przestanie być oceniana jak prośba obcej osoby.

---

## Dostęp do stanowiska pracy: moment połączenia świata fizycznego i cyfrowego

Najważniejszy moment ataku on-site może nastąpić wtedy, gdy pracownik odstępuje intruzowi zalogowane stanowisko.

W tym miejscu wcześniejsze warstwy zaczynają się łączyć:

- osoba weszła do budynku,
- dotarła do właściwej części biura,
- wzbudziła zaufanie,
- przedstawiła wiarygodny problem,
- została uznana za pracownika technicznego,
- otrzymała bezpośredni dostęp do systemu.

Atakujący nie musi znać hasła.

Nie musi przełamywać MFA.

Nie musi wykorzystywać podatności sieciowej.

Korzysta z aktywnej sesji prawowitego użytkownika.

Dlatego pracownik nie powinien przekazywać stanowiska osobie, której tożsamości nie potrafi samodzielnie zweryfikować.

Nawet prawdziwy pracownik IT powinien działać zgodnie z ustalonym procesem wsparcia.

---

## „Mój komputer źle działa” jako naturalny punkt wejścia

Problemy techniczne są dobrym początkiem interakcji, ponieważ prawie każdy użytkownik ma coś, na co może narzekać.

Wolne działanie systemu, niedostępna drukarka, problem z synchronizacją albo niestabilne połączenie brzmią całkowicie zwyczajnie.

Atakujący może wykorzystać tę frustrację, oferując natychmiastową pomoc.

Pracownik nie analizuje wtedy przede wszystkim tożsamości rozmówcy.

Myśli o rozwiązaniu własnego problemu.

Im bardziej pomocna i kompetentna wydaje się osoba, tym łatwiej może uzyskać:

- dostęp do ekranu,
- aktywną sesję,
- możliwość podłączenia urządzenia,
- informacje o środowisku,
- dane dotyczące używanych systemów.

Bezpieczny proces wsparcia powinien być przewidywalny.

Pracownik powinien wiedzieć, w jaki sposób dział IT zapowiada wizyty, jak identyfikuje techników i jakie czynności mogą oni wykonywać.

---

## Minimalny dowód jest lepszy niż maksymalny dostęp

W teście socjotechnicznym łatwo ulec pokusie dalszego rozwijania scenariusza.

Jeżeli tester dostał dostęp do zalogowanego komputera, może teoretycznie spróbować:

- uruchomić dodatkowe narzędzia,
- przeglądać zasoby,
- uzyskać trwały dostęp,
- połączyć się z innymi systemami,
- zebrać rzeczywiste dane.

Nie każda z tych czynności jest jednak potrzebna do udowodnienia problemu.

Jeżeli celem było sprawdzenie, czy niezweryfikowana osoba może otrzymać dostęp do stanowiska, wystarczającym dowodem może być:

- zanotowanie nazwy urządzenia,
- wykonanie uzgodnionego polecenia identyfikacyjnego,
- utworzenie kontrolowanego pliku,
- zdjęcie ekranu bez danych wrażliwych,
- potwierdzenie dostępu do uzgodnionego zasobu testowego.

Najlepszy Proof of Concept pokazuje realny wpływ i jednocześnie ogranicza ryzyko.

Test nie powinien zamieniać się w incydent tylko dlatego, że pojawiła się techniczna możliwość wykonania kolejnego kroku.

---

## Nieznane urządzenia: zaufanie do przedmiotu zamiast człowieka

Atak on-site nie zawsze wymaga osobistego wejścia do budynku.

Czasami organizacja sama wnosi zagrożenie do środka.

Nieznany nośnik, kabel, klawiatura, ładowarka albo gadżet może wyglądać jak zwykłe wyposażenie. Po podłączeniu może jednak zachowywać się inaczej, niż oczekuje użytkownik.

Szczególnie ryzykowne są urządzenia przedstawiające się systemowi jako klawiatura. Komputer traktuje je wtedy jak standardowe urządzenie wejściowe, a nie jak plik wymagający otwarcia.

Najważniejsza lekcja nie dotyczy konkretnego modelu sprzętu.

Dotyczy zaufania do fizycznego przedmiotu.

Jeżeli urządzenie:

- pojawiło się bez zamówienia,
- nie posiada potwierdzonego źródła,
- zostało znalezione,
- dostarczono je poza standardowym procesem,
- wygląda na materiał promocyjny,
- nie zostało sprawdzone przez odpowiedzialny zespół,

nie powinno być podłączane do infrastruktury organizacji.

Dotyczy to również działu IT.

Wysokie uprawnienia nie zmniejszają ryzyka. Zwiększają potencjalny wpływ błędu.

---

## Bezpieczeństwo kart dostępowych nie kończy się na częstotliwości RFID

Karta dostępowa często jest traktowana jak fizyczny odpowiednik hasła.

Problem polega na tym, że nie wszystkie technologie kart zapewniają ten sam poziom ochrony.

Starsze lub proste identyfikatory mogą przekazywać stały numer, który system interpretuje jako tożsamość użytkownika. Jeżeli mechanizm nie wykorzystuje odpowiedniego uwierzytelnienia kryptograficznego, samo posiadanie identyfikatora może nie wystarczać do uznania go za bezpieczny.

Ryzyko zwiększa sposób noszenia kart.

Pracownicy często eksponują je:

- na zewnętrznej stronie ubrania,
- przy pasku,
- na torbie,
- razem z kluczami,
- na smyczy podczas pobytu w przestrzeni publicznej.

Organizacja powinna ocenić:

- jakiego typu karty wykorzystuje,
- czy możliwe jest łatwe kopiowanie identyfikatorów,
- czy system wykrywa nietypowe użycia,
- czy jedna karta otwiera zbyt wiele stref,
- czy dostęp jest regularnie przeglądany,
- czy utrata karty prowadzi do szybkiego unieważnienia,
- czy krytyczne strefy wymagają dodatkowej kontroli.

Karta powinna być jednym z elementów kontroli, a nie jedynym dowodem tożsamości.

---

## Narzędzia radiowe są tylko częścią problemu

Urządzenia przeznaczone do analizy RFID, NFC, sygnałów radiowych i systemów bezprzewodowych mogą być użyteczne podczas autoryzowanych testów.

Samo narzędzie nie przesądza jednak o powodzeniu ataku.

Najważniejsze pytania brzmią:

- czy technologia karty pozwala na bezpieczne uwierzytelnienie,
- czy system kontroli dostępu jest prawidłowo skonfigurowany,
- czy pracownicy chronią swoje identyfikatory,
- czy nietypowa aktywność jest monitorowana,
- czy organizacja stosuje dodatkowe kontrole w krytycznych strefach.

Skupienie się wyłącznie na konkretnym gadżecie prowadzi do błędnego poczucia bezpieczeństwa.

Jeżeli jeden model urządzenia zostanie zablokowany, słaby proces nadal pozostanie słaby.

---

## Wyjście z obiektu również należy do scenariusza

Tester musi nie tylko wejść, ale również bezpiecznie zakończyć działanie.

Wyjście często jest łatwiejsze, ponieważ organizacje koncentrują się na kontrolowaniu osób wchodzących.

Drzwi od środka mogą nie wymagać karty, a pracownicy rzadko kwestionują osobę opuszczającą budynek.

Nie oznacza to jednak, że etap można pominąć podczas planowania.

Należy ustalić:

- czy karta gościa musi zostać zwrócona,
- czy wyjście jest rejestrowane,
- czy tester powinien zostać odebrany przez koordynatora,
- jak usunąć kontrolowane artefakty,
- co zrobić w przypadku interwencji ochrony,
- jak potwierdzić zakończenie działań.

Pozostawiona karta, nośnik, dokument, element stroju albo urządzenie może później wywołać rzeczywisty incydent.

Dobra zasada:

> Test kończy się dopiero wtedy, gdy organizacja została przywrócona do uzgodnionego stanu.

---

## Zostawianie artefaktów musi być kontrolowane

Nośniki lub urządzenia-wabiki bywają wykorzystywane do sprawdzenia reakcji pracowników.

Takie testy powinny być jednak bardzo dokładnie przygotowane.

Każdy artefakt musi być:

- jednoznacznie przypisany do kampanii,
- bezpieczny technicznie,
- możliwy do odnalezienia,
- monitorowany,
- objęty planem usunięcia,
- ograniczony do uzgodnionego działania.

Nie należy pozostawiać elementów, których organizacja nie potrafi później rozliczyć.

Jeżeli tester rozłoży dziesięć nośników, musi wiedzieć, co stało się z każdym z nich.

Brak jednego urządzenia po zakończeniu testu jest realnym problemem bezpieczeństwa.

---

## Człowiek nie wykrywa kłamstwa tak dobrze, jak mu się wydaje

Ludzie często wierzą, że potrafią rozpoznać oszustwo po zachowaniu rozmówcy.

Szukają unikania wzroku, nerwowych ruchów, drżenia głosu albo niespójności.

Problem polega na tym, że stres nie jest dowodem kłamstwa, a spokój nie jest dowodem prawdy.

Prawdziwy pracownik może zachowywać się nerwowo.

Dobrze przygotowany atakujący może wyglądać całkowicie naturalnie.

Dlatego bezpieczeństwo nie powinno opierać się na intuicyjnym ocenianiu ludzi.

Znacznie skuteczniejsze są sprawdzalne fakty:

- potwierdzone zgłoszenie,
- znany opiekun,
- właściwy identyfikator,
- zgodność z procesem,
- niezależny kontakt,
- właściwy poziom dostępu.

Intuicja może uruchomić weryfikację.

Nie powinna jej zastępować.

---

## Reakcja stresowa działa po obu stronach interakcji

Spotkanie nieznanej osoby w chronionej strefie może wywołać napięcie również u pracownika.

Może on:

- zignorować sytuację,
- nie wiedzieć, co powiedzieć,
- obawiać się konfliktu,
- założyć, że ktoś inny już zareagował,
- zamrozić się i nie podjąć żadnego działania.

Właśnie dlatego procedura nie powinna wymagać od pracownika samodzielnej konfrontacji.

Jego zadaniem może być jedynie:

- zachowanie bezpiecznego dystansu,
- nieudzielanie dostępu,
- zapamiętanie podstawowych cech sytuacji,
- skontaktowanie się z ochroną,
- przekazanie lokalizacji podejrzanej osoby.

Organizacja musi jasno pokazać, że zgłoszenie osoby bez identyfikatora jest prawidłowym zachowaniem, nawet jeżeli okaże się ona prawowitym pracownikiem.

Lepiej wyjaśnić nieporozumienie niż zignorować rzeczywistego intruza.

---

## Monitoring pasywny nie zatrzymuje ataku

Kamery często pełnią funkcję archiwalną.

Materiał zostaje zapisany, ale nikt nie analizuje go w czasie rzeczywistym.

Taki monitoring może pomóc po incydencie, lecz nie powstrzyma osoby, która właśnie porusza się po biurze.

Skuteczny nadzór powinien uwzględniać:

- odpowiedzialność operatora,
- obserwację krytycznych przejść,
- zasady reagowania na osobę bez identyfikatora,
- integrację z kontrolą dostępu,
- alerty dotyczące niedomkniętych drzwi,
- procedurę przekazania informacji ochronie,
- regularne testy czasu reakcji.

Zaawansowana analityka obrazu może wspierać ochronę, ale nie naprawi braku procesu.

System może wykryć nietypową obecność.

Ktoś nadal musi wiedzieć, co zrobić z tym sygnałem.

---

## Dobra obrona nie wymaga nieuprzejmości

Jednym z największych problemów fizycznego bezpieczeństwa jest przekonanie, że przestrzeganie procedury oznacza brak kultury.

Pracownik może obawiać się, że:

- zamknie drzwi przed nowym kolegą,
- urazi ważnego gościa,
- utrudni pracę serwisowi,
- przesadzi z reakcją,
- zostanie uznany za konfliktowego.

Organizacja powinna usunąć ten konflikt.

Można być pomocnym bez przekazywania dostępu:

> Nie mogę otworzyć tych drzwi swoją kartą, ale wskażę recepcję.

> Nie rozpoznaję Pana, więc skontaktuję się z działem IT i potwierdzę wizytę.

> Nie mogę udostępnić stanowiska bez zgłoszenia. Pomogę je utworzyć.

To nie jest oskarżenie.

To prawidłowe wykonanie procesu.

---

## Model obronny dla pracownika

W przypadku spotkania nieznanej osoby w chronionej przestrzeni warto wykonać krótką ocenę.

### Czy ta osoba powinna znajdować się w tej strefie?

Identyfikator gościa w obszarze technicznym może być sygnałem wymagającym sprawdzenia.

### Czy porusza się z opiekunem?

Gość pozostawiony bez nadzoru nie powinien samodzielnie szukać kolejnych pomieszczeń.

### Czy prosi mnie o użycie moich uprawnień?

Może chodzić o otwarcie drzwi, użycie karty, udostępnienie komputera lub podłączenie urządzenia.

### Czy mogę zweryfikować sytuację bez kontaktu podanego przez tę osobę?

Należy użyć wewnętrznego katalogu, service desku, recepcji lub ochrony.

### Czy czuję presję, by zignorować procedurę?

Pośpiech i powoływanie się na ważną osobę zwiększają potrzebę sprawdzenia.

Pracownik nie musi udowodnić, że trwa atak.

Musi jedynie rozpoznać sytuację, której nie powinien sam autoryzować.

---

## Raport powinien odtwarzać ścieżkę ataku

Raport z testu on-site nie powinien być zbiorem efektownych zdjęć i anegdot.

Powinien pokazywać, jak kolejne słabości umożliwiły osiągnięcie celu.

Dobra narracja raportowa odpowiada na pytania:

- jakie informacje uzyskano przed testem,
- co zaobserwowano podczas rekonesansu,
- którą drogę wejścia wybrano,
- jakie kontrole napotkano,
- w jaki sposób zostały ominięte,
- kto poprawnie zareagował,
- gdzie tester znalazł się bez nadzoru,
- jakie zasoby stały się dostępne,
- w którym momencie osiągnięto cel,
- jakie działania wykonano przy opuszczaniu obiektu.

Opis powinien być chronologiczny.

Dzięki temu klient zobaczy nie pojedynczy błąd, lecz cały łańcuch.

---

## Obserwacja, dowód i wpływ

Każdy istotny moment testu warto opisać za pomocą trzech elementów.

### Obserwacja

Co dokładnie się wydarzyło?

> Tester przeszedł do chronionej części biura razem z grupą pracowników bez użycia własnej karty.

### Dowód

Co potwierdza tę obserwację?

> Czas wejścia, dokumentacja fotograficzna, log aktywności testera oraz zapis monitoringu.

### Wpływ

Co mógłby osiągnąć rzeczywisty napastnik?

> Uzyskanie nieewidencjonowanego dostępu do stanowisk pracy, sal konferencyjnych i wewnętrznych punktów sieciowych.

Takie podejście utrzymuje raport na poziomie faktów.

---

## Raportuj nieskuteczne procesy, nie pojedynczych ludzi

Słaby opis:

> Pracownik wpuścił nieznajomego do biura.

Lepszy opis:

> Kontrola dostępu umożliwiła przejście kilku osób po pojedynczej autoryzacji kartą. Pracownicy nie mieli ustalonego sposobu reagowania na osobę wchodzącą bez własnego uwierzytelnienia.

Słaby opis:

> Użytkownik bezmyślnie przekazał komputer.

Lepszy opis:

> Osoba przedstawiająca się jako pracownik wsparcia uzyskała dostęp do aktywnej sesji użytkownika. Organizacja nie stosowała rozpoznawalnego procesu potwierdzania niezapowiedzianych wizyt technicznych.

Dzięki temu rekomendacja może dotyczyć rzeczywistej przyczyny.

---

## Kontrole, które powinny zatrzymać atak

Odporność na ataki on-site nie powstaje dzięki jednej procedurze.

Potrzebne są nakładające się warstwy:

- wcześniejsze rejestrowanie wizyt,
- niezależne potwierdzanie gości,
- obowiązkowy opiekun,
- czytelne oznaczenie przepustek,
- ograniczenie dostępu gościa do niezbędnych stref,
- zasada używania własnej karty,
- zakaz pozostawiania drzwi otwartych,
- regularne przeglądy zamków i samozamykaczy,
- reagowanie na osoby bez identyfikatorów,
- kontrola nieznanych urządzeń,
- blokowanie nieautoryzowanych urządzeń USB,
- automatyczna blokada ekranów,
- ograniczenie uprawnień użytkowników,
- monitoring z realną procedurą reakcji,
- szkolenia oparte na scenariuszach.

Ważne jest również sprawdzanie, czy kontrola działa w praktyce.

Procedura opisana w dokumencie nie zatrzyma ataku, jeżeli pracownicy jej nie znają albo nie mają warunków, by ją wykonać.

---

## Typowe błędy organizacji

### Skupienie całej ochrony na recepcji głównej

Boczne wejścia, parkingi i strefy dostaw pozostają znacznie słabiej kontrolowane.

### Traktowanie karty jako pełnego potwierdzenia tożsamości

Nikt nie sprawdza, czy identyfikator odpowiada osobie i strefie.

### Pozostawianie gości bez opiekuna

Prawidłowo zarejestrowana osoba może swobodnie przemieszczać się po obiekcie.

### Przytrzymywanie drzwi jako element kultury organizacyjnej

Bezpieczeństwo przegrywa z uprzejmością.

### Nieformalna obsługa przez dział IT

Pracownicy nie wiedzą, w jaki sposób rozpoznać prawdziwego technika.

### Brak reakcji na osobę nieznaną

Każdy zakłada, że ktoś inny ją zweryfikował.

### Podłączanie niezamówionego sprzętu

Przedmiot jest oceniany na podstawie wyglądu, nie pochodzenia.

### Monitoring używany wyłącznie po incydencie

Kamery dokumentują atak, ale go nie zatrzymują.

---

## Typowe błędy testera

### Brak dokładnej granicy między systemami klienta i właściciela obiektu

Tester może wejść w zakres infrastruktury podmiotu, który nie wyraził zgody.

### Zbyt rozbudowana przykrywka

Każdy dodatkowy szczegół zwiększa ryzyko sprzeczności.

### Kontynuowanie po osiągnięciu celu

Dalsze działania nie przynoszą nowej wiedzy, a zwiększają wpływ testu.

### Gromadzenie niepotrzebnych danych

Dowód może zostać zebrany bez kopiowania dokumentów i informacji klientów.

### Pozostawienie artefaktów

Nieodnaleziony nośnik lub identyfikator staje się rzeczywistym problemem.

### Brak planu wyjścia

Tester wie, jak wejść, ale nie wie, jak bezpiecznie zakończyć interakcję.

### Ocenianie ludzi zamiast kontroli

Raport koncentruje się na zawstydzeniu pracownika, a nie na naprawie procesu.

---

## Checklista testu on-site

### Przygotowanie

- [ ] Określ dokładny cel i minimalny dowód.
- [ ] Rozdziel przestrzeń klienta od stref podmiotów trzecich.
- [ ] Potwierdź dozwolone lokalizacje i godziny.
- [ ] Przygotuj jedną spójną przykrywkę.
- [ ] Ustal niedozwolone role i działania.
- [ ] Określ warunki natychmiastowego przerwania testu.
- [ ] Przygotuj kontakt do koordynatora.
- [ ] Zaplanuj bezpieczne wyjście z obiektu.

### Rekonesans

- [ ] Zidentyfikuj wszystkie wejścia i granice stref.
- [ ] Sprawdź sposób obsługi gości.
- [ ] Obserwuj godziny zwiększonego ruchu.
- [ ] Zwróć uwagę na dostawców i wykonawców.
- [ ] Oceń identyfikatory i sposób ich noszenia.
- [ ] Sprawdź, czy drzwi wracają do stanu zamkniętego.
- [ ] Dokumentuj tylko elementy potrzebne do raportu.

### Realizacja

- [ ] Prowadź dokładny log czasu.
- [ ] Oddzielaj fakty od własnych założeń.
- [ ] Kontroluj zakres po przejściu każdej warstwy.
- [ ] Nie wykorzystuj osób i systemów spoza scope.
- [ ] Zakończ działania po uzyskaniu dowodu.
- [ ] Zapisuj również poprawne reakcje pracowników.

### Zakończenie

- [ ] Opuść obiekt zgodnie z ustalonym planem.
- [ ] Zwróć przepustki i elementy wyposażenia.
- [ ] Usuń wszystkie artefakty testowe.
- [ ] Rozlicz każde pozostawione urządzenie.
- [ ] Potwierdź zakończenie z koordynatorem.
- [ ] Zabezpiecz dokumentację i dane osobowe.

---

## Jedno zdanie, które zostawiam

**Atak on-site nie wygrywa dlatego, że drzwi nie mają zamka, lecz dlatego, że każda kolejna osoba zakłada, iż ktoś wcześniej sprawdził, kto przez nie przechodzi.**
