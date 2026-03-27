---
id: ps-writeup-ac-insecure-direct-object-references
title: "Insecure direct object references"
team: red
category: portswigger writeups
chapter: access-control
tags: ["idor", "information-disclosure", "static-files", "predictable-ids"]
difficulty: apprentice
shortDescription: "A concise PortSwigger lab write-up showing an IDOR issue on static files with predictable identifiers, where missing authorization on transcript downloads leads to password disclosure and account takeover of another user."
updatedAt: "2026-02-18"
---

# Lab Write-up: Insecure direct object references

## Goal

Find **carlos’s password** in the chat logs and log into his account.

---

## What I’m actually testing here (mindset)

This lab shows an IDOR in its “file-based” form:

- the application stores sensitive data directly on the server’s file system,
- exposes it via a **static URL**,
- the object identifier is **predictable** (incrementing numbers),
- and the server enforces no real authorization (“who is allowed to read this file?”).

This is the kind of bug that often looks harmless in real life:

> “It’s just chat transcripts, everyone has their own link.”

But the link is “mine” only in the UI.  
At the HTTP layer it’s simply:

- `GET /transcripts/2.txt`

If it can be guessed / enumerated, there is no access control - just a public library of files.

---

## Recon & discovery

### Step 1 - Open Live chat and generate a transcript

I go to the **Live chat** tab.

I send any message (anything, as long as it creates a transcript), then click **View transcript**.

🖼️ Evidence:
![live-chat-view-transcript](/field-manual/assets/portswigger/access-control/idor-static-transcripts/01-live-chat-view-transcript.png)

---

### Step 2 - Look at the transcript URL (this is the entire “finding”)

After opening the transcript, I look at the address.

Observation:

- transcripts are plain `.txt` files,
- the filename contains a number that looks **incremental**.

Example (schema):

```

/download-transcript/2.txt

```

or:

```

/transcripts/2.txt

```

This is the moment where I don’t need Burp or a fuzzer.
Common sense is enough:

> If the number is increasing, earlier files likely exist.

---

## Validation (can I access someone else’s file?)

### Step 3 - Replace the filename with `1.txt`

In the address bar (or in Burp Repeater) I change the filename to the simplest possible:

- `2.txt` → `1.txt`

Request (schema):

```http
GET /download-transcript/1.txt HTTP/1.1
Host: <lab-host>
```

This is classic enumeration of an object with a predictable identifier.

🖼️ Evidence:
![transcript-1-request](/field-manual/assets/portswigger/access-control/idor-static-transcripts/02-request-1-txt.png)

---

### Step 4 - Read the content and look for secrets (the password)

I open `1.txt`.

Inside is a chat transcript - and in that transcript there is a **password** (for carlos).

This is exactly the kind of leakage that kills systems in the real world:

- support shares a password,
- the user repeats it,
- and it ends up in logs exposed through a static URL.

🖼️ Evidence:
![password-in-transcript](/field-manual/assets/portswigger/access-control/idor-static-transcripts/03-password-in-transcript.png)

---

## Exploit (action)

### Step 5 - Log in as carlos

I go back to the login page and use the stolen credentials:

- `carlos:<password_from_transcript>`

Lab solved.

🖼️ Evidence:
![login-as-carlos](/field-manual/assets/portswigger/access-control/idor-static-transcripts/04-login-as-carlos.png)

---

## Impact

In a real application, the consequences are usually bigger than “I read a chat”:

- leakage of personal data,
- leakage of authentication material (passwords, tokens),
- leakage of business information (orders, complaints),
- account compromise.

It’s also a reputational problem: users assume a support conversation isn’t a publicly accessible file.

---

## Fix (what should have existed)

1. **No public static URLs for sensitive transcripts**
   Transcripts should be generated/fetched via an endpoint that:
   - checks the session,
   - checks ownership of the resource,
   - only then returns the content.

2. **Unpredictable identifiers are not enough**
   Even if `2.txt` was a GUID, it would still be true that:
   - if the link leaks → access is granted.
     The core fix is **authorization**, not “a harder filename”.

3. **Deny-by-default**
   If the user is not allowed to access a transcript → `403`.

4. **Data hygiene**
   Support and the system should not send/store passwords in chat.
   (And if it happens anyway - at least automatic masking/redaction in logs.)

---

## Lessons learned (portable checklist)

- If an app serves files like `/something/123.txt`, treat it as an IDOR invitation.
- Always test: `1`, `2`, `3`, `10`, `100` - no heavy tools needed.
- “It’s just a file” doesn’t remove the need for authorization. A file is still an object.
