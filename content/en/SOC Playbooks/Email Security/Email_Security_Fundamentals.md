---
id: email-threat-analysis-fundamentals
title: "Email Threat Analysis Fundamentals"
team: blue
category: email security
tags: ["email-security", "phishing", "spam", "email-headers", "soc", "social-engineering"]
difficulty: easy
shortDescription: "A practical note on email threat analysis that organizes the key elements of triage, header review, content assessment, attachment handling, and technical artifact extraction so that phishing can be distinguished from normal correspondence more quickly and useful material can be passed forward for detection and defense."
updatedAt: "2026-02-21"
---

# Email Threat Analysis Fundamentals

## Why I’m making this note

I do not want another write-up that just says “what happened in the room.”  
I want to extract the parts that will actually help me later during analysis.

This is a note I can come back to before working on a suspicious email:

- what to check,
- where the common traps are,
- which header fields are less trustworthy,
- what is worth extracting as IOC / detection material.

In short: **not theory for theory’s sake**, but a foundation for phishing and spam analysis.

---

## Why this matters (and why technology alone is not enough)

You can have decent security controls, filtering, policies, and email protection products - and it still will not be 100%.

In practice, sometimes all it takes is:

- one rushed moment,
- one bad day for a user,
- one click on a link,
- one opened attachment.

And suddenly the attacker has a foothold.

Good reminder: email security is not only “does the filter work,” but also:

- **can a user recognize a suspicious email**
- **can an analyst assess it quickly**
- **can the team respond and block follow-up emails**

---

## Spam vs phishing (simple, but practical)

### Spam

Unsolicited bulk email. Sometimes only annoying, sometimes the start of something worse.

### Phishing

Impersonating a trusted company / person / service in order to:

- steal data,
- get a click,
- deliver malware,
- trigger an action (payment, login, password reset, etc.)

What matters to me: **spam and phishing are not just “junk in the inbox.”**  
They are real entry vectors into an organization.

---

## What I need to be able to do as an analyst

If an email gets through the filters and reaches a user, my job is more than “it looks weird.”

I need to be able to:

1. **Assess the email** → malicious vs benign (or at least suspicious / needs escalation)
2. **Extract artifacts** → domains, email addresses, links, IPs, filenames, subjects, patterns
3. **Collect technical context** → where it came from, what does not match in the headers
4. **Pass useful findings forward** → so the team can:
   - block similar emails,
   - add detections / rules,
   - warn users

That is the point where “probably phishing” is no longer enough.

---

## What an email address is made of (simple foundation, still worth getting right)

An email address has:

- **mailbox / username** (the part before `@`)
- `@`
- **domain** (the part after `@`)

Example:

- `billy@johndoe.com`

Here:

- `billy` = mailbox
- `johndoe.com` = domain

### How I picture it

Domain = the street  
Mailbox = the specific house / mailbox on that street

It sounds basic, but it helps later when checking:

- whether a domain looks legitimate,
- whether someone is impersonating a brand,
- whether `Reply-To` points somewhere else.

---

## Email protocols - what is worth understanding (not just memorizing names)

### SMTP

Protocol used to **send email**.

This matters to me not because I want to recite the definition, but because the message passes through servers and that path leaves traces in headers (mainly `Received`).

### POP3

Protocol used to **download** email from a server to a client.

In practice, often:

- messages are pulled to one local device,
- access is more “single-device oriented,”
- things can get messy if mail gets removed from the server after download.

### IMAP

Protocol used to **synchronize** email between the client and server.

In practice:

- messages remain on the server,
- users can work from multiple devices,
- this is usually the more sensible setup in business environments.

### Short takeaway

For an analyst, the important thing is not the textbook wording but understanding:

- **SMTP → transport**
- **POP3/IMAP → user retrieval / access**

---

## POP3 vs IMAP (what is actually worth remembering)

### POP3 - where people often get confused

