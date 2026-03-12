---
id: osint-technical-ai-opsec-darkweb
title: "OSINT - technical recon, AI, debunking, OPSEC, and an intro to the dark web"
team: red-blue
category: osint
tags: ["osint", "ai", "opsec", "darkweb", "canarytokens", "theharvester", "feroxbuster"]
difficulty: easy
updatedAt: "2026-03-12"
---

# OSINT - technical recon, AI, debunking, OPSEC, and an intro to the dark web

This note is not meant to be a catalog of links.
It is meant to work as a **working knowledge base** and a **map of how to think** that I can come back to whenever I want to:

- enter a topic quickly,
- avoid getting lost in tools,
- connect technical recon with analysis,
- use AI in a sensible way,
- and not forget that during the entire research process I am also leaving traces behind.

This is not a topic about “clicking through tools.”
This is a topic about **building a picture of reality out of incomplete data**.

And that means one thing:

**having access to information alone means nothing - the real advantage comes from being able to judge what is actually valuable, what is noise, and what is a trap.**

---

## How I look at this chapter

For me, this is not just OSINT.
It is where several worlds intersect:

- technical reconnaissance,
- source and relationship analysis,
- AI as support and at the same time a source of fakes,
- my own operational security,
- document, photo, and data hygiene,
- awareness that not everything I see is real,
- and awareness that not everything I publish is as harmless as it looks.

The best way to structure this in your head is in five layers:

1. **technical recon** - what is visible from the outside,
2. **pivoting and correlation** - how to connect traces,
3. **AI and credibility validation** - what might be synthetic,
4. **OPSEC** - what I am exposing myself,
5. **operational hygiene** - how not to leak through a document, a photo, or my own convenience.

---

# 1) Technical recon - first see the surface, then build a theory

The first mistake beginners make is very simple:
they want to “find something interesting” too quickly instead of first understanding **what they are actually looking at**.

At this stage, it is not yet about the vulnerability.
It is about building a **map of exposure**.

So I do not immediately ask:

- “can this be hacked?”

First I ask:

- what exists here at all,
- what is exposed,
- what the surface looks like,
- what reveals the architecture,
- what reveals the people,
- what reveals the process,
- and what may give me the next pivot.

## Sources that are genuinely worth keeping in mind

- **Shodan** - quick view of services, banners, and exposure
- **Censys** - hosts, certificates, services, infrastructure
- **ZoomEye** - an alternative perspective on exposure
- **Criminal IP** - technology, surface exposure, contextual signals
- **urlscan.io** - relationships between domain, frontend, assets, and requests
- **crt.sh** - certificate history, old subdomains, naming conventions
- **theHarvester** - e-mails, hosts, and traces from public sources
- **FeroxBuster** - enumeration of directories, endpoints, and web resources

## How I structure it mentally

Not as a list of tools.
As a list of questions.

### A. What is exposed?

- IPs
- domains
- subdomains
- certificates
- services
- banners
- technology fingerprinting

### B. What reveals the architecture?

- hostnames
- wildcard certificates
- assets loaded by the frontend
- dependencies on CDNs, storage, and external services
- endpoints suggesting test / dev / stage environments
- old panels and “forgotten” resources

### C. What reveals people and process?

- e-mail addresses
- naming schemes
- working environments
- historical subdomains
- third-party solutions connected to the organization
- publishing and configuration patterns

### D. What gives me a pivot?

- domain -> certificate -> subdomains
- domain -> e-mail -> profile / leak / login pattern
- host -> fingerprint -> similar instances
- URL -> assets -> repo / bucket / panel
- screenshot / scan -> technology -> other traces

## The most important thing to remember

**Recon is not about “finding the answer.” Recon is about finding the next meaningful question.**

---

# 2) Tools matter, but what matters even more is why you are using them

## FeroxBuster

FeroxBuster becomes useful when you stop guessing and start checking what actually exists.

It helps uncover:

- hidden directories,
- old endpoints,
- backups,
- panels,
- deployment leftovers,
- resources that only become visible when you hit the right name.

