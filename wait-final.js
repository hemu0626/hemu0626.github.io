const https = require("https");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function fetch(path) {
  return new Promise((res, rej) => {
    https.get({ hostname: "hemu0626.github.io", path, headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
      let b = "";
      r.on("data", (c) => (b += c));
      r.on("end", () => res(b));
    }).on("error", rej);
  });
}
(async () => {
  const started = Date.now();
  while (Date.now() - started < 12 * 60 * 1000) {
    try {
      const proj = await fetch("/projects/");
      const mapGone = !proj.includes("research-map");
      const svgCards = proj.includes("projects-fyp.svg") && proj.includes("projects-surf.svg");
      const tea = await fetch("/teaching/");
      const ayOk = tea.includes("2025–26") && tea.includes("2024–25") && tea.includes("2023–24") && tea.includes("2022–23") && tea.includes("2021–22") && tea.includes("2020–21");
      if (mapGone && svgCards && ayOk) {
        console.log("ALL OK");
        console.log("research map gone:", mapGone, "| svg card covers:", svgCards);
        const years = [...tea.matchAll(/class="year">([^<]+)</g)].map((m) => m[1]);
        console.log("teaching groups:", years.join(" | "));
        process.exit(0);
      }
      console.log("waiting... map:", mapGone, "svg:", svgCards, "ay:", ayOk);
    } catch (e) {
      console.log("fetch error:", e.message);
    }
    await sleep(20000);
  }
  console.log("TIMEOUT");
  process.exit(2);
})();
