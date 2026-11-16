---
title: "Giving every coding agent its own copy of the app"
description: "A short case study on running several branches and several AI coding sessions at once without them breaking each other."
---
As more of our code is written with AI coding agents, the constraint stopped being the model and became the environment around it. This is how I approached it, in Situation, Task, Action, Result form.

## Situation

Several people and several AI coding sessions were working in the same repository at the same time. Say I'm reviewing a pull request while one agent builds a feature and another fixes a bug. They all want the same port, the same development database and the same background workers. One agent's database change breaks the others, and a stray worker from one session processes jobs meant for another.

Asking people, or agents, to take turns doesn't work, because the point of an agent is that it runs while you're busy with something else.

## Task

I wanted any number of branches and agent sessions to run at once without interfering, with no special coordination from the people involved.

## Action

- **One isolated copy per branch.** One command creates a copy of the app with its own ports, its own databases and its own job queue. One cleanup command removes the copies whose branches have already merged.
- **Sign-in without secrets.** An agent that drives a browser to check a change can't type a password and shouldn't have to. I added a development-only one-time sign-in link that doesn't exist in production, so no credentials go into a prompt.
- **A short guide for agents.** The repository has a brief guide that is always loaded. It holds only the few rules that prevent expensive mistakes, such as never letting one customer's data reach another. Everything else sits behind links and is read only when a task needs it. A long guide gets skimmed by people and agents alike.
- **Show, don't describe.** For anything about how a screen looks, the agent runs the real app and returns screenshots instead of describing the change in words.

## Result

A review on the main branch, a feature on one branch and a bug fix on another can all be running at the same time, and none of them can break another's database.

## What I took from it

- Isolation beats coordination.
- Keep secrets out of the loop.
- Keep the always-loaded guide short enough that a person would actually read it.