This is not “a tool for miracles.”
It is a tool for reducing invisibility.

## theHarvester

theHarvester is useful when you want to build an information layer around a domain:

- e-mail addresses,
- hosts,
- subdomains,
- public traces from search engines and other sources.

The biggest value of this kind of tool is not in the raw output itself.
It is in what you can do **next** with that output.

## crt.sh

crt.sh very often gives more than people expect.

It can reveal:

- old subdomains,
- forgotten environments,
- naming conventions,
- relationships between services,
- fragments of an organization’s history recorded in certificates.

This is a perfect example of a place that does not look “sexy,” but gives very practical traces.

## urlscan.io

I like urlscan.io because it shows an application not as a landing page, but as a **living organism**:

- what it loads,
- what it talks to,
- where it pulls assets from,
- what requests it makes,
- what domains and integrations sit around it.

Sometimes the homepage tells you almost nothing.
Assets, scripts, and requests often tell you a lot.

## Analytical portals and threat intelligence context

At this layer, it is worth remembering:

- VirusTotal,
- PacketTotal,
- ANY.RUN,
- Malpedia,
- abuse.ch Bazaar.

This is no longer just standard recon.
This is more the:

- reputation layer,
- malware layer,
- IOC layer,
- analytical layer,
- contextual layer.

So less:

- “what is running here?”

And more:

- “what does the world already know about this object?”

---

# 3) Recon mindset - the biggest mistake is believing one source tells the truth

This is something worth drilling into your head:

- every tool shows only a **slice of the truth**,
- every source has bias,
- every dataset has limitations,
- every result may be incomplete, outdated, or stripped from context.

So do not think:

> Shodan returned nothing, so there is nothing there.

Think instead:

> This source did not show me anything useful. I need to come in from a different angle.

For example through:

- certificates,
- historical subdomains,
- urlscan,
- assets,
- e-mails,
- repositories,
- external integrations,
- organization profiles,
- infrastructure patterns.

## The rule I want to keep here

**Every discovery is not the end. Every discovery is a pivot.**

---

# 4) AI in OSINT - it speeds up work, but it cannot replace judgment

AI is powerful.
And that is exactly why it is also deceptive.

## Where it really helps

- generating queries,
- breaking a problem into smaller parts,
- summarizing sources,
- grouping results,
- speeding up large-scale analysis,
- building hypotheses,
- supporting dorking and research.

## Where it creates problems

- it produces content that sounds confident but is wrong,
- it generates realistic personas,
- it creates synthetic images,
- it creates synthetic video and audio,
- it can make a fake look credible if someone looks too quickly.

## My working rule

**An LLM should speed up my thinking, not replace my thinking.**

That distinction makes a huge difference.

Because if you let AI take the role of the final judge of truth, sooner or later you will build analysis on top of a hallucination or synthetic junk.

---

# 5) AI-generated identity - today a fake no longer has to look suspicious

Not that long ago, many fakes could be spotted because “something felt off.”
Today, that is no longer enough.

There are concrete areas where AI is already changing the OSINT landscape:

- face generation,
- persona generation,
- biography and story generation,
- generated event images,
- generated voice,
- generated content pretending to be a source.

## What this changes for the analyst

It is no longer enough to ask:

- “does the profile picture look natural?”

You need to look wider:

- does the persona have history,
- is that history consistent over time,
- does the activity look organic,
- are there traces across platforms,
- does the content make sense outside one narrow context,
- is this just an empty shell built only for influence?

## Tools and directions worth knowing

- fake person generators,
- image generators,
- video generators,
- text analysis tools,
- AI detectors for text / image / audio,
- face search engines,
- image intelligence and reverse image search.

But the important part is this:

**a detector does not give you truth. A detector gives you a signal.**

---

# 6) Debunking AI - it is not about one tool, it is about the workflow

In practice, the person who wins is not the one who knows the most tool names.
It is the one who has a sensible process.

## Step 1: evaluate the context

