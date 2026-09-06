---
title: "Playbooks aren't prompts"
description: "In Dexy, a playbook is Markdown plus a typed requires contract — parse, validate, preflight against live tools, then Run. The failures that matter happen before the model speaks."
date: "Sep 2 2026"
---

Most “AI automation” products are a prompt with a schedule. We tried that shape in our heads for Dexy and threw it out.

A Dexy playbook is an `Artifact` — Markdown body plus YAML frontmatter. The frontmatter is not decoration. It declares what the run is allowed to need:

- tools
- mcp servers
- tool categories (resolved to real MCP servers at configure time)
- source categories (GitHub, Drive, calendar, ads, …)
- data tables (DuckDB-backed, only `ready` tables count)

Before anything hits Gemini, we run a pipeline that looks more like shipping software than chatting:

```
parse → validate (draft / structured / strict) → preflight → Run → ExecuteRunJob → WorkspaceAgent
```

`strict` is the only mode that does full semantic validation — semver, execution policy, outputs, requires shape. Draft is for editing. That distinction exists because we kept burning time on “the agent failed” tickets that were actually “the playbook lied about its dependencies.”

Preflight is where product honesty lives. It checks the workspace’s *actual* tools, servers, sources, and tables — not what the author wished was connected. We’ve had production cases where Slack was connected, the playbook required a `crm`/`comms` category, and the installed MCP server row had `categories = []`. The agent never got a fair chance. The catalog metadata was wrong. That’s not an LLM problem.

When preflight fails we create a failed Run with guidance a human can act on (connect X, configure Y), including a connect-and-resume path. The alternative — start the agent and let it thrash — teaches users the wrong lesson about AI.

I care about this because Dexy’s job is not “sound smart in a workspace.” It’s to make repeatable work *executable* across connectors without pretending the model can invent OAuth. If the requires contract is sloppy, the whole product becomes a chatbot with extra steps.