POP3 is not “bad,” but it can be inconvenient:

- emails are often downloaded to one device
- if “keep email on server” is not enabled, messages may be removed from the server
- users may see different mailbox states on different devices

### IMAP - why it usually wins

- messages stay on the server
- sync across laptop / phone / webmail
- more consistent mailbox view
- more practical in company environments

For SOC / analysis this can also matter because it affects:

- where the suspicious email may still be visible,
- whether the user sees the same thing as the admin / webmail view.

---

## How email travels from sender to recipient (and why I care)

Simplified flow:

1. Sender writes an email.
2. The client sends it to SMTP.
3. SMTP queries DNS to find where to deliver mail for the recipient’s domain.
4. The email passes through servers on the way.
5. It reaches the destination mail server.
6. It waits on POP3/IMAP.
7. The recipient downloads or syncs it.

### Why this matters in analysis

Because this path leaves a trace.  
And that trace shows up later in the headers.

This is the point where I stop looking at the email as just a “nice / suspicious-looking message” and start treating it like a **technical artifact**.

---

## Two parts of an email (I always separate them in my head)

Every email has two main layers:

### 1) Header

Metadata:

- from where,
- to whom,
- when,
- through which servers,
- what technical handling happened,
- content-related technical details.

### 2) Body

What the user sees:

- text,
- HTML,
- links,
- images,
- call-to-action,
- sometimes attachments.

### Why I split them mentally

A phishing email can look very convincing in the body and still look suspicious in the headers.

And the opposite is also true - bad grammar alone is not proof.  
You need the full picture.

---

## What I check first (quick triage before going deeper)

First I look at what is visible in the email client:

- **From**
- **Subject**
- **Date**
- **To**

This is quick screening, not a final verdict.

### What I look for at this stage

- is the sender impersonating a known company / person
- is the subject creating pressure (“urgent”, “invoice”, “suspended”, “action required”)
- is the message generic
- does it feel unnaturally urgent / important
- does the style match the claimed sender

### Important

If `From` looks good, that **proves nothing**.  
It is only the starting point.

---

## Raw email / source - this is where real analysis starts

This is one of the most important things to drill into memory:

**Do not analyze a suspicious email only by what the mail client UI shows.**

You need:

- `Show original`
- `View source`
- `Raw message`
- or the equivalent in that client

That is where you get the full picture:

- headers,
- relay path,
- content details,
- attachments,
- encoding.

At first it looks like a wall of text, but after a while you start seeing patterns.

---

# Email headers - fields that are actually worth knowing

You do not need to memorize every possible header field.  
You do need to know which ones are useful during triage.

---

## From (sender visible to the user)

Basic field, and at the same time one of the most misleading.

### What it gives you

- quick context
- a clue about who the attacker is pretending to be

### The trap

`From` can be spoofed easily.  
So I treat it as:

- a **hint**
- not **proof**

Good for triage, too weak for a final conclusion on its own.

---

## Reply-To (often overlooked, but can reveal a lot)

This is the address that receives replies when someone clicks “Reply”.

And this is a classic place for attacker tricks.

### Typical scenario

- `From`: looks legitimate
- `Reply-To`: points to a completely different address / domain

In practice:

- the user sees a trusted sender
- replies
- the conversation goes to the attacker

### My takeaway

If I do not check `Reply-To`, I leave a blind spot in my analysis.

---

## Received (the most important header chain)

If I had to choose one header family to understand best, it would be this one.

`Received` shows the path the email took through mail servers.

### How to read it

**Bottom to top.**

This is a very common beginner mistake - reading top to bottom and losing the actual sequence.

- lowest entries → closer to the origin
- highest entries → closer to your environment / recipient side

### Why it matters

This is where you can often see:

- where the message came from,
- which hosts handled it,
- whether something looks unusual,
- whether there are inconsistencies in path / timing / host naming.

### Important rule (very practical)

