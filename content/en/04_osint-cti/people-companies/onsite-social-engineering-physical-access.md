---
id: onsite-social-engineering-physical-access
title: "on-site attacks - when digital security begins at the door"
team: red-blue
domain: social-engineering
section: physical-security
type: methodology
angle: onsite-recon-pretext-physical-access-human-trust-defense
sourceTrack: social-engineering-sekurak
tags:
  [
    "social-engineering",
    "physical-security",
    "onsite",
    "tailgating",
    "pretexting",
    "access-control",
    "osint",
  ]
difficulty: medium
shortDescription: "A practical look at social engineering assessments conducted directly at an organization’s premises. The note shows how reconnaissance, appearance, employee routines and weak access-control procedures can combine into a complete attack path."
updatedAt: "2026-07-28"
---

# On-site attacks - when digital security begins at the door

An on-site attack does not begin at a computer.

It begins much earlier: in the parking area, at the vehicle gate, at reception, near the elevators or at the moment an employee automatically holds the door open for the person walking behind them.

In this type of assessment, the boundaries between physical security, social engineering and IT security almost disappear.

A person who gains access to the office area may come within immediate reach of:

- active workstations,
- internal network ports,
- documents left on desks,
- badges and access cards,
- mobile devices,
- meeting rooms,
- technical rooms,
- conversations between employees.

They do not need to break anything technically yet.

First, they only need to be treated as someone who belongs there.

---

## Guiding rule: you do not need to look familiar, only normal

Employees in a large organization do not know everyone working in other teams, branches or external companies.

An attacker therefore does not need to convince everyone that they are a specific employee.

They only need to make their presence fit the place and the situation.

Someone carrying a projector case near meeting rooms does not look suspicious.

A person wearing work clothes near a renovation area may automatically be treated as a contractor.

Someone with a laptop, a network cable and a badge hanging from their neck may be assumed to work in technical support.

The strongest cover is not always a perfectly replicated identity.

Sometimes it is simply looking ordinary.

---

## An on-site attack is a chain of small decisions

Gaining access to a facility rarely depends on one spectacular mistake.

More often, the attack develops through a series of situations that appear insignificant on their own.

Security accepts an explanation for an unexpected visit.

An employee opens a door for someone who looks lost.

Reception issues a visitor badge without independently confirming the meeting.

The visitor is left without an escort.

Another employee gives them access to a workstation because they assume the earlier layers of the organization have already verified them.

Each moment may look like a minor exception.

Only when combined do they reveal the full attack path:

**organization perimeter → building → office area → workstation → access to resources**

This is why an on-site assessment should test more than whether someone can enter the building.

It should show how many additional controls fail after the first mistake.

---

## Site reconnaissance: understand the environment before entering

Preparing the scenario begins with a simple question:

> What does a normal day look like in this place?

It is not enough to find the organization’s address.

You need to understand:

- where employees enter,
- how visitors are handled,
- when traffic is highest,
- whether employees use different entrances,
- which external companies regularly appear on-site,
- where shared areas are located,
- how visitors are identified,
- whether visitors are escorted,
- where public space ends and restricted space begins.

Good reconnaissance should identify not only the controls, but also the moments when people stop paying attention to them.

Examples include the beginning of a large meeting, a shift change, lunch time, an equipment delivery or ongoing construction work.

During these periods, movement becomes more intense and a single unfamiliar person is easier to lose in the background.

---

## OSINT as preparation for physical access

Public information about an organization can directly increase the credibility of an on-site scenario.

Job advertisements reveal team names and technologies.

Press releases show current projects and investments.

Supplier posts may reveal who maintains monitoring systems, printers, network services, office equipment or technical infrastructure.

Employee profiles help map the organizational structure and identify people responsible for specific areas.

Photos from company events may show dress code, badges, office layout or visitor markings.

None of this information has to be confidential.

Its value appears after correlation.

The attacker does not need complete knowledge of the organization. They only need enough accurate details to make their story sound natural.

---

## Observe the rhythm, not only the controls

