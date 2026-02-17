---
id: ps-writeup-ac-unprotected-admin-unpredictable-url
title: "Lab Write-up: Unprotected admin functionality with unpredictable URL"
team: red
category: portswigger writeups
chapter: access-control
tags: ["portswigger", "access-control", "admin-panel", "source-code", "misconfiguration"]
difficulty: apprentice
updatedAt: "2026-02-17"
---

# Lab Write-up: Unprotected admin functionality with unpredictable URL

## Goal

Delete the user **carlos**.

## What I’m actually testing here (mindset)

“Unpredictable URL” isn’t access control - it’s at best smoke and mirrors.

I’m checking **two things**:

1. **Can I discover the admin endpoint without being an admin?** (HTML/JS/assets leakage)
2. **Once I reach it - does the server actually enforce authorization, or does it just serve the admin panel to anyone?**

This lab is a classic failure mode: _the admin functionality exists and works, but authorization doesn’t - and the “random URL” leaks through the front-end code._

---

## Recon & discovery

### Step 1 - Review the home page source (looking for a leaked admin path)

Instead of guessing URLs, I do what an attacker does:

- DevTools → **View Source / Elements**
- or Burp → response for `/`

I search for keywords like:

- `admin`
- `adminPanel`
- `panel`
- `path`
- `location`
- `href`

Observation:

- The page source (inline JS) contains a snippet that **discloses the admin panel URL** (a random-looking path).

🖼️ Evidence:
![admin-path-leak](/field-manual/assets/portswigger/access-control/unprotected-admin-unpredictable-url/01-source-leak.png)

---

## Validation (do I really have access?)

### Step 2 - Load the disclosed admin endpoint

Request:

```http
GET /admin-<unpredictable> HTTP/1.1
Host: <lab-host>
```

What I expected:

- `302` redirect to login
- `403 Forbidden`
- a server-side role/permission check

What happened:

- The admin panel loads normally for an unauthenticated / regular user.

This is the key finding:

> **Administrative functionality is accessible without authorization - the “random URL” doesn’t matter.**

🖼️ Evidence:
![admin-panel-open](/field-manual/assets/portswigger/access-control/unprotected-admin-unpredictable-url/02-admin-panel.png)

---

## Exploit (action)

### Step 3 - Perform an admin action (delete the user)

From the admin panel, I used the “delete” function for the user `carlos`.

Why this is a vulnerability:

- The issue isn’t just that the URL can be found.
- The real problem is that the server accepts privileged actions **without verifying my permissions**.

---

## Impact

If this existed in a real application:

- deleting users / resetting passwords / changing roles
- full administrative control (depending on available features)
- impact on **Integrity** and **Availability**, often **Confidentiality** as well

---

## Fix (what should have existed)

1. **Server-side authorization** on every admin endpoint (middleware/guard).
2. Deny-by-default for administrative routes.
3. Don’t expose privileged paths in public HTML/JS (hardening only - core is authorization).
4. Monitoring and alerting on access to the admin area (especially from non-privileged accounts).

---

## Lessons learned (portable checklist)

- If something is “hidden” → check **source/JS** before you start guessing paths.
- UI and a “secret URL” ≠ security. Only **server-side authorization** matters.
- Finding the admin route is discovery - the bug starts when it **works without permissions**.
