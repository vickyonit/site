---
title: "Over-scripting our support bot made it worse"
description: "A short case study on loosening tight prompts in an LLM-driven support bot, and why letting go of the script is not the same as letting go of control."
---
I used to caution against over-controlling language models, and then I caught my own team doing it. This is what happened, in Situation, Task, Action, Result form.

## Situation

Our customer support bot ran on tightly scripted prompts: fixed templates and step-by-step flows for tasks like booking and rescheduling. It was predictable, which is why we built it that way.

During a review, I found a customer who wanted to reschedule an appointment while travelling to a different time zone. The bot gave a correct answer about local time slots. It was also useless, because it ignored the one thing that made this customer's situation different.

## Task

I wanted the bot to help the customer in front of it, including the ones whose situation didn't fit the script.

## Action

I replaced the rigid template with a clear goal and clear boundaries. I gave the bot the context it needed, such as available slots, the customer's time zone and their preferences, and let it work out how to get there. I stopped dictating every step of the conversation.

## Result

The bot started asking the right questions, took the customer's circumstances into account, and offered alternatives we hadn't thought of. That comes from reading conversations, not from a measured comparison, and measuring it is the next step.

The bigger change was in how I think about control. Loosening the script doesn't mean loosening control. The control that matters moved elsewhere: what the bot is allowed to do, when it must hand over to a person, and who owns the conversation. I wrote about that in [Agents that know when to ask](/blog/12-agents-that-know-when-to-ask).

## What I took from it

- Ask whether you are empowering the model or imposing a checklist on it.
- Specify the goal and the boundaries. Don't specify every step.
- Judge the result by whether the customer's problem got solved, not by whether the script was followed.
