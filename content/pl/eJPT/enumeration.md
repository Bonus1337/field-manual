---
id: enumeration-field-manual
title: "Enumeration - Field Manual (workflow + mindset + cheat-sheets)"
team: red
category: eJPT
tags: ["nmap", "nse", "metasploit", "ftp", "smb", "http", "mysql", "ssh", "smtp"]
difficulty: easy
shortDescription: "Przekrojowy materiał na temat enumeration w kontekście pentestów i przygotowania do eJPT, zawierający workflow pracy, checklisty dla najczęściej spotykanych usług oraz podejście analityczne ukierunkowane na przekształcanie wyników skanowania w użyteczne hipotezy ataku."
updatedAt: "2026-03-08"
---

> Wszystkie materiały tutaj zawarte są tylko częścią notatek nauki. Nie są przeznaczone do używania na produkcyjnych rozwiązaniach bez autoryzacji.

# Enumeration - Field Manual

## Dlaczego ta notatka w ogóle istnieje

Enumeration to moment, w którym kończy się samo „widzę otwarty port”, a zaczyna prawdziwe rozumienie celu.

Po skanie portów wiem już **co żyje** i **co słucha**. Teraz muszę odpowiedzieć sobie na ważniejsze pytania:

- **co to dokładnie za usługa,**
- **w jakiej jest wersji,**
- **czy zdradza użytkowników, katalogi, udziały albo bazy danych,**
- **czy z tego da się zbudować sensowną ścieżkę ataku.**

To jest etap, na którym przestaję zgadywać. Zaczynam budować model ataku.

Dobrze wykonane enumeration bardzo często samo podpowiada kierunek:

- wersja usługi daje gotowy trop do `searchsploit`,
- lista użytkowników daje materiał do brute-force,
- udział SMB daje dostęp do plików,
- anonymous FTP potrafi oddać gotowe dane,
- wystawiony MySQL bywa prostą drogą do haseł,
- web server bardzo często zdradza technologię, panele i backupy.

Największy błąd początkującego? **Za szybkie przejście do exploitation.**

Najlepsza mentalna zasada na ten etap jest prosta:

> Nie pytaj tylko „czy port jest otwarty?”. Pytaj: **co ten serwis właśnie mi powiedział i jak mogę to wykorzystać?**

---

## 1. Gdzie enumeration siedzi w całym workflow

Pełny schemat myślenia wygląda tak:

| Faza                  | Co robię                                   | Cel                                                 |
| --------------------- | ------------------------------------------ | --------------------------------------------------- |
| Information Gathering | zbieram informacje pasywnie                | mapa terenu                                         |
| Active Recon          | sprawdzam co żyje i jakie porty są otwarte | powierzchnia ataku                                  |
| **Enumeration**       | pytam konkretne usługi o szczegóły         | wersje, użytkownicy, udziały, katalogi, technologie |
| Exploitation          | wykorzystuję to, co już wiem               | foothold                                            |
| Post-Exploitation     | utrwalam dostęp i rozszerzam zasięg        | pivoting, privilege escalation                      |

Dla mnie ważne jest jedno:

**Enumeration nie jest dodatkiem do port scanu. Enumeration jest jego rozwinięciem.**

Port scan mówi mi, gdzie patrzeć. Enumeration mówi mi, **jak wejść**.

---

## 2. Mój mindset podczas enumeration

Kiedy patrzę na wyniki, nie myślę jak operator narzędzia. Myślę jak ktoś, kto składa historię celu z małych śladów.

Przykładowy tok myślenia:

- Widzę `vsftpd 2.3.4` -> od razu myślę o znanym tropie i sprawdzam exploitability.
- Widzę `Apache 2.4.49` -> od razu kojarzę path traversal i możliwość dalszej eskalacji do wykonania kodu.
- Widzę SMB i możliwość odczytu udziałów bez hasła -> najpierw pliki, potem poświadczenia, dopiero później dalsze ruchy.
- Widzę SMTP -> nie interesuje mnie samo wysyłanie maili, interesują mnie **istniejący użytkownicy systemowi**.
- Widzę wystawiony MySQL -> sprawdzam czy ktoś nie zostawił pustego hasła, słabego hasła albo zdalnego dostępu bez sensu.
- Widzę web server -> myślę o technologiach, katalogach, backupach, panelach, plikach konfiguracyjnych i wersjach komponentów.

Najprostsza reguła:

> **Każdy serwis coś zdradza.**
> Twoja robota to zamienić ten wyciek informacji w kolejną hipotezę ataku.

---

## 3. Flow pracy na nowym celu

To jest workflow, który warto mieć w głowie niemal automatycznie.

### Krok 1: znajdź hosty

```bash
nmap -sn 10.10.10.0/24
```

To daje mi odpowiedź, które hosty w ogóle odpowiadają.

### Krok 2: zrób pełny skan portów i podstawowe rozpoznanie

```bash
nmap -sV -sC -O -p- 10.10.10.5 -oN full_scan.txt -oX full_scan.xml
```

To jest bardzo mocny punkt wyjścia, bo od razu dostaję:

- wersje usług,
- domyślne skrypty Nmap Scripting Engine,
- próbę rozpoznania systemu operacyjnego,
- komplet portów,
- zapis wyników do pliku tekstowego i XML.

Plik XML ma znaczenie, bo można go potem wczytać do Metasploit.

### Krok 3: czytaj wynik jak plan ataku, nie jak log

Po skanie nie biegnę od razu dalej. Zatrzymuję się i rozbijam wynik na pytania:

- które porty są najciekawsze,
- które wersje wyglądają na stare albo charakterystyczne,
- gdzie mogę wyciągnąć użytkowników,
- gdzie mogę dostać dostęp bez hasła,
- które usługi mogą dać pliki albo hashe,
- czy coś wskazuje na klasyczny exploit,
- czy da się połączyć informacje między usługami.

### Krok 4: odpal enumeration per serwis

Dla każdego otwartego serwisu robię osobną mini-ścieżkę:

- FTP -> anonymous login, pliki, write access,
- SMB -> udziały, użytkownicy, polityki, podatności,
- HTTP/HTTPS -> nagłówki, technologie, katalogi, backupy,
- MySQL -> wersja, puste hasła, bazy i tabele,
- SSH -> metody uwierzytelniania, użytkownicy, brute-force,
- SMTP -> enumeracja użytkowników,
- RDP -> rozpoznanie i ewentualny brute-force,
- wszystko inne -> baner, dokumentacja, `searchsploit`, ręczne sprawdzenie.

### Krok 5: spinaj dane między usługami

To jest moment, który bardzo często daje wejście:

- użytkownicy z SMTP -> testowani na SSH,
- hasła z MySQL -> testowane na SSH, SMB albo panelu webowym,
- pliki z FTP lub SMB -> mogą zawierać konfigurację aplikacji i poświadczenia,
- web backup -> może zdradzić `.env`, `.git`, `config.php`, `wp-config.php`.

### Krok 6: dopiero teraz exploitation

Dopiero kiedy wiem, **dlaczego** coś powinno zadziałać, przechodzę do wykorzystania.

---

## 4. Nmap jako fundament enumeration

Nmap to nie tylko skaner portów. To pierwszy interpreter celu.

### Skan bazowy

```bash
nmap -sV -sC -O -p- 10.10.10.5 -oN full_scan.txt -oX full_scan.xml
```

### Skan agresywniejszy na znanych portach

```bash
nmap -A -p 21,22,80,443,445,3306 10.10.10.5
```

Tego używam raczej wtedy, gdy już wiem, że te porty są otwarte i chcę szybciej dopchnąć szczegóły.

### Dlaczego zapis wyników jest obowiązkowy

Na egzaminie i w praktyce zapis wyniku to nie dodatek, tylko zabezpieczenie procesu.

