---
id: defsec-intro
title: "Defensive Security Intro"
team: blue
category: General
tags: ["blue-team", "soc", "siem", "incident-response", "defence-in-depth"]
difficulty: easy
shortDescription: "Krótki wstęp do defensive security, który porządkuje podstawowe role, procesy i zależności po stronie blue teamu - od monitoringu i triage’u, przez incident response i SIEM, aż po defence in depth i myślenie o bezpieczeństwie jako o utrzymaniu ciągłości działania biznesu."
updatedAt: "2026-02-16"
---

Defensive Security to nie “kliknij narzędzie i będzie bezpiecznie”.  
To **ciągła obserwacja, szybkie decyzje i proces**, który ma utrzymać firmę w ruchu nawet wtedy, gdy ktoś już próbuje wejść.

## Co ten rozdział naprawdę trenuje

### 1) Mindset: “utrzymaj biznes” zamiast “znajdź flagę”

W ofensywie cel jest prosty: znaleźć drogę.  
W defensywie cel jest trudniejszy: **zminimalizować wpływ** i **przywrócić normalność**.

W praktyce liczy się:

- _czas wykrycia_ (czy widzisz atak szybko?)
- _czas reakcji_ (czy potrafisz zatrzymać eskalację?)
- _jakość decyzji_ (czy nie wyłączasz pół firmy bez sensu?)

### 2) Blue team to 5 filarów pracy (które się przeplatają)

- **Monitoring & Detecting** – ciągła obserwacja zdarzeń (logowania, procesy, ruch sieciowy).
- **Incident Response** – gdy “to nie wygląda normalnie” → wchodzisz w tryb incydentu.
- **Threat Intelligence** – rozumiesz, _kto i jak atakuje teraz_, żeby szybciej rozpoznawać schematy.
- **Vulnerability Management** – zmniejszasz powierzchnię ataku zanim ktoś ją wykorzysta.
- **Investigation & Analysis** – oddzielasz “szum” od realnego zagrożenia.

To nie są osobne światy - to jeden workflow.

---

## Dlaczego to ma znaczenie (biznesowo, nie “teoretycznie”)

Nagłówki o wyciekach i ransomware to zwykle efekt:

- słabych polityk (hasła, dostęp, MFA)
- przestarzałych systemów
- braku widoczności (logi/monitoring)
- braku ćwiczonego IR

Dla firmy to nie “wstyd”. To:

- koszty + przestoje
- kary/regulacje
- utrata zaufania

---

## Role w SOC - kto robi co (i po co)

**SOC** to “centrum obrony” firmy - często 24/7.

W środku typowo spotkasz:

### SOC Analyst (Tier 1/2)

- widzi alert
- robi triage: _czy to jest real?_
- zbiera kontekst: źródła logów, timeline, scope
- eskaluje, jeśli trzeba

### Incident Responder

- działa, gdy jest potwierdzony incydent
- izoluje, blokuje, zatrzymuje eskalację
- prowadzi komunikację techniczną i uczy organizację po fakcie

### Security Engineer

- buduje “system nerwowy” (logi, integracje, detekcje)
- automatyzuje (SOAR / playbooki)
- utrzymuje narzędzia (EDR, SIEM, IDS)

### Digital Forensics

- zbiera i zabezpiecza dowody
- rekonstruuje “co się stało”
- wspiera post-incident: root cause + poprawki

---

## Defence in Depth: warstwy, nie jedna “tarczka”

Defence in Depth = nawet jeśli jedna rzecz zawiedzie, kolejne warstwy zatrzymają atak.

Przykładowe warstwy:

- **Szkolenia pracowników** (phishing i higiena)
- **Polityki** (MFA, hasła, dostęp do stron, zasady urządzeń)
- **Firewalle** (kontrola ruchu)
- **IDS/IPS** (wykrywanie podejrzanych wzorców)
- **EDR** (telemetria + reakcja na endpointach)
- **SIEM** (centralny obraz sytuacji)

Real talk: jedna warstwa zawsze kiedyś pęknie. Liczy się, czy system jako całość to wytrzyma.

---

## SIEM: “radar” defensywy (dlaczego to nie jest tylko dashboard)

SIEM zbiera i koreluje dane z:

- serwerów, stacji roboczych, aplikacji
- firewalli, IDS, proxy
- systemów tożsamości (AD/SSO)

Wartość SIEM nie polega na tym, że “ma logi”.  
Tylko że pozwala:

- budować detekcje (reguły / korelacje)
- robić szybki triage
- mieć timeline zdarzeń

**Problem w realu:** alert fatigue.  
Najlepszy SOC to nie ten, który ma najwięcej alertów - tylko ten, który ma **najbardziej użyteczne**.

---

## Jak myśleć w scenariuszu “Web Discovery Attack”

To jest klasyczny przykład: ktoś enumeruje aplikację/szuka ukrytych endpointów.

Twoje pytania (kolejność ma znaczenie):

1. **Czy to realny atak czy skan z monitoringów?**
2. **Z jakiego źródła?** (IP, ASN, kraj, user-agent, tempo)
3. **Jakie ścieżki są skanowane?** (typowe /admin, /backup, /api)
4. **Czy ktoś znalazł coś “wrażliwego”?** (200/302 na niepubliczne endpointy)
5. **Jaki jest impact, jeśli to pójdzie dalej?**
6. **Jak zatrzymać bez ubicia biznesu?**
   - rate limiting / WAF reguły
   - blokada IP / geoblokada (ostrożnie)
   - ukryte endpointy → auth/role check (nie “usuń z menu”)
   - przegląd logów + alerty na kolejne próby

---

## TL;DR (save-worthy)

- Blue team wygrywa **czasem i procesem**, nie “magicznym narzędziem”.
- SOC to ludzie + workflow + narzędzia - **nie sam SIEM**.
- Defence in Depth działa tylko wtedy, gdy warstwy są realne (polityki + telemetry + reakcja).
- “Web discovery” to sygnał: aplikacja ma powierzchnię ataku → detekcja + kontrola + naprawa.
