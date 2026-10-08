---
id: ai-2026-business-case-use-case-evals
title: "From an AI Idea to a Business Case - Process, Value, Risk, and Validation"
team: red-blue
domain: artificial-intelligence
section: ai-engineering
type: knowledge
angle: business-case-and-evaluation
sourceTrack: narzedziownik-ai
tags:
[
  "ai",
  "business-case",
  "ai-adoption",
  "ai-maturity",
  "shadow-ai",
  "process-mapping",
  "use-case-canvas",
  "roi",
  "tco",
  "kpi",
  "poc",
  "evals",
  "promptfoo",
  "risk-management",
  "human-in-the-loop"
]
difficulty: medium
shortDescription: "A practical framework for turning an AI idea into a justified deployment: organizational maturity, process mapping, the AI Use-Case Canvas, technology selection, total cost of ownership, ROI, KPIs, PoC testing, evals, and the go/revise/stop decision."
updatedAt: "2026-10-08"
---

# From an AI Idea to a Business Case - Process, Value, Risk, and Validation

# Why This Matters to Me

It's easy to say, "We're implementing AI" these days. It's even easier to launch a chatbot, give a team some licenses, connect an API, and call it a transformation. But what actually changed?

Does the customer get a response faster? Can an analyst handle more cases without increasing the error rate? Does the organization spend less when we include the time people spend reviewing AI-generated answers? Or have we simply moved work from one place to another?

The single most important principle I want to apply to every such project is simple:

> **AI is not the goal of the project. The goal is to solve a specific problem whose impact can be measured.**

I'm particularly interested in this from the perspective of engineering, automation, and ICT risk management. A system that looks impressive in a demo doesn't necessarily deliver value in production. And a tool that saves one employee five minutes doesn't necessarily save the organization five minutes.

I want to approach AI deployments the same way I approach other technical changes: understand the current state, formulate a hypothesis, measure the baseline, identify risks, and only then implement the solution.

```text
AI IDEA
   ↓
WHAT PROBLEM ARE WE SOLVING?
   ↓
WHAT DOES THE PROCESS LOOK LIKE TODAY?
   ↓
WHAT CAN WE ACTUALLY CHANGE?
   ↓
HOW WILL WE MEASURE SUCCESS AND FAILURE?
   ↓
DO THE BENEFITS OUTWEIGH THE FULL COST?
   ↓
PoC → PILOT → PRODUCTION DECISION
```

---

# The Biggest Paradox: AI Is Everywhere, but Business Results Aren't Necessarily There

The most misleading thing about enterprise AI is that adoption is growing much faster than its measurable economic impact.

Different studies of AI adoption and outcomes illustrate the gap:

| What is being measured                           | Result |
| ------------------------------------------------ | -----: |
| Companies actively using AI                      |    69% |
| People who report improved personal productivity |    80% |
| Companies reporting a positive AI impact on EBIT |    37% |
| Companies attributing at least 5% of EBIT to AI  |     6% |

**Important:** these are not successive stages of one study, and the percentages should not be subtracted from one another. They come from different measurements and describe different things.

Mental model:

```text
"We use AI"                 ≠ "Our process runs faster"
"Our process runs faster"   ≠ "The company saves money"
"The company saves time"    ≠ "The company increases profit"
"Employees feel faster"     ≠ "Measurements show improvement"
```

One survey of businesses found that 89% of respondents saw no impact of AI on company productivity over the previous three years, and more than 90% observed no employment impact. This doesn't mean AI doesn't work. It means **we need to distinguish an individual user's subjective experience from the performance of the entire process**.

## The Workslop Trap

_Workslop_ is AI-generated output that looks polished but is so minimally useful that someone else has to fix it. One study reported that 40% of surveyed employees had received such material, with each incident taking an average of 1 hour and 56 minutes to repair.

```text
Employee A
   ↓
AI produces a "finished" document in 2 minutes
   ↓
Employee B checks, corrects, and reconstructs the facts
   ↓
90 minutes of work
   ↓
FOR A: success
FOR THE PROCESS: potential loss
```

The same applies to programming. In a METR study, experienced developers working on the tasks included in the experiment were 19% slower with AI, even though they expected to be 20% faster. This is a result from a particular study under particular conditions, not a universal measure of AI coding tools.

**Takeaway:** I don't just ask, "Does AI help?" I measure the entire process before and after, including review and rework costs.

