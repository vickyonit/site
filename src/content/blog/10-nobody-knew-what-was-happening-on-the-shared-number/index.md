---
title: "Nobody knew what was happening on the shared WhatsApp number"
description: "Small businesses run support from one WhatsApp Business app number. How CoPilot lets an owner ask an AI assistant about it, and the engineering lessons from building the onboarding."
---
A lot of small businesses run customer service from a single WhatsApp Business app number, shared across several people. The phone sits with whoever is free. Nobody knows what's happening on it, including the owner.

What are customers asking? How are staff replying? Are people being kept waiting? The information exists, but it's spread across phones and chat histories that nobody can search.

## 1. What we built

We call it Peach CoPilot. It's a separate product from Peach, for businesses that already use the WhatsApp Business app and don't want to move to a team platform. They keep using the mobile app as normal.

Onboarding has three steps:

1. **Connect.** The business links its existing number through Meta's coexistence flow, so the number keeps working in the app.
2. **Sync.** We index the chat history in the background.
3. **Connect an assistant.** The owner connects their own AI assistant, whether Claude, ChatGPT or another client, to Peach CoPilot through MCP.

After that the owner can ask their assistant what customers are asking about and how the team is replying.

## 2. Why MCP instead of a dashboard

Owners already use these assistants. Instead of building another dashboard to learn, we gave their assistant access to the one part of the business they couldn't see. It also keeps the product independent of any single model: the connection works the same way whichever assistant the owner prefers.

## 3. Lesson one: derive the step from durable facts

The onboarding sends the user to Meta and then back, possibly in a different browser tab, possibly much later. If you keep "which step are they on" in the session, that round trip can lose it.

So we don't store the step as the source of truth. We work it out from facts that persist:

| Step | Derived from |
| --- | --- |
| MCP | the assistant is connected, or a history sync has been requested |
| Sync | the account has a fulfilled link to the business number |
| Connect | otherwise |

That created a second problem. If the app always shows the furthest step the facts allow, then "Back" does nothing: someone who has finished syncing gets pushed forward again and can never revisit an earlier step. If the app trusts whatever the session remembers, a person who completed Meta's flow in another tab sees the connect screen again.

The fix was to store two things in the session: the step the user navigated to, and what the derived step was at that moment. When they return, if the derived step has advanced since their last visit, the facts moved behind their back and win. Otherwise the user's own navigation stands, so Back sticks.

## 4. Lesson two: the bug with no error

Each linked number needs an owner, a person it's assigned to. Incoming messages are routed using that owner. If the link has no owner, nothing fails. The routing code simply finds nobody to assign, returns the conversation untouched, and the chat sits unassigned. No exception, no log line.

We found that the self-serve signup created a link with only the phone number, so every new account would have hit it. The fix records the user as the owner at signup, and again when Meta's flow returns with a different number. Both are best-effort, since signup shouldn't fail because a number was already claimed by someone else, and both now log when they skip.

The general point is that the worst bugs in an onboarding flow aren't the ones that crash. They're the ones that leave a customer with a working-looking account that quietly does nothing.

## Summary

Derive state from durable facts instead of the session, and when you do, store what the derived value was so user navigation and background progress don't overwrite each other. And watch for the failure that raises no error: an onboarding that leaves a working-looking account that quietly does nothing.
