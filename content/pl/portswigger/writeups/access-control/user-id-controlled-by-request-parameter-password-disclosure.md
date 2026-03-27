---
id: ps-writeup-ac-user-id-controlled-by-request-parameter-password-disclosure
title: "User ID controlled by request parameter with password disclosure"
team: red
category: portswigger writeups
chapter: access-control
tags: ["access-control", "idor", "password-disclosure", "parameter-tampering"]
difficulty: apprentice
shortDescription: "Write-up z labu PortSwigger, w którym zwykła podmiana parametru id prowadzi nie tylko do podejrzenia cudzego profilu, ale też do ujawnienia pełnego hasła administratora ukrytego jedynie pozornie w formularzu, co kończy się przejęciem konta i dostępem do funkcji administracyjnych."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter with password disclosure

## Cel

1. Wyciągnąć **hasło administratora**.
2. Zalogować się jako **administrator** i usunąć użytkownika **carlos**.

Dane startowe:

- `wiener:peter`

---

## Co ja tu realnie testuję (mindset)

Ten lab to w praktyce **dwa błędy sklejone w jeden incident**:

1. **IDOR / kontrola dostępu oparta o parametr `id`**  
   Czyli: „pokaż profil użytkownika wskazanego w URL” zamiast „pokaż profil użytkownika z sesji”.

2. **Disclosure sekretu w HTML** (hasło w response)  
   Nawet jeśli input jest „zamaskowany” w UI (`type="password"`), to nie ma znaczenia.  
   Jeśli wartość jest w HTML/JSON, to ja ją widzę w surowej odpowiedzi.

To jest ten typ wpadki, który często przechodzi review, bo na ekranie wygląda „bezpiecznie”:

- pole z hasłem jest zamazane kropkami,
- nikt nie klika „pokaż źródło”.

A atakujący nie musi nic pokazywać - on czyta odpowiedź.

---

## Recon & discovery

### Krok 1 - Loguję się i wchodzę na stronę konta

Loguję się jako `wiener:peter` i otwieram **My account**.

Patrzę na URL i od razu szukam klasyka:

- `id=wiener`
- `user=wiener`
- cokolwiek, co mówi backendowi „czyje konto wyświetlić”.

Obserwacja: strona konta jest kontrolowana przez parametr **`id`**.

🖼️ Evidence:
![my-account-id-wiener](/field-manual/assets/portswigger/access-control/password-disclosure/01-my-account-id-wiener.png)

---

## Walidacja (czy mogę wskazać innego użytkownika?)

### Krok 2 - Podmieniam `id` na `administrator`

Tu nie kombinuję. Robię najprostszy test dostępu:

- `id=wiener` → `id=administrator`

Przykład (schemat):

```

/my-account?id=administrator

```

I teraz najważniejsze: **nie oceniam po UI**.
Wysyłam request do Burp i patrzę na odpowiedź.

- Proxy → HTTP history → Send to Repeater
  albo po prostu przechwyt i podgląd response.

🖼️ Evidence:
![repeater-id-administrator](/field-manual/assets/portswigger/access-control/password-disclosure/02-repeater-id-administrator.png)

---

## Obserwacja: „zamaskowane” hasło jest jawne w odpowiedzi

### Krok 3 - Czytam response i wyciągam hasło administratora

W odpowiedzi dostaję HTML strony konta administratora.

W tym HTML jest formularz, a w nim input typu `password` z ustawioną wartością.

To jest krytyczny detal:

- UI pokazuje kropki
- ale **wartość siedzi w atrybucie `value`**

Czyli w response widzę coś w stylu (schematycznie):

```html
<input type="password" name="password" value="ADMIN_PASSWORD_HERE" />
```

To nie jest „hash”. To jest aktualne hasło wprost.

🖼️ Evidence:
![admin-password-in-response](/field-manual/assets/portswigger/access-control/password-disclosure/03-admin-password-in-response.png)

Hasło kopiuję i traktuję jak sekret z najwyższym priorytetem (w realu: natychmiastowy incident).

---

## Exploit (akcja)

### Krok 4 - Loguję się jako administrator i usuwam carlos

1. Wylogowuję się / otwieram stronę logowania.
2. Loguję się jako `administrator` z hasłem wyciągniętym z response.
3. Wchodzę na `/admin` (albo panel admina dostępny po zalogowaniu).
4. Usuwam użytkownika **carlos**.

Lab zaliczony.

🖼️ Evidence:
![admin-delete-carlos](/field-manual/assets/portswigger/access-control/password-disclosure/04-admin-delete-carlos.png)

---

## Impact

W realnym systemie to jest pełne przejęcie konta administracyjnego i praktycznie „game over”, bo:

- przejęcie admina = dostęp do funkcji zarządzania użytkownikami,
- możliwość resetów, zmian ról, podglądu danych,
- często dostęp do danych finansowych / konfiguracji / integracji.

Ten bug jest też niebezpieczny operacyjnie:

- może zostać wykryty późno,
- bo w UI wszystko wygląda „normalnie”.

---

## Fix (co powinno było istnieć)

1. **Nigdy nie zwracaj hasła (ani aktualnego, ani w żadnej formie)**
   Hasło nie jest danymi do wyświetlania. Kropka.
   Formularz zmiany hasła ma mieć pola:
   - current password (puste),
   - new password (puste),
   - confirm (puste).

2. **Tożsamość użytkownika musi wynikać z sesji**
   `/my-account` nie powinno brać `id` z URL do pobierania profilu.
   Jeśli endpoint ma wspierać podgląd innych kont (np. admin), to musi mieć twardą autoryzację.

3. **Deny-by-default + server-side authorization**
   Każde pobranie profilu: `currentUser canAccess(targetUser)` → inaczej `403`.

4. **Bezpieczne projektowanie UI**
   `type="password"` to tylko kosmetyka w przeglądarce, nie kontrola bezpieczeństwa.
   Wszystko co jest w response jest dostępne dla klienta.

---

## Lessons learned (portable checklist)

- Jeśli widzisz parametr `id` na „My account” → testuj podmianę na `administrator`.
- Maskowanie w UI nic nie znaczy. Liczy się **source / response body**.
- Formularze profilu nie mogą zawierać sekretów w atrybutach `value`.
- To jest incident klasy „natychmiastowa rotacja haseł + review access control”.
