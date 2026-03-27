---
id: footprinting-scanning
title: "Footprinting & Scanning - the complete practitioner's guide"
team: red
category: eJPT
tags: ["nmap", "scanning", "host-discovery", "port-scan", "fingerprinting", "evasion"]
difficulty: easy
shortDescription: "A comprehensive guide to footprinting and scanning in the context of penetration testing and preparation for the eJPT, featuring a structured overview of host discovery, port scanning, service and system fingerprinting, NSE scripts, evasion techniques, and guidelines for interpreting results."
updatedAt: "2025-03-07"
---

> All materials included here are only part of study notes. They are not intended to be used against production systems without authorization.

# Footprinting & Scanning - the complete practitioner's guide

## Why this note exists at all

Network scanning is the moment when you stop being a shadow and start sending packets.
From this point on, your traffic appears in logs. If you do not know what you are doing,
you will either burn your IP before you manage to gather anything useful, or worse,
you will send packets outside the scope and create a problem for yourself.

This note is a complete working resource - from the network fundamentals you need to understand
to interpret results, through host discovery, port scanning, service and OS fingerprinting,
all the way to NSE and evasion techniques. It is structured so you can go through it
step by step in a lab, or return to a specific section when you get stuck.

---

## Fundamentals - what you need to understand before launching Nmap

### Where this sits in the methodology

Footprinting and scanning are the active part of information gathering. You do not do this before
passive recon - you do it after. From passive recon you get the map of the terrain: you know which IPs,
which name servers, which subdomains. Only then do you go in with packets and know exactly
what you want to find.

```

Information Gathering
├── Passive (OSINT, DNS, Google Dorks, Shodan)
└── Active ← this is where we are
├── Network Mapping / Host Discovery
├── Port Scanning
├── Service & OS Detection
└── Enumeration (next stage)

```

Going in with Nmap against a network you know nothing about is shooting blind.
Passive gives you the target. Active gives you the profile.

---

### The OSI model - the layers that actually matter

You need to know OSI because the exam asks about it in the context of scanning,
not because you need to memorize it for its own sake. For us, the key layers are:
**layer 3 (IP, ICMP)** and **layer 4 (TCP, UDP)**. That is where Nmap operates.

| #     | Layer         | What it does                        | Examples            |
| ----- | ------------- | ----------------------------------- | ------------------- |
| 7     | Application   | Interface for applications          | HTTP, FTP, SSH, DNS |
| 6     | Presentation  | Translation, encryption             | SSL/TLS             |
| 5     | Session       | Session management                  | APIs, NetBIOS       |
| **4** | **Transport** | **End-to-end, ports, flow control** | **TCP, UDP**        |
| **3** | **Network**   | **Logical addressing, routing**     | **IP, ICMP**        |
| 2     | Data Link     | Access to the medium, MAC           | Ethernet, PPP       |
| 1     | Physical      | Physical connection                 | Cables, Wi-Fi       |

Ping works at layer 3 through ICMP. Port scanning works at layer 4 through TCP/UDP.
When a firewall blocks ICMP, ping does not get through, but port 80 may still be open.
That is why `nmap -Pn` (skip ping) exists.

---

### TCP and the three-way handshake - you must understand this inside out

TCP is a connection-oriented protocol. Before you exchange any data, you must establish a connection
through the three-way handshake. Nmap uses exactly this mechanism to determine the state of a port.

```

CLIENT ──────── SYN ────────► SERVER (I want to establish a connection)
CLIENT ◄──── SYN-ACK ──────── SERVER (ok, confirmed, I am available)
CLIENT ──────── ACK ────────► SERVER (I confirm the confirmation)
[CONNECTION ESTABLISHED]

```

Every TCP flag has its meaning in the context of scanning:

| Flag | What it means                |
| ---- | ---------------------------- |
| SYN  | Initiates a connection       |
| ACK  | Acknowledgment of receipt    |
| FIN  | Closes a connection          |
| RST  | Reset - port closed or error |
| PSH  | Push data                    |
| URG  | Urgent data                  |

