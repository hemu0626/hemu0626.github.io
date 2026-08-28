// Fetch authoritative author lists from CrossRef for every bib entry with a DOI.
const https = require("https");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const entries = [
  ["he2026likelihood", "10.1080/03610918.2026.2651419"],
  ["he2026aviation", "10.1007/s10479-026-07337-0"],
  ["qiu2026urban", "10.1016/j.ecoenv.2026.120062"],
  ["zhang2026neonatal", "10.1136/bmjph-2025-003629"],
  ["he2025hiv", "10.1080/14787210.2025.2599911"],
  ["wang2025dengue", "10.1016/j.jiph.2025.102849"],
  ["zhang2025adaptive", "10.1016/j.ress.2025.111795"],
  ["zhang2025scale", "10.1016/j.cie.2025.111600"],
  ["zhang2025iterative", "10.1109/TR.2025.3589325"],
  ["li2024plasma", "10.3390/nu16234065"],
  ["chen2024associations", "10.3390/nu16050672"],
  ["zhang2024cyclic", "10.1109/TR.2024.3509446"],
  ["zhang2024reliability", "10.1002/qre.3654"],
  ["lin2024bifurcations", "10.11948/20220241"],
  ["bai2023inference", "10.1016/j.cam.2022.114809"],
  ["guo2023envelope", "10.1016/j.jmva.2023.105159"],
  ["liu2023likelihood", "10.1080/00949655.2023.2174543"],
  ["liu2023generalized", "10.1080/03610918.2021.1995753"],
  ["weng2023comparison", "10.3389/fpubh.2023.1127636"],
  ["bai2022reliability", "10.1016/j.cie.2022.107941"],
  ["zhao2022characterizing", "10.1371/journal.pcbi.1010281"],
  ["zhao2022non", "10.1016/j.jtbi.2022.111105"],
  ["wen2022heterogeneous", "10.1016/j.idm.2022.02.001"],
  ["bai2021statistical", "10.1016/j.cam.2020.113316"],
  ["zhu2021reliability", "10.1016/j.ress.2021.107595"],
  ["balakrishnan2021record", "10.1007/978-3-030-62900-7_1"],
  ["liu2020unexpected", "10.1016/j.onehlt.2020.100174"],
  ["ng2020accuracy", "10.1038/s41598-020-66987-7"],
];

function get(url) {
  return new Promise((res, rej) => {
    https
      .get(url, { headers: { "User-Agent": "dsh-cv-check/1.0 (mailto:mu.he@xjtlu.edu.cn)" } }, (r) => {
        let b = "";
        r.on("data", (c) => (b += c));
        r.on("end", () => res({ s: r.statusCode, b }));
      })
      .on("error", rej);
  });
}

(async () => {
  const out = {};
  for (const [key, doi] of entries) {
    try {
      const r = await get("https://api.crossref.org/works/" + encodeURIComponent(doi));
      if (r.s !== 200) { console.log(key, "HTTP", r.s); out[key] = null; await sleep(800); continue; }
      const w = JSON.parse(r.b).message;
      const authors = (w.author || []).map((a) => `${a.family}, ${a.given}`);
      out[key] = { title: w.title ? w.title[0].slice(0, 60) : "", authors };
      console.log("OK", key, "|", authors.join("; "));
      await sleep(800);
    } catch (e) {
      console.log("ERR", key, e.message);
      out[key] = null;
      await sleep(800);
    }
  }
  require("fs").writeFileSync("crossref-authors.json", JSON.stringify(out, null, 2));
})();
