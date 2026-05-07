---
id: network-infrastructure-security-introduction
title: "Network and Infrastructure Security: Where Real Pentesting Actually Starts"
team: red-blue
domain: network-infrastructure
section: foundations
type: knowledge
angle: infrastructure-recon-mindset
sourceTrack: netMaster
tags: ["recon", "enumeration", "ports", "services", "nmap", "masscan", "linux", "pentest"]
difficulty: easy
shortDescription: "A beginner-friendly introduction to network and infrastructure security: what hosts, ports, and services are, why reconnaissance and enumeration are the foundation of infrastructure pentesting, and how to build your first workflow for network labs."
updatedAt: "2026-05-05"
---

# Network and Infrastructure Security: Where Real Pentesting Actually Starts

In web application security, we often start with a form, an endpoint, a cookie, or a parameter in the URL.

In network security, we start earlier.

Before there is an exploit, a reverse shell, pivoting, privilege escalation, or Active Directory compromise, we need to answer much simpler questions:

**What actually exists in this network?**

What hosts are there?  
What IP addresses do they have?  
Which ports are open?  
What services are running there?  
Is it SSH, HTTP, FTP, SMB, a database, an admin panel, a printer, monitoring software, or maybe something custom?  
Is the service running on a standard port, or has someone moved it somewhere unusual?  
Is the banner telling the truth, or is it only pretending to be a specific technology?

This is the first major foundation of infrastructure testing.

Not exploitation.

**Enumeration.**

Because in a network, you cannot attack something you cannot see.

---

## 1. What is network and infrastructure security?

Network and infrastructure security is the area focused on systems, services, and the connections between them.

In practice, this means analyzing things such as:

- Linux servers,
- Windows servers,
- Active Directory,
- SSH, FTP, SMB, RDP, HTTP, and HTTPS services,
- databases,
- administration panels,
- network devices,
- monitoring systems,
- network segmentation,
- firewalls,
- VPNs,
- internal applications,
- publicly exposed organizational assets.

In web security, we mostly look at the application.

In infrastructure security, we look at the whole environment where that application lives.

A web application can be secure at the code level, but still run on a server with an exposed admin panel, an old FTP service, vulnerable SMB, or poorly configured SSH.

That is why a good infrastructure pentester does not immediately ask:

> what payload should I paste here?

They first ask:

> what is running here, where is it running, why is it running, and should it be accessible?

---

## 2. The most important mindset shift

Beginners often think that a network pentest looks like this:

1. run a scanner,
2. see a CVE,
3. launch an exploit,
4. get root.

Sometimes this happens in very simple labs.

But in a real process, it much more often looks like this:

1. you find hosts,
2. you identify ports,
3. you recognize services,
4. you check versions and configuration,
5. you test default behavior,
6. you look for administrative mistakes,
7. you connect small observations into a larger scenario,
8. only then does exploitation appear.

The biggest value at the beginning is not knowing 1000 exploits.

The biggest value is being able to say:

> I see a host. I see a port. I see a service. I understand what it may mean. I know the next reasonable step.

That is the operator mindset.

---

## 3. Host, port, service — three words you need to understand

### Host

A host is a device in a network.

It can be a server, a user workstation, a router, a printer, a camera, a virtual machine, or a container.

In labs, a host will usually be represented by an IP address, for example:

```bash
10.10.10.5
192.168.56.101
172.16.1.20
```

The first question is:

> which hosts are alive?

There is no point scanning services on a machine that does not respond or does not exist.

---

### Port

A port is an entry point to a specific service.

Examples:

| Port | Typical service  | What it may mean            |
| ---: | ---------------- | --------------------------- |
|   21 | FTP              | file transfer               |
|   22 | SSH              | remote Linux/Unix shell     |
|   25 | SMTP             | outgoing mail               |
|   53 | DNS              | name resolution             |
|   80 | HTTP             | web application without TLS |
|  443 | HTTPS            | web application with TLS    |
|  445 | SMB              | file shares / Windows / AD  |
| 3389 | RDP              | Windows remote desktop      |
| 3306 | MySQL            | database                    |
| 5432 | PostgreSQL       | database                    |
| 8080 | Alternative HTTP | panel, API, dev app, proxy  |

