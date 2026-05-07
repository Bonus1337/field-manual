---
id: sop-cors-complete
title: "SOP and CORS: the full browser trust model, misconfigurations, and a testing playbook"
team: red
domain: web-security
section: browser-security
type: playbook
angle: pentest-workflow
sourceTrack: baw
tags: ["sop", "cors", "csrf", "xss", "xs-leaks", "burp", "web", "api", "misconfiguration"]
difficulty: medium
shortDescription: "A complete note on Same-Origin Policy and CORS: what they really are, what they protect, what they do not protect, where mistakes appear, how to think about them offensively, and how to test them practically in Burp without confusing signal with a real exploit."
updatedAt: "2026-04-14"
---

# SOP and CORS: the full browser trust model, misconfigurations, and a testing playbook

CORS is one of those topics that is very often misunderstood for a simple reason: most people first encounter it through a console error, not through the security model behind it.

They see:

- `No 'Access-Control-Allow-Origin' header`
- `CORS policy blocked`
- `Response to preflight request doesn't pass access control check`

and they start thinking that CORS is just a set of headers you need to add so the frontend “works.”

That is a very weak understanding of the topic.

CORS is not a topic about headers.  
CORS is a topic about **when the browser allows one application to read responses from another application**.

And to understand that properly, you have to start with the foundation, which is **Same-Origin Policy**.

Because without SOP, CORS makes no sense.  
And without SOP, modern web security would not exist.

---

# 1. Same-Origin Policy: one of the most important security boundaries on the web

Same-Origin Policy, or SOP, is the core isolation mechanism in the browser.

It is what makes sure that a random website you visit cannot simply:

- read data from another open application,
- query your bank and read its responses,
- fetch messages from your email,
- browse panels you are logged into,
- mix the logic of one application with another.

Without SOP, the web would be practically impossible to secure.

## 1.1. What an origin actually is

An origin is not “a domain.”  
An origin is exactly a combination of three elements:

- **scheme** – for example `http` or `https`
- **host**
- **port**

That means the following addresses are different origins from the browser’s point of view:

- `https://example.com`
- `http://example.com`
- `https://api.example.com`
- `https://example.com:8443`

This matters a lot, because many people think too loosely:
“same company, same domain, probably the same thing.”

No.  
`app.example.com` and `example.com` are different origins.  
`https://example.com` and `http://example.com` are different origins.  
A different port also changes the origin.

From the browser’s perspective, an origin is the identity of an application.

---

# 2. SOP does not mean: “nothing cross-origin works”

This is one of the biggest conceptual mistakes.

If SOP were enforced in an absolutely rigid way, the web would stop working the way it works today. We would not have convenient embedded images, scripts, parts of integrations, CDNs, and the entire historical mess of backward compatibility.

That is why the correct way to think about it is:

- **sending a cross-origin request** may be possible,
- **embedding a cross-origin resource** may be possible,
- **reading a cross-origin response** is usually blocked.

This is the most important mental model in the entire topic.

Do not ask first:
“will the request be sent?”

Ask:
**“will my JavaScript be allowed to read the response?”**

Because very often the request will go through without any problem.  
But that still does not mean you get access to the data.

---

# 3. Why SOP matters so much in practice

SOP is not theory. It is a security layer that quietly protects users every day.

Without SOP:

- a malicious website could read responses from your bank,
- every ad could query your internal applications,
- any website could inspect data from applications you are logged into,
- the boundary between applications inside the browser would almost disappear.

And that is exactly why SOP is one of the most important mechanisms in browser security.

It is not an extra feature.  
It is one of the foundations.

---

# 4. Why XSS and CSRF still exist despite SOP

This is the point where many people start truly understanding the topic for the first time.

## 4.1. XSS does not need to bypass SOP. XSS runs inside the trusted origin

If an application has XSS, the attacker executes their JavaScript **inside the origin of the vulnerable application**.

