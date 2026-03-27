---
id: enumeration-field-manual
title: "Enumeration - Field Manual (workflow + mindset + cheat-sheets)"
team: red
category: eJPT
tags: ["nmap", "nse", "metasploit", "ftp", "smb", "http", "mysql", "ssh", "smtp"]
difficulty: easy
shortDescription: "A comprehensive guide to enumeration in the context of penetration testing and preparation for the eJPT, covering workflows, checklists for the most common services, and an analytical approach focused on transforming scan results into actionable attack hypotheses."
updatedAt: "2026-03-08"
---

> All materials included here are only part of study notes. They are not intended to be used against production systems without authorization.

# Enumeration - Field Manual

## Why this note exists at all

Enumeration is the moment when "I see an open port" stops being enough, and real understanding of the target begins.

After a port scan, I already know **what is alive** and **what is listening**. Now I need to answer more important questions:

- **what service is this exactly,**
- **which version is it running,**
- **does it leak users, directories, shares, or databases,**
- **can I build a sensible attack path from it.**

This is the stage where I stop guessing. I start building an attack model.

Well-executed enumeration often points to the direction on its own:

- a service version gives a ready lead for `searchsploit`,
- a user list gives material for brute-force,
- an SMB share gives access to files,
- anonymous FTP can hand over useful data immediately,
- exposed MySQL can be a simple path to passwords,
- a web server very often reveals technology, admin panels, and backups.

The biggest beginner mistake? **Moving to exploitation too fast.**

The best mental rule for this stage is simple:

> Don’t just ask, “is the port open?” Ask: **what did this service just tell me, and how can I use it?**

---

## 1. Where enumeration sits in the whole workflow

The full thinking model looks like this:

| Phase                 | What I do                                    | Goal                                               |
| --------------------- | -------------------------------------------- | -------------------------------------------------- |
| Information Gathering | collect passive information                  | map the terrain                                    |
| Active Recon          | check what is alive and which ports are open | define the attack surface                          |
| **Enumeration**       | ask specific services for details            | versions, users, shares, directories, technologies |
| Exploitation          | use what I already know                      | foothold                                           |
| Post-Exploitation     | maintain access and expand reach             | pivoting, privilege escalation                     |

One thing matters to me here:

**Enumeration is not an extra step after port scanning. Enumeration is its continuation.**

A port scan tells me where to look. Enumeration tells me **how to get in**.

---

## 2. My mindset during enumeration

When I look at results, I do not think like a tool operator. I think like someone piecing together the story of a target from small traces.

Example line of thought:

- I see `vsftpd 2.3.4` -> I immediately think of the known lead and check exploitability.
- I see `Apache 2.4.49` -> I immediately associate it with path traversal and possible escalation to remote code execution.
- I see SMB and I can read shares without credentials -> first files, then credentials, only then the next moves.
- I see SMTP -> I am not interested in sending mail, I am interested in **existing system users**.
- I see exposed MySQL -> I check whether someone left an empty password, a weak password, or remote access enabled for no good reason.
- I see a web server -> I think about technologies, directories, backups, admin panels, configuration files, and component versions.

The simplest rule:

> **Every service leaks something.**
> Your job is to turn that information leak into the next attack hypothesis.

---

## 3. Workflow on a new target

This is the workflow worth keeping almost automatic in your head.

### Step 1: find hosts

```bash
nmap -sn 10.10.10.0/24
```

This tells me which hosts respond at all.

### Step 2: run a full port scan and basic identification

```bash
nmap -sV -sC -O -p- 10.10.10.5 -oN full_scan.txt -oX full_scan.xml
```

This is a very strong starting point because I immediately get:

- service versions,
- default Nmap Scripting Engine checks,
- an attempt at operating system detection,
- all ports,
- results saved to both text and XML.

The XML file matters because I can later import it into Metasploit.

### Step 3: read the result like an attack plan, not like a log

After the scan, I do not rush forward immediately. I stop and break the result into questions:

- which ports are the most interesting,
- which versions look old or distinctive,
- where can I extract users,
- where can I get access without a password,
- which services can give me files or hashes,
- does anything point to a classic exploit,
- can I combine information between services.

