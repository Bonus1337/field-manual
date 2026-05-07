---
id: cloud-foundations
title: "Cloud Foundations"
team: blue
domain: certifications
section: icca
topic: cloud-foundations
type: knowledge
angle: cloud-security-foundations
sourceTrack: icca-preparation
tags: ["cloud", "aws", "azure", "gcp", "iaas", "paas", "saas", "iam", "sla"]
difficulty: easy
shortDescription: "A good cloud note does not end with definitions. You need to understand what we are actually moving to the provider, what still remains on our side, and why so many cloud problems come not from a lack of technology, but from a lack of a proper way of thinking."
updatedAt: "2026-04-19"
---

## Cloud is not a place. Cloud is an operating model.

A lot of confusion comes from the fact that people try to think about the cloud as “someone else’s computer on the internet.” That is too simple, and because of that, very misleading.

Cloud is really a model in which you stop building and maintaining a large part of the physical information technology layer yourself, and instead start using ready-made resources through a panel, terminal, or API. Physical data centers still exist. Networks still exist. Storage, virtualization, machines, and services still exist. The difference is that you no longer manage these things directly at the hardware level. You manage them through a control layer.

That is the starting point for everything.  
Cloud does not remove infrastructure.  
Cloud removes a large part of the pain tied to maintaining it manually.

## What the classic world looks like without the cloud

In a local model, the company is responsible for practically the entire stack:

- the facility and physical space,
- power,
- network,
- storage,
- hardware,
- physical security,
- virtualization,
- maintenance,
- licensing,
- people,
- systems and applications.

That gives a lot of control, but the price is very real: everything has to be planned in advance, purchased in advance, and maintained independently. If you suddenly need more power, more space, or a brand-new environment, in a local world that usually means purchasing, deployment, configuration, and time. In the cloud, many of those things can be provisioned in minutes instead of weeks.

And that is where the first important security conclusion appears:

**the faster something can be launched, the faster it can also be launched badly.**

## The most important layer in the cloud: the management plane

To truly understand the cloud, you have to stop looking only at virtual machines and storage, and start looking at the management layer.

Through it, you:

- create resources,
- change configuration,
- grant access,
- launch services,
- scale environments,
- check billing,
- enable monitoring,
- remove infrastructure.

And this matters a lot, because in the cloud, many security problems do not begin with an exploit against a system. They begin with:

- a compromised account,
- permissions that are too broad,
- a bad access policy,
- a resource exposed incorrectly,
- uncontrolled automation.

In the traditional world, you often think “the server is the target.”  
In the cloud, the target is very often **the account, the role, the token, or the API**.

## Three service models you need to truly understand

### Infrastructure as a Service

This is the closest to traditional infrastructure.

You get the basic building blocks:

- network,
- compute,
- storage,
- virtual machines,
- disks,
- infrastructure elements.

That means you are still close to administration:

- you configure the system yourself,
- you harden the environment yourself,
- you handle updates yourself,
- you are responsible for service configuration yourself.

Infrastructure as a Service gives you a lot of control, but it also leaves a lot of responsibility on your side. This is not a “hands-free cloud.” It is still infrastructure, only delivered and billed in a different model.

For a beginner, the simplest mental map is this:  
**Infrastructure as a Service = you still think like a systems administrator, just in the cloud.**

### Platform as a Service

Here, the center of gravity shifts from the server to the application and the data.

You start dealing with things such as:

- application hosting,
- APIs,
- functions,
- workflows,
- containers,
- data services,
- relational and non-relational databases.

This is no longer thinking:  
“How do I build a system and maintain everything manually by myself?”

It becomes more like:  
“How do I deploy the application, connect the data, control scaling, and keep the configuration in check?”

Platform as a Service removes a lot of operational drudgery, but it does not remove security problems. They simply move elsewhere:

- toward configuration,
- toward identity,
- toward secrets,
- toward integrations,
- toward data exposure.

The most common beginner mistake is that, since they do not see the operating system anymore, they begin to think that security “takes care of itself.” It does not.

### Software as a Service

This is the level where you are already using a ready-made product:

- productivity suites,
- collaboration tools,
- customer relationship management,
- communicators,
- business platforms and other ready-to-use services.

Here the user often tells themselves:  
“This is already fully on the provider’s side.”

And again, not quite.

In Software as a Service, the biggest risks often sit not in infrastructure, but in:

- user accounts,
- weak access management,
- incorrect data sharing,
- lack of role segregation,
- poor offboarding,
- poorly thought-out integrations with other tools.

So simply put:

- Infrastructure as a Service - you mainly manage infrastructure and the system,
- Platform as a Service - you mainly manage the application and service configuration,
- Software as a Service - you mainly manage the use of a ready-made product, access, and data.

## The more convenience, the less control

This is one of the most important ways to think about the cloud.

On one end, you have more control and more responsibility.  
On the other end, you have more convenience and fewer technical details to worry about.

That does not mean one model is “better.”  
It only means that in each model, the security problem sits somewhere else. The axis between control and ease of administration is one of the basic differences between Infrastructure as a Service, Platform as a Service, and Software as a Service.

Mature thinking looks like this:  
you do not ask “what is best?”, but instead:

- how much control do I really need,
- how much maintenance do I want to take on,
- where is my data,
- where is my responsibility,
- where am I most likely to make a mistake.

## How the cloud is managed in practice

There are three main ways:

- the web portal,
- the command line,
- the API.

The portal is great at the beginning because it helps you quickly understand what exists and what it looks like.  
The command line gives you speed, repeatability, and automation.  
The API is the lowest layer, where everything ultimately ends up.

This is a very important moment in the learning process.

