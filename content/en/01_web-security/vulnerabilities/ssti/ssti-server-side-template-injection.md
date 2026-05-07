---
id: ssti-server-side-template-injection
title: "SSTI: when the user stops sending data and starts supplying logic"
team: red
domain: web-security
section: vulnerabilities
topic: server-side-template-injection
type: knowledge
angle: attacker-mindset
sourceTrack: baw
tags: ["ssti", "server-side-template-injection", "velocity", "jinja2", "tplmap", "web"]
difficulty: hard
shortDescription: "SSTI is a vulnerability in which an application interprets untrusted input as a template executed on the server side. In practice, this can lead from simple variable disclosure all the way to secret leakage, system command execution, and full Remote Code Execution."
updatedAt: "2026-04-16"
---

# SSTI: when the user stops sending data and starts supplying logic

Server-Side Template Injection is one of those vulnerabilities that is very easy to ignore if you look at an application too superficially. At first glance, everything may seem normal: a form, a few variables, a personalized message, a generated view, an email, a notification description. The real problem starts when the backend stops treating user input like plain text and instead treats it as a **template that should be interpreted and executed**.

That is the core of SSTI.

This is not about simple reflection of data. This is not about HTML. This is not about JavaScript in the browser. It is about a situation where the user provides something that the server starts treating as part of the rendering logic. At that point, the line between “data” and “code” stops being clear. And once an application starts executing an untrusted template, the consequences can become very serious.

The most important rule in this entire topic is simple:

> **a template supplied by a user should be treated as code executed on the server side**

If an application breaks that rule, SSTI becomes a real attack scenario.

---

# What a template engine actually is

A template engine is a tool that generates final content from a pattern and a set of values. That content may be HTML, an email message, a document, a text fragment, a notification, or some other presentation layer.

Instead of manually concatenating the output as a string, a developer creates a template with placeholders and then passes values into it. For example:

- the template contains a placeholder for the username,
- the backend passes the `username` value,
- the engine generates the final output.

That is normal, useful, and desirable.

So the problem is not the use of a template engine itself. The problem appears only when the user starts influencing not just the **values**, but also the **template syntax itself**.

That distinction is absolutely critical.

## Safe model

The user controls only the data that will be inserted into a predefined, trusted template.

## Dangerous model

The user controls the entire template, or a fragment of it, which is later interpreted by the engine.

In that second case, the user is no longer supplying plain text. They are supplying logic that the backend is going to execute.

---

# Where SSTI really begins

SSTI appears when an application does roughly this:

1. takes input from the user,
2. passes it into a rendering mechanism,
3. allows the template engine to interpret that input as syntax or instructions.

From the attacker’s point of view, this is a major shift. A field that looks like an ordinary text input stops being just a place for text. It becomes an entry point into an interpreter running on the server side.

That is exactly why SSTI is so dangerous.

Depending on the engine, version, context, and configuration, the result may include:

- reading variables from the application context,
- leaking secrets, tokens, and configuration,
- accessing internal objects,
- using reflection mechanisms,
- reading and writing files,
- executing system commands,
- full **Remote Code Execution**.

At that point, this is no longer just a presentation-layer issue. It is a classic case of untrusted logic being executed on the backend.

---

# Why SSTI is often underestimated

SSTI often gets lost somewhere between Cross-Site Scripting, SQL Injection, and other better-known vulnerability classes. The reason is simple: many people think of a template engine as “something for displaying content,” not as an interpreter.

That leads to a very dangerous illusion:

- “the data is HTML-encoded, so it is safe”
- “JavaScript cannot execute, so there is no issue”
- “it is only an email template / preview / footer / CMS / personalization feature”

Meanwhile, SSTI does not need to have anything to do with script execution in the browser.

---

# SSTI is not the same as XSS

This distinction needs to be internalized permanently.

## XSS

The attack works in the browser. The problem is that the application returns data in such a way that the browser interprets it as JavaScript or active HTML.

## SSTI

The attack works on the server. The problem is that the backend interprets input as template syntax and executes logic before the response ever reaches the client.

This means an application can be well protected against XSS and still be critically vulnerable to SSTI.

HTML output encoding does not solve this problem, because that protection works only at the presentation layer. SSTI happens earlier - during server-side rendering.

So the right tester mindset is:

> if a user can influence the content of something that the backend later renders as a template, SSTI should always be in the back of your mind

---

# Where you are most likely to encounter SSTI

The most classic places are all the features that sound “convenient” from a product perspective:

- custom email templates,
- personalized messages and notifications,
- editable system messages,
- HTML/PDF document generators,
- CMS platforms and wikis,
- report templates,
- workflow and automation systems,
- forms that describe patterns like “use `username` where you want the user’s name to appear.”

