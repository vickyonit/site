---
title: "Memory Is a Product Contract"
description: "What the model is allowed to remember — and what you pretend it remembers. Amnesia vs hallucination, handoff packets, and the miss path for knowledge."
date: "Sep 5 2026"
---

Multi-turn agents fail in two opposite ways:

1. **Amnesia** — handoff loses intent; tool results disappear; the agent re-asks
2. **False memory** — the agent invents policy or price because context was trimmed poorly or retrieval returned nothing

PMs love “long context.” Production loves **bounded, structured history**. If you can’t say what falls off the table after turn 40, you don’t have a memory product.

## How we designed it

We don’t pretend we have perfect token budgeting. We have **rules**:

- Cap history roughly: last N inbounds/outbounds plus a few templates
- Keep tool calls paired with tool results (breaking the pair is how models go stupid)
- On agent-to-agent handoff, inject an explicit handoff packet — don’t rely on “it’ll see the transcript”
- If history would start on a model/tool turn, pad so the provider contract still holds (ugly, necessary)
- For autonomous agents: search knowledge first; if knowledge is missing, **ask an internal expert** instead of guessing; while waiting, don’t invent the answer

That’s the product stance: **uncertainty should become a workflow, not a hallucination.**

## How it breaks

**Handoff that only copies the last bot line.**  
The new agent starts mid-thought. The user experiences discontinuity. Fix the handoff artifact, not the prompt tone.

**Empty turns and junk placeholders.**  
Blank moments become dummy user messages and poison the next decision. Empty content should not enter history.

**“We have RAG” as a comfort blanket.**  
If retrieval returns nothing and you still answer, you chose brand risk. Force an expert consult or escalate.

## What you measure / what you refuse

Measure: % answers after empty retrieval, consult rate, handoff continuation quality (human review), average history size vs cost, throttle hits from runaway loops.

Refuse: unlimited transcript replay as a roadmap item; knowledge claims without a miss path; handoff without a summary field.

---

*Series: [boundary](/blog/03-agent-boundary-layer) · [retries](/blog/04-retries-are-a-product-feature) · [latency](/blog/05-latency-budget-chat-agents) · [memory](/blog/06-memory-is-a-product-contract) · [messaging](/blog/07-messaging-primitive)*
