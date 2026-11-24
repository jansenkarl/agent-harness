# Harness, Loop, Graph: comparison with this agent-harness template

**Date:** November 21, 2026

**Repository assessed:** `jansenkarl/agent-harness`, branch `feat/portable-harness-foundation`, commit `72756a2993effa930d0e35994989be29e1f5af69`

**Source:** Whitemon (@0xWhitemon), *Harness, Loop, Graph: The 3 Layers That Decide If Your AI Agent Works*, November 8, 2026.

## Executive assessment

Your project is already a strong implementation of the article's **harness foundations** and a particularly careful implementation of **Git/CI evidence gates**. It is a portable policy-and-tooling kit that runs inside existing coding agents, rather than a complete agent runtime. The article describes a broader architecture encompassing the runtime, feedback cycle, and coordination of multiple jobs. That difference in scope matters: not every capability missing from this repository should be implemented here.

The highest-value next step is to make task completion and recovery as explicit as publication readiness. Add a small task contract, bounded repair guidance, and evidence records tied to revisions. Then close selected gaps between written policy and executable checks. Preserve the thin adapters, deliberate installation, read-only helpers, and explicit owner authorization.

**Do not start by adding a graph framework, a general scheduler, or more mandatory prompt text.** The article itself argues against premature orchestration, matching your existing roadmap. Most benefits can be obtained by extending the current templates, skills, and focused Node tooling.

## 1. Sources, scope, and limitations

### Article evidence

