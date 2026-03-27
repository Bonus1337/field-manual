---
id: footprinting-scanning
title: "Footprinting & Scanning - kompletny przewodnik praktyka"
team: red
category: eJPT
tags: ["nmap", "scanning", "host-discovery", "port-scan", "fingerprinting", "evasion"]
difficulty: easy
shortDescription: "Kompleksowy materiał na temat footprintingu i skanowania w kontekście pentestów oraz przygotowania do eJPT, zawierający uporządkowane omówienie host discovery, port scanningu, fingerprintingu usług i systemów, skryptów NSE, technik evasion oraz zasad interpretacji wyników."
updatedAt: "2025-03-07"
---

> Wszystkie materiały tutaj zawarte są tylko częścią notatek nauki. Nie są przeznaczone do używania na produkcyjnych rozwiązaniach bez autoryzacji.

# Footprinting & Scanning - kompletny przewodnik praktyka

## Dlaczego w ogóle ta notatka

Skanowanie sieci to moment kiedy kończysz być cieniem i zaczynasz wysyłać pakiety.
Od tego miejsca twój ruch pojawia się w logach. Jeśli nie wiesz co robisz - albo
spalisz swoje IP zanim zdążysz zebrać cokolwiek użytecznego, albo co gorsza -
wyślesz pakiety poza scope i masz problem.

Ta notatka to kompletny materiał roboczy - od fundamentów sieciowych które musisz rozumieć
żeby interpretować wyniki, przez host discovery, port scanning, fingerprinting usług i OS,
aż do NSE i technik evasion. Ułożona tak żeby dało się przez nią przejść
krok po kroku na labsie albo wrócić do konkretnej sekcji kiedy utkniesz.

---

## Fundamenty - co musisz rozumieć zanim odpalisz Nmapa

### Gdzie to siedzi w metodologii

Footprinting i scanning to aktywna część information gathering. Nie robisz tego przed
passive reconem - robisz to po. Z passive dostajesz mapę terenu: wiedzisz jakie IP,
jakie NS, jakie subdomeny. Dopiero wtedy wchodzisz z pakietami i wiesz co konkretnie
chcesz znaleźć.

```
Information Gathering
├── Passive (OSINT, DNS, Google Dorks, Shodan)
└── Active ← tutaj jesteśmy
    ├── Network Mapping / Host Discovery
    ├── Port Scanning
    ├── Service & OS Detection
    └── Enumeration (następny etap)
```

Wchodzenie z Nmapem do sieci o której nic nie wiesz to strzelanie na oślep.
Passive daje ci cel. Active daje ci profil.

---

### Model OSI - warstwy które faktycznie mają znaczenie

OSI masz zakuć dlatego że egzamin pyta o nie w kontekście skanowania,
a nie dlatego żeby znać je na pamięć. Dla nas kluczowe są dwie warstwy:
**warstwa 3 (IP, ICMP)** i **warstwa 4 (TCP, UDP)**. Na nich operuje Nmap.

| #     | Warstwa       | Co robi                                   | Przykłady           |
| ----- | ------------- | ----------------------------------------- | ------------------- |
| 7     | Application   | Interfejs dla aplikacji                   | HTTP, FTP, SSH, DNS |
| 6     | Presentation  | Tłumaczenie, szyfrowanie                  | SSL/TLS             |
| 5     | Session       | Zarządzanie sesjami                       | APIs, NetBIOS       |
| **4** | **Transport** | **End-to-end, porty, kontrola przepływu** | **TCP, UDP**        |
| **3** | **Network**   | **Logiczne adresowanie, routing**         | **IP, ICMP**        |
| 2     | Data Link     | Dostęp do medium, MAC                     | Ethernet, PPP       |
| 1     | Physical      | Fizyczne połączenie                       | Kable, Wi-Fi        |

Ping działa na warstwie 3 przez ICMP. Port scanning działa na warstwie 4 przez TCP/UDP.
Kiedy firewall blokuje ICMP - ping nie przechodzi, ale port 80 może być nadal otwarty.
To dlatego `nmap -Pn` (skip ping) istnieje.

---

### TCP i trzy-way handshake - musisz to rozumieć na wylot

TCP to protokół połączeniowy. Zanim wymienisz jakiekolwiek dane, musisz ustanowić połączenie
przez trzy-way handshake. Nmap wykorzystuje dokładnie ten mechanizm żeby sprawdzić stan portu.

```
KLIENT ──────── SYN ────────► SERWER    (chcę nawiązać połączenie)
KLIENT ◄──── SYN-ACK ──────── SERWER    (ok, potwierdzam, jestem dostępny)
KLIENT ──────── ACK ────────► SERWER    (potwierdzam potwierdzenie)
               [POŁĄCZENIE USTANOWIONE]
```

Każda flaga TCP ma swoje znaczenie w kontekście skanowania:

| Flaga | Co oznacza                       |
| ----- | -------------------------------- |
| SYN   | Inicjuje połączenie              |
| ACK   | Potwierdzenie odebrania          |
| FIN   | Zamknięcie połączenia            |
| RST   | Reset - port zamknięty albo błąd |
| PSH   | Push danych                      |
| URG   | Dane pilne                       |

Dlaczego to ważne: SYN scan (`-sS`) wysyła tylko SYN i po otrzymaniu SYN-ACK
odpowiada RST - nie kończy handshake. To jest szybsze i mniej widoczne w logach
aplikacji, bo połączenie nigdy nie zostało kompletnie ustanowione.
TCP Connect scan (`-sT`) robi pełny handshake - jest głośniejszy ale nie wymaga roota.

---

### ICMP - protokół który blokują wszyscy i który nadal jest użyteczny

ICMP to warstwa 3. Używa go ping i traceroute. Kluczowe typy które zobaczysz:

| Typ     | Znaczenie                                               |
| ------- | ------------------------------------------------------- |
| Type 8  | Echo Request (wysyłasz ping)                            |
| Type 0  | Echo Reply (host żyje)                                  |
| Type 3  | Destination Unreachable (brak trasy albo closed na UDP) |
| Type 11 | Time Exceeded (TTL wygasło - używane przez traceroute)  |

Wiele firewalli blokuje ICMP. Host który nie odpowiada na ping nie jest martwy -
może po prostu dropować Echo Request. Wtedy używasz TCP SYN ping albo `-Pn`.

---

### TCP vs UDP - kiedy co

UDP jest bezpołączeniowy i szybszy, ale Nmap ma z nim problem. Jeśli UDP port
nie odpowiada nic - Nmap oznacza go jako `open|filtered`, bo nie wie czy usługa
milczy czy pakiet został zablokowany. Dlatego UDP scan jest wolny i często ignorowany.
To błąd. SNMP (161), DNS (53), NFS (2049) to UDP i mogą być złotem.

| Cecha        | TCP                     | UDP                   |
| ------------ | ----------------------- | --------------------- |
| Połączenie   | Tak (handshake)         | Nie                   |
| Niezawodność | Gwarantuje dostarczenie | Brak gwarancji        |
| Szybkość     | Wolniejszy              | Szybszy               |
| Zastosowanie | HTTP, FTP, SSH, SMTP    | DNS, SNMP, DHCP, VoIP |

---

### Porty - tabela referencyjna

Nie ucz się tego na pamięć. Ucz się co dana usługa oznacza z ofensywnego punktu widzenia.

| Port      | Protokół | Usługa     | Co tu sprawdzam                        |
| --------- | -------- | ---------- | -------------------------------------- |
| 21        | TCP      | FTP        | Anonymous login, wersja pod CVE        |
| 22        | TCP      | SSH        | Wersja OpenSSH, password auth vs key   |
| 23        | TCP      | Telnet     | Nieszyfrowany - legacy urządzenie      |
| 25        | TCP      | SMTP       | VRFY, EXPN - enumeracja użytkowników   |
| 53        | TCP/UDP  | DNS        | Zone transfer przez TCP                |
| 80        | TCP      | HTTP       | Web app - wejście do testów webowych   |
| 110       | TCP      | POP3       | Poczta przychodząca                    |
| 139/445   | TCP      | SMB        | EternalBlue, null session, enum shares |
| 143       | TCP      | IMAP       | Poczta przychodząca                    |
| 443       | TCP      | HTTPS      | TLS, certyfikat (SANs!), web app       |
| 3306      | TCP      | MySQL      | Anonymous login, brute root            |
| 3389      | TCP      | RDP        | BlueKeep, brute force                  |
| 5432      | TCP      | PostgreSQL | Domyślne hasła                         |
| 5900      | TCP      | VNC        | Często słabe albo brak hasła           |
| 6379      | TCP      | Redis      | Często bez uwierzytelnienia → RCE      |
| 8080/8443 | TCP      | HTTP alt   | Tomcat, Jenkins, panele zarządzania    |
| 27017     | TCP      | MongoDB    | Często bez uwierzytelnienia            |

---

## Mapowanie sieci - po co w ogóle to robimy

Dostajesz zakres. Powiedzmy `200.200.0.0/16` - to 65536 potencjalnych adresów.
Nie wiesz co tam jest. Nie wiesz ile hostów żyje. Nie wiesz co na nich stoi.
Sieć mapping to przejście od "mam zakres CIDR" do "wiem co konkretnie testować".

Odpowiadasz na cztery pytania zanim zaczniesz enumerację:

1. Które IP są aktywne?
2. Jakie porty są na nich otwarte?
3. Co tam stoi (wersja usługi, system operacyjny)?
4. Czy stoi za tym firewall i jak wygląda filtrowanie?

Kolejność jest zawsze taka sama. Nie skaczesz od razu do port scanu.
Najpierw wiesz co żyje, potem skanujesz porty tylko na żywych hostach.

---

## Host Discovery - wykrywanie żywych hostów

