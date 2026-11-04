---
title: "Grading AI agents with an LLM: the bugs that made our scores lie"
description: "How scheduled conversation audits work, and the rules that keep the scores honest: N/A answers, a JSON false, and a score you can click through."
featured: 2
---
Using a model to grade conversations is easy to start and hard to trust. The difficult part isn't the prompt; it's making the numbers honest enough that a manager acts on them. We score real customer conversations against rubrics that a manager writes: the model answers each question, we aggregate the answers, and a dashboard shows where quality is breaking. This post covers how it works and the rules we adopted after our scores turned out to be wrong in ways that were easy to miss.

## 1. The loop a manager follows

The product has four tabs, in the order a manager works:

1. **Insights.** Where is quality breaking?
2. **Results.** Show me the conversations behind that number.
3. **Runs.** Did it actually run, what did it cover, what did it cost?
4. **Questions.** Change what gets measured.

Every bar in Insights links into Results with the right filter applied. "Which question fails most?" and "show me why" are one click apart. That click is the most important design decision, and it's also where our first big bug lived.

## 2. A score is only as good as its click-through

If a bar shows a high miss rate and the list underneath is empty, nobody trusts the page again.

That happened to us. The drill-down was an exact match in SQL, but the Ruby code judged answers leniently. The model would answer "No." with a full stop. One code path counted that as a miss, and the other found no matching row.

The fix was to stop judging loosely at read time. We normalize every answer once, when it's stored:

| The model returns | Stored as | Judged as |
| --- | --- | --- |
| `"No."`, `"No, never confirmed"` | `No` | miss |
| JSON `false` or `true` | `No` or `Yes` | miss or pass |
| `"Not applicable."` | `N/A` | not applicable |
| `"4/5"` | `4` | a rating of 4 |
| a rating of `9` on a 5-point scale, or `"good"` | stored as given | unanswered |

After that, the chart and the list can't disagree, because they read the same normalized value.

## 3. Three bugs worth knowing about

**A JSON `false` is an answer.** We read answers with `answer['value'] || answer[:value]`. When the model returned `false`, which is a real failing answer, the code treated it as missing and dropped it from every aggregate. Our failures were quietly disappearing. When `false` is a valid value, use `fetch` or `key?`, never `||`.

**"No." scored as a pass.** One comparison was `== 'no'`, so a trailing full stop turned a miss into a pass.

**Ratings off the scale flattered the score.** A rating of 9 on a 5-point scale was cast with `to_i` and counted in the denominator, nudging the average up. Now an answer we can't read is simply unanswered. It's never a zero-star review and never a pass.

A fourth one is subtler. Question keys are derived from the title and cut to 40 characters, so two long, similar questions, such as "…verify the customer's registered mobile number?" and "…email address?", produced the same key, and one answer was shown against both. Keys now get disambiguated, and a unique index backs it up.

## 4. Rules for a rubric people trust

- **No N/A penalty.** A question that only applies to a third of conversations shouldn't count the other two thirds as failures. N/A answers are excluded from every denominator.
- **A missing answer is information.** The scorecard always lists every question in the manager's order, including the ones the model skipped.
- **An answer we can't read is never a pass.** One gate decides whether an answer counts at all.
- **No overall pass/fail column.** Judgement lives per question, because a single verdict hides which one failed.
- **A run never scores the same conversation twice.** It's enforced with a unique index, not just code.

## 5. How a run executes

Nothing in the app wakes a rule up by itself. A Cloud Scheduler job, defined in Terraform, hits an endpoint every 15 minutes. That fans out to every rule whose next run time has passed, and each one becomes a run with an explicit time window:

```
scheduler tick (every 15 min)
  -> find rules where next_run_at <= now
    -> create a run with a window, advance next_run_at
      -> filter matching conversations, drop already-scored ones
        -> sample (with a hard ceiling, applied in SQL)
          -> score in batches of 10
```

Two details worth copying:

- **The tick interval is the worst-case lateness.** The scheduler only looks backwards at rules that are already due. At 15 minutes, a rule set for 09:00 fires between 09:00 and 09:15. A tick with nothing due is one indexed query, so tightening it is cheap.
- **Every tick writes a status row, even when nothing was due.** A 200 from the endpoint only proves a job was enqueued. A row from the job itself lets you tell "ran, nothing to do" from "never ran".

Each run also records how many conversations it scanned, sampled, evaluated, skipped and failed, plus the tokens it used. When a manager asks "did it run, and what did it cover?", the answer is on the page.

## 6. What we removed

We built a coaching view that ranked people by their score, and a notes field for managers. Nobody saw the notes, and the ranking had no workflow behind it. We removed both. A number you can't act on costs attention and returns none.

## Summary

A model-graded score is only useful if it can be checked. Normalize answers once, when you store them. Make every number link to the conversations behind it. Never let an answer you can't read count as a pass. And record what each run scanned, sampled and skipped, so that "did it run?" has an answer on the page.
