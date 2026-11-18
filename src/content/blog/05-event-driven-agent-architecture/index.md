---
title: "Event-Driven AI: Designing Decoupled Agent Lifecycle Hooks and Observers"
description: "How to decouple agent reasoning loops from telemetry, web streaming, and auditing using a strongly-typed AgentEventBus."
date: "2026-11-15"
series:
  id: "customer-support-custom-runtime"
  title: "Building Customer Support Agent with Custom Runtime"
  part: 5
---

## The Monolithic Trap in Agent Design

When teams build their first LLM agent, all concerns tend to get dumped directly into the execution loop:
* The web framework handler triggers the LLM.
* Streaming tokens to the frontend is handled inside the tool dispatcher.
* Telemetry metrics and Prometheus counters are hardcoded inside the database calls.
* Security audit logging is sprinkled across retry blocks.

Within three months, the codebase is completely untestable. Swapping the model or changing the frontend streaming protocol requires rewriting the core reasoning loop.

In traditional backend engineering, we decouple execution from observability using **Domain Events and Pub/Sub**. In this post, we’ll show how we turned our framework-free agent harness into an **Event-Driven Runtime** using a strongly-typed, non-blocking `AgentEventBus`.

---

## 🏛️ The Event-Driven Lifecycle Pattern

Instead of the `AgentRunner` talking directly to logging libraries or WebSocket managers, it simply emits typed lifecycle events at every step of its execution:

```
┌─────────────────────────────────────────────────────────────┐
│                        AgentRunner                          │
│                                                             │
│  [Turn Start] ──► [LLM Request] ──► [Tool Call] ──► [Done]  │
└──────┬──────────────────┬──────────────┬──────────────┬─────┘
       │ emit             │ emit         │ emit         │ emit
┌──────▼──────────────────▼──────────────▼──────────────▼─────┐
│                 AgentEventBus (Pub/Sub)                     │
├──────────────────┬──────────────────────┬───────────────────┤
│ OpenTelemetry    │ Server-Sent Events   │ Security Auditor  │
│ Tracer           │ (FastAPI Streaming)  │ (Postgres/S3)     │
└──────────────────┴──────────────────────┴───────────────────┘
```

### The Core Event Catalog (Pydantic v2)
Every event inherits from a common `AgentEvent` base model containing session metadata and microsecond timestamps:

```python
class AgentEvent(BaseModel):
    timestamp: float = Field(default_factory=time.time)
    session_id: str = "default"

class TurnStartEvent(AgentEvent):
    user_prompt: str

class LLMRequestEvent(AgentEvent):
    model: str
    message_count: int
    temperature: float

class LLMResponseEvent(AgentEvent):
    latency_ms: float
    usage: TokenUsage
    tool_call_count: int

class ToolStartEvent(AgentEvent):
    call_id: str
    tool_name: str
    arguments: dict[str, Any]

class ToolEndEvent(AgentEvent):
    call_id: str
    tool_name: str
    duration_ms: float
    is_error: bool
    output_preview: str

class TurnEndEvent(AgentEvent):
    final_response: str
    turn_count: int
    total_tokens: int
```

---

## 🛡️ Critical Invariant: Fault-Tolerant Event Dispatch

What happens if an external subscriber (e.g. a Datadog metrics client or a WebSocket connection) crashes while processing an event?

**Rule:** A broken listener must **never** crash or stall the agent conversation.

Our `AgentEventBus.emit()` method guarantees fault isolation by catching subscriber exceptions locally:

```python
def emit(self, event: AgentEvent) -> None:
    # 1. Dispatch to event-specific handlers
    for handler in self._subscribers.get(type(event), []):
        try:
            handler(event)
        except Exception as e:
            logger.error(f"Error in event subscriber {handler.__name__}: {e}", exc_info=True)

    # 2. Dispatch to global catch-all handlers
    for handler in self._all_subscribers:
        try:
            handler(event)
        except Exception as e:
            logger.error(f"Error in global subscriber: {e}", exc_info=True)
```

---

## 💡 Real-World Use Case: Streaming Server-Sent Events (SSE)

Because of this decoupled event system, implementing real-time streaming in our FastAPI microservice took less than 20 lines of code:

```python
@app.post("/v1/chat/stream")
def chat_stream(req: ChatRequest):
    agent = get_agent(req.session_id)
    event_queue: list[str] = []

    # Subscribe an ephemeral streaming listener to this turn's event bus
    def on_event(event: AgentEvent):
        payload = {"event": type(event).__name__, "data": event.model_dump()}
        event_queue.append(f"data: {json.dumps(payload)}\n\n")

    agent.event_bus.subscribe_all(on_event)

    def event_generator():
        result = agent.run(req.prompt, session_id=req.session_id)
        while event_queue:
            yield event_queue.pop(0)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

The frontend immediately receives visual progress indicators:
* `TurnStartEvent` $\rightarrow$ Spinner appears: *"Analyzing your request..."*
* `ToolStartEvent(tool_name="get_order_status")` $\rightarrow$ *"Checking FedEx tracking system..."*
* `TurnEndEvent` $\rightarrow$ Final response rendered!

---

## 🏆 Key Takeaways for Senior AI Engineers

1. **Keep the cognitive loop pure.** The core reasoning loop should do exactly one thing: manage history, invoke the model, and dispatch tools.
2. **Event-driven runtimes are infinitely extensible.** When product managers ask for Slack alerts on tool failures, or data engineers ask for an audit lake in Snowflake, you simply write a new subscriber without touching a single line of agent prompt or runner code.
3. **Fault isolation is mandatory.** Never let third-party logging or network metrics break the user's conversation.
