---
id: network-infrastructure-security-introduction
title: "Bezpieczeństwo sieci i infrastruktury: od czego zaczyna się realny pentest"
team: red-blue
domain: network-infrastructure
section: foundations
type: knowledge
angle: infrastructure-recon-mindset
sourceTrack: netMaster
tags: ["recon", "enumeration", "ports", "services", "nmap", "masscan", "linux", "pentest"]
difficulty: easy
shortDescription: "Wprowadzenie do bezpieczeństwa sieci i infrastruktury od zera: czym są hosty, porty i usługi, dlaczego rekonesans oraz enumeracja są fundamentem pentestu infrastruktury i jak zbudować pierwszy workflow do labów sieciowych."
updatedAt: "2026-05-05"
---

# Bezpieczeństwo sieci i infrastruktury: od czego zaczyna się realny pentest

W bezpieczeństwie aplikacji webowych często zaczynamy od formularza, endpointu, ciasteczka albo parametru w URL.

W bezpieczeństwie sieci zaczynamy wcześniej.

Zanim pojawi się exploit, reverse shell, pivotowanie, eskalacja uprawnień albo przejęcie domeny Active Directory, trzeba odpowiedzieć na dużo prostsze pytania:

**Co w ogóle istnieje w tej sieci?**

Jakie są hosty?  
Jakie mają adresy IP?  
Jakie porty są otwarte?  
Jakie usługi tam działają?  
Czy to jest SSH, HTTP, FTP, SMB, baza danych, panel administracyjny, drukarka, monitoring, a może coś własnego?  
Czy usługa działa na standardowym porcie, czy ktoś przeniósł ją w nietypowe miejsce?  
Czy baner mówi prawdę, czy tylko udaje konkretną technologię?

To jest właśnie pierwszy duży fundament testów infrastruktury.

Nie exploitacja.

**Enumeracja.**

Bo w sieci nie da się zaatakować czegoś, czego nie widzisz.

---

## 1. Czym właściwie jest bezpieczeństwo sieci i infrastruktury?

Bezpieczeństwo sieci i infrastruktury to obszar, który skupia się na systemach, usługach i połączeniach między nimi.

W praktyce oznacza to analizę takich elementów jak:

- serwery Linux,
- serwery Windows,
- Active Directory,
- usługi SSH, FTP, SMB, RDP, HTTP, HTTPS,
- bazy danych,
- panele administracyjne,
- urządzenia sieciowe,
- systemy monitoringu,
- segmentacja sieci,
- firewalle,
- VPN-y,
- wewnętrzne aplikacje,
- publicznie wystawione zasoby organizacji.

W web security patrzymy głównie na aplikację.

W infrastructure security patrzymy na całe środowisko, w którym ta aplikacja żyje.

Aplikacja webowa może być bezpieczna na poziomie kodu, ale nadal działać na serwerze z otwartym panelem administracyjnym, starym FTP, podatnym SMB albo źle skonfigurowanym SSH.

Dlatego dobry pentester infrastruktury nie pyta od razu:

> jaki payload tu wkleić?

Tylko najpierw pyta:

> co tutaj działa, gdzie działa, po co działa i czy powinno być dostępne?

---

## 2. Najważniejsza zmiana myślenia

Początkujący często myślą, że pentest sieci wygląda tak:

1. odpalam skaner,
2. widzę CVE,
3. uruchamiam exploit,
4. mam roota.

Czasami tak bywa w bardzo prostych labach.

Ale w realnym procesie dużo częściej wygląda to tak:

1. znajdujesz hosty,
2. identyfikujesz porty,
3. rozpoznajesz usługi,
4. sprawdzasz wersje i konfigurację,
5. testujesz domyślne zachowania,
6. szukasz błędów administracyjnych,
7. łączysz małe obserwacje w większy scenariusz,
8. dopiero potem pojawia się exploitacja.

Największą wartością na początku nie jest znajomość 1000 exploitów.

Największą wartością jest umiejętność powiedzenia:

> Widzę hosta. Widzę port. Widzę usługę. Rozumiem, co to może oznaczać. Wiem, jaki będzie następny sensowny krok.

To jest operator mindset.

---

## 3. Host, port, usługa - trzy słowa, które trzeba rozumieć

### Host

Host to urządzenie w sieci.

Może to być serwer, komputer użytkownika, router, drukarka, kamera, maszyna wirtualna albo kontener.

W labach najczęściej hostem będzie adres IP, np.:

