---
title: "71% of our agent conversations end as \"timeout\". That isn't failure."
description: "How session states work in a WhatsApp agent, why most chats end by going quiet, and what to measure instead of a resolution rate."
---
Running AI agents on WhatsApp taught us early that the usual way to read an agent's results, one status per conversation, doesn't work on a channel where conversations never formally end. This post explains how session states work in our system, what the numbers look like in practice, and what we measure instead.

Across roughly 90,000 agent conversations in a quarter, the final status looked like this:

| Status | Conversations | Share |
| --- | --- | --- |
| timeout | 63,855 | 71% |
| escalated | 13,878 | 15.5% |
| completed | 10,094 | 11% |
| in progress | 1,711 | 2% |
| failed | 16 | under 0.1% |

At first glance, 71% looks terrible. It isn't, and the reason says a lot about how to measure agents on a channel like WhatsApp.

## 1. A conversation on WhatsApp doesn't end. It stops.

On a phone call, the conversation has a clear end. Someone hangs up. On WhatsApp, a customer asks a question, gets an answer, and puts the phone down. There is no goodbye, and nothing in the protocol tells you they're done.

So every agent conversation in our system is a session with an expiry time. If a session is still open when that time passes, a background job moves it to `timeout`:

```ruby
def self.end_timedout_sessions
  ids = Wa::StreamSession.where(expiry_time: ..Time.now, status: :in_progress).pluck(:id)
  Wa::StreamSession.where(id: ids).update_all(status: :timeout)
  BotSession.where(context_type: 'Wa::StreamSession', context_id: ids).update_all(status: :closed)
end
```

Nothing went wrong in that conversation. The customer got an answer, lost interest, or went to lunch, and the clock ran out.

`completed` is a different thing. It only happens when the agent itself decides the conversation is finished and closes it. Most agents rarely do that, because most customers never say goodbye.

## 2. So what do the buckets mean?

- **timeout** is the default way a conversation ends. It tells you nothing about whether the customer was happy.
- **completed** means the agent explicitly closed the conversation. It's a small, biased sample.
- **escalated** means a person was needed, and a person picked it up.
- **failed** means something broke. At 16 out of about 90,000, it's the one to watch for movement.

Two of the three big buckets are mostly "the customer stopped replying". Neither is success or failure.

## 3. Why we don't report a resolution rate

If we called `completed` a resolution, the rate would be 11%. If we called everything that wasn't escalated a resolution, it would be 84%. Both come from the same data. Neither is true, because a customer who stopped replying might be satisfied, or might have given up.

The only number we trust from this table is the escalation rate, about 15%, because a human actually took those conversations. It's a lower bound on "the agent wasn't enough", not a measure of "the agent worked".

## 4. What does tell you if an agent is working

Counting statuses is the easy part. To know whether the customer got what they came for, someone has to read the conversation. That's why we built scheduled audits that score a sample of real conversations against a rubric a manager writes, instead of trusting the status column. (How those work is in [another post](/blog/06-grading-agents-with-an-llm).)

A few things to do on any channel without clear endings:

1. **Define the end yourself.** Pick an expiry that fits your customers' pace, and treat the resulting state as "went quiet", not as a verdict.
2. **Track the states that need a human.** Escalations are the one outcome that's unambiguous.
3. **Sample and read.** A small number of conversations read carefully beats a large number classified by a status field.
4. **Watch `failed` and the trend, not the share.** A stable 71% timeout is normal. A jump in failures is not.

## Summary

A status field records how a session ended inside the system, not how the conversation went. On a channel without clear endings, define the end yourself, track the states that need a person, and read samples of real conversations to judge quality.
