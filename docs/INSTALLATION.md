# Adopt the harness

## Scope

Use reviewed copies pinned to a harness commit. Existing repositories retain their
own product rules and operational history. Compare before copying; never overwrite
unfamiliar files. Do not copy the harness repository's own `.context.md` into a project.

## Global preferences

Review `global/PREFERENCES.md`, back up existing files, and merge or install it at:

| Tool | User-level path |
| --- | --- |
| OpenCode | `~/.config/opencode/AGENTS.md` |
| Claude Code | `~/.claude/CLAUDE.md` |
| Cline | `~/Documents/Cline/Rules/agent-preferences.md` |

These are explicit installation steps, not automatic startup repairs. Preserve
other preferences and credentials. Record the source commit alongside your setup
notes. Later updates should be reviewed diffs, not silently changing symlink targets.

## Project files

1. Review/copy the files (including dotfiles) under `templates/project/` into the
   project. Replace all template prompts and repository/CI placeholders.
2. Copy `adapters/AGENTS.md` and `adapters/CLAUDE.md` to the project root, merging
   existing rules. For Cline, enable its detected AGENTS/local rules; consult
   `adapters/cline.md` if an explicit adapter is needed for your installed version.
3. Copy `docs/GIT_WORKFLOW.md` to the project's `docs/` and `scripts/git/` to its
   `scripts/git/`. Customize authorization and validation for that project.
4. Add the three `git:*` scripts from this repository's `package.json` to the
   project's package scripts, without replacing its package file. Alternatively
   invoke `node /path/to/project/scripts/git/workflow.mjs status` from the project.
   Helpers use only Node built-ins, Git and `gh`; Vitest is only needed for tests.
5. Confirm actual repository name, integration branch, workflow filename and job
   names in `.git-workflow.json`. The template starts held until owner confirmation.
6. Run local status and focused tests. Record the adopted harness commit. Keep
   production permissions, source-size checks and CI timing project-specific.

## Verify loading

Start fresh sessions in the project. In Claude, `/context all` or `/memory` should
show user/project CLAUDE files and imported AGENTS. In Cline, inspect enabled Rules.
OpenCode discovers global/project AGENTS; references request subsequent file reads.
Ask each tool, without making changes, to identify loaded versus subsequently read
files, canonical policy, current hold/release condition, and merge authorization.
Check the UI's loaded-file evidence as well as the answer. A file existing on disk
does not prove that a particular session consumed it.

## Updates and rollback

### Optional skills

Review `skills/instruction-maintenance/SKILL.md` and `skills/code-review/SKILL.md`.
Install each complete skill directory into a documented discovery location, such
as `.opencode/skills/<name>/` for project-scoped OpenCode use, or
`.claude/skills/<name>/` for project-scoped Claude use. OpenCode also supports
`.claude/skills` compatibility discovery, so one reviewed copy may serve both tools.
Use `~/.config/opencode/skills` or `~/.claude/skills` only when global installation
is intended. Avoid duplicate IDs and preserve an existing skill of the same name.

This source repository's `skills/` directory is not automatically installed merely
by cloning it. Confirm discovery in the target tool and explicitly invoke the skill
once before relying on automatic triggering. The evaluation cases are synthetic;
they are not mandatory startup reads or automatic production review gates.

### Updating installed files

Maintain reusable defaults/helpers here and project-specific settings in projects.
Diff the adopted version before updating; test in the consumer and record the new
source commit. Keep local installed globals synchronized intentionally with the
reviewed source. Restore your saved files to roll back; do not delete divergent work.

## Tool documentation

- https://opencode.ai/docs/instructions
- https://code.claude.com/docs/en/memory
- https://docs.cline.bot/features/cline-rules
