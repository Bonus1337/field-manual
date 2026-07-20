---
id: defensive-security-ids-ips-siem-wazuh-network-detection
title: "IDS, IPS and SIEM: from a single packet to a correlated incident"
team: red-blue
domain: defensive-security
section: network-detection-and-monitoring
type: knowledge
angle: network-telemetry-detection-correlation-and-response
sourceTrack: netMaster
tags:
  [
    "ids",
    "ips",
    "siem",
    "xdr",
    "wazuh",
    "suricata",
    "snort",
    "mitre-attack",
    "cyber-kill-chain",
    "threat-intelligence",
    "ioc",
    "ttp",
    "network-monitoring",
    "detection-engineering",
    "nmap",
    "soc",
  ]
difficulty: medium
shortDescription: "A practical introduction to IDS, IPS and SIEM: how network traffic becomes an alert, how Snort and Suricata detect suspicious behavior, how Wazuh collects and correlates events, and how to analyze the result from both attacker and defender perspectives."
updatedAt: "2026-07-20"
---

# IDS, IPS and SIEM: from a single packet to a correlated incident

A network attack rarely looks like one obvious event.

An attacker may first scan a host, connect to an exposed service, send an unusual HTTP request, execute a command on the server, perform a DNS query, and finally establish communication with an external Command and Control server.

Each of these actions may be visible in a different place.

The firewall sees the connection. Suricata sees the packet contents. The operating system sees the process. The DNS server sees the domain. The Wazuh agent sees a file modification or a failed login. A SIEM tries to combine these observations into one story.

This is the most important thing to understand at the beginning: an IDS does not see the entire incident. It sees only one fragment of the activity.

A SIEM does not create knowledge from nothing either. If devices do not generate the right logs, system time is inconsistent, rules are poorly written, or nobody analyzes the alerts, even the best dashboard will not provide real detection capability.

Detection starts with telemetry.

## What are we actually trying to detect?

From the attacker’s perspective, an operation is a process.

First comes reconnaissance. Then target selection. Next comes an attempt to gain access, execute code, maintain access, move laterally, reach data, and perform the final action.

From the perspective of security systems, the same process appears as a collection of independent traces:

- connections to many ports,
- unusual packet sizes,
- a series of failed logins,
- execution of a command interpreter,
- suspicious DNS queries,
- registry modification,
- creation of a new service,
- traffic to an unknown domain,
- a sudden increase in HTTP requests,
- communication with an unusual geolocation,
- access to many resources within a short period of time.

Not all of these events must indicate an attack.

An administrator may run a network scan. An update service may connect to a new domain. An application may generate a large number of HTTP requests because of a bug.

That is why detection is not only about recognizing malicious strings. It is also about understanding context.

The simplest model looks like this:

```text
activity
    -> telemetry
        -> event
            -> detection rule
                -> alert
                    -> analysis
                        -> incident or false positive
```

## Event, alert and incident are not the same thing

An event can be any recorded activity.

Example:

```text
A user logged in to the system.
```

The login itself does not have to be suspicious. It is still information that may become useful during a later investigation.

An alert is created when an event or a group of events meets predefined conditions.

Example:

```text
Thirty failed login attempts occurred within one minute
from a single IP address.
```

An incident is a situation in which one or more events have an actual or potential negative impact on security.

Example:

```text
A successful login occurred after a series of failed attempts,
followed by the creation of a new administrative account and
the download of a large number of documents.
```

Not every alert is an incident.

An alert may be:

- a true detection of an attack,
- a true detection of legitimate administrative activity,
- a false positive,
- a duplicate of the same problem,
- the result of a configuration error,
- a symptom of an application failure,
- a signal that requires comparison with other data sources.

That is why the number of alerts is not a good measure of the quality of a security system.

A system that generates ten meaningful alerts may be more useful than a system that generates ten thousand notifications nobody investigates.

## IDS: a system that observes

An IDS, or Intrusion Detection System, analyzes activity and reports suspicious behavior.

For a network IDS, the data source is usually packets or complete network flows.

The system may analyze:

- source and destination addresses,
- ports,
- protocol,
- traffic direction,
- TCP flags,
- packet contents,
- HTTP request URIs,
- headers,
- DNS queries,
- event frequency,
- packet sizes,
- message sequence,
- protocol compliance,
- known exploit signatures,
- anomalies compared with normal activity.

A simplified flow looks like this:

```text
network traffic
    -> IDS
        -> rule analysis
            -> alert
```

An IDS usually operates passively. It receives a copy of the traffic, analyzes it, and generates events.

It may be connected to a SPAN port on a switch, a network TAP, or run directly on a host.

The most important characteristic of IDS mode is that a detection error should not stop production traffic. The system may generate an unnecessary alert, but the packet still reaches its destination.

This makes IDS mode a good starting point when deploying new rules.

## IPS: a system positioned in the traffic path

