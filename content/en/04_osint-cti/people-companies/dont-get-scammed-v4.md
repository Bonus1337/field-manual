---
id: dont-get-scammed-v4
title: "Don't Get Scammed v4: Modern Phishing, Scams and Social Engineering"
team: red-blue
domain: social-engineering
section: foundations
type: knowledge
angle: modern-scam-phishing-defense
tags:
  [
    "phishing",
    "scam",
    "quishing",
    "malvertising",
    "vishing",
    "deepfake",
    "2fa",
    "social-engineering",
  ]
difficulty: easy
shortDescription: "A practical model of modern scams: from QR phishing and malicious advertising to BEC, Browser-in-the-Browser, vishing, voice cloning and MFA phishing."
updatedAt: "2026-08-10"
---

# Don't Get Scammed v4: Modern Phishing, Scams and Social Engineering

A cyberattack does not always start with an exploit.

Very often, it starts with something much simpler:

> **“Click here.”**

An attacker does not need to break through technical defenses if they can convince the user to open a page, enter a password, provide an MFA code, install software or approve a transaction.

The tools change.

The brands used in campaigns change.

The communication channels change.

The underlying mechanism usually stays the same.

```text
Contact
   ↓
Build credibility
   ↓
Create emotion / pressure / opportunity
   ↓
Redirect the user
   ↓
User performs an action
   ↓
Credentials / money / device / account compromised
```

This is why security should not be reduced to:

> “Do not click suspicious links.”

Modern scams can look convincing enough that the link does not appear suspicious at all.

The goal is to understand the entire attack mechanism.

---

## A fake security alert can lead to a real infection

One of the simpler techniques is displaying a message inside a browser that resembles an antivirus warning.

A website may claim that:

- the computer is infected,
- several viruses have been detected,
- files have been encrypted,
- the system requires immediate scanning,
- an antivirus subscription has expired.

The warning may look completely legitimate.

That does not mean it comes from the operating system.

A website can visually reproduce almost any interface inside a browser.

The attack may look like this:

```text
malicious website
      ↓
fake security warning
      ↓
"Scan now"
      ↓
simulated scan
      ↓
"Threats detected"
      ↓
software download
      ↓
user executes file
      ↓
malware
```

The important distinction is that the website does not necessarily infect the system immediately.

Its job may simply be to convince the user to launch the infection themselves.

A security warning displayed inside the browser should therefore first be treated as **website content**, not automatically as a system-level alert.

---

# A QR code is not a trust mechanism

A QR code is simply a way of storing information.

Most commonly, it contains a URL.

```text
QR
 ↓
https://example.com
```

That is all.

Hiding a link inside a QR code does not make the link safer.

The problem is that users usually do not inspect the destination as clearly as they would with a traditional hyperlink.

That makes QR codes a convenient phishing channel.

---

## Quishing

Phishing performed through QR codes is often called:

```text
QR + phishing
      ↓
   quishing
```

An attacker can place the code on:

- parking meters,
- posters,
- invoices,
- flyers,
- packages,
- emails,
- instant messages,
- advertisements,
- objects in public spaces.

A malicious QR code can even be physically placed **on top of a legitimate one**.

The victim sees professional branding, a familiar location and a plausible context.

They scan the code.

Only then are they redirected to infrastructure controlled by the attacker.

```text
Physical location
       ↓
malicious QR
       ↓
phishing page
       ↓
payment data / credentials / malware
```

The QR code itself still does not “hack” anything.

The danger appears after the victim follows the destination and performs another action.

---

## Mobile devices reduce visible context

QR codes frequently move the attack to a phone.

That matters.

On mobile devices:

- URLs are less visible,
- address bars contain less information,
- long domains may be shortened,
- users tend to act faster,
- application interfaces hide more technical context.

An attacker may intentionally prefer:

```text
desktop
   ↓
QR code
   ↓
mobile
   ↓
phishing
```

Some campaigns may even claim that the desktop version is temporarily unavailable and instruct the victim to continue on a phone.

That should increase suspicion.

