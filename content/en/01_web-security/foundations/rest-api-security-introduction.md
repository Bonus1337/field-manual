---
id: rest-api-security-introduction
title: "REST API Security: where a regular web application ends and API problems begin"
team: red-blue
domain: web-security
section: foundations
type: knowledge
angle: api-security-mindset
sourceTrack: baw
tags:
  [
    "api-security",
    "rest-api",
    "http-methods",
    "method-override",
    "content-type",
    "json",
    "xml",
    "yaml",
    "api-keys",
    "webhooks",
    "authentication",
    "authorization",
    "access-control",
    "recon",
  ]
difficulty: medium
shortDescription: "An introduction to REST API security: how APIs differ from classic web applications, why HTTP methods, alternative paths, data formats, documentation, API keys and webhooks can create vulnerabilities, and how to approach API testing from a security perspective."
updatedAt: "2026-05-18"
---

# REST API Security: where a regular web application ends and API problems begin

## Why I am writing this note

REST APIs are very easy to treat as “just a backend for the frontend”.

There are endpoints, JSON, tokens, HTTP methods and some documentation. At first glance, it looks simple. The problem starts when the application no longer has one visible interface, but dozens or hundreds of entry points that accept data in different places, through different methods and sometimes in several formats.

In a classic web application, the user usually clicks a form, a link or a button. In an API, a user, mobile application, frontend, external integration or another system sends direct HTTP requests.

For a security tester, this means one thing: **the graphical interface is no longer the boundary of the application**.

The real application starts where the API starts.

## REST API is still a web application

The easiest way to think about a REST API is as a web application organized around a specific structure.

Instead of classic pages, we have resources:

```http
GET /api/users/123
GET /api/orders/555
POST /api/products
DELETE /api/comments/10
```

Instead of HTML forms, we usually have JSON data:

```json
{
  "email": "user@example.com",
  "role": "user"
}
```

Instead of clicking a button, we have an HTTP request sent by a frontend, mobile app, API client or integration.

It is still web security. SQL Injection, Cross-Site Scripting, Server-Side Request Forgery, Path Traversal, access control issues, session problems, information leaks and poorly handled errors can still appear.

The difference is that APIs usually have more input chaos.

Parameters can be in the URL, in the path, in headers, in cookies, in JSON, XML, YAML, form parameters or in some unusual format that nobody on the team remembers anymore.

## First trap: HTTP methods do not always mean the same thing

In theory, HTTP methods have clear meanings.

`GET` retrieves data.

`POST` usually creates something or performs an action.

`PUT` often updates or replaces a resource.

`PATCH` performs a partial update.

`DELETE` removes a resource.

The problem is that real applications are not always consistent. One API may use `PUT` to create a resource, another one to update it. One API may treat `POST` as object creation, another one as any business operation.

For a tester, the most important thing is not what the method “should” do according to documentation.

The most important thing is **what the backend actually does**.

A simple thinking model:

```http
GET /api/users/123
```

Tester’s questions:

Can I change `123` to another user’s ID?

Does the endpoint require authentication?

Does the endpoint verify authorization to this specific resource?

Does it work only with `GET`, or also with another method?

Will `POST /api/users/123` behave differently?

Will `PUT /api/users/123` allow me to modify data?

Does `DELETE /api/users/123` exist even though the frontend never uses it?

In API testing, we do not test only parameters.

We also test the method, data format, headers, alternative paths and framework behavior.

## HTTP method override

One of the more interesting issues in REST APIs is the ability to override the HTTP method.

Sometimes infrastructure, proxy, application firewall or an old client allows only `GET` and `POST`. To still support `PUT`, `PATCH` or `DELETE`, the application may support mechanisms such as:

```http
X-HTTP-Method-Override: PUT
```

or:

```http
X-HTTP-Method: DELETE
```

or a parameter:

```http
POST /api/posts/123?_method=DELETE
```

At the application level, this can mean:

“Technically, a POST request arrived, but treat it as DELETE.”

This becomes dangerous if different layers of the application understand the same request differently.

For example, the firewall sees:

```http
POST /api/posts/123
```

but the application interprets it through the header as:

```http
DELETE /api/posts/123
```

It gets even worse if access control checks one method, while business logic executes another.

### Minimal Burp test

In Repeater, take a normal API request and add the header:

```http
X-HTTP-Method-Override: DELETE
```

Example:

```http
POST /api/resource/123 HTTP/1.1
Host: target.local
Content-Type: application/json
X-HTTP-Method-Override: DELETE

{}
```

The goal is not to immediately delete data.

At the beginning, we observe:

Does the response status change?

Does the error message change?

Does the application return a different code, such as `403`, `404`, `405` or `500`?

Does the endpoint start behaving as if it accepted another method?

Does the response reveal information about supported methods?

