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
  const cssLink = (html.match(/href="(\/assets\/css\/tailwind\.css[^"]*)"/) || [])[1];
  const mainLink = (html.match(/href="(\/assets\/css\/main\.css[^"]*)"/) || [])[1];
  for (const link of [cssLink, mainLink].filter(Boolean)) {
    const c = await fetch(link);
    console.log("== " + link + " ==");
    let idx = 0;
    while ((idx = c.indexOf("--max-content-width", idx)) >= 0) {
      const start = c.lastIndexOf("{", idx);
      const end = c.indexOf("}", idx);
      console.log("rule:", c.slice(start - 120, end + 1).replace(/\s+/g, " "));
      idx = end;
    }
    let i2 = 0;
    while ((i2 = c.indexOf(".container", i2)) >= 0) {
      const start = c.lastIndexOf("{", i2);
      const end = c.indexOf("}", i2);
      console.log(".container rule:", c.slice(start - 40, end + 1).replace(/\s+/g, " "));
      i2 = end;
    }
  }
})();
