---
id: gdpr-practical-data-protection-workflow
title: "GDPR Through an Expert’s Eyes: how to analyze personal data processing in practice"
team: governance
domain: governance-risk-compliance
section: data-protection
type: knowledge
angle: practical-gdpr-analysis-workflow
sourceTrack: sekurak-academy
tags:
  [
    "gdpr",
    "personal-data",
    "privacy",
    "controller",
    "processor",
    "cookies",
    "monitoring",
    "ai",
    "edr",
    "cloud",
    "data-transfer",
    "incident-response",
    "ict-risk",
  ]
difficulty: medium
shortDescription: "A practical workflow for analyzing GDPR-related issues: from identifying personal data and assigning roles, through lawful bases and minimization, to cloud services, AI, monitoring, international transfers, and personal data breaches."
updatedAt: "2026-08-05"
---

# GDPR Through an Expert’s Eyes: how to analyze personal data processing in practice

## Why this note exists

This note is not a summary of the entire GDPR.

It is also not about memorizing article numbers, creating more checkboxes, or automatically asking every user for consent.

Here, we care about practice.

You have a new system, application, supplier, form, monitoring solution, or cloud service. You know that personal data may appear somewhere in the process. You want to determine:

- whether personal data is actually being processed,
- who the controller is,
- who the processor is,
- why the data is processed,
- whether the scope of data is necessary,
- where the data goes,
- who can access it,
- how long it is retained,
- what happens if it is leaked,
- whether the person can request its deletion.

The GDPR should not be the first question.

First, understand the real process.

Only then can you assess whether it is compliant.

## The most important mental model

Do not start with:

> Do we need consent?

Start with:

> What data is being processed?

> Why is it being processed?

> Who decides the purpose?

> Who performs operations on the data?

> Where does the data go?

> What risk does this create for the person?

Consent is only one possible lawful basis.

It is not a universal solution to every data protection problem.

## Step 1: determine whether the information is personal data

Personal data is information that directly or indirectly identifies a natural person.

You do not need a national identification number.

Personal data may include:

- first and last name,
- business email address,
- phone number,
- username,
- IP address,
- photograph,
- voice recording,
- customer number,
- device identifier,
- user behavior history,
- location,
- job title combined with the name of an organization.

Example:

```text
pawel.litwinski@example.com
```

This address will usually identify a specific person.

A less obvious example:

```text
misiu143
```

For a random user, this username may not point to anyone specific.

For the platform operator, which has account data, IP addresses, and login history, it may identify a specific person.

The key question is:

> Does the entity possess, or can it reasonably obtain, additional information that allows the person to be identified?

Personal data is contextual.

The same information may be anonymous to one entity and identifying to another.

## Step 2: do not confuse anonymization with hiding part of the data

Removing one letter from a surname does not anonymize it.

A thin black bar over someone’s eyes does not make the person unrecognizable either.

Example:

```text
John Smit_
```

If the information concerns an employee of a small organization or a resident of a small town, identifying the person may still be easy.

The same applies to images.

Even after hiding the face, a person may still be recognized by:

- clothing,
- location,
- body shape,
- tattoos,
- vehicle,
- event context,
- accompanying people.

Anonymization is effective only when identification is no longer reasonably possible.

If there is a separate table or key that restores identity, the data is pseudonymized, not anonymized.

Example:

```text
USER-84721
```

If the organization has a table:

```text
USER-84721 = John Smith
```

the data is still subject to the GDPR.

## Step 3: identify the role of each entity

The key roles are:

- controller,
- processor,
- subprocessor,
- independent controller.

The controller decides:

- why the data is processed,
- what data is necessary,
- how long it will be used,
- who receives access,
- what operations are performed.

A processor performs operations on personal data on behalf of the controller.

Example:

A company owns a customer database and uses an external mailing platform.

The company decides:

- who receives the newsletter,
- what content is sent,
- when messages are sent.

The platform technically stores addresses and sends the messages.

In this model, the company is the controller and the mailing provider may be the processor.

Not every exchange of data is processing on behalf of another party.

