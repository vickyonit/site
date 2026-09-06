---
title: "Peach and Dexy"
description: "Same company, two runtimes: Peach is the WhatsApp business messaging plane; Dexy is the workspace agent and playbook plane. They meet at Streams and MCP — not as one monolith."
date: "Sep 6 2026"
---

People ask if Dexy is “Peach’s AI” or if Peach is “Dexy on WhatsApp.” Neither. We built two systems because the constraints are different.

**Peach** is the messaging plane: Cloud API / BSP clients, inbound webhooks, conversations, templates, broadcasts, inbox, pipelines, automations, coexistence numbers, billing. AI agents here live inside stream sessions on top of that lifecycle. If you bypass `Conversation#add_message`, you don’t get a clever agent — you get ghosts with no delivery job, no activity, no analytics.

**Dexy** is the workspace runtime: accounts and workspaces, artifacts, playbooks, sources, DuckDB tables, MCP catalog, sandbox, browser extension tasks, long agent loops. The unit of reusable work is a playbook with a requires contract, not a WhatsApp flow screen.

They plug into each other deliberately:

- WhatsApp events can land in Dexy via Peach Streams callbacks, run a chat agent, and post events back
- Peach shows up in Dexy’s MCP catalog; Dexy’s universal MCP is built so clients like Peach can consume connected tools without swallowing Dexy-native internals
- Prompt / Gemini / Liquid habits look related because the same people built both — the databases and domain models are not shared

Keeping them separate is a product decision. WhatsApp rate limits, 24-hour windows, and template rules should not dictate how a playbook preflights GitHub + a data table. Workspace RBAC and nsjail should not dictate how an inbox assigns an escalated chat.

What I want this site to show isn’t a generic “AI PM” take. It’s that I’ve spent years in the guts of both planes — the connector tax, the retry tax, the context tax — and I still think the boring contracts (message lifecycle, requires/preflight, MCP doors, turn leases) are the actual product.

If you’re hiring for applied agents: I care whether your system fails closed when dependencies are missing, and whether a retry can publish your tool syntax to a customer. Everything else is costume.
