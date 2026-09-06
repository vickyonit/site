---
title: "Retries Are a Product Feature"
description: "Webhook retries, job retries, double-taps — if your agent tools aren't safe the second time, you have a liability, not an automation."
date: "Sep 3 2026"
---

Your agent doesn’t run once. WhatsApp retries webhooks. Jobs retry. Models retry. Users double-tap send.

If “create order / send message / update CRM” isn’t **safe under retry**, you don’t have an automation product — you have a liability.

PMs who know this don’t ask “did the model call the tool?”  
They ask: **what happens the second time?**

## How we designed it

Three layers, each solving a different user-visible bug:

1. **Same WhatsApp message twice** → dedupe on the provider message id before creating a second chat message
2. **Two AI turns at once** → one session gets a short-lived “I’m responding” lease; the other backs off
3. **Same tool call twice** → persist the tool call id; if a result already exists, skip the side effect

Separately: if the model returns *text that looks like* a tool call instead of a real structured call, **do not send that to the customer**. Treat it as a model failure and retry. That single rule prevents the worst class of “AI looked broken / technical” moments.

Templates and broadcasts get their own discipline: rate limits and locks. Session replies and blast sends are **different products** sharing one channel — don’t merge their failure modes in your head.

## How it breaks

**Slow model + webhook retry.**  
A customer can see raw tool syntax or duplicate actions. This is not an “LLM quality” ticket; it’s a **retry + ownership** ticket. Fix the product contract: at-most-one customer-visible action per logical turn.

**Malformed tool calls.**  
If the provider says the function call was malformed, do not “best effort” execute. Failed tool beats wrong CRM write.

**Backend spam.**  
Models love retrying the same lookup. Rate-limit repeated tool intents or you’ll create outage cosplay on your own APIs.

## What you measure / what you refuse

Measure: duplicate outbound rate, tool success vs retry-skip rate, % turns blocked by the response lease, customer messages containing code-like tool text (should be ~0).

Refuse: shipping a write-tool without an idempotency story; treating provider retries as “infra only”; letting drafting-text under forced tool mode hit the customer channel.

---

*Series: [boundary](/blog/03-agent-boundary-layer) · [retries](/blog/04-retries-are-a-product-feature) · [latency](/blog/05-latency-budget-chat-agents) · [memory](/blog/06-memory-is-a-product-contract) · [messaging](/blog/07-messaging-primitive)*