When two companies exchange the business contact details of their employees to perform a contract, each will usually act as an independent controller.

You do not automatically need a data processing agreement with every company that receives an email.

## How to recognize processing on behalf of a controller

Ask:

> Does the supplier use the data for its own purpose, or does it perform operations defined by the customer?

Consider a security company.

If its staff merely guard a building and respond to incidents, they may not process personal data on behalf of the customer.

If they:

- operate CCTV,
- maintain a visitor register,
- manage access cards,
- review recordings,
- store employee lists,

they are likely processing personal data for the customer.

A data processing agreement should then be considered.

The most important rule:

> Do not assign the role based on the name of the service. Check what the supplier actually does with the data.

## Step 4: define the purpose of processing

Every operation should have a specific purpose.

It is not enough to say:

```text
We process data for business purposes.
```

The purpose should explain why the data is necessary.

Examples:

- order fulfillment,
- user account management,
- complaint handling,
- building security,
- malware detection,
- newsletter delivery,
- offer personalization,
- defense against legal claims,
- compliance with a legal obligation.

If the organization cannot explain why a specific field is needed, it probably should not collect it.

## Step 5: verify data minimization

Collect only what is necessary for the defined purpose.

Consider a loyalty program.

Creating an account may require only:

```text
email address
```

or:

```text
phone number
```

If the form also requires:

- full residential address,
- date of birth,
- gender,
- marital status,
- number of children,

you need to determine why.

The real purpose may not be issuing a loyalty card, but:

- profiling,
- customer segmentation,
- marketing,
- behavioral analytics,
- advertising personalization.

The most important question is:

> Will the process work without this information?

If the answer is yes, collecting it may be excessive.

## Step 6: choose the correct lawful basis

Not every processing operation requires consent.

A lawful basis may include:

- performance of a contract,
- compliance with a legal obligation,
- legitimate interests,
- performance of a public task,
- protection of vital interests,
- consent.

Consider a named concert ticket.

If the terms state that the ticket belongs to one person and cannot be transferred, the organizer may verify the attendee’s identity.

Showing an identity document at the entrance may be necessary to perform the contract.

This does not automatically mean the organizer should:

- copy the document,
- photograph it,
- retain a scan,
- record the full document number.

Identity verification must be separated from copying identity data.

## Consent must not be forced

Consent should be:

- freely given,
- informed,
- specific,
- unambiguous,
- withdrawable.

If the user cannot use a service without accepting unnecessary marketing, consent is difficult to regard as freely given.

Consent should also not be collected where processing is actually required to perform a contract or comply with law.

Otherwise, a basic problem appears:

> What will the controller do if the user withdraws consent but the data must still be processed?

## Step 7: analyze the cookie mechanism

Cookies should not be assessed only by looking at the banner.

You need to verify what the system actually does.

First determine:

- what cookies are stored,
- which ones are strictly necessary,
- which ones support analytics,
- which ones support advertising,
- which scripts run before the user makes a choice,
- who receives the data,
- whether refusal is respected.

The choices should be equally accessible.

Example:

```text
Accept all
Reject all
Customize settings
```

The rejection option should not be:

- hidden in a second window,
- written in smaller text,
- greyed out,
- harder to click,
- replaced with merely closing the banner.

Consent requires an active action.

Scrolling or continuing to use the website should not be treated as consent.

## Do not replace refusal with “legitimate interests”

Some consent management platforms show two switches for a supplier:

```text
Consent
Legitimate interests
```

This may create a situation in which the user refuses consent but similar processing continues under legitimate interests.

This approach requires particular caution.

A mechanism should not be designed so that refusal is merely cosmetic.

The key question is:

> After the user clicks “reject,” does processing for that purpose actually stop?

If not, the interface may be misleading.

## Step 8: separate household use from public disclosure

The GDPR may not apply to activities carried out exclusively for personal or household purposes.

Example:

```text
A private contact list stored on a smartphone.
```

The situation changes when the data is made public.

Example:

```text
Publishing dashcam footage on social media.
```

Whether the publisher earns money is not decisive.

