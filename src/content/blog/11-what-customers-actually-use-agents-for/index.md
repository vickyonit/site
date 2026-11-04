---
title: "Running WhatsApp agents for customers: the model we chose and what they use them for"
description: "Why our agents run on Gemini, and two real deployments: a replaced call centre, and order and product questions."
---

Since mid-2025 we've been building AI agents on top of Peach. This is a plain account of the model we chose and what customers actually did with them.

## Why Gemini

Our agents run on Gemini. When we started, it was the cheaper model compared to the others. We tried OpenAI's models as well, and on cost we were getting similar performance from Gemini itself, so we stayed.

Cost matters more on WhatsApp than people expect. Conversations are frequent and short, so across thousands of them a month, a small difference in cost per message adds up to a real difference in what a customer can afford to run. "Similar performance" was judged on our own conversations and tasks. It's not a general claim about the models.

## What customers did with them

### They replaced their call centre

One customer uses our autonomous agent for support and shut down their entire call centre. They moved their support operation to WhatsApp.

It wasn't a pilot alongside the old system. They switched. For that to work, the agent has to hand off to people for the cases it can't handle, which is why we spent so much effort on handoff.

### They let customers ask about products and orders

A large manufacturer uses our agents so their customers can ask about products and the orders they've placed. It's the unglamorous use case that answers questions which would otherwise go to a support person.
