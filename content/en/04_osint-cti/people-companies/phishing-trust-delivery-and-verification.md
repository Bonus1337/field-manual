---
id: phishing-trust-delivery-and-verification
title: "phishing - when a message takes control of the decision"
team: red-blue
domain: social-engineering
section: phishing
type: methodology
angle: phishing-pretext-domain-delivery-psychology-defense-reporting
sourceTrack: social-engineering-sekurak
tags:
  [
    "phishing",
    "spear-phishing",
    "smishing",
    "whaling",
    "email-security",
    "social-engineering",
    "awareness",
  ]
difficulty: medium
shortDescription: "A practical look at phishing as a process combining reconnaissance, a believable pretext, a similar-looking domain, the right delivery channel and psychological pressure. The note also explains how to design defenses and safely assess an organization’s resilience."
updatedAt: "2026-07-29"
---

# Phishing - when a message takes control of the decision

Phishing does not begin with a link.

It begins with a situation designed to make clicking stop feeling like a security decision.

The message may describe a payment problem, a shared document, a password change, an undelivered package or a new task assigned by a manager.

Each of these scenarios works differently, but they all rely on the same mechanism.

The recipient is supposed to believe that they are performing an ordinary action related to their work or personal life.

The attacker does not try to convince someone that they should give their password to a criminal.

They convince them that they should log in to a system they already know.

They do not ask the victim to install malware.

They ask them to open a document that is supposedly an invoice, a policy update or an order confirmation.

That is why phishing is so effective.

It does not attack the control directly.

It attacks the interpretation of the situation.

---

## Guiding rule: the message must fit the recipient’s reality

The most effective phishing message does not always look perfect.

It does, however, need to arrive at the right time and concern something that feels believable to the recipient.

A finance employee may expect an invoice.

An administrator may receive information about alerts and system changes.

An HR employee regularly opens documents sent by job candidates.

A private user may be waiting for a package, a refund or an order confirmation.

The attacker does not need to know everything about the target.

They only need to identify one process that:

- occurs regularly,
- requires quick action,
- is handled digitally,
- uses links or attachments,
- lacks an easy independent verification method.

Phishing works best when a fake message arrives inside a real expectation.

---

## Phishing is a chain, not a single email

A phishing campaign consists of several connected elements:

**reconnaissance → pretext selection → infrastructure preparation → message delivery → recipient interaction → use of the result**

Each part may determine whether the attack succeeds or is detected.

A perfectly written message will not help if the domain looks suspicious.

A convincing domain will not be enough if the pretext does not fit the recipient.

A believable login page may be blocked quickly if the infrastructure is poorly prepared.

Even stolen credentials may have limited value if the organization uses strong authentication and quickly detects unusual sign-ins.

Phishing should therefore be analyzed as a complete attack path, not merely as the problem of one person clicking a link.

---

## Mass phishing and targeted attacks

A mass campaign relies on scale.

The same or a similar message is sent to a large number of people. The attacker assumes that a small percentage of recipients will click the link, open the attachment or make a payment.

They do not need detailed knowledge about every target.

A sufficiently universal scenario may be enough:

- a delivery problem,
- an additional charge,
- an account restriction,
- an attractive promotion,
- a refund,
- a notification from a popular service.

Spear phishing works differently.

The message is prepared for a specific person, team or organization. It may use names, current projects, suppliers, organizational structure or real events.

The more precise the reconnaissance, the fewer parts of the story the recipient needs to accept without evidence.

Whaling is a special form of targeted phishing. Its target is a person with significant influence, broad privileges or the ability to approve high-impact operations.

Such an attack may require more preparation, but a single success can create much greater impact.

---

## Reconnaissance: find the process, not only the email address

Employee email addresses are only the beginning.

Useful phishing reconnaissance answers questions such as:

- What does this person do?
- Who do they work with regularly?
- Which services are they likely to use?
- What documents do they receive?
- Who can give them instructions?
- What events are currently taking place?
- Which processes are performed under time pressure?
- Which organizational changes have been announced publicly?

