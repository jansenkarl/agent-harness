import { readFileSync } from "node:fs";
import { join } from "node:path";

export function loadPolicy(root) {
  const policy = JSON.parse(readFileSync(join(root, ".git-workflow.json"), "utf8"));
  const hold = policy.publicationHold;
  if (!/^[\w.-]+\/[\w.-]+$/.test(policy.repository ?? "") ||
      typeof policy.baseBranch !== "string" || !policy.baseBranch ||
      !/^[\w.-]+\.ya?ml$/.test(policy.workflow ?? "") ||
      !Array.isArray(policy.requiredJobs) || !policy.requiredJobs.length ||
      !policy.requiredJobs.every((name) => typeof name === "string" && name.length > 0) ||
      typeof hold?.active !== "boolean" ||
      typeof hold.reason !== "string" || typeof hold.releaseCondition !== "string" ||
      (hold.active && (!hold.reason.trim() || !hold.releaseCondition.trim()))) {
    throw new Error("Invalid .git-workflow.json policy; readiness is unknown.");
  }
  return policy;
}

export function evaluate(report, policy) {
  const publication = [];
  if (policy.publicationHold.active) publication.push("publication_hold");
  if (!report.branch || report.branch === policy.baseBranch) publication.push("task_branch_required");
  if (report.dirty) publication.push("uncommitted_changes");
  if (report.pr && (report.pr.baseRefName !== policy.baseBranch || report.pr.isCrossRepository ||
      report.pr.headRefName !== report.branch)) publication.push("pr_scope_mismatch");
  const merge = [...publication];
  const pr = report.pr;
  if (!pr) merge.push("no_open_pr");
  else {
    if (pr.state !== "OPEN" || pr.isDraft) merge.push("pr_not_open_ready");
    if (pr.headRefOid !== report.head) merge.push("local_remote_head_mismatch");
    if (pr.mergeable !== "MERGEABLE") merge.push("mergeability_unknown_or_conflicting");
    if (!Array.isArray(pr.statusCheckRollup) || !pr.statusCheckRollup.length ||
        pr.statusCheckRollup.some((check) => check.__typename === "CheckRun"
          ? check.status !== "COMPLETED" || check.conclusion !== "SUCCESS"
          : check.__typename !== "StatusContext" || check.state !== "SUCCESS")) {
      merge.push("pr_checks_not_successful");
    }
    const run = report.run;
    if (!run || run.head_sha !== pr.headRefOid || run.event !== "pull_request" ||
        run.path !== `.github/workflows/${policy.workflow}` ||
        run.head_branch !== report.branch ||
        !run.pull_requests?.some((item) => item.number === pr.number)) {
      merge.push("missing_or_unassociated_ci_run");
    } else if (run.status !== "completed" || run.conclusion !== "success") {
      merge.push("ci_run_not_successful");
    }
    const jobs = report.jobs;
    if (!Array.isArray(jobs) || !jobs.length ||
        jobs.some((job) => job.status !== "completed" || job.conclusion !== "success" ||
          job.run_id !== run?.id || job.head_sha !== pr.headRefOid) ||
        policy.requiredJobs.some((name) => !jobs.some((job) => job.name === name))) {
      merge.push("expected_jobs_not_successful");
    }
  }
  return { publicationBlockers: publication, mergeBlockers: merge,
    publicationReady: publication.length === 0, mergeReady: merge.length === 0,
    ownerMergeAuthorizationRequired: true };
}
