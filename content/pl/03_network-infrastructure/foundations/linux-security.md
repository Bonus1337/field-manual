---
title: "Linux Post-Exploitation: enumeracja i eskalacja uprawnień"
domain: network-infrastructure
category: "Post Exploitation"
tags: ["Linux", "Post Exploitation", "Privilege Escalation", "Enumeration, Hardening"]
team: red
section: post-exploitation
type: knowledge
sourceTrack: netMaster
difficulty: medium
shortDescription: "Praktyczny workflow analizy hosta Linux po uzyskaniu dostępu: użytkownicy, sudo, uprawnienia plików, SUID, cron, PATH, logi, Docker oraz mechanizmy ochronne."
updatedAt: "2026-07-21"
---

# Linux Post-Exploitation: enumeracja i eskalacja uprawnień

Po uzyskaniu dostępu do systemu Linux jako ograniczony użytkownik kolejnym celem jest zrozumienie środowiska i znalezienie drogi do wyższych uprawnień.

Nie zaczynamy od przypadkowego uruchamiania exploitów na kernel.

Najpierw próbujemy odpowiedzieć na kilka podstawowych pytań:

```text
Kim jestem?
Do jakich grup należę?
Co działa jako root?
Co mogę odczytać?
Co mogę zmodyfikować?
Co zostanie później wykonane z wyższymi uprawnieniami?
```

Najczęstszy schemat eskalacji wygląda następująco:

```text
uprzywilejowany proces
        +
plik, katalog lub polecenie kontrolowane przez zwykłego użytkownika
        =
potencjalna eskalacja uprawnień
```

---

## Pierwsza orientacja w systemie

Na początku zbieramy podstawowe informacje o użytkowniku, hoście i systemie operacyjnym.

```bash
whoami
id
groups
hostname
uname -a
cat /etc/os-release
```

Najważniejsze informacje to:

- aktualny użytkownik,
- UID i GID,
- dodatkowe grupy,
- wersja dystrybucji,
- wersja kernela,
- architektura systemu.

Przykład:

