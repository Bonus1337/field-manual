---
id: auth-static-password-security
title: "Static Password Security - where the system really breaks"
team: red-blue
domain: web-security
section: authentication-access-control
type: knowledge
angle: secure-design
sourceTrack: baw
tags: ["passwords", "authentication", "pbkdf", "bcrypt", "argon2", "salt", "hashing"]
difficulty: medium
shortDescription: "A practical note on static password security: from authentication models and design mistakes to hashing, salt, pepper, key stretching, and the conclusions that matter for pentesters, developers, and users."
updatedAt: "2026-03-27"
---

# Static Password Security - where the system really breaks

## Why I am making this note

Because passwords are one of those topics that only look trivial until something leaks.

And that is exactly when it becomes obvious that password problems rarely begin with the user alone.
More often, they start much earlier:

- with a bad storage model,
- with a bad cryptographic choice,
- with blind trust in outdated patterns,
- with no protection against online attacks,
- or with the assumption that “it is hashed, so it is safe”.

This note is here to organize one thing for me:

**password security is not about one `password` field in a database.  
It is about the whole password management cryptosystem.**

---

## The most important model to keep in mind

A password does not exist on its own.

It is only one element in a larger access control process:

- **identification** - who you claim to be,
- **authentication** - whether you can prove it,
- **authorization** - what you are allowed to do after logging in.

This chapter focuses mainly on **authentication**, but it is still worth remembering:
even perfectly stored passwords will not save a system if session handling, access control, or password reset flows are broken later.

---

## What can actually be an authentication factor

Authentication data usually falls into three groups:

### 1. Something you know

For example:

- a static password,
- a security question answer.

### 2. Something you have

For example:

- a token,
- a mobile app code,
- an SMS code,
- a hardware key.

### 3. Something you are

For example:

- a fingerprint,
- a face,
- an iris,
- behavioral traits.

The most important practical conclusion is simple:

**a single password is a low security threshold,  
while combining different factor categories creates a real jump in resistance.**

That is why multi-factor authentication is not a “nice extra”, but one of the simplest ways to raise the cost of an attack.

---

## Why static passwords still dominate

Because they are convenient.

No need to scan an eye, no need for dedicated hardware, no need to explain a complicated workflow to the user. All you need is:

- invent a string,
- remember it,
- type it during login.

And this is exactly where two problems appear at once.

### The user problem

Users usually:

- choose short passwords,
- choose predictable passwords,
- reuse similar ones,
- reuse the same ones across many services.

### The developer problem

Developers very often:

- treat the topic as “too simple to get wrong”,
- choose the wrong storage method,
- use fast hash functions,
- do not model threats,
- do not treat database leakage as a baseline scenario.

And that combination is destructive.

---

## What I really need to assume about the world

A good mental baseline is this:

**sooner or later, someone will try to:**

- guess passwords remotely,
- steal the database,
- pull logs,
- read stack traces,
- use leaked credentials from other services,
- attack password reset flows,
- exploit user habits.

So I am not designing for perfect users and a perfect environment.
I am designing so the system still holds up against weak password hygiene and partial compromise of the infrastructure.

---

# How passwords should **not** be stored

## 1. Plaintext

This is the worst version.

If the password sits in the database in plaintext, the story ends at the moment of leakage. There is no “slowdown”, no “buffer time”, no protection at all.

On top of that, such a secret usually starts living in:

- backups,
- migrations,
- database dumps,
- error logs,
- copied environments.

**If a password can be read, it is not protected.**

---

## 2. Reversible encryption

This often looks reasonable only on paper.

At first glance, someone may say:
“I do not store the password in plaintext, I store it encrypted, so it is better.”

But if the application or administrator can decrypt that password, then after an environment compromise an attacker will very often be able to reach the key or the decryption path too.

That means the problem still exists - it is only shifted by one step.

**A login password should not be a secret the system can recover.  
It should be a secret the system can only verify.**

---

## 3. “Just a hash” without additional protections

This is already a step forward, but still not far enough.

If a password is protected only with:

- MD5,
- SHA-1,
- SHA-256,
- or another fast hash function,

then the problem is not only that the algorithm may be old.

The problem is that those functions are **too fast**.

And speed, in the password world, works against the defender.

---

# The key distinction: hash function vs password security

This is something worth drilling into memory:

**hash functions were designed to be fast.  
Password security requires almost the opposite property: password verification must be expensive for the attacker.**

That is the core of it.

In practice:

- a fast hash helps with file integrity,
- a fast hash helps with checksums,
- a fast hash helps with many cryptographic use cases,

but:

- a fast hash is bad for password storage.

