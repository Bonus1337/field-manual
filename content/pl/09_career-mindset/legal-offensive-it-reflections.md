---
id: legal-offensive-it-reflections
title: "Prawne aspekty ofensywnego bezpieczeństwa IT - zgoda, scope i granice działania"
team: neutral
domain: career-mindset
section: legal-and-professional-mindset
topic: offensive-security-legal-boundaries
type: opinion
angle: legal-scope-and-responsible-offensive-work
sourceTrack: baw
tags: ["prawo", "pentest", "bug-bounty", "kodeks-karny", "267", "269c", "scope", "zgoda"]
difficulty: medium
shortDescription: "Zapis najważniejszych wniosków o prawnych granicach ofensywnego bezpieczeństwa IT, skupiony na tym, gdzie kończy się techniczna możliwość działania, a zaczyna znaczenie zgody, scope’u, minimalizacji szkody, dokumentowania ustaleń oraz odpowiedzialności karnej lub cywilnej."
updatedAt: "2026-02-27"
---

# Prawne aspekty ofensywnego bezpieczeństwa IT - moje wnioski po lekturze

Największe „kliknięcie” z tego rozdziału jest takie, że prawo nie działa jak firewall: **nie ma prostej reguły allow/deny**. Da się zrobić technicznie to samo działanie, a jego ocena prawna będzie zupełnie inna w zależności od kontekstu: kto dał zgodę, jaki był cel, czy powstała szkoda, jak szeroko poszedłem z PoC, czy naruszyłem czyjś interes.

I to jest trochę brutalne, bo jako pentester lubię mieć jasne reguły gry. Tu reguły gry są „miękkie”, a potem i tak ktoś (prokurator, sąd, biegły) próbuje z tego złożyć obraz.

---

## 1) Dwa fronty ryzyka: karne i cywilne

Po lekturze mam poczucie, że łatwo wpaść w pułapkę myślenia: „byle nie mieć sprawy karnej”.  
A to tylko połowa problemu.

- **Prawo karne** to temat: dostęp, dane, zakłócenia, narzędzia, organy ścigania.
- **Prawo cywilne** to temat: szkoda, odszkodowanie, naruszenie dóbr/tajemnic, spór między firmami/osobami.

Najbardziej nieprzyjemny detal, który zapamiętałem: **jak zapadnie wyrok skazujący w karnym, to cywilny jest w praktyce „ustawiony” co do faktu przestępstwa**. Czyli nie ma „odkręcania narracji” w drugim procesie.

Mój wniosek: prawny „spokój” nie polega tylko na tym, żeby nie przesadzić technicznie. On polega na tym, żeby w razie czego móc pokazać: **działałem w ramach uprawnienia** i minimalizowałem ryzyko szkody.

---

## 2) Artykuły 267–269c - to jest mapa, gdzie w praktyce można się potknąć

Ja to sobie poukładałem tak: prawo w tym zakresie chroni cztery rzeczy:

1. **Dostęp i informacje**
2. **Dane**
3. **Ciągłość działania systemu**
4. **Narzędzia, które mają służyć do robienia złych rzeczy**

### 267 - dostęp: tu najłatwiej o „to już podchodzi pod czyn”

To mnie uderzyło: odpowiedzialność nie zaczyna się dopiero w momencie „mam shell”.  
W rozdziale wprost wybrzmiewa, że problemem może być już:

- **przełamywanie/omijanie zabezpieczeń** po to, żeby dostać informację (to jest mentalnie bardzo blisko tego, co robimy w pentestach),
- **sam nieuprawniony dostęp do systemu** - nawet jeśli „przecież znam hasło”,
- **podsłuch komputerowy**, czyli przechwytywanie transmisji (sniffing).

I jeszcze jedna rzecz, o której łatwo zapomnieć: część takich czynów jest często **ścigana na wniosek pokrzywdzonego**. Czyli w realu decyduje nie tylko przepis, ale też to, czy druga strona chce iść w eskalację.

Mój wniosek: „robię tylko recon” nie zawsze jest niewinne, jeśli wchodzę w obszar **dostępu** albo **przechwytywania**.

### 268 / 268a - dane: tu jest granica „PoC” vs „szkoda”

