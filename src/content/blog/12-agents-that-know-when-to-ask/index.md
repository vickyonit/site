---
title: "Agents that know when to ask"
description: "An agent told a customer it would get back to them, and never asked anyone. What I changed, and what the numbers showed."
---
I came across a conversation that bothered me. A customer had asked about a product, and our agent replied, "Let me check with our store expert and get back to you." It read fine. Except the agent never actually asked anyone. Nothing in the system was going to bring that conversation back. The customer was left waiting on a promise nobody was keeping.

I build agents in two places: a WhatsApp product for small businesses, and a workspace product where agents do multi-step work for a team, like pulling data from several tools and writing a report. The users are different, but the failure was the same. When an agent hit something it couldn't answer, it either guessed or made a promise it couldn't keep. In support, that costs you a customer. In reporting, it costs you a wrong number that somebody trusts.

What I wanted was an agent that behaves like a decent colleague. Do what it can, say so when it can't, and make it easy for the right person to step in. And I wanted that built into the system, not left to the agent remembering to be polite.

## What was wrong, and what I changed

**The agent had no real way to ask.** It could answer, or it could hand the whole conversation to a person. Nothing in between. When it wasn't sure, it improvised a third option: it said it would check. So I gave it a real one. The agent can now put a question to a person inside the conversation and stay in charge of the customer. Only a genuine handover moves ownership.

**The promise had nothing behind it.** Even with a way to ask, a model can say "let me check" and never use it, which is exactly what happened. So the system now looks for that promise. If the agent tells a customer it will check internally and no question was filed, it nudges the agent to file one, or to hand over to a person. The customer still gets the message, so nothing feels broken.

**Nobody was clearly in charge.** Once an agent can ask for help, and a person can step in, someone has to own the conversation at every moment. It's either the agent or a person, and that's recorded in the system. I didn't want to rely on a prompt that says "stop replying once a human steps in."

**The team product had the same shape.** An agent would start a job without the tools or data it needed, or hit a question halfway through, and guess. Now it checks that everything it needs is available before it starts. If it hits a question midway, the work pauses in a visible "blocked" state and picks up when someone answers.

## What the numbers say

I looked at the last 90 days across a handful of agents on WhatsApp.

Fewer than 1 in 10 of a couple of thousand conversations ended with a person taking over. Among the conversations where the agent asked a person for help instead, only a few percent did. So the agent stays in charge, which is what I wanted.

The human side is the weak spot. Fewer than half of the questions the agent filed were answered by a teammate. A typical answer took a few days, and the slowest took weeks. Most of those conversations had ended as "went quiet", about the same share as across all conversations.

So the mechanism works, and the bottleneck is how quickly the right person sees and answers the question. That's where I'd work next. I haven't measured whether customers preferred the outcome.

## What stays with me

An agent that can say "I need help" is worth more than one that's right slightly more often. And "waiting on a person" should be a real state in your system, with an owner and a way back. If you only measure the agent, you miss half the loop.
