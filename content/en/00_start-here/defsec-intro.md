---
id: defsec-intro
title: "Defensive Security Intro"
team: blue
domain: start-here
section: defensive-security
type: knowledge
angle: defensive-perspective
sourceTrack: general
tags: ["blue-team", "soc", "siem", "incident-response", "defence-in-depth"]
difficulty: easy
shortDescription: "A concise introduction to defensive security that organizes the core blue team roles, processes, and dependencies - from monitoring and triage, through incident response and SIEM, to defence in depth and the mindset of keeping the business running under pressure."
updatedAt: "2026-02-16"
---

Defensive Security is not “install a tool and you’re safe”.  
It’s **continuous visibility, fast decisions, and a repeatable process** that keeps the business running even while someone is actively trying to break in.

## What this chapter is really training

### 1) Mindset: “keep the business alive” vs “find the flag”

Offensive goal: find a path.  
Defensive goal: **reduce impact** and **restore normal operations**.

In practice, it’s about:

- _time to detect_ (do you see it early?)
- _time to respond_ (can you stop escalation?)
- _decision quality_ (can you contain without breaking half the company?)

### 2) Blue team work is 5 pillars (that blend into one workflow)

- **Monitoring & Detecting** – watch events continuously (logins, processes, network activity).
- **Incident Response** – once suspicion becomes confirmation → you enter incident mode.
- **Threat Intelligence** – track attacker methods/trends to recognize patterns faster.
- **Vulnerability Management** – reduce attack surface before it gets abused.
- **Investigation & Analysis** – separate noise from real signals, build timelines and scope.

These aren’t separate silos - they’re one loop.

---

## Why this matters (business view, not theory)

Big breaches and ransomware headlines usually come from:

- weak policies (passwords, access, MFA)
- outdated systems
- low visibility (missing logs/monitoring)
- untrained incident response

For the business, it’s not “embarrassment”. It’s:

- downtime + cost
- fines/regulations
- lost trust

---

## SOC roles - who does what (and why)

A **SOC** is the defensive operations center - often 24/7.

Typical roles:

### SOC Analyst (Tier 1/2)

- receives alerts
- triages: _is this real?_
- gathers context: sources, timeline, scope
- escalates if needed

### Incident Responder

- acts on confirmed incidents
- isolates, blocks, stops escalation
- drives lessons learned + prevention afterwards

### Security Engineer

- builds the “nervous system” (logging, integrations, detections)
- automates (SOAR/playbooks)
- maintains tooling (EDR, SIEM, IDS)

### Digital Forensics

- preserves evidence properly
- reconstructs what happened
- supports post-incident root cause and improvements

---

## Defence in Depth: layers, not one “shield”

Defence in Depth means if one control fails, other layers still reduce impact.

Examples:

- **Employee training** (phishing awareness)
- **Policies** (MFA, passwords, access, browsing controls)
- **Firewalls** (traffic control)
- **IDS/IPS** (suspicious pattern detection)
- **EDR** (endpoint telemetry + response)
- **SIEM** (central visibility + correlation)

One layer will eventually fail. The question is whether the system survives.

---

## SIEM: the defensive “radar” (not just a dashboard)

A SIEM centralizes and correlates data from:

- endpoints, servers, applications
- firewalls, IDS, proxies
- identity systems (AD/SSO)

The value isn’t “having logs”.
It’s enabling:

- detections (rules/correlation)
- fast triage
- incident timelines

**Real-world issue:** alert fatigue.  
The best SOC doesn’t have the most alerts - it has the **most actionable** ones.

---

## How to think during a “Web Discovery Attack”

This is a classic case: someone enumerates an app to find hidden endpoints.

Key questions (order matters):

1. **Is it malicious or expected scanning?**
2. **Where is it coming from?** (IP, ASN, geo, user-agent, rate)
3. **What paths are being probed?** (/admin, /backup, /api patterns)
4. **Did they discover something sensitive?** (200/302 on non-public endpoints)
5. **What’s the likely impact if it continues?**
6. **How do we stop it without killing the business?**
   - rate limiting / WAF rules
   - IP blocks / geo blocks (careful)
   - hidden endpoints → enforce auth/role checks (not “remove from menu”)
   - review logs + add detections for follow-up attempts

---

## TL;DR (save-worthy)

- Blue team wins with **time + process**, not “tool magic”.
- A SOC is people + workflow + tooling - **not SIEM alone**.
- Defence in Depth works when layers are real (policy + telemetry + response).
- “Web discovery” is a signal: attack surface exists → detect, contain, fix.