An access-card reader does not operate in isolation.

Its effectiveness depends on how people behave around it.

During reconnaissance, observe whether employees:

- hold doors open for others,
- enter in larger groups,
- react to people without visible badges,
- expose their access cards in easily visible locations,
- escort visitors to reception,
- leave technical entrances open,
- block doors during deliveries,
- use the same passages as contractors.

Formally, the organization may have access control.

In practice, the system may depend on every person behaving exactly as the policy expects.

That is a fragile control.

---

## The pretext must fit the specific layer of the building

The same role may not be equally convincing throughout the entire facility.

At the vehicle gate, a role connected with a delivery, technical service or construction work may appear credible.

At reception, the important elements may be the name of the employee responsible for the visit, the purpose of the meeting and the external company involved.

Inside the office area, a role linked to a specific internal task or team may work better.

The pretext should therefore develop as the tester moves through the facility.

This does not mean creating several unrelated stories.

The core should remain consistent, but the explanation must match the person being addressed.

Security is interested in the right to enter.

Reception wants to know who is responsible for the visitor.

An office employee may ask what task is being performed.

A strong scenario anticipates these differences.

---

## Entering the site does not always mean entering the organization

Many facilities contain several separate layers:

**property boundary → building → reception → floor → office zone → restricted room**

Each layer may have a different owner, administrator and access-control system.

This is especially important in office buildings shared by multiple companies.

Permission from one organization to conduct a test may not include:

- the parking area managed by the building owner,
- elevator systems,
- the main reception desk,
- shared corridors,
- access control belonging to the facility administrator,
- areas occupied by other tenants.

The scope must clearly state which layers may be tested and who has the authority to approve them.

The technical ability to reach an area does not automatically create permission to test it.

---

## The first layer: entrance control

A gate, reception desk or security checkpoint should stop a person who cannot confirm the purpose of their visit.

In practice, however, there is often a conflict between security and operational efficiency.

Security does not want to create queues.

Reception does not want to delay an important guest.

An employee does not want to be responsible for interrupting a service visit.

An attacker may exploit this pressure by presenting the situation as routine, urgent or already approved.

The strongest control is not asking a long list of questions.

It is independent confirmation of:

- whether the visit was scheduled,
- who is responsible for the visitor,
- what the purpose of entry is,
- which areas the visitor should access,
- who will escort them.

If no responsible employee can be reached, the answer should not automatically be to issue a badge.

A failed verification is still a verification result.

---

## A visitor badge must not become permission to move freely

Registering a person at reception does not solve the entire problem.

A visitor may hold a valid badge and still:

- enter the wrong zone,
- remain without supervision,
- use an open passage,
- join a group of employees,
- access an active workstation,
- observe internal processes.

A visitor badge should communicate the person’s status, not automatically extend their access.

The key control is a clearly assigned host.

That person should collect the visitor, remain responsible for them and ensure they leave the facility after the visit.

---

## Tailgating: politeness as a way around the reader

Tailgating exploits a simple social conflict.

An employee knows that everyone should use their own card, but they also do not want to close the door in front of someone walking directly behind them.

If the stranger looks credible, carries equipment or appears busy on a phone call, holding the door feels natural.

The technical control works correctly.

It simply does not record the person who entered together with the authorized employee.

The problem becomes more serious when the access-control system is also used to record entry and exit times. The logs then show only the legitimate cardholder.

A secure response does not have to sound aggressive:

> Everyone needs to use their own card. I can help you contact reception.

The employee should not investigate or confront the person alone.

They only need to avoid transferring their own access.

---

## A badge and lanyard are not proof of identity

Visual identification works mainly because people do not inspect it closely.

They see a familiar shape, a colored lanyard and a card hanging from someone’s neck. The brain fills in the rest:

> This person works here.

The card may be:

- invalid,
- issued by another organization,
- a visitor pass,
- an empty card,
- an old badge,
- part of a prepared disguise.

From the employee’s perspective, simply seeing a badge should not end the evaluation.

What matters is whether the person:

- belongs in that zone,
- is recognized,
- carries the correct type of identification,
- moves according to the rules,
- can identify their host or explain their purpose.

Appearance creates credibility.

It does not create authorization.

---

## Alternative entrances reveal the real quality of physical security

Organizations often focus most of their controls on the main entrance.

The facility may still contain:

- delivery entrances,
- loading bays,
- technical doors,
- parking connections,
- warehouse passages,
- emergency exits,
- shared areas,
- temporary routes used during construction.

Each area may operate under different rules.

A door with an access-card reader does not provide security if it is routinely blocked open during deliveries.

CCTV does not protect the facility if nobody monitors it in real time.

A fence does not stop an intruder if an uncontrolled gap exists between zones.

The facility must be viewed as a complete system.

An attacker chooses the path of least resistance, not the one intended by the designer.

---

## Door checking as a test of basic physical hygiene

One of the simplest ways to assess security does not require advanced tools.

It involves checking whether doors that should remain closed actually are closed.

The issue may not be a broken lock.

Doors may be:

- not fully closed,
- blocked with an object,
- left open during work,
- equipped with a broken door closer,
- routinely opened for convenience.

This is the physical equivalent of testing default passwords.

The control exists, but everyday behavior has weakened it.

A strong control should return to a secure state automatically. It should not depend entirely on whether the last person remembered to close the door correctly.

---

## Moving through the office: behave like someone with a purpose

After reaching the office area, the biggest risk to the tester is not always a technical control.

Sometimes it is a simple question:

> Can I help you?

A person wandering without purpose, reading noticeboards or checking multiple doors quickly attracts attention.

A credible presence should have direction.

The attacker may look as though they are:

- searching for a specific room,
- completing a technical task,
- waiting for an employee,
- returning from a meeting,
- moving equipment,
- preparing an area for an event.

The important part is not moving quickly.

It is appearing to know exactly where you are going.

---

## Changing roles increases the risk of inconsistency

In more complex scenarios, the tester may want to change appearance or behavior after reaching a different part of the facility.

Someone who first appeared as an external contractor may later try to look like an office employee.

This increases the number of details that can expose inconsistencies:

- clothing that does not match the new role,
- the wrong badge,
- equipment remaining from the previous scenario,
- insufficient knowledge of internal processes,
- conflicting explanations given to different people.

The more roles involved, the larger the error surface.

A good methodology therefore prefers the simplest scenario capable of testing the target control.

---

## Small talk is not meaningless conversation

A short discussion about everyday problems can quickly create a feeling of familiarity.

The attacker does not need to request access immediately.

They may begin with a neutral comment about:

- slow elevators,
- equipment problems,
- an office reorganization,
- workload,
- unreliable systems,
- a company event.

When the two people find a shared topic, the stranger begins to feel more like part of the same group.

Complaining together can be particularly effective.

A problem with an application, printer, air conditioning system or new procedure may create an immediate sense of alliance:

> They understand my problem, so they probably belong here.

Small talk does not grant formal access.

It can make the later request feel less like a request from a stranger.

---

## Access to a workstation: where physical and digital security meet

The most important moment in an on-site attack may occur when an employee gives the intruder control of an unlocked workstation.

At this point, the earlier layers come together:

- the person entered the building,
- reached the correct office area,
- built trust,
- introduced a believable problem,
- was treated as technical staff,
- received direct access to the system.

The attacker does not need to know the password.

They do not need to bypass MFA.

They do not need to exploit a network vulnerability.

They use the active session of a legitimate user.

An employee should therefore never hand over a workstation to someone whose identity cannot be independently verified.

Even a real IT employee should follow the established support process.

---

## “My computer is slow” as a natural entry point

Technical problems are an effective way to begin a conversation because almost every user has something to complain about.

A slow system, unavailable printer, synchronization issue or unstable connection sounds completely ordinary.

The attacker can use that frustration by offering immediate help.

The employee stops focusing on the identity of the person making the request.

They focus on solving their own problem.

The more helpful and competent the person appears, the easier it becomes to obtain:

- access to the screen,
- an active user session,
- permission to connect a device,
- information about the environment,
- details about internal systems.

A secure support process should be predictable.

Employees should know how IT visits are announced, how technicians identify themselves and which actions they are allowed to perform.

---

## Minimal evidence is better than maximum access

During a social engineering assessment, it is easy to continue simply because more access becomes possible.

Once the tester gains access to an unlocked workstation, they may technically be able to:

- run additional tools,
- browse resources,
- establish persistence,
- connect to other systems,
- collect real data.

Not every action is necessary to prove the weakness.

If the objective was to determine whether an unverified person could obtain workstation access, sufficient evidence may include:

- recording the device name,
- running an agreed identification command,
- creating a controlled file,
- taking a photograph without exposing sensitive data,
- confirming access to a designated test resource.

The best Proof of Concept demonstrates realistic impact while limiting risk.

A test should not become an incident simply because another technical step is possible.

---

## Unknown devices: trusting an object instead of a person

An on-site attack does not always require the attacker to enter the building personally.

Sometimes the organization brings the threat inside itself.

An unknown storage device, cable, keyboard, charger or promotional gadget may look like ordinary equipment. Once connected, however, it may behave differently than expected.

Devices that identify themselves as keyboards are particularly dangerous. The operating system treats them as ordinary input devices rather than as files requiring user interaction.

The most important lesson is not about a specific model of hardware.

It is about trust in a physical object.

If a device:

- appears without an order,
- comes from an unverified source,
- has been found somewhere,
- was delivered outside the normal process,
- looks like promotional material,
- has not been checked by the responsible team,

it should not be connected to organizational systems.

This also applies to the IT department.

High privileges do not reduce the risk. They increase the potential impact.

---

## Access-card security does not end with the RFID frequency

An access card is often treated like the physical equivalent of a password.

The problem is that not all card technologies provide the same level of protection.

Older or simpler cards may transmit a static identifier that the system treats as the user’s identity. If the mechanism does not use proper cryptographic authentication, possessing the identifier may be enough to imitate the card.

The way employees carry cards can make the situation worse.

Cards are often exposed:

- on the outside of clothing,
- on a belt,
- on a bag,
- together with keys,
- on a lanyard in public spaces.

The organization should assess:

- which card technology is used,
- whether identifiers can be copied easily,
- whether the system detects unusual use,
- whether one card opens too many zones,
- whether access rights are reviewed regularly,
- whether lost cards are quickly revoked,
- whether critical areas require an additional control.

The card should be one part of access control, not the only proof of identity.

---

## Radio tools are only one part of the problem

Devices used to analyze RFID, NFC, radio signals and wireless systems can be useful during authorized testing.

The tool itself does not determine whether the attack will succeed.

The important questions are:

- does the card technology provide secure authentication,
- is the access-control system configured correctly,
- do employees protect their badges,
- is unusual activity monitored,
- are critical areas protected by additional controls?

Focusing only on a specific gadget creates a false sense of security.

Blocking one device model does not repair a weak process.

---

## Leaving the facility is also part of the scenario

The tester must not only enter the facility. They must also end the activity safely.

Leaving is often easier because organizations focus on controlling people who enter.

Doors may not require authentication from the inside, and employees rarely question someone who is leaving.

This does not mean the exit stage can be ignored.

The plan should define:

- whether the visitor badge must be returned,
- whether the exit is logged,
- whether the tester should be collected by the coordinator,
- how test artifacts will be removed,
- what to do if security intervenes,
- how the end of the assessment will be confirmed.

A forgotten badge, device, document or piece of equipment may later trigger a real incident.

A useful rule is:

> The test ends only when the organization has been returned to the agreed state.

---

## Leaving artifacts must be controlled

Bait devices and storage media may be used to test employee behavior.

Such exercises require careful planning.

Each artifact should be:

- uniquely assigned to the campaign,
- technically safe,
- traceable,
- monitored,
- included in a removal plan,
- limited to the agreed action.

The tester should never leave items that cannot later be accounted for.