---

# A logo does not prove authenticity

A QR code can contain:

- a bank logo,
- a city logo,
- a gaming character,
- company branding,
- practically any background image.

A phishing page can likewise reproduce a legitimate website almost perfectly.

An attacker can copy:

```text
logo
CSS
colors
fonts
layout
forms
favicon
```

Therefore:

> **Branding proves visual similarity, not authenticity.**

The domain remains one of the most important elements to inspect.

---

# Malvertising — an advertisement does not mean legitimacy

One dangerous assumption is:

> “If Google shows it as an advertisement, somebody must have verified it.”

That assumption is unsafe.

An advertisement can lead to:

- a fake banking portal,
- a malicious installer,
- a phishing page,
- an investment scam,
- malware.

A particularly interesting scenario involves popular software.

A user searches for:

```text
Wireshark download
```

The attacker purchases an advertisement.

Their result appears prominently in the search engine.

The page looks legitimate.

The downloaded software may even work correctly.

The problem is:

```text
legitimate functionality
        +
      malware
```

The victim receives a working application and may therefore fail to notice the compromise.

Meanwhile, the malicious component may:

- steal passwords,
- steal sessions,
- capture payment details,
- deploy additional payloads,
- provide remote access.

---

# Cloaking — safe during verification, malicious afterwards

Advertising platforms often inspect destinations before approving advertisements.

Attackers can attempt to abuse that process.

Initial stage:

```text
advertisement
     ↓
attacker.example
     ↓
legitimate-site.example
```

The platform verifies the advertisement.

Everything appears legitimate.

After approval, the attacker changes the redirect:

```text
advertisement
     ↓
attacker.example
     ↓
phishing.example
```

A previously generated preview may still display the legitimate destination.

This creates an important lesson:

> **A link preview does not necessarily represent the current destination.**

The same concept can appear on social media platforms.

---

# Fake investments — the attack does not start with money

Some of the most effective scams involve fake investment platforms.

Advertisements may use:

- famous brands,
- public figures,
- state-owned companies,
- trending events,
- promises of exceptional returns.

The first page may not look especially dangerous.

It may request only:

```text
name
surname
email
phone number
```

And that is exactly why it can appear harmless.

The real attack begins later.

```text
advertisement
   ↓
contact form
   ↓
phone call from "advisor"
   ↓
relationship building
   ↓
remote-access software
   ↓
small investment
   ↓
fake profit
   ↓
larger investment
   ↓
financial loss
```

---

## Small success creates strong trust

An attacker may intentionally allow the victim to “earn money.”

For example:

```text
100 PLN
  ↓
200 PLN

1000 PLN
  ↓
2000 PLN
```

The victim receives money.

Psychologically, this is extremely powerful.

The victim has now “verified” that the system works.

The next stage introduces pressure:

```text
"The offer ends tomorrow."

"This opportunity is unique."

"You should invest more."

"You can even take a loan."
```

The attack is therefore not purely technical.

It relies on **gradually increasing the victim's commitment**.

---

# Remote access as a social engineering tool

Investment scammers may ask the victim to install remote-access software.

The application itself may be completely legitimate.

The problem is the person controlling it.

```text
remote-access software
          ↓
attacker sees screen
          ↓
victim logs into bank
          ↓
transaction
```

This illustrates an important principle:

> **A legitimate tool can become part of an attack when used in a malicious context.**

An unsolicited request from a financial advisor, support agent or investment consultant to install remote-access software should therefore be treated as a major warning sign.

---

# Browser in the Browser

Phishing does not need to clone an entire website.

The **Browser in the Browser — BitB** technique simulates a separate login window inside the attacker's page.

The user may see something resembling:

```text
┌──────────────────────────────┐
│ accounts.google.com          │
├──────────────────────────────┤
│                              │
│        Sign in               │
│                              │
│ Email:    [____________]     │
│ Password: [____________]     │
│                              │
└──────────────────────────────┘
```

The address looks correct.

The controls look legitimate.

However, the whole “window” is only HTML rendered inside the attacker's website.