Why this matters: a SYN scan (`-sS`) sends only SYN and after receiving SYN-ACK
responds with RST - it does not complete the handshake. This is faster and less visible
in application logs, because the connection was never fully established.
A TCP Connect scan (`-sT`) performs the full handshake - it is noisier but does not require root.

---

### ICMP - the protocol everyone blocks and that is still useful

ICMP is layer 3. Ping and traceroute use it. The key types you will see are:

| Type    | Meaning                                             |
| ------- | --------------------------------------------------- |
| Type 8  | Echo Request (you send a ping)                      |
| Type 0  | Echo Reply (the host is alive)                      |
| Type 3  | Destination Unreachable (no route or closed on UDP) |
| Type 11 | Time Exceeded (TTL expired - used by traceroute)    |

Many firewalls block ICMP. A host that does not respond to ping is not necessarily dead -
it may simply be dropping Echo Request. Then you use TCP SYN ping or `-Pn`.

---

### TCP vs UDP - when to use which

UDP is connectionless and faster, but Nmap has a harder time with it. If a UDP port
does not respond at all, Nmap labels it as `open|filtered`, because it does not know whether
the service is silent or the packet was blocked. That is why UDP scans are slow and often ignored.
That is a mistake. SNMP (161), DNS (53), and NFS (2049) use UDP and can be gold.

| Feature     | TCP                  | UDP                   |
| ----------- | -------------------- | --------------------- |
| Connection  | Yes (handshake)      | No                    |
| Reliability | Guarantees delivery  | No guarantee          |
| Speed       | Slower               | Faster                |
| Use cases   | HTTP, FTP, SSH, SMTP | DNS, SNMP, DHCP, VoIP |

---

### Ports - reference table

Do not memorize this blindly. Learn what each service means from an offensive point of view.

| Port      | Protocol | Service    | What I check here                      |
| --------- | -------- | ---------- | -------------------------------------- |
| 21        | TCP      | FTP        | Anonymous login, version for CVE       |
| 22        | TCP      | SSH        | OpenSSH version, password auth vs key  |
| 23        | TCP      | Telnet     | Unencrypted - legacy device            |
| 25        | TCP      | SMTP       | VRFY, EXPN - user enumeration          |
| 53        | TCP/UDP  | DNS        | Zone transfer over TCP                 |
| 80        | TCP      | HTTP       | Web app - entry point for web testing  |
| 110       | TCP      | POP3       | Incoming mail                          |
| 139/445   | TCP      | SMB        | EternalBlue, null session, enum shares |
| 143       | TCP      | IMAP       | Incoming mail                          |
| 443       | TCP      | HTTPS      | TLS, certificate (SANs!), web app      |
| 3306      | TCP      | MySQL      | Anonymous login, brute-force root      |
| 3389      | TCP      | RDP        | BlueKeep, brute force                  |
| 5432      | TCP      | PostgreSQL | Default passwords                      |
| 5900      | TCP      | VNC        | Often weak or no password              |
| 6379      | TCP      | Redis      | Often unauthenticated → RCE            |
| 8080/8443 | TCP      | HTTP alt   | Tomcat, Jenkins, management panels     |
| 27017     | TCP      | MongoDB    | Often unauthenticated                  |

---

## Network mapping - why we do it at all

You get a range. Let us say `200.200.0.0/16` - that is 65,536 potential addresses.
You do not know what is there. You do not know how many hosts are alive. You do not know what is running on them.
Network mapping is the transition from "I have a CIDR range" to "I know exactly what to test."

You answer four questions before you start enumeration:

1. Which IPs are active?
2. Which ports are open on them?
3. What is running there (service version, operating system)?
4. Is there a firewall in front of it and what does the filtering look like?

The order is always the same. You do not jump straight to port scanning.
First you determine what is alive, then you scan ports only on live hosts.

---

## Host Discovery - detecting live hosts

### What techniques exist and when to use what

Classic ping sweep (ICMP Echo Request) is the fastest option, but it only works if
the firewall allows ICMP. In production environments, ICMP is often blocked by policy.
Then you need to use TCP or UDP to check whether the host is alive.