Because after a database breach, the attacker does not have to “reverse” the function.
They only need to start guessing candidates, calculate hashes, and compare results.

So they are not fighting mathematics.
They are fighting time and computational budget.

And if you give them MD5 or SHA-1 without extra layers, that cost becomes laughably low.

---

## Collisions versus practical reality

When people talk about hash functions, it is easy to get stuck on collision resistance, because it sounds very cryptographic and very serious.

But from a password perspective, one thing matters more:

**for password storage, the bigger problem is usually the speed of computation rather than collisions.**

That is why moving from MD5 to SHA-256, without changing the whole design, does not solve the real problem.

Yes, SHA-256 is far better as a cryptographic hash function than MD5 or SHA-1.
But if you use it “raw” for passwords, you are still giving the attacker fast material for an offline attack.

---

# Salt, pepper, and key stretching - what they really give you

This is where the topic becomes truly practical.

---

## Salt

A salt is an extra, unique value added to the password before the hash is calculated.

Practically, it gives three important things:

### 1. The same password does not produce the same result for different users

If two users have the same password, then without a salt their hashes will also be identical.
That gives the attacker a great clue.

Salt breaks that effect.

### 2. It kills the usefulness of precomputed hash databases and rainbow tables

Without salt, ready-made lookups and rainbow tables are useful.
With salt, everything must be recomputed separately.

### 3. It makes large-scale cracking of many accounts much harder

Salt does not magically make a single weak password safe if the attacker also knows the salt.
But it seriously damages the efficiency of attacking the entire user base at once.

### The most important reality check

Salt is **not secret**.
I assume that if the database leaks, the attacker gets it too.

So:

**salt is not meant to stop the attack on its own.  
Salt is meant to make the attack much less convenient and much less scalable.**

---

## Pepper

Pepper is an additional secret shared across the whole system and stored outside the database.

That distinction matters:

- salt usually sits next to the hash,
- pepper should live somewhere else.

For example:

- in the application configuration,
- in secure server-side storage,
- in a separate component.

### What pepper gives you

If someone steals only the database but not the pepper, then they still do not have the full material needed for an efficient offline attack.

So pepper does not replace salt or a password hashing function.
It gives **an extra barrier after compromise of the database alone**.

---

## Key stretching

This is probably the most important practical idea in the entire chapter.

Key stretching means:
**deliberately slowing down the password-derived hash or key calculation.**

This is the moment where the defender says:

> the legitimate user can wait 100 ms during login,  
> but I want the attacker to suffer when trying billions of guesses.

And that is an excellent trade-off.

For the legitimate user, the difference is barely visible.
For the attacker after a data breach, the cost rises dramatically.

---

# PBKDF functions - the correct answer to the password problem

This is where I get to the most important architectural conclusion:

**passwords should not be stored as a “normal hash”, but as the output of a function designed specifically for passwords.**

That means a function from the PBKDF family.

This is not one single implementation, but a whole class of approaches that do several things at once:

- use salt,
- allow cost tuning,
- slow down offline attacks,
- provide a coherent storage model.

---

## How I think about it in practice

I no longer want to ask:

> is the password hashed?

That is too weak.

I want to ask:

> **is the password stored as a costly PBKDF-derived key with a unique salt and a sensibly chosen cost parameter?**

That is much closer to real security.

---

## Families worth knowing

This is not about memorizing a catalog. It is more about understanding what they mean.

### bcrypt

Very mature, widely used, practical.
A good choice if implemented correctly and calibrated sensibly.

### PBKDF2

Popular and broadly supported.
Also a solid choice, as long as the parameters are not symbolic.

### scrypt

Important because it adds memory cost on top of time cost.
That directly hurts parallel and GPU-based attacks.

### Argon2

A newer but highly respected family.
I want to remember it as a modern approach designed with current attack realities in mind.

### The most important practical takeaway

I do not want to fetishize the name of the algorithm.

What matters much more is this:

**far more important than a “fashionable name” is whether the team abandoned fast hashes and moved to a real password function with a properly chosen cost.**

---

# How the attacker sees it

This matters, because it helps me understand why all these protections exist.

---

## Online attacks

These are attempts against the live application:

- brute force against the login form,
- password spraying,
- credential stuffing,
- username guessing,
- attacks against admin panels,
- abuse of account recovery flows.

Here the defender has an advantage, because they can deploy:

- rate limiting,
- CAPTCHA,
- temporary lockouts,
- anomaly monitoring,
- alerting,
- MFA.

But this still has to be designed carefully, because a badly designed account lockout can become a simple Denial of Service vector.

---

## Offline attacks