It is not a real browser window.

```text
attacker.example
       ↓
HTML/CSS/JS
       ↓
fake OAuth/login window
       ↓
credentials
       ↓
attacker
```

A useful visual test is attempting to move the suspicious login window outside the main browser window.

If it is simply part of the webpage, it cannot exist outside the page viewport.

---

# Phishing begins with identity

An email may show:

```text
From: CEO Jan Kowalski
```

That alone does not prove that Jan Kowalski sent it.

It is important to distinguish:

```text
Display Name
```

from:

```text
actual sender address
```

A Display Name can usually be set almost arbitrarily.

When analyzing a message, inspect:

- the real sender address,
- sender domain,
- Reply-To,
- communication context,
- attachments,
- links.

---

# SPF, DKIM and DMARC

Organizations can reduce email-domain spoofing by deploying several mechanisms.

### SPF

Defines which servers are authorized to send mail for a domain.

### DKIM

Adds a cryptographic signature to the message.

### DMARC

Defines what receivers should do when SPF or DKIM validation fails and provides reporting mechanisms.

Simplified:

```text
SPF
 └─ who may send?

DKIM
 └─ was the message signed?

DMARC
 └─ what should happen when validation fails?
```

Weak or missing configuration can increase the possibility of successful domain spoofing.

However, these mechanisms do not solve every problem.

A correctly protected domain cannot prevent abuse of a **legitimate mailbox that has already been compromised**.

---

# A legitimate sender can still send malicious email

This is one of the more dangerous situations.

The email comes from the correct domain.

SPF passes.

DKIM passes.

DMARC passes.

And the message is still malicious.

Why?

```text
attacker
   ↓
compromised mailbox
   ↓
legitimate mail infrastructure
   ↓
victim
```

A valid sender address therefore does not automatically prove legitimate intent.

When the requested action is unusual:

> **Verify it through a second independent channel.**

---

# Link text != link destination

HTML can contain:

```html
<a href="https://evil.example"> https://mbank.pl </a>
```

The user sees:

```text
https://mbank.pl
```

The browser opens:

```text
https://evil.example
```

For that reason, security analysis focuses on the **actual destination URL**, not the visible text.

On desktops, hovering over a link often reveals the real target.

On mobile devices, checking it may be more difficult.

---

# Homograph attacks — one character may change everything

Domains can use characters that look nearly identical.

Conceptual example:

```text
example.com
exampĺe.com
```

The difference may be almost invisible.

Attackers can abuse:

- diacritical characters,
- visually similar Unicode characters,
- letters from different alphabets,
- `l` and `I`,
- `0` and `O`,
- additional subdomains.

The correct question is not:

> “Does this domain look familiar?”

The correct question is:

> **“What is the exact hostname?”**

---

# Typosquatting

A simpler variation does not require Unicode.

Attackers register domains resembling legitimate ones:

```text
example.com
examplle.com
example-security.com
example-login.com
example.support
```

Users often inspect only the beginning of the address.

Attackers exploit that behavior.

The important element is the actual registrable domain.

For example:

```text
bank.example.attacker.com
```

belongs to:

```text
attacker.com
```

not:

```text
bank.example
```

---

# Phishing is not limited to email

This is one of the key lessons.

Phishing can arrive through:

```text
Email
SMS
QR code
Google Ads
Facebook
LinkedIn
Booking
WhatsApp
phone calls
instant messaging
advertisements
```

The channel is secondary.

The objective remains similar:

```text
credentials
payment data
MFA code
money
malware execution
remote access
```

---

# Smishing

SMS scams often use simple pretexts:

- delayed package,
- missing payment,
- account verification,
- banking issue,
- outstanding fee,
- new phone number.

The flow remains predictable:

```text
SMS
 ↓
urgency
 ↓
link
 ↓
fake payment/login page
 ↓
credentials/payment
```

The attacker wants to move the victim from the trusted communication channel to attacker-controlled infrastructure.

---

# “Mom, I have a new number”

Another common scenario begins with:

> “My phone broke, I'm messaging you from a new number.”

The attacker builds context.

Then comes the urgent request for money.

```text
new number
   ↓
family impersonation
   ↓
urgency
   ↓
bank account
   ↓
transfer
```

This attack targets trust relationships rather than technical vulnerabilities.

The simplest defense is verification through a previously known communication channel.

---

# WhatsApp as the second stage of an attack

Many scams use the first message only to move the conversation elsewhere.

```text
SMS
 ↓
WhatsApp
```

or:

```text
advertisement
 ↓
WhatsApp
```

The attacker can then continue a longer social-engineering process outside the original platform.

They may attempt to convince the victim to:

- share the screen,
- install software,
- make a transfer,
- send documents,
- provide codes.

WhatsApp itself does not compromise the user.

The problem is the **instruction the victim is persuaded to follow**.

---

# Fake jobs and financial mules

Not every fake job advertisement tries to steal money directly from the victim.

Sometimes the objective is to use the victim's bank account.

```text
"Work from home"
      ↓
simple tasks
      ↓
high commission
      ↓
money arrives in victim's account
      ↓
victim keeps a percentage
      ↓
remaining money is forwarded
```

The victim may have become a:

```text
money mule
```

Meaning an intermediary used to transfer criminal funds.

A major red flag is:

> **Legitimate employment should not require receiving third-party funds on a private account and forwarding them elsewhere.**

---

# Business Email Compromise

An attacker does not always need sophisticated malware.

Sometimes this is enough:

> “Make this urgent transfer.”

The attacker may use publicly available information such as:

- CEO names,
- employee positions,
- corporate hierarchy,
- business relationships.

The process may look like:

```text
OSINT
 ↓
understand organization
 ↓
impersonation
 ↓
authority pressure
 ↓
urgent transfer
```

Technically, the email can be extremely simple.

Psychologically, it can be highly effective.

Financial operations should therefore rely on procedures that do not depend on a single message.

---

# Deepfake voice changes the meaning of “I recognize the voice”

Until recently, recognizing someone's voice provided relatively strong confidence in identity.

Generative voice technology weakens that assumption.

A short sample of someone's voice may be enough to create new synthetic speech resembling that person.

This creates a new vishing scenario:

```text
voice sample
    ↓
voice cloning
    ↓
call / audio message
    ↓
impersonation
```

The attacker may impersonate:

- a family member,
- a CEO,
- a manager,
- a coworker,
- a public figure.

Therefore:

> **“I recognized the voice” should no longer be treated as strong authentication.**

---

# Caller ID is not proof either

The phone number shown on the screen can also be used to create false trust.

Therefore:

```text
known number
+
known voice
```

does not automatically mean:

```text
known person
```

If the conversation leads to an unusual action involving:

- a transfer,
- confidential data,
- software installation,
- password reset,
- sensitive information,

verify the request through another independent channel.

---

# MFA does not automatically solve phishing

MFA significantly improves security.

It does not mean that every MFA implementation is phishing-resistant.

Example:

```text
victim
   ↓
fake bank
   ↓
login + password
   ↓
attacker logs into real bank
   ↓
bank sends OTP
   ↓
fake site asks for OTP
   ↓
victim enters OTP
   ↓
attacker authenticates
```

This is real-time phishing.

The attacker did not break the OTP mechanism.

The victim **provided the valid code to the attacker**.

---

# Read the authorization message, not only the code

An even more dangerous situation can occur during transaction authorization.

The phishing page says:

```text
Pay 7 PLN
```

The bank sends:

```text
You are authorizing a transfer of 70,000 PLN
```

The user ignores the message and automatically enters the code.

The attack succeeds.

Therefore:

> **An OTP is not just a number to copy. The authorization message itself is part of the security mechanism.**

---

# Phishing-resistant MFA

Stronger protection comes from authentication mechanisms cryptographically bound to the legitimate origin, such as FIDO-based hardware security keys.

Their advantage is that the user does not receive a transferable code that can simply be copied into a phishing page.