From the browser’s perspective, that is no longer “foreign” code.  
It is code running in the same origin that the browser already trusts.

That is why XSS is so powerful.

Not because it can do `alert(1)`.  
But because it gives the attacker the ability to act **like legitimate application code**.

That means it can:

- read same-origin responses,
- perform actions as the user,
- use the session,
- pull data from the API,
- exfiltrate sensitive information.

## 4.2. CSRF often does not need to read the response

CSRF works differently.

In classic CSRF, the attacker often does not care about the response at all.  
They care that the victim’s browser **sends the request** to the vulnerable application together with the session cookie.

So:

- the victim is logged in,
- the victim visits the attacker’s page,
- the page causes a request to be sent to the victim’s application,
- the browser attaches cookies,
- the application believes it is a legitimate user action.

SOP does not eliminate that automatically, because SOP mostly restricts **reading the response**, not the existence of every cross-origin request.

This is very important:

> SOP is not full protection against CSRF.  
> SOP mainly makes reading responses and mixing contexts harder.

---

# 5. CORS: a controlled exception to isolation, not “turning SOP off”

This is another critical point.

A lot of people talk about CORS as if it meant:
“we disable SOP so the frontend can work.”

That is not correct.

CORS does not disable SOP.  
CORS says:

> “the server can deliberately tell the browser that it trusts a given origin and agrees that this origin may read the response”

So CORS is not a security bypass.  
It is a **standardized, controlled mechanism for delegating trust**.

In short:

- SOP says: different origins cannot freely read each other’s responses
- CORS says: the server may define exceptions to that rule

That is a healthy model.  
But only when it is properly understood and properly implemented.

---

# 6. When CORS is needed at all

CORS exists because modern applications genuinely need cross-origin communication.

Common scenarios include:

- a SPA frontend runs on one origin and the backend API on another,
- the development environment has a local frontend and a remote API,
- several subdomains need to work together,
- the system relies on third-party services,
- a dashboard, SSO component, or external module needs to read data from another origin.

Without CORS, the browser would block the response from being read by JavaScript.

So the request may still be sent, but the data would not come back to the client in a usable way.

---

# 7. How CORS really works

CORS always involves three actors:

- **the client** – JavaScript running in origin A,
- **the server** – a resource in origin B,
- **the browser** – the rule enforcer.

This is very important.

The client does not decide.  
The server alone does not decide.  
The decision comes from the **cooperation between the server and the browser**.

The client can only attempt the request.  
The browser adds `Origin`, performs a preflight if needed, and decides whether the response is exposed to JavaScript.  
The server declares whom it trusts and under what conditions.

---

# 8. Two CORS modes: simple requests and requests with preflight

This is the foundation of practical understanding.

## 8.1. Simple request

A simple request is one that, from the browser’s perspective, is not especially unusual.

Most often:

- `GET`
- `HEAD`
- `POST`

plus only certain header types and simple `Content-Type` values, such as:

- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`

In that case, the browser usually:

1. sends the request,
2. attaches `Origin`,
3. receives the response,
4. checks `Access-Control-Allow-Origin`,
5. decides whether to expose the response to JS.

Very important:

> With simple requests, the request may still be executed even if the response is not made available to JS.

That is exactly why the lack of proper CORS **does not mean** that an action changing application state cannot happen.

## 8.2. Request with preflight

If a request is not simple, the browser performs an extra step: **preflight**.

This is an `OPTIONS` request sent **before** the actual request.

This typically happens when you use:

- `PUT`
- `PATCH`
- `DELETE`
- `Content-Type: application/json`
- `Authorization`
- non-standard headers such as `X-*`

Then the browser asks the server:

- is this origin allowed,
- is this method allowed,
- are these headers allowed,
- may I send the actual request at all?

Only if the server answers positively does the browser send the real request.

This creates a very important distinction:

- a simple request may be executed and the browser only hides the response,
- a request with preflight may be stopped **before the real request is ever sent**.

---

# 9. The most important CORS headers

The goal is not to memorize them like vocabulary. The goal is to understand their meaning.

## 9.1. `Origin`

A request header sent by the browser.  
It tells the server which origin the requesting page comes from.

It is the key to the whole model.

## 9.2. `Access-Control-Allow-Origin`

The most important response header.

It tells the browser:
**whether this origin is allowed to receive the response**

It may contain:

- a specific origin,
- `*`

And this is where most practical problems begin.

## 9.3. `Access-Control-Allow-Credentials`

It tells the browser whether the response may be exposed for requests that include credentials, such as cookies.

This is a very sensitive header.  
Combined with bad origin validation, it becomes dangerous very quickly.

## 9.4. `Access-Control-Allow-Methods`

Mostly used during preflight.  
It tells the browser which methods are allowed.

## 9.5. `Access-Control-Allow-Headers`

Also mainly used during preflight.  
It tells the browser which non-standard headers are allowed.

## 9.6. `Access-Control-Expose-Headers`

It allows JS to read additional response headers beyond the small default list.

## 9.7. `Access-Control-Max-Age`

It allows the browser to cache the preflight result.

## 9.8. `Vary: Origin`

It is not a CORS header itself, but from both a security and caching perspective it is very important if the response depends on the origin.

---

# 10. Credentials: the point where CORS becomes truly sensitive

This is where things get most interesting for a pentester.

If the application relies on cookies or other authentication material available in the browser, the key question becomes:

> can a malicious origin not only send the request, but send it in the context of a logged-in victim and read the response?

That is already a serious situation.

For such a scenario to work, you usually need all of these together:

- a request with credentials on the client side,
- `Access-Control-Allow-Credentials: true` on the server side,
- a properly matched `Access-Control-Allow-Origin`,
- the right cookie model and `SameSite` behavior.

And that is why not every “CORS bug” has the same weight.

Reflected ACAO without valuable data may be weak.  
Reflected ACAO + `ACAC: true` + an endpoint returning user data is a completely different story.

---

# 11. CORS is not protection against CSRF

This has to be said clearly.

CORS does not replace:

- CSRF tokens,
- correct method design,
- application state protection,
- sensible use of `SameSite`.

If an endpoint changes application state and can be triggered by a simple cross-origin request, then the lack of proper CORS in the response does not fix anything.

Because the attacker often does not care about the response.  
They care about successfully executing the action.

This is a very common architectural mistake:

> “if the browser blocks the response, then we are safe”

No, not if the action has already been performed.

---

# 12. The most common CORS misconfigurations

This is where theory becomes offensive practice.

## 12.1. `Access-Control-Allow-Origin: *`

This is often the first signal, but not always the biggest problem.

A wildcard means:
“any origin may read the response”

But browsers do not allow `*` to be combined with meaningful credentialed response exposure.

So `*` may be a problem, but it does not automatically mean full leakage of session-bound user data.

Still, it is often a sign of a weak trust model.

## 12.2. Blind origin reflection

This is a classic serious mistake.

The server takes the value from `Origin` and reflects it back into `Access-Control-Allow-Origin` without validation.

So:

- you send `Origin: https://evil.attacker`
- the server responds with `ACAO: https://evil.attacker`

If `Access-Control-Allow-Credentials: true` is also present, this may effectively remove the SOP boundary for that endpoint.

## 12.3. Prefix bypass

The developer checks:

- whether the origin starts with `https://trusted.example.com`

and accidentally allows:

- `https://trusted.example.com.attacker.tld`

This is a very typical logic flaw.

## 12.4. Suffix bypass

The developer checks:

- whether the origin ends with `example.com`

and accidentally allows:

- `definitelynotexample.com`

Equally common.

## 12.5. Bad regular expressions

Unescaped dots, missing anchors, overly broad wildcards, incorrect handling of ports or schemes.

The regex looks “clever,” but in practice it allows too much.

## 12.6. Accepting `Origin: null`