### Jakie techniki istnieją i kiedy co używasz

Klasyczny ping sweep (ICMP Echo Request) to najszybsza opcja, ale działa tylko gdy
firewall przepuszcza ICMP. W środowiskach produkcyjnych ICMP jest często blokowany
z zasady. Wtedy musisz używać TCP albo UDP do sprawdzenia czy host żyje.

**Ping sweep (ICMP)** - szybki, ale firewall go blokuje:

```bash
# Wykryj żywe hosty - tylko discovery, bez skanowania portów
nmap -sn 192.168.1.0/24

# Zapisz żywe hosty do pliku - przyda się do kolejnych skanów
nmap -sn -T4 192.168.1.0/24 -oG - | awk '/Up$/{print $2}' > live_hosts.txt
```

**ARP scan** - najniezawodniejszy ale tylko w tej samej sieci lokalnej. ARP działa
na warstwie 2, przed IP, więc żaden host w LAN nie może go ignorować:

```bash
# Wymaga root, działa tylko w local network
sudo arp-scan -I eth0 --localnet
sudo nmap -PR -sn 192.168.1.0/24
```

**TCP SYN / ACK ping** - gdy ICMP jest zablokowany. Wysyłasz SYN na znane porty
(80, 443, 22) - jeśli host żyje, dostaniesz SYN-ACK albo RST:

```bash
# Ping przez TCP SYN na port 22, 80 i 443
nmap -PS22,80,443 -sn 192.168.1.0/24

# TCP ACK ping - niektóre firewalle przepuszczają ACK bo myślą że to istniejące połączenie
nmap -PA80 -sn 192.168.1.0/24

# UDP ping - na port 53 (DNS)
nmap -PU53 -sn 192.168.1.0/24
```

**`-Pn` - wymuś skan bez ping.** Gdy wiesz że host żyje ale firewall blokuje
wszystko co mogłoby go ujawnić. Traktuje każdy adres jako żywy i od razu skanuje porty.
Na /24 z `-Pn` to będzie trwać - używaj na konkretnych hostach:

```bash
nmap -Pn 192.168.1.10
```

**fping i netdiscover** - alternatywy gdy Nmap jest za głośny albo za wolny:

```bash
# fping - szybki ping sweep, 2>/dev/null żeby nie widzieć "unreachable"
fping -I eth0 -g 192.168.1.0/24 -a 2>/dev/null

# netdiscover - pasywny i aktywny ARP discovery
sudo netdiscover -i eth0 -r 192.168.1.0/24
```

---

## Port Scanning - skanowanie portów

### Co znaczą stany portów

To jest pierwsza rzecz którą musisz umieć interpretować zanim zaczniesz skanować.
Wyniki które Nmap pokazuje mówią bardzo różne rzeczy o tym co jest za hostem.

**`open`** - usługa nasłuchuje. Połączenie jest możliwe. To jest to czego szukasz.
Idź dalej - enumeruj usługę, sprawdź wersję, szukaj CVE.

**`closed`** - host żyje, port dostępny, ale żadna usługa nie nasłuchuje.
Dostajesz RST w odpowiedzi. To nie jest "nic tu nie ma" - to jest potwierdzenie
że host istnieje i jest osiągalny.

**`filtered`** - brak odpowiedzi albo ICMP unreachable. Firewall dropuje pakiety.
Coś prawdopodobnie tam jest, ale jest ukryte. Warto próbować technik evasion.

**`open|filtered`** - Nmap nie może odróżnić. Typowe dla UDP - usługa może nie odpowiadać
na puste pakiety. Nie oznacza że nic tam nie ma.

**`unfiltered`** - port dostępny, ale stan nieznany. Pojawia się przy ACK scan -
używanym do mapowania reguł firewalla, nie do wykrywania otwartych portów.

---

### Typy skanów - co kiedy wysyłasz

**SYN scan (`-sS`)** to domyślny skan dla roota. Wysyła SYN, po otrzymaniu SYN-ACK
natychmiast odpowiada RST i nie kończy handshake. Szybki i mniej widoczny w logach
aplikacji - połączenie nie zostało kompletnie ustanowione. Sieciowe IDS i tak to widzą,
ale na logach aplikacyjnych - cisza:

```bash
sudo nmap -sS 192.168.1.10
```

**TCP Connect scan (`-sT`)** robi pełny handshake przez syscall connect(). Rejestruje się
w logach aplikacji. Wolniejszy. Ale nie wymaga root - przydatny gdy nie masz sudo:

```bash
nmap -sT 192.168.1.10
```

**UDP scan (`-sU`)** - powolny, często ignorowany, przez co jest złotem. SNMP (161)
bez community stringa daje pełną informację o routerze. DNS na TCP (53) to zone transfer.
NFS (2049) może dać dostęp do share'ów bez autoryzacji:

```bash
# Top 25 portów UDP - szybki przegląd
sudo nmap -sU --top-ports 25 192.168.1.10

# Konkretne porty UDP które zawsze sprawdzam
sudo nmap -sU -p 53,67,68,69,161,162,2049 192.168.1.10
```