Information may come from employee profiles, job advertisements, press releases, supplier websites, tender documents, social media and public event calendars.

When an organization announces the deployment of a new HR platform, an account activation message starts to look natural.

When a company is moving offices, a request to update delivery or building-access information may appear believable.

When the purchasing department works with a known contractor, a revised invoice may not immediately raise suspicion.

The attacker is looking for a place where a real process and a false message can look almost identical.

---

## Pretext: answering the question “why now?”

Every phishing message needs a reason.

The recipient should understand:

- why they received the message,
- why it concerns them,
- why they should perform the action,
- why it cannot wait,
- why the proposed method appears appropriate.

A good pretext does not need to be dramatic.

An ordinary document-sharing notification may be more convincing than a warning about a supposed cyberattack.

The attacker may exploit:

- routine,
- curiosity,
- fear,
- the promise of a benefit,
- professional responsibility,
- the desire to avoid a problem,
- the need to help another person.

The emotion should support the story rather than replace it.

An excessively dramatic message may create suspicion.

Well-prepared phishing looks like part of an ordinary day.

---

## Emotional swing: first the problem, then the immediate solution

Many attacks use a simple structure:

**threat → tension → easy solution**

The recipient learns that:

- a payment has not been processed,
- the account will be restricted,
- a package cannot be delivered,
- a document requires immediate approval,
- a device has been marked as insecure.

The message immediately provides a way to solve the problem:

> Click here.

> Sign in again.

> Pay a small additional fee.

> Open the document.

> Confirm your identity.

The recipient initially experiences stress, but almost immediately sees a way to regain control.

That feeling of relief may reduce further analysis.

The attack does not allow time for calm reflection.

The problem and the solution appear in the same place.

---

## Curiosity: the promise of information that is difficult to ignore

Not every campaign relies on fear.

Some attacks are based on curiosity:

- a photo supposedly showing the recipient,
- a confidential document,
- an unknown comment,
- a recruitment result,
- information about a bonus,
- a salary list,
- a recording from an important event,
- an exceptional promotion.

In these scenarios, the attacker creates an information gap.

The recipient knows enough to become interested, but not enough to satisfy that curiosity without clicking.

The more the message touches ego, reputation, money or social relationships, the harder it becomes to ignore.

---

## A small amount does not mean a small threat

Smishing and consumer campaigns often use minor payments.

An additional delivery fee of a few currency units looks less suspicious than a demand for a large transfer.

The low amount reduces natural resistance.

The recipient may decide that such a minor issue is not worth verifying.

The real objective may not be the payment itself.

A fake payment gateway may be used to capture:

- card details,
- online banking credentials,
- an authorization code,
- personal information,
- an active session.

The small charge is merely the pretext for a much more serious operation.

---

## The domain: a few characters can create a completely different identity

An attacker does not need to compromise the organization’s real domain.

They can register an address that looks similar during a quick glance.

Typosquatting uses differences that users may overlook:

- one missing letter,
- an additional character,
- transposed letters,
- a visually similar character,
- an extra word,
- a different top-level domain,
- a hyphen in another position.

Example:

```text
secure-company.com
secure-company-support.com
secure-cornpany.com
securecompany-login.com
```

Each address is different.

At the same time, each may appear credible in a shortened email preview or on a mobile screen.

---

## Homographs and visually similar characters

Some characters from different alphabets look almost identical.

A domain may contain a letter that resembles a Latin character but actually belongs to another writing system.

The browser may present such an address in Punycode form, but the exact display behavior depends on the application, configuration and implemented protections.

The most important lesson is not to memorize every possible variation.

It is to understand that visual similarity does not prove authenticity.

For critical operations, it is safer to open a known website or application independently instead of using the link provided in the message.

---

## The real domain is located after the user-information section

A URL may contain elements intended to distract the user from the actual host.

