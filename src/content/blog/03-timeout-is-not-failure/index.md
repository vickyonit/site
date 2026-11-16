---
title: "Most of our agent conversations end as \"timeout\". That isn't failure."
description: "Why most WhatsApp agent conversations end by going quiet, and what I measure instead of a resolution rate."
---
Over the last 90 days, our newest kind of agent, the autonomous agent, handled a couple of thousand WhatsApp conversations. Roughly 8 in 10 ended with the status "timeout". Fewer than 1 in 10 were escalated to a person, and the rest were still open. None were marked "completed" by the agent, and none failed.

A majority of "timeout" looks terrible at first glance. It isn't.

## A conversation on WhatsApp doesn't end. It stops.

On a phone call, someone hangs up. On WhatsApp, a customer asks a question, gets an answer and puts the phone down. Nothing tells you they're done, so the system closes a conversation only when its clock runs out. "Timeout" mostly means "went quiet". The customer may have been happy, or may have given up.

## Why I don't report a resolution rate

If I counted only the conversations the agent closed itself, the rate would be 0%, because our agents never close one and customers never say goodbye. If I counted everything that wasn't escalated, the rate would look great. Both come from the same data, and neither is true.

The one outcome I trust from the statuses is escalation, because a person actually took over. It's a floor on how often the agent wasn't enough, not a measure of whether it worked.

## What I do instead

I decide what "the end" means myself, and I treat a conversation that goes quiet as exactly that. I track escalations and failures, and I watch their trend. A steady majority of timeouts is normal, but a jump in failures is not. In the last 90 days, fewer than 1 in 10 were escalated and none failed.

To know whether a customer got what they came for, someone has to read the conversation. A small number read carefully beats a large number classified by a status field. A status records how a session ended inside the system, not how the conversation went.