This is not abstract.

Certain browser contexts may send `Origin: null`.  
If the backend trusts `null`, you need to treat that seriously and test practical exploitability.

## 12.7. Overly broad trust in subdomains or partners

If an application trusts:

- `*.example.com`
- partner systems
- old subdomains
- external services

then in practice the security of your CORS policy starts depending on the security of all of those systems.

And that is very often a bad arrangement.

---

# 13. CORS does not exist alone. Other cross-origin paths exist beside it

This matters because closing one channel does not mean the whole model is sealed.

## 13.1. JSONP

An old hack based on `<script src=...>`.  
It worked because scripts could be loaded cross-origin.

Today it is more legacy than good design.

## 13.2. `window.postMessage`

A legitimate communication mechanism between windows and frames.

It is safe only if you:

- properly restrict the target origin,
- properly verify the sender’s origin.

## 13.3. Server-side proxy

Very practical, but easy to turn into SSRF if it accepts arbitrary URLs without proper validation.

## 13.4. WebSockets

They do not follow SOP in the exact same way as classic fetch/XHR.  
That gives flexibility, but also creates their own attack surface.

---

# 14. XS-Leaks: even if you cannot read the response, you may still extract information

This is one of the most interesting parts of the entire topic.

The lack of direct response reading does not mean there is no leak.  
Sometimes it is enough to extract:

- response timing,
- response size,
- success or failure of an operation,
- the number of rendered elements in the UI,
- behavioral differences,
- cache characteristics.

This is the world of **Cross-Site Leaks**.

In other words:

> even if SOP and CORS block direct access to the body, you may still get indirect information

And that is exactly why testing cross-origin behavior does not end with “does `response.text()` work?”

---

# 15. How to think about CORS offensively

This is the most important mindset shift.

Do not ask:
“is there a header?”

Ask:

- does the response have value,
- will the browser expose it to JS,
- does the request go in the victim’s context,
- does this trust boundary make sense,
- can it be chained with XSS, CSRF, takeover, cache behavior, or XS-Leaks.

In practice, four scenarios matter most:

## 15.1. Cross-origin read

A foreign origin can read the response.

## 15.2. Cross-origin read with credentials

A foreign origin can read the response in the context of a logged-in victim.

## 15.3. Cross-origin state change

The response may not be readable, but the action still gets executed.

## 15.4. Pivot through a trusted origin

You do not attack the main application directly. You attack an origin that the application trusts.

---

# 16. How to assess severity

Not every CORS finding is good.

## Weak signal

- public endpoint,
- `ACAO: *`,
- no credentials,
- no sensitive data,
- no realistic abuse scenario.

## Meaningful finding

- the response contains valuable data,
- an untrusted origin can read it,
- this can be confirmed in a browser.

## Strong finding

- the response depends on the victim’s session,
- it works with credentials,
- private user data can be read.

## Very strong finding

- reflection or validation bypass,
- `ACAC: true`,
- simple PoC,
- minimal victim interaction,
- high business value of the data.

Severity does not come from the header alone.  
Severity comes from the combination of:

- the data,
- the user context,
- ease of exploitation,
- simplicity of the PoC,
- business value.

---

# 17. Final mental model

If you had to remember only a few things, remember these:

- SOP isolates origins.
- CORS is a controlled exception to that isolation.
- A cross-origin request may still be sent even if the response cannot be read.
- CORS does not replace authorization or CSRF protection.
- XSS runs inside a trusted origin and therefore destroys the same-origin boundary.
- Bad CORS is usually not a “browser hack,” but a trust mistake on the server side.
- The most interesting cases are the ones involving credentials, user data, and a simple browser PoC.
- Even without full read access, XS-Leaks and other side channels may still exist.

That is the real core of the topic.

---

# 18. Burp Lab: a practical CORS testing playbook step by step

This is the operational section.  
Not for mindless clicking.  
For having a structured workflow and not losing sight of what the test actually means.

