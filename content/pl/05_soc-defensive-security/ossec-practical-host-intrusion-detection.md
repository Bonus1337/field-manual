---
id: ossec-practical-host-intrusion-detection
title: "OSSEC: host-based intrusion detection, log analysis and active response"
team: blue
domain: soc-defensive-security
section: detection-monitoring
type: knowledge
angle: ossec-hids-detection-engineering
sourceTrack: osint-sekurak
tags:
  [
    "ossec",
    "hids",
    "hips",
    "fim",
    "active-response",
    "log-analysis",
    "detection-engineering",
    "rootkit",
    "siem",
  ]
difficulty: medium
shortDescription: "Praktyczne spojrzenie na OSSEC: od zbierania logów i dekoderów, przez własne reguły detekcyjne, aż po File Integrity Monitoring, wykrywanie rootkitów i automatyczną reakcję na zagrożenia."
updatedAt: "2026-08-11"
---

# OSSEC: host-based intrusion detection, log analysis and active response

OSSEC jest systemem klasy **HIDS - Host Intrusion Detection System**. Jego zadaniem nie jest przechwytywanie pakietów z sieci tak jak robi to klasyczny NIDS, ale obserwowanie tego, co dzieje się bezpośrednio na monitorowanych hostach.

Może analizować między innymi:

- logi systemowe i aplikacyjne,
- zdarzenia uwierzytelniania,
- zmiany plików,
- sumy kontrolne,
- procesy i elementy systemu operacyjnego,
- pojawienie się nowych kont,
- aktywność usług,
- ślady rootkitów,
- zdarzenia bezpieczeństwa generowane przez aplikacje.

Najważniejszą rzeczą nie jest jednak samo zbieranie danych.

OSSEC próbuje odpowiedzieć na pytanie:

> **Które zdarzenia wśród tysięcy zwykłych logów mogą oznaczać rzeczywistą aktywność atakującego?**

Dlatego jego rdzeniem są **dekodery i reguły detekcyjne**.

---

## Mental model

Najprościej myśleć o OSSEC jako o pipeline:

```text
HOST
  │
  ▼
LOG
  │
  ▼
DECODER
  │
  ▼
RULE
  │
  ▼
ALERT
  │
  ├──► analyst
  │
  ├──► e-mail / Slack / SIEM
  │
  └──► Active Response
             │
             ▼
       automated action
```

Przykładowo aplikacja może wygenerować:

```text
192.168.1.44 GET /security
```

Sam tekst nie ma dla systemu większego znaczenia.

Decoder może rozbić go na:

```text
src_ip = 192.168.1.44
method = GET
url = /security
```

Dopiero reguła może powiedzieć:

```text
IF url == "/security"
THEN generate level 10 alert
```

To właśnie przejście:

```text
raw event
    ↓
structured information
    ↓
security context
```

jest podstawą działania OSSEC.

---

# Architecture

Typowe wdrożenie składa się z centralnego serwera OSSEC oraz agentów znajdujących się na monitorowanych endpointach.

```text

                    ┌─────────────────┐
                    │   OSSEC Server  │
                    │                 │
                    │ decoders        │
                    │ rules           │
                    │ correlation     │
                    │ alerts          │
                    │ active response │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
        Linux Agent     Windows Agent    Linux Agent
             │               │               │
         syslog          Event Logs        auth.log
         auth.log        PowerShell        syslog
         files           Security          files
```

Agent obserwuje lokalny system i przekazuje informacje do centralnego serwera.

Serwer następnie:

```text
collects
   ↓
decodes
   ↓
matches rules
   ↓
correlates
   ↓
alerts
   ↓
optionally responds
```

OSSEC może również działać bez agentów.

Tryb **agentless** jest przydatny dla urządzeń, na których nie można zainstalować klasycznego agenta, takich jak:

```text
switch
router
firewall
hypervisor
network appliance
```

---