These are common places because they look perfectly reasonable from a business standpoint. The problem is that too much flexibility can quickly turn into an interpreter for untrusted code.

---

# The three most common vulnerability models

SSTI does not always look the same. It is useful to immediately distinguish three typical cases.

## 1. The entire user input is executed as a template

This is the simplest model. The user sends content, the backend treats it as a template, and renders it.

For example:

- the user provides the content of a message,
- the backend passes it through a template engine,
- the result is shown to the user or used further.

This is the clearest SSTI case, because initial test payloads usually work directly.

## 2. The template is built dynamically using user input

Here, the developer does not render the entire user input directly as a template, but instead “appends” it into a larger template.

That can still be vulnerable if the input lands in a location that the engine interprets.

This matters because some developers assume that model is safe just because “we are only concatenating strings.” In reality, that dynamic construction is often exactly what creates the problem.

## 3. Blind SSTI

Sometimes the rendered result is not returned anywhere. That does not mean the vulnerability does not exist. It only means there is no easy observation channel for the effect.

In that scenario, you can still test:

- response delays,
- changes in application behavior,
- parser errors,
- side effects,
- outbound connections,
- true/false logical differences.

Blind SSTI is very similar to blind SQL Injection. The mechanics change, but the way of thinking stays very similar.

---

# The most important tester mindset

With SSTI, you need to stop looking only at whether input is reflected. That is not enough.

Instead, ask questions like:

- does my input reach a rendering mechanism?
- does the backend execute a template on the server side?
- can my input become part of the syntax?
- is the template being built dynamically?
- is the result returned, or is the rendering blind?
- does the context contain interesting objects or variables?

This is no longer thinking in terms of “can I inject a tag.”  
This is thinking in terms of “can I enter the backend interpreter.”

---

# How to recognize SSTI in practice

A good SSTI analysis usually consists of several stages.

## Stage 1: find places where input may be rendered

Look for fields and features related to:

- templates,
- content personalization,
- emails,
- messages,
- documents,
- generated views,
- configurable patterns,
- descriptions containing variables like `{{username}}`, `${username}`, or similar.

The mere presence of such variables is already a strong sign that testing makes sense.

## Stage 2: check whether the input is interpreted

At this stage, you are not thinking about Remote Code Execution yet. You only want to determine whether the backend treats the input as a template.

The most common indicators are:

- a simple expression gets evaluated,
- a variable reference gets resolved,
- a nonexistent variable disappears or throws an error,
- the parser returns a syntax error,
- the response looks different from the literal input.

If you send something and the backend returns it exactly as-is, character for character, that usually suggests no interpretation.  
If the output changes, disappears, or causes a parser error, that is a very strong lead.

## Stage 3: force an error

Very often, the easiest way to confirm SSTI is to intentionally break the syntax.

That gives you two things at once:

- proof that the parser actually tried to execute something,
- sometimes the name of the engine or part of a stack trace.

That is already a major advantage, because from that point on you can start tailoring payloads to the specific engine.

---

# Identifying the engine is critical

There is no single universal payload that works against every template engine. Every engine has different syntax, a different object model, different safeguards, and different exploitation primitives.

So after confirming SSTI, the next step is:

> **determine which engine you are dealing with**

This is one of the most important parts of the entire process.

You can do that in several ways:

- by characteristic payloads,
- by responses to simple expressions,
- by parser errors,
- by stack traces,
- by the technology stack of the application,
- by product documentation,
- by how it behaves with nonexistent variables.

In practice, syntax differences are often exactly what allows you to distinguish one engine from another.

---

# What happens after SSTI is confirmed

Once you know the input is being interpreted, it is usually not worth jumping straight into the most aggressive exploitation path. A better approach is to escalate step by step.

## Step 1: understand the context

First, check what variables and objects are available. Sometimes access to the context alone reveals a lot:

- usernames,
- session data,
- tokens,
- configuration values,
- system paths,
- framework objects,
- references to the request, response, or application.

## Step 2: look for dangerous objects

You care about things that let you break out of normal rendering:

- classes,
- modules,
- reflection,
- system objects,
- helper functions,
- methods that let you create new objects or load code.

## Step 3: only then think about command execution

If the engine and context allow it, the next stage becomes:

- reading files,
- writing files,
- executing a command,
- launching a process,
- getting a shell,
- triggering a network callback.

That kind of step-by-step approach gives you a much better understanding of the application than mindlessly throwing Remote Code Execution payloads at it.

---

# Velocity: a good example of how an object leads to RCE

Velocity in the Java ecosystem is a very good example of how SSTI can lead to system command execution.

