---
id: tool-burp-suite-community
title: "Burp Suite (Community) - Field Manual (workflow + mindset + cheat-sheets)"
team: general
category: tools
tags: ["burp-suite", "proxy", "repeater", "intruder", "decoder", "web-pentest"]
difficulty: easy
shortDescription: "A practical field manual for Burp Suite Community that organizes the full workflow of working with a web application - from setting scope and collecting traffic, through controlled experiments in Repeater, to mapping logic, testing hypotheses, and documenting results in a way that is useful during labs and real assessments."
updatedAt: "2026-03-03"
---

# Burp Suite (Community) - Field Manual

Burp Suite is my “command center” for web pentesting.  
Not because it’s magic - but because it lets me **see the truth about an application**:

- what actually leaves the browser,
- what actually comes back from the server,
- where the application trusts too much,
- and how behavior changes when you _gently_ touch the parameters.

This note has two goals:

1. **teach you the workflow**, not “clicking around”
2. become a base you return to before every lab/pentest.

---

## How an attacker thinks when they open Burp

Burp is not a “breaking tool”. Burp is a tool for:

- **modeling application logic** (what, where, who is allowed),
- **forcing alternative paths** (what if I change X),
- **isolating variables** (one change → one conclusion).

Three questions I keep asking myself:

1. **What is the “source of truth” here?** (cookie? token? role? header? parameter?)
2. **What does the server verify, and what does it only “assume”?**
3. **Where’s the gap between the UI and the API?** (UI blocks it, API allows it)

---

## Setup: so tests are clean and repeatable

`Proxy → Intercept → Open Browser`

**Proxy → Open Browser**  
![Proxy > Open Browser](/field-manual/assets/burp/01-proxy-open-browser.png)

---

## The foundation: Scope (so you don’t debug noise)

Scope isn’t a formality. Scope is the filter that turns Burp into a tool - not a noise machine.

**Steps:**

1. `Target → Scope → Include in scope`
2. add the host/URL
3. in `Proxy`, set it to show/intercept only “in scope”

**Target → Scope**  
![Target scope](/field-manual/assets/burp/02-target-scope.png)

**My default Scope standard:**

- include: `https://app.example.com/*`
- exclude: external CDNs, analytics, SSO login if it’s not in scope

---

## Proxy: Intercept + HTTP history (collecting the truth)

### Intercept: use it like a trigger, not a lifestyle

- **OFF**: normal browsing and collecting history
- **ON**: catch specific moments (login, checkout, upload, role change)

**Proxy → Intercept (ON/OFF)**  
![Proxy intercept](/field-manual/assets/burp/03-proxy-intercept.png)

### HTTP History: your biggest source of discoveries

Here you look for:

- state-changing requests (POST/PUT/PATCH/DELETE),
- API endpoints (`/api/...`, `/graphql`),
- “control” parameters (`id`, `role`, `file`, `redirect`, `returnUrl`, `next`, `price`, `isAdmin`),
- tokens, cookies, headers.

**Proxy → HTTP history + filters**  
![HTTP history](/field-manual/assets/burp/04-http-history.png)

**Filters that actually matter:**

- show only in-scope
- hide images/CSS/JS
- show only: 4xx/5xx (at the start)
- sort by length and watch for outliers

**Advanced Filter (expanded)**  
![HTTP filters](/field-manual/assets/burp/05-http-filters.png)

---

## Target: Site map (building the application model)

A site map is not “a list of URLs”. It’s a map of:

- modules,
- flows,
- dependencies,
- and places where logic tends to leak.

**Target → Site map**  
![Site map](/field-manual/assets/burp/06-site-map.png)

**What I mentally tag in the site map:**

- “entry points” (login/register/reset),
- “money/data” (billing, profile, orders),
- “permissions” (admin, roles, teams),
- “integrations” (S3, webhooks, import/export),
- upload/download.

---

## Repeater: the operating table (real testing happens here)

Repeater is where you learn the most, because you run **controlled experiments**.

**Rule #1: one change at a time**

- change 1 parameter → observe the difference
- change another → observe the difference
- otherwise you won’t know what caused what

**Repeater: request/response + Inspector**  
![Repeater](/field-manual/assets/burp/07-repeater.png)

### The first tests I almost always run (manually)

**Access control / IDOR**

- `GET /user/123` → `GET /user/124`
- `accountId`, `orgId`, `teamId`, `invoiceId`

**Parameter tampering**

- `price=100` → `price=1`
- `role=user` → `role=admin`
- `isAdmin=false` → `true`
- `discount=0` → `99`

**Session / permissions**

- remove the cookie and see if it still works
- swap the cookie for an old/other one
- remove the `Authorization` header
- check whether “admin” endpoints behave differently without the role

**Input handling**