If one layer of the application says “method not allowed”, while another starts executing business logic, we have a strong signal for further testing.

## Alternative paths to the same function

One of the most important API security rules is:

**Protected data and operations should be reached through one well-verified access control path.**

The problem begins when the same operation can be reached in multiple ways.

Example:

```http
GET /api/users/123
```

but the application also supports:

```http
GET /api/v1/users/123
GET /internal_api/users/123
POST /api/users/get
POST /?rest_route=/api/users/123
GET /api/users?id=123
GET /api/users/123.json
```

From the backend perspective, this may sometimes be the same function.

From a security perspective, these may be different paths, different middleware, different filters, different access control and different bugs.

That is why API testing must not stop at one address.

If the frontend uses:

```http
GET /api/products/10
```

it is worth checking whether variants exist:

```http
GET /api/products?id=10
GET /api/v1/products/10
GET /api/products/10.json
GET /api/products/10.xml
POST /api/products/10
POST /api/products?id=10
```

Not because every one of them must work.

But because sometimes the one that nobody tested anymore still works.

## API reconnaissance

APIs are often not immediately visible on the page.

They can be used by the frontend, mobile application, admin panel, external integration or an old system that still works because nobody wants to touch it.

First places worth checking:

JavaScript sources:

```bash
grep -R "api" .
grep -R "internal" .
grep -R "graphql" .
grep -R "swagger" .
grep -R "token" .
```

Mobile application files after decompilation.

HTTP response headers.

Swagger/OpenAPI documentation.

Hidden directories.

Subdomains.

Old API versions.

Common documentation paths:

```text
/swagger
/swagger-ui
/swagger-ui.html
/api-docs
/v2/api-docs
/v3/api-docs
/openapi.json
/openapi.yaml
/docs
/redoc
/api/jsonws
```

API documentation is not a vulnerability by itself. It is often meant to be public.

But from a tester’s perspective, it is a map.

It shows endpoints, parameters, data types, sometimes user roles, old functions, unfinished modules and methods that the frontend does not normally use.

## Debug mode and excessive errors

An API running in debug mode can reveal a lot.

Not only a classic stack trace, but also:

file paths,

class and method names,

framework,

library versions,

supported endpoints,

parameter names,

backend structure,

configuration fragments,

and sometimes even secrets or environment data.

Warning sign example:

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "No route matches /api/user/test",
  "available_routes": [
    "/api/user/{id}",
    "/api/user/{id}/orders",
    "/api/user/{id}/admin-notes"
  ]
}
```

For a developer, this is a helpful error.

For an attacker, this is free documentation.

During testing, it is worth intentionally sending slightly broken requests:

```http
GET /api/does-not-exist HTTP/1.1
Host: target.local
```

```http
POST /api/users HTTP/1.1
Host: target.local
Content-Type: application/json