```text
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Oznacza to, że uzyskaliśmy dostęp w kontekście serwera [WWW](http://WWW).

Nie posiadamy jeszcze uprawnień administratora, ale proces aplikacji może mieć dostęp do konfiguracji, sekretów, lokalnych usług lub plików, które pomogą w dalszej eskalacji.

---

## Procesy, usługi i porty

Następnie sprawdzamy, co działa na hoście.

```bash
ps auxf
ss -tulnp
systemctl --type=service --state=running
```

Szukamy przede wszystkim:

- procesów działających jako root,
- niestandardowych aplikacji,
- skryptów uruchamianych automatycznie,
- lokalnych usług niewidocznych podczas zewnętrznego skanowania,
- procesów korzystających z plików, które możemy modyfikować.

Przykład:

```text
LISTEN 0 128 0.0.0.0:22
LISTEN 0 128 127.0.0.1:3306
```

Port `22` jest dostępny na wszystkich interfejsach.

MySQL nasłuchuje wyłącznie lokalnie:

```text
127.0.0.1:3306
```

Zewnętrzny skan może go nie wykryć, ale po uzyskaniu shella możemy próbować połączyć się z usługą lokalnie.

```bash
mysql -h 127.0.0.1 -u root -p
```

---

## Użytkownicy i grupy

Grupy mogą nadawać użytkownikowi dodatkowe uprawnienia, które nie są widoczne wyłącznie na podstawie UID.

```bash
id
groups
```

Szczególnie interesujące grupy:

```text
sudo
wheel
docker
lxd
disk
adm
shadow
systemd-journal
```

Przykład:

```text
uid=1000:user gid=1000:user groups=1000:user,999:docker
```

Członkostwo w grupie `docker` jest często równoważne uprawnieniom administratora, ponieważ użytkownik może komunikować się z uprzywilejowanym daemonem Dockera.

Grupa `adm` może natomiast dawać dostęp do logów, które zawierają nazwy użytkowników, ścieżki, błędy aplikacji lub sekrety.

---

## Reguły sudo

Jednym z pierwszych obowiązkowych testów jest:

```bash
sudo -l
```

Polecenie pokazuje, jakie programy aktualny użytkownik może uruchomić z wyższymi uprawnieniami.

Przykład:

```text
user ALL=(ALL) NOPASSWD: /usr/bin/python3
```

Python pozwala wykonywać polecenia systemowe, dlatego taka reguła prowadzi bezpośrednio do eskalacji.

Minimalny PoC:

```bash
sudo /usr/bin/python3 -c 'import os; os.system("/usr/bin/id")'
```

Oczekiwany wynik:

```text
uid=0(root) gid=0(root) groups=0(root)
```

To wystarcza do potwierdzenia podatności bez otwierania trwałej powłoki.

### Niebezpieczne programy w sudoers

Szczególnej uwagi wymagają:

```text
python
perl
ruby
find
vim
vi
less
more
man
awk
tar
rsync
nmap
gdb
docker
systemctl
service
env
```

Program może wyglądać jak zwykły edytor, pager lub narzędzie administracyjne, ale posiadać funkcję uruchamiania poleceń.

Przykład reguły:

```text
user ALL=(ALL) NOPASSWD: /usr/bin/find /var/log *
```

Administrator może zakładać, że użytkownik ma wyłącznie przeszukiwać logi.

`find` umożliwia jednak wykonanie zewnętrznego polecenia przez `-exec`.

```bash
sudo /usr/bin/find /var/log -maxdepth 0 -exec /usr/bin/id \;
```

Jeżeli wynik pokazuje UID `0`, reguła umożliwia wykonanie dowolnego polecenia jako root.

### Wildcardy w sudoers

Reguły zawierające `*` należy analizować bardzo dokładnie.

Wildcard może umożliwić:

- przekazanie dodatkowego argumentu,
- dopasowanie innego pliku,
- wykorzystanie opcji programu,
- manipulację nazwą ścieżki,
- wykonanie innego programu niż przewidywał administrator.

Nie analizujemy wyłącznie nazwy binarki.

Sprawdzamy pełny ciąg:

```text
program
+
dozwolone argumenty
+
wildcardy
+
uprawnienia plików wejściowych
+
uprawnienia katalogów
```

---

## Uprawnienia plików i katalogów

Podstawowy model uprawnień Linux opiera się na:

```text
u – właściciel
g – grupa
o – pozostali użytkownicy
```

Dostępne prawa:

```text
r – odczyt
w – zapis
x – wykonanie
```

Przykład:

```bash
ls -l /etc/passwd
```

```text
-rw-r--r-- 1 root root 2847 Jun 6 10:20 /etc/passwd
```

Interpretacja:

```text
właściciel root – odczyt i zapis
grupa root      – odczyt
pozostali       – odczyt
```

### Pliki z prawami 777

Wyszukanie plików, które każdy użytkownik może odczytać, zmodyfikować i wykonać:

```bash
find / -type f -perm 0777 2>/dev/null
```

Wyszukanie plików zapisywalnych i wykonywalnych przez innych:

```bash
find / -type f -perm -o=w -perm -o=x 2>/dev/null
```

Pliki należące do roota, ale zapisywalne przez każdego:

```bash
find / -type f -user root -perm -o=w 2>/dev/null
```

Sam fakt, że plik jest zapisywalny, nie oznacza jeszcze eskalacji.

Najważniejsze pytanie brzmi:

> Czy ten plik zostanie później odczytany lub wykonany przez proces działający z wyższymi uprawnieniami?

Szczególnie istotne są:

- skrypty wykonywane przez roota,
- pliki konfiguracyjne usług,
- skrypty backupowe,
- pliki deploymentowe,
- biblioteki,
- pliki wykonywane przez cron lub systemd.

### Analiza całej ścieżki

Nie wystarczy sprawdzić wyłącznie sam plik.

```bash
namei -l /opt/scripts/backup.sh
```

`namei` pokazuje uprawnienia każdego katalogu w ścieżce.

Przykład:

```text
drwxr-xr-x root root /
drwxr-xr-x root root opt
drwxrwxrwx root root scripts
-rwxr-xr-x root root backup.sh
```

Sam skrypt nie jest zapisywalny, ale katalog `scripts` posiada prawa `777`.

Użytkownik może więc usunąć oryginalny plik i utworzyć nowy pod tą samą nazwą.

---

## Pliki bez właściciela

System Linux przechowuje właściciela pliku jako numer UID i GID.

Jeżeli konto zostanie usunięte, plik może pozostać przypisany do nieistniejącego identyfikatora.

```bash
find / -xdev -nouser -nogroup 2>/dev/null
```

Przykład:

```text
-rw-rw-r-- 1 500 500 45 May 29 2017 /var/lib/test
```

Jeżeli później zostanie utworzony użytkownik o UID `500`, może automatycznie stać się właścicielem takiego pliku.

Sprawdzenie:

```bash
stat /var/lib/test
getent passwd 500
getent group 500
```

Znalezisko jest szczególnie istotne, jeśli plik:

- zawiera dane uwierzytelniające,
- jest wykonywany przez usługę,
- jest częścią backupu,
- znajduje się w katalogu aplikacji,
- może zostać zmodyfikowany.

---

## SUID i SGID

Bit SUID powoduje, że program uruchamia się z efektywnym UID właściciela pliku.

Jeżeli właścicielem jest root, program może wykonywać część operacji z jego uprawnieniami.

Wyszukanie plików SUID:

```bash
find / -type f -perm -4000 2>/dev/null
```

Wyszukanie SGID:

```bash
find / -type f -perm -2000 2>/dev/null
```

Oba typy:

```bash
find / -type f \( -perm -4000 -o -perm -2000 \) 2>/dev/null
```

Nie każdy plik SUID jest podatny.

Najpierw sprawdzamy, czy binarka jest standardowym elementem systemu.

```bash
ls -la /ścieżka/do/pliku
file /ścieżka/do/pliku
strings /ścieżka/do/pliku | less
ldd /ścieżka/do/pliku
```

Szukamy odpowiedzi na pytania:

```text
Czy program uruchamia inne polecenia?
Czy używa ścieżek absolutnych?
Czy przyjmuje nazwy plików od użytkownika?
Czy korzysta ze zmiennych środowiskowych?
Czy odczytuje zapisywalny plik konfiguracyjny?
Czy binarka znajduje się w GTFOBins?
```

Szczególnie interesujące są niestandardowe binarki znajdujące się w:

```text
/usr/local/bin
/opt
/home
```

---

## Linux capabilities

Capabilities dzielą uprawnienia roota na mniejsze części.

Program może nie posiadać SUID, ale nadal otrzymywać niebezpieczną możliwość, na przykład:

```text
cap_setuid
cap_dac_read_search
cap_sys_admin
cap_net_raw
```

Wyszukanie capabilities:

```bash
getcap -r / 2>/dev/null
```

Przykład:

```text
/usr/bin/python3 = cap_setuid+ep
```

Jeżeli interpreter posiada `cap_setuid`, może zmienić UID procesu na `0`.

Minimalny PoC:

```bash
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/usr/bin/id")'
```

Oczekiwany wynik:

```text
uid=0(root) gid=1000(user)
```

Capabilities przypisane interpreterom, edytorom lub programom umożliwiającym wykonanie kodu są szczególnie niebezpieczne.

---

## Cron i zadania systemowe

Cron wykonuje polecenia zgodnie z ustalonym harmonogramem.

Najważniejsze lokalizacje:

```text
/etc/crontab
/etc/cron.d/
/etc/cron.hourly/
/etc/cron.daily/
/var/spool/cron/
/var/spool/cron/crontabs/
```

Podstawowa analiza:

```bash
cat /etc/crontab
ls -la /etc/cron.d/
```

Zbiorcze wyszukanie:

```bash
find /etc/cron* /var/spool/cron* \
  -type f \
  -exec ls -l {} \; \
  2>/dev/null