# HIDS, not NIDS

To rozróżnienie jest istotne.

NIDS obserwuje przede wszystkim:

```text
network traffic
```

HIDS obserwuje:

```text
host activity
```

OSSEC może uzyskać informacje dotyczące aktywności sieciowej poprzez logi hosta, ale nie działa jak sensor przechwytujący cały ruch ze switcha.

Dlatego rozwiązania takie jak:

```text
Suricata
Snort
Zeek
Wireshark
```

nie są bezpośrednimi zamiennikami OSSEC.

Mogą działać obok niego.

Przykładowa architektura defensywna może wyglądać tak:

```text
NETWORK                    HOST
   │                         │
   ▼                         ▼
Suricata / Zeek           OSSEC
   │                         │
   └──────────┬──────────────┘
              ▼
          SIEM / ELK
              │
              ▼
           Analyst
```

Każda warstwa widzi inny fragment ataku.

---

# The OSSEC directory

Przy standardowej instalacji jednym z najważniejszych miejsc jest:

```text
/var/ossec/
```

To tutaj znajduje się większość infrastruktury systemu.

Najważniejsze obszary można zapamiętać jako:

```text
/var/ossec/
│
├── bin/        executables and management tools
├── etc/        configuration
├── logs/       logs and alerts
├── rules/      detection rules
├── queue/      internal communication
└── var/        runtime information
```

Najważniejszym plikiem konfiguracyjnym jest:

```text
/var/ossec/etc/ossec.conf
```

To główne centrum konfiguracji systemu.

---

# Logs that matter

Podczas analizy należy rozróżniać dwa rodzaje logów.

## ossec.log

```text
/var/ossec/logs/ossec.log
```

Opisuje działanie samego OSSEC.

Jeżeli:

```text
rule does not load
decoder is broken
agent cannot connect
configuration contains an error
```

to właśnie tutaj należy zacząć analizę.

## alerts.log

```text
/var/ossec/logs/alerts/alerts.log
```

To log bezpieczeństwa.

Znajdują się tutaj zdarzenia, które zostały dopasowane do reguł OSSEC.

Mental model:

```text
ossec.log
    =
what is happening with OSSEC

alerts.log
    =
what OSSEC thinks is happening in the monitored environment
```

---

# Decoders

Log aplikacji jest dla OSSEC początkowo tylko tekstem.

Przykład:

```text
10.10.10.23 GET /security HTTP/1.1
```

Zanim będzie można stworzyć sensowną regułę bezpieczeństwa, trzeba zrozumieć strukturę zdarzenia.

Za to odpowiada **decoder**.

Może wyciągnąć:

```text
src_ip
dst_ip
src_port
dst_port
protocol
method
url
user
action
status
```

Wtedy:

```text
RAW LOG

10.10.10.23 GET /security HTTP/1.1

        ↓ decoder

src_ip = 10.10.10.23
method = GET
url = /security
```

OSSEC potrafi dzięki temu analizować również niestandardowe systemy generujące własne formaty logów.

To szczególnie ważne w organizacjach posiadających:

```text
legacy applications
CRM
ERP
accounting software
custom internal systems
proprietary applications
```

Jeżeli aplikacja generuje log, można potencjalnie stworzyć dla niego dekoder.

---

# Custom detection

Decoder mówi:

> **co znajduje się w logu**

Rule mówi:

> **co to oznacza z punktu widzenia bezpieczeństwa**

Przykładowy scenariusz:

```text
GET /security
```

może oznaczać próbę wejścia do celowo ukrytego zasobu.

Tworzymy więc regułę:

```text
decoded_as = security-access
url = security
level = 10
```

Pipeline wygląda wtedy tak:

```text
request
   ↓
access.log
   ↓
custom decoder
   ↓
URL extracted
   ↓
custom rule
   ↓
level 10 alert
```

