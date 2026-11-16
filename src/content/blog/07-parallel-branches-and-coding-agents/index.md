---
title: "Giving every coding agent its own copy of the app"
description: "How we run several branches and several AI coding sessions at once without them breaking each other."
---
As more of our code is written with AI coding agents, the limit stopped being the model. It became the environment around it.

Say I'm reviewing a pull request while one agent builds a feature and another fixes a bug. They all want the same port, the same development database and the same background workers. One agent's database change breaks the others, and a stray worker from one session processes jobs meant for another. Asking people, or agents, to take turns doesn't work, because the point of an agent is that it runs while you're busy with something else.

So I stopped trying to coordinate and gave each branch its own island. One command creates a copy of the app with its own ports, its own databases and its own job queue. One cleanup command removes the copies whose branches have already merged. A review on the main branch, a feature on one branch and a bug fix on another can all run at once, and none of them can break another's database.

Three smaller things helped:

- **Sign-in without secrets.** An agent that drives a browser to check a change can't type a password, and shouldn't have to. I added a development-only one-time sign-in link that doesn't exist in production, so no credentials go into a prompt.
- **A short guide for agents.** The repository has a brief guide that is always loaded. It holds only the few rules that prevent expensive mistakes, such as never letting one customer's data reach another. Everything else sits behind links and is read only when a task needs it. A long guide gets skimmed by people and agents alike.
- **Show, don't describe.** For anything about how a screen looks, the agent runs the real app and returns screenshots instead of describing the change in words.

Isolation beats coordination, and the guide you always load should be short enough that a person would actually read it.
