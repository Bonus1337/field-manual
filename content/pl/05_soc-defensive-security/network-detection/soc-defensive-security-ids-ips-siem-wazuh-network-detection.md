---
id: defensive-security-ids-ips-siem-wazuh-network-detection
title: "IDS, IPS i SIEM: od pojedynczego pakietu do skorelowanego incydentu"
team: red-blue
domain: defensive-security
section: network-detection-and-monitoring
type: knowledge
angle: network-telemetry-detection-correlation-and-response
sourceTrack: netMaster
tags:
  [
    "ids",
    "ips",
    "siem",
    "xdr",
    "wazuh",
    "suricata",
    "snort",
    "mitre-attack",
    "cyber-kill-chain",
    "threat-intelligence",
    "ioc",
    "ttp",
    "network-monitoring",
    "detection-engineering",
    "nmap",
    "soc",
  ]
difficulty: medium
shortDescription: "Praktyczne wprowadzenie do IDS, IPS i SIEM: jak ruch sieciowy staje się alertem, jak Snort i Suricata wykrywają podejrzane zachowanie, jak Wazuh zbiera i koreluje zdarzenia oraz jak analizować wynik z perspektywy atakującego i obrońcy."
updatedAt: "2026-07-20"
---

# IDS, IPS i SIEM: od pojedynczego pakietu do skorelowanego incydentu

Atak sieciowy rzadko wygląda jak jedno oczywiste zdarzenie.

Napastnik może najpierw przeskanować host, później połączyć się z wystawioną usługą, wysłać nietypowe żądanie HTTP, uruchomić polecenie na serwerze, wykonać zapytanie DNS, a na końcu połączyć się z zewnętrznym serwerem Command and Control.

Każda z tych czynności może być widoczna w innym miejscu.

Firewall widzi połączenie. Suricata widzi zawartość pakietu. System operacyjny widzi proces. Serwer DNS widzi domenę. Agent Wazuh widzi zmianę pliku lub nieudane logowanie. SIEM próbuje połączyć te obserwacje w jedną historię.

To jest najważniejsza rzecz, którą trzeba zrozumieć na początku: IDS nie widzi całego incydentu. Widzi tylko fragment aktywności.

Podobnie SIEM nie tworzy wiedzy z niczego. Jeżeli urządzenia nie generują odpowiednich logów, czas systemowy jest niespójny, reguły są źle napisane albo nikt nie analizuje alertów, nawet najlepszy dashboard nie zapewni realnej detekcji.

Detekcja zaczyna się od telemetrii.

## Co właściwie próbujemy wykryć?

Z perspektywy atakującego działanie jest procesem.

Najpierw pojawia się rozpoznanie. Potem wybór celu. Następnie próba uzyskania dostępu, wykonanie kodu, utrzymanie dostępu, ruch boczny, dostęp do danych i finalna akcja.

Z perspektywy systemów bezpieczeństwa ten sam proces wygląda jak zbiór niezależnych śladów:

- połączenia do wielu portów,
- nietypowe rozmiary pakietów,
- seria błędnych logowań,
- uruchomienie interpretera poleceń,
- podejrzane zapytania DNS,
- modyfikacja rejestru,
- utworzenie nowej usługi,
- ruch do nieznanej domeny,
- wzrost liczby żądań HTTP,
- komunikacja z rzadko używaną lokalizacją geograficzną,
- dostęp do wielu zasobów w krótkim czasie.

Nie wszystkie te zdarzenia muszą oznaczać atak.

Administrator może wykonać skan sieci. System aktualizacji może połączyć się z nową domeną. Aplikacja może wysłać dużą liczbę żądań HTTP z powodu błędu.

Dlatego detekcja nie polega wyłącznie na rozpoznawaniu złośliwych ciągów znaków. Polega również na zrozumieniu kontekstu.

Najprostszy model wygląda tak:

```text
aktywność
    -> telemetria
        -> zdarzenie
            -> reguła detekcyjna
                -> alert
                    -> analiza
                        -> incydent albo false positive
```

## Zdarzenie, alert i incydent to nie to samo

Zdarzeniem może być każde zarejestrowane działanie.

Przykład:

```text
Użytkownik zalogował się do systemu.
```

Samo logowanie nie musi być podejrzane. Jest jednak informacją, którą można wykorzystać podczas późniejszej analizy.

Alert powstaje wtedy, gdy zdarzenie albo grupa zdarzeń spełnia określone warunki.

Przykład:

```text
W ciągu jednej minuty wystąpiło 30 błędnych prób logowania
z jednego adresu IP.
```

Incydent to sytuacja, w której zdarzenia mają rzeczywisty albo potencjalny negatywny wpływ na bezpieczeństwo.

Przykład:

```text
Po serii błędnych logowań nastąpiło skuteczne logowanie,
utworzenie nowego konta administracyjnego oraz pobranie dużej
liczby dokumentów.
```

Nie każdy alert jest incydentem.

Alert może być:

- prawdziwym wykryciem ataku,
- prawdziwym wykryciem bezpiecznej aktywności administracyjnej,
- false positive,
- powtórzeniem tego samego problemu,
- skutkiem błędnej konfiguracji,
- objawem awarii aplikacji,
- sygnałem wymagającym zestawienia z innymi źródłami.

Dlatego liczba alertów nie jest dobrą miarą jakości systemu bezpieczeństwa.

System generujący dziesięć wartościowych alertów może być bardziej użyteczny niż system generujący dziesięć tysięcy powiadomień, których nikt nie analizuje.

## IDS: system, który obserwuje

IDS, czyli Intrusion Detection System, analizuje aktywność i informuje o wykryciu podejrzanego zachowania.

W przypadku sieciowego IDS źródłem danych są pakiety albo całe przepływy sieciowe.

System może analizować:

- adres źródłowy i docelowy,
- porty,
- protokół,
- kierunek komunikacji,
- flagi TCP,
- zawartość pakietu,
- URI żądania HTTP,
- nagłówki,
- zapytania DNS,
- częstotliwość zdarzeń,
- rozmiar pakietów,
- kolejność komunikatów,
- zgodność ruchu ze standardem protokołu,
- znane sygnatury exploitów,
- anomalie względem normalnej aktywności.

Uproszczony przepływ wygląda tak:

```text
ruch sieciowy
    -> IDS
        -> analiza reguł
            -> alert
```

IDS działa zwykle pasywnie. Otrzymuje kopię ruchu, analizuje ją i generuje zdarzenia.

Może być podłączony do portu SPAN na przełączniku, TAP-a sieciowego albo uruchomiony bezpośrednio na hoście.

