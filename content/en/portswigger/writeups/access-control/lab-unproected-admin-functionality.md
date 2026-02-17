---
id: ps-writeup-ac-unprotected-admin
title: "Unprotected admin functionality"
team: red
category: portswigger writeups
chapter: access-control
tags: ["portswigger", "access-control", "admin-panel", "robots.txt", "misconfiguration"]
difficulty: apprentice
updatedAt: "2026-02-16"
---

# Lab Write-up: Unprotected admin functionality

## Goal

Delete the user **carlos**.

## What I’m actually testing here (mindset)

When an application has an “admin area”, I’m not assuming it’s protected just because it exists.
I’m checking **two things**:

1. **Can I discover the admin endpoint without being an admin?**
2. **If I reach it, is there a real authorization check or just “security by UI”?**

This lab is a clean example of a very common failure mode: _the admin functionality exists and works, but nobody enforced access control on it._

---

## Recon & discovery

### Step 1 - Look for “non-human” hints

Before brute-forcing paths, I check files that often leak structure:

- `robots.txt`
- `sitemap.xml`
- common framework defaults (`/admin`, `/administrator`, `/manage`, etc.)

Request:

```http
GET /robots.txt HTTP/1.1
Host: <lab-host>
```

Observation:

- `robots.txt` contains a **Disallow** entry that reveals the admin panel path.

**Why this matters (real-world):**
`robots.txt` is not “security”. It’s basically a sign saying:

> “We don’t want bots to index this.”
> Attackers read it as:
> “Thanks for the map.”

🖼️ Evidence:
![robots-disallow](/field-manual/assets/portswigger/access-control/unprotected-admin/01-robots.png)

---

## Validation (do we really have access?)

### Step 2 - Open the leaked admin endpoint

Request:

```http
GET /administrator-panel HTTP/1.1
Host: <lab-host>
```

What I expected:

- redirect to login (`302`)
- `403 Forbidden`
- a role-based check server-side

What happened:

- The admin panel loads for an unauthenticated/normal user.

This is the key finding:

> **Admin functionality is exposed and reachable without authorization.**

🖼️ Evidence:
![admin-panel-open](/field-manual/assets/portswigger/access-control/unprotected-admin/02-admin.png)

---

## Exploit (action)

### Step 3 - Perform the admin action (delete user)

From the admin panel, I used the “delete” function for user `carlos`.

What makes this a vulnerability:

- It’s not about _finding_ the admin UI.
- It’s about the app accepting privileged actions **without checking who I am**.

---

## Impact

If this existed in a real app:

- Account takeover / user deletion / permission changes
- Full administrative control depending on available features
- Potential data loss and operational impact (Availability + Integrity)

---

## Fix (what should have existed)

1. **Server-side authorization** on every admin endpoint (not only hiding links in UI).
2. Consistent access control middleware / guard.
3. Prefer deny-by-default for admin routes.
4. Do not rely on `robots.txt` (treat it as public).

---

## Lessons learned (portable checklist)

- Always check `robots.txt` and `sitemap.xml` early.
- Finding an admin route is not the bug - **lack of authorization is**.
- UI restrictions ≠ security. Only server-side checks count.
