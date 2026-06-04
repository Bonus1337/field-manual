---
id: network-infrastructure-wifi-security-av-edr-introduction
title: "Bezpieczeństwo Wi-Fi i podstawy AV/EDR: od ramek radiowych do pierwszego workflow testowego"
team: red-blue
domain: network-infrastructure
section: wireless-security
type: knowledge
angle: wifi-recon-attack-surface-and-defensive-awareness
sourceTrack: netMaster
tags:
  [
    "wifi",
    "wireless-security",
    "802.11",
    "monitor-mode",
    "aircrack-ng",
    "airodump-ng",
    "wpa2",
    "wep",
    "wps",
    "evil-twin",
    "pmkid",
    "wpa2-enterprise",
    "edr",
    "antivirus",
    "pentest",
    "recon",
  ]
difficulty: medium
shortDescription: "Praktyczne wprowadzenie do bezpieczeństwa Wi-Fi: jak działa komunikacja radiowa, czym różni się tryb managed od monitor, jak wygląda rekonesans sieci bezprzewodowych, jakie są typowe klasy ataków na WEP, WPA2-PSK, WPS, Evil Twin i WPA2 Enterprise oraz jak myśleć o tym z perspektywy obrony i narzędzi AV/EDR."
updatedAt: "2026-05-30"
---

# Bezpieczeństwo Wi-Fi i podstawy AV/EDR: od ramek radiowych do pierwszego workflow testowego

Wi-Fi wygląda dla użytkownika banalnie: wybierasz nazwę sieci, wpisujesz hasło i po chwili masz Internet. Z perspektywy testera bezpieczeństwa dzieje się tam jednak dużo więcej. Urządzenie nie „magicznie” znajduje sieci. Ono nasłuchuje ramek radiowych, szuka znanych nazw, odpowiada na komunikaty punktów dostępowych, negocjuje parametry połączenia, uwierzytelnia się, a dopiero później zaczyna przesyłać dane.

To jest najważniejsza rzecz na start: pentest Wi-Fi nie zaczyna się od łamania hasła. Zaczyna się od zrozumienia, co lata w powietrzu.

W sieciach przewodowych często myślimy kategoriami: host, port, usługa, banner, wersja, podatność. W Wi-Fi myślimy trochę inaczej: kanał, BSSID, ESSID, klient, punkt dostępowy, typ zabezpieczeń, ramki zarządzające, handshake, PMKID, WPS, Evil Twin, deauthentication. To dalej jest rekonesans, tylko medium transmisyjnym nie jest kabel, ale radio.

## Co właściwie widzimy podczas testów Wi-Fi?

Sieć Wi-Fi to komunikacja zgodna ze standardami rodziny 802.11. Klient, czyli laptop albo telefon, nazywany jest często STA. Punkt dostępowy to AP. Sieć ma swoją nazwę widoczną dla człowieka, czyli ESSID, oraz identyfikator techniczny punktu dostępowego, czyli BSSID, najczęściej będący adresem MAC radia AP.

W praktyce podczas rekonesansu chcemy odpowiedzieć na kilka pytań.

Jakie sieci są w zasięgu? Na jakich kanałach działają? Jakie mają zabezpieczenia? Czy są to sieci otwarte, WPA2-PSK, WPA2 Enterprise, WPA3, a może coś starego typu WEP? Czy są podłączeni klienci? Czy sieć rozgłasza nazwę, czy próbuje ją ukryć? Czy punkt dostępowy ma włączony WPS? Czy klient zdradza swoje wcześniej zapamiętane sieci przez probe requesty?

To brzmi jak dużo, ale sprowadza się do prostego schematu:

najpierw patrzymy, co jest w powietrzu, potem klasyfikujemy zabezpieczenia, a dopiero później wybieramy technikę testową.

## Tryb managed kontra monitor

Zwykła karta Wi-Fi działa najczęściej w trybie managed. To normalny tryb pracy, w którym karta łączy się z jednym punktem dostępowym i wymienia z nim dane. Dla codziennego użycia to wystarcza.