An IPS, or Intrusion Prevention System, analyzes activity in a similar way to an IDS, but it can also take action.

It most often operates inline, directly between the source and destination of communication.

```text
client
    -> IPS
        -> server
```

If a rule considers a packet or session malicious, the IPS may:

- drop the packet,
- terminate the TCP session,
- block an IP address,
- block a specific traffic pattern,
- rate-limit requests,
- forward the event to another system,
- trigger an additional response.

The simplest distinction is:

```text
IDS -> detects and reports
IPS -> detects, reports and may block
```

IPS mode provides stronger prevention capabilities, but it also increases operational risk.

A poorly written rule may block legitimate user traffic. A signature matching part of a URI may accidentally trigger on a valid application. An overly broad DNS rule may interrupt communication with a cloud service. Incorrect scan detection may block a monitoring system.

That is why rules should not be moved into blocking mode immediately.

A practical process looks better like this:

```text
1. Create the rule in alert-only mode.
2. Observe how it behaves in real traffic.
3. Analyze false positives.
4. Narrow the conditions.
5. Perform functional testing.
6. Only then move to blocking.
```

From a pentester’s perspective, this means the test does not end with the question: “Did the IDS see the payload?”

You should also verify:

- whether the alert contains enough context,
- whether it correctly identifies the source and destination,
- whether the signature is too broad,
- whether the rule can be bypassed easily,
- whether the system detects only one exact string,
- whether the response creates business disruption,
- whether an analyst can reconstruct the test sequence.

## SIEM: where separate traces begin to form a story

An IDS may report that a suspicious string appeared in HTTP traffic.

It may not know:

- which user generated the request,
- which process created the traffic,
- whether the host downloaded a suspicious file earlier,
- whether the account logged in from another country,
- whether system configuration changed shortly afterward,
- whether the same IP address attacked other devices,
- whether the domain had already been marked as malicious.

Additional data sources are required to answer those questions.

A SIEM, or Security Information and Event Management platform, collects logs and events from many systems, normalizes them, analyzes them, and attempts to correlate them.

Typical data sources include:

- Windows systems,
- Linux systems,
- domain controllers,
- firewalls,
- routers and switches,
- VPN servers,
- IDS and IPS platforms,
- EDR platforms,
- DNS servers,
- proxy servers,
- applications,
- databases,
- email systems,
- cloud services,
- authentication systems,
- vulnerability management systems.

A simplified flow looks like this:

```text
log sources
    -> collection
        -> parsing
            -> normalization
                -> rules
                    -> correlation
                        -> alert
                            -> SOC analysis
```

Parsing means recognizing the structure of a log entry.

If an application records:

```text
2026-07-20 18:10:15 LOGIN_FAILED user=admin src=10.10.10.23
```

The system should identify fields such as:

```text
timestamp = 2026-07-20 18:10:15
event = LOGIN_FAILED
user = admin
source_ip = 10.10.10.23
```

Normalization makes it possible to compare events from different systems.

One application may use `src`, another `source_ip`, and a third `clientAddress`. A SIEM should map them to the same meaning.

Only then does correlation become practical.

Example:

```text
Event 1:
Twenty failed VPN login attempts.

Event 2:
A successful login for the same user.

Event 3:
The login came from a country the user had never worked from before.

Event 4:
After logging in, the user accessed an administrative system.

Event 5:
PowerShell was launched on the workstation with an encoded command.
```

Individually, each event may have low or medium priority.

Together, they may indicate account compromise.

This is the core value of a SIEM: it does not merely store logs. It attempts to combine activity into scenarios.

## A SIEM does not fix weak telemetry

Deploying a SIEM does not automatically mean an organization has effective detection.

Problems often begin earlier:

- a system does not send the required logs,
- logs do not contain the source address,
- the username is missing,
- system time is not synchronized,
- data retention is too short,
- an application overwrites old files,
- only errors are logged, while user actions are ignored,
- an agent is installed but does not monitor the right directories,
- events are collected but no detection rules exist,
- rules exist but nobody tunes them,
- alerts reach a dashboard nobody watches.

That is why the first question when building detection should not be:

> What rule should I write?

A better question is:

> What data do I need in order to recognize this scenario at all?

## SIEM versus XDR

SIEM and XDR are often presented as competing solutions, but in practice their capabilities may overlap.

A SIEM focuses on collecting, storing, normalizing, and correlating data from many sources.

XDR, or Extended Detection and Response, usually combines telemetry from multiple security layers with the ability to respond directly.

It may cover:

- endpoints,
- network,
- email,
- identity,
- cloud,
- applications,
- threat intelligence.

A simplified distinction:

```text
SIEM
    -> collects and correlates a broad range of logs

XDR
    -> combines detection and response across multiple layers
```

The boundary is not always clear.

A modern SIEM may include automated response features. An XDR platform may store and correlate logs in a way similar to a SIEM.

That is why it is better not to judge a product by its marketing label alone.

More useful questions are:

