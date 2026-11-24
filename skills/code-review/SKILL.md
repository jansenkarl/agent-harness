---
name: code-review
description: Review a scoped diff or implementation for correctness, regressions, security boundaries, maintainability and proportionate design. Use for PR reviews, independent implementation reviews, over-engineering assessments and review-before-publication requests. Do not use as a substitute for implementing an unrelated feature or for copy-editing prose alone.
---

# Evidence-led, proportionate code review

Find changes that materially improve correctness or the cost of changing the code
safely. A review can legitimately have no blocking findings.

## Establish the review boundary

1. Identify the requested behavior, reviewed revision/diff and relevant project
   contracts. If the diff/base is unavailable, say what you can and cannot review.
2. Respect review-only instructions. Do not edit code or publish/merge merely because
   a review found an issue. Preserve unrelated working-tree changes.
3. Read changed code plus callers, types, persistence/authorization boundaries and
   relevant tests as needed. Do not infer runtime behavior from filenames or counts.
4. Keep the review tied to approved scope. Record consequential adjacent risks with
   evidence, but separate them from unrelated redesign proposals.

## Review in priority order

- **Correctness:** invariants, edge cases, ordering, error paths, retries, idempotency,
  concurrent transitions and compatibility. Show a concrete failing path.
- **Security/privacy:** trust boundaries, authorization, tenant scope, unsafe parsing,
  secrets and side effects, where relevant to the changed behavior. Do not add a
  generic security checklist or hypothetical blocker unrelated to the change.
- **Tests:** do they distinguish the intended behavior from plausible failures?
  Prefer a focused reproduction to tests that copy the implementation. State which
  checks ran and which are only suggested. Passing tests do not prove every path.
- **Economy/design:** coherent responsibilities, authoritative policy, reused
  conventions, unnecessary wrappers and framework/dependency cost. Small files can
  still scatter one decision across many places. Large files need purposeful seams,
  not arbitrary part1/part2 splits. Assess project size rules separately from design.
- **Operational impact:** migrations, rollout and backward compatibility only when
  relevant. Keep local validation, CI, merge and deployment claims distinct.

## Findings discipline

For each actionable finding give severity, file/line or precise code location,
trigger/reproduction, consequence and the smallest sound fix. Distinguish observed
defects from conditional risks; state the condition and missing evidence. Avoid
absolute claims about dependencies or infrastructure you have not inspected.

Do not request a new abstraction simply because one is possible. A change spanning
schema, API and tests may be coherent; count duplicated decisions, not touched files.
If the simplest sound fix needs a larger change, explain why the smaller one fails.

Use severity consistently: blocking for correctness/security/data-loss or material
contract regressions; non-blocking for evidenced maintainability improvements;
optional for preference. Do not elevate a stylistic preference into a defect.

## Output and stopping point

Lead with actionable findings, highest impact first. Then summarize economy/scope,
validation actually performed and remaining uncertainty. If none, say "No blocking
findings" and state review coverage; do not claim the whole system is defect-free.

Recommend the next action without merging or granting owner authorization. After
fixes, recheck the affected paths and regression evidence; avoid open-ended review
loops that keep inventing new requirements after the approved goal is met.