Do testów Wi-Fi potrzebujemy jednak czegoś innego: trybu monitor. W tym trybie karta nie zachowuje się jak zwykły klient podłączony do jednej sieci. Zaczyna pasywnie nasłuchiwać ramek radiowych w otoczeniu. Dzięki temu możemy obserwować beacony, probe requesty, probe response, próby asocjacji, ramki EAPOL i inne elementy komunikacji 802.11.

Bez trybu monitor większość klasycznych technik pentestowych Wi-Fi po prostu nie zadziała.

Podstawowa kontrola interfejsu:

```bash
iwconfig wlan0
```

Włączenie trybu monitor przez `airmon-ng`:

```bash
sudo airmon-ng start wlan0
```

Po tej operacji interfejs często pojawi się jako `wlan0mon`.

Sprawdzenie:

```bash
iwconfig wlan0mon
```

Wyłączenie trybu monitor:

```bash
sudo airmon-ng stop wlan0mon
```

Alternatywnie można próbować ręcznie zmieniać tryb interfejsu:

```bash
sudo ip link set wlan0 down
sudo iwconfig wlan0 mode monitor
sudo ip link set wlan0 up
```

W praktyce na początku zawsze warto sprawdzić dwie rzeczy: czy system widzi kartę oraz czy karta rzeczywiście wspiera tryb monitor. Sama obecność karty Wi-Fi w systemie nie oznacza jeszcze, że nadaje się ona do testów bezprzewodowych.

## Pierwszy rekonesans lokalnych sieci

Po uruchomieniu trybu monitor pierwszym krokiem jest nasłuch okolicy. Nie atakujemy. Nie rozłączamy klientów. Nie próbujemy łamać haseł. Najpierw budujemy mapę.

```bash
sudo airodump-ng wlan0mon
```

Wynik pokaże między innymi:

- BSSID, czyli techniczny identyfikator punktu dostępowego,
- ESSID, czyli nazwę sieci,
- kanał,
- moc sygnału,
- typ szyfrowania,
- informacje o klientach,
- liczbę ramek danych,
- potencjalne handshaki, jeśli zostaną zauważone.

Jeżeli interesuje nas konkretny punkt dostępowy, zawężamy obserwację do BSSID i kanału:

```bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF wlan0mon
```

Jeżeli w okolicy jest kilka punktów dostępowych o tej samej lub podobnej nazwie, można filtrować po ESSID:

```bash
sudo airodump-ng -c 6 --essid-regex "lab" wlan0mon
```

To jest Wi-Fi odpowiednik podstawowego `nmap -sV`: nie chodzi jeszcze o exploitację, tylko o zrozumienie celu.

## Ukryta sieć nie znaczy niewidzialna sieć

Wiele osób uważa, że ukrycie SSID daje realne bezpieczeństwo. W praktyce jest to bardziej zaciemnienie niż ochrona. Sieć może nie rozgłaszać swojej nazwy w beaconach, ale jej nazwa może pojawić się w innych momentach komunikacji, na przykład gdy klient próbuje się z nią połączyć.

Jeżeli klient ma zapamiętaną sieć, może wysyłać probe requesty. Taki komunikat w uproszczeniu oznacza: „czy moja znana sieć jest gdzieś w pobliżu?”. To może zdradzać nazwy sieci, z którymi urządzenie łączyło się wcześniej.

Praktyczna obserwacja probe requestów:

```bash
sudo airodump-ng wlan0mon --write probe_requests
```

Wniosek obronny jest prosty: ukrywanie SSID nie zastępuje silnego WPA2/WPA3, dobrego hasła i poprawnej konfiguracji klientów.

## Typy zabezpieczeń Wi-Fi z perspektywy testera

Nie każdą sieć testujemy tak samo. Najpierw trzeba rozpoznać mechanizm zabezpieczeń.

