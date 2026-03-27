---
id: information-gathering
title: "Information Gathering - kompletny przewodnik praktyka"
team: red
category: eJPT
tags: ["recon", "passive", "active", "nmap", "dns", "osint", "whois", "subdomain", "ejpt"]
difficulty: easy
shortDescription: "Kompleksowy materiał na temat information gathering w kontekście pentestów oraz przygotowania do eJPT, obejmujący metody passive i active recon, analizę źródeł OSINT, DNS, subdomen, technologii oraz aktywne techniki skanowania i profilowania celu, które stanowią podstawę do dalszej enumeracji."
updatedAt: "2025-03-06"
---

> Wszystkie materiały tutaj zawarte są tylko częścią notatek nauki. Nie są przeznaczone do używania na produkcyjnych rozwiązaniach bez autoryzacji

# Information Gathering - kompletny przewodnik praktyka

## Dlaczego w ogóle ta notatka

Rekon to jedyny etap w pentestingu gdzie pośpiech bezpośrednio karze. Każda godzina
którą tu skracasz, mścisz się potem - albo strzelasz w złe hosty, albo omijasz powierzchnię
ataku która była widoczna od początku, albo wchodzisz poza scope i masz problem prawny.

Ta notatka to kompletny materiał roboczy - od koncepcji przez passive OSINT,
przez DNS, przez aktywne skanowanie. Ułożony tak żeby dało się przez niego przejść
krok po kroku na realnym engagemencie albo wróćić do konkretnej sekcji kiedy
utkniesz przy narzędziu.

---

## Fundamenty - jak to poukładać w głowie

### Dwa tryby pracy

Cały information gathering sprowadza się do jednego pytania: **czy twoje pakiety
docierają do infrastruktury celu czy nie.**

**Passive recon** - pracujesz z danymi które już gdzieś istnieją w publicznym internecie.
WHOIS, DNS odpytywany przez publiczny resolver, wyniki Google, crt.sh, theHarvester -
żadne z tych zapytań nie ląduje w logach serwera klienta. Możesz robić to bez
autoryzacji i bez ryzyka wykrycia, bo jesteś niewidzialny dla celu.

**Active recon** - wysyłasz coś bezpośrednio do infrastruktury celu. Nmap odpytuje
ich serwery. Zone transfer idzie do ich nameservera. Twój IP pojawia się w logach.
Tutaj **autoryzacja jest niezbędna** - nie dlatego żeby to napisać i odfajkować,
ale dlatego że bez niej to nie pentest tylko przestępstwo.

Granica między nimi jest czasem rozmyta. Odwiedzenie strony klienta w przeglądarce
żeby przeczytać `robots.txt` to technicznie kontakt z ich serwerem - twój browser
wysłał request i dostał odpowiedź. W praktyce nikt tego tak nie traktuje, ale
warto wiedzieć gdzie leży ta linia.

**Kolejność jest zawsze taka sama:** najpierw passive, potem active. Nie odwrotnie.
Z passive dostajesz mapę terenu - IP, NS, subdomeny, technologie - zanim wyślesz
pierwszy pakiet. Wchodzenie z Nmapem do sieci o której nic nie wiesz to strzelanie
na oślep.

---

### Target scoping - zanim cokolwiek odpalisz

Scoping to nie formalność. To odpowiedź na pytanie: **co dokładnie mi wolno testować.**

W praktyce scope definiuje klient albo organizator CTF-a. Może być:

- **Domenowy** - `firma.com` i wszystkie subdomeny. Uwaga: subdomeny mogą siedzieć
  u różnych providerów. `mail.firma.com` może być Google Workspace. `crm.firma.com`
  może być Salesforce. Oba są poza twoim scope jeśli nie zostały explicite włączone.

- **IP-based** - konkretny adres albo zakres CIDR, np. `10.10.10.0/24`.
  Tutaj ryzyko jest inne - możesz trafić na hosty które są w sieci klienta,
  ale nie należą do niego (środowiska chmurowe, współdzielony hosting).

- **Application scope** - tylko konkretna aplikacja webowa albo API endpoint.
  W tym przypadku rekon skupia się wyłącznie na niej - nie na całym serwerze,
  nie na całej domenie.

**Out-of-scope to nie sugestia.** Third-party serwisy, CDN który nie należy do klienta,
systemy innych organizacji w tej samej przestrzeni IP - dotknięcie ich bez autoryzacji
to twój problem, nie klienta.

Najgorszy błąd który można popełnić na początku: założyć że "subdomena to na pewno
klienta" albo "IP z tej samej sieci to pewnie in-scope". Zawsze weryfikuj.

---

## Passive recon - pełna mapa źródeł

### Website recon i footprinting - co wyczytasz ze strony

Footprinting strony to nie "przejrzyj ją sobie". To systematyczne czytanie
wszystkiego co serwer ci mówi - często więcej niż zamierzał.

**Co zbierasz na tym etapie:**

- Adresy IP (z nagłówków HTTP, źródła strony, błędów)
- Ścieżki ukryte przed wyszukiwarkami (`robots.txt`)
- Imiona i nazwiska z sekcji "O nas", autorów blogpostów, kontaktów
- Adresy email - bezpośrednio ze strony albo z metadanych dokumentów
- Numery telefonów i adresy fizyczne (przydatne przy social engineering)
- Technologie - CMS, framework, serwer webowy, język, wersje

**`robots.txt` to mapa ukrytych ścieżek.** Właściciel strony wpisał je tam właśnie
dlatego, że nie chciał żeby Google je indeksował. To nie czyni ich niedostępnymi -
wręcz przeciwnie, masz teraz listę miejsc do sprawdzenia.

```

https://cel.com/robots.txt

# Przykład tego co możesz znaleźć:

User-agent: \*
Disallow: /admin/
Disallow: /backup/
Disallow: /internal/
Disallow: /.git/

```

Każda z tych ścieżek to potencjalny kolejny krok. `/backup/` z listowaniem katalogów
to inna rozmowa niż `/admin/` za logowaniem - ale obie warto sprawdzić.