```bash
10.10.10.5
192.168.56.101
172.16.1.20
```

Pierwsze pytanie brzmi:

> które hosty są aktywne?

Nie ma sensu skanować usług na maszynie, która nie odpowiada albo nie istnieje.

---

### Port

Port to punkt wejścia do konkretnej usługi.

Przykłady:

| Port | Typowa usługa     | Co może oznaczać              |
| ---: | ----------------- | ----------------------------- |
|   21 | FTP               | transfer plików               |
|   22 | SSH               | zdalna powłoka Linux/Unix     |
|   25 | SMTP              | poczta wychodząca             |
|   53 | DNS               | rozwiązywanie nazw            |
|   80 | HTTP              | aplikacja webowa bez TLS      |
|  443 | HTTPS             | aplikacja webowa z TLS        |
|  445 | SMB               | udziały plików / Windows / AD |
| 3389 | RDP               | zdalny pulpit Windows         |
| 3306 | MySQL             | baza danych                   |
| 5432 | PostgreSQL        | baza danych                   |
| 8080 | HTTP alternatywny | panel, API, dev app, proxy    |

Port sam w sobie nie jest podatnością.

Otwarty port to informacja:

> tutaj coś słucha.

Dopiero usługa, wersja, konfiguracja i kontekst mówią, czy jest problem.

---

### Usługa

Usługa to konkretny program działający na porcie.

Na przykład:

```text
22/tcp open  ssh     OpenSSH 8.4
80/tcp open  http    Apache httpd 2.4.54
445/tcp open smb     Samba smbd
```

To jest dużo bardziej wartościowe niż sama informacja „port 22 jest otwarty”.

Bo teraz możemy zapytać:

- jaka to technologia?
- jaka wersja?
- czy wersja jest stara?
- czy pozwala na anonimowy dostęp?
- czy ma domyślne dane logowania?
- czy pokazuje zbyt dużo informacji?
- czy da się z nią ręcznie porozmawiać?
- czy istnieją znane podatności?
- czy konfiguracja jest bezpieczna?

---

## 4. Rekonesans sieciowy - po co go robimy?

Rekonesans sieciowy to proces zbierania informacji o sieci i usługach.

Jego celem nie jest „odpalenie jak największej liczby narzędzi”.

Celem jest zbudowanie mapy.

Na początku chcesz wiedzieć:

```text
Zakres sieci:
192.168.1.0/24

Aktywne hosty:
192.168.1.1
192.168.1.10
192.168.1.15

Otwarte porty:
192.168.1.10:22
192.168.1.10:80
192.168.1.15:445
192.168.1.15:3389

Usługi:
OpenSSH
Apache
SMB
RDP

Hipotezy:
- host 192.168.1.10 może być serwerem Linux
- port 80 wymaga enumeracji webowej
- host 192.168.1.15 wygląda jak Windows
- SMB może ujawnić udziały, użytkowników albo nazwę domeny
```

To jeszcze nie jest atak.

To jest rozpoznanie terenu.

Bez tego późniejsze kroki będą chaosem.

---

## 5. Pierwszy proces w labie sieciowym

Kiedy dostajesz zadanie typu:

> Przeskanuj sieć, znajdź usługi i zdobądź flagę.

Nie zaczynaj od exploitów.

Zacznij od prostego procesu.

---

### Krok 1: sprawdź, gdzie jesteś

Na maszynie atakującej sprawdź interfejsy sieciowe:

```bash
ip a
```

Szukasz informacji:

- jaki masz adres IP,
- jaka jest maska sieci,
- w jakiej podsieci jesteś,
- który interfejs jest aktywny.

Przykład:

```text
inet 192.168.56.10/24
```

To oznacza, że prawdopodobnie interesujący zakres to:

```text
192.168.56.0/24
```

Czyli hosty od:

```text
192.168.56.1 do 192.168.56.254
```

---

### Krok 2: znajdź aktywne hosty

Pierwszy skan może wyglądać tak:

```bash
nmap -sn 192.168.56.0/24 -oG hosts.gnmap
```

Co robi ta komenda?

- `-sn` - wykonuje host discovery, czyli próbuje ustalić, które hosty żyją,
- `192.168.56.0/24` - skanuje całą podsieć,
- `-oG hosts.gnmap` - zapisuje wynik w formacie łatwym do późniejszego parsowania.

Na tym etapie nie szukamy jeszcze portów.

Szukamy odpowiedzi:

> które adresy IP są aktywne?

---

### Krok 3: przeskanuj porty

