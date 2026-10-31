---
name: course-notes-to-web
description: Turn course material (LaTeX/Quarto/PDF) into a styled bilingual HTML page on the hemu0626.github.io site, matching the existing MTH303 note pages. Use when the user asks to "put this chapter/handout on the website", add a teaching-notes page for a course, or update an existing notes page after the source .tex/.qmd changed.
---

# Course notes → styled HTML page (this site)

Produce one self-contained HTML page under `assets/teaching/<course>-<topic>/`, list it on the
course's `_teachings/<course>.md` page, push to `main`, then verify live.

Canonical examples already deployed (copy their look, not their content):

| Page | Source (as of 2026-10-31) |
| --- | --- |
| `assets/teaching/mth303-ch3-notes/ch3-notes.html` | `D:\teaching\mth303\ch03_multiple_linear_regression\v1_模型选择补充\MTH303_Ch3_MLR_Teaching_Notes.tex` + `MTH303_Ch3_Hat_Matrix_Handout.tex` |
| `assets/teaching/mth303-model-selection/criteria.html` | `D:\teaching\MTH303_Criteria_Origins.pdf` (hand-authored page, no LaTeX source) |
| `assets/teaching/mth303-glm-notes/ch4-glm-notes.html` | `D:\teaching\mth303\ch04_glm_introduction\v1_中文讲义_31页\main.tex` + `parts/` |
| `assets/teaching/mth303-link-chain/links.html` | `D:\teaching\mth303\ch04_glm_introduction\v4_参数关系链_21页\main.tex` |
| `assets/teaching/mth303-ch5-glm-mle/mle.html` | `D:\teaching\mth303\ch05_glm_mle\v1_中文讲义_22页\ch5_main.tex` + `parts5/` |
| `assets/teaching/mth303-family-reference/families.html` | `D:\teaching\mth303\ch04_glm_introduction\v2_补篇_九模型对照_11页\supp_main.tex` + `parts_supp/` |
| `assets/teaching/mth303-deviance-scratch/scratch.html` | `D:\teaching\mth303\ch05_glm_mle\v2_偏差与手算_9页\dev_main.tex` + `parts_dev/` |
| `assets/teaching/mth303-cross-validation/MTH303_Cross_Validation.html` | `D:\teaching\mth303\ch03_multiple_linear_regression\v3_交叉验证\MTH303_Cross_Validation.qmd` |

**The course source tree gets reorganised by the user.** Before any rebuild, read
`D:\teaching\mth303\00_INDEX.md` (per-chapter layout `chNN_*/vN_*/`) and re-locate the source.
Never assume an old path.

## 1. Decide the input type

| Source | Pipeline |
| --- | --- |
| `.tex` with `\input{parts/...}` | copy `parts*/` + main `.tex` into a temp dir, preprocess, `pandoc --mathml` |
| `.tex` single file | preprocess, `pandoc --mathml` |
| `.qmd` already rendered to HTML | take the rendered HTML, strip its own `<style>`, wrap with the shared style |
| `.pdf` only | extract text (pypdf is installed: `python -c "from pypdf import PdfReader; ..."`), then **hand-author** the page; math must be rebuilt manually. Never trust auto-extracted formulas. |

## 2. Preprocess LaTeX before pandoc

Pandoc is at `C:\Users\Mu He\AppData\Local\Pandoc\pandoc.exe`. Run it **with the working directory set
to the temp source dir**, otherwise `\input{parts/x}` fails and you get a 4 KB output.

Required substitutions (each one caused a real failure before):

```js
// expand the course's own section macros (note: replacement strings need ONE backslash)
two("sectstar", "\\section*{$1 $2}");   two("sect", "\\section{$1 $2}");
two("substar",  "\\subsection*{$1 $2}"); two("sub",  "\\subsection{$1 $2}");
tex.replace(/\\z\{([^{}]*)\}/g, "$1").replace(/\\zh\b\s*/g, "");   // Chinese-wrapping macros

tex.replace(/\\texorpdfstring\{([^{}]*)\}\{([^{}]*)\}/g, "$1")     // headings
   .replace(/\\hat\\(bb|bth|bmu|bX|bx|bxi|beps|bh|byh)\b/g, "\\hat{\\$1}") // \hat\bb → \hat{\bb}
   .replace(/\\label\{[^}]*\}/g, "")                               // \label inside math breaks texmath
   .replace(/\\dbinom\b/g, "\\binom")
   .replace(/\\boxed\{/g, "{")
   .replace(/\\includegraphics(\[[^\]]*\])?\{([^}]*)\}/g, "INCLUDE_IMAGE:$2")
   .replace(/\\lstset\{[^}]*\}/g, "")
   .replace(/\\rm\b/g, "\\mathrm");                                 // \rm in subscripts is fatal
```

