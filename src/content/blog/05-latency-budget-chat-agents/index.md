---
title: "The Latency Budget of Chat Agents"
description: "Customers don't experience your architecture. They experience silence. Interactive SLA vs broadcast throughput — and why 24s is often a queue."
date: "Sep 4 2026"
---

On chat, p50 is politeness. p99 is trust.

If you design agents like a web request (“think, then reply in the same HTTP call”), WhatsApp will punish you. If you async everything with no rules, you’ll double-reply.

The competent frame: a **latency budget with named stages**, and honesty about what you optimize for interactive chat vs campaigns.

## How we designed it

Happy path for a live agent reply:

```
Webhook ACK fast (store event, queue work)
  → create inbound message
  → if an AI session is open, run the turn (model + tools)
  → create outbound message
  → send on a high-priority delivery path
```

Product knobs that matter more than model brand:

- **Debounce (seconds, capped):** bursty typing → one reply, not five
- **Catch-up:** messages that arrived while thinking get handled after, without starting a storm
- **Typing delay:** optional UX lag — know you’re spending budget on feel
- **No token streaming to WhatsApp:** the user waits for a complete answer, not a typewriter

Campaigns are a different budget: spool + per-number rate limits. A ~24 second “slow send” is often **queue wait under rate limit**, not “AI is slow.” If support escalates “latency” without splitting session vs broadcast, you’ll optimize the wrong thing for weeks.

## How it breaks

**The model sits on the inbound worker.**  
Interactive quality competes with ingest capacity. That’s a staffing/queue product decision, not a prompt tweak.

**Mistaking blast backlog for product regression.**  
Same channel, different SLA. Publish two latency definitions internally or your roadmap lies.

**Retries that feel like latency.**  
The user sends once; the system thinks twice. Leases and dedupe are latency features because they prevent the “busy then weird” experience.

## What you measure / what you refuse

Measure separately: webhook → message created; message → first AI outbound; outbound → provider accepted; template queue wait vs send time.

Refuse: one “AI latency” dashboard; shipping debounce without defining which message wins; mixing campaign rate limits into interactive success metrics.

---

*Series: [boundary](/blog/03-agent-boundary-layer) · [retries](/blog/04-retries-are-a-product-feature) · [latency](/blog/05-latency-budget-chat-agents) · [memory](/blog/06-memory-is-a-product-contract) · [messaging](/blog/07-messaging-primitive)*
