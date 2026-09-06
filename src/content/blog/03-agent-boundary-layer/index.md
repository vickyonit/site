---
title: "The Boundary Layer"
description: "When the agent should stop — and what you owe the human who takes over. Escalation as a product mode, not a prompt suggestion."
date: "Sep 2 2026"
---

Autonomy without a clean handoff is not “AI.” It’s a teammate who ghosts mid-conversation and leaves another human holding the bag.

On WhatsApp, that bag is public. The customer sees every message. Providers retry. The model is slow. If escalation is a prompt suggestion instead of a product rule, you get three failures users feel immediately:

1. The bot keeps talking after a human has taken the chat
2. The human opens the thread with zero context
3. “Hybrid” mode means nobody owns the next reply

Naive move: add an Escalate tool and hope.  
Competent move: define **who owns the conversation after escalate**, what snapshot travels with it, and whether AI is allowed to keep talking.

## How we designed it

We treated escalation as a **state change**, not a vibe.

- The agent calls escalate with required fields (customer message + reason; or message + summary + reason, depending on runtime)
- The session flips to escalated; the conversation marks escalated
- The human gets an inbox note: summary + reason
- Assignment runs (person or group; round-robin when enabled)
- Downstream automations can react (move a pipeline stage, notify, start an SLA)

Two product modes — pick deliberately:

| Mode | Product meaning |
|------|-----------------|
| Hard handoff | AI stops. Human owns it. |
| Hybrid | Thread is escalated for humans, but AI may continue until a human overrides |

If you can’t explain which mode a customer is in in one sentence, you don’t have a handoff product — you have ambiguity.

```
Customer stuck / angry / out of policy
        → escalate (required fields)
        → durable “escalated” state
        → note + assignee + optional customer text
        → hard stop  OR  hybrid continue
        → human override = absolute stop
```

## How it breaks

**Silent transfer vs noisy transfer.**  
When the model fails, you may still need to escalate — but sending a second bot apology after a failure message feels broken. Allow escalate with suppressed customer text. Failure path ≠ marketing copy path.

**Expert-in-the-loop racing escalate.**  
If an agent can ask an internal expert *and* escalate, a late expert answer can revive a dead AI session. Cancel pending consultations on escalate. One owner at a time.

**Group inbox without an owner.**  
Assigning a group without a person looks fine in metrics and terrible in the inbox. If “escalated” is your quality promise, define whether group-only counts as owned.

## What you measure / what you refuse

Measure: escalation rate, time-to-first-human-reply after escalate, % escalations with empty reason/summary, re-opens where AI spoke after human override, hybrid chats with dual replies.

Refuse: escalate without a reason; hybrid without an override; handoff that doesn’t leave a human-readable snapshot.

---

*Series: [boundary](/blog/03-agent-boundary-layer) · [retries](/blog/04-retries-are-a-product-feature) · [latency](/blog/05-latency-budget-chat-agents) · [memory](/blog/06-memory-is-a-product-contract) · [messaging](/blog/07-messaging-primitive)*