Keep `\newcommand` definitions untouched (protect them with placeholders if a global replace could
rewrite the macro name itself). `\bm` is fine to leave; only `\hat\bm` needs bracing.

Check the warning count — target **0**:

```powershell
& $pandoc $main -s --mathml --metadata title="…" -o "$env:TEMP\out.html" 2>&1 | Out-File $log
Select-String $log -Pattern "Could not convert" | Measure-Object
```

Any remainder is usually `\hat\boldsymbol{…}` or a `\begin{equation}` nested in math: fix in the source
copy, do not hand-patch the HTML unless it is one or two isolated spots.

## 3. Post-process with the shared script

```powershell
node .skills/course-notes-to-web/scripts/build-page.js `
  --input  "$env:TEMP\out.html" `
  --output "$env:TEMP\final.html" `
  --title  "Chapter 5: GLM MLE" `
  --subtitle "广义线性模型：极大似然估计与偏差" `
  --kind   math
```

It performs, in order: strip pandoc `<style>`; split `stepbox/keybox/warnbox/boardbox` panels into
`.box-title` + `.box-body`; neutralise `[eq:…]`/`??` cross references; convert leftover raw-TeX
`<span class="math">` into plain text; wrap tables in `.table-wrap`; inject
`assets/page-style.css`; add the left TOC (built from `h1/h2` by a few lines of JS), the
`← MTH303` back link and the AI note footer. Review `--title`/`--subtitle`/back-link per course.

## 4. Publish

```powershell
New-Item -ItemType Directory -Force "assets\teaching\<course>-<topic>" | Out-Null
Copy-Item "$env:TEMP\final.html" "assets\teaching\<course>-<topic>\<page>.html" -Force
```

Add one line to the course page `_teachings/<course>.md` (needs `linkable: true` in its front matter):

```markdown
- [Chapter 5: GLM MLE](/assets/teaching/<course>-<topic>/<page>.html)
```

Keep the bullets in teaching order (Ch3 → model selection → Ch4 → links → Ch5 → family reference →
worked example → cross-validation for MTH303). English titles on the course page unless the user asks
otherwise.

Commit + push (see AGENTS.md §6; the sandbox needs a one-shot `danger-full-access` for `git add`
of a new directory and for `.git/index.lock`). Then verify after ~2–4 min with node https — check
status 200, `h1`/`h2` counts, `<math>` count, `class="box-title"` count, `id="toc-list"`, and that the
course page contains the new link.

## 5. Gotchas that already bit us

- **UTF-8 without BOM** everywhere; a BOM in `_teachings/*.md` silently drops the whole page.
- `$env:TEMP` in PowerShell is **not** `os.tmpdir()` in Node in this harness — Node writes to
  `%TEMP%\dsh-XXXXXX\`. Resolve the real path (newest `dsh-*` dir) before copying files out.
- Escaped replacement strings: `"\\\\section"` produces a literal `\\section` (LaTeX line break) and
  the document silently loses all headings. Use `"\\section"`.
- Panels are a single `<p>` containing the title `<span>` plus the body — CSS that colours
  `.box > p:first-child` paints the whole box. Always split title/body.
- Do not colour the panel background; the approved look is white + 5 px coloured left border +
  coloured bold title + thin rule.
- Two pushes within a couple of minutes can race and publish the older build; make one push.
- No PDFs on the page (user removed download links): HTML only.
- Footer AI note is mandatory: "generated by DeepSeek 4.1 Flash" + a Chinese line.

## 6. After publishing

Update the inventory table in `AGENTS.md` §9 (page ↔ source ↔ date) and append a line to its
changelog. If the source lives in the course tree, note in `AGENTS.md` which `chNN/vN` folder it came
from — the user reorganises that tree periodically.