W ten sposób nawet zwykła ścieżka aplikacji może stać się prostym mechanizmem typu **tripwire**.

---

# Local rules

Jedna z najważniejszych zasad administracji OSSEC:

> **Nie modyfikuj bezpośrednio domyślnych reguł.**

Zmiany powinny trafiać do lokalnych reguł.

Typowym miejscem jest:

```text
local_rules.xml
```

Powód jest prosty.

Przy aktualizacji:

```text
default rules
        ↓
may be replaced
```

Własna logika detekcyjna mogłaby zostać utracona.

Mental model:

```text
vendor rules
    =
read / use

local rules
    =
customize
```

W materiale przyjęto również zasadę używania identyfikatorów własnych reguł powyżej:

```text
100000
```

co zmniejsza ryzyko kolizji z regułami dostarczanymi przez OSSEC.

---

# Overwriting existing rules

Czasami nie chcemy tworzyć całkowicie nowej reguły.

Może istnieć dobra reguła, ale jej severity jest zbyt niskie.

Na przykład:

```text
existing rule
level = 3
```

a organizacja chce traktować dane zdarzenie jako:

```text
level = 7
```

Zamiast zmieniać regułę producenta można wykorzystać mechanizm:

```text
overwrite
```

i nadpisać jej zachowanie lokalnie.

To pozwala zachować własny tuning podczas aktualizacji systemu.

---

# Alert levels

OSSEC przypisuje zdarzeniom własne poziomy ważności.

Zakres dochodzi do:

```text
0 → 15
```

W uproszczeniu:

```text
LOW                                      HIGH

0 ────────────────────────────────────── 15

noise
information
suspicious activity
security event
attack
critical event
```

Nie należy traktować każdego logu jako incydentu.

Jeżeli system alertuje o wszystkim:

```text
everything becomes an alert
        ↓
analyst receives noise
        ↓
real attacks disappear inside noise
```

Dlatego kluczowym elementem wdrożenia jest **tuning**.

Praktycznym podejściem przedstawionym w materiale było rozpoczęcie obserwacji od zdarzeń około:

```text
level 5–6
```

i używanie wyższych poziomów do bardziej istotnych alarmów.

To nie jest jednak uniwersalny próg.

Severity musi wynikać z kontekstu środowiska.

---

# Detection engineering mindset

OSSEC pokazuje podstawową zasadę pracy defensywnej.

Nie zaczynamy od pytania:

> Jaką regułę napisać?

Zaczynamy od:

```text
What does the attack change?
```

Następnie:

```text
Where can I observe it?
```

Potem:

```text
What log contains the evidence?
```

Dopiero później:

```text
How do I decode it?

How do I detect it?

How do I respond?
```

Pełny proces:

```text
ATTACK
   ↓
ARTIFACT
   ↓
LOG
   ↓
DECODER
   ↓
RULE
   ↓
ALERT
   ↓
RESPONSE
```

To jest dokładnie sposób myślenia używany przy budowie detekcji niezależnie od tego, czy finalnie korzystamy z:

```text
OSSEC
Wazuh
Splunk
Elastic
Microsoft Sentinel
QRadar
```

---

# Testing rules

Reguła, która nie została przetestowana, nie jest jeszcze działającą detekcją.

OSSEC posiada narzędzie pozwalające sprawdzić działanie dekoderów i reguł.

Workflow powinien wyglądać mniej więcej tak:

```text
sample log
    ↓
decoder test
    ↓
rule test
    ↓
configuration reload
    ↓
generate real event
    ↓
check alerts.log
```

Po zmianach konfiguracji często konieczny będzie restart:

```bash
/var/ossec/bin/ossec-control restart
```

Potem należy sprawdzić:

```text
ossec.log
```

oraz:

```text
alerts.log
```

Brak błędu składni nie oznacza jeszcze, że reguła wykrywa właściwe zdarzenie.

---

# Agents

Agent jest oczami OSSEC znajdującymi się na endpointach.

