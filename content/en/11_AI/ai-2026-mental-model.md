---
id: ai-2026-mental-model
title: "AI Without the Hype - How to Actually Think About Modern Models"
team: red-blue
domain: artificial-intelligence
section: ai-fundamentals
type: knowledge
angle: mental-model
sourceTrack: narzedziownik-ai
tags:
  [
    "ai",
    "llm",
    "lrm",
    "agents",
    "rag",
    "context",
    "tokens",
    "mcp",
    "harness",
    "automation",
    "hitl",
  ]
difficulty: medium
shortDescription: "A note that organizes modern AI from the basic mental model of how LLMs work, through tokens, context, RAG and agents, all the way to automation, Human in the Loop and the practical question: where AI actually gives us leverage, and where a human still needs to stay in control."
updatedAt: "2026-10-03"
---

# AI Without the Hype - How to Actually Think About Modern Models

## Why I am writing this note

Because AI has become one giant bag of terms.

ChatGPT, LLM, reasoning, agent, RAG, MCP, local models, automation, memory, tools.

We call all of it AI.

And because of that, it is surprisingly easy to use these systems every day while still not having a good mental model of what is actually happening underneath.

I do not want to memorize the names of the newest models.

Half of them will be outdated in a few months anyway.

I want to understand:

- how a model differs from the entire system built around it,
- where the model gets its answer from,
- why it can sound confident while being completely wrong,
- how an LLM differs from an agent,
- what RAG actually gives me,
- why tools, skills and MCP exist,
- when AI can be allowed to act on its own,
- and when a human absolutely needs to stay inside the process.

The most important thing for me is this:

**AI is not a magical machine that gives correct answers.  
It is a component of a system, and both its usefulness and its risk depend on what we build around it.**

---

# The most important mental model to start with

One of the biggest mistakes in thinking about AI looks like this:

> I have ChatGPT, so I have an AI model.

Not exactly.

What I interact with through an interface may already be a complete system made of:

- a model,
- system instructions,
- memory,
- tools,
- internet access,
- search,
- RAG,
- code execution,
- an agent,
- permission controls,
- security mechanisms.

The model itself is only one part.

A mental shortcut that works well for me:

**model = brain**

**context = what the brain can currently see**

**tools = hands**

**harness = the body and control system**

**agent = a model that has been given the ability to take actions**

And that is where things start to get interesting.

---

# AI did not start with ChatGPT

It is worth remembering mainly because it prevents me from treating the current generation of models as something that suddenly appeared out of nowhere.

AI developed in waves.

First came attempts to describe an artificial neuron.

Then Turing asked the famous question:

> can machines think?

Later, ELIZA demonstrated something that may have been even more interesting.

Not that computers were intelligent.

But how easily humans could attribute intelligence to a system that merely simulated it well enough.

And that problem has returned today with much more force.

Modern models are far more convincing than ELIZA ever was.

But our brains are still vulnerable to the same shortcut.

If something:

- responds fluently,
- remembers context,
- speaks our language,
- reacts to emotions,
- makes jokes,
- and answers within seconds,

it becomes very easy to start treating it like another human being.

That is a dangerous cognitive shortcut.

**The quality of a conversation is not proof of the quality of reasoning behind it.**

---

# What actually changed in AI

For decades, several things were missing at the same time.

We needed:

- massive amounts of data,
- massive computing power,
- an architecture capable of using both effectively.

Eventually, those three pieces came together.

The internet gave us data.

GPUs gave us parallel computation.

The Transformer gave us an architecture that could use both at scale.

In 2017, the Transformer architecture appeared.

That is where the **T** in GPT comes from.

The important idea for me is not the name itself.

It is attention.

When processing a token, the model can consider other tokens in the current context and estimate which ones matter most for the current prediction.

And suddenly it turned out that when we:

- add more data,
- add more compute,
- increase model capacity,

quality tends to improve in increasingly useful ways.

That was the point where scale really started to matter.

---

# AI, ML, DL, GenAI, LLM, LRM - how not to mix them up

