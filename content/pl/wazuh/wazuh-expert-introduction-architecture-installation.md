---
id: wazuh-expert-introduction-architecture-installation
title: "Wazuh Expert 1/5 - wprowadzenie, architektura, instalacja i pierwszy lab"
team: blue
category: wazuh expert 2024
tags: ["wazuh", "siem", "xdr", "soc", "blue-team", "detection", "ossec", "agentless"]
difficulty: medium
updatedAt: "2026-03-25"
---

# Wazuh Expert 1/5 - wprowadzenie, architektura, instalacja i pierwszy lab

## Dlaczego w ogóle robię tę notatkę

Bo przy Wazuhu bardzo łatwo wejść w dwa złe tryby myślenia.

Pierwszy: traktować go jak kolejny panel do logów.  
Drugi: traktować go jak magiczne pudełko, które po wdrożeniu samo ogarnie monitoring, detekcję i response.

A prawda jest dużo prostsza i dużo bardziej użyteczna:

**Wazuh daje bardzo solidny szkielet pod widoczność, detekcję i częściowo automatyczną reakcję, ale tylko wtedy, kiedy rozumiem dane, architekturę, reguły i logikę działania całego systemu.**

Ta notatka ma mi poukładać fundamenty. Nie pod klikanie w dashboardzie. Pod realne rozumienie, co ten system widzi, jak to interpretuje i gdzie zaczyna się jego prawdziwa wartość.

---

## Czym dla mnie jest Wazuh

Najprościej:

**Wazuh to praktyczny system klasy SIEM z elementami podejścia XDR, zbudowany wokół zbierania telemetrii, analizy zdarzeń, reguł, dekoderów i możliwości wykonania automatycznej reakcji.**

To nie jest tylko zbieranie logów.  
To jest cały łańcuch:

- zbieranie danych z endpointów,
- analiza logów,
- korelacja,
- detekcja,
- monitoring integralności plików,
- wykrywanie podatności,
- incident response,
- security analytics,
- compliance,
- cloud i container security.

Najważniejsze: to nadal czuć jako system mocno inżynierski. Nie “ładny SaaS”, tylko narzędzie, które trzeba zrozumieć. Dashboard pomaga, ale nie zastępuje myślenia.

---

## Kiedy Wazuh zaczyna mieć sens

Nie każda infrastruktura potrzebuje Wazuha od pierwszego dnia.

Jeśli mam kilka komputerów i prosty układ, mogę jeszcze żyć bez takiego systemu. Ale kiedy środowisko zaczyna mieć kilkanaście, kilkadziesiąt albo więcej endpointów, wtedy zaczyna boleć:

- brak centralnego widoku,
- chaos w logach,
- brak korelacji,
- brak spójnej detekcji,
- brak automatyzacji.

I właśnie wtedy Wazuh zaczyna być praktyczny.

**Nie jako cel sam w sobie.  
Jako narzędzie, które oszczędza czas, porządkuje dane i buduje kontrolę nad środowiskiem.**

---

## Dlaczego samo IPS / IDS / antywirus nie zamyka tematu

Bo obrońca musi ogarniać całość, a atakujący potrzebuje jednej sensownej ścieżki.

To może być:

- luka techniczna,
- socjotechnika,
- phishing,
- słaby proces,
- sekwencja drobnych sygnałów, które osobno nie wyglądają groźnie, ale razem układają się w atak.

Pojedyncze narzędzia bezpieczeństwa widzą tylko fragment obrazu.  
SIEM ma sens wtedy, kiedy:

- zbiera dane z wielu źródeł,
- odfiltrowuje część szumu,
- nadaje kontekst,
- koreluje zdarzenia,
- i pozwala przejść od pojedynczego logu do sensownej historii ataku.

Bez tego bardzo łatwo utonąć w hałasie i nie zauważyć czegoś, co dojrzewało tygodniami.

---

## SIM, SEM, SIEM, XDR - jak to sobie układam w głowie

### SIM

Zbiera informacje z różnych źródeł.  
Problem: sam zbiór danych nie daje jeszcze przewagi. Szumu może być za dużo.

### SEM

Daje analizę zdarzeń bliżej czasu rzeczywistego, obsługę eventów i ich operacyjne użycie.

