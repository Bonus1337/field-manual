---
id: network-infrastructure-wifi-security-av-edr-introduction
title: "Wi-Fi Security and AV/EDR Basics: from radio frames to the first testing workflow"
team: red-blue
domain: network-infrastructure
section: wireless-security
type: knowledge
angle: wifi-recon-attack-surface-and-defensive-awareness
sourceTrack: netMaster
tags:
  [
    "wifi",
    "wireless-security",
    "802.11",
    "monitor-mode",
    "aircrack-ng",
    "airodump-ng",
    "wpa2",
    "wep",
    "wps",
    "evil-twin",
    "pmkid",
    "wpa2-enterprise",
    "edr",
    "antivirus",
    "pentest",
    "recon",
  ]
difficulty: medium
shortDescription: "A practical introduction to Wi-Fi security: how radio communication works, how managed mode differs from monitor mode, what wireless network reconnaissance looks like, what the typical attack classes are against WEP, WPA2-PSK, WPS, Evil Twin, and WPA2 Enterprise, and how to think about them from a defensive and AV/EDR perspective."
updatedAt: "2026-05-30"
---

# Wi-Fi Security and AV/EDR Basics: from radio frames to the first testing workflow

Wi-Fi looks simple from a user’s perspective: you choose a network name, enter a password, and after a moment you have Internet access. From a security tester’s perspective, however, much more is happening underneath. A device does not “magically” find networks. It listens for radio frames, looks for known network names, responds to access point messages, negotiates connection parameters, authenticates, and only then starts transferring data.

This is the most important thing to understand at the beginning: a Wi-Fi pentest does not start with password cracking. It starts with understanding what is flying through the air.

In wired networks, we often think in terms of host, port, service, banner, version, and vulnerability. In Wi-Fi, we think a little differently: channel, BSSID, ESSID, client, access point, security type, management frames, handshake, PMKID, WPS, Evil Twin, and deauthentication. It is still reconnaissance, but the transmission medium is not a cable. It is radio.

## What do we actually see during Wi-Fi testing?

A Wi-Fi network is communication based on the 802.11 family of standards. A client, such as a laptop or phone, is often called a STA. An access point is an AP. The network has a human-readable name, called the ESSID, and a technical identifier of the access point, called the BSSID, which is usually the MAC address of the AP radio.

In practice, during reconnaissance we want to answer a few questions.

What networks are within range? Which channels are they using? What security mechanisms do they have? Are they open networks, WPA2-PSK, WPA2 Enterprise, WPA3, or maybe something old like WEP? Are there connected clients? Is the network broadcasting its name, or is it trying to hide it? Does the access point have WPS enabled? Is a client leaking its previously saved networks through probe requests?

It sounds like a lot, but it comes down to a simple pattern:

first we observe what is in the air, then we classify the security mechanisms, and only after that do we choose the testing technique.

## Managed mode versus monitor mode

A regular Wi-Fi card usually works in managed mode. This is the normal operating mode where the card connects to one access point and exchanges data with it. For everyday use, this is enough.

For Wi-Fi testing, however, we need something different: monitor mode. In this mode, the card does not behave like a regular client connected to a single network. It starts passively listening to radio frames in the surrounding area. This allows us to observe beacons, probe requests, probe responses, association attempts, EAPOL frames, and other elements of 802.11 communication.

Without monitor mode, most classic Wi-Fi pentesting techniques simply will not work.

Basic interface check:

```bash
iwconfig wlan0
```

Enable monitor mode with `airmon-ng`:

```bash
sudo airmon-ng start wlan0
```

After this operation, the interface often appears as `wlan0mon`.

Check it:

```bash
iwconfig wlan0mon
```

Disable monitor mode:

```bash
sudo airmon-ng stop wlan0mon
```

Alternatively, you can try to manually change the interface mode:

```bash
sudo ip link set wlan0 down
sudo iwconfig wlan0 mode monitor
sudo ip link set wlan0 up
```