A lack of commercial purpose does not automatically permit the publication of another person’s data.

You must also consider:

- privacy,
- image rights,
- reputation,
- personality rights,
- confidentiality of communications.

The GDPR is not the only legal framework protecting individuals.

## CCTV and cameras

For any monitoring system, first determine:

- what area the camera covers,
- why monitoring is performed,
- who has access to recordings,
- how long recordings are stored,
- whether audio is recorded,
- whether the camera covers public space,
- whether the field of view can be limited.

Monitoring limited to one’s own property may fall within household use.

If the camera also covers:

- a pavement,
- a road,
- a neighbor’s entrance,
- another person’s garden,
- common space,

the situation requires broader analysis.

This does not automatically make monitoring prohibited.

The scope must still be necessary and proportionate.

## Dashcams

Recording the road may be justified by the need to preserve evidence in case of a collision or another incident.

Keeping a recording is different from publishing it.

Providing footage to:

- the police,
- an insurer,
- a court,

has a different purpose from uploading it to the internet to ridicule another road user.

The most important question is:

> What will the recording be used for?

Risk increases when recordings are:

- published publicly,
- retained indefinitely,
- used to identify and shame people,
- disclosed without a defined purpose.

## Drones

With drone footage, asking only whether the GDPR applies is not enough.

The observation itself may interfere with privacy.

Flying over:

```text
a public road
```

is different from flying over:

```text
an apartment window
```

or:

```text
a private garden, nursery, or swimming pool
```

Ask:

- is the camera intentionally observing a particular person,
- is the person in a private setting,
- is the observation prolonged,
- can the person be identified,
- is the image being recorded,
- will the footage be disclosed?

Even where the GDPR does not apply, privacy or personality rights may still be infringed.

## Step 9: analyze the rights of the data subject

A person may request:

- access,
- rectification,
- erasure,
- restriction of processing,
- data portability,
- objection.

Not every request means that data must be deleted immediately.

First verify:

- what data is processed,
- the lawful basis,
- whether the purpose still exists,
- whether a retention period applies,
- whether the data is needed to defend legal claims,
- whether retention is required by law.

The right to erasure applies to personal data.

It does not always mean every piece of content created by the user must be removed.

## Account deletion in a collaborative application

Imagine an application where several people work on one project.

One user requests account deletion.

Do not begin by automatically deleting the whole project.

First determine:

- who owns the project,
- whether the project belongs to the entire team,
- which elements identify the departing user,
- whether the history can be anonymized,
- whether the content must remain available to other users,
- what the service terms provide.

One possible solution may be:

```text
Deleted user
```

instead of:

```text
John Smith
```

However, this may still fail to anonymize the person.

Everything depends on the project content and remaining metadata.

## Verifying the person making the request

A request may be submitted through different channels, including by phone.

The problem is verifying who is actually calling.

Do not automatically demand a scan of an identity document.

Choose a method proportionate to the risk.

Examples:

- an email from the address linked to the account,
- confirmation after login,
- a one-time code,
- a trusted public electronic identity service,
- in-person verification for high-risk cases.

The most important question is:

> How can identity be confirmed without collecting more unnecessary data?

## Step 10: verify data accuracy

The GDPR requires personal data to be accurate.

Example:

An insurer sends messages to the wrong address because a customer entered another person’s email address by mistake.

Two problems arise:

- the data stored in the system is inaccurate,
- messages are sent to a person for whom the company may have no lawful basis.

The organization should have a process for:

- reporting incorrect data,
- correcting information,
- stopping further messages,
- propagating the correction to other systems,
- identifying the source of the error.

Data should not be considered accurate merely because it exists in a system.

## Step 11: analyze blogs, forms, and newsletters

A simple blog without accounts, comments, or newsletters may process only a limited amount of technical data.

Example:

```text
an IP address in server logs
```

A short notice may be sufficient to explain:

- who operates the website,
- what technical data is logged,
- why logs are created,
- how long they are retained,
- what rights the visitor has.

The situation changes when the site adds:

- comments,
- a contact form,
- user accounts,
- analytics,
- advertising,
- a newsletter.