- who is publishing it,
- since when,
- where else it appears,
- whether the source has history,
- whether the topic appeared suddenly,
- whether the content lives only inside one dispute / campaign / narrative.

## Step 2: evaluate consistency

- the face,
- the background,
- the details,
- the metadata,
- the writing style,
- the publishing rhythm,
- the activity patterns,
- the quality of links to other entities.

## Step 3: use supporting tools

- AI detectors,
- reverse image search,
- face search,
- text analysis,
- comparison with other materials,
- clustering,
- analysis of secondary sources.

## Step 4: do not issue a verdict based on one signal

This is critical.

- a detector can produce a false positive,
- lack of metadata is not automatically proof,
- weird style does not have to mean AI,
- editing is not the same thing as synthetic content.

## My filter

**One signal is a lead. Several independent signals are the minimum foundation for an assessment.**

---

# 7) Dorks + AI = convenience, but only if you know the basics

AI can help with building dorks.
And yes, it really can save time.

But there are two problems:

1. AI can generate syntax that sounds right but does not work,
2. AI often overcomplicates something that could have been done in a simpler and better way.

## That is why my model is simple

First:

- I understand the operators,
- I can build a simple version manually,
- I know what I am actually looking for.

Only then:

- I ask AI for variations,
- I ask AI for language variants,
- I ask AI for combinations,
- I ask AI to expand directions.

## The rule

**Manual first. Automation second. Never the other way around.**

---

# 8) Clustering and investigations - a list of results is still not analysis

A lot of people stop too early.
They have results, so they feel like “they already have something.”

No.
Results are only raw material.

Value appears when you start to:

- group threads,
- connect entities,
- look for common patterns,
- build a timeline,
- detect relationships between seemingly unrelated elements,
- separate signal from noise.

## What helps here

- clustering search engines,
- people / company lookup,
- systems tracking news and vulnerabilities,
- enrichment tools,
- your own notes and your own relationship graphs.

## The most important idea

**OSINT becomes valuable only when the data starts turning into a story about the target.**

Not a collection of links.
Not a list of screenshots.
Not a folder full of bookmarks.

A story that actually makes sense.

---

# 9) OPSEC - you can be good at research and terrible at protecting yourself

This is a topic people often push aside because it feels “less exciting.”
And then that is exactly where they fail.

The simplest version of the truth is this:

**you can be excellent at analyzing other people’s traces and at the same time mindlessly leave your own.**

## Passwords

Do not think about a password as a “weird string of characters.”
Think of it as part of a system:

- it should be long,
- it should be unique,
- it should not be reused,
- it should be supported by a sensible management model.

Most of the time, a long unique password stored in a manager is better than a “clever” variation of something you already used before.

## Password managers

This is not convenience for lazy people.
It is a practical necessity.

Without a manager, it is very easy to fall into:

- reuse,
- similar variations,
- predictable patterns,
- disaster after the first leak.

## Two-factor / multi-factor authentication

Multi-factor authentication is a baseline.
But you cannot think of it as a magical shield.

You need to understand:

- how the second factor works,
- where a user can be tricked,
- which methods are stronger,
- which methods are more vulnerable to phishing, session theft, or social engineering.

## The biggest mindset shift

**OPSEC does not start when you begin a “serious operation.” OPSEC starts the moment you begin acting at all.**

---

# 10) Physical OPSEC - a photo can also be a leak

This is one of those things that completely changes the way you look at the world.

Because suddenly you stop seeing a photo as just a photo.

You start seeing:

- data,
- geometry,
- scale,
- reflections,
- identifiers,
- background,
- access clues,
- things that can be reconstructed.

## Keys and photos

If a photo of an ordinary key can help reconstruct its parameters, then a banal picture is no longer banal.

And the same applies to:

- access cards,
- ID badges,
- screens,
- papers on a desk,
- notes on a whiteboard,
- name tags,
- plans in the background.

## The takeaway

Do not ask only:

- “what is in the photo?”

Also ask:

- what is visible next to it,
- what can be zoomed in on,
- what can be reconstructed,
- what is visible in reflections,
- what reveals context,
- what gives the adversary the next pivot.

