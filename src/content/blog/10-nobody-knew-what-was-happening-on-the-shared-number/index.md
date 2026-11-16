---
title: "Nobody knew what was happening on the shared WhatsApp number"
description: "Small businesses run support from one shared WhatsApp number. How I gave owners visibility through their own AI assistant."
---
Lots of small businesses run customer service from a single WhatsApp Business app number, shared across several people. The phone sits with whoever is free. Nobody knows what's happening on it, including the owner. What are customers asking? How are staff replying? Are people being kept waiting? The information exists, but it's spread across phones and chat histories that nobody can search.

I wanted to give owners that visibility without asking them to move off the app they already use, and without building one more dashboard for them to learn. So I built Peach CoPilot, a product separate from Peach. The owner connects their existing number, we index the chat history in the background, and then they connect their own AI assistant, whether Claude, ChatGPT or another client, through MCP. After that they can simply ask it what customers are asking about and how the team is replying.

I chose an assistant over a dashboard because owners already use these assistants. I gave their assistant access to the one part of the business they couldn't see. It also keeps the product independent of any single model.

## Two things the onboarding taught me

**Work out the step from facts that persist.** The sign-up sends the user to Meta and back, possibly in another tab and possibly much later. If you keep "which step are they on" in the browser session, that round trip can lose it. So I work out the step from things that are true regardless of the session, such as whether the number is linked and whether history has synced.

**The worst bug raised no error.** Each linked number needs an owner, because incoming messages are routed using it. New accounts had none recorded, so chats just sat unassigned. No exception, no log, and the account looked perfectly fine while it quietly did nothing. I fixed it, and the system now logs when it skips.

The bugs that hurt most in an onboarding flow aren't the ones that crash. They're the ones that leave a working-looking account that does nothing.