**FIN, NULL, Xmas scans** - wysyłają niestandardowe kombinacje flag TCP. Normalny host
powinien odpowiedzieć RST na closed port i nic na open. Niektóre firewalle i IDS
ignorują te pakiety bo nie wyglądają jak prawdziwy ruch. Na Windows nie działają
(Windows odpowiada RST na wszystko niezależnie od stanu portu):

```bash
sudo nmap -sF 192.168.1.10   # FIN scan
sudo nmap -sN 192.168.1.10   # NULL scan - żadnych flag
sudo nmap -sX 192.168.1.10   # Xmas scan - FIN+PSH+URG
```

**ACK scan (`-sA`)** - nie wykrywa otwartych portów. Wysyła ACK i sprawdza czy dostaje
RST (unfiltered - brak firewalla na tym porcie) czy nic (filtered). Używany do mapowania
co firewall przepuszcza a co blokuje:

```bash
sudo nmap -sA 192.168.1.10
```

---

### Wybór portów - kiedy skanujesz co

Domyślny Nmap skanuje top 1000 portów TCP. To wystarczy do pierwszego przeglądu.
Problem: ważne usługi siedzą na niestandardowych portach. Panel admina Jenkinsa
na 8080. Grafana na 3000. Elasticsearch na 9200. Jeśli standardowy scan daje mało -
skanuj wszystkie porty i nie żałuj czasu:

```bash
# Domyślny - top 1000 portów TCP
nmap 192.168.1.10

# Fast mode - top 100 (szybki przegląd, nie do finalnego raportu)
nmap -F 192.168.1.10

# Top N portów
nmap --top-ports 200 192.168.1.10

# Konkretne porty
nmap -p 22,80,443,8080,3306,3389 192.168.1.10

# Wszystkie porty - 0 do 65535
nmap -p- 192.168.1.10

# UDP + TCP jednocześnie na konkretnych portach
sudo nmap -sU -sS -p U:53,161,T:22,80,443 192.168.1.10
```

Moja strategia: zaczynam od `-sV -sC -T4` na top 1000. Jeśli widzę ciekawe usługi
albo mało portów - idę z `-p-` żeby upewnić się że nic nie pominąłem.

---

## Service & OS Detection - fingerprinting

### Wykrywanie wersji usług

Otwarty port to punkt wejścia. Wersja usługi to wejście do bazy CVE.
`Apache 2.4.49` to CVE-2021-41773. `OpenSSH 7.4` ma swoją historię podatności.
`vsFTPd 2.3.4` ma backdoor. Bez `-sV` masz tylko port - z `-sV` masz wektor ataku:

```bash
# Podstawowy - wykryj wersje usług
nmap -sV 192.168.1.10

# Intensywność wykrywania (0-9, domyślnie 7) - wyżej = dokładniej ale wolniej
nmap -sV --version-intensity 9 192.168.1.10

# Szybszy ale mniej dokładny
nmap -sV --version-light 192.168.1.10
```

Gdy masz wersję - od razu:

```bash
searchsploit apache 2.4.49
searchsploit openssh 7.4
searchsploit vsftpd 2.3.4
```

---

### Wykrywanie systemu operacyjnego

Nmap analizuje charakterystyczne elementy odpowiedzi TCP/IP: TTL, TCP window size,
odpowiedzi na specjalne pakiety. Nie jest w 100% niezawodny, ale w 80% przypadków
wynik jest użyteczny. Potrzebuje root i co najmniej jednego otwartego i jednego
zamkniętego portu:

```bash
sudo nmap -O 192.168.1.10

# Gdy Nmap nie jest pewny - każ mu zgadywać agresywniej
sudo nmap -O --osscan-guess 192.168.1.10
```

Szybszy sposób na oszacowanie OS to po prostu TTL z odpowiedzi na ping:

| OS                 | TTL (przybliżony) |
| ------------------ | ----------------- |
| Linux / Unix / Mac | 64                |
| Windows            | 128               |
| Cisco IOS          | 255               |
| FreeBSD            | 64                |

TTL=127 → prawdopodobnie Windows który przeszedł przez 1 router.
TTL=63 → prawdopodobnie Linux przez 1 router.

---

### Aggressive scan - `-A`

`-A` to skrót dla `-sV -sC -O --traceroute` w jednej fladze. Wszystko naraz.
Głośny, hałaśliwy, triggeruje IDS. Na prawdziwym engagemencie omów z klientem.
Na CTF / labach używaj bez obaw:

```bash
# Aggressive na pojedynczym hoście
nmap -A 192.168.1.10

# Najczęściej używana kombinacja na egzaminie
nmap -sC -sV -O -T4 192.168.1.10 -oA wynik

# Kompletny skan wszystkich portów z pełnym profilowaniem
nmap -Pn -sV -T4 -A -p- -oA full_scan 192.168.1.10
```

---

