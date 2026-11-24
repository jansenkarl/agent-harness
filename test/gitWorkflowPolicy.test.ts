// @ts-nocheck -- Tests import Node .mjs tooling outside the Worker TS target.
import { describe, expect, it } from "vitest";
import { evaluate, loadPolicy } from "../scripts/git/policy.mjs";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sha = "a".repeat(40);
const policy = { repository: "example/project", baseBranch: "main", workflow: "ci.yml",
  requiredJobs: ["validate"], publicationHold: { active: false, reason: "", releaseCondition: "" } };

function passing() {
  return { branch: "feature/task", head: sha, dirty: "", pr: {
    number: 7, state: "OPEN", isDraft: false, isCrossRepository: false,
    headRefName: "feature/task", headRefOid: sha, baseRefName: "main", mergeable: "MERGEABLE",
    statusCheckRollup: [{ __typename: "CheckRun", status: "COMPLETED", conclusion: "SUCCESS" }],
  }, run: { id: 12, head_sha: sha, head_branch: "feature/task", event: "pull_request",
    path: ".github/workflows/ci.yml", pull_requests: [{ number: 7 }],
    status: "completed", conclusion: "success" },
  jobs: [{ name: "validate", status: "completed", conclusion: "success", run_id: 12, head_sha: sha }] };
}

describe("Git workflow readiness policy", () => {
  it("recognizes successful evidence without granting owner authorization", () => {
    expect(evaluate(passing(), policy)).toMatchObject({ mergeReady: true,
      publicationReady: true, ownerMergeAuthorizationRequired: true });
  });

  it("blocks publication and merge on a hold, including green CI", () => {
    const result = evaluate(passing(), { ...policy, publicationHold: { active: true } });
    expect(result.publicationBlockers).toContain("publication_hold");
    expect(result.mergeReady).toBe(false);
  });

  it.each(["main", ""])("refuses integration or detached branch %s", (branch) => {
    expect(evaluate({ ...passing(), branch }, policy).publicationReady).toBe(false);
  });

  it("keeps no-PR publication eligibility distinct from merge readiness", () => {
    const result = evaluate({ ...passing(), pr: null }, policy);
    expect(result.publicationReady).toBe(true);
    expect(result.mergeBlockers).toContain("no_open_pr");
  });

  it("blocks dirty worktrees and mismatched local/remote commits", () => {
    expect(evaluate({ ...passing(), dirty: "?? file\0" }, policy).publicationReady).toBe(false);
    expect(evaluate({ ...passing(), head: "b".repeat(40) }, policy).mergeBlockers)
      .toContain("local_remote_head_mismatch");
  });

  it.each(["failure", "cancelled", "skipped", null])("rejects CI conclusion %s", (conclusion) => {
    const report = passing();
    report.run.conclusion = conclusion;
    expect(evaluate(report, policy).mergeReady).toBe(false);
  });

  it.each(["missing-job", "pending-job", "wrong-job-sha", "wrong-run", "wrong-pr", "stale-run",
    "wrong-workflow", "no-rollup", "failed-extra-check", "draft", "fork", "wrong-base", "unknown-mergeability"])(
    "fails closed for %s", (scenario) => {
      const report = passing();
      if (scenario === "missing-job") report.jobs = [];
      if (scenario === "pending-job") report.jobs[0].status = "in_progress";
      if (scenario === "wrong-job-sha") report.jobs[0].head_sha = "b".repeat(40);
      if (scenario === "wrong-run") report.jobs[0].run_id = 99;
      if (scenario === "wrong-pr") report.run.pull_requests = [];
      if (scenario === "stale-run") report.run.head_sha = "b".repeat(40);
      if (scenario === "wrong-workflow") report.run.path = ".github/workflows/other.yml";
      if (scenario === "no-rollup") report.pr.statusCheckRollup = [];
      if (scenario === "failed-extra-check") report.pr.statusCheckRollup.push(
        { __typename: "CheckRun", status: "COMPLETED", conclusion: "FAILURE" });
      if (scenario === "draft") report.pr.isDraft = true;
      if (scenario === "fork") report.pr.isCrossRepository = true;
      if (scenario === "wrong-base") report.pr.baseRefName = "other";
      if (scenario === "unknown-mergeability") report.pr.mergeable = "UNKNOWN";
      expect(evaluate(report, policy).mergeReady).toBe(false);
    });

  it("rejects absent, malformed or incompletely specified policy", () => {
    const root = mkdtempSync(join(tmpdir(), "git-policy-"));
    try {
      expect(() => loadPolicy(root)).toThrow();
      for (const content of ["{", "{}", JSON.stringify({ ...policy, publicationHold: {} }),
        JSON.stringify({ ...policy, requiredJobs: [] })]) {
        writeFileSync(join(root, ".git-workflow.json"), content);
        expect(() => loadPolicy(root)).toThrow();
      }
      writeFileSync(join(root, ".git-workflow.json"), JSON.stringify(policy));
      expect(loadPolicy(root)).toEqual(policy);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
