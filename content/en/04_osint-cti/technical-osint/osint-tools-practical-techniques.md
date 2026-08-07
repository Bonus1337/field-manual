---
id: osint-tools-practical-techniques
title: "OSINT Tools and Practical Techniques"
team: red-blue
domain: osint-cti
section: technical-osint
type: knowledge
angle: osint-tools-techniques-workflow
sourceTrack: osint-sekurak
tags:
  [
    "osint",
    "google-dorking",
    "opsec",
    "metadata",
    "geolocation",
    "recon",
    "wayback-machine",
    "shodan",
    "censys",
    "reverse-image-search",
    "socmint",
  ]
difficulty: medium
shortDescription: "A practical introduction to OSINT: passive and active reconnaissance, environment preparation and OPSEC, advanced search techniques, people and company analysis, metadata, infrastructure, imagery, transport data, geolocation, documentation and information correlation."
updatedAt: "2026-08-07"
---

# OSINT Tools and Practical Techniques

OSINT, or Open Source Intelligence, is the process of collecting, analyzing and correlating information obtained from legally accessible open sources.

It is not a single tool, search engine or the ability to find social media profiles. It is a complete intelligence cycle that includes defining a question, collecting data, evaluating it, analyzing it, drawing conclusions and presenting the results.

The greatest value of OSINT does not come from the amount of information collected, but from the ability to connect seemingly unrelated pieces of data into one coherent picture.

---

## What OSINT Really Is

An information source can be almost any publicly accessible element:

- a search engine,
- a social media profile,
- a document published on a website,
- a job advertisement,
- a TLS certificate,
- website source code,
- an archived version of a website,
- a satellite image,
- an employee comment,
- a company review,
- a username,
- image metadata,
- ship or aircraft movement,
- a shadow visible in a photograph.

A single piece of information usually does not provide the full answer. Its value appears when it can be correlated with other sources.

Google Trends is a good example.

A sudden increase in searches for a particular phrase before a specific event may suggest that some users had access to certain information earlier.

The trend itself is not evidence of a leak, but it may become the starting point for further investigation.

The same logic has historically been used in intelligence analysis.

Instead of directly observing whether bridges had been successfully bombed, analysts could observe the prices of goods transported through those routes. If orange prices suddenly increased, it could indicate that transportation routes had been disrupted.

OSINT often works in exactly this way:

```text
We cannot observe the event directly
            ↓
We observe its consequences
            ↓
We correlate multiple indicators
            ↓
We build a hypothesis
```

---

## The Intelligence Cycle

Good reconnaissance begins with a question, not with launching a tool.

A simplified intelligence cycle looks like this:

```text
Question
   ↓
Collection plan
   ↓
Data gathering
   ↓
Source evaluation
   ↓
Analysis and correlation
   ↓
Reporting
   ↓
New questions
```

Before starting the investigation, determine:

- what exactly you are trying to establish,
- what information is required,
- which sources may contain it,
- which actions are allowed,
- whether the target may notice your activity,
- what level of confidence is required for the final conclusion.

Without a clearly defined intelligence question, OSINT can quickly turn into endless browsing.

You keep finding more information, but none of it actually helps answer the original question.

---

## Facts, Hypotheses and Evidence

One of the most important skills in OSINT is separating facts from assumptions.

```text
Fact:
A TLS certificate contains the hostname test.example.com.

Hypothesis:
A test environment may exist under that hostname.

Verification:
Check DNS, historical certificates, archives and service exposure.

Conclusion:
The hostname suggests a test environment, but the certificate
alone does not prove that the system still exists.
```

Metadata, filenames, timestamps, registry records and social media data should be treated as indicators.

They may be:

- outdated,
- incorrect,
- manipulated,
- associated with another person,
- automatically generated,
- taken out of context.

A good analyst does not pretend to know everything.

Instead, the analyst clearly distinguishes between:

```text
Confirmed fact

Likely conclusion

Working hypothesis

Unknown information
```

---

# Passive and Active OSINT: When Reconnaissance Starts Leaving Traces

## Passive OSINT

Passive OSINT focuses on gathering information without directly interacting with the investigated target.

Examples include:

- search engines,
- public registries,
- archived websites,
- TLS certificate databases,
- third-party aggregators,
- cached copies of websites.

The main objective is to reduce the number of direct connections between the analyst's environment and the target infrastructure.

Passive does not necessarily mean invisible.

It usually means that the target is not directly receiving requests from the analyst.

---

## Active OSINT

Active OSINT introduces direct interaction with the target or systems controlled by the target.

Examples may include:

- visiting the organization's website,
- opening a social media profile,
- liking content,
- sending a message,
- interacting with an account recovery mechanism,
- querying a service controlled by the target,
- contacting someone by phone or email.

Active techniques can provide more accurate or current information, but they also increase the risk of detection.

They may additionally change the target's behavior.

The decision to move from passive to active reconnaissance should therefore be made deliberately.

---

# Documenting OSINT: Finding Information Is Only Half the Work

The Internet is not a permanent source of information.

A website can change.

A post can disappear.

An account can be removed.

A search result can no longer exist the next day.

Important information should therefore be preserved when it is discovered.

Useful evidence should include:

- full URL,
- date and time of access,
- screenshot,
- local copy of the document,
- source name,
- context in which the information was found,
- short explanation of why the information matters.

Useful tools may include:

- Hunchly,
- Obsidian,
- XMind,
- Markdown notes,
- saved HTML pages,
- screenshots,
- screen recording,
- local evidence repositories.

Mind maps are especially useful for visualizing relationships.

```text
Person
├── Name
├── Usernames
├── Email addresses
├── Phone numbers
├── Social media
├── Companies
├── Locations
└── Related people
```

Every meaningful piece of information should have a source.

Otherwise, after several hours of analysis, it becomes difficult to reconstruct where a conclusion originated.

---

# Wayback Machine: Deleted Information Does Not Always Disappear

The Wayback Machine stores historical versions of websites.

It can help identify:

- previous versions of websites,
- deleted pages,
- historical contact information,
- old documents,
- changes in organizational structure,
- content removed after an incident.

Snapshots may also be created manually.

This allows researchers to preserve a website at a specific point in time.

However, archived copies are not always complete.

Dynamic content, external scripts, authentication-protected resources and some media files may not be preserved.

---

## Third-Party Website Copies

If directly visiting a website is undesirable, third-party services may sometimes be used to retrieve:

- screenshots,
- PDFs,
- previews,
- website technology information,
- archived copies.

This does not mean the target receives no traffic.

It simply means that the request originates from the third-party service rather than from the analyst's system.

This distinction matters when evaluating operational exposure.

---

# OPSEC in OSINT: How Not to Expose Yourself During Reconnaissance

OSINT tooling can only protect the analyst to a certain extent.

Operational mistakes are often more dangerous than technical ones.

Before starting reconnaissance, consider preparing a separate working environment.

This may include:

- a dedicated virtual machine,
- a separate browser profile,
- a dedicated system account,
- separate email addresses,
- isolated working documents,
- disabled personal account synchronization,
- controlled cookies and local storage,
- a deliberately chosen network path.

Platforms such as Kali Linux, Tsurugi or CSI Linux provide many useful tools, but specialized environments can also stand out.

An unusual combination of:

- browser extensions,
- operating system characteristics,
- headers,
- screen resolution,
- browser configuration,
- behavior

may contribute to browser fingerprinting.

For higher levels of separation, environments such as:

- Tails,
- Whonix,
- Tor Browser,
- disposable virtual machines,
- live USB operating systems

may be considered.

---

## VPN Does Not Equal Anonymity

A VPN primarily changes where your traffic exits to the Internet.

It does not automatically make the user anonymous.

Identification may still occur through:

- cookies,
- active sessions,
- browser fingerprinting,
- DNS configuration,
- logged-in accounts,
- browser extensions,
- device characteristics,
- application behavior,
- operational mistakes.

A VPN effectively shifts trust.

Instead of trusting the local ISP or network operator, you now also trust the VPN provider.

The correct solution therefore depends on the threat model.

Reading public registries requires a different level of OPSEC than investigating a target that may actively attempt to identify researchers.

---

# Alternative Identities in OSINT

An alternative profile, often referred to as a sockpuppet, is a separated identity used during reconnaissance.

