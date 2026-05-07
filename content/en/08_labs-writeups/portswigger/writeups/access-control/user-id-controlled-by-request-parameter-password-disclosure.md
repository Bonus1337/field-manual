---
id: ps-writeup-ac-user-id-controlled-by-request-parameter-password-disclosure
title: "User ID controlled by request parameter with password disclosure"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: idor-password-disclosure-via-user-id-parameter
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "idor", "password-disclosure", "parameter-tampering"]
difficulty: apprentice
shortDescription: "A PortSwigger lab write-up where a simple id parameter tampering issue leads not only to viewing another user’s profile, but also to disclosure of the administrator’s full password hidden only superficially inside a form, resulting in account takeover and access to administrative functionality."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter with password disclosure

## Goal

1. Extract the **administrator’s password**.
2. Log in as **administrator** and delete the user **carlos**.

Starting credentials:

- `wiener:peter`

---

## What I’m actually testing here (mindset)

In practice, this lab is **two bugs glued into one incident**:

1. **IDOR / access control based on the `id` parameter**  
   Meaning: “show the profile for the user referenced in the URL” instead of “show the profile for the user from the session”.

2. **Secret disclosure in HTML** (password in the response)  
   Even if the input is “masked” in the UI (`type="password"`), it doesn’t matter.  
   If the value is present in HTML/JSON, I can read it in the raw response.

This is the kind of mistake that often passes review because it looks “safe” on the screen:

- the password field is hidden behind dots,
- nobody clicks “view source”.

But an attacker doesn’t need to reveal anything - they just read the response.

---

## Recon & discovery

### Step 1 - Log in and open the account page

I log in as `wiener:peter` and open **My account**.

I look at the URL and immediately search for the classic patterns:

- `id=wiener`
- `user=wiener`
- anything that tells the backend “whose account to render”.

Observation: the account page is controlled by the **`id`** parameter.

🖼️ Evidence:
![my-account-id-wiener](/field-manual/assets/portswigger/access-control/password-disclosure/01-my-account-id-wiener.png)

---

## Validation (can I reference another user?)

### Step 2 - Replace `id` with `administrator`

No tricks here. This is the simplest access test:

- `id=wiener` → `id=administrator`

Example (schema):

```

/my-account?id=administrator

```

And now the important part: **I don’t judge this through the UI**.  
I send the request to Burp and inspect the response.

- Proxy → HTTP history → Send to Repeater  
  or simply intercept and view the raw response.

🖼️ Evidence:
![repeater-id-administrator](/field-manual/assets/portswigger/access-control/password-disclosure/02-repeater-id-administrator.png)

---

## Observation: the “masked” password is visible in the response

### Step 3 - Read the response and extract the administrator password

The response contains the administrator’s account page HTML.

Inside that HTML there’s a form, and inside it a `password` input with a prefilled value.

This is the critical detail:

- the UI shows dots
- but the **value is sitting in the `value` attribute**

So in the response I see something like (schematically):

```html
<input type="password" name="password" value="ADMIN_PASSWORD_HERE" />
```

This is not a hash. This is the current password in plain text.

🖼️ Evidence:
![admin-password-in-response](/field-manual/assets/portswigger/access-control/password-disclosure/03-admin-password-in-response.png)

I copy it and treat it as a top-severity secret (in real life: immediate incident).

---

## Exploit (action)

### Step 4 - Log in as administrator and delete carlos

1. Log out / open the login page.
2. Log in as `administrator` using the password extracted from the response.
3. Navigate to `/admin` (or the admin panel available after login).
4. Delete the user **carlos**.

Lab solved.

🖼️ Evidence:
![admin-delete-carlos](/field-manual/assets/portswigger/access-control/password-disclosure/04-admin-delete-carlos.png)

---

## Impact

In a real system, this is full administrative account compromise - basically “game over”:

- admin takeover = access to user management,
- password resets, role changes, data access,
- often access to financial/configuration/integration features.

Operationally, this is also dangerous because:

- it can be discovered late,
- since everything looks “normal” in the UI.

---

## Fix (what should have existed)

1. **Never return a password (current or otherwise)**
   A password is not display data. Period.
   A password change form should have:
   - current password (empty),
   - new password (empty),
   - confirm (empty).

2. **User identity must come from the session**
   `/my-account` should not take `id` from the URL to load a profile.
   If the endpoint must support viewing other accounts (for admins), enforce strict authorization.

3. **Deny-by-default + server-side authorization**
   Every profile fetch: `currentUser canAccess(targetUser)` → otherwise `403`.

4. **Secure UI design**
   `type="password"` is just browser cosmetics, not a security control.
   Anything in the response is available to the client.

---

## Lessons learned (portable checklist)

- If you see an `id` parameter on “My account” → try swapping it to `administrator`.
- UI masking means nothing. The **source / response body** is what matters.
- Profile forms must never embed secrets inside `value` attributes.
- This is an incident class bug: “rotate credentials immediately + review access control”.