**`sitemap.xml`** jest mniej interesujący z ofensywnego punktu widzenia, ale daje
kompletną mapę publicznych zasobów strony. Przy dużych serwisach może ujawniać
subsekcje które nie są linkowane z głównej nawigacji.

```

https://cel.com/sitemap.xml
https://cel.com/sitemap_index.xml

```

**Nagłówki HTTP** mówią całkiem sporo. `Server: Apache/2.4.49` to już informacja.
`X-Powered-By: PHP/7.4.3` to jeszcze lepsza. `X-Generator: WordPress 5.9` to
bezpośrednie wejście do bazy CVE.

```bash
curl -I https://cel.com
# albo bardziej czytelnie:
curl -sI https://cel.com | grep -i 'server\|x-powered\|x-generator\|content-type'
```

**WhatWeb** - CLI tool który robi to samo co Wappalyzer w przeglądarce, ale daje
się skryptować i ma różne poziomy agresywności:

```bash
# Podstawowy (passywny - nie generuje dużo ruchu):
whatweb https://cel.com

# Agresywny (więcej requestów, więcej danych):
whatweb -a 3 https://cel.com

# Z logiem do pliku:
whatweb https://cel.com -v --log-json=footprint.json
```

Poziom 3 (`-a 3`) wysyła więcej requestów - technicznie to już bardziej active.
Na etapie gdy zależy ci na cichym passive rekon, trzymaj się poziomu 1.

---

### WHOIS - więcej niż dane właściciela

WHOIS to zapytanie do bazy rejestracyjnej domeny albo bloku IP. To pierwsze miejsce
gdzie patrzę na nową domenę - nie dlatego że zawsze daję konkretne dane, ale dlatego
że **nameservery są tam zawsze.**

```bash
whois firma.com
whois 93.184.216.34    # dla IP
```

**Na co patrzę:**

- **Name Server** - to są hosty do których za chwilę wyślesz zapytanie o zone transfer.
  Wyciągnij je i zapisz od razu.
- **Registrant Email** - jeśli nie ma WHOIS privacy, masz adres do sprawdzenia
  w bazach breachów. Nawet jeśli jest privacy, czasem stary e-mail wycieknie
  przez historyczne rekordy.
- **Creation Date** - stara domena (10+ lat) to często stara infrastruktura.
  Stara infrastruktura to często stare, niezaktualizowane oprogramowanie.
- **Registrar** - mówi ci kto zarządza domeną. Przy atakach na przejęcie domeny
  (domain takeover) to istotne.

```
# Przykładowy fragment outputu - co wyciągam:

Domain Name: FIRMA.COM
Name Server: NS1.FIRMA.COM          ← zapisuję, będę próbował AXFR
Name Server: NS2.FIRMA.COM          ← j.w.
Registrant Email: admin@firma.com   ← sprawdzam w HIBP, theHarvester
Creation Date: 2009-03-14T00:00:00Z ← stara infrastruktura, warto sprawdzić CVE starszych wersji
Registry Expiry Date: 2025-03-14    ← wygasa za niedługo, możliwe zaniedbania
```

Przy IP-based WHOIS dostajesz właściciela bloku adresów - przydatne gdy chcesz
wiedzieć czy dany zakres naprawdę należy do klienta czy jest to hosting/cloud.

---

### DNS recon - warstwa po warstwie

DNS to nie "narzędzie do zamiany domen na IP". Dla pentestera to **warstwa informacyjna
o infrastrukturze celu.** Każdy typ rekordu mówi coś innego o tym jak firma jest
zbudowana.

#### Rekordy DNS - co każdy z nich znaczy w praktyce

**Rekord A / AAAA**
Mapowanie domeny na IPv4 (A) albo IPv6 (AAAA). Podstawa - dajesz ci bezpośredni
adres serwera. Zanim jednak wpadniesz w euforię: jeśli firma stoi za Cloudflare
albo innym CDN, dostaniesz IP edge node'u CDN, nie serwera aplikacji.

```bash
host firma.com
dig firma.com A
```

**Rekord NS**
Nameservery domeny. Każdy NS to potencjalny cel zone transfer. Zawsze notuj wszystkie.

```bash
host -t ns firma.com
dig firma.com NS
```

**Rekord MX**
Mail Exchange - serwer poczty. Dwie rzeczy cię tu interesują: adres serwera pocztowego
(cel do testów email spoofing, brute force, phishingu) i **vendor** (GSuite, Microsoft 365,
własny serwer - każde z nich to inna powierzchnia ataku).

```bash
host -t mx firma.com
dig firma.com MX
```

**Rekord TXT**
Tekstowy. Na pierwszy rzut oka nudny. W praktyce często ujawnia:

- SPF (`v=spf1 include:sendgrid.net include:amazonses.com ~all`) - lista autoryzowanych
  serwerów pocztowych, często ujawnia vendorów których firma używa
- DKIM - klucze do weryfikacji podpisów emaili
- DMARC - polityka obsługi podejrzanych maili
- Tokeny weryfikacyjne dla Google Search Console, Atlassian, innych SaaS-ów

```bash
host -t txt firma.com
dig firma.com TXT
```

**Rekord CNAME**
Alias - domena wskazuje na inną domenę. Interesujący z kilku powodów:

- `www.firma.com` → `firma.com.cdn77.net` - jest CDN, prawdziwe IP jest ukryte
- `blog.firma.com` → `firma.ghost.io` - hosting blogów na zewnętrznym serwisie
- `app.firma.com` → `firma.herokuapp.com` - jeśli ktoś usunął aplikację z Heroku
  ale zostawił rekord CNAME, możesz zarejestrować tę samą nazwę na Heroku
  i przejąć subdomenę (subdomain takeover)

```bash
dig www.firma.com CNAME
```

**Rekord SOA**
Start of Authority - zawiera informacje o strefie DNS. Mniej ciekawy
ale e-mail admina jest tam zapisany w formacie `admin.firma.com`
który mapuje się na `admin@firma.com`.

```bash
dig firma.com SOA
```

**Rekord PTR**
Reverse DNS - IP do domeny. Przydatne gdy masz IP i chcesz wiedzieć jak
się nazywa host. Używam przy analizie zakresu IP żeby zobaczyć które hosty
mają zdefiniowane reverse DNS (sugeruje że są aktywnie zarządzane).