I do not want to think about these names as six unrelated technologies.

It is easier to treat them as increasingly narrower concepts.

## Artificial Intelligence

The broadest category.

A system performs tasks that we normally associate with intelligence.

---

## Machine Learning

Instead of programming every rule manually:

```text
IF X
THEN Y
```

we provide data and allow the system to learn patterns.

For example:

I do not manually describe every possible characteristic of spam.

I provide thousands of examples:

```text
SPAM
NOT SPAM
SPAM
SPAM
NOT SPAM
```

and the model learns the boundary between the classes.

---

## Deep Learning

Machine Learning based on multi-layer neural networks.

Instead of manually defining:

> look for a nose, eyes and a mouth,

successive layers can learn useful representations on their own:

```text
pixels
↓
edges
↓
shapes
↓
parts of objects
↓
object
```

The same idea can be applied to language.

---

# GenAI

Generative AI does not only classify things.

It creates them.

It can generate:

- text,
- code,
- images,
- audio,
- video,
- documents.

And this is the part of AI that exploded into mainstream use.

Not because artificial intelligence suddenly appeared.

But because we received an incredibly simple interface:

**natural language.**

I do not need to know an API.

I do not need to know Python.

I do not need to understand how the model works.

I can simply write:

> do X for me

and the system attempts to turn my intent into a result.

That dramatically lowers the barrier to entry.

---

# LLM - a machine predicting the next token

This sentence sounds almost insultingly simple.

That is exactly why it matters.

An LLM receives a sequence of tokens and tries to predict:

**what token is most likely to come next?**

It does not retrieve one fixed answer from a database.

It creates a probability distribution over possible continuations.

For example:

```text
The capital of Poland is...
```

a token related to Warsaw should receive extremely high probability.

But the more a question becomes:

- niche,
- ambiguous,
- poorly represented in training data,
- dependent on current information,

the easier it becomes for the model to generate something that **fits linguistically** without being true.

And this leads to one of the most important ideas in modern AI.

**The model is optimized to generate a plausible continuation.
It does not contain a built-in guarantee that the continuation is true.**

---

# Token - the smallest unit worth remembering

A model does not see text exactly the way a human does.

Text is split into tokens.

A token may be:

- a whole short word,
- part of a word,
- a character,
- part of a string.

Why do I care?

Because a token is simultaneously:

- part of the model's input,
- part of its output,
- part of the context limit,
- often a unit used for API pricing.

So in practice:

```text
text
↓
tokenization
↓
model
↓
output tokens
↓
text
```

---

# Context - the model's working memory

This is one of the most important concepts to understand.

The model responds based on what currently exists inside its context.

That may include:

- my prompt,
- previous messages,
- the system instruction,
- a document,
- a tool result,
- a search result,
- memory injected by the application.

So:

**context = everything the model can currently see and use while generating its next response.**

The context window defines how much of that information can be supplied at once.

And there is an important misconception here:

> bigger context = the model remembers everything perfectly.

No.

The ability to fit a million tokens does not mean that every fragment is used equally well.

I prefer to think of it as a huge desk rather than photographic memory.

You can put one hundred documents on the desk.

The challenge is still finding the correct one exactly when you need it.

---

# Embedding - meaning represented as numbers

This concept sounds much more magical than it really is.

An embedding is a numerical representation of meaning.

The idea is that texts with similar meaning should exist close to each other in vector space.

For example:

```text
"reset a user's password"

"recover access to an account"
```

may be semantically closer than:

```text
"reset a user's password"

"CPU temperature"
```

even though they do not contain exactly the same words.

This becomes extremely useful when searching through knowledge.

---

# Chunk - because documents need to be split first

If I have a 300-page document, I usually do not want to send all 300 pages to the model every time I ask a question.

So the document is divided into smaller pieces.

Chunks.

For example:

```text
PDF
↓
chunk 1
chunk 2
chunk 3
chunk 4
...
```

An embedding can be generated for each chunk.

Then, when I ask:

> what are our requirements for password resets?

