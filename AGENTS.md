# Agent harness — contributor entry point

Read `.clinerules`, `.context.md` and `docs/GIT_WORKFLOW.md` at task startup.
Keep universal defaults in `global/`, tool-specific discovery in `adapters/`, and
project-specific examples in `templates/`. Do not import private project history.
Run `npm test` and `git diff --check` for implementation changes. Report branch,
commit, PR, local/hosted checks and next action. Merge only on owner instruction.
