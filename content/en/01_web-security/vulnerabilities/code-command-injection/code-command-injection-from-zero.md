---
id: code-command-injection-from-zero
title: "Code Injection and Command Injection: when an application executes something it should never execute"
team: red
domain: web-security
section: vulnerabilities
type: knowledge
angle: attacker-mindset
sourceTrack: baw
tags: ["code-injection", "rce", "lfi", "rfi", "upload", "web", "server-side"]
difficulty: easy
shortDescription: "A beginner-friendly introduction to Code Injection and Command Injection: how they differ, where they come from, how to think about them, and why they can lead to full server compromise."
updatedAt: "2026-04-29"
---

# Code Injection and Command Injection: when an application executes something it should never execute

Some vulnerabilities allow you to read someone else’s data.

Some vulnerabilities allow you to change a product price, view another user’s ticket, or bypass application logic.

But there are also vulnerabilities that are much more dangerous, because they cross the line between:

> “I can influence how the application behaves”

and

> “I can execute code or system commands on the server.”

This category includes **Code Injection** and **Command Injection**.

These are the kinds of vulnerabilities that may feel almost magical to beginners. In practice, there is no magic here. There is only an application that does something very dangerous:

**it takes user-controlled data and treats it as an instruction to execute.**

That is the core of the problem.

---

# The simplest mental model

Imagine an application as an employee who receives a form from a user.

Normally, the user should provide data, for example:

```text
8.8.8.8
```

or:

```text
contact.php
```

or:

```text
John
```

The problem starts when the application does not treat this data as plain text, but uses it inside a mechanism that can **execute code**, **run operating system commands**, or **include files into the application’s execution flow**.

At that point, the user may stop being just a user.

They may start influencing what the server executes.

---

# Code Injection vs Command Injection

These two vulnerabilities are similar, but they are not the same.

## Code Injection

**Code Injection** happens when an attacker can cause application-level code to be executed on the server side.

This could be code such as:

```text
PHP
Python
JavaScript
Java
Ruby
```

So the problem is not that someone enters text into a form.

The problem is that the application later interprets that text as code.

Example of a vulnerable pattern:

```php
eval($_GET["input"]);
```

If the `input` parameter comes from the user and is not handled safely, the application may execute whatever the user provides.

It is as if the application said:

> “Write me a piece of code, and I will run it on the server.”

Sounds absurd?

It is.

And yet, historically, this kind of bug has appeared in real applications.

---

## Command Injection

**Command Injection** happens when an attacker can cause an operating system command to be executed on the server.

Here, we are not injecting PHP, Python, or Java code.

Here, we are trying to influence a command executed by the operating system.

For example, an application has a diagnostic feature that runs `ping`:

```php
shell_exec("ping -c 3 " . $_GET["host"]);
```

The developer assumes that the user will provide an IP address:

```text
8.8.8.8
```

But if the application simply appends user input to a system command, an attacker may try to change the meaning of the entire command.

So instead of “ping this address”, the server may receive something like:

```text
ping this address, and then execute another command as well
```

That is Command Injection.

---

# The most important difference

In the simplest terms:

```text
Code Injection = execution of application-level code
Command Injection = execution of an operating system command
```

Or even simpler:

```text
Code Injection:
“The application executed code that was supplied to it.”

Command Injection:
“The operating system executed a command that passed through the application.”
```

In both cases, the impact can be severe because the attacker may gain the ability to perform operations on the server.

Not always as `root`.

More often as the user running the application, for example:

```text
www-data
tomcat
apache
nginx
```

But even that level of access may be enough to read application files, configuration, secrets, environment variables, or to continue toward further escalation.

---

# Why are these vulnerabilities so dangerous?

Because the application server usually has access to things that a regular user should never see.

It may have access to:

```text
application source code
configuration files
environment variables
API keys
database passwords
user files
internal services
the local network
```

If an attacker gains the ability to execute code or commands on the server, they may try to move from the application layer to the operating system layer.

That is why vulnerabilities leading to RCE, meaning Remote Code Execution, are often treated as critical in penetration testing reports.

---

# Where do Code Injection and Command Injection come from?

Most often, from one wrong assumption:

> “The user will provide data in the format we expect.”

This assumption is dangerous.

An application must not trust input data.

Input data is anything that comes from outside, for example:

```text
URL parameters
POST request body
HTTP headers
cookies
file names
uploaded file content
form data
API data
data imported from XML, JSON, or CSV
```

From a security perspective, every such value is potentially controlled by the user.

And if a user-controlled value later reaches a dangerous mechanism, the problem begins.

---

# Dangerous places in an application

Pay special attention to places where the application:

```text
calls eval-like functions
executes operating system commands
includes files based on a parameter
processes uploaded files
processes XML or XSLT
uses administrative panels
uses outdated libraries
runs in debug mode
```

These are the places where an input validation issue can have a much bigger impact than an ordinary bug.

---

# Vector 1: eval, the classic Code Injection case

`eval`-like functions are one of the most obvious examples of Code Injection.

Their purpose is to take text and execute it as code.

Many languages have similar mechanisms.

In PHP, an example is:

```php
eval()
```

In Python:

```python
eval()
exec()
```

In JavaScript:

```javascript
eval();
Function();
```

The problem appears when user input reaches such a function.

Example of unsafe thinking:

```text
The user will only provide a simple value, so we can execute it.
```

Safer thinking:

```text
The user can provide anything, so we must not treat it as code.
```

In practice, the use of `eval` in web applications is often a warning sign. It does not always mean there is a vulnerability, but it always deserves careful analysis.

---

# Vector 2: Command Injection through system commands

Command Injection most often appears where an application executes external programs installed on the server.

Examples of such operations:

```text
pinging a host
file conversion
PDF generation
image processing
calling grep/sed/cat
compressing archives
running helper scripts
```

Executing a system command is not automatically a vulnerability.

The vulnerability appears when the user can influence part of the command.

Example of a dangerous pattern:

```php
shell_exec("ping -c 3 " . $userInput);
```

Here, the application builds a command by appending user input.

This is risky because the system shell can interpret special characters.

The attacker does not need to “hack ping”.

They only need to influence how the final command is interpreted by the system.

---

# Vector 3: Local File Inclusion

**Local File Inclusion**, or LFI, is a vulnerability where an application includes a local file based on user-controlled data.

Example of a dangerous pattern:

```php
include("pages/" . $_GET["page"]);
```

The developer assumes that the user will provide:

```text
contact.php
```

Then the application includes:

```text
pages/contact.php
```

But if the `page` parameter is not properly validated, the user may try to point to another file on the system.

LFI often starts with file read.

But under certain conditions, it can go further, even to code execution.

For example, if the attacker can first place their own file on the server, and then force the application to include it.

---

# LFI is not always RCE

This is important.

Beginners often put everything into one bucket:

```text
LFI = RCE
```

Not always.

LFI may only provide file read.

But it can become a step toward RCE if we find an additional element in the chain, for example:

```text
file upload capability
log poisoning
session file inclusion
temporary file inclusion
including a file containing code
```

In penetration testing, it is not only important to find a single vulnerability, but to understand whether it can be chained with another application mechanism.

---

# Vector 4: Remote File Inclusion

**Remote File Inclusion**, or RFI, is similar to LFI, but instead of a local file, the application includes a file from a remote address.

So instead of:

```text
page=contact.php
```

an attacker tries to cause the application to fetch and execute a file from an external server.

This type of vulnerability is much rarer today because many technologies and configurations restrict this behavior by default.

But the idea itself is very important:

> if an application allows the user to decide which file should be included for execution, the user may try to turn the application into a mechanism for running external code.

---

# Vector 5: file upload

Upload mechanisms are one of the classic places to look for a path toward code execution.

Not because upload is bad by itself.

Upload is a normal application feature.

The problem starts when the application:

```text
allows any file type
stores files in a web-accessible directory
does not rename files
does not verify the real file type
checks only the extension
uses a blacklist instead of a whitelist
allows files like .php, .phtml, .jsp, .aspx
allows the user to influence the storage path
```

If an attacker can upload a file containing code and later access it through the browser, the server may execute that code.

---

# Why checking only the extension is not enough

Because the extension is just part of the file name.

An attacker may try many bypasses:

```text
double extensions
non-standard extensions interpreted by the server
case sensitivity differences
parser bugs
server misconfiguration
.htaccess files
ZIP archives with dangerous content
```

Example:

```text
avatar.php.jpg
```

To the application, it may look like an image.

To a misconfigured server, it may be something more.

That is why secure upload handling should not rely only on checking the end of the file name.

---

# A safer approach to upload

A safer upload mechanism should use several layers of protection:

```text
whitelist of allowed file types
MIME type verification
magic bytes verification
server-side file renaming
storage outside executable directories
no ability to execute the file as a script
file size limits
file scanning
separation of storage from the application
serving files through a safe handler
```

The most important rule:

> an uploaded file should be treated as data, not as code.

---

# Vector 6: administrative panels

Sometimes the path to code execution does not go through a classic injectable parameter.

Sometimes the problem is an administrative panel.

Examples:

```text
Tomcat Manager
JBoss / WildFly Console
CMS panels
WordPress admin panel
Joomla admin panel
deployment panels
debugging panels
```

If such a panel is publicly accessible and poorly protected, an attacker may try to gain access through weak passwords, default accounts, or configuration mistakes.

After logging in, the panel may expose features that are powerful by design:

```text
uploading applications
installing plugins
editing templates
editing code
deploying packages
changing server configuration
```

In that case, the problem is not “injection” in the classic sense.

The problem is that the attacker has gained access to features that allow them to cause code execution.

---

# Vector 7: XSS as a step toward Code Injection

At first glance, XSS and Code Injection are different worlds.

XSS executes JavaScript in the user’s browser.

Code Injection executes code on the server side.

But in practice, XSS can become a step toward something bigger.

Imagine this scenario:

1. A user sends a message through a contact form.
2. The message appears in the administrative panel.
3. An administrator opens the ticket.
4. Malicious JavaScript executes in the administrator’s browser.
5. That JavaScript performs actions inside the panel as the administrator.

If the administrative panel allows editing files, installing plugins, or changing templates, XSS may be used as an intermediate step toward server-side code execution.

This is a very important lesson:

> a vulnerability does not need to directly provide RCE to become part of a chain that leads to RCE.

---

# Vector 8: debug mode in production

Debug mode is useful in a development environment.

It shows more information about errors, stack traces, variables, file paths, configuration, and application internals.

The problem appears when debug mode is enabled in production.

In the best case, this leads to information disclosure.

In the worst case, a framework or debugging tool may expose an interactive console that allows code execution.

That is why debug mode in production is not just an “ugly error message”.

It may be a real path to application compromise.

---

# Vector 9: SQL Injection as a path to RCE

SQL Injection is usually associated with databases:

```text
reading data
bypassing login
modifying records
deleting data
```

But in some environments, SQL Injection can go further.

It may allow:

```text
writing a file to the server
reading local files
calling system-level functions
loading extensions
executing procedures
```

Not every database allows this.

Not every configuration makes this possible.

But as a penetration tester, it is worth knowing that SQL Injection is not always only a database issue.

Sometimes it can be the beginning of a chain leading to code execution.

---

# Vector 10: XSLT and XML processing

XSLT is a mechanism for transforming XML documents.

In some technologies, the XSLT processor can be configured to access programming language functions.

If an application allows the user to control the XSLT stylesheet or the data source, and the parser is configured insecurely, code execution may become possible.

This is not the most common vector for beginners, but it is a great example of one principle:

> any feature that interprets data as instructions can become dangerous.

---

# Vector 11: WebDAV

WebDAV extends HTTP with additional methods, such as:

```text
PUT
COPY
MOVE
PROPFIND
MKCOL
LOCK
UNLOCK
```

If the server is misconfigured, WebDAV may allow operations on application files.

From an attacker’s perspective, the most interesting situations are those where it is possible to:

```text
upload a file
move a file
change a file extension
overwrite an existing resource
```

WebDAV itself is not a vulnerability.

The vulnerability is uncontrolled exposure and insecure configuration.

---

# Vector 12: vulnerable libraries

An application may be written correctly and still use a library that contains a vulnerability leading to RCE.

This is a very common problem in modern web security.

Applications are built from many dependencies:

```text
frameworks
image processing libraries
PDF libraries
XML parsers
mail clients
template engines
archive tools
CMS plugins
```

If one of these dependencies is vulnerable, the application may inherit the problem.

Examples of problem classes:

```text
vulnerable image parsers
vulnerable mail libraries
vulnerable Java frameworks
vulnerable WordPress plugins
vulnerable deserialization libraries
vulnerable template engines
```

That is why application security is not only about the code written by the team.

It is also about dependencies, configuration, and the entire software supply chain.

---

# Small mistakes that help an attack

Not every bug immediately gives code execution.

But many small mistakes help the attacker build a full picture of the environment.

Examples:

```text
exposing stack traces
exposing framework versions
exposing local file paths
old application copies left on the server
backups in a public directory
test panels left in production
.env files accessible through the web
verbose headers with version information
missing error handling
```

To a beginner, this may look like low priority.

To an attacker, it is often a map.

Information about versions, paths, and technologies helps choose the right payloads, exploits, and further testing direction.

---

# How to think about these vulnerabilities during testing

Do not start with the payload.

Start with the question:

> can this application feature cause my data to be treated as an instruction?

Look for places where the application:

```text
executes something on the server
processes a file
includes a file
generates a document
converts an image
runs diagnostics
imports data
parses XML
handles uploads
has an administrative panel
shows debug errors
```

Then ask the second question:

> can I influence the data passed to that mechanism?

If yes, you have a potential test point.

---

# Example penetration tester thinking process

Assume the application has a feature:

```text
/check-host?ip=8.8.8.8
```

Do not immediately think:

```text
Which payload should I paste?
```

Think:

```text
What does the application do with this parameter?
Does it only save it to the database?
Does it send it to an API?
Does it run ping?
Does the response look like system command output?
Do errors reveal shell_exec, system, subprocess?
Does the parameter accept only IP addresses?
Can I provide a domain?
Can I provide special characters?
Does the response change in timing?
```

Only then do you test the hypothesis.

That is the difference between copying payloads and actually testing an application.

---

# What may confirm Command Injection?

Warning signs:

```text
the response looks like output from a system command
system messages appear
the application returns output from tools such as ping, nslookup, traceroute
different special characters change the response behavior
specific payloads cause time delays
errors reveal shell, bash, sh, cmd.exe, powershell
```

Testing often begins with safe, controlled checks that show whether input influences the executed command.

The goal is not to immediately take over the server.

The goal is to answer this question:

> does user-controlled data escape the context of a normal argument and influence the structure of the command?

---

# What may confirm Code Injection?

Warning signs:

```text
input is interpreted as an expression
the application returns the result of a calculation
errors show fragments of code
the response contains function or class names
the application uses dynamic function calls
template engines are involved
input reaches eval/exec/create_function
```

A good example is SSTI, meaning Server-Side Template Injection.

There, the user often starts with a simple test such as:

```text
will the application calculate an expression inside a template?
```

If yes, the input is not just plain text. It is being interpreted by the template engine.

And that may be the first step toward a more serious vulnerability.

---

# Impact of a successful attack

The impact of Code Injection and Command Injection can be severe.

## 1. Data access

An attacker may try to read:

```text
application source code
configuration files
secrets
database passwords
API tokens
user files
logs
environment variables
```

This often leads to further compromise.

A single configuration file may contain credentials for a database, Redis, S3, an admin panel, or other services.

---

## 2. Application modification

If the application process has sufficient permissions, an attacker may try to modify files.

This can lead to:

```text
defacement
content replacement
adding malicious code
uploading a backdoor
configuration changes
```

---

## 3. Webshell

A webshell is a file placed on the server that allows the attacker to perform operations through a browser or HTTP requests.

It is a common way to maintain access after a successful attack against a web application.

The problem with webshells is that they are not always obvious.

An attacker may:

```text
add a new file
hide code inside an existing file
use an unusual extension
hide code inside the uploads directory
disguise the name as a legitimate application file
```

That is why after an incident, simply “fixing the vulnerability” is not enough.

You also need to check whether the attacker left a backdoor behind.

---

## 4. Privilege escalation

An application usually runs as a restricted user.

But if the attacker can already execute commands on the server, they may start looking for issues in the operating system itself.

They may check:

```text
kernel version
incorrect file permissions
cron jobs
secrets in configuration
sudo rules
processes running as root
vulnerable local services
```

This is the transition from application-level compromise to classic post-exploitation.

---

## 5. Pivoting into the internal network

An application server often sees more than an internet user.

It may have access to:

```text
internal databases
administrative panels
microservices
APIs not exposed publicly
LAN services
development services
```

That is why a compromised server can become a pivot point for further attacks.

This is especially dangerous in environments with weak network segmentation.

---

# How to defend against this

The most important rule:

> do not allow user data to be executed as code or as a command.

It sounds simple, but practice is harder.

## 1. Avoid eval and similar mechanisms

If an application needs `eval`, it is worth asking:

```text
is there really no safer way to solve this?
```

In most cases, there is.

Dynamically executing code based on input data is a very risky pattern.

---

## 2. Do not build commands through string concatenation

Dangerous pattern:

```text
"ping " + userInput
```

Safer approach:

```text
separate the command from its arguments
use a safe API
do not invoke the shell if you do not need to
validate arguments
```

In Java, an example of a better approach is `ProcessBuilder`.

In PHP, functions such as these exist:

```php
escapeshellarg()
escapeshellcmd()
```

But important: escaping is not the main protection.

It is an additional layer.

The foundation should be validation and avoiding unnecessary shell execution.

---

## 3. Use whitelists

If a parameter should be an IP address, it should be an IP address.

If it should be a number, it should be a number.

If it should be one of several allowed options, select it from a map.

Example of a good model:

```text
userInput = "contact"

allowedPages = {
  "home": "/templates/home.php",
  "contact": "/templates/contact.php",
  "about": "/templates/about.php"
}

include allowedPages[userInput]
```

Not:

```text
include "templates/" + userInput
```

The difference is huge.

In the first case, the user chooses from a controlled list.

In the second case, the user influences the path.

---

## 4. Validate input data

Check:

```text
data type
length
format
allowed characters
value range
data structure
```

Examples:

```text
age should be a number within a specific range
an identifier should be a UUID or a number
an IP address should pass IP validation
a file name should not be a path
a file type should be one of the allowed types
```

This is not about randomly filtering “bad characters”.

It is about clearly defining what is valid.

---

## 5. Limit application permissions

Even if a vulnerability appears, its impact can be limited.

The application should not run as `root`.

The application process should have the minimum required permissions.

Useful practices include:

```text
least privilege
user separation
containerization
read-only filesystem where possible
directory access restrictions
secret separation
network segmentation
```

Good architecture does not assume that bugs will never happen.

Good architecture assumes that a bug may happen, but its impact must be limited.

---

## 6. Disable debug in production

In production, there should be no:

```text
debug mode
stack traces shown to the user
interactive consoles
test endpoints
developer panels
verbose error messages
```

Errors should be logged server-side, while the user should receive a controlled message.

---

## 7. Update dependencies

It is worth using tools such as:

```text
OWASP Dependency-Check
Snyk
npm audit
Dependabot
GitHub Security Alerts
```

But the tool itself is not enough.

You need a process:

```text
who analyzes alerts
how risk is assessed
when updates are applied
how fixes are tested
what is done with false positives
```

Without a process, a dependency scanner quickly becomes a noise generator.

---

# The most common beginner mistake

Beginners often look at Code Injection and Command Injection through the lens of payloads.

They search for lists of characters, separators, and ready-made commands.

That is the wrong order.

First, you need to understand the context.

Questions worth asking:

```text
What does the application do with my input?
Does my input reach code?
Does my input reach a system command?
Does my input reach a file path?
Does my input reach a parser?
Does my input reach a template engine?
Does the response reveal server-side execution?
Can I trigger an error and see what happens underneath?
```

A payload is only a tool.

The real work is understanding the data flow.

---

# A simple association map

If you see a feature using:

```text
ping
traceroute
nslookup
whois
convert
ffmpeg
wkhtmltopdf
tar
zip
grep
sed
cat
```

think:

```text
could this be Command Injection?
```

If you see:

```text
eval
exec
dynamic functions
template engine
plugins
scripts
XSLT
deserialization
```

think:

```text
could this be Code Injection?
```

If you see:

```text
page=
file=
template=
lang=
theme=
path=
download=
include=
```

think:

```text
could this be LFI/RFI or Path Traversal?
```

If you see:

```text
avatar upload
document upload
ZIP import
file conversion
image thumbnails
```

think:

```text
could this file become code?
```

---

# How to describe this vulnerability in a report

A good vulnerability description should not be limited to:

```text
Parameter X is vulnerable to Command Injection.
```

That is not enough.

A better description should show:

```text
where the vulnerability is located
which parameter is controlled by the user
which mechanism executes data on the server side
how execution was confirmed
which privileges the process runs with
what the real impact is
which data may be at risk
how to fix it
```

Example impact description:

```text
The vulnerability allows an attacker to execute operating system commands in the context of the web application user. Depending on the process privileges, this may allow access to source code, configuration files, application secrets, user data, and further escalation within the server environment.
```

---

# The most important things to remember

Code Injection and Command Injection are not about “magic payloads”.

They are about breaking the boundary between data and instructions.

An application should treat user input as data.

If it starts treating it as code, a command, an executable path, or an instruction for a parser, risk appears.

The most important sentence in this note:

> User-controlled data should never decide what code or command gets executed on the server.

That is the foundation.

Everything else is just a different variation of the same mistake.

---

# TL;DR

**Code Injection** is a situation where a user can cause application-level code to execute on the server side.

**Command Injection** is a situation where a user can cause an operating system command to execute on the server.

Most common sources of the problem:

```text
eval and similar functions
building commands by appending input
Local File Inclusion
Remote File Inclusion
unsafe file upload
administrative panels
XSS in an administrator panel
debug mode in production
SQL Injection leading to RCE
XSLT/XML parsers
WebDAV
vulnerable libraries
```

Most important protections:

```text
do not execute user data
avoid eval
avoid unnecessary shell execution
do not build commands through concatenation
use whitelists
validate data type, format, length, and range
handle uploads safely
disable debug in production
update dependencies
limit application privileges
segment the environment
```

Most important mindset:

```text
Do not ask first: which payload should I paste?

Ask:
where does my input go,
how is it interpreted,
and can it be treated as an instruction?
```