```bash
dig -x 93.184.216.34
host 93.184.216.34
```

**Rekord SRV**
Service records - opisują jakie usługi są dostępne i na jakich portach.
Rzadko używane, ale gdy są - mówią wprost: "tu jest LDAP", "tu jest SIP", "tu jest XMPP".

```bash
dig _ldap._tcp.firma.com SRV
dig _sip._tcp.firma.com SRV
```

#### Narzędzia do DNS recon

**`host`** - szybki i przejrzysty, dobry do jednorazowych zapytań:

```bash
host firma.com                  # rekord A
host -t mx firma.com            # MX
host -t ns firma.com            # NS
host -t txt firma.com           # TXT
host -t any firma.com           # wszystko (nie zawsze działa z nowymi resolverami)
```

**`dig`** - bardziej szczegółowy output, lepszy do skryptowania:

```bash
dig firma.com                   # A
dig firma.com MX                # MX
dig firma.com ANY               # wszystko
dig @8.8.8.8 firma.com          # przez konkretny resolver
dig +short firma.com            # tylko wynik, bez szumu
```

**`dnsrecon`** - kompleksowe narzędzie, robi kilka rzeczy naraz:

```bash
dnsrecon -d firma.com                              # standard enum
dnsrecon -d firma.com -t std                       # jawnie standard mode
dnsrecon -d firma.com -t brt -D /usr/share/wordlists/dnsmap.txt  # brute force subdomen
dnsrecon -d firma.com -t axfr                      # próba zone transfer
```

---

### Netcraft - historia infrastruktury

Netcraft skanuje internet od lat 90-tych i przechowuje historyczne dane o stronach.
Dla pentestera najcenniejsza jest **Hosting History** - lista poprzednich adresów IP.

Firmy często migrują na Cloudflare żeby ukryć prawdziwe IP serwera za CDN.
Ale jeśli przez lata siedziały na bezpośrednim IP, Netcraft to pamięta.
Ten stary IP może nadal prowadzić bezpośrednio do serwera aplikacji,
omijając WAF i geoblocking Cloudflare.

```
https://sitereport.netcraft.com/?url=https://firma.com
```

**Co wyciągam z raportu Netcraft:**

- **Network** - aktualny IP, ASN, kraj, provider
- **Hosting History** - stare IP (sprawdzam czy nadal aktywne)
- **Web Technologies** - serwer webowy z wersją, CMS, język, framework
- **SSL Certificate** - kto wystawił, na jakie domeny (SAN może ujawniać subdomeny)
- **Nameservers** - historyczne NS (znowu: historia jest cenna)

Certyfikat SSL to osobny kąt. W sekcji **Subject Alternative Names** często znajdziesz
inne domeny i subdomeny które należą do tej samej organizacji. Netcraft to pokazuje,
crt.sh to pokazuje szerzej.

---

### WAF detection - zanim zaczniesz hałasować

WAF (Web Application Firewall) filtruje ruch do aplikacji webowej. Wykrycie go przed
aktywnym skanowaniem to nie formalność - to zmiana strategii.

Cloudflare zablokuje twój Nmap zanim zdąży zebrać cokolwiek użytecznego.
ModSecurity zablokuje SQLi payloady. Imperva potrafi zbanować IP po kilku podejrzanych
requestach.

```bash
wafw00f https://firma.com

# Sprawdź wszystkie możliwe WAFy (więcej requestów):
wafw00f -a https://firma.com
```

Popularne WAFy i co to zmienia:

- **Cloudflare** - IP jest ukryte, sprawdź Netcraft i Shodan pod kątem historycznych IP
- **AWS WAF** - prawdopodobnie cała infrastruktura na AWS, sprawdź S3 buckets,
  CloudFront distributions
- **ModSecurity** - open source, konfigurowalny, sprawdź czy ma reguły OWASP CRS
- **Imperva (Incapsula)** - korporacyjny, agresywny, trudniejszy w obejściu
- **Brak WAF** - skanuj swobodnie, ale ostrożnie z głośnymi skryptami NSE

---

### Subdomeny - gdzie naprawdę jest powierzchnia ataku

Główna domena to zazwyczaj najlepiej zabezpieczona część infrastruktury.
`dev.firma.com`, `staging.firma.com`, `old-api.firma.com`, `vpn.firma.com` -
to tu są stare wersje aplikacji, zapomniane panele admina, środowiska bez WAF-a,
serwisy które "działają od lat i nikt ich nie ruszał".

**Sublist3r** - agreguje wyniki z wyszukiwarek i innych publicznych źródeł:

```bash
python sublist3r.py -d firma.com

# Z brute force (wolniejszy, ale wykrywa subdomeny których nie ma w wyszukiwarkach):
python sublist3r.py -d firma.com -b

# Z zapisem:
python sublist3r.py -d firma.com -o subdomains.txt

# Przez konkretne silniki:
python sublist3r.py -d firma.com -e google,bing,crtsh
```

**crt.sh - Certificate Transparency Logs** - to jest często skuteczniejsze od Sublist3r.

Każdy certyfikat SSL jest publicznie logowany do Certificate Transparency Logs.
Każda subdomena która kiedykolwiek dostała certyfikat - jest tam. Navet jeśli
subdomeny nie ma już w DNS, rekord w crt.sh zostaje.

```bash
curl -s 'https://crt.sh/?q=%.firma.com&output=json' \
  | jq -r '.[].name_value' \
  | sort -u \
  | grep -v '^*\.'
```

**amass** - najbardziej rozbudowane narzędzie, używa wielu źródeł pasywnych
i opcjonalnie aktywnych technik:

```bash
# Tylko passive:
amass enum -d firma.com

# Passive + active (DNS brute force, zone transfer, permutacje):
amass enum -active -d firma.com

# Z większą ilością źródeł (wymaga konfiguracji API keys):
amass enum -config ~/.config/amass/config.ini -d firma.com
```

**knockpy** - szybki brute force subdomen przez DNS:

```bash
knockpy firma.com
knockpy firma.com -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt
```

**Co z zebraną listą subdomen:**