- nie tracisz czasu na powtarzanie skanów,
- możesz wrócić do wyników po czasie,
- możesz porównywać hosty,
- możesz importować XML do Metasploit.

### Nmap Scripting Engine - realna przewaga

Nmap Scripting Engine daje gotowe skrypty do konkretnego typu rozpoznania.

Najważniejsze kategorie, które warto kojarzyć:

| Kategoria   | Znaczenie                                      | Typowe zastosowanie        |
| ----------- | ---------------------------------------------- | -------------------------- |
| `safe`      | bezpieczne, podstawowe rozpoznanie             | banery, tytuły stron       |
| `discovery` | zbieranie informacji                           | udziały, hosty, katalogi   |
| `auth`      | sprawdzanie logowania i metod uwierzytelniania | anonymous FTP, metody SSH  |
| `vuln`      | testy znanych podatności                       | SMB, HTTP, SSL             |
| `brute`     | brute-force                                    | SSH, FTP, MySQL            |
| `exploit`   | próby wykorzystania                            | tylko gdy wiesz, co robisz |

Przykłady:

```bash
nmap --script ftp-anon -p 21 10.10.10.5
nmap --script smb-enum-shares,smb-enum-users -p 445 10.10.10.5
nmap --script 'http-*' -p 80 10.10.10.5
nmap --script vuln 10.10.10.5
```

Jeśli jakiś wynik wygląda obiecująco, od razu buduję dalszy ruch:

- wersja -> `searchsploit`,
- użytkownicy -> słownik do testów logowania,
- udziały -> ręczna inspekcja,
- katalogi -> wejście przez przeglądarkę albo `curl`,
- podatność -> weryfikacja ręczna albo moduł w Metasploit.

---

## 5. Metasploit jako wsparcie enumeration

Metasploit nie służy tylko do exploitów. W enumeration jego auxiliary modules są bardzo przydatne, szczególnie gdy:

- chcesz szybko odpalić dedykowany skaner danej usługi,
- chcesz brute-force z jednego miejsca,
- chcesz pracować przez pivot,
- chcesz wykorzystać import wyników Nmap.

### Import z Nmap

```bash
msfconsole
msf6 > db_import /path/to/full_scan.xml
msf6 > hosts
msf6 > services
```

### Bezpośredni skan z Metasploit

```bash
msf6 > db_nmap -sV -sC 10.10.10.5
```

### Kiedy auxiliary modules robią największą robotę

Najbardziej lubię je wtedy, kiedy mam już pierwszą sesję i chcę skanować sieć wewnętrzną przez pivot.

Przykładowy schemat:

```bash
msf6 > use post/multi/manage/autoroute
msf6 > set SESSION 1
msf6 > run

msf6 > use auxiliary/scanner/portscan/tcp
msf6 auxiliary(tcp) > set RHOSTS 192.168.1.0/24
msf6 auxiliary(tcp) > set PORTS 21,22,80,443,445,3306,8080
msf6 auxiliary(tcp) > run
```

Jeśli Kali nie widzi segmentu wewnętrznego, a sesja już tam siedzi, to właśnie tu auxiliary modules zaczynają dawać realną przewagę.

---

## 6. FTP enumeration

### Co chcę wyciągnąć z FTP

Najbardziej interesują mnie cztery rzeczy:

1. wersja serwera,
2. możliwość logowania anonimowego,
3. zawartość plików,
4. możliwość zapisu.

### Pierwszy ruch

```bash
nmap --script ftp-anon,ftp-syst -p 21 10.10.10.5
```

Jeśli dostaję informację, że anonymous login jest dozwolony, przechodzę do ręcznego sprawdzenia.

```bash
ftp 10.10.10.5
```

Po zalogowaniu sprawdzam:

```bash
ls -la
pwd
cd /var/www
get plik.txt
mget *.conf
```

### Na co poluję na FTP

