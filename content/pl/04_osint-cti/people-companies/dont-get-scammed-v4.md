---
id: dont-get-scammed-v4
title: "Nie daj się cyberzbójom v4: phishing, scam i współczesna socjotechnika"
team: red-blue
domain: social-engineering
section: foundations
type: knowledge
angle: modern-scam-phishing-defense
tags:
  [
    "phishing",
    "scam",
    "quishing",
    "malvertising",
    "vishing",
    "deepfake",
    "2fa",
    "social-engineering",
  ]
difficulty: easy
shortDescription: "Jak współczesne oszustwa wykorzystują QR-kody, reklamy, phishing, komunikatory, fałszywe domeny, deepfake głosu i presję psychologiczną — oraz jak rozpoznawać cały łańcuch ataku zamiast pojedynczych wskaźników."
updatedAt: "2026-08-10"
---

# Nie daj się cyberzbójom v4: phishing, scam i współczesna socjotechnika

Cyberatak nie zawsze zaczyna się od exploita.

Bardzo często zaczyna się od czegoś znacznie prostszego:

> **„Kliknij tutaj.”**

Atakujący nie musi łamać zabezpieczeń systemu, jeżeli potrafi przekonać użytkownika, żeby sam otworzył stronę, podał hasło, przepisał kod MFA, zainstalował program albo zatwierdził transakcję.

Zmieniają się narzędzia. Zmieniają się marki wykorzystywane w kampaniach. Zmieniają się kanały komunikacji.

Mechanizm pozostaje podobny.

```text
Kontakt
   ↓
Budowa wiarygodności
   ↓
Emocja / presja / okazja
   ↓
Przekierowanie użytkownika
   ↓
Działanie wykonane przez ofiarę
   ↓
Przejęcie danych / konta / urządzenia / pieniędzy
```

Dlatego bezpieczeństwa nie warto sprowadzać do zasady:

> „Nie klikaj podejrzanych linków.”

Współczesny scam często wygląda wystarczająco dobrze, żeby link **nie wydawał się podejrzany**.

Trzeba nauczyć się rozpoznawać cały mechanizm ataku.

---

## Fałszywy alarm może być początkiem prawdziwej infekcji

Jedną z prostszych technik jest wyświetlenie w przeglądarce komunikatu przypominającego alert antywirusa.

Strona może twierdzić, że:

- komputer został zainfekowany,
- wykryto kilka wirusów,
- pliki zostały zaszyfrowane,
- system wymaga natychmiastowego skanowania,
- subskrypcja antywirusa wygasła.

Sam komunikat może wyglądać bardzo profesjonalnie.

Nie oznacza to jednak, że pochodzi z systemu operacyjnego.

Przeglądarka może wyświetlić praktycznie dowolnie przygotowany interfejs.

Atak wygląda wtedy mniej więcej tak:

```text
złośliwa strona
      ↓
fałszywy alert bezpieczeństwa
      ↓
"Scan now"
      ↓
symulowane skanowanie
      ↓
"Threats detected"
      ↓
pobranie programu
      ↓
uruchomienie przez użytkownika
      ↓
malware
```

Kluczowa różnica:

**strona niekoniecznie infekuje komputer w momencie wejścia.**

Często jej zadaniem jest przekonanie użytkownika, żeby infekcję uruchomił sam.

Dlatego alert widoczny w przeglądarce powinien być traktowany jako **treść strony**, a nie automatycznie jako komunikat systemu.

---

# QR code nie jest warstwą zaufania

QR code jest tylko sposobem zapisania informacji.

Najczęściej zawiera URL.

```text
QR
 ↓
https://example.com
```

To wszystko.

Sam fakt, że link został ukryty w QR code, nie sprawia, że jest bardziej bezpieczny.

Problem polega na tym, że użytkownik **nie widzi adresu przed wykonaniem interakcji tak wyraźnie, jak w przypadku klasycznego linku**.

To tworzy bardzo wygodny kanał phishingowy.

## Quishing

Phishing wykorzystujący QR code często określany jest jako:

```text
QR + phishing
      ↓
   quishing
```

Atakujący może umieścić kod:

- na parkomacie,
- plakacie,
- fakturze,
- ulotce,
- przesyłce,
- wiadomości e-mail,
- komunikatorze,
- ogłoszeniu,
- przedmiocie znajdującym się w przestrzeni publicznej.

Kod może nawet zostać fizycznie naklejony **na prawidłowy QR code**.

Użytkownik widzi profesjonalną naklejkę, logo organizacji i poprawny kontekst.

Skanuje.

Dopiero później trafia na infrastrukturę atakującego.

```text
Fizyczna lokalizacja
       ↓
fałszywy QR
       ↓
phishing page
       ↓
dane karty / login / malware
```

Sam kod nadal niczego nie „hackuje”.

Niebezpieczna jest dopiero akcja wykonana po jego zeskanowaniu.

---

## Mobile zmniejsza widoczność kontekstu

QR code bardzo często przenosi atak na telefon.

To istotne.

Na ekranie telefonu:

- URL jest mniej widoczny,
- pasek adresu zajmuje mniej miejsca,
- długa domena może zostać skrócona,
- użytkownik częściej działa szybko,
- interfejs aplikacji ogranicza ilość widocznych informacji.

Dlatego atakujący może celowo preferować przepływ:

```text
desktop
   ↓
QR code
   ↓
mobile
   ↓
phishing
```

Niektóre kampanie wręcz sugerują, że wersja desktopowa jest niedostępna i wymagane jest użycie telefonu.

To powinno zwiększać czujność.

---

# Logo nie potwierdza autentyczności

QR code może zostać wygenerowany z:

- logo banku,
- herbem miasta,
- postacią z gry,
- brandingiem firmy,
- dowolnym innym obrazem.

Tak samo phishing page może niemal idealnie odwzorowywać prawdziwą stronę.

Dlatego:

> **branding jest dowodem wizualnej zgodności, a nie dowodem autentyczności.**

Atakujący może skopiować:

```text
logo
CSS
kolory
font
layout
formularz
favicon
```

Nie może natomiast używać prawidłowej domeny organizacji bez uzyskania nad nią kontroli.

Dlatego domena pozostaje jednym z najważniejszych elementów analizy.

---

# Malvertising — reklama nie oznacza legalności

Jednym z niebezpiecznych założeń jest:

> „Skoro Google pokazuje to jako reklamę, ktoś musiał ją sprawdzić.”

Nie musi to być prawdą.

Reklama może prowadzić do:

- fałszywej strony banku,
- fałszywego instalatora,
- strony phishingowej,
- scamowej inwestycji,
- złośliwego oprogramowania.

Szczególnie interesujący jest scenariusz podszywania się pod popularne narzędzia.

Użytkownik szuka:

```text
Wireshark download
```

Atakujący kupuje reklamę.

Wynik pojawia się wysoko w wyszukiwarce.

Strona wygląda prawidłowo.

Program również może działać prawidłowo.

Problem:

```text
oryginalna funkcjonalność
        +
      malware
```

Użytkownik otrzymuje działający program, przez co może długo nie zauważyć kompromitacji.

Malware może w tym czasie:

- kraść hasła,
- wyciągać sesje,
- przechwytywać dane kart,
- instalować dodatkowy payload,
- zapewnić zdalny dostęp do systemu.

---

# Cloaking — bezpieczna strona tylko podczas kontroli

Systemy reklamowe analizują linki przed ich publikacją.

Atakujący mogą próbować wykorzystać tę właściwość.

Pierwszy etap:

```text
reklama
  ↓
attacker.example
  ↓
legitimate-site.example
```

System sprawdza reklamę.

Wszystko wygląda poprawnie.

Po zatwierdzeniu atakujący zmienia przekierowanie:

```text
reklama
  ↓
attacker.example
  ↓
phishing.example
```

Preview zapisany wcześniej przez platformę może nadal wyglądać poprawnie.

To ważna lekcja:

> **Treść podglądu nie musi odpowiadać aktualnemu celowi linku.**

To samo dotyczy postów publikowanych w mediach społecznościowych.

---

# Fałszywe inwestycje — atak nie zaczyna się od pieniędzy

Jednym z bardziej skutecznych scamów są fałszywe platformy inwestycyjne.

