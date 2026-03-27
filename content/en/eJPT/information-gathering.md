---
id: information-gathering
title: "Information Gathering - a complete practitioner's guide"
team: red
category: eJPT
tags: ["recon", "passive", "active", "nmap", "dns", "osint", "whois", "subdomain", "ejpt"]
difficulty: easy
shortDescription: "A comprehensive guide to information gathering in the context of penetration testing and preparation for the eJPT, covering passive and active reconnaissance methods, analysis of OSINT sources, DNS, subdomains, and technologies, as well as active scanning and target profiling techniques that form the basis for further enumeration."
updatedAt: "2025-03-06"
---

> All materials included here are only part of study notes. They are not intended to be used against production environments without authorization.

# Information Gathering - a complete practitioner's guide

## Why this note exists in the first place

Recon is the one phase in pentesting where rushing directly punishes you. Every hour
you cut here comes back later - either you shoot at the wrong hosts, miss part of the attack
surface that was visible from the start, or go out of scope and create a legal problem.

This note is a complete working material - from the concept itself, through passive OSINT,
through DNS, all the way to active scanning. It is structured so you can go through it
step by step during a real engagement, or return to a specific section when
you get stuck on a tool.

---

## Fundamentals - how to structure this in your head

### Two modes of operation

All information gathering comes down to one question: **do your packets
reach the target infrastructure or not.**

**Passive recon** - you work with data that already exists somewhere on the public internet.
WHOIS, DNS queried through a public resolver, Google results, crt.sh, theHarvester -
none of these queries land in the client's server logs. You can do this without
authorization and without risk of detection, because you are invisible to the target.

**Active recon** - you send something directly to the target infrastructure. Nmap queries
their servers. A zone transfer hits their nameserver. Your IP appears in the logs.
Here, **authorization is mandatory** - not as a checkbox, but because without it
this is not a pentest, it is a crime.

The line between them is sometimes blurry. Visiting the client's website in a browser
just to read `robots.txt` is technically contact with their server - your browser
sent a request and got a response. In practice, nobody treats it that way, but
it is worth knowing where the line actually is.

**The order is always the same:** passive first, active second. Never the other way around.
Passive recon gives you a map of the terrain - IPs, nameservers, subdomains, technologies -
before you send the first packet. Jumping in with Nmap against a network you know
nothing about is just shooting blind.

---

### Target scoping - before you launch anything

Scoping is not a formality. It is the answer to one question: **what exactly am I allowed to test.**

In practice, the scope is defined by the client or the CTF organizer. It can be:

- **Domain-based** - `company.com` and all subdomains. Watch out: subdomains can live
  at different providers. `mail.company.com` may be Google Workspace. `crm.company.com`
  may be Salesforce. Both are out of scope unless they were explicitly included.

- **IP-based** - a specific address or CIDR range, for example `10.10.10.0/24`.
  Here the risk is different - you can hit hosts that are in the client's network,
  but do not actually belong to them (cloud environments, shared hosting).

- **Application scope** - only a specific web application or API endpoint.
  In that case, recon focuses only on it - not the whole server,
  not the whole domain.

**Out-of-scope is not a suggestion.** Third-party services, a CDN that does not belong to the client,
systems of other organizations in the same IP space - touching them without authorization
is your problem, not the client's.

The worst mistake you can make at the beginning: assume that "the subdomain surely
belongs to the client" or "the IP in the same range is probably in scope." Always verify.

---

## Passive recon - the full map of sources

### Website recon and footprinting - what you can read from a site

Website footprinting is not "just browse around a bit." It is systematic reading
of everything the server tells you - often more than it intended to.

**What you collect at this stage:**

- IP addresses (from HTTP headers, page source, errors)
- Paths hidden from search engines (`robots.txt`)
- Names of people from the "About us" section, blog authors, contact pages
- Email addresses - directly from the site or from document metadata
- Phone numbers and physical addresses (useful for social engineering)
- Technologies - CMS, framework, web server, language, versions

**`robots.txt` is a map of hidden paths.** The site owner put them there precisely
because they did not want Google to index them. That does not make them inaccessible -
quite the opposite, you now have a list of places worth checking.

```

[https://target.com/robots.txt](https://target.com/robots.txt)

# Example of what you may find:

User-agent: \*
Disallow: /admin/
Disallow: /backup/
Disallow: /internal/
Disallow: /.git/

```

Each of these paths is a potential next step. `/backup/` with directory listing
is a very different conversation than `/admin/` behind authentication - but both are worth checking.

**`sitemap.xml`** is less interesting from an offensive perspective, but it gives
a complete map of the site's public resources. On large services, it may reveal
subsections that are not linked from the main navigation.

```

[https://target.com/sitemap.xml](https://target.com/sitemap.xml)
[https://target.com/sitemap_index.xml](https://target.com/sitemap_index.xml)

```

**HTTP headers** say quite a lot. `Server: Apache/2.4.49` is already information.
`X-Powered-By: PHP/7.4.3` is even better. `X-Generator: WordPress 5.9` is
a direct entry point into the CVE database.