Sieć otwarta nie wymaga hasła do samego połączenia. Często występuje tam captive portal, czyli strona logowania lub akceptacji regulaminu. Ryzykiem nie jest tu „złamanie hasła do Wi-Fi”, bo hasła nie ma. Ryzykiem są podsłuch, fałszywe portale, ataki Man in the Middle, zła izolacja klientów i phishing.

WEP to stary, praktycznie martwy standard. Jeżeli gdziekolwiek występuje, powinien być traktowany jako krytyczny problem konfiguracyjny. WEP opiera się na mechanizmach, które od lat są uznawane za niewystarczające. W praktyce test polega na zebraniu odpowiedniej liczby ramek i odzyskaniu klucza.

WPA/WPA2-PSK to klasyczny wariant z jednym hasłem współdzielonym przez użytkowników. Najczęstszy workflow polega na przechwyceniu 4-way handshake albo PMKID, a następnie próbie offline’owego złamania hasła słownikowo.

WPA2 Enterprise, czasem opisywany jako WPA2-MGT, używa zewnętrznego serwera uwierzytelniania, zwykle RADIUS. Tutaj nie testujemy prostego „hasła do Wi-Fi”, tylko cały proces uwierzytelnienia użytkownika, certyfikaty, walidację serwera, metody EAP i podatność na Evil Twin.

WPA3 jest nowszym standardem i znacząco poprawia część problemów znanych z WPA2-PSK. Nie oznacza to jednak, że każda implementacja i konfiguracja WPA3 jest automatycznie bezpieczna. Przy WPA3 ważne są szczegóły konfiguracji, kompatybilność wsteczna i konkretne implementacje.

## WEP: przykład starego mechanizmu, który nie powinien istnieć

WEP jest dobrym przykładem tego, że „szyfrowanie” nie zawsze oznacza bezpieczeństwo. Sieć może formalnie wymagać klucza, ale jeżeli mechanizm kryptograficzny jest słaby, to atakujący może odzyskać go z ruchu.

Przechwytywanie ramek konkretnej sieci WEP:

```bash
sudo airodump-ng wlan0mon --bssid AA:BB:CC:DD:EE:FF -c 6 -w wep_dump
```

W niektórych scenariuszach laboratoryjnych można przyspieszać zbieranie IV przez replay ruchu:

```bash
sudo aireplay-ng -3 -b AA:BB:CC:DD:EE:FF -h 11:22:33:44:55:66 wlan0mon
```

Próba odzyskania klucza:

```bash
aircrack-ng wep_dump-01.cap
```

Z perspektywy raportowej WEP nie powinien być opisywany jako „słabe hasło”. Problemem jest sam mechanizm. Rekomendacja jest prosta: całkowicie wyłączyć WEP i przejść na WPA2/WPA3 z silną konfiguracją.

## WPA2-PSK i 4-way handshake

WPA2-PSK jest dużo mocniejsze niż WEP, ale ma jedną ważną cechę: jeżeli atakujący przechwyci materiał uwierzytelniający, może próbować łamać hasło offline. Offline oznacza, że dalsza część ataku nie wymaga już kontaktu z punktem dostępowym. Szybkość zależy od sprzętu atakującego i jakości hasła.

Przechwycenie handshake:

```bash
sudo airodump-ng wlan0mon --essid-regex "lab" -w handshake
```

W praktyce często zawęża się cel po BSSID i kanale:

```bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w handshake wlan0mon
```

Jeżeli klient ponownie połączy się z siecią, `airodump-ng` może pokazać informację o złapanym handshake. W materiałach sesji oczekiwany komunikat został pokazany jako:

```text
[ handshake found at XX:XX:XX:XX:XX:XX ]
```

Po zdobyciu pliku `.cap` można wykonać próbę słownikową:

```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b AA:BB:CC:DD:EE:FF handshake-01.cap
```

Alternatywnie można użyć hashcata. W nowszym workflow najpierw konwertujemy plik do formatu obsługiwanego przez hashcat:

```bash
hcxpcapngtool -o wpa2_hash.hc22000 handshake-01.cap
```

