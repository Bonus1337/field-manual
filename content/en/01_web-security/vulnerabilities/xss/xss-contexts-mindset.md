---
id: xss-contexts-mindset
title: "XSS: Context Is Everything"
team: red
domain: web-security
section: vulnerabilities
topic: cross-site-scripting
type: knowledge
angle: attacker-mindset
sourceTrack: baw
tags: ["xss", "dom-xss", "javascript", "web", "frontend", "sanitization", "secure-coding"]
difficulty: medium
shortDescription: "XSS is not just an alert box in the browser. It is the ability to run your own logic inside someone else’s context. The real key is not the payload itself, but understanding where the data lands and what that enables."
updatedAt: "2026-04-06"
---

# XSS: Context Is Everything

XSS is very often treated too lightly. In many materials, it starts and ends with `alert(1)`, which makes it easy to fall into the illusion that it is flashy, but not necessarily dangerous. That way of looking at it flattens the whole problem. `alert(1)` is not the goal. It is only the simplest proof that we managed to get our code executed in the application’s context. And if one line of JavaScript can run there, then any other logic can run there too.

That is where the perspective changes. XSS is not “a popup in the browser”, but the ability to act as the victim. That means reading what the logged-in user can see, performing the actions that user is allowed to perform, and abusing the trust the browser gives to code running inside that application. In practice, this is often not just a visual bug. It is full entry into someone else’s workflow.

## The most important thing: do not think of XSS as one single type of bug

One of the biggest takeaways here is that XSS should not be analyzed as a single yes-or-no category. It is much more useful to think of it as a family of problems that appear when untrusted data lands in a place where the browser gives it executable meaning.

That may be:

- tag body content,
- an attribute value,
- a URL attribute,
- a string inside JavaScript code,
- an event handler,
- a dynamically built DOM fragment,
- frontend logic based on `location`, `postMessage`, `cookie`, `fetch`, `eval`, and similar mechanisms.

This is exactly the point where the mindset of “just encode HTML entities and the problem is solved” falls apart. The problem does not disappear. It just changes shape.

## “HTML encoding” alone is not a strategy. It is only one part of a strategy

This is one of those topics that is very easy to understand in the wrong way. If somebody remembers only that XSS is about replacing `<` and `>` with entities, they may defend against some of the simplest cases, but they will still lose against more realistic scenarios.

Because the issue is not just HTML tags. The issue is how the browser interprets a given fragment of the document.

If the input lands:

- between tags - one defensive method may be enough,
- inside an attribute - now you have to think about breaking out of that attribute,
- inside an unquoted attribute - suddenly a space becomes a “special character”,
- inside `href` or `src` - the URL format itself becomes the execution vector,
- inside a JavaScript string - now you are defending against the JavaScript parser, not HTML,
- inside a handler like `onclick` - now several context layers overlap.

This leads to a very practical conclusion: XSS is not defended globally. XSS is defended contextually.

## Context is everything

This is probably the most important idea in the whole topic. There is no universal XSS payload, and there is no universal XSS defense. Everything depends on where the data is placed.

The exact same input:

- in one place will be displayed as text,
- in another will break an attribute,
- in another will create a new tag,
- in another will become JavaScript code,
- in another will activate `javascript:` or an event handler,
- in another will never touch the server at all, yet still execute in the browser.

This is exactly why XSS keeps coming back despite years of knowledge, filters, and libraries. The problem is not that developers do not know what XSS is. The problem is that it is very easy not to notice the _exact_ context in which the data is being used.

## DOM XSS is great for building the right mindset

Classic reflected or stored XSS still gives the illusion that the payload has to be pushed through the backend. DOM XSS breaks that mindset completely. It shows that sometimes the server does not need to be part of the execution chain at all.

If the application takes data from:

- `location.hash`,
- `location.search`,
- `document.cookie`,
- `postMessage`,
- API responses,
- browser storage,

and then puts it into:

- `innerHTML`,
- `outerHTML`,
- `insertAdjacentHTML`,
- `document.write`,
- `eval`,
- `Function`,
- `setTimeout(string)`,
- `location`,
- `href`,
- `src`,
- `action`,

then the whole problem is happening entirely inside the browser.

That is a very strong practical lesson: with DOM XSS, you no longer look only for places where input is reflected. You look for the data flow from source to sink. From entry point to execution. From user-controlled input to the place where the browser or the JavaScript engine gives that data special meaning.

That is much closer to flow analysis than to testing one parameter.

## Reflected, stored, and DOM are not just three labels. They are three different attack models

It helps to understand them not as terms to memorize, but as different delivery models for getting your logic to the victim.

### Reflected XSS

Here, the key is delivering the payload in the request and getting it reflected back. In practice, that usually means: a link, social engineering, a message, a click.

### Stored XSS

Here, the payload is already waiting for the victim. You do not need to guide them directly. You only need them to visit a place they would normally visit anyway.

### DOM XSS

Here, the payload may not even pass through the server. The frontend can build the bomb for you using its own mechanisms.

That matters, because it changes how you think during testing:

- with reflected XSS, you look for reflection and delivery conditions,
- with stored XSS, you look for persistent storage points and triggers,
- with DOM XSS, you look for data flow inside JavaScript code.

## The real weight of XSS is not execution itself, but the consequences

It is very easy to underestimate XSS if you only see it through the lens of a popup. The real mindset shift is this: XSS gives access to whatever the victim can do in their own session.

That includes, among other things:

- reading data visible inside the application,
- performing actions the user normally clicks,
- sending requests in the user’s context,
- exfiltrating tokens, keys, and business data,
- phishing inside a legitimate origin,
- modifying the interface,
- hijacking the user’s flow.

In other words, XSS often does not just attack the application. It attacks the relationship between the user and the application.

And that is much more dangerous than the code itself.

## A very common mistake: confusing “I can inject HTML” with “I have XSS”

This is an important distinction. Not every HTML injection leads to JavaScript execution. But at the same time, HTML injection is often the first sign that the boundary between data and code has already been broken.

For a practitioner, that means a simple thinking sequence:

1. Does the input come back?
2. Where does it come back?
3. How is it interpreted?
4. Can I change the context?
5. From that point, can I reach code execution?

That gives a much better methodology than blindly pasting payloads from a cheat sheet.

## The most dangerous places are the ones that look “almost safe”

What I really like about this topic is that the most interesting cases often do not come from having zero protection. They come from partial protection.

These are cases like:

- somebody encodes only HTML, but does not understand URL context,
- somebody filters `<script>`, but leaves event handlers,
- somebody blocks parentheses, but does not understand entities and escapes,
- somebody trusts the framework, but also uses `dangerouslySetInnerHTML`,
- somebody has autoescaping in templates, but dynamically builds the template itself,
- somebody validates input, but the value still ends up inside `eval`,
- somebody separates data from HTML on the backend, but the frontend still builds unsafe DOM.

All of this leads to one very practical conclusion: partial defense often creates a false sense of security, and that can be worse than having no defense at all, because it puts people to sleep.

## Nested contexts are where people lose

One of the strongest mental models for XSS is understanding that contexts can stack on top of each other.

For example:

- HTML contains an attribute,
- the attribute contains JavaScript,
- JavaScript works on a string,
- the string contains a URL,
- the URL supports its own encoding rules.

In that kind of setup, one “good encoding” is not enough. You have to understand every single layer separately. And this is exactly where the difference appears between mechanically applying security functions and actually understanding parsers.

It also explains why many defenses fail not because they were completely wrong, but because they were only correct for one layer.

## A framework is not an absolute shield

Modern frameworks help, but they do not solve everything. If the view is generated through safe templating with autoescaping, a large part of classic XSS disappears. But that still does not protect against:

- dangerous DOM APIs,
- manual HTML injection,
- incorrect sanitizer handling,
- dynamic template construction,
- URLs with dangerous protocols,
- logic based on `eval` or similar mechanisms.

That is an important conclusion in practice: a framework reduces one class of bugs, but it does not remove the need to think. You still need to know where the framework’s safety ends and the developer’s handwritten logic begins.

## If you must allow HTML, do not try to filter it “cleverly”

This is one of those areas where creativity often becomes a liability. Approaches like:

- regex for tags,
- stripping the word `script`,
- removing `onerror`,
- blocking parentheses,
- manual blacklists,

very often end in bypasses. Not because the idea is completely stupid, but because HTML and JavaScript have too many parser edge cases for ad hoc filtering to stay reliable.

If the application needs to allow fragments of HTML, it makes far more sense to think in terms of:

- parsing,
- allowlisting,
- sanitization,
- the smallest possible allowed set of tags and attributes.

In other words: do not try to guess what is bad. Define what is allowed.

## File upload is also an XSS surface

This is another thing that is easy to overlook. If a user uploads a file and the application serves it from the same origin, then XSS no longer has to come from a parameter or a form. Sometimes it is enough for the browser to treat that format as active content.

The most practical conclusion is simple: user files should not live in the same trusted context as the main application. Origin separation makes far more sense than trying to predict every dangerous extension and format.

This is not just an architecture detail. It is a real security control.

## Browser filters are not a strategy

It is very easy to fall into the mindset of “the browser will probably block something anyway”. That is exactly the kind of comfort that later turns into a production vulnerability.

Mechanisms on the browser side may sometimes reduce the impact of simple cases, but:

- they do not cover every variant,
- they depend on browser implementation,
- they may be removed,
- they may be bypassed,
- they do not replace correct application code.

This is not a layer you can build security on. At best, it is an emergency cushion, not a seatbelt.

## How to think about XSS during testing

The most useful mental model for me looks like this:

### 1. Do not ask immediately: “Is there XSS?”

First ask: where does the input land, and what role does it receive inside the document or the code?

### 2. Look for context, not payload

The payload is secondary. First you need to understand the parser and the exact placement.

### 3. Look for source → sink flow

Especially in frontend code. This often looks more like data flow review than classic fuzzing.

### 4. Think about consequences, not only the trigger

If you can already execute code, then the most interesting question is: what can I do as the victim?

### 5. Treat every “almost safe” place with suspicion

The most interesting cases often live exactly where somebody implemented protection only halfway.

## What is worth remembering

XSS is not one bug. It is an entire class of flaws that come from mixing data and code in the wrong place.

What matters most is not whether the payload contains `<script>`, but:

- where the input lands,
- how the browser interprets it,
- whether the context can be changed,
- whether there is a path from controlled data to execution.

The biggest mistake in thinking about XSS is reducing it to `alert(1)`.
The biggest value in learning XSS is understanding parsers, contexts, and consequences.
The biggest practical advantage is learning to see the application as a system of data flows, not as a collection of isolated input fields.

Because in the final analysis, XSS is not about the browser showing a popup.
It is about someone else’s application starting to execute our logic.