Może obserwować między innymi:

```text
Linux logs
Windows Event Logs
PowerShell logs
Application logs
file changes
authentication activity
system changes
```

Windows może przekazywać między innymi kanały:

```text
Application
Security
System
Windows PowerShell
```

Każdy agent musi zostać powiązany z serwerem.

Samo wskazanie adresu IP serwera nie wystarcza.

Wykorzystywany jest również indywidualny klucz uwierzytelniający.

Dzięki temu serwer wie:

```text
which endpoint
generated
which event
```

Stan agentów ma również znaczenie forensic.

Jeżeli endpoint:

```text
last seen: 02:18
```

a później przestał komunikować się z serwerem, taki timestamp może być istotnym elementem timeline'u incydentu.

---

# File Integrity Monitoring

Jedną z najważniejszych funkcji OSSEC jest **File Integrity Monitoring - FIM**.

Mechanizm obserwuje stan plików i wykrywa ich modyfikacje.

Idea jest prosta:

```text
FILE
  │
  ▼
HASH
  │
  ▼
baseline
  │
  ▼
file changes
  │
  ▼
new hash
  │
  ▼
ALERT
```

Można dzięki temu wykrywać:

```text
modified system binaries
changed configuration
new files
web shells
malware persistence
unexpected scripts
tampering
```

Domyślne monitorowanie obejmuje przede wszystkim krytyczne obszary systemu, takie jak:

```text
/etc
/usr/bin
/usr/sbin
/bin
/sbin
/boot
```

Ale nie oznacza to, że jest to kompletny zakres.

---

# Monitor what an attacker would use

Jednym z najważniejszych wniosków defensywnych jest to, że attacker często korzysta z miejsc, które defender uznał za niewarte monitorowania.

Przykładem są katalogi:

```text
/tmp
C:\Windows\Temp
C:\Windows\Prefetch
```

Generują dużo zmian i łatwo uznać je za noise.

Jednocześnie malware często wykorzystuje właśnie katalogi tymczasowe.

Powstaje więc konflikt:

```text
less monitoring
      =
less noise

but

less monitoring
      =
larger detection blind spot
```

Dlatego każda pozycja:

```text
ignore
exclude
whitelist
```

powinna być traktowana jako potencjalna **blind spot**.

To szczególnie istotne z perspektywy Purple Team.

Red Team szuka:

```text
where defender is not looking
```

Blue Team powinien myśleć:

```text
what could an attacker hide here?
```

---

# New files matter

Szczególnie wartościowa jest detekcja pojawiania się nowych plików.

Przykładowo na webserwerze:

```text
/var/www/
```

nagłe utworzenie:

```text
shell.php
cmd.php
upload.php
backdoor.js
```

może być znacznie bardziej wartościowym sygnałem niż samo żądanie HTTP zapisane w access.log.

Dlatego warto patrzeć nie tylko na:

```text
request
```

ale również na:

```text
resulting state change
```

To ważna różnica.

Atak może wyglądać niewinnie w logu HTTP, ale pozostawić bardzo charakterystyczny artefakt na filesystemie.

---

# Rootkit detection

OSSEC posiada również mechanizmy wykrywania rootkitów.

Idea jest podobna do reguł YARA.

Znany rootkit może pozostawiać charakterystyczny artefakt:

```text
specific file
specific filename
specific path
specific registry entry
specific system modification
```

Można więc zdefiniować:

```text
IF artifact exists
THEN rootkit suspicion
```

Przykładowy model:

```text
/tmp/fake.ai
     ↓
matches known rootkit artifact
     ↓
rootcheck
     ↓
alert
```

Nie oznacza to, że jeden znaleziony plik automatycznie dowodzi infekcji.

To **indicator**, który należy umieścić w szerszym kontekście.

---

# YARA analogy

Dobrym sposobem zrozumienia OSSEC jest porównanie go z YARA.

