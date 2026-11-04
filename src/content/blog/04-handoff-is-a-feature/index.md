---
title: "Handoff is a feature, not a failure: how our agents pass work to people and each other"
description: "The design behind agent handoff: what context travels, who stays in charge, and how an agent can ask for help without leaving the conversation."
---
Handoff is where agent systems show their seams. An agent that can't pass work on, to a person or to another agent, either fails customers quietly or pretends to know things it doesn't. This post describes the three kinds of handoff in our system, what context travels with each, and the design decisions that kept them reliable.

About 15% of the conversations our agents handle end with a handoff to a person. It's tempting to treat that number as the thing to drive down. The better question isn't "how do we avoid escalation?" but "how do we make escalation good?"

This post covers how we built it. Handoff in an agent system is really three different things, and mixing them up causes most of the pain.

## 1. Handing off to a person

When an agent decides a person is needed, it calls an escalation tool. The tool isn't optional about its inputs. It requires three things: a message for the customer, a summary of what's happened, and a reason. The summary and reason are saved onto the conversation as a note, so the person who opens it doesn't start cold.

What happens next depends on a setting we call the escalation mode:

- **Handoff to human.** The agent stops. A person owns the conversation from then on.
- **Hybrid.** The agent can keep replying until a human actually steps in. Once a person takes over, which we track as an explicit `human_override` flag, the agent steps back.

Hybrid is the harder one. "Who is talking right now?" has to have one answer at every message, and it has to be a state in the database, not something the prompt is asked to remember. When we want to stop an agent replying, we don't ask it nicely.

## 2. Handing off to another agent

Some conversations should move between agents, for example from a front-desk agent to one that handles orders. The calling agent uses a handoff tool with the name of the target agent and, optionally, a short summary and the intent it detected.

Under the hood, the current session is completed, a new session starts on the target agent, and the summary and intent are written into that new session's context. The first time the target agent responds, we inject that context as a synthetic turn in its prompt. So the target agent starts with "here's what the customer wants and what's been said", and doesn't re-ask.

Two details matter more than they look:

- **The model's turn order has to stay valid.** With Gemini, the history we send must end on a user turn. When we move a conversation between agents, we re-attach the last customer message and only move the last bot reply if it's older. Get this wrong and the model errors or answers the wrong turn.
- **Receiving agents have to be told to look.** An agent's prompt must say "check for a handoff context before assuming no prior history". We wrote evals for this: the schema is respected, the agent doesn't re-ask, and injected text from a customer can't pose as a handoff.

## 3. Asking for help without leaving

The third case is the least obvious. Sometimes the agent doesn't need to hand over the conversation. It just needs one fact it doesn't have, such as a stock check or a policy exception.

For that, the agent has a tool to ask an internal expert. It creates a question, and the conversation stays with the agent. In the inbox, the question shows up under a "Needs answer" tab, as a card inside the conversation, with a small cue that says there's one pending question. When a person answers, the answer flows back, and the agent continues with the customer.

Importantly, a pending question does not mark the conversation as escalated. The customer is still talking to the agent, and the agent is still in charge. That kept more conversations inside the agent without pretending it knew things it didn't.

There's a related guard. If the agent starts to stall with phrases like "let me check on that and get back to you" without actually doing anything, the runtime catches it and nudges the agent to call the consultation tool, or to escalate if consultations are turned off. A promise to get back later is a failure mode, because nothing is going to bring the customer back.

## 4. A detail that prevents a nasty bug

We pin which runtime an agent uses when a session starts, and never change it afterwards. If someone flips a feature flag in the middle of a conversation, that conversation keeps running on the runtime it began with. Flipping behaviour under a live conversation is how you get replies that make no sense.

## Summary

Treat "who is in charge of this conversation" as data in the database, not as something the prompt is asked to remember. Pass a summary and a reason with every handoff so the next party doesn't start cold. And give the agent a way to ask for help without giving up the conversation. About 15% of our conversations reach a person; we treat that as a number to watch, not a target.
