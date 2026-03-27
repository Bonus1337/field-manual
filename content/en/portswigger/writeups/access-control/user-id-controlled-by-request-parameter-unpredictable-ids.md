---
id: ps-writeup-ac-user-id-controlled-by-request-parameter-unpredictable-ids
title: "User ID controlled by request parameter, with unpredictable user IDs"
team: red
category: portswigger writeups
chapter: access-control
tags: ["access-control", "idor", "horizontal-privilege-escalation", "parameter-tampering"]
difficulty: apprentice
shortDescription: "A PortSwigger lab write-up showing that seemingly safe, unpredictable user identifiers do not fix access control problems when the application leaks a user’s GUID in public places and the backend blindly trusts the id value supplied in the request."
updatedAt: "2026-02-18"
---

# Lab Write-up: User ID controlled by request parameter, with unpredictable user IDs

## Goal

Find the **GUID** for the user **carlos**, then extract his **API key** and submit it as the solution.

## What I’m actually testing here (mindset)

This is still **IDOR / horizontal privilege escalation** - just in the version developers often consider “safer”, because:

- instead of `id=wiener` we get random-looking GUIDs,
- so “no one can guess them”.

And that’s the point: **I don’t need to guess**.

If an application uses GUIDs as user identifiers, they still have to leak somewhere:

- in profile links,
- in comments,
- in post author sections,
- in APIs,
- in HTML/JS.

A GUID does not fix access control. At best, it only makes _blind guessing_ harder.

My test is simple:

1. **Can I obtain carlos’s GUID from a public place?**
2. **Does the backend still trust the `id` parameter and return his account / API key?**

---

## Recon & discovery

### Step 1 - Find where the application exposes a user identifier

Before I even log in, I do what an attacker would do “from the outside”:

- browse the blog / posts,
- look for the author: **carlos**.

There’s only one goal: find a link where the application itself embeds the GUID.

---

### Step 2 - Open a carlos post and click the author

I open any blog post written by **carlos**.  
Then I click his name / author profile.

Observation:

- the URL contains his user identifier in GUID form.

Example (schema):

```

/blogs?userId=55edc097-3222-41df-9819-627456e39bb4

```

I copy that GUID and save it - that’s my “key” for the next step.

🖼️ Evidence:
![carlos-guid-leak](/field-manual/assets/portswigger/access-control/user-id-guid/01-carlos-guid-leak.png)

---

## Validation (does the backend trust the parameter?)

### Step 3 - Log in and capture the “My account” request

Only now I log in as `wiener:peter` and open the account page.

I inspect the URL and requests. Usually it looks like:

```

/my-account?id=<my-guid>

```

or:

```

/my-account?id=wiener

```

But in this lab version, `id` will be a GUID.

In Burp, I capture the request to `/my-account` and send it to Repeater.

🖼️ Evidence:
![my-account-own-guid](/field-manual/assets/portswigger/access-control/user-id-guid/02-my-account-own-guid.png)

---

### Step 4 - Replace `id` with carlos’s GUID

In Repeater I make a minimal change:

- `id=<my-guid>` → `id=<carlos-guid>`

Request (schema):

```http
GET /my-account?id=<carlos-guid> HTTP/1.1
Host: <lab-host>
Cookie: session=<...>
```

This is the same test as the previous lab, just with a different identifier format:

- does the server derive “whose account” from the session,
- or does it derive it from the `id` parameter?

🖼️ Evidence:
![repeater-id-carlos-guid](/field-manual/assets/portswigger/access-control/user-id-guid/03-repeater-id-carlos-guid.png)

---

### Step 5 - Receive carlos’s data and extract the API key

If the app is vulnerable, I get carlos’s account page, including his **API key**.

And that’s exactly what happens: the backend returns someone else’s data because it treats `id` in the request as sufficient “authorization”.

🖼️ Evidence:
![carlos-api-key](/field-manual/assets/portswigger/access-control/user-id-guid/04-carlos-api-key.png)

---

## Exploit (action)

### Step 6 - Submit the API key

I copy carlos’s API key and paste it into the lab submission form.

Lab solved.

---

## Impact

In real applications, GUIDs often give a false sense of security.

The reality is:

- if the identifier can be obtained (and it almost always can),
- and the server does not enforce server-side authorization,
- you still have a standard IDOR.

The consequences depend on what’s exposed through the account:

- viewing other users’ data,
- accessing secrets (API keys, tokens),
- modifying data (if other endpoints also trust `id`),
- sometimes account takeover.

---

## Fix (what should have existed)

1. **User identity must come from the session**
   In an ideal world, `/my-account` does not need any `id` in the URL.

2. **If `id` is required (e.g., admin view) → strict authorization**
   Always: `currentUser canAccess(requestedUserId)` → otherwise `403`.

3. **Deny-by-default**
   No authorization = no data. Period.

4. **Hardening: never treat GUIDs as access control**
   A GUID is an identifier, not a security mechanism. It can slow enumeration down, but it can’t replace authorization.

---

## Lessons learned (portable checklist)

- “Unpredictable IDs” do not matter if the application publishes them in links anyway.
- If you see `?id=<guid>` on account pages → test swapping it for someone else’s GUID.
- Access control starts when the server returns `403`, not when the ID merely looks random.