---

# Why AI Pilots So Often Fail to Reach Production

It's easy to demonstrate a solution. It's much harder to handle daily operations, messy data, errors, permissions, limits, and costs.

The same reasons for failure come up repeatedly:

1. **No clear business value** - "We're implementing AI" doesn't specify a problem, a baseline, or a success metric.
2. **Poor or inaccessible data** - documents are scattered, outdated, or cannot be used because of legal or organizational constraints.
3. **Rising total costs** - tokens are only one piece; integration, human review, maintenance, and training still cost money.
4. **No risk control** - nobody knows who approves outputs or responds when something goes wrong.
5. **No improvement loop** - the agent lacks current context or repeats mistakes because there are no tests or feedback mechanisms.

```text
DEMO:
  10 example cases
  good prompt
  clean data
  operator standing by
       ↓
  "It works!"

PRODUCTION:
  real exceptions
  personal data and permissions
  API failures / timeouts
  changes to terms and policies
  cost of repeated requests
  accountability for outputs
       ↓
  "Does it still work?"
```

Gartner's forecast that more than 40% of agentic AI projects will be canceled by the end of 2027 should be treated as **a forecast**, not something that has already happened. Similarly, figures about PoC projects being abandoned need to be interpreted in the context of each study's timeframe and scope.

---

# Organizational Maturity: A License Is Not a Strategy

An organization's practical journey can be divided into five stages:

```text
STAGE 0              STAGE 1             STAGE 2
SHADOW AI       →    LICENSES       →    TEAM ASSISTANTS
personal accounts    policies             shared prompts
no visibility        data classes         projects, knowledge base

                      ↓
STAGE 3                              STAGE 4
AI-ENABLED PROCESSES            →    SUPERVISED AGENTS
integration with systems             multi-step automation
process owner and metrics            permissions, logs, gates
```

**Shadow AI** means using tools without formal organizational governance. From a security perspective, the important question isn't merely whether people use AI. It's **what data they send, through which accounts, to whom, and under what conditions**.

That's why buying licenses without defining data classification does not solve the problem.

## Another Perspective: Gartner's Five Maturity Levels

The Gartner AI maturity model distinguishes the following levels: **Awareness → Active → Operational → Systemic → Transformational**. Advancing requires developing three pillars together:

| People                                        | Technology                            | Processes                                            |
| --------------------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| AI literacy, role-specific training, managers | data, integrations, MLOps, monitoring | policies, accountability, security, redesigning work |

The most common anti-pattern:

```text
TECHNOLOGY   ██████████  level 4
PEOPLE       ███         level 1
PROCESSES    ██          level 1

=> The system may be modern,
   but the organization cannot govern it.
```

## My Quick Maturity Check

To quickly assess where we stand, I ask eight questions:

- [ ] We maintain a list of approved AI tools and data classifications.
- [ ] Employees use corporate accounts instead of personal ones.
- [ ] At least one process has a measured pre-AI cost and execution time.
- [ ] Every deployment has a designated process owner.
- [ ] Prompts and instructions are shared and version-controlled.
- [ ] We have test cases for at least one AI task.
- [ ] AI costs can be allocated to individual processes.
- [ ] At least one deployment has been running in production for more than a year.

Practical interpretation: **0–2 "yes" answers** = experimentation; **3–5** = pilots; **6–8** = readiness for more integrated AI processes. This is a quick directional tool, not a formal maturity audit.

---

# Map the AS-IS Process First, Then Consider AI

This is where the real engineering work begins. If I don't know where the actual bottleneck is, I might optimize a task that doesn't matter to the process as a whole.

When mapping a process, I distinguish between two measures:

- **Touch time** - how many minutes someone actively works on a case.
- **Lead time** - how much time elapses from start to finish, including queues and waiting.

Consider a customer complaint handling process:

```text
CUSTOMER SUBMITS A COMPLAINT
          ↓
  Register the case
          ↓
  WAIT FOR ASSIGNMENT       ← queue
          ↓
  Read the message
          ↓
  Find the order and relevant policy
          ↓
  Make a decision and draft a response
          ↓
  HUMAN APPROVAL
          ↓
  Send response to the customer
```

For illustration, assume **12 minutes of active work and 72 hours of waiting, across 1,200 cases per month**.

