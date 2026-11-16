---
title: "Handoff is a feature, not a failure"
description: "How our agents pass a conversation to a person or to another agent, and what travels with it."
featured: 1
---
Handoff is where agent systems show their seams. An agent that can't pass work on either fails customers quietly or pretends to know things it doesn't.

It's tempting to treat the share of conversations that end with a person as the number to drive down. I think the better question is how to make those handovers good. Sometimes a person is needed. Sometimes the conversation belongs with a different agent, say moving from a front-desk agent to one that handles orders. Either way, the next party shouldn't have to start cold, and everyone should know who's in charge.

## Handing over to a person

When an agent decides a person is needed, it has to give three things: a message for the customer, a summary of what's happened and a reason. The summary and reason are saved on the conversation as a note, so whoever opens it knows what's going on.

There are two modes. In one, the agent stops completely. In the other, it keeps replying until a person actually steps in, and then it steps back. Either way, "who is talking right now?" has exactly one answer, and it lives in the system, not in the prompt. When an agent should stop replying, I don't ask it nicely.

## Handing over to another agent

The receiving agent gets a short summary and the customer's detected intent, so it starts from "here's what they want and what's been said" and doesn't ask again.

## Asking for help without leaving

Sometimes the agent only needs one fact, not a handover. It can ask a person and stay in charge of the conversation. I wrote about that, and about what the numbers show, in [Agents that know when to ask](/blog/12-agents-that-know-when-to-ask).

## How it's going

Conversations that need a person arrive with a summary and a reason. Over the last 90 days, fewer than 1 in 10 of a couple of thousand agent conversations ended with a person taking over, and the rest stayed with the agent. How quickly people answer when the agent only needs one fact is the weak spot.