A lot of header content can be forged.  
I trust most what was added by:

- my mail server,
- my provider,
- infrastructure we control.

So: **not every `Received` line has the same trust level**.

---

## X-Originating-IP (if present)

This can be very useful because it may point to the original client/source IP.

### Why I care

- IP reputation
- geographic / provider context
- campaign correlation
- pivoting to further investigation

### Practical note

It will not always be present.  
If it is missing, I rely more on `Received`.

---

## Authentication-Results (and related fields)

This is where the receiving server records the outcome of its checks / evaluation.

You may also see references such as:

- `smtp.mailfrom`
- `header.from`

### Why I care

Phishing often depends on this exact mismatch:

- what the user sees looks fine,
- but the technical sender/domain details do not align.

I do not always need deep analysis of every authentication mechanism right away - but I do want to notice when things **do not line up**.

---

## Return-Path

The envelope sender / return address used for handling bounces.

### Why check it

It can add another layer of context:

- different domain than `From`
- clues about sending infrastructure
- another point for consistency checks

I do not base the entire conclusion on this field, but it often helps complete the picture.

---

## Message-ID

Identifier assigned by a mail system when the message is created.

### Why it is useful in practice

- log correlation
- comparing similar messages
- extra hints (sometimes the format / domain in the ID tells a story)

### Caution

Like many other fields, it can be forged.  
Useful as a **supporting artifact**, not a single source of truth.

---

## MIME / Content-Type / Content-Transfer-Encoding (technical layer of the content)

These fields tell you what kind of content you are dealing with:

- plain text?
- HTML?
- attachment?
- how is it encoded?

### Typical examples

- `Content-Type: text/plain`
- `Content-Type: text/html`
- `Content-Type: application/pdf`
- `Content-Disposition: attachment`
- `Content-Transfer-Encoding: base64`

### Why this matters

From an analysis perspective:

- the body may look “normal” in the UI, but the source can reveal more
- an attachment may be embedded and encoded
- HTML content can hide things the user does not immediately see

---

# Email body - where the attacker does the psychological work

This is the layer designed to get the victim to act.

The body can be:

- plain text,
- HTML,
- mixed (MIME multipart),
- with images, links, buttons, branding.

### What I check in the body

- urgency / pressure / authority
- requests to log in / pay / verify / confirm
- generic wording
- whether the style matches the claimed sender
- displayed link vs actual destination
- shortened URLs

### Important observation

“Ugly phishing” still exists, but many messages today are visually polished.  
You cannot base the analysis only on “this looks amateur.”

---

# Attachments - most damage happens when curiosity meets urgency

Attachments are a classic delivery vector:

- malware,
- loaders,
- weaponized documents,
- PDFs with malicious links / social engineering,
- archives with suspicious contents.

### What I can see in the source

- `Content-Type`
- `Content-Disposition: attachment`
- `Content-Transfer-Encoding`
- sometimes encoded content (for example base64)

### Most important operational rule

I do not open an attachment “just to check.”

First:

- metadata,
- context,
- procedure,
- safe environment (if deeper analysis is required).

A lot of mistakes do not come from lack of knowledge - they come from the reflex to “click quickly.”

---

# Phishing-related attack types (worth separating, because it affects risk assessment)

## Spam

Mass campaign, broad targeting.

## MalSpam

Spam with malicious intent (malware / credential theft / scam).

## Phishing

Impersonation of a trusted service / company / person.

## Spear phishing

Phishing tailored to a specific person or organization.

## Whaling

Spear phishing aimed at high-level individuals (CEO, CFO, etc.).

## Smishing

Phishing via text messages / mobile messaging.

## Vishing

Phishing via voice calls.

### Why this distinction matters

Because you assess risk differently for:

- a broad mass campaign sent to random users,
- versus a targeted email to a CFO with payment context.

---

# Common phishing traits (my mental checklist)