The `@` character is particularly important because it can separate user information from the real domain in a URL.

An address may therefore begin with the name of a trusted company even though the connection is made to another server.

Other misleading elements may include:

- long subdomains,
- encoded characters,
- parameters,
- shortened links,
- redirects,
- very long paths.

The actual registered domain matters more than the text shown at the beginning of the link.

---

## HTTPS does not mean the website is honest

A TLS certificate confirms that the connection to a particular domain is encrypted.

It does not confirm the intentions of the website owner.

An attacker can obtain a valid certificate for their own fraudulent domain.

The browser will then show no insecure-connection warning.

The padlock means:

> The connection to this server is encrypted.

It does not mean:

> This server belongs to the organization whose logo appears on the page.

Verification must include the domain and the surrounding context, not only the presence of HTTPS.

---

## The sender address may look more trustworthy than it really is

Email clients often display a friendly name instead of the full address.

A user may see:

```text
Security Department
```

instead of:

```text
security-notice@external-example.net
```

An attacker may also configure different values for the sender and reply addresses.

As a result, the message appears to come from one person, while the reply is sent somewhere else.

The recipient should check:

- the full sender address,
- the domain,
- the Reply-To field,
- whether the display name matches the address,
- message-authentication results,
- unusual differences in communication style.

The sender’s display name is not proof.

---

## SPF, DKIM and DMARC: technical verification of the message source

SPF defines which servers are allowed to send email on behalf of a domain.

DKIM adds a cryptographic signature that helps verify message integrity and origin.

DMARC defines how receiving systems should handle messages that fail the required checks and provides reporting capabilities.

Correct configuration makes direct spoofing of a legitimate domain more difficult.

It does not eliminate phishing.

An attacker may still use:

- a similar-looking domain,
- a compromised account,
- a poorly secured external service,
- a trusted file-sharing platform,
- a compromised supplier,
- a correctly authenticated domain created specifically for the attack.

Technical email authentication answers:

> Was the message sent by the domain represented by the authentication mechanism?

It does not automatically answer:

> Is the sender acting honestly?

---

## Spear phishing: real information as glue for a false story

A targeted attack combines genuine details with a fraudulent instruction.

The message may contain:

- the correct project name,
- the manager’s real name,
- an accurate amount,
- a genuine supplier,
- the correct deadline,
- part of a previous conversation.

The recipient recognizes familiar details and may assume that the remaining information is also true.

This is especially dangerous in invoice and payment-change scenarios.

The company name may be correct.

The document may resemble earlier invoices.

The amount may match a real engagement.

The only meaningful difference may be the bank-account number.

Without an independent process for confirming financial changes, the message can lead directly to loss.

---

## Business Email Compromise: the message does not need a link

Not every phishing attack requires a fake website or malicious attachment.

In Business Email Compromise scenarios, the objective may be to persuade an employee to perform a business operation:

- make a transfer,
- change a bank-account number,
- send a document,
- disclose an employee list,
- purchase gift cards,
- reveal payroll data,
- modify supplier information.

The message may come from a similar domain or from a genuinely compromised account.

In the second case, a correct sender address is not enough to detect the attack.

The defense must be based on the process.

Critical operations should require confirmation outside the same communication channel.

---

## Smishing: a small screen hides the most important details

SMS is an effective attack channel because:

- recipients read messages quickly,
- the screen shows only part of the link,
- SMS feels more direct,
- phones are often used while moving or distracted,
- mobile browsers may hide parts of the address.

Typical pretexts include deliveries, payments, fines, additional fees, service restrictions and official notifications.

Defense should not depend on recognizing one particular message template.

A safer rule is:

> When an SMS asks me to sign in, make a payment or provide information, I open the service independently through the known application or saved address.

---

## A compromised account turns phishing into a conversation with a trusted person

An attacker may compromise an account on social media, a messaging platform or email.

The message then comes from the real profile of a friend or colleague.

The story may concern:

- an urgent loan,
- a payment code,
- voting in a competition,
- checking a photo,
- opening a document,
- helping recover an account.

The strongest element is the existing trust in the account owner.

The recipient does not evaluate the message as communication from a stranger.

That is why unusual financial or access-related requests should always be confirmed through another channel.

---

## Voice and image can also be forged

The development of synthetic voice and image generation weakens a simple defensive rule:

> I will call and check whether it is really that person.

A phone call remains useful, but identity verification should not rely only on recognizing a voice.

For sensitive situations, additional controls may include:

- a previously agreed family password,
- a question about a shared private experience,
- calling a known number,
- reconnecting through another application,
- confirmation through another trusted person.

An attacker may imitate someone’s voice.

It is much harder to reproduce information that was never publicly disclosed.

---

## A link is not the only attack vector

Phishing may lead to:

- a fake login page,
- software installation,
- script execution,
- opening a document,
- a telephone call,
- replying to the message,
- performing a transfer,
- disclosing information,
- approving an MFA request.

Filtering URLs alone does not solve the entire problem.

A message without a link may be equally dangerous if it manipulates the recipient into performing an operation.

---

## The attachment: trusting the format instead of the source

Users often estimate risk based on the file extension.

A PDF appears safer than an executable.

A Word document looks like an ordinary business file.

An archive may be treated as a normal way to send multiple files.

The threat may still use:

- a malicious macro,
- an embedded link,
- a script,
- a vulnerability in the application opening the file,
- a second-stage download,
- a hidden extension,
- a misleading icon,
- an encrypted archive.

The file format does not prove safety.

The source, context and expected process matter.

---

## Double extensions and hiding the real file type

The operating system may hide extensions for known file types.

A file named:

```text
report.pdf.exe
```

may be displayed as:

```text
report.pdf
```

Attackers may also use extensions that are not commonly associated with executable code:

```text
.scr
.cmd
.bat
.ps1
.vbs
.js
.msi
.jar
```

For office documents, macro-enabled formats deserve additional attention:

```text
.docm
.xlsm
.pptm
```

This does not mean every file using one of these extensions is malicious.

It means the file should be handled through a more restrictive process.

---

## RTLO and other visual tricks

Text-direction control characters may change how a filename is displayed.

Part of the name may appear in reverse order, making the real extension harder to identify quickly.

An attacker may also use:

- many spaces,
- very long filenames,
- Unicode characters,
- similar-looking icons,
- hidden extensions,
- files located inside an archive.

From a defensive perspective, the true file type identified by the security system is more important than the visible filename.

---

## Password-protected archives: privacy may hide a threat

A password-protected archive limits automated analysis of its contents.

The attacker may provide the password in the same email and present the encryption as a confidentiality measure.

The recipient may think:

> The file is password-protected, so the sender cares about security.

In reality, the password may be intended to hide the contents from the email-security system.

Unexpected encrypted archives should therefore be treated as a higher-risk signal.

---

## A macro turns a document into a program

Macros automate tasks in office applications.

In legitimate use cases, they process data, generate reports and perform repetitive actions.

The same functionality can be used to execute additional commands.

The attacker therefore tries to convince the user that macros must be enabled to view the content.

The document may pretend to be:

- a form,
- an invoice,
- a report,
- an encrypted file,
- content requiring “unblocking,”
- a document generated by an older system.

The defensive principle is simple:

> A document that requires disabling protections should first be independently verified.

---

## PDF can also be part of the attack chain

PDF is often treated as a static format.

It may still contain:

- active links,
- forms,
- embedded files,
- scripts,
- redirects,
- content exploiting a vulnerability in the reader.

The file does not need to infect the device directly.

It may act as the first stage that redirects the user to another website or file.

A secure environment should inspect not only the file format, but also its behavior and embedded links.

---

## The fake page: similarity reduces reflection

A phishing page does not need to be a perfect copy.

It only needs to look similar enough during the short period in which the user makes the decision.

The most important elements are usually:

- the logo,
- color palette,
- form layout,
- typography,
- a familiar message,
- a similar-looking domain,
- valid HTTPS,
- behavior after submitting the data.

Users often do not analyze the whole page.

They recognize several familiar elements and classify the page as legitimate.

It is the same mechanism that makes physical badges persuasive.

Enough familiar signals create an impression of authenticity.

---

## A test form should not collect real passwords

The objective of a phishing simulation may be to determine:

- who opened the email,
- who clicked the link,
- who began entering data,
- who reported the message,
- how long detection took.

Capturing the real password is not always necessary.

A safer form may:

- record only submission,
- accept any test string,
- immediately discard the entered value,
- prevent sensitive-data storage,
- display an educational message,
- redirect to a controlled page.

The principle of minimum evidence applies to phishing as well.

The test should not collect more data than the objective requires.

---

## Reverse proxies and session theft change the threat model

A traditional phishing page captures a username and password.

Stronger authentication may make credentials alone insufficient.

Attackers may instead attempt to position themselves between the user and the real service and capture parts of an active session.

From a defensive perspective, this means not every type of MFA provides the same protection.

The strongest resistance comes from mechanisms cryptographically bound to the legitimate domain, such as hardware security keys and passkeys based on FIDO2/WebAuthn.

A manually entered code or a push approval can still be used in the wrong context.

---

## MFA fatigue: approving something the user did not start

After obtaining a password, the attacker may trigger repeated MFA prompts.

The user may:

- approve one accidentally,
- assume the prompts are caused by an application error,
- approve one to stop the notifications,
- believe someone calling from “IT support.”

The defensive rule should be clear:

> Approve an MFA prompt only when you personally initiated the sign-in moments earlier.

Every unexpected request should lead to reporting and account-security actions.

---

## Need for cognitive closure: the user wants the uncertainty to end

People cannot analyze every piece of information indefinitely.

They want to organize the situation quickly and make a decision.

Phishing exploits this need by presenting a simple explanation:

> It is the IT department.

> It is a real invoice.

> It is only a small additional fee.

> It is a friend asking for help.

> It is a normal update.

Fatigue, time pressure, stress and information overload increase the tendency to accept the first plausible interpretation.

The attacker does not always win because the story is perfect.

They win because the story allows the uncertainty to end quickly.

---

## The group can reinforce a false sense of security

When nobody in the organization questions a process, an employee may assume that it is correct.

A changed bank-account number may pass through several people because each assumes that the previous person already verified it.

A suspicious document may be forwarded because it came from a colleague.

An employee may avoid raising concerns because they do not want to appear unfamiliar with the process.

Security culture must create space for questions:

> Has anyone confirmed this?

> Do we normally handle it this way?

> Where did this change come from?

> Can I pause the operation until it is verified?

Asking is not a sign of incompetence.

In a critical process, it is a control.

---

## Shame after clicking helps the attacker

A person who opened a suspicious link or submitted information may try to hide the event.

They may fear punishment, reputational damage or judgment from colleagues.

Every minute of delay may increase the impact.

During that time, the attacker may:

- change the password,
- take over the session,
- create mailbox rules,
- send messages to other people,
- download data,
- perform a financial operation.

The organization should communicate clearly:

> Reporting a mistake quickly is a security behavior.

The time between the action and the response may matter more than the click itself.

---

## Training cannot be limited to spotting spelling mistakes

Spelling errors may reveal some campaigns, but they are not the essence of phishing.

A well-prepared message may be grammatically correct, use the real logo, follow an up-to-date template and include genuine information.

Employees should evaluate the process:

- Was I expecting this message?
- Does the sender normally communicate this way?
- Does the request match their role?
- Does the link lead to the correct domain?
- Does the operation require additional confirmation?
- Is the message creating artificial urgency?
- Is someone asking me to bypass the normal procedure?

A language error is a signal.

The absence of an error is not proof of authenticity.

---

## Technical layers of email protection

