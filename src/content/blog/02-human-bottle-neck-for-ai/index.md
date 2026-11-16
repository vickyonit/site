---
title: "Over-scripting our support bot made it worse"
description: "We scripted our support bot tightly, and it gave a correct answer that was useless. What I changed, and why loosening the script isn't the same as losing control."
---
I've always told people not to over-control language models. Then I looked at our support bot and realised we'd done exactly that.

It ran on tightly scripted prompts: fixed templates and step-by-step flows for things like booking and rescheduling. It was predictable, which is why we built it that way. Then, in a review, I came across a customer who wanted to reschedule an appointment while travelling to a different time zone. The bot gave a correct answer about local time slots. It was also useless, because it ignored the one thing that made this customer's situation different.

So I replaced the template with a goal and some boundaries. I gave the bot the context it needed, such as available slots, the customer's time zone and their preferences, and let it work out the conversation. It started asking better questions, took the trip into account and offered alternatives we hadn't thought of. That comes from reading conversations, not from a measured comparison, and I'd like to measure it.

The bigger change was in how I think about control. Loosening the script didn't mean giving it up. It moved. What matters now is what the bot is allowed to do, when it must hand over to a person, and who owns the conversation. I wrote about that in [Agents that know when to ask](/blog/12-agents-that-know-when-to-ask).

If you're setting up something similar, ask whether you're helping the model do the job or handing it a checklist. Specify the goal and the boundaries, not every step. And judge it by whether the customer's problem got solved, not by whether the script was followed.
