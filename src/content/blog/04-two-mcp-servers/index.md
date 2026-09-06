---
title: "Two MCP servers, one product"
description: "Dexy exposes /mcp/v1 for native tools and /mcp/universal for connected external tools. Schema drafts, OAuth discovery quirks, and empty required arrays are the real work."
date: "Sep 3 2026"
---

Dexy talks MCP in both directions, and treating that as one blob is how you get a week of “it works in Claude but not here.”

**Inbound, we expose two doors on purpose:**

1. `/mcp/v1` — Dexy-native tools: playbooks, artifacts, sandbox, spawn agent, workspace stuff.
2. `/mcp/universal` — a gateway that advertises only *external* tools the account connected via `McpServer`. No Dexy internals mixed in.

That split is product. Clients (including Peach) that want “give me my connectors” should not inherit sandbox and playbook tools by accident. Capability negotiation rejects `resources` / `prompts` on universal — tools only — because half the clients lie about what they support.

**Outbound**, the agent doesn’t dump every tool schema into Gemini. Search → describe → execute. Lean declarations save tokens; full schemas are fetched when the model actually commits. Large results get offloaded to files instead of truncated into amnesia — truncation is how you teach an agent to hallucinate the rest of a CRM payload.

The boring bugs are the expensive ones:

- Empty `required: []` arrays that break JSON Schema draft-04 consumers
- Gemini wanting a different schema shape than the server published — we normalize
- OAuth well-known URL suffix forms that Peach/Claude clients disagree on
- SSE vs streamable HTTP, session reset, stale Nango/Composio grants that look like “MCP is down”

None of that shows up in a demo GIF. All of it shows up when a customer connects their real stack.

If you’re evaluating agent platforms, ask how they handle **two** MCP jobs: being a server other agents trust, and being a client that doesn’t melt the context window. We built both because Dexy is useless as only one of them.