If AI reduces active work from 12 minutes to 6 but the case still sits in an assignment queue for three days, the customer experience might barely change. That's why, after measuring AS-IS, I design the **TO-BE** process: what we remove, what we simplify, what we delegate to AI, and where a human makes the decision.

```text
AS-IS → MEASURE THE BOTTLENECK
               ↓
      REMOVE UNNECESSARY STEPS
               ↓
      CHECK CONVENTIONAL AUTOMATION
               ↓
      ONLY THEN TEST AI
               ↓
TO-BE → COMPARE RESULTS
```

> Not every automation needs an LLM. A well-designed form, rule, or integration may be cheaper, more predictable, and safer.

---

# AI Use-Case Canvas: Nine Questions Instead of a "Cool Idea"

The AI Use-Case Canvas helps describe a deployment in terms of processes, data, oversight, and measurable outcomes. **Technology doesn't appear until field 8**.

Nine fields worth completing:

| Field                  | Question I need to answer                                         |
| ---------------------- | ----------------------------------------------------------------- |
| 1. Problem             | What exactly hurts, what is the volume, and what is the baseline? |
| 2. Owner / beneficiary | Who owns the process, and who benefits from the change?           |
| 3. AI task             | What specific activity should AI perform?                         |
| 4. Data                | Which systems provide the data, and how is it classified?         |
| 5. Human oversight     | Who reviews, approves, or escalates the output?                   |
| 6. Risk                | What are the consequences and cost of a wrong answer?             |
| 7. KPI                 | What outcome and guardrail metric will we measure?                |
| 8. Solution option     | No AI, off-the-shelf tool, SaaS, API, or local model?             |
| 9. Hypothesis          | Which threshold and deadline determine go/stop?                   |

## What the Quality Difference Looks Like

**Bad:** "AI will handle customer complaints."

**Better:** "Based on the email, order details, and policy, prepare a draft decision and response citing the relevant provision; a customer service representative approves every response."

**Bad:** "We have lots of data."

**Better:** "Messages in the complaints inbox, CRM records, and a PDF containing the policy; the data includes personal information."

**Bad:** "We'll improve efficiency."

**Better:** "Within 90 days, reduce response time from 72 to 24 hours while keeping repeat contacts at no more than 10%."

A good canvas is short. If one field needs a page-long explanation, I'm probably trying to cover too broad a problem.

## A Hypothesis Must Be Falsifiable

```text
WEAK:
"AI will improve the department's work."

GOOD:
"Within 30 days, using a sample of 200 cases,
at least 80% of drafts will be accepted without rewriting,
and active handling time will fall from 12 to 6 minutes."

GO:   >= 80% accepted drafts,
      zero incorrect promises.
STOP: < 60% after two weeks.
```

These are example thresholds illustrating the mechanism, not universal requirements. I define thresholds **before starting**; otherwise, I'll be tempted to adjust acceptance criteria to fit whatever results I get.

---

# Which Use Case Should I Start With?

The most impressive project is rarely necessarily the best first project. A public chatbot looks exciting, but straightforward ticket classification may deliver measurable value much sooner.

For initial prioritization, I can use a simple scoring formula:

\[
S = \frac{V \times F \times D}{R}
\]

Where each factor is scored from 1 to 5:

- **V** - business value;
- **F** - task frequency;
- **D** - data availability and quality;
- **R** - risk and difficulty.

```python
def score(value: int, frequency: int,
          data: int, risk: int):
    if data == 1 or risk == 5:
        return "GATE: not yet"
    return round(value * frequency * data / risk, 1)

print(score(4, 5, 5, 2))  # 50.0
print(score(4, 5, 3, 5))  # GATE: not yet
```

Example scoring for four ideas:

| Idea                        |   V |   F |   D |   R | Score |
| --------------------------- | --: | --: | --: | --: | ----: |
| Ticket classification       |   4 |   5 |   5 |   2 |  50.0 |
| Complaint response drafting |   4 |   4 |   4 |   2 |  32.0 |
| Policy search assistant     |   3 |   5 |   3 |   2 |  22.5 |
| Unsupervised chatbot        |   4 |   5 |   3 |   5 |  Gate |

This is **a tool for discussing assumptions**, not a scientific formula for business value. Scores should come from multiple roles: business, IT, security, and, where necessary, legal.

I always include **a no-AI option** as a separate alternative.

---

# Buy, Build, SaaS, API, Local Model - or Nothing