Reklama wykorzystuje:

- znaną markę,
- znaną osobę,
- państwową spółkę,
- aktualne wydarzenie,
- obietnicę wysokiego zwrotu.

Pierwsza strona często nie wygląda szczególnie niebezpiecznie.

Prosi jedynie o:

```text
imię
nazwisko
e-mail
telefon
```

I właśnie dlatego może przechodzić wiele automatycznych kontroli.

Prawdziwy atak zaczyna się później.

```text
reklama
  ↓
formularz kontaktowy
  ↓
telefon od "doradcy"
  ↓
budowa relacji
  ↓
instalacja remote-access software
  ↓
mała inwestycja
  ↓
fałszywy zysk
  ↓
większa inwestycja
  ↓
utrata środków
```

---

## Mały sukces buduje duże zaufanie

Atakujący może pozwolić ofierze „zarobić”.

Przykład:

```text
100 PLN
  ↓
200 PLN

1000 PLN
  ↓
2000 PLN
```

Ofiara dostaje pieniądze.

To niezwykle silny mechanizm psychologiczny.

W jej głowie scam został właśnie zweryfikowany jako prawdziwy.

Następny krok:

```text
"Oferta kończy się jutro."

"To wyjątkowa okazja."

"Proszę zainwestować więcej."

"Możemy wykorzystać również kredyt."
```

Atak nie polega więc wyłącznie na technice.

Polega na **stopniowym zwiększaniu zaangażowania ofiary**.

---

# Remote access jako element socjotechniki

W scamach inwestycyjnych użytkownik może zostać poproszony o instalację programu do zdalnego dostępu.

Program sam w sobie może być legalnym narzędziem.

Problemem jest osoba znajdująca się po drugiej stronie.

```text
remote-access software
          ↓
attacker sees screen
          ↓
bank login
          ↓
transaction
```

To ważny wzorzec:

> **Legalne narzędzie może stać się elementem ataku, jeżeli zostało uruchomione w niewłaściwym kontekście.**

Dlatego prośba „konsultanta” o instalację programu do zdalnej obsługi urządzenia powinna być traktowana jako jeden z najsilniejszych sygnałów ostrzegawczych.

---

# Browser in the Browser

Phishing nie musi ograniczać się do kopiowania całej strony.

Technika **Browser in the Browser — BitB** symuluje osobne okno logowania wewnątrz strony.

Użytkownik może zobaczyć coś przypominającego:

```text
┌──────────────────────────────┐
│ accounts.google.com          │
├──────────────────────────────┤
│                              │
│        Sign in               │
│                              │
│ Email:    [____________]     │
│ Password: [____________]     │
│                              │
└──────────────────────────────┘
```

Adres wygląda prawidłowo.

Ikony wyglądają prawidłowo.

Całe okno jest jednak częścią HTML strony atakującego.

Nie jest prawdziwym oknem przeglądarki.

Schemat:

```text
attacker.example
       ↓
HTML/CSS/JS
       ↓
fake OAuth/login window
       ↓
credentials
       ↓
attacker
```

Praktyczny test może polegać na próbie przesunięcia takiego „okna” poza granice głównego okna przeglądarki.

Jeżeli jest elementem strony, nie może istnieć poza jej viewportem.

---

# Phishing zaczyna się od tożsamości

Wiadomość może wyglądać tak:

```text
From: CEO Jan Kowalski
```

Nie oznacza to jeszcze, że została wysłana przez Jana Kowalskiego.

Należy rozróżnić:

```text
Display Name
```

od:

```text
actual sender address
```

Display Name można ustawić praktycznie dowolnie.

Dlatego analizując wiadomość, patrzymy na:

- rzeczywisty adres nadawcy,
- domenę,
- Reply-To,
- kontekst komunikacji,
- załączniki,
- linki.

---

# SPF, DKIM i DMARC

Organizacje mogą ograniczać możliwość podszywania się pod swoje domeny przy pomocy mechanizmów pocztowych.

### SPF

Definiuje, które serwery mogą wysyłać pocztę dla domeny.

### DKIM

Dodaje kryptograficzny podpis wiadomości.

### DMARC

