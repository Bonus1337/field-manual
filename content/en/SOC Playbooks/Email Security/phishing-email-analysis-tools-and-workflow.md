---
id: phishing-email-analysis-tools-and-workflow
title: "Phishing Email Analysis - Tools & Workflow"
team: blue
category: email security
tags: ["phishing", "email-analysis", "osint", "soc", "malware-sandbox", "ioc", "triage"]
difficulty: easy
updatedAt: "2026-02-23"
---

# Phishing Email Analysis - Tools & Workflow

## Why I keep this note

This note is a practical extension of my two previous materials:

- **Email Threat Analysis Fundamentals** (technical foundation: header/body, raw source, headers, artifacts)
- **Phishing Email Analysis Guidelines** (mindset, triage, red flags, decision-making under pressure)

Here I focus on the third piece:

**which tools to use and what workflow to follow when I need to actually analyze a suspicious email.**

This is not a “100 tools for everything” list.  
It is a working map of:

- what I collect
- what I use to verify it
- what I avoid doing too quickly
- how I move from an email to useful IOCs / actionable material for the team

---

## The most important operational rule (before I touch anything)

I work with **real samples**, so I treat everything as potentially malicious:

- domains
- links
- IPs
- attachments
- HTML content
- archive files

### My default mode:

- **I do not click links**
- **I do not open attachments**
- **I do not visit domains from the email directly**
- first I collect data and use intermediate tools / sandboxes / reputation checks

This rule sounds obvious, but this is exactly where the classic mistake happens:
“I’ll just quickly check it.”

---

## What I want to achieve as an analyst (analysis goal)

When I receive a suspicious email, my goal is not just to say:

> this looks like phishing

That is not enough.

My goal is to:

1. **assess risk**
2. **extract artifacts (IOCs)**
3. **collect technical context**
4. **deliver the result in a way the team can act on** (blocking, detections, user warnings)

So the goal is:
**not just a verdict, but operationally useful output.**

---

# What I collect from an email (analyst checklist)

## 1) From email headers

This is the minimum I want to collect:

- **sender email address**
- **sender IP address** (if it can be determined from headers)
- **reverse lookup / reverse DNS** for the sender IP
- **subject**
- **recipient address** (important info may also appear in `CC` / `BCC`)
- **Reply-To** (if present)
- **date/time**

### Why this matters

Because some of this information:

- is visible in the email client
- but some of it only becomes available in **raw/source**

And that is often where inconsistencies show up that are invisible in the UI.

---

## 2) From the email body and attachments

This is the second set of things I collect:

- **all URLs**
- if a URL shortener was used -> **the real / expanded URL**
- **attachment filename**
- **attachment hash** (preferably **SHA256**, MD5 only as a secondary reference)

### Important

It is easy to make an operational mistake with links and attachments.

That is why:

- I copy / extract links without clicking
- I save attachments carefully and analyze them further following procedure
- I do not “run it just to see what it is”

---

# Where I find what (email client UI vs raw/source)

Some data can be collected visually from an email client / webmail:

- `From`
- `Subject`
- `Date`
- some recipients
- body / CTA / visible links
- attachment presence

But some data usually requires **raw/source**:

- message path (`Received`)
- possible source IP address
- `Reply-To`
- `Return-Path`
- technical content / attachment metadata

### Practical takeaway

Email client UI = quick triage  
Raw/source = actual technical analysis

(I describe the technical basics and header meaning in **Email Threat Analysis Fundamentals**.)

---

# Tools for email header analysis

These tools help me read headers faster and spot things that are easy to miss in raw text.

## 1) Google Admin Toolbox - Messageheader

**Use case:**

- SMTP header analysis
- understanding message routing
- identifying routing / server issues

**How I use it:**

- copy the full header from raw/source
- paste it into the tool
- review hops, path, addresses, inconsistencies

**Plus:**
A fast starting point with a readable presentation.

---

## 2) Message Header Analyzer

An alternative / second source for header analysis.

### Why I like having more than one tool

Because different tools:

- present data differently
- sometimes highlight specific fields better
- sometimes reveal details another tool makes easy to miss

---

## 3) mailheader.org

Another useful helper for header analysis.

### My conclusion

I do not get attached to one specific tool.

What matters more is:

- what I can interpret correctly
- not whether I used the “most popular” tool

---

## Small context note: MTA / MUA (worth knowing)

I do not need to turn this into an academic definition, but it is useful to know:

- **MTA (Message Transfer Agent)** -> transfers email between servers
- **MUA (Mail User Agent)** -> the email client used by the user