Najważniejsza cecha trybu IDS jest taka, że błąd detekcji nie powinien zatrzymać produkcyjnego ruchu. System może wygenerować niepotrzebny alert, ale sam pakiet nadal dociera do celu.

To sprawia, że tryb IDS jest dobrym punktem startowym przy wdrażaniu nowych reguł.

## IPS: system, który znajduje się na drodze ruchu

IPS, czyli Intrusion Prevention System, analizuje aktywność podobnie jak IDS, ale może również podjąć działanie.

Najczęściej działa inline, czyli znajduje się bezpośrednio pomiędzy źródłem i celem komunikacji.

```text
klient
    -> IPS
        -> serwer
```

Jeżeli reguła uzna pakiet albo sesję za złośliwą, IPS może:

- odrzucić pakiet,
- przerwać sesję TCP,
- zablokować adres IP,
- zablokować określony wzorzec ruchu,
- ograniczyć liczbę żądań,
- przekazać zdarzenie do innego systemu,
- uruchomić dodatkową reakcję.

Najprostsze rozróżnienie wygląda tak:

```text
IDS -> wykrywa i informuje
IPS -> wykrywa, informuje i może blokować
```

Tryb IPS daje większe możliwości ochrony, ale zwiększa również ryzyko operacyjne.

Źle napisana reguła może zablokować prawidłowy ruch użytkowników. Sygnatura wykrywająca fragment URI może przypadkowo pasować do legalnej aplikacji. Zbyt ogólna reguła DNS może odciąć komunikację z usługą chmurową. Błędna detekcja skanowania może zablokować system monitoringu.

Dlatego reguł nie powinno się od razu przenosić do trybu blokowania.

Praktyczny proces wygląda lepiej w ten sposób:

```text
1. Utworzenie reguły w trybie alertowania.
2. Obserwacja działania w realnym ruchu.
3. Analiza false positive.
4. Zawężenie warunków.
5. Testy funkcjonalne.
6. Dopiero później przejście do blokowania.
```

Z perspektywy pentestera oznacza to, że test nie kończy się na pytaniu: „czy IDS zobaczył payload?”.

Trzeba również sprawdzić:

- czy alert zawiera wystarczający kontekst,
- czy właściwie wskazuje źródło i cel,
- czy sygnatura nie jest zbyt ogólna,
- czy regułę da się łatwo obejść,
- czy system wykrywa tylko jeden konkretny ciąg znaków,
- czy reakcja nie powoduje problemów biznesowych,
- czy analityk potrafi odtworzyć przebieg testu.

## SIEM: miejsce, w którym pojedyncze ślady zaczynają tworzyć historię

IDS może powiedzieć, że w ruchu HTTP pojawił się podejrzany ciąg znaków.

Nie musi jednak wiedzieć:

- który użytkownik wygenerował żądanie,
- jaki proces odpowiadał za ruch,
- czy host wcześniej pobrał podejrzany plik,
- czy konto logowało się z innego kraju,
- czy chwilę później zmieniono konfigurację systemu,
- czy ten sam adres IP atakował inne urządzenia,
- czy domena została wcześniej oznaczona jako złośliwa.

Do tego potrzebne są dodatkowe źródła danych.

SIEM, czyli Security Information and Event Management, zbiera logi i zdarzenia z wielu systemów, normalizuje je, analizuje i próbuje korelować.

Typowe źródła danych obejmują:

- systemy Windows,
- systemy Linux,
- kontrolery domeny,
- firewalle,
- routery i przełączniki,
- serwery VPN,
- IDS i IPS,
- EDR,
- serwery DNS,
- serwery proxy,
- aplikacje,
- bazy danych,
- pocztę,
- usługi chmurowe,
- systemy uwierzytelniania,
- systemy zarządzania podatnościami.

Uproszczony przepływ wygląda tak:

```text
źródła logów
    -> zbieranie
        -> parsowanie
            -> normalizacja
                -> reguły
                    -> korelacja
                        -> alert
                            -> analiza SOC
```

Parsowanie oznacza rozpoznanie struktury logu.

Jeżeli aplikacja zapisuje:

```text
2026-07-20 18:10:15 LOGIN_FAILED user=admin src=10.10.10.23
```

system musi rozpoznać między innymi:

```text
timestamp = 2026-07-20 18:10:15
event = LOGIN_FAILED
user = admin
source_ip = 10.10.10.23
```

Normalizacja pozwala porównywać zdarzenia pochodzące z różnych systemów.

Jedna aplikacja może używać pola `src`, druga `source_ip`, a trzecia `clientAddress`. SIEM powinien sprowadzić je do wspólnego znaczenia.

Dopiero wtedy możliwa jest korelacja.

Przykład:

```text
Zdarzenie 1:
20 błędnych prób logowania do VPN.

Zdarzenie 2:
Skuteczne logowanie tego samego użytkownika.

Zdarzenie 3:
Logowanie pochodzi z kraju, z którego użytkownik wcześniej nie pracował.

Zdarzenie 4:
Po zalogowaniu użytkownik uzyskał dostęp do systemu administracyjnego.

Zdarzenie 5:
Na stacji uruchomiono PowerShell z zakodowanym poleceniem.
```

Pojedynczo każde zdarzenie może mieć niski lub średni priorytet.

Razem mogą wskazywać na przejęcie konta.

To jest główna wartość SIEM: nie tylko przechowuje logi, ale próbuje łączyć aktywność w scenariusze.

## SIEM nie naprawia słabej telemetrii

Sam fakt wdrożenia SIEM nie oznacza, że organizacja posiada skuteczną detekcję.

Problemy często zaczynają się wcześniej:

- system nie wysyła odpowiednich logów,
- logi nie zawierają adresu źródłowego,
- brakuje nazwy użytkownika,
- czas na urządzeniach nie jest zsynchronizowany,
- retencja danych jest zbyt krótka,
- aplikacja nadpisuje stare pliki,
- logowane są tylko błędy, ale nie działania użytkowników,
- agent został zainstalowany, ale nie monitoruje właściwych katalogów,
- zdarzenia są zbierane, ale nie istnieją reguły detekcyjne,
- reguły istnieją, ale nikt ich nie stroi,
- alert trafia do dashboardu, którego nikt nie obserwuje.

Dlatego pierwsze pytanie podczas budowania detekcji nie powinno brzmieć:

> Jaką regułę napisać?

Lepsze pytanie brzmi:

> Jakie dane muszę posiadać, żeby w ogóle rozpoznać ten scenariusz?

## SIEM a XDR

SIEM i XDR często są przedstawiane jako konkurencyjne rozwiązania, ale w praktyce ich możliwości mogą się pokrywać.

SIEM koncentruje się na zbieraniu, przechowywaniu, normalizacji i korelacji danych z wielu źródeł.

