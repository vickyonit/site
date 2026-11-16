---
title: "Most of our agent conversations end as \"timeout\". That isn't failure."
description: "Why most WhatsApp agent conversations end by going quiet, and what I measure instead of a resolution rate."
---
Reading an agent's results from one status per conversation doesn't work on a channel where conversations never formally end. Here is how I handled that, in Situation, Task, Action, Result form.

## Situation

We run AI agents on WhatsApp. Over the last 90 days, our newest type of agent, the autonomous agent, handled a couple of thousand conversations. Roughly 8 in 10 ended with the status "timeout", fewer than 1 in 10 were escalated to a person, and the rest were still open. None were marked "completed" by the agent, and none failed. At first glance, a majority of "timeout" looks terrible.

It isn't. On a phone call, someone hangs up. On WhatsApp, a customer asks a question, gets an answer and puts the phone down. Nothing tells you they're done, so the system closes a conversation only when its clock runs out.

## Task

I needed to report on how the agents were doing without publishing a number that was either flattering or damning for the wrong reasons.

## Action

- **Defined the end ourselves.** A conversation that goes quiet is recorded as "went quiet", not as a verdict. The customer may have been satisfied, or may have given up.
- **Refused to publish a resolution rate.** Counting only agent-closed conversations would give 0%, because our agents never close one and customers never say goodbye. Counting everything not escalated makes it look high. Both come from the same data and neither is true.
- **Trusted the one unambiguous outcome.** Escalation means a person actually took the conversation. It's a lower bound on "the agent wasn't enough", not a measure of "the agent worked".
- **Read real conversations.** To know whether the customer got what they came for, someone has to read a sample. A small number read carefully beats a large number classified by a status field.

## Result

I now report escalations and failures, watch their trend, and judge quality from samples of real conversations. In the last 90 days that is fewer than 1 in 10 escalated and no failures. A steady majority of "timeout" is normal. A jump in failures is the thing worth noticing. I deliberately have no single resolution-rate number.

## What I took from it

- A status field records how a session ended in the system, not how the conversation went.
- On a channel without clear endings, define the end yourself and treat it as "went quiet".
- Track the states that need a person, and read samples to judge quality.
