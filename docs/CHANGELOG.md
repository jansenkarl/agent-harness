# Change log

## Main branch protection — 2026-11-23

- With explicit owner approval, created active GitHub ruleset `Protect main`
  (ID `27957943`) targeting `refs/heads/main`, with no bypass actors.
- Requires PRs, resolved review conversations, and the GitHub Actions `validate`
  check with an up-to-date branch. Blocks deletion and force pushes. Required
  approving reviews remain zero so a solo maintainer can merge their own PR.
- Verified the saved ruleset and effective branch rules through the GitHub API.
  This is configuration evidence, not a destructive bypass test. PR #1 remains
  open; merge still requires separate owner authorization.

## Harness methodology comparison — 2026-11-21

- Added `docs/Nov21_Harness_Loop_Graph_Comparison.md`, comparing Whitemon's
  practitioner article with the current policies, templates, Git helpers and tests.
- Prioritized task contracts, bounded feedback, targeted policy checks and adoption
  evidence; retained the recommendation to defer orchestration until justified.
- Recommendations only; no runtime or authorization policy changes. Local baseline:
  all 35 Git-helper tests passed. Article access and evidence limits are in the report.

## Remote-base freshness — 2026-11-20

- Added a rule to the shared Git lifecycle (Isolate step) and global preferences:
  fetch, branch from `origin/<baseBranch>`, and read release state from the fetched
  remote branch. Origin: in a downstream project the local `main` lagged the remote
  by a full release because PRs merged on the host and release work ran in another
  worktree. A feature branch was then cut from the stale base and the production
  version was misreported. Documentation-only; the read-only helpers still do not
  check base freshness (possible follow-up: report behind-count in `git:status`).
  Extends PR #1.

## MIT license — 2026-11-12

- Owner selected MIT. Added the standard license with copyright attribution to
  `jansenkarl`, package metadata, and updated README/current-state/roadmap references.
- Reviewed the license and metadata diff; whitespace checks passed. This
  documentation/metadata change extends PR #1; merge awaits owner instruction.

## Review skills — 2026-11-12

- Added instruction-maintenance and code-review skills, four synthetic evaluation
  cases, optional installation guidance and evaluation methodology/results.
- Eight isolated paired executions passed their output-only criteria: four with
  skills and four baselines. No measured improvement; criteria were non-discriminating.
  Timing/token metrics and execution transcripts were unavailable. Human review,
  automatic triggering and broader adoption remain unverified.
- Generated ignored local benchmark summaries and static review pages. Raw outputs
  are excluded from publication. Both skills passed static validation; the existing
  35-test local suite and whitespace checks passed.
- This slice extends foundation PR #1; merge and license selection await owner
  decisions. Skill installation remains an explicit adoption step.

## Initial foundation

- Seeded public toolkit with curated global defaults, adapters, project templates,
  read-only Git helpers, synthetic tests and installation guidance.
- Created a minimal initial main commit to permit a reviewable foundation PR.
- License and follow-up skills remain owner decisions/planned work.
- Local foundation suite: 35 tests pass. Selected Vitest 4.1.12 after the initial
  dependency audit identified advisories in the earlier test-runner patch version.
