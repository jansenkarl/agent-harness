# Provenance and maintenance

This foundation extracts generic workflow practices and read-only tooling developed
in an existing project, with owner-directed reuse. Only selected preferences, helper
source and synthetic tests were transferred. Templates and installation guidance
were written for independent projects; no private project history, operational
configuration, credentials or assistant memory was imported.

This repository is the source for future reusable changes. Consumers retain reviewed,
versioned copies and record their adopted harness commit. Existing installations are
not silently redirected to this checkout. Project-specific fixes remain in consumers;
general fixes should be reviewed here and adopted deliberately.

The initial helpers are tested locally with synthetic GitHub evidence and disposable
Git repositories. Successful tests do not establish universal agent compliance or
replace actual PR/CI/merge acceptance in each adopting environment.
