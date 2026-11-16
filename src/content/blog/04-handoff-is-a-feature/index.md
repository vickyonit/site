---
title: "Handoff is a feature, not a failure"
description: "A short case study on how agents pass work to people and to each other, and what travels with the handover."
featured: 1
---
Handoff is where agent systems show their seams. This is how I approached it, in Situation, Task, Action, Result form.

## Situation

Our agents talk to customers on WhatsApp. Sometimes a person is needed, and sometimes the conversation belongs with a different agent, such as moving from a front-desk agent to one that handles orders. An agent that can't pass work on either fails customers quietly or pretends to know things it doesn't.

It's tempting to treat the share of conversations that end with a person as the number to drive down. The better question is how to make those handovers good.

## Task

I wanted every handover to arrive with enough context that the next party, whether a person or another agent, doesn't start cold, and to make it unambiguous who is in charge at every moment.

## Action

- **Handing over to a person.** The agent has to give a message for the customer, a summary of what happened and a reason. The summary and reason are saved on the conversation as a note, so whoever opens it knows what's going on. An agent can either stop completely, or keep replying until a person actually steps in. Once a person does, the agent steps back.
- **Handing over to another agent.** The receiving agent gets a short summary and the customer's detected intent, so it starts from "here is what they want and what's been said" and doesn't re-ask.
- **Who is in charge is recorded, not remembered.** At every message there is one answer to "who is talking right now?", and it lives in the system rather than in the prompt. When an agent should stop replying, I don't ask it nicely.
- **Asking for help without leaving.** When an agent needs one fact, it can ask a person without handing the conversation over. I describe that in [Agents that know when to ask](/blog/12-agents-that-know-when-to-ask).

## Result

Conversations that need a person arrive with a summary and a reason. Over the last 90 days, fewer than 1 in 10 of a couple of thousand agent conversations ended with a person taking over, and the rest stayed with the agent. How quickly people answer when the agent only needs one fact is the weak spot, and I wrote about that in [Agents that know when to ask](/blog/12-agents-that-know-when-to-ask).

## What I took from it

- Treat "who is in charge of this conversation" as data, not as something the prompt is asked to remember.
- Send a summary and a reason with every handoff.
- Give the agent a way to ask for help without giving up the conversation.