Dla małego laba można zacząć prosto:

```bash
nmap -Pn -sV -p- --open 192.168.56.101 -oA nmap-full
```

Co robi ta komenda?

- `-Pn` - nie sprawdza wcześniej, czy host odpowiada na ping; traktuje go jako aktywny,
- `-sV` - próbuje rozpoznać wersje usług,
- `-p-` - skanuje wszystkie porty TCP od 1 do 65535,
- `--open` - pokazuje tylko otwarte porty,
- `-oA nmap-full` - zapisuje wyniki w kilku formatach naraz.

To jest jedna z najważniejszych komend na start.

Nie dlatego, że jest magiczna.

Dlatego, że daje konkret:

```text
host → port → usługa → wersja
```

---

### Krok 4: zrób notatkę z wyników

Nie trzymaj wyników tylko w terminalu.

Zapisuj je.

Minimalna tabela:

| Host           | Port | Usługa | Wersja / baner | Następny krok                     |
| -------------- | ---: | ------ | -------------- | --------------------------------- |
| 192.168.56.101 |   22 | SSH    | OpenSSH        | sprawdzić baner, metody logowania |
| 192.168.56.101 |   80 | HTTP   | Apache         | wejść w przeglądarce, fuzzing     |
| 192.168.56.102 |  445 | SMB    | Samba          | enum4linux / smbclient            |
| 192.168.56.103 |   21 | FTP    | vsftpd         | anonymous login, baner, pliki     |

To zmienia sposób pracy.

Zamiast „mam dużo outputu z nmapa”, masz mapę działania.

---

## 6. Jak myśleć po znalezieniu portu?

Każdy port powinien uruchomić w głowie pytanie:

> z jaką usługą mam do czynienia i jak normalnie się ją enumeruje?

Przykład:

### Port 22 - SSH

Pytania:

- czy znam użytkownika?
- czy logowanie hasłem jest włączone?
- czy baner zdradza wersję?
- czy to stara wersja OpenSSH?
- czy mam klucz prywatny znaleziony gdzieś indziej?

Podstawowa interakcja:

```bash
nc 192.168.56.101 22
```

Albo:

```bash
ssh user@192.168.56.101
```

Na początku nie brute-force’uj bez sensu.

Najpierw sprawdź, czy masz jakiekolwiek dane wejściowe: użytkowników, hasła, klucze, pliki z weba, backupy.

---

### Port 80 / 443 - HTTP / HTTPS

Pytania:

- co jest na stronie?
- czy są ukryte katalogi?
- czy aplikacja ma panel logowania?
- czy są komentarze w HTML?
- czy są pliki typu backup, config, old?
- czy jest robots.txt?
- czy jest sitemap.xml?
- czy są inne vhosty?
- czy aplikacja zdradza technologię?

Pierwsze kroki:

```bash
curl -i http://192.168.56.101/
```