- pliki konfiguracyjne,
- pliki backupowe,
- pliki tekstowe z notatkami,
- ukryte pliki,
- katalog web servera,
- możliwość uploadu.

Jeżeli mam **write access** i widzę, że to katalog używany przez web server, od razu myślę o możliwości wrzucenia pliku i uzyskania wykonania kodu.

### Brute-force FTP

```bash
nmap --script ftp-brute --script-args userdb=users.txt,passdb=pass.txt -p 21 10.10.10.5
```

albo w Metasploit:

```bash
use auxiliary/scanner/ftp/ftp_login
set RHOSTS 10.10.10.5
set USER_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
run
```

### Mój skrót myślowy dla FTP

> FTP otwarty = najpierw anonymous login, potem pliki, potem write access, dopiero później brute-force.

---

## 7. SMB enumeration

### Dlaczego SMB jest tak cenny

SMB bardzo często daje informacje, które potem działają w innych miejscach:

- listy użytkowników,
- udziały sieciowe,
- politykę haseł,
- czasem dostęp bez hasła,
- czasem znane podatności.

### Pierwszy ruch, który lubię najbardziej

```bash
enum4linux -a 10.10.10.5
```

To często od razu daje szeroki obraz:

- użytkownicy,
- udziały,
- informacje o systemie,
- politykę haseł,
- NetBIOS i domenę.

### Nmap na SMB

```bash
nmap --script smb-os-discovery -p 445 10.10.10.5
nmap --script smb-enum-shares -p 445 10.10.10.5
nmap --script smb-enum-users -p 445 10.10.10.5
nmap --script 'smb-vuln*' -p 445 10.10.10.5
```

### smbclient do ręcznej inspekcji

```bash
smbclient -L //10.10.10.5 -N
smbclient //10.10.10.5/share -N
```

Po wejściu sprawdzam:

```bash
ls
get plik.txt
put test.txt
```

### Najważniejsze pytania przy SMB

- czy są udziały dostępne bez hasła,
- czy mogę wejść do udziału,
- czy mogę coś odczytać,
- czy mogę coś zapisać,
- czy usługa wygląda na starą,
- czy wynik wskazuje na znaną podatność.

Jeżeli widzę trop związany z `MS17-010`, traktuję to bardzo poważnie i weryfikuję dalej.

### Mój skrót myślowy dla SMB

> SMB otwarty = `enum4linux -a`, potem `smbclient`, potem testy podatności i dopiero później brute-force.

---

## 8. Web server enumeration

### Co web server zdradza na starcie

Web server bywa kopalnią informacji jeszcze zanim zaczniesz głębszy web pentest.

Najczęściej interesuje mnie:

- nagłówek `Server`,
- nagłówek `X-Powered-By`,
- tytuł strony,
- metody HTTP,
- technologie i frameworki,
- ukryte katalogi,
- backupy,
- panel logowania,
- pliki takie jak `robots.txt`, `.git`, `.env`, backupy i archiwa.

### Pierwsze szybkie ruchy

```bash
curl -I http://10.10.10.5
curl -I http://10.10.10.5/robots.txt
whatweb 10.10.10.5
```

### Nmap na HTTP

```bash
nmap --script http-headers -p 80 10.10.10.5
nmap --script http-title,http-methods -p 80 10.10.10.5
nmap --script http-enum -p 80 10.10.10.5
nmap --script http-robots.txt -p 80 10.10.10.5
```

### Enumeracja katalogów

```bash
gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/big.txt -x php,txt,html
```

albo klasycznie:

```bash
dirb http://10.10.10.5
```

### Co sprawdzam ręcznie zanim odpalę większy wordlist

- `/robots.txt`
- `/admin`
- `/login`
- `/backup`
- `/.git`
- `/phpmyadmin`
- `/wp-admin`

Jeżeli widzę wersję Apache, Nginx, WordPressa albo konkretnego komponentu, od razu sprawdzam czy ta wersja ma sensowny trop do dalszej weryfikacji.

