---
title: "The Production Agent Challenge: Why Real-World AI Support Demands a Custom Harness"
description: "Why off-the-shelf agent frameworks fail in enterprise customer support: WISMO auth leaks, IDOR risks, hardware error troubleshooting, and human handoff."
date: "2026-11-10"
series:
  id: "customer-support-custom-runtime"
  title: "Building Customer Support Agent with Custom Runtime"
  part: 0
---

Every demo of an AI customer support bot looks easy: connect an LLM to a store database, pass a prompt saying *"You are a helpful assistant"*, and watch it answer a canned question.

Then you run real customer traffic through it.

Within twenty-four hours, the cracks appear. A user asks to check an order status and the bot returns someone else's shipping address. Another customer tricks the model into issuing a full refund for an order that was delivered three weeks ago. A third customer reports that their standing desk motor threw error code `E08`, and the agent hallucinates a wiring diagram that risks burning out the motor controller.

This series documents how we designed, tested, and shipped **Case 01: The NovaGear Customer Support Agent**, and why doing so forced us to abandon bloated frameworks and build a **zero-dependency, provider-agnostic agent harness** from scratch in pure Python.

---

## The Scenario: NovaGear Support

To make every design constraint concrete, we designed our use case around **NovaGear**, an ergonomic direct-to-consumer brand selling motorized SmartDesks, NovaKey mechanical keyboards, and monitor arms.

NovaGear's support workload falls into four distinct buckets, each representing a classic enterprise challenge:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NOVAGEAR SUPPORT: THE 4 DOMAIN BUCKETS               │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. WISMO (Where Is My Order?)     │ 2. Order Cancellations & Returns   │
│    • Status lookup & ETA          │    • Status check ('unfulfilled')  │
│    • Carrier tracking links       │    • 30-day return policy check    │
│    • PII masking on address data  │    • Step-up 2FA/OTP Auth Gate     │
├───────────────────────────────────┼────────────────────────────────────┤
│ 3. Hardware Troubleshooting (RAG) │ 4. Out-of-Scope & Escalation       │
│    • SmartDesk E08 motor reset    │    • Cracked tabletop freight      │
│    • Bluetooth multi-device sync  │    • Priority 'high' ticket creation│
│    • Zero hallucination on specs  │    • 2-hour human SLA guarantee    │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 1. WISMO (Where Is My Order?)
* **The Task**: A customer asks: *"Where is my desk? Order #NG-84721"*.
* **The Catch**: You cannot simply execute `get_order(order_id)`. If an attacker probes order numbers sequentially, an unsecured agent leaks the recipient's full name, home address, and phone number.
* **The Rule**: The tool must enforce identity binding—requiring both `order_id` and the customer's verified email address—and mask sensitive address lines before context injection.

### 2. Cancellations & Returns (Zero-Trust Security Gate)
* **The Task**: A user asks: *"Cancel my order and refund my card."*
* **The Catch**: This is a state-mutating, financial transaction. If you expose a raw `@tool def cancel_order(order_id: str)`, prompt injection or model hallucination can trigger unauthorized cancellations.
* **The Rule**:
  1. Orders can only be cancelled if their status in the Shopify OMS is `unfulfilled`.
  2. NovaGear enforces a **Zero-Trust Security Gate**: The agent cannot call `cancel_order` directly. It must invoke `send_verification_otp(email=...)`, wait for the customer to supply the 6-digit code, verify it via `verify_otp`, and only then execute the mutation.
  3. Returns must strictly reject items delivered more than 30 days ago.

### 3. Product Troubleshooting (Markdown RAG vs Hallucination)
* **The Task**: A user types: *"My SmartDesk display is flashing E08 and won't go down. How do I fix it?"*
* **The Catch**: The LLM must not guess motor reset steps. A motorized standing desk reset requires a precise mechanical sequence (press DOWN until minimum height, hold for 10 seconds until it bleeps and resets).
* **The Rule**: The agent must retrieve ground-truth markdown documentation from a local knowledge base rather than relying on parametric memory.