### SIEM

Łączy oba światy:

- zbieranie,
- filtrowanie,
- korelację,
- analizę,
- wizualizację.

### XDR

Idzie bardziej w aktywną ochronę, zachowania, endpoint i odpowiedź. Bardziej behawioralnie, mniej tylko “po sygnaturach”.

### Wazuh

Dla mnie praktycznie:
**SIEM + część myślenia XDR + Active Response + rozsądny próg wejścia.**

---

## Najważniejszy mindset: alert to nie koniec roboty

Stary model bezpieczeństwa bardzo często kończy się na:

**“coś się wydarzyło”**

To za mało.

Interesujące robi się dopiero wtedy, kiedy mam cały łańcuch:

- log trafia do systemu,
- system go rozumie,
- reguła nadaje mu znaczenie,
- alert dostaje poziom i kontekst,
- mogę zdecydować, czy chcę tylko widzieć, czy też od razu reagować.

I właśnie dlatego Active Response jest tak ważny.  
Bo system przestaje być tylko obserwatorem.

---

## Kill chain - po co mi to przy detekcji

Nie uczę się kill chain dla definicji.  
Uczę się go po to, żeby wiedzieć, **na którym etapie ataku mam widoczność, a na którym jestem ślepy.**

Podstawowy model, który chcę pamiętać:

1. rekonesans,
2. uzbrajanie,
3. dostarczenie,
4. eksploatacja,
5. utrzymanie dostępu,
6. command and control,
7. eksfiltracja / działania końcowe.

Jeśli tworzę regułę, to nie pytam tylko:

**“czy to zły log?”**

Pytam raczej:

**“jaki etap ataku próbuję tu zobaczyć?”**

To dużo lepiej ustawia myślenie o detekcji.

---

## TTP i MITRE ATT&CK - po co mi to przy Wazuhu

TTP nie są ozdobą do dashboardu.

To jest sposób opisu zachowania przeciwnika:

- **Tactics** - po co coś robi,
- **Techniques** - jak to robi,
- **Procedures** - jak wygląda to w praktyce.

Jeśli reguły nie są osadzone w takim myśleniu, to bardzo łatwo zbudować system, który generuje mnóstwo zdarzeń, ale słabo tłumaczy, **co właściwie widzi i dlaczego to ma znaczenie**.

Czyli:

- nie robię detekcji “bo log wygląda dziwnie”,
- robię detekcję pod konkretne zachowania przeciwnika.

---

## IOC - na jakie sygnały chcę patrzeć

Wskaźnik kompromitacji to nie tylko hash albo domena.

W praktyce warto pamiętać o takich sygnałach:

- dziwne aktywności logowania,
- nietypowe zapytania DNS,
- “nieludzki” web traffic,
- anomalie geolokacyjne,
- nietypowa aktywność IN/OUT,
- zwiększony odczyt i zapis,
- problemy z usługami,
- zmiany rejestrowe,
- spowolnienie systemu,
- nietypowe wielkości ramek i pakietów,
- wzrost liczby zapytań i odpowiedzi,
- DDoS,
- zachowania odstające od normalnego rytmu środowiska.

Najważniejsze nie jest wykucie listy.  
Najważniejsze jest nauczyć się rozpoznawać, **co zaczyna odstawać od normy**.

---

## Architektura, którą muszę naprawdę rozumieć

### Wazuh Server

Centralny punkt analizy.

To on:

- przyjmuje dane od agentów,
- przepuszcza je przez dekodery i reguły,
- zarządza agentami,
- generuje alerty.

### Wazuh Indexer

Silnik przechowywania i wyszukiwania.

To tutaj trafiają dane i alerty, żeby można było je później szybko przeszukiwać i analizować.

### Wazuh Dashboard

Warstwa webowa do pracy operacyjnej, wizualizacji i części konfiguracji.

Wygodna, ale nie może być jedynym miejscem, które rozumiem.

### Wazuh Agent

Siedzi na końcówce i dostarcza telemetrię.

To właśnie agent daje dużą część widoczności nad endpointem.

### Agentless

Bardzo ważny tryb pracy.