### Why this helps

It improves my understanding of:

- where header traces come from
- what belongs to transport
- what belongs to the user/client layer

---

# Tools for IP analysis and sender context

After identifying an IP address (if available / meaningful), I want quick context.

## 1) IPinfo

**Why I use it:**

- basic IP context
- operator / ASN
- geolocation (approximate)
- fast pivot for further assessment

### Practical note

Geolocation is a clue, not a verdict.  
It helps build context, but it does not replace full analysis.

---

## 2) Talos Reputation Center

**Why I use it:**

- quick reputation lookup for IPs / domains
- extra signal showing whether something already has known bad context

This is especially useful when I need to quickly filter obvious cases.

---

# Tools for safer link analysis (without clicking blind)

This is a critical step because the link is often the main payload.

## 1) urlscan.io

This is one of the most practical tools in this workflow.

### What it gives me

- automated browsing of a submitted URL
- recorded page activity
- domains / IPs contacted during loading
- requested resources (JavaScript, CSS, etc.)
- page screenshot
- additional artifacts and observations

### Why it is so useful

Because I can see:

- what the page looks like
- whether it imitates a known brand
- what infrastructure it contacts
- **without directly visiting it from my own environment**

It is a very practical way to reduce risk and still gain context.

---

## 2) Other tools of this type (screenshot/render services)

It is worth knowing there are other services that provide page previews / rendering without direct interaction.

### Takeaway

The point is not loyalty to one product.  
The point is the workflow:

**safe preview and context first, decision later.**

---

## 3) URL / root domain reputation

After extracting a URL, I do not only look at the full link.

### I also check:

- **root domain**
- domain reputation
- related signals

This matters because campaigns often use:

- multiple paths
- redirects
- different URLs on the same domain

---

# How I extract links from emails (without manually digging through everything)

Links can be found manually:

- from HTML email content
- from raw/source
- by copying the link address (without clicking)

But for longer emails / HTML, tools are faster and safer.

## 1) URL Extractor

A practical tool for extracting URLs from pasted content / source.

### How I use it

- paste raw header / raw email content
- let the tool extract URLs
- review the output and note root domains

This saves time and reduces the chance that I miss something.

---

## 2) CyberChef (Extract URLs)

A very good choice if I am already working in CyberChef.

### Why I like it

- fast recipe
- can be combined with other transformations
- useful when I need more text processing in the same workflow

---

## Tip worth remembering

When extracting links, I note not only the “full URL”, but also:

- **root domain**
- possible URL shorteners
- repeating path patterns

This helps later with:

- reputation checks
- campaign correlation
- detection / blocking rules

---

# Attachments - how I handle them safely and sensibly

If the email has an attachment, the payload is often there.

## What I do first

- save the file **without opening it**
- note the filename
- calculate a hash (preferably SHA256)

### Example (Linux)

```bash
sha256sum suspicious_attachment.doc
```

A hash gives me a lot, because I can:

- check file reputation
- search for known malware
- pivot on the same file across systems / tools

---

# File reputation (hash lookup)

## 1) Talos File Reputation

A quick lookup for file hashes.

### Why I use it

- check whether the file is already known
- get an extra reputation signal
- validate quickly without running the file

---

## 2) VirusTotal

One of the core reference points for files and URLs.

### Why I use it

- hash lookups
- reputation / detections
- additional context about a file / URL
- quick view across multiple vendors

### Important practical note

No detections ≠ safe file.
It is only one part of the assessment.

---

## 3) ReversingLabs (worth knowing)

Another reputation / analysis service worth keeping in mind.

---

# Malware sandboxes - when I want to understand what the file actually does

I do not need to be a reverse engineer to get a lot of value from a malicious attachment analysis.

That is exactly what sandboxes are for.

## What I can gain from a sandbox

For example:

- which URLs / domains the file communicates with
- whether it downloads additional payloads
- what actions it performs on the system
- persistence mechanisms
- IOCs for further detection
- overall behavioral picture of the sample

This is huge operational value, even without deep reverse engineering.

---

## Sandbox examples worth knowing

## 1) Any.Run

Very practical for dynamic analysis and behavior observation.

### What is strong here

- interactive analysis
- fast visibility into activity
- readable artifacts and behavioral output

---

## 2) Hybrid Analysis

A solid community tool for analyzing unknown / suspicious files.

---

## 3) Joe Sandbox

A strong platform with a wide range of analysis features.

---

## Important operational note (about uploads)

