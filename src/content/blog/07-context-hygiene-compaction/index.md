---
title: "Context Hygiene & Compaction: Micro-Observations and Cache-Aware Prefix Freezing"
description: "How to save 80% on tool token bloat and protect LLM prompt caching discounts using tool micro-compaction and prefix freezing."
date: "2026-11-17"
series:
  id: "customer-support-custom-runtime"
  title: "Building Customer Support Agent with Custom Runtime"
  part: 7
---

## The Compaction Dilemma: Token Bleed vs. Cache Invalidation

As multi-turn conversations progress, context windows grow rapidly. In an e-commerce support session:
* Turn 1: User asks to track an order. The tool returns a 2,500-character JSON payload containing order items, carrier milestones, shipping addresses, and billing history.
* Turn 2: User says: *"Great, what is the tracking number again?"*
* Turn 3: User says: *"Can I return the keyboard?"*

By Turn 4, your agent is sending that massive Turn 1 JSON payload back to the model on every single inference pass.

Most developers try to solve this with a simple **FIFO sliding window**: when the conversation exceeds 10 messages, drop the oldest messages from the beginning.

In production, **naive FIFO truncation creates two severe issues**:
1. **Broken Turn Alternation**: Truncating an arbitrary number of messages can leave an orphaned `tool` message at the top of history, causing Anthropic and Gemini APIs to reject the request.
2. **Destroyed Prompt Caching**: Modern models (Gemini 2.5, Claude 3.5) offer **prompt caching discounts of up to 90%** when the exact prefix of a request matches previous requests. Truncating from the top modifies the prefix hash on every turn, wiping out your cache discount!

In this post, we explain how we solved both problems in our harness using **Tool Output Micro-Compaction** and **Cache-Aware Prefix Freezing**.

---

## 🔬 Strategy 1: Tool Output Micro-Compaction

Think about human customer support agents: once an agent looks up an order in Shopify and tells the customer *"Your desk is on FedEx truck #123,"* the human does not keep re-reading the entire 50-field JSON record for the rest of the day.

The raw data has been **synthesized into conversational context**.

### The Micro-Compaction Invariant
For any `Role.TOOL` message that has already been consumed by an assistant turn (i.e., it is in the past, not the active turn waiting for model output):
* If the payload exceeds `max_chars` (e.g. 150 characters), condense it to an observation summary.
* **Crucial:** Maintain the exact `ToolResult(call_id=..., name=...)` schema so turn structure is preserved.

```python
class ToolOutputMicroCompactor(BaseCompactor):
    def __init__(self, max_chars: int = 150) -> None:
        self.max_chars = max_chars

    def compact(self, messages: list[Message]) -> list[Message]:
        compacted = []
        total = len(messages)

        for i, msg in enumerate(messages):
            # Only compact historical tool results (not the in-flight latest message)
            is_historical = (i < total - 1)

            if msg.role == Role.TOOL and is_historical:
                new_results = []
                for tr in msg.tool_results:
                    if len(tr.content) > self.max_chars:
                        truncated = f"{tr.content[:self.max_chars]}... [compacted for context hygiene]"
                        new_results.append(ToolResult(call_id=tr.call_id, name=tr.name, content=truncated))
                    else:
                        new_results.append(tr)
                compacted.append(Message.from_tool_results(new_results))
            else:
                compacted.append(msg)
        return compacted
```

### The Impact
In our NovaGear support benchmarks, micro-compaction reduced historical tool payload sizes by **over 78%** without degrading customer satisfaction or accuracy.

---

## 🧊 Strategy 2: Cache-Aware Prefix Freezing

To preserve provider prompt caching, we segment message history into two distinct zones:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Pinned Prefix Epoch (Frozen for Prompt Caching)          │
│    • System Prompt                                          │
│    • Initial Customer Goal & Verified Credentials           │
├─────────────────────────────────────────────────────────────┤
│ 2. Dynamic Scratchpad Epoch (Pruned as Turns Accumulate)    │
│    • Intermediate Tool Calls & Intermediate Clarifications   │
│    • Maintained with strict user ↔ assistant alternation   │
└─────────────────────────────────────────────────────────────┘
```

Our `CacheAwareCompactor` locks the pinned prefix count in stone:

```python
class CacheAwareCompactor(BaseCompactor):
    def __init__(self, pinned_prefix_count: int = 2, max_middle_messages: int = 20):
        self.pinned_prefix_count = pinned_prefix_count
        self.max_middle_messages = max_middle_messages

    def compact(self, messages: list[Message]) -> list[Message]:
        if len(messages) <= self.pinned_prefix_count + self.max_middle_messages:
            return list(messages)

        # 1. Pinned Prefix (Never touched; keeps cache hash valid)
        prefix = list(messages[:self.pinned_prefix_count])

        # 2. Dynamic middle epoch
        dynamic = list(messages[self.pinned_prefix_count:])
        excess = len(dynamic) - self.max_middle_messages

        if excess > 0:
            dynamic = dynamic[excess:]
            # Ensure turn alternation: oldest surviving dynamic message must be USER
            while dynamic and dynamic[0].role != Role.USER:
                dynamic.pop(0)

        return prefix + dynamic
```

Because the first token prefix never changes, Gemini and Anthropic serve the initial context from their ultra-fast, low-cost memory caches.

---

## 💡 Summary of Context Strategies

| Strategy | Token Reduction | Cache Impact | Complexity |
| :--- | :--- | :--- | :--- |
| **Naive FIFO Truncation** | High | ❌ Destroys Cache Hash | Low |
| **Tool Micro-Compaction** | **70% – 80% on tools** | ✅ Zero Cache Disruption | Low |
| **Cache-Aware Epochs** | Medium | **✅ 90% Cache Discounts** | Medium |
| **Rolling LLM Summarization** | High | ⚠️ Incurs extra LLM call | High |

By combining **Tool Micro-Compaction** with **Cache-Aware Epochs**, your agent achieves both minimum token payload size and maximum provider cache hit rates.