### Step 4: run enumeration per service

For every open service, I build a separate mini-path:

- FTP -> anonymous login, files, write access,
- SMB -> shares, users, policies, vulnerabilities,
- HTTP/HTTPS -> headers, technologies, directories, backups,
- MySQL -> version, empty passwords, databases and tables,
- SSH -> authentication methods, users, brute-force,
- SMTP -> user enumeration,
- RDP -> identification and possible brute-force,
- everything else -> banner, documentation, `searchsploit`, manual inspection.

### Step 5: connect the data between services

This is the moment that very often gives access:

- users from SMTP -> tested on SSH,
- passwords from MySQL -> tested on SSH, SMB, or the web panel,
- files from FTP or SMB -> may contain application configuration and credentials,
- a web backup -> may reveal `.env`, `.git`, `config.php`, `wp-config.php`.

### Step 6: only now exploitation

Only when I know **why** something should work do I move to exploitation.

---

## 4. Nmap as the foundation of enumeration

Nmap is not just a port scanner. It is the first interpreter of the target.

### Baseline scan

```bash
nmap -sV -sC -O -p- 10.10.10.5 -oN full_scan.txt -oX full_scan.xml
```

### More aggressive scan on known ports

```bash
nmap -A -p 21,22,80,443,445,3306 10.10.10.5
```

I usually use this when I already know those ports are open and want to push for details faster.

### Why saving results is mandatory

During an exam and in real work, saving results is not optional. It protects your process.

- you do not lose time repeating scans,
- you can come back to the results later,
- you can compare hosts,
- you can import XML into Metasploit.

### Nmap Scripting Engine - real advantage

Nmap Scripting Engine gives ready-made scripts for specific types of enumeration.

The most important categories worth remembering:

| Category    | Meaning                                | Typical use                           |
| ----------- | -------------------------------------- | ------------------------------------- |
| `safe`      | safe, basic enumeration                | banners, page titles                  |
| `discovery` | information gathering                  | shares, hosts, directories            |
| `auth`      | login and authentication method checks | anonymous FTP, SSH methods            |
| `vuln`      | known vulnerability checks             | SMB, HTTP, SSL                        |
| `brute`     | brute-force                            | SSH, FTP, MySQL                       |
| `exploit`   | exploitation attempts                  | only when you know what you are doing |

Examples:

```bash
nmap --script ftp-anon -p 21 10.10.10.5
nmap --script smb-enum-shares,smb-enum-users -p 445 10.10.10.5
nmap --script 'http-*' -p 80 10.10.10.5
nmap --script vuln 10.10.10.5
```

If a result looks promising, I immediately build the next move from it:

- version -> `searchsploit`,
- users -> wordlist for login testing,
- shares -> manual inspection,
- directories -> open them in a browser or with `curl`,
- vulnerability -> manual verification or a Metasploit module.

---

## 5. Metasploit as support for enumeration

Metasploit is not only for exploits. During enumeration, its auxiliary modules are very useful, especially when:

- you want to quickly run a dedicated scanner for a service,
- you want to brute-force from one place,
- you want to work through a pivot,
- you want to use imported Nmap results.

### Import from Nmap

```bash
msfconsole
msf6 > db_import /path/to/full_scan.xml
msf6 > hosts
msf6 > services
```

### Direct scan from Metasploit

```bash
msf6 > db_nmap -sV -sC 10.10.10.5
```

### When auxiliary modules do the most work

I like them most when I already have the first session and want to scan an internal network through a pivot.

Example flow:

```bash
msf6 > use post/multi/manage/autoroute
msf6 > set SESSION 1
msf6 > run

msf6 > use auxiliary/scanner/portscan/tcp
msf6 auxiliary(tcp) > set RHOSTS 192.168.1.0/24
msf6 auxiliary(tcp) > set PORTS 21,22,80,443,445,3306,8080
msf6 auxiliary(tcp) > run
```

If Kali cannot see the internal segment but the session is already there, this is where auxiliary modules start giving real advantage.

---

## 6. FTP enumeration

