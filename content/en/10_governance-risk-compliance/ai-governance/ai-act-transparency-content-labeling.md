---
id: ai-act-transparency-content-labeling
title: "AI Act in Practice: AI Content Labeling, Deepfakes and Evidence"
team: blue
domain: governance-risk-compliance
section: ai-governance
type: knowledge
angle: ai-act-transparency-content-labeling
sourceTrack: sekurak-ai-act
tags:
  [
    "ai-act",
    "ai",
    "governance",
    "compliance",
    "deepfake",
    "transparency",
    "content-credentials",
    "synthid",
    "social-media",
    "risk",
  ]
difficulty: medium
shortDescription: "A practical approach to AI Act transparency requirements: when AI-generated or AI-modified content should be labeled, how to assess deepfakes, how to organize meaningful human oversight, and how to build an evidence trail from content creation to publication."
updatedAt: "2026-08-14"
---

# AI Act in Practice: AI Content Labeling, Deepfakes and Evidence

The AI Act should not be reduced to a simple rule:

> "You used AI → add an AI label."

It creates a layered system of obligations that depends on the **organization's role, the way the AI system is used, the type of content, the publication context, the impact of AI on authenticity, and the actual level of human control**.

The most important question therefore is not:

> Was AI used here?

A much better question is:

> **What did AI do to the material, and did it change its meaning or apparent authenticity?**

Fixing typos and creating a realistic avatar of a CEO saying words they never actually recorded may rely on the same category of technology, but from a transparency perspective they are completely different scenarios.

---

## Start by determining your role

Before analyzing the content itself, determine **who you are in the specific scenario**.

### Deployer

A deployer is an organization that uses an AI system under its own authority in professional activities.

If an employee uses ChatGPT, Claude, Gemini, or another AI system as part of their job, the employee does not automatically become a separate deployer.

In practice, the organization usually holds that role.

Example:

```text
Employee
    ↓
uses ChatGPT
    ↓
for professional duties
    ↓
Deployer = organization
```

A marketing department, editorial team, or company using an image generator will therefore usually act as a deployer.

### Provider

The situation changes when an organization:

- develops an AI system,
- commissions its development,
- makes it available under its own name or trademark,
- substantially modifies the system,
- changes its intended purpose.

The role is therefore not a permanent label assigned to an organization.

```text
Using an external AI solution
        ↓
Deployer

Building / substantially modifying /
offering under your own brand
        ↓
Potential provider
```

Moving into the provider role also means taking on additional obligations.

### Recipient

The recipient is the person who:

- sees the material,
- hears the material,
- watches the video,
- reads the text,
- interacts with a chatbot or AI agent.

Later, transparency should be verified precisely from the **recipient's perspective**.

---

# Three levels of AI use

A useful working model is to divide AI use into:

```text
ASSIST
   ↓
MANIPULATE
   ↓
GENERATE
```

This is not an automatic legal test, but it is a very useful starting point for analysis.

---

## AI as an assistant

AI helps the human without changing the meaning or reality represented by the material.

Examples:

```text
typo correction
punctuation correction
formatting
cropping
compression
technical quality improvement
mechanical translation
AI-assisted research verified by a human
```

In these cases, there is usually no substantial modification.

```text
original
   ↓
AI
   ↓
technical correction
   ↓
meaning unchanged
   ↓
usually no label
```

A mechanical translation also does not necessarily create new content as long as the meaning remains unchanged.

However, if the "translation" begins adding new claims, arguments, or elements, it stops being a simple transformation and should be reassessed.

---

## AI manipulates the material

The second scenario is much more important.

A real source material exists, but AI changes something that matters to the recipient.

Examples:

```text
changing someone's statement
voice cloning
lip-sync
changing how a product looks
adding a non-existent product feature
changing the context of an event
realistic scene modification
avatar of a real person
```

The key question is:

> **Does the change affect the meaning of the material or its apparent authenticity?**

If yes, the material should go through the full transparency assessment.

---

## AI generates the material

The third scenario involves creating something that did not previously exist:

```text
text
image
audio recording
video
avatar
person
event
scene
product
```

Generation itself does not mean every AI-created object is treated identically in every situation.

**Context matters.**

A realistic synthetic influencer advertising a real product should be assessed differently from an obviously fictional character standing next to a dragon.

---

# The most important test: meaning and authenticity

A practical analysis can start with one question:

```text
Did AI change the meaning of the material
or its apparent authenticity?
```

If:

```text
NO
↓
likely technical / assistive use of AI
```

If:

```text
YES
↓
full assessment
↓
deepfake?
public interest?
real person?
real product?
event?
potentially misleading?
transparency obligation?
```

If you cannot demonstrate that the modification was purely technical, treat it as potentially significant and perform the full assessment.

---

# Chatbots - the recipient should know from the start

If a person directly interacts with an AI system, they should be informed from the beginning that they are interacting with AI.

Good:

```text
You are interacting with an AI-powered assistant.

Hi, I'm Agata. How can I help you?
```

Much worse:

```text
Hi, I'm Agata.
How can I help you?

[...]

*somewhere in the terms and conditions:
Agata is an AI system*
```

The recipient should not have to investigate the service to discover that they are interacting with AI.

---

# Deepfake is not just face swapping

The common understanding of a deepfake is far too narrow.

It is not limited to:

```text
face swap
```

Relevant scenarios may also include:

```text
synthetic voice
avatar of a real person
lip-sync
synthetic event
realistic image of something that never happened
modified statement
false representation of a product
synthetic person that appears real
```

A practical test should include:

```text
Is the material an image, audio recording, or video?

Does it depict or resemble:
- an existing person,
- object,
- location,
- event,
- organization?

Does it look realistic?

Could it create an appearance of authenticity?

Could the recipient reasonably believe
the presented situation is real?
```

---

# Obvious fiction vs. deepfake

Not every visually realistic AI-generated image creates the same level of risk.

Imagine:

```text
Tomek as a cyberpunk warrior
+
fantasy armor
+
unrealistic environment
+
fantasy creatures
```

The recipient understands that this is fiction.

Compare it with:

```text
realistic avatar of a CEO
+
their appearance
+
cloned voice
+
statement about the company
+
words the CEO never recorded
```

Here, an **appearance of authenticity** is created.

The second scenario requires a completely different assessment.

Art, satire, or clearly fictional material may allow for less intrusive forms of disclosure, provided the context still makes the artificial nature sufficiently clear.

---

# Consent does not replace transparency

This distinction is critical.

A CEO may consent to the use of their:

```text
image
voice
avatar
```

but if the organization creates a realistic recording in which the CEO says something they never recorded, consent alone does not solve the transparency issue.

A simple way to remember it:

```text
CONSENT
answers:
"Am I allowed to use this?"

TRANSPARENCY
answers:
"What must the recipient know?"
```

These are separate problems.

---

# A real product in an AI-modified reality

Marketing creates particularly interesting scenarios.

### Real product + modified background

```text
real product photo
+
AI-generated background
+
product appearance and functionality unchanged
+
context still reflects reality
```

This may qualify as a non-substantial modification.

### Real product + non-existent functionality

```text
product
+
AI adds a screen / counter / capability
+
real product does not have it
```

Now the information about the product itself has changed.

This is a completely different situation.

### Synthetic influencer + real product

If a realistic AI-generated person appears to be a genuine influencer and presents a real product, a synthetic element has been introduced that may create the appearance of reality.

That should trigger a transparency assessment.

---

# Text is more difficult than images

AI-generated text is a particularly nuanced case.

The mere fact that a model was used is not enough to determine the outcome.

Before publishing, consider:

```text
Did AI generate or substantially modify the text?

Is the purpose to inform the public?

Does the material concern a matter of public interest?

Did a human genuinely verify the content?

Could the human reject the content?

Was the review documented?
```

Areas that may involve public interest include:

```text
health
security
consumer protection
environment
regulation
cybersecurity
significant economic events
```

---

# Human-in-the-loop must actually mean human control

This is one of the most important practical issues.

Human review is not:

```text
AI generates content
↓
human takes a quick look
↓
"looks fine"
↓
publish
```

It is also not:

```text
Model A generates content
↓
Model B reviews content
↓
publication
```

Meaningful human oversight should include the ability to:

```text
verify sources
verify facts
verify dates
verify names
verify numbers
modify content
reject a section
reject the entire material
stop publication
```

The person performing the review must have **real authority over the publication decision**.

A second model, punctuation correction, or a superficial glance is not meaningful human oversight.

---

# Practical verdicts

```text
AI performs research
+
human verifies the sources
+
human writes the material
→ usually no label
```

```text
AI fixes typos and formatting
→ usually no label
```

```text
AI performs mechanical translation
+
meaning remains unchanged
→ usually no label
```

```text
AI independently writes an article
+
no genuine human review
+
topic concerns public interest
→ assess disclosure obligation
```

```text
AI creates a realistic avatar of a real person
+
the person says something they never recorded
→ label
```

```text
AI clones the voice of a real person
→ deepfake assessment / label
```

```text
AI creates an obviously fictional scene
→ context may not create an appearance of authenticity
```

```text
AI adds a feature the product does not have
→ label + additional consumer-law risk
```

---

# How should content be labeled? VAD

A useful operational model is:

```text
V - Visible
A - Audible
D - Detectable
```

The disclosure should work **for the recipient**, not merely exist somewhere technically inside the file.

---

## Visible

For text, images, or video, the information should be placed where the recipient can notice it when encountering the material.

Good:

```text
This material was generated using AI.
```

or:

```text
This material was substantially modified using AI.
```

Bad:

```text
AI may have been used.
```

That wording does not actually tell the recipient whether AI was used.

---

## Audible

For audio content, the disclosure can also be provided audibly.

Example:

```text
This recording contains a voice synthetically generated using AI.
```

The disclosure should appear early enough for the recipient to understand the nature of the material.

---

## Detectable

There is also a technical layer of AI provenance and labeling.

Examples:

```text
Content Credentials / C2PA
SynthID
watermarking
metadata
other machine-readable mechanisms
```

But:

> **Technical labeling does not replace disclosure to a human recipient.**

If someone needs a specialized tool to inspect metadata before discovering that AI was used, transparency has not necessarily been achieved.

---

# AI generated vs. AI modified

A useful distinction:

### AI generated

The material was created from scratch using AI.

```text
prompt
↓
model
↓
synthetic image
```

Label:

```text
AI generated
```

### AI modified

A source material existed, but AI introduced a significant modification.

```text
original image
↓
AI
↓
modified person / statement / product / situation
```

Label:

```text
AI modified
```

The label is only one layer of compliance.

It is not proof that the whole process was compliant.

---

# Metadata may disappear

This is a very practical problem.

You may have:

```text
source file
↓
Content Credentials
↓
upload
↓
social media
↓
crop / recompression / transcoding
↓
?
```

A platform may:

- change the format,
- resize the content,
- crop the graphic,
- remove metadata,
- change how disclosures are presented.

Therefore:

> Correctly labeling the source file does not guarantee that the recipient will still see the disclosure after publication.

---

# First-recipient test

After publication, behave like an ordinary user.

```text
PUBLISH
   ↓
open the material
   ↓
desktop
   ↓
mobile
   ↓
verify disclosure
   ↓
take screenshot
   ↓
store evidence
```

And remember:

```text
LinkedIn OK
≠
Facebook OK
≠
Instagram OK
≠
website OK
```

Every platform may process the material differently.

The final published version should therefore be verified where the recipient actually sees it.

---

# Compliance does not end with a label

The organization needs a process.

A practical workflow may look like this:

```text
CREATOR
   │
   │ material + AI usage information
   ▼
EDITOR
   │
   ├── substantial modification test
   ├── deepfake test
   ├── public-interest test
   └── human review
   │
   ▼
COMPLIANCE
   │
   └── borderline cases only
   │
   ▼
APPROVER
   │
   └── decision owner
   │
   ▼
PUBLISHER
   │
   ├── disclosure
   └── publication
   │
   ▼
LIVE VERIFICATION
   │
   ├── desktop
   ├── mobile
   └── screenshot
   │
   ▼
EVIDENCE
```

