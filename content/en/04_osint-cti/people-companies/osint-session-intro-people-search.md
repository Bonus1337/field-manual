---
id: osint-session-intro-people-search
title: "introduction and people search"
team: red-blue
domain: osint-cti
section: people-companies
type: methodology
angle: people-search-osint-workflow
sourceTrack: osint-sekurak
tags: ["osint", "namint", "socmint", "opsec", "browser", "email", "phone", "image"]
difficulty: easy
shortDescription: "Notes from a first OSINT session organized around process fundamentals, operational hygiene, and people search, showing how to connect an investigative question with OPSEC, archiving, and a practical playbook for usernames, email addresses, phone numbers, personal data, and images."
updatedAt: "2026-02-25"
---

# OSINT - session 1: introduction and people search (my notes + reflections)

## Context of this session (what “clicked” for me)

This session started with a strong case study (a real investigation). And it sets the mindset perfectly:

**OSINT is not just “clicking through tools.”**  
It’s a process where you:

- have a **question / objective**,
- collect data,
- de-noise it,
- connect the dots,
- and in the end you can clearly say: **what I know for sure, what is a hypothesis, and what I cannot confirm**.

It sounds obvious, but in practice it’s easy to drift into “oh, cool tool, let me check one more thing” and lose an hour without a result.

---

> **Important note:** This note is **for educational purposes** and is meant to help understand the OSINT process and good analytical hygiene.  
> It is not an instruction manual for conducting activities against real people/organizations without a legal basis.  
> In practice, many OSINT techniques (especially in active mode: contacting someone, social engineering, bypassing protections, login attempts, “testing” services) can violate **laws**, **platform terms of service**, and someone’s **privacy**, and in some scenarios may be treated as unlawful activity.  
> **Use only in legal environments** (CTFs/labs, your own assets, an audit with written consent / formal authorization) and always document scope and permissions.

## 1) What OSINT is - a human definition

**OSINT = extracting information from open sources** (legally accessible; sometimes paid).  
The key word is “intelligence”: the goal is to **answer an information need**, not dump a list of links.

### Two use cases

- **Offensive:** reconnaissance for an attack vector / target profiling (CTF/pentest mindset).
- **Defensive:** handling leaks and exposure (Data Loss Prevention, reputation, incidents).

### Passive vs active (this helps me manage risk)

- **Passive:** I don’t touch the target and don’t interact (search engines, archives, indexed sources).
- **Active:** I do something that can leave traces (forms, logins, social engineering, scanning).  
  Conclusion: **active = higher responsibility + stronger operational security + clear legal boundaries**.

---

## 2) The OSINT cycle

I write it down as 5 steps because it’s easier to track where I am:

1. **Preparation**  
   objective + what I’m trying to find + operational security
2. **Collection**  
   broad, fast, wide
3. **Processing (de-noising)**  
   deduplication, structure, what is actually valuable
4. **Analysis**  
   connecting facts, avoiding cognitive traps
5. **Publication**  
   short summary + evidence + conclusions

And one thing people rarely say out loud, but it matters:

**6. Cleanup** - cleaning the environment (so I don’t leave mess and traces on my side).

---

## 3) Operational security before going into the field

My simple approach: **if I don’t handle operational security, I’m doing OSINT on credit**.

### Environment isolation (minimum)

- VM: VirtualBox / VMware
- systems for this kind of work: Kali Linux, TraceLabs OSINT VM, Ubuntu Tsurugi
- “hard” isolation options: Tails / Whonix (when you need stronger separation)

### Disk and data (because notes themselves can be sensitive)

- BitLocker / VeraCrypt / FileVault 2

### Network (because this is your fingerprint)

- DNS: 1.1.1.1 (Cloudflare), 8.8.8.8 (Google) + **DNS over HTTPS** in the browser
- VPN: e.g., Mullvad (or another solid solution)
- and in the background: awareness of “5/9/14 eyes” (intelligence-sharing alliances)

### Browser (so I don’t shoot myself in the foot)

- uBlock Origin
- Privacy Badger
- Location Guard
- Multi-Account Containers (separating contexts / accounts)

### Passwords and login

- KeePass / Bitwarden / 1Password
- 2FA: hardware key (Yubico)

**My takeaway from this session:** operational security is done before you start - later you’re only patching damage.

---

## 4) “Tool collections” and how not to drown in tools

