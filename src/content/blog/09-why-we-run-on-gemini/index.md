---
title: "Why our agents run on Gemini"
description: "A plain account of how we picked a model for WhatsApp agents, and what I'd want to know before copying it."
---

People ask which model our agents run on. The answer is Gemini, and the reason is less interesting than people hope.

## What happened

When we started building agents in 2025, Gemini was cheaper than the alternatives. We tried OpenAI's models as well. On our own conversations, Gemini gave us similar results at a lower cost, so we stayed.

That's the whole decision. There was no benchmark spreadsheet and no grand theory.

## Why cost mattered so much

WhatsApp conversations are short and frequent. An agent might answer a handful of questions, wait a day, and answer a few more. Across thousands of conversations a month, a small difference in cost per message adds up to a real difference in what a customer can afford to run.

A good model that customers can't afford to turn on is worse than a decent one they can.

## What I'd want you to know before copying this

- "Similar performance" was judged on our conversations, for our kind of tasks. I'd never claim it's true in general.
- Models change every few months. A choice that was right when we made it can be wrong now, so I'd rather re-test on real transcripts than trust my memory.
- Cost is one input. Our scheduled audits exist partly so that a change of model can be checked against real conversations instead of guesses.

I don't have a clean latency or cost-per-conversation figure to put here, and I'd rather leave it out than invent one.
