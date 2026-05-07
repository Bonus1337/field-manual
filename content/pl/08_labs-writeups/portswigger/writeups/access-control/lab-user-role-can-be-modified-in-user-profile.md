---
id: ps-writeup-ac-roleid-modifiable-in-profile
title: "PortSwigger Access Control - eskalacja uprawnień przez modyfikację roleid"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: privilege-escalation-via-role-parameter-tampering
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "privilege-escalation", "parameter-tampering"]
difficulty: apprentice
shortDescription: "Write-up z labu PortSwigger pokazujący eskalację uprawnień przez modyfikację pola roleid w endpointcie profilu użytkownika, gdzie backend akceptuje parametr kontrolowany przez klienta, którego zwykły użytkownik nigdy nie powinien móc zmieniać, a skutkiem jest uzyskanie dostępu do funkcji administracyjnych."
updatedAt: "2026-02-18"
---

# Lab Write-up: User role can be modified in user profile

## Cel

Usuń użytkownika **carlos**.

## Co ja tu realnie testuję (mindset)

W tym labie nie „hackuję admina”. Ja testuję, czy aplikacja **myli profil użytkownika z uprawnieniami**.

Jeśli endpoint do edycji profilu przyjmuje JSON, to zakładam, że mogą się tam dziać dwie złe rzeczy:

1. **Mass assignment / unsafe binding** - backend mapuje pola „jak leci” i zapisuje także takie, których użytkownik nie powinien dotykać.
2. **Zaufanie do danych z klienta** - aplikacja pozwala klientowi powiedzieć „kim jestem” (rola), zamiast wyliczać to wyłącznie po stronie serwera.

Wskazówka w opisie jest konkretna: `/admin` jest tylko dla użytkowników z `roleid = 2`.  
Moim celem jest sprawdzić, czy `roleid` da się „dosztukować” w żądaniu profilu.

---

## Recon & discovery

### Krok 1 - Loguję się i szukam endpointu, który zapisuje profil

Loguję się jako `wiener:peter`, wchodzę na konto i używam funkcji zmiany e-maila.

Patrzę w Burp (Proxy → HTTP history) i namierzam request odpowiedzialny za update profilu:

- `POST /my-account/change-email`
- `Content-Type: application/json`

To jest mój „punkt zaczepienia”.

---

### Krok 2 - Sprawdzam czy backend ujawnia `roleid` w odpowiedzi

Po wysłaniu normalnej zmiany e-maila obserwuję odpowiedź.

Szukam jednego pola: **`roleid`**.

Jeśli ono tam jest, to dla mnie jest to jasny sygnał:

> Skoro backend zwraca `roleid`, to znaczy, że to pole żyje w modelu użytkownika. Teraz sprawdzam, czy backend pozwoli mi je też nadpisać.

🖼️ Evidence:
![roleid-in-response](/field-manual/assets/portswigger/access-control/roleid-modifiable-in-profile/01-roleid-in-response.png)

---

## Walidacja (czy da się to nadpisać?)

### Krok 3 - Wysyłam request do Repeater i dokładam pole `roleid`

W Burp wysyłam request zmiany e-maila do Repeater.

Oryginalnie body ma tylko e-mail. Ja robię minimalną, ale krytyczną modyfikację: dopisuję `roleid: 2`.

Przykład (schemat):

```http
POST /my-account/change-email HTTP/1.1
Host: <lab-host>
Content-Type: application/json
Cookie: session=<...>

{
  "email": "evil@test.net",
  "roleid": 2
}
```

To jest test granicy:

- czy endpoint waliduje schemat i odrzuci dodatkowe pola,
- czy backend „łyknie” to pole i zapisze je do użytkownika.

🖼️ Evidence:
![repeater-roleid-2](/field-manual/assets/portswigger/access-control/roleid-modifiable-in-profile/02-repeater-roleid-2.png)

---

### Krok 4 - Potwierdzam efekt: rola zmieniona na 2

Po ponownym wysłaniu requesta sprawdzam odpowiedź.

W podatnej wersji aplikacji zobaczę, że `roleid` faktycznie stał się `2` (albo wprost w odpowiedzi, albo po ponownym wejściu na konto).

To jest klucz: **serwer zaakceptował zmianę uprawnień z poziomu profilu**.

---

## Exploit (akcja)

### Krok 5 - Wchodzę do `/admin` i kasuję carlos

Skoro rola jest już podbita, wchodzę na:

- `GET /admin`

Panel ładuje się normalnie. Z jego poziomu używam funkcji usunięcia użytkownika `carlos`.

🖼️ Evidence:
![admin-delete-carlos](/field-manual/assets/portswigger/access-control/roleid-modifiable-in-profile/03-admin-delete-carlos.png)

---

## Impact

Gdyby to istniało w realnej aplikacji, konsekwencje są zwykle „poważne z definicji”, bo to jest eskalacja uprawnień:

- dostęp do funkcji administracyjnych,
- zarządzanie użytkownikami (kasowanie, zmiana ról, reset haseł),
- wgląd w dane innych użytkowników.

Wpływ praktycznie zawsze dotyka **Integrity** i często **Confidentiality**.

---

## Fix (co powinno było istnieć)

1. **Twarda walidacja schematu requesta**
   Endpoint zmiany e-maila powinien przyjmować tylko `email`. Każde dodatkowe pole → `400 Bad Request`.

2. **Deny-by-default dla pól uprzywilejowanych**
   Pola typu `roleid`, `isAdmin`, `permissions` nie mogą być „zapisywalne” przez endpointy profilu.

3. **Uprawnienia wyłącznie server-side**
   Rola wynika z danych po stronie serwera (baza + sesja), a nie z payloadu od klienta.

4. **Kontrola dostępu na każdym admin endpointcie**
   `GET /admin` i akcje typu „delete user” muszą mieć server-side guard niezależnie od UI.

---

## Lessons learned (portable checklist)

- Jeśli endpoint profilu przyjmuje JSON → zawsze sprawdź, czy nie da się dopisać pól typu `role`, `roleid`, `isAdmin`.
- Jeśli backend _zwraca_ pole uprawnień → potraktuj to jako sygnał, że może je też _przyjmować_.
- UI i „normalna funkcja profilu” to tylko forma. Liczy się to, co backend zapisuje i na czym opiera autoryzację.
- Prawdziwy bug zaczyna się wtedy, gdy po takiej zmianie **/admin działa**.