Organizational resilience should combine:

- SPF,
- DKIM,
- a restrictive DMARC policy,
- domain-reputation filtering,
- URL analysis,
- attachment sandboxing,
- blocking dangerous file types,
- protection against similar-looking domains,
- external-email labeling,
- sender-anomaly analysis,
- compromised-account detection,
- simple phishing-reporting mechanisms,
- sign-in monitoring,
- session protection,
- phishing-resistant MFA.

No single mechanism will stop every variant.

The objective is to interrupt the attack as early as possible.

---

## An “external email” banner helps only when it has meaning

A warning that the message came from outside the organization may increase caution.

When it appears on most everyday messages, however, users stop noticing it.

The warning should be:

- visible,
- brief,
- connected to a specific risk,
- contextual where possible,
- applied consistently.

Too many warnings cause habituation.

Users begin to dismiss them automatically.

A control that always alerts eventually stops warning.

---

## The financial process must resist compromise of a real mailbox

A bank-account change, unusual payment or urgent transfer should not be authorized solely through email.

Even when the address is correct, the account may have been compromised.

A secure process may require:

- telephone confirmation through a known number,
- approval by a second person,
- comparison with a trusted supplier register,
- a waiting period after account-number changes,
- a dedicated workflow,
- an alert for the first payment to a new account.

Critical business changes should remain secure even when one communication channel is compromised.

---

## Safe phishing assessments

The assessment should have a clearly defined objective.

It may test:

- message recognition,
- reaction to a link,
- suspicious-message reporting,
- filtering effectiveness,
- detection time,
- the security team’s response process,
- the resilience of a specific business process.

The scope should define:

- the recipient group,
- allowed pretexts,
- sending hours,
- data-processing rules,
- maximum impact,
- campaign stop conditions,
- excluded individuals,
- support for participants who experience significant distress.

The test should not use scenarios that may cause disproportionate emotional harm, personal consequences or real financial decisions.

---

## A campaign should not measure clicks alone

Click rate provides only a limited view.

More useful measurements may include:

- number of reports,
- time to the first report,
- time to domain blocking,
- time to message removal,
- manager response,
- service-desk behavior,
- number of employees who warned colleagues,
- filtering effectiveness,
- differences between departments,
- repeated patterns of failure.

An employee who clicked but immediately reported the incident behaved differently from someone who submitted data and concealed the event.

A good metric measures the resilience of the whole system, not only the individual mistake.

---

## Campaign results are not an employee ranking

A phishing simulation should not publicly identify people who made a mistake.

That approach leads to:

- hidden incidents,
- reduced willingness to report,
- loss of trust,
- attempts to bypass training,
- fear of future assessments.

The results should identify:

- which pretexts were effective,
- where verification processes were unclear,
- whether employees knew how to report,
- which technical controls failed,
- how quickly the organization responded,
- which groups need additional support.

The objective is not to prove that someone can be deceived.

It is to understand why the story was believable and what could have interrupted it.

---

## Data minimization during the assessment

The campaign should store only what is necessary to achieve its objective.

Depending on the scenario, sufficient data may include:

- message identifier,
- open time,
- click time,
- form-submission event,
- user report,
- department or organizational group.

The campaign should avoid storing:

- real passwords,
- private message content,
- unnecessary personal data,
- session tokens,
- real payment information.

The more realistic the campaign, the more important impact minimization becomes.

---

## Reporting: from the message to the potential impact

The report should reconstruct the complete path:

- what information was used,
- why the pretext was selected,
- how the domain and message were prepared,
- which technical protections worked,
- how many messages were delivered,
- how recipients responded,
- when the first report occurred,
- how the organization reacted,
- what the next stage of a real attack could have been.

It is not enough to write:

> 14% of users clicked the link.

A better description would be:

> The message imitated the organization’s real document-sharing process. The link led to a domain containing the organization’s name, and the form resembled the normal login system. The first report occurred after 18 minutes, but the domain was blocked 42 minutes later.