the system can retrieve the fragments that are semantically closest to my question.

And that is where RAG comes in.

---

# RAG - retrieve first, answer second

Retrieval Augmented Generation.

One of those names that sounds much worse than the actual idea.

Instead of answering only from information encoded in the model parameters, the system:

1. receives a question,
2. searches for relevant source fragments,
3. adds those fragments to the context,
4. only then asks the model to generate an answer.

So:

```text
user question
      ↓
   retrieval
      ↓
relevant document chunks
      ↓
    context
      ↓
      LLM
      ↓
    answer
```

This is fundamentally different from:

> teach the model our documents.

RAG usually **does not change the model itself**.

It gives the model the right knowledge at the moment the task is executed.

That distinction matters a lot.

---

# RAG != fine-tuning

I especially want to keep this difference clear.

## RAG

Give the model relevant knowledge **through context**.

## Fine-tuning

Change the behavior or specialization **of the model itself**.

If a company policy changes:

with RAG I can replace the document.

I do not need to retrain the model.

That is one reason RAG makes so much sense in internal knowledge systems.

---

# Multimodality

Modern models are becoming less and less text-only.

A model may receive:

- text,
- screenshots,
- photographs,
- PDFs,
- audio,
- sometimes video,

and work across several modalities.

For me, that means the interface to the model is no longer limited to a text prompt.

I can show it:

```text
screenshot of an alert
```

and ask:

> what looks suspicious here?

Or provide:

```text
architecture diagram
```

and ask:

> identify the trust boundaries.

That becomes much more interesting than a traditional chatbot.

---

# LRM - when a single response is not enough

A basic LLM can be simplified as:

```text
prompt
↓
answer
```

Reasoning models attempt to spend more computation on solving the problem.

In practice, this tends to help with tasks that require:

- planning,
- breaking problems into smaller steps,
- analyzing dependencies,
- validating intermediate results,
- solving multi-stage problems.

But I do not want to turn this into another fake magical boundary:

```text
LLM = dumb
LRM = thinks like a human
```

It is still a generative model.

It simply uses additional mechanisms and compute that allow it to do more work before producing the final answer.

---

# The biggest transition: from answering to acting

This is where the calm world of chatbots ends.

A chatbot answers:

```text
How do I delete this file?
```

An agent may receive:

```text
Delete this file.
```

That is a fundamental difference.

The first system provides information.

The second one changes reality.

---

# Agent

The simplest agent model I want to remember is:

```text
GOAL
 ↓
PLAN
 ↓
ACTION
 ↓
OBSERVATION
 ↓
was the goal achieved?
 ↓
NO → next step
YES → stop
```

An agent does not need to solve the entire problem in one response.

It can:

- plan,
- call a tool,
- observe the result,
- change the plan,
- call another tool,
- repeat the loop.

This dramatically increases capability.

But it also increases attack surface.

---

# Tool - the model's hand

An LLM by itself does not open a website.

It does not send an email.

It does not execute SQL.

It does not delete a file.

It needs a function that the surrounding system allows it to invoke.

That is a tool.

For example:

```text
search_web(query)

read_file(path)

send_email(to, body)

execute_sql(query)
```

The model decides:

> I need to use this tool.

The harness executes the operation.

The result is returned to the model.

And the model decides what to do next.

---

# Harness - the infrastructure around the model

This is one of the most useful concepts because it stops me from attributing capabilities to the model that actually belong to the surrounding system.

The harness may be responsible for:

- tools,
- memory,
- instructions,
- permissions,
- code execution,
- the agent loop,
- user approvals,
- logging,
- retries,
- security restrictions.

So:

```text
           ┌───────────┐
           │   MODEL   │
           └─────┬─────┘
                 │
        ┌────────▼────────┐
        │     HARNESS     │
        │                 │
        │ tools           │
        │ memory          │
        │ permissions     │
        │ agent loop      │
        │ approvals       │
        │ logs            │
        └────────┬────────┘
                 │
            real world
```