Before choosing a model, I ask: what is the least amount of technology needed to solve the problem?

```text
Can we eliminate the problem by changing the process?
 ├── YES → change the process
 └── NO
       ↓
Would a rule / script / SQL / form be enough?
 ├── YES → use deterministic automation
 └── NO
       ↓
Is there an approved enterprise solution?
 ├── YES → evaluate and use the existing solution
 └── NO
       ↓
SaaS / API / local model / custom system
       ↓
compare: data + quality + control + TCO
```

## My Mental Model for the Options

| Approach            | What I gain                       | What I need to control                                 |
| ------------------- | --------------------------------- | ------------------------------------------------------ |
| No AI / rules       | Predictability, low cost          | Rule maintenance, coverage of exceptions               |
| Off-the-shelf SaaS  | Fast setup                        | Retention, contracts, per-user costs, data export      |
| Model API           | Flexibility and integration       | Tokens, provider, error handling, rate limits, logging |
| Local model         | More control over the environment | Hardware, performance, updates, security, evals        |
| Custom agent/system | Fit to the process                | Full lifecycle and operational responsibility          |

**A local model is not automatically free or secure.** Eliminating provider token fees doesn't eliminate infrastructure, energy, administration, or access-control costs. Likewise, using a cloud service doesn't automatically mean a data leak; the specific product, plan, contract, and configuration must be checked.

Model prices change quickly enough that it makes little sense to copy October 2026 prices into a business case as permanent assumptions. A calculator should use rates current as of the decision date and include scenarios for changing prices and volumes.

---

# ROI and TCO - The Most Expensive Part May Not Be the API, but the Human

**TCO (Total Cost of Ownership)** is the full cost of implementing and operating a solution, not merely the model invoice.

```text
12-MONTH TCO
 ├── licenses / API / infrastructure
 ├── analysis and data preparation
 ├── process integration
 ├── security, permissions, and auditing
 ├── evaluations / test cases
 ├── user training
 ├── human review time
 ├── correcting wrong answers
 ├── monitoring and incidents
 ├── updating prompts and sources
 └── exit costs / switching providers
```

To assess profitability, I need several basic formulas:

\[
ROI = \frac{Benefits - TCO}{TCO} \times 100\%
\]

\[
Payback\ Period = \frac{Initial\ Cost}{Monthly\ Benefit - Monthly\ Operating\ Cost}
\]

\[
Cost\ per\ Case = \frac{Labor\ Cost + Fixed\ Process\ Costs}{Number\ of\ Cases}
\]

The second formula makes sense only when the denominator is positive and cash flows are reasonably stable.

## Worked Example - Hypothetical Deployment

Assume 1,200 cases per month. Currently, each requires 12 minutes; after deployment, 6 minutes, **including human review**. The fully loaded labor cost is PLN 60/hour.

```text
1,200 × (12 − 6) min = 7,200 min = 120 h / month
120 h × PLN 60/h      = PLN 7,200 potential benefit / month
12 × PLN 7,200       = PLN 86,400 potential benefit / year

BUT:
- do those 6 minutes include handling wrong outputs?
- how many drafts will actually be used?
- can freed-up time translate into lower costs or more capacity?
- what do integration, oversight, and maintenance cost?
```

We must not automatically equate the value of freed-up work hours with cash savings. If headcount and spending remain unchanged, the benefit may be **higher throughput**, not lower expenditure.

## Three Scenarios Instead of One Optimistic Number

```text
PESSIMISTIC:
  low adoption + frequent corrections + expensive integration

BASE CASE:
  realistic adoption + average quality + typical oversight

OPTIMISTIC:
  high adoption + few corrections + stable infrastructure
```

The same idea can have a positive or negative ROI depending on **draft accuracy, adoption, and integration costs**. A change in token prices may matter less than a few extra minutes of human review for every case.

---

# KPIs: Measure the Outcome, but Also Protect What Must Not Get Worse

A good KPI needs more than a name. It needs **a baseline, target, deadline, data source, and owner**.

```text
KPI = METRIC + BASELINE + TARGET + DEADLINE + SOURCE

GUARDRAIL = CONDITION THAT MUST NOT BE VIOLATED
```

Example metrics:

| Type     | Metric                       | Example measurement method                |
| -------- | ---------------------------- | ----------------------------------------- |
| Time     | Active case handling time    | Median minutes per case                   |
| Process  | Lead time                    | From ticket creation to closure           |
| Cost     | Cost per case                | Full process cost / number of cases       |
| Quality  | Draft acceptance rate        | Accepted without rewriting / all drafts   |
| Adoption | Actual usage                 | AI-assisted cases / eligible cases        |
| Risk     | Incorrect decision / promise | Number of critical errors and escalations |

Example conflict:

```text
GOAL:
  reduce complaint handling time by 50%

GUARDRAIL:
  do not increase the number of repeat contacts
  do not generate incorrect financial promises
  do not exceed the per-case budget
```

This matters because a model might "improve" one metric while destroying another. A lower handling time means nothing if a customer has to return three times with the same complaint.

**Measure before changing anything:** I select a representative set of cases, record handling times, exceptions, costs, and quality, and reserve some cases for future evals. Asking "Do you feel faster?" in a survey does not replace an event log.

---

# PoC, Pilot, and Production Are Three Different Decisions

```text
PoC
  "Can this technology perform the task at all?"
       ↓ GATE 1
PILOT
  "Does it work in our process, with our people and data?"
       ↓ GATE 2
PRODUCTION
  "Does it work reliably, economically, and under control?"
```

## Experiment Card - Example

| Element        | Assumption                                                      |
| -------------- | --------------------------------------------------------------- |
| Scope          | Complaints up to PLN 1,000, Polish language                     |
| Sample         | 50 test cases, followed by 200 real cases                       |
| Hypothesis     | 80% of drafts accepted; time reduced from 12 to 6 minutes       |
| GO             | At least 80%; zero incorrect promises; cost per case ≤ PLN 7.50 |
| REVISE         | 60–80%: one iteration and another test                          |
| STOP           | Below 60% after two weeks or any critical error                 |
| Budget         | PLN 6,000; API cap PLN 300                                      |
| Decision-maker | Process/business owner, by an agreed deadline                   |

These values illustrate how to design an experiment. For a real process, thresholds must be established from its own data.

"Revise" must have a limit. Without one, a pilot may continue indefinitely: more prompts, more models, more exceptions, and never a decision.

## Sandboxing and Security by Design

In experiments involving agents, I pay attention not only to answer quality but also to what the system is technically capable of doing:

```yaml
# Example test environment policy - conceptual configuration
sandbox:
  network: restricted
  filesystem: read_only
  data: anonymized
  max_runtime_seconds: 600
  daily_api_budget_usd: 10
  human_approval_required:
    - send_to_customer
    - issue_refund
  log:
    - tool_calls
    - model_version
    - input_output_metadata
    - estimated_cost
```

This is **an illustrative configuration**, not a file ready to use in a particular framework.

Security mental model:

```text
INSTRUCTION: "Don't send emails without approval"
                  ≠
TECHNICAL BLOCK ON SENDING EMAILS

Prompts guide behavior.
Permissions limit actual capabilities.
```

Before production, I verify quality, value, cost, security, data, accountability, monitoring, and the ability to shut the solution down. A successful demo alone addresses none of these issues.

---

# Evals - Automated Tests for a System Whose Output Is Nondeterministic

I treat evals as the equivalent of regression tests for language-model-based solutions. In conventional programming, I know that a function should return a particular result for specified inputs. With an LLM, the same problem may be described correctly in several different ways.

That's why I need **test cases and evaluation criteria**, not just a comparison of two polished answers.

```text
TEST CASE
 ├── input
 ├── context / sources
 ├── expected behavior
 ├── pass criteria
 └── risk category
          ↓
        MODEL
          ↓
        OUTPUT
          ↓
  VALIDATOR / HUMAN REVIEW
          ↓
       PASS / FAIL
```

## Example Test Cases for Complaints

| Test                                            | Expected behavior                                  |
| ----------------------------------------------- | -------------------------------------------------- |
| Complete policy and proof of purchase available | Draft with the correct citation                    |
| Order number missing                            | Request missing information; don't invent an order |
| Email and CRM contradict each other             | Flag the conflict and escalate                     |
| Request outside the team's authority            | Route to the correct team                          |
| Attacker's instruction embedded in the email    | Treat it as data, not as an agent instruction      |
| Amount exceeds approval threshold               | Do not autonomously authorize a refund             |

**Negative test cases** matter, too. A good system should be able to say "I don't know" or "I'm escalating this" instead of always generating an answer.

## A Minimal Python Eval