```

Przykład:

```text
* * * * * root /opt/cronjob/script.sh
```

Root uruchamia skrypt co minutę.

Sprawdzamy:

```bash
ls -la /opt/cronjob/script.sh
namei -l /opt/cronjob/script.sh
```

Podatność występuje, gdy zwykły użytkownik może:

- zmodyfikować skrypt,
- zastąpić go innym plikiem,
- zmodyfikować katalog nadrzędny,
- wpłynąć na pliki używane przez skrypt,
- podmienić polecenie uruchamiane bez ścieżki absolutnej.

### Timery systemd

Nie wszystkie cykliczne zadania korzystają z crona.

```bash
systemctl list-timers --all
```

Dla interesującego zadania:

```bash
systemctl cat nazwa.timer
systemctl cat nazwa.service
```

Sprawdzamy pole `ExecStart` oraz uprawnienia wskazanego pliku.

---

## PATH hijacking

Zmienna `$PATH` określa, w jakich katalogach system szuka programów uruchamianych bez pełnej ścieżki.

```bash
echo "$PATH"
```

Przykład:

```text
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

Jeżeli uprzywilejowany skrypt wykonuje:

```bash
tar -czf backup.tar.gz /var/www
```

zamiast:

```bash
/usr/bin/tar -czf backup.tar.gz /var/www
```