- [User-provided post](https://x.com/0xWhitemon/status/2119430401701621865).
- [Linked article](https://x.com/i/article/2119423551300145152).
- [Public extraction used for this review](https://api.fxtwitter.com/status/2119430401701621865).

The direct X page exposed a login shell. The public extraction supplied the article's prose, checklist, and embedded Markdown/code examples. Its image diagrams and embedded third-party posts were not independently reviewed. The comparison therefore relies on the retrieved text and code, not on claims inferred from those images or endorsements.

Although the request calls it a paper, the source is a practitioner article, not a research paper presenting controlled experiments. Its architectural suggestions are useful hypotheses; statements such as the problem being “almost never the prompt” are not established by evidence supplied in the retrieved text. No benchmark establishes that adopting its entire methodology will improve this project.

### Repository evidence

The review examined the root policies, global preferences, all three adapters, project templates, installation and evaluation documentation, both review skills, all three Git helper modules, all three test files, and CI configuration. References below point to the assessed checkout; future changes may alter the findings.

Local verification on November 21: `npm test` passed **35 tests across 3 files**. These exercise Git policy, evidence collection, and CLI behavior. They do not demonstrate general agent reliability, actual permission enforcement, automatic skill discovery, or successful adoption in another project. Published skill results are discussed separately below.

## 2. What the article proposes

The article divides an agent system into three engineering responsibilities:

1. **Harness — capabilities and boundaries.** Supply an explicit task contract, a navigable context map, narrow tools with defined failure states, durable memory, externally enforced permissions, and readable traces.
2. **Loop — feedback and termination.** Define success before implementation; execute checks; feed concrete failures back into repair; stop on verified success, exhausted budget, or repeated lack of progress.
3. **Graph — coordination.** Represent bounded jobs and real dependencies, isolate worker contexts, use deterministic code for deterministic work, and reuse validated outputs rather than restarting everything.

Its strongest transferable ideas are to define `done_when`, pair important prose rules with checks, distinguish evidence from self-report, record failed approaches, and introduce coordination only when independent work actually warrants it.

## 3. Comparison matrix

“Implemented” below refers to repository artifacts or executable behavior, not universal compliance by a host agent.

| Dimension | Article's approach | This repository | Assessment |
| --- | --- | --- | --- |
| Task contract | Goal, inputs, output, constraints, `done_when` before action | Project rules and review boundaries exist, but no reusable task-level acceptance record | Partial; highest-value addition |
| Context map | Short root guide; details loaded when relevant | Thin `AGENTS.md`, adapters, `.clinerules`, and `.context.md` link to canonical policy | Strong alignment |
| Tool contracts | Narrow inputs/outputs, explicit errors and permissions | Three read-only Git modes, JSON output, exit codes 0/1/2, validated policy | Strong within the Git-tool scope |
| Durable memory | Persist progress, failed attempts, decisions, next action | Current state separated from changelog/build history; commits and handoffs preserve evidence | Strong foundation; task recovery is less structured |
| Permission walls | External policy decides whether effects execute | Owner gates and holds are written; helpers report readiness without executing effects | Sound separation, but not an external enforcement boundary |
| Traces | Context, calls, changes, checks, retries, and costs | Git snapshots and consequential history; no general run-event capture | Partial, intentionally narrower |
| Evidence loop | Work, verify, repair, stop on evidence | Deterministic tests, exact-head CI checks, explicit local/hosted distinctions | Strong release evidence; no general task repair protocol |
| Failure feedback | Expected versus observed, bounded scope, dead ends | Blocker codes and targeted review findings | Useful baseline; no standard attempt history |
| Loop exits | Retry cap, budget, repeated-result escalation | Review skill rejects open-ended scope growth; no shared retry/time budget | Partial |
| Independent review | Tests first, separate-context reviewer second | Code-review skill and isolated skill-evaluation sessions | Procedure exists; ordinary task independence is not enforced |
| Graph execution | Real dependencies, isolated workers, immutable passed outputs | Git lifecycle is ordered; no general job graph or checkpoint executor | Appropriate deferral, not automatically a defect |
| Learning | Convert recurring failures into tools, tests, or coordination rules | Changelog, regression tests, instruction-maintenance skill, roadmap | Strong intent; some lessons remain prose-only |

## 4. Where your project is already strong

### 4.1 Policy discovery is a map rather than a prompt dump

[`AGENTS.md`](../AGENTS.md), [`global/PREFERENCES.md`](../global/PREFERENCES.md), and [`adapters/`](../adapters/) separate universal defaults from project authority and host-specific entry points. [`docs/INSTALLATION.md`](INSTALLATION.md) distinguishes installed files, loaded instructions, and demonstrated behavior. This is more precise than simply telling users to create an `AGENTS.md` file.

Preserve this structure. New conditional procedures should live in a skill or linked document, not be copied into every adapter. Startup context should identify the task's relevant documents without loading all historic evidence.

### 4.2 Git evidence is substantially more rigorous than “tests passed”

[`scripts/git/inspect.mjs`](../scripts/git/inspect.mjs) collects paginated evidence, rereads state to detect changes during inspection, and minimizes exposed API data. [`scripts/git/policy.mjs`](../scripts/git/policy.mjs) checks PR identity/scope, exact head, workflow association, expected jobs, and unsuccessful checks. [`scripts/git/workflow.mjs`](../scripts/git/workflow.mjs) distinguishes blockers from unknown/error conditions.

The associated [tests](../test/) cover stale or mismatched evidence, holds, ambiguous readiness conditions, and changes during inspection. This operationalizes the article's “loop on evidence” principle for a specific, valuable boundary.

### 4.3 Authority and readiness are correctly separated

[`docs/GIT_WORKFLOW.md`](GIT_WORKFLOW.md) states that technical readiness never grants owner permission, and that merging and production operations require separate authorization. It also calls out snapshot limitations and recommends server-side protections without pretending they are already enabled.

This is stronger than the article's shorthand suggestion that easily reversible work “ships on green.” Your explicit owner policy should remain authoritative even for a small change.

### 4.4 Evaluation claims are appropriately restrained

[`docs/SKILL_EVALUATION.md`](SKILL_EVALUATION.md) reports four paired cases with equal pass rates, zero measured improvement, no execution transcripts, and no timing/token measurements. It explicitly distinguishes static validity and output quality from skill loading and actual behavior.

That honesty is an asset. The right next step is more discriminating evidence, not describing the existing skills as proven reliability improvements.

## 5. Gaps and concrete recommendations

### Priority 1 — Define a lightweight task contract

**Gap:** The current templates describe a project and current work, but do not consistently define what proves a particular task complete. Green repository tests can coexist with an unfulfilled user request.

**Recommendation:** Add an optional task section to [`templates/project/.context.md`](../templates/project/.context.md), or link a task record for substantial work. Include goal, scope, acceptance evidence, constraints, and stop conditions. Keep a small change's contract in a few lines; do not mandate a new file for every task.

Suggested shape, not an existing configuration format:

```yaml
task: repair readiness behavior for a documented failure
goal: reject invalid evidence while preserving legitimate publication
scope: scripts/git/ and relevant regression tests
done_when:
  - a focused regression distinguishes the old and intended behavior
  - the regression and existing suite pass on the candidate revision
  - actual validation and remaining limitations are recorded
constraints:
  - helpers remain read-only
  - owner merge and production gates remain intact
stop_when:
  - acceptance criteria are satisfied
  - the same failure recurs without new evidence
  - the agreed attempt or time budget is exhausted
```

**Acceptance:** In a fresh-session exercise, an agent can identify both the required outcome and its proof without reconstructing the prior conversation. For a documentation task, acceptance should concern content, evidence, and links rather than inventing a code test.

### Priority 1 — Track policy-to-check coverage and close selected gaps

**Gap:** Several consequential rules have a clearer prose contract than executable coverage:

- `.clinerules` sets a below-300-line source rule, and `.context.md` identifies a current-state target/cap; both explicitly remain review rules.
- The Git workflow blocks publication if **either** `.context.md` or `.git-workflow.json` records a hold. `loadPolicy()` reads only the JSON file. A hold written only in Markdown is therefore not independently detected by the helper; the agent must honor it through the documented read.
- Fetching and remote-base freshness are required by prose but not established by publication readiness. The existing documentation already acknowledges this boundary.
- CI runs `git diff --check` on the checkout. With no tracked working-tree changes, this does not inspect whitespace introduced by the committed PR diff; it can pass without assessing that patch.

**Recommendation:** Add a compact coverage table identifying each important rule, its canonical owner, checking mechanism, and known bypasses. Implement only objective checks with real value:

1. Define source-size scope, exclusions, and threshold semantics before adding a checker. For existing violations, choose an explicit migration/ratchet policy rather than encouraging arbitrary splitting.
2. Resolve duplicate hold representation. Prefer one machine-readable authority plus a checked/generated human summary, while preserving existing hold semantics until the owner approves any policy change. Test mismatches and explicit release behavior.
3. Report fetched-base SHA and behind-count without claiming a local remote-tracking ref proves a recent fetch. Decide separately whether behind-base status is informational or blocking; being behind is not inherently unsafe.
4. Make CI's whitespace check use the intended committed change range, with the necessary base history fetched. Verify it against a synthetic committed whitespace defect.

**Acceptance:** Each selected violation fails a focused test and the intended CI check; documentation accurately states what remains advisory. Keep the helpers read-only.

### Priority 1 — Make repair loops bounded and informative

**Gap:** The review skill discourages open-ended review, but the template has no shared contract for repeated implementation failures, attempts, or elapsed budget.

**Recommendation:** Add a short conditional repair procedure to an existing relevant skill or linked workflow. Record expected result, observed result, changed hypothesis, attempted fix, and next discriminating check. A configurable initial limit such as three repair attempts can be trialed; it is a proposed starting point, not a universal optimum.

If two attempts produce the same failure without new information, stop repeating the same strategy. Reframe the hypothesis, gather a missing observation, or escalate with a concise blocker. Distinguish deterministic failures from transient infrastructure errors. Preserve autonomous progress on unrelated work where possible.

Use elapsed time or attempt budgets where host token accounting is unavailable. Do not claim an instruction alone imposes a hard spend limit; hard budgets belong in the host/runtime.

**Acceptance:** A synthetic stuck-task exercise terminates within its budget and leaves useful feedback. A task that reaches its acceptance criteria stops without inventing new requirements.

### Priority 2 — Add compact recovery evidence, not transcript dumping

**Gap:** Changelogs capture consequential outcomes, but not necessarily the state required to resume an interrupted repair. The article's full trace model is also broader than this repository can observe through its current helpers.

**Recommendation:** Extend the existing current-state/history pattern with task ID, relevant commit or patch identity, checks and exit status, unresolved failure, attempted approaches, and next action. Use one active-task pointer in `.context.md`; retain detailed dated evidence in the project's chosen log. Avoid parallel progress files with overlapping authority.

For richer tool traces, use host-provided session logs when available. Store only a redacted summary or reference in project evidence, consistent with `.clinerules` prohibitions on publishing session transcripts and private data. Mark missing cost/token data as unavailable rather than estimating it as fact.

**Acceptance:** Resume a deliberately interrupted synthetic task in a new session; verify that it avoids the documented dead end, checks current state, and continues from the correct revision.

### Priority 2 — Verify external boundaries where they matter

**Gap:** A read-only readiness helper cannot prevent an agent with broader credentials from running `git push`, `gh pr merge`, or a deployment command directly. Worktrees isolate changes but are not security sandboxes.

**Recommendation:** In each adopting environment, document which boundaries are enforced by host tool permissions, credential scope, repository protections, or deployment controls. Keep these details in adapters or project installation guidance, not universal product policy. Verify actual configured behavior before describing a restriction as enforced.

Preserve explicit merge/deployment authority. A policy file editable by the actor it governs is not, on its own, an independent authorization system. Do not convert this analysis into automatic changes to account permissions or production controls.

**Acceptance:** In a disposable environment, demonstrate an allowed operation and an externally denied operation. Record what was tested and which bypasses remain.

### Priority 2 — Improve behavioral and adoption evaluations

**Gap:** Existing paired skill cases did not discriminate between baseline and skill-assisted output. Deterministic Git tests cannot prove a host loaded instructions or respected them during a real session.

**Recommendation:** Build on [`docs/SKILL_EVALUATION.md`](SKILL_EVALUATION.md): split compound criteria; add near-miss triggers, conflicting-hold cases, stale-evidence completion, interrupted-task recovery, and bounded-retry scenarios. Keep graders separate from executors. Record host/model version, reviewed harness commit, outcome, and available time/cost data. Repeat a manageable subset to detect variability.

Exercise fresh-project adoption before creating an installer. A successful smoke test should demonstrate policy discovery, template customization, helper execution, and preservation of the consumer's existing rules. Treat a separate-context model review as additional evidence, not a replacement for deterministic checks or owner authority.

**Acceptance:** At least one case detects a seeded behavioral failure that a superficial answer would miss. Report comparative results and limitations even if no improvement is measured.

### Priority 3 — Introduce graph structure only after observed need

**Gap:** There is no general coordinator, persisted node state, or invalidation mechanism. For this project's present purpose, that is not a reason to add a framework.

**Recommendation:** First document a small dependency pattern for genuinely multi-part tasks: scope → independent read-only investigations → implementation → verification → review → publication. Apply the article's early-start test, but also check shared mutable files, credentials, and resource conflicts. Independent reads may run together; writes need explicit ownership or isolated worktrees.

When reusing a passed result, bind it to its inputs, relevant policy version, and revision. Invalidate it when those change. “Freeze what passed” must not become permission to reuse stale CI or stale review. This extends your existing exact-head evidence discipline.

Only introduce a scheduler if repeated real tasks show measurable benefit from independent retries and checkpoint recovery. Respect host delegation restrictions and explicit task authorization.

**Acceptance:** A failed independent job can be retried without rerunning unaffected work, while changed inputs invalidate every dependent result. Compare elapsed time and total cost against the simpler single-agent workflow.

## 6. Where to qualify or reject the article's advice

| Article advice | Recommended interpretation here |
| --- | --- |
| Write every important rule twice | Explain intent once and enforce objective parts in code; avoid two manually maintained authorities that drift |
| Tests passing means done | Only when tests cover the task contract and are tied to the actual candidate; documentation and operational tasks need different evidence |
| Write a failing check before any code | Valuable for reproducible bugs and behavior changes; do not manufacture tests for trivial prose edits or reversible low-impact work |
| Same result twice means escalate | Detect lack of new evidence; allow distinct hypotheses and bounded transient retries rather than treating matching text as proof of futility |
| Freeze passed nodes | Cache by inputs and invalidate dependents; never freeze evidence across relevant revision or policy changes |
| Separate contexts prevent shared blind spots | They reduce anchoring, but the same model can still make correlated errors; tests and independent evidence remain essential |
| Gates depend on the price of undo | Useful for selecting review depth, but cannot override this project's owner gates; a tiny diff may still have broad impact |
| Every tool call is traced | Prefer host-level capture and redacted summaries; never publish raw sessions merely to satisfy a checklist |
| Fix the system, not the prompt/model | Diagnose the failure first; tool design, task wording, context, and model capability can all be causal |

## 7. Suggested adoption sequence

| Stage | Smallest useful deliverable | Evidence to collect before expanding |
| --- | --- | --- |
| 1. Clarify completion | Optional task contract and short bounded-repair procedure | A task completes against explicit criteria; a stuck task stops usefully |
| 2. Close objective gaps | Policy/check map, hold consistency decision, size checks, committed-diff whitespace validation | Seeded failures detected without false claims of enforcement |
| 3. Validate portability | Fresh-project and fresh-session exercises across supported hosts | Actual loaded/read policy, preserved consumer rules, recovery success |
| 4. Improve evidence | Compact task outcomes and discriminating paired evaluations | Completion accuracy, repeated failures, reviewer corrections, available time/cost |
| 5. Coordinate selectively | One optional multi-job pattern if observed work warrants it | Lower recovery cost or elapsed time without stale-result reuse |

Keep reusable defaults in `global/`, host-specific discovery and permission guidance in `adapters/`, consumer examples in `templates/`, and deterministic tooling in focused `scripts/` modules. Keep task-specific acceptance and architecture in the adopting project. This preserves the repository's existing separation of responsibilities.

## Conclusion

The article validates your project's direction more than it calls for a redesign. Your strongest assets are disciplined instruction scope, durable project state, narrowly defined read-only tooling, and unusually careful separation of evidence from authority.

The main opportunity is to extend those qualities from **“is this revision ready for publication or merge?”** to **“what proves this task is complete, and what happens when progress stops?”** A lightweight contract, bounded feedback loop, targeted executable checks, and adoption evidence should come before broader orchestration.

These are recommendations only. This review does not implement new runtime controls, change publication authority, establish server-side protection, or demonstrate that a graph-based agent would outperform the current workflow.