- which sources does it support,
- whether the data is detailed enough,
- how the rules work,
- whether correlation is possible,
- whether the analyst receives sufficient context,
- which response actions are available,
- whether the complete timeline can be reconstructed.

## Wazuh as an event collection and analysis platform

Wazuh is an open-source platform that combines capabilities commonly associated with SIEM and XDR.

It can collect data from agents installed on hosts and from external log sources.

A typical architecture looks like this:

```text
endpoint
    -> Wazuh Agent
        -> Wazuh Server
            -> decoders
                -> rules
                    -> alerts
                        -> indexer
                            -> dashboard
```

The agent can monitor, among other things:

- system logs,
- Windows events,
- file changes,
- configuration,
- running processes,
- command output,
- vulnerabilities,
- host security posture.

Wazuh can also ingest data from other tools.

Example:

```text
network traffic
    -> Suricata
        -> eve.json
            -> Wazuh Agent
                -> Wazuh Server
                    -> alert
```

In this model, Suricata analyzes packets, while Wazuh collects the resulting event, performs further interpretation and correlation, and presents it to the analyst.

This distinction matters.

Wazuh does not have to inspect every packet itself. It can rely on a specialized network sensor that provides prepared telemetry.

## Snort and Suricata: similar purpose, slightly different ecosystems

Snort and Suricata are engines for detecting threats in network traffic.

Both can use rules that describe what to look for.

A rule may define:

- protocol,
- source address,
- source port,
- traffic direction,
- destination address,
- destination port,
- packet content,
- application protocol element,
- classification,
- identifier,
- rule revision.

The simplest rule model looks like this:

```text
action protocol source port -> destination port (options)
```

Example:

```text
alert icmp any any -> any any (msg:"PING detected"; sid:1000001; rev:1;)
```

The rule means:

```text
alert       -> generate an alert
icmp        -> inspect ICMP
any any     -> any source and port
->          -> traffic direction
any any     -> any destination and port
msg         -> alert message
sid         -> unique rule identifier
rev         -> rule revision
```

For ICMP, ports do not have their usual meaning, but the common rule syntax remains unchanged.

## Snort: the first custom rule

Snort can be installed from the system repository:

```bash
sudo apt update
sudo apt install snort
```

For Snort 3, a container image may also be used:

```bash
docker pull ciscotalos/snort3
```

Depending on the version and installation method, important files may exist in different locations.

For Snort 3, a typical configuration file is:

```text
/etc/snort/snort.lua
```

Local rules may be stored in files such as:

```text
local.rules
custom.rules
```

Network variables define what is considered internal and external traffic:

```text
HOME_NET
EXTERNAL_NET
HTTP_SERVERS
HTTP_PORTS
```

These are not merely cosmetic names.

If `HOME_NET` is configured incorrectly, the rule may inspect traffic in the wrong direction or fail to trigger entirely.

Example rule detecting a specific URI:

```text
alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (
    msg:"Probe to vulnerable endpoint detected";
    content:"/scripts/tools/newdsn.exe";
    http_uri;
    nocase;
    metadata:service http;
    classtype:web-application-activity;
    sid:1001024;
    rev:1;
)
```

Meaning of the most important elements:

```text
content
    -> the string being searched for

http_uri
    -> inspect the URI portion of the HTTP request

nocase
    -> ignore letter case

classtype
    -> event category

sid
    -> rule identifier

rev
    -> rule revision number
```

Run Snort on a selected interface:

```bash
sudo snort -i eth0 -c /etc/snort/snort.lua
```

Before starting detection, validate the configuration:

```bash
sudo snort -T -c /etc/snort/snort.lua
```

Configuration testing matters because a syntax error may prevent the entire engine from starting.

A custom rule should be tested in a controlled way.

For the HTTP rule, send a request such as:

```bash
curl "http://<TARGET_IP>/scripts/tools/newdsn.exe"
```

After the test, verify:

- whether Snort generated an alert,
- whether it identified the correct source address,
- whether the destination is visible,
- whether the message is understandable,
- whether the alert appears only for the expected request,
- whether a similar legitimate URI causes a false positive.

## Suricata: IDS, IPS and Network Security Monitoring

Suricata can operate as an IDS, IPS, and Network Security Monitoring engine.

In addition to alerts, it can generate detailed data about:

- connections,
- DNS,
- HTTP,
- TLS,
- files,
- flows,
- statistics,
- protocol anomalies.

Installation:

```bash
sudo apt update
sudo apt install suricata
```

The main configuration file is:

```text
/etc/suricata/suricata.yaml
```

Rules are usually located in:

```text
/etc/suricata/rules/
```

One of the most important output files is:

```text
/var/log/suricata/eve.json
```

`eve.json` stores events in JSON format.

This is practical because JSON is easy to:

- parse,
- filter,
- forward to a SIEM,
- process with scripts,
- analyze with `jq`.

## AF_PACKET and NFQUEUE

