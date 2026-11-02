#!/usr/bin/env node
/**
 * prep-latex.js — copy a course LaTeX project to a scratch dir and make it pandoc-friendly.
 *
 * Usage:
 *   node prep-latex.js --src "D:\teaching\mth303\ch05_glm_mle\v5_Deviance与KL_29页" \
 *        --main main.tex --out "%TEMP%\mysrc"
 *
 * Copies every .tex plus images (.png/.jpg/.jpeg/.svg/.pdf) from the project's subdirectories,
 * rewrites the course's own macros into standard LaTeX, and neutralises constructs texmath
 * cannot parse. Then run pandoc *inside* <out>:
 *
 *   pandoc <main> -s --mathml --metadata title="…" -o "$env:TEMP\out.html"
 *
 * and post-process with build-page.js.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const args = {};
for (let i = 2; i < process.argv.length; i += 2) args[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
if (!args.src || !args.main) {
  console.error('usage: node prep-latex.js --src <project dir> --main <main.tex> [--out <workdir>]');
  process.exit(1);
}
const SRC = args.src;
const MAIN = args.main;
const WORK = args.out || path.join(os.tmpdir(), "latexsrc");

const IMG = [".png", ".jpg", ".jpeg", ".svg", ".gif"];

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else if (e.name.endsWith(".tex") || IMG.some((x) => e.name.toLowerCase().endsWith(x))) {
      fs.copyFileSync(s, d);
    }
  }
}

fs.rmSync(WORK, { recursive: true, force: true });
for (const e of fs.readdirSync(SRC, { withFileTypes: true })) {
  if (e.isDirectory()) copyTree(path.join(SRC, e.name), path.join(WORK, e.name));
}
fs.copyFileSync(path.join(SRC, MAIN), path.join(WORK, MAIN));

/** two-argument section macros: \sect{中文}{English} */
function expandTwoArg(t, cmd, repl) {
  const re = new RegExp("\\\\" + cmd + "\\s*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}\\s*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}", "g");
  return t.replace(re, repl);
}

function transform(text) {
  let t = text
    .replace(/\\renewcommand\{\\runninghead\}\{[^\n]*\}\s*/g, "")
    .replace(/\\thispagestyle\{[^}]*\}/g, "")
    .replace(/\\vspace\*?\{[^}]*\}/g, "")
    .replace(/\\rule\{[^}]*\}\{[^}]*\}/g, "");
  // course macros
  t = expandTwoArg(t, "sectstar", "\\section*{$1 $2}");
  t = expandTwoArg(t, "sect", "\\section{$1 $2}");
  t = expandTwoArg(t, "substar", "\\subsection*{$1 $2}");
  t = expandTwoArg(t, "sub", "\\subsection{$1 $2}");
  t = expandTwoArg(t, "subsub", "\\subsubsection{$1 $2}");
  t = t.replace(/\\chapterpage\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, "\\section{$1}")
       .replace(/\\slide\s*\{([^{}]*)\}/g, "\\\\emph{对应原课件 PDF 第 $1 页}")
       .replace(/\\z\{([^{}]*)\}/g, "$1")
       .replace(/\\en\{([^{}]*)\}/g, "$1")
       .replace(/\\zh\b\s*/g, "")
       .replace(/\\begin\{cn\}/g, "")
       .replace(/\\end\{cn\}/g, "");
  // texmath compatibility
  t = t.replace(/\\texorpdfstring\{([^{}]*)\}\{([^{}]*)\}/g, "$1")
       .replace(/\\hat\\(bb|bth|bmu|bX|bx|bxi|beps|bh|byh|by)(?![A-Za-z])/g, "\\hat{\\$1}")
       .replace(/\\widehat\\([A-Za-z]+)/g, "\\hat{\\$1}")
       .replace(/\\widehat\{/g, "\\hat{")
       .replace(/\\label\{[^}]*\}/g, "")
       .replace(/\\dbinom\b/g, "\\binom")
       .replace(/\\boxed\{/g, "{")
       .replace(/\\rm\b/g, "\\mathrm")
       .replace(/\\includegraphics(\[[^\]]*\])?\{([^}]*)\}/g, "INCLUDE_IMAGE:$2");
  return t;
}

let changed = 0, total = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".tex")) {
      total++;
      const before = fs.readFileSync(p, "utf8");
      const after = transform(before);
      if (after !== before) { fs.writeFileSync(p, after, "utf8"); changed++; }
    }
  }
}
walk(WORK);

const all = fs.readFileSync(path.join(WORK, MAIN), "utf8");
console.log(`workdir: ${WORK}`);
console.log(`tex files: ${total} (rewritten ${changed})`);
console.log(`sections: ${(all.match(/\\section\{/g) || []).length} | images: ${(all.match(/INCLUDE_IMAGE:/g) || []).length}`);
console.log(`now run pandoc inside ${WORK}, then build-page.js`);