```bash
whatweb http://192.168.56.101/
```

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://192.168.56.101/FUZZ
```

Jeśli to web, nie ograniczaj się do nmapa.

Otwórz stronę w przeglądarce.

Klikaj.

Patrz na requesty.

Użyj Burpa.

---

### Port 445 - SMB

Pytania:

- czy host jest Windowsem?
- czy można listować udziały anonimowo?
- czy widać nazwę hosta?
- czy widać domenę?
- czy są udziały z plikami?
- czy można odczytać backupy, skrypty, konfiguracje?

Przykładowe pierwsze kroki:

```bash
smbclient -L //192.168.56.101/ -N
```

```bash
enum4linux-ng 192.168.56.101
```

SMB często nie daje od razu roota.

Ale może dać coś lepszego: informacje.

Nazwy użytkowników.
Nazwy udziałów.
Pliki konfiguracyjne.
Backupy.
Hasła zapisane w skryptach.
Ścieżki do kolejnych systemów.

---

### Port 21 - FTP

Pytania:

- czy działa anonymous login?
- czy da się listować pliki?
- czy można coś pobrać?
- czy można coś wysłać?
- czy baner zdradza wersję?

Przykład:

```bash
ftp 192.168.56.101
```

Spróbuj:

```text
anonymous
anonymous
```

Jeśli wejdziesz anonimowo, nie kończ na samym „działa”.

Sprawdź:

```bash
ls
pwd
get nazwa_pliku
```

---

## 7. Baner usługi - mała rzecz, duża wartość

Baner to informacja, którą usługa pokazuje przy połączeniu.

Przykład:

```text
SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8
```

Albo:

```text
220 vsFTPd 3.0.3
```

Baner może powiedzieć:

- jaka usługa działa,
- jaka jest wersja,
- jaki system może być pod spodem,
- czy technologia jest potencjalnie stara,
- czy warto sprawdzić znane podatności.

Ale baner może też kłamać.

Administrator może go zmienić.
Proxy może coś ukrywać.
Usługa może wyglądać jak jedna rzecz, a zachowywać się jak inna.

Dlatego baner traktujemy jako wskazówkę, nie jako prawdę absolutną.

---

## 8. Skanowanie dużych sieci - prosty model

W małych labach często wystarczy nmap.

W większych sieciach proces może wyglądać inaczej:

1. znajdź aktywne hosty,
2. szybko znajdź otwarte porty,
3. dopiero potem zbierz dokładne banery.

Przykładowy model:

```bash
nmap -sn 192.168.0.0/16 -oG aktywne_hosty.gnmap
```

Potem lista żywych hostów do pliku:

```bash
grep "Up" aktywne_hosty.gnmap | awk '{print $2}' > hosty_up.txt
```

Szybkie skanowanie portów:

```bash
masscan -Pn -iL hosty_up.txt -p- -oX wynik_masscan.xml --rate=5000
```

A potem dokładniejsza enumeracja nmapem.

W praktyce idea jest prosta:

```text
masscan = szybko znajdź otwarte porty
nmap = dokładniej rozpoznaj usługi
```

Nie chodzi o to, żeby zawsze używać masscana.

Chodzi o zrozumienie, że narzędzia mają różne role.

---

## 9. Rekonesans aktywny vs pasywny

### Rekonesans aktywny

To wszystko, gdzie dotykasz celu bezpośrednio.

Przykłady:

```bash
nmap
masscan
ffuf
curl
nc
hydra
nuclei
```

Wysyłasz pakiety do celu.

Cel może to zobaczyć w logach.

---

### Rekonesans pasywny

To zbieranie informacji bez bezpośredniego skanowania celu.

Przykłady:

- wyszukiwarki certyfikatów TLS,
- historia DNS,
- Shodan,
- Censys,
- SecurityTrails,
- DNSDumpster,
- publiczne repozytoria,
- wycieki,
- subdomeny,
- stare rekordy DNS.

W realnych testach pasywny rekonesans jest bardzo ważny, bo czasem klient nie daje gotowej listy adresów IP.

Trzeba samemu ustalić:

- jakie domeny należą do organizacji,
- jakie subdomeny istnieją,
- jakie adresy IP są powiązane z firmą,
- co jest wystawione publicznie,
- czy istnieją stare, zapomniane systemy.

W labach najczęściej dostaniesz zakres.

W realu często musisz go najpierw zbudować.

---

## 10. Fuzzing weba jako część infrastruktury

Jeśli podczas skanowania znajdziesz HTTP lub HTTPS, wchodzisz na teren web security.

Ale nadal jest to część pentestu infrastruktury, bo usługa webowa jest jednym z elementów hosta.

Przykład:

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://192.168.56.101/FUZZ
```

Szukasz między innymi:

- ukrytych katalogów,
- paneli administracyjnych,
- backupów,
- plików konfiguracyjnych,
- endpointów API,
- starych wersji aplikacji,
- ścieżek typu `/dev`, `/test`, `/admin`, `/backup`.

Dobry wynik fuzzingu to nie tylko status `200`.

Patrz też na:

- rozmiar odpowiedzi,
- przekierowania,
- kody 401/403,
- nietypowe długości,
- różnice między odpowiedziami,
- nazwy katalogów,
- technologie zdradzone w nagłówkach.

---

## 11. Interakcja z usługą jest ważniejsza niż sam skan

Nmap mówi:

```text
21/tcp open ftp
```

Ale to dopiero początek.

Teraz trzeba z usługą porozmawiać.

Dla FTP:

```bash
ftp 192.168.56.101
```

Dla HTTP:

```bash
curl -i http://192.168.56.101/
```

Dla surowego połączenia TCP:

```bash
nc 192.168.56.101 1234
```

Dla TLS:

```bash
ncat --ssl 192.168.56.101 443
```

Skaner daje mapę.

Ręczna interakcja daje zrozumienie.

A w pentestach bardzo często wygrywa nie ten, kto odpalił najwięcej narzędzi, tylko ten, kto zauważył mały szczegół w odpowiedzi usługi.

---

## 12. Brute-force nie jest pierwszym krokiem