Its purpose is to prevent OSINT activity from being linked directly to the analyst's real identity.

Avoid reusing:

- personal email addresses,
- personal phone numbers,
- familiar usernames,
- profile images used elsewhere,
- account recovery data,
- browsers containing personal sessions,
- recognizable writing patterns,
- predictable activity schedules.

Usernames are particularly important.

A seemingly harmless nickname may reveal:

- hobbies,
- employer,
- birth year,
- gaming identity,
- previous accounts,
- geographic origin.

A random identity does not have to look like:

```text
d7f9441bff1e482cab89836c6488b94a
```

It should simply avoid direct connections to the real analyst.

---

## AI-Generated Identities

AI-generated images can make alternative profiles more convincing.

Modern generators can create realistic:

- faces,
- full-body images,
- backgrounds,
- multiple angles.

However, generated identities may still contain artifacts.

Analysts verifying suspicious accounts should look for:

- incorrect fingers,
- inconsistent teeth,
- unnatural backgrounds,
- asymmetric accessories,
- impossible reflections,
- repeated facial patterns,
- reused generated identities.

The situation is constantly changing.

Image generators improve rapidly, while detection tools attempt to catch up.

---

# Tools Are Less Important Than Technique

OSINT tools appear and disappear very quickly.

A service that works today may tomorrow:

- shut down,
- become paid,
- restrict its API,
- require authentication,
- stop returning useful results,
- become blocked by the platform it analyzes.

This is why methodology matters more than memorizing tools.

For every tool, understand:

- what data you are trying to obtain,
- where the tool gets that data,
- whether the same information can be obtained manually,
- what alternative sources exist,
- how the result can be verified.

Useful tool directories include:

- OSINT Framework,
- Otwarte Źródła,
- OSINT Techniques,
- Malfrat's OSINT Map.

A personal tool collection should ideally be organized by purpose rather than by product name.

```text
usernames/
emails/
domains/
companies/
images/
metadata/
maps/
archives/
transport/
infrastructure/
```

---

# Bookmarklets: Small Automation Inside the Browser

A bookmarklet is a browser bookmark containing JavaScript instead of a normal URL.

Bookmarklets can automate repetitive OSINT actions such as:

- extracting image URLs,
- copying links,
- searching selected text,
- extracting email addresses,
- opening multiple search engines,
- processing visible website content.

Example:

```javascript
javascript: (() => {
  document.querySelectorAll("img").forEach((image) => {
    console.log(image.src);
  });
})();
```

This prints the source URL of every image on the current page.

Another example can search selected text:

```javascript
javascript: (() => {
  const query = window.getSelection().toString().trim();

  if (!query) {
    alert("Select text first.");
    return;
  }

  window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank");
})();
```

Because bookmarklets execute JavaScript in the context of the current page, unknown bookmarklet code should never be executed without first reviewing it.

---

# Google Dorking: Ask the Search Engine Better Questions

Good search technique is more valuable than dozens of random tools.

Search engines support operators that allow queries to become significantly more precise.

---

## Exact Phrase

Quotation marks force an exact phrase search.

```text
"Stefan Nowak"
```

Useful for searching:

- names,
- document fragments,
- email addresses,
- error messages,
- unique statements,
- copied content.

---

## Excluding Results

The minus operator removes unwanted results.

```text
"article fragment" -site:sekurak.pl
```

This can help identify copies of text published outside the original domain.

---

## Limiting Search to a Domain

```text
OSINT site:sekurak.pl
```

The `site:` operator restricts results to a specific domain.

It can be combined with other operators.

```text
site:example.com filetype:pdf
site:example.com "confidential"
site:example.com inurl:backup
```

---

## Searching Page Titles

```text
intitle:"index of"
intitle:webcam
```

The `intitle:` operator searches for terms appearing in the page title.

---

## Searching Page Content

```text
intext:"index of"
intext:"login successful"
```

The `intext:` operator searches within page content.

---

## Searching URLs

```text
inurl:admin
inurl:backup
inurl:index.php
```

The `inurl:` operator searches for patterns appearing in URLs.

---

## Searching Specific File Types

```text
filetype:pdf
filetype:docx
filetype:xlsx
filetype:csv
```