Potem uruchamiamy atak słownikowy:

```bash
hashcat -m 22000 wpa2_hash.hc22000 /usr/share/wordlists/rockyou.txt
```

Najważniejsze: ten test nie „łamie WPA2” jako standardu. On sprawdza odporność konkretnego hasła PSK. Jeżeli hasło jest długie, losowe i unikalne, atak słownikowy może być niepraktyczny. Jeżeli hasło brzmi jak nazwa firmy z rokiem i wykrzyknikiem, problem jest realny.

## Deauthentication: wymuszenie ponownego handshake

Jeżeli klient jest już połączony z siecią, tester może chcieć zobaczyć moment ponownego uwierzytelnienia. Do tego w laboratoriach używa się ramek deauthentication, które odłączają klienta od AP i często powodują jego automatyczne ponowne połączenie.

Wysyłanie ramek deauth broadcastem:

```bash
sudo aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF wlan0mon
```

Próba odłączenia konkretnego klienta:

```bash
sudo aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon
```

Warto zwrócić uwagę na parametr liczby pakietów. W wielu cheatsheetach pojawia się `--deauth 0`, co oznacza wysyłanie ciągłe. W notatkach roboczych i labach lepiej używać ograniczonej liczby ramek, na przykład `5` albo `10`, żeby test był kontrolowany i łatwiejszy do opisania w raporcie.

Obronnie warto wiedzieć, że klasyczne ramki deauth są częścią warstwy zarządzającej 802.11. Ochroną przed częścią takich ataków może być Protected Management Frames, czyli 802.11w, jeżeli urządzenia i konfiguracja to wspierają.

## PMKID: handshake bez czekania na klienta

W niektórych konfiguracjach punkt dostępowy może ujawnić PMKID. W materiałach PMKID został opisany jako pole związane z 4-way handshake, zwracane w specyficznych konfiguracjach AP, na przykład przy fast roamingu 802.11r. Dla testera oznacza to ciekawy scenariusz: czasem można pozyskać materiał do ataku offline bez czekania na klienta i bez deauthentication.

Przykładowe przechwytywanie PMKID:

```bash
sudo hcxdumptool -o pmkid_hcxdumptool.pcap -i wlan0mon --enable_status=1 --filterlist_ap=mac_list.txt --filtermode=2
```

Konwersja do formatu hashcat:

```bash
hcxpcapngtool -o pmkid.16800 -E ssids.txt -I info.txt pmkid_hcxdumptool.pcap
```

Atak słownikowy:

```bash
hashcat -m 16800 pmkid.16800 /usr/share/wordlists/rockyou.txt
```

W praktyce wygodnym narzędziem automatyzującym część pracy jest też `wifite`:

```bash
sudo wifite
```

W raporcie warto rozdzielić dwie rzeczy: samo pozyskanie PMKID oraz skuteczność łamania hasła. Pozyskanie materiału nie oznacza jeszcze przejęcia dostępu. Przejęcie zależy od jakości PSK.

## WPS: mały PIN, duży problem

WPS miał ułatwiać życie użytkownikom. Zamiast wpisywania długiego hasła można było użyć PIN-u albo przycisku na routerze. Problem w tym, że WPS w wariancie PIN znacząco zmniejsza koszt ataku.

Sprawdzenie AP z WPS:

```bash
sudo wash -i wlan0mon
```

Przykładowe narzędzia do testów WPS w laboratorium:

```bash
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv
```

albo:

```bash
sudo bully wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -v 3
```

Z perspektywy rekomendacji obronnej najbezpieczniej jest wyłączyć WPS, szczególnie wariant PIN. Silne hasło WPA2/WPA3 traci sens, jeżeli obok istnieje drugi, słabszy mechanizm wejścia do tej samej sieci.

## Evil Twin: kiedy problemem nie jest kryptografia, tylko zaufanie użytkownika

