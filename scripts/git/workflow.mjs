import { inspect } from "./inspect.mjs";

const mode = process.argv[2] ?? "status";
if (process.argv.length > 3 || !["status", "publish", "merge"].includes(mode)) {
  console.error("Usage: node scripts/git/workflow.mjs [status|publish|merge]");
  process.exitCode = 2;
} else {
  try {
    const report = inspect();
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = mode === "status" ? 0 :
      (mode === "publish" ? report.publicationReady : report.mergeReady) ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ error: error.message, readiness: "unknown" }));
    process.exitCode = 2;
  }
}
