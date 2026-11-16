---
title: "Nobody knew what was happening on the shared WhatsApp number"
description: "A short case study on giving small business owners visibility into a shared WhatsApp number through their own AI assistant."
---
Here is how I approached the shared WhatsApp number problem, in Situation, Task, Action, Result form.

## Situation

Many small businesses run customer service from a single WhatsApp Business app number, shared across several people. The phone sits with whoever is free. Nobody knows what's happening on it, including the owner. What are customers asking? How are staff replying? Are people being kept waiting? The information exists, but it's spread across phones and chat histories that nobody can search.

## Task

I wanted to give owners that visibility without asking them to move off the app they already use, and without building another dashboard for them to learn.

## Action

I built Peach CoPilot, a product separate from Peach. It has three steps: the owner connects their existing number, we index the chat history in the background, and the owner connects their own AI assistant, whether Claude, ChatGPT or another client, through MCP. They can then ask it what customers are asking about and how the team is replying.

Two choices stand out:

- **An assistant, not a dashboard.** Owners already use these assistants, so I gave their assistant access to the one part of the business they couldn't see. It also keeps the product independent of any single model.
- **Onboarding that survives a round trip.** The sign-up sends the user to Meta and back, possibly in another tab and possibly much later. So I work out which step they're on from facts that persist, and not from what the browser session remembers.

Along the way I found the kind of bug that matters most. New accounts had no owner recorded for the linked number, so incoming conversations sat unassigned, with no error and no log. The account looked fine and quietly did nothing. I fixed it, and the system now logs when it skips.

## Result

An owner can ask their assistant what customers are asking and how the team is replying, with no new tool to learn. The silent-assignment bug is closed.

## What I took from it

- Derive onboarding state from durable facts instead of the session.
- The worst bugs in an onboarding flow aren't the ones that crash. They're the ones that leave a working-looking account that quietly does nothing.