---

# 11) Redaction and censoring - many people still confuse covering up with removing

This is a topic where people fail surprisingly often.

Psychologically, it looks like this:

- I covered it,
- so it cannot be seen,
- so the problem is solved.

Technically, it often looks like this:

- I covered it,
- but I did not remove it,
- so the data is still there.

## Common mistakes

- a black rectangle on a layer without flattening,
- the operation can easily be undone,
- bad export,
- cropping instead of removing,
- metadata left in the file,
- history and layers left inside the document,
- uploading files to random online converters,
- false confidence based only on the preview.

## A good rule

**Do not ask: did I cover it. Ask: did I actually remove it.**

## My minimal safety model

- remove data, do not cover it,
- verify the final result,
- export consciously,
- remember metadata,
- do not trust the preview alone,
- do not upload sensitive things to random online services.

---

# 12) Photos uploaded to the internet - they almost always show more than you intended

This is a topic worth writing down in bold.

A photo posted online can reveal:

- documents,
- passwords,
- monitors,
- the working environment,
- hardware,
- maps,
- identifiers,
- geolocation clues,
- relationships between people,
- details sufficient for fraud or social engineering.

## How I want to look at this

Not like an ordinary user.
Like an adversary.

So I ask:

- what can be zoomed in,
- what is visible in reflections,
- what is on the screen,
- what is lying on the desk,
- what is hanging on the wall,
- what reveals process,
- what reveals the organization,
- what reveals the location,
- what reveals too much.

## A good mental practice

**The foreground of a photo is almost never the only thing worth paying attention to.**

---

# 13) Shortened links - a small topic with big consequences

A shortened link is not just “a shorter address.”
It is **hidden destination context**.

And that is exactly why you need to treat it carefully.

## Before you open it

- expand the link,
- check where it leads,
- assess the final domain,
- do not trust the form of the message itself,
- do not assume that because someone sent “a normal link,” you already know where you are going.

There is no magic here.
Only discipline and habit.

---

# 14) Canary tokens - cheap signal, very real value

I like canary tokens because of their simplicity.
They are not a mechanism that will “stop an attack.”
They are a mechanism that can tell you:

- someone looked,
- someone opened the document,
- someone clicked the resource,
- someone touched something they normally should not have touched.

## Where they make sense

- documents,
- decoy resources,
- detection of unauthorized access,
- quiet signals from places that should not generate traffic.

## What matters here more than the technique itself

Placement.

Because a badly placed token:

- will fire accidentally,
- will generate noise,
- will be too obvious,
- or will be chosen so poorly that it adds no useful value.

## The rule

**A good token is not just a token. It is a thoughtfully designed context for its use.**

---

# 15) The dark web - do not romanticize it, understand it

The dark web is very easy to mythologize.
Some people turn it into a legend.
Others treat it like a curiosity.
Both extremes are weak.

It is better to look at it soberly:

- it is an environment with its own tools,
- its own risks,
- its own operational specifics,
- and real value for research.

## What is worth remembering

The dark web / darknet is not “a magical hidden internet.”
It is simply a different layer of resources and services that you do not access the same way you access the regular web.

## What actually matters here

- the working environment,
- operational separation,
- traffic hygiene,
- avoiding overconfidence,
- awareness that contact with a resource is itself also a risk.

## Tools worth recognizing

- Tor,
- TorBot,
- Darc,
- Darkdump,
- Hunchly,
- Tor over VPN-style configurations.

But more important than the list of names is one thing:

**you do not enter this kind of environment straight from your everyday system without operational preparation.**

---

# 16) How to tie this into one workflow

This is the version I want to keep in the back of my head while working.

## Phase 1: technical reconnaissance

- domains,
- subdomains,
- certificates,
- hosts,
- services,
- assets,
- urlscan,
- reputation and analytical portals.

## Phase 2: pivoting

- e-mail,
- identities,
- naming conventions,
- public exposure,
- correlation between hosts and services,
- traces in repositories,
- traces in screenshots and documents.

