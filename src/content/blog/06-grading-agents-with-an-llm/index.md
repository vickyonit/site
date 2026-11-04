---
title: "Grading AI agents with an LLM: the bugs that made our scores lie"
description: "Lessons from building scheduled conversation audits: N/A answers, a JSON false, and why a score you can't click through is worthless."
---

We score real customer conversations against rubrics a manager writes. The model answers each question, we aggregate, and a dashboard shows where quality is breaking. It sounds simple. Most of the work was making the numbers honest.

## A score is only as good as the click-through

Every bar on our insights page links to the conversations behind it. If a bar says "60% miss rate" and the list underneath is empty, nobody trusts the page again.

That happened to us. The drill-down was an exact match in SQL, but the Ruby code judged answers leniently. The model would answer "No." with a full stop, and one path counted it as a miss while the other found no match.

The fix was to stop judging loosely at read time. We now normalize each answer once, when it's stored. "No.", "No, never confirmed" and JSON `false` all become `No`. "Not applicable." becomes `N/A`. After that, the chart and the list can't disagree.

## Three bugs worth knowing about

**A JSON `false` is an answer.** We read answers with `answer['value'] || answer[:value]`. When the model returned `false`, which is a real failing answer, the code treated it as missing and dropped it from every aggregate. Our failures were disappearing. Use `fetch` or `key?`, never `||`, when `false` is valid.

**"No." scored as a pass.** One comparison was `== 'no'`, so punctuation turned a miss into a pass.

**Ratings off the scale flattered the score.** A rating of 9 on a 5-point scale, or "good", was cast with `to_i` and counted in the denominator. Now an answer we can't read is unanswered, never a zero-star review and never a pass.

## Rules I'd keep

- **No N/A penalty.** A question that only applies to a third of conversations shouldn't count the other two thirds as failures. This is the difference between a rubric people trust and one they ignore.
- **A run never scores the same conversation twice.** It's enforced with a unique index, not just code.
- **No pass/fail column.** Judgement lives per criterion, because one overall verdict hides which question failed.
- **Show the funnel.** Each run records how many conversations it scanned, sampled, evaluated, skipped and failed, plus tokens used. If a manager asks "did it run and what did it cover?", the answer is on the page.
- **A missing answer is information.** The scorecard always lists every question, including the ones the model skipped.

## What I got wrong first

I built a coaching view that ranked people by score and a notes field for managers. Nobody saw the notes, and the ranking had no workflow behind it. I removed both. A number with nothing to do about it costs attention and returns none.

We've scored about three thousand conversations so far. It's early, and I'd rather say that than call it a quality system.