This is why two products using similar underlying models may behave completely differently.

The model is only the engine.

The rest of the car still matters.

---

# Skill

I treat a skill as a reusable capability that an agent can invoke.

Instead of figuring out from scratch every single time:

> how should I perform analysis X?

the agent receives a predefined procedure.

That procedure may contain:

- instructions,
- scripts,
- the order of operations,
- rules for interpreting results.

At that point, we are no longer only building something that is "intelligent".

We are building something that knows how the organization performs specific work.

---

# MCP

Model Context Protocol is easiest for me to think about as a common way of connecting AI systems to external tools and services.

Without a shared standard, every provider would need separate integrations:

```text
AI ↔ GitHub
AI ↔ Jira
AI ↔ database
AI ↔ filesystem
AI ↔ Slack
```

MCP attempts to standardize part of that problem.

And that matters not because MCP is trendy.

It matters because with agents, the most important question gradually stops being:

> what does the model know?

and becomes:

> **what does the model have access to?**

From a security perspective, that is a huge difference.

---

# Closed models, open weights and open source

These concepts are often thrown into the same bucket.

They should not be.

## Closed model

I consume a service operated by a provider.

I do not have the weights.

I do not control the infrastructure.

Depending on the product, configuration and contract, my data may leave my environment.

In exchange, I usually get:

- a very capable model,
- simplicity,
- no infrastructure maintenance,
- ready-made tools.

---

## Open weights

I have access to the model weights.

I can often run the model locally.

But that does not automatically mean:

- an open training process,
- open training data,
- unrestricted licensing.

So:

**open weights ≠ automatically open source.**

---

## Open source

Here I care primarily about transparency:

- code,
- licensing,
- ability to inspect the implementation,
- ability to modify it.

But even here, the license always needs to be read.

The word "open" does not remove the need to think.

---

# Local models - not because they are cool

Running a model locally gives me one very interesting property:

**I can control the data path.**

If the complete pipeline actually stays local:

```text
document
↓
local embedding
↓
local database
↓
local LLM
↓
answer
```

then the data does not have to leave my environment.

But local execution does not automatically solve every security problem.

I still have:

- permissions,
- host security,
- supply chain risk,
- vulnerable libraries,
- interface security,
- prompt injection,
- malicious input,
- incorrect output.

**Local does not mean secure.
Local mainly gives me control over infrastructure and data flow.**

---

# Hallucination - when the model sounds better than it knows

This may be the most deceptive property of LLMs.

The model may not know something.

But the interface does not respond with:

```text
ERROR 404: KNOWLEDGE NOT FOUND
```

Instead, I may receive a perfectly written answer.

So the problem is not only that the model can be wrong.

The bigger problem is:

**the error can be wrapped in an extremely convincing form.**

That means I need to separate two things:

```text
quality of writing
```

from:

```text
reliability of information
```

They are not the same thing.

---

# The biggest AI paradox

The better the models become, the easier they are to trust.

And that is exactly when the cost of misplaced trust increases.

A weak chatbot:

- writes strangely,
- makes obvious mistakes,
- gets checked by the human.

A strong agent:

- writes extremely well,
- remembers context,
- uses tools,
- makes plans,
- completes 49 tasks correctly.

And on task 50, the human stops looking.

That is **automation bias**.

And it may become one of the biggest practical problems in agent deployments.

---

# Human in the Loop

The simplest version looks like this:

```text
AI proposes an action
        ↓
human approves
        ↓
system executes
```

Example:

```text
Delete cache.tmp?

[YES] [NO]
```

This looks trivial.

But it creates a very important boundary:

**the model can propose an operation, but it cannot cross an irreversible point on its own.**

This becomes especially important for:

- deletion,
- sending,
- publishing,
- configuration changes,
- payments,
- permission changes,
- production operations.

---

# The problem with "Yes, and remember"

Human in the Loop has one major weakness.

The human.

If an agent asks me 40 times per day:

```text
Do you allow this?
Do you allow this?
Do you allow this?
Do you allow this?
```

