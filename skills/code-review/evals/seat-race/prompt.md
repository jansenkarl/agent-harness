---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Review-only this synthetic change to an existing SQL-backed service. The database
offers transactions, but no per-account serializing lock or capacity constraint has
been shown. Requests run concurrently. Contract: no more than limit active seats.
The new function is:
1 async function activate(accountId, limit) {
2   const count = await db.countActive(accountId);
3   if (count >= limit) throw new Error('full');
4   return db.insertActive(accountId);
5 }
The only test starts one request at count=limit and expects rejection. Find blocking
issues and suggest the smallest sound fix and a useful test. Do not edit or run code;
do not claim unspecified transaction isolation guarantees.
