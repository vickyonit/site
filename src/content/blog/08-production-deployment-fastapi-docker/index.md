---
title: "The Production Blueprint: Deploying, Containerizing, and Serving Self-Hosted Agent Runnables"
description: "How to deploy autonomous agents to production using FastAPI REST + SSE streaming, non-root hardened Docker containers, and Jaeger distributed tracing."
date: "2026-11-18"
series:
  id: "customer-support-custom-runtime"
  title: "Building Customer Support Agent with Custom Runtime"
  part: 8
---

## Moving Beyond Terminal Prototypes

Running an agent from a CLI (`python main.py`) is great for local experimentation.

Deploying an autonomous agent to real users across web apps, Slack bots, and mobile frontends is a completely different engineering challenge:
* How do you stream conversational turn progress over HTTP without websockets dropping?
* How do you structure Docker containers for security compliance (non-root execution, minimal attack surface)?
* How do you expose health checks for Kubernetes liveness and readiness probes?
* How do you maintain session continuity across multi-turn user visits?

In this final installment of our series, we present our complete **production deployment blueprint**: a hardened FastAPI microservice, multi-stage Docker containerization, and one-command Docker Compose orchestration with Jaeger distributed tracing.

---

## 🏛️ The Serving Architecture (`serve.py`)

Our serving layer (`serve.py`) exposes a standardized REST and Server-Sent Events (SSE) API:

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Applications                         │
│       (Web Chat, React, iOS, Slack Webhooks)               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / WSS
┌──────────────────────────────▼──────────────────────────────┐
│                  FastAPI Serving Gateway                    │
│                                                             │
│  • GET  /v1/health       -> Kubernetes liveness probe       │
│  • GET  /v1/metrics      -> Prometheus / session telemetry  │
│  • POST /v1/chat         -> Synchronous request / response  │
│  • POST /v1/chat/stream  -> Server-Sent Events (SSE)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Agent Harness Core                       │
│     (Session Store + Engine + Security Gates + OTel)        │
└─────────────────────────────────────────────────────────────┘
```

### Synchronous REST vs. Streaming SSE
1. **Synchronous REST (`POST /v1/chat`)**: Ideal for simple backend-to-backend integrations and webhook dispatchers.
2. **Streaming SSE (`POST /v1/chat/stream`)**: Pushes real-time progress events directly to browser chat widgets so users see visual feedback while the agent thinks and queries databases:
   ```json
   data: {"event": "ToolStartEvent", "payload": {"tool_name": "get_order_status"}}
   data: {"event": "ToolEndEvent", "payload": {"duration_ms": 78}}
   data: {"event": "Complete", "final_response": "Your order #NG-84920 has shipped via FedEx!"}
   ```

---

## 🐳 Security-Hardened Multi-Stage Dockerfile

Deploying AI applications with bloated Docker images containing compilers and root privileges is a major security vulnerability.

Our `Dockerfile` follows enterprise container security best practices:
1. **Multi-Stage Build**: Compiles dependencies in a temporary builder stage using `uv`, leaving build tools behind.
2. **Non-Root Execution**: Creates an unprivileged `appuser` (UID 1000) so container escapes cannot compromise the host OS.
3. **Built-in Healthcheck**: Probes `/v1/health` to alert orchestration engines if the Python event loop deadlocks.

```dockerfile
# Stage 1: Build virtual environment
FROM python:3.12-slim AS builder
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# Stage 2: Hardened Runtime
FROM python:3.12-slim AS runner
WORKDIR /app
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser
COPY --from=builder /app/.venv /app/.venv
COPY . /app
ENV PATH="/app/.venv/bin:$PATH" PYTHONUNBUFFERED=1 PORT=8000
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/v1/health')" || exit 1
CMD ["uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

---

## 🚀 One-Command Local Orchestration (`docker-compose.yml`)

Developers can spin up the full production stack—including the API service and a local Jaeger OpenTelemetry collector—with a single command:

```bash
docker compose up --build
```

```yaml
version: "3.8"
services:
  agent-api:
    build: .
    ports: ["8000:8000"]
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318
    depends_on:
      - jaeger

  jaeger:
    image: jaegertracing/all-in-one:1.57
    ports:
      - "16686:16686" # Tracing Web UI
      - "4318:4318"   # OTel Collector
```

Once running:
* **Interactive API Docs**: Explore FastAPI Swagger documentation at `http://localhost:8000/docs`.
* **Distributed Traces**: Inspect live latency waterfalls at `http://localhost:16686`.

---

## 🏁 Series Wrap-Up & Complete Architecture Review

Over the course of this 9-post engineering curriculum, we started with a concrete e-commerce support challenge and built a **complete, framework-free production agent harness**:

* **[Part 0: The Problem Context](/blog/00-novagear-problem-context)** — The NovaGear scenario, failure modes of existing frameworks, and non-negotiable guarantees.
* **[Part 1: Why We Skipped LangChain](/blog/01-why-we-skipped-langchain)** — Core invariants, alternating turns, and unified provider abstraction.
* **[Part 2: Building the Runtime](/blog/02-building-runtime-and-tool-engine)** — Type-safe tool registries, schema reflection, and ReAct loops.
* **[Part 3: Zero-Trust AI](/blog/03-zero-trust-ai-auth-middleware)** — IDOR prevention and step-up OTP security gates.
* **[Part 4: Shipping NovaGear Support](/blog/04-shipping-novagear-support-agent)** — Local Markdown RAG, deterministic regression tests, and model benchmarking.
* **[Part 5: Event-Driven AI](/blog/05-event-driven-agent-architecture)** — Decoupled lifecycle hooks and pub/sub observers.
* **[Part 6: Production Observability](/blog/06-production-observability-opentelemetry)** — OpenTelemetry GenAI standards and latency waterfalls.
* **[Part 7: Context Hygiene & Compaction](/blog/07-context-hygiene-compaction)** — Micro-observations and cache-aware prefix freezing.
* **[Part 8: The Production Blueprint](/blog/08-production-deployment-fastapi-docker)** — Production serving, Docker hardening, and distributed tracing.

### Project Repository
All code, unit tests, evals, and deployment configs are open source on GitHub:  
👉 **[`https://github.com/vickyonit/agent-harness`](https://github.com/vickyonit/agent-harness)**