Określa politykę postępowania z wiadomościami, które nie przechodzą kontroli SPF/DKIM, oraz umożliwia raportowanie.

W uproszczeniu:

```text
SPF
 └─ kto może wysyłać?

DKIM
 └─ czy wiadomość została podpisana?

DMARC
 └─ co zrobić, jeśli coś się nie zgadza?
```

Brak prawidłowej konfiguracji zwiększa możliwość skutecznego spoofingu domeny.

Nie rozwiązuje jednak wszystkich problemów.

Prawidłowo zabezpieczona domena nie ochroni przed sytuacją, w której **rzeczywista skrzynka użytkownika została przejęta**.

---

# Prawdziwy nadawca również może wysłać phishing

To jeden z bardziej zdradliwych scenariuszy.

Wiadomość pochodzi z prawidłowej domeny.

SPF przechodzi.

DKIM przechodzi.

DMARC przechodzi.

A wiadomość nadal jest złośliwa.

Dlaczego?

```text
attacker
   ↓
compromised mailbox
   ↓
legitimate mail infrastructure
   ↓
victim
```

Dlatego autentyczność adresu nadawcy nie oznacza automatycznie autentyczności intencji wiadomości.

Jeżeli kontekst jest nietypowy:

> **potwierdź żądanie drugim kanałem.**

---

# Link text != link destination

HTML pozwala stworzyć:

```html
<a href="https://evil.example"> https://mbank.pl </a>
```

Użytkownik widzi:

```text
https://mbank.pl
```

Przeglądarka otworzy:

```text
https://evil.example
```

Dlatego analizujemy **destination URL**, a nie napis znajdujący się na ekranie.

Na desktopie często można zobaczyć prawdziwy URL poprzez najechanie kursorem.

Na urządzeniach mobilnych jest to trudniejsze.

---

# Homograph attack — jedna literka może zmienić wszystko

Domeny mogą wykorzystywać znaki wyglądające niemal identycznie.

Przykład koncepcyjny:

```text
example.com
exampĺe.com
```

Dla użytkownika różnica może być prawie niewidoczna.

Możliwe są:

- znaki diakrytyczne,
- podobne litery Unicode,
- znaki z innych alfabetów,
- zamiana `l` / `I`,
- zamiana `0` / `O`,
- dodatkowe subdomeny.

Dlatego nie analizujemy domeny wyłącznie na zasadzie:

> „Wygląda podobnie.”

Analizujemy dokładną nazwę hosta.

---

# Typosquatting

Prostszy wariant nie wymaga Unicode.

Atakujący rejestruje domeny przypominające prawidłową:

```text
example.com
examplle.com
example-security.com
example-login.com
example.support
```

Użytkownik często analizuje jedynie początek adresu.

Atakujący wykorzystuje ten mechanizm.

Najważniejszą częścią jest jednak **rzeczywista domena rejestrowalna**, a nie wystąpienie nazwy firmy gdziekolwiek w URL.

```text
bank.example.attacker.com
```

należy do:

```text
attacker.com
```

a nie:

```text
bank.example
```

---

# Phishing nie jest tylko e-mailem

To jedna z najważniejszych lekcji.

Phishing może dotrzeć przez:

```text
E-mail
SMS
QR code
Google Ads
Facebook
LinkedIn
Booking
WhatsApp
telefon
komunikator
ogłoszenie
```

Kanał jest drugorzędny.

Celem nadal jest:

```text
credentials
payment data
MFA code
money
malware execution
remote access
```

---

# Smishing

SMS-y często wykorzystują prosty pretekst:

- zatrzymana paczka,
- brakująca opłata,
- konieczność aktualizacji danych,
- problem z bankiem,
- niedopłata,
- nowy numer telefonu.

Schemat jest prawie zawsze podobny:

```text
SMS
 ↓
urgency
 ↓
link
 ↓
fake payment/login page
 ↓
credentials/payment
```

Kluczowe jest przeniesienie użytkownika poza oryginalny kanał.

---

# „Mamo, mam nowy numer”

Atakujący może rozpocząć rozmowę od:

> „Rozbiłem telefon, piszę z nowego numeru.”

Dalsza część buduje naturalny kontekst.