Jeśli nie mogę postawić klasycznego agenta, nadal mogę monitorować host np. przez SSH albo Syslog.

**Brak klasycznego agenta nie musi oznaczać ślepej plamy.**

---

## Endpointy, a nie tylko “agenty”

To drobna, ale ważna zmiana myślenia.

Nie patrzę już tylko na “agenta”, ale szerzej na **endpoint** jako punkt końcowy w środowisku, z którego chcę mieć widoczność.

To dobrze ustawia cały temat:

- nie chodzi tylko o instalację klienta,
- chodzi o sensowne objęcie środowiska widocznością.

---

## Porty, które chcę znać z głowy

Jeśli coś nie działa, to bardzo często problem nie leży w “magii Wazuha”, tylko w komunikacji.

Na start chcę pamiętać:

- `1514/TCP, UDP` - agent ↔ server
- `514/TCP, UDP` - agentless / Syslog
- `55000/TCP` - RESTful API
- `9200/TCP` - Indexer API
- `443/TCP` - Dashboard

To jest ten typ wiedzy, który później realnie oszczędza czas przy troubleshootingu.

Bo wiele “dziwnych problemów” kończy się na:

- firewallu,
- routingu,
- certyfikatach,
- źle otwartym porcie,
- albo komunikacji między komponentami.

---

## Wymagania - teoria kontra życie

Dla małych wdrożeń przewijają się orientacyjne widełki typu:

- 1–25 agentów: około 4 vCPU, 8 GB RAM, 50 GB storage
- 25–50 agentów: więcej miejsca na dane i większa ostrożność przy retencji
- 50–100 agentów: storage zaczyna boleć jeszcze bardziej

Ale najważniejszy wniosek praktyczny jest prosty:

**najbardziej boli nie tabelka, tylko realny napływ danych.**

Czyli patrzę nie tylko na:

- CPU,
- RAM,
- storage,

ale też na:

- liczbę endpointów,
- typ zbieranych logów,
- retencję,
- ilość szumu,
- liczbę alertów,
- to, ile bez sensu indeksuję.

Da się zabić środowisko nie złym sprzętem, tylko złym zakresem zbierania.

---

## Dokumentacja > pamięciówka

To jest jedna z najważniejszych rzeczy z całego modułu.

Wazuh szybko się zmienia.  
Wersje się rozwijają, moduły się zmieniają, część mechanizmów jest przebudowywana.

Dlatego nie chcę uczyć się Wazuha jak zestawu losowych trików z internetu.

Chcę mieć taki odruch:

1. rozumiem model działania,
2. wiem, gdzie szukać,
3. dokumentacja jest źródłem prawdy.

Quick start i gotowe komendy są wygodne, ale same w sobie nie budują zrozumienia.

---

## Instalacja standalone - szybki start, ale z głową

Najprostsza ścieżka do pierwszego laba:

```bash
sudo apt update
curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh && sudo bash ./wazuh-install.sh -a
```

To jest dobra droga do środowiska standalone, bo pozwala szybko postawić działający serwer bez ręcznego składania wszystkiego od zera.

Ale ważniejszy od samej komendy jest workflow:

- pobrać skrypt,
- sprawdzić, co się uruchamia,
- wykonać instalację,
- zapisać hasła,
- zalogować się do dashboardu,
- sprawdzić logi managera.

Czyli:

**“działa” nie znaczy jeszcze “jest dobrze wdrożone”.**

Po instalacji warto od razu sprawdzić:

```bash
cat /var/ossec/logs/ossec.log
```

---

## Pierwszy lab - sensowna kolejność

Dobry workflow na start wygląda tak:

1. stawiam serwer Wazuh,
2. stawiam klienta Linux,
3. stawiam klienta Windows,
4. opcjonalnie dokładam host agentless,
5. dopiero potem waliduję komunikację i zaczynam tuning.

To jest dobry układ, bo uczy myślenia:

**postaw → podłącz → zweryfikuj → dopiero stroisz**

---

## Linux agent - co jest tu naprawdę ważne

Najpierw porządek na hoście:

```bash
sudo apt update
sudo hostnamectl set-hostname linux-wazuh
```

Potem w dashboardzie:

- Server management
- Endpoint Summary
- Add and deploy new agents
- wybór Linux / DEB amd64
- wskazanie adresu serwera
- wygenerowanie komendy dla klienta

Przykładowy przebieg:

```bash
wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.9.0-1_amd64.deb && \
sudo WAZUH_MANAGER='IP_SERWERA' dpkg -i ./wazuh-agent_4.9.0-1_amd64.deb
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

Najważniejsze:
**agent jest naprawdę dodany dopiero wtedy, kiedy widzę go w Endpoint Summary.**

Nie wtedy, kiedy komenda przeszła bez błędu.

---

## Windows agent - ten sam model myślenia

Na Windowsie logika jest identyczna:

- PowerShell jako administrator,
- Dashboard → Endpoint Summary,
- Deploy new agent,
- wybór Windows / MSI,
- podanie adresu serwera,
- wygenerowanie komendy,
- start usługi.

Przykład:

```powershell
Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi -OutFile ${env.tmp}\wazuh-agent
msiexec.exe /i ${env.tmp}\wazuh-agent /q WAZUH_MANAGER='IP_SERWERA'
NET START WazuhSvc
```

Znowu:
sukces nie polega na tym, że MSI się zainstalował.
Sukces polega na tym, że endpoint realnie gada z serwerem i pojawia się w panelu.

---

## Agentless - jedna z najbardziej wartościowych rzeczy z tego modułu

To jest naprawdę ważne.

Nie każda końcówka pozwoli na klasycznego agenta.
Czasem to będzie host, gdzie łatwiej wejść przez SSH.
Czasem urządzenie sieciowe.
Czasem inny system, który lepiej podpiąć inaczej.

Podstawowy workflow agentless:

1. generuję klucz dla użytkownika `wazuh`,
2. kopiuję klucz na host docelowy,
3. rejestruję host przez `register_host.sh`,
4. dodaję sekcję `<agentless>` do `ossec.conf`,
5. instaluję `expect`,
6. restartuję `wazuh-manager`,
7. waliduję dane w dashboardzie.

Przykład:

```bash
sudo -u wazuh ssh-keygen
ssh-copy-id -i /var/ossec/.ssh/id_rsa root@IP
sudo apt install -y expect
/var/ossec/agentless/register_host.sh add root@IP NOPASS
/var/ossec/agentless/register_host.sh list
systemctl restart wazuh-manager
```

Przykładowa sekcja w `ossec.conf`:

```xml
<agentless>
  <type>ssh_integrity_check_linux</type>
  <frequency>3600</frequency>
  <host>root@IP</host>
  <state>periodic</state>
  <arguments>/bin /etc/ /sbin</arguments>