```bash
curl -I https://target.com
# or in a more readable form:
curl -sI https://target.com | grep -i 'server\|x-powered\|x-generator\|content-type'
```

**WhatWeb** - a CLI tool that does the same kind of fingerprinting as Wappalyzer in the browser,
but can be scripted and has different aggression levels:

```bash
# Basic (passive - does not generate much traffic):
whatweb https://target.com

# Aggressive (more requests, more data):
whatweb -a 3 https://target.com

# With logging to a file:
whatweb https://target.com -v --log-json=footprint.json
```

Level 3 (`-a 3`) sends more requests - technically it is already more active.
If you care about staying quiet during passive recon, stick to level 1.

---

### WHOIS - more than owner details

WHOIS is a query to the registration database for a domain or IP block. It is the first
place I look at when I see a new domain - not because it always gives concrete owner data,
but because **nameservers are always there.**

```bash
whois company.com
whois 93.184.216.34    # for IP
```

**What I look at:**

- **Name Server** - these are the hosts you will soon query for a zone transfer.
  Extract them and save them immediately.
- **Registrant Email** - if there is no WHOIS privacy, you have an address worth checking
  in breach databases. Even if there is privacy, an old email may leak
  through historical records.
- **Creation Date** - an old domain (10+ years) often means old infrastructure.
  Old infrastructure often means old, unpatched software.
- **Registrar** - tells you who manages the domain. For domain takeover-style issues,
  this matters.

```
# Example of output fragment - what I extract:

Domain Name: COMPANY.COM
Name Server: NS1.COMPANY.COM          ← I write this down, I will try AXFR
Name Server: NS2.COMPANY.COM          ← same here
Registrant Email: admin@company.com   ← I check HIBP, theHarvester
Creation Date: 2009-03-14T00:00:00Z   ← old infrastructure, worth checking older CVEs
Registry Expiry Date: 2025-03-14      ← expires soon, possible neglect
```

With IP-based WHOIS you get the owner of the IP block - useful when you want to know
whether a given range really belongs to the client or is just hosting/cloud infrastructure.

---

### DNS recon - layer by layer

DNS is not just "a tool for turning domains into IPs." For a pentester it is **an information layer
about the target's infrastructure.** Every record type says something different about how
the company is built.

#### DNS records - what each one means in practice

**A / AAAA record**
Maps a domain to IPv4 (A) or IPv6 (AAAA). The foundation - it gives you a direct
server address. Before you get too excited: if the company sits behind Cloudflare
or another CDN, you get the CDN edge node's IP, not the application server's IP.

```bash
host company.com
dig company.com A
```

**NS record**
The domain's nameservers. Every NS is a potential zone transfer target. Always note them all.

```bash
host -t ns company.com
dig company.com NS
```

**MX record**
Mail Exchange - the mail server. Two things matter here: the mail server address
(target for email spoofing tests, brute force, phishing) and the **vendor**
(Google Workspace, Microsoft 365, self-hosted mail - each means a different attack surface).

```bash
host -t mx company.com
dig company.com MX
```

**TXT record**
Text record. At first glance boring. In practice it often reveals:

- SPF (`v=spf1 include:sendgrid.net include:amazonses.com ~all`) - a list of authorized
  mail servers, often revealing which vendors the company uses
- DKIM - keys for verifying signed emails
- DMARC - policy for handling suspicious emails
- Verification tokens for Google Search Console, Atlassian, and other SaaS platforms

```bash
host -t txt company.com
dig company.com TXT
```

**CNAME record**
Alias - one domain points to another domain. Interesting for several reasons:

- `www.company.com` → `company.com.cdn77.net` - there is a CDN, the real IP is hidden
- `blog.company.com` → `company.ghost.io` - blog hosted on an external service
- `app.company.com` → `company.herokuapp.com` - if someone removed the app from Heroku
  but left the CNAME record in place, you may be able to register the same name on Heroku
  and take over the subdomain (subdomain takeover)

```bash
dig www.company.com CNAME
```

**SOA record**
Start of Authority - contains information about the DNS zone. Less interesting,
but the admin email is stored there in the form `admin.company.com`,
which maps to `admin@company.com`.

```bash
dig company.com SOA
```

**PTR record**
Reverse DNS - IP to domain. Useful when you have an IP and want to know how
the host is named. I use it when analyzing an IP range to see which hosts
have reverse DNS configured (which suggests they are actively managed).

```bash
dig -x 93.184.216.34
host 93.184.216.34
```

**SRV record**
Service records - they describe what services are available and on which ports.
Rarely used, but when present they tell you directly: "LDAP is here", "SIP is here", "XMPP is here".

```bash
dig _ldap._tcp.company.com SRV
dig _sip._tcp.company.com SRV
```

#### Tools for DNS recon

**`host`** - fast and clear, good for one-off queries:

```bash
host company.com                  # A record
host -t mx company.com            # MX
host -t ns company.com            # NS
host -t txt company.com           # TXT
host -t any company.com           # everything (does not always work with modern resolvers)
```

