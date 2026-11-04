---
title: "Handoff is a feature, not a failure"
description: "What I learned designing when an AI agent should stop and let a person take over."
---

About 15% of the conversations our agents handle end with a handoff to a person. It's tempting to treat that number as the thing to drive down.

## The agent shouldn't be the last line of defence

A customer who needs a refund approved, or is angry, or asks something the agent has no way of knowing, is best served by a person. An agent that tries to push through those cases doesn't save anyone time. It annoys the customer and hides the problem from the business.

The better question isn't "how do we avoid escalation?" but "how do we make escalation good?"

## What good handoff needs

**The agent decides, with context.** Each agent has its own escalation rules and goals. It also needs to know who is actually available right now. Handing a conversation to a team that is offline is worse than not handing it off.

**Two modes.** In one, the agent stops and a person owns the conversation from then on. In the other, a hybrid, the agent keeps replying until a human steps in, and then it steps back. The second one needs more care, because "who is talking now" has to be unambiguous at every message.

**The agent can ask for help without leaving.** Sometimes the agent just needs one fact from a person. Instead of escalating the whole conversation, it can ask a human, get the answer, and carry on with the customer. This kept more conversations inside the agent without pretending it knew things it didn't.