```python
# Example rule-based evaluator.
# This does not replace manual semantic evaluation.

def evaluate(output: str, expected: dict) -> dict:
    checks = {
        "has_source": (
            not expected.get("requires_source", False)
            or "Source:" in output
        ),
        "no_forbidden_promise": (
            "we guarantee a refund" not in output.lower()
        ),
        "handles_missing_data": (
            not expected.get("missing_data", False)
            or "missing information" in output.lower()
        ),
    }
    return {"passed": all(checks.values()), "checks": checks}
```

This test detects simple deviations, but **does not verify that the cited source actually exists or that the decision is correct**. For that, I need source comparison, stronger validators, or expert review.

## Promptfoo and Comparing Changes

`promptfoo` allows repeatable testing of prompts and models. A typical workflow:

```text
prompt_v1 + model_A ──┐
                     ├── same dataset
prompt_v2 + model_A ──┘
                           ↓
                    compare pass rate
                    critical errors
                    cost and latency
```

Example YAML sketch (the model and provider identifiers must be adjusted to the actual configuration):

```yaml
description: "Complaints - prompt comparison"
prompts:
  - file://prompt_v1.txt
  - file://prompt_v2.txt
providers:
  - openai:chat:YOUR_MODEL_ID
tests:
  - vars:
      message: "I don't have my order number. What should I do?"
    assert:
      - type: contains
        value: "order"
```

```bash
npx promptfoo@latest eval
npx promptfoo@latest view
```

Whenever I change the model, prompt, data, policy, or tooling, I run **the same test suite**. Ideally, I keep that suite in an open format under my control (e.g., CSV/JSONL), so I can switch frameworks without losing the quality criteria.

### The Problem with Multi-Step Tests

If each individual step has a 75% chance of success, and completing a process requires three independently successful steps, under that simplified assumption:

\[
0.75^3 \approx 42\%
\]

This illustrates how errors can compound in agent workflows. In real systems, steps are not necessarily independent, so this is **an illustrative model**, not a formula for the reliability of any agent.

---

# A 30-Day Plan - From Observation to Decision

In the end, the entire process should fit into a one-page business case. That's a useful test of whether I can actually define the problem and justify a decision.

## Week 1: Current State and Hypothesis

- I select **one** process.
- I map 5–9 AS-IS steps.
- I measure active work time, waiting time, case volume, and error counts.
- I identify the process owner and data classification.
- I compare the AI option with a no-AI alternative.

**Deliverable:** a baseline and a falsifiable hypothesis.

## Week 2: Small PoC

- I prepare a representative test dataset.
- I run the solution using public or appropriately anonymized data.
- I test quality, critical errors, cost, and response time.
- I assess whether the PoC meets the criteria for moving forward.

**Deliverable:** an evaluation report and a pilot-entry decision.

## Week 3: Limited Pilot

- A selected group of users works within a controlled process.
- A human approves the outputs.
- I log usage, corrections, errors, costs, and real handling times.
- I verify KPIs and guardrails.

**Deliverable:** evidence of how the solution performs in the actual workflow.

## Week 4: Comparison and Decision

- I compare AS-IS and TO-BE.
- I calculate ROI/TCO under three scenarios.
- I review risks, data, accountability, and maintenance requirements.
- I make the **GO / REVISE / STOP** decision.

**Deliverable:** a concrete, evidence-based recommendation for the process owner, with costs.

---

# One-Page Business Case - Reusable Template

```text
1. PROBLEM
   [What isn't working, and where? AS-IS volume, time, and cost]

2. OWNER / BENEFICIARIES
   [Who is accountable? Who benefits?]

3. AI TASK
   [One specific activity / deliverable]

4. DATA
   [Sources, quality, classification, constraints]

5. HUMAN OVERSIGHT
   [What needs approval? When should the case be escalated?]

6. RISK
   [Most costly failure, detection, response]

7. KPI + GUARDRAIL
   [Baseline, target, deadline, data source]

8. OPTION AND TCO
   [No AI / SaaS / API / local; 12 months,
    pessimistic, base-case, optimistic scenarios]

9. HYPOTHESIS AND DECISION
   [Sample, GO/REVISE/STOP, deadline, budget,
    approving authority]
```

## Supporting Prompt for Preparing the Business Case