### What I want to get from FTP

I care about four things most:

1. server version,
2. anonymous login,
3. file contents,
4. write access.

### First move

```bash
nmap --script ftp-anon,ftp-syst -p 21 10.10.10.5
```

If I get information that anonymous login is allowed, I move to manual verification.

```bash
ftp 10.10.10.5
```

After logging in, I check:

```bash
ls -la
pwd
cd /var/www
get file.txt
mget *.conf
```

### What I hunt for on FTP

- configuration files,
- backup files,
- text files with notes,
- hidden files,
- the web server directory,
- upload capability.

If I have **write access** and I see this is a directory used by the web server, I immediately think about uploading a file and getting code execution.

### FTP brute-force

```bash
nmap --script ftp-brute --script-args userdb=users.txt,passdb=pass.txt -p 21 10.10.10.5
```

or in Metasploit:

```bash
use auxiliary/scanner/ftp/ftp_login
set RHOSTS 10.10.10.5
set USER_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
run
```

### My mental shortcut for FTP

> FTP open = first anonymous login, then files, then write access, only after that brute-force.

---

## 7. SMB enumeration

### Why SMB is so valuable

SMB very often gives information that later works elsewhere:

- user lists,
- network shares,
- password policy,
- sometimes access without credentials,
- sometimes known vulnerabilities.

### First move I like the most

```bash
enum4linux -a 10.10.10.5
```

This often gives a broad picture right away:

- users,
- shares,
- system information,
- password policy,
- NetBIOS and domain data.

### Nmap against SMB

```bash
nmap --script smb-os-discovery -p 445 10.10.10.5
nmap --script smb-enum-shares -p 445 10.10.10.5
nmap --script smb-enum-users -p 445 10.10.10.5
nmap --script 'smb-vuln*' -p 445 10.10.10.5
```

### `smbclient` for manual inspection

```bash
smbclient -L //10.10.10.5 -N
smbclient //10.10.10.5/share -N
```

Once inside, I check:

```bash
ls
get file.txt
put test.txt
```

### The most important SMB questions

- are there shares accessible without credentials,
- can I enter the share,
- can I read something,
- can I write something,
- does the service look old,
- does the result point to a known vulnerability.

If I see a lead connected with `MS17-010`, I treat it seriously and verify further.

### My mental shortcut for SMB

> SMB open = `enum4linux -a`, then `smbclient`, then vulnerability checks, and only later brute-force.

---

## 8. Web server enumeration

### What a web server reveals right away

A web server can be a goldmine of information even before deeper web application testing begins.

What usually interests me most:

- the `Server` header,
- the `X-Powered-By` header,
- the page title,
- HTTP methods,
- technologies and frameworks,
- hidden directories,
- backups,
- login panels,
- files such as `robots.txt`, `.git`, `.env`, backups, and archives.

### First quick moves

```bash
curl -I http://10.10.10.5
curl -I http://10.10.10.5/robots.txt
whatweb 10.10.10.5
```

### Nmap against HTTP

```bash
nmap --script http-headers -p 80 10.10.10.5
nmap --script http-title,http-methods -p 80 10.10.10.5
nmap --script http-enum -p 80 10.10.10.5
nmap --script http-robots.txt -p 80 10.10.10.5
```

### Directory enumeration

```bash
gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/big.txt -x php,txt,html
```

or the classic:

```bash
dirb http://10.10.10.5
```

### What I check manually before running a larger wordlist

- `/robots.txt`
- `/admin`
- `/login`
- `/backup`
- `/.git`
- `/phpmyadmin`
- `/wp-admin`

If I see a version of Apache, Nginx, WordPress, or a specific component, I immediately check whether that version gives a meaningful lead for deeper verification.

### My mental shortcut for HTTP

> HTTP open = first headers and technology, then directories, then backups and interesting files, and only after that deeper application testing.

---

## 9. MySQL enumeration

### Why MySQL matters so much

An exposed database very often means weak configuration. Even if it does not give access immediately, it may still reveal:

- database names,
- users,
- tables,
- hashes,
- credentials for other services.

### First move

