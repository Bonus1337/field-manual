---
id: access-control-priv-esc
title: "Access control & privilege escalation"
team: red
domain: labs-writeups
section: portswigger
topic: access-control
type: knowledge
angle: access-control-theory-and-lab-mindset
sourceTrack: portswigger-web-security-academy
tags: ["access-control", "idor", "privilege-escalation", "authz", "misconfiguration"]
difficulty: medium
shortDescription: "A structured overview of access control and privilege escalation in web applications, focused on the distinction between authentication, session handling, and authorization, the most common enforcement failures, IDOR mechanics, and architectural inconsistencies that lead to access control bypasses."
updatedAt: "2026-02-16"
---

Access control is a set of mechanisms that decide **who** can access **which resources** and perform **which actions** - and (in mature systems) make this auditable and accountable.

A practical way to think about it is **AAA**:

- **Authentication**: proving identity (who you are).
- **Authorization**: enforcing permissions (what this identity can do / see).
- **Accountability / Accounting**: an activity trail (who did what, when; logs/audit).

Access control issues are a common source of web incidents, but the impact varies - from minor data leaks to critical privilege escalation. It depends on **what data/actions** sit behind a given endpoint.

Typical consequences (when the bug affects sensitive functionality) include:

- viewing other users’ data,
- performing actions on other users’ resources,
- higher-privileged operations (e.g., admin actions),
- changing roles / permissions,
- deleting resources.

---

## How it fits together: authentication vs session vs authorization

- **Authentication**: who you are (login).
- **Session management**: whether it’s still you (cookie/token, request continuity, expiry).
- **Authorization (access control)**: what this identity is allowed to do / see.

Access control failures don’t always come from “trusting client data” or “hiding things in the UI”.
In real systems, they usually happen because of:

- **missing enforcement** somewhere (someone forgot to check role/permission),
- or a **bug in the authorization logic** (wrong condition, inconsistent rules, different resource interpretation).

---

## Three access control types you’ll see in the real world

### 1) Vertical (role → functions)

Different roles have access to different features.
Examples: admin panel, user management, role changes.

**Typical bug:** an endpoint works for “any logged-in user” (session check exists),
but the **role/permission check is missing** (or inconsistent).

---

### 2) Horizontal (user → their resources)

Each user should only access “their” slice of resources (account, documents, orders).
Examples: `myaccount?id=...`, `orders?user=...`, downloading files by ID.

**Typical (classic) bug pattern:** the app lets you reference an object using an identifier
provided by the user and **does not verify the relationship** (owner/tenant).

This often results in an IDOR as the observable outcome.

---

### 3) Context-dependent (process state → access)

Access depends on which stage of a process you’re in.
Examples: checkout after payment, changing data after confirmation, workflows like “step 1 → step 2 → confirm”.

**Typical bug:** checks exist on some steps, but one step can be invoked “out of order”
(or the state condition is not enforced server-side).

---

## Common implementation mistakes (and why they matter)

### UI ≠ access control

Just because something isn’t visible in the menu doesn’t mean the backend won’t serve it.
**Hiding a link** is not a security control - it’s just UX.

> In practice this shares the same core problem as “security by obscurity”: missing server-side enforcement.

---

### “Security by obscurity”

Sometimes features are hidden behind a “weird” path (a random-looking URL fragment).
The issue: that path often leaks anyway (JS, HTML, UI logic).

---

### Client-controlled permissions (params/cookies/hidden fields)

If the app decides “are you admin” based on a value the user can modify:

- a cookie like `Admin=false`
- a parameter like `role=1`
- a hidden field like `isAdmin=0`

the real problem isn’t “the parameter exists”, but that the **server trusts client-controlled input**
for an authorization decision.

---

## IDOR in practice (a very common data exposure pattern)

**IDOR (Insecure Direct Object Reference)** = a situation where a user can reference an object
using an identifier they provide, and the application fails to properly enforce access checks for that object.

Common forms:

- numeric IDs (easy to guess),
- GUIDs/UUIDs (harder to guess, but often **leak through the UI**: profiles, posts, comments, links).

**A sneaky edge-case:** the response redirects, but **the response body still contains data**.
This often comes from an implementation mistake (e.g., not stopping execution after redirect),
and the observable outcome can look like an “IDOR-style” leak.

---

## Layers in between: reverse proxy / gateway / backend

Real systems often have more than one layer in front of the app (reverse proxy, gateway, application).
Not every layer performs authorization - often it’s routing / access / protection, not AAA.

Risk increases when:

- different layers **interpret** a request differently (routing/normalization),
- and enforcement becomes inconsistent or depends on different “sources of truth”.

Symptoms (examples, stack-dependent):

- one path is blocked, but an “almost identical” path gets through,
- the system tolerates different HTTP methods,
- routing matches paths differently (trailing slash, case sensitivity, extensions).

> This isn’t “broken auth by itself” - it’s a class of problems caused by inconsistent architecture and rule enforcement.

---

## X-Original-URL and X-Rewrite-URL - what they are and why they matter

### What these headers are

`X-Original-URL` and `X-Rewrite-URL` are **non-standard HTTP headers** that, in some architectures,
are used to pass the “original” or “rewritten” request path between layers.

### Why they matter

The problem appears when any layer starts making access/routing decisions based on these headers
and the client can supply or override them.

In short: **you should not build authorization on top of these headers**.
If they are used, they should be controlled only by trusted components (edge/proxy),
not by the user.

### What can go wrong (realistic scenarios)

1. **Bypassing URL-based access control**
   - One layer filters by the request line, while the backend routes logic using the header.
   - Result: a “source of truth mismatch” can allow access to protected functionality.

2. **Reaching “internal” endpoints**
   - Externally you see only a subset of routes; the rest is internal routing.
   - If the header influences routing, internal endpoints can be exposed unintentionally.

3. **Bypassing filtering/logging rules**
   - One layer logs/filters by the request line,
   - another executes actions based on the header,
   - making detection/correlation harder.

### The key takeaway

This is an architectural risk: it breaks when:

- different layers make decisions based on different sources of truth,
- and at least one layer lets the client influence these “internal” metadata fields.

---

## How to prevent it (no fluff)

- **Central authentication + authorization mechanism** (one place for decisions + consistent enforcement).
- **Don’t trust client-controlled data** (cookie/params/JS) for role/permission decisions.
- **Validate user → object relationships** (ownership/tenant), not just “is the user logged in”.
- **Consistent routing/normalization rules** across layers (avoid interpretation drift).
- **Authorization regression tests**: roles, resources, methods, edge-cases in paths and process states.

> “Deny by default” is sensible especially for sensitive data and actions, but in practice depends on system criticality and context (fail-closed vs fail-open).

---

## TL;DR (save-worthy)

- Access control is broader than “can you perform this action” - think AAA.
- The most common real-world bug: **missing / inconsistent enforcement** (someone forgot to check role/permission or implemented it incorrectly).
- “Hidden link” and “weird URL” are not protections - they’re signals the server may not enforce rules.
- IDOR is often the **result** of missing user → object relationship checks.
- `X-Original-URL` / `X-Rewrite-URL` become dangerous when architecture lets them influence routing/authorization,
  or when different layers rely on different sources of truth.
