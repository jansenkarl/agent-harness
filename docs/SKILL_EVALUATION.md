# Skill evaluation

Two skills capture reusable review procedures without adding policy to every prompt:

- `instruction-maintenance`: preserve obligations, choose the narrowest scope,
  deduplicate entry points, distinguish written policy from actual enforcement.
- `code-review`: identify concrete defects, assess design economy and meaningful
  tests, and report evidence without expanding scope or granting merge permission.

## Cases

| Skill | Case | Checks |
| --- | --- | --- |
| instruction-maintenance | preserve-hold | Hold/approval/compatibility survive cleanup; no unauthorized edit claim |
| instruction-maintenance | checker-coverage | Actual thresholds/coverage are stated; ratchet preserved; loading not invented |
| code-review | seat-race | Concrete concurrent interleaving; sound conditional fix; no invented test run |
| code-review | simple-helper | No invented defect or speculative DI requirement; merge authority remains separate |

Each case lives under the skill's `evals/<name>/` with `prompt.md`, `case.yaml` and
grader criteria. Inputs are inline and synthetic. `npm test` runs the separate
deterministic Git-helper suite, not paid model evaluations.

Run cases in isolated sessions, once with the skill and once without it, with the
same task and environment. Do not expose grader criteria to the executor. Compare
outputs against the saved criteria and inspect omissions/overreach qualitatively.
The criteria are deliberately small smoke checks, not an overall quality score.

Local raw outputs/review pages live in ignored `skills/*-workspace/` directories.
They are not installed skills or public project evidence. Record aggregate results
and limitations here after review; do not claim improved reliability from a tiny
sample or from static Markdown validation. Human feedback remains useful before
adopting the skills broadly.

## Initial results — 2026-11-12

Each of the four cases ran once per configuration in isolated general-agent
sessions. A separate grader assessed saved answers against one compound criterion
per case; execution transcripts were unavailable.

| Case | With skill | Without skill |
| --- | --- | --- |
| preserve-hold | Pass | Pass |
| checker-coverage | Pass | Pass |
| seat-race | Pass | Pass |
| simple-helper | Pass | Pass |

Both skills scored 2/2 with and 2/2 without: zero measured pass-rate improvement.
The criteria did not discriminate between configurations. Qualitative differences
were mixed: skill-assisted answers added loader/boundary examples and empty-seat
locking cautions; baselines also supplied useful archive and concurrency-test
details. The simple-helper baseline was more compact with equivalent conclusions.

These are output-only smoke checks, not verified tool-use or loading evidence.
Timing, tokens and execution metrics were not recorded, so no efficiency comparison
is supported. One run per case cannot establish repeatability or model generality.
Both skill files passed static frontmatter validation; this is separate evidence.

Local human-review pages (open in a browser):

- `skills/instruction-maintenance-workspace/iteration-1/review.html`
- `skills/code-review-workspace/iteration-1/review.html`

Human review remains pending. Before drawing benefit claims, split compound criteria
into independent obligations and add harder cases: sound concurrency fixes and
non-deadlocking tests, archive restrictions, and realistic conflicting instructions.

## Follow-up coverage

Add cases using real instruction diffs and scoped code changes as experience grows.
Test relevant and near-miss triggers in each target CLI. Explicit skill reads in
these smoke checks do not measure automatic discovery, triggering or cross-model
performance. No installer or global skill changes are part of this slice.