```bash
nmap --script mysql-info -p 3306 10.10.10.5
nmap --script mysql-empty-password -p 3306 10.10.10.5
```

If there is even a small chance of an empty password or weak configuration, I check it immediately.

### Manual connection

```bash
mysql -u root -p -h 10.10.10.5
```

Once inside, what usually interests me most is:

```sql
show databases;
use webapp_db;
show tables;
select * from users limit 10;
```

### What I really want to extract from it

- passwords or hashes,
- usernames,
- application configuration,
- session data,
- anything that may also work on SSH, FTP, or the web panel.

### Brute-force and modules

```bash
nmap --script mysql-brute -p 3306 10.10.10.5
```

or:

```bash
use auxiliary/scanner/mysql/mysql_login
set RHOSTS 10.10.10.5
set USERNAME root
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
run
```

### My mental shortcut for MySQL

> MySQL open = version, empty password, access, databases, users, hashes, credential reuse.

---

## 10. SSH enumeration

### What SSH usually gives, and what it usually does not

SSH less often gives a “click and shell” type vulnerability, but very often gives access through:

- a weak password,
- credential reuse,
- a known user list,
- an unusual authentication method.

### What I check first

```bash
nmap --script ssh-hostkey -p 22 10.10.10.5
nmap --script ssh-auth-methods --script-args ssh.user=root -p 22 10.10.10.5
```

What interests me most is which authentication methods are allowed.

### Brute-force

```bash
nmap --script ssh-brute --script-args userdb=users.txt,passdb=pass.txt -p 22 10.10.10.5
```

or:

```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.5
```

or Metasploit:

```bash
use auxiliary/scanner/ssh/ssh_login
set RHOSTS 10.10.10.5
set USER_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
set STOP_ON_SUCCESS true
run
```

### The most important practical point

SSH often works only because you did good enumeration somewhere else first.

Meaning:

- you may get users from SMTP or SMB,
- you may get passwords from MySQL,
- you may find account names in configuration files or backups.

### My mental shortcut for SSH

> SSH rarely gives you much on its own. SSH is usually won through what you collected earlier.

---

## 11. SMTP enumeration

### Why SMTP matters at all

Not because you want to send email. What you care about is something more valuable:

**does the server reveal existing users.**

If it does, you get a ready-made account list for testing against other services.

### What I check

```bash
nmap --script smtp-commands -p 25 10.10.10.5
nmap --script smtp-enum-users -p 25 10.10.10.5
nmap --script smtp-enum-users --script-args smtp-enum-users.methods={VRFY,RCPT} -p 25 10.10.10.5
```

### Metasploit

```bash
use auxiliary/scanner/smtp/smtp_enum
set RHOSTS 10.10.10.5
set USER_FILE /usr/share/metasploit-framework/data/wordlists/unix_users.txt
run
```

### Manually

```bash
nc 10.10.10.5 25
```

Then:

```text
EHLO test
VRFY root
VRFY admin
RCPT TO: <root>
```

If the response indicates that the user exists, I immediately save it to my list and use it later on SSH, FTP, or SMB.

### My mental shortcut for SMTP

> SMTP = source of usernames. Do not look at it like a mail server. Look at it like a username generator for further testing.

---

## 12. RDP and other services

If I find RDP, I do not ignore it just because it was not the main focus of the material.

My line of thought is simple:

- identify the version,
- see whether the system looks old,
- check whether I have a meaningful user list,
- decide whether brute-force or credential reuse makes sense.

The same applies to every other service. Even if you do not have a ready checklist, go back to the basic questions:

- what version is it,
- what does the banner reveal,
- can you log in without a password,
- is there a known exploitation lead,
- can you extract users, files, or data from it.

---

## 13. Connecting the dots between services

This is where exams and real labs are often won.

The most important links worth keeping in mind:

| What I found                   | Where I test it next                                |
| ------------------------------ | --------------------------------------------------- |
| users from SMTP                | SSH, FTP, SMB                                       |
| users from SMB                 | SSH, FTP, web login panel                           |
| passwords or hashes from MySQL | SSH, SMB, FTP, web logins                           |
| files from FTP or SMB          | application config, connection data, account names  |
| web server version             | `searchsploit`, known vulnerabilities, vendor blogs |
| write access to web directory  | file upload and code execution                      |
| application backup             | source code, `.env`, config files, connection data  |