The core rule:

> **Every decision must have an owner.**

"Marketing published it" should never be the end of the accountability chain.

---

# Minimum AI decision register

You do not need to retain everything.

You need to retain **enough information to reconstruct the decision later**.

Example record:

```yaml
material_id: campaign-ceo-avatar-2026-08
system: Example AI Video Generator
model_version: 3.0

ai_usage:
  - synthetic_video
  - cloned_voice

subject:
  real_person: true
  real_product: true

deepfake_test: true
public_interest_test: false

decision: LABEL

label:
  type: AI_MODIFIED
  first_exposure: true

reviewer: anna.kowalska
review_date: 2026-08-14

evidence:
  - source-file
  - approval
  - live-screenshot
```

A minimum record may include:

```text
material identifier
tool
model / version
type of AI use
publication purpose
deepfake assessment
public-interest assessment
decision
justification
approver
date
evidence of published material
```

---

# Do not copy the entire prompt "for evidence"

This is a tempting mistake.

An organization wants auditability, so it begins retaining:

```text
complete prompts
complete conversations
full context windows
all attachments
```

The problem?

A prompt may contain:

```text
personal data
trade secrets
customer information
financial information
internal instructions
confidential information
```

Suddenly, the compliance register itself becomes a source of data leakage.

Therefore:

> **Evidence should be proportionate.**

Store what is necessary to demonstrate the process and decision - not automatically everything that was sent to the model.

---

# Agencies and freelancers

Outsourcing content creation does not automatically outsource accountability for what the organization ultimately publishes.

If an agency provides a graphic, video, or advertising campaign, the organization should know:

```text
Was AI used?

Which system was used?

What was AI used for?

Was the material generated or modified?

Was a real person's image used?

Was a real person's voice used?

Are the required permissions available?

What licenses apply?

Are Content Credentials available?

Could metadata be lost?

Who is responsible for disclosure?

Who verifies the live publication?
```

Minimum contractual or procurement requirements should therefore include:

```text
disclosure of AI systems used
type of AI use
responsibility for classification
requirement to preserve disclosures
notification of significant modifications
transfer of evidence
image and voice permissions
licensing information
ability to stop publication
```

Without disclosure from the agency, the client may not even know that the delivered material requires additional assessment.

---

# Accountability chain

A practical organizational model may look like:

```text
CREATOR
│
├── sources
├── hallucinations
├── AI usage disclosure
└── content preparation

EDITOR
│
├── deepfake assessment
├── public-interest assessment
├── substantive review
└── right to reject

APPROVER
│
├── evidence assessment
└── final decision

OWNER
│
└── responsibility for process / incident

TECHNICAL
│
├── metadata
├── C2PA
├── Content Credentials
├── export behavior
├── integrations
└── labeling mechanisms
```

These roles do not always require five different employees.

The important point is that the organization knows:

> **who is responsible for what.**

A universal mandatory "AI Officer" is not the point.

What matters is having people with competencies appropriate to their actual responsibilities.

---

# Evidence of publication > URL alone

A URL is convenient.

But:

```text
today:
https://example.com/post/1337
        ↓
material A

one month later:
https://example.com/post/1337
        ↓
modified / removed material
```

For audit purposes, it is better to also retain:

```text
screenshot
timestamp
material identifier
source file
publication version
decision
review evidence
```

A post-publication screenshot is particularly valuable because it demonstrates **what the recipient could actually see**.

---

# Republishing means reassessing

The fact that a material was assessed once does not mean every future use of it automatically has the same status.

Changes to:

```text
channel
context
audience
presentation
description
format
campaign
```

may change the outcome.

A new publication or redistribution should therefore trigger a new context assessment where appropriate.

---

# Common incorrect assumptions

### "I used AI, so everything must be labeled."

No.

Analyze the type of use and the context.

---

### "AI fixed three commas, so it is AI generated."