</agentless>
```

Najważniejszy wniosek:

**brak klasycznego agenta nie musi oznaczać braku monitoringu.**

---

## `ossec.conf` - tu zaczyna się prawdziwy Wazuh

To nie jest tylko jeden z wielu plików.

To jest centralny punkt konfiguracji, wokół którego kręci się bardzo dużo istotnych rzeczy:

- ustawienia globalne,
- log collection,
- alerts,
- rules,
- syscheck,
- rootcheck,
- active-response,
- agentless.

To właśnie tutaj zaczyna się prawdziwa praca z Wazuhem:

- tuning,
- ustalanie zakresu monitoringu,
- logika reakcji,
- późniejsze rozwiązywanie problemów.

Dashboard bardzo pomaga, ale nie zwalnia z rozumienia tego, **co się zmienia i po co**.

---

## Reguły - zasada higieny, którą chcę pamiętać zawsze

Najważniejsza zasada:

**nie modyfikuję bazowych reguł, jeśli nie muszę.
Pracuję na `local_rules.xml`.**

Dodatkowo:

- ID poniżej `100000` są zarezerwowane,
- własne reguły trzeba testować,
- nie rozwalam bazowego rulesetu tylko dlatego, że chciałem coś “szybko poprawić”.

To jest nudna zasada tylko do momentu pierwszego update’u.
Potem okazuje się, że to była różnica między porządkiem a katastrofą.

---

## Poziomy reguł - prosty filtr na szum

Warto pamiętać, że nie każde dopasowanie ma tę samą wagę.

Poziomy reguł pomagają oddzielić:

- drobny szum,
- mniej istotne zdarzenia,
- od sygnałów, które naprawdę mają znaczenie operacyjne.

To niby detal, ale właśnie takie detale decydują o tym, czy system będzie użyteczny, czy będzie tylko generował hałas.

---

## Dekodery - bez nich reguły są ślepe

Reguła ma sens dopiero wtedy, kiedy log został poprawnie zrozumiany.

I właśnie po to są dekodery.

Praktycznie wygląda to tak:

1. log trafia do systemu,
2. dekoder rozpoznaje strukturę,
3. pola zostają wyciągnięte,
4. reguła podejmuje decyzję.

Czyli:

- dekoder mówi systemowi, **co widzi**,
- reguła mówi systemowi, **co to znaczy**.

Jeśli chcę kiedyś robić własne dopasowania, to muszę rozumieć ten łańcuch.

---

## Active Response - moment, w którym monitoring zamienia się w działanie

To jest jedna z najciekawszych rzeczy w Wazuhu.

Jeśli pojawi się określone zdarzenie, mogę wyzwolić akcję:

- blokadę adresu IP,
- wykonanie skryptu,
- reakcję po stronie hosta,
- reakcję po stronie serwera.

I właśnie tu monitoring przestaje być tylko pasywnym patrzeniem.

Ale trzeba pamiętać o pułapce:

**zbyt agresywna lub źle dostrojona reakcja może zacząć karać normalny ruch.**

Czyli:
Active Response daje moc, ale wymaga tuningu i rozsądku.

Nie chodzi o to, żeby wszystko blokować.
Chodzi o to, żeby reagować sensownie.

---

## Najważniejsze ścieżki, które chcę znać

Na start chcę pamiętać przede wszystkim te miejsca:

- `/var/ossec/logs/`
- `/var/ossec/etc/ossec.conf`
- `/var/ossec/active-response/bin/`
- `/var/ossec/etc/rules/`
- `/var/ossec/ruleset/rules/`
- `/var/ossec/agentless/`
- `/etc/filebeat/`
- `/etc/wazuh-indexer/`
- `/etc/wazuh-dashboard/`

To nie jest lista do wykucia dla sportu.
To są miejsca, do których wrócę przy:

- tuningu,
- analizie logów,
- walidacji konfiguracji,
- troubleshootingu.

---

## Co chcę zapamiętać po module 1

### 1. Wazuh nie jest dashboardem

To silnik do budowania widoczności, detekcji, korelacji i częściowej automatyzacji reakcji.

### 2. Sama instalacja niczego jeszcze nie załatwia

Prawdziwa wartość zaczyna się przy danych, dekoderach, regułach i tuningu.

### 3. Kill chain, TTP i IOC to nie teoria do slajdów

To rama do budowania sensownej widoczności i sensownych reguł.

### 4. Agentless to realna opcja

Brak klasycznego klienta nie musi oznaczać braku monitoringu.

### 5. Dokumentacja wygrywa z pamięciówką

Zwłaszcza przy systemie, który szybko się zmienia.

### 6. `local_rules.xml` to przyjaciel

Grzebanie w bazowych regułach to proszenie się o problem.

### 7. Dekoder i reguła to duet

Bez poprawnego zrozumienia logu nie ma sensownej detekcji.

### 8. Alert to dopiero początek

Najciekawsze zaczyna się wtedy, kiedy wiem, co z nim zrobić.

---

## Moja końcówka po tej części

Po tym module nie chcę patrzeć na Wazuha jak na “darmowy zamiennik droższych narzędzi”.

Chcę patrzeć na niego bardziej jak na **inżynierski szkielet bezpieczeństwa**, który daje naprawdę dużo, ale tylko wtedy, kiedy rozumiem:

- jak zbiera dane,
- jak je interpretuje,
- jak buduje alert,
- i kiedy ma nie tylko powiedzieć, że jest problem, ale też coś z tym zrobić.

**Instalacja to wejście do gry.
Prawdziwa robota zaczyna się przy konfiguracji, regułach, dekoderach i sensownym myśleniu o tym, co chcę wykrywać.**