To jest ta strefa, gdzie łatwo usprawiedliwiać się: „przecież nic nie zepsułem”.  
Ale jeśli test wymaga modyfikacji/usuwania danych, instalacji czegoś w systemie, albo zostawienia śladu typu trojan - to już wchodzi w cięższy obszar.

Mój wniosek: **PoC ma być minimalny**, a jeśli trzeba dotknąć danych, to musi być to „odbezpieczone” umową i procedurą.

### 269a - zakłócanie działania: nie tylko DDoS

Ja to czytam tak: prawo nie interesuje się tylko klasycznym „DDoS z botnetu”.  
Interesuje się każdą sytuacją, gdzie **istotnie zakłócam pracę systemu** - także logicznie, obciążeniowo, niechcący.

Mój wniosek: testy typu „sprawdzę limity” bez zgody i okna czasowego to proszenie się o problem, nawet jeśli intencja była „tylko sprawdzić”.

### 269b - narzędzia: temat śliski, bo można wpaść przez publikację/udostępnianie

Ten fragment jest dla mnie ważny z perspektywy Field Manuala i GitHuba.  
Przepis mówi o narzędziach/haseł „przystosowanych do popełniania przestępstw”, a interpretacyjnie sensownie jest to zawężać, żeby nie karać za nmapa czy Wiresharka.

Ale praktycznie: jeśli ktoś publikuje coś typowo „weaponized” albo udostępnia gotowce do realnego ataku, to robi się gorąco.

Mój wniosek: ja mogę opisywać mechanizmy i uczyć się na labach, ale **uważam na formę**: mniej „kliknij i przejmij”, więcej „jak działa i jak bronić”, plus jasny kontekst (CTF/laby/zgoda).

---

## 3) 269c (Lex Bug Bounty) - to nie jest „mam dobre intencje, więc jestem kryty”

Najbardziej podoba mi się w tej regulacji to, że próbuje „ugrać” rzeczywistość: ludzie czasem włamują się po to, żeby zgłosić błąd.

Ale tu jest pułapka: to działa tylko, jeśli spełniasz **wszystkie warunki naraz**:

- cel stricte ochronny,
- szybkie powiadomienie dysponenta,
- brak szkody i brak naruszenia interesów.

Mój wniosek: bug bounty ma sens, ale **nie zwalnia z myślenia**. Szczególnie przy eksfiltracji - jak „dla pewności” ściągnę za dużo, to już nie wygląda jak minimalny PoC.

---

## 4) Największa tarcza testera to nie skill, tylko „uprawnienie”

Po tym rozdziale mam proste zdanie w głowie:

> Technicznie mogę wiele, ale prawnie najbezpieczniej jest wtedy, kiedy mam papier.

I to nie chodzi o papier dla papieru, tylko o to, że umowa i scope robią dwie rzeczy:

1. zamieniają moje działania z „nieuprawnionych” na „w ramach uprawnienia”,
2. ustawiają zasady gry: co wolno, czego nie wolno, jak minimalizować ryzyko szkody.

Mój wniosek operacyjny: zanim zacznę testy, chcę mieć jasno:

- co jest w scope (systemy, domeny, konta, środowiska),
- jakimi metodami mogę działać (czy wolno socjotechnikę, brute force, testy obciążeniowe),
- co jest dopuszczalnym dowodem (minimalny PoC, maskowanie danych),
- kto odbiera telefon jak coś pójdzie nie tak.

---

## 5) Procesowo: „później” liczą się fakty i dowody, a nie moja narracja

To jest temat, którego techniczni ludzie często nie doceniają:

- w sprawach IT kluczowy jest **biegły**,
- jakość opinii bywa różna,
- wiele czynów dotyczy **umyślności**,
- istnieje pojęcie **znikomej szkodliwości społecznej**.

Mój wniosek: ja chcę zawsze móc pokazać „audit trail”:

- co zrobiłem,
- kiedy,
- na jakiej podstawie (zgoda/scope),
- i że starałem się **minimalizować wpływ**.

Bo jak zaczyna się dyskusja prawna, to nie wygrywa „najlepszy payload”, tylko **najlepiej udokumentowany kontekst**.

---

## 6) Jedno zdanie, które sobie zostawiam na koniec

Jeśli mam się z tego rozdziału nauczyć jednej rzeczy, to tej:

**W ofensywnym bezpieczeństwie prawo zaczyna się tam, gdzie kończy się domysł, a zaczyna zgoda i dobrze opisany zakres.**