**`dig`** - more detailed output, better for scripting:

```bash
dig company.com                   # A
dig company.com MX                # MX
dig company.com ANY               # everything
dig @8.8.8.8 company.com          # through a specific resolver
dig +short company.com            # result only, no noise
```

**`dnsrecon`** - a more complete tool that can do several things at once:

```bash
dnsrecon -d company.com                              # standard enum
dnsrecon -d company.com -t std                       # explicitly standard mode
dnsrecon -d company.com -t brt -D /usr/share/wordlists/dnsmap.txt  # brute force subdomains
dnsrecon -d company.com -t axfr                      # zone transfer attempt
```

---

### Netcraft - infrastructure history

Netcraft has been scanning the internet since the 1990s and stores historical website data.
For a pentester, the most valuable part is **Hosting History** - the list of previous IP addresses.

Companies often migrate to Cloudflare to hide the real server IP behind a CDN.
But if for years they were hosted directly on an exposed IP, Netcraft remembers it.
That old IP may still point directly to the application server,
bypassing WAF and Cloudflare geoblocking.

```
https://sitereport.netcraft.com/?url=https://company.com
```

**What I extract from a Netcraft report:**

- **Network** - current IP, ASN, country, provider
- **Hosting History** - old IPs (I check whether they are still active)
- **Web Technologies** - web server version, CMS, language, framework
- **SSL Certificate** - who issued it and for which domains (SAN may reveal subdomains)
- **Nameservers** - historical NS records (again: history is valuable)

The SSL certificate itself is another angle. In the **Subject Alternative Names** section
you often find other domains and subdomains belonging to the same organization.
Netcraft shows it, and crt.sh shows it even more broadly.

---

### WAF detection - before you start making noise

A WAF (Web Application Firewall) filters traffic to a web application. Detecting it
before active scanning is not a formality - it changes the strategy.

Cloudflare will block your Nmap before it gathers anything useful.
ModSecurity will block SQL injection payloads. Imperva can ban your IP
after just a few suspicious requests.

```bash
wafw00f https://company.com

# Check all possible WAFs (more requests):
wafw00f -a https://company.com
```

Popular WAFs and what they change:

- **Cloudflare** - the IP is hidden, check Netcraft and Shodan for historical IPs
- **AWS WAF** - infrastructure is probably on AWS, check S3 buckets
  and CloudFront distributions
- **ModSecurity** - open source and configurable, check whether it uses OWASP CRS rules
- **Imperva (Incapsula)** - enterprise-grade, aggressive, harder to bypass
- **No WAF** - scan more freely, but still be careful with noisy NSE scripts

---

### Subdomains - where the real attack surface usually is

The main domain is usually the best secured part of the infrastructure.
`dev.company.com`, `staging.company.com`, `old-api.company.com`, `vpn.company.com` -
this is where old app versions, forgotten admin panels, environments without WAF,
and services that "have been running for years and nobody touched them" tend to live.

**Sublist3r** - aggregates results from search engines and other public sources:

```bash
python sublist3r.py -d company.com

# With brute force (slower, but detects subdomains not indexed by search engines):
python sublist3r.py -d company.com -b

# With output to a file:
python sublist3r.py -d company.com -o subdomains.txt

# Through specific engines:
python sublist3r.py -d company.com -e google,bing,crtsh
```

**crt.sh - Certificate Transparency Logs** - this is often more effective than Sublist3r.

Every SSL certificate is publicly logged in Certificate Transparency Logs.
Every subdomain that ever got a certificate - is there. Even if
the subdomain no longer exists in DNS, the record in crt.sh stays.

```bash
curl -s 'https://crt.sh/?q=%.company.com&output=json' \
  | jq -r '.[].name_value' \
  | sort -u \
  | grep -v '^*\.'
```

**amass** - the most advanced tool, using many passive sources
and optionally active techniques:

```bash
# Passive only:
amass enum -d company.com

# Passive + active (DNS brute force, zone transfer, permutations):
amass enum -active -d company.com

# With more sources (requires API key configuration):
amass enum -config ~/.config/amass/config.ini -d company.com
```

**knockpy** - fast DNS brute force for subdomains:

```bash
knockpy company.com
knockpy company.com -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt
```

**What to do with the collected subdomain list:**

Do not stop at the list itself. Every subdomain is potentially a different server,
different technology, different attack surface. Run `dig` or `host` against each one -
check the IP, whether it is CDN-backed or a direct server, and whether it is publicly reachable.

```bash
# Quick validation of all subdomains from a file:
while read sub; do
  echo -n "$sub: "
  dig +short $sub | head -1
done < subdomains.txt
```

---

### Google Dorks - what Google indexed without asking

Google Dorking is not "hacking through Google." It is precise querying that pulls
from Google's index what the site owner would rather not have exposed there.

You do not touch the target server - you read what Google has already collected.
Pure passive recon.

#### Operators - the ones I actually use