**Ping sweep (ICMP)** - fast, but firewalls block it:

```bash
# Detect live hosts - discovery only, no port scanning
nmap -sn 192.168.1.0/24

# Save live hosts to a file - useful for later scans
nmap -sn -T4 192.168.1.0/24 -oG - | awk '/Up$/{print $2}' > live_hosts.txt
```

**ARP scan** - the most reliable, but only on the same local network. ARP works
at layer 2, before IP, so no host in the LAN can ignore it:

```bash
# Requires root, works only on the local network
sudo arp-scan -I eth0 --localnet
sudo nmap -PR -sn 192.168.1.0/24
```

**TCP SYN / ACK ping** - when ICMP is blocked. You send SYN to common ports
(80, 443, 22) - if the host is alive, you will get SYN-ACK or RST back:

```bash
# Ping via TCP SYN on ports 22, 80, and 443
nmap -PS22,80,443 -sn 192.168.1.0/24

# TCP ACK ping - some firewalls allow ACK because they think it belongs to an existing connection
nmap -PA80 -sn 192.168.1.0/24

# UDP ping - on port 53 (DNS)
nmap -PU53 -sn 192.168.1.0/24
```

**`-Pn` - force scan without ping.** When you know the host is alive but the firewall blocks
everything that could reveal it. It treats every address as alive and goes straight to port scanning.
On a /24 with `-Pn` this will take time - use it on specific hosts:

```bash
nmap -Pn 192.168.1.10
```

**`fping` and `netdiscover`** - alternatives when Nmap is too noisy or too slow:

```bash
# fping - fast ping sweep, 2>/dev/null to hide "unreachable"
fping -I eth0 -g 192.168.1.0/24 -a 2>/dev/null

# netdiscover - passive and active ARP discovery
sudo netdiscover -i eth0 -r 192.168.1.0/24
```

---

## Port Scanning - scanning ports

### What port states mean

This is the first thing you need to be able to interpret before you start scanning.
The results Nmap shows tell you very different things about what sits behind the host.

**`open`** - a service is listening. A connection is possible. This is what you are looking for.
Go further - enumerate the service, check the version, look for CVEs.

**`closed`** - the host is alive, the port is reachable, but no service is listening.
You get RST in response. This is not "nothing is here" - it is confirmation
that the host exists and is reachable.

**`filtered`** - no response or ICMP unreachable. A firewall is dropping packets.
Something is probably there, but it is hidden. Evasion techniques are worth trying.

**`open|filtered`** - Nmap cannot tell the difference. Typical for UDP -
the service may not respond to empty packets. It does not mean nothing is there.

**`unfiltered`** - the port is reachable, but the state is unknown. This appears in ACK scans -
used for mapping firewall rules, not for finding open ports.

---

### Scan types - what you send and when

**SYN scan (`-sS`)** is the default scan for root. It sends SYN, and after receiving SYN-ACK
it immediately responds with RST and does not complete the handshake. Fast and less visible
in application logs - the connection was never fully established. Network IDS will still see it,
but in application logs - silence:

```bash
sudo nmap -sS 192.168.1.10
```

**TCP Connect scan (`-sT`)** performs the full handshake via the `connect()` system call. It gets logged
by the application. Slower. But it does not require root - useful when you do not have sudo:

```bash
nmap -sT 192.168.1.10
```

**UDP scan (`-sU`)** - slow, often ignored, which is exactly why it is gold. SNMP (161)
without a community string can reveal full information about a router. DNS over TCP (53) can allow zone transfer.
NFS (2049) may give access to shares without authorization:

```bash
# Top 25 UDP ports - quick overview
sudo nmap -sU --top-ports 25 192.168.1.10

# Specific UDP ports I always check
sudo nmap -sU -p 53,67,68,69,161,162,2049 192.168.1.10
```

**FIN, NULL, Xmas scans** - they send unusual TCP flag combinations. A normal host
should reply with RST on a closed port and nothing on an open port. Some firewalls and IDS
ignore these packets because they do not look like real traffic. They do not work on Windows
(Windows replies with RST to everything regardless of port state):