I do not treat this like a strict “must-have list” - phishing does not need every item.  
But the more boxes it checks, the more suspicious it becomes.

### Common traits

- impersonation of a trusted brand / department / person
- urgent subject (pressure, threat, deadline)
- attempt to force fast action
- generic greeting
- links that hide the real destination
- suspicious attachment pretending to be a legitimate document
- inconsistencies between `From`, `Reply-To`, `Return-Path`, domains, and `Received` path
- emotionally manipulative language instead of clear context

### Practical note

No spelling mistakes **does not mean** the email is safe.  
Attackers can write well too.

---

# Defanging - a small habit that actually protects the team

During analysis and escalation, I do not share live/active links or addresses as-is.

### Defanging examples

- `test@example.com` → `test[@]example[.]com`
- `http://example.com/login` → `hxxp[://]example[.]com/login`

### Why I do this

So nobody in:

- SOC,
- helpdesk,
- escalation email threads,
- Teams / Slack

accidentally clicks something malicious.

Small detail, very professional habit.

---

# BEC (Business Email Compromise) - a term I need to know and understand

BEC is not just a normal external phishing email.

It is a scenario where the attacker:

1. compromises a real employee email account,
2. uses it to commit fraud inside the organization.

### What they typically do

- request urgent payments
- change payment details
- ask for sensitive data
- pressure people using authority (“do this now”)

### Why this is dangerous

Because the message comes from a real internal account.  
That bypasses a lot of natural suspicion (“this came from our own person”).

This is one of those topics worth being able to explain clearly in an interview.

---

# My manual workflow for suspicious email analysis (basic version)

This is more “how I think” than a rigid SOP.

## 1) Safety first

- do not click links
- do not open attachments
- do not reply

Sounds basic, but this prevents the easiest mistakes.

## 2) Quick triage in the email client UI

I check:

- From
- Subject
- Date
- To
- overall context of the message

I look for red flags, but I do not jump to conclusions yet.

## 3) Open raw/source

Without this, the analysis is incomplete.

I check:

- `Reply-To`
- `Return-Path`
- `Received`
- `X-Originating-IP` (if present)
- fields related to server evaluation/authentication
- MIME / Content-Type

## 4) Read `Received` bottom to top

This is where it is easy to get lost.  
I look at:

- sequence,
- hosts,
- timestamps,
- inconsistencies.

## 5) Analyze content and links carefully

- no clicking
- defang the artifacts
- record IOCs

## 6) Treat attachments as potentially malicious

Start with metadata and context, then proceed only according to procedure.

## 7) Build the analysis note / outcome

Not just “phishing / not phishing,” but:

- **why**
- **which artifacts**
- **what to block / monitor**
- **signs of campaign / BEC / credential theft**

---

# Common mistakes (the ones I want to avoid)

## 1) Judging only by appearance

It is easy to fall into:

- “it looks legit”
- “the logo is correct”
- “the HTML looks professional”

That is not enough.

## 2) Trusting `From`

`From` matters, but it does not prove authenticity by itself.

## 3) Skipping `Reply-To`

And that is often where the scam starts to show.

## 4) Reading `Received` in the wrong direction

Read `Received` **bottom to top**.

## 5) Clicking “just to check”

That is not analysis. That is risk.

## 6) Sharing active links without defanging

Small mistake, but it can create a real problem for someone else on the team.

## 7) Building a conclusion from a single indicator

One header field can be misleading.  
What matters is the **consistency of the overall picture**.

---

# What I want to remember from this material

- Email = **header + body**
- The most useful technical evidence is usually in the **headers**
- `From` can be spoofed - do not treat it as proof
- `Reply-To` often reveals attacker intent
- `Received` is key and should be read **bottom to top**
- Defang links / domains / addresses before sharing them
- BEC = compromised internal email account used for fraud inside the company
- The goal of analysis is not only to “spot phishing,” but also to **extract artifacts and improve defenses**