The key observation is very practical: if you can operate on objects in the template engine, you can often also reach information about their class. And if you are inside the Java ecosystem, the path from class metadata to reflection and runtime can be very short.

The thought process looks roughly like this:

1. create or obtain a normal object,
2. reach its class,
3. try to access other classes,
4. reach a mechanism that can launch a process,
5. execute a command,
6. attempt to read the process output.

The biggest value of this example is not the specific payload itself, but the understanding of the escalation path.

In SSTI, you often do not “launch the exploit” immediately.  
It is more like climbing through objects, methods, and references until you reach something truly dangerous.

---

# Freemarker: an excellent tool for developers, a very bad idea for untrusted templates

Freemarker itself is not the problem. The problem is how it is used.

If an application creates a template object directly from user input and then renders it, it becomes very easy to reach a point where the user stops controlling only content and starts influencing rendering logic.

In practice, Freemarker is especially dangerous because:

- it is feature-rich,
- it runs on the server side,
- it is used in enterprise applications,
- in a bad configuration it can lead to command execution, file access, and other very high-impact outcomes.

If you see Freemarker and dynamically created templates based on user input, you should immediately treat that area as high risk.

---

# Jinja2: a great reminder that a sandbox is not the same as real safety

In Python, you will very often encounter Jinja2, especially in Flask applications. It is a very good example of the fact that SSTI does not always look like a direct path to Remote Code Execution.

Sometimes the first real gain from exploitation is:

- secret disclosure,
- access to internal objects,
- environment information,
- a sandbox bypass,
- reading configuration data.

That is very important in practice.  
A lot of people focus only on the question: “can I get Remote Code Execution?” Meanwhile, in a real penetration test, leaking:

- a database password,
- an API key,
- an application secret,
- an integration token,
- environment-level data

can be just as dangerous, and sometimes even faster to turn into full compromise than classic shell access.

Jinja2 also teaches a second important lesson:

> a sandbox is a layer that makes attacks harder, but it should never be treated as a guarantee of safety

If the engine has a history of bypasses and the version is old, the sandbox may only raise the bar instead of eliminating the issue.

---

# Blind SSTI: how to think when you cannot see anything

Blind SSTI is a situation where the backend renders the template, but the result never appears in the response. That is very important, because many people incorrectly assume exploitation stops there.

It does not. Only the observation channel changes.

In that scenario, you look for three classes of signals.

## 1. Time-based

Does the payload introduce a response delay?  
If yes, that is a strong indication that the backend executed logic.

## 2. Boolean-based

Do different payloads cause observable differences in application behavior?  
Different status code, different response length, different error text, different redirect.

## 3. Out-of-band

Can you force the server to make an outbound connection?  
If yes, a network callback can become solid proof that the logic executed.

Blind SSTI requires patience, but it can still lead to very strong results, including command execution and shells through indirect channels.

---

# Automation: where tplmap really helps

SSTI is one of those vulnerability classes that can be automated fairly well. The reason is simple:

- engines have recognizable syntax,
- fingerprinting tests are repeatable,
- some exploit chains can be built automatically.

That is where `tplmap` becomes very useful.

The biggest value of the tool is that it quickly answers several key questions:

- which parameter is vulnerable,
- which engine is most likely running on the backend,
- whether the issue is render-based or blind SSTI,
- what capabilities are available,
- whether command execution is possible,
- whether file read or write is possible,
- whether a shell can be obtained.

That is a huge time saver.

At the same time, one thing must always be remembered:

> automation helps, but it does not replace understanding the context

If a scanner finds nothing, that does not mean SSTI is not there. It may simply mean:

- the context is unusual,
- the syntax needs to be opened or closed differently,
- the result is blind,
- the parser is partially filtered,
- the payload was wrong for the engine.

The best results come from combining automation with manual reasoning.

---

# A good methodology for testing SSTI

The most reasonable approach looks like this:

## 1. Find potential entry points

Look for features that let the user influence content rendered on the backend.

## 2. Confirm interpretation

Verify whether the input is treated as a template rather than plain text.

## 3. Force an error

The parser very often reveals on its own that you are on the right track.

## 4. Identify the engine

Without that, it is easy to waste time on the wrong syntax and the wrong payloads.

## 5. Understand the context

Do you control the whole template or only a fragment? Are you inside text, an instruction, a condition, an attribute, or somewhere else?

## 6. Enumerate capabilities

Start with variables and objects. Then move to classes, reflection, modules, file access, and command execution.

## 7. If the result is blind, switch to time-based or out-of-band methods

Lack of direct output is not the end. It is just a strategy shift.

This approach is methodical, repeatable, and far more valuable than randomly throwing payloads at the application.

