---
title: "Giving every coding agent its own copy of the app"
description: "How we run several branches and several AI coding sessions at once without ports, databases and servers colliding."
---
As more of our code is written with AI coding agents, the constraint stopped being the model and became the environment around it. Several sessions working in one repository collide on ports, databases and background workers. This post describes how we isolate them, and how we write guidance so that agents follow the rules that matter.

Once several people, and several AI coding sessions, work in the same repo at the same time, the hard problem stops being the code. It becomes ports, databases and half-started servers.

## 1. The problem

Say you're reviewing a pull request on `main` while an agent builds a feature on a branch, and another agent fixes a bug on a third. They all want port 3000. They all want the same development database, and one agent's migration breaks the others. A stray background worker from one session processes jobs meant for another.

You can ask people, or agents, to take turns. It doesn't work, because the whole point of an agent is that it runs when you're busy with something else.

## 2. The setup: one island per branch

We have a small command that creates a git worktree for a branch and gives it its own everything:

| Resource | Main checkout | Worktree number N |
| --- | --- | --- |
| Directory | your usual clone | a sibling folder |
| App port | 3000 | 3000 + N |
| Asset server port | 3035 | 3035 + N |
| Development database | your normal one | a separate one per branch |
| Test database | your normal one | a separate one per branch |
| Redis index | the default | N + 1, for jobs and websockets |
| Environment file | manual | generated |

```sh
bin/peach-worktree create feat/my-feature --from origin/main --fetch --start
bin/peach-worktree teardown feat-my-feature
```

A review on `main` and a feature on a branch can both be running right now, and neither can break the other's database. When a branch merges, one cleanup command removes every worktree whose branch has landed.

## 3. The part that took longer: signing in

An agent that drives a browser to check a UI change can't type your password, and it shouldn't have to. We added a development-only endpoint that prints a one-time link. Opening it signs the dev server in as a given user and lands on a path:

```sh
bin/dev-sign-in <email> [path] [base_url]
```

No credentials go into the prompt, and the endpoint doesn't exist in production.

## 4. Writing for agents, not just people

The repo has a short guide that is always loaded. It holds the few rules that prevent expensive mistakes:

- Every query is scoped to the account. Tenants must never see each other's data.
- Never bypass the messaging callbacks. Sending a message has side effects, and skipping the proper path skips them.
- When a question is about what a user sees, show a screenshot instead of describing it.

Longer reference docs for each area, such as messaging, automations, pipelines and billing, are linked from that file and are only read when a task touches that area. Small rule files are loaded automatically when you edit files in a subsystem, and point to the deeper doc.

The short file matters most. A long one gets skimmed by people and agents alike. The rules that prevent expensive mistakes go in the short file, and everything else goes behind a link.

## 5. Showing instead of telling

For anything about how a screen looks or behaves, the guide tells agents to run a command that drives the real app with Playwright and returns screenshots, instead of describing the change in words. The reviewer, human or agent, sees the actual screen, and can compare against the previous version.

## Summary

Isolation beats coordination: give each branch, and each agent session, its own copy of the app rather than asking sessions to take turns. Keep secrets out of the loop with one-time sign-in links. Keep the always-loaded guide short enough that a person would read it, and put everything else behind a link.
