---
id: ps-writeup-ac-roleid-modifiable-in-profile
title: "User role can be modified in user profile"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: writeup
angle: privilege-escalation-via-role-parameter-tampering
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "privilege-escalation", "parameter-tampering"]
difficulty: apprentice
shortDescription: "A PortSwigger lab write-up showing privilege escalation through modification of the roleid field in a user profile endpoint, where the backend accepts data that a normal user should never be able to control, ultimately leading to full access to administrative functionality."
updatedAt: "2026-02-18"
---

# Lab Write-up: User role can be modified in user profile

## Goal

Delete the user **carlos**.

## What I’m actually testing here (mindset)

In this lab I’m not “hacking admin”. I’m testing whether the application **confuses the user profile with permissions**.

If a profile editing endpoint accepts JSON, I assume two bad things might be happening:

1. **Mass assignment / unsafe binding** - the backend maps fields “as-is” and also saves fields the user should never be able to touch.
2. **Trust in client-side data** - the application lets the client say “who I am” (role), instead of deriving it strictly server-side.

The hint in the description is very specific: `/admin` is only for users with `roleid = 2`.  
My goal is to check whether `roleid` can be “added in” to a profile request.

---

## Recon & discovery

### Step 1 - Log in and find the endpoint that writes the profile

I log in as `wiener:peter`, go to my account, and use the email change feature.

I look in Burp (Proxy → HTTP history) and identify the request responsible for updating the profile:

- `POST /my-account/change-email`
- `Content-Type: application/json`

This is my “hook”.

---

### Step 2 - Check whether the backend exposes `roleid` in the response

After sending a normal email change request, I inspect the response.

I’m looking for one field: **`roleid`**.

If it’s there, that’s a clear signal to me:

> If the backend returns `roleid`, it means this field exists in the user model. Now I check whether the backend will also allow me to override it.

🖼️ Evidence:
![roleid-in-response](/field-manual/assets/portswigger/access-control/roleid-modifiable-in-profile/01-roleid-in-response.png)

---

## Validation (can I overwrite it?)

### Step 3 - Send the request to Repeater and add `roleid`

In Burp I send the email change request to Repeater.

Originally the body contains only the email. I make a minimal but critical change: I add `roleid: 2`.

Example (schema):

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

This is a boundary test:

- does the endpoint validate the schema and reject extra fields,
- does the backend “swallow” the field and save it to the user.

🖼️ Evidence:
![repeater-roleid-2](/field-manual/assets/portswigger/access-control/roleid-modifiable-in-profile/02-repeater-roleid-2.png)

---

### Step 4 - Confirm the effect: the role changed to 2

After resending the request, I check the response.

In the vulnerable version of the application I will see that `roleid` has actually become `2` (either directly in the response, or by re-opening the account page).

This is the key point: **the server accepted a permissions change through a profile endpoint**.

---

## Exploit (action)

### Step 5 - Go to `/admin` and delete carlos

Since the role is now elevated, I navigate to:

- `GET /admin`

The panel loads normally. From there I use the delete function for the user `carlos`.

🖼️ Evidence:
![admin-delete-carlos](/field-manual/assets/portswigger/access-control/roleid-modifiable-in-profile/03-admin-delete-carlos.png)

---

## Impact

If this existed in a real application, the consequences are usually “serious by definition” because this is privilege escalation:

- access to administrative functions,
- user management (deletion, role changes, password resets),
- access to other users’ data.

The impact almost always affects **Integrity** and often **Confidentiality**.

---

## Fix (what should have existed)

1. **Strict request schema validation**
   The email change endpoint should accept only `email`. Any extra field → `400 Bad Request`.

2. **Deny-by-default for privileged fields**
   Fields like `roleid`, `isAdmin`, `permissions` must not be writable via profile endpoints.

3. **Permissions strictly server-side**
   The role must come from server-side data (database + session), not from a client payload.

4. **Access control on every admin endpoint**
   `GET /admin` and actions like “delete user” must have a server-side guard regardless of the interface.

---

## Lessons learned (portable checklist)

- If a profile endpoint accepts JSON → always test whether you can add fields like `role`, `roleid`, `isAdmin`.
- If the backend _returns_ a permissions field → treat it as a signal it might also _accept_ it.
- The interface and “normal profile functionality” are just the shape. What matters is what the backend saves and what it uses for authorization.
- The real bug starts when **/admin works** after that change.