XDR, czyli Extended Detection and Response, zwykle łączy telemetrię z różnych warstw z możliwością bezpośredniego reagowania.

Może obejmować:

- endpointy,
- sieć,
- pocztę,
- tożsamość,
- chmurę,
- aplikacje,
- threat intelligence.

Uproszczone rozróżnienie:

```text
SIEM
    -> zbiera i koreluje szeroki zakres logów

XDR
    -> łączy detekcję i reakcję pomiędzy wieloma warstwami
```

Granica nie zawsze jest wyraźna.

Nowoczesny SIEM może posiadać funkcje automatycznej reakcji. Platforma XDR może przechowywać i korelować logi podobnie jak SIEM.

Dlatego lepiej nie oceniać systemu po samej nazwie produktu.

Ważniejsze pytania to:

- jakie źródła obsługuje,
- czy dane są wystarczająco szczegółowe,
- jak działają reguły,
- czy możliwa jest korelacja,
- czy analityk widzi kontekst,
- jakie działania reakcyjne są dostępne,
- czy da się odtworzyć pełną oś czasu.

## Wazuh jako platforma do zbierania i analizy zdarzeń

Wazuh jest platformą open source łączącą funkcje kojarzone z SIEM i XDR.

Może zbierać dane z agentów zainstalowanych na hostach oraz z zewnętrznych źródeł logów.

Typowa architektura wygląda tak:

```text
endpoint
    -> Wazuh Agent
        -> Wazuh Server
            -> dekodery
                -> reguły
                    -> alerty
                        -> indexer
                            -> dashboard
```

Agent może monitorować między innymi:

- logi systemowe,
- zdarzenia Windows,
- zmiany plików,
- konfigurację,
- uruchamiane procesy,
- wyniki poleceń,
- podatności,
- stan bezpieczeństwa hosta.

Wazuh może również pobierać dane z innych narzędzi.

Przykład:

```text
ruch sieciowy
    -> Suricata
        -> eve.json
            -> Wazuh Agent
                -> Wazuh Server
                    -> alert
```

W tym modelu Suricata odpowiada za analizę pakietów, a Wazuh za zebranie zdarzenia, dalszą interpretację, korelację i prezentację.

To ważne rozróżnienie.

Wazuh nie musi samodzielnie analizować każdego pakietu. Może korzystać z wyspecjalizowanego sensora sieciowego, który dostarcza mu gotową telemetrię.

## Snort i Suricata: podobny cel, nieco inny ekosystem

Snort i Suricata są silnikami wykrywania zagrożeń w ruchu sieciowym.

Oba narzędzia mogą korzystać z reguł opisujących, czego należy szukać.

Reguła może określać:

- protokół,
- adres źródłowy,
- port źródłowy,
- kierunek ruchu,
- adres docelowy,
- port docelowy,
- zawartość pakietu,
- element protokołu aplikacyjnego,
- klasyfikację,
- identyfikator,
- wersję reguły.

Najprostszy model reguły wygląda tak:

```text
akcja protokół źródło port -> cel port (opcje)
```

Przykład:

```text
alert icmp any any -> any any (msg:"PING detected"; sid:1000001; rev:1;)
```

Reguła oznacza:

```text
alert       -> wygeneruj alert
icmp        -> analizuj ICMP
any any     -> dowolne źródło i port
->          -> kierunek ruchu
any any     -> dowolny cel i port
msg         -> treść komunikatu
sid         -> unikalny identyfikator reguły
rev         -> wersja reguły
```

W przypadku ICMP porty nie mają klasycznego znaczenia, ale składnia reguły pozostaje wspólna.

## Snort: pierwsza własna reguła

Snort można zainstalować z repozytorium systemowego:

```bash
sudo apt update
sudo apt install snort
```

W przypadku Snort 3 można również użyć obrazu kontenerowego:

```bash
docker pull ciscotalos/snort3
```

W zależności od wersji i sposobu instalacji ważne pliki mogą znajdować się w różnych lokalizacjach.

Dla Snort 3 typowym plikiem konfiguracyjnym jest:

```text
/etc/snort/snort.lua
```

Reguły lokalne mogą być przechowywane na przykład jako:

```text
local.rules
custom.rules
```

Zmienne sieciowe określają między innymi, co uznajemy za sieć wewnętrzną i zewnętrzną:

```text
HOME_NET
EXTERNAL_NET
HTTP_SERVERS
HTTP_PORTS
```

To nie są jedynie kosmetyczne nazwy.

Jeżeli `HOME_NET` jest ustawiony błędnie, reguła może analizować ruch w niewłaściwym kierunku albo nie zadziałać wcale.

Przykładowa reguła wykrywająca konkretny URI:

```text
alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (
    msg:"Wykryto probe do podatnego endpointu";
    content:"/scripts/tools/newdsn.exe";
    http_uri;
    nocase;
    metadata:service http;
    classtype:web-application-activity;
    sid:1001024;
    rev:1;
)
```

Znaczenie najważniejszych elementów:

```text
content
    -> poszukiwany fragment danych

http_uri
    -> analizuj część URI żądania HTTP

nocase
    -> nie rozróżniaj wielkości liter

classtype
    -> kategoria zdarzenia

sid
    -> identyfikator reguły

rev
    -> numer jej wersji
```

Uruchomienie Snorta na wybranym interfejsie:

```bash
sudo snort -i eth0 -c /etc/snort/snort.lua
```

Przed uruchomieniem detekcji warto sprawdzić konfigurację:

```bash
sudo snort -T -c /etc/snort/snort.lua
```

Test konfiguracji jest ważny, ponieważ błąd składni może uniemożliwić start całego silnika.

Własną regułę najlepiej testować w kontrolowany sposób.

Dla reguły HTTP można wysłać żądanie:

```bash
curl "http://<TARGET_IP>/scripts/tools/newdsn.exe"
```

Po teście należy sprawdzić:

- czy Snort wygenerował alert,
- czy wskazał właściwy adres źródłowy,
- czy widoczny jest cel,
- czy treść komunikatu jest zrozumiała,
- czy alert pojawia się tylko przy oczekiwanym żądaniu,
- czy podobny legalny URI nie generuje false positive.

## Suricata: IDS, IPS i Network Security Monitoring

Suricata może działać jako IDS, IPS oraz silnik Network Security Monitoring.

Oprócz alertów może generować szczegółowe dane dotyczące:

- połączeń,
- DNS,
- HTTP,
- TLS,
- plików,
- przepływów,
- statystyk,
- anomalii protokołów.

Instalacja:

```bash
sudo apt update
sudo apt install suricata
```

Najważniejszy plik konfiguracyjny:

```text
/etc/suricata/suricata.yaml
```