Evil Twin to fałszywy punkt dostępowy imitujący prawidłową sieć. Atakujący nie musi od razu łamać WPA2. Może spróbować stworzyć sieć wyglądającą znajomo, zmusić użytkownika do połączenia, pokazać captive portal, zebrać dane logowania albo przeprowadzić Man in the Middle w źle zabezpieczonych scenariuszach.

Prosty przykład fałszywego AP:

```bash
sudo airbase-ng -e "FreeHotelWiFi" -c 6 wlan0mon
```

Do bardziej rozbudowanych scenariuszy laboratoryjnych używa się narzędzi takich jak Airgeddon:

```bash
sudo airgeddon
```

albo Wifiphisher:

```bash
sudo wifiphisher
```

Przykład captive portal phishing w labie:

```bash
sudo wifiphisher -aI wlan0mon --essid "FreeWiFi" --phishing-payload simple-login
```

W praktyce Evil Twin dobrze pokazuje różnicę między „bezpieczeństwem protokołu” a „bezpieczeństwem całego procesu”. Nawet jeżeli WPA2 jest poprawne, użytkownik może zostać przekonany do połączenia z siecią, która tylko wygląda podobnie.

## Karma, Mana i Known Beacons

Urządzenia często pamiętają sieci, z którymi łączyły się wcześniej. Ta lista znanych sieci bywa nazywana Preferred Network List. Jeżeli klient aktywnie pyta w eterze o znane sieci, atakujący może próbować odpowiedzieć: „tak, to ja jestem tą siecią”.

To jest idea ataków Karma/Mana.

Prosty przykład:

```bash
sudo airbase-ng -P -C 30 wlan0mon
```

Wifiphisher może uruchamiać podobne techniki w tle:

```bash
sudo wifiphisher -aI wlan0mon -jI wlan4 -p firmware-upgrade
```

Known Beacons polega na tworzeniu wielu popularnych nazw sieci, na przykład nazw kawiarni, lotnisk czy hoteli:

```bash
sudo wifiphisher -kB
```

Dla osoby początkującej najważniejszy wniosek jest taki: urządzenie też mówi. Nie tylko AP rozgłasza sieć. Klient również może zdradzać swoje oczekiwania wobec otoczenia.

## WPA2 Enterprise: kiedy atakujemy proces uwierzytelniania

WPA2 Enterprise różni się od WPA2-PSK tym, że nie ma jednego wspólnego hasła dla wszystkich. Uwierzytelnianie jest delegowane do serwera RADIUS. W praktyce użytkownik loguje się swoim loginem i hasłem, certyfikatem albo inną metodą zależną od konfiguracji EAP.

To daje dużo większe możliwości obronne, ale tylko wtedy, gdy konfiguracja jest poprawna. Jeżeli klient nie waliduje certyfikatu serwera, może połączyć się z fałszywym AP. Jeżeli dopuszczono słabsze metody uwierzytelniania, można próbować downgrade’u albo przechwycenia materiału do dalszej analizy.

Narzędziem często używanym w labach WPA2 Enterprise jest EAPhammer.

Wygenerowanie fałszywego certyfikatu:

```bash
./eaphammer --cert-wizard
```

Uruchomienie fałszywego AP dla WPA2 Enterprise:

```bash
sudo eaphammer --interface wlan0 --essid "SEKURAK" --creds --channel 6 --wpa2 --auth wpa-eap --internet-interface eth0
```

Przykład próby downgrade’u:

```bash
sudo eaphammer --auth wpa-eap --interface wlan0 --creds --essid "SEKURAK" --negotiate gtc-downgrade
```

W raporcie z takiego testu trzeba opisać nie tylko „udało się uruchomić fake AP”. Ważniejsze jest to, czy klient zaakceptował fałszywy certyfikat, czy użytkownik otrzymał ostrzeżenie, czy poświadczenia zostały ujawnione i jaka konfiguracja to umożliwiła.

## WPA3: nowszy standard, ale nie magiczna tarcza

