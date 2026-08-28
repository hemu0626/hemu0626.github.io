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
  const maxw = [...html.matchAll(/class="[^"]*max-w[^"]*"/g)].map((m) => m[0]);
  console.log("max-w classes:", [...new Set(maxw)].join("\n"));
  // find the post/article wrapper
  const i = html.indexOf('class="post"');
  if (i >= 0) console.log("\n== around .post ==\n", html.slice(i - 100, i + 1500).replace(/\s+/g, " "));
  const j = html.indexOf("<article");
  if (j >= 0) console.log("\n== article tag ==\n", html.slice(j, j + 600).replace(/\s+/g, " "));
  // search any element containing '1300'
  const k = html.indexOf("1300");
  if (k >= 0) console.log("\n== around '1300' ==\n", html.slice(k - 200, k + 200).replace(/\s+/g, " "));
  else console.log("\nno '1300' in html");
})();
