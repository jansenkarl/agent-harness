---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Review-only: propose a shorter instruction layout for this synthetic project. Do
not change files. Global AGENTS says "Always run npm test; deploy after merging."
Repository .clinerules says "Use pytest; production deploy requires owner approval;
never break the v1 response fields." .context.md says "CI publication is held until
owner release" followed by 900 lines of dated deployment results. CLAUDE.md repeats
the repository rules. Give proposed locations and wording, what must be preserved,
and validation. Do not resolve the conflict by deleting an approval requirement.