system szuka programu `tar` w katalogach z `$PATH`.

Jeżeli atakujący kontroluje katalog znajdujący się wcześniej niż `/usr/bin`, może podstawić własny plik o nazwie `tar`.

Szczególnie niebezpieczna konfiguracja:

```bash
export PATH=.:$PATH
```

Kropka oznacza aktualny katalog.

System najpierw spróbuje wykonać:

```text
./tar
```

a dopiero później:

```text
/usr/bin/tar
```

### Warunki wykorzystania

PATH hijacking wymaga połączenia kilku elementów:

```text
proces działa z wyższymi uprawnieniami,
uruchamia polecenie bez ścieżki absolutnej,
atakujący kontroluje katalog znajdujący się w PATH,
środowisko nie resetuje zmiennej PATH.
```

Analiza skryptów:

```bash
grep -RniE \
  '(^|[;&|[:space:]])(cp|mv|tar|bash|sh|python|find|cat|ls)([[:space:]]|$)' \
  /usr/local/bin /opt 2>/dev/null
```

Szukamy programów uruchamianych bez pełnej ścieżki.

---

## Historia poleceń i sekrety

Historia powłoki może zawierać:

```text
hasła,
tokeny,
klucze API,
connection stringi,
adresy wewnętrzne,
polecenia administracyjne,
ścieżki do backupów.
```

Sprawdzenie:

```bash
cat ~/.bash_history 2>/dev/null
cat ~/.zsh_history 2>/dev/null
history
```

Profile użytkownika:

```bash
cat ~/.bashrc
cat ~/.zshrc
cat ~/.profile
cat ~/.bash_profile
```

Wyszukiwanie sekretów:

```bash
grep -RniE \
  'pass|password|token|secret|api[_-]?key|authorization|bearer' \
  ~/ 2>/dev/null
```

Ukryte pliki:

```bash
ls -la
```

Plik zaczynający się od kropki nie jest zabezpieczony.

Jest jedynie domyślnie ukrywany przez zwykłe `ls`.

W profilach mogą znajdować się:

- zmienne środowiskowe,
- dane uwierzytelniające,
- aliasy,
- modyfikacje `$PATH`,
- automatycznie wykonywane skrypty,
- odwołania do innych plików.

---

## Zmienne środowiskowe

Aplikacje często przechowują konfigurację i sekrety w zmiennych środowiskowych.

```bash
env
printenv
```

Szukamy nazw takich jak:

```text
DB_PASSWORD
DATABASE_URL
API_KEY
JWT_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
TOKEN
```

Zmienne procesów można czasami odczytać również przez `/proc`.

```bash
tr '\0' '\n' < /proc/<PID>/environ
```

Dostęp zależy od uprawnień i konfiguracji systemu.

Jeżeli proces aplikacji uruchomiony jako ten sam użytkownik zawiera dane do bazy lub API, mogą one umożliwić przejście do kolejnego systemu albo uzyskanie wyższych uprawnień.

---

## Analiza logów

Logi pomagają odtworzyć działania systemu, ale mogą również ujawnić błędne konfiguracje.

Typowe lokalizacje:

```text
/var/log/syslog
/var/log/auth.log
/var/log/messages
/var/log/secure
/var/log/audit/audit.log
```

Podstawowe polecenia:

```bash
tail -f /var/log/syslog
grep sshd /var/log/auth.log
journalctl -xe
journalctl -f
```

Logi konkretnej usługi:

```bash
journalctl -u nginx
journalctl -u ssh
journalctl -u sshd
```