The model relies on:

```text
credential
   +
origin
   +
cryptographic challenge
```

A malicious domain cannot simply ask:

> “Enter the code from your security key.”

---

# A password manager is also an anti-phishing control

Password managers are not useful only because they generate strong passwords.

They also remember which domain each credential belongs to.

If a credential was stored for:

```text
https://bank.example
```

and the user visits:

```text
https://bank-login.example
```

the password manager should not automatically offer the saved credential.

That becomes a useful signal:

> **Why doesn't my password manager recognize this page?**

It may have noticed the phishing attempt before the user did.

---

# A password manager does not protect a compromised endpoint

A password manager is not a magical security boundary.

If the endpoint is fully compromised, malware may attempt to:

- steal active sessions,
- monitor the clipboard,
- inspect process memory,
- modify webpages,
- replace links,
- access an unlocked password vault.

The security model therefore still requires:

```text
password manager
      +
secure endpoint
```

Not one instead of the other.

---

# An attachment can pretend to be a document

Attackers may manipulate filenames and icons.

For example:

```text
invoice.pdf                         .exe
```

The user notices:

```text
invoice.pdf
```

while the actual type is:

```text
.exe
```

The file icon can also be modified to resemble:

- PDF,
- Word,
- Excel,
- image files.

The icon is therefore not sufficient evidence.

Inspect the real file type and extension.

---

# VirusTotal — extremely useful, but not an oracle

Suspicious:

- files,
- domains,
- URLs,

can be checked against multiple security engines.

The result may look like:

```text
0 / 70 detections
```

or:

```text
23 / 70 detections
```

However:

```text
0 detections
```

does not mean:

```text
100% safe
```

A new campaign may simply not have been detected yet.

---

## Do not upload confidential files to public scanning platforms

Online scanning has confidentiality implications.

Do not blindly upload:

- company documents,
- personal data,
- internal reports,
- configuration files,
- business secrets.

A sample submitted for security analysis may become accessible to other entities or users with appropriate platform access.

Always ask:

> **Am I allowed to send this file outside the organization's environment?**

---

# Minimize browser extensions

Browser extensions operate with specific permissions.

Depending on those permissions, they may access:

- websites,
- forms,
- DOM content,
- browsing history,
- clipboard data.

The risk is not limited to installing obviously malicious extensions.

Another possible scenario is:

```text
legitimate extension
        ↓
developer account compromise
        ↓
malicious update
```

A reasonable approach is:

```text
minimum necessary extensions
```

Every additional extension expands the attack surface.

---

# Ad blocking as attack-surface reduction

Ad blockers are not only about user experience.

Malvertising demonstrates that advertisements can become an attack-delivery channel.

Blocking advertisements can therefore reduce part of the attack surface.

It does not replace:

- patching,
- endpoint protection,
- email filtering,
- MFA,
- procedures,
- security awareness.

It is another security layer.

---

# Updates also protect against attacks without user interaction

Most scams described so far depend on some user action.

Another class of attacks looks different:

```text
vulnerability
   ↓
malicious input
   ↓
code execution
```

A vulnerable component may be compromised simply while processing malicious content.

That is why patching remains critical.

This applies not only to laptops, but also to:

- email gateways,
- firewalls,
- VPN appliances,
- monitoring systems,
- browsers,
- servers.

There is an important security paradox here:

> **A system designed to inspect attacks has its own attack surface too.**

---

# Ransomware reminds us that prevention is not enough

Not every attack will be stopped.

Mature security therefore assumes that compromise may eventually happen.

```text
Prevent
Detect
Respond
Recover
```

In ransomware scenarios, the last stage becomes especially important:

```text
Recover
```

Backups must allow recovery even when the attacker gains access to the production environment.

A backup permanently connected to the same environment may be encrypted together with everything else.

---

# The key pattern: the attacker controls context

Across most of these scenarios, the attacker attempts to control **what the victim sees and how the victim interprets the situation**.

They may control:

```text
sender name
logo
website appearance
advertisement
QR code
phone number
voice
popup
visible link text
fake profit
```