Pojawia się nagła potrzeba pieniędzy.

```text
new number
   ↓
family impersonation
   ↓
urgency
   ↓
bank account
   ↓
transfer
```

Atak wykorzystuje relację, a nie technologię.

Najprostszą metodą obrony jest **weryfikacja przez wcześniej znany kanał kontaktu**.

---

# WhatsApp jako drugi etap ataku

W wielu scamach pierwsza wiadomość służy tylko do przeniesienia rozmowy.

```text
SMS
 ↓
WhatsApp
```

albo:

```text
advertisement
 ↓
WhatsApp
```

Dzięki temu atakujący może prowadzić długotrwałą socjotechnikę poza pierwotną platformą.

Może również próbować przekonać ofiarę do:

- udostępnienia ekranu,
- instalacji programu,
- wykonania przelewu,
- przesłania dokumentów,
- podania kodów.

Sam WhatsApp nie powoduje kompromitacji.

Problemem jest **instrukcja wykonywana przez użytkownika**.

---

# Fałszywa praca i financial mule

Nie każda fałszywa oferta pracy kończy się kradzieżą pieniędzy bezpośrednio od ofiary.

Czasami celem jest wykorzystanie jej rachunku bankowego.

Schemat:

```text
"Praca z domu"
      ↓
łatwe zadania
      ↓
wysoka prowizja
      ↓
pieniądze trafiają na konto użytkownika
      ↓
część zostaje jako prowizja
      ↓
reszta jest wysyłana dalej
```

Użytkownik może właśnie zostać:

```text
money mule
```

czyli pośrednikiem w transferze środków pochodzących z przestępstwa.

Czerwona flaga:

> **Praca nie powinna wymagać przyjmowania cudzych pieniędzy na prywatne konto i przesyłania ich dalej.**

---

# Business Email Compromise

Atakujący nie musi wysyłać skomplikowanego malware.

Czasami wystarczy:

> „Zrób pilny przelew.”

Napastnik wykorzystuje publicznie dostępne informacje:

- nazwisko prezesa,
- stanowiska,
- strukturę organizacji,
- relacje biznesowe.

Schemat:

```text
OSINT
 ↓
poznanie struktury firmy
 ↓
impersonation
 ↓
presja autorytetu
 ↓
pilny przelew
```

Technicznie wiadomość może być banalna.

Psychologicznie może być bardzo skuteczna.

Dlatego operacje finansowe powinny posiadać procedury niezależne od pojedynczej wiadomości.

---

# Deepfake voice zmienia znaczenie „znam ten głos”

Jeszcze niedawno telefon od znajomej osoby stanowił mocny sygnał autentyczności.

Generatywne modele głosu znacząco osłabiają to założenie.

Na podstawie próbki głosu można wygenerować nowe wypowiedzi brzmiące podobnie do konkretnej osoby.

To tworzy nowy wariant vishingu:

```text
voice sample
    ↓
voice cloning
    ↓
call / audio message
    ↓
impersonation
```

Atak może podszywać się pod:

- członka rodziny,
- prezesa,
- przełożonego,
- współpracownika,
- osobę publiczną.

Od tej chwili:

> **„Rozpoznałem głos” nie powinno być traktowane jako silne uwierzytelnienie.**

---

# Caller ID również nie jest dowodem

Numer telefonu widoczny na ekranie może również zostać wykorzystany do budowania fałszywego poczucia bezpieczeństwa.

Dlatego sytuacja:

```text
znany numer
+
znany głos
```

nie powinna automatycznie oznaczać:

```text
znana osoba
```

Jeżeli rozmowa prowadzi do nietypowej operacji:

- przelewu,
- przekazania danych,
- instalacji programu,
- resetu hasła,
- ujawnienia tajemnicy,

należy potwierdzić ją drugim, niezależnym kanałem.

---

# MFA nie naprawia phishingu automatycznie

MFA znacząco zwiększa bezpieczeństwo.

Nie oznacza jednak, że każda metoda MFA jest odporna na phishing.

Przykład:

```text
victim
   ↓
fake bank
   ↓
login + password
   ↓
attacker logs into real bank
   ↓
bank sends OTP
   ↓
fake site asks for OTP
   ↓
victim enters OTP
   ↓
attacker authenticates
```