## Nmap Scripting Engine (NSE)

### Co to jest i dlaczego działa

NSE to framework skryptów w Lua wbudowany w Nmap. Pozwala na automatyczne
sprawdzanie podatności, enumerację, brute force, zbieranie danych - bez uruchamiania
osobnych narzędzi. Skrypty siedzą w `/usr/share/nmap/scripts/`.

Kategorie skryptów:

| Kategoria   | Co robi                               |
| ----------- | ------------------------------------- |
| `default`   | Bezpieczne, uruchamiane przez `-sC`   |
| `discovery` | Zbiera więcej informacji o celu       |
| `safe`      | Nie ingeruje w cel, tylko zbiera dane |
| `vuln`      | Sprawdza znane podatności             |
| `exploit`   | Aktywna eksploitacja                  |
| `auth`      | Testy uwierzytelniania                |
| `brute`     | Brute force                           |
| `dos`       | Denial of Service - ostrożnie         |

Domyślne skrypty (`-sC`) to kategoria `safe + default`. Bezpieczne znaczy:
nie exploitują, nie bruteforce'ują, tylko zbierają informacje. Typowy wynik:

```
| http-title: Panel Zarządzania
| ssl-cert: SANs: firma.com, api.firma.com  ← dodatkowe subdomeny w certyfikacie!
| ssh-hostkey: 2048 aa:bb:cc:dd... (RSA)
```

---

### Skrypty NSE według scenariusza - to czego faktycznie używam

```bash
# ── HTTP ──────────────────────────────────────────────────
# Tytuł strony, nagłówki, dostępne metody HTTP
nmap -p 80,443 --script http-title,http-headers,http-methods 192.168.1.10

# Directory enumeration - szuka ukrytych ścieżek
nmap -p 80 --script http-enum 192.168.1.10

# robots.txt
nmap -p 80 --script http-robots.txt 192.168.1.10

# ── FTP ──────────────────────────────────────────────────
# Sprawdź czy FTP akceptuje anonymous login
nmap -p 21 --script ftp-anon 192.168.1.10

# FTP bounce attack
nmap -p 21 --script ftp-bounce 192.168.1.10

# ── SMB ──────────────────────────────────────────────────
# EternalBlue (MS17-010) - najważniejszy
nmap -p 445 --script smb-vuln-ms17-010 192.168.1.10

# Wszystkie podatności SMB
nmap -p 445 --script smb-vuln* 192.168.1.10

# Jakie share'y są dostępne
nmap -p 445 --script smb-enum-shares 192.168.1.10

# Enumeracja użytkowników przez SMB
nmap -p 445 --script smb-enum-users 192.168.1.10

# Wersja protokołu SMB i security mode
nmap -p 445 --script smb-protocols,smb-security-mode 192.168.1.10

# OS przez SMB
nmap -p 445 --script smb-os-discovery 192.168.1.10

# ── SSH ──────────────────────────────────────────────────
# Jakie metody uwierzytelnienia obsługuje
nmap -p 22 --script ssh-auth-methods 192.168.1.10

# ── MySQL ─────────────────────────────────────────────────
# Info bez uwierzytelnienia i sprawdzenie pustego hasła root
nmap -p 3306 --script mysql-info,mysql-empty-password 192.168.1.10

# ── Ogólny vuln scan ──────────────────────────────────────
# Hałaśliwy, może triggerować IDS - ale kompleksowy
nmap --script=vuln 192.168.1.10
```

Szukanie skryptów:

```bash
# Znajdź wszystkie skrypty dla danej usługi
ls /usr/share/nmap/scripts/ | grep smb
ls /usr/share/nmap/scripts/ | grep http

# Pomoc dla konkretnego skryptu
nmap --script-help smb-vuln-ms17-010
nmap --script-help "smb-vuln-*"
```

---

## Firewall Detection & Evasion

### Jak rozpoznać że jest firewall

Jeśli widzisz dużo portów w stanie `filtered` - firewall dropuje pakiety.
Jeśli usługa jest opisana jako `tcpwrapped` - trzy-way handshake przeszedł
ale serwer natychmiast zamknął połączenie bez danych. Firewall albo TCP wrapper.
Jeśli `-sV` nie potrafi wykryć wersji usługi na porcie który jest `open` -
coś siedzi pomiędzy tobą a hostem.

---

### Techniki evasion - kiedy normalny skan nie przechodzi

**Fragmentacja pakietów** - dzielisz pakiety na mniejsze kawałki. Systemy DPI
(Deep Packet Inspection) czasem nie składają ich z powrotem przed analizą:

```bash
# Fragmentuj pakiety na 8-bajtowe kawałki
nmap -f 192.168.1.10

# Podwójna fragmentacja - jeszcze mniejsze
nmap -f -f 192.168.1.10
```

**Decoy scan** - mieszasz swoje IP z fałszywymi. W logach firewalla pojawia się
kilka adresów jednocześnie i nie wiadomo który jest prawdziwy:

