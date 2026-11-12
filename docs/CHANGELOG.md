# Change log

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