In practice, at the beginning it is always worth checking two things: whether the system sees the card, and whether the card actually supports monitor mode. The fact that a Wi-Fi card is present in the system does not automatically mean it is suitable for wireless testing.

## First reconnaissance of local networks

After enabling monitor mode, the first step is listening to the area. We do not attack. We do not disconnect clients. We do not try to crack passwords. First, we build a map.

```bash
sudo airodump-ng wlan0mon
```

The output will show, among other things:

- BSSID, the technical identifier of the access point,
- ESSID, the network name,
- channel,
- signal strength,
- encryption type,
- information about clients,
- number of data frames,
- potential handshakes if they are observed.

If we are interested in a specific access point, we narrow the observation down to the BSSID and channel:

```bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF wlan0mon
```

If there are several access points nearby with the same or similar name, we can filter by ESSID:

```bash
sudo airodump-ng -c 6 --essid-regex "lab" wlan0mon
```

This is the Wi-Fi equivalent of a basic `nmap -sV`: the point is not exploitation yet, but understanding the target.

## A hidden network does not mean an invisible network

Many people believe that hiding the SSID provides real security. In practice, it is more like obscurity than protection. A network may not broadcast its name in beacons, but its name can appear at other moments of communication, for example when a client tries to connect to it.

If a client has a saved network, it may send probe requests. In simple terms, such a message means: “is my known network somewhere nearby?”. This can reveal the names of networks that the device has connected to before.

Practical observation of probe requests:

```bash
sudo airodump-ng wlan0mon --write probe_requests
```

The defensive conclusion is simple: hiding the SSID does not replace strong WPA2/WPA3, a good password, and proper client configuration.

## Wi-Fi security types from a tester’s perspective

Not every network is tested in the same way. First, we need to identify the security mechanism.

An open network does not require a password for the connection itself. It often has a captive portal, meaning a login page or terms acceptance page. The risk here is not “cracking the Wi-Fi password”, because there is no password. The risks are sniffing, fake portals, Man in the Middle attacks, poor client isolation, and phishing.

WEP is an old, practically dead standard. If it appears anywhere, it should be treated as a critical configuration issue. WEP is based on mechanisms that have been considered insufficient for years. In practice, the test involves collecting enough frames and recovering the key.

WPA/WPA2-PSK is the classic variant with one shared password used by users. The most common workflow involves capturing a 4-way handshake or PMKID, and then attempting an offline dictionary attack against the password.

WPA2 Enterprise, sometimes described as WPA2-MGT, uses an external authentication server, usually RADIUS. Here we are not testing a simple “Wi-Fi password”, but the whole user authentication process, certificates, server validation, EAP methods, and susceptibility to Evil Twin attacks.

WPA3 is a newer standard and significantly improves some of the problems known from WPA2-PSK. This does not mean, however, that every WPA3 implementation and configuration is automatically secure. With WPA3, configuration details, backward compatibility, and specific implementations matter.

## WEP: an example of an old mechanism that should not exist

WEP is a good example of the fact that “encryption” does not always mean security. A network may formally require a key, but if the cryptographic mechanism is weak, an attacker may recover it from traffic.

Capturing frames from a specific WEP network:

```bash
sudo airodump-ng wlan0mon --bssid AA:BB:CC:DD:EE:FF -c 6 -w wep_dump
```

In some lab scenarios, collecting IVs can be accelerated by replaying traffic:

```bash
sudo aireplay-ng -3 -b AA:BB:CC:DD:EE:FF -h 11:22:33:44:55:66 wlan0mon
```

Attempt to recover the key:

```bash
aircrack-ng wep_dump-01.cap
```

From a reporting perspective, WEP should not be described as a “weak password”. The problem is the mechanism itself. The recommendation is simple: fully disable WEP and migrate to WPA2/WPA3 with a strong configuration.

## WPA2-PSK and the 4-way handshake