This is very important:

> A single service does not always give access.
> **Two connected pieces of information very often do.**

---

## 14. Exam quick reference

### If I see this port, this is my first move

| Port | Service | My first move                                                             |
| ---- | ------- | ------------------------------------------------------------------------- |
| 21   | FTP     | `nmap --script ftp-anon,ftp-syst -p 21 TARGET`                            |
| 22   | SSH     | `nmap --script ssh-auth-methods --script-args ssh.user=root -p 22 TARGET` |
| 25   | SMTP    | `nmap --script smtp-enum-users -p 25 TARGET`                              |
| 80   | HTTP    | `whatweb TARGET` + `curl -I http://TARGET`                                |
| 443  | HTTPS   | same as HTTP + check the certificate and the same paths                   |
| 445  | SMB     | `enum4linux -a TARGET`                                                    |
| 3306 | MySQL   | `nmap --script mysql-info,mysql-empty-password -p 3306 TARGET`            |
| 3389 | RDP     | version identification and testing acquired credentials                   |

### Order of operations on a new target

1. check what is alive,
2. run a full port scan,
3. save the results,
4. split services into separate enumeration paths,
5. collect versions, users, files, shares, and hashes,
6. connect the data between services,
7. only then choose the most logical initial access vector.

### The most important wordlists worth remembering

```text
/usr/share/wordlists/rockyou.txt
/usr/share/wordlists/dirb/common.txt
/usr/share/wordlists/dirb/big.txt
/usr/share/metasploit-framework/data/wordlists/unix_users.txt
/usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
/usr/share/metasploit-framework/data/wordlists/common_users.txt
```

---

## 15. The most common mistakes during enumeration

### 1. Scanning only popular ports

If you did not run `-p-`, you may have missed the actual entry point.

### 2. Not saving results

This does not look dangerous until you lose context and start repeating the same scans again.

### 3. Jumping straight to exploits

If the exploit does not work, it is very often not because the world is unfair. It is because you had too little data and chose a direction too early.

### 4. Looking at services separately

Enumeration is won by combining information, not only by running tools against isolated ports.

### 5. Ignoring access without credentials

Anonymous FTP, guest SMB, empty MySQL password - these are the things that can give very fast progress.

### 6. No manual verification

A tool can suggest something, but only manually entering the share, directory, or database shows the real value of the result.

---

## 16. My mini-checklists per service

### FTP

- check the version,
- check anonymous login,
- inspect files,
- assess write access,
- see whether it is a web directory,
- only then brute-force.

### SMB

- `enum4linux -a`,
- check the share list,
- try entering without credentials,
- pull files,
- check users,
- check vulnerability leads.

### HTTP/HTTPS

- headers,
- technology,
- page title,
- directories,
- backups,
- panels,
- known versions.

### MySQL

- version,
- empty password,
- manual connection,
- databases,
- tables,
- users,
- hashes and reuse.

### SSH

- authentication methods,
- user list from other services,
- test common passwords,
- reuse data obtained earlier.

### SMTP

- commands,
- user enumeration,
- save the account list,
- use that list against other services.

---

## 17. One sentence I’m keeping for myself

If I had to keep only one thing from this chapter, it would be this:

**Enumeration is the moment when open ports stop being noise and start becoming an attack path.**

---

## 18. Final takeaway

Good enumeration is not about running more tools than everyone else.

It is about:

- asking the right questions,
- saving your results,
- connecting information between services,
- choosing the most logical path in.

For eJPT, it is really worth treating this stage like a time investment.

Because very often it looks like this:

- 20 minutes of good enumeration,
- 2 minutes to find the right lead,
- 5 minutes to get the foothold.

Without that, the same 27 minutes can easily disappear into blind shots.

So when I see open ports, I no longer ask only, “what is here?”

I ask:

> **what from this can be turned into the next advantage.**
