// Poll the latest workflow run for the deploy workflow until it finishes.
const https = require("https");
const TOKEN = process.env.GH_TOKEN;

function api(path) {
  return new Promise((resolve, reject) => {
    https
      .get(
        { hostname: "api.github.com", path, headers: { "User-Agent": "dsh-site-rebuild", Accept: "application/vnd.github+json", Authorization: "Bearer " + TOKEN } },
        (res) => { let b = ""; res.on("data", (c) => (b += c)); res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(b) })); }
      )
      .on("error", reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const started = Date.now();
  let lastId = null;
  while (Date.now() - started < 12 * 60 * 1000) {
    const r = await api("/repos/hemu0626/hemu0626.github.io/actions/runs?per_page=3");
    if (r.status !== 200) { console.log("HTTP " + r.status); await sleep(15000); continue; }
    const run = r.body.workflow_runs[0];
    if (!run) { console.log("no runs yet"); await sleep(15000); continue; }
    if (lastId !== run.id) {
      lastId = run.id;
      console.log(`run #${run.id} [${run.name}] status=${run.status} conclusion=${run.conclusion ?? "-"} (${run.created_at})`);
    }
    if (run.status === "completed") {
      console.log(`FINAL: ${run.conclusion}`);
      process.exit(run.conclusion === "success" ? 0 : 1);
    }
    await sleep(20000);
  }
  console.log("TIMEOUT waiting for deploy");
  process.exit(2);
}
main();