WPA2-PSK is much stronger than WEP, but it has one important characteristic: if an attacker captures authentication material, they can attempt to crack the password offline. Offline means that the rest of the attack no longer requires contact with the access point. The speed depends on the attacker’s hardware and the quality of the password.

Capture the handshake:

```bash
sudo airodump-ng wlan0mon --essid-regex "lab" -w handshake
```

In practice, the target is often narrowed down by BSSID and channel:

```bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w handshake wlan0mon
```

If a client reconnects to the network, `airodump-ng` may show information about a captured handshake. In the session materials, the expected message was shown as:

```text
[ handshake found at XX:XX:XX:XX:XX:XX ]
```

After obtaining the `.cap` file, we can perform a dictionary attack:

```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b AA:BB:CC:DD:EE:FF handshake-01.cap
```

Alternatively, hashcat can be used. In a newer workflow, we first convert the file into a format supported by hashcat:

```bash
hcxpcapngtool -o wpa2_hash.hc22000 handshake-01.cap
```

Then we run the dictionary attack:

```bash
hashcat -m 22000 wpa2_hash.hc22000 /usr/share/wordlists/rockyou.txt
```

The most important thing: this test does not “break WPA2” as a standard. It tests the strength of a specific PSK password. If the password is long, random, and unique, a dictionary attack may be impractical. If the password looks like a company name with a year and an exclamation mark, the problem is real.

## Deauthentication: forcing a new handshake

If a client is already connected to the network, the tester may want to observe the moment of reauthentication. In labs, deauthentication frames are used for this. They disconnect the client from the AP and often cause the client to reconnect automatically.

Sending broadcast deauth frames:

```bash
sudo aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF wlan0mon
```

Attempt to disconnect a specific client:

```bash
sudo aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon
```

Pay attention to the number of packets. Many cheatsheets use `--deauth 0`, which means continuous sending. In working notes and labs, it is better to use a limited number of frames, such as `5` or `10`, so the test is controlled and easier to describe in a report.

Defensively, it is worth knowing that classic deauth frames are part of the 802.11 management layer. Protection against some of these attacks can be provided by Protected Management Frames, or 802.11w, if the devices and configuration support it.

## PMKID: handshake without waiting for a client

In some configurations, an access point may reveal PMKID. In the materials, PMKID was described as a field related to the 4-way handshake, returned in specific AP configurations, for example with 802.11r fast roaming. For a tester, this means an interesting scenario: sometimes it is possible to obtain material for an offline attack without waiting for a client and without deauthentication.

Example PMKID capture:

```bash
sudo hcxdumptool -o pmkid_hcxdumptool.pcap -i wlan0mon --enable_status=1 --filterlist_ap=mac_list.txt --filtermode=2
```

Conversion to hashcat format:

```bash
hcxpcapngtool -o pmkid.16800 -E ssids.txt -I info.txt pmkid_hcxdumptool.pcap
```

Dictionary attack:

```bash
hashcat -m 16800 pmkid.16800 /usr/share/wordlists/rockyou.txt
```

In practice, `wifite` is also a convenient tool that automates part of the workflow:

```bash
sudo wifite
```

In the report, it is worth separating two things: obtaining the PMKID and the effectiveness of password cracking. Obtaining the material does not yet mean gaining access. Access depends on the quality of the PSK.

## WPS: small PIN, big problem

WPS was supposed to make users’ lives easier. Instead of typing a long password, they could use a PIN or press a button on the router. The problem is that WPS in PIN mode significantly lowers the cost of attack.

Checking APs with WPS:

```bash
sudo wash -i wlan0mon
```

Example tools for WPS testing in a lab:

```bash
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv
```

or:

```bash
sudo bully wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -v 3
```

From a defensive recommendation perspective, the safest approach is to disable WPS, especially PIN mode. A strong WPA2/WPA3 password loses its value if there is a second, weaker entry mechanism into the same network.