Example:

```text
site:example.com filetype:xlsx
```

This may reveal publicly indexed spreadsheets associated with an organization.

---

## Wildcards

The asterisk can replace an unknown part of a phrase.

```text
"Stefan * Nowak"
```

This may match:

- middle names,
- nicknames,
- additional identifiers.

---

## Logical Operators

```text
"Jan Kowalski" AND Warsaw

"Jan Kowalski" OR "Jan Nowak"
```

More complex searches can be grouped:

```text
("Jan Kowalski" OR "J. Kowalski")
AND
(Warsaw OR "Nowy Dwór")
```

Do not rely on a single search engine.

Google, Bing and Yandex maintain different indexes and implement different search features.

No result in Google does not mean the information does not exist.

---

# Google Trends as an Intelligence Source

Google Trends shows the relative popularity of search queries over time and across regions.

It may help analyze:

- increased interest in an event,
- geographical differences,
- public response to a publication,
- timing of emerging topics,
- unusual search activity.

A spike before information becomes publicly known may be interesting.

It is not automatically proof of prior knowledge.

Alternative explanations may include:

- media coverage,
- influencer activity,
- local events,
- automated traffic,
- unrelated meaning of the same term,
- sampling artifacts.

Trends should therefore be treated as an indicator rather than definitive evidence.

---

# People OSINT: Turning Small Clues Into a Profile

Searching for a person often begins with only a few identifiers:

- full name,
- username,
- email address,
- phone number,
- photograph,
- employer,
- location.

Each identifier should be expanded into alternative forms.

For example:

```text
Jan Kowalski
J. Kowalski
Kowalski Jan
Jan-Kowalski
jkowalski
j.kowalski
jan.kowalski
kowalski.jan
```

Consider:

- nicknames,
- middle names,
- missing diacritics,
- reversed order,
- numbers,
- initials,
- aliases.

Simple scripts or username generators can automate the creation of permutations.

---

# Username OSINT: One Nickname Can Connect Multiple Identities

The same username may appear on many services.

Tools such as What's My Name can automate username searches across multiple platforms.

However, a matching username does not automatically mean that the accounts belong to the same person.

Profiles should be compared using additional indicators:

- profile image,
- account age,
- location,
- writing style,
- interests,
- languages,
- activity hours,
- linked accounts,
- posted content.

The more unique the username, the stronger the correlation may become.

A common username produces significantly more false positives.

Account age may also be useful.

If an account was created twenty years ago, it cannot belong to a fifteen-year-old user.

---

# Email OSINT: From Company Domain to Employee Address

Email addresses may be identified through:

- company websites,
- public documents,
- professional profiles,
- source-code repositories,
- leaked data,
- corporate email patterns,
- certificates,
- advertisements.

Services such as Hunter.io may reveal existing addresses and identify common email naming conventions.

Example pattern:

```text
first initial + surname
```

For Jan Kowalski:

```text
jkowalski@example.com
```

Other common conventions:

```text
jan.kowalski@example.com
j.kowalski@example.com
kowalski.jan@example.com
jan@example.com
jan-kowalski@example.com
```

Generated addresses still require verification.

Organizations may contain several people with identical names and therefore append:

- numbers,
- additional initials,
- department identifiers.

---

# Google Accounts as Correlation Points

An email address may be associated with a Google account even when it does not use the `gmail.com` domain.

Depending on the public exposure of the account and the service being analyzed, it may sometimes reveal:

- profile name,
- profile picture,
- account identifiers,
- public reviews,
- Google-related activity.

Google Maps reviews may provide hints about:

- frequently visited locations,
- interests,
- geographical patterns.

However, a review does not prove that the person lives nearby or visited the location at the time the review was published.

Such conclusions require additional evidence.

---

# Phone Number OSINT

Phone numbers may appear in:

- advertisements,
- documents,
- business cards,
- company profiles,
- directories,
- social media posts,
- caller identification databases,
- public address books.

Search all common formats.

```text
+48 123 456 789
48123456789
123456789
123-456-789
123 456 789
```

Users sometimes replace textual labels with emojis:

```text
📞 123 456 789
☎ 123 456 789
```

