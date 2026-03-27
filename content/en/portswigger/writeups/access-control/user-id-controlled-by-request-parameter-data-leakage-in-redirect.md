---
id: ps-writeup-ac-user-id-controlled-by-request-parameter-data-leakage-in-redirect
title: "User ID controlled by request parameter with data leakage in redirect"
team: red
category: portswigger writeups
chapter: access-control
tags: ["idor", "horizontal-privilege-escalation", "redirect", "information-disclosure"]
difficulty: apprentice
shortDescription: "A PortSwigger lab write-up covering an unusual IDOR variant where the application tries to hide missing authorization behind a redirect, yet still leaks another user’s sensitive data in the response body - in this case, an API key visible only at the raw HTTP level."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter with data leakage in redirect

## Goal

Obtain the **API key** for the user **carlos** and submit it as the solution.

## What I’m actually testing here (mindset)

This is still the same pattern you see in IDOR cases: the application lets me control “whose data I’m requesting” via the `id` parameter.

The difference is that here the developer **tried to cut it off** with a redirect.

And this is a very realistic failure mode:

- “If someone requests another user’s account, we’ll redirect them to the home page.”
- the UI looks safe
- but the backend still **renders sensitive data** in the response

A redirect (302/303) is not a magic eraser.  
If the server drops a secret into the response body, I will still see it in Burp.

My test is simple:

1. Replace `id` with `carlos`
2. Don’t care where the browser sends me
3. Inspect the **raw response** (status + headers + body)

---

## Recon & discovery

### Step 1 - Log in and identify the request for the account page

I log in as `wiener:peter` and open **My account**.

I pay attention to the URL - it usually looks like:

```

/my-account?id=wiener

```

I capture the request in Burp and send it to Repeater.

🖼️ Evidence:
![my-account-request](/field-manual/assets/portswigger/access-control/user-id-redirect-leak/01-my-account-request.png)

---

## Validation (what does the app do when I request someone else’s data?)

### Step 2 - Replace `id` with `carlos`

In Repeater I change only one thing:

- `id=wiener` → `id=carlos`

Request (schema):

```http
GET /my-account?id=carlos HTTP/1.1
Host: <lab-host>
Cookie: session=<...>
```

At this point I expect one of two “correct” behaviors:

- `403 Forbidden` (ideal)
- a redirect with an **empty** body (sometimes seen, still acceptable)

But something more interesting happens here.

🖼️ Evidence:
![repeater-id-carlos](/field-manual/assets/portswigger/access-control/user-id-redirect-leak/02-repeater-id-carlos.png)

---

### Step 3 - Observation: there’s a redirect, but the body leaks the secret

The response has a redirect status (for example `302 Found`) and a `Location: /` header.

So from the browser’s perspective it looks like:

> “You don’t have access, go back to the home page.”

But in Repeater I see something that should never be there:

- the response body contains carlos’s account data,
- including his **API key**.

This is the moment where UI and security completely diverge:

> The server tried to “hide” the missing authorization behind a redirect, but still rendered sensitive data in the response.

🖼️ Evidence:
![redirect-body-leaks-api-key](/field-manual/assets/portswigger/access-control/user-id-redirect-leak/03-redirect-body-leaks-api-key.png)

---

## Exploit (action)

### Step 4 - Extract the API key from the body and submit it

I copy carlos’s API key from the response body (from Repeater, not the browser UI) and paste it into the lab submission form.

Lab solved.

---

## Impact

In a real application this is dangerous twice over, because:

- the UI looks “fine” (redirect, no access),
- but secrets are still traveling at the HTTP layer.

Typical outcomes:

- leakage of other users’ data (PII),
- leakage of tokens / API keys,
- leakage of data that can be used for further escalation.

And worse: these bugs often live for a long time, because “nobody sees it” when clicking normally in the browser.

---

## Fix (what should have existed)

1. **Do not render data before authorization**
   Decide “is this allowed?” first, then build the response.

2. **On access denial → 403 with no sensitive body**
   A redirect can be a UX choice, but it must not carry data.

3. **Deny-by-default**
   If access control fails, the server should end the request without generating sensitive content.

4. **Security tests at the HTTP level, not the UI level**
   Automated tests should verify that 3xx/4xx responses do not include secrets in the body.

---

## Lessons learned (portable checklist)

- If an application redirects instead of returning `403`, always inspect the **response body**.
- Don’t judge access control by what you see in the browser - judge it by raw HTTP.
- A redirect doesn’t fix an IDOR. At best it makes the bug less obvious to normal users, but not to an attacker.
