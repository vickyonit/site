---
title: "How I stopped getting lost while prompting coding agents"
description: "When instructing coding agents, my thoughts used to be everywhere. How I moved from scattered prompts to clear direction."
---
Whenever I sat down to instruct a coding agent, my thoughts would go in five directions at once.

I would start typing a prompt and immediately remember a database constraint. Then a stray idea about how the mobile screen should look would pop up. Then an edge case from last Tuesday. By the time I finished typing, the prompt was an unruly wall of text with no unified storyline.

It made me feel like my own thinking was disorganized. And the result was predictable: the agent got confused, made weird assumptions, and touched files it had no business editing.

It took me a while to realize something reassuring. Our brains are associative. When thinking about software, your mind naturally fires across architecture, user interfaces, data models, and past bugs simultaneously. The problem was not that my thoughts were bad. The problem was that I was trying to brainstorm and compose a strict specification at the exact same moment.

Here is what changed how I work.

## Brain dump first, organize second

I stopped trying to write a polished prompt inside the chat input. 

Instead, I use a two pass approach. In the first pass, I open a plain text notepad and dump everything raw. Stream of consciousness, messy thoughts, random worries, edge cases, and rough ideas. I do not edit or judge it.

Once the chaos is out of my head, I organize it. Sometimes I group it myself. Other times I literally paste the raw dump into the agent and say:

"Here is my raw brain dump for a feature. Do not write code yet. Reorganize this into a clean specification with clear acceptance criteria."

Letting the agent do the heavy lifting of structuring frees up your cognitive energy to judge whether the plan actually makes sense.

## The prompt skeleton

When turning those raw thoughts into an instruction, I use a simple four part skeleton. It answers four specific questions in order:

1. Context: Where are we in the project? Mention the exact files, routes, or current state.
2. Goal: What is the exact outcome? State the single objective in one or two clear sentences.
3. Constraints: What are the guardrails? Name what the agent must not touch, alter, or overcomplicate.
4. Verification: How do we prove it worked? Give the exact test, command, or visual check.

Having this skeleton in mind acts as an anchor. When you type:

Context: We have an existing authentication flow in src/auth/login.tsx using Supabase.
Goal: Add a Google sign in button below the email form.
Constraints: Do not change the existing email password logic. Use our existing Button component from the UI library.
Verification: Run npm test auth and check that types build with zero errors.

If you ever feel lost while typing, you simply ask yourself which of those four slots you are describing. If a thought does not fit into one of them, it does not belong in this prompt.

## Why this matters even more for software factories

With everyone talking about autonomous software factories, agent swarms, and background pipelines, hand crafting prompts can feel like an old practice. 

The reality is the opposite. 

An assembly line amplifies whatever you feed into it. If you feed high tolerance specifications into a software factory, you get working software. If you feed scattered thoughts and vague vibes into a multi agent swarm, you get broken code at factory scale.

The prompt skeleton does not disappear in a software factory. It moves upstream into your issue tickets, design docs, and acceptance tests. Learning to structure your thoughts into context, goal, constraints, and verification is the exact skill required to direct an autonomous pipeline.

## Turn the table and let the agent interview you

You do not need to arrive with every single requirement worked out in advance. 

When a task feels too big or fuzzy, I tell the agent:

"I want to build this feature, but my thoughts are scattered right now. Act as a staff engineer. Interview me one or two questions at a time to pull out the requirements and help me shape the plan."

Answering one targeted question is easy. Trying to anticipate thirty questions at once while staring at a blank prompt box is overwhelming.

## Work in thin slices

Most scattered prompts happen when we try to solve the entire feature in a single message.

I now force myself to work in thin vertical slices. First the data model and types. Then the core logic. Then the user interface. Finally the edge cases and polish.

If a stray thought about the interface crosses my mind while working on the database, I do not shove it into the current prompt. I write it down in a quick scratch file so my mind feels safe letting it go, then return to the single thread at hand.

The goal is not to stop having associative thoughts. The goal is simply to stop dumping all of them onto the agent at the exact same time.