Searching only for:

```text
phone
tel
mobile
```

may therefore miss relevant results.

---

# Reverse Image Search: One Image Can Lead to an Entire Story

Different image search engines are useful for different purposes.

---

## Google Lens

Google Lens performs well at:

- object recognition,
- OCR,
- text translation,
- location identification,
- logo recognition,
- product identification,
- identifying parts of buildings or landmarks.

A specific region of an image can be selected and searched independently.

This is often more useful than searching the entire photograph.

---

## Yandex Images

Yandex may perform well when searching for:

- visually similar faces,
- similar compositions,
- rotated images,
- modified images,
- content associated with Eastern European platforms.

---

## TinEye

TinEye is mainly useful for finding:

- exact image copies,
- older versions,
- modified copies,
- original publication sources,
- reused images.

It is primarily a reverse image search engine rather than a semantic visual analysis system.

---

## Face Search

Dedicated facial search engines compare facial characteristics rather than complete image similarity.

A facial match should not be treated as definitive proof of identity.

Additional indicators should always be used.

---

# Dark Web in OSINT: Anonymity, Environment and the False Sense of Security

The visible Internet indexed by ordinary search engines is only part of the overall network.

The concepts should be separated carefully.

### Surface Web

Publicly accessible resources indexed by normal search engines.

### Deep Web

Resources that search engines cannot or should not index.

Examples include:

- authenticated applications,
- private databases,
- internal search interfaces,
- unlinked content,
- dynamic resources.

### Darknet

A separate network that requires special software or configuration.

### Dark Web

Resources hosted inside a darknet.

Tor is one example of a darknet, but it is not the only one.

Dark web search engines usually have significantly smaller indexes.

Services frequently:

- disappear,
- change addresses,
- become inaccessible,
- move between mirrors.

This makes traditional indexing significantly more difficult.

When investigating such environments, isolated systems become especially important because operators may intentionally attempt to identify or compromise visitors.

---

# Company OSINT: Organizations Leave Traces Far Beyond Their Websites

Company analysis should include both official and unofficial sources.

Useful sources include:

- business registries,
- websites,
- financial reports,
- job advertisements,
- employee profiles,
- procurement documents,
- social media,
- conference presentations,
- office photographs,
- employee reviews,
- TLS certificates,
- domains and subdomains.

Public registries may reveal:

- owners,
- directors,
- beneficiaries,
- related companies,
- historical changes,
- shared addresses,
- people appearing across multiple organizations.

Visualizing these relationships may reveal patterns that are difficult to identify when reviewing documents manually.

---

# Job Posting OSINT: A Job Advertisement as a Technology Map

Job advertisements often expose more technical information than official company documentation.

They may reveal:

- operating systems,
- cloud providers,
- databases,
- programming frameworks,
- networking technologies,
- security products,
- CI/CD systems,
- vendors,
- upcoming migrations.

Example:

```text
Required experience:

AWS
Kubernetes
Jenkins
PostgreSQL
FortiGate
```

Possible hypotheses:

```text
The organization likely uses AWS.

It may operate containerized infrastructure.

Jenkins may be part of its CI/CD pipeline.

PostgreSQL may be used internally.

Fortinet products may be deployed.
```

These are hypotheses.

The advertisement may:

- be outdated,
- apply to only one department,
- describe a planned technology rather than an existing one.

---

# Employee and Customer Reviews as OSINT Sources

Review platforms may reveal:

- manager names,
- department structures,
- internal processes,
- used systems,
- office locations,
- vendors,
- work schedules,
- organizational conflicts,
- recent changes.

However, reviews are inherently biased.

People are more likely to publish reviews when they are either extremely satisfied or extremely dissatisfied.

Treat such data as supporting intelligence rather than as definitive evidence.

---

# Predictable URLs as an OSINT Technique

Some resources are not linked anywhere but follow predictable URL patterns.

Example:

```text
https://example.com/reports/2026-07.pdf
```

Possible variants:

```text
https://example.com/reports/2026-06.pdf
https://example.com/reports/2026-08.pdf
https://example.com/reports/2025-07.pdf
```

Other predictable patterns may involve:

- document identifiers,
- image numbers,
- dates,
- language codes,
- image resolutions,
- backup filenames.