- `'` / `"` / `\` / `..` / `%00` / long strings
- JSON: change types (`"1"` vs `1`), remove fields, add new fields

---

## Intruder (Community): slow, but still valuable

In Community, Intruder is slow, so treat it as:

- a **mini-fuzzer** for small ranges,
- an **enumerator** for short lists,
- a tool to learn “how to interpret results”.

**Intruder: Positions (§…§)**  
![Intruder positions](/field-manual/assets/burp/08-intruder-positions.png)

**Intruder: Results (sorted by length/status)**  
![Intruder results](/field-manual/assets/burp/09-intruder-results.png)

**How I read Intruder results (mindset):**

- status ≠ success (sometimes 200 is an error, and 302 is success)
- length ≠ truth (errors can have a fixed length)
- what matters is the “outlier” response (content, headers, timing)

---

## Decoder: translate “weird strings” into meaning

Decoder is my quick workshop for:

- URL encode/decode,
- Base64,
- hex,
- HTML entities.

**Decoder**  
![Decoder](/field-manual/assets/burp/10-decoder.png)

---

## Comparer: when “something differs, but I don’t know what”

Comparer is great for:

- blind SQL injection comparisons,
- access-control response differences,
- differences between users.

**Comparer: diff**  
![Comparer](/field-manual/assets/burp/11-comparer.png)

---

## Logger: full traffic audit (Proxy + Repeater + Intruder)

Logger shows tool-generated traffic - critical when:

- something “disappears” from history,
- you’re debugging Intruder,
- you want a clean testing timeline.

**Logger**  
![Logger](/field-manual/assets/burp/12-logger.png)

---

## Sequencer: as an exercise in token thinking

Sequencer teaches one thing: **a token must be unpredictable**.  
It’s worth doing once or twice to understand what entropy analysis looks like.

**Sequencer**  
![Sequencer](/field-manual/assets/burp/13-sequencer.png)

---

# Cheat-sheet: vulnerability → where in Burp → what to check → how to recognize it

> This is the section worth keeping open next to a lab.  
> It’s not about payloads. It’s about **hypotheses and observations**.

---

## 1) Broken Access Control (BAC) / IDOR

**Where in Burp:**

- Proxy → HTTP history (look for `id`, `userId`, `accountId`, `orgId`)
- Repeater (manual variations)
- Comparer (response diffs)

**What to check (why):**

- whether the server authorizes access to the object, or only “trusts” the ID from the UI
- whether the endpoint behaves the same for different accounts

**How to test (minimally):**

- Log in as UserA, capture a request to an object
- Change only the ID to a “neighboring” one or one from UserB
- Compare the response

**Red flags in responses:**

- `200 OK` with someone else’s data
- `302` to login… but the response body still contains data
- constant `200` + “soft error” (for example `{"error": "not allowed"}`) - the UI may hide it

**PoC artifacts:**

- request A (baseline), request B (ID changed), response diff (Comparer)

---

## 2) Parameter Tampering (price, role, discount, flags)

**Where in Burp:**

- Proxy history (POST with JSON/form-data)
- Repeater (single-field edits)
- Logger (timeline)

**What to check:**

- whether business-critical values are computed server-side or “arrive from the client”

**Common fields:**

- `price`, `quantity`, `discount`, `currency`
- `role`, `isAdmin`, `isVerified`, `tier`, `plan`

**How to recognize it:**

- cart totals change after request/response, not only in the UI
- the response echoes back the accepted value

---

## 3) SQL Injection (error-based / boolean-based / time-based)

**Where in Burp:**

- HTTP history (parameters in query/body)
- Repeater (manual variants)
- Comparer (response differences)

**What to check:**

- whether the parameter reaches a database query without proper parameterization

**How to test without “spraying”:**

- **Error-based:** insert `'` and see if you get syntax errors / 500 / a different response
- **Boolean-based:** compare `AND 1=1` vs `AND 1=2` (or equivalent) and watch for differences
- **Time-based:** compare a “normal” response vs a delayed one

**Red flags:**

- changed response length / different message
- 500 after a simple apostrophe
- clear timing differences

> Community won’t give you full automated scanning, but **manual diagnostics in Repeater** teach 10x more.

---

## 4) XSS (reflected / stored) + HTML Injection

**Where in Burp:**

- HTTP history (inputs: search, comment, profile)
- Repeater (payload variants)
- Decoder (encoding)

**What to check:**

- whether input lands in HTML/DOM without proper escaping/sanitization

**How to recognize the stage:**

- if `<b>test</b>` works → often **HTML injection / missing escaping**
- if JavaScript executes → **XSS** (reflected/stored/DOM)

**Observations matter more than payloads:**

- does the input reflect in the response?
- in what context (HTML body, attribute, JavaScript, URL)?

---

## 5) CSRF (state changes without user intent)

**Where in Burp:**

- HTTP history: POST/PUT/PATCH/DELETE
- Repeater: remove/alter tokens
- Comparer: compare responses

**What to check:**

- whether the application requires an anti-CSRF token and binds it to the session
- whether it enforces `SameSite` and/or Origin/Referer checks

**Minimal test:**

- send a state-changing request:
  - once normally
  - once without the token / with an old token
  - once without/with modified `Origin/Referer`
- verify whether the action succeeded

**Red flags:**

- action works without the token
- token is static/predictable
- server ignores Origin/Referer

---

## 6) SSRF (the server makes requests “on your behalf”)

**Where in Burp:**