If someone learns only by “clicking around in the portal,” they will not really understand cloud security for a long time. Because security in the cloud does not happen at the level of an icon or a form. It happens at the level of:

- identity,
- permissions,
- API calls,
- policies,
- change logs,
- automation.

That is why a good learning path looks like this:

1. do something in the portal,
2. do the same thing in the command line,
3. understand which API sits underneath it.

Only then do you start seeing the cloud as a programmatically controlled system, rather than just a panel.

## Why companies move to the cloud

Most often for very simple reasons:

- speed of launching environments,
- easier scaling,
- a lower entry barrier for new projects,
- built-in mechanisms for managing access and resources,
- less operational overhead.

It sounds great, but the other side has to be added immediately:  
the cloud does not solve organizational chaos. It can only accelerate it.

If a team has no order in:

- roles,
- naming,
- policies,
- costs,
- monitoring,
- resource ownership,

then the cloud will turn that into a bigger mess, faster.

## Capital expenditure, operational expenditure, and why the cloud can be financially deceptive

In the local world, increasing capacity is usually a capital expense:

- you buy hardware,
- you buy licenses,
- you depreciate them,
- you replace them over time.

In the cloud, you more often pay operationally:

- for a running resource,
- for usage,
- for active capacity,
- for specific operations or data transfer.

And that is where a very important distinction comes in:

### Capacity-based

You pay for allocated capacity.

### Consumption-based

You pay for actual usage.

In theory, this sounds great. In practice, many people look only at the cost of the server and forget the rest. And the rest often eats the budget:

- data transfer,
- transaction costs,
- storage operations,
- snapshots,
- logs,
- monitoring,
- backups,
- traffic between services.

The document explicitly warns to watch out for transfer and transaction costs in particular.

A good rule is this:  
**do not calculate the price of a single resource. Calculate the cost of the whole system’s behavior.**

## Billing, monitoring, and optimization are not the same thing

These are three different areas.

Billing answers questions like:

- who is paying,
- on what cycle,
- at what rate,
- how services and marketplace items are billed.

Cost monitoring answers questions like:

- how much we are already spending,
- whether the budget is leaking,
- whether an alert needs to be set,
- where the cost is growing.

Cost optimization answers questions like:

- whether the resource is sized correctly,
- whether it can be reduced,
- whether autoscaling can be used,
- whether serverless makes sense,
- whether longer commitments are worth it,
- whether the provider’s recommendations actually help.

From a security perspective, this matters more than it seems, because a lack of cost control often also means a lack of control over what even exists in the environment.

And that is already a very bad sign.

## A service level agreement does not mean “it will never go down”

This is one of the most common misunderstandings.

Providers publish high availability numbers, but those values usually refer to a specific deployment model. For some environments, a high service level agreement requires multiple instances across different availability zones. This explicitly applies to the baseline 99.99% level for virtual machines in Azure and Google when the instances are deployed properly.

So:

- one virtual machine is not automatically high availability,
- one zone is not resilience,
- simply being in the cloud does not fix bad architecture.

A very important rule:  
**high availability is designed, not bought simply by being with a large provider.**

And this also matters for the security mindset, because operational resilience is part of security.

## Shared responsibility: the most important thing you need to drill into your head

The cloud provider is not responsible for everything.  
You are not responsible for everything either.  
But it is very easy to misunderstand the boundary between the two.

The lower you are, the more remains on your side.  
The higher you are, the more the provider takes over.  
But in almost every case, the following still remain on your side:

- data,
- identity,
- permissions,
- configuration,
- exposure of resources,
- compliance,
- the rules for how services are used.

The topic of responsibility for resources is one of the foundations of the entire cloud model.

This is exactly where the real cloud security mindset is born.

You no longer ask only:

- is the provider secure.

You start asking:

- are my roles too broad,
- is storage public without a real need,
- can someone create resources outside of control,
- do I know who changed what and when,
- can I roll back a mistake quickly,
- can I detect abuse before it turns into an incident.

## Cloud security mindset from day one

For a beginner, the best model of thinking looks like this:

### 1. Identity first

In the cloud, many problems begin with:

- accounts,
- tokens,
- keys,
- roles,
- access policies.

Not with an exploit against a service.

### 2. Every resource can be misconfigured

Storage, network, database, application, function, integration - everything can be exposed too broadly or connected the wrong way.

### 3. Speed is both an advantage and a threat

The same thing that lets you launch a business environment in an hour also lets you expose a mistake in an hour.

### 4. Automation does not replace thinking

If you automate bad logic, you just spread the mistake faster.

### 5. Without visibility, you are blind

If you do not have administrative logs, monitoring, alerts, and cost visibility, then you do not really know what is happening in the environment.

## How to learn the cloud in a sensible way

The worst thing you can do is try to memorize every service name.

The best path is simpler:

1. Understand the difference between Infrastructure as a Service, Platform as a Service, and Software as a Service.
2. Learn one cloud by categories: compute, storage, networking, identity, monitoring, billing.
3. Build a few simple things: a virtual machine, a bucket, a database, an application.
4. Do it in the portal, then in the command line.
5. See how billing, budgets, and cost alerts work.
6. Learn who can do what.
7. Only then go deeper into security.

That order makes sense, because security in the cloud is not a separate world sitting next to infrastructure. It is built into the way you create, connect, expose, and control that infrastructure.

## The most important sentence at the end

Cloud does not take responsibility away.  
Cloud shifts responsibility.

And that is exactly why anyone who wants to truly understand the cloud has to learn not only the services, but also the management model, the cost model, availability, permissions, and the boundary of their own responsibility. Only then does the cloud stop looking like a collection of marketing names and start looking like a real environment that can be deliberately designed, secured, and audited.
