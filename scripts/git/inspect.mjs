import { execFileSync } from "node:child_process";
import { loadPolicy, evaluate } from "./policy.mjs";

export function command(program, args, cwd = process.cwd()) {
  try {
    return execFileSync(program, args, { cwd, encoding: "utf8", timeout: 30000,
      maxBuffer: 8 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GH_PROMPT_DISABLED: "1", GIT_OPTIONAL_LOCKS: "0" } });
  } catch {
    // Do not echo raw subprocess output: Git remotes/API errors may contain credentials.
    throw new Error(`${program} read failed; check installation, authentication and repository access.`);
  }
}

export function localState(run) {
  const branch = run("git", ["branch", "--show-current"]).trim();
  return {
    branch,
    head: run("git", ["rev-parse", "HEAD"]).trim(),
    dirty: run("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"]),
    upstream: branch ? run("git", ["for-each-ref", "--format=%(upstream:short)",
      `refs/heads/${branch}`]).trim() : "",
  };
}

export function inspect(run = command, readPolicy = loadPolicy) {
  const root = run("git", ["rev-parse", "--show-toplevel"]).trim();
  const policy = readPolicy(root);
  const json = (args) => JSON.parse(run("gh", args));
  const repository = json(["repo", "view", "--json", "nameWithOwner"]).nameWithOwner;
  if (repository !== policy.repository) throw new Error("Repository does not match .git-workflow.json.");
  const local = localState(run);
  const report = { ...local, repository, hold: policy.publicationHold, pr: null, run: null, jobs: [] };
  if (local.branch) {
    const prs = json(["pr", "list", "--repo", repository, "--head", local.branch,
      "--state", "open", "--limit", "100", "--json", "number"]);
    if (!Array.isArray(prs) || prs.length > 1) throw new Error("Ambiguous PR selection.");
    if (prs.length === 1) {
      report.pr = readPr(json, repository, prs[0].number);
      const endpoint = `repos/${repository}/actions/workflows/${policy.workflow}/runs`;
      const pages = json(["api", "--paginate", "--slurp",
        `${endpoint}?event=pull_request&head_sha=${report.pr.headRefOid}&per_page=100`]);
      const runs = pages.flatMap((page) => page.workflow_runs);
      if (runs.some((item) => !item || !Number.isInteger(item.id))) throw new Error("Invalid CI run data.");
      report.run = runs.sort((a, b) => b.id - a.id)[0] ?? null;
      if (report.run) {
        const pages = json(["api", "--paginate", "--slurp",
          `repos/${repository}/actions/runs/${report.run.id}/attempts/${report.run.run_attempt}/jobs?per_page=100`]);
        report.jobs = pages.flatMap((page) => page.jobs);
        const latestRun = json(["api", `repos/${repository}/actions/runs/${report.run.id}`]);
        if (["id", "run_attempt", "status", "conclusion", "head_sha"].some(
          (field) => latestRun[field] !== report.run[field])) {
          throw new Error("CI run changed during inspection; inspect again.");
        }
      }
      const latest = readPr(json, repository, prs[0].number);
      if (latest.headRefOid !== report.pr.headRefOid || latest.baseRefOid !== report.pr.baseRefOid ||
          latest.state !== report.pr.state) throw new Error("PR changed during inspection; inspect again.");
      report.pr = latest;
    }
  }
  if (JSON.stringify(localState(run)) !== JSON.stringify(local) ||
      JSON.stringify(readPolicy(root)) !== JSON.stringify(policy)) {
    throw new Error("Local state or policy changed during inspection; inspect again.");
  }
  const readiness = evaluate(report, policy);
  // Keep API payloads (commit messages, actor metadata, job steps) out of reports.
  if (report.run) {
    const { id, run_attempt, head_sha, head_branch, event, path, status, conclusion } = report.run;
    report.run = { id, run_attempt, head_sha, head_branch, event, path, status, conclusion };
  }
  report.jobs = report.jobs.map(({ name, status, conclusion, run_id, head_sha }) =>
    ({ name, status, conclusion, run_id, head_sha }));
  return { ...report, ...readiness };
}

export function readPr(json, repository, number) {
  const pr = json(["pr", "view", String(number), "--repo", repository, "--json",
    "number,url,state,isDraft,isCrossRepository,headRefName,headRefOid,baseRefName,baseRefOid,mergeable,statusCheckRollup"]);
  if (pr.number !== number || !/^[a-f0-9]{40}$/.test(pr.headRefOid ?? "") ||
      !/^[a-f0-9]{40}$/.test(pr.baseRefOid ?? "") ||
      typeof pr.isDraft !== "boolean" || typeof pr.isCrossRepository !== "boolean" ||
      typeof pr.headRefName !== "string" || typeof pr.baseRefName !== "string" ||
      !["OPEN", "CLOSED", "MERGED"].includes(pr.state) ||
      !Array.isArray(pr.statusCheckRollup)) throw new Error("Invalid PR evidence.");
  return pr;
}
