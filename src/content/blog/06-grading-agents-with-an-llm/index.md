---
title: "Making AI-graded scores something a manager can trust"
description: "A STAR-style walkthrough of building conversation quality scores with an LLM, and what I learned when the first numbers turned out to be wrong."
draft: true
---
Using an AI model to grade conversations is easy to start and hard to trust. This is a short account of how I approached that problem, written as Situation, Task, Action, Result.

## Situation

Businesses on our platform have thousands of customer conversations, handled by both human agents and AI agents. Managers can't read them all. They wanted to know where quality was slipping, without sampling a few chats by hand and hoping those were representative.

The idea was simple: let managers write the questions they care about, such as "Did the agent confirm the delivery date?" Then let a model answer those questions across their conversations and show the results on a dashboard.

The first version worked, in the sense that numbers appeared. But some of those numbers were wrong in ways that were easy to miss.

## Task

My job was to make the scores trustworthy enough for a manager to act on. That meant three things:

- A number on the dashboard should always lead to the conversations behind it.
- A failure should look like a failure, never like a good score.
- It should be clear what was measured, what was skipped and what it cost.

## Action

I started by finding where the scores were quietly misleading, and I fixed each one at its root rather than patching the display.

- **Make the chart and the list agree.** In the first version, a headline number could click through to an empty list. I changed it so both read from the same source, so what a manager sees at the top always matches what they find underneath.
- **Treat "can't tell" honestly.** Some answers failed silently and disappeared from the totals. Others were misread and counted as passes. I set one rule: an answer the system can't read is never a pass, and "not applicable" never counts against anyone.
- **Fail loudly.** An early version filled in a neutral placeholder score whenever the model call failed. It looked exactly like a real score and quietly distorted the averages. Now a failed run says it failed, and shows how much of the work completed.
- **Show the work.** Every run records what it covered, what it skipped and what it cost, so a manager can answer "did it run, and on what?" without asking an engineer.
- **Cut what nobody used.** I built a coaching view that ranked people and added a notes field. Nobody used them, so I removed them. A number that can't be acted on only costs attention.

## Result

Managers now have a view they can trace from a headline number down to individual conversations, and a clear record of every run. The class of "the number looks fine but is wrong" problems I found has been closed off, and each fix is covered by automated tests.

I haven't yet shown how closely the model's grading agrees with human reviewers. So far I've made the scores consistent and traceable. Showing that they're accurate is the next step.

## What I took from it

- A model-graded score is only useful if someone can check it.
- Most of the trust problems weren't about the AI's judgement. They were about what happened to its answers on the way to the dashboard.
- The next piece of work is to measure the grader against people, and to be open about where they disagree.
