---
title: "Why our WhatsApp agents run on Gemini, and what customers use them for"
description: "Why I chose Gemini for WhatsApp agents, and what two real customers did with them."
featured: 3
---
Since mid-2025 I've been building AI agents on top of Peach. Here's the model I chose and what customers actually did with the agents.

## Why Gemini

Cost matters more on WhatsApp than people expect. Conversations are frequent and short, so across thousands of them a month, a small difference in cost per message becomes a real difference in what a customer can afford to run.

When we started, Gemini was the cheaper option. We tried OpenAI's models too, and on our own conversations and tasks we were getting similar performance, so we stayed. That comparison was informal, and it's not a general claim about the models.

## What customers did with them

**One customer replaced their call centre.** They use our autonomous agent for support and shut down their entire call centre, moving support to WhatsApp. It wasn't a pilot alongside the old system. They switched. In October, over a thousand conversations went through the agent, and under 1 in 10 were handed to a person. That's a floor on how often the agent wasn't enough, not a resolution rate; I explain why in [Most of our agent conversations end as "timeout"](/blog/03-timeout-is-not-failure). It only works because the agent hands off to people for the cases it can't handle, which is why I put so much effort into [handoff](/blog/04-handoff-is-a-feature).

**A large manufacturer lets customers ask about products and orders.** It's the unglamorous use case: questions that would otherwise go to a support person.