YARA:

```text
FILE
  ↓
PATTERN
  ↓
MATCH
  ↓
MALWARE INDICATOR
```

OSSEC:

```text
LOG
  ↓
DECODER
  ↓
RULE
  ↓
SECURITY INDICATOR
```

W obu przypadkach defender definiuje charakterystyczny wzorzec.

Różnica polega głównie na źródle danych.

YARA często analizuje:

```text
files
memory
binary artifacts
```

OSSEC przede wszystkim:

```text
logs
host activity
filesystem changes
system events
```

---

# Active Response

Domyślnie HIDS powinien przede wszystkim:

```text
detect
```

OSSEC może jednak wykonać również:

```text
respond
```

Mechanizm nazywa się **Active Response**.

Przykładowy scenariusz:

```text
SSH brute force
      ↓
authentication failures
      ↓
OSSEC rule
      ↓
level 7 alert
      ↓
Active Response
      ↓
firewall-drop
      ↓
source IP blocked
```

W materiale przedstawiono między innymi akcje:

```text
host-deny
firewall-drop
disable-account
```

Blokada może być czasowa, np.:

```text
600 seconds
```

Dzięki temu OSSEC zaczyna zachowywać się częściowo jak system klasy HIPS.

---

# Active Response is just automation

Ważne jest zrozumienie, że nie dzieje się tutaj żadna magia.

Przykładowo:

```text
firewall-drop
```

jest po prostu skryptem wykonującym odpowiednią operację na firewallu.

Conceptually:

```text
ALERT
   ↓
COMMAND
   ↓
SCRIPT
   ↓
OS ACTION
```

Na Linuxie może to oznaczać dodanie reguły blokującej do firewalla.

Można więc tworzyć własne reakcje.

Przykładowo:

```text
isolate host
disable account
kill process
block IP
notify SOC
create ticket
send webhook
collect forensic artifact
```

OSSEC staje się wtedy nie tylko narzędziem detekcyjnym, ale prostym silnikiem automatyzacji reakcji.

---

# The danger of automatic response

Automatyczna reakcja jest bardzo skuteczna, ale źle skonfigurowana może stać się problemem.

Wyobraźmy sobie:

```text
level 3
      ↓
common false positive
      ↓
firewall-drop
```

W efekcie normalny użytkownik może zostać automatycznie zablokowany.

Dlatego Active Response powinien być uruchamiany dla zdarzeń, które mają wystarczająco wysoką pewność detekcji.

Mental model:

```text
low confidence
    ↓
observe

medium confidence
    ↓
alert

high confidence
    ↓
respond
```

Im bardziej destrukcyjna akcja, tym wyższej pewności powinien wymagać system.

---

# Brute-force detection

Authentication logs są jednym z najbardziej naturalnych źródeł danych dla OSSEC.

Pojedynczy wpis:

```text
authentication failed
```

nie musi oznaczać ataku.

Może być zwykłą pomyłką użytkownika.

Ale sekwencja:

```text
failure
failure
failure
failure
failure
```

w krótkim czasie może wskazywać na:

```text
brute force
```

To pokazuje różnicę między:

```text
event detection
```

a:

```text
behavior detection
```

Jeszcze trudniejszym przypadkiem jest:

```text
slow brute force
```

gdzie attacker celowo wydłuża odstępy pomiędzy próbami.

Dlatego analiza bezpieczeństwa nie powinna opierać się wyłącznie na pojedynczych zdarzeniach.

---

# Web attack detection

OSSEC może również monitorować logi webservera.

Przykładowe źródła:

```text
Apache access.log
Apache error.log
Nginx access.log
Nginx error.log
```

Możliwe są reguły dotyczące:

```text
suspicious URLs
scanner activity
authentication attacks
server errors
unexpected HTTP methods
known exploit patterns
```

Interesującym podejściem jest stworzenie zasobu, którego normalny użytkownik nie powinien odwiedzać.

