---
id: ai-top-threats-2026-mindset-and-practice
title: "AI in 2026: the biggest risks do not come from the magic of models, but from people, process, and poorly delegated agency"
team: blue
domain: soc-defensive-security
section: ai-security
type: knowledge
angle: ai-threats-governance-mindset
sourceTrack: sekurak-open
tags: ["ai", "llm", "agentic-ai", "shadow-ai", "deepfake", "phishing", "rag"]
difficulty: easy
shortDescription: "A thoughtful note on the real risks of AI, showing that the problem is less and less the model itself, and more and more the human who gives it too much trust, too much data, and too much agency without process, control, and understanding of the consequences."
updatedAt: "2026-03-31"
---

# AI in 2026: the biggest risks do not come from the magic of models, but from people, process, and poorly delegated agency

## Why I am writing this down

When it comes to AI, it is very easy to fall into two extreme mistakes.

The first: fascination.  
The second: dismissal.

Both are dangerous.  
Because the problem stops being “does AI work?” and starts becoming “who is using it, where, for what purpose, and under what control?”

What worries me most today is not that models sometimes make mistakes.  
What worries me most is that people are starting to make decisions as if the model were at the same time an advisor, an executor, and something fully worthy of trust.

That is a bad architecture of responsibility.

In practice, most AI risks do not come from one spectacular model failure.  
They come from several things happening at once: hype, lack of process, lack of data classification, badly configured permissions, too much trust, and user convenience.

## The threat landscape

Looking at it soberly, AI is no longer just an addition to work.  
It has become an operational layer.

That means model failures no longer end with a funny answer or a made-up fact.  
Today they can translate into:

- data leakage,
- more effective phishing,
- bad business decisions,
- poor implementation of access to company knowledge,
- uncontrolled agent actions,
- burned budget through cost overruns,
- loss of oversight over what has been launched.

The biggest mental shift is this: before, the model mainly answered.  
Today, more and more often, the model **acts**.  
And when a system starts acting, the classic question “is the answer good?” is no longer enough.  
You have to start asking: **what permissions does it have, what sources does it rely on, what are its boundaries, and who stops it when it does something stupid?**

## 10 things that really make a mess here

### 1. Hype is a threat in itself

Not every tool with “AI” attached to it is a breakthrough.  
It is very easy to buy into marketing narrative instead of real value.

If an organization deploys something because “everyone already has it,” then it is usually not deploying AI - it is deploying a future problem.  
Without a sensible use case, without a risk model, and without an answer to what exactly is supposed to be improved, AI becomes expensive chaos with a nice interface.

A good rule: every new AI tool should first go through a cold filter.  
Not “does it look impressive?” but “do I understand the risk, the attack surface, the input data, and the consequences of failure?”

### 2. Phishing no longer looks like phishing

This is probably one of the most practical changes.

Bad phishing used to reveal itself through language, style, poor graphics, or awkward wording.  
Today AI improves all of that at scale.

An email can sound natural.  
A website can look credible.  
An image can be polished.  
A voice can resemble a real person.

That shifts defense away from “spot weird typos” toward “verify the channel, the source, and the context.”  
Less visual intuition, more procedure.

Practical conclusion: in the era of AI-powered phishing, a human cannot be the only detection system.  
You have to strengthen identity verification processes instead of hoping the user will “feel” that something is off.

### 3. Shadow AI is the new Shadow IT, only faster and more deceptive

The most dangerous thing is not advanced deployments.  
The most dangerous thing is that an employee finds a tool on their own, launches it on their own, and feeds it things they never should.

An offer.  
A contract.  
Code with secrets.  
Customer data.  
Internal correspondence.  
Private notes.

And suddenly the organization does not even know its data has already left the controlled environment.

This is a very important distinction: the problem is not using AI itself.  
The problem is using AI **without approval, without policy, without oversight, and without understanding the consequences**.

In practice, every company should assume Shadow AI already exists.  
The real question is not “if,” but “how quickly will we detect it, and what safe alternative will we provide so people do not have to go around the rules?”

### 4. Guardrails are not a wall

This is one of the more important technical conclusions.

A model may have safeguards.  
It may have a system prompt.  
It may have a security policy.  
But that does not mean it is unbreakable.

Jailbreaking is no longer a curiosity.  
It is a real class of attack against model logic.

What is especially worrying is that bypassing protections does not have to rely on a blunt “ignore your rules.”  
It can come from subtle manipulation of role, scene, context, or persona.

That shows something important: LLM safeguards are not only a technical problem.  
They are also a problem of the psychology of language interfaces.

A model can be pushed in the wrong direction not through memory exploitation, but through context exploitation.

Conclusion: if a system relies on safety mainly because the model “should refuse,” then that is not a strong security model.

### 5. The easiest place to break things is during implementation

This is heavily underestimated.

A lot of people think about AI as a finished product, not as a new zone of configuration failure.