Every new feature creates another data flow.

## Newsletter as a service

A newsletter is not just a list of email addresses.

It is an electronic service provided to a user.

Determine:

- who the service provider is,
- who the controller is,
- how the user subscribes,
- how the user can unsubscribe,
- what content will be sent,
- whether the address is disclosed to a mailing platform.

If a newsletter moves from a natural person to a company, the service provider and controller may change.

It is not enough that the same natural person owns shares in the company.

They are separate legal entities.

Users should be informed about the change and its consequences.

## Step 12: analyze cloud and collaboration tools

Storing personal data in Teams, SharePoint, Google Workspace, or another tool is not automatically compliant or non-compliant.

The configuration and actual access model matter.

Ask:

- who can open the file,
- whether guests have access,
- whether MFA is used,
- whether a link can be forwarded,
- whether a file can be downloaded to a personal device,
- where the data is stored,
- what the retention rules are,
- whether copies are created,
- whether recordings and transcripts are generated,
- whether the provider uses data for its own purposes.

An additional password on a file may be a useful safeguard.

It does not replace:

- access control,
- a contract with the supplier,
- a lawful basis,
- retention rules,
- transfer analysis.

## Shared drives

The fact that a drive is internal does not mean every employee should see every file.

Example of a poor model:

```text
\\company\shared\everyone
```

containing:

- HR data,
- customer documents,
- contracts,
- health information,
- salary lists.

Access should follow roles and duties.

Check:

- permission groups,
- directory owners,
- access held by former employees,
- service accounts,
- ability to copy data,
- access logging,
- periodic permission reviews.

Unauthorized internal access may still be a personal data breach.

Do not assume there is no problem merely because the data never left the organization.

## Step 13: analyze EDR and antivirus platforms

An EDR solution may send much more to the cloud than a file hash.

Telemetry may include:

- file name,
- full path,
- user name,
- device name,
- IP address,
- process details,
- command-line arguments,
- file samples,
- memory fragments.

Example:

```text
C:\Users\John.Smith\Documents\Sick_leave_depression.pdf
```

The file name and path alone may disclose personal data and even health information.

Before deploying EDR, check:

- what telemetry is transmitted,
- whether full files are uploaded,
- whether sample submission can be disabled,
- where the console is hosted,
- where data is processed,
- whether the provider accepts the processor role,
- whether subprocessors are used,
- how long data is retained,
- whether samples are used for the provider’s own research.

Do not automatically accept the statement:

```text
We do not process personal data.
```

Verify the real technical flow.

## Public file analysis services

Before submitting a file to a public analysis service, assume that the sample may be:

- stored,
- retained for a long time,
- shared with other researchers,
- used to improve the product,
- downloaded by paid users,
- processed outside the EEA.

Do not submit without analysis:

- customer documents,
- files containing employee data,
- production configurations,
- files containing secrets,
- complete databases,
- confidential documentation.

Prepare the smallest possible sample first.

Remove everything not required to investigate the threat.

## Step 14: analyze AI and external APIs

Entering data into a generative AI system means disclosing it to an external provider.

Do not treat a chat interface as a private notebook.

Before submitting customer data, verify:

- whether content is stored,
- whether it is used for training,
- whether humans may review it,
- whether the provider acts as a processor,
- where data is processed,
- how long it is retained,
- whether deletion can be enforced,
- whether a business version offers different terms,
- whether the organization has approved use of the tool.

Do not submit to a public model:

- full customer records,
- national identification numbers,
- health data,
- credentials,
- internal documents,
- trade secrets,
- non-anonymized incident details,
- configurations containing secrets.

A safer input:

```text
Customer_A reported an error in System_X.
```

instead of:

```text
John Smith, national ID 90010112345, reported an error in the banking system...
```

You must still check whether the remaining details allow re-identification.

## Step 15: analyze profiling

Profiling is the analysis of data about a person to predict or evaluate behavior, interests, or characteristics.

Example:

A system records:

- viewed products,
- visit duration,
- clicked links,
- search history,
- IP address,
- device identifier.

