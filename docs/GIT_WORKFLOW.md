# Shared Git lifecycle

## Settings and authorization

Read `.git-workflow.json` for repository, integration branch, expected workflow/job
names and publication hold. Keep the hold aligned with `.context.md`. If either
records a hold, do not publish until the owner releases it and both records are
updated. A request to continue local implementation is not a hold release.

Requested implementation normally allows scoped branches, commits and publication
at a coherent review boundary. An explicit no-push/local-only/CI hold overrides it.
Merge requires owner instruction for the identified PR plus successful current CI.
Production operations need separate authorization. Never infer permission from
green checks; never infer green checks from owner permission.

## Lifecycle

1. **Inspect:** run `npm run git:status` (or the Node entry point directly), inspect
   the diff and existing work. Preserve unrelated edits/staging. An API failure is
   not evidence of no PR.
2. **Isolate:** create/reuse a scoped task branch. Do not implement on the integration
   branch. Use a separate worktree for unrelated concurrent work when appropriate.
3. **Validate:** run project-specific checks, review the full diff and stage explicit
   paths/hunks. Commit coherent slices even while publication is held.
4. **Publish:** recheck holds, refresh remote references, review against the current
   integration branch and run affected checks. Run `git:ready:publish`; inspect its
   report before a separate push/PR action. Update an existing related PR rather
   than creating duplicates. Check the project's CI triggers: draft PRs may run CI.
5. **Monitor:** inspect CI automatically for the current PR head. Missing, pending,
   failed, cancelled, skipped or stale expected checks are not success. Avoid
   redundant manual dispatches and small repeated pushes during expensive runs.
6. **Merge:** after explicit owner instruction run `git:ready:merge`, read the result
   and merge in a separate step using an expected-head guard, for example
   `gh pr merge NUMBER --merge --match-head-commit VERIFIED_SHA`. Do not chain a
   merge to a piped/truncated check command or use an administrator bypass. If the
   approved scope or head changes, stop and reverify.
7. **Close:** verify merged state and merge commit; inspect applicable post-merge CI.
   Update the local integration branch only when safe, normally by fast-forward.
   Report any pending checks or remaining rollout rather than claiming completion.

## Readiness contract

The helpers require Git, Node.js and authenticated `gh`. They never commit, fetch,
push, create PRs, trigger CI or merge. They report the branch/head, porcelain dirty
paths, upstream, PR, run attempt and job evidence. Empty upstream means absent.

- `status`: exit 0 means inspection succeeded, not readiness.
- `publish`: exit 0 means clean task branch, no configured hold and compatible
  existing PR scope. This does not establish local tests, remote-base freshness or
  scope review; those remain separate checks.
- `merge`: exit 0 means technical readiness at inspection time, never authorization.
- Readiness commands exit 1 for blockers; errors/unknown evidence exit 2.

CI lookup is paginated, for the configured workflow and exact PR head. The newest
run must associate explicitly with the PR; its current attempt and configured job
names must succeed. All reported PR checks must succeed too. Matrix job names need
their actual names in `requiredJobs`. Local head/policy, PR head/base and run attempt
are reread to detect changes during inspection. PR workflows can test synthetic
merge commits; the helper uses run/PR association rather than runner checkout SHA.

An empty server-required-check list does not waive configured expected jobs. Missing
associations fail closed and need investigation. Reports are snapshots, not atomic
locks, and cannot prevent direct commands. Use server-side PR/check protection when
available; do not claim it is enabled without inspecting repository settings.

## Handoff

Report branch, commits, PR URL (or unpublished reason), actual local/hosted checks,
merge/deployment state and next action. If CI is pending, leave PR/head/run references
so the next agent can resume inspection without asking the owner to paste logs.