Suricata can operate in different modes.

In IDS mode, it often uses AF_PACKET.

Simplified:

```text
interface
    -> copy of traffic
        -> Suricata
            -> alert
```

Example execution:

```bash
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

In IPS mode, NFQUEUE can be used to pass traffic to Suricata through system firewall rules.

Simplified model:

```text
packet
    -> iptables/nftables
        -> NFQUEUE
            -> Suricata
                -> accept or drop
```

Example `iptables` rule:

```bash
sudo iptables -I FORWARD -j NFQUEUE --queue-num 0
```

Start Suricata:

```bash
sudo suricata -c /etc/suricata/suricata.yaml -q 0
```

Inline mode should be introduced carefully.

Before a rule starts blocking traffic, verify its behavior in alert-only mode.

## A custom Suricata rule

The simplest ICMP detection rule:

```text
alert icmp any any -> any any (
    msg:"LAB ICMP ping detected";
    sid:1000001;
    rev:1;
)
```

The rule may be stored in:

```text
/etc/suricata/rules/local.rules
```

Then make sure the file is loaded by `suricata.yaml`.

Test the configuration:

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

If the configuration is valid, perform a controlled test:

```bash
ping -c 1 <TARGET_IP>
```

View alerts:

```bash
sudo tail -f /var/log/suricata/fast.log
```

Or inspect `eve.json`:

```bash
sudo tail -f /var/log/suricata/eve.json
```

Filter only alert events:

```bash
jq 'select(.event_type=="alert")' /var/log/suricata/eve.json
```

Filter by rule identifier:

```bash
jq 'select(.alert.signature_id==1000001)' /var/log/suricata/eve.json
```

Display only essential fields:

```bash
jq 'select(.alert.signature_id==1000001) |
{
  timestamp,
  src_ip,
  dest_ip,
  proto,
  signature: .alert.signature,
  severity: .alert.severity
}' /var/log/suricata/eve.json
```

This shows the important difference between a raw log and useful information.

A complete JSON event may contain a lot of data. An analyst usually needs answers to a few basic questions first:

```text
When?
From where?
To where?
Using which protocol?
Which rule?
What severity?
```

## Integrating Suricata with Wazuh

The simplest integration is to configure the Wazuh agent to read `eve.json`.

Add the following to the agent configuration:

```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/suricata/eve.json</location>
</localfile>
```

The configuration is usually located in:

```text
/var/ossec/etc/ossec.conf
```

Restart the agent after making changes:

```bash
sudo systemctl restart wazuh-agent
```

Check the status:

```bash
sudo systemctl status wazuh-agent
```

The data flow then looks like this:

```text
traffic
    -> Suricata
        -> eve.json
            -> Wazuh Agent
                -> Wazuh Server
                    -> rule
                        -> dashboard
```

If an alert does not appear in Wazuh, inspect each layer instead of immediately writing a new rule.

First question:

```text
Did Suricata generate the event at all?
```

Check:

```bash
jq 'select(.event_type=="alert")' /var/log/suricata/eve.json | tail
```

Second question:

```text
Is the Wazuh agent running?
```

```bash
sudo systemctl status wazuh-agent
```

Third question:

```text
Can the agent read the file?
```

```bash
sudo -u wazuh test -r /var/log/suricata/eve.json && echo readable
```

Fourth question:

```text
Was the configuration loaded correctly?
```

```bash
sudo /var/ossec/bin/wazuh-control restart
```

Fifth question:

```text
Did the event reach the server but fail to match a rule?
```

Only after checking the whole pipeline can you identify which layer contains the problem.

## Integrating Snort with Wazuh

Snort can forward alerts to Wazuh in several ways.

Common approaches include:

- syslog,
- reading an alert file,
- Filebeat,
- custom decoders and rules.

Simplified flow:

```text
Snort
    -> file or syslog
        -> Wazuh Agent
            -> decoder
                -> rule
                    -> alert
```

A custom log format may require a decoder.

The decoder recognizes fields in an event.

The rule determines whether the event should generate an alert and what severity it should receive.

## Wazuh decoder and rule

These two components are easy to confuse.

A decoder answers:

```text
How should this log be read?
```

A rule answers:

```text
What does this log mean?
```

Example log:

```text
NMAP_PORT port=22 service=ssh host=10.10.10.20
```

A decoder may extract:

```text
nmap_port = 22
nmap_service = ssh
nmap_host = 10.10.10.20
```

A rule may then say:

```text
If the port is 22, generate a level 3 alert.
If a new unauthorized administrative port is detected,
generate a level 8 alert.
```

Custom rules are usually stored in:

```text
/var/ossec/etc/rules/local_rules.xml
```

Example rule for JSON data:

```xml
<group name="linux,nmap,">
  <rule id="100100" level="3">
    <decoded_as>json</decoded_as>
    <field name="nmap_port">.+</field>
    <field name="nmap_port_service">.+</field>
    <description>
      NMAP: Port $(nmap_port) - $(nmap_port_service)
    </description>
  </rule>
