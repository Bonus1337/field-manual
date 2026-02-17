---
id: ps-writeup-ac-user-role-controlled-by-request-parameter
title: "User role controlled by request parameter"
team: red
category: portswigger writeups
chapter: access-control
tags: ["portswigger", "access-control", "cookie", "role-tampering", "misconfiguration"]
difficulty: apprentice
updatedAt: "2026-02-17"
---

# Lab Write-up: User role controlled by request parameter

## Cel

Usuń użytkownika **carlos**.

## Co ja tu realnie testuję (mindset)

Jeśli aplikacja rozpoznaje administratora po czymś, co **użytkownik może zmienić po swojej stronie** (na przykład plik cookie albo parametr żądania), to zakładam, że kontrola dostępu jest zrobiona “na skróty”.

W tym labie sprawdzam dwie rzeczy:

1. Czy endpoint **`/admin`** istnieje i blokuje mnie jako zwykłego użytkownika (czyli jest strefa administracyjna).
2. Czy po logowaniu dostaję “flagę roli” w pliku cookie, którą da się **sfałszować**, a serwer jej ufa.

Jeżeli odpowiedź brzmi “tak” → to jest klasyczny błąd kontroli dostępu: serwer podejmuje decyzję o uprawnieniach na podstawie danych, które atakujący może modyfikować.

---

## Recon i odkrycie

### Krok 1 - Potwierdzam zachowanie `/admin`

Request:

```http
GET /admin HTTP/1.1
Host: <lab-host>
```

Obserwacja:

- Panel istnieje, ale bez uprawnień dostaję brak dostępu (najczęściej `403` lub komunikat).
- To znaczy: jakaś kontrola dostępu jest… tylko pytanie **na czym** się opiera.

🖼️ Evidence:
![admin-forbidden](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/01-admin-forbidden.png)

---

## Punkt wejścia: logowanie i rola w pliku cookie

### Krok 2 - Loguję się i przechwytuję odpowiedź z `Set-Cookie`

Dane do logowania:

- `wiener:peter`

W Burp Suite:

- Proxy → **Intercept ON**
- włączam też przechwytywanie odpowiedzi (żeby złapać nagłówek `Set-Cookie`)

Wysyłam formularz logowania i analizuję odpowiedź serwera.

Response (kluczowy fragment):

```http
HTTP/1.1 302 Found
Location: /
Set-Cookie: session=<...>; Secure; HttpOnly
Set-Cookie: Admin=false
```

Obserwacja:

- Serwer ustawia plik cookie `Admin=false`.
- To jest czerwona flaga: jeżeli rola administratora jest w pliku cookie i nie jest zabezpieczona (na przykład podpisem kryptograficznym), to mogę ją zmienić.

🖼️ Evidence:
![set-cookie-admin-false](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/02-set-cookie-admin-false.png)

---

## Exploit (akcja)

### Krok 3 - Fałszuję `Admin=false` → `Admin=true`

W tej samej przechwyconej odpowiedzi zmieniam:

```diff
- Set-Cookie: Admin=false
+ Set-Cookie: Admin=true
```

i dopiero wtedy puszczam odpowiedź do przeglądarki.

Efekt:

- przeglądarka zapisuje plik cookie jako `Admin=true`,
- aplikacja zaczyna traktować mnie jak administratora, bo serwer **ufa** temu, co mam w plikach cookie.

🖼️ Evidence:
![cookie-tamper](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/03-cookie-tamper.png)

---

## Walidacja (czy to naprawdę działa)

### Krok 4 - Wchodzę ponownie na `/admin` z podmienionym plikiem cookie

Request:

```http
GET /admin HTTP/1.1
Host: <lab-host>
Cookie: Admin=true; session=<...>
```

Obserwacja:

- Panel administracyjny ładuje się poprawnie.
- To potwierdza, że aplikacja rozpoznaje administratora na podstawie **modyfikowalnego pliku cookie**.

🖼️ Evidence:
![admin-panel-open](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/04-admin-panel-open.png)

---

## Finalizacja celu

### Krok 5 - Usuwam użytkownika `carlos`

W panelu administracyjnym klikam “Delete” przy `carlos` i obserwuję żądanie.

Przykładowe żądanie akcji:

```http
GET /admin/delete?username=carlos HTTP/1.1
Host: <lab-host>
Cookie: Admin=true; session=<...>
```

Obserwacja:

- Akcja przechodzi, a `carlos` znika z listy użytkowników.
- Lab zaliczony.

---

## Wpływ (impact)

W realnej aplikacji to zazwyczaj oznacza:

- eskalację uprawnień ze zwykłego użytkownika do administratora
- zarządzanie kontami (reset hasła, zmiana ról, usuwanie użytkowników)
- wpływ na **Integralność** danych i często **Poufność**
- potencjalnie wpływ na **Dostępność** (kasowanie zasobów / użytkowników)

---

## Jak to naprawić (fix)

1. **Nie opierać decyzji o uprawnieniach na danych kontrolowanych przez użytkownika** (plik cookie, parametr żądania).
2. Weryfikować uprawnienia **po stronie serwera**, na podstawie sesji i danych z bazy (źródło prawdy o roli).
3. Jeśli aplikacja przenosi informacje o roli w tokenach lub plikach cookie:
   - muszą być **podpisane kryptograficznie** i weryfikowane,
   - ale i tak lepiej trzymać role po stronie serwera.

4. Podejście “domyślnie zabroń” dla strefy administracyjnej + testy regresji na obejście kontroli dostępu.

---

## Lessons learned (portable checklist)

- `/admin` sprawdzam zawsze na starcie, żeby zobaczyć jak aplikacja reaguje bez uprawnień.
- Po logowaniu analizuję `Set-Cookie`: czy nie ma tam roli lub flag typu `isAdmin` / `Admin`.
- Jeśli rola jest w pliku cookie w postaci zwykłego tekstu → to nie jest kontrola dostępu, tylko prośba o eskalację uprawnień.
- Interfejs użytkownika może blokować - liczy się to, co serwer akceptuje.