Logi z określonego czasu:

```bash
journalctl --since "1 hour ago"
journalctl --since yesterday
```

Logi z bieżącego uruchomienia:

```bash
journalctl -b
```

Logi mogą ujawnić:

- nieudane polecenia aplikacji,
- nieistniejące pliki,
- ścieżki wykonywane przez sudo,
- błędy skryptów roota,
- nazwy użytkowników,
- wewnętrzne adresy IP,
- blokady SELinux lub AppArmor.

### Przykład ujawnienia potencjalnej ścieżki

```text
sudo: www-data :
command not found ;
PWD=/var/www/html ;
USER=root ;
COMMAND=/usr/local/bin/deploy_script
```

Reguła `sudoers`:

```text
www-data ALL=(ALL) NOPASSWD: /usr/local/bin/deploy_*
```

Sprawdzamy:

```bash
ls -la /usr/local/bin/
ls -ld /usr/local/bin
sudo -l
```

Kluczowe pytanie:

> Czy `www-data` może utworzyć plik pasujący do wzorca `deploy_*`?

Log nie potwierdza automatycznie podatności, ale dostarcza bardzo konkretnej hipotezy do weryfikacji.

---

## Auditd

`auditd` monitoruje operacje wykonywane w systemie.

Może rejestrować:

- wykonanie procesów,
- dostęp do plików,
- zmiany konfiguracji,
- aktywność użytkowników,
- próby uwierzytelniania.

Status:

```bash
systemctl status auditd
```

Aktywne reguły:

```bash
auditctl -l
```

Domyślny log:

```text
/var/log/audit/audit.log
```

Wyszukiwanie zdarzeń związanych z konkretnym kluczem:

```bash
ausearch -k passwd_watch
```

Uruchomienia konkretnego programu:

```bash
ausearch -x /bin/bash
```

Akcje użytkownika o UID `1000`:

```bash
ausearch -ua 1000
```

Podsumowanie:

```bash
aureport --summary
aureport -x --summary
aureport -au
```

Przykładowy wpis:

```text
comm="apache2"
exe="/usr/sbin/apache2"
uid=33
name="/etc/shadow"
```

Proces Apache działający jako UID `33` uzyskał dostęp do `/etc/shadow`.

Możliwe hipotezy:

```text
LFI lub Path Traversal,
wykonanie polecenia systemowego,
webshell,
podatny skrypt administracyjny,
lokalne rozpoznanie po przejęciu aplikacji.
```

---

## SELinux

SELinux dodaje warstwę Mandatory Access Control ponad standardowymi prawami `rwx`.

Może zablokować działanie, nawet jeśli klasyczne uprawnienia pliku na nie pozwalają.

Status:

```bash
sestatus
getenforce
```

Tryby:

| Tryb         | Działanie                     |
| ------------ | ----------------------------- |
| `Enforcing`  | blokuje niedozwolone operacje |
| `Permissive` | wyłącznie loguje naruszenia   |
| `Disabled`   | SELinux jest wyłączony        |

Konteksty plików:

```bash
ls -Z
```

Przywrócenie domyślnego kontekstu:

```bash
restorecon -Rv /var/www/html
```

Analiza blokad:

```bash
ausearch -m AVC
audit2why -a
audit2allow -w -a
```

Z perspektywy pentestera SELinux może:

- zablokować wykorzystanie podatności,
- ograniczyć dostęp przejętego procesu,
- pozostawić dokładny ślad próby ataku.

Tryb `Permissive` nie blokuje działań, ale nadal może rejestrować aktywność.

---

## AppArmor

AppArmor jest alternatywnym mechanizmem Mandatory Access Control, popularnym między innymi w Ubuntu i Debianie.

Status:

```bash
aa-status
```

Tryby:

| Tryb       | Działanie                            |
| ---------- | ------------------------------------ |
| `Enforce`  | profil blokuje niedozwolone operacje |
| `Complain` | operacje są tylko logowane           |
| `Disabled` | profil jest wyłączony                |

Interesuje nas:

- czy AppArmor działa,
- które procesy posiadają profile,
- które profile są w trybie `enforce`,
- które działają wyłącznie w trybie `complain`,
- czy przejęta aplikacja jest objęta ochroną.

