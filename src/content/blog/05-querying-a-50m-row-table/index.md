---
title: "Counting things in a 50M-row table without hurting production"
description: "How to pull usage numbers from a live database when every useful index starts with account_id."
---
Some of the most useful questions about a product, such as how much it is used, are also the easiest to answer in a way that harms production. This post describes how we pull numbers from tables with tens of millions of rows without scanning them.

The messages table behind Peach has about 49 million rows. To pull usage numbers from production, such as how many conversations our agents handled and across how many accounts, the obvious queries would have been a bad idea.

Here is what we did instead, and the rule behind it.

## 1. Start from the indexes, not the question

Every useful index on our big tables starts with the thing that owns the rows. For messages, it's `account_id`. For agent sessions, it's `(streamable_type, streamable_id, ...)`. That has a direct consequence. This query looks harmless:

```ruby
Message.where(created_at: 90.days.ago..).count
```

But with no `account_id`, none of the indexes apply, and the database scans the table. On 49 million rows, that is a slow query on a live system.

The rule: before you write a query on a big table, read its indexes and write the question in the shape they support.

## 2. Three changes that made it safe

**1. Use estimates for totals.** For "how big is this table?", Postgres already knows roughly:

```sql
SELECT reltuples::bigint FROM pg_class WHERE relname = 'messages';
```

It costs nothing and is close enough for "about 49M messages". Call it approximate. If it returns `-1`, the table has never been analyzed.

**2. Loop over the owner, not the table.** Instead of one big query, loop over the owners and run a small indexed query for each. For agent sessions, that meant one query per agent, grouping by status and month:

```ruby
Wa::StreamSession
  .where(streamable_type: 'Wa::AiFlow', streamable_id: agent.id, created_at: since..)
  .group("date_trunc('month', created_at)", :status)
  .count
```

About 1,500 cheap queries beat one that might lock up the database. Each hits an index that leads with the agent.

**3. Put a timeout on everything.**

```ruby
ActiveRecord::Base.connection.execute("SET statement_timeout='15s'")
```

If you get something wrong, the query fails in 15 seconds instead of running until someone notices. If you have a read replica, use it.

## 3. What the numbers taught us

The first figure we pulled, the number of agents ever created, was around 1,500. The number with real conversations in the last quarter was about 200. If we hadn't checked, we'd have quoted a number that sounded good and wasn't true. Count the things that are happening, not the things that exist.

## 4. Running the script

Long scripts pasted into a production console can be corrupted by the terminal: we saw characters dropped and the pipe characters in Ruby block parameters disappear. Save the script to a file, keep lines short, and run the file.

## Summary

Read a table's indexes before writing a query against it, and shape the question to fit them. Use planner estimates for totals, loop over the owner of the rows rather than scanning the table, cap every query with a timeout, and count what is happening instead of what exists.
