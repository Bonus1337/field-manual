---
id: ps-writeup-ac-user-id-controlled-by-request-parameter-data-leakage-in-redirect
title: "PortSwigger Access Control - IDOR z wyciekiem danych w odpowiedzi redirect"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: idor-data-leakage-in-redirect-response
sourceTrack: portswigger-web-security-academy
tags: ["idor", "horizontal-privilege-escalation", "redirect", "information-disclosure"]
difficulty: apprentice
shortDescription: "Write-up z labu PortSwigger pokazujący nietypowy wariant IDOR, w którym aplikacja próbuje ukryć brak autoryzacji przez redirect, ale mimo przekierowania nadal zwraca w body wrażliwe dane innego użytkownika, w tym klucz API możliwy do zauważenia dopiero na poziomie surowej odpowiedzi HTTP."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter with data leakage in redirect

## Cel

Zdobądź **API key** użytkownika **carlos** i wyślij go jako rozwiązanie.

## Co ja tu realnie testuję (mindset)

To jest dalej ten sam pattern co w IDOR-ach: aplikacja pozwala sterować „czyje dane pobieram” przez parametr `id`.

Różnica jest w tym, że tutaj dev **próbował to przyciąć** redirectem.

I to jest bardzo realistyczny błąd:

- „Jak ktoś poprosi o cudze konto, to zrobimy redirect na home.”
- UI wygląda bezpiecznie
- ale backend i tak **wyrenderował wrażliwe dane** w odpowiedzi

Redirect (302/303) to nie magiczna gumka do mazania.  
Jeśli serwer wrzuci sekret do body, to ja go i tak zobaczę w Burp.

Mój test jest prosty:

1. Podmienić `id` na `carlos`
2. Nie patrzeć na to, gdzie przeglądarka mnie przenosi
3. Patrzeć na **surową odpowiedź** (status + headers + body)

---

## Recon & discovery

### Krok 1 - Loguję się i identyfikuję request do strony konta

Loguję się jako `wiener:peter` i wchodzę w **My account**.

Zwracam uwagę na URL - zwykle wygląda to jak:

```

/my-account?id=wiener

```

Przechwytuję request w Burp i wysyłam go do Repeater.

🖼️ Evidence:
![my-account-request](/field-manual/assets/portswigger/access-control/user-id-redirect-leak/01-my-account-request.png)

---

## Walidacja (co robi aplikacja, gdy proszę o cudze dane?)

### Krok 2 - Podmieniam `id` na `carlos`

W Repeater zmieniam tylko jedną rzecz:

- `id=wiener` → `id=carlos`

Request (schemat):

```http
GET /my-account?id=carlos HTTP/1.1
Host: <lab-host>
Cookie: session=<...>
```

W tym momencie spodziewam się jednej z dwóch „poprawnych” reakcji aplikacji:

- `403 Forbidden` (idealnie)
- redirect + **puste** body (czasem spotykane, nadal OK)

Ale tu dzieje się coś ciekawszego.

🖼️ Evidence:
![repeater-id-carlos](/field-manual/assets/portswigger/access-control/user-id-redirect-leak/02-repeater-id-carlos.png)

---

### Krok 3 - Obserwacja: jest redirect, ale body zdradza sekret

Odpowiedź ma status redirect (np. `302 Found`) i nagłówek `Location: /`.

Czyli z perspektywy przeglądarki wygląda jak:

> „Nie masz dostępu, wracaj na stronę główną.”

Natomiast w Repeater widzę coś, co w ogóle nie powinno się tam znaleźć:

- body odpowiedzi zawiera dane konta carlos,
- w tym jego **API key**.

To jest ten moment, gdzie UI i bezpieczeństwo rozjeżdżają się kompletnie:

> Serwer próbował „ukryć” brak autoryzacji redirectem, ale i tak wyrenderował wrażliwe dane w odpowiedzi.

🖼️ Evidence:
![redirect-body-leaks-api-key](/field-manual/assets/portswigger/access-control/user-id-redirect-leak/03-redirect-body-leaks-api-key.png)

---

## Exploit (akcja)

### Krok 4 - Wyciągam API key z body i submituję

Kopiuję API key carlos z body odpowiedzi (z Repeater, nie z UI przeglądarki) i wklejam do formularza rozwiązania.

Lab zaliczony.

---

## Impact

W realnej aplikacji to jest podwójnie groźne, bo:

- z UI wygląda „okej” (redirect, brak dostępu),
- a w warstwie HTTP lecą sekrety.

Typowe skutki:

- wyciek danych innych użytkowników (PII),
- wyciek tokenów / kluczy API,
- wyciek danych, które potem można użyć do dalszej eskalacji.

I co gorsza: takie bugi długo żyją, bo „nikt tego nie widzi” klikając normalnie w przeglądarce.

---

## Fix (co powinno było istnieć)

1. **Nie renderować danych przed autoryzacją**
   Najpierw decyzja „czy wolno”, dopiero potem budowanie odpowiedzi.

2. **W przypadku braku dostępu → 403 + brak wrażliwego body**
   Redirect może być dodatkiem UX, ale nie może nieść danych.

3. **Deny-by-default**
   Jeśli kontrola dostępu nie przejdzie, serwer ma zakończyć request bez generowania wrażliwego contentu.

4. **Testy bezpieczeństwa na poziomie HTTP, nie UI**
   Automatyczne testy powinny sprawdzać, czy odpowiedzi 3xx/4xx nie zawierają sekretów w body.

---

## Lessons learned (portable checklist)

- Jeśli aplikacja robi redirect zamiast `403`, zawsze sprawdź **body odpowiedzi**.
- Nie oceniaj kontroli dostępu po tym, co widzisz w przeglądarce - oceniaj po surowym HTTP.
- Redirect nie naprawia IDOR-a. On co najwyżej sprawia, że bug jest mniej oczywisty dla użytkownika, ale nie dla atakującego.