A port itself is not a vulnerability.

An open port is information:

> something is listening here.

Only the service, version, configuration, and context tell you whether there is a problem.

---

### Service

A service is a specific program running on a port.

For example:

```text
22/tcp open  ssh     OpenSSH 8.4
80/tcp open  http    Apache httpd 2.4.54
445/tcp open smb     Samba smbd
```

This is much more valuable than simply knowing that “port 22 is open”.

Because now we can ask:

- what technology is this?
- what version is it?
- is the version old?
- does it allow anonymous access?
- does it use default credentials?
- does it reveal too much information?
- can we interact with it manually?
- are there known vulnerabilities?
- is the configuration secure?

---

## 4. Network reconnaissance — why do we do it?

Network reconnaissance is the process of collecting information about a network and its services.

The goal is not to “run as many tools as possible”.

The goal is to build a map.

At the beginning, you want to know:

```text
Network range:
192.168.1.0/24

Alive hosts:
192.168.1.1
192.168.1.10
192.168.1.15

Open ports:
192.168.1.10:22
192.168.1.10:80
192.168.1.15:445
192.168.1.15:3389

Services:
OpenSSH
Apache
SMB
RDP

Hypotheses:
- host 192.168.1.10 may be a Linux server
- port 80 needs web enumeration
- host 192.168.1.15 looks like Windows
- SMB may reveal shares, users, or the domain name
```

This is not an attack yet.

This is terrain reconnaissance.

Without it, the next steps will be chaos.

---

## 5. The first process in a network lab

When you get a task like:

> Scan the network, find the services, and capture the flag.

Do not start with exploits.

Start with a simple process.

---

### Step 1: check where you are

On the attacking machine, check the network interfaces:

```bash
ip a
```

You are looking for:

- your IP address,
- your network mask,
- the subnet you are in,
- the active interface.

Example:

```text
inet 192.168.56.10/24
```

This means that the interesting range is probably:

```text
192.168.56.0/24
```

So the hosts from:

```text
192.168.56.1 to 192.168.56.254
```

---

### Step 2: find alive hosts

Your first scan may look like this:

```bash
nmap -sn 192.168.56.0/24 -oG hosts.gnmap
```

What does this command do?

- `-sn` performs host discovery, meaning it tries to determine which hosts are alive,
- `192.168.56.0/24` scans the whole subnet,
- `-oG hosts.gnmap` saves the result in a format that is easy to parse later.

At this stage, we are not looking for ports yet.

We are looking for the answer to:

> which IP addresses are alive?

---

### Step 3: scan ports

For a small lab, you can start simply:

```bash
nmap -Pn -sV -p- --open 192.168.56.101 -oA nmap-full
```

What does this command do?

- `-Pn` skips host discovery and treats the host as alive,
- `-sV` tries to detect service versions,
- `-p-` scans all TCP ports from 1 to 65535,
- `--open` shows only open ports,
- `-oA nmap-full` saves the results in several formats at once.

This is one of the most important commands at the beginning.

Not because it is magic.

Because it gives you something concrete:

```text
host → port → service → version
```

---

### Step 4: take notes from the results

Do not keep your results only in the terminal.

Write them down.

A minimal table:

| Host           | Port | Service | Version / Banner | Next step                      |
| -------------- | ---: | ------- | ---------------- | ------------------------------ |
| 192.168.56.101 |   22 | SSH     | OpenSSH          | check banner, login methods    |
| 192.168.56.101 |   80 | HTTP    | Apache           | open in browser, fuzzing       |
| 192.168.56.102 |  445 | SMB     | Samba            | enum4linux / smbclient         |
| 192.168.56.103 |   21 | FTP     | vsftpd           | anonymous login, banner, files |

This changes the way you work.

Instead of “I have a lot of Nmap output”, you have an action map.

---

## 6. How to think after finding a port

Every port should trigger one question in your head:

> what service am I dealing with, and how is it normally enumerated?

Example:

### Port 22 — SSH

Questions:

- do I know a username?
- is password login enabled?
- does the banner reveal the version?
- is it an old OpenSSH version?
- do I have a private key found somewhere else?

Basic interaction:

```bash
nc 192.168.56.101 22
```

Or:

```bash
ssh user@192.168.56.101
```

At the beginning, do not brute-force blindly.

First check whether you have any input data: usernames, passwords, keys, files from the web app, backups.

---

### Port 80 / 443 — HTTP / HTTPS

Questions:

- what is on the website?
- are there hidden directories?
- does the application have a login panel?
- are there comments in the HTML?
- are there backup, config, or old files?
- is there a robots.txt file?
- is there a sitemap.xml file?
- are there other virtual hosts?
- does the application reveal its technology?

First steps:

```bash
curl -i http://192.168.56.101/
```

```bash
whatweb http://192.168.56.101/
```

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://192.168.56.101/FUZZ
```

If it is web, do not limit yourself to Nmap.

Open the website in a browser.

Click around.

Look at the requests.

Use Burp.

---

### Port 445 — SMB

Questions:

- is the host Windows?
- can shares be listed anonymously?
- can you see the hostname?
- can you see the domain?
- are there shares with files?
- can you read backups, scripts, or configuration files?

Example first steps:

```bash
smbclient -L //192.168.56.101/ -N
```

```bash
enum4linux-ng 192.168.56.101
```

SMB often does not give you root immediately.

But it may give you something better: information.

Usernames.
Share names.
Configuration files.
Backups.
Passwords stored in scripts.
Paths to other systems.

---

### Port 21 — FTP

Questions:

- does anonymous login work?
- can files be listed?
- can you download anything?
- can you upload anything?
- does the banner reveal the version?

Example:

```bash
ftp 192.168.56.101
```

Try:

```text
anonymous
anonymous
```

If anonymous access works, do not stop at “it works”.

Check:

```bash
ls
pwd
get file_name
```

---

## 7. Service banner — small thing, big value

A banner is information that a service shows when you connect to it.

Example:

```text
SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8
```

Or:

```text
220 vsFTPd 3.0.3
```

A banner can tell you:

- what service is running,
- what version it is,
- what operating system may be underneath,
- whether the technology may be old,
- whether known vulnerabilities are worth checking.

But a banner can also lie.

An administrator can change it.
A proxy can hide something.
A service can look like one thing but behave like another.

That is why we treat the banner as a clue, not as absolute truth.

---

## 8. Scanning larger networks — a simple model

In small labs, Nmap is often enough.

In larger networks, the process may look different:

1. find alive hosts,
2. quickly find open ports,
3. only then collect accurate banners.

Example model:

```bash
nmap -sn 192.168.0.0/16 -oG alive_hosts.gnmap
```

Then extract live hosts into a file:

```bash
grep "Up" alive_hosts.gnmap | awk '{print $2}' > hosts_up.txt
```

Fast port scanning:

```bash
masscan -Pn -iL hosts_up.txt -p- -oX masscan_result.xml --rate=5000
```

And then more detailed enumeration with Nmap.

In practice, the idea is simple:

```text
masscan = quickly find open ports
nmap = identify services more accurately
```

The point is not that you must always use masscan.

The point is to understand that tools have different roles.

---

## 9. Active vs passive reconnaissance

### Active reconnaissance

This is everything where you touch the target directly.

Examples:

```bash
nmap
masscan
ffuf
curl
nc
hydra
nuclei
```

You send packets to the target.

The target may see this in logs.

---

### Passive reconnaissance

This is collecting information without directly scanning the target.

Examples:

- TLS certificate search engines,
- DNS history,
- Shodan,
- Censys,
- SecurityTrails,
- DNSDumpster,
- public repositories,
- leaks,
- subdomains,
- old DNS records.

In real tests, passive reconnaissance is very important because sometimes the client does not give you a ready list of IP addresses.

You need to determine:

- what domains belong to the organization,
- what subdomains exist,
- what IP addresses are associated with the company,
- what is publicly exposed,
- whether old, forgotten systems still exist.

In labs, you usually get a range.

In real life, you often need to build it first.

---

## 10. Web fuzzing as part of infrastructure testing

If you find HTTP or HTTPS during scanning, you enter the area of web security.

But it is still part of an infrastructure pentest because the web service is one element of the host.

Example:

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://192.168.56.101/FUZZ
```