</group>
```

Custom rule identifiers should use the range reserved for local rules and should not conflict with system-provided rules.

After changing the configuration, run:

```bash
sudo /var/ossec/bin/wazuh-logtest
```

Paste a sample log and check:

- which decoder was used,
- which fields were extracted,
- which rule matched,
- what alert level was assigned.

`wazuh-logtest` is one of the most important tools when building detections.

Without it, rule development easily turns into trial and error with a full restart after every change.

## Automated Nmap as a data source for Wazuh

Nmap is usually associated with offensive scanning.

It can also serve a defensive control function.

A regular scan can help answer:

- whether a new host appeared,
- whether a new port was opened,
- whether a service changed since the previous scan,
- whether a device exposes an administrative panel,
- whether a port that should be closed is still reachable.

Installation:

```bash
sudo apt update
sudo apt install nmap
```

For a Python script:

```bash
pip3 install python-nmap
```

Example scan:

```bash
nmap -sV -Pn 10.10.10.0/24
```

The output can be converted to JSON and forwarded to Wazuh.

The agent may periodically run a command:

```xml
<localfile>
  <log_format>full_command</log_format>
  <command>python3 /home/<USERNAME>/nmapscan.py</command>
  <frequency>604800</frequency>
</localfile>
```

The value:

```text
604800
```

means seven days.

This mechanism does not replace a professional asset management platform or vulnerability scanner.

It can still detect basic changes in the attack surface.

The greatest value appears when the system alerts on change rather than on every open port.

Example:

```text
Previous scan:
22/tcp open ssh
443/tcp open https

New scan:
22/tcp open ssh
443/tcp open https
8080/tcp open http-proxy
```

A useful alert is not that port 22 still exists.

A useful alert is:

```text
A new port, 8080/tcp, appeared on host 10.10.10.20
and was not present in the previous scan.
```

This is the difference between collecting data and detecting change.

## Enriching alerts with external analysis

An alert may contain technical details while still being difficult to understand for the analyst.

Example:

```text
NMAP: Port 8080 - http-proxy
```

An enrichment system may add information such as:

- what the port is commonly used for,
- typical risks,
- whether the service should be exposed,
- which verification steps to perform,
- which evidence to collect before escalation.

An integration may forward the alert to an external API.

Example configuration:

```xml
<integration>
  <name>custom-chatgpt.py</name>
  <hook_url>https://api.openai.com/v1/chat/completions</hook_url>
  <api_key>YOUR_KEY</api_key>
  <level>5</level>
  <rule_id>100101</rule_id>
  <alert_format>json</alert_format>
</integration>
```

The integration script should have appropriate permissions:

```bash
sudo chmod 750 /var/ossec/integrations/custom-chatgpt.py
sudo chown root:wazuh /var/ossec/integrations/custom-chatgpt.py
```

The most important part is understanding the role of such an integration.

A language model should not be treated as the source of truth about an incident.

It may:

- summarize the alert,
- suggest analytical questions,
- organize the data,
- describe possible scenarios,
- help prepare a ticket entry.

It should not independently conclude:

```text
The host has been compromised.
```

A better result looks like this:

```text
A new port, 8080/tcp, was observed on host 10.10.10.20.
The service was identified as an HTTP proxy. Confirm whether it was
deployed as part of an approved change, identify the listening process,
and restrict network access if the service is not required.
```

Human verification is still required.

Before forwarding alerts to an external API, verify whether they contain:

- personal data,
- usernames,
- tokens,
- configuration fragments,
- customer data,
- document contents,
- confidential organizational information.

## IOC: a trace that can be searched for

An IOC, or Indicator of Compromise, is an observable value that may indicate compromise.

Examples include:

- IP address,
- domain,
- file hash,
- file path,
- process name,
- registry key,
- certificate,
- URL,
- unusual geolocation,
- characteristic User-Agent.

IOCs are useful because they can be searched for across the environment.

Example:

```text
Did any host connect to the domain evil-example.test?
```

Or:

```text
Does the hash of the investigated file appear on other endpoints?
```

The problem is that simple IOCs are easy to change.

An attacker may:

- change the IP address,
- register a new domain,
- modify a single byte of a file,
- rename a process,
- use a different path.

That is why detection based only on IOCs may lose effectiveness quickly.

## TTP: how the adversary operates

TTP stands for Tactics, Techniques and Procedures.

A tactic describes the adversary’s goal.

Example:

```text
Initial Access
```

A technique describes the general method used to achieve that goal.

Example:

```text
Phishing
```

A procedure describes the exact way a specific group or incident implements the technique.

Example:

```text
Sending a spear-phishing email containing a ZIP archive with a
shortcut file that launches PowerShell.
```

The model can be summarized as:

```text
Tactic
    -> what the attacker wants to achieve

Technique
    -> which class of action is used

