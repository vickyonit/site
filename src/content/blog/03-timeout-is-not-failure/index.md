---
title: "71% of my agent conversations end as \"timeout\". That isn't failure."
description: "How I measure AI agents when most chats just go quiet, and why I stopped reporting a resolution rate."
---

I pulled the numbers for our WhatsApp agents last week. Across roughly 90,000 conversations in a quarter, the final status looked like this:

| Status | Conversations | Share |
| --- | --- | --- |
| timeout | 63,855 | 71% |
| escalated | 13,878 | 15.5% |
| completed | 10,094 | 11% |
| in progress | 1,711 | 2% |
| failed | 16 | under 0.1% |

My first reaction was that 71% sounded terrible. It isn't, and working out why changed how I think about measuring agents.

## What "timeout" means

In our system a conversation gets an expiry time. If that time passes while the conversation is still open, it is marked `timeout`. Nothing went wrong. The customer got their answer, or lost interest, or went to lunch, and the chat went quiet.

`completed` is different. It only happens when the agent explicitly decides the conversation is done and closes it. Most agents don't do that, because most customers don't say goodbye.

So the three big buckets are not success, failure and in-between. Two of them are mostly "the customer stopped replying", and one is "a human was needed".

## Why I won't report a resolution rate

If I called `completed` a resolution, the rate would be 11%. If I called everything that wasn't escalated a resolution, it would be 84%. Both numbers come from the same data, and neither is true. A customer who stopped replying might be satisfied, or might have given up.

The only number I trust right now is the escalation rate: about 15%. It means one in seven conversations needed a person, which I can defend because a person actually picked it up.

## What I'm doing about it

Counting statuses is the easy part. Knowing whether the customer got what they came for needs someone, or something, to read the conversation. That is why we score a sample of real conversations against a rubric on a schedule, instead of trusting the status column.

## One more thing I found

Usage is not evenly spread. Of the 94 accounts with active agents, the top five account for 97% of conversations. Averages across all accounts would have told me a story that isn't real.

I don't have a clean outcome metric yet. If you do, I'd like to hear how you got it.
