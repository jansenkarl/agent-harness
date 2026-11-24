// @ts-nocheck -- Tests import Node .mjs tooling outside the Worker TS target.
import { describe, expect, it } from "vitest";
import { inspect } from "../scripts/git/inspect.mjs";

const sha = "a".repeat(40);
const policy = { repository: "example/project", baseBranch: "main", workflow: "ci.yml",
  requiredJobs: ["validate"], publicationHold: { active: false, reason: "", releaseCondition: "" } };

function fixture(change = "") {
  let prReads = 0;
  let headReads = 0;
  const calls: string[][] = [];
  const pr = { number: 7, url: "https://github.com/example/project/pull/7", state: "OPEN",
    isDraft: false, isCrossRepository: false, headRefName: "feature/task", headRefOid: sha,
    baseRefName: "main", baseRefOid: "c".repeat(40), mergeable: "MERGEABLE",
    statusCheckRollup: [{ __typename: "CheckRun", status: "COMPLETED", conclusion: "SUCCESS" }] };
  const run = { id: 12, run_attempt: 1, head_sha: sha, head_branch: "feature/task",
    event: "pull_request", path: ".github/workflows/ci.yml", pull_requests: [{ number: 7 }],
    status: "completed", conclusion: "success" };
  const execute = (program: string, args: string[]) => {
    calls.push([program, ...args]);
    const text = args.join(" ");
    if (program === "git") {
      if (text === "rev-parse --show-toplevel") return "/synthetic";
      if (text === "branch --show-current") return "feature/task\n";
      if (text === "rev-parse HEAD") return change === "local-head" && headReads++ > 0 ? "b".repeat(40) : sha;
      if (args[0] === "status") return "";
      if (args[0] === "for-each-ref") return "origin/feature/task\n";
    }
    if (program === "gh") {
      if (change === "api-error") throw new Error("API unavailable");
      if (args[0] === "repo") return JSON.stringify({ nameWithOwner: "example/project" });
      if (args[0] === "pr" && args[1] === "list") return JSON.stringify(change === "no-pr" ? [] : [{ number: 7 }]);
      if (args[0] === "pr" && args[1] === "view") {
        prReads++;
        return JSON.stringify(prReads > 1 && change === "remote-head" ? { ...pr, headRefOid: "b".repeat(40) } : pr);
      }
      if (args[0] === "api") {
        const endpoint = args.at(-1)!;
        if (endpoint.includes("/workflows/")) return JSON.stringify([{ workflow_runs: [run] }]);
        if (endpoint.includes("/jobs?")) return JSON.stringify([{ jobs: [{ name: "validate",
          status: "completed", conclusion: "success", run_id: 12, head_sha: sha }] }]);
        return JSON.stringify(change === "rerun" ? { ...run, run_attempt: 2 } : run);
      }
    }
    throw new Error(`Unexpected command ${program} ${text}`);
  };
  return { execute, calls };
}

describe("Git workflow evidence collection", () => {
  it("reuses the associated PR, paginates evidence and performs only reads", () => {
    const { execute, calls } = fixture();
    expect(inspect(execute, () => policy)).toMatchObject({ mergeReady: true, pr: { number: 7 } });
    expect(calls.filter((call) => call[0] === "gh" && call[1] === "api" && call.includes("--paginate"))).toHaveLength(2);
    expect(calls.every((call) => call[0] === "git"
      ? ["rev-parse", "branch", "status", "for-each-ref"].includes(call[1])
      : ["repo", "pr", "api"].includes(call[1]))).toBe(true);
  });

  it("reports no PR without pretending hosted CI exists", () => {
    const { execute } = fixture("no-pr");
    expect(inspect(execute, () => policy)).toMatchObject({ pr: null, run: null, mergeReady: false });
  });

  it.each(["api-error", "local-head", "remote-head", "rerun"])("fails closed on %s", (change) => {
    expect(() => inspect(fixture(change).execute, () => policy)).toThrow();
  });

  it("detects policy changes during inspection", () => {
    let reads = 0;
    expect(() => inspect(fixture().execute, () => reads++ ? { ...policy,
      publicationHold: { active: true } } : policy)).toThrow("policy changed");
  });

  it("rejects a repository mismatch before looking up PRs", () => {
    const { execute, calls } = fixture();
    expect(() => inspect(execute, () => ({ ...policy, repository: "other/project" }))).toThrow("Repository");
    expect(calls.some((call) => call[1] === "pr")).toBe(false);
  });
});
