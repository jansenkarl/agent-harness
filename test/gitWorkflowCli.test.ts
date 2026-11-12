import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, expect, it } from "vitest";

const roots: string[] = [];
const script = join(process.cwd(), "scripts/git/workflow.mjs");
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

function workspace(hold: boolean) {
  const root = mkdtempSync(join(tmpdir(), "git-workflow-"));
  roots.push(root);
  const bin = join(root, "bin");
  const repo = join(root, "repo");
  mkdirSync(bin);
  mkdirSync(repo);
  const gh = join(bin, "gh");
  writeFileSync(gh, `#!/bin/sh
case "$1 $2" in
  "repo view") echo '{"nameWithOwner":"example/project"}' ;;
  "pr list") echo '[]' ;;
  *) exit 99 ;;
esac
`);
  chmodSync(gh, 0o755);
  const git = (args: string[]) => execFileSync("git", args, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  git(["init", "-b", "feature/task"]);
  writeFileSync(join(repo, ".git-workflow.json"), JSON.stringify({ repository: "example/project",
    baseBranch: "main", workflow: "ci.yml", requiredJobs: ["validate"],
    publicationHold: { active: hold, reason: "batch", releaseCondition: "owner release" } }));
  git(["add", ".git-workflow.json"]);
  git(["-c", "user.name=Synthetic", "-c", "user.email=synthetic@example.invalid",
    "-c", "commit.gpgsign=false", "commit", "-m", "fixture"]);
  const invoke = (mode: string) => spawnSync(process.execPath, [script, mode], {
    cwd: repo, encoding: "utf8", env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
  });
  return { repo, gh, git, invoke };
}

it("reports an active hold and blocks readiness without changing Git state", () => {
  const { git, invoke } = workspace(true);
  const head = git(["rev-parse", "HEAD"]);
  const status = invoke("status");
  expect(status.status).toBe(0);
  expect(JSON.parse(status.stdout)).toMatchObject({ upstream: "", pr: null, publicationReady: false });
  expect(invoke("publish").status).toBe(1);
  expect(invoke("merge").status).toBe(1);
  expect(git(["rev-parse", "HEAD"])).toBe(head);
  expect(git(["status", "--porcelain"])).toBe("");
});

it("allows clean publication preflight but blocks dirty, detached and integration states", () => {
  const { repo, git, invoke } = workspace(false);
  expect(invoke("publish").status).toBe(0);
  expect(invoke("merge").status).toBe(1);
  writeFileSync(join(repo, "unrelated.txt"), "preserve me");
  expect(invoke("publish").status).toBe(1);
  rmSync(join(repo, "unrelated.txt"));
  git(["switch", "--detach"]);
  expect(invoke("publish").status).toBe(1);
  git(["switch", "-c", "main"]);
  expect(invoke("publish").status).toBe(1);
});

it("distinguishes missing policy/API errors from a normal absent PR", () => {
  const { repo, gh, invoke } = workspace(false);
  expect(invoke("unsupported").status).toBe(2);
  writeFileSync(gh, "#!/bin/sh\necho 'sensitive diagnostic' >&2\nexit 1\n");
  const failed = invoke("status");
  expect(failed.status).toBe(2);
  expect(failed.stderr).not.toContain("sensitive diagnostic");
  expect(JSON.parse(failed.stderr).readiness).toBe("unknown");
  rmSync(join(repo, ".git-workflow.json"));
  expect(invoke("publish").status).toBe(2);
});