### Mój skrót myślowy dla HTTP

> HTTP otwarty = najpierw nagłówki i technologia, potem katalogi, potem backupy i ciekawe pliki, a dopiero później głębsze testy aplikacyjne.

---

## 9. MySQL enumeration

### Dlaczego MySQL jest tak ważny

Wystawiona baza danych to bardzo często oznaka słabej konfiguracji. Nawet jeżeli nie da wejścia od razu, potrafi oddać:

- nazwę baz,
- użytkowników,
- tabele,
- hashe,
- poświadczenia do innych usług.

### Pierwszy ruch

```bash
nmap --script mysql-info -p 3306 10.10.10.5
nmap --script mysql-empty-password -p 3306 10.10.10.5
```

Jeżeli jest cień szansy na puste hasło albo słabą konfigurację, sprawdzam to od razu.

### Połączenie ręczne

```bash
mysql -u root -p -h 10.10.10.5
```

Po wejściu najczęściej interesuje mnie:

```sql
show databases;
use webapp_db;
show tables;
select * from users limit 10;
```

### Co realnie chcę stamtąd wyciągnąć

- hasła lub hashe,
- nazwy użytkowników,
- konfigurację aplikacji,
- dane sesyjne,
- wszystko, co może działać też na SSH, FTP albo panelu webowym.

### Brute-force i moduły

```bash
nmap --script mysql-brute -p 3306 10.10.10.5
```

albo:

```bash
use auxiliary/scanner/mysql/mysql_login
set RHOSTS 10.10.10.5
set USERNAME root
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
run
```

### Mój skrót myślowy dla MySQL

> MySQL otwarty = wersja, puste hasło, dostęp, bazy, użytkownicy, hashe, reuse poświadczeń.

---

## 10. SSH enumeration

### Co SSH zwykle daje, a czego zwykle nie daje

SSH rzadziej daje podatność typu „klik i shell”, ale bardzo często daje wejście przez:

- słabe hasło,
- reuse poświadczeń,
- znaną listę użytkowników,
- nietypową metodę uwierzytelniania.

### Co sprawdzam na początku

```bash
nmap --script ssh-hostkey -p 22 10.10.10.5
nmap --script ssh-auth-methods --script-args ssh.user=root -p 22 10.10.10.5
```

Interesuje mnie przede wszystkim, jakie metody uwierzytelniania są dozwolone.

### Brute-force

```bash
nmap --script ssh-brute --script-args userdb=users.txt,passdb=pass.txt -p 22 10.10.10.5
```

albo:

```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.5
```

albo Metasploit:

```bash
use auxiliary/scanner/ssh/ssh_login
set RHOSTS 10.10.10.5
set USER_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
set STOP_ON_SUCCESS true
run
```

### Najważniejsza praktyka

SSH bardzo często działa dopiero wtedy, kiedy wcześniej dobrze zrobiłeś enumeration gdzie indziej.

To znaczy:

- użytkowników możesz zdobyć z SMTP albo SMB,
- hasła możesz zdobyć z MySQL,
- nazwy kont możesz znaleźć w plikach konfiguracyjnych lub backupach.

### Mój skrót myślowy dla SSH

> SSH rzadko daje coś sam z siebie. SSH najczęściej wygrywasz dzięki temu, co zebrałeś wcześniej.

---

## 11. SMTP enumeration

### Po co w ogóle interesować się SMTP

Nie dlatego, że chcesz wysyłać wiadomości. Interesuje cię coś cenniejszego:

**czy serwer zdradza istniejących użytkowników.**

Jeżeli tak, dostajesz gotową listę nazw kont do testów na innych usługach.

### Co sprawdzam

```bash
nmap --script smtp-commands -p 25 10.10.10.5
nmap --script smtp-enum-users -p 25 10.10.10.5
nmap --script smtp-enum-users --script-args smtp-enum-users.methods={VRFY,RCPT} -p 25 10.10.10.5
```