---

## 18.1. Goal of the Burp Lab

You want to answer five questions:

1. Does the endpoint react to `Origin`?
2. Is the origin validated correctly or simply reflected?
3. Can the response be read from a foreign origin?
4. Can this be done with credentials?
5. Does this result in a real exploit or only a weak signal?

---

## 18.2. Choosing the target

First, choose a request to a valuable endpoint.

Best targets:

- `/api/me`
- `/api/profile`
- `/api/account`
- `/api/billing`
- `/api/admin/*`
- `/api/user/*`
- JSON endpoints with user data
- endpoints available only after login

Weak targets:

- public assets,
- favicon,
- public config with no value,
- analytics,
- endpoints with no meaningful business data.

**Rule:** value of the response first, CORS second.

---

## 18.3. Baseline test

Send the request normally and save the baseline response.

Look at:

- the status code,
- whether the endpoint requires a session,
- what data it returns,
- whether any CORS headers are already present.

This is your reference point.

---

## 18.4. Test 1 – foreign origin

Add:

```http
Origin: https://attacker.tld
```

Check the response.

Look at:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Expose-Headers`
- `Vary: Origin`

### Interpretation

- no ACAO: weak signal for read access, but not the end of the story
- `ACAO: *`: assess data value and credentials
- `ACAO: https://attacker.tld`: very interesting signal
- dynamic ACAO changes: dig deeper

---

## 18.5. Test 2 – reflection

Send several requests with different origins:

```http
Origin: https://attacker.tld
Origin: https://random-123.attacker.tld
Origin: https://totally-not-trusted.example
```

If the backend reflects your value back into `ACAO` every time, you have a very strong signal of blind reflection.

That is not the final exploit yet.
Now you check whether:

- the endpoint has value,
- it works with credentials,
- the browser will let JS read the response.

---

## 18.6. Test 3 – `Origin: null`

Send:

```http
Origin: null
```

If the backend responds with:

```http
Access-Control-Allow-Origin: null
```

record that as an important signal.

Further questions:

- does it work on a valuable endpoint,
- does it work with credentials,
- can you build a real browser PoC around it?

---

## 18.7. Test 4 – prefix bypass

Do you suspect `startsWith`? Test:

```http
Origin: https://trusted.example.com.attacker.tld
Origin: https://example.com.attacker.tld
```

If the backend accepts that, you have a logical bypass in origin validation.

---

## 18.8. Test 5 – suffix bypass

Do you suspect `endsWith`? Test:

```http
Origin: https://notexample.com
Origin: https://definitelynottrustedexample.com
```

If the backend accepts those hosts, that is another classic bypass.

---

## 18.9. Test 6 – regex bypass

If the policy looks “smart,” try behaviors that suggest a bad regex:

- hosts similar to the trusted one,
- variants with an extra character instead of a dot,
- variants with a different port,
- variants with a similar prefix or suffix,
- variants with a non-obvious subdomain.

There is no single magic list here.
The point is to think like someone who wrote the regex too quickly and got it wrong.

---

## 18.10. Test 7 – preflight

Take an endpoint that uses:

- `PUT`
- `PATCH`
- `DELETE`
- `Content-Type: application/json`
- `Authorization`
- a custom header

And check whether the browser performs a preflight.

In Burp or in the browser, look for the response to `OPTIONS` containing:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

### Questions

- does the preflight pass,
- does the backend allow the method,
- does the backend allow the custom header,
- does the final request actually go through afterward,
- does the final response also include the correct ACAO.

Very important: a positive preflight alone does not yet mean a full exploit.

---

## 18.11. Test 8 – credentials

This is the key test for strong findings.

Check whether the response contains:

```http
Access-Control-Allow-Credentials: true
```

Then validate in the browser whether:

- the request actually goes out with cookies,
- the response is readable by JS,
- this works in the context of a logged-in victim.

That is what separates “interesting signal” from “real data leakage problem.”

---