Reguły znajdują się zwykle w:

```text
/etc/suricata/rules/
```

Jednym z najważniejszych plików wynikowych jest:

```text
/var/log/suricata/eve.json
```

`eve.json` zawiera zdarzenia w formacie JSON.

To bardzo praktyczne, ponieważ JSON jest łatwy do:

- parsowania,
- filtrowania,
- wysyłania do SIEM,
- przetwarzania przez skrypty,
- analizowania narzędziem `jq`.

## AF_PACKET i NFQUEUE

Suricata może działać w różnych trybach.

W trybie IDS często wykorzystuje AF_PACKET.

W uproszczeniu:

```text
interfejs
    -> kopia ruchu
        -> Suricata
            -> alert
```

Przykładowe uruchomienie:

```bash
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

W trybie IPS można wykorzystać NFQUEUE i przekazywać ruch do Suricaty z użyciem reguł systemowego firewalla.

Uproszczony model:

```text
pakiet
    -> iptables/nftables
        -> NFQUEUE
            -> Suricata
                -> accept albo drop
```

Przykładowa reguła `iptables`:

```bash
sudo iptables -I FORWARD -j NFQUEUE --queue-num 0
```

Uruchomienie Suricaty:

```bash
sudo suricata -c /etc/suricata/suricata.yaml -q 0
```

Tryb inline powinien być wdrażany ostrożnie.

Zanim reguła zacznie blokować ruch, należy sprawdzić jej działanie w trybie alertowania.

## Własna reguła Suricaty

Najprostsza reguła wykrywająca ICMP:

```text
alert icmp any any -> any any (
    msg:"LAB ICMP ping detected";
    sid:1000001;
    rev:1;
)
```

Regułę można zapisać na przykład w:

```text
/etc/suricata/rules/local.rules
```

Następnie trzeba upewnić się, że plik jest ładowany przez `suricata.yaml`.

Test konfiguracji:

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

Jeżeli konfiguracja jest poprawna, wykonujemy kontrolowany test:

```bash
ping -c 1 <TARGET_IP>
```

Podgląd alertów:

```bash
sudo tail -f /var/log/suricata/fast.log
```

Albo analiza `eve.json`:

```bash
sudo tail -f /var/log/suricata/eve.json
```

Filtrowanie wyłącznie alertów:

```bash
jq 'select(.event_type=="alert")' /var/log/suricata/eve.json
```

Filtrowanie po identyfikatorze reguły:

```bash
jq 'select(.alert.signature_id==1000001)' /var/log/suricata/eve.json
```

Wyświetlenie tylko podstawowych pól:

```bash
jq 'select(.alert.signature_id==1000001) |
{
  timestamp,
  src_ip,
  dest_ip,
  proto,
  signature: .alert.signature,
  severity: .alert.severity
}' /var/log/suricata/eve.json
```

To pokazuje ważną różnicę między surowym logiem a przydatną informacją.

Pełny JSON może zawierać dużo danych. Analityk zwykle potrzebuje najpierw odpowiedzi na kilka prostych pytań:

```text
Kiedy?
Skąd?
Dokąd?
Jakim protokołem?
Która reguła?
Jaki priorytet?
```

## Integracja Suricaty z Wazuh

Najprostsza integracja polega na wskazaniu agentowi Wazuh pliku `eve.json`.

W konfiguracji agenta można dodać:

```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/suricata/eve.json</location>
</localfile>
```

Konfiguracja znajduje się zwykle w:

```text
/var/ossec/etc/ossec.conf
```

Po zmianie należy zrestartować agenta:

```bash
sudo systemctl restart wazuh-agent
```

Status:

```bash
sudo systemctl status wazuh-agent
```

Przepływ danych wygląda wtedy tak:

```text
ruch
    -> Suricata
        -> eve.json
            -> Wazuh Agent
                -> Wazuh Server
                    -> reguła
                        -> dashboard
```

Jeżeli alert nie pojawia się w Wazuh, należy sprawdzać kolejne warstwy, a nie od razu pisać nową regułę.

Pierwsze pytanie:

```text
Czy Suricata w ogóle wygenerowała zdarzenie?
```

Sprawdzenie:

```bash
jq 'select(.event_type=="alert")' /var/log/suricata/eve.json | tail
```

Drugie pytanie:

```text
Czy agent Wazuh działa?
```

```bash
sudo systemctl status wazuh-agent
```

Trzecie pytanie:

```text
Czy agent ma dostęp do pliku?
```

```bash
sudo -u wazuh test -r /var/log/suricata/eve.json && echo readable
```

Czwarte pytanie:

```text
Czy konfiguracja została poprawnie wczytana?
```

```bash
sudo /var/ossec/bin/wazuh-control restart
```

Piąte pytanie:

```text
Czy zdarzenie dotarło do serwera, ale nie spełniło warunków reguły?
```

Dopiero po przejściu całego przepływu wiadomo, w której warstwie występuje problem.

## Integracja Snorta z Wazuh

Snort może przekazywać alerty do Wazuh na kilka sposobów.

Najczęstsze podejścia to:

- syslog,
- odczyt pliku alertów,
- Filebeat,
- własne dekodery i reguły.

Uproszczony przepływ:

```text
Snort
    -> plik albo syslog
        -> Wazuh Agent
            -> decoder
                -> rule
                    -> alert
```

W przypadku własnego formatu logów może być potrzebny decoder.

Decoder odpowiada za rozpoznanie pól w zdarzeniu.

Reguła odpowiada za ocenę, czy zdarzenie powinno wygenerować alert oraz jaki poziom istotności powinien otrzymać.

## Decoder i reguła Wazuh

W Wazuh łatwo pomylić te dwa elementy.

Decoder mówi:

```text
Jak odczytać log?
```

Reguła mówi:

```text
Co ten log oznacza?
```

Przykładowy log:

```text
NMAP_PORT port=22 service=ssh host=10.10.10.20
```

Decoder może wydobyć:

```text
nmap_port = 22
nmap_service = ssh
nmap_host = 10.10.10.20
```

Reguła może następnie powiedzieć:

```text
Jeżeli port to 22, wygeneruj alert poziomu 3.
Jeżeli wykryto nowy nieautoryzowany port administracyjny,
wygeneruj alert poziomu 8.
```

Własne reguły przechowywane są zwykle w:

```text
/var/ossec/etc/rules/local_rules.xml
```

Przykład prostej reguły dla danych JSON:

```xml
<group name="linux,nmap,">
  <rule id="100100" level="3">
    <decoded_as>json</decoded_as>
    <field name="nmap_port">.+</field>
    <field name="nmap_port_service">.+</field>
    <description>
      NMAP: Port $(nmap_port) - $(nmap_port_service)
    </description>
  </rule>