A resource that is publicly accessible but unlinked may still be discoverable.

---

# robots.txt: The File That Sometimes Reveals What Was Supposed to Stay Hidden

The `robots.txt` file informs search-engine crawlers which paths should not be indexed.

Standard location:

```text
https://example.com/robots.txt
```

Example:

```text
User-agent: *
Disallow: /admin/
Disallow: /backup/
Disallow: /internal/
```

`Disallow` is not an access-control mechanism.

It only asks compliant crawlers not to index the specified resource.

The file may accidentally reveal:

- administrative panels,
- backup directories,
- testing environments,
- internal sections,
- legacy applications,
- interesting endpoints.

Resources should be protected using authentication, authorization and proper server configuration rather than by relying on `robots.txt`.

---

# Shodan and Censys: Search Engines for Infrastructure Instead of Websites

Platforms such as Shodan, Censys and ZoomEye index Internet-facing services rather than traditional webpage content.

They may reveal:

- IP address,
- open ports,
- banners,
- software versions,
- TLS certificates,
- hostnames,
- location,
- screenshots,
- device type.

Depending on the available filters, researchers may discover:

- cameras,
- routers,
- servers,
- administrative panels,
- industrial systems,
- IoT devices,
- remote-access services.

The important distinction is that the result represents the state observed by the search engine's scanner.

The target may since have:

- changed,
- moved,
- been updated,
- disappeared entirely.

---

# Certificate Transparency: Subdomains Hidden in Public Logs

Publicly trusted TLS certificates are recorded in Certificate Transparency logs.

These logs can reveal hostnames for which certificates were issued.

Examples:

```text
vpn.example.com
mail.example.com
test.example.com
backup.example.com
dev-api.example.com
```

CT data may help identify:

- subdomains,
- test environments,
- historical infrastructure,
- naming conventions,
- external providers.

A certificate entry does not prove that the host currently exists.

It may be:

- historical,
- internal,
- temporary,
- never publicly exposed.

---

# Website Source Code as an OSINT Source

A website may expose valuable information directly in its source code.

Basic access methods include:

```text
F12
Ctrl+U
```

Source code may contain:

- developer comments,
- API endpoints,
- analytics identifiers,
- file paths,
- hidden interface elements,
- environment names,
- configuration data,
- library versions,
- references to external services.

Browser developer tools can additionally reveal:

- network requests,
- JavaScript files,
- media resources,
- cookies,
- local storage,
- API responses,
- dynamically loaded data.

Editing HTML or CSS through DevTools only modifies the local browser representation.

It does not change the remote server.

However, it can reveal information that has merely been visually hidden while still being present in the DOM.

---

# Metadata: Information Users Often Do Not Know They Publish

Metadata describes properties of a file and how it was created.

It may contain:

- author,
- username,
- organization name,
- creation time,
- modification time,
- device model,
- editing software,
- GPS coordinates,
- local file paths,
- printer names,
- operating-system information.

ExifTool can be used to inspect metadata.

```bash
exiftool evidence.jpg
```

For documents:

```bash
exiftool report.docx
```

For entire directories:

```bash
exiftool -r ./documents/
```

Metadata may help answer questions such as:

- when was the file created,
- what device created it,
- what software processed it,
- whether it was modified,
- whether its stated date is consistent with its internal properties.

Metadata is not immutable evidence.

Most fields can be modified or removed.

Social media platforms also frequently strip EXIF data from uploaded photographs.

Never assume that metadata is either always preserved or always removed.

---

# FOCA and Organizational Document Analysis

FOCA can automate searching for documents associated with a target domain and extracting their metadata.

Potential findings may include:

- usernames,
- applications,
- Office versions,
- printers,
- directory paths,
- computer names,
- document authors.

Organizations should periodically perform the same analysis against their own public documents.

Anything publicly visible can potentially be used by an external analyst.

---

# AIS and Maritime OSINT

Ships broadcast positional data through AIS.

Platforms such as MarineTraffic may provide information about:

- current position,
- declared destination,
- expected arrival,
- historical movement,
- vessel characteristics.

AIS data should not automatically be treated as ground truth.

It may be:

- disabled,
- manipulated,
- incorrectly received,
- retransmitted,
- associated with the wrong vessel.

Position should therefore be correlated with other evidence.

Useful sources may include:

- satellite imagery,
- port observations,
- crew photographs,
- nearby vessel activity,
- receiver range,
- travel-time calculations.

If AIS shows a ship in one location but satellite imagery shows no ship there, a hypothesis of incorrect or manipulated positioning becomes reasonable.

---

# ADS-B and Aviation OSINT

Aircraft transmit information through systems such as ADS-B.

Potential data sources include:

- Flightradar24,
- ADS-B Exchange,
- local SDR receivers.

Collected information may include:

- position,
- altitude,
- speed,
- heading,
- flight number,
- route,
- aircraft type.

A local receiver allows researchers to observe nearby aircraft without being completely dependent on commercial platforms.

The absence of an aircraft from one website does not prove that the aircraft is not transmitting.

Individual services may:

- filter data,
- hide particular aircraft,
- lack receiver coverage,
- process information differently.

---

# Maps and Satellite Imagery

Useful geospatial sources may include:

- Google Maps,
- Google Street View,
- Google Earth Pro,
- Mapillary,
- Sentinel Hub,
- social-media imagery,
- commercial satellite providers.

Google Earth Pro can provide:

- historical imagery,
- distance measurement,
- area measurement,
- directional analysis,
- elevation context.

Mapillary may contain street-level images from locations poorly covered by Google Street View.

Sentinel imagery can provide relatively recent observations over large areas, although at lower resolution than commercial high-resolution satellite products.

---

# Geolocation: How Small Details Reveal Where a Photo Was Taken

Geolocation attempts to determine where an image or video was recorded.

Useful indicators include:

- road signs,
- language,
- alphabet,
- phone-number formatting,
- Internet domains,
- license plates,
- driving side,
- architecture,
- vegetation,
- road surface,
- utility poles,
- shop signage,
- weather,
- terrain,
- mountains,
- coastlines,
- vehicle models,
- satellite dishes,
- shadows.

The process should move from broad classification to precise location.

```text
Continent
   ↓
Country or region
   ↓
City
   ↓
Street
   ↓
Specific building
```

Example reasoning:

```text
Arabic script visible
        ↓
Right-hand traffic
        ↓
Modern architecture
        ↓
Arid environment
        ↓
Specific license plate format
```

No single clue must provide the answer.

Several independent clues can gradually reduce the possible search area.

---

# Indoor Geolocation

Images taken inside buildings can also reveal location.

Useful indicators may include:

- view through a window,
- furniture arrangement,
- electrical outlets,
- heating systems,
- fire-safety signs,
- local-language instructions,
- hotel logos,
- furniture patterns,
- carpets,
- architectural elements.

Hotel booking websites may provide room photographs that can be compared against a target image.

Potential matches can include:

- furniture,
- room layout,
- window placement,
- decorative elements,
- external views.

---

# Chronolocation: When Shadows, Weather and the Environment Reveal Time

Geolocation answers:

```text
Where?
```

Chronolocation attempts to answer:

```text
When?
```

Useful indicators may include:

- shadow direction,
- shadow length,
- Sun position,
- Moon phase,
- star positions,
- historical weather,
- vegetation,
- snow cover,
- event posters,
- transportation schedules,
- construction progress,
- historical Street View imagery.

A shadow depends on:

- geographic location,
- date,
- time,
- object height,
- orientation.

If the location and approximate object dimensions are known, shadow analysis may help determine whether the claimed time is plausible.

Chronolocation often narrows a time window rather than identifying an exact minute.

---

# Google Maps as a Physical-Security OSINT Source

Public mapping imagery may reveal:

- entrances,
- gates,
- parking areas,
- blind spots,
- fences,
- camera placement,
- service doors,
- delivery areas,
- department labels,
- windows.

Historical Street View imagery may show how infrastructure changed over time.

Organizations should periodically review their own physical exposure from the perspective of a remote external observer.

---

# OSINT and Social Engineering: Good Phishing Starts Before the Email Is Sent

Open-source intelligence can be used to build believable pretexts.

Potentially useful information includes:

- employee names,
- department structure,
- vendor names,
- technologies,
- project names,
- recent outages,
- scheduled training,
- manager names,
- communication style.

Compare:

```text
Generic phishing:

Your account will be suspended.
```

with:

```text
Context-aware phishing:

Following yesterday's Novum migration,
your token must be reactivated before 12:00.
```

The second message is more convincing because it contains information that matches the recipient's real environment.

From a defensive perspective, organizations should perform OSINT against themselves to understand what information could be weaponized against employees.

---

# Analyzing Your Own Exposure

One of the best beginner OSINT exercises is investigating yourself.

Check:

- which profiles are publicly discoverable,
- whether usernames are reused,
- where your private email appears,
- whether your phone number is indexed,
- which photographs are searchable,
- whether documents expose metadata,
- what professional profiles reveal,
- whether locations can be reconstructed,
- what information exists in archives.

The objective is not simply to practice tools.

The real lesson is understanding how many small pieces of information can be combined into a surprisingly detailed profile.

---

# Practical OSINT Workflow

## Define the Objective

```text
What exactly am I trying to determine?

What confidence level do I need?

What actions are within scope?
```

---

## Collect Initial Identifiers

```text
Name

Username

Email

Phone number

Domain

Company

Image

Location
```

---

## Perform Broad Discovery

```text
Search engines

Registries

Social media

Archives

Documents
```

---

## Pivot Between Identifiers

```text
Email
   ↓
Profile
   ↓
Image
   ↓
Username
   ↓
Other platforms
```

or:

```text
Company
   ↓
Domain
   ↓
Certificates
   ↓
Subdomains
   ↓
Technologies
```

or:

```text
Image
   ↓
Text
   ↓
Location
   ↓
Maps
   ↓
Historical data
```

---

## Verify Important Findings

A meaningful conclusion should ideally be supported by more than one independent source.

The more important the claim, the stronger the verification process should be.

---

## Document Everything

Record:

- evidence,
- source,
- timestamp,
- method of discovery,
- relationship to the hypothesis.

---

## Report With Confidence Levels

Separate:

```text
Confirmed facts

Probable conclusions

Unverified hypotheses

Unknowns and limitations
```

---

# Common OSINT Mistakes

## Falling in Love With the First Hypothesis

Once an analyst forms an early theory, it becomes easy to interpret every new finding as confirmation.

This is confirmation bias.

Always actively search for evidence that disproves your hypothesis.

---

## Treating a Username as a Unique Identifier

Two accounts with the same username do not necessarily belong to the same person.

Correlation requires additional indicators.

---

## Treating Metadata as Absolute Proof

Metadata can be modified.

Treat it as evidence that requires context.

---

## Depending on a Single Tool

Any tool may return:

- incomplete results,
- outdated data,
- false positives,
- incorrect associations.

Important findings should be independently verified.

---

## Failing to Document Sources

A finding without a source quickly loses investigative value.

---

## Mixing Research Identity With Personal Identity

One forgotten login session or reused username may reveal the analyst.

---

## Forgetting the Difference Between Passive and Active OSINT

Some actions that appear harmless still generate direct interaction with the target.

Know when your reconnaissance starts producing observable traffic.

---

## Collecting Too Much Data

Large amounts of information do not automatically produce good intelligence.

The important question is:

```text
Does this information help answer the intelligence requirement?
```

If not, it may simply be noise.

---

# Key Takeaways

OSINT is primarily a thinking process supported by tools.

The correct order is:

```text
Question
   ↓
Sources
   ↓
Collection
   ↓
Verification
   ↓
Correlation
   ↓
Conclusion
```

A single result is usually just an indicator.

Reliable conclusions emerge when multiple independent sources support the same hypothesis.

Important information should be archived when discovered.

Metadata, profiles, infrastructure data and geolocation indicators can all be incorrect, manipulated or outdated.

The absence of information may itself become an indicator, but it must be interpreted carefully.

The best way to improve at OSINT is through repeated investigation, documenting mistakes, questioning assumptions and constantly practicing correlation between different sources.

The most important OSINT tool is not a search engine, framework, script or commercial platform.

It is the analyst's ability to ask the right question and connect the right pieces of information.