```bash
# 5 losowych decoy
nmap -D RND:5 192.168.1.10

# Konkretne decoy + twoje IP na pozycji ME
nmap -D 10.0.0.1,10.0.0.2,ME,10.0.0.3 192.168.1.10
```

**Source port spoofing** - podszywasz się pod port który firewall prawdopodobnie
przepuszcza. Port 53 (DNS) jest często przepuszczany bo wygląda jak normalne
zapytania DNS:

```bash
nmap --source-port 53 192.168.1.10
# albo krócej:
nmap -g 53 192.168.1.10
```

**Dodaj losowe dane do pakietu** - zmienia sygnaturę pakietu, utrudnia
signature-based detection:

```bash
nmap --data-length 25 192.168.1.10
```

**Idle scan / Zombie scan** - wysyłasz pakiety przez inny host (zombie). Twoje IP
w ogóle nie pojawia się w logach celu. Najskuteczniejsza technika ukrycia,
ale wymaga znalezienia odpowiedniego zombie (host z przewidywalnym IP ID):

```bash
sudo nmap -sI <zombie_ip> 192.168.1.10
```

**Kombinacja evasion techniques** - na prawdziwym engagemencie gdzie IDS jest aktywny:

```bash
sudo nmap -sS -T2 -f -D RND:5 --source-port 53 --data-length 50 192.168.1.10
```

---

## Timing & Performance

### Kiedy co używasz

Timing templates regulują agresywność skanu - ile czekasz na odpowiedź, ile
pakietów wysyłasz jednocześnie, ile razy retry:

| Template   | Flaga | Kiedy                                    |
| ---------- | ----- | ---------------------------------------- |
| Paranoid   | `-T0` | IDS evasion, 5 minut między pakietami    |
| Sneaky     | `-T1` | Unikanie IDS, bardzo wolny               |
| Polite     | `-T2` | Prawdziwy engagement, nie obciążaj sieci |
| Normal     | `-T3` | Domyślny                                 |
| Aggressive | `-T4` | CTF, laboratoria, szybkie sieci          |
| Insane     | `-T5` | Tylko lokalnie, ryzyko pominięć          |

Na labach i CTF: `-T4`. Na prawdziwym engagemencie: `-T2` albo `-T3`.

Ręczne ustawienia gdy chcesz więcej kontroli:

```bash
# Ustaw max retries i szybkość pakietów
nmap --max-retries 3 --min-rate 1000 --max-rate 5000 192.168.1.10

# Timeout na hosta - przydatny przy dużych zakresach
nmap --host-timeout 30s 192.168.1.0/24

# Delay między pakietami - na środowiskach produkcyjnych
nmap --scan-delay 500ms 192.168.1.10
```

---

## Nmap Output - zapis wyników

Jedna zasada: **zawsze zapisuj wszystkie formaty jednocześnie.** Po 4 godzinach
sesji nie pamiętasz co było gdzie. XML importuje się do Metasploit.
Gnmap grep-ujesz skryptami. Normal czytasz po ludzku.

```bash
# Trzy formaty jednocześnie (generuje wynik.nmap, wynik.xml, wynik.gnmap)
nmap -sV -sC -O 192.168.1.10 -oA wynik

# Tylko normal (czytelny dla człowieka)
nmap -oN wynik.txt 192.168.1.10

# XML (do importu w Metasploit: db_import wynik.xml)
nmap -oX wynik.xml 192.168.1.10

# Grepable (łatwy do parsowania skryptami)
nmap -oG wynik.gnmap 192.168.1.10
```

Verbosity gdy chcesz widzieć co się dzieje w czasie rzeczywistym:

```bash
nmap -v 192.168.1.10     # verbose
nmap -vv 192.168.1.10    # bardziej verbose
nmap -d 192.168.1.10     # debug
```

---

## Pozostałe narzędzia

### Masscan - gdy masz duży zakres do przeskanowania szybko

Masscan jest szybszy od Nmapa przy skanowaniu dużych sieci - może wysyłać miliony
pakietów na sekundę. Problem: daje tylko otwarte porty, bez service detection.
Strategia: Masscan na zakresie → Nmap na znalezionych hostach i portach:

```bash
# Szybki scan dużej sieci
sudo masscan -p 21,22,80,443,445,3389 --rate 64000 --open-only 192.168.1.0/24

# Z zapisem i całym zakresem portów
sudo masscan -p 0-65535 --rate 64000 --open-only -oG masscan_wyniki.gnmap 192.168.1.0/24
```

### Wireshark - gdy chcesz widzieć co faktycznie idzie w sieci

Wireshark nie zastępuje Nmapa - uzupełnia go. Używaj gdy chcesz zweryfikować co
Nmap faktycznie wysyła, albo gdy siedzisz w sieci i chcesz pasywnie zebrać
informacje zanim zaczniesz aktywnie skanować.