---

# The most common tester mistakes

## Confusing SSTI with XSS

This is a different class of problem, a different layer, and different consequences.

## Giving up after one payload

One failed test means nothing. You may have hit the wrong engine, the wrong context, or a blind case.

## Ignoring parser errors

Very often, parser errors are the best source of fingerprinting information.

## Jumping straight to RCE

It is better to understand the context first, because a simple secret leak often gives more value than an unstable, aggressive exploit.

## Looking only at output

Sometimes success becomes visible only through delay, a callback, changed behavior, or a logical side effect.

---

# Defense: what actually makes sense

Defending against SSTI is not about one magic switch. The most effective approach is to combine several layers.

## 1. The best solution: never execute untrusted templates

This is the most important design rule.

A user may supply data to a predefined template.  
They should not supply the template itself, or fragments of syntax that the backend will later interpret.

That is the strongest possible defense.

## 2. Do not build templates dynamically from untrusted input

A very common anti-pattern is appending user data into a string that later goes into the engine. That is still a direct path to SSTI.

## 3. If the business must allow user personalization, use the most restricted engines possible

Prefer engines that mainly support variable substitution, not rich logic, reflection, or code execution.

## 4. Sandboxing

Sandboxing makes sense as an additional layer, but it should never be treated as the only safeguard. A sandbox should be viewed as friction for the attacker, not as proof that the issue is gone.

## 5. Library updates

Template engines and their sandboxes have a long history of bypasses. An old version can turn a “theoretically safe” mechanism into a real attack vector.

## 6. Host hardening

You should assume that one day someone will get execution. At that point, the decisive factor becomes the runtime environment.

Good practice includes:

- the application does not run as root,
- it has minimal privileges,
- it runs in an isolated environment,
- it does not have unnecessary file access,
- it does not have unrestricted outbound connectivity,
- secrets are limited and well separated.

This does not remove SSTI, but it greatly reduces blast radius.

---

# Defense in Depth: the only sensible philosophy

SSTI is a perfect example of a vulnerability where a single safeguard is often not enough. The most reasonable approach is to stack layers:

- no rendering of untrusted templates,
- no dynamic concatenation of templates,
- a restricted engine,
- sandboxing where it makes sense,
- up-to-date libraries,
- minimal process privileges,
- environment isolation,
- monitoring of parser errors and unusual template payloads.

This is exactly where the value of Defense in Depth becomes obvious.  
If one layer fails, the others can still reduce impact.

---

# How to think about impact

It is very easy to underestimate SSTI if you look only at the first test, such as “did it evaluate a simple arithmetic expression.”

That is only a symptom.

The real impact may include:

- leakage of application secrets,
- compromise of a service account,
- reading sensitive files,
- writing files on the server,
- executing system commands,
- pivoting into other systems,
- persistent compromise of the application host.

That is why SSTI should be treated as a **high or critical severity vulnerability**, especially when the backend renders untrusted templates using a powerful engine.

---

# A quick mental playbook

## Warning signs

- “create your own template”
- “personalize the message”
- “use the username variable”
- HTML, PDF, email, or report generation
- CMS, wiki, or editable content rendered on the server side

## First questions

- is the input being interpreted?
- can I force a parser error?
- is the output returned?
- which engine is running underneath?
- is this render-based or blind?

## Next steps

- understand the context
- enumerate objects
- identify capabilities
- attempt to read data
- escalate toward file access / command execution / shell

## The most important rule

- do not start with “give me Remote Code Execution”
- start with “understand what the backend executes and what language the template engine speaks”

---

# The most important things to remember

If only a few lines from this note were to stay with you, let them be these:

1. **SSTI appears when the backend interprets untrusted input as a template.**
2. **A template supplied by the user is not just data - it is potentially code.**
3. **The absence of XSS does not mean the absence of SSTI.**
4. **Engine identification is critical, because syntax and capabilities differ across engines.**
5. **Blind SSTI can still lead to execution and full compromise.**
6. **The best defense is to never execute untrusted templates.**
7. **If the business requires such functionality, you need a combination of restricted engines, sandboxing, updates, and strong host hardening.**

---

# Summary

SSTI is a vulnerability that often starts with something that looks completely harmless from a business perspective: a custom email template, a configurable message, convenient personalization, a generated document, or a field with placeholders.

But from a security perspective, that is no longer just a user experience feature. It is a potential opening of the backend interpreter to an untrusted user.

And that is exactly why SSTI should not be understood as a “weird template issue,” but as a full, serious class of server-side injection vulnerabilities.

Because in practice, everything comes down to one thing:

> when an application allows a user to supply logic instead of just data, the security boundary starts falling apart very quickly