```bash
sudo nmap -sF 192.168.1.10   # FIN scan
sudo nmap -sN 192.168.1.10   # NULL scan - no flags at all
sudo nmap -sX 192.168.1.10   # Xmas scan - FIN+PSH+URG
```

**ACK scan (`-sA`)** - does not detect open ports. It sends ACK and checks whether it gets
RST back (`unfiltered` - no firewall on that port) or nothing (`filtered`). Used to map
what the firewall allows and what it blocks:

```bash
sudo nmap -sA 192.168.1.10
```

---

### Choosing ports - when you scan what

By default, Nmap scans the top 1000 TCP ports. That is enough for the first overview.
The problem: important services live on non-standard ports. Jenkins admin panel
on 8080. Grafana on 3000. Elasticsearch on 9200. If the standard scan returns little -
scan all ports and do not regret the time:

```bash
# Default - top 1000 TCP ports
nmap 192.168.1.10

# Fast mode - top 100 (quick overview, not for final reporting)
nmap -F 192.168.1.10

# Top N ports
nmap --top-ports 200 192.168.1.10

# Specific ports
nmap -p 22,80,443,8080,3306,3389 192.168.1.10

# All ports - 0 to 65535
nmap -p- 192.168.1.10

# UDP + TCP together on specific ports
sudo nmap -sU -sS -p U:53,161,T:22,80,443 192.168.1.10
```

My strategy: I start with `-sV -sC -T4` on the top 1000. If I see interesting services
or very few ports - I follow with `-p-` to make sure I did not miss anything.

---

## Service & OS Detection - fingerprinting

### Detecting service versions

An open port is an entry point. A service version is your entry point into the CVE database.
`Apache 2.4.49` means CVE-2021-41773. `OpenSSH 7.4` has its own vulnerability history.
`vsFTPd 2.3.4` has a backdoor. Without `-sV` you only have a port - with `-sV` you have an attack vector:

```bash
# Basic - detect service versions
nmap -sV 192.168.1.10

# Detection intensity (0-9, default 7) - higher = more accurate but slower
nmap -sV --version-intensity 9 192.168.1.10

# Faster but less accurate
nmap -sV --version-light 192.168.1.10
```

Once you have the version - immediately:

```bash
searchsploit apache 2.4.49
searchsploit openssh 7.4
searchsploit vsftpd 2.3.4
```

---

### Detecting the operating system

Nmap analyzes characteristic parts of TCP/IP responses: TTL, TCP window size,
responses to special packets. It is not 100% reliable, but in 80% of cases
the result is useful. It requires root and at least one open and one closed port:

```bash
sudo nmap -O 192.168.1.10

# If Nmap is not sure - force it to guess more aggressively
sudo nmap -O --osscan-guess 192.168.1.10
```

A faster way to estimate the OS is simply the TTL in a ping response:

| OS                 | TTL (approximate) |
| ------------------ | ----------------- |
| Linux / Unix / Mac | 64                |
| Windows            | 128               |
| Cisco IOS          | 255               |
| FreeBSD            | 64                |

TTL=127 → probably Windows that passed through 1 router.
TTL=63 → probably Linux through 1 router.

---

### Aggressive scan - `-A`

`-A` is shorthand for `-sV -sC -O --traceroute` in one flag. Everything at once.
Loud, noisy, likely to trigger IDS. On a real engagement, discuss it with the client.
On CTFs and labs, use it freely:

```bash
# Aggressive scan on a single host
nmap -A 192.168.1.10

# Most common combination on the exam
nmap -sC -sV -O -T4 192.168.1.10 -oA result

# Full scan of all ports with complete profiling
nmap -Pn -sV -T4 -A -p- -oA full_scan 192.168.1.10
```

---

## Nmap Scripting Engine (NSE)

### What it is and why it works

NSE is a Lua-based scripting framework built into Nmap. It allows automated
vulnerability checks, enumeration, brute force, and data collection - without launching
separate tools. Scripts live in `/usr/share/nmap/scripts/`.