## Evil Twin: when the problem is not cryptography, but user trust

Evil Twin is a fake access point imitating a legitimate network. The attacker does not necessarily need to break WPA2 immediately. They can try to create a familiar-looking network, convince the user to connect, display a captive portal, collect credentials, or perform a Man in the Middle attack in poorly secured scenarios.

Simple example of a fake AP:

```bash
sudo airbase-ng -e "FreeHotelWiFi" -c 6 wlan0mon
```

For more advanced lab scenarios, tools such as Airgeddon can be used:

```bash
sudo airgeddon
```

or Wifiphisher:

```bash
sudo wifiphisher
```

Example captive portal phishing in a lab:

```bash
sudo wifiphisher -aI wlan0mon --essid "FreeWiFi" --phishing-payload simple-login
```

In practice, Evil Twin clearly shows the difference between “protocol security” and “security of the whole process”. Even if WPA2 is configured correctly, a user may be convinced to connect to a network that only looks similar.

## Karma, Mana, and Known Beacons

Devices often remember networks they have connected to before. This list of known networks is sometimes called the Preferred Network List. If a client actively asks in the air for known networks, an attacker may try to respond: “yes, I am that network”.

This is the idea behind Karma/Mana attacks.

Simple example:

```bash
sudo airbase-ng -P -C 30 wlan0mon
```

Wifiphisher can run similar techniques in the background:

```bash
sudo wifiphisher -aI wlan0mon -jI wlan4 -p firmware-upgrade
```

Known Beacons involves creating many popular network names, for example names of cafes, airports, or hotels:

```bash
sudo wifiphisher -kB
```

For a beginner, the most important conclusion is this: the device also talks. Not only the AP broadcasts a network. The client may also reveal what it expects from its surroundings.

## WPA2 Enterprise: when we attack the authentication process

WPA2 Enterprise differs from WPA2-PSK because there is no single shared password for everyone. Authentication is delegated to a RADIUS server. In practice, the user logs in with their username and password, certificate, or another method depending on the EAP configuration.

This gives much stronger defensive possibilities, but only when the configuration is correct. If the client does not validate the server certificate, it may connect to a fake AP. If weaker authentication methods are allowed, downgrade attempts or credential material capture may be possible.

A tool often used in WPA2 Enterprise labs is EAPhammer.

Generating a fake certificate:

```bash
./eaphammer --cert-wizard
```

Starting a fake AP for WPA2 Enterprise:

```bash
sudo eaphammer --interface wlan0 --essid "SEKURAK" --creds --channel 6 --wpa2 --auth wpa-eap --internet-interface eth0
```

Example downgrade attempt:

```bash
sudo eaphammer --auth wpa-eap --interface wlan0 --creds --essid "SEKURAK" --negotiate gtc-downgrade
```

In a report from such a test, it is not enough to write “a fake AP was started”. What matters more is whether the client accepted the fake certificate, whether the user received a warning, whether credentials were disclosed, and what configuration made this possible.

## WPA3: a newer standard, but not a magic shield

WPA3 improves many problems known from WPA2-PSK. One particularly important improvement is moving away from the simple model where a captured handshake allows massive offline password guessing in the same way as WPA2-PSK.

This does not mean that WPA3 ends Wi-Fi testing. The following still matter:

mixed mode WPA2/WPA3 configuration, password quality, client and AP implementations, vulnerabilities in specific hardware, downgrade, Evil Twin, Enterprise configuration, and user behavior.

In practice, during WPA3 security testing it is worth checking not only the “WPA3” label in the configuration, but also compatibility mode and the real behavior of clients.

## Additional techniques worth knowing

Beacon Flooding involves flooding the area with a large number of fake SSIDs. It can be used to test device resilience, analyze client behavior, or demonstrate chaos in the radio environment.

```bash
sudo mdk3 wlan0mon b -f ssid_list.txt -c 6
```

SSID cloaking and hidden network fingerprinting:

```bash
sudo airodump-ng wlan0mon --ignore-negative-one
```

Saving probe requests for later analysis:

```bash
sudo airodump-ng wlan0mon --write probe_requests
```

These techniques are not always the “main vulnerability”, but they help understand the environment. In a good pentesting workflow, small reconnaissance observations often lead to the right attack scenario.

## Minimal Wi-Fi testing workflow in a lab

At the beginning, it is not worth jumping between all tools at once. It is better to follow a simple process.

First, make sure the card works and supports monitor mode:

```bash
iwconfig wlan0
sudo airmon-ng start wlan0
iwconfig wlan0mon
```

Then perform general reconnaissance:

```bash
sudo airodump-ng wlan0mon
```

Next, choose a specific target and narrow the observation:

```bash
sudo airodump-ng -c <CHANNEL> --bssid <AP_MAC> -w capture wlan0mon
```

Then classify the security mechanism:

```text
OPN        -> open network / captive portal / MITM risk
WEP        -> vulnerable historical mechanism
WPA2-PSK   -> handshake / PMKID / password quality
WPS        -> check whether PIN is active
WPA2-MGT   -> RADIUS / EAP / certificates / Evil Twin
WPA3       -> configuration mode, mixed mode, implementation
```

Only after this classification do you choose the testing technique. Otherwise, testing turns into randomly launching tools.

## How to think about results in a report

In Wi-Fi testing, it is easy to overdo the technical description and forget about impact. A report should not sound like: “aircrack-ng and hashcat were run”. Those are only tools.

A better description says:

Authentication material for the `<ESSID>` WPA2-PSK network was captured in the form of a 4-way handshake. A controlled dictionary attack was then performed, confirming that the network password exists in a popular wordlist. This means that a person within radio range of the network may gain access to the infrastructure without administrator interaction.

Or:

An active WPS PIN was detected on the access point. This mechanism significantly lowers the network’s resistance to attacks because it allows testing a short PIN instead of the actual, stronger WPA2-PSK password. Full WPS disablement is recommended.

Or:

The test client accepted a fake WPA2 Enterprise access point without proper server certificate validation. In this scenario, an attacker may impersonate the corporate network and attempt to capture user credentials.

A good finding should include: condition, evidence, impact, recommendation, and retest method.

## AV/EDR basics: why does this fit with Wi-Fi?

At first glance, Wi-Fi and EDR look like two different worlds. Wi-Fi concerns network access, while EDR concerns endpoints. In practice, they are connected.

If a Wi-Fi attack succeeds, the attacker may get closer to internal resources. If Evil Twin or a captive portal works, the user may enter credentials or download a malicious file. If a corporate device connects to an uncontrolled network, the endpoint becomes the first line of defense.

Antivirus and EDR try to answer the question: what happens on the device after a user, application, or process does something risky?

Classic antivirus is historically associated with detecting files based on signatures. If a file matches a known malware pattern, it is blocked or quarantined.

A more modern approach looks wider. EDR analyzes process behavior, parent-child relationships, executed commands, registry modifications, network connections, code injection attempts, unusual PowerShell usage, persistence creation, credential dumping, or communication with suspicious domains.

For a pentester, this means one thing: it is not enough to think “does the payload work?”. You need to think “what will the endpoint see along the way?”.

For a defender, it means the opposite: it is not enough to have an EDR agent. You need to know which behaviors should be visible in detection and whether the alerts are understandable for the team.

## A simple AV/EDR model

You can think about AV/EDR in several layers.

The first layer is the file. Is the file known? Does it have a bad reputation? Does its hash appear in threat databases? Does it contain suspicious sections, macros, a packer, or unusual imports?

The second layer is the process. What was executed? By whom? With what arguments? Did Word launch PowerShell? Did the browser run a binary from a temporary directory? Is a system process behaving differently than usual?