The most practical example is RAG and access to company knowledge.  
The idea itself is sensible: you ask the model, it reaches into the right documents, and answers based on internal data.  
Sounds great.

But if you incorrectly configure model visibility, groups, knowledge sources, or document permissions, then suddenly a user gets answers from an area they should never have been allowed to see.

That is not a flaw of “AI.”  
It is a classic access control problem dressed up in a new interface.

So the old security lesson still applies:  
**do not mix access levels just because the tool is convenient.**

### 6. A leak does not have to look like an incident

This is a very strong point.

The most dangerous leak is often not the one that is immediately visible.  
The most dangerous one is the one nobody even recognized as a leak.

The user “just pasted some text.”  
“Just uploaded a document.”  
“Just wanted a summary.”  
“Just wanted AI to improve the wording.”

But in practice, a confidential piece of information, personal data, code, negotiation context, or an image that never should have been there ends up inside the model.

On top of that, there is the issue of memory, learning, telemetry, provider policy, and where the data physically ends up.

The conclusion is simple: from a security perspective, a prompt is also a data transfer channel.  
Do not treat a chat like a notebook.  
Treat it like an external information processing system.

### 7. Cost is not a detail - it is part of the risk

With AI, it is easy to think only about answer quality.  
That is a mistake.

Model cost, context length, number of tools, number of loaded files, agent behavior, and session duration can very quickly turn into a real operational problem.

The more an agent is supposed to “help,” the more often it reads too much, loads too much, and thinks too broadly.  
And that means not only higher cost, but also a larger error surface.

That is why context management is not just prompt cosmetics.  
It is a fundamental skill for both security and cost control.

A good model does not need everything.  
A good model needs exactly what is necessary right now.

Selecting input data becomes just as important as the quality of the model itself.

### 8. Delegating trust and agency hurts more than hallucination

A hallucination is annoying.  
Delegated agency is dangerous.

If a model not only answers but starts performing actions, then the mistake stops being abstract.  
It can enter a system, modify state, launch a process, rewrite configuration, change a resource, or damage continuity of operations.

The worst part is that humans get used to convenience very quickly.  
After a few correct actions, the agent starts looking like something you can “already trust.”

And that is exactly when you need to be the most operationally stubborn.

A model should help execute a task.  
It should not take over responsibility for business consequences or security outcomes.  
That part stays with the human. Always.

### 9. Autonomous agents are useful and at the same time very easy to break

This is not about agentic AI being bad.  
On the contrary - the use cases are strong: analysis, ticket handling, administration, compliance, triage, logs, reporting, automation.

The problem starts when autonomy meets the wrong goal, the wrong context, or overly broad permissions.

Then the agent does not do something “slightly wrong.”  
It does something wrong **at scale**.

And that is the key difference.  
A script makes a local mistake.  
An agent makes a sequential, confident, logical mistake - and may even explain why it believed it was the right thing to do.

That means with agents you have to think as if you were dealing with a privileged user connected to automation.  
Because that is exactly what they become in practice.

### 10. The biggest threat is not investing in yourself

This sounds banal, which is exactly why it is dangerous.

Because it is very easy to assume the biggest problem is some exotic exploit.  
Meanwhile, the biggest problem often looks like this:

- someone does not understand model limitations,
- someone does not understand the data surface,
- someone does not understand access control,
- someone does not understand costs,
- someone does not understand when AI should only assist and when it should not touch the process at all.

At that point, every new tool will only amplify the chaos.

The real advantage today is not that you “have access to AI.”  
The real advantage is that you understand **how to use AI without handing over your judgment, your responsibility, and your critical thinking**.

## What stays in my head after filtering all of this

The strongest thought for me is this:

AI does not create a new world without rules.  
AI brutally reminds us of old security principles, only in a faster and more misleading form.

What still matters:

- least privilege,
- data classification,
- execution oversight,
- environment separation,
- conscious deployment,
- cost control,
- human in the loop,
- limited trust in automation.

The difference is that now every mistake scales faster.  
And the failures look more elegant than they used to.  
That is exactly what makes them more dangerous.

## My working model for thinking about AI

Whenever I see a new AI tool, I want to ask myself the same questions:

1. **What data goes into it?**
2. **Where does that data go?**
3. **Who has access to it?**
4. **Does the model only answer, or does it already act?**
5. **Can it change system state on its own?**
6. **How do I stop it when it goes off in the wrong direction?**
7. **How do I measure cost, not just convenience?**
8. **Does the user have a legal and safe alternative so they do not drift into Shadow AI?**

If there is no sensible answer to any of those questions, then the solution is operationally immature, even if the demo looks great.

## What is worth remembering at the end

The most dangerous model is not the one that sometimes hallucinates.  
The most dangerous model is the one to which a human has assigned too much competence, too much access, and too little oversight.

The more AI starts to look like an operator, the more we have to remember that it is still just a tool.

And the human is supposed to be the operator.
