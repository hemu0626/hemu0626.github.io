// Fetch logs for the latest workflow run of a repo.
const https = require("https");
const TOKEN = process.env.GH_TOKEN;

function get(url, headers = {}, redirects = 3) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "dsh-site-rebuild", Accept: "application/vnd.github+json", ...(headers.noauth ? {} : { Authorization: "Bearer " + TOKEN }) } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
          res.resume();
          // drop Authorization on cross-host redirects (Azure blob SAS URLs reject it)
          return resolve(get(res.headers.location, { noauth: true }, redirects - 1));
        }
        let b = "";
        res.on("data", (c) => (b += c));
        res.on("end", () => resolve({ status: res.statusCode, body: b, headers: res.headers, json: (() => { try { return JSON.parse(b); } catch { return null; } })() }));
      })
      .on("error", reject);
  });
}

async function main() {
  const runs = await get("https://api.github.com/repos/hemu0626/hemu0626.github.io/actions/runs?per_page=5");
  const run = runs.json.workflow_runs[0];
  console.log(`run #${run.id} [${run.name}] status=${run.status} conclusion=${run.conclusion}`);
  const jobs = await get(`https://api.github.com/repos/hemu0626/hemu0626.github.io/actions/runs/${run.id}/jobs?per_page=10`);
  for (const j of jobs.json.jobs) {
    console.log(`job ${j.id} [${j.name}] status=${j.status} conclusion=${j.conclusion}`);
    if (j.status === "completed" && j.conclusion === "failure") {
      const logs = await get(`https://api.github.com/repos/hemu0626/hemu0626.github.io/actions/jobs/${j.id}/logs`);
      // print last ~120 lines of the log
      const lines = logs.body.split("\n");
      console.log("---- last 120 log lines ----");
      console.log(lines.slice(-120).join("\n"));
    }
  }
}
main().catch((e) => { console.error("ERR: " + e.message); process.exit(1); });