{"broken":
```

We observe whether the API responds with a safe message, or starts guiding us through the application structure.

## Data format is also an attack surface

In REST APIs, we usually see JSON.

But that does not mean the backend accepts only JSON.

The application may also support:

```http
Content-Type: application/xml
Content-Type: text/xml
Content-Type: application/yaml
Content-Type: application/x-yaml
Content-Type: application/x-www-form-urlencoded
Content-Type: multipart/form-data
Content-Type: application/vnd.php.serialized
```

This is very important, because different parsers have different vulnerability classes.

JSON can lead to deserialization issues or unsafe object mapping.

XML can lead to XXE, Server-Side Request Forgery, local file read or Denial of Service.

YAML can lead to deserialization and code execution if the application uses an unsafe parser.

Data format is not cosmetics.

Sometimes it is a completely different processing path on the server side.

### Simple Content-Type test

If the normal request looks like this:

```http
POST /api/profile HTTP/1.1
Host: target.local
Content-Type: application/json

{"name":"test"}
```

it is worth checking how the API reacts to a data type change:

```http
POST /api/profile HTTP/1.1
Host: target.local
Content-Type: application/xml

{"name":"test"}
```

If the application responds with an XML parser error, it means XML is probably supported or at least reaches a parser.

This opens the next stage of testing.

We do not assume a vulnerability immediately.

First, we confirm that the backend actually tries to process that format.

## XML in APIs

If an API accepts XML, we need to think about several classes of issues.

The most well-known one is XXE, which stands for XML External Entity.

In practice, this means the XML parser may allow the user to define an external entity that references a local file or a network resource.

Minimal conceptual test:

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
  <!ENTITY test SYSTEM "file:///etc/passwd">
]>
<root>&test;</root>
```

In a real test, the goal is not just to paste the payload.

We need to observe:

Does the parser accept `DOCTYPE`?

Does the application return an XML error?

Is the entity expanded?

Does the response contain a fragment of the referenced resource?

Is outbound traffic from the server possible?

Does the parser block external entities?

XML in APIs becomes especially interesting when the frontend sends JSON, but after changing the `Content-Type`, the backend still accepts XML.

This means there is a hidden attack surface that a regular application user never sees.

## YAML in APIs

YAML is less common, but because of that it is interesting.

If an API accepts YAML, we need to check whether the parser works in safe mode.

Unsafe YAML parsers in some languages have historically allowed object creation or function execution on the server side.

In Python, a classic example of a risky approach was using `yaml.load()` on untrusted data instead of the safer `yaml.safe_load()`.

From a tester’s perspective, we are initially not interested in the payload, but in answering the question:

**Does the API accept YAML at all?**

Test:

```http
POST /api/import HTTP/1.1
Host: target.local
Content-Type: application/yaml

name: test
role: user
```

If we receive a YAML parser error or a different response than with JSON, it is worth going deeper.

## Response format can also change logic

In APIs, we usually think about what format we send to the server.

But the format we force in the response is just as important.

This can be done with a header:

```http
Accept: application/json
```

or with a URL variant:

```http
/api/users/123.json
/api/users/123.xml
```

or with a parameter:

```http
/api/users/123?format=json
/api/users/123?output=xml
/api/users/123?requesttype=locreq.json
```

Why does it matter?

Because the application may have different logic for JSON responses, different logic for XML and another one for HTML.

One format may hide fields.

Another may return the full object.

A third one may bypass part of the validation.

A fourth one may be an old code path that nobody updated.

During testing, it is worth comparing responses:

```http
GET /api/users/me HTTP/1.1
Accept: application/json
```

```http
GET /api/users/me HTTP/1.1
Accept: application/xml
```

```http
GET /api/users/me.json HTTP/1.1
```

```http
GET /api/users/me.xml HTTP/1.1
```

We look for differences in fields, statuses, errors, headers and access control behavior.

## API keys

An API key often looks like a simple secret:

```text
api_key=abc123...
```

or:

```http
X-API-Key: abc123...
```

Sometimes it works like a password.

Sometimes like a client identifier.

Sometimes like an access token.

And sometimes, unfortunately, like all of these at once.

The biggest problem with API keys is that they are often long-lived. A user can log out of the application, but the API key remains active for months or years.

That is why API security assessment should check:

Is the API key sent in the URL?

Does it end up in logs?

Is it present in JavaScript?

Is it present in the mobile application?

Is it stored in a repository?

Is it visible in commit history?

Does it have limited permissions?

Does it have a limited lifetime?

Can it be rotated?

Can it be revoked?

Is it bound to a specific IP address or range?

Do different keys have different access levels?

Weak example:

```http
GET /api/user/data?api_key=SECRET HTTP/1.1
Host: target.local
```

Better variant:

```http
GET /api/user/data HTTP/1.1
Host: target.local
X-API-Key: SECRET
```

This does not solve every problem, but it reduces the risk of accidentally storing the secret in URLs, history, referrers and logs.

Important point: an API key is still an input parameter.

If the backend checks it in the database, a poorly built query can be vulnerable to SQL Injection just like any other parameter.

## Webhooks

A webhook is a mechanism where one system calls a specified URL in another system.

Example:

An online shop registers a webhook in a payment gateway.

After a completed payment, the gateway sends a request to the shop.

```json
{
  "event": "payment.completed",
  "amount": 19900,
  "currency": "PLN",
  "callback_url": "https://shop.example.com/payment/webhook"
}
```

The most important security problem with webhooks is Server-Side Request Forgery.

If the user can provide a callback URL and the server later calls that URL, the tester should check whether internal addresses can be used:

```text
http://127.0.0.1/
http://localhost/
http://169.254.169.254/
http://internal-service.local/
http://10.0.0.5/
```

The point is not only whether the application “accepts” such an address.

The point is whether the backend later actually tries to connect to it.

During tests, a custom HTTP listener or Burp Collaborator is useful because it allows us to confirm whether the server made an outbound connection.

Webhooks also need to be verified from the other side.

If the application receives a webhook, it should verify that the request really comes from a trusted system.

The fact that someone knows the webhook URL should not allow them to change a payment status, order status or business process.

## Authentication and authorization in APIs

In APIs, authentication and authorization issues are among the most important vulnerability classes.

Authentication answers the question:

**Who are you?**

Authorization answers the question:

**Are you allowed to perform this action on this specific resource?**

This distinction is critical.

An application may correctly recognize the user, but still allow them to retrieve another person’s data.

Example:

```http
GET /api/users/1001/orders HTTP/1.1
Authorization: Bearer TOKEN_USER_A
```

If we change `1001` to `1002`:

```http
GET /api/users/1002/orders HTTP/1.1
Authorization: Bearer TOKEN_USER_A
```

and receive another user’s data, the problem is not missing authentication.

The problem is missing proper authorization to the resource.

This is a classic IDOR, or Insecure Direct Object Reference, now most often understood under the broader category of Broken Object Level Authorization.

APIs are especially prone to such issues because they very often operate on identifiers:

```text
user_id
account_id
order_id
invoice_id
company_id
tenant_id
organization_id
project_id
```

Every such parameter should raise a flag.

We do not ask only: “Does this endpoint require a token?”

We ask: “Does this token have access to this specific object?”

## Rate limiting

APIs should limit the number of attempts for sensitive operations.

This especially applies to:

login,

password reset,

one-time code verification,

SMS code sending,

invitations,

token generation,

financial operations,

user enumeration,

large data downloads.

Missing rate limiting is not always a critical vulnerability by itself, but it often amplifies other issues.

If a password reset code has six digits, but the application allows hundreds of thousands of attempts from many IP addresses, the math starts working against the application.

During testing, the point is not aggressive brute-forcing.

The point is to check whether the application has a visible control mechanism:

Does a lockout appear after several failed attempts?

Is the lockout per account, per IP address, per token or per device ID?

Does the response change after exceeding the limit?

Can the limit be bypassed by changing headers?

Does the limit work the same way for the mobile API and the web API?

## Older API versions

APIs often live longer than frontends.

The frontend may use:

```text
/api/v3/
```

but the server may still expose:

```text
/api/v1/
/api/v2/
/internal_api/
/legacy/
/mobile-api/
```

An older API version may have weaker access control, an old token format, no rate limiting or endpoints that were removed from the interface but not from the backend.

During reconnaissance, it is worth looking for versions:

```text
/v1/
/v2/
/v3/
/api/v1/
/api/v2/
/rest/v1/
/legacy/
/old/
/internal/
```

During tests, we compare:

Does the old endpoint still respond?

Does it require the same authentication?

Does it return more data?

Does it use different parameter names?

Does it allow the same operation through another path?

## How to think during API testing

API testing is not about randomly throwing payloads.

A good process looks more like building a map.

First, we need to understand the resources:

```text
users
orders
payments
files
comments
roles
organizations
projects
sessions
tokens
```

Then the actions:

```text
create
read
update
delete
export
import
approve
invite
reset
confirm
cancel
```

Then the roles:

```text
guest
user
premium user
manager
admin
support
service account
```

Then the access boundaries:

Can user A see user B’s data?

Can a user from organization A see data from organization B?

Can a regular user perform an administrative action?

Can an unverified account use endpoints that require verification?

Can a blocked account still use the API?

Does a deleted token still work?

Only then do payloads start making sense.

## Minimal tester checklist

During the first API pass, it is worth checking:

Does Swagger/OpenAPI documentation exist?

Does the frontend or mobile application reveal hidden endpoints?

Are there old API versions?

Do endpoints have consistent access control?

Can object identifiers be changed?

Can HTTP methods be overridden?

Does the API accept formats other than JSON?

Does the response format change the scope of returned data?

Do errors reveal technical details?

Are API keys not sent in the URL?

Do API keys have scopes and rotation?

Can webhooks be abused for Server-Side Request Forgery?

Do sensitive operations have rate limiting?

Do deleted, old or mobile endpoints still work?

Do different user roles see and do only what they should?

## Practical mini-workflow in Burp Suite

First, I use the application normally and collect traffic in Proxy History.

Then I filter requests by:

```text
/api
/v1
/v2
/graphql
/rest
/json
/swagger
```

Next, I choose one endpoint and create a baseline in Repeater.

Example:

```http
GET /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
```

Then I change only one thing at a time.

Object ID:

```http
GET /api/orders/124 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
```

Method:

```http
POST /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Content-Type: application/json

{}
```

Method override header:

```http
POST /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Content-Type: application/json
X-HTTP-Method-Override: DELETE

{}
```

Data format:

```http
POST /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Content-Type: application/xml

<order><status>test</status></order>
```

Response format:

```http
GET /api/orders/123.xml HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_A
Accept: application/xml
```

Another user’s token:

```http
GET /api/orders/123 HTTP/1.1
Host: target.local
Authorization: Bearer TOKEN_USER_B
```

No token:

```http
GET /api/orders/123 HTTP/1.1
Host: target.local
```

At every step, I compare:

HTTP status,

response length,

field differences,

error messages,

response time,

headers,

whether the operation actually changed application state.

## The most important idea

A REST API is not magically secure just because it uses JSON, tokens and endpoints.

It is still a web application, only with more inputs and fewer visual boundaries.

The biggest risk appears where the backend accepts more than the frontend shows:

other methods,

other formats,

other versions,

other paths,

other roles,

other ways of identifying a resource.

That is why in API testing we need to stop thinking like a user clicking through the application.

We need to think like someone talking directly to the backend.
