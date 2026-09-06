---
title: "The customer saw the tool call"
description: "On Peach, WhatsApp retries plus a slow Gemini turn can show raw send_message(...) text to a human. Deduping wamids and claiming a session turn is the product."
date: "Sep 5 2026"
---

Peach runs AI agents on WhatsApp. WhatsApp will retry webhooks. Gemini will take seconds. Users will double-send. If your mental model is “one inbound → one model call → one reply,” you will eventually ship a customer-visible bug that looks like the AI is broken or drunk.

The failure mode we care about most is simple to describe and ugly to fix:

> Meta retries the same inbound while a turn is still in flight. The model was supposed to return a structured function call. Instead it returns drafting text that *looks like* `send_message(...)` / `escalate_to_agent(...)`. That text hits WhatsApp.

So the production system is layered for paranoia:

1. **Ingress** — map Meta’s message id (`wamid`) through `ExternalEntity` before creating a second `Message`
2. **Turn lease** — `StreamSession#claim_ai_response!` is a compare-and-swap on the session row (idle or expired → responding + token). Contended turns bail
3. **Handled set** — responded messages are recorded so catch-up doesn’t re-answer forever
4. **Model guard** — if we’re in forced function-calling mode and the model returns code-like / drafting text, treat it as a retryable error — **do not send it**
5. **Tool once** — autonomous runtime executes tools under a session lock keyed by provider call id

Session freeform replies and template broadcasts do **not** share a queue on purpose. Interactive chat should not wait behind a campaign hitting a 10/sec phone rate limit. We’ve watched “AI is slow” tickets turn into “spool backlog math” after someone looked at the right timestamps.

Escalation is a state machine, not a vibe: session `escalated`, conversation flag, inbox note with reason, assignment, optional hybrid mode where AI may continue until human override. When the provider fails hard we escalate with a suppressed customer message so you don’t apologize twice.

I don’t write this as abstract “reliability.” I write it because on WhatsApp the transcript *is* the product, and every retry is a chance to publish your internals.