Procedure
    -> how it was performed in this specific case
```

TTPs are harder to change than basic IOCs.

An attacker may replace a domain quickly, but still needs a way to:

- gain access,
- execute code,
- maintain persistence,
- obtain credentials,
- move through the network,
- exfiltrate data.

That is why behavior-based detections are often more resilient than rules checking a single hash.

## MITRE ATT&CK as a map of behavior

MITRE ATT&CK organizes tactics and techniques used by adversaries.

It is not a list of ready-made exploits.

It also does not automatically tell you how to configure a SIEM.

It is a map that helps:

- describe attacker behavior,
- connect detections with scenarios,
- identify monitoring gaps,
- build playbooks,
- compare tool capabilities,
- establish a common language between red and blue teams.

Example scenario:

```text
A user opens a malicious attachment.
    -> Initial Access

The attachment launches PowerShell.
    -> Execution

The script creates a scheduled task.
    -> Persistence

The process accesses credentials.
    -> Credential Access

The host connects to other systems over SMB.
    -> Lateral Movement

Data is sent over HTTPS.
    -> Exfiltration
```

For every technique, ask four questions:

```text
1. How does the attacker perform this action?
2. What traces does it leave?
3. Which data sources can record those traces?
4. How can we verify that the detection actually works?
```

Assigning a MITRE identifier to a rule does not automatically make the detection good.

A rule may formally map to a technique while detecting only a very narrow case.

Example:

```text
Technique:
Command and Scripting Interpreter: PowerShell

Weak detection:
Alert when command_line contains "Invoke-Mimikatz".

Better direction:
Analyze unusual PowerShell execution, Base64 encoding,
Internet downloads, parent-child relationships, and user context.
```

## Cyber Kill Chain: where are we in the attack sequence?

The Cyber Kill Chain presents an attack as a sequence of stages.

The classic model includes:

```text
1. Reconnaissance
2. Weaponization
3. Delivery
4. Exploitation
5. Installation or persistence
6. Command and Control
7. Actions on objectives
```

The model helps explain that an attack can be stopped at multiple stages.

Phishing example:

```text
Reconnaissance
    -> collecting information about employees

Weaponization
    -> preparing a document with a payload

Delivery
    -> sending the email

Exploitation
    -> opening the file and executing code

Persistence
    -> creating a scheduled task

C&C
    -> connecting to the attacker’s server

Actions
    -> stealing data
```

From a detection perspective, this means a single mechanism is not enough.

An email filter may detect delivery. EDR may detect code execution. IDS may observe C&C communication. A SIEM may connect all three events.

## The Pyramid of Pain as a detection mindset

Not all indicators have the same value.

At the bottom are elements that are easy for an attacker to change:

```text
file hash
IP address
domain
```

Higher up are:

```text
network artifacts
host artifacts
tools
TTPs
```

Changing a hash may require only a minor file modification.

Changing an entire operational method may be much harder.

This leads to a practical rule:

```text
IOCs help find a known threat.
TTPs help detect how the threat operates.
```

A good detection often combines both approaches.

Example:

```text
IOC:
connection to a known malicious domain

TTP:
a rare system process launches a script that communicates with
a newly registered domain and periodically sends small amounts of data
```

## Cyber Threat Intelligence

Cyber Threat Intelligence is the process of collecting, analyzing, and using information about threats.

It is not limited to copying IP addresses into a blocklist.

Good CTI analysis tries to answer:

- who may attack,
- which targets they choose,
- which techniques they use,
- which tools are characteristic,
- which sectors are exposed,
- which campaigns are active,
- which IOCs are related,
- which detections should be prepared.

CTI can operate at different levels.

Strategic CTI helps management understand risk and long-term trends.

Operational CTI describes campaigns, threat groups, and likely scenarios.

Tactical CTI focuses on TTPs.

Technical CTI includes specific IOCs such as domains, IP addresses, and hashes.

A practical process may look like this:

```text
campaign report
    -> identify TTPs
        -> map to MITRE ATT&CK
            -> determine required data sources
                -> build detection
                    -> test
                        -> monitor
```

Sources and platforms used during analysis may include:

- VirusTotal,
- ANY.RUN,
- AlienVault OTX,
- MalwareBazaar,
- Malpedia,
- URLScan,
- Censys,
- ZoomEye,
- AttackerkB,
- RansomLook,
- MISP,
- OpenCTI,
- SpiderFoot.

Each tool answers a slightly different question.

VirusTotal helps assess the reputation of files, domains, and addresses.

ANY.RUN lets analysts observe sample behavior in a sandbox.

Malpedia helps identify malware families.

MalwareBazaar provides samples and malware information.

MISP and OpenCTI help store, correlate, and share threat intelligence.

Censys and ZoomEye provide visibility into publicly exposed services and devices.

## An IOC without context can be dangerous

An IP address marked as malicious should not always be blocked automatically.

It may belong to:

- shared hosting,
- a CDN,
- a VPN service,
- cloud infrastructure,
- a security scanner,
- a legitimate analytical platform.

Likewise, a domain may change ownership or no longer be used by the attacker.

When analyzing an IOC, verify:

- the information source,
- the observation date,
- confidence level,
- campaign context,
- relevant time range,
- associated techniques,
- whether the indicator appears in your own environment.

A weak CTI alert says:

```text
Connection to a suspicious IP.
```

A better alert says:

```text
Host 10.10.10.25 connected to 203.0.113.55, an address linked to
an active malware campaign. The connection was made by powershell.exe,
which was launched by winword.exe five minutes after an attachment
was downloaded.
```

Context changes everything.

## Minimal IDS, Suricata and Wazuh laboratory

Do not begin with ten integrations at once.

A simple lab may consist of:

```text
Machine A:
Kali Linux or another testing host