You are looking for things such as:

- hidden directories,
- administration panels,
- backups,
- configuration files,
- API endpoints,
- old application versions,
- paths like `/dev`, `/test`, `/admin`, `/backup`.

A good fuzzing result is not only status `200`.

Also look at:

- response size,
- redirects,
- 401/403 status codes,
- unusual lengths,
- differences between responses,
- directory names,
- technologies revealed in headers.

---

## 11. Interaction with a service matters more than the scan itself

Nmap says:

```text
21/tcp open ftp
```

But this is only the beginning.

Now you need to talk to the service.

For FTP:

```bash
ftp 192.168.56.101
```

For HTTP:

```bash
curl -i http://192.168.56.101/
```

For a raw TCP connection:

```bash
nc 192.168.56.101 1234
```

For TLS:

```bash
ncat --ssl 192.168.56.101 443
```

A scanner gives you a map.

Manual interaction gives you understanding.

And in pentests, very often the person who wins is not the one who ran the most tools, but the one who noticed a small detail in the service response.

---

## 12. Brute-force is not the first step

Hydra, Medusa, and similar tools are useful.

Example for SSH:

```bash
hydra -l user -P passwords.txt ssh://192.168.56.101
```

But brute-force without context is a weak strategy.

Before you start guessing passwords, ask:

- do I have a username list?
- do I have a realistic password list?
- does the application have rate limiting?
- can the account get locked?
- is this a lab where brute-force is the intended goal?
- is there a better path, such as a configuration file, backup, anonymous FTP, or SMB share?

Brute-force is a tool.

Not a plan.

---

## 13. Minimal workflow for your first network tasks

You can use this workflow in simple infrastructure labs.

### 1. Check your network

```bash
ip a
ip route
```

Determine:

```text
my IP:
my subnet:
gateway:
interface:
```

---

### 2. Find hosts

```bash
nmap -sn <range> -oG hosts.gnmap
```

---

### 3. Scan ports

```bash
nmap -Pn -sV -p- --open <host> -oA nmap-full-<host>
```

---

### 4. Build a services table

```text
HOST:
PORT:
SERVICE:
VERSION:
NOTES:
NEXT STEP:
```

---

### 5. Enumerate each service separately

Do not jump around chaotically.

For each port, answer:

```text
What is it?
How do I connect to it?
Are there default credentials?
Can I list resources?
Is the version known?
Does the configuration reveal anything?
Are there files, users, directories, banners, headers?
```

---

### 6. Only then search for vulnerabilities

If you have:

```text
Apache 2.4.x
OpenSSH 8.x
Samba 3.x
vsftpd 2.3.4
Tomcat
Jenkins
Grafana
MongoDB
Redis
```

Then you can start looking for:

- known vulnerabilities,
- default passwords,
- misconfigurations,
- public panels,
- unauthenticated access,
- old versions,
- escalation paths.

---

## 14. What do beginners usually do wrong?

### 1. They scan only the default 1000 ports

By default, Nmap does not scan all ports.

If a service is running on port `31337`, you may not see it.

That is why in labs it is often worth using:

```bash
-p-
```

---

### 2. They do not save results

The terminal disappears.
The history becomes messy.
You no longer know what was tested.

Save output:

```bash
-oA
-oN
-oG
-oX
```

---

### 3. They only look for CVEs

Not every vulnerability has a CVE.

Misconfigurations are often more important than ready-made exploits.

Examples:

- anonymous FTP,
- public SMB share,
- admin panel without a password,
- backup `.zip` file in a web directory,
- Redis without authentication,
- MongoDB exposed to the network,
- old credentials in a configuration file.

---

### 4. They do not understand the service

If you see SMB and do not know what it is, you do not know what to look for.

If you see DNS and do not know what a zone transfer is, you may miss an important lead.