## 18.12. Test 9 – `Access-Control-Expose-Headers`

If the endpoint returns non-standard headers, check whether they are exposed.

Look for things like:

- custom identifiers,
- debug headers,
- tokens,
- links to additional resources,
- metadata useful in a chain.

This is less often the main finding, but it often strengthens the overall picture.

---

## 18.13. Test 10 – `Vary: Origin`

If the response changes depending on `Origin`, and there is no:

```http
Vary: Origin
```

note the issue.

This matters especially when the response is cacheable and the trust policy depends on a request header.

It will not always produce an easy exploit, but from a security perspective it is an important detail.

---

# 19. Browser PoC Lab

Burp gives you a signal.
A browser PoC gives you proof.

For final confirmation, you want a simple page hosted on your own origin that:

- sends a request to the target,
- sets credentials if necessary,
- tries to read the response,
- displays the result or exfiltrates it elsewhere.

### Minimal PoC flow

1. Host an HTML file on `https://attacker.tld`
2. In JS, send a request to `https://target.tld/api/me`
3. If needed, use credentials
4. Read the response body
5. Display the result or send it to your listener

Only then can you honestly say:
**the browser really gave me the data**

---

# 20. How to filter out false positives in the Burp Lab

This is very important.

## False positive 1

`ACAO: *` on a public endpoint.

Usually just noise or a low-severity finding.

## False positive 2

Origin reflection, but the response contains nothing useful.

Interesting signal, but the impact may be weak.

## False positive 3

The server response looks positive, but the browser does not expose the response.

Without browser validation, do not close the conclusion too early.

## False positive 4

The request is executed, but this is not read access.

That may still be CSRF, not a classic CORS read bug.

## False positive 5

Testing only with cURL.

That is not evidence of browser behavior.

---

# 21. How to write the finding after the test

A good CORS finding should include:

- the vulnerable endpoint,
- the malicious origin that was accepted,
- whether reflection or validation bypass works,
- whether it works with credentials,
- what data could be read,
- the attack precondition,
- a simple abuse scenario.

Instead of writing:

> “Possible CORS misconfiguration may allow bypassing same-origin policy”

write:

> The `/api/profile` endpoint accepts an arbitrary `Origin` header and reflects it into `Access-Control-Allow-Origin`. Combined with `Access-Control-Allow-Credentials: true`, this allows an attacker-controlled page to read the logged-in victim’s profile data after the victim simply visits a malicious page.

That is concrete.
That is understandable.
That is reportable.

---

# 22. Final operational checklist

For every meaningful CORS test, ask yourself these questions:

- Does the endpoint have value?
- Does the response depend on the victim’s session?
- Does the backend react to `Origin`?
- Is the origin reflected?
- Are credentials allowed?
- Will the browser expose the response to JS?
- Is the request simple or preflighted?
- Does the validation look string-based?
- Is `null` accepted?
- Could the trusted origin be vulnerable, takeoverable, or legacy?
- Can you build a simple browser PoC?
- Is this a standalone bug or a good chain with XSS, CSRF, or XS-Leaks?

If you do not have answers to most of these questions, the test is not finished yet.

---

# 23. Summary

Same-Origin Policy is one of the most important security boundaries on the entire web.

CORS is not its opposite.
CORS is a controlled way of telling the browser:

> “this origin is allowed to read my responses”

The problem begins when that trust is:

- too broad,
- badly validated,
- based on reflection,
- combined with credentials,
- extended to unsafe subdomains or partners.

In offensive practice, CORS should not be tested like a checklist of headers.
CORS should be tested as a **trust boundary between origins**.

A good tester does not ask:
**“does the application have CORS?”**

A good tester asks:
**“can my page make the logged-in victim’s browser hand me data from a foreign application that I should never be allowed to see?”**

And that is exactly the level you should aim for.

Because at that point you stop merely analyzing headers.
You start analyzing the **real security model of the browser and the application**.

```

```