Machine B:
Linux with Suricata and a Wazuh agent

Machine C:
Wazuh Server
```

The first goal is not to detect advanced malware.

The first goal is to verify the complete data flow.

### Step 1: check the interface

```bash
ip addr
ip route
```

### Step 2: start Suricata

```bash
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

### Step 3: add a simple ICMP rule

```text
alert icmp any any -> any any (
    msg:"LAB ICMP ping detected";
    sid:1000001;
    rev:1;
)
```

### Step 4: validate the configuration

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

### Step 5: send one packet

```bash
ping -c 1 <SURICATA_HOST>
```

### Step 6: confirm the alert locally

```bash
jq 'select(.alert.signature_id==1000001)' \
/var/log/suricata/eve.json
```

### Step 7: add `eve.json` to Wazuh

```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/suricata/eve.json</location>
</localfile>
```

### Step 8: restart the agent

```bash
sudo systemctl restart wazuh-agent
```

### Step 9: repeat the ping

```bash
ping -c 1 <SURICATA_HOST>
```

### Step 10: confirm the event in the dashboard

At this point, the simplest full pipeline exists:

```text
packet
    -> Suricata rule
        -> eve.json
            -> Wazuh agent
                -> Wazuh server
                    -> dashboard
```

Only after this flow works should you move to more complex HTTP, DNS, scan, or correlation rules.

## Detecting a simple scan

From the attacker’s perspective, port scanning is a way to build a map of services.

Example:

```bash
nmap -sS -Pn -p- <TARGET_IP>
```

From the defensive perspective, a single SYN packet is not enough to prove scanning.

You need to observe a pattern:

```text
one source address
    -> many ports
        -> short time window
            -> no completed sessions
```

The rule should consider frequency.

Example Suricata rule direction:

```text
alert tcp any any -> $HOME_NET any (
    msg:"LAB possible TCP SYN scan";
    flags:S;
    threshold:type both, track by_src, count 20, seconds 5;
    sid:1000002;
    rev:1;
)
```

Seeing an alert is not enough.

Check:

- whether a slower scan is still detected,
- whether monitoring systems create false positives,
- whether scanning one port across many hosts is visible,
- whether UDP scanning requires a separate rule,
- whether the source is identified correctly behind NAT,
- whether the threshold fits the environment.

This is the right way to think about detection: not only “Does the rule work?” but also “Under which conditions does it work, and when does it stop working?”

## How to analyze the result from a pentester’s perspective

During a security test, it is easy to stop at:

```text
Suricata generated an alert.
```

That is not enough.

A better analysis includes:

```text
Was the correct technique detected?
Did the alert appear quickly enough?
Did it contain source and destination addresses?
Could the analyst understand the purpose of the activity?
Was the event forwarded to the SIEM?
Was it correlated with host logs?
Was the response automated?
Could a small payload change bypass the rule?
```

Example result description:

```text
During a controlled port scan of host 10.10.10.20, Suricata
generated an alert identifying the tester’s source address, the
target address, and the SYN packet threshold violation. The event
was written to eve.json and forwarded to Wazuh. It was not correlated
with the later SSH login attempt, so both stages remained visible as
separate events.
```

This description shows both what worked and what should be improved.

## How to describe a detection problem in a report

Weak description:

```text
Wazuh does not work correctly.
```

Better description:

```text
During the test, a full TCP SYN port scan was performed against
host 10.10.10.20. Suricata correctly generated an event and wrote
it to eve.json. The event did not appear in Wazuh because the agent
was not configured to monitor /var/log/suricata/eve.json.
```

An even better description includes impact:

```text
Because the integration is missing, network alerts remain local to
the sensor and are not available in the central monitoring platform.
The SOC may therefore miss scanning, exploitation attempts, and
communication with suspicious addresses.
```

Recommendation:

```text
Add eve.json as a JSON source in the Wazuh agent configuration,
verify read permissions, perform a controlled test, and confirm
that the event is visible in the dashboard.
```

Retest:

```text
Repeat a limited TCP scan and confirm that the event is visible both
locally in eve.json and centrally in Wazuh, including the correct
source and destination addresses.
```

