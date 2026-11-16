---
title: "Agents that know when to ask"
description: "A short case study from two agent products: why the most useful thing an agent can do is stop and ask a person, and what it takes to make that a normal part of the system."
---
Agents are useful tools, but I don't treat them as team members yet. The difference shows up at one moment: when the agent doesn't know. This is a short account, in Situation, Task, Action, Result form, of how I handled that moment in two products.

## Situation

I work on two agent products. One runs customer conversations on WhatsApp for small businesses. The other runs multi-step work for a team, such as pulling data from several tools and producing a report.

They have different users, but they failed in the same way. When an agent hit something it couldn't answer, it either guessed, or it promised to "get back to you" and nothing ever followed.

I saw the second one in a real conversation. A customer asked about a product, and the agent replied, "Let me check with our store expert and get back to you." It never actually asked anyone. The message looked fine, but nothing in the system would ever bring that conversation back. In support, that costs a customer. In reporting, it costs a wrong number that someone trusts.

## Task

I wanted agents that behave like a good colleague. They should do the work they can, say clearly when they can't, and make it easy for the right person to step in. I also wanted this to be part of how the system works, not something the agent is politely asked to remember.

## Action

Four decisions shaped the design.

- **Asking is not escalating.** If the agent needs one fact, such as a policy exception, it asks a person inside the conversation and stays in charge. Only a real handover moves ownership. This kept more conversations with the agent without pretending it knew things it didn't.
- **Catch the promise that has no action behind it.** When an agent tells a customer it will check internally, the system now verifies that a question was actually filed. If not, the agent is prompted to file it, or to hand the conversation to a person. The customer still gets the message, so nothing feels broken.
- **Ownership is recorded, not implied.** At any moment, exactly one party is responsible for the conversation: the agent or a person. That is stored as data. Hoping the instructions get followed is not a plan.
- **Check before starting, pause instead of guessing.** In the team product, an agent confirms that the tools and data it needs are available before it begins. If it hits a question mid-task, the work pauses in a visible "blocked" state and resumes when someone answers.

## Result

Conversations and tasks now have a clear owner and a clear state. When an agent is stuck, a person sees it and can answer, and the work continues from where it stopped. The failure I started with, the quiet promise that never gets kept, is now caught instead of silently lost.

I haven't yet measured whether people resolve these questions faster, or whether customers prefer the outcome. That is the next thing I want to show with numbers.

## What I took from it

- An agent that can say "I need help" is more valuable than one that is right slightly more often.
- Put the rules about who is in charge in the system, not in the prompt.
- Treat "waiting for a person" as a real state, with an owner and a way back.