Script categories:

| Category    | What it does                                           |
| ----------- | ------------------------------------------------------ |
| `default`   | Safe, run by `-sC`                                     |
| `discovery` | Collects more information about the target             |
| `safe`      | Does not interfere with the target, only collects data |
| `vuln`      | Checks known vulnerabilities                           |
| `exploit`   | Active exploitation                                    |
| `auth`      | Authentication testing                                 |
| `brute`     | Brute force                                            |
| `dos`       | Denial of Service - use carefully                      |

Default scripts (`-sC`) are the `safe + default` category. Safe means:
they do not exploit, they do not brute force, they only collect information. Typical output:

```
| http-title: Management Panel
| ssl-cert: SANs: company.com, api.company.com  ← extra subdomains from the certificate!
| ssh-hostkey: 2048 aa:bb:cc:dd... (RSA)
```

---

### NSE scripts by scenario - what I actually use

```bash
# ── HTTP ──────────────────────────────────────────────────
# Page title, headers, available HTTP methods
nmap -p 80,443 --script http-title,http-headers,http-methods 192.168.1.10

# Directory enumeration - looks for hidden paths
nmap -p 80 --script http-enum 192.168.1.10

# robots.txt
nmap -p 80 --script http-robots.txt 192.168.1.10

# ── FTP ──────────────────────────────────────────────────
# Check whether FTP accepts anonymous login
nmap -p 21 --script ftp-anon 192.168.1.10

# FTP bounce attack
nmap -p 21 --script ftp-bounce 192.168.1.10

# ── SMB ──────────────────────────────────────────────────
# EternalBlue (MS17-010) - the most important one
nmap -p 445 --script smb-vuln-ms17-010 192.168.1.10

# All SMB vulnerabilities
nmap -p 445 --script smb-vuln* 192.168.1.10

# Which shares are available
nmap -p 445 --script smb-enum-shares 192.168.1.10

# User enumeration through SMB
nmap -p 445 --script smb-enum-users 192.168.1.10

# SMB protocol version and security mode
nmap -p 445 --script smb-protocols,smb-security-mode 192.168.1.10

# OS via SMB
nmap -p 445 --script smb-os-discovery 192.168.1.10

# ── SSH ──────────────────────────────────────────────────
# Which authentication methods are supported
nmap -p 22 --script ssh-auth-methods 192.168.1.10

# ── MySQL ─────────────────────────────────────────────────
# Info without authentication and check for empty root password
nmap -p 3306 --script mysql-info,mysql-empty-password 192.168.1.10

# ── General vuln scan ─────────────────────────────────────
# Noisy, may trigger IDS - but comprehensive
nmap --script=vuln 192.168.1.10
```

Searching for scripts:

```bash
# Find all scripts for a given service
ls /usr/share/nmap/scripts/ | grep smb
ls /usr/share/nmap/scripts/ | grep http

# Help for a specific script
nmap --script-help smb-vuln-ms17-010
nmap --script-help "smb-vuln-*"
```

---

## Firewall Detection & Evasion

### How to recognize that there is a firewall

If you see many ports in the `filtered` state - a firewall is dropping packets.
If a service is described as `tcpwrapped` - the three-way handshake completed
but the server immediately closed the connection without sending data. Firewall or TCP wrapper.
If `-sV` cannot detect the service version on a port that is `open` -
something is sitting between you and the host.

---

### Evasion techniques - when a normal scan does not get through

**Packet fragmentation** - you split packets into smaller pieces. DPI systems
(Deep Packet Inspection) sometimes do not reassemble them before analysis:

```bash
# Fragment packets into 8-byte pieces
nmap -f 192.168.1.10

# Double fragmentation - even smaller
nmap -f -f 192.168.1.10
```

**Decoy scan** - you mix your IP with fake ones. In firewall logs, several
addresses appear at once and it is not clear which one is real:

```bash
# 5 random decoys
nmap -D RND:5 192.168.1.10

# Specific decoys + your IP in the ME position
nmap -D 10.0.0.1,10.0.0.2,ME,10.0.0.3 192.168.1.10
```