A good finding should include:

```text
condition
evidence
impact
recommendation
retest method
```

## Common problems when building detection

The first problem is missing traffic visibility.

Suricata may be listening on the wrong interface.

Check:

```bash
ip addr
sudo tcpdump -i eth0
```

If `tcpdump` does not see the traffic, Suricata will not see it either.

The second problem is an incorrect `HOME_NET` value.

Check the configuration:

```bash
grep -n "HOME_NET" /etc/suricata/suricata.yaml
```

The third problem is a rule that was not loaded.

Test:

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

The fourth problem is an `sid` conflict.

Every local rule should use a unique identifier.

The fifth problem is incorrect permissions for `eve.json`.

Check:

```bash
ls -l /var/log/suricata/eve.json
```

The sixth problem is lack of time synchronization.

Check:

```bash
timedatectl
```

If hosts use different times, correlation may make it look as if the response happened before the attack.

The seventh problem is an overly broad rule.

Example:

```text
alert tcp any any -> any 80
```

Such a rule may alert on almost all HTTP traffic.

The eighth problem is detecting one exact payload.

If a rule searches only for:

```text
<script>alert(1)</script>
```

Changing it to:

```text
<img src=x onerror=alert(1)>
```

may bypass detection.

The ninth problem is an alert without a response process.

Even a technically correct alert has limited value if nobody knows:

- who analyzes it,
- within what time,
- which data to check,
- when to escalate,
- how to close a false positive.

## Minimal workflow for building a rule

First, describe the scenario.

```text
I want to detect fast scanning of many TCP ports.
```

Then identify the data source.

```text
TCP packets visible to Suricata.
```

Next, define the observable pattern.

```text
Many SYN packets from one source to many ports
within a short period of time.
```

Then create a simple rule.

```text
alert tcp any any -> $HOME_NET any (
    msg:"Possible TCP SYN scan";
    flags:S;
    threshold:type both, track by_src, count 20, seconds 5;
    sid:1000002;
    rev:1;
)
```

Perform a controlled test:

```bash
nmap -sS -Pn -p 1-100 <TARGET_IP>
```

Check the result locally:

```bash
jq 'select(.alert.signature_id==1000002)' \
/var/log/suricata/eve.json
```

Then verify the result centrally in Wazuh.

Finally, perform negative tests:

```text
normal web browsing
host monitoring
slow scan
single-port scan
scan from another segment
```

Only then can the quality of the rule be evaluated.

## Key commands for quick review

Install Snort:

```bash
sudo apt update
sudo apt install snort
```

Test Snort configuration:

```bash
sudo snort -T -c /etc/snort/snort.lua
```

Run Snort:

```bash
sudo snort -i eth0 -c /etc/snort/snort.lua
```

Install Suricata:

```bash
sudo apt update
sudo apt install suricata
```

Test Suricata configuration:

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

Run Suricata in IDS mode:

```bash
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

View alerts:

```bash
sudo tail -f /var/log/suricata/fast.log
```

Filter JSON alerts:

```bash
jq 'select(.event_type=="alert")' /var/log/suricata/eve.json
```

Filter by `signature_id`:

```bash
jq 'select(.alert.signature_id==1000001)' \
/var/log/suricata/eve.json
```

Restart the Wazuh agent:

```bash
sudo systemctl restart wazuh-agent
```

Check agent status:

```bash
sudo systemctl status wazuh-agent
```

Test Wazuh rules:

```bash
sudo /var/ossec/bin/wazuh-logtest
```

Install Nmap:

```bash
sudo apt install nmap
```

Install the Python library:

```bash
pip3 install python-nmap
```

Basic service scan:

```bash
nmap -sV -Pn <TARGET_IP>
```

Full port scan:

```bash
nmap -sS -Pn -p- <TARGET_IP>
```

Inspect traffic on an interface:

```bash
sudo tcpdump -i eth0
```

Check system time:

```bash
timedatectl
```

## Mental shortcut

We do not begin detection engineering with the dashboard.

We begin with the attacker’s action.

First, we ask what the attacker wants to achieve. Then we consider which behavior they will perform, which traces it will leave, and which systems can record those traces.

Only then do we choose the tool.

Snort and Suricata analyze network traffic. Wazuh collects data from hosts and external sources. A SIEM correlates events. MITRE ATT&CK helps name the behavior. CTI adds context about campaigns, groups, and indicators. A human still has to decide whether the observed activity is really an incident.

From the red team perspective, it is not enough to say that the payload worked.

You need to verify what the IDS saw, which data reached the SIEM, whether events were connected, and whether the analyst could reconstruct the entire attack sequence.

From the blue team perspective, it is not enough to have an agent, a dashboard, and thousands of rules.

You need to know which behaviors are truly visible, where the gaps are, which alerts are valuable, and whether the team can respond effectively.

That is the difference between collecting logs and achieving real detection.
