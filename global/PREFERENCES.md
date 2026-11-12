# Cross-project agent preferences

## Discover local policy

- At each new repository task, discover and follow its local agent entry points.
  If `.clinerules` exists, read it first (or its enabled rule files if a directory),
  then `.context.md` if present. Complete any immediate follow-up reads they require
  before planning or editing. Re-read at each new task to pick up other tools' edits.
- Follow the repository's declared policy order beneath platform instructions and
  explicit owner task constraints. Resolve conflicting instructions before acting.
- Missing optional convention files in an unrelated project are not an error.
  Do not create them or impose another project's architecture, paths or commands
  merely because they were used elsewhere.
- Keep durable project rules in version-controlled repository files. Private
  assistant memory supplements shared policy; it must not override current rules.

## Working preferences

- Make incremental, reviewable changes; reuse existing project conventions and
  preserve unrelated work. Prefer the simplest solution that meets the task.
- Use task-appropriate deterministic checks. Report what actually ran and distinguish
  local validation, hosted CI, merge and deployment evidence.
- Follow the project's Git lifecycle and publication authorization. Respect active
  local-only/CI holds; batch related work when CI is costly. Do not infer permission
  to publish from a request to continue implementation during a hold.
- Require explicit owner instruction for merges and separate authorization for
  production operations. Successful checks alone do not grant either permission.
- Keep completion reports concise: outcome, validation, branch/commit/PR/CI state
  where applicable, and the next action or blocker. Explain when owner input is needed.
- Keep current state concise and history in the project's evidence log. Do not
  invent a mandatory build log for projects that have no such policy.