**Source port spoofing** - you impersonate a port the firewall is likely to allow.
Port 53 (DNS) is often allowed because it looks like normal
DNS traffic:

```bash
nmap --source-port 53 192.168.1.10
# or shorter:
nmap -g 53 192.168.1.10
```

**Add random data to packets** - changes the packet signature, making
signature-based detection harder:

```bash
nmap --data-length 25 192.168.1.10
```

**Idle scan / Zombie scan** - you send packets through another host (the zombie). Your IP
does not appear in the target’s logs at all. The most effective hiding technique,
but it requires finding a suitable zombie (a host with predictable IP ID behavior):

```bash
sudo nmap -sI <zombie_ip> 192.168.1.10
```

**Combination of evasion techniques** - on a real engagement where IDS is active:

```bash
sudo nmap -sS -T2 -f -D RND:5 --source-port 53 --data-length 50 192.168.1.10
```

---

## Timing & Performance

### When to use what

Timing templates control scan aggressiveness - how long you wait for responses, how many
packets you send at once, how many retries you allow:

| Template   | Flag  | When                                         |
| ---------- | ----- | -------------------------------------------- |
| Paranoid   | `-T0` | IDS evasion, 5 minutes between packets       |
| Sneaky     | `-T1` | Avoiding IDS, very slow                      |
| Polite     | `-T2` | Real engagement, do not overload the network |
| Normal     | `-T3` | Default                                      |
| Aggressive | `-T4` | CTFs, labs, fast networks                    |
| Insane     | `-T5` | Local only, risk of missing things           |

In labs and CTFs: `-T4`. On a real engagement: `-T2` or `-T3`.

Manual settings when you want more control:

```bash
# Set max retries and packet rate
nmap --max-retries 3 --min-rate 1000 --max-rate 5000 192.168.1.10

# Timeout per host - useful for large ranges
nmap --host-timeout 30s 192.168.1.0/24

# Delay between packets - for production environments
nmap --scan-delay 500ms 192.168.1.10
```

---

## Nmap Output - saving results

One rule: **always save all formats at once.** After a 4-hour session
you will not remember what was where. XML imports into Metasploit.
Gnmap can be grepped with scripts. Normal output is for humans.

```bash
# Three formats at once (generates result.nmap, result.xml, result.gnmap)
nmap -sV -sC -O 192.168.1.10 -oA result

# Normal only (human-readable)
nmap -oN result.txt 192.168.1.10

# XML (for Metasploit import: db_import result.xml)
nmap -oX result.xml 192.168.1.10

# Grepable (easy to parse with scripts)
nmap -oG result.gnmap 192.168.1.10
```

Verbosity when you want to see what is happening in real time:

```bash
nmap -v 192.168.1.10     # verbose
nmap -vv 192.168.1.10    # more verbose
nmap -d 192.168.1.10     # debug
```

---

## Other tools

### Masscan - when you need to scan a large range quickly

Masscan is faster than Nmap when scanning large networks - it can send millions
of packets per second. The problem: it only gives you open ports, without service detection.
The strategy: Masscan on the range → Nmap on the discovered hosts and ports:

```bash
# Quick scan of a large network
sudo masscan -p 21,22,80,443,445,3389 --rate 64000 --open-only 192.168.1.0/24

# With output and full port range
sudo masscan -p 0-65535 --rate 64000 --open-only -oG masscan_results.gnmap 192.168.1.0/24
```

### Wireshark - when you want to see what is actually going through the network

Wireshark does not replace Nmap - it complements it. Use it when you want to verify what
Nmap is actually sending, or when you are inside the network and want to gather
information passively before you start active scanning.

```
# Useful Wireshark filters:
arp                       → only ARP (find hosts in the LAN)
icmp                      → only ping
tcp.port == 80            → only HTTP
ip.addr == 10.10.10.1     → traffic to/from a specific IP
tcp.flags.syn == 1        → only SYN packets
```

### MSF + Nmap - importing results into Metasploit