To phishing działający w czasie rzeczywistym.

Kod OTP nie został złamany.

Użytkownik **sam przekazał prawidłowy kod atakującemu**.

---

# Czytaj treść autoryzacji, nie tylko kod

Jeszcze groźniejszy wariant pojawia się przy autoryzacji transakcji.

Fałszywa strona mówi:

```text
Dopłać 7 PLN
```

Bank wysyła komunikat:

```text
Potwierdzasz przelew 70 000 PLN
```

Użytkownik ignoruje treść i automatycznie przepisuje kod.

Atak działa.

Dlatego:

> **OTP nie jest tylko liczbą do przepisania. Komunikat autoryzacyjny jest częścią mechanizmu bezpieczeństwa.**

---

# Phishing-resistant MFA

Silniejszą ochronę dają mechanizmy powiązane kryptograficznie z prawidłową domeną, np. sprzętowe klucze bezpieczeństwa wykorzystujące standardy FIDO.

Ich przewaga polega na tym, że użytkownik nie otrzymuje kodu, który może przypadkowo przekazać atakującemu.

W modelu phishing-resistant:

```text
credential
   +
origin
   +
cryptographic challenge
```

muszą się zgadzać.

Fałszywa domena nie może po prostu poprosić użytkownika:

> „Podaj kod z klucza.”

---

# Password manager to również mechanizm antyphishingowy

Menedżer haseł służy nie tylko do generowania długich haseł.

Zapamiętuje również domenę, dla której credential został zapisany.

Jeżeli login został zapisany dla:

```text
https://bank.example
```

a użytkownik trafi na:

```text
https://bank-login.example
```

password manager nie powinien automatycznie zaproponować danych.

To sygnał:

> **Dlaczego mój password manager nie rozpoznaje strony?**

Może właśnie wykrył phishing szybciej niż użytkownik.

---

# Password manager nie chroni zainfekowanego endpointu

Menedżer haseł nie jest magiczną barierą.

Jeżeli urządzenie zostało całkowicie skompromitowane, malware może próbować:

- kraść dane sesji,
- przechwytywać schowek,
- czytać pamięć procesów,
- modyfikować strony,
- podmieniać linki,
- przejmować odblokowany password vault.

Model bezpieczeństwa nadal zakłada więc:

```text
password manager
      +
secure endpoint
```

Nie jedno zamiast drugiego.

---

# Załącznik może udawać dokument

Atakujący może manipulować nazwą i ikoną pliku.

Przykładowo nazwa może wyglądać jak:

```text
invoice.pdf                         .exe
```

Użytkownik widzi początek:

```text
invoice.pdf
```

ale rzeczywistym typem jest:

```text
.exe
```

Ikona również może zostać zmieniona tak, aby przypominała:

- PDF,
- Word,
- Excel,
- obraz.

Dlatego wygląd ikony nie jest wystarczającym dowodem.

Analizujemy rzeczywisty typ pliku i rozszerzenie.

---

# VirusTotal — bardzo użyteczne narzędzie, ale nie wyrocznia

Podejrzane:

- pliki,
- domeny,
- URL-e,

można analizować przy pomocy wielu silników bezpieczeństwa.

To pozwala szybko uzyskać dodatkową informację:

```text
0 / 70 detections
```

lub:

```text
23 / 70 detections
```

Nie należy jednak interpretować:

```text
0 detections
```

jako:

```text
100% safe
```

Nowa kampania może nie posiadać jeszcze sygnatur.

---

## Nie przesyłaj poufnych danych do publicznych sandboxów

Analiza w serwisach online ma również konsekwencje dotyczące poufności.

Nie należy bezrefleksyjnie przesyłać tam:

- dokumentów firmowych,
- danych osobowych,
- wewnętrznych raportów,
- konfiguracji,
- tajemnic przedsiębiorstwa.

Próbka bezpieczeństwa może stać się dostępna dla innych użytkowników lub podmiotów posiadających odpowiedni dostęp do platformy.

Zawsze trzeba zadać pytanie:

> **Czy mogę legalnie i organizacyjnie wysłać ten plik poza środowisko firmy?**