**`site:`** - limit results to a specific domain

```
site:company.com
site:company.com -www    # without the main domain, only subdomains
```

**`intitle:`** - search in the page title

```
intitle:"index of" site:company.com    # directory listing
intitle:"phpMyAdmin" site:company.com
intitle:"dashboard" site:company.com
```

**`inurl:`** - search in the URL

```
inurl:admin site:company.com
inurl:login site:company.com
inurl:wp-admin site:company.com
inurl:.git site:company.com
inurl:api site:company.com
```

**`filetype:` / `ext:`** - specific file type

```
site:company.com filetype:pdf     # documents - may contain metadata
site:company.com filetype:env     # config files
site:company.com filetype:log     # logs
site:company.com ext:sql          # database dumps
site:company.com ext:bak          # backups
site:company.com ext:conf         # configuration files
site:company.com ext:xml intext:password
```

**`intext:`** - search in the page body

```
site:company.com intext:"password"
site:company.com intext:"BEGIN RSA PRIVATE KEY"
site:company.com intext:"DB_PASSWORD"
```

#### Practical starter set for a new target

```
site:company.com filetype:env OR filetype:log OR ext:sql OR ext:bak
site:company.com intitle:"index of" "parent directory"
site:company.com inurl:admin OR inurl:login OR inurl:dashboard
site:company.com inurl:.git
site:company.com intext:"DB_PASSWORD" OR intext:"API_KEY" OR intext:"SECRET_KEY"
site:linkedin.com "company.com" "developer" OR "engineer" OR "administrator"
```

That last dork is gold when building an employee list. LinkedIn cannot really
be searched through the API without an account, but Google indexes public profiles.