Msfconsole has a built-in database. You import Nmap results (XML), and Metasploit
remembers hosts, ports, and services throughout the session. You can also launch scans directly
from MSF and they are saved automatically:

```bash
# In msfconsole - create a workspace and import
workspace -a my_target
db_import /home/kali/result.xml

# Review what you have
hosts
services
vulns

# Scan directly from MSF (saved to the database)
db_nmap -sV -sC -O 192.168.1.10

# Port scan via MSF auxiliary
use auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.1.0/24
set PORTS 1-1000
run
```

---

## Where things are most often missed

**Scanning only the top 1000 ports.** Top 1000 is a heuristic, not a guarantee.
If the standard scan returns little - use `-p-` and do not regret the time. Jenkins on 8080,
Grafana on 3000, Elasticsearch on 9200 will otherwise slip by.

**Skipping UDP.** SNMP (161) without a community string can give you a full dump of information
about a router. DNS (53) may allow zone transfer. NFS (2049) may provide access
to shares without authorization. Any of these ports can be gold.

**Assuming `filtered` = nothing there.** Filtered means the packets are being
blocked. The service is there - it is just shielded. Try evasion techniques,
change the source port, fragment packets.

**Ignoring SSL certificates.** SANs (Subject Alternative Names) in a certificate
often contain subdomains you did not find anywhere else. `-sC` will dump this
automatically in the `ssl-cert` section. Always look at it.

**Not using `-oA`.** After the session you lose context. XML imports into Metasploit.
Grepable lets you quickly extract only the open ports. `-oA` is free and takes
seconds. Always.

**Skipping a `-Pn` variant** when hosts do not respond to ping. Production environments
often block ICMP by policy. A host that "does not answer ping" may still have
15 open ports - it is simply dropping Echo Request.

**Ignoring TTL in the response.** TTL from ping or Nmap output is a quick OS indicator.
TTL~64 → Linux. TTL~128 → Windows. It is not fully reliable after many hops,
but in a local network it is accurate.

---

## Strategy for the eJPT exam

eJPT often gives you several networks. Your Kali has access to the first one.
Hosts in the first network have access to the second. You need to figure that out through routing.

```bash
# Check the routing table - which networks are reachable from this machine
ip route
# or:
route -n

# Check network interfaces
ip a
ifconfig

# Ping test to the target network (check the pivot)
ping -c 1 10.10.10.1
```

Then go methodically:

```
1. ip route → which networks are reachable from this machine
2. nmap -sn <network>/24 → which hosts are alive
3. nmap -sV -sC -O -T4 <live_ip> -oA initial → profile each host
4. nmap -p- <hosts with few ports> → non-standard ports
5. NSE scripts against discovered services
```

**Typical eJPT questions from this section:**

- Which operating system is running on host X?
- Which service version is running on port Y?
- How many hosts are active in network X.X.X.0/24?
- Which ports are open on host X?
- What is the version of the HTTP server on port 80?
- Does FTP on host X accept anonymous login?

---

## Complete workflow

```
┌─────────────────────────────────────────┐
│  1. DEFINE SCOPE                        │
│     Which IP range / domains?           │
│     What is in/out-of-scope?            │
│     Authorization?                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. HOST DISCOVERY                      │
│                                         │
│  nmap -sn 192.168.1.0/24               │
│    └─ which IPs are alive               │
│                                         │
│  sudo arp-scan --localnet               │
│    └─ ARP on LAN (more reliable)        │
│                                         │
│  Save live hosts to a file              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. PORT SCANNING                       │
│                                         │
│  nmap -sV -sC -O -T4 -oA initial       │
│    └─ profile each live host            │
│                                         │
│  nmap -p- when there are few ports      │
│    └─ non-standard ports                │
│                                         │
│  sudo nmap -sU --top-ports 25           │
│    └─ UDP - SNMP, DNS, NFS              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  4. TARGETED NSE                        │
│                                         │
│  Based on discovered services:          │
│  SMB → smb-vuln-ms17-010, enum-shares   │
│  FTP → ftp-anon                         │
│  HTTP → http-enum, http-title           │
│  MySQL → mysql-empty-password           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  5. DOCUMENT                            │
│     List of live hosts with ports       │
│     Service versions → Searchsploit     │
│     TTL → OS estimation                 │
│     → Move into enumeration             │
└─────────────────────────────────────────┘
```