I stop analyzing the question.

I start clicking.

And when the system offers:

```text
Allow always
```

the temptation becomes enormous.

At that point, the security control may still exist formally while being practically disabled.

It is very similar to classic warning fatigue.

**An approval that the user no longer reads is no longer a meaningful security control.**

---

# Human on the Loop

The second model looks different.

The AI operates autonomously.

The human watches:

- logs,
- metrics,
- alerts,
- anomalies.

And has the ability to interrupt execution.

So:

```text
          AGENT
       ↙    ↓    ↘
    action action action
          ↓
         logs
          ↓
        HUMAN
          ↓
      KILL SWITCH
```

This can make sense when the number of operations is so high that manually approving each one would destroy the value of automation.

---

# Full autonomy

And finally:

```text
AI
↓
decision
↓
action
```

with no human intervention.

Technically, we can build this today.

That does not mean we should.

The real question is:

**what happens when the model makes a mistake?**

Not:

> will the model make a mistake?

But:

> when it eventually does, what is the blast radius?

---

# The best decision model: cost of error × ease of verification

This may be the most practical concept in the whole topic.

I have two axes:

```text
                 EASY TO VERIFY
                       ↑
                       |
                       |
LOW COST -------------+------------- HIGH COST
OF ERROR               |              OF ERROR
                       |
                       |
                       ↓
                HARD TO VERIFY
```

Now things become much clearer.

## Low cost of error + easy to verify

A great place for automation.

Examples:

- tagging,
- transcription,
- email drafts,
- simple data extraction,
- formatting,
- document classification.

The model makes a mistake?

I fix it.

Nothing catastrophic happens.

---

## Low cost of error + hard to verify

AI can still help.

But I may not want to immediately deploy a fully autonomous agent.

A better model is often:

```text
human
   +
AI as copilot
```

---

## High cost of error + easy to verify

This becomes very interesting.

AI can perform a large part of the work.

But the output should go through validation.

For example:

```text
AI prepares
↓
validation
↓
human / second system
↓
execution
```

This is where agents with verification loops and strong controls can make a lot of sense.

---

## High cost of error + hard to verify

This is where the red light comes on.

If:

- the mistake is expensive,
- and I cannot easily detect that the model made it,

then giving it autonomy is a terrible idea.

Especially in decisions involving:

- health,
- law,
- finance,
- security,
- critical data,
- people.

---

# Do not automate chaos

This sentence deserves its own section.

If the process is badly defined:

```text
human creates chaos
```

then after adding AI I get:

```text
AI creates chaos faster
```

Automation does not repair a process.

It scales the process.

So if nobody can answer these questions before deploying an agent:

- what is the goal,
- what are the inputs,
- what are the exceptions,
- who is responsible,
- what does a correct result look like,
- when should the operation stop,

then we probably do not have an AI problem yet.

We have an organizational problem.

---

# Explainable AI - be careful with the word "why"

This is a very deceptive topic.

I can ask the model:

> why did you make that decision?

and receive a beautiful explanation.

But I need to remember:

**that explanation is also generated text.**

I should not automatically treat it as a faithful dump of the internal reasoning process.

In systems where the decision really matters, I trust these things more:

- sources,
- logs,
- tool calls,
- retrieved documents,
- input parameters,
- an auditable execution pipeline,

than a beautiful paragraph beginning with:

> I made this decision because...

---

# Where AI already genuinely makes sense

I do not need a fully autonomous agent everywhere.

AI is already very useful as an assistance layer.

Good examples:

## Back office

- documents,
- email,
- calendars,
- classification,
- extraction,
- knowledge retrieval.

## Software development

- code scaffolding,
- understanding existing projects,
- refactoring,
- tests,
- documentation,
- bug hunting.

## Cybersecurity

- log analysis,
- alert classification,
- code review,
- hypothesis generation,
- research,
- processing large amounts of data.

But cybersecurity has one particularly easy trap:

**a model does not replace understanding of the system.**

If a vulnerability requires understanding:

- business logic,
- relationships between objects,
- user permissions,
- application state,

the model may struggle much more than with a simple recognizable pattern.

---

# AI in cybersecurity - how I want to think about it

Not as:

> AI will perform the pentest.

But as:

```text
human
↓
creates a hypothesis
↓
AI helps process information
↓
human evaluates the result
↓
next hypothesis
```

AI is an excellent multiplier.

But:

**if I multiply zero domain knowledge, I still get zero.**

The pentester still needs to know:

- what to look for,
- why something looks suspicious,
- what normal behavior looks like,
- which test makes sense,
- when a result is a false positive.

The model can dramatically accelerate the path.

It should not choose the destination for me merely because it sounds confident.

---

# What changes in the job market

The question I care about least is:

> will AI take people's jobs?

That is too broad.

A much more useful question is:

> **which parts of human work are becoming less valuable, and which are becoming more valuable?**

The tasks under the most pressure are things like:

- copying data,
- repetitive reporting,
- first drafts,
- simple translations,
- basic first-line support,
- scheduling meetings.

Basically, work that can be described as:

```text
take input A
↓
perform repeatable transformation
↓
return B
```

The interesting work starts moving toward:

- validating AI output,
- accountability,
- making decisions,
- talking to people,
- system design,
- security,
- data quality,
- integrating multiple systems.

At the same time, completely new roles are growing around AI itself:

- AI governance,
- AI red teaming,
- agent operators,
- knowledge-base owners,
- AI compliance,
- agent engineering.

That leads me to a simple conclusion.

**Human value is shifting away from producing the first output and toward understanding whether the output actually makes sense.**

---

# The most valuable AI skill is not called prompting

Prompting is useful.

But if models keep improving, the ability to write the perfect prompt will become less unique.

Something more important is emerging.

## Context engineering

Meaning:

> what should the model know at the exact moment it performs the task?

That means controlling:

- sources,
- history,
- memory,
- instructions,
- documents,
- tools,
- permissions.

A strong model with bad context can produce a bad answer.

A weaker model with excellent context can be surprisingly effective.

---

# How to choose AI for a task

I do not want to start with:

> which model is currently the best?

I want to start with:

> what am I actually trying to do?

Questions:

### Can the data leave the device?

If not:

→ a local model becomes interesting.

### Do I need current information?

If yes:

→ the model needs search or access to current sources.

### Am I working with internal documents?

→ RAG / connectors / controlled context.

### Do I only need an answer?

→ a chatbot may be enough.

### Do I need real actions to be performed?

→ agent + tools.

### Are the actions irreversible?

→ approval / HITL.

### Is the cost of failure high?

→ additional validation.

Only after that do I care about the model name.

---

# How I look at agent security

A traditional LLM primarily deals with information.

An agent receives capabilities.

So the threat model changes from:

```text
could the model generate something bad?
```

to:

```text
could the model do something bad?
```

That is a much more serious problem.

So I care about:

- which tools it can access,
- what permissions those tools have,
- which data it can read,
- where it can write,
- what it can delete,
- whether it can execute code,
- whether actions are logged,
- where approval is required,
- whether there is a kill switch.

The most important security boundary of an agent is often not inside the model.

It is inside the **harness**.

---

# Least privilege comes back again

An agent should receive exactly the capabilities it needs.

Not:

```text
calendar agent
→ full access to the entire workspace
```

but:

```text
calendar agent
→ read calendar
→ create events
```

If it does not need DELETE:

do not give it DELETE.

If it does not need SEND:

do not give it SEND.

If READ is enough:

do not give it WRITE.

AI did not invent a new security model here.

We are back to good old:

**least privilege.**

---

# What I want to check as a security analyst / pentester

When testing an AI-enabled system, I do not care only about the prompt.

I want to understand the entire pipeline.

## 1. What data reaches the model

- documents,
- PII,
- company secrets,
- credentials,
- logs,
- customer data.

## 2. Where that data goes

- SaaS,
- API,
- local model,
- external provider.

## 3. What enters the context