If ten devices are placed, the tester must know what happened to every one of them.

One missing device after the assessment becomes a real security problem.

---

## People are not as good at detecting lies as they think

People often believe they can recognize deception from behavior.

They look for poor eye contact, nervous movements, a shaking voice or inconsistent answers.

The problem is that stress is not proof of lying, and calmness is not proof of honesty.

A legitimate employee may appear nervous.

A well-prepared attacker may look completely natural.

Security should therefore not rely on intuitive judgments about people.

Verifiable facts are much stronger:

- a confirmed service ticket,
- a known host,
- the correct badge,
- compliance with the process,
- independent contact,
- appropriate access rights.

Intuition may trigger verification.

It should not replace it.

---

## The stress response affects both sides of the interaction

Encountering an unknown person in a restricted zone may also create stress for the employee.

They may:

- ignore the situation,
- not know what to say,
- fear confrontation,
- assume someone else has already reacted,
- freeze and do nothing.

This is why the procedure should not require the employee to confront the person alone.

Their role may be limited to:

- maintaining a safe distance,
- not granting access,
- remembering basic details,
- contacting security,
- reporting the person’s location.

The organization should make it clear that reporting someone without a visible badge is correct behavior, even if the person later turns out to be legitimate.

It is better to clarify a misunderstanding than ignore a real intruder.

---

## Passive CCTV does not stop an attack

Cameras often serve only as an archive.

The footage is recorded, but nobody watches it in real time.

This may help after an incident, but it does not stop the person currently moving through the office.

Effective monitoring should include:

- a clearly assigned operator,
- observation of critical passages,
- procedures for responding to unknown people,
- integration with access control,
- alerts for doors left open,
- a clear escalation path to security staff,
- regular response-time testing.

Advanced video analytics may support physical security, but it cannot repair the absence of a process.

The system may detect unusual presence.

Someone still needs to know what to do with the alert.

---

## Good defense does not require rudeness

One of the biggest challenges in physical security is the belief that following procedure is impolite.

An employee may worry that they will:

- close the door in front of a new colleague,
- offend an important guest,
- delay a service technician,
- overreact,
- appear confrontational.

The organization should remove this conflict.

It is possible to remain helpful without granting access:

> I cannot open this door with my badge, but I can show you where reception is.

> I do not recognize you, so I will contact IT and confirm the visit.

> I cannot give access to this workstation without a ticket. I can help create one.

This is not an accusation.

It is the correct execution of the process.

---

## A defensive model for employees

When encountering an unfamiliar person in a restricted area, perform a short assessment.

### Should this person be in this zone?

A visitor badge inside a technical area may require verification.

### Are they accompanied by a host?

A visitor left without supervision should not search the building alone.

### Are they asking me to use my privileges?

This may involve opening a door, using a badge, providing a workstation or connecting a device.

### Can I verify the situation without using contact details provided by them?

Use the internal directory, service desk, reception or security.

### Do I feel pressure to ignore the process?

Urgency and references to important people increase the need for verification.

The employee does not need to prove that an attack is taking place.

They only need to recognize a situation they should not authorize alone.

---

## The report should reconstruct the attack path

An on-site assessment report should not be a collection of dramatic photographs and anecdotes.

It should show how one weakness enabled the next.

A useful report explains:

- what information was collected before the test,
- what was observed during reconnaissance,
- which entry path was chosen,
- which controls were encountered,
- how those controls were bypassed,
- who reacted correctly,
- where the tester was left unsupervised,
- which resources became accessible,
- when the objective was achieved,
- what happened during the exit.

The description should be chronological.

This allows the client to see the complete chain rather than a single isolated mistake.

---

## Observation, evidence and impact

Each important moment in the assessment can be described using three elements.

### Observation

What exactly happened?

> The tester entered the restricted office area with a group of employees without using their own badge.

### Evidence

What confirms the observation?

> The entry time, photographs, the tester’s activity log and CCTV footage.

### Impact

What could a real attacker achieve?

> Unlogged access to workstations, meeting rooms and internal network ports.

