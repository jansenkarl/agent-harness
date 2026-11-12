---
tags: [skill-creator]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Audit-only, using these synthetic facts: rules say "300 lines is a target for all
source; 450 is hard maximum; eight functions is a target." The actual checker scans
src/, test/, scripts/ for .ts and .py, excludes site/ and shell scripts, and CI fails
new files above 300 lines or eight functions. Legacy baseline exceptions cannot grow.
Someone proposed fixing violations by raising the baseline or splitting files into
part1/part2. Recommend precise wording and the smallest next steps. No checker edits
are authorized. Does this prove a new CLI session loaded the rules?