The third layer is behavior. Is the process trying to gain persistence? Is it touching LSASS? Is it scanning the network? Is it dumping memory? Is it encrypting a large number of files? Is it opening suspicious outbound connections?

The fourth layer is correlation. A single action may look harmless. But a chain of events such as file download, PowerShell execution, connection to an unusual domain, SMB share enumeration, and an attempt to access credentials already creates a strong signal.

This is the difference between a simple antivirus and a meaningful endpoint detection and response approach.

## How to connect Wi-Fi with blue team thinking

From the defensive side, a Wi-Fi test should not end with the information that a password was cracked. You need to ask more questions:

Does an unauthorized device, after connecting to Wi-Fi, get access to the production segment? Is client isolation enabled? Is the guest VLAN separated from corporate resources? Do DHCP, DNS, and firewall logs record new devices? Does EDR see suspicious behavior after an endpoint connects to a foreign network? Are users vulnerable to fake captive portals? Do devices validate the certificate in WPA2 Enterprise?

This is the red-blue mindset. Red team shows the entry path. Blue team checks where detection signals should appear and how to limit the impact.

## Recommendations that most often come back after Wi-Fi testing

Usually, it is not about one magic fix. Wi-Fi security consists of several layers.

WEP should be completely removed. WPS, especially PIN mode, should be disabled. WPA2-PSK should use long, random, and unique passwords. Guest networks should be separated from internal networks. For organizations, a better direction is WPA2/WPA3 Enterprise with proper certificate validation. Clients should have automatic connection to unnecessary networks disabled. Devices should support Protected Management Frames where possible. Logs from Wi-Fi controllers, DHCP, DNS, firewalls, and EDR should be correlated.

A good Wi-Fi configuration does not assume that “nobody knows the password”. It assumes that someone may be within radio range and may try different entry paths.

## Key commands for quick review

Check interface mode:

```bash
iwconfig wlan0
```

Start monitor mode:

```bash
sudo airmon-ng start wlan0
```

Stop monitor mode:

```bash
sudo airmon-ng stop wlan0mon
```

General reconnaissance:

```bash
sudo airodump-ng wlan0mon
```

Listen to a specific AP:

```bash
sudo airodump-ng -c <CHANNEL> --bssid <AP_MAC> -w capture wlan0mon
```

Attempt WPA2 handshake cracking with aircrack-ng:

```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b <AP_MAC> capture-01.cap
```

Convert to hashcat format for WPA2:

```bash
hcxpcapngtool -o wpa2_hash.hc22000 capture-01.cap
```

Hashcat WPA2:

```bash
hashcat -m 22000 wpa2_hash.hc22000 /usr/share/wordlists/rockyou.txt
```

WPS scan:

```bash
sudo wash -i wlan0mon
```

WPS test:

```bash
sudo reaver -i wlan0mon -b <AP_MAC> -vv
```

Evil Twin - simple AP:

```bash
sudo airbase-ng -e "FreeHotelWiFi" -c 6 wlan0mon
```

Wifiphisher:

```bash
sudo wifiphisher
```

EAPhammer - certificate wizard:

```bash
./eaphammer --cert-wizard
```

EAPhammer - fake WPA2 Enterprise AP:

```bash
sudo eaphammer --interface wlan0 --essid "SEKURAK" --creds --channel 6 --wpa2 --auth wpa-eap --internet-interface eth0
```

## Mental shortcut

We do not test Wi-Fi starting from a payload. We test it starting from the air.

First, we observe which frames are visible. Then we identify networks, clients, and security types. Only later do we choose the technique: WEP, handshake, PMKID, WPS, Evil Twin, WPA2 Enterprise, or WPA3 configuration analysis.

And once we find an entry path, we do not stop at “it worked”. We ask what it means for the organization: whether an attacker can enter the network, whether they can see internal resources, whether the endpoint detects them, whether EDR generates a meaningful alert, and whether the administrator can reconstruct the entire event path.

That is the difference between clicking tools and performing a real security test.
