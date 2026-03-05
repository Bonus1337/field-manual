---
id: osint-maps-companies-automation
title: "maps, entities, automation (workflow + mindset + cheat-sheets)"
team: red-blue
category: osint
tags: ["osint", "geoint", "maps", "companies", "metadata", "breaches", "image-forensics"]
difficulty: easy
updatedAt: "2026-03-05"
---

# OSINT - maps, entities, automation

This part is about three things that make a real difference in practice:

1. **Maps and geolocation** - how to turn a “nice photo” into a specific place and time.
2. **Entity intelligence** - company / school / real estate / vehicle: how to build a profile from a single data point.
3. **Automation** - because manually you can do 10 checks, but with tools you can do 1000 (and that’s when OSINT becomes truly scalable).

---

## 0) Guiding rule: set a hypothesis before you click

OSINT is not about “searching for anything”. The person who wins most often is the one who can:

- **form a hypothesis** (what / where / when / who),
- choose the **shortest verification path**,
- **collect evidence** (links, screenshots, timestamps, archives),
- and only then expand the tree of leads.

**Example mindset:**

> This looks like a warehouse near the S8 highway. I’ll validate the shadow (time), the weather (day), and then match the spot on the map by the road layout.

---

## 1) Search hygiene (OPSEC for OSINT)

This is not paranoia - it’s the difference between clean results and a personalized “bubble”, and between leaving traces vs. staying disciplined.

**Minimum:**

- avoid logging into accounts (Google, social media) unless you have to,
- manage “browser identities”: separate profiles / containers / a dedicated browser,
- mind your IP (network, VPN) - not for “stealth”, but for consistent results and less profiling noise,
- save sources immediately (link + timestamp + what it proves).

**Mistake #1:** doing OSINT in the same browser where you live your private and work life.

**Mistake #2:** “I’ll remember the link” - no, you won’t.

---

## 2) Searching that works: dorks as a scalpel

There are many operators, but in real work a small set wins - used well.

### Dorks that actually deliver

**Scope / domains**

- `site:example.com`
- `site:*.example.com` (subdomains)

**File types**

- `filetype:pdf` / `ext:xls` / `ext:docx` / `ext:xml` / `ext:json`

**Where to search**

- `intitle:"..."`
- `inurl:"..."`
- `intext:"..."`

**Cache**

- `cache:...` (can save you when the page is gone)

### Templates (patterns)

- “Human-facing” documents that were never meant to be public:
  - `site:example.com (filetype:pdf OR filetype:docx OR filetype:xls) (confidential OR internal OR only)`

- Open directories:
  - `site:example.com intitle:"index of"`

- Traces of passwords/secrets in content (be careful - this gets ugly fast; keep it for learning and defense):
  - `site:example.com intext:"password"`
  - `site:example.com intext:"api_key"` / `intext:"secret"` / `intext:"token"`

**Mistake #3:** one dork, “nothing found” → but you never tried variants (synonyms, languages, formats, older copies).

---

## 3) Metadata: the quiet layer that leaks too much

Metadata is often a “simple mistake”, not “advanced OSINT”.

### What you can often extract

- author/organization (Office/PDF),
- usernames / file paths,
- tool versions, creation timestamps,
- in images: camera parameters and sometimes GPS (if not stripped).

### Tools and when to use them

- **exiftool** - fast truth about a file (first thing when you get an image/PDF/document)
- **FoCA** - bulk metadata hunting in documents (especially orgs/institutions)
- **Maltego / Recon-ng** - when you want to link entities and visualize relationships

**Workflow (simple and effective):**

1. collect files (PDF/DOCX/XLS/JPG) from the domain or exposed folders,
2. run `exiftool` first to see if there’s anything worth extracting,
3. if volume is large → FoCA / automation,
4. map results into relationships (who / which tool / which names / which paths).

**Mistake #4:** “metadata is always there” - often it’s cleaned. But when it’s not, it’s gold.

---

## 4) Breaches and passwords: OSINT + risk verification

This topic is where people drift into “drama”. The right approach is cold and boring: **verification, not emotions**.

### What it’s good for (legally and realistically)

- checking whether an **account** appears in known incidents,
- assessing whether an organization has poor password hygiene,
- building awareness and defensive recommendations.

### Tools and use-cases

- **Have I Been Pwned** - quick check for an email (does it show up at all)
- **DeHashed** - deeper correlations and investigation (often paid)
- **bezpiecznedane.gov.pl** - Polish educational / informational context
- **NAMINT** - generating username/login patterns (great for identity enumeration in org contexts)

**Mindset:** a breach ≠ truth about a person. A breach is an artifact that needs confirmation via other sources.

---

## 5) GEOINT and imagery: turning a photo into coordinates

This is the most “detective” part of OSINT, but it can be structured into a clean process.

### Reverse image search - don’t rely on one engine

- Google can be weak for “less popular” images,
- **Yandex** often wins on visual matching,
- **Bing** can be strong on objects/places,
- **TinEye** is great for history/reuploads,
- for faces (only with a legitimate reason and rules) - **PimEyes**.

### Shadows + sun + weather = time and direction

If you have:

- a shadow (length/direction),
- object orientation,
- and a rough location,

then:

- **suncalc.org** and **shadowmap.org** help estimate the time (sometimes even the season),
- weather archives (Windy/IMGW/Wunderground/WeatherOnline) can confirm: “could it look like this on that day”.

