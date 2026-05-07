---
id: ps-writeup-ac-user-id-controlled-by-request-parameter
title: "User ID controlled by request parameter"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: idor-via-user-id-parameter-tampering
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "idor", "horizontal-privilege-escalation", "parameter-tampering"]
difficulty: apprentice
shortDescription: "A classic PortSwigger lab write-up showing how a simple id parameter change in the request leads to horizontal privilege escalation and disclosure of another user’s API key when the backend decides whose account to display based on user input instead of the active session."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter

## Goal

Obtain the **API key** for the user **carlos** and submit it as the lab solution.

## What I’m actually testing here (mindset)

This is a clean **IDOR / horizontal privilege escalation** case.

I’m not impressed that the “account page works”. I care _why_ it works and what the backend uses to decide whose data to return:

- Does the server derive the user identity from the **session**?
- Or does it derive it from a **request parameter** that I can freely change?

If an application uses a parameter like `id`, `user`, `account`, `uid` to decide “which account to display”, I assume the worst:

> The interface says “my account”, but the backend actually serves “the account referenced by the request”.

In this lab, the payoff is simple: if I can pivot to `carlos`, I can read his API key.

---

## Recon & discovery

### Step 1 - Log in and look at the account page URL

I log in as `wiener:peter` and open **My account**.

I pay attention to the URL and look for parameters that behave like the owner identifier:

- `id=...`
- `user=...`
- `accountId=...`

Observation:

- the URL contains an **`id`** parameter set to my username.

Example (schema):

```

/my-account?id=wiener

```

That’s my signal that the application might be using `id` as “whose profile to render”.

🖼️ Evidence:
![my-account-id-wiener](/field-manual/assets/portswigger/access-control/user-id-controlled-by-request-parameter/01-my-account-id-wiener.png)

---

## Validation (does the backend trust the parameter?)

### Step 2 - Send the request to Repeater and change `id`

In Burp, I capture the request to `/my-account` and send it to Repeater.

In Repeater I make a minimal change:

- `id=wiener` → `id=carlos`

Request (schema):

```http
GET /my-account?id=carlos HTTP/1.1
Host: <lab-host>
Cookie: session=<...>
```

This is the most “human” access control test:

- no brute force,
- no payloads,
- just a direct question to the backend: “what if I request someone else’s account?”

🖼️ Evidence:
![repeater-id-carlos](/field-manual/assets/portswigger/access-control/user-id-controlled-by-request-parameter/02-repeater-id-carlos.png)

---

### Step 3 - Inspect the response: do I get carlos’s data?

If the app is secure, I expect:

- `403 Forbidden`
- a redirect back to my own account
- an “unauthorized” message

If it is vulnerable, I get **carlos’s** account page.

That is exactly what happens here: after changing the `id`, the response contains carlos’s data, including his **API key**.

🖼️ Evidence:
![carlos-api-key](/field-manual/assets/portswigger/access-control/user-id-controlled-by-request-parameter/03-carlos-api-key.png)

---

## Exploit (action)

### Step 4 - Extract the API key and submit it

I copy the API key for **carlos** from the response and paste it into the lab submission form.

Lab solved.

---

## Impact

In a real application, this is one of those bugs that “scales by itself”, because impact depends only on what the account page exposes:

- viewing other users’ data (PII, addresses, orders),
- modifying data (if edit endpoints follow the same pattern),
- retrieving tokens / secrets / API keys,
- sometimes even account takeover (if email/password/MFA settings are exposed through the same model).

This is a **horizontal** access control issue: I’m not becoming an admin - I’m becoming _whoever I reference_.

---

## Fix (what should have existed)

1. **User identity from the session, not from a parameter**
   The backend should derive “who am I serving” from the authenticated session user, not `id` in the URL.

2. **If a parameter must exist (e.g., admin views) → strict authorization**
   Every request must check whether the current user is allowed to read `id=X`.

3. **Deny-by-default**
   If authorization fails → return `403` (not “return something anyway”).

4. **Do not expose secrets on the account page**
   An API key is sensitive. If it must be accessible:
   - show it only once at generation time, or
   - require re-authentication / MFA, or
   - display only a partial value with a controlled reveal flow.

---

## Lessons learned (portable checklist)

- If you see `?id=` on “My account” pages → test it first.
- Swap the `id` to another user and watch the behavior:
  - **403 / redirect** = good,
  - full profile for another user = IDOR.

- Do not trust the UI (“this is my account”) - trust what you can force through the request.