---

# Minimalizuj liczbę rozszerzeń przeglądarki

Rozszerzenie działa z określonymi uprawnieniami w przeglądarce.

Może mieć dostęp do:

- odwiedzanych stron,
- formularzy,
- zawartości DOM,
- historii,
- schowka.

Ryzykiem nie jest wyłącznie instalacja fałszywego rozszerzenia.

Możliwy jest również scenariusz:

```text
legitimate extension
        ↓
developer account compromise
        ↓
malicious update
```

Dlatego warto stosować zasadę:

```text
minimum necessary extensions
```

Każdy kolejny dodatek zwiększa powierzchnię ataku.

---

# Ad blocking jako redukcja powierzchni ataku

Blokowanie reklam nie jest wyłącznie kwestią komfortu.

Malvertising pokazuje, że reklama może być jednym z kanałów dostarczenia ataku.

Ad blocker może ograniczyć część tej powierzchni.

Nie zastępuje jednak:

- aktualizacji,
- ochrony endpointu,
- filtrowania poczty,
- MFA,
- procedur,
- awareness.

To kolejna warstwa.

---

# Aktualizacje chronią również przed atakami bez interakcji

Większość opisanych scamów potrzebuje udziału użytkownika.

Istnieje jednak inna klasa zagrożeń:

```text
vulnerability
   ↓
malicious input
   ↓
code execution
```

Wtedy sama analiza pliku, strony albo wiadomości przez podatny komponent może doprowadzić do kompromitacji.

Dlatego aktualizacje pozostają jedną z najważniejszych warstw bezpieczeństwa.

Dotyczy to nie tylko laptopa użytkownika.

Także:

- bram pocztowych,
- firewalli,
- urządzeń VPN,
- systemów monitorowania,
- przeglądarek,
- serwerów.

Paradoks bezpieczeństwa wygląda tak:

> **system, który ma analizować ataki, sam również posiada powierzchnię ataku.**

---

# Ransomware przypomina, że prewencja nie wystarcza

Nie każdy atak uda się zatrzymać.

Dlatego dojrzałe bezpieczeństwo zakłada również możliwość kompromitacji.

```text
Prevent
Detect
Respond
Recover
```

W przypadku ransomware szczególnie ważny jest ostatni element:

```text
Recover
```

Backup musi umożliwić odzyskanie danych również wtedy, gdy atakujący uzyskał dostęp do środowiska produkcyjnego.

Backup podłączony stale do tego samego środowiska może zostać zaszyfrowany razem z nim.

---

# Najważniejszy wzorzec: attacker steruje kontekstem

W niemal wszystkich przedstawionych scenariuszach atakujący próbuje kontrolować to, **co użytkownik widzi i jak interpretuje sytuację**.

Może kontrolować:

```text
nazwę nadawcy
logo
wygląd strony
reklamę
QR code
numer telefonu
głos
popup
tekst linku
fałszywy zysk
```

Nie musi kontrolować rzeczywistego systemu.

Wystarczy, że przekona użytkownika, że go kontroluje.

To fundamentalna różnica.

---

# Nie ufaj kanałowi, w którym pojawiło się żądanie

Jeżeli ktoś pisze:

> „Jestem z banku.”

nie weryfikujemy tego przez dane podane w tej samej wiadomości.

Jeżeli ktoś dzwoni:

> „Jestem z urzędu.”

nie oddzwaniamy automatycznie na numer, który podał.

Tworzymy własny trusted path:

```text
suspicious contact
       ↓
STOP
       ↓
independent source
       ↓
official website / known number / known account
       ↓
verification
```

Ta zasada działa niezależnie od technologii użytej przez atakującego.

---

# Second-channel verification

Szczególnie wrażliwe operacje powinny być potwierdzane niezależnym kanałem.

Przykłady:

```text
CEO asks for transfer by email
              ↓
call known phone number

Family member asks for money on WhatsApp
              ↓
call previous phone number

Vendor sends unexpected ZIP
              ↓
contact vendor through known channel

Bank calls about suspicious activity
              ↓
end call
              ↓
open official banking app
```

Nie chodzi o zastosowanie „drugiego kanału”.