```text
/admin-backup-secret/
```

Każda próba wejścia może wtedy generować wysoki alert.

To prosty **honeypot / tripwire concept**.

---

# Detecting scanners

Automatyczne narzędzia typu:

```text
feroxbuster
ffuf
gobuster
nmap
```

generują charakterystyczną aktywność.

Nie należy jednak tworzyć detekcji typu:

```text
User-Agent == feroxbuster
```

i uważać problemu za rozwiązany.

User-Agent można łatwo zmienić.

Lepszym sygnałem może być zachowanie:

```text
large number of requests
many nonexistent paths
specific request frequency
access to trap endpoints
repeated 404/403 responses
```

Czyli zamiast:

```text
tool detection
```

lepiej budować:

```text
behavior detection
```

---

# Integrations

OSSEC może wysyłać wyniki do innych narzędzi.

Przykładowo:

```text
OSSEC
  │
  ├──► email
  ├──► Slack
  ├──► Syslog
  └──► JSON
         │
         ▼
      Filebeat
         │
         ▼
      Logstash
         │
         ▼
   Elasticsearch
         │
         ▼
       Kibana
```

To pozwala oddzielić:

```text
detection engine
```

od:

```text
storage
visualization
analytics
```

OSSEC nie musi więc być kompletnym SIEM-em.

Może być jednym ze źródeł wysokiej jakości zdarzeń bezpieczeństwa.

---

# OSSEC and ELK

Włączenie logowania JSON ułatwia dalsze przetwarzanie zdarzeń.

Conceptually:

```text
OSSEC alert
      ↓
JSON
      ↓
Filebeat
      ↓
Logstash
      ↓
Elasticsearch
      ↓
Kibana
```

Dzięki temu możliwe jest budowanie:

```text
dashboards
statistics
timelines
search
correlation
historical analysis
```

Sam OSSEC odpowiada wtedy przede wszystkim za:

```text
host visibility
+
detection
```

a Elastic za:

```text
search
+
storage
+
visualization
```

---

# OSSEC vs Security Onion

Nie należy traktować ich jako dwóch identycznych rozwiązań.

OSSEC jest stosunkowo lekki i skupia się na hostach.

Security Onion jest znacznie większym ekosystemem i może zawierać narzędzia obserwujące zarówno endpointy, jak i sieć.

Conceptually:

```text
OSSEC

lightweight
host focused
log based
FIM
active response
rootkit detection
```

versus:

```text
Security Onion

network visibility
IDS
Zeek
Suricata
endpoint telemetry
search
correlation
large data pipeline
```

Wybór narzędzia wynika z architektury i potrzeb, a nie z pytania:

> „Które jest lepsze?”

---

# OSSEC and Wazuh

Wazuh wywodzi się z OSSEC i rozwija podobny model działania.

Dlatego poznanie OSSEC ma znaczenie również wtedy, gdy finalnie pracujemy z Wazuh.

Fundament pozostaje podobny:

```text
agents
logs
decoders
rules
FIM
alerts
response
```

Nowsze systemy dodają lepsze:

```text
dashboards
APIs
integrations
management
cloud support
```

ale logika detekcji pozostaje bardzo podobna.

---

# Attacker perspective

OSSEC warto analizować również z punktu widzenia Red Teamu.

Jeżeli attacker dowie się:

```text
what is monitored
what is ignored
which paths trigger alerts
which actions trigger Active Response
```

może próbować poruszać się poza obserwowanymi obszarami.

Przykładowo:

```text
/tmp ignored
```

może oznaczać:

```text
good staging directory
```

Natomiast:

```text
/var/www monitored in real time
```

oznacza:

```text
web shell may trigger FIM
```

Dlatego dobra konfiguracja defensywna wymaga ciągłego pytania:

> **Gdybym był attackerem i znał tę konfigurację, gdzie próbowałbym się ukryć?**