Tryb `complain` może wyglądać jak aktywna ochrona, ale realnie nie blokuje działań.

---

## Docker

Dostęp do Docker Engine bardzo często oznacza możliwość przejęcia hosta.

Podstawowe sprawdzenie:

```bash
docker version
docker ps
id
```

Jeżeli użytkownik należy do grupy:

```text
docker
```

może zwykle komunikować się z daemonem działającym jako root.

Sprawdzenie socketu:

```bash
ls -la /var/run/docker.sock
```

Szukamy również zdalnego API Dockera.

```bash
nmap -p 2375 <host>
```

Jeżeli port jest otwarty:

```bash
curl http://<host>:2375/version
```

Publicznie dostępne API bez uwierzytelniania umożliwia zdalne zarządzanie kontenerami.

### Analiza kontenerów

```bash
docker ps -a
docker images
docker inspect <container>
```

Szukamy:

- trybu `privileged`,
- montowania systemu plików hosta,
- montowania `/var/run/docker.sock`,
- `--pid=host`,
- sekretów w zmiennych środowiskowych,
- uruchamiania procesów jako root,
- nadmiarowych capabilities.

Sprawdzenie mountów:

```bash
docker inspect \
  --format '{{json .Mounts}}' \
  <container>
```

Sprawdzenie trybu privileged:

```bash
docker inspect \
  --format '{{.HostConfig.Privileged}}' \
  <container>
```

Członkostwo w grupie `docker` należy traktować jak uprawnienie administracyjne.

---

## Kernel i lokalne exploity

Podatności kernela mogą prowadzić do lokalnej eskalacji uprawnień.

Znane przykłady historyczne:

```text
Dirty COW
CVE-2016-5195

PwnKit
CVE-2021-4034
```

Przed testowaniem exploita sprawdzamy:

```bash
uname -a
cat /etc/os-release
dpkg -l
rpm -qa
```

Sam numer wersji kernela nie wystarcza.

Dystrybucje często backportują poprawki bezpieczeństwa bez zmiany głównego numeru wersji.

Narzędzie pomocnicze:

```bash
linux-exploit-suggester
```

Wynik narzędzia jest listą potencjalnych kandydatów, a nie potwierdzonych podatności.

Exploit kernela powinien być jednym z ostatnich etapów analizy.

Najpierw sprawdzamy:

```text
sudo,
SUID i SGID,
capabilities,
cron i timery,
zapisywalne pliki,
grupy uprzywilejowane,
Docker,
sekrety,
PATH hijacking.
```

Błędy konfiguracyjne są zwykle łatwiejsze do zweryfikowania, bezpieczniejsze i bardziej przewidywalne niż exploit na kernel.

---

## Automatyczna enumeracja

Narzędzia automatyczne mogą przyspieszyć analizę.

Jednym z najpopularniejszych jest LinPEAS.

```bash
chmod +x linpeas.sh
./linpeas.sh
```

Alternatywnie:

```bash
bash linpeas.sh
```

LinPEAS może wykrywać:

- niestandardowe SUID,
- capabilities,
- reguły sudo,
- zapisywalne pliki,
- zadania cron,
- sekrety,
- kontenery,
- potencjalnie podatne wersje oprogramowania.

Wynik narzędzia nie jest jednak gotowym raportem podatności.

Każde znalezisko wymaga ręcznej weryfikacji.

Przykład:

```text
LinPEAS wskazuje zapisywalny plik należący do roota.
```

Weryfikacja:

```bash
ls -la /ścieżka
namei -l /ścieżka
file /ścieżka
grep -R "/ścieżka" /etc /opt /usr/local 2>/dev/null
```

Dopiero później ustalamy, czy plik jest wykonywany, importowany lub używany przez uprzywilejowany proces.

---

## Workflow lokalnej enumeracji

Podstawowy zestaw poleceń po uzyskaniu shella:

```bash
whoami
id
groups
sudo -l
```

Informacje o systemie:

```bash
hostname
uname -a
cat /etc/os-release
```

Procesy i usługi:

```bash
ps auxf
ss -tulnp
systemctl --type=service --state=running
```

SUID, SGID i capabilities:

```bash
find / -type f -perm -4000 2>/dev/null
find / -type f -perm -2000 2>/dev/null
getcap -r / 2>/dev/null
```