This shows the behavior of the entire system.

---

## Observation, evidence and impact

Each significant finding can be documented using a simple structure.

### Observation

> A message from a domain similar to the corporate domain reached users without an additional warning.

### Evidence

> Message headers, screenshots, email-gateway logs and campaign records.

### Impact

> The recipient could interpret the message as internal communication and perform the requested operation without independent verification.

This separates facts from judgments about the employee.

---

## Common organizational mistakes

### Teaching employees only to look for language errors

A professional campaign may contain no spelling mistakes.

### No independent verification of financial changes

A single message may redirect a payment.

### Treating MFA as complete protection

Not all MFA mechanisms resist session interception and user manipulation.

### No simple phishing-report button

The employee must search for the security team’s address or create a new ticket.

### Punishing users for clicking

Employees begin hiding real incidents.

### No monitoring of similar-looking domains

The organization discovers the attacker’s infrastructure only after the campaign begins.

### Excessive trust in a correct sender address

A legitimate mailbox may also be compromised.

### No process for unexpected attachments

The entire decision is left to the user.

---

## Common tester mistakes

### Running a campaign without a specific hypothesis

The results show clicks but do not answer a meaningful security question.

### Collecting real credentials

This increases risk without providing necessary additional evidence.

### Using overly personal pretexts

The test may cause disproportionate emotional harm and loss of trust.

### No response plan for a real incident occurring during the campaign

The organization may confuse the simulation with a concurrent genuine attack.

### Measuring clicks only

This ignores reporting, response time and technical controls.

### Losing control of the domain after the assessment

The infrastructure may remain active or later be taken over.

### Automatically redirecting users to the real service after data submission

This may prevent users from noticing the event and create unnecessary realism.

---

## Phishing campaign checklist

### Preparation

- [ ] Define the exact hypothesis and objective.
- [ ] Select the recipient group according to scope.
- [ ] Define allowed and prohibited pretexts.
- [ ] Determine the minimum data to be collected.
- [ ] Prepare campaign stop conditions.
- [ ] Agree on the process for handling reports.
- [ ] Confirm full control over the domain and infrastructure.
- [ ] Prepare a plan for data deletion and service shutdown.

### Technical verification

- [ ] Test the message in different email clients.
- [ ] Verify links and redirects.
- [ ] Confirm that the form does not store real passwords.
- [ ] Check the domain certificate and configuration.
- [ ] Test the campaign using controlled accounts.
- [ ] Verify event logging.
- [ ] Prepare an immediate infrastructure shutdown mechanism.

### Execution

- [ ] Monitor message delivery.
- [ ] Observe user reports.
- [ ] Record the time of the first detection.
- [ ] Monitor the response of technical teams.
- [ ] Do not expand the campaign beyond scope.
- [ ] Stop the assessment after achieving the agreed objective.

### Completion

- [ ] Disable pages and redirects.
- [ ] Delete data according to the agreed retention period.
- [ ] Confirm that no active services remain on the domain.
- [ ] Prepare anonymized statistics.
- [ ] Document correct responses as well.
- [ ] Deliver training based on the observed mechanisms.
- [ ] Plan a repeat campaign after improvements are implemented.

---

## Response model for the recipient

### Was I expecting this message?

Unexpected communication requires additional verification.

### Does the process normally work this way?

A familiar logo does not mean the process is legitimate.

### Is the message trying to create urgency?

Time pressure increases the need for verification.

### Where does the link really lead?

Evaluate the actual domain, not the beginning or visible description of the link.

### Can I open the service independently?

Use the known application, bookmark or manually entered address.

### Does the operation require independent confirmation?

Payments, data changes, file sharing and account resets should not depend on one message.

### What should I do if I already clicked?

Report the event immediately, even when there is no certainty that a compromise occurred.

---

## One sentence I’m keeping

**Phishing does not succeed because the user failed to notice a fake link, but because the story surrounding it made checking the link feel unnecessary.**