## Phase 3: credibility analysis

- is the content real,
- is the image authentic,
- does the person exist,
- is the material synthetic,
- does the source have history,
- do the signals support each other.

## Phase 4: my own OPSEC

- environment,
- operational separation,
- passwords,
- multi-factor authentication,
- file hygiene,
- photo and document hygiene,
- control over my own traces.

## Phase 5: signals and traps

- canary tokens,
- access monitoring,
- observation of unusual interactions,
- exposure control over my own materials.

---

# 17) Cheat sheet - what I actually want to remember

## Technical recon

- do not rely on one source,
- certificates and assets often tell you more than the homepage,
- recon is a game of pivots, not one query,
- a tool result is the beginning, not the end.

## AI in OSINT

- AI speeds up work, but it does not verify truth for you,
- synthetic identity is a real problem, not a curiosity,
- an AI detector is a supporting signal, not a verdict,
- the more credible something looks, the more worth it is to look for independent confirmation.

## OPSEC

- a long password + password manager + multi-factor authentication beats manual heroics,
- two-factor authentication does not end the problem, it only raises the bar,
- photos, documents, and daily convenience are also a leak surface.

## Documents and photos

- redaction means removing content, not covering it,
- online converters can do more harm than good,
- the background of a photo can be just as valuable as the main subject.

## Dark web

- do not romanticize it,
- do not operate there without a prepared environment,
- understand the risk, the tools, and the operational context.

---

# 18) Quick tool cheat sheet

| Area                                  | Tools / sources                                                    | How to think about it                                |
| ------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| Technical recon                       | Shodan, Censys, ZoomEye, Criminal IP                               | What is exposed and what the surface looks like      |
| Web content discovery                 | FeroxBuster                                                        | What exists but is not immediately visible           |
| Certificates / subdomains             | crt.sh                                                             | What TLS history reveals                             |
| Web assets                            | urlscan.io                                                         | What relationships and assets the application loads  |
| E-mail / domain OSINT                 | theHarvester                                                       | What public traces the organization leaves behind    |
| Malware / threat intelligence context | VirusTotal, ANY.RUN, Malpedia, abuse.ch, PacketTotal               | What is already known about the object               |
| Clustering                            | Carrot2                                                            | How to organize results and threads                  |
| People / company lookup               | Hunter, cylect                                                     | How to pivot into people and organizations           |
| AI detection                          | GPTZero, IsItAI, AIorNot, Deepware                                 | Whether the material may be synthetic                |
| Face / image intelligence             | PimEyes, FaceCheck, GeoSpy, Picterra                               | Whether a face / image / place can be linked         |
| Dork assistance                       | classic operators + AI as support                                  | How to speed up queries without losing control       |
| OPSEC                                 | Bitwarden, KeePass, 1Password, Yubico, multi-factor authentication | How not to become your own weakest link              |
| File / document hygiene               | unredacter, deliberate redaction                                   | How not to leak through a document                   |
| Detection / traps                     | Canarytokens                                                       | How to get a signal of unauthorized interaction      |
| Dark web                              | Tor, TorBot, Darc, Darkdump, Hunchly                               | How to think about resources outside the regular web |

---

# 19) The easiest mistakes to make

## Mistake 1

Believing one tool gives the full picture.

## Mistake 2

Treating AI like an oracle instead of a work accelerator.

## Mistake 3

Believing that covered up means removed.

## Mistake 4

Underestimating how much an ordinary photo can reveal.

## Mistake 5

Thinking OPSEC starts only during a “serious operation.”

## Mistake 6

Getting excited about a tool without understanding the process.

## Mistake 7

Failing to document pivots, relationships, and your own conclusions.

## Mistake 8

Confusing “I have a lot of data” with “I understand what is happening here.”

---

# 20) What I want to keep from this chapter

If I had to keep just one thought from this, it would be this:

**In modern OSINT, collecting data is easy - the real advantage comes from being able to separate truth from noise, connect the traces, and avoid exposing more about yourself than you uncover about the target.**
