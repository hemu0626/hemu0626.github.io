const https = require("https");
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
  const html = await fetch("/");
  // find content wrapper structure after <body>
  const bodyIdx = html.indexOf("<body");
  const mainIdx = html.indexOf("<main", bodyIdx);
  const wrapper = html.slice(mainIdx > 0 ? mainIdx : bodyIdx, (mainIdx > 0 ? mainIdx : bodyIdx) + 1200).replace(/\s+/g, " ");
  console.log("== wrapper markup ==");
  console.log(wrapper.slice(0, 900));
  // css files
  const cssLinks = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);
  console.log("\n== css files ==", cssLinks.join(", "));
  for (const css of cssLinks) {
    const c = await fetch(css);
    const rules = [...c.matchAll(/[^{}]*max-width[^{}]*\{[^}]*\}/g)].map((m) => m[0].slice(0, 200));
    const nine30 = [...c.matchAll(/[^{}]*930[^{}]*\{[^}]*\}/g)].map((m) => m[0].slice(0, 200));
    const cont = [...c.matchAll(/[^{}]*container[^{}]*\{[^}]*\}/g)].map((m) => m[0].slice(0, 200)).slice(0, 12);
    console.log(`\n== ${css} (${c.length} bytes) ==`);
    console.log("max-width rules:", rules.length);
    rules.slice(0, 12).forEach((r) => console.log(" -", r.replace(/\s+/g, " ")));
    if (nine30.length) { console.log("rules containing 930:"); nine30.slice(0, 6).forEach((r) => console.log(" -", r.replace(/\s+/g, " "))); }
  }
})();