</group>
```

Identyfikatory własnych reguł powinny znajdować się w zakresie przeznaczonym dla reguł lokalnych i nie kolidować z regułami dostarczanymi przez system.

Po zmianie konfiguracji należy wykonać test:

```bash
sudo /var/ossec/bin/wazuh-logtest
```

Następnie wkleić przykładowy log i sprawdzić:

- jaki decoder został użyty,
- jakie pola zostały wydobyte,
- która reguła zadziałała,
- jaki poziom alertu został przypisany.

`wazuh-logtest` jest jednym z najważniejszych narzędzi podczas budowania detekcji.

Bez niego łatwo pisać reguły metodą prób i błędów, restartując cały system po każdej zmianie.

## Automatyczny Nmap jako źródło danych dla Wazuh

Nmap jest zwykle kojarzony z ofensywnym skanowaniem.

Może jednak również pełnić funkcję kontrolną po stronie defensywnej.

Regularny skan może pomóc odpowiedzieć na pytania:

- czy pojawił się nowy host,
- czy otwarto nowy port,
- czy usługa zmieniła się od poprzedniego skanu,
- czy urządzenie wystawia panel administracyjny,
- czy port, który miał być zamknięty, nadal odpowiada.

Instalacja:

```bash
sudo apt update
sudo apt install nmap
```

Dla skryptu Python:

```bash
pip3 install python-nmap
```

Przykładowy skan:

```bash
nmap -sV -Pn 10.10.10.0/24
```

Dane można przekształcić do formatu JSON i przekazać do Wazuh.

Agent może okresowo uruchamiać polecenie:

```xml
<localfile>
  <log_format>full_command</log_format>
  <command>python3 /home/<USERNAME>/nmapscan.py</command>
  <frequency>604800</frequency>
</localfile>
```

Wartość:

```text
604800
```

oznacza siedem dni.

Taki mechanizm nie zastępuje profesjonalnego systemu zarządzania zasobami ani skanera podatności.

Może jednak wykryć podstawowe zmiany powierzchni ataku.

Największy sens pojawia się wtedy, gdy system nie alarmuje o każdym otwartym porcie, tylko o zmianie.

Przykład:

```text
Poprzedni skan:
22/tcp open ssh
443/tcp open https

Nowy skan:
22/tcp open ssh
443/tcp open https
8080/tcp open http-proxy
```

Wartościowym alertem nie jest informacja, że port 22 nadal istnieje.

Wartościowym alertem jest:

```text
Na hoście 10.10.10.20 pojawił się nowy port 8080/tcp,
który nie występował w poprzednim skanie.
```

To jest różnica między zbieraniem danych a detekcją zmiany.

## Wzbogacanie alertów przy pomocy zewnętrznej analizy

Alert może zawierać dane techniczne, ale nadal nie być zrozumiały dla osoby analizującej.

Przykład:

```text
NMAP: Port 8080 - http-proxy
```

System wzbogacający może dodać informacje:

- do czego zwykle używany jest port,
- jakie są typowe ryzyka,
- czy usługa powinna być wystawiona,
- jakie kroki weryfikacyjne wykonać,
- jakie dane zebrać przed eskalacją.

Integracja może przekazywać alert do zewnętrznego API.

Przykładowa konfiguracja:

```xml
<integration>
  <name>custom-chatgpt.py</name>
  <hook_url>https://api.openai.com/v1/chat/completions</hook_url>
  <api_key>YOUR_KEY</api_key>
  <level>5</level>
  <rule_id>100101</rule_id>
  <alert_format>json</alert_format>
</integration>
```

Skrypt integracyjny powinien posiadać właściwe uprawnienia:

```bash
sudo chmod 750 /var/ossec/integrations/custom-chatgpt.py
sudo chown root:wazuh /var/ossec/integrations/custom-chatgpt.py
```

Najważniejsze jest jednak zrozumienie roli takiej integracji.

Model językowy nie powinien być źródłem prawdy o incydencie.

Może:

- streścić alert,
- zaproponować pytania analityczne,
- uporządkować dane,
- opisać potencjalne scenariusze,
- pomóc w przygotowaniu wpisu do ticketu.

Nie powinien samodzielnie przesądzać:

```text
Host został przejęty.
```

Lepszy wynik wygląda tak:

```text
Zaobserwowano nowy port 8080/tcp na hoście 10.10.10.20.
Usługa została rozpoznana jako HTTP proxy. Należy potwierdzić,
czy została wdrożona w ramach zatwierdzonej zmiany, sprawdzić
proces nasłuchujący oraz ograniczyć dostęp sieciowy, jeżeli usługa
nie jest wymagana.
```

To nadal wymaga weryfikacji człowieka.

Przed wysłaniem alertów do zewnętrznego API trzeba również sprawdzić, czy dane nie zawierają:

- danych osobowych,
- nazw użytkowników,
- tokenów,
- fragmentów konfiguracji,
- danych klientów,
- treści dokumentów,
- informacji objętych tajemnicą organizacji.

## IOC: ślad, który można znaleźć

IOC, czyli Indicator of Compromise, jest obserwowalnym wskaźnikiem mogącym świadczyć o kompromitacji.

Przykłady IOC:

- adres IP,
- domena,
- hash pliku,
- ścieżka pliku,
- nazwa procesu,
- klucz rejestru,
- certyfikat,
- adres URL,
- nietypowa lokalizacja geograficzna,
- charakterystyczny User-Agent.

IOC są przydatne, ponieważ można ich szukać w środowisku.

Przykład:

```text
Czy którykolwiek host łączył się z domeną evil-example.test?
```

Albo:

```text
Czy hash badanego pliku występuje na innych endpointach?
```

Problem polega na tym, że proste IOC są łatwe do zmiany.

Napastnik może:

- zmienić adres IP,
- zarejestrować nową domenę,
- zmodyfikować jeden bajt pliku,
- zmienić nazwę procesu,
- użyć innej ścieżki.

Dlatego detekcja oparta wyłącznie na IOC może szybko tracić skuteczność.

## TTP: sposób działania przeciwnika

TTP oznacza Tactics, Techniques and Procedures.

Taktyka opisuje cel przeciwnika.

Przykład:

```text
Initial Access
```

Technika opisuje sposób realizacji celu.

Przykład:

```text
Phishing
```

Procedura opisuje konkretny sposób wykorzystania techniki przez daną grupę lub w danym incydencie.

Przykład:

```text
Wysłanie wiadomości spear-phishingowej zawierającej archiwum ZIP,
wewnątrz którego znajduje się plik skrótu uruchamiający PowerShell.
```

Można to zapisać tak:

```text
Taktyka
    -> co napastnik chce osiągnąć

