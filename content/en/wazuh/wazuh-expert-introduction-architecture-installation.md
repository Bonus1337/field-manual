---
id: wazuh-expert-introduction-architecture-installation
title: "Wazuh Expert 1/5 - introduction, architecture, installation, and the first lab"
team: blue
category: wazuh expert 2024
tags: ["wazuh", "siem", "xdr", "soc", "blue-team", "detection", "ossec", "agentless"]
difficulty: medium
updatedAt: "2026-03-25"
---

# Wazuh Expert 1/5 - introduction, architecture, installation, and the first lab

## Why I am making this note in the first place

Because with Wazuh it is very easy to fall into two bad ways of thinking.

The first one: treating it like just another log panel.  
The second one: treating it like a magic box that, once deployed, will automatically handle monitoring, detection, and response.

But the truth is much simpler and much more useful:

**Wazuh gives me a very solid skeleton for visibility, detection, and partially automated response, but only when I understand the data, the architecture, the rules, and the logic behind how the whole system works.**

This note is here to organize the fundamentals for me. Not for clicking around in the dashboard. For actually understanding what this system sees, how it interprets it, and where its real value begins.

---

## What Wazuh is for me

Put simply:

**Wazuh is a practical SIEM-class system with elements of the XDR approach, built around telemetry collection, event analysis, rules, decoders, and the ability to trigger automated response.**

It is not just log collection.  
It is a full chain of:

- collecting data from endpoints,
- log analysis,
- correlation,
- detection,
- file integrity monitoring,
- vulnerability detection,
- incident response,
- security analytics,
- compliance,
- cloud and container security.

The most important thing: it still feels like a strongly engineering-driven system. Not a “nice SaaS”, but a tool that has to be understood. The dashboard helps, but it does not replace thinking.

---

## When Wazuh starts to make sense

Not every infrastructure needs Wazuh from day one.

If I have only a few computers and a simple layout, I can still live without a system like this. But when the environment starts to grow into a dozen, several dozen, or more endpoints, then the pain starts to show:

- no central view,
- chaos in logs,
- no correlation,
- no consistent detection,
- no automation.

And that is exactly where Wazuh starts becoming practical.

**Not as a goal by itself.  
As a tool that saves time, organizes data, and builds control over the environment.**

---

## Why IPS / IDS / antivirus alone do not close the topic

Because the defender has to understand the whole picture, while the attacker only needs one sensible path.

That path can be:

- a technical vulnerability,
- social engineering,
- phishing,
- a weak process,
- a sequence of small signals that do not look dangerous on their own, but together form an attack.

Single security tools only see a fragment of the picture.  
SIEM makes sense when it:

- collects data from many sources,
- filters out part of the noise,
- adds context,
- correlates events,
- and lets me move from a single log to a meaningful attack story.

Without that, it is very easy to drown in noise and miss something that has been developing for weeks.

---

## SIM, SEM, SIEM, XDR - how I arrange this in my head

### SIM

Collects information from different sources.  
The problem: just collecting data does not yet create an advantage. The noise can be overwhelming.

### SEM

Provides event analysis closer to real time, event handling, and operational use of those events.

### SIEM

Combines both worlds:

- collection,
- filtering,
- correlation,
- analysis,
- visualization.

### XDR

Pushes further into active protection, behavior, endpoint visibility, and response. More behavioral, less only “signature-based”.

### Wazuh

For me, in practice:
**SIEM + part of the XDR mindset + Active Response + a reasonable entry threshold.**

---

## The most important mindset: an alert is not the end of the work

The old security model often stops at:

**“something happened”**

That is not enough.

It only becomes interesting when I have the full chain:

- a log reaches the system,
- the system understands it,
- a rule gives it meaning,
- the alert gets a level and context,
- I can decide whether I only want to see it or also react immediately.

That is exactly why Active Response matters so much.  
Because the system stops being just an observer.

---

## Kill chain - why I need it for detection

I do not learn the kill chain for definitions.  
I learn it so I know **at which stage of the attack I have visibility, and at which stage I am blind.**

The core model I want to remember:

1. reconnaissance,
2. weaponization,
3. delivery,
4. exploitation,
5. persistence,
6. command and control,
7. exfiltration / final actions.

If I am creating a rule, I do not ask only:

**“is this a bad log?”**

I ask instead:

**“which stage of the attack am I trying to see here?”**

That sets my detection thinking much better.

---

## TTP and MITRE ATT&CK - why I need them with Wazuh

TTPs are not decoration for the dashboard.

They are a way of describing adversary behavior:

- **Tactics** - why something is being done,
- **Techniques** - how it is being done,
- **Procedures** - what it looks like in practice.

If rules are not grounded in that way of thinking, it becomes very easy to build a system that generates a lot of events but does a poor job of explaining **what it actually sees and why it matters**.

So:

- I do not build detection just because “the log looks strange”,
- I build detection around specific adversary behaviors.

---

## IOC - what signals I want to look at

An indicator of compromise is not just a hash or a domain.

In practice, I want to remember signals like:

- strange login activity,
- unusual DNS queries,
- “non-human” web traffic,
- geolocation anomalies,
- unusual IN/OUT activity,
- increased read and write activity,
- service issues,
- registry changes,
- system slowdown,
- unusual frame and packet sizes,
- a spike in the number of requests and responses,
- DDoS,
- behaviors that drift away from the normal rhythm of the environment.

The most important thing is not memorizing the list.  
The most important thing is learning to recognize **what starts to drift away from normal**.

---

## The architecture I really need to understand

### Wazuh Server

The central analysis point.

It:

- receives data from agents,
- runs it through decoders and rules,
- manages agents,
- generates alerts.

### Wazuh Indexer

The storage and search engine.

This is where the data and alerts go so they can later be searched and analyzed quickly.

### Wazuh Dashboard

The web layer for operational work, visualization, and part of the configuration.

Convenient, but it cannot be the only thing I understand.

### Wazuh Agent

Lives on the endpoint and sends telemetry.

The agent is what gives a large part of the visibility over the endpoint.

### Agentless

A very important mode of operation.

If I cannot deploy a classic agent, I can still monitor the host, for example via SSH or Syslog.

**No classic agent does not have to mean a blind spot.**

---

## Endpoints, not just “agents”

This is a small but important shift in thinking.

I do not look only at an “agent” anymore, but more broadly at the **endpoint** as the final point in the environment from which I want visibility.

That sets the whole topic correctly:

- it is not just about installing a client,
- it is about sensibly covering the environment with visibility.

---

## Ports I want to know by heart

If something does not work, very often the problem is not in the “magic of Wazuh”, but in communication.

At the start I want to remember:

- `1514/TCP, UDP` - agent ↔ server
- `514/TCP, UDP` - agentless / Syslog
- `55000/TCP` - RESTful API
- `9200/TCP` - Indexer API
- `443/TCP` - Dashboard

This is the kind of knowledge that later saves real time during troubleshooting.

Because many “weird problems” end up being about:

- the firewall,
- routing,
- certificates,
- the wrong port being opened,
- or broken communication between components.

---

## Requirements - theory versus real life

For small deployments, the rough guidance usually looks like:

- 1–25 agents: around 4 vCPU, 8 GB RAM, 50 GB storage
- 25–50 agents: more space for data and more caution with retention
- 50–100 agents: storage starts hurting even more

But the most important practical conclusion is simple:

**what hurts the most is not the table, but the real incoming data volume.**

So I do not look only at:

- CPU,
- RAM,
- storage,

but also at:

- the number of endpoints,
- the type of logs being collected,
- retention,
- the amount of noise,
- the number of alerts,
- how much useless data I am indexing.

It is possible to kill the environment not with weak hardware, but with a bad collection scope.

---

## Documentation > memorization

This is one of the most important things from the whole module.

Wazuh changes quickly.  
Versions evolve, modules change, and some mechanisms get redesigned.

That is why I do not want to learn Wazuh as a set of random tricks from the Internet.

I want to have this instinct:

1. I understand the operating model,
2. I know where to look,
3. the documentation is the source of truth.

Quick starts and ready-made commands are convenient, but they do not create understanding on their own.

---

## Standalone installation - fast start, but with your brain on

The simplest path to the first lab:

```bash
sudo apt update
curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh && sudo bash ./wazuh-install.sh -a
```

This is a good path to a standalone environment because it lets me bring up a working server quickly without assembling everything manually from scratch.

But what matters more than the command itself is the workflow:

- download the script,
- check what is going to run,
- execute the installation,
- save the passwords,
- log in to the dashboard,
- check the manager logs.

So:

**“it works” does not yet mean “it is well deployed”.**

After installation, it is worth checking immediately:

```bash
cat /var/ossec/logs/ossec.log
```

---

## The first lab - the right order

A good beginner workflow looks like this:

1. I deploy the Wazuh server,
2. I deploy a Linux client,
3. I deploy a Windows client,
4. optionally I add an agentless host,
5. only then do I validate communication and start tuning.

This is a good order because it teaches the right mindset:

**deploy → connect → verify → only then tune**

---

## Linux agent - what really matters here

First, basic order on the host:

```bash
sudo apt update
sudo hostnamectl set-hostname linux-wazuh
```

Then in the dashboard:

- Server management
- Endpoint Summary
- Add and deploy new agents
- choose Linux / DEB amd64
- provide the server address
- generate the command for the client

Example flow:

```bash
wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.9.0-1_amd64.deb && \
sudo WAZUH_MANAGER='IP_OF_SERVER' dpkg -i ./wazuh-agent_4.9.0-1_amd64.deb
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

The most important thing:
**the agent is really added only when I can see it in Endpoint Summary.**

Not when the command finished without an error.

---

## Windows agent - the same thinking model

On Windows the logic is exactly the same:

- PowerShell as administrator,
- Dashboard → Endpoint Summary,
- Deploy new agent,
- choose Windows / MSI,
- provide the server address,
- generate the command,
- start the service.

Example:

```powershell
Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi -OutFile ${env.tmp}\wazuh-agent
msiexec.exe /i ${env.tmp}\wazuh-agent /q WAZUH_MANAGER='IP_OF_SERVER'
NET START WazuhSvc
```

Again:
success is not that the MSI installed.
Success is that the endpoint is actually talking to the server and appears in the panel.

---

## Agentless - one of the most valuable things in this module

This is really important.

Not every endpoint will allow a classic agent.
Sometimes it will be a host that is easier to access via SSH.
Sometimes a network device.
Sometimes another system that is better integrated in a different way.

The basic agentless workflow:

1. generate a key for the `wazuh` user,
2. copy the key to the target host,
3. register the host with `register_host.sh`,
4. add the `<agentless>` section to `ossec.conf`,
5. install `expect`,
6. restart `wazuh-manager`,
7. validate the data in the dashboard.

Example:

```bash
sudo -u wazuh ssh-keygen
ssh-copy-id -i /var/ossec/.ssh/id_rsa root@IP
sudo apt install -y expect
/var/ossec/agentless/register_host.sh add root@IP NOPASS
/var/ossec/agentless/register_host.sh list
systemctl restart wazuh-manager
```

Example `ossec.conf` section:

```xml
<agentless>
  <type>ssh_integrity_check_linux</type>
  <frequency>3600</frequency>
  <host>root@IP</host>
  <state>periodic</state>
  <arguments>/bin /etc/ /sbin</arguments>
</agentless>
```

The most important conclusion:

**no classic agent does not have to mean no monitoring.**

---

## `ossec.conf` - this is where real Wazuh starts

This is not just one of many files.

This is the central configuration point around which many important things rotate:

- global settings,
- log collection,
- alerts,
- rules,
- syscheck,
- rootcheck,
- active-response,
- agentless.

This is where real work with Wazuh begins:

- tuning,
- defining the monitoring scope,
- response logic,
- later troubleshooting.

The dashboard helps a lot, but it does not remove the need to understand **what is changing and why**.

---

## Rules - a hygiene principle I want to remember always

The most important rule:

**I do not modify the base rules unless I really have to.
I work in `local_rules.xml`.**

Additionally:

- IDs below `100000` are reserved,
- custom rules need testing,
- I do not break the base ruleset just because I wanted to “quickly fix something”.

This is a boring rule only until the first update.
Then it turns out it was the difference between order and disaster.

---

## Rule levels - a simple noise filter

It is worth remembering that not every match has the same weight.

Rule levels help separate:

- minor noise,
- less important events,
- from signals that really matter operationally.

It looks like a small detail, but these details decide whether the system will be useful or whether it will only generate noise.

---

## Decoders - without them, rules are blind

A rule only makes sense when the log has been understood correctly.

That is exactly why decoders exist.

In practice it looks like this:

1. a log enters the system,
2. the decoder recognizes the structure,
3. fields are extracted,
4. the rule makes a decision.

So:

- the decoder tells the system **what it sees**,
- the rule tells the system **what it means**.

If I want to build my own matching logic later, I need to understand this chain.

---

## Active Response - the moment monitoring turns into action

This is one of the most interesting things in Wazuh.

If a specific event appears, I can trigger an action:

- block an IP address,
- execute a script,
- react on the host side,
- react on the server side.

This is exactly where monitoring stops being passive observation.

But I have to remember the trap:

**an overly aggressive or badly tuned response can start punishing normal traffic.**

So:
Active Response gives power, but it requires tuning and common sense.

The goal is not to block everything.
The goal is to react intelligently.

---

## The most important paths I want to know

At the start I want to remember these locations above all:

- `/var/ossec/logs/`
- `/var/ossec/etc/ossec.conf`
- `/var/ossec/active-response/bin/`
- `/var/ossec/etc/rules/`
- `/var/ossec/ruleset/rules/`
- `/var/ossec/agentless/`
- `/etc/filebeat/`
- `/etc/wazuh-indexer/`
- `/etc/wazuh-dashboard/`

This is not a list to memorize for sport.
These are places I will return to during:

- tuning,
- log analysis,
- configuration validation,
- troubleshooting.

---

## What I want to remember after module 1

### 1. Wazuh is not a dashboard

It is an engine for building visibility, detection, correlation, and partially automated response.

### 2. Installation alone solves nothing

The real value starts with data, decoders, rules, and tuning.

### 3. Kill chain, TTP, and IOC are not theory for slides

They are the framework for building meaningful visibility and meaningful rules.

### 4. Agentless is a real option

The lack of a classic client does not have to mean the lack of monitoring.

### 5. Documentation beats memorization

Especially in a system that changes quickly.

### 6. `local_rules.xml` is a friend

Touching the base rules is asking for trouble.

### 7. Decoder and rule are a pair

Without understanding the log correctly, there is no meaningful detection.

### 8. An alert is only the beginning

The interesting part starts when I know what to do with it.

---

## My takeaway after this part

After this module, I do not want to look at Wazuh as a “free replacement for more expensive tools”.

I want to look at it more as an **engineering security skeleton** that can give a lot, but only when I understand:

- how it collects data,
- how it interprets it,
- how it builds an alert,
- and when it should not only say there is a problem, but also do something about it.

**Installation is just entering the game.
The real work starts with configuration, rules, decoders, and clear thinking about what I actually want to detect.**

```

```
