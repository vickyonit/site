---
title: "Why We Skipped LangChain: Designing a Provider-Agnostic Agent Harness from First Principles"
description: "How to eliminate framework bloat: building a swappable LLM provider abstraction (Gemini, Claude, GPT-4) with strict alternating turn invariants in under 400 lines of Python."
date: "2026-11-11"
series:
  id: "customer-support-custom-runtime"
  title: "Building Customer Support Agent with Custom Runtime"
  part: 1
---

## The Illusion of Convenience

If you browse GitHub or Twitter today, 90% of AI agent tutorials begin with:
```python
from langchain.agents import create_openai_tools_agent, AgentExecutor
```

It feels magical for 15 minutes. You define two tools, pass a prompt template, and you have an agent chatting back.

Then, you try deploying it to real customers.

Suddenly, you hit the production wall:
1. **The "Framework Abyss"**: A tool fails silently or returns an unexpected schema. You set a breakpoint and find yourself stepping through 18 layers of abstract BaseChain, RunnableSequence, CallbackManager, and OutputParser classes before seeing the actual raw payload sent to the LLM.
2. **Vendor Lock-In**: Switching between Anthropic, OpenAI, and Gemini requires juggling completely different wrapper libraries, prompt parsers, and tool formatters.
3. **Fragile State & Token Bleed**: Multi-turn history grows uncontrollably. The framework silently leaks tool calls into consecutive turns, triggering cryptic API errors from providers like Anthropic or Gemini that enforce strict alternating conversational turn invariants.
4. **Zero-Trust Security Holes**: Frameworks treat tool execution as an afterthought. If an LLM hallucinates an order ID or attempts an unauthorized refund, the framework happily invokes your raw function.

We decided to step off the framework treadmill. We asked: **What does a minimal, provider-agnostic agent harness look like if we build it from first principles using pure, typed Python?**

Here is what we built, the core invariants we enforced, and how you can do the same.

---

## 🏛️ The Three Non-Negotiable Invariants

Before writing a single line of runtime code, we established three non-negotiable architectural guarantees:

```
┌─────────────────────────────────────────────────────────────┐
│                 Core Harness Invariants                    │
├─────────────────────────────────────────────────────────────┤
│ 1. Strict Turn Invariants (user ↔ assistant alternation)    │
│ 2. Zero Uncaught Exceptions (all tool crashes trapped)      │
│ 3. Context Window Hygiene (deterministic message pruning)   │
└─────────────────────────────────────────────────────────────┘
```

### Invariant 1: Strict Turn Invariants
Modern foundation models (Gemini, Claude, GPT-4) are conversational state machines. Providers like Anthropic and Google GenAI reject requests that contain consecutive `user` turns or improperly sequenced `tool` outputs.

Our harness guarantees that regardless of how many parallel tools the model invokes in a single step, all execution outputs are consolidated into a single structured response message:

```
User Turn
   ↓
Assistant Turn (Tool Calls: [get_order_status, check_inventory])
   ↓
Tool Turn (Consolidated Results: [Result 1, Result 2])
   ↓
Assistant Turn (Final Text)
```

### Invariant 2: Zero Uncaught Exceptions
An agent tool must **never** crash the runner process. If a database is unreachable, a network timeout occurs, or an integer parameter throws `ZeroDivisionError`, our registry traps the exception:

```python
try:
    result = tool_func(**tool_call.arguments)
    return ToolResult(call_id=tool_call.id, name=tool_call.name, content=json.dumps(result))
except Exception as e:
    return ToolResult(
        call_id=tool_call.id,
        name=tool_call.name,
        content=f"Error executing tool '{tool_call.name}': {type(e).__name__}: {str(e)}",
        is_error=True,
    )
```
By feeding the error back to the model with `is_error=True`, the LLM can apologize, try an alternative tool, or request clarification from the user—just like a senior engineer recovering from an API hiccup.

### Invariant 3: Context Window Hygiene
In real-world customer support, conversations can span dozens of turns. Without context management, latency explodes and token costs skyrocket.

Our runner enforces automated history pruning that trims older messages from the top of the history stack while preserving turn alternation (always ensuring the oldest surviving message is a `user` turn).

---

## 🔌 Designing the Unified Provider Abstraction

We wanted to be able to switch between Google Gemini, OpenAI, and Anthropic with **one line of code**, without modifying our tool definitions or use-case prompts.

We defined an abstract base class `BaseLLMProvider`:

```python
class BaseLLMProvider(ABC):
    @abstractmethod
    def generate(
        self,
        messages: list[Message],
        tools: list[ToolDefinition] | None = None,
        system_instruction: str | None = None,
        temperature: float = 0.2,
    ) -> ModelResponse:
        pass
```

### Canonical Primitives (Pydantic v2)
Every provider translates to and from our canonical dataclasses:
* `Message`: Typed by role (`USER`, `ASSISTANT`, `TOOL`, `SYSTEM`).
* `ToolCall`: Canonical ID, tool name, and deserialized argument dictionary.
* `ToolResult`: Output content, status, and error flags.
* `ModelResponse`: Text content, list of tool calls, token usage metadata, and finish reason.

### Implementing the Gemini Adapter
Using the modern `google-genai` SDK, our Gemini adapter translates internal `Message` objects into native `types.Content` and Gemini function declarations:

```python
class GeminiLLMProvider(BaseLLMProvider):
    def __init__(self, api_key: str | None = None, model: str = "gemini-2.5-flash"):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        self.client = genai.Client(
            api_key=self.api_key,
            http_options={"api_version": "v1beta"},
        )
        self.model = model
```

Swapping models is as simple as:
```python
# Gemini 2.5 Flash
agent = AgentRunner(provider=GeminiLLMProvider(), registry=tools)

# OpenAI GPT-4o (plug-and-play)
agent = AgentRunner(provider=OpenAILLMProvider(), registry=tools)
```

---

## 🚀 Key Takeaways for Senior AI Engineers

1. **You don't need 50,000 lines of framework code to build autonomous agents.** The core primitives of an agent—state history, tool registry, execution loop, and model interface—can be written cleanly in under 400 lines of typed Python.
2. **Provider independence is easier than you think.** If you standardize your internal `Message` and `ToolCall` schemas, writing adapters for Gemini, OpenAI, and Anthropic takes less than an afternoon.
3. **Resilience begins with invariants.** Designing for strict turn alternation and zero uncaught exceptions eliminates 99% of production runtime crashes before they happen.