Cron i timery:

```bash
cat /etc/crontab
ls -la /etc/cron.d/
systemctl list-timers --all
```

Historia i sekrety:

```bash
ls -la ~
cat ~/.bash_history 2>/dev/null
cat ~/.zsh_history 2>/dev/null
env
```

Mechanizmy ochronne:

```bash
getenforce 2>/dev/null
aa-status 2>/dev/null
```

Docker:

```bash
docker ps 2>/dev/null
ls -la /var/run/docker.sock 2>/dev/null
```

Na końcu można uruchomić automatyczną enumerację i porównać jej wynik z ręczną analizą.

---

## Minimalny PoC

Dobry PoC powinien potwierdzać wpływ podatności, ale nie powodować niepotrzebnych zmian w systemie.

Zamiast otwierania powłoki roota można wykonać:

```bash
/usr/bin/id
```

Przykład dla podatnej reguły sudo:

```bash
sudo /usr/bin/find /var/log \
  -maxdepth 0 \
  -exec /usr/bin/id \;
```

Wynik:

```text
uid=0(root) gid=0(root) groups=0(root)
```

Taki wynik potwierdza możliwość wykonania polecenia jako root.

Nie ma potrzeby:

- tworzenia nowego konta,
- modyfikowania `/etc/sudoers`,
- instalowania backdoora,
- pozostawiania binarki SUID,
- utrzymywania trwałego dostępu.

---

## Dokumentowanie podatności

Opis znaleziska powinien przedstawiać pełen mechanizm.

### Obserwacja

```text
Użytkownik www-data może uruchomić /usr/bin/find przez sudo bez podawania hasła.
```

### Dowód

```bash
sudo -l
```

```text
www-data ALL=(ALL) NOPASSWD: /usr/bin/find /var/log *
```

### Interpretacja

`find` umożliwia wykonywanie poleceń przez opcję `-exec`.

Reguła `sudoers` nie ogranicza więc użytkownika wyłącznie do przeszukiwania katalogu `/var/log`.

### PoC

```bash
sudo /usr/bin/find /var/log \
  -maxdepth 0 \
  -exec /usr/bin/id \;
```

```text
uid=0(root) gid=0(root) groups=0(root)
```

### Wpływ

Atakujący posiadający dostęp do konta `www-data` może wykonywać dowolne polecenia jako root, co prowadzi do pełnego przejęcia systemu.

### Rekomendacja

- usunąć możliwość uruchamiania `find` przez sudo,
- zastąpić ją dedykowanym skryptem,
- ograniczyć dozwolone argumenty,
- unikać wildcardów,
- ponownie przeanalizować reguły `NOPASSWD`,
- monitorować użycie sudo.

---

## Hardening

Najważniejsze działania ograniczające ryzyko eskalacji:

```text
regularne aktualizacje,
minimalna liczba usług,
brak niepotrzebnych portów,
ograniczone reguły sudo,
brak zapisywalnych skryptów roota,
kontrola zadań cron i timerów,
przegląd SUID, SGID i capabilities,
ograniczenie dostępu do Docker Engine,
SELinux lub AppArmor w trybie egzekwowania,
centralizacja i ochrona logów,
bezpieczne przechowywanie sekretów.
```

Przydatne polecenia kontrolne:

```bash
ss -tulnp
systemctl list-unit-files --state=enabled
sudo -l
find / -type f -perm -4000 2>/dev/null
getcap -r / 2>/dev/null
systemctl list-timers --all
getenforce
aa-status
```

---

## Mental model

Podczas lokalnej analizy systemu zapamiętaj:

```text
WHO
Kim jestem i do jakich grup należę?

WHAT
Co działa jako root?

WRITE
Co mogę zmodyfikować?

EXECUTE
Co zostanie później wykonane?

TRUST
Który uprzywilejowany proces ufa zasobowi,
który mogę kontrolować?
```

Najważniejszy wzorzec:

```text
uprzywilejowany proces
        +
zasób kontrolowany przez słabszego użytkownika
        =
potencjalna eskalacja uprawnień
```

Nie szukaj wyłącznie gotowego exploita.

Szukaj źle ustawionej granicy zaufania.