This is the real exam for the password cryptosystem.

Once the database leaks:

- throttling no longer exists,
- CAPTCHA no longer exists,
- the number of attempts is no longer limited by the network,
- the attacker can calculate as many guesses as they want on their own hardware.

And that is exactly why:

- fast hash functions lose,
- no salt loses,
- no cost parameter loses,
- password reuse by users becomes catastrophic across other services.

This is also why the leak of one service so often becomes a problem for many other accounts owned by the same person.

---

# Two case studies worth remembering

## Battlefield Heroes

The key lesson from this case is not simply:
“passwords leaked”.

It is:
**MD5 hashes leaked without meaningful protections, and a huge portion of the original passwords could be recovered.**

The practical consequence was double damage:

- account takeovers in the game itself,
- account takeovers in other services, because users reused the same passwords.

So:
the problem was not just the breach.
The problem was that the service-side cryptosystem was too weak to buy users any time after the breach.

---

## Dropbox

What matters much more here is the maturity path rather than the brand.

Initially, a weaker model.
Later, a move toward a much better design:

- bcrypt,
- computational cost,
- extra protection layers,
- thinking about what happens after a database leak.

This is a good reminder that password security does not end at “we hash things”.
Mature systems think in layers.

---

# What I want to check as a pentester

If I am testing an application, I do not stop at “does login work”.

I look much wider.

## 1. Whether login and password change go exclusively over TLS

Without that, the rest is secondary.

## 2. Whether the application has protection against online attacks

- rate limiting,
- lockouts,
- additional verification,
- brute force signals,
- meaningful monitoring.

## 3. Whether the password policy is not just theater

I do not care only about a front-end regex.
I care about:

- minimum length,
- blocking breached passwords,
- rejecting obviously weak choices,
- good support for password managers,
- allowing paste.

## 4. Whether the system leaks too much through logs and errors

Passwords must never land in:

- logs,
- stack traces,
- exceptions,
- debug output,
- temporary dumps.

## 5. Whether reset and account recovery break the whole model

Because you can have a good password storage design and still have a terrible password reset flow.

## 6. Whether MFA can be bypassed or weakened

If it exists.

---

# What I want to build as a developer or architect

## 1. Store passwords only as outputs of PBKDF-style password functions

Not plaintext.
Not reversible encryption.
Not “raw” MD5 or SHA.

## 2. Use a unique salt per user

Always.

## 3. Consider pepper outside the database

Especially where I want an extra layer after a database-only breach.

## 4. Tune the cost parameter against the real environment

Not blindly.
Not “because some forum post said so”.

Instead:

- performance testing,
- login time measurements,
- resilience to load,
- awareness of server-side cost.

## 5. Protect against online attacks without destroying availability

That means not deploying mechanisms that are themselves easy to abuse.

## 6. Do not make good user practices harder

This matters more than it seems.

If the application:

- blocks password pasting,
- artificially cuts maximum length,
- mishandles characters,
- does not support password managers,

then it is actively pushing users toward worse habits.

## 7. Check passwords against known breach corpora

Because “long” does not always mean “safe” if that password has already lived in public leak databases for years.

---

# What I want to remember as a user

This part matters too, because even the best service cannot undo bad habits everywhere else.

## 1. A unique password for every service

Because one leak must not open five other accounts.

## 2. A password manager is not a luxury

It is the only scalable way to:

- have long passwords,
- have different passwords,
- stop living on tiny variations of the same pattern.

## 3. Multi-factor authentication everywhere possible

Because even a stolen password does not end the game immediately.

## 4. Never assume the service stores passwords well

I do not know that.
All I can do is reduce my own risk.

---

# Quick cheat sheet - what I really want to remember

## Bad practices

- plaintext,
- reversible encryption,
- fast hash with no salt and no cost,
- blocking password paste,
- low maximum length,
- no brute force protection,
- no MFA,
- passwords in logs and exceptions.

## Good practices

- a password function from the PBKDF family,
- unique salt,
- sensible computational cost,
- optionally pepper outside the database,
- online attack protection,
- breached-password checks,
- support for password managers,
- meaningful MFA,
- monitoring and reaction to anomalies.

---

# My mental shortcut

The password itself is not the real problem.

The real problem is that:

- users choose weak ones,
- developers protect them badly,
- and attackers have very cheap mathematics on their side.

That is why password security is not about “hashing”.
It is about building a system where, after a data leak, the attacker still faces something **expensive, slow, and inconvenient**.

---

# One sentence I want to keep

**Password security does not break at the moment of login - it breaks much earlier, when you design the whole cryptosystem around the password badly.**