---

## Cheat sheet - what I keep at hand while working

```bash
# ── HOST DISCOVERY ────────────────────────────────────────
# Ping sweep
nmap -sn 192.168.1.0/24

# Ping sweep → save live IPs
nmap -sn -T4 192.168.1.0/24 -oG - | awk '/Up$/{print $2}' > live_hosts.txt

# ARP scan on LAN (requires root)
sudo arp-scan -I eth0 --localnet
sudo nmap -PR -sn 192.168.1.0/24

# When ICMP is blocked
nmap -Pn -PS22,80,443 192.168.1.0/24

# fping
fping -I eth0 -g 192.168.1.0/24 -a 2>/dev/null

# ── PORT SCANNING ─────────────────────────────────────────
# Quick profile (top 1000)
nmap -sV -sC -O -T4 192.168.1.10 -oA initial

# All ports
nmap -p- -T4 192.168.1.10 -oA full

# Skip ping, scan all ports with full profiling
nmap -Pn -sV -T4 -A -p- -oA full_pn 192.168.1.10

# Fast top 100
nmap -F 192.168.1.10

# UDP top 25
sudo nmap -sU --top-ports 25 192.168.1.10

# Scan from a host list
nmap -sV -sC -T4 -oA multi_scan -iL live_hosts.txt

# ── SERVICE & OS ──────────────────────────────────────────
nmap -sV 192.168.1.10                    # service versions
sudo nmap -O 192.168.1.10                # OS detection
nmap -A 192.168.1.10                     # everything at once

# ── NSE ──────────────────────────────────────────────────
nmap -sC 192.168.1.10                    # default scripts
nmap --script=vuln 192.168.1.10          # vuln scan

nmap -p 21 --script ftp-anon 192.168.1.10
nmap -p 80,443 --script http-title,http-headers,http-enum 192.168.1.10
nmap -p 445 --script smb-vuln-ms17-010,smb-enum-shares 192.168.1.10
nmap -p 3306 --script mysql-info,mysql-empty-password 192.168.1.10
nmap -p 22 --script ssh-auth-methods 192.168.1.10

ls /usr/share/nmap/scripts/ | grep smb   # search for scripts

# ── FIREWALL EVASION ─────────────────────────────────────
nmap -f 192.168.1.10                     # fragmentation
nmap -D RND:5 192.168.1.10               # decoy scan
nmap -g 53 192.168.1.10                  # source port spoofing
nmap --data-length 25 192.168.1.10       # random data in packets

# Evasion combination
sudo nmap -sS -T2 -f -D RND:5 -g 53 --data-length 50 192.168.1.10

# ── OUTPUT ───────────────────────────────────────────────
nmap -oA result 192.168.1.10             # always like this
nmap -oN result.txt 192.168.1.10         # readable
nmap -oX result.xml 192.168.1.10         # XML for MSF
nmap -oG result.gnmap 192.168.1.10       # grepable

# ── MSF INTEGRATION ──────────────────────────────────────
db_import result.xml                     # import Nmap results
db_nmap -sV -sC -O 192.168.1.10          # scan directly from MSF
hosts                                    # show known hosts
services                                 # show known services

# ── SEARCHSPLOIT ──────────────────────────────────────────
searchsploit apache 2.4.49
searchsploit openssh 7.4
searchsploit vsftpd 2.3.4
searchsploit "windows smb"

# ── ROUTING CHECK ─────────────────────────────────────────
ip route                                 # routing table
ip a                                     # interfaces
ping -c 1 10.10.10.1                     # pivot test
```

---

## One thing I am keeping

A port scan is not the goal itself. It is a tool for building the attack map.
`open` on port 445 without `smb-vuln-ms17-010` is wasted information.
A service version without Searchsploit is wasted time. Every Nmap result is
an entry point into the next question - not the end of the work.