Hydra, Medusa i podobne narzędzia są przydatne.

Przykład dla SSH:

```bash
hydra -l user -P passwords.txt ssh://192.168.56.101
```

Ale brute-force bez kontekstu jest słabą strategią.

Zanim zaczniesz zgadywać hasła, zapytaj:

- czy mam listę użytkowników?
- czy mam realną listę haseł?
- czy aplikacja ma rate limit?
- czy konto może się zablokować?
- czy to jest lab, gdzie brute-force jest celem zadania?
- czy istnieje lepsza ścieżka, np. plik konfiguracyjny, backup, anonymous FTP, SMB share?

Brute-force to narzędzie.

Nie plan.

---

## 13. Minimalny workflow do pierwszych zadań sieciowych

Ten workflow możesz stosować w prostych labach infrastrukturalnych.

### 1. Sprawdź swoją sieć

```bash
ip a
ip route
```

Ustal:

```text
mój IP:
moja podsieć:
brama:
interfejs:
```

---

### 2. Znajdź hosty

```bash
nmap -sn <zakres> -oG hosts.gnmap
```

---

### 3. Przeskanuj porty

```bash
nmap -Pn -sV -p- --open <host> -oA nmap-full-<host>
```

---

### 4. Zrób tabelę usług

```text
HOST:
PORT:
SERVICE:
VERSION:
NOTES:
NEXT STEP:
```

---

### 5. Enumeruj każdą usługę osobno

Nie przeskakuj chaotycznie.

Dla każdego portu odpowiedz:

```text
Co to jest?
Jak się z tym połączyć?
Czy są domyślne dane?
Czy da się listować zasoby?
Czy wersja jest znana?
Czy konfiguracja coś ujawnia?
Czy są pliki, użytkownicy, katalogi, banery, nagłówki?
```

---

### 6. Dopiero potem szukaj podatności

Jeśli masz:

```text
Apache 2.4.x
OpenSSH 8.x
Samba 3.x
vsftpd 2.3.4
Tomcat
Jenkins
Grafana
MongoDB
Redis
```

Wtedy możesz szukać:

- znanych podatności,
- domyślnych haseł,
- błędnych konfiguracji,
- publicznych paneli,
- nieautoryzowanego dostępu,
- starych wersji,
- ścieżek eskalacji.

---

## 14. Co początkujący najczęściej robią źle?

### 1. Skanują tylko domyślne 1000 portów

Nmap domyślnie nie skanuje wszystkich portów.

Jeśli usługa działa na porcie `31337`, możesz jej nie zobaczyć.

Dlatego w labach często warto użyć:

```bash
-p-
```

---

### 2. Nie zapisują wyników

Terminal znika.
Historia się miesza.
Nie wiadomo, co było testowane.

Zapisuj output:

```bash
-oA
-oN
-oG
-oX
```

---

### 3. Patrzą tylko na CVE

Nie każda podatność ma CVE.

Błędy konfiguracyjne często są ważniejsze niż gotowe exploity.

Przykłady:

- anonymous FTP,
- publiczny SMB share,
- panel admina bez hasła,
- backup `.zip` w katalogu webowym,
- Redis bez autoryzacji,
- MongoDB wystawione do sieci,
- stare dane logowania w pliku konfiguracyjnym.

---

### 4. Nie rozumieją usługi

Jeśli widzisz SMB i nie wiesz, co to jest, to nie wiesz, czego szukać.

Jeśli widzisz DNS i nie znasz transferu strefy, możesz pominąć ważny trop.

Jeśli widzisz HTTP i nie sprawdzisz katalogów, możesz ominąć cały lab.

Narzędzie nie zastąpi rozumienia protokołu.

---

### 5. Robią wszystko naraz

Dobry proces jest spokojny:

```text
hosty → porty → usługi → enumeracja → hipotezy → testy → dowody
```

Nie:

```text
nmap → exploit-db → random payload → frustracja
```

---

## 15. Jak robić notatki podczas pentestu sieci?

Prosty format:

```markdown
## Host: 192.168.56.101

### Otwarte porty

| Port | Usługa | Wersja      | Notatki                                  |
| ---: | ------ | ----------- | ---------------------------------------- |
|   22 | SSH    | OpenSSH 8.4 | login hasłem włączony                    |
|   80 | HTTP   | Apache      | strona statyczna, możliwy katalog /admin |
|  445 | SMB    | Samba       | anonymous listing do sprawdzenia         |

### Hipotezy

- HTTP może mieć ukryte katalogi.
- SMB może ujawniać pliki lub użytkowników.
- SSH raczej będzie użyteczne dopiero po zdobyciu danych logowania.

### Wykonane testy

- nmap full TCP
- curl na /
- ffuf z common.txt
- smbclient anonymous

### Znaleziska

- /backup zwraca 200
- SMB pozwala listować udział public
- w backupie znaleziono config z hasłem

### Następny krok

- sprawdzić hasło do SSH dla znalezionych użytkowników
```

Takie notatki sprawiają, że myślisz jak pentester, a nie jak operator losowych komend.

---

## 16. Mini-playbook: pierwsza godzina w labie sieciowym

```bash
# 1. Gdzie jestem?
ip a
ip route

# 2. Jaką sieć mogę skanować?
# przykład: jeśli masz 192.168.56.10/24, skanujesz 192.168.56.0/24

# 3. Host discovery
nmap -sn 192.168.56.0/24 -oG hosts.gnmap

# 4. Wyciągnięcie hostów
grep "Up" hosts.gnmap | awk '{print $2}' > hosts.txt

# 5. Pełny skan TCP z wersjami usług
nmap -Pn -sV -p- --open -iL hosts.txt -oA nmap-full

# 6. Szybki podgląd wyników
grep -E "open|Nmap scan report" nmap-full.nmap

# 7. Dla weba
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://TARGET/FUZZ

# 8. Dla ręcznej interakcji
nc TARGET PORT

# 9. Dla HTTP
curl -i http://TARGET/

# 10. Dla SMB
smbclient -L //TARGET/ -N
```

To nie jest pełna metodologia.

To jest pierwszy szkielet.

Ale taki szkielet wystarczy, żeby zacząć rozwiązywać wiele podstawowych zadań.

---

## 17. Co powinieneś umieć po tym wprowadzeniu?

Po tej notatce powinieneś rozumieć:

- czym różni się host, port i usługa,
- po co robi się rekonesans sieciowy,
- dlaczego enumeracja jest ważniejsza niż losowe exploity,
- jak znaleźć aktywne hosty,
- jak przeskanować wszystkie porty,
- jak zebrać banery usług,
- jak zacząć interakcję z wykrytymi usługami,
- dlaczego HTTP, SMB, FTP i SSH wymagają różnych sposobów enumeracji,
- jak robić proste notatki z testu,
- jak zbudować pierwszy workflow do labów sieciowych.

Najważniejsze zdanie do zapamiętania:

> W pentestach infrastruktury najpierw budujesz mapę. Dopiero potem szukasz drogi wejścia.

---

## 18. Mental model na start

Kiedy patrzysz na wynik skanowania, nie czytaj go jak listy portów.

Czytaj go jak opowieść o systemie.

```text
22/tcp open ssh
80/tcp open http
445/tcp open smb
```

To może znaczyć:

```text
Mam maszynę, która prawdopodobnie pozwala na zdalne logowanie,
wystawia aplikację webową
i udostępnia zasoby plikowe.
```

Teraz pytanie brzmi:

```text
Która z tych usług powie mi coś o pozostałych?
```

Może web ujawni użytkownika.
Może SMB ujawni hasło.
Może FTP pozwoli pobrać backup.
Może SSH będzie dopiero końcowym wejściem.
Może jedna mała informacja z banera połączy się z drugą informacją z katalogu `/backup`.

Tak wygląda prawdziwe uczenie się bezpieczeństwa sieci.

Nie chodzi o jedną komendę.

Chodzi o łączenie faktów.

---

## 19. Następny krok w nauce

Jeżeli dopiero zaczynasz, nie próbuj od razu uczyć się wszystkiego: Active Directory, pivotowania, Kerberoastingu, tunelowania, exploit developmentu i red teamingu.

Zacznij od fundamentu:

1. Naucz się czytać wynik `ip a`.
2. Naucz się rozumieć podsieci `/24`, `/16`, `/32`.
3. Naucz się robić host discovery.
4. Naucz się skanować wszystkie porty.
5. Naucz się rozpoznawać podstawowe usługi.
6. Naucz się ręcznie łączyć z usługami.
7. Naucz się robić notatki.
8. Naucz się zadawać pytanie: „co ta usługa może mi powiedzieć?”

Dopiero wtedy exploitacja zaczyna mieć sens.

Bo exploit bez enumeracji to zgadywanie.

A enumeracja to fundament, na którym stoi cały pentest infrastruktury.
