---
id: ps-writeup-ac-user-id-controlled-by-request-parameter-unpredictable-ids
title: "PortSwigger Access Control - IDOR mimo nieprzewidywalnych identyfikatorów użytkownika"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: idor-via-leaked-unpredictable-user-id
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "idor", "horizontal-privilege-escalation", "parameter-tampering"]
difficulty: apprentice
shortDescription: "Write-up z labu PortSwigger pokazujący, że nieprzewidywalne identyfikatory użytkowników nie zastępują kontroli dostępu, jeśli aplikacja ujawnia GUID w publicznych miejscach, a backend bez poprawnej autoryzacji ufa wartości id przekazanej w żądaniu i pozwala podejrzeć dane innego konta."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter, with unpredictable user IDs

## Cel

Znajdź **GUID** użytkownika **carlos**, a potem wyciągnij jego **API key** i wyślij jako rozwiązanie.

## Co ja tu realnie testuję (mindset)

To jest dalej **IDOR / pozioma eskalacja uprawnień** - tylko w wersji, którą dev często uznaje za „bezpieczniejszą”, bo:

- zamiast `id=wiener` mamy losowe GUIDy,
- więc „nikt tego nie zgadnie”.

I tu jest sedno: **nie muszę zgadywać**.

Jeżeli aplikacja używa GUIDów jako identyfikatorów użytkowników, to one i tak muszą gdzieś wypłynąć:

- w linkach do profili,
- w komentarzach,
- w autorach postów,
- w API,
- w HTML/JS.

GUID wcale nie naprawia kontroli dostępu. On co najwyżej utrudnia _brutalne zgadywanie_.

Mój test jest prosty:

1. **Czy potrafię zdobyć GUID carlos z publicznego miejsca?**
2. **Czy backend dalej ufa parametrowi `id` i odda mi jego konto / API key?**

---

## Recon & discovery

### Krok 1 - Szukam miejsca, gdzie aplikacja ujawnia identyfikator użytkownika

Zanim w ogóle loguję się na konto, robię to, co robi atakujący „na zewnątrz”:

- przeglądam bloga / posty,
- szukam autora: **carlos**.

Cel jest jeden: znaleźć link, w którym aplikacja sama wklei GUID.

---

### Krok 2 - Wchodzę w post carlos i klikam w autora

Otwieram dowolny blog post napisany przez **carlos**.  
Klikam w jego nazwę / profil autora.

Obserwacja:

- URL zawiera jego identyfikator użytkownika w formie GUID.

Przykład (schemat):

```

/blogs?userId=55edc097-3222-41df-9819-627456e39bb4

```

Kopiuję ten GUID i zapisuję go sobie, bo to jest mój „klucz” do testu.

🖼️ Evidence:
![carlos-guid-leak](/field-manual/assets/portswigger/access-control/user-id-guid/01-carlos-guid-leak.png)

---

## Walidacja (czy backend ufa parametrowi?)

### Krok 3 - Loguję się i przechwytuję request do „My account”

Teraz dopiero loguję się jako `wiener:peter` i wchodzę na stronę konta.

Patrzę na URL i requesty. Zwykle jest coś w stylu:

```

/my-account?id=<mój-guid>

```

albo

```

/my-account?id=wiener

```

Tylko w tej wersji labu `id` będzie GUIDem.

W Burp przechwytuję request do `/my-account` i wysyłam go do Repeater.

🖼️ Evidence:
![my-account-own-guid](/field-manual/assets/portswigger/access-control/user-id-guid/02-my-account-own-guid.png)

---

### Krok 4 - Podmieniam `id` na GUID carlos

W Repeater robię minimalną zmianę:

- `id=<mój-guid>` → `id=<guid-carlos>`

Request (schemat):

```http
GET /my-account?id=<carlos-guid> HTTP/1.1
Host: <lab-host>
Cookie: session=<...>
```

To jest wciąż ten sam test co w poprzednim labie, tylko z innym formatem identyfikatora:

- czy serwer bierze „czyje konto” z sesji,
- czy bierze to z parametru `id`.

🖼️ Evidence:
![repeater-id-carlos-guid](/field-manual/assets/portswigger/access-control/user-id-guid/03-repeater-id-carlos-guid.png)

---

### Krok 5 - Odbieram dane carlos i wyciągam API key

Jeśli aplikacja jest podatna, dostanę stronę konta carlos, a w niej jego **API key**.

I to się dzieje: backend oddaje mi cudze dane, bo uznał, że `id` w request to wystarczająca „autoryzacja”.

🖼️ Evidence:
![carlos-api-key](/field-manual/assets/portswigger/access-control/user-id-guid/04-carlos-api-key.png)

---

## Exploit (akcja)

### Krok 6 - Submituję API key

Kopiuję API key carlos i wklejam go do formularza rozwiązania labu.

Lab zaliczony.

---

## Impact

W realnej aplikacji GUIDy często robią ludziom fałszywe poczucie bezpieczeństwa.

A prawda jest taka:

- jeśli identyfikator da się zdobyć (a prawie zawsze się da),
- a serwer nie robi server-side authorization,
- to masz normalnego IDOR-a.

Konsekwencje zależą od tego, co jest podpięte pod konto:

- podgląd danych innych użytkowników,
- dostęp do sekretów (API keys, tokeny),
- modyfikacja danych (jeśli inne endpointy też ufają `id`),
- czasem przejęcia kont.

---

## Fix (co powinno było istnieć)

1. **Tożsamość użytkownika musi wynikać z sesji**
   `/my-account` w idealnym świecie nie potrzebuje żadnego `id` w URL.

2. **Jeśli `id` jest wymagane (np. admin view) → twarda autoryzacja**
   Zawsze: `currentUser canAccess(requestedUserId)` → inaczej `403`.

3. **Deny-by-default**
   Nie ma autoryzacji = nie ma danych. Kropka.

4. **Hardening: nie traktować GUID jako kontroli dostępu**
   GUID to identyfikator, nie mechanizm bezpieczeństwa. Może utrudnić enumerację, ale nie zastąpi autoryzacji.

---

## Lessons learned (portable checklist)

- „Nieprzewidywalne ID” nie ma znaczenia, jeśli aplikacja sama je publikuje w linkach.
- Jeśli widzisz `?id=<guid>` przy stronach konta → testuj podmianę na cudzy GUID.
- Kontrola dostępu zaczyna się dopiero wtedy, gdy serwer mówi „403”, a nie wtedy, gdy ID wygląda losowo.