WPA3 poprawia wiele problemów znanych z WPA2-PSK. Szczególnie ważne jest odejście od prostego modelu, w którym przechwycony handshake pozwala masowo próbować haseł offline w taki sam sposób jak przy WPA2-PSK.

Nie oznacza to, że WPA3 kończy temat testów Wi-Fi. Nadal znaczenie mają:

konfiguracja mixed mode WPA2/WPA3, jakość haseł, implementacje klientów i AP, podatności konkretnego sprzętu, downgrade, Evil Twin, konfiguracja Enterprise oraz zachowanie użytkowników.

W praktyce w testach bezpieczeństwa WPA3 warto sprawdzać nie tylko sam napis „WPA3” w konfiguracji, ale też tryb kompatybilności i realne zachowanie klientów.

## Dodatkowe techniki, które warto znać

Beacon Flood polega na zalewaniu otoczenia dużą liczbą fałszywych SSID. Może służyć do testów odporności urządzeń, analizy zachowania klientów albo demonstracji chaosu w środowisku radiowym.

```bash
sudo mdk3 wlan0mon b -f ssid_list.txt -c 6
```

SSID cloaking i fingerprinting ukrytych sieci:

```bash
sudo airodump-ng wlan0mon --ignore-negative-one
```

Zapisywanie probe requestów do późniejszej analizy:

```bash
sudo airodump-ng wlan0mon --write probe_requests
```

Te techniki nie zawsze są „główną podatnością”, ale pomagają zrozumieć środowisko. W dobrym pentestowym workflow często to właśnie drobne obserwacje z rekonesansu prowadzą do właściwego scenariusza ataku.

## Minimalny workflow testów Wi-Fi w labie

Na początku nie warto skakać między wszystkimi narzędziami naraz. Lepiej trzymać się prostego procesu.

Najpierw upewnij się, że karta działa i obsługuje tryb monitor:

```bash
iwconfig wlan0
sudo airmon-ng start wlan0
iwconfig wlan0mon
```

Potem wykonaj ogólny rekonesans:

```bash
sudo airodump-ng wlan0mon
```

Następnie wybierz konkretny cel i zawęź obserwację:

```bash
sudo airodump-ng -c <CHANNEL> --bssid <AP_MAC> -w capture wlan0mon
```

Potem klasyfikujesz zabezpieczenia:

```text
OPN        -> sieć otwarta / captive portal / ryzyko MITM
WEP        -> podatny, historyczny mechanizm
WPA2-PSK   -> handshake / PMKID / jakość hasła
WPS        -> sprawdzić, czy PIN jest aktywny
WPA2-MGT   -> RADIUS / EAP / certyfikaty / Evil Twin
WPA3       -> tryb konfiguracji, mixed mode, implementacja
```

Dopiero po tej klasyfikacji wybierasz technikę testową. Inaczej test zamienia się w losowe odpalanie narzędzi.

## Jak myśleć o wynikach w raporcie

W testach Wi-Fi łatwo przesadzić z opisem technicznym, a zapomnieć o wpływie. Raport nie powinien brzmieć: „uruchomiono aircrack-ng i hashcat”. To tylko narzędzia.

Lepszy opis mówi:

W sieci `<ESSID>` przechwycono materiał uwierzytelniający WPA2-PSK w postaci 4-way handshake. Następnie wykonano kontrolowaną próbę słownikową, która potwierdziła, że hasło sieci znajduje się w popularnym słowniku. Oznacza to, że osoba znajdująca się w zasięgu radiowym sieci może uzyskać dostęp do infrastruktury bez interakcji z administratorem.

Albo:

W punkcie dostępowym wykryto aktywny WPS PIN. Mechanizm ten znacząco obniża odporność sieci na ataki, ponieważ umożliwia testowanie krótkiego PIN-u zamiast właściwego, silniejszego hasła WPA2-PSK. Zalecane jest całkowite wyłączenie WPS.

Albo:

Klient testowy zaakceptował fałszywy punkt dostępowy WPA2 Enterprise bez poprawnej walidacji certyfikatu serwera. W takim scenariuszu atakujący może podszyć się pod sieć firmową i próbować przechwycić poświadczenia użytkownika.

