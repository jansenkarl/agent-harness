# Agent harness

A portable, model-independent foundation for agentic coding workflows.

## Contents

- `global/PREFERENCES.md`: shared personal defaults for any project.
- `adapters/`: thin OpenCode, Claude Code and Cline entry points.
- `templates/project/`: current-state summary, local rules and Git policy starters.
- `scripts/git/`: read-only Git/GitHub status and readiness checks.
- `test/`: synthetic policy, race-condition and disposable-repository CLI tests.
- `docs/`: installation, verification, provenance and roadmap.

Project-specific architecture, secrets, customer data and operational history stay
in their owning repositories. This is a curated toolkit, not a copy of a live
assistant configuration directory.

## Try it

Requires Node.js 22+, Git and authenticated GitHub CLI (`gh`). Tests do not require
GitHub authentication or network access after dependencies are installed.

```sh
npm ci
npm test
npm run git:status
```

See [installation](docs/INSTALLATION.md) to adopt the harness in another project.
Installation is explicit and reviewable: nothing silently overwrites your rules.

## Git helpers

| Command | Purpose |
| --- | --- |
| `npm run git:status` | Inspect local branch, dirty paths, upstream, PR and CI evidence |
| `npm run git:ready:publish` | Check clean task branch, publication hold and existing PR scope |
| `npm run git:ready:merge` | Check exact-head CI and technical merge readiness |

All commands are read-only. `status` exits 0 when inspection succeeds, **not** when
ready. Readiness commands exit 1 for blockers; all commands exit 2 on errors or
unknown evidence. Successful checks never grant owner permission to merge or deploy.
See [Git workflow](docs/GIT_WORKFLOW.md) for requirements and limitations.

## Status

Initial reusable foundation. Instruction-maintenance and code-review skills are
planned next; they are not included yet. See [roadmap](docs/ROADMAP.md).

## License

No license has been selected yet. Public visibility alone does not grant an
open-source license; the owner will select terms before broader reuse/distribution.
