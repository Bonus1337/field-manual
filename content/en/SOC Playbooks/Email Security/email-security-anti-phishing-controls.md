---
id: email-security-anti-phishing-controls
title: "Email security controls and phishing - how it works in practice"
team: blue
category: email security
tags: ["phishing", "email-security", "spf", "dmarc", "smime", "smtp", "soc", "triage"]
difficulty: medium
shortDescription: "A practical note that organizes the key email security controls against phishing - from SPF, DKIM, DMARC, and S/MIME, through header and message analysis, to filters, secure email gateways, sandboxes, and the user as the final decision layer."
updatedAt: "2026-02-25"
---

# Email security controls and phishing - how it works in practice

## Why I’m making this note

The longer I spend learning phishing, the more I keep seeing one thing:

**phishing does not work because people are “stupid.”**  
Phishing works because it is:

- fast,
- cheap,
- scalable,
- and it hits exactly where people operate under pressure.

You can have solid protections, policies, and processes, and still one email can get through to someone on a day when they:

- are tired,
- are juggling 10 things at once,
- have seen a similar message before,
- or simply trust what they see in their inbox.

That’s why this note is not just “dry theory about DNS records” for me.

This is a note about:

- **what actually protects against phishing,**
- **what these mechanisms do and what they do not do,**
- and **how to think while analyzing a message**, so I do not stop at just “SPF pass / fail”.

---

## What I want to understand here (for real)

I want to understand 3 things at the same time:

1. **How email authentication works**  
   (SPF, DKIM, DMARC, S/MIME)

2. **What you can actually see in traffic and headers**  
   (SMTP, headers, content, attachments)

3. **How organizations try to reduce phishing effectiveness**  
   (filters, gateways, sandboxes, training, reporting)

Because only when these 3 layers come together does it really make sense.

---

## My mental model of phishing (more important than the definition)

To me, phishing is not just a “fake email”.

It is a **trust-based entry vector**.

The attacker does not need to exploit a system immediately.  
Often, it is enough if they:

- steal credentials,
- get someone to click,
- move the conversation to another channel,
- build credibility for the next stage.

And that is why just asking “is this spam?” is not enough.  
You need to understand the **intent of the message**.

---

# SPF - who is even allowed to send from this domain

## How I understand it

SPF is like an initial checkpoint to me:

**should the server that sent this email even be allowed to send on behalf of this domain?**

It does not tell me the email is legitimate yet.  
It only tells me whether **the sending server appears authorized** (or not).

And that distinction matters, because it is easy to fall into the trap of:

- “SPF pass = everything is fine”
- which is not true.

---

## What SPF does in practice

The receiving server:

1. takes the sender’s domain (technically this depends on the field context),
2. checks the SPF record in DNS,
3. compares the sending server IP with what is allowed,
4. decides whether to accept, flag, or reject.

So SPF is closer to answering:

**“Is this server allowed to send?”**  
not  
**“Is this message safe?”**

---

## Example SPF record (and how I look at it)

```txt
v=spf1 ip4:127.0.0.1 include:_spf.google.com -all
```

What I take from it:

- `v=spf1` → this is SPF
- `ip4:127.0.0.1` → this specific address can send
- `include:_spf.google.com` → trust is also delegated to another provider
- `-all` → treat everything else as unauthorized

In practice, the record often does not show IP addresses directly “in your face” - it references other domains (`include`), and the actual addresses are buried in those chained records.

---

## What `SPF softfail` means to me

This is exactly the kind of result that teaches humility.

`softfail` is not:

- “definitely safe”,
- or “definitely phishing”.

It is more like:
**“Something does not line up with sender authorization, but the system is not cutting it off hard yet.”**

That means:

- the message may still be delivered,
- but it should trigger a warning in your head,
- and you need to continue the analysis (DKIM, DMARC, headers, links, context).

---

## The most important thing about SPF (so I do not fool myself)

SPF is useful, but it is not enough on its own.

Why?

- it does not protect message content,
- it can break on forwarding,
- it does not solve lookalike domain spoofing (for example, a similar domain instead of the real one).

To me, SPF is a **signal**, not a verdict.

---

# DKIM - was the message signed and did anyone tamper with it on the way

## How I feel about it in practice

If SPF says:
**“was this server allowed to send?”**,
then DKIM says:
**“does this message look like it was signed by that domain, and does the signature match?”**

That gives much stronger context, because now we are dealing with **integrity** and **signature authenticity**.

---