- HTTP history: parameters like `url=`, `callback=`, `webhook=`, `imageUrl=`
- Repeater: test host/protocol variants
- Logger: track attempts

**What to check:**

- whether the server accepts a URL and then fetches it

**Red flags:**

- response includes parts of the fetched content
- DNS/timeout errors (also a sign the server tried)

> In SSRF labs you typically provide a controlled URL to confirm the server “hit it”.

---

## 7) File Upload (RCE / LFI / stored XSS via upload)

**Where in Burp:**

- Proxy history: `multipart/form-data`
- Repeater: modify filename/content-type/content
- Comparer: compare responses

**What to check:**

- server-side validation (not only UI)
- whether files become executable / publicly accessible
- whether naming and paths are handled safely

**Red flags:**

- server accepts “weird” extensions
- file is reachable under a predictable URL
- Content-Type is the only validation

---

## 8) Path Traversal / LFI (reading files)

**Where in Burp:**

- HTTP history: parameters like `file=`, `path=`, `download=`
- Repeater: test traversal sequences
- Decoder: encoding for `../`

**What to check:**

- whether the app concatenates file paths from parameters without normalization and control

**How to recognize it:**

- it returns files it shouldn’t
- “file not found” behavior changes depending on the path (also a signal)

---

## 9) Open Redirect (redirect-based phishing)

**Where in Burp:**

- HTTP history: `redirect`, `next`, `returnUrl`, `continue`
- Repeater: replace with an external URL

**What to check:**

- whether the app can redirect to arbitrary domains

**Red flags:**

- 302 to the supplied address with no whitelist validation

---

## 10) JWT / Session problems (if the application uses tokens)

**Where in Burp:**

- HTTP history: `Authorization: Bearer …`
- Decoder: Base64 decode header/payload
- Repeater: token variants

**What to check:**

- whether the token carries roles/permissions and the server blindly trusts them
- whether signature/algorithm checks are correct

**Red flags:**

- changing `role` in payload changes behavior without verification
- no expiry / no audience / weird headers

---

# Workflow in Burp (recon → enum → exploit → post)

## 1) Recon (understand the app)

- set scope
- click through flows
- collect history
- build a map of endpoints and parameters

**Artifacts to capture:**

- top 10 state-changing endpoints
- key cookies + tokens
- places where the UI blocks something

## 2) Enumeration (find what the server accepts)

- Repeater: manual variants
- Intruder: small lists/ranges
- Logger: confirm what was sent

**Enumerate:**

- object identifiers (IDOR)
- role/permission flags
- upload/download parameters
- filters/sort/pagination (often tamperable)

## 3) Exploitation (prove impact)

- minimal PoC (least traffic, maximum proof)
- compare responses (Comparer)
- document request/response (before it disappears)

## 4) Post-exploit (what next, within lab/scope)

- can you escalate? (read → modify)
- can you take over accounts? (reset, token, session)
- can you move laterally? (org/team)

---

# Most common mistakes (and how to avoid them)

1. **Intercept ON all the time**  
   → you suffer and you stop thinking. Use it surgically.

2. **No Scope**  
   → analysis turns into garbage.

3. **Changing 5 things at once in Repeater**  
   → you don’t know what caused what.

4. **Looking only at status codes**  
   → often content, headers, length, timing, redirects matter more.

5. **Not saving evidence**  
   → “I had a vuln but I can’t reproduce it now” is the classic.

---

# Checklist: “first 10 minutes with a new app”

- [ ] Start Burp (Temporary project)
- [ ] Open Browser / set proxy
- [ ] Target: add scope
- [ ] Proxy history: filters (in-scope, no noise)
- [ ] Click: login → logout → password reset (if present)
- [ ] Find 3 most important POST requests
- [ ] Send them to Repeater
- [ ] Change 1 parameter and compare response
- [ ] Write down: endpoints + parameters + observations

---

# Test-note template (copy/paste per case)

## [CASE] Test name / endpoint

**Goal:** (what I’m checking and why)

**Endpoint:**  
`METHOD /path`

**Baseline:**

- request: (briefly what you send)
- response: (status/length/key fields)

**Variant 1 (change 1 parameter):**

- change:
- result:
- conclusion:

**Variant 2:**

- …

**PoC (minimal proof):**

- request:
- response:

**Impact (what this gives an attacker):**

- (for example: read others’ data / modify / escalate)

**What I would test next:**

- (2–4 concrete hypotheses)

**Screenshots/artifacts:**

- `assets/.../case-xyz-01.png`
- `assets/.../case-xyz-02.png`

---

# Exercises (so Burp becomes muscle memory)

1. **Work without Intercept**  
   Browse the app for 5 minutes and do everything from history + Repeater.

2. **One change at a time**  
   Take one POST request and run 10 variants, each with one change.

3. **Hunt for IDOR**  
   Find a request with `id=` and try 3 neighboring values + compare responses in Comparer.

4. **Understand the login flow**  
   Write down which cookies/tokens change: before login vs after.

---

## One sentence I’m keeping at the end

**Burp isn’t for “spraying payloads” - it’s for understanding server-side logic and breaking the assumptions the UI tries to sell you.**
