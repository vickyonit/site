---
title: "Counting things in a 50M-row table without hurting production"
description: "Notes from pulling usage numbers out of a live database where every useful index starts with account_id."
---

The messages table has about 49 million rows. To pull usage numbers from production, such as how many conversations our agents handled and across how many accounts, the obvious queries would have been a bad idea.

Here is what we did instead.

## Start from the indexes, not the question

Every useful index on our big tables starts with `account_id`, or with the thing that owns the rows. For messages, it's `(account_id, created_at)`. That means this query is a trap:

```ruby
Message.where(created_at: 90.days.ago..).count
```

It looks harmless, but with no `account_id` it can't use any of those indexes and scans the table.

## Three changes that made it safe

**1. Estimates for totals.** For "how big is this table?", Postgres already knows roughly. `pg_class.reltuples` gives an approximate row count at no cost. It's good enough for "about 49M messages", and I call it approximate. If it returns -1, the table has never been analyzed.

**2. Loop over the owner, not the table.** Instead of one big query, I looped over agents and ran a small indexed query for each: `(streamable_type, streamable_id, status, created_at)`. About 1,500 cheap queries beat one that might lock up the database.

**3. A timeout on everything.**

```ruby
ActiveRecord::Base.connection.execute("SET statement_timeout='15s'")
```

If I got something wrong, the query fails in 15 seconds instead of running until someone notices.

## What the numbers taught me

The first figure I pulled, agents created, was much bigger than the number actually in use. Counting agents with real conversations in the last quarter cut it by an order of magnitude. If I hadn't checked, I'd have quoted a number that sounded good and wasn't true.

## A small, silly lesson

I ran the script by pasting it into a production console, and the terminal quietly mangled it. The pipe characters in Ruby block parameters disappeared, and one line arrived with letters missing. For anything long, I now write the script to a file and run it, instead of pasting.