Dobre znalezisko powinno mieć: warunek wystąpienia, dowód, wpływ, rekomendację i sposób retestu.

## Podstawy AV/EDR: dlaczego to pasuje do Wi-Fi?

Na pierwszy rzut oka Wi-Fi i EDR to dwa różne światy. Wi-Fi dotyczy dostępu do sieci, a EDR końcówek roboczych. W praktyce one się łączą.

Jeżeli atak na Wi-Fi się powiedzie, atakujący może znaleźć się bliżej zasobów wewnętrznych. Jeżeli Evil Twin lub captive portal zadziała, użytkownik może podać dane logowania albo pobrać złośliwy plik. Jeżeli urządzenie firmowe połączy się z niekontrolowaną siecią, endpoint staje się pierwszą linią obrony.

Antywirus i EDR próbują odpowiedzieć na pytanie: co dzieje się na urządzeniu po tym, jak użytkownik, aplikacja albo proces zrobi coś ryzykownego?

Klasyczny antywirus historycznie kojarzy się z wykrywaniem plików na podstawie sygnatur. Jeżeli plik pasuje do znanego wzorca złośliwego oprogramowania, zostaje zablokowany albo poddany kwarantannie.

Nowocześniejsze podejście patrzy szerzej. EDR analizuje zachowanie procesów, relacje parent-child, uruchamiane komendy, modyfikacje rejestru, połączenia sieciowe, próby wstrzyknięcia kodu, nietypowe użycie PowerShella, tworzenie persistence, dumpowanie poświadczeń albo komunikację z podejrzanymi domenami.

Dla pentestera oznacza to jedno: nie wystarczy myśleć „czy payload działa”. Trzeba myśleć „co po drodze zobaczy endpoint”.

Dla obrońcy oznacza to coś odwrotnego: nie wystarczy mieć agenta EDR. Trzeba wiedzieć, jakie zachowania powinny być widoczne po stronie detekcji i czy alerty są zrozumiałe dla zespołu.

## Prosty model działania AV/EDR

Można myśleć o AV/EDR w kilku warstwach.

Pierwsza warstwa to plik. Czy plik jest znany? Czy ma złą reputację? Czy jego hash występuje w bazach zagrożeń? Czy zawiera podejrzane sekcje, makra, packer, nietypowe importy?

Druga warstwa to proces. Co zostało uruchomione? Przez kogo? Z jakimi argumentami? Czy Word uruchomił PowerShella? Czy przeglądarka odpaliła binarkę z katalogu tymczasowego? Czy proces systemowy zachowuje się inaczej niż zwykle?

Trzecia warstwa to zachowanie. Czy proces próbuje uzyskać persistence? Czy dotyka LSASS? Czy skanuje sieć? Czy wykonuje zrzut pamięci? Czy szyfruje dużą liczbę plików? Czy otwiera podejrzane połączenia wychodzące?

Czwarta warstwa to korelacja. Pojedyncza akcja może wyglądać niewinnie. Ale ciąg zdarzeń: pobranie pliku, uruchomienie PowerShella, połączenie do nietypowej domeny, enumeracja udziałów SMB i próba dostępu do poświadczeń tworzy już mocny sygnał.

To jest różnica między prostym antywirusem a sensownym podejściem endpoint detection and response.

## Jak połączyć Wi-Fi z myśleniem blue team

Po stronie defensywnej test Wi-Fi nie powinien kończyć się na informacji, że hasło zostało złamane. Trzeba zadać kolejne pytania:

Czy nieautoryzowane urządzenie po połączeniu z Wi-Fi dostaje dostęp do segmentu produkcyjnego? Czy działa izolacja klientów? Czy VLAN dla gości jest oddzielony od zasobów firmowych? Czy DHCP, DNS i firewall logują nowe urządzenia? Czy EDR widzi podejrzane zachowanie po podłączeniu endpointu do obcej sieci? Czy użytkownicy są podatni na fałszywe captive portale? Czy urządzenia walidują certyfikat w WPA2 Enterprise?