## What happens under the hood

- the sending server signs the message with a private key,
- a DKIM signature appears in the headers,
- the receiving server fetches the public key from DNS,
- and verifies the signature.

If the signature matches:

- the message appears authentic from a DKIM perspective.

If not:

- something is wrong (attack, misconfiguration, modification in transit, forwarding, etc.).

---

## Example DKIM record

```txt
v=DKIM1; k=rsa; p=<public_key>
```

What I want to remember:

- DKIM also lives in DNS,
- it relies on public key cryptography,
- records can look different depending on the provider.

---

## `dkim=permerror` - and why I do not want to jump to conclusions

This is a great example of where it is easy to over-interpret.

When I see `dkim=permerror`, I **do not assume an attack immediately**.
First, I think:

- is the domain’s DKIM misconfigured?
- is the selector wrong?
- is the DNS key missing?
- did something in transit modify the message and break the signature?

Only then do I add context:

- who the sender is,
- what the content says,
- whether there is pressure / a link / an attachment,
- what DMARC shows.

This is exactly the moment where an analyst cannot be just a “status parser”.

---

# DMARC - policy and consistency across all of this

## Why DMARC makes sense

DMARC is where I start to feel real domain control begins.

Because SPF and DKIM can each show something on their own, but DMARC says:

**“Check whether all of this is consistent with the domain the user sees - and tell the receiver what to do if it is not.”**

And that is key, because the user looks at:

- the sender name,
- the domain in `From`,
  not DNS records.

---

## What DMARC adds in practice

DMARC:

- uses SPF and DKIM results,
- checks **alignment** (domain consistency),
- sets a policy:
  - monitor,
  - send to spam/quarantine,
  - reject.

So this is no longer just “diagnostics” - it is also an **action policy**.

---

## Example DMARC record

```txt
v=DMARC1; p=quarantine; rua=mailto:postmaster@website.com
```

How I read it:

- `v=DMARC1` → DMARC record
- `p=quarantine` → if checks fail, treat it as suspicious (for example, spam)
- `rua=mailto:...` → send aggregate reports (great for monitoring and improving configuration)

---

## What `p=reject` gives you (and what it does not)

`p=reject` is a strong step and a very good direction for a mature domain.

But I still keep in mind:

- it will not stop phishing from a **similar-looking** domain,
- it will not stop an email sent from a **compromised legitimate account**,
- it will not replace content analysis or user behavior.

So again:
**great control, but not a magic shield.**

---

# S/MIME - when email should be not only “authentic” but also trusted and confidential

## How I look at it

S/MIME is no longer just “does the domain have email records”.

This is a higher level of security maturity in communication:

- digital signatures,
- encryption,
- certificates,
- key management.

It sounds beautiful - and technically, it is very strong.

---

## What S/MIME gives you (real value)

### Digital signature

It gives:

- sender identity confirmation,
- message integrity,
- an element of non-repudiation.

### Encryption

It gives:

- content confidentiality (only the intended recipient can read it).

In practice:

- great for formal / sensitive communication,
- but it requires process, certificates, and organizational discipline.

---

## A reality check

S/MIME does not solve phishing as a whole.

It can help a lot, but:

- not every organization will implement it well,
- users can still click a bad link,
- attackers can still win through social engineering.

So it is a strong layer, but still just one part of a larger picture.

---

# SMTP + headers + content - this is where the real analysis begins

## Why this part matters most to me

Because this is where theory like:

- “SPF is this…”
- “DKIM is that…”

ends, and the real question begins:

**What actually happened with this specific message?**

And that is exactly why analyzing:

- SMTP traffic (for example, in a PCAP),
- headers,
- content,
- attachments

is so important.

Because the system could have:

- let something through,
- flagged it,
- classified it incorrectly,

and you need to understand **why**.

---

## What I check in SMTP (analytical thinking, not just filtering)

I look at:

- who is talking to whom (IP → IP),
- what the session looks like,
- whether server responses indicate acceptance/rejection,
- whether the sender is testing many addresses,
- whether it looks like normal delivery or more like “spray and pray”.

I care not only about the status, but also the **behavior**.

---

## What I check in headers and content (IMF / MIME)

Here I always look for consistency, not a single red flag.

### Identity and routing

- `From`
- `Reply-To`
- `Return-Path`
- `Received`
- `Message-ID`

### Authentication

- `Authentication-Results`
- SPF / DKIM / DMARC
- alignment

### Content and social engineering

