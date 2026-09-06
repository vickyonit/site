---
title: "Context is a budget"
description: "Dexy’s agent loop can run hundreds of iterations. Compaction, tool groups, workspace.md, and spawn_agent exist because prompt size is a production outage waiting to happen."
date: "Sep 4 2026"
---

`WorkspaceAgent` is not a single completion. The loop can run up to 250 iterations, with a hard cap on consecutive function calls. That’s enough rope to hang a workspace — and your Gemini bill.

So context in Dexy is treated like memory pressure on a server, not like “paste more transcript.”

What we actually do:

- **Compaction** via a context manager with an explicit budget (a slice of a large window, not “whatever fits”)
- **Tool groups** so the model sees compressed capability surfaces instead of a phone book of MCP tools
- **`workspace.md`** as durable workspace memory the agent *reads with tools*, not inlined on every turn
- **Progressive disclosure** for MCP: search, then describe, then execute
- **`spawn_agent`** for heavy work with untruncated MCP results when the parent would otherwise get a stub and invent the rest

We log when input tokens cross painful thresholds. We have internal plans that exist only because high-input turns showed up in production traces. This is not theoretical.

The product rule I won’t break: if a tool result is too big, **don’t silently chop it and continue**. Offload or spawn. Silent truncation is how “AI made up a row that wasn’t in the sheet” becomes a support thread you can’t win.

Browser tasks and sandbox runs (nsjail) sit in the same philosophy — long work belongs in a bounded subsystem with timeouts and late-result handling, not stuffed into the parent chat until the provider 504s. We fixed spawn/MCP timeouts the hard way: path-scoped load balancer rules and proxy limits, not prompt poetry.

If your agent product doesn’t have a named strategy for context growth, you don’t have an agent product. You have a demo that works until the second week.