Before uploading a file to an external service, I check my organization’s policy.

Not every file can be legally / procedurally sent outside the company.

---

# PhishTool - a tool that ties many things together in one place

This is a very interesting tool because it helps not only to “view an email” but to run a more structured phishing analysis workflow in one place.

## What it provides (practically)

It combines, among other things:

- email metadata
- OSINT / context
- auto-analysis pathways
- phishing-related artifacts
- integrations with tools (e.g., VirusTotal)
- workflow for flagging and resolving a case

### Who it makes sense for

- SOC analysts
- threat intelligence analysts
- phishing response teams
- email-borne fraud investigations

Exactly the environments where speed and repeatability matter.

---

## What it can conveniently extract

Based on the described / example workflow:

- sender
- recipient(s) / CC lists
- timestamp
- originating IP + reverse DNS
- SMTP hops / relays
- selected X-headers
- email body (text / HTML)
- URLs
- attachments + filenames + hashes

This is very convenient because it reduces manual jumping between several tools at the beginning of analysis.

---

## Additional value

If I integrate VirusTotal (API key), I can get faster reputation feedback for attachments / artifacts.

Plus:

- flagging artifacts as malicious
- notes
- case resolution / classification (similar to SOC workflows)

This is already much more operational than manually dissecting emails every time.

---

## Important practical insight

Even if a tool provides a lot of automation, the analyst still has to think.

Just because a tool:

- showed a hash
- extracted a URL
- added a reputation result

does not mean the analysis is complete.

Often I still need to do:

- root domain assessment
- broader IP / domain context checks
- attachment analysis in a sandbox
- campaign / case classification decisions

---

# My practical workflow (tools + decisions)

This is not a rigid SOP. It is a working flow that gives me a solid structure.

## 1. Secure the analysis first (operational safety first)

- I do not click
- I do not open attachments
- I work on a copy / source
- I defang artifacts before sharing them further

---

## 2. Collect baseline data from UI + raw/source

I collect:

- sender
- subject
- recipient(s)
- date/time
- reply-to (if present)
- sender IP / traces in headers
- body / CTA
- attachment info

---

## 3. Push the header into analysis tools

For example, I use:

- Messageheader (Google)
- Message Header Analyzer
- mailheader.org

Goal:

- see the route faster
- spot inconsistencies
- organize header data

---

## 4. Extract links and assess root domains

- manually + URL Extractor / CyberChef
- note full URLs and root domains
- check reputation / context
- use safe tools like urlscan instead of visiting directly

---

## 5. Handle attachments safely

- save file without opening
- note filename
- compute SHA256 hash
- check reputation (VT / Talos, etc.)
- if needed: sandbox analysis (according to policy)

---

## 6. Build the analysis result for team action

In the final write-up I do not only record “malicious / suspicious / benign”, but also:

- **why**
- **which IOCs**
- **which artifacts should be blocked / monitored**
- **whether it looks like a campaign**
- **what still needs additional analysis**

This is the point where my analysis starts being truly useful to others.

---

# SOC L1 scenario - how I think about this task

A very realistic case:

> Several coworkers forward suspicious emails.
> Your job as an L1 analyst is to collect details so the team can implement rules and reduce further spam/phishing delivery.

This is a good reminder that the L1 role is not only “escalate everything”.

It is also about:

- quick triage
- solid artifact collection
- clear documentation
- preparing useful material for further defense

And that is exactly why this workflow (header → links → attachment → reputation → sandbox → IOC) matters so much.

---

# What is worth remembering from this material

- Visual-only analysis is not enough - I need tools and a process.
- No single tool shows everything; it is worth having multiple options.
- I analyze links safely (without clicking directly).
- Root domain matters, not just the full URL.
- I treat attachments as potential payloads and start with hashes / reputation.
- Sandboxes provide huge value even without malware reverse engineering skills.
- Automation (e.g., PhishTool) helps, but does not replace analyst thinking.
- The goal is not only to detect phishing - the goal is to **extract useful artifacts and support defense**.

---

# Tools worth knowing (shout-out / additional sources)

Besides the tools in this note, it is also worth knowing:

- MXToolbox
- PhishTank
- Spamhaus
- `eml_analyzer` (GitHub)

I do not need to use everything at once.
What matters more is building my own repeatable workflow that produces useful results.

---

## My mental shortcut for this note

**Email → Header → Links → Attachment → Reputation → Sandbox → IOC → Conclusion**

And I keep one rule in mind the whole time:

**safe analysis first, interaction later (if at all).**