Chodzi o zastosowanie **drugiego kanału kontrolowanego przez nas**, a nie przez osobę inicjującą kontakt.

---

# Attacker mindset

Najbardziej użyteczna perspektywa nie brzmi:

> „Jak rozpoznać fałszywego SMS-a?”

Lepsze pytanie:

> **„Co atakujący chce, żebym zrobił jako następny krok?”**

Jeżeli odpowiedź brzmi:

```text
kliknij
zeskanuj
zaloguj się
podaj kod
zainstaluj
udostępnij ekran
wykonaj przelew
wyślij pieniądze
otwórz załącznik
```

to właśnie ten krok jest punktem, który należy przeanalizować.

---

# Defender mindset

Nie próbujemy zapamiętać wszystkich scamów.

To niemożliwe.

Jutro pojawi się nowy branding, nowa historia i nowa domena.

Zamiast tego analizujemy zachowanie.

### Identity

Kto naprawdę się ze mną kontaktuje?

### Infrastructure

Dokąd naprawdę prowadzi link?

### Context

Czy takie żądanie ma sens?

### Action

Co mam zrobić?

### Impact

Co się stanie, jeżeli wykonam tę akcję?

### Verification

Jak mogę potwierdzić ją niezależnym kanałem?

To model znacznie bardziej odporny na nowe kampanie niż lista znanych przykładów.

---

# Red flags

Nie pojedynczy sygnał, ale ich kombinacja powinna zwiększać poziom podejrzenia:

- presja czasu,
- niespodziewane żądanie,
- bardzo atrakcyjna oferta,
- prośba o instalację programu,
- przekierowanie rozmowy do innego komunikatora,
- prośba o kod MFA,
- nietypowy załącznik,
- nieznana domena,
- żądanie przelewu,
- prośba o udostępnienie ekranu,
- zmiana numeru telefonu,
- kontakt z autorytetem bez możliwości niezależnej weryfikacji.

Im więcej elementów występuje jednocześnie, tym ważniejsze jest zatrzymanie procesu.

---

# Practical defense workflow

Kiedy trafia do mnie podejrzana wiadomość:

```text
                    suspicious message
                           │
                           ▼
                 Do I expect this?
                    │          │
                   YES         NO
                    │          │
                    └────┬─────┘
                         ▼
                Check real sender
                         │
                         ▼
                Check destination
                         │
                         ▼
              What action is requested?
                         │
                         ▼
          credentials / payment / execution?
                   │              │
                  YES             NO
                   │              │
                   ▼              ▼
            verify independently  continue carefully
                   │
                   ▼
             known trusted channel
```

Najważniejsze jest przerwanie automatycznego przepływu.

Scam często działa dlatego, że użytkownik wykonuje kolejne kroki dokładnie w tempie zaprojektowanym przez atakującego.

---

# Final takeaway

Nowoczesny phishing coraz rzadziej wygląda jak:

```text
Hello Dear Customer,
your accaunt blocked,
click malware.ru
```

Może wyglądać jak:

- reklama znanego programu,
- prawdziwie wyglądający bank,
- wiadomość z przejętej skrzynki,
- QR code na parkingu,
- komunikat od Bookingu,
- wiadomość od dziecka,
- telefon od prezesa,
- głos osoby, którą znamy,
- prawidłowo wyglądający popup OAuth,
- inwestycja reklamowana przez znaną markę.

Dlatego najważniejszą umiejętnością nie jest rozpoznawanie konkretnego scamu.

Jest nią **kontrola punktu zaufania**.

```text
Nie pytaj:

"Czy to wygląda prawdziwie?"

Pytaj:

"Co niezależnie potwierdza, że to jest prawdziwe?"
```

Interfejs można skopiować.

Logo można skopiować.

Nazwę można podrobić.

Numer telefonu można wykorzystać do podszycia.

Głos można wygenerować.

QR code można podmienić.

Link można zamaskować.

Ale atakującemu znacznie trudniej przejąć wszystkie niezależne kanały weryfikacji jednocześnie.

**I właśnie dlatego niezależna weryfikacja jest jedną z najprostszych i jednocześnie najskuteczniejszych warstw obrony przed socjotechniką.**