### Measuring from photos

- measuring tools (photo measure) help estimate height/width/distance (e.g., “2m or 4m?”).

### Image forensics - when you suspect manipulation

- 29a / FotoForensics / InVID: compression artifacts, edits, layers, reupload traces.

**GEOINT workflow (practical):**

1. reverse image search (2-3 engines),
2. extract “anchors”: signs, language, architecture, numbers, vegetation, road layout,
3. maps + Street View (or Mapillary) to match details,
4. shadow + sun (time) + weather (confirmation),
5. document evidence (screenshots + links + timestamps).

**Mistake #5:** starting with “guess the country” instead of anchoring to details in the photo.

---

## 6) Vehicles: registries, VIN, and online traces

This is “practical OSINT”: history checks, insurance status, specs, and sometimes plate photo correlations.

**Poland - key sources:**

- vehicle history, insurance (UFG), safe bus registry (context dependent)

**Plates online:**

- plate photo aggregators (sometimes useful for “where it was seen” context)

**VIN:**

- VIN decoders → detailed specs, engine/version, equipment (great to confirm “is this really that model/year?”).

**Mindset:** a vehicle is often a bridge to a place (where it moves) or an organization (company fleet).

---

## 7) Entities: company / school / real estate

The key idea: entity OSINT usually has three layers:

1. **formal registries** (hard data),
2. **people and roles** (soft data),
3. **infrastructure and online footprint** (technical data).

### Companies

- KRS / CEIDG / REGON: baseline (who, when, where, representation)
- rejestr.io and similar aggregators: quick overviews
- LinkedIn/Goldenline: roles, departments, structure, “who owns what”
- debtor databases: financial signals (always a hint, not a verdict)

**Company workflow (recommended):**

1. registries → hard facts,
2. people → roles + connections,
3. domains/subdomains → footprint,
4. documents + metadata → processes and tools.

### Schools / universities

- institutional registries: confirm status, names, units.

### Real estate

- geoportals: parcels, layers, boundaries
- GUNB: permits and investments (great for “what’s being built where”)
- land & mortgage registers: extremely sensitive - scope, legal basis, and purpose matter.

---

## 8) Social media and cameras: “live” location and archives

Geo-tagged social content can be a goldmine, but it’s inconsistent (sometimes it’s there, sometimes it’s not). That’s why it helps to keep a toolbox list:

- Instagram / X / Snapchat / YouTube - location-based search where possible
- Mapillary - street-level imagery from users (sometimes better than Street View)
- public cameras: weather/tourism feeds
- Insecam - **red flag**: easy to cross legal/ethical lines. Treat it as awareness, not a “go do it” tool.

**Mistake #6:** “the camera shows truth” - feeds can be delayed, archived, or mislabeled.

---

## 9) Technical recon: when OSINT touches infrastructure

This is “OSINT + recon”: still open-source, but technical.

### Shodan

Use it when you want to find:

- exposed services,
- devices,
- banners, versions, ports,
- “what the internet can see”.

### Automation

- **Feroxbuster / FFuf** - web content discovery (directories/files)
- **theHarvester** - collecting emails, subdomains, hosts from multiple sources
- **crt.sh** - subdomains from certificate transparency (often gold)

### Malware / network analysis (defensive OSINT)

- VirusTotal - reputation, relationships, file/domain pivots
- Any.run - interactive sandbox (be careful with sensitive samples)
- PacketTotal - PCAP analysis
- Malpedia / MalwareBazaar - malware family context and samples

**Mindset:** even in technical OSINT, the goal is correlation: domain → subdomains → services → artifacts → people/processes.

---

## 10) Quick checklists (copy-ready)

### A) “I got one photo - I need to place it”

- [ ] reverse image (Google + Yandex + Bing)
- [ ] anchors: language, signs, architecture, vegetation, plates, brands
- [ ] maps + Street View/Mapillary
- [ ] shadow/sun (SunCalc/ShadowMap)
- [ ] historical weather (IMGW/Windy/etc.)
- [ ] documentation: screenshots + links + timestamps

### B) “I have a company - I need a profile fast”

- [ ] registries: KRS/CEIDG/REGON
- [ ] domains: search + subdomains (crt.sh)
- [ ] documents: PDF/DOCX/XLS (dorks + metadata)
- [ ] people: LinkedIn (roles + departments + connections)
- [ ] infrastructure: Shodan (exposure)

### C) “I want it fast and scalable”

- [ ] define the question and hypothesis
- [ ] pick 2-3 sources (not 20)
- [ ] automate collection (theHarvester/crt.sh/dorks + export)
- [ ] correlate results (sheet / graph / note)
- [ ] save evidence continuously

---

## 11) Common traps and how to avoid them

- **Confusing a hint with proof.**  
  In OSINT, proof is what you can verify via 2-3 independent sources.
- **Not recording your process.**  
  The Field Manual must work as a “replay guide” - write down _why_ you checked something.
- **Scope too wide.**  
  If you don’t narrow it, you’ll drown in data.
- **Falling in love with one tool.**  
  Tools are leverage. Process produces results.

---

## 12) One sentence I’m keeping

**OSINT isn’t won by the person with the most tools - it’s won by the person who turns signals into verifiable facts the fastest.**