Can the user influence instructions or documents that are later consumed by the model?

## 4. Which tools the agent has

This is often much more important than the model itself.

## 5. What permissions those tools have

Does the agent really need full read-write access?

## 6. Which actions require approval

Especially irreversible operations.

## 7. How logging works

I want to know:

```text
what the model received
→ what it decided
→ which tool it called
→ with which parameters
→ what the result was
```

## 8. Whether a kill switch exists

Because a production agent that cannot be stopped quickly is a bad production agent.

---

# What I want to build as a developer / architect

## 1. The model cannot be the entire security boundary

I do not want security that looks like:

> we wrote in the system prompt that the model should not do it.

A prompt does not replace access control.

---

## 2. Enforce permissions outside the model

If a user cannot read a document:

the model should not receive the document either.

I do not ask the LLM:

> is this user allowed to see the file?

The system should already know the answer.

---

## 3. Separate sources from generated text

If an answer will be used to make an important decision:

I want to know where it came from.

---

## 4. Irreversible operations need stronger controls

DELETE, SEND, DEPLOY, PAY, GRANT.

That is a completely different risk class than READ.

---

## 5. Log everything

An agent without auditability is a black box connected to infrastructure.

That sounds bad because it is bad.

---

## 6. Design for failure

I do not assume:

> the model will be correct.

I assume:

> eventually, the model will do something strange.

And I design the system so that one bad decision does not end the game.

---

# Quick reference - 20 concepts

**AI**
the broadest category of systems performing tasks associated with intelligence.

**ML**
learning patterns from data.

**DL**
machine learning based on multi-layer neural networks.

**NLP**
natural language processing.

**GenAI**
AI that generates new content.

**LLM**
a large language model predicting the next token.

**LRM**
a model using additional reasoning before producing the final response.

**Token**
a piece of model input or output.

**Prompt**
instructions and data supplied to the model.

**Context**
everything the model can currently see.

**Embedding**
a numerical representation of meaning.

**Chunk**
a fragment of a larger document.

**RAG**
retrieve relevant information first, then generate an answer.

**Multimodality**
working across more than one data type.

**Hallucination**
a plausible-sounding answer that is not grounded in reality.

**Agent**
a model that operates iteratively and uses tools.

**Tool**
a function the model is allowed to call.

**Skill**
a reusable procedure available to an agent.

**Harness**
the system around the model that enables it to act.

**MCP**
a standard for connecting AI systems to external tools and services.

---

# The most important traps

- treating fluent language as proof of knowledge,
- blindly trusting generated explanations,
- sending confidential data to random AI services,
- automating a process that was badly designed in the first place,
- giving agents excessively broad permissions,
- permanently approving operations without reading them,
- lack of agent activity logging,
- lack of a kill switch,
- treating RAG as a complete solution to hallucinations,
- confusing a large context window with perfect memory,
- confusing open weights with open source,
- choosing the model before defining the problem.

---

# Good practices

- define the cost of failure first,
- determine whether the output can be easily verified,
- give the model only the context it actually needs,
- use RAG when answers should come from specific documents,
- restrict tools according to least privilege,
- require approval for high-risk actions,
- keep humans in the process where accountability matters,
- log tool calls and actions,
- have a kill switch,
- separate model capability from overall system security,
- treat AI as an architectural component rather than a magical black box.

---

# My mental shortcut

The most important question used to be:

> what can the model answer?

With agents, the more important question becomes:

> **what can the model do?**

And that changes almost everything.

An LLM by itself may generate bad text.

An agent connected to email, the filesystem, GitHub, the terminal and production infrastructure can turn a bad answer into a real-world action.

That means that as model capabilities grow, the quality of these things must grow with them:

- context,
- access control,
- observability,
- validation,
- human oversight.

This is no longer only prompt engineering.

It is becoming normal systems engineering.

---

# One sentence I want to remember

**AI becomes truly powerful not when the model knows more, but when it receives the right context, tools and ability to act — and that is exactly why the same things that increase its usefulness also increase its risk.**
