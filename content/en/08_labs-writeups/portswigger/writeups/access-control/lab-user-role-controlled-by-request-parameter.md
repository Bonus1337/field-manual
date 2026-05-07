---
id: ps-writeup-ac-user-role-controlled-by-request-parameter
title: "User role controlled by request parameter"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: privilege-escalation-via-cookie-role-tampering
sourceTrack: portswigger-web-security-academy
tags: ["portswigger", "access-control", "cookie", "role-tampering", "misconfiguration"]
difficulty: apprentice
shortDescription: "A practical PortSwigger lab write-up showing how a seemingly harmless Admin cookie turns into full privilege escalation when the application trusts a user-controlled value and uses it to grant access to administrative functionality."
updatedAt: "2026-02-17"
---

# Lab Write-up: User role controlled by request parameter

## Goal

Delete the user **carlos**.

## What I’m actually testing here (mindset)

If the application identifies an administrator using something the user can **change on their side** (for example, a cookie or a request parameter), I assume the access control is implemented as a shortcut.

In this lab I check two things:

1. Does the **`/admin`** endpoint exist and block me as a regular user (meaning there is an administrative area)?
2. After logging in, do I get a “role flag” stored in a cookie that I can **forge**, and does the server trust it?

If the answer is “yes”, this is a classic access control failure: the server makes permission decisions based on data the attacker can modify.

---

## Recon and discovery

### Step 1 - Confirm how `/admin` behaves

Request:

```http
GET /admin HTTP/1.1
Host: <lab-host>
```

Observation:

- The admin panel exists, but without privileges I get access denied (most commonly `403` or a message).
- So some access control is present… the question is **what it is based on**.

🖼️ Evidence:
![admin-forbidden](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/01-admin-forbidden.png)

---

## Entry point: login and role stored in a cookie

### Step 2 - Log in and intercept the response with `Set-Cookie`

Login credentials:

- `wiener:peter`

In Burp Suite:

- Proxy → **Intercept ON**
- enable response interception (so I can capture the `Set-Cookie` header)

I submit the login form and analyze the server response.

Response (key fragment):

```http
HTTP/1.1 302 Found
Location: /
Set-Cookie: session=<...>; Secure; HttpOnly
Set-Cookie: Admin=false
```

Observation:

- The server sets the `Admin=false` cookie.
- This is a red flag: if the administrator role is stored in a cookie and is not protected (for example, with a cryptographic signature), I can change it.

🖼️ Evidence:
![set-cookie-admin-false](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/02-set-cookie-admin-false.png)

---

## Exploit (action)

### Step 3 - Forge `Admin=false` → `Admin=true`

In the same intercepted response I change:

```diff
- Set-Cookie: Admin=false
+ Set-Cookie: Admin=true
```

and only then forward the response to the browser.

Result:

- the browser stores the cookie as `Admin=true`,
- the application starts treating me as an administrator because the server **trusts** what is stored in the cookie.

🖼️ Evidence:
![cookie-tamper](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/03-cookie-tamper.png)

---

## Validation (does it really work?)

### Step 4 - Access `/admin` again with the modified cookie

Request:

```http
GET /admin HTTP/1.1
Host: <lab-host>
Cookie: Admin=true; session=<...>
```

Observation:

- The admin panel loads successfully.
- This confirms the application identifies administrators based on a **forgeable cookie**.

🖼️ Evidence:
![admin-panel-open](/field-manual/assets/portswigger/access-control/user-role-controlled-by-request-parameter/04-admin-panel-open.png)

---

## Completing the goal

### Step 5 - Delete the user `carlos`

In the admin panel I click “Delete” next to `carlos` and observe the request.

Example request:

```http
GET /admin/delete?username=carlos HTTP/1.1
Host: <lab-host>
Cookie: Admin=true; session=<...>
```

Observation:

- The action succeeds and `carlos` disappears from the user list.
- Lab solved.

---

## Impact

In a real application this typically means:

- privilege escalation from a regular user to an administrator
- account management abuse (password reset, role changes, deleting users)
- impact on **Integrity** and often **Confidentiality**
- potentially impact on **Availability** (deleting accounts/resources)

---

## How to fix it

1. **Do not base permission decisions on user-controlled data** (cookie, request parameter).
2. Verify permissions **on the server side**, based on the session and database data (source of truth for roles).
3. If the application carries role information in tokens or cookies:
   - it must be **cryptographically signed** and verified,
   - but it is still better to keep roles server-side.

4. Use a “deny by default” approach for the administrative area and add regression tests for access control bypass.

---

## Lessons learned (portable checklist)

- I always check `/admin` early to see how the application behaves without privileges.
- After login I review `Set-Cookie`: whether it contains a role flag like `isAdmin` / `Admin`.
- If a role is stored in a cookie as plain text, this is not access control - it’s an invitation for privilege escalation.
- The user interface can block things - what matters is what the server accepts.