To jest właśnie red-blue mindset. Red team pokazuje ścieżkę wejścia. Blue team sprawdza, gdzie powinny pojawić się sygnały wykrycia i jak ograniczyć wpływ.

## Rekomendacje, które najczęściej wracają po testach Wi-Fi

Najczęściej nie chodzi o jedną magiczną poprawkę. Bezpieczeństwo Wi-Fi składa się z kilku warstw.

WEP powinien zostać całkowicie usunięty. WPS, szczególnie PIN, powinien być wyłączony. WPA2-PSK powinien używać długich, losowych i unikalnych haseł. Sieci gościnne powinny być odseparowane od sieci wewnętrznych. Dla organizacji lepszym kierunkiem jest WPA2/WPA3 Enterprise z poprawną walidacją certyfikatów. Klienci powinni mieć wyłączone automatyczne łączenie z niepotrzebnymi sieciami. Urządzenia powinny wspierać Protected Management Frames tam, gdzie to możliwe. Logi z kontrolerów Wi-Fi, DHCP, DNS, firewalli i EDR powinny być korelowane.

Dobra konfiguracja Wi-Fi nie zakłada, że „nikt nie zna hasła”. Zakłada, że ktoś może znaleźć się w zasięgu radiowym i próbować różnych ścieżek wejścia.

## Najważniejsze komendy do szybkiej powtórki

Sprawdzenie trybu interfejsu:

```bash
iwconfig wlan0
```

Start trybu monitor:

```bash
sudo airmon-ng start wlan0
```

Stop trybu monitor:

```bash
sudo airmon-ng stop wlan0mon
```

Ogólny rekonesans:

```bash
sudo airodump-ng wlan0mon
```

Nasłuch konkretnego AP:

```bash
sudo airodump-ng -c <CHANNEL> --bssid <AP_MAC> -w capture wlan0mon
```

Próba złamania WPA2 handshake przez aircrack-ng:

```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b <AP_MAC> capture-01.cap
```

Konwersja do hashcat dla WPA2:

```bash
hcxpcapngtool -o wpa2_hash.hc22000 capture-01.cap
```

Hashcat WPA2:

```bash
hashcat -m 22000 wpa2_hash.hc22000 /usr/share/wordlists/rockyou.txt
```

Skan WPS:

```bash
sudo wash -i wlan0mon
```

Test WPS:

```bash
sudo reaver -i wlan0mon -b <AP_MAC> -vv
```

Evil Twin - prosty AP:

```bash
sudo airbase-ng -e "FreeHotelWiFi" -c 6 wlan0mon
```

Wifiphisher:

```bash
sudo wifiphisher
```

EAPhammer - cert wizard:

```bash
./eaphammer --cert-wizard
```

EAPhammer - fake AP WPA2 Enterprise:

```bash
sudo eaphammer --interface wlan0 --essid "SEKURAK" --creds --channel 6 --wpa2 --auth wpa-eap --internet-interface eth0
```

## Mentalny skrót

Wi-Fi nie testujemy od payloadu. Testujemy od powietrza.

Najpierw patrzymy, jakie ramki są widoczne. Potem rozpoznajemy sieci, klientów i typ zabezpieczeń. Dopiero później wybieramy technikę: WEP, handshake, PMKID, WPS, Evil Twin, WPA2 Enterprise albo analiza konfiguracji WPA3.

A kiedy już znajdziemy ścieżkę wejścia, nie kończymy na „udało się”. Pytamy, co to oznacza dla organizacji: czy atakujący może wejść do sieci, czy widzi zasoby wewnętrzne, czy endpoint go wykryje, czy EDR wygeneruje sensowny alert i czy administrator będzie umiał odtworzyć całą ścieżkę zdarzeń.

To jest różnica między klikaniem narzędzi a prawdziwym testem bezpieczeństwa.