If you see HTTP and do not check directories, you may miss the entire lab.

A tool does not replace protocol understanding.

---

### 5. They do everything at once

A good process is calm:

```text
hosts → ports → services → enumeration → hypotheses → tests → evidence
```

Not:

```text
nmap → exploit-db → random payload → frustration
```

---

## 15. How to take notes during a network pentest

A simple format:

```markdown
## Host: 192.168.56.101

### Open ports

| Port | Service | Version     | Notes                                  |
| ---: | ------- | ----------- | -------------------------------------- |
|   22 | SSH     | OpenSSH 8.4 | password login enabled                 |
|   80 | HTTP    | Apache      | static page, possible /admin directory |
|  445 | SMB     | Samba       | anonymous listing to check             |

### Hypotheses

- HTTP may have hidden directories.
- SMB may reveal files or users.
- SSH will probably be useful only after credentials are found.

### Tests performed

- full TCP Nmap scan
- curl on /
- ffuf with common.txt
- anonymous smbclient check

### Findings

- /backup returns 200
- SMB allows listing the public share
- a configuration file with a password was found in the backup

### Next step

- test the password against SSH for discovered users
```

Notes like this make you think like a pentester, not like an operator of random commands.

---

## 16. Mini-playbook: the first hour in a network lab

```bash
# 1. Where am I?
ip a
ip route

# 2. What network can I scan?
# example: if you have 192.168.56.10/24, scan 192.168.56.0/24

# 3. Host discovery
nmap -sn 192.168.56.0/24 -oG hosts.gnmap

# 4. Extract hosts
grep "Up" hosts.gnmap | awk '{print $2}' > hosts.txt

# 5. Full TCP scan with service versions
nmap -Pn -sV -p- --open -iL hosts.txt -oA nmap-full

# 6. Quick result preview
grep -E "open|Nmap scan report" nmap-full.nmap

# 7. For web
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://TARGET/FUZZ

# 8. For manual interaction
nc TARGET PORT

# 9. For HTTP
curl -i http://TARGET/

# 10. For SMB
smbclient -L //TARGET/ -N
```

This is not a full methodology.

This is the first skeleton.

But this skeleton is enough to start solving many basic tasks.

---

## 17. What should you understand after this introduction?

After this note, you should understand:

- the difference between a host, a port, and a service,
- why network reconnaissance matters,
- why enumeration is more important than random exploits,
- how to find alive hosts,
- how to scan all ports,
- how to collect service banners,
- how to start interacting with discovered services,
- why HTTP, SMB, FTP, and SSH require different enumeration methods,
- how to take simple pentest notes,
- how to build your first workflow for network labs.

The most important sentence to remember:

> In infrastructure pentesting, you build the map first. Only then do you look for a way in.

---

## 18. A mental model for the beginning

When you look at scan results, do not read them as a list of ports.

Read them as a story about the system.

```text
22/tcp open ssh
80/tcp open http
445/tcp open smb
```

This may mean:

```text
I have a machine that probably allows remote login,
exposes a web application,
and shares file resources.
```

Now the question is:

```text
Which of these services can tell me something about the others?
```

Maybe the web app reveals a username.
Maybe SMB reveals a password.
Maybe FTP allows you to download a backup.
Maybe SSH is only the final entry point.
Maybe one small piece of information from a banner connects with another piece of information from the `/backup` directory.

This is what real network security learning looks like.

It is not about one command.

It is about connecting facts.

---

## 19. The next step in learning

If you are just starting, do not try to learn everything at once: Active Directory, pivoting, Kerberoasting, tunneling, exploit development, and red teaming.

Start with the foundation:

1. Learn how to read the output of `ip a`.
2. Learn what `/24`, `/16`, and `/32` subnets mean.
3. Learn how to perform host discovery.
4. Learn how to scan all ports.
5. Learn how to recognize basic services.
6. Learn how to connect to services manually.
7. Learn how to take notes.
8. Learn to ask: “what can this service tell me?”

Only then does exploitation start to make sense.

Because exploitation without enumeration is guessing.

And enumeration is the foundation that the entire infrastructure pentest stands on.

```

```