Nie zatrzymuj się na samej liście. Każda subdomena to potencjalnie inny serwer,
inna technologia, inna powierzchnia ataku. Rób `dig` albo `host` na każdej -
sprawdź jaki IP, czy to CDN czy bezpośredni serwer, czy jest dostępna z internetu.

```bash
# Szybka weryfikacja wszystkich subdomen z pliku:
while read sub; do
  echo -n "$sub: "
  dig +short $sub | head -1
done < subdomains.txt
```

---

### Google Dorks - to co Google zaindeksował bez pytania

Google Dorking to nie "hakowanie przez Google". To precyzyjne zapytania które wyciągają
z indeksu Google to co właściciel strony woleliby żeby tam nie było.

Nie dotykasz serwera celu - czytasz co Google już zebrał. Czyste passive.

#### Operatory - te których faktycznie używam:

**`site:`** - ogranicz wyniki do konkretnej domeny

```
site:firma.com
site:firma.com -www    # bez głównej domeny, tylko subdomeny
```

**`intitle:`** - szukaj w tytule strony

```
intitle:"index of" site:firma.com    # directory listing
intitle:"phpMyAdmin" site:firma.com
intitle:"dashboard" site:firma.com
```

**`inurl:`** - szukaj w URL

```
inurl:admin site:firma.com
inurl:login site:firma.com
inurl:wp-admin site:firma.com
inurl:.git site:firma.com
inurl:api site:firma.com
```

**`filetype:` / `ext:`** - konkretny typ pliku

```
site:firma.com filetype:pdf     # dokumenty - mogą mieć metadane
site:firma.com filetype:env     # pliki konfiguracyjne
site:firma.com filetype:log     # logi
site:firma.com ext:sql          # zrzuty bazy danych
site:firma.com ext:bak          # backupy
site:firma.com ext:conf         # konfiguracje
site:firma.com ext:xml intext:password
```

**`intext:`** - szukaj w treści strony

```
site:firma.com intext:"password"
site:firma.com intext:"BEGIN RSA PRIVATE KEY"
site:firma.com intext:"DB_PASSWORD"
```

#### Praktyczny zestaw startowy dla nowego celu:

```
site:firma.com filetype:env OR filetype:log OR ext:sql OR ext:bak
site:firma.com intitle:"index of" "parent directory"
site:firma.com inurl:admin OR inurl:login OR inurl:dashboard
site:firma.com inurl:.git
site:firma.com intext:"DB_PASSWORD" OR intext:"API_KEY" OR intext:"SECRET_KEY"
site:linkedin.com "firma.com" "developer" OR "engineer" OR "administrator"
```

Ten ostatni dork to złoto przy budowaniu listy pracowników. LinkedIn się nie da
przeszukać przez API bez konta, ale Google indeksuje publiczne profile.