- urgency / time pressure
- forced action
- request to log in / pay / change data
- unusual tone

### Links and attachments

- whether the link text matches the real URL
- where the link actually goes
- attachment type
- whether the attachment makes business sense

---

## The most important rule I want to drill into my head

**I do not analyze an email by how it looks. I analyze it by how consistent it is.**

Because phishing often looks “normal” today.
What usually gives it away is:

- technical inconsistency,
- process inconsistency,
- intent inconsistency.

---

# Technical anti-phishing controls - what helps, and where the limits are

## Email filtering

Foundational. Necessary. Without it, inboxes drown.

But a filter is not an oracle.
It works on:

- reputation,
- rules,
- heuristics,
- signatures.

And there is always a trade-off:

- too many blocks = false positives and business frustration,
- too few blocks = more junk in the inbox.

---

## Secure Email Gateway (SEG)

This is the layer that often makes the difference with better campaigns:

- impersonation,
- spoofing,
- suspicious patterns,
- more advanced analysis.

To me: **not “just another filter,” but often a key control point.**

---

## Link rewriting

Very important in practice, because attackers often play with timing.

A link can be:

- harmless at delivery time,
- malicious a few hours later.

Link rewriting gives you a chance to:

- inspect the link at click time,
- block it later,
- monitor behavior.

This is a great example of a control that responds to real attacker tactics.

---

## Sandboxing

One of those things that sounds “enterprise”, but does real work.

Instead of guessing:

- “is this attachment malicious?”,
- “does this link drop something?”,

you put it into an isolated environment and observe behavior.

That often gives you an answer that headers alone cannot.

---

# The user is still at the center (and that is not a cliché)

This is the strongest conclusion I take away from the whole topic.

You can have:

- SPF,
- DKIM,
- DMARC,
- gateways,
- sandboxes,
- warning banners,

and still, in the end, someone makes the decision to:

- click / not click,
- reply / not reply,
- report / ignore.

And that is why things like:

- visible warnings,
- a simple “report phishing” button,
- meaningful training,
- phishing simulation exercises,

matter so much.

Not because “people are the problem,”
but because **people are the final decision layer**.

---

# How I want to approach phishing triage (my thinking checklist)

Instead of asking only:
**“is this phishing?”**

I prefer asking:

## 1. What is this message trying to achieve?

- steal data?
- force a click?
- trigger a payment?
- start a BEC-style conversation?

## 2. Is the sender identity technically consistent?

- From / Reply-To / Return-Path
- SPF / DKIM / DMARC
- alignment

## 3. Is the content business-consistent?

- does this email make sense for this person?
- is the tone and request normal?
- is the timing suspicious?

## 4. Are there artifacts for further analysis?

- domains / URLs
- attachments
- IPs
- headers
- delivery path (`Received`)

## 5. What should I do operationally?

- mark / escalate / block / inform the user
- check whether others received it too
- add indicators of compromise to detections / blocks

This helps me think like an analyst, not just a “header reader”.

---

# Common thinking traps (that I want to avoid)

## “SPF pass, so it is legitimate”

No. That is only one piece of the puzzle.

## “DKIM fail, so it is an attack”

Not always. Misconfiguration exists too.

## “DMARC reject solves the problem”

It does not solve compromised legitimate accounts or lookalike domains.

## “It landed in the inbox, so it is probably okay”

Unfortunately not. Some campaigns are designed specifically to get through part of the protection stack.

---

# What I am taking away from this (most important)

After this material, the biggest takeaways for me are:

1. **Email security is not one mechanism - it is layers**
   - SPF
   - DKIM
   - DMARC
   - S/MIME
   - filters / gateways / sandboxes
   - user awareness

2. **Headers and status results are the start, not the end of the analysis**
   - the result must be interpreted in context

3. **Phishing is a technical-and-human problem**
   - technology reduces risk
   - people still make the final decision

4. **A good analyst looks for consistency, not a single red flag**
   - technical
   - business
   - behavioral

---

## Quick phrases to remember (plain English)

- **SPF** - “was this server even allowed to send?”
- **DKIM** - “was the message signed and not tampered with?”
- **DMARC** - “does this align with the sender domain, and what should happen if it does not?”
- **S/MIME** - “signature + encryption at the message level”
- **SMTP analysis** - “what did the servers actually do with the email?”
- **Header/IMF analysis** - “what does the email say technically, not just visually?”
- **Anti-phishing stack** - “technology helps, but a human still makes the final decision”