```
# Przydatne filtry w Wireshark:
arp                       → tylko ARP (znajdź hosty w LAN)
icmp                      → tylko ping
tcp.port == 80            → tylko HTTP
ip.addr == 10.10.10.1     → ruch z/do konkretnego IP
tcp.flags.syn == 1        → tylko SYN pakiety
```

### MSF + Nmap - import wyników do Metasploit

Msfconsole ma wbudowaną bazę danych. Importujesz wyniki Nmapa (XML) i Metasploit
pamięta hosty, porty i usługi przez całą sesję. Możesz też odpalać skan bezpośrednio
z MSF i zapisuje się automatycznie:

```bash
# W msfconsole - stwórz workspace i importuj
workspace -a moj_target
db_import /home/kali/wynik.xml

# Przegląd co masz
hosts
services
vulns

# Skan bezpośrednio z MSF (zapisuje do bazy)
db_nmap -sV -sC -O 192.168.1.10

# Port scan przez MSF auxiliary
use auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.1.0/24
set PORTS 1-1000
run
```

---

## Gdzie najczęściej coś się traci

**Skanowanie tylko top 1000 portów.** Top 1000 to heurystyka, nie gwarancja.
Jeśli standardowy scan daje mało - `-p-` i nie żałuj czasu. Jenkins na 8080,
Grafana na 3000, Elasticsearch na 9200 nie trafią ci się w top 1000.

**Pomijanie UDP.** SNMP (161) bez community stringa daje pełny zrzut informacji
o routerze. DNS (53) to potencjalny zone transfer. NFS (2049) może dać dostęp
do share'ów bez autoryzacji. Każdy z tych portów może być złotem.

**Zakładanie że `filtered` = nic tam nie ma.** Filtered znaczy że pakiety są
blokowane. Usługa tam siedzi - tylko ją osłaniają. Próbuj technik evasion,
zmień source port, fragmentuj pakiety.

**Ignorowanie certyfikatów SSL.** SANs (Subject Alternative Names) w certyfikacie
często zawierają subdomeny których nie znalazłeś nigdzie indziej. `-sC` wypluje to
automatycznie w sekcji `ssl-cert`. Zawsze na to patrz.

**Nieużywanie `-oA`.** Po sesji tracisz kontekst. XML importuje się do Metasploit.
Grepable pozwala szybko wyciągnąć tylko otwarte porty. `-oA` jest darmowe i zajmuje
sekundy. Zawsze.

**Brak wariantu z `-Pn`** gdy hosty nie odpowiadają na ping. Środowiska produkcyjne
często blokują ICMP z zasady. Host który "nie odpowiada na ping" może mieć
otwarte 15 portów - po prostu dropuje Echo Request.

**Ignorowanie TTL w odpowiedzi.** TTL z pinga albo z wyniku Nmapa to szybki wskaźnik
OS. TTL~64 → Linux. TTL~128 → Windows. Nie jest niezawodny po wielu hopach,
ale w sieci lokalnej jest dokładny.

---

## Strategia na egzaminie eJPT

eJPT często daje ci kilka sieci. Twoja Kali ma dostęp do pierwszej.
Hosty w pierwszej mają dostęp do drugiej. Musisz to rozgryźć przez routing.

```bash
# Sprawdź tablicę routingu - jakie sieci masz dostępne z tej maszyny
ip route
# albo:
route -n

# Sprawdź interfejsy sieciowe
ip a
ifconfig

# Ping test do docelowej sieci (sprawdź pivot)
ping -c 1 10.10.10.1
```

Potem idź metodycznie:

```
1. ip route → jakie sieci są dostępne z tej maszyny
2. nmap -sn <sieć>/24 → które hosty żyją
3. nmap -sV -sC -O -T4 <żywe_ip> -oA initial → profil każdego hosta
4. nmap -p- <hosty z małą liczbą portów> → niestandardowe porty
5. NSE scripts na znalezionych usługach
```

**Typowe pytania na eJPT z tej sekcji:**

- Jaki system operacyjny działa na hoście X?
- Jaka wersja usługi działa na porcie Y?
- Ile hostów jest aktywnych w sieci X.X.X.0/24?
- Jakie porty są otwarte na hoście X?
- Jaka jest wersja serwera HTTP na porcie 80?
- Czy FTP na hoście X akceptuje anonymous login?

---

## Kompletny workflow