**Where to look for more dorks:**
Google Hacking Database on exploit-db.com -
[exploit-db.com/google-hacking-database](https://www.exploit-db.com/google-hacking-database)
Hundreds of ready-made queries grouped by category.

---

### theHarvester - emails, subdomains, and IPs from one place

theHarvester queries many public sources at once: search engines, DNS databases,
certificate repositories, LinkedIn, GitHub. It gathers email addresses, subdomains,
and IP addresses.

```bash
# Basic using Google:
theHarvester -d company.com -b google

# Using all available sources:
theHarvester -d company.com -b all

# Limit number of results (useful when the data set is large):
theHarvester -d company.com -b google -l 500

# Save to HTML and XML:
theHarvester -d company.com -b all -f company_results
```

Typical output looks like this:

```
[*] Emails found:
jan.kowalski@company.com
anna.nowak@company.com
it@company.com
admin@company.com

[*] Hosts found:
mail.company.com: 93.184.216.10
vpn.company.com: 185.220.101.12
dev.company.com: 10.0.0.20

[*] IPs found:
93.184.216.10
185.220.101.12
```

**The value of emails is bigger than it seems.** Two emails are enough to identify
the company's naming pattern. `jan.kowalski@company.com` and `a.nowak@company.com`
show two different formats - one uses full first name, the other uses an initial.
Check which one is more typical and generate likely addresses for people found on LinkedIn.

Email pattern + employee list from LinkedIn = a list of potential targets for:
credential stuffing, password spraying, spear phishing.

---

### Leaked password databases - what to do with breaches

Breached password databases are not only material for login attempts. In the context
of pentesting, they are **intelligence about employees' security habits.**

If an employee's email appears in 10 breaches with different passwords, you know that:

- the person has a long history of using that email to register in different services
- they may be reusing the same password or variants of it
- with the right scope permissions, known credentials can be tested

**Have I Been Pwned** - [haveibeenpwned.com](https://haveibeenpwned.com)

Checks whether an email address appeared in known breaches. Free for single
addresses. API requires a key.

```bash
# API check (requires a key):
curl -s 'https://haveibeenpwned.com/api/v3/breachedaccount/jan.kowalski@company.com' \
  -H 'hibp-api-key: YOUR_API_KEY' \
  -H 'User-Agent: Field-Manual-Research'
```

**DeHashed** - [dehashed.com](https://dehashed.com)

A paid service but more extensive - searches by email, domain, IP, username,
password. In authorized tests you can check the entire domain:

```bash
# Through the API:
curl 'https://api.dehashed.com/search?query=email:@company.com' \
  -u "your@email.com:API_KEY" \
  -H 'Accept: application/json'
```

**breach-parse** - a local tool for searching your own breach data copies:

```bash
breach-parse @company.com ~/breach_results
# Generates:
# breach_results_emailpass.txt  - email:password
# breach_results_userpass.txt   - user:password
```

**What you do with this data in a pentest context:**

Passwords from breaches should only be tested if the scope explicitly allows it.
The most common use is to show the client that their employees use leaked credentials -
and that they should implement breach monitoring
(for example HIBP Notifications) and a mandatory password reset policy after detection.

---

## DNS Zone Transfer - when the server says too much

### How it works

DNS Zone Transfer (AXFR) is a synchronization mechanism between primary
and secondary DNS servers. The primary has all records. The secondary pulls
a copy so it can answer queries when the primary is unavailable.

In a proper configuration, that transfer is restricted only to known
secondary server IP addresses. In a bad configuration - the server answers
AXFR requests from anyone.

The result: you get a **full list of all DNS hosts and records in the domain.**
Not just the ones visible through normal queries - literally everything
the administrator configured. Internal hosts, backup servers, dev environments,
hosts on private IP ranges.

This is not a vulnerability in the DNS protocol. It is a misconfiguration.
But it still appears surprisingly often in older infrastructure.

### How to do it step by step

```bash
# Step 1: find the domain's nameservers
host -t ns company.com
# Output:
# company.com name server ns1.company.com.
# company.com name server ns2.company.com.

# Step 2: try a zone transfer against every NS
host -t axfr company.com ns1.company.com
host -t axfr company.com ns2.company.com

# Same with dig:
dig axfr @ns1.company.com company.com
dig axfr @ns2.company.com company.com

# Same with dnsrecon (automatically tries all NS):
dnsrecon -d company.com -t axfr
```

**If the server is vulnerable** - you will get something like this:

```
company.com.           86400  IN  SOA   ns1.company.com. admin.company.com. ...
company.com.           86400  IN  NS    ns1.company.com.
company.com.           86400  IN  NS    ns2.company.com.
company.com.           86400  IN  A     93.184.216.34
www.company.com.       86400  IN  A     93.184.216.34
mail.company.com.      86400  IN  A     93.184.216.10
vpn.company.com.       86400  IN  A     185.220.101.1    ← VPN endpoint
dev.company.com.       86400  IN  A     10.0.0.20        ← internal host!
backup.company.com.    86400  IN  A     10.0.0.30        ← backup server!
legacy.company.com.    86400  IN  A     93.184.216.50    ← "legacy" is always interesting
db.company.com.        86400  IN  A     192.168.1.100    ← database on internal IP
```

**If the server is correctly configured:**

```
Transfer failed. Broken pipe
# or:
; Transfer failed. (REFUSED)
# or:
AXFR record query failed: REFUSED
```

REFUSED is not an error. It means the admin knows what they are doing.

### Practice on a legal target

`zonetransfer.me` is a domain created specifically for practicing zone transfer.
Intentionally vulnerable, legal, always available:

```bash
# Find the NS:
host -t ns zonetransfer.me

# Perform AXFR:
dig axfr @nsztm1.digi.ninja zonetransfer.me
host -t axfr zonetransfer.me nsztm1.digi.ninja
```

It returns around 30 records. Good material for learning what a successful transfer
looks like and how to parse it afterward.

---

## Active recon with Nmap - from zero to a full profile

### How Nmap really works

Nmap is not "a port scanning tool." It is an engine for constructing packets,
sending them to targets, and interpreting the responses. Understanding
that mechanism matters, because then you understand **why** certain scans
behave the way they do and what unfamiliar results actually mean.

A TCP port scan in the basic sense: you send SYN, then look at what comes back:

- **SYN-ACK** → the port is `open` (a service is listening and accepted the connection)
- **RST** → the port is `closed` (the host is alive, the port is reachable, but no service is listening)
- **nothing / ICMP unreachable** → the port is `filtered` (something blocks the packets)

That is the foundation. All Nmap flags are just modifications of this process.

### Step 1: host discovery

Before scanning ports, you want to know what is alive in the network. Querying dead
hosts wastes time and creates unnecessary noise.

```bash
# Ping scan - only detect live hosts, do not scan ports:
nmap -sn 192.168.1.0/24

# What -sn sends:
# - ICMP Echo Request (classic ping)
# - TCP SYN to port 443
# - TCP ACK to port 80
# - ICMP Timestamp Request
```

Typical output:

```
Nmap scan report for 192.168.1.1
Host is up (0.0015s latency).

Nmap scan report for 192.168.1.10
Host is up (0.0022s latency).

Nmap scan report for 192.168.1.50
Host is up (0.0089s latency).

Nmap done: 254 IP addresses (3 hosts up) scanned in 2.45 seconds
```

**If ICMP is blocked** - typical in production environments where admins
block ping by default - use `-Pn`:

```bash
# Treat all hosts as alive and immediately scan ports:
nmap -Pn 192.168.1.0/24
```

Warning: `-Pn` is slower on network scans because it scans ports even on
dead hosts. On small ranges (a few hosts) use it freely.
On a `/24` with `-Pn`, expect to wait.

**Extract the live host list into a file:**

```bash
nmap -sn 192.168.1.0/24 -oG - | grep "Up" | awk '{print $2}' > live_hosts.txt
```

### Step 2: port scan types

**SYN scan (`-sS`) - default for root**

Sends SYN, and after SYN-ACK responds with RST (does not complete the handshake).
Fast and less visible in application logs because the connection is not fully established.
Network IDS and SIEM will still see it. Requires root privileges.

```bash
sudo nmap -sS 192.168.1.10
```

**Connect scan (`-sT`) - for non-root**

Full TCP handshake. The connection is logged by the application.
Slower than a SYN scan. Does not require root.

```bash
nmap -sT 192.168.1.10
```

**UDP scan (`-sU`)**

Ignored by most people. That is a mistake. DNS (53), SNMP (161), DHCP (67/68),
TFTP (69), NFS (2049) - these are UDP services. SNMP without proper authentication
can give you a full system information dump. DNS on UDP is part of the path toward zone transfer.

```bash
sudo nmap -sU --top-ports 25 192.168.1.10
```

UDP is slow because the kernel waits for ICMP port unreachable before marking a port
as `closed`. Open ports often do not respond - that is why you get `open|filtered` in the output.

**ACK scan (`-sA`) - firewall mapping**

It does not detect open ports in the service sense. It sends ACK and checks whether it gets
RST back (`unfiltered`) or nothing (`filtered`). Used for mapping firewall rules.

### Step 3: version detection and OS detection

```bash
nmap -sV 192.168.1.10
```

`-sV` is the moment when "open port" becomes "potentially vulnerable service version."

```
PORT     STATE  SERVICE  VERSION
22/tcp   open   ssh      OpenSSH 7.4 (protocol 2.0)
80/tcp   open   http     Apache httpd 2.4.49
443/tcp  open   ssl/http Apache httpd 2.4.49
3306/tcp open   mysql    MySQL 5.7.36
```

`Apache 2.4.49` - that is CVE-2021-41773, path traversal to remote code execution.
`OpenSSH 7.4` - check the CVE database for that branch.
`MySQL` publicly exposed - probably a configuration problem, check access.

A version number is your gateway into Searchsploit, MITRE CVE, and Exploit-DB.

```bash
searchsploit apache 2.4.49
searchsploit openssh 7.4
```

**OS detection:**

```bash
sudo nmap -O 192.168.1.10
```

Nmap analyzes characteristic elements of TCP/IP responses to guess the OS.
It is not always right, but in around 80% of cases the result is useful.

### Step 4: NSE - scripts that write part of the report for you

NSE (Nmap Scripting Engine) is a framework for writing Lua scripts that extend
Nmap with advanced detection, enumeration, and vulnerability checks.

The scripts are in `/usr/share/nmap/scripts/`. There are hundreds of them.

**Default scripts (`-sC`) - safe, information gathering:**

```bash
nmap -sC 192.168.1.10
```

Runs scripts from the `default` category. Safe means: they do not exploit, do not brute force,
they just gather information. Typical results:

```
| http-title: Company XYZ - Management Panel
| ssh-hostkey:
|   2048 aa:bb:cc:dd... (RSA)
| ssl-cert: Subject: commonName=company.com
|   SANs: company.com, www.company.com, api.company.com    ← additional subdomains!
```

**Specific scripts by scenario:**

```bash
# SMB - check EternalBlue (MS17-010):
nmap --script=smb-vuln-ms17-010 192.168.1.10

# SMB - enumerate shares, users, policies:
nmap --script=smb-enum-shares,smb-enum-users 192.168.1.10

# FTP - anonymous login:
nmap --script=ftp-anon 192.168.1.10

# HTTP - title, methods, potential paths:
nmap --script=http-title,http-methods,http-enum 192.168.1.10

# SSH - supported algorithms:
nmap --script=ssh2-enum-algos 192.168.1.10

# MySQL - info without authentication:
nmap --script=mysql-info 192.168.1.10

# Full vulnerability scan (noisy, may trigger IDS):
nmap --script=vuln 192.168.1.10
```

Finding scripts:

```bash
ls /usr/share/nmap/scripts/ | grep smb
ls /usr/share/nmap/scripts/ | grep http
nmap --script-help="smb-vuln-*"
```

### Port states - what they actually mean

| State            | Meaning                                       | What to do with it                                     |
| ---------------- | --------------------------------------------- | ------------------------------------------------------ |
| `open`           | A service is listening, connection possible   | Go deeper - enumerate the service, check the version   |
| `closed`         | Host is alive, port reachable, no service     | Confirms the host exists; the port may open later      |
| `filtered`       | Firewall/filter blocks packets, state unknown | A firewall is active; something is probably there      |
| `open\|filtered` | Cannot tell whether open or filtered          | Typical for UDP - service may not answer empty packets |
| `unfiltered`     | Port reachable, state still unknown (ACK)     | Used during firewall mapping                           |

### Port selection - when to scan what

```bash
# Default: top 1000 TCP ports
nmap 192.168.1.10

# Specific ports:
nmap -p 80,443,8080,8443 192.168.1.10

# Range:
nmap -p 1-65535 192.168.1.10
# Shortcut:
nmap -p- 192.168.1.10

# Top N:
nmap --top-ports 100 192.168.1.10
nmap --top-ports 1000 192.168.1.10
```

**When to use `-p-`:** when the standard top 1000 gives little or nothing interesting.
Admin services, alternative HTTP ports, management panels often sit on non-standard
ports: 8080, 8443, 8888, 9090, 9200, 3000, 5000, 9000.

### Scan speed (`-T`)

| Flag  | Name       | When I use it                              |
| ----- | ---------- | ------------------------------------------ |
| `-T0` | Paranoid   | Maximum stealth, 5 minutes between packets |
| `-T1` | Sneaky     | Avoiding IDS, very slow                    |
| `-T2` | Polite     | Minimal network load                       |
| `-T3` | Normal     | Default                                    |
| `-T4` | Aggressive | CTF, labs, fast networks                   |
| `-T5` | Insane     | Local only, risk of missing results        |

In production engagements: `-T2` or `-T3`.
In CTF and eJPT labs: `-T4`.

### Saving results - always

```bash
# Three formats at once:
nmap -sV -sC -O 192.168.1.10 -oA scan_name

# Generates:
# scan_name.nmap   - human-readable output
# scan_name.xml    - XML (for import into Metasploit, Faraday, etc.)
# scan_name.gnmap  - grep-able (easy to parse with scripts)
```

After a session it is hard to reconstruct what exactly you saw. `-oA` is free
and takes one second. Always use it.

### Golden commands - what I use most often

```bash
# ── STAGE 1: What is alive in the network ───────────────
nmap -sn 192.168.1.0/24

# ── STAGE 2: Quick profile of a single host ─────────────
nmap -sV -sC -O -T4 192.168.1.10 -oA quick_scan

# ── STAGE 3: Full scan (all ports) ──────────────────────
nmap -p- -sV -T4 192.168.1.10 -oA full_scan

# ── STAGE 4: Targeted NSE based on results ──────────────
nmap --script=smb-vuln-ms17-010,smb-enum-shares -p 445 192.168.1.10
nmap --script=http-enum,http-title -p 80,443,8080 192.168.1.10

# ── AGGRESSIVE (everything at once, noisy) ──────────────
nmap -A -T4 192.168.1.10 -oA aggressive_scan
# -A = -sV -sC -O --traceroute
```

---

## Ports I always check - what I care about on each of them

This is not just "a list of ports to memorize." It is a list of questions
I ask myself when I see a specific port.

**21 - FTP**
Anonymous login? `nmap --script=ftp-anon`. What version? Check CVEs.
vsFTPd 2.3.4 has a backdoor. ProFTPD 1.3.3c also has a history.

**22 - SSH**
OpenSSH version → CVE lookup. Does it accept password authentication or only keys?
`ssh -o PreferredAuthentications=password user@host`. Which algorithms does it support?
Old ones (arcfour, 3des) suggest old infrastructure.

**23 - Telnet**
Unencrypted. If active - it is almost certainly a legacy device.
Sniff it (`tcpdump -i eth0 port 23`) or brute force it.

**25 - SMTP**
User enumeration with `VRFY` and `EXPN` if the server allows it.
`nmap --script=smtp-enum-users`. Check open relay behavior.

**53 - DNS**
UDP: normal queries. Zone transfer (AXFR) goes over TCP.
Always try zone transfer if you see port 53/TCP open.

**80/443 - HTTP/HTTPS**
Entry point into web app testing. After Nmap: gobuster/feroxbuster,
nikto, check robots.txt, sitemap, headers.

**139/445 - SMB/NetBIOS**
`smb-vuln-ms17-010` - EternalBlue. `smb-enum-shares` - what is exposed.
Null session? Check if login without a password is possible.
This is often the fastest road into Windows.

**3306 - MySQL**
A publicly exposed MySQL service is almost always a misconfiguration.
Check anonymous login, try brute forcing root, check the version for CVEs.

**3389 - RDP**
Windows Remote Desktop. BlueKeep (CVE-2019-0708) on older Windows versions.
Brute force is possible but noisy. Check whether Network Level Authentication is enabled.

**5900 - VNC**
Often weak or no password. `nmap --script=vnc-info,vnc-brute`.

**6379 - Redis**
Often exposed without authentication. Direct access to the full database.
In some configurations it leads to RCE through manipulation of `cron`
or `~/.ssh/authorized_keys`.

**8080/8443 - Alternative HTTP**
Often a management panel, Tomcat Manager, Jenkins, Grafana, or other tools.
Check default credentials for the technology you identify.

**27017 - MongoDB**
Often without authentication in older deployments. If it is publicly open,
you probably have access to the whole database.

---

## Where things most often get missed

**Scanning only the top 1000 ports.** Important services live on non-standard
ports. Jenkins admin panel on 8080. Grafana on 3000. Elasticsearch on 9200.
If the standard scan gives little - run `nmap -p-` and do not regret the time.

**Skipping UDP.** SNMP (161) without proper community strings can reveal the full router state.
DNS on UDP (53) is part of the path toward a zone transfer on TCP. NFS (2049) may expose
shares without authentication.

**Not trying zone transfer.** Every time I find a nameserver, I try AXFR.
Most will answer REFUSED. But once in a while you hit a misconfigured one
and suddenly get a complete infrastructure map.

**Ignoring SSL certificates.** SANs (Subject Alternative Names) in a certificate
often contain subdomains you did not find anywhere else.
`nmap -sC` will print them automatically in the `ssl-cert` section.

**Not using `-oA`.** After four hours you do not remember what was where. XML output
imports into Metasploit, CherryTree, Faraday. Greppable output lets you quickly
extract only open ports. Always save your scans.

**Assuming CDN = real IP.** Cloudflare, Akamai, Fastly hide
the real IP. Check Netcraft history, Shodan, and subdomains without CDN
(for example `mail.company.com` often points directly to a server).

**Skipping passive before active.** You jump in with Nmap without knowing the company
has a WAF that bans IPs after 10 requests. Or that the subdomain you want
to scan sits behind Cloudflare and your scans are effectively useless.

---

## Complete workflow - from a blank page to a target map

```
┌─────────────────────────────────────────┐
│  1. DEFINE SCOPE                        │
│     What is in scope?                   │
│     What is out of scope?               │
│     Authorization for active methods?   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. PASSIVE RECON                       │
│                                         │
│  whois company.com                      │
│    └─ save NS, emails, dates            │
│                                         │
│  dnsrecon -d company.com -t std         │
│    └─ save A, MX, NS, TXT, CNAME        │
│                                         │
│  sublist3r / amass / crt.sh             │
│    └─ save subdomains                   │
│                                         │
│  whatweb / Netcraft                     │
│    └─ technologies, hosting history     │
│                                         │
│  curl robots.txt / sitemap.xml          │
│    └─ hidden paths                      │
│                                         │
│  wafw00f                                │
│    └─ is there a WAF and which one      │
│                                         │
│  theHarvester -b all                    │
│    └─ emails, additional subdomains     │
│                                         │
│  Google Dorks                           │
│    └─ files, panels, directory listing  │
│                                         │
│  HIBP / DeHashed                        │
│    └─ whether emails appeared in breaches│
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. ACTIVE RECON                        │
│                                         │
│  nmap -sn 192.168.1.0/24                │
│    └─ which hosts are alive             │
│                                         │
│  nmap -sV -sC -O -T4 <live_hosts>       │
│    └─ service versions, OS, default NSE │
│                                         │
│  nmap -p- <hosts with few ports>        │
│    └─ non-standard ports                │
│                                         │
│  host -t axfr company.com <each NS>     │
│    └─ zone transfer                     │
│                                         │
│  Targeted NSE scripts                   │
│    └─ based on discovered ports         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  4. DOCUMENT & ORGANIZE                 │
│     Subdomain list with IPs             │
│     Live host map                       │
│     Ports and service versions          │
│     Technologies and potential CVEs     │
│     Emails and naming scheme            │
│     → Move into enumeration             │
└─────────────────────────────────────────┘
```

---

## Cheat sheet - what I keep at hand while working

```bash
# ── WHOIS ────────────────────────────────────────────────
whois company.com
whois 93.184.216.34

# ── DNS ──────────────────────────────────────────────────
dig company.com ANY
host -t mx company.com
host -t ns company.com
host -t txt company.com
dnsrecon -d company.com -t std

# ── ZONE TRANSFER ────────────────────────────────────────
host -t ns company.com
host -t axfr company.com ns1.company.com
dig axfr @ns1.company.com company.com
dnsrecon -d company.com -t axfr

# ── SUBDOMAINS ───────────────────────────────────────────
python sublist3r.py -d company.com -o subs.txt
curl -s 'https://crt.sh/?q=%.company.com&output=json' | jq -r '.[].name_value' | sort -u
amass enum -d company.com

# ── FOOTPRINTING ─────────────────────────────────────────
whatweb https://company.com
wafw00f https://company.com
curl -sI https://company.com
curl -s https://company.com/robots.txt

# ── HARVESTING ───────────────────────────────────────────
theHarvester -d company.com -b all -f results

# ── NMAP HOST DISCOVERY ──────────────────────────────────
nmap -sn 192.168.1.0/24
nmap -Pn 192.168.1.10            # when ICMP is blocked

# ── NMAP PORT SCAN ───────────────────────────────────────
nmap -sV -sC -O -T4 192.168.1.10 -oA results
nmap -p- -sV -T4 192.168.1.10 -oA full
nmap -sU --top-ports 25 192.168.1.10

# ── NMAP NSE ─────────────────────────────────────────────
nmap --script=smb-vuln-ms17-010 -p 445 192.168.1.10
nmap --script=ftp-anon -p 21 192.168.1.10
nmap --script=http-title,http-enum -p 80,443,8080 192.168.1.10
nmap --script=vuln 192.168.1.10

# ── SEARCHSPLOIT (after finding versions) ────────────────
searchsploit apache 2.4.49
searchsploit openssh 7.4
searchsploit wordpress 5.9
```

---

## One thing I’m keeping

Passive recon is not just an "introduction" to the real pentest.
**It is the real pentest** - just quiet, invisible, and often
more valuable than an hour of noisy Nmap scanning.