**Gdzie szukać więcej dork'ów:**
Google Hacking Database na exploit-db.com -
[exploit-db.com/google-hacking-database](https://www.exploit-db.com/google-hacking-database)
Setki gotowych zapytań pogrupowanych według kategorii.

---

### theHarvester - e-maile, subdomeny, IP z jednego miejsca

theHarvester odpytuje jednocześnie wiele publicznych źródeł: wyszukiwarki, bazy DNS,
repozytoria certyfikatów, LinkedIn, GitHub. Zbiera adresy e-mail, subdomeny i adresy IP.

```bash
# Podstawowo przez Google:
theHarvester -d firma.com -b google

# Przez wszystkie dostępne źródła:
theHarvester -d firma.com -b all

# Ogranicz liczbę wyników (przydatne gdy baza danych jest duża):
theHarvester -d firma.com -b google -l 500

# Zapisz do HTML i XML:
theHarvester -d firma.com -b all -f wyniki_firma
```

Typowy output wygląda tak:

```
[*] Emails found:
jan.kowalski@firma.com
anna.nowak@firma.com
it@firma.com
admin@firma.com

[*] Hosts found:
mail.firma.com: 93.184.216.10
vpn.firma.com: 185.220.101.12
dev.firma.com: 10.0.0.20

[*] IPs found:
93.184.216.10
185.220.101.12
```

**Wartość emaili jest większa niż się wydaje.** Dwa e-maile wystarczą żeby poznać
schemat nazewnictwa firmy. `jan.kowalski@firma.com` i `a.nowak@firma.com` to
dwa różne formaty - jeden używa pełnego imienia, drugi inicjału. Sprawdź który
jest bardziej typowy i generuj adresy dla osób znalezionych na LinkedIn.

Format emaili + lista pracowników z LinkedIn = lista potencjalnych celów do:
credential stuffing, password spraying, phishingu spear.

---

### Leaked password databases - co robić z breachami

Bazy przejętych haseł to nie tylko materiał do prób logowania. W kontekście
pentestingu to **wywiad o nawykach bezpieczeństwa pracowników**.

Jeśli email pracownika pojawia się w 10 breachach z różnymi hasłami, wiesz że:

- ta osoba ma długą historię używania tego emaila do rejestracji w różnych serwisach
- możliwe że wielu serwisów używa tego samego hasła albo jego wariantów
- przy odpowiednich uprawnieniach w scope możesz testować znane hasła

**Have I Been Pwned** - [haveibeenpwned.com](https://haveibeenpwned.com)

Sprawdza czy adres email był w znanych breachach. Darmowy dla pojedynczych
adresów. API wymaga klucza.

```bash
# Sprawdzenie przez API (wymaga klucza):
curl -s 'https://haveibeenpwned.com/api/v3/breachedaccount/jan.kowalski@firma.com' \
  -H 'hibp-api-key: TWOJ_KLUCZ_API' \
  -H 'User-Agent: Field-Manual-Research'
```

**DeHashed** - [dehashed.com](https://dehashed.com)

Płatny serwis ale bardziej rozbudowany - szuka po emailu, domenie, IP, username,
haśle. Przy testach autoryzowanych możesz sprawdzić całą domenę:

```bash
# Przez API:
curl 'https://api.dehashed.com/search?query=email:@firma.com' \
  -u "email@twoj.com:API_KEY" \
  -H 'Accept: application/json'
```

**breach-parse** - lokalne narzędzie do przeszukiwania własnych kopii baz danych:

```bash
breach-parse @firma.com ~/wyniki_breach
# Generuje:
# wyniki_breach_emailpass.txt  - email:hasło
# wyniki_breach_userpass.txt   - user:hasło
```

**Co robisz z tymi danymi w kontekście pentestingu:**

Hasła z breachów testuje się tylko gdy scope to explicite dopuszcza.
Najczęstsze zastosowanie to pokazanie klientowi że ich pracownicy używają
wyciekniętych danych - i że powinni wdrożyć monitorowanie breachów
(np. własne HIBP Notifications) i obowiązek zmiany hasła po wykryciu.

---

## DNS Zone Transfer - gdy serwer mówi za dużo

### Jak to działa

DNS Zone Transfer (AXFR) to mechanizm synchronizacji między primary
a secondary serwerem DNS. Primary ma wszystkie rekordy. Secondary pobiera
od niego kopię żeby odpowiadać na zapytania kiedy primary jest niedostępny.

W prawidłowej konfiguracji ten transfer jest ograniczony tylko do znanych
adresów IP secondary serwerów. W złej konfiguracji - serwer odpowie na zapytanie
o AXFR od kogokolwiek.

Wynik: dostajesz **pełną listę wszystkich hostów i rekordów DNS w domenie.**
Nie tylko te które są widoczne przez normalne zapytania - dosłownie wszystko
co admin skonfigurował. Wewnętrzne hosty, serwery backupowe, środowiska dev,
hosty na prywatnych zakresach IP.

To nie jest luka w protokole DNS. To błąd konfiguracyjny. Ale trafia się
w starszej infrastrukturze zaskakująco często.

### Jak to wykonać krok po kroku

```bash
# Krok 1: znajdź nameservery domeny
host -t ns firma.com
# Output:
# firma.com name server ns1.firma.com.
# firma.com name server ns2.firma.com.

# Krok 2: spróbuj zone transfer na każdym NS
host -t axfr firma.com ns1.firma.com
host -t axfr firma.com ns2.firma.com

# To samo z dig:
dig axfr @ns1.firma.com firma.com
dig axfr @ns2.firma.com firma.com

# To samo z dnsrecon (automatycznie próbuje na wszystkich NS):
dnsrecon -d firma.com -t axfr
```

**Jeśli serwer jest podatny** - dostaniesz coś takiego:

```
firma.com.           86400  IN  SOA   ns1.firma.com. admin.firma.com. ...
firma.com.           86400  IN  NS    ns1.firma.com.
firma.com.           86400  IN  NS    ns2.firma.com.
firma.com.           86400  IN  A     93.184.216.34
www.firma.com.       86400  IN  A     93.184.216.34
mail.firma.com.      86400  IN  A     93.184.216.10
vpn.firma.com.       86400  IN  A     185.220.101.1    ← endpoint VPN
dev.firma.com.       86400  IN  A     10.0.0.20        ← wewnętrzny host!
backup.firma.com.    86400  IN  A     10.0.0.30        ← serwer backupu!
legacy.firma.com.    86400  IN  A     93.184.216.50    ← "legacy" to zawsze interesujące
db.firma.com.        86400  IN  A     192.168.1.100    ← baza danych na wewnętrznym IP
```

**Jeśli serwer jest dobrze skonfigurowany:**

```
Transfer failed. Broken pipe
# lub:
; Transfer failed. (REFUSED)
# lub:
AXFR record query failed: REFUSED
```

REFUSED to nie błąd. To znaczy że admin wie co robi.

### Ćwiczenia na legalnym celu

`zonetransfer.me` to domena stworzona specjalnie do ćwiczeń zone transfer.
Celowo podatna, legalna, zawsze dostępna:

```bash
# Znajdź NS:
host -t ns zonetransfer.me

# Wykonaj AXFR:
dig axfr @nsztm1.digi.ninja zonetransfer.me
host -t axfr zonetransfer.me nsztm1.digi.ninja
```

Zwróci ~30 rekordów. Dobry materiał do nauki jak wygląda udany transfer
i jak go potem parsować.

---

## Active recon z Nmap - od zera do pełnego profilu

### Jak Nmap naprawdę działa

Nmap nie jest "narzędziem do skanowania portów". To silnik do konstruowania
pakietów, wysyłania ich do celów i interpretowania odpowiedzi. Zrozumienie
tego mechanizmu jest ważne bo wtedy rozumiesz **dlaczego** pewne skany
zachowują się jak się zachowują i co znaczą wyniki których nie rozumiesz.

TCP port scan w podstawowej wersji: wysyłasz SYN, patrzysz co dostajesz:

- **SYN-ACK** → port jest `open` (usługa nasłuchuje i zaakceptowała połączenie)
- **RST** → port jest `closed` (host żyje, port dostępny, brak usługi)
- **nic / ICMP unreachable** → port jest `filtered` (coś blokuje pakiety)

To jest fundament. Wszystkie flagi Nmap to modyfikacje tego procesu.

### Krok 1: host discovery

Przed skanowaniem portów chcesz wiedzieć co w sieci żyje. Odpytywanie martwych
hostów to marnowanie czasu i generowanie szumu.

```bash
# Ping scan - tylko wykryj żywe hosty, bez skanowania portów:
nmap -sn 192.168.1.0/24

# Co wysyła -sn:
# - ICMP Echo Request (klasyczny ping)
# - TCP SYN na port 443
# - TCP ACK na port 80
# - ICMP Timestamp Request
```

Typowy output:

```
Nmap scan report for 192.168.1.1
Host is up (0.0015s latency).

Nmap scan report for 192.168.1.10
Host is up (0.0022s latency).

Nmap scan report for 192.168.1.50
Host is up (0.0089s latency).

Nmap done: 254 IP addresses (3 hosts up) scanned in 2.45 seconds
```

**Jeśli ICMP jest zablokowany** - typowe w środowiskach produkcyjnych gdzie admini
domyślnie blokują ping - użyj `-Pn`:

```bash
# Traktuj wszystkie hosty jako żywe i od razu skanuj porty:
nmap -Pn 192.168.1.0/24
```

Uwaga: `-Pn` jest wolniejszy przy skanowaniu sieci bo skanuje porty nawet na
martwych hostach. Na małych zakresach (kilka hostów) używaj swobodnie.
Na /24 z `-Pn` poczekaj.

**Wyciągnij listę żywych hostów do pliku:**

```bash
nmap -sn 192.168.1.0/24 -oG - | grep "Up" | awk '{print $2}' > live_hosts.txt
```

### Krok 2: typy skanów portów

**SYN scan (`-sS`) - domyślny dla roota**

Wysyła SYN, po SYN-ACK odpowiada RST (nie kończy handshake).
Szybki i mniej widoczny w logach aplikacji bo połączenie nie jest kompletne.
Sieciowe IDS i SIEM to jednak zobaczą. Wymaga uprawnień root.

```bash
sudo nmap -sS 192.168.1.10
```

**Connect scan (`-sT`) - dla nie-roota**

Pełny TCP handshake. Połączenie jest rejestrowane w logach aplikacji.
Wolniejszy od SYN scan. Nie wymaga root.

```bash
nmap -sT 192.168.1.10
```

**UDP scan (`-sU`)**

Ignorowany przez większość ludzi. To błąd. DNS (53), SNMP (161), DHCP (67/68),
TFTP (69), NFS (2049) - to usługi UDP. SNMP bez uwierzytelnienia daje pełny
zrzut informacji o systemie. DNS na UDP to potencjalny zone transfer.

```bash
sudo nmap -sU --top-ports 25 192.168.1.10
```

UDP jest wolny bo kernel czeka na ICMP port unreachable zanim oznakuje port
jako `closed`. Open ports nie odpowiadają - stąd `open|filtered` w outputcie.

**ACK scan (`-sA`) - mapowanie firewalla**

Nie wykrywa otwartych portów w sensie usług. Wysyła ACK i sprawdza czy dostaje
RST (unfiltered) czy nic (filtered). Używany do mapowania reguł firewalla.

### Krok 3: wykrywanie wersji i OS

```bash
nmap -sV 192.168.1.10
```

`-sV` to moment kiedy "otwarty port" staje się "potencjalnie podatna wersja usługi".

```
PORT     STATE  SERVICE  VERSION
22/tcp   open   ssh      OpenSSH 7.4 (protocol 2.0)
80/tcp   open   http     Apache httpd 2.4.49
443/tcp  open   ssl/http Apache httpd 2.4.49
3306/tcp open   mysql    MySQL 5.7.36
```

`Apache 2.4.49` - to jest CVE-2021-41773, path traversal do RCE.
`OpenSSH 7.4` - sprawdź CVE database dla tej gałęzi.
`MySQL` publicznie dostępny - prawdopodobnie błąd konfiguracji, sprawdź dostęp.

Wersja = wejście do Searchsploit, CVE Mitre, Exploit-DB.

```bash
searchsploit apache 2.4.49
searchsploit openssh 7.4
```

**OS detection:**

```bash
sudo nmap -O 192.168.1.10
```

Nmap analizuje charakterystyczne elementy odpowiedzi TCP/IP żeby odgadnąć OS.
Nie zawsze ma rację, ale w 80% przypadków wynik jest użyteczny.

### Krok 4: NSE - skrypty które piszą za ciebie raport

NSE (Nmap Scripting Engine) to framework do pisania skryptów w Lua które rozszerzają
możliwości Nmapa o zaawansowane wykrywanie, enumerację i sprawdzanie podatności.

Skrypty są w `/usr/share/nmap/scripts/`. Jest ich kilkaset.

**Domyślne skrypty (`-sC`) - bezpieczne, zbierające informacje:**

```bash
nmap -sC 192.168.1.10
```

Odpala skrypty z kategorii `default`. Bezpieczne znaczy: nie exploitują, nie bruteforce'ują,
tylko zbierają informacje. Typowe wyniki:

```
| http-title: Firma XYZ - Panel Zarządzania
| ssh-hostkey:
|   2048 aa:bb:cc:dd... (RSA)
| ssl-cert: Subject: commonName=firma.com
|   SANs: firma.com, www.firma.com, api.firma.com    ← dodatkowe subdomeny!
```

**Konkretne skrypty według scenariusza:**

```bash
# SMB - sprawdź EternalBlue (MS17-010):
nmap --script=smb-vuln-ms17-010 192.168.1.10

# SMB - enum shares, users, policies:
nmap --script=smb-enum-shares,smb-enum-users 192.168.1.10

# FTP - anonymous login:
nmap --script=ftp-anon 192.168.1.10

# HTTP - tytuł, metody, potencjalne ścieżki:
nmap --script=http-title,http-methods,http-enum 192.168.1.10

# SSH - obsługiwane algorytmy:
nmap --script=ssh2-enum-algos 192.168.1.10

# MySQL - info bez uwierzytelnienia:
nmap --script=mysql-info 192.168.1.10

# Pełny vuln scan (hałaśliwy, może triggerować IDS):
nmap --script=vuln 192.168.1.10
```

Szukanie skryptów:

```bash
ls /usr/share/nmap/scripts/ | grep smb
ls /usr/share/nmap/scripts/ | grep http
nmap --script-help="smb-vuln-*"
```

### Stany portów - co naprawdę mówią

| Stan             | Co oznacza                                    | Co z tym robić                                               |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `open`           | Usługa nasłuchuje, połączenie możliwe         | Idź dalej - enumeruj usługę, sprawdź wersję                  |
| `closed`         | Host żyje, port dostępny, brak usługi         | Potwierdza że host istnieje; port może być otwarty później   |
| `filtered`       | Firewall/filtr blokuje pakiety, stan nieznany | Firewall jest aktywny; coś tu prawdopodobnie jest            |
| `open\|filtered` | Nie wiadomo czy open czy filtered             | Typowe dla UDP - usługa może nie odpowiadać na puste pakiety |
| `unfiltered`     | Port dostępny, ale stan nieznany (ACK scan)   | Używany przy mapowaniu firewalla                             |

### Wybór portów - kiedy co skanujesz

```bash
# Domyślnie: top 1000 portów TCP
nmap 192.168.1.10

# Konkretne porty:
nmap -p 80,443,8080,8443 192.168.1.10

# Zakres:
nmap -p 1-65535 192.168.1.10
# Skrót:
nmap -p- 192.168.1.10

# Top N:
nmap --top-ports 100 192.168.1.10
nmap --top-ports 1000 192.168.1.10
```

**Kiedy używasz `-p-`:** gdy standardowe top 1000 daje mało albo nic ciekawego.
Usługi admina, alternatywne HTTP, panele zarządzania często siedzą na niestandardowych
portach: 8080, 8443, 8888, 9090, 9200, 3000, 5000, 9000.

### Prędkość skanowania (`-T`)

| Flaga | Nazwa      | Kiedy używam                                 |
| ----- | ---------- | -------------------------------------------- |
| `-T0` | Paranoid   | Maksymalne ukrycie, 5 minut między pakietami |
| `-T1` | Sneaky     | Unikanie IDS, bardzo wolny                   |
| `-T2` | Polite     | Minimalne obciążenie sieci                   |
| `-T3` | Normal     | Domyślny                                     |
| `-T4` | Aggressive | CTF, laboratoria, szybkie sieci              |
| `-T5` | Insane     | Tylko lokalnie, ryzyko pominięć              |

Na engagementach w środowiskach produkcyjnych: `-T2` albo `-T3`.
Na CTF i labach eJPT: `-T4`.

### Zapis wyników - zawsze

```bash
# Trzy formaty jednocześnie:
nmap -sV -sC -O 192.168.1.10 -oA nazwa_skanu

# Generuje:
# nazwa_skanu.nmap   - czytelny output
# nazwa_skanu.xml    - XML (dla importu do Metasploit, Faraday, itp.)
# nazwa_skanu.gnmap  - grep-able (łatwy do parsowania skryptami)
```

Po sesji ciężko odtworzyć co dokładnie widziałeś. `-oA` jest darmowy i zajmuje
sekund. Zawsze.

### Złote komendy - tego używam najczęściej

```bash
# ── ETAP 1: Co żyje w sieci ─────────────────────────────
nmap -sn 192.168.1.0/24

# ── ETAP 2: Szybki profil pojedynczego hosta ────────────
nmap -sV -sC -O -T4 192.168.1.10 -oA quick_scan

# ── ETAP 3: Pełny scan (wszystkie porty) ────────────────
nmap -p- -sV -T4 192.168.1.10 -oA full_scan

# ── ETAP 4: Targeted NSE na podstawie wyników ───────────
nmap --script=smb-vuln-ms17-010,smb-enum-shares -p 445 192.168.1.10
nmap --script=http-enum,http-title -p 80,443,8080 192.168.1.10

# ── AGGRESSIVE (wszystko naraz, hałaśliwy) ──────────────
nmap -A -T4 192.168.1.10 -oA aggressive_scan
# -A = -sV -sC -O --traceroute
```

---

## Porty które zawsze sprawdzam - co mnie na nich interesuje

Poniżej nie jest to "lista portów do zapamiętania". To jest lista pytań które zadaję
sobie gdy widzę konkretny port.

**21 - FTP**
Anonymous login? `nmap --script=ftp-anon`. Jaka wersja? Sprawdź CVE.
vsFTPd 2.3.4 to backdoor. ProFTPD 1.3.3c też ma historię.

**22 - SSH**
Wersja OpenSSH → CVE lookup. Czy akceptuje password auth czy tylko key?
`ssh -o PreferredAuthentications=password user@host`. Jakie algorytmy?
Stare (arcfour, 3des) sugerują starą infrastrukturę.

**23 - Telnet**
Nieszyfrowany. Jeśli aktywny - prawie na pewno legacy urządzenie.
Podsłuchaj (`tcpdump -i eth0 port 23`) albo brute force.

**25 - SMTP**
Enumeracja użytkowników przez `VRFY` i `EXPN` jeśli serwer na to pozwala.
`nmap --script=smtp-enum-users`. Sprawdź open relay.

**53 - DNS**
UDP: normalne zapytania, zone transfer (AXFR) przez TCP.
Zawsze próbuj zone transfer jeśli widzisz port 53 TCP otwarty.

**80/443 - HTTP/HTTPS**
Punkt wejścia do web app testing. Po Nmap: gobuster/feroxbuster,
nikto, sprawdź robots.txt, sitemap, nagłówki.

**139/445 - SMB/NetBIOS**
`smb-vuln-ms17-010` - EternalBlue. `smb-enum-shares` - co jest
dostępne. Null session? Sprawdź logowanie bez hasła.
To jest często najszybsza droga na Windows.

**3306 - MySQL**
Publicznie dostępny MySQL to prawie zawsze błąd konfiguracji.
Sprawdź anonymous login, brute force roota, sprawdź wersję pod CVE.

**3389 - RDP**
Windows Remote Desktop. BlueKeep (CVE-2019-0708) na starszych Windows.
Brute force jest możliwy ale głośny. Sprawdź Network Level Authentication.

**5900 - VNC**
Często słabe lub brak hasła. `nmap --script=vnc-info,vnc-brute`.

**6379 - Redis**
Często bez uwierzytelnienia. Bezpośredni dostęp do całej bazy danych.
W niektórych konfiguracjach prowadzi do RCE przez manipulację `cron`
albo `~/.ssh/authorized_keys`.

**8080/8443 - HTTP alternatywny**
Często panel zarządzania, Tomcat manager, Jenkins, Grafana, inne narzędzia.
Sprawdź domyślne hasła dla znalezionej technologii.

**27017 - MongoDB**
Często bez uwierzytelnienia w starszych deploymentach. Jeśli jest otwarty
publicznie - prawdopodobnie masz dostęp do całej bazy.

---

## Gdzie najczęściej coś się traci

**Skanowanie tylko top 1000 portów.** Ważne usługi siedzą na niestandardowych
portach. Panel admina Jenkinsa na 8080. Grafana na 3000. Elasticsearch na 9200.
Jeśli standardowy scan daje mało - `nmap -p-` i nie żałuj czasu.

**Pomijanie UDP.** SNMP (161) bez community stringa daje pełną informację o routerze.
DNS na UDP (53) to potencjalny zone transfer przez TCP. NFS (2049) może dać
dostęp do share'ów bez autoryzacji.

**Brak zone transfer.** Za każdym razem gdy znajduję nameserver, próbuję AXFR.
Większość odpowie REFUSED. Ale raz na jakiś czas trafi się podatny serwer
i dostaniesz kompletną mapę infrastruktury.

**Ignorowanie certyfikatów SSL.** SANs (Subject Alternative Names) w certyfikacie
często zawierają subdomeny których nie znalazłeś nigdzie indziej.
`nmap -sC` wypluje to automatycznie w sekcji `ssl-cert`.

**Nieużywanie `-oA`.** Po 4h sesji nie pamiętasz co było gdzie. XML output
importuje się do Metasploit, CherryTree, Faraday. Greppable format pozwala
szybko wyciągnąć tylko otwarte porty. Zawsze zapisuj.

**Zakładanie że CDN = prawdziwy IP.** Cloudflare, Akamai, Fastly ukrywają
prawdziwe IP. Sprawdź Netcraft historię, Shodan, subdomeny bez CDN
(np. `mail.firma.com` często prowadzi bezpośrednio do serwera).

**Pominięcie passive przed active.** Wchodzisz z Nmapem nie wiedząc że firma
ma WAF który banuje IP po 10 zapytaniach. Albo że subdomena którą chcesz
skanować jest na Cloudflare i twoje skany są bezużyteczne.

---

## Kompletny workflow - od pustej kartki do mapy celu

```
┌─────────────────────────────────────────┐
│  1. DEFINE SCOPE                        │
│     Co jest in-scope?                   │
│     Co jest out-of-scope?               │
│     Autoryzacja dla aktywnych technik?  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. PASSIVE RECON                       │
│                                         │
│  whois firma.com                        │
│    └─ zapisz NS, e-maile, daty          │
│                                         │
│  dnsrecon -d firma.com -t std           │
│    └─ zapisz A, MX, NS, TXT, CNAME      │
│                                         │
│  sublist3r / amass / crt.sh             │
│    └─ zapisz subdomeny                  │
│                                         │
│  whatweb / Netcraft                     │
│    └─ technologie, historia hostingu    │
│                                         │
│  curl robots.txt / sitemap.xml          │
│    └─ ukryte ścieżki                    │
│                                         │
│  wafw00f                                │
│    └─ czy jest WAF i jaki               │
│                                         │
│  theHarvester -b all                    │
│    └─ e-maile, dodatkowe subdomeny      │
│                                         │
│  Google Dorks                           │
│    └─ pliki, panele, directory listing  │
│                                         │
│  HIBP / DeHashed                        │
│    └─ czy e-maile były w breachach      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. ACTIVE RECON                        │
│                                         │
│  nmap -sn 192.168.1.0/24               │
│    └─ które hosty żyją                  │
│                                         │
│  nmap -sV -sC -O -T4 <live_hosts>      │
│    └─ wersje usług, OS, domyślne NSE    │
│                                         │
│  nmap -p- <hosty z małą liczbą portów> │
│    └─ niestandardowe porty              │
│                                         │
│  host -t axfr firma.com <każdy NS>      │
│    └─ zone transfer                     │
│                                         │
│  Targeted NSE scripts                   │
│    └─ na podstawie znalezionych portów  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  4. DOCUMENT & ORGANIZE                 │
│     Lista subdomen z IP                 │
│     Mapa żywych hostów                  │
│     Porty i wersje usług                │
│     Technologie i potencjalne CVE       │
│     E-maile i schemat nazewnictwa       │
│     → Wchodzisz w enumerację            │
└─────────────────────────────────────────┘
```

---

## Cheat sheet - to co mam pod ręką podczas pracy

```bash
# ── WHOIS ────────────────────────────────────────────────
whois firma.com
whois 93.184.216.34

# ── DNS ──────────────────────────────────────────────────
dig firma.com ANY
host -t mx firma.com
host -t ns firma.com
host -t txt firma.com
dnsrecon -d firma.com -t std

# ── ZONE TRANSFER ────────────────────────────────────────
host -t ns firma.com
host -t axfr firma.com ns1.firma.com
dig axfr @ns1.firma.com firma.com
dnsrecon -d firma.com -t axfr

# ── SUBDOMENY ────────────────────────────────────────────
python sublist3r.py -d firma.com -o subs.txt
curl -s 'https://crt.sh/?q=%.firma.com&output=json' | jq -r '.[].name_value' | sort -u
amass enum -d firma.com

# ── FOOTPRINTING ─────────────────────────────────────────
whatweb https://firma.com
wafw00f https://firma.com
curl -sI https://firma.com
curl -s https://firma.com/robots.txt

# ── HARVESTING ───────────────────────────────────────────
theHarvester -d firma.com -b all -f wyniki

# ── NMAP HOST DISCOVERY ──────────────────────────────────
nmap -sn 192.168.1.0/24
nmap -Pn 192.168.1.10            # gdy ICMP blokowany

# ── NMAP PORT SCAN ───────────────────────────────────────
nmap -sV -sC -O -T4 192.168.1.10 -oA wyniki
nmap -p- -sV -T4 192.168.1.10 -oA full
nmap -sU --top-ports 25 192.168.1.10

# ── NMAP NSE ─────────────────────────────────────────────
nmap --script=smb-vuln-ms17-010 -p 445 192.168.1.10
nmap --script=ftp-anon -p 21 192.168.1.10
nmap --script=http-title,http-enum -p 80,443,8080 192.168.1.10
nmap --script=vuln 192.168.1.10

# ── SEARCHSPLOIT (po znalezieniu wersji) ─────────────────
searchsploit apache 2.4.49
searchsploit openssh 7.4
searchsploit wordpress 5.9
```

---

## Jedna rzecz którą zatrzymuję

Passive recon nie jest "wstępem" do właściwego pentestingu.
**To jest właściwy pentesting** - tylko że cichy, niewidoczny i często
daje więcej niż godzina skanowania Nmapem.