It then tries to connect an anonymous profile to a specific user account.

Once the profile is linked, the data is no longer anonymous.

Before implementation, determine:

- the purpose of profiling,
- the lawful basis,
- whether the user has been informed,
- how reliable the match is,
- what happens if the system is wrong,
- whether the profile includes special-category data,
- whether the decision has a significant effect on the user.

Example risk:

Two people use the same device.

The system assigns the first person’s behavior to the second person’s account and displays advertising related to:

- health,
- pregnancy,
- medication,
- financial difficulties.

The issue is not only privacy.

It is also data accuracy.

## Step 16: verify transfers outside the EEA

Do not assess international transfers only by asking:

```text
Where is the server located?
```

Also consider:

- the supplier’s establishment,
- administrator access,
- technical support,
- subprocessors,
- backups,
- global operations teams,
- remote access from third countries.

Example:

The server is in Germany, but technical support is provided by a team in India.

The data may still be accessible outside the EEA.

For any transfer, verify:

- the transfer mechanism,
- standard contractual clauses,
- an adequacy decision,
- the relevant framework,
- third-country risk assessment,
- supplementary safeguards,
- the current subprocessor list.

An NDA or SOC 2 report does not legalize a transfer on its own.

They are supporting safeguards, not a replacement for the required legal mechanism.

## Step 17: safeguards should follow the risk

The GDPR does not mandate one antivirus product or one encryption algorithm.

Safeguards should be appropriate to:

- the type of data,
- the number of people,
- possible consequences,
- the processing method,
- system availability requirements,
- current threats.

For a device storing health records, consider:

- full-disk encryption,
- MFA,
- security updates,
- screen locking,
- a restricted user account,
- backups,
- remote wipe,
- removable media control,
- antimalware protection.

Encryption is especially important when a device is lost.

If a stolen laptop was properly encrypted, the risk of access may be much lower.

A password on the user account does not necessarily mean the disk is encrypted.

## Step 18: determine whether a personal data breach occurred

A personal data breach may involve:

- loss,
- destruction,
- alteration,
- unauthorized disclosure,
- unauthorized access.

Not every incident must be reported to the supervisory authority.

First, assess the risk.

Determine:

- what data was affected,
- how many people are involved,
- who obtained access,
- whether the data was encrypted,
- whether it can be used for fraud,
- whether it includes special-category data,
- whether the data was recovered,
- whether access was confirmed,
- what consequences may follow for individuals.

Example:

An employee sends an internal file to the wrong department.

This does not automatically create high risk.

Check:

- who received the file,
- whether the recipient is bound by confidentiality,
- whether the file was opened,
- whether the message was deleted,
- what type of data the file contained.

The assessment cannot rely only on the word “leak.”

The real effect matters.

## Step 19: document decisions

If the organization identifies a problem but the supplier refuses to fix it, ignoring the risk is the worst option.

Document:

- the problem,
- the risk assessment,
- correspondence with the supplier,
- recommended actions,
- refusal to implement changes,
- the risk owner’s decision,
- compensating controls,
- the next review date.

Documentation does not make a non-compliant process compliant.

It may, however, demonstrate that the organization:

- identified the issue,
- attempted to reduce it,
- made a conscious decision,
- applied available safeguards.

During an audit, the result is not the only thing that matters.

The decision-making process matters too.

## Minimal GDPR analysis workflow

The shortest practical process looks like this:

1. Describe the real business process.
2. Identify all categories of data.
3. Determine whether a person can be identified.
4. Identify controllers, processors, and subprocessors.
5. Define the purpose of each operation.
6. Select the correct lawful basis.
7. Remove unnecessary data.
8. Identify recipients and processing locations.
9. Analyze transfers outside the EEA.
10. Define retention.
11. Design data subject rights handling.
12. Select safeguards based on risk.
13. Prepare personal data breach handling.
14. Document the analysis and decisions.
15. Reassess the process after changes to the system or supplier.

## Questions for an IT supplier

When evaluating a new service, ask:

```text
What data do you receive?

Do you receive personal data?

For what purposes do you use the data?

Do you act as a processor or an independent controller?

Where is the data stored?

From which locations can your staff access it?

Do you use subprocessors?

Is the data used to train models or improve the product?

How long do you retain the data?

How is deletion handled?

Do you transmit full files or only telemetry?

Can we limit the data being transmitted?

How are incidents reported?

What happens to the data after termination?
```

## Questions for the process owner

```text
Why do we need this data?

What happens if we do not collect it?

Who should have access?

Would the user expect this use?

Can the purpose be achieved in a less intrusive way?

How long is the information genuinely needed?

Can the user correct the data?

Can the user delete the account?

What happens to backups?

Does the data flow into other systems?

Does the process involve AI, profiling, or monitoring?

What could happen if the system is wrong?
```

## How to think about consent

Do not think:

> We have a checkbox, so we are compliant.

Think:

> Did the user really have a choice?

> Did the user know what they were agreeing to?

> Was refusal actually enforced by the system?

> Can consent be withdrawn easily?

> Does processing actually stop after withdrawal?

A checkbox is only a user interface element.

Compliance depends on what the system does with the data.

## How to think about anonymous data

Do not think:

> We removed the name, so the data is anonymous.

Think:

> Can the person still be recognized from the remaining information?

> Is there a lookup table?

> Can the data be linked to another source?

> Does the context point to one specific person?

Anonymization is not cosmetic.

It must genuinely prevent identification.

## How to think about cloud services

Do not think:

> The data is password-protected, so the GDPR no longer applies.

Think:

> Who controls the service?

> Who can obtain administrative access?

> Where is the data copied?

> What does the supplier record in logs?

> Can entities outside the EEA access it?

> How will the data be deleted after the relationship ends?

Encryption and passwords are safeguards.

They do not replace analysis of the whole process.

## How to think about AI

Do not think:

> I am pasting only part of a document.

Think:

> Can the fragment identify a person?

> Will the model retain the content?

> Will the provider use it for its own purposes?

> Can deletion later be enforced?

> Has the organization approved this tool?

> Can the same goal be achieved with synthetic data?

The safest approach is to minimize the input and remove every element that could identify a person.

## Common mistakes

The first mistake is asking about consent before understanding the process.

The second mistake is assuming every company receiving data is a processor.

The third mistake is treating a partially hidden surname as anonymized data.

The fourth mistake is focusing on paperwork without checking real configurations.

The fifth mistake is assuming an internal system is safe merely because it is internal.

The sixth mistake is sending real data to public AI tools and public analysis services.

The seventh mistake is evaluating international transfers only by server location.

The eighth mistake is treating every incident as having the same risk.

The ninth mistake is retaining data without a deletion deadline.

The tenth mistake is treating GDPR compliance as complete once a privacy notice has been written.

## Mental model

Do not ask:

> Does the GDPR allow us to use this system?

Ask:

> What does this system actually do with the data?

Does it collect personal data?

Is the scope necessary?

Would the person expect this use?

Does the supplier have its own purpose?

Does the data leave the organization?

Does it leave the EEA?

Can it be deleted?

Can incorrect information be corrected?

Is access restricted?

Do we know what to do after an incident?

Only the answers to these questions allow a meaningful compliance assessment.

## Final checklist

Before accepting a process, verify:

- the purpose of processing is documented,
- all categories of data are identified,
- the controller is identified,
- processors and subprocessors are identified,
- the lawful basis is selected,
- the data scope is minimized,
- data accuracy is addressed,
- retention is defined,
- access is role-based,
- the system supports data subject rights,
- international transfers are identified,
- cloud services, telemetry, and copies are assessed,
- AI and profiling are assessed,
- safeguards are selected,
- a personal data breach procedure exists,
- decisions are documented.

## The most important idea

The GDPR does not begin with a checkbox.

It begins with a data flow.

First determine what information is created, who receives it, why it is used, and what risk this creates for a person.

Only then select the lawful basis, documentation, and safeguards.

If you do not understand the data flow, you cannot reliably assess whether the process is compliant.
