---
id: ps-writeup-ac-user-id-controlled-by-request-parameter
title: "PortSwigger Access Control - klasyczny IDOR przez parametr id użytkownika"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: idor-via-user-id-parameter-tampering
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "idor", "horizontal-privilege-escalation", "parameter-tampering"]
difficulty: apprentice
shortDescription: "Klasyczny write-up z labu PortSwigger pokazujący IDOR przez podmianę parametru id w żądaniu, gdzie backend wybiera konto do wyświetlenia na podstawie wartości kontrolowanej przez użytkownika zamiast aktywnej sesji, co prowadzi do poziomej eskalacji uprawnień i ujawnienia cudzego klucza API."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter

## Cel

Zdobądź **API key** użytkownika **carlos** i wyślij go jako rozwiązanie.

## Co ja tu realnie testuję (mindset)

To jest czysty przykład **IDOR / horizontal privilege escalation**.

Nie interesuje mnie, że „strona konta działa”. Interesuje mnie _dlaczego_ działa i _na czym_ backend opiera decyzję:

- Czy serwer bierze tożsamość użytkownika z **sesji**?
- Czy bierze ją z **parametru w URL**, który ja mogę sobie zmienić?

Jeśli aplikacja używa parametru typu `id`, `user`, `account`, `uid` do wskazania „czyje konto wyświetlić”, to zakładam najgorsze:

> UI pokazuje „moje konto”, ale backend tak naprawdę pokazuje „konto o identyfikatorze podanym w request”.

W tym labie nagroda jest prosta: jeśli podepnę się pod `carlos`, dostanę jego API key.

---

## Recon & discovery

### Krok 1 - Loguję się i patrzę na adres strony konta

Loguję się jako `wiener:peter` i wchodzę w **My account**.

Zwracam uwagę na URL. Szukam parametrów, które wyglądają jak identyfikator właściciela widoku:

- `id=...`
- `user=...`
- `accountId=...`

Obserwacja:

- w URL widzę parametr **`id`** ustawiony na mój username.

Przykład (schemat):

```

/my-account?id=wiener

```

To jest mój sygnał, że aplikacja może używać parametru `id` jako „właściciela profilu”.

🖼️ Evidence:
![my-account-id-wiener](/field-manual/assets/portswigger/access-control/user-id-controlled-by-request-parameter/01-my-account-id-wiener.png)

---

## Walidacja (czy backend ufa parametrowi?)

### Krok 2 - Wysyłam request do Repeater i zmieniam `id`

W Burp przechwytuję request do `/my-account` i wysyłam go do Repeater.

W Repeater robię minimalną zmianę:

- `id=wiener` → `id=carlos`

Request (schemat):

```http
GET /my-account?id=carlos HTTP/1.1
Host: <lab-host>
Cookie: session=<...>
```

To jest najbardziej „ludzki” test kontroli dostępu:

- nic nie brute-force’uję,
- nic nie payloaduję,
- po prostu pytam backend: „a co jeśli poproszę o cudze konto?”.

🖼️ Evidence:
![repeater-id-carlos](/field-manual/assets/portswigger/access-control/user-id-controlled-by-request-parameter/02-repeater-id-carlos.png)

---

### Krok 3 - Sprawdzam odpowiedź: czy widzę dane carlos?

Jeśli aplikacja jest podatna, odpowiedź nie powinna być:

- `403 Forbidden`
- redirect do mojego konta
- „not authorized”

Tylko powinna faktycznie zwrócić stronę konta **carlos**.

I to się dzieje: po podmianie `id` dostaję dane należące do carlos, w tym jego **API key**.

🖼️ Evidence:
![carlos-api-key](/field-manual/assets/portswigger/access-control/user-id-controlled-by-request-parameter/03-carlos-api-key.png)

---

## Exploit (akcja)

### Krok 4 - Wyciągam API key i submituję

Z odpowiedzi kopiuję API key użytkownika **carlos** i wklejam go w formularz rozwiązania labu.

Lab zaliczony.

---

## Impact

W realnej aplikacji to jest jeden z tych bugów, które eskalują się „same”, bo wpływ zależy tylko od tego, co jest podpięte pod konto:

- podgląd danych innych użytkowników (PII, adresy, zamówienia),
- zmiana danych (jeśli endpoint pozwala edycję),
- dostęp do tokenów / kluczy API,
- czasem nawet przejęcie konta (jeśli da się zmienić e-mail / hasło / MFA w tym samym modelu).

To jest **poziomy** problem uprawnień: nie staję się adminem - staję się _kimkolwiek wskażę_.

---

## Fix (co powinno było istnieć)

1. **Tożsamość użytkownika z sesji, nie z parametru**
   Backend powinien brać „kogo obsługuję” z sesji (`session user`), a nie z `id` w URL.

2. **Jeśli parametr musi istnieć (np. admin view) → twarda autoryzacja**
   Każdy request musi sprawdzać: czy bieżący użytkownik ma prawo czytać dane `id=X`.

3. **Deny-by-default**
   Jeśli kontrola dostępu nie przejdzie → `403` (a nie „zwróć cokolwiek”).

4. **Nie eksponować sekretów w widoku konta**
   API key to materiał wrażliwy. Jeśli musi być dostępny:
   - pokazuj go raz przy generacji,
   - albo wymagaj dodatkowej weryfikacji (re-auth / MFA),
   - albo dawaj tylko częściowy podgląd.

---

## Lessons learned (portable checklist)

- Jeśli widzisz `?id=` przy stronach typu „My account” → testuj to jako pierwsze.
- Zamień `id` na innego użytkownika i patrz na reakcję:
  - **403 / redirect** = dobrze,
  - pełny profil innej osoby = IDOR.

- Nie ufaj temu, co sugeruje UI („to jest moje konto”) - ufaj temu, co da się wymusić requestem.