```
┌─────────────────────────────────────────┐
│  1. DEFINE SCOPE                        │
│     Jaki zakres IP / domeny?            │
│     Co jest in/out-of-scope?            │
│     Autoryzacja?                        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. HOST DISCOVERY                      │
│                                         │
│  nmap -sn 192.168.1.0/24               │
│    └─ które IP żyją                     │
│                                         │
│  sudo arp-scan --localnet               │
│    └─ ARP na LAN (niezawodniejszy)      │
│                                         │
│  Zapisz żywe hosty do pliku             │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. PORT SCANNING                       │
│                                         │
│  nmap -sV -sC -O -T4 -oA initial       │
│    └─ profil każdego żywego hosta       │
│                                         │
│  nmap -p- gdy mało portów               │
│    └─ niestandardowe porty              │
│                                         │
│  sudo nmap -sU --top-ports 25           │
│    └─ UDP - SNMP, DNS, NFS              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  4. TARGETED NSE                        │
│                                         │
│  Na podstawie znalezionych usług:       │
│  SMB → smb-vuln-ms17-010, enum-shares  │
│  FTP → ftp-anon                         │
│  HTTP → http-enum, http-title           │
│  MySQL → mysql-empty-password           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  5. DOCUMENT                            │
│     Lista żywych hostów z portami       │
│     Wersje usług → Searchsploit         │
│     TTL → OS estimation                 │
│     → Wchodzisz w enumerację            │
└─────────────────────────────────────────┘
```

---

## Cheat sheet - to co mam pod ręką podczas pracy

```bash
# ── HOST DISCOVERY ────────────────────────────────────────
# Ping sweep
nmap -sn 192.168.1.0/24

# Ping sweep → zapisz żywe IP
nmap -sn -T4 192.168.1.0/24 -oG - | awk '/Up$/{print $2}' > live_hosts.txt

# ARP scan na LAN (wymaga root)
sudo arp-scan -I eth0 --localnet
sudo nmap -PR -sn 192.168.1.0/24

# Gdy ICMP zablokowany
nmap -Pn -PS22,80,443 192.168.1.0/24

# fping
fping -I eth0 -g 192.168.1.0/24 -a 2>/dev/null

# ── PORT SCANNING ─────────────────────────────────────────
# Szybki profil (top 1000)
nmap -sV -sC -O -T4 192.168.1.10 -oA initial

# Wszystkie porty
nmap -p- -T4 192.168.1.10 -oA full

# Pomiń ping, skanuj wszystkie porty z pełnym profilowaniem
nmap -Pn -sV -T4 -A -p- -oA full_pn 192.168.1.10

# Fast top 100
nmap -F 192.168.1.10

# UDP top 25
sudo nmap -sU --top-ports 25 192.168.1.10

# Skanuj z listy hostów
nmap -sV -sC -T4 -oA multi_scan -iL live_hosts.txt

# ── SERVICE & OS ──────────────────────────────────────────
nmap -sV 192.168.1.10                    # wersje usług
sudo nmap -O 192.168.1.10                # OS detection
nmap -A 192.168.1.10                     # wszystko naraz

# ── NSE ──────────────────────────────────────────────────
nmap -sC 192.168.1.10                    # domyślne skrypty
nmap --script=vuln 192.168.1.10          # vuln scan

nmap -p 21 --script ftp-anon 192.168.1.10
nmap -p 80,443 --script http-title,http-headers,http-enum 192.168.1.10
nmap -p 445 --script smb-vuln-ms17-010,smb-enum-shares 192.168.1.10
nmap -p 3306 --script mysql-info,mysql-empty-password 192.168.1.10
nmap -p 22 --script ssh-auth-methods 192.168.1.10

ls /usr/share/nmap/scripts/ | grep smb   # szukaj skryptów

# ── FIREWALL EVASION ─────────────────────────────────────
nmap -f 192.168.1.10                     # fragmentacja
nmap -D RND:5 192.168.1.10              # decoy scan
nmap -g 53 192.168.1.10                 # source port spoofing
nmap --data-length 25 192.168.1.10      # losowe dane w pakiecie

# Kombinacja evasion
sudo nmap -sS -T2 -f -D RND:5 -g 53 --data-length 50 192.168.1.10

# ── OUTPUT ───────────────────────────────────────────────
nmap -oA wynik 192.168.1.10              # zawsze tak
nmap -oN wynik.txt 192.168.1.10          # czytelny
nmap -oX wynik.xml 192.168.1.10          # XML do MSF
nmap -oG wynik.gnmap 192.168.1.10        # grepable

# ── MSF INTEGRATION ──────────────────────────────────────
db_import wynik.xml                      # importuj wyniki Nmapa
db_nmap -sV -sC -O 192.168.1.10         # skan bezpośrednio z MSF
hosts                                    # pokaż znane hosty
services                                 # pokaż znane usługi

# ── SEARCHSPLOIT ──────────────────────────────────────────
searchsploit apache 2.4.49
searchsploit openssh 7.4
searchsploit vsftpd 2.3.4
searchsploit "windows smb"

# ── ROUTING CHECK ─────────────────────────────────────────
ip route                                 # tablica routingu
ip a                                     # interfejsy
ping -c 1 10.10.10.1                     # test pivot
```

---

## Jedna rzecz którą zatrzymuję

Port scan to nie cel sam w sobie. To jest narzędzie do budowania mapy ataku.
`open` na porcie 445 bez `smb-vuln-ms17-010` to zmarnowana informacja.
Wersja usługi bez Searchsploit to zmarnowany czas. Każdy wynik Nmapa jest
punktem wejścia do kolejnego pytania - nie końcem pracy.
