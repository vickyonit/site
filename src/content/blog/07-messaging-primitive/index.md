---
title: "The Messaging Primitive"
description: "Your AI roadmap is only as good as your send path. One durable message lifecycle — or ghosts you can't debug."
date: "Sep 6 2026"
---

Every flashy agent demo assumes a boring truth: **messages are durable objects with lifecycles**.

If teams “just call the WhatsApp API,” you lose delivery jobs, inbox activity, analytics, automations, audit, and retries. Then AI “doesn’t work” in ways nobody can debug.

Omnichannel is not “we support WhatsApp.” It’s one primitive for create → deliver → status → attribute — and every agent, automation, and API tool goes through it.

## How we designed it

Canonical product shape:

- Session text → create message → high-priority send → store provider id → status webhooks update the same object
- Templates / campaigns → queue → rate-limited deliver → same status truth
- Inbound → same message object → router decides AI vs inbox vs automation

External APIs and MCP tools are **policy on top of that primitive**, not a parallel pipe.

Free-form outside the customer-care window shouldn’t “maybe fail at the provider.” Fail in product with a clear state. Quoted replies, media, and provider quirks are part of the primitive — if one BSP client breaks reply context, users see failed sends, not “integration debt.”

## How it breaks

**Bypassing create-message.**  
Bulk inserts and side API calls create ghosts: no send job, no AI events, no pipeline hooks. This will page you as “random AI bugs.”

**One pipeline for chat and blasts.**  
Interactive SLA dies under campaign load. Split them even if the channel is the same.

**Analytics that can’t tell bot from human.**  
If AI outbound isn’t tagged differently, your “agent deflection” story is fiction.

## What you measure / what you refuse

Measure: send success, failure reasons, window blocks, duplicate provider ids, AI vs human outbound mix, time in queued state for templates.

Refuse: any agent feature that sends without a message row; a roadmap that adds channels without status parity; “the API can do it” if that path skips the lifecycle.

---

*Series: [boundary](/blog/03-agent-boundary-layer) · [retries](/blog/04-retries-are-a-product-feature) · [latency](/blog/05-latency-budget-chat-agents) · [memory](/blog/06-memory-is-a-product-contract) · [messaging](/blog/07-messaging-primitive)*