### Metasploit

```bash
use auxiliary/scanner/smtp/smtp_enum
set RHOSTS 10.10.10.5
set USER_FILE /usr/share/metasploit-framework/data/wordlists/unix_users.txt
run
```

### Ręcznie

```bash
nc 10.10.10.5 25
```

Potem:

```text
EHLO test
VRFY root
VRFY admin
RCPT TO: <root>
```

Jeżeli odpowiedź wskazuje, że użytkownik istnieje, od razu zapisuję go do listy i używam później na SSH, FTP albo SMB.

### Mój skrót myślowy dla SMTP

> SMTP = źródło nazw użytkowników. Nie patrz na niego jak na serwer poczty. Patrz na niego jak na generator słownika do dalszych testów.

---

## 12. RDP i inne usługi

Jeżeli trafia się RDP, nie ignoruję go tylko dlatego, że nie był głównym bohaterem materiału.

Mój tok myślenia jest prosty:

- rozpoznaj wersję,
- zobacz czy system wygląda na stary,
- sprawdź czy masz sensowną listę użytkowników,
- oceń, czy ma sens brute-force albo wykorzystanie zdobytych poświadczeń.

To samo dotyczy każdej innej usługi. Nawet jeśli nie masz gotowej checklisty, wracasz do podstawowych pytań:

- jaka to wersja,
- co zdradza baner,
- czy można zalogować się bez hasła,
- czy istnieje znany trop do eksploitacji,
- czy da się wyciągnąć użytkowników, pliki albo dane.

---

## 13. Łączenie kropek między usługami

Tu bardzo często wygrywa się egzamin i prawdziwe laby.

Najważniejsze połączenia, które warto mieć w głowie:

| Co znalazłem                      | Gdzie testuję dalej                                     |
| --------------------------------- | ------------------------------------------------------- |
| użytkownicy ze SMTP               | SSH, FTP, SMB                                           |
| użytkownicy z SMB                 | SSH, FTP, panel webowy                                  |
| hasła lub hashe z MySQL           | SSH, SMB, FTP, loginy webowe                            |
| pliki z FTP lub SMB               | konfiguracja aplikacji, dane połączeniowe, nazwy kont   |
| wersja serwera webowego           | `searchsploit`, znane podatności, blogi producenta      |
| write access do katalogu webowego | upload pliku i wykonanie kodu                           |
| backup aplikacji                  | źródła, `.env`, pliki konfiguracyjne, dane połączeniowe |

To jest bardzo ważne:

> Pojedyncza usługa nie zawsze daje wejście.
> **Dwie połączone informacje bardzo często już tak.**

---

## 14. Egzaminowy quick reference

### Jeżeli widzę ten port, to mój pierwszy ruch jest taki

| Port | Usługa | Mój pierwszy ruch                                                         |
| ---- | ------ | ------------------------------------------------------------------------- |
| 21   | FTP    | `nmap --script ftp-anon,ftp-syst -p 21 TARGET`                            |
| 22   | SSH    | `nmap --script ssh-auth-methods --script-args ssh.user=root -p 22 TARGET` |
| 25   | SMTP   | `nmap --script smtp-enum-users -p 25 TARGET`                              |
| 80   | HTTP   | `whatweb TARGET` + `curl -I http://TARGET`                                |
| 443  | HTTPS  | jak HTTP + sprawdzenie certyfikatu i tych samych ścieżek                  |
| 445  | SMB    | `enum4linux -a TARGET`                                                    |
| 3306 | MySQL  | `nmap --script mysql-info,mysql-empty-password -p 3306 TARGET`            |
| 3389 | RDP    | rozpoznanie wersji i test zdobytych poświadczeń                           |

### Kolejność działań na nowym celu

