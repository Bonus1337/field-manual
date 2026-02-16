---
id: access-control-priv-esc
title: "Access Control & Privilege Escalation"
team: red
category: portswigger academy
tags: ["access-control", "idor", "privilege-escalation", "authz", "misconfiguration"]
difficulty: medium
updatedAt: "2026-02-16"
---

Access control is not “do you have an account?” - it’s **whether the application is allowed to perform a specific action for a specific identity**.

In real-world web security, access control failures are high impact because they commonly lead to:

- viewing other users’ data,
- account takeover paths,
- admin-only actions being reachable,
- role/permission changes,
- destructive actions (delete/modify resources).

---

## How it fits together: AuthN vs Session vs AuthZ

- **Authentication (AuthN)**: who you are (login).
- **Session management**: continuity (cookies/tokens across requests).
- **Authorization (AuthZ / access control)**: what you are allowed to do or access.

Most access control bugs happen when the app:

- trusts user-controlled input (params/cookies/client-side logic),
- or assumes “if it’s not in the UI, nobody can reach it”.

---

## Three access control patterns you’ll meet in practice

### 1) Vertical (role → functions)

Different roles access different capabilities.
Examples: admin panel, user management, role assignment.

**Common failure:** the feature exists server-side, but the restriction is only “cosmetic” (hidden UI link).

---

### 2) Horizontal (user → owned resources)

Users should only access their own resources (profile, orders, documents).
Examples: ` myaccount?id=...` `orders?user=...` file downloads by ID.

**Common failure:** the app accepts an object identifier and forgets to enforce ownership checks (IDOR).

---

### 3) Context-dependent (process state → access)

Access depends on the current state of a workflow.
Examples: cart edits after payment, multi-step role changes, “confirm” flows.

**Common failure:** controls exist on some steps, but one step is callable directly (step skipping).

---

## Common implementation mistakes (and why they matter)

### UI ≠ access control

Not showing an option in the menu is not a security control.  
**Backend must enforce authorization**, always.

---

### “Security by obscurity”

Hiding functionality behind a random-looking URL does not equal protection.
Those URLs often leak via JavaScript, HTML source, or client-side role logic.

---

### Client-controlled roles (params/cookies/hidden fields)

If the app decides “admin or not” based on a value the client can change:

- cookies like `Admin=false`
- parameters like `role=1`
- hidden fields like `isAdmin=0`
  then it’s not authorization - it’s a trust flaw.

---

## IDOR in the real world (the most common access control pattern)

**IDOR (Insecure Direct Object Reference)** happens when user-supplied input selects an object directly, without enforcing proper authorization.

Common forms:

- numeric IDs (easy to guess),
- GUID/UUID (harder to guess, but often **leak in the UI**: profiles, posts, comments, links).

**Sneaky variant:** the server returns a redirect, but the response body still contains sensitive data.  
Don’t trust “it redirected” - always inspect the response body.

---

## Multiple layers: frontend, reverse proxy, backend

Modern stacks often include:

- CDN/WAF,
- reverse proxy,
- gateway,
- application.

This creates a class of issues where **different layers interpret the same request differently**.

Symptoms:

- one path is blocked, a near-identical variant works,
- method handling differs (POST vs GET),
- routing mismatches (trailing slash, case, extensions).

---

## X-Original-URL and X-Rewrite-URL - what they are and why they matter

### What these headers are

`X-Original-URL` and `X-Rewrite-URL` are **non-standard HTTP headers** used in some proxy/gateway setups to pass the “original” or “rewritten” request path between layers.

In certain architectures:

- the proxy accepts a request at one path,
- internally maps it to another,
- and forwards metadata to the backend about what the “real” target path should be.

### Why they’re important

If the backend **trusts** these headers while access control is enforced elsewhere (or enforced on the request line only), you can get a **source-of-truth mismatch**:

- the outer layer thinks the request is for `/`
- the backend reads the header as “actually” `/admin/deleteUser`

That discrepancy can become an authorization bypass.

### What can go wrong (realistic outcomes)

1. **Bypassing URL-based access controls**
   - Frontend blocks `/admin/*` but backend processes `/` and routes using the header.

2. **Reaching internal-only endpoints**
   - Endpoints intended to be accessible only behind a gateway can become reachable.

3. **Dodging WAF/rate limiting/logging assumptions**
   - One layer logs/filters based on the visible URL,
   - another performs the sensitive action based on the header,
   - making detection and correlation harder (“logs show") `/`

### Key takeaway

These headers are infrastructure mechanics - but security breaks when:

- **different layers make authorization decisions using different inputs** (URL vs header),
- and at least one of them is inconsistent or overly trusting.

---

## Prevention that actually works

- **Deny by default**: everything private unless explicitly public.
- **Single, server-side AuthZ mechanism**: consistent enforcement everywhere.
- **Never trust client-controlled role signals** (params/cookies/JS) for authorization.
- **Align routing and controls across layers** (proxy/gateway/app).
- **Audit & regression test authorization**: roles, resources, methods, path edge-cases.

---

## TL;DR (save-worthy)

- Access control is authorization - not login.
- Common failures: hidden links, obscured URLs, role-in-cookie/param, IDOR.
- Multi-layer stacks fail when layers interpret routing differently.
  `X-Original-URL` `X-Rewrite-URL` become dangerous when the backend trusts them but controls exist elsewhere.