This keeps the report focused on facts.

---

## Report failed processes, not individual people

Weak description:

> An employee allowed an unknown person into the office.

Better description:

> The access-control process allowed several people to pass after a single card authentication. Employees had no defined method for responding to someone entering without using their own credentials.

Weak description:

> The user carelessly handed over the computer.

Better description:

> A person claiming to be technical support obtained access to an active user session. The organization did not use a recognizable process for confirming unannounced support visits.

This makes the recommendation focus on the real cause.

---

## Controls that should stop the attack

Resistance to on-site attacks does not come from one procedure.

It requires overlapping layers:

- pre-registration of visits,
- independent confirmation of visitors,
- mandatory escorting,
- clear visitor identification,
- limiting visitors to required zones,
- using individual access cards,
- preventing doors from being left open,
- regular inspection of locks and door closers,
- responding to people without visible identification,
- controlling unknown devices,
- blocking unauthorized USB equipment,
- automatic screen locking,
- limiting user privileges,
- monitoring backed by a real response procedure,
- scenario-based training.

It is also important to verify that the controls work in practice.

A written policy will not stop an attack if employees do not know it or cannot follow it.

---

## Common organizational mistakes

### Concentrating all security at the main reception

Side entrances, parking areas and delivery zones remain much less controlled.

### Treating the badge as complete proof of identity

Nobody checks whether the badge matches the person or the zone.

### Leaving visitors without an escort

A properly registered visitor can still move freely through the facility.

### Making door-holding part of organizational culture

Security loses to politeness.

### Informal IT support processes

Employees do not know how to recognize a legitimate technician.

### No response to unfamiliar people

Everyone assumes somebody else has already verified them.

### Connecting unsolicited equipment

The item is judged by its appearance rather than its source.

### Using CCTV only after the incident

The cameras record the attack but do not interrupt it.

---

## Common tester mistakes

### Failing to separate client systems from building-owner systems

The tester may enter infrastructure owned by a party that never approved the assessment.

### Using an overly complex cover story

Every additional detail increases the risk of contradiction.

### Continuing after the objective has been achieved

Further action increases the impact without adding useful evidence.

### Collecting unnecessary data

Evidence can be gathered without copying documents or customer information.

### Leaving artifacts behind

An unaccounted device or badge becomes a real security issue.

### Failing to plan the exit

The tester knows how to enter but not how to end the interaction safely.

### Judging people instead of controls

The report focuses on embarrassing an employee rather than fixing the process.

---

## On-site assessment checklist

### Preparation

- [ ] Define the exact objective and minimum evidence.
- [ ] Separate client-controlled areas from third-party areas.
- [ ] Confirm approved locations and time windows.
- [ ] Prepare one consistent cover story.
- [ ] Define prohibited roles and actions.
- [ ] Set immediate stop conditions.
- [ ] Prepare coordinator contact details.
- [ ] Plan a safe exit from the facility.

### Reconnaissance

- [ ] Identify all entrances and zone boundaries.
- [ ] Review the visitor-handling process.
- [ ] Observe periods of increased traffic.
- [ ] Identify suppliers and contractors.
- [ ] Review badges and how they are carried.
- [ ] Check whether doors return to a closed state.
- [ ] Document only what is necessary for the report.

### Execution

- [ ] Maintain an accurate timestamped log.
- [ ] Separate facts from assumptions.
- [ ] Recheck scope after crossing each layer.
- [ ] Do not involve people or systems outside scope.
- [ ] Stop after obtaining sufficient evidence.
- [ ] Record successful defensive behavior as well.

### Completion

- [ ] Leave the facility according to the agreed plan.
- [ ] Return visitor cards and borrowed items.
- [ ] Remove all test artifacts.
- [ ] Account for every device left during the exercise.
- [ ] Confirm completion with the coordinator.
- [ ] Secure documentation and personal data.

---

## One sentence I’m keeping

**An on-site attack does not succeed because the door has no lock, but because each person assumes that someone else has already verified who is walking through it.**