---

# Defender perspective

Z perspektywy Blue Team OSSEC jest przede wszystkim sposobem zwiększenia widoczności.

Nie chodzi o zebranie każdego możliwego logu.

Chodzi o wykrywanie zmian, które mają znaczenie.

Dobry monitoring powinien odpowiadać na pytania:

```text
Who authenticated?

From where?

What changed?

Which file appeared?

Which process started?

Which service failed?

Was a new account created?

Was a protected resource accessed?

Did an endpoint suddenly disappear?

Was the same action repeated?

Does the event match known malicious behavior?
```

To właśnie z takich małych obserwacji budowany jest obraz incydentu.

---

# Practical hardening checklist

Przy wdrożeniu warto zwrócić szczególną uwagę na:

```text
[ ] monitor critical system directories
[ ] monitor temporary directories where appropriate
[ ] enable detection of new files
[ ] reduce excessive FIM intervals
[ ] collect authentication logs
[ ] collect PowerShell and Windows security logs
[ ] monitor webserver logs
[ ] create custom decoders for proprietary applications
[ ] keep custom rules separate from vendor rules
[ ] test every custom decoder and rule
[ ] tune alert levels
[ ] review ignored paths
[ ] configure Active Response conservatively
[ ] protect communication between agents and server
[ ] restrict access to the OSSEC server
[ ] forward important alerts to central monitoring
[ ] monitor agent availability
```

---

# What to investigate first

Jeżeli OSSEC wygeneruje wysoki alert, nie kończ analizy na samym opisie reguły.

Pivotuj dalej.

```text
ALERT
  │
  ├──► source IP
  │
  ├──► destination
  │
  ├──► user
  │
  ├──► process
  │
  ├──► file
  │
  ├──► surrounding logs
  │
  ├──► previous events
  │
  └──► events after detection
```

Pojedynczy alert jest początkiem investigation, nie jego końcem.

---

# Analyst workflow

Przykładowa analiza:

```text
OSSEC ALERT
"authentication failed"
        │
        ▼
Which user?
        │
        ▼
Which source IP?
        │
        ▼
How many attempts?
        │
        ▼
Was there later a successful login?
        │
        ▼
What happened after login?
        │
        ▼
New process?
New account?
File modification?
Network connection?
```

Najbardziej interesująca sytuacja to często nie:

```text
100 failed logins
```

ale:

```text
20 failed logins
        ↓
1 successful login
        ↓
new process
        ↓
new file
        ↓
outbound connection
```

To dopiero tworzy historię ataku.

---

# Field note

OSSEC jest dobrym przykładem tego, że detekcja nie zaczyna się od dashboardu.

Zaczyna się od zrozumienia:

```text
what happened
```

potem:

```text
what artifact was created
```

następnie:

```text
where that artifact is visible
```

i dopiero na końcu:

```text
how to detect it automatically
```

GUI może zmienić się całkowicie.

SIEM może zostać zastąpiony.

Format dashboardu może wyglądać inaczej.

Ale fundamentalny pipeline pozostaje ten sam:

```text
telemetry
   ↓
parsing
   ↓
normalization
   ↓
detection
   ↓
correlation
   ↓
alert
   ↓
response
```

Jeżeli rozumiesz ten proces na OSSEC, znacznie łatwiej zrozumiesz później Wazuh, Elastic, Splunk, Sentinel czy praktyczne detection engineering.

---

## TL;DR

```text
OSSEC = HIDS

Agent
  ↓
collects host telemetry

Decoder
  ↓
turns raw logs into fields

Rule
  ↓
adds security meaning

Alert
  ↓
notifies the analyst

FIM
  ↓
detects filesystem changes

Rootcheck
  ↓
looks for known malicious artifacts

Active Response
  ↓
can automatically react

The real skill:
do not memorize OSSEC.

Understand the detection pipeline.
```