### 4. Damaged Goods & Human Escalation
* **The Task**: A customer uploads a photo showing a cracked solid wood tabletop damaged during freight transit.
* **The Catch**: An AI agent cannot negotiate freight carrier claims or approve custom replacements. Pretending it can creates intense customer frustration.
* **The Rule**: The agent must immediately recognize freight damage, call `escalate_to_human(priority="high")`, produce a Zendesk/Linear ticket ID, and set an explicit 2-hour SLA.

---

## Why Existing Frameworks Broke Down

When we initially mapped these requirements against off-the-shelf frameworks (LangChain, CrewAI, LlamaIndex), we repeatedly hit the same structural limitations:

1. **The "Framework Abyss"**: When an agent misbehaved in an OTP validation loop, setting a debugger breakpoint led us through 18 layers of abstract wrapper classes (`BaseChain`, `RunnableSequence`, `CallbackManager`) before we could inspect the actual JSON payload dispatched to the LLM.
2. **Fragile Conversational Invariants**: State-of-the-art models like Anthropic Claude 3.5 Sonnet and Gemini 1.5/2.0 enforce strict alternating turn rules (`user` &rarr; `model` &rarr; `user`). Many frameworks leak internal system messages or double assistant turns into the history, causing catastrophic runtime API rejections.
3. **The IDOR Security Hole**: Most agent tool abstractions assume that if a model decides to call a tool, your application should run it. In production, this is an Insecure Direct Object Reference (IDOR) disaster. We needed pre-execution middleware that validates session ownership before the tool dispatcher ever touches your database.
4. **Token Bleed in Multi-Turn Conversations**: In a 6-turn support conversation, returning raw Shopify OMS payloads repeatedly floods the prompt context. Without cache-aware micro-compaction, token costs spiral and cache hit rates collapse.

---

## What We Built: The 8-Part Implementation

To solve NovaGear cleanly, we built our agent harness from first principles in pure, typed Python (Pydantic v2) using Test-Driven Development (TDD) and Eval-Driven Development (EDD). 

This series walks through every layer of that system:

* **[Part 1: Why We Skipped LangChain](/blog/01-why-we-skipped-langchain)** — The foundational design principles: strict turn invariants, zero uncaught exceptions, and a swappable LLM provider abstraction (Gemini, OpenAI, Anthropic).
* **[Part 2: Building the Runtime](/blog/02-building-runtime-and-tool-engine)** — Type-safe tool calling, introspecting Pydantic schemas into JSON Schema, and building a deterministic ReAct loop.
* **[Part 3: Zero-Trust AI & Auth Middleware](/blog/03-zero-trust-ai-auth-middleware)** — Defeating IDOR attacks, session-bound parameter injection, and step-up OTP authentication for sensitive tool execution.
* **[Part 4: Shipping NovaGear Support Agent](/blog/04-shipping-novagear-support-agent)** — Bringing the framework and domain logic together: local RAG, order state machines, and rigorous deterministic eval benchmarks.
* **[Part 5: Event-Driven Agent Architecture](/blog/05-event-driven-agent-architecture)** — Decoupling execution from side effects using an `AgentEventBus` with strongly-typed lifecycle hooks.
* **[Part 6: Production Observability with OpenTelemetry](/blog/06-production-observability-opentelemetry)** — GenAI semantic conventions, distributed tracing spans, and latency waterfalls.
* **[Part 7: Context Hygiene & Cache-Aware Compaction](/blog/07-context-hygiene-compaction)** — Preventing token bleed, tool micro-compaction, and prefix freezing for LLM prompt caching.
* **[Part 8: The Production Blueprint](/blog/08-production-deployment-fastapi-docker)** — Deploying the agent runnable with FastAPI SSE streaming, hardened Docker containers, and Kubernetes health checks.

Let's dive into **Part 1**, where we strip away framework magic and write our first provider-agnostic runtime from scratch.