What I liked about this session: there are a million tools, but the approach is what matters:

**method first, tool second.**

I organize it like this:

- I have a data type (email/username/phone/photo),
- I pick 2–3 starter tools,
- only then I escalate if I get stuck.

### Quick map: “where to look for a tool”

- curated OSINT lists / tool directories (huge time-savers)
- the OSINT community (GitHub, checklists, blogs)
- only at the end: “random googling”

---

## 5) People search - a practical playbook

### A) Search by username (NAMINT)

**Goal:** find where a username appears and whether it can be correlated.

Tools to click:

- whatsmyname.app
- usersearch.org

My rules:

- I check variations (dots, underscores, numbers, old handles)
- I look for “anchors”: same avatar, bio, profile links, writing style

---

### B) Search by email address

**Goal:** confirm exposure + find traces of usage.

Tools to click:

- Epieos
- GHunt
- Hunter.io
- HaveIBeenPwned
- Dehashed

My mindset:

- email is often a **key to connections**, but it’s also full of false positives
- if something looks like a match, I still try to confirm it with a second source

---

### C) Search by phone number

**Goal:** find where the number leaked (ads, profiles, signatures, registries).

My rules:

- I normalize the format (with/without country code, with/without spaces)
- I search both partial fragments and the full number

---

### D) Search by personal data

**Goal:** build an identity “skeleton”: where they work, what they do, who they’re connected to.

Places to click:

- LinkedIn (SOCMINT)
- academic databases: Google Scholar, Nauka Polska, RAD-ON
- Polish registries: KRS-online, CEIDG

My rules:

- I start from the most stable facts (company/university/city)
- I watch out for “common first name + common last name” (classic trap)

---

### E) Search by photo (reverse + metadata)

**Goal:** find the source of an image / related profiles / sometimes location context.

Tools to click:

- TinEye
- Google Images
- PimEyes (face recognition - sensitive topic; use consciously and within rules)
- ExifTool (metadata)
- FotoForensics
- InVID

My rules:

- before I run a “magic tool”, I look at the background: signs, details, context
- metadata is great, but it’s **often stripped** by social media platforms

---

## 6) Google Dorks - because sometimes this beats a dedicated tool

This is where plain “search” becomes “search precisely.”

Operators I want in my head:

- `site:`
- `filetype:` / `ext:`
- `intitle:`
- `inurl:`

Examples:

- `site:example.com filetype:pdf`
- `site:example.com intitle:"index of"`
- `site:example.com inurl:login`

---

## 7) Archiving (the biggest difference between “I looked” and “I worked”)

**I archive everything as I go**, because:

- results disappear,
- pages change,
- tomorrow you won’t remember why it mattered.

Tool/source for going back in time:

- Wayback Machine (web.archive.org)

My minimum standard for a note per finding:

- link
- date
- 1 sentence: “what this is”
- 1 sentence: “why it matters”

---

## 8) Traps (why OSINT can fool you)

The biggest landmine: **falling in love with the first lead**.

So I always write down:

- what is a fact,
- what is a hypothesis,
- what “sounds similar, but I don’t have proof.”

## 9) Tool list from the session

**VM / systems:**

- Kali Linux
- TraceLabs OSINT VM
- Ubuntu Tsurugi
- VirtualBox / VMware
- Tails / Whonix

**Windows privacy / telemetry:**

- O&O ShutUp10++
- Diagnostic Data Viewer

**Network / privacy:**

- Mullvad
- proxychains

**Browser extensions:**

- uBlock Origin
- Privacy Badger
- Location Guard
- Multi-Account Containers

**Password / 2FA:**

- KeePass / Bitwarden / 1Password
- Yubico (2FA keys)

**People search (username/email/leaks):**

- whatsmyname.app
- usersearch.org
- Epieos
- GHunt
- Hunter.io
- HaveIBeenPwned
- Dehashed

**Images / metadata / video:**

- ExifTool
- TinEye
- Google Images
- PimEyes
- FotoForensics
- InVID

**Archives:**

- Wayback Machine

---

## 10) My simple checklist

1. Write the objective in 1 sentence
2. Write down the anchors you have (email/username/phone/photo)
3. Decide passive vs active (and whether it’s allowed)
4. Pick 2–3 starter tools
5. Archive every lead immediately
6. At the end: a 5-sentence summary + what is certain/uncertain