1. sprawdź co żyje,
2. zrób pełny skan portów,
3. zapisz wyniki,
4. rozbij usługi na osobne ścieżki enumeration,
5. zbierz wersje, użytkowników, pliki, udziały i hashe,
6. połącz dane między usługami,
7. dopiero wtedy wybierz najbardziej logiczny wektor wejścia.

### Najważniejsze wordlisty, które warto pamiętać

```text
/usr/share/wordlists/rockyou.txt
/usr/share/wordlists/dirb/common.txt
/usr/share/wordlists/dirb/big.txt
/usr/share/metasploit-framework/data/wordlists/unix_users.txt
/usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
/usr/share/metasploit-framework/data/wordlists/common_users.txt
```

---

## 15. Najczęstsze błędy podczas enumeration

### 1. Skan tylko popularnych portów

Jeżeli nie zrobiłeś `-p-`, mogłeś pominąć usługę, która była właściwym wejściem.

### 2. Brak zapisu wyników

To nie wygląda groźnie, dopóki nie zgubisz kontekstu i nie zaczniesz robić tych samych skanów od nowa.

### 3. Przeskakiwanie od razu do exploitów

Jeżeli exploit nie działa, to bardzo często nie dlatego, że świat jest zły. Tylko dlatego, że miałeś za mało danych i za wcześnie wybrałeś kierunek.

### 4. Patrzenie na usługi osobno

Enumeration wygrywa się łączeniem informacji, a nie tylko odpalaniem narzędzi na pojedynczych portach.

### 5. Ignorowanie dostępu bez hasła

Anonymous FTP, guest SMB, puste hasło w MySQL - to są rzeczy, które potrafią dać bardzo szybki postęp.

### 6. Brak ręcznej weryfikacji

Narzędzie może coś zasugerować, ale dopiero ręczne wejście do udziału, katalogu albo bazy pokazuje realną wartość wyniku.

---

## 16. Moje mini-checklisty per serwis

### FTP

- sprawdź wersję,
- sprawdź anonymous login,
- obejrzyj pliki,
- oceń write access,
- zobacz czy to katalog webowy,
- dopiero potem brute-force.

### SMB

- `enum4linux -a`,
- sprawdź listę udziałów,
- spróbuj wejść bez hasła,
- pobierz pliki,
- sprawdź użytkowników,
- sprawdź tropy podatności.

### HTTP/HTTPS

- nagłówki,
- technologia,
- tytuł strony,
- katalogi,
- backupy,
- panele,
- znane wersje.

### MySQL

- wersja,
- puste hasło,
- połączenie ręczne,
- bazy,
- tabele,
- użytkownicy,
- hashe i reuse.

### SSH

- metody uwierzytelniania,
- lista użytkowników z innych usług,
- test typowych haseł,
- reuse z wcześniej zdobytych danych.

### SMTP

- komendy,
- enumeracja użytkowników,
- zapis listy kont,
- użycie tej listy na innych usługach.

---

## 17. Jedno zdanie, które zachowam dla siebie

Jeśli miałbym wybrać jedną rzecz z tego rozdziału, byłoby to:

**Enumeracja jest momentem, w którym otwarte porty przestają być szumem, a stają się ścieżką ataku.**

---

## 18. Finalny wniosek

Dobre enumeration nie polega na tym, że odpalisz więcej narzędzi niż inni.

Polega na tym, że:

- zadasz właściwe pytania,
- zapiszesz wyniki,
- połączysz informacje między usługami,
- wybierzesz najbardziej logiczną ścieżkę wejścia.

Na eJPT naprawdę warto myśleć o tym etapie jak o inwestycji czasu.

Bo bardzo często wygląda to tak:

- 20 minut dobrego enumeration,
- 2 minuty znalezienia właściwego tropu,
- 5 minut do footholda.

A bez tego same 27 minut potrafi zejść na ślepe strzały.

Dlatego kiedy widzę otwarte porty, nie pytam już tylko „co tu jest?”.

Pytam:

> **co z tego da się zamienić w kolejną przewagę.**
