---
id: ps-writeup-ac-insecure-direct-object-references
title: "Insecure direct object references"
team: red
category: portswigger writeups
chapter: access-control
tags: ["idor", "information-disclosure", "static-files", "predictable-ids"]
difficulty: apprentice
shortDescription: "Krótki write-up z labu PortSwigger pokazujący IDOR na statycznych plikach z przewidywalnym identyfikatorem, gdzie brak autoryzacji przy pobieraniu transkryptów prowadzi do wycieku hasła i przejęcia konta innego użytkownika."
updatedAt: "2026-02-18"
---

# Lab Write-up: Insecure direct object references

## Cel

Znaleźć **hasło użytkownika carlos** w logach czatu i zalogować się na jego konto.

---

## Co ja tu realnie testuję (mindset)

Ten lab pokazuje IDOR w wersji „plikowej”:

- aplikacja zapisuje wrażliwe dane na dysku serwera,
- udostępnia je pod **statycznym URL**,
- identyfikator zasobu jest **przewidywalny** (inkrementowane numerki),
- a serwer nie robi żadnej realnej autoryzacji („kto ma prawo czytać ten plik?”).

To jest błąd, który w realu często wygląda niewinnie:

> „To tylko transkrypcje czatu, każdy ma swój link.”

Tylko że link jest „mój” wyłącznie w UI.  
W HTTP to jest po prostu:

- `GET /transcripts/2.txt`

Jeśli da się zgadywać / enumerować, to nie ma kontroli dostępu. Jest biblioteczka publicznych plików.

---

## Recon & discovery

### Krok 1 - Wchodzę w Live chat i generuję transkrypt

Przechodzę do zakładki **Live chat**.

Wysyłam dowolną wiadomość (cokolwiek, byle powstał zapis), a następnie klikam **View transcript**.

🖼️ Evidence:
![live-chat-view-transcript](/field-manual/assets/portswigger/access-control/idor-static-transcripts/01-live-chat-view-transcript.png)

---

### Krok 2 - Patrzę na URL transkryptu (to jest cały „finding”)

Po otwarciu transkryptu patrzę na adres.

Obserwacja:

- transkrypty są zwykłymi plikami `.txt`,
- nazwa pliku zawiera numer, który wygląda na **inkrementowany**.

Przykład (schemat):

```

/download-transcript/2.txt

```

albo:

```

/transcripts/2.txt

```

To jest moment, w którym nie potrzebuję Burpa ani fuzzera.
Wystarczy zdrowy rozsądek:

> Jeśli to jest numer rosnący, to wcześniejsze pliki prawdopodobnie istnieją.

---

## Walidacja (czy mogę sięgnąć po cudzy plik?)

### Krok 3 - Podmieniam numer pliku na `1.txt`

W pasku adresu (albo w Burp Repeater) zmieniam filename na najprostszy możliwy:

- `2.txt` → `1.txt`

Request (schemat):

```http
GET /download-transcript/1.txt HTTP/1.1
Host: <lab-host>
```

To jest klasyczna enumeracja zasobu o przewidywalnym ID.

🖼️ Evidence:
![transcript-1-request](/field-manual/assets/portswigger/access-control/idor-static-transcripts/02-request-1-txt.png)

---

### Krok 4 - Czytam treść i szukam sekretów (hasło)

Otwieram treść `1.txt`.

W środku widzę zapis rozmowy - i w tym transkrypcie znajduje się **hasło** (dla carlos).

To jest dokładnie ten typ wycieku, który w realu zabija systemy:

- support wrzuca hasło,
- user je podaje,
- a potem to ląduje w logach dostępnych po statycznym URL.

🖼️ Evidence:
![password-in-transcript](/field-manual/assets/portswigger/access-control/idor-static-transcripts/03-password-in-transcript.png)

---

## Exploit (akcja)

### Krok 5 - Loguję się jako carlos

Wracam na stronę logowania i używam skradzionych danych:

- `carlos:<hasło_z_transkryptu>`

Lab zaliczony.

🖼️ Evidence:
![login-as-carlos](/field-manual/assets/portswigger/access-control/idor-static-transcripts/04-login-as-carlos.png)

---

## Impact

W realnej aplikacji skutki są zwykle większe niż „podejrzałem czat”:

- wyciek danych osobowych,
- wyciek danych uwierzytelniających (hasła, tokeny),
- wyciek informacji biznesowych (zamówienia, reklamacje),
- możliwość przejęcia kont.

To jest też problem reputacyjny: użytkownicy zakładają, że rozmowa z supportem nie jest publicznym plikiem.

---

## Fix (co powinno było istnieć)

1. **Brak publicznych statycznych URL do wrażliwych transkryptów**
   Transkrypty powinny być generowane/pobierane przez endpoint, który:
   - sprawdza sesję,
   - sprawdza właściciela zasobu,
   - dopiero potem zwraca treść.

2. **Nieprzewidywalne identyfikatory to za mało**
   Nawet jeśli zamiast `2.txt` byłby GUID, to nadal:
   - jeśli link wypłynie → jest dostęp.
     Core fix to **autoryzacja**, nie „trudniejsza nazwa pliku”.

3. **Deny-by-default**
   Jeśli użytkownik nie ma prawa do transkryptu → `403`.

4. **Higiena danych**
   Support i system nie powinny przesyłać/przechowywać haseł w czacie.
   (A jeśli już - to przynajmniej automatyczne maskowanie w logach).

---

## Lessons learned (portable checklist)

- Jeśli aplikacja serwuje pliki typu `/something/123.txt`, traktuj to jak zaproszenie do IDOR.
- Zawsze testuj: `1`, `2`, `3`, `10`, `100` - bez ciężkich narzędzi, na sucho.
- „To tylko plik” nie zwalnia z autoryzacji. Plik to też obiekt.
