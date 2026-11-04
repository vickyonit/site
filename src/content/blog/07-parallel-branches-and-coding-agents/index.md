---
title: "Giving every coding agent its own copy of the app"
description: "How we run several branches and several AI coding sessions at once without them stepping on each other."
---

Once a few people, and a few AI coding sessions, work in the same repo at the same time, the problem stops being the code. It's ports, databases and half-started servers.

## The setup

We have a small command that creates a git worktree for a branch and gives it its own everything:

- its own directory
- its own app port and asset server port (offset by a slot number from the main checkout)
- its own Postgres database and test database
- its own Redis index for jobs and websockets
- its own generated environment file

```sh
bin/peach-worktree create feat/my-feature --from origin/main --fetch --start
bin/peach-worktree teardown feat-my-feature
```

A review on `main` and a feature on a branch can both be running right now, and neither can break the other's database. When a branch merges, one command removes the worktrees that are done.

## The part that took longer: signing in

An agent that drives a browser to check a UI change can't type your password, and it shouldn't have to. We added a development-only endpoint that prints a one-time link which signs the dev server in as a given user and lands on a path. No credentials in the prompt, and it doesn't exist in production.

## Writing for agents, not just people

Our repo has a short, always-loaded guide with the rules that matter most: every query is scoped to the account, never bypass the messaging callbacks, and when a question is about what a user sees, show a screenshot instead of describing it. Longer reference docs for each subsystem are linked from it and loaded only when a task touches that area.

The short file is the important part. A long one gets skimmed by humans and agents alike. The rules that prevent expensive mistakes go in the short file, and everything else goes behind a link.

## What I'd tell you

- Isolation beats coordination. Don't ask sessions to take turns; give each one its own world.
- If an agent keeps making the same mistake, the guide is missing a rule.
- Keep the always-on file small enough that you'd read it yourself.