Technika
    -> jaką klasę działania wykorzystuje

Procedura
    -> jak dokładnie zrobił to w konkretnym przypadku
```

TTP są trudniejsze do zmiany niż podstawowe IOC.

Napastnik może szybko zmienić domenę, ale nadal potrzebuje sposobu:

- uzyskania dostępu,
- wykonania kodu,
- utrzymania obecności,
- zdobycia danych uwierzytelniających,
- poruszania się po sieci,
- eksfiltracji danych.

Dlatego detekcje oparte na zachowaniu są często bardziej odporne niż reguły sprawdzające pojedynczy hash.

## MITRE ATT&CK jako mapa zachowań

MITRE ATT&CK porządkuje taktyki i techniki wykorzystywane przez przeciwników.

Nie jest listą gotowych exploitów.

Nie mówi również automatycznie, jak skonfigurować SIEM.

Jest mapą, która pomaga:

- opisywać zachowania atakujących,
- łączyć detekcje ze scenariuszami,
- identyfikować luki w monitoringu,
- budować playbooki,
- porównywać możliwości narzędzi,
- ujednolicać język red i blue teamu.

Przykładowy scenariusz:

```text
Użytkownik otwiera złośliwy załącznik.
    -> Initial Access

Załącznik uruchamia PowerShell.
    -> Execution

Skrypt tworzy zadanie harmonogramu.
    -> Persistence

Proces odczytuje dane uwierzytelniające.
    -> Credential Access

Host łączy się z innymi systemami przez SMB.
    -> Lateral Movement

Dane są wysyłane przez HTTPS.
    -> Exfiltration
```

Dla każdej techniki warto zadać cztery pytania:

```text
1. Jak atakujący wykonuje tę czynność?
2. Jakie ślady pozostają?
3. Które źródła danych mogą je zarejestrować?
4. Jak zweryfikować, czy detekcja naprawdę działa?
```

Samo przypisanie identyfikatora MITRE do reguły nie oznacza jeszcze, że detekcja jest dobra.

Reguła może formalnie wskazywać technikę, ale wykrywać tylko bardzo wąski przypadek.

Przykład:

```text
Technika:
Command and Scripting Interpreter: PowerShell

Słaba detekcja:
Alertuj, gdy command_line zawiera "Invoke-Mimikatz".

Lepszy kierunek:
Analizuj nietypowe uruchomienia PowerShell, kodowanie Base64,
pobieranie treści z Internetu, relację parent-child oraz kontekst
użytkownika.
```

## Cyber Kill Chain: gdzie jesteśmy w przebiegu ataku?

Cyber Kill Chain przedstawia atak jako kolejne etapy.

Klasyczny model obejmuje:

```text
1. Rekonesans
2. Uzbrajanie
3. Dostawa
4. Eksploitacja
5. Instalacja lub utrzymanie
6. Command and Control
7. Akcje na celu
```

Model pomaga zrozumieć, że atak można zatrzymać na różnych etapach.

Przykład phishingu:

```text
Rekonesans
    -> zebranie informacji o pracownikach

Uzbrajanie
    -> przygotowanie dokumentu z payloadem

Dostawa
    -> wysłanie wiadomości

Eksploitacja
    -> otwarcie pliku i wykonanie kodu

Utrzymanie
    -> utworzenie zadania harmonogramu

C&C
    -> połączenie z serwerem atakującego

Akcje
    -> kradzież danych
```

Z perspektywy detekcji oznacza to, że pojedynczy mechanizm nie wystarczy.

Filtr pocztowy może wykryć dostawę. EDR może wykryć wykonanie kodu. IDS może zobaczyć komunikację C&C. SIEM może połączyć wszystkie trzy zdarzenia.

## Piramida bólu jako sposób myślenia o detekcji

Nie wszystkie wskaźniki są równie wartościowe.

Na dole znajdują się elementy łatwe do zmiany przez napastnika:

```text
hash pliku
adres IP
domena
```

Wyżej znajdują się:

```text
artefakty sieciowe
artefakty hosta
narzędzia
TTP
```

Zmiana hasha może wymagać minimalnej modyfikacji pliku.

Zmiana całego sposobu działania może być znacznie trudniejsza.

Z tego wynika praktyczna zasada:

```text
IOC pomagają znaleźć znane zagrożenie.
TTP pomagają wykrywać sposób działania.
```

Dobra detekcja często łączy oba podejścia.

Przykład:

```text
IOC:
połączenie z domeną znaną jako złośliwa

TTP:
rzadki proces systemowy uruchamia skrypt, który komunikuje się
z nowo zarejestrowaną domeną i cyklicznie wysyła niewielkie porcje danych
```

## Cyber Threat Intelligence

Cyber Threat Intelligence to proces zbierania, analizowania i wykorzystywania informacji o zagrożeniach.

Nie polega wyłącznie na kopiowaniu adresów IP do blocklisty.

Dobra analiza CTI próbuje odpowiedzieć:

- kto może atakować,
- jakie cele wybiera,
- jakich technik używa,
- jakie narzędzia są charakterystyczne,
- jakie sektory są narażone,
- jakie kampanie są aktywne,
- jakie IOC są powiązane,
- jakie detekcje należy przygotować.

CTI może mieć różne poziomy.

Strategiczny CTI pomaga kierownictwu zrozumieć ryzyko i trendy.

Operacyjny CTI opisuje kampanie, grupy i prawdopodobne scenariusze.

Taktyczny CTI koncentruje się na TTP.

Techniczny CTI obejmuje konkretne IOC, takie jak domeny, adresy IP i hashe.

Praktyczny proces może wyglądać tak:

```text
raport o kampanii
    -> identyfikacja TTP
        -> mapowanie do MITRE ATT&CK
            -> określenie źródeł danych
                -> stworzenie detekcji
                    -> test
                        -> monitoring