They do not necessarily need to control the real system.

They only need to convince the user that they do.

That distinction is fundamental.

---

# Do not trust the same channel that created the request

If someone writes:

> “I'm calling from your bank.”

Do not verify the claim using information from the same message.

If someone says:

> “I'm calling from a government office.”

Do not automatically call back the number they provided.

Create your own trusted path:

```text
suspicious contact
       ↓
STOP
       ↓
independent source
       ↓
official website / known number / known account
       ↓
verification
```

This principle works regardless of the technology used by the attacker.

---

# Second-channel verification

Sensitive operations should be verified through an independent channel.

Examples:

```text
CEO asks for transfer by email
              ↓
call known phone number

Family member asks for money on WhatsApp
              ↓
call previous phone number

Vendor sends unexpected ZIP
              ↓
contact vendor through known channel

Bank calls about suspicious activity
              ↓
end call
              ↓
open official banking app
```

The important part is not simply using “another channel.”

The second channel must be **selected and controlled by us**, not by the person initiating the suspicious request.

---

# Attacker mindset

A more useful question than:

> “How do I recognize a fake SMS?”

is:

> **“What does the attacker want me to do next?”**

If the answer is:

```text
click
scan
log in
provide a code
install
share screen
make a transfer
send money
open attachment
```

then that action is the point that should receive the most scrutiny.

---

# Defender mindset

Trying to memorize every known scam is impossible.

Tomorrow, there will be:

- a new brand,
- a new story,
- a new domain,
- a new communication channel.

Instead, analyze behavior.

### Identity

Who is actually contacting me?

### Infrastructure

Where does the link actually lead?

### Context

Does this request make sense?

### Action

What am I being asked to do?

### Impact

What happens if I perform this action?

### Verification

How can I confirm it through an independent channel?

This model is far more resilient to new campaigns than memorizing individual examples.

---

# Red flags

A single indicator is not always enough.

A combination of them should increase suspicion:

- time pressure,
- unexpected request,
- exceptionally attractive offer,
- request to install software,
- attempt to move the conversation elsewhere,
- request for an MFA code,
- unusual attachment,
- unfamiliar domain,
- transfer request,
- screen-sharing request,
- sudden phone-number change,
- authority-based contact without independent verification.

The more of these signals appear together, the stronger the reason to stop and verify.

---

# Practical defense workflow

When a suspicious message reaches me:

```text
                    suspicious message
                           │
                           ▼
                 Do I expect this?
                    │          │
                   YES         NO
                    │          │
                    └────┬─────┘
                         ▼
                Check real sender
                         │
                         ▼
                Check destination
                         │
                         ▼
              What action is requested?
                         │
                         ▼
          credentials / payment / execution?
                   │              │
                  YES             NO
                   │              │
                   ▼              ▼
            verify independently  continue carefully
                   │
                   ▼
             known trusted channel
```

The most important action is interrupting automatic behavior.

Scams often succeed because users continue through every step at exactly the pace designed by the attacker.

---

# Final takeaway

Modern phishing increasingly does not look like:

```text
Hello Dear Customer,
your accaunt blocked,
click malware.ru
```

It can look like:

- an advertisement for legitimate software,
- a convincing banking portal,
- a message from a compromised mailbox,
- a QR code on a parking meter,
- a message from Booking,
- a message from your child,
- a phone call from your CEO,
- the voice of someone you know,
- a legitimate-looking OAuth popup,
- an investment campaign using a well-known brand.

That means the most important skill is not recognizing a particular scam.

It is **controlling the trust boundary**.

```text
Do not ask:

"Does this look legitimate?"

Ask:

"What independently proves that it is legitimate?"
```

An interface can be copied.

A logo can be copied.

A sender name can be spoofed.

A phone number can be abused for impersonation.

A voice can be generated.

A QR code can be replaced.

A link can be disguised.

But taking control of several independent verification channels at the same time is significantly harder.

**That is why independent verification remains one of the simplest and most effective defenses against social engineering.**