No.

Technical correction is not the same as creating new content.

---

### "It has SynthID, so we're done."

No.

Machine-readable provenance and human-facing disclosure are different layers.

---

### "The platform will detect AI automatically."

Do not build your compliance process around the assumption that the platform's detection mechanism will always work.

---

### "The CEO approved the avatar, so we do not need a label."

Consent to use someone's likeness and transparency toward the recipient solve different problems.

---

### "A second AI model reviewed the first model, so we have human oversight."

No.

---

### "We have the URL, so we have evidence."

A URL can later point to modified or removed content.

---

### "The agency created the content, so the agency is responsible."

The organization publishing the material still needs enough information to assess the final content correctly.

---

# Sanctions and supervision

Violations of AI Act obligations may result in significant financial penalties.

Factors relevant to enforcement may include:

```text
severity of the infringement
duration
consequences
number of affected recipients
extent of harm
size of the organization
market position
previous similar infringements
cooperation with authorities
remediation
```

The training material discussed maximum penalty thresholds of **EUR 15 million or 3% of worldwide annual turnover** for certain AI Act violations and **EUR 35 million or 7% of worldwide annual turnover** for prohibited AI practices.

For day-to-day governance, however, the more useful takeaway is not the headline penalty amount.

It is this:

> The organization should be able to demonstrate that it had a repeatable decision-making process, competent people, meaningful review, and evidence showing how the final content appeared to recipients.

---

# Field workflow

Before publishing AI-assisted material:

```text
[ ] Determine the organization's role

[ ] Identify the system and version

[ ] Classify AI use:
    ASSIST / MANIPULATE / GENERATE

[ ] Determine whether AI changed the meaning

[ ] Determine whether AI changed apparent authenticity

[ ] Perform the deepfake assessment

[ ] Assess public-interest context

[ ] Identify real people, voices, products, and events

[ ] Verify permissions and licenses

[ ] Ensure meaningful human review

[ ] Assign a decision owner

[ ] Decide LABEL / NO LABEL

[ ] If LABEL:
    choose AI GENERATED / AI MODIFIED

[ ] Ensure VAD:
    visible
    audible
    detectable

[ ] Publish

[ ] Open the publication as an ordinary recipient

[ ] Verify desktop presentation

[ ] Verify mobile presentation

[ ] Take a screenshot

[ ] Preserve proportionate evidence
```

---

# Mental model

The most useful part of AI Act transparency should not be memorized as a collection of icons.

A better model looks like this:

```text
                AI USED
                   │
                   ▼
            WHAT DID AI DO?
                   │
       ┌───────────┼────────────┐
       ▼           ▼            ▼
    ASSIST      MANIPULATE    GENERATE
       │           │            │
       └───────────┴────────────┘
                   │
                   ▼
       DID MEANING/AUTHENTICITY CHANGE?
                   │
            ┌──────┴──────┐
            │             │
           NO            YES
            │             │
            ▼             ▼
      usually lower    full assessment
          impact           │
                           ├── deepfake?
                           ├── public interest?
                           ├── real person?
                           ├── real product?
                           ├── synthetic event?
                           └── human control?
                                   │
                                   ▼
                          LABEL / NO LABEL
                                   │
                                   ▼
                                 VAD
                                   │
                                   ▼
                               PUBLISH
                                   │
                                   ▼
                           VERIFY AS USER
                                   │
                                   ▼
                               EVIDENCE
```

---

# Final takeaway

The biggest mistake is reducing AI governance to an **AI GENERATED** badge.

A mature process looks different.

The organization should know:

```text
who used AI
why AI was used
what exactly was changed
whether authenticity changed
what the recipient sees
who made the decision
who reviewed it
how the material was labeled
what it looked like after publication
and whether all of this can later be proven
```

**Transparency is only the final visible layer.**

Underneath it should exist:

```text
governance
+
human oversight
+
ownership
+
technical controls
+
evidence
```

And that is the key audit question.

Not simply:

> "Was there an AI label?"

But:

> **"Show us why you made this decision and how you can prove that the process actually worked."**