```

Źródła i platformy wykorzystywane podczas analizy mogą obejmować:

- VirusTotal,
- ANY.RUN,
- AlienVault OTX,
- MalwareBazaar,
- Malpedia,
- URLScan,
- Censys,
- ZoomEye,
- AttackerkB,
- RansomLook,
- MISP,
- OpenCTI,
- SpiderFoot.

Każde narzędzie odpowiada na trochę inne pytanie.

VirusTotal pomaga analizować reputację plików, domen i adresów.

ANY.RUN pozwala obserwować zachowanie próbki w sandboxie.

Malpedia pomaga identyfikować rodziny malware.

MalwareBazaar udostępnia próbki i informacje o złośliwym oprogramowaniu.

MISP i OpenCTI pomagają przechowywać, łączyć i udostępniać dane threat intelligence.

Censys i ZoomEye pozwalają obserwować publicznie dostępne usługi i urządzenia.

## IOC bez kontekstu może być niebezpieczny

Adres IP oznaczony jako złośliwy nie zawsze powinien być automatycznie blokowany.

Może należeć do:

- współdzielonego hostingu,
- sieci CDN,
- usługi VPN,
- infrastruktury chmurowej,
- skanera bezpieczeństwa,
- legalnej platformy analitycznej.

Podobnie domena może zmienić właściciela albo przestać być wykorzystywana przez napastnika.

Dlatego przy analizie IOC warto sprawdzić:

- źródło informacji,
- datę obserwacji,
- poziom zaufania,
- kontekst kampanii,
- zakres czasowy,
- powiązane techniki,
- czy wskaźnik pojawia się w naszym środowisku.

Lepszy alert CTI nie brzmi:

```text
Połączenie z podejrzanym IP.
```

Lepszy alert brzmi:

```text
Host 10.10.10.25 połączył się z adresem 203.0.113.55,
który został powiązany z aktywną kampanią malware. Połączenie
zostało wykonane przez proces powershell.exe uruchomiony przez
winword.exe pięć minut po pobraniu załącznika.
```

Kontekst zmienia wszystko.

## Minimalne laboratorium IDS, Suricata i Wazuh

Najlepiej nie zaczynać od dziesięciu integracji jednocześnie.

Prosty lab może składać się z:

```text
Maszyna A:
Kali Linux albo inny host testowy

Maszyna B:
Linux z Suricatą i agentem Wazuh

Maszyna C:
Wazuh Server
```

Pierwszym celem nie jest wykrycie zaawansowanego malware.

Pierwszym celem jest sprawdzenie całego przepływu.

### Krok 1: sprawdź interfejs

```bash
ip addr
ip route
```

### Krok 2: uruchom Suricatę

```bash
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

### Krok 3: dodaj prostą regułę ICMP

```text
alert icmp any any -> any any (
    msg:"LAB ICMP ping detected";
    sid:1000001;
    rev:1;
)
```

### Krok 4: przetestuj konfigurację

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

### Krok 5: wyślij jeden pakiet

```bash
ping -c 1 <SURICATA_HOST>
```

### Krok 6: potwierdź alert lokalnie

```bash
jq 'select(.alert.signature_id==1000001)' \
/var/log/suricata/eve.json
```

### Krok 7: dodaj `eve.json` do Wazuh

```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/suricata/eve.json</location>
</localfile>
```

### Krok 8: zrestartuj agenta

```bash
sudo systemctl restart wazuh-agent
```

### Krok 9: powtórz ping

```bash
ping -c 1 <SURICATA_HOST>
```

### Krok 10: potwierdź zdarzenie w dashboardzie

Na tym etapie mamy najprostszy pełny pipeline:

```text
pakiet
    -> reguła Suricaty
        -> eve.json
            -> agent Wazuh
                -> serwer Wazuh
                    -> dashboard
```

Dopiero gdy ten przepływ działa, warto przechodzić do bardziej złożonych reguł HTTP, DNS, skanowania albo korelacji.

## Wykrywanie prostego skanowania

Z perspektywy atakującego skanowanie portów jest sposobem na zbudowanie mapy usług.

Przykład:

```bash
nmap -sS -Pn -p- <TARGET_IP>
```

Z perspektywy defensywnej pojedynczy pakiet SYN nie jest jeszcze wystarczającym dowodem skanowania.

Trzeba patrzeć na wzorzec:

```text
jeden adres źródłowy
    -> wiele portów
        -> krótki czas
            -> brak pełnych sesji
```

Reguła powinna uwzględniać częstotliwość.

Przykładowy kierunek reguły Suricaty:

```text
alert tcp any any -> $HOME_NET any (
    msg:"LAB possible TCP SYN scan";
    flags:S;
    threshold:type both, track by_src, count 20, seconds 5;
    sid:1000002;
    rev:1;
)
```

Po teście nie wystarczy zobaczyć alert.

Należy sprawdzić:

- czy wolniejszy skan nadal jest wykrywany,
- czy monitoring nie generuje false positive,
- czy skan jednego portu na wielu hostach jest widoczny,
- czy skan UDP wymaga osobnej reguły,
- czy źródło jest poprawnie identyfikowane za NAT-em,
- czy próg jest odpowiedni dla danego środowiska.

To jest właściwy sposób myślenia o detekcji: nie pytamy tylko „czy reguła działa?”, ale „w jakich warunkach działa i kiedy przestaje działać?”.

## Jak analizować wynik z perspektywy pentestera

Podczas testu zabezpieczeń łatwo zatrzymać się na informacji:

```text
Suricata wygenerowała alert.
```

To za mało.

Lepsza analiza obejmuje:

```text
Czy wykryto właściwą technikę?
Czy alert pojawił się wystarczająco szybko?
Czy zawierał adres źródłowy i docelowy?
Czy analityk mógł rozpoznać cel działania?
Czy zdarzenie zostało przekazane do SIEM?
Czy powstała korelacja z logami hosta?
Czy reakcja była automatyczna?
Czy dało się obejść regułę przez małą zmianę payloadu?
```

Przykładowy opis wyniku:

```text
Podczas kontrolowanego skanowania portów hosta 10.10.10.20
Suricata wygenerowała alert wskazujący adres źródłowy testera,
adres celu oraz przekroczenie progu pakietów SYN. Zdarzenie zostało
zapisane w eve.json i przekazane do Wazuh. Alert nie został jednak
skorelowany z późniejszą próbą logowania SSH, przez co oba etapy
aktywności były widoczne jako niezależne zdarzenia.
```

Taki opis pokazuje zarówno to, co działa, jak i miejsce do poprawy.

## Jak opisywać problem z detekcją w raporcie

Słaby opis:

```text
Wazuh nie działa poprawnie.
```

Lepszy opis:

```text
Podczas testu wykonano skan TCP SYN obejmujący wszystkie porty
hosta 10.10.10.20. Suricata poprawnie wygenerowała zdarzenie,
które zostało zapisane w pliku eve.json. Zdarzenie nie pojawiło się
jednak w Wazuh, ponieważ agent nie posiadał skonfigurowanego
monitorowania pliku /var/log/suricata/eve.json.
```

Jeszcze lepszy opis obejmuje wpływ:

```text
Brak integracji powoduje, że alerty sieciowe pozostają lokalnie
na sensorze i nie są dostępne w centralnym systemie monitoringu.
SOC może przez to nie zauważyć skanowania, prób wykorzystania
podatności oraz komunikacji z podejrzanymi adresami.
```

Rekomendacja:

```text
Dodać plik eve.json jako źródło JSON w konfiguracji agenta Wazuh,
zweryfikować uprawnienia do odczytu, uruchomić test kontrolny oraz
potwierdzić widoczność zdarzenia w dashboardzie.
```

Retest:

```text
Ponownie wykonać ograniczony skan TCP i potwierdzić, że zdarzenie
jest widoczne zarówno lokalnie w eve.json, jak i centralnie
w Wazuh wraz z poprawnym adresem źródłowym i docelowym.
```

Dobry finding powinien zawierać:

```text
warunek
dowód
wpływ
rekomendację
sposób retestu
```

## Najczęstsze problemy podczas budowania detekcji

Pierwszy problem to brak widoczności ruchu.

Suricata może nasłuchiwać na niewłaściwym interfejsie.

Sprawdzenie:

```bash
ip addr
sudo tcpdump -i eth0
```

Jeżeli `tcpdump` nie widzi ruchu, Suricata również go nie zobaczy.

Drugi problem to błędne `HOME_NET`.

Sprawdzenie konfiguracji:

```bash
grep -n "HOME_NET" /etc/suricata/suricata.yaml
```

Trzeci problem to niewczytana reguła.

Test:

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

Czwarty problem to konflikt `sid`.

Każda lokalna reguła powinna mieć unikalny identyfikator.

Piąty problem to błędne uprawnienia do `eve.json`.

Sprawdzenie:

```bash
ls -l /var/log/suricata/eve.json
```

Szósty problem to brak synchronizacji czasu.

Sprawdzenie:

```bash
timedatectl
```

Jeżeli hosty mają różny czas, korelacja zdarzeń może wyglądać tak, jakby odpowiedź nastąpiła przed atakiem.

Siódmy problem to zbyt szeroka reguła.

Przykład:

```text
alert tcp any any -> any 80
```

Taka reguła może alarmować o praktycznie całym ruchu HTTP.

Ósmy problem to detekcja jednego konkretnego payloadu.

Jeżeli reguła szuka wyłącznie:

```text
<script>alert(1)</script>
```

zmiana do:

```text
<img src=x onerror=alert(1)>
```

może ominąć detekcję.

Dziewiąty problem to alert bez procesu obsługi.

Nawet poprawny alert jest mało użyteczny, jeżeli nie wiadomo:

- kto go analizuje,
- w jakim czasie,
- jakie dane sprawdzić,
- kiedy eskalować,
- jak zamknąć false positive.

## Minimalny workflow budowania reguły

Najpierw opisz scenariusz.

```text
Chcę wykryć szybkie skanowanie wielu portów TCP.
```

Następnie określ źródło danych.

```text
Pakiety TCP widoczne przez Suricatę.
```

Później określ obserwowalny wzorzec.

```text
Wiele pakietów SYN z jednego źródła do wielu portów
w krótkim czasie.
```

Następnie utwórz prostą regułę.

```text
alert tcp any any -> $HOME_NET any (
    msg:"Possible TCP SYN scan";
    flags:S;
    threshold:type both, track by_src, count 20, seconds 5;
    sid:1000002;
    rev:1;
)
```

Potem wykonaj kontrolowany test.

```bash
nmap -sS -Pn -p 1-100 <TARGET_IP>
```

Następnie sprawdź wynik lokalnie.

```bash
jq 'select(.alert.signature_id==1000002)' \
/var/log/suricata/eve.json
```

Potem sprawdź wynik centralnie w Wazuh.

Na końcu wykonaj testy negatywne:

```text
normalne przeglądanie strony
monitoring hosta
wolny skan
skan jednego portu
skan z innego segmentu
```

Dopiero wtedy można ocenić jakość reguły.

## Kluczowe komendy do szybkiej powtórki

Instalacja Snorta:

```bash
sudo apt update
sudo apt install snort
```

Test konfiguracji Snorta:

```bash
sudo snort -T -c /etc/snort/snort.lua
```

Uruchomienie Snorta:

```bash
sudo snort -i eth0 -c /etc/snort/snort.lua
```

Instalacja Suricaty:

```bash
sudo apt update
sudo apt install suricata
```

Test konfiguracji Suricaty:

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

Uruchomienie Suricaty w trybie IDS:

```bash
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

Podgląd alertów:

```bash
sudo tail -f /var/log/suricata/fast.log
```

Filtrowanie alertów JSON:

```bash
jq 'select(.event_type=="alert")' /var/log/suricata/eve.json
```

Filtrowanie po `signature_id`:

```bash
jq 'select(.alert.signature_id==1000001)' \
/var/log/suricata/eve.json
```

Restart agenta Wazuh:

```bash
sudo systemctl restart wazuh-agent
```

Status agenta:

```bash
sudo systemctl status wazuh-agent
```

Test reguł Wazuh:

```bash
sudo /var/ossec/bin/wazuh-logtest
```

Instalacja Nmapa:

```bash
sudo apt install nmap
```

Instalacja biblioteki Python:

```bash
pip3 install python-nmap
```

Podstawowy skan usług:

```bash
nmap -sV -Pn <TARGET_IP>
```

Skan całego zakresu portów:

```bash
nmap -sS -Pn -p- <TARGET_IP>
```

Sprawdzenie ruchu na interfejsie:

```bash
sudo tcpdump -i eth0
```

Sprawdzenie czasu:

```bash
timedatectl
```

## Mentalny skrót

Nie zaczynamy budowy detekcji od dashboardu.

Zaczynamy od działania napastnika.

Najpierw pytamy, co atakujący chce osiągnąć. Potem zastanawiamy się, jakie zachowanie wykona, jakie ślady pozostawi i które systemy mogą te ślady zarejestrować.

Dopiero później wybieramy narzędzie.

Snort i Suricata analizują ruch sieciowy. Wazuh zbiera dane z hostów i zewnętrznych źródeł. SIEM koreluje zdarzenia. MITRE ATT&CK pomaga nazwać zachowanie. CTI dodaje kontekst dotyczący kampanii, grup i wskaźników. Człowiek nadal musi ocenić, czy obserwowana aktywność naprawdę jest incydentem.

Z perspektywy red teamu nie wystarczy stwierdzić, że payload zadziałał.

Trzeba sprawdzić, co zobaczył IDS, jakie dane trafiły do SIEM, czy zdarzenia zostały ze sobą połączone oraz czy analityk był w stanie odtworzyć cały przebieg ataku.

Z perspektywy blue teamu nie wystarczy posiadać agenta, dashboard i tysiące reguł.

Trzeba wiedzieć, które zachowania są naprawdę widoczne, gdzie występują luki, które alerty są wartościowe i czy zespół potrafi na nie zareagować.

To jest różnica między zbieraniem logów a realną detekcją.
