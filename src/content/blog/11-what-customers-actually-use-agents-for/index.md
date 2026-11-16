---
title: "Why our WhatsApp agents run on Gemini, and what customers use them for"
description: "A short case study on choosing a model for WhatsApp agents and two real deployments: a replaced call centre, and order and product questions."
featured: 3
---
Since mid-2025 I've been building AI agents on top of Peach. This is a plain account of the model choice and what customers actually did, in Situation, Task, Action, Result form.

## Situation

WhatsApp conversations are frequent and short. Across thousands of them a month, a small difference in cost per message becomes a real difference in what a customer can afford to run.

## Task

I needed a model that performed well enough on our customers' conversations at a cost they could sustain.

## Action

Our agents run on Gemini. When we started it was the cheaper option, and we tried OpenAI's models as well. On our own conversations and tasks we were getting similar performance, so we stayed. That comparison was informal, and it's not a general claim about the models.

## Result

Two real deployments show what customers did with the agents:

- **They replaced their call centre.** One customer uses our autonomous agent for support and shut down their entire call centre, moving support to WhatsApp. It wasn't a pilot alongside the old system. They switched. In October, over a thousand conversations went through the agent, and under 1 in 10 were handed to a person. That's a floor on how often the agent wasn't enough, not a resolution rate; I explain why in [Most of our agent conversations end as "timeout"](/blog/03-timeout-is-not-failure). That only works because the agent hands off to people for the cases it can't handle, which is why I put so much effort into [handoff](/blog/04-handoff-is-a-feature).
- **They let customers ask about products and orders.** A large manufacturer uses our agents so their customers can ask about products and the orders they've placed. It's the unglamorous use case: questions that would otherwise go to a support person.

## What I took from it

- On a channel like WhatsApp, cost per message matters more than people expect.
- Judge models on your own conversations, not on general claims.
- Replacing a human channel works only if handover to people is reliable.