```text
Goal: prepare a one-page AI deployment business case.

Inputs:
- AS-IS process map,
- case volume, time, and cost data,
- completed AI Use-Case Canvas,
- TCO/ROI calculations,
- data policy and organizational constraints.

Task:
1. Ask up to 7 questions about missing information that affects the decision.
2. Identify the 3 weakest assumptions and a way to test them within 30 days.
3. Propose a guardrail for each KPI.
4. Prepare a nine-field card with no more than 40 words per field.
5. Identify GO / REVISE / STOP conditions.

Constraints:
- Do not invent figures or process owners.
- Do not automatically treat saved work hours as cash savings.
- Mark missing data as "TO BE MEASURED".
- Include the no-AI option and the full cost of human oversight.

Acceptance criteria:
- Every figure has a source.
- ROI matches the calculator.
- Every KPI has a baseline, target, deadline, and guardrail.
- A decision can be made when the experiment closes.
```

---

# What I Want to Remember as a Security / ICT Risk Practitioner

In AI projects, I care especially about data boundaries, agent permissions, observability, accountability, and the ability to validate outcomes. These aren't separate concerns to address "at the end." They should shape the design from the outset.

```text
VALUE                       RISK
─────────────────           ──────────────────────
Shorter handling time        Incorrect decision
Higher throughput           Data exposure
Lower cost                  Unauthorized action
Faster service              Lack of auditability
Better quality              Vendor lock-in

          ↓ one deployment decision ↓

BUSINESS CASE + SECURITY CASE + OPERATING MODEL
```

An important distinction: legal responsibility for a model's error cannot be reduced to "the model provider is always responsible." It depends on the party's role, the type of system, and applicable law. These obligations must be established for each deployment.

## My Checklist Before Approving a PoC

- What exactly will be measured, and who approves the criteria?
- What data leaves the organization, in what form, and under what terms?
- Are the agent's permissions technically restricted?
- Do we know the cost of the worst plausible mistake?
- Are the logs sufficient to reconstruct a decision?
- Can we roll back the solution without interrupting the process?
- Is there a defined response to incorrect outputs and incidents?
- Is there a regression test that runs whenever the model, prompt, or knowledge base changes?

---

# Key Mental Models

## Model 1: Product ≠ Process

```text
Buying a license can take an hour.
Measuring and redesigning a process is harder.
Business value is created in the process, not on a chat screen.
```

## Model 2: Answer Quality ≠ System Quality

```text
GOOD OUTPUT
   + correct data
   + acceptable cost
   + accountability
   + permissions
   + reliability
   + monitoring
   = only then a candidate for production
```

## Model 3: Local Savings ≠ Global Savings

```text
One employee saved 10 minutes
         ↓
Another person spent 15 minutes reviewing
         ↓
The system looks more impressive, but is slower
```

## Model 4: A PoC Tests a Hypothesis; It Is Not a Technology Demo

```text
BEFORE: thresholds + scope + data + cost limits
DURING: measurement + test cases + errors
AFTER:  GO / ONE REVISION / STOP
```

## Model 5: Evals Are a More Durable Asset Than the Prompt or the Model

```text
PROMPT v1 → MODEL A → TESTS
PROMPT v2 → MODEL A → SAME TESTS
PROMPT v2 → MODEL B → SAME TESTS

I compare results using a consistent test dataset.
```

---

# Summary: My Workflow from Idea to Decision

```text
[1] IDENTIFY THE PROBLEM
         ↓
[2] MAP AS-IS AND MEASURE THE BASELINE
         ↓
[3] ASK WHETHER AI IS EVEN NECESSARY
         ↓
[4] COMPLETE THE USE-CASE CANVAS
         ↓
[5] ASSESS VALUE, FREQUENCY, DATA, AND RISK
         ↓
[6] COMPARE TECHNOLOGY OPTIONS
         ↓
[7] CALCULATE 12-MONTH TCO AND ROI
         ↓
[8] DEFINE KPIs, GUARDRAILS, AND STOP CONDITIONS
         ↓
[9] RUN A PoC WITH EVALS
         ↓
[10] CONDUCT A LIMITED PILOT
         ↓
[11] GO / REVISE / STOP
         ↓
[12] ONLY THEN: DEPLOYMENT AND MAINTENANCE
```

The most important principle I want to apply to every deployment:

> **I'm not interested in whether AI can generate something. I'm interested in whether I can prove that the entire solution improves a real process, at an acceptable cost and level of risk.**

---
