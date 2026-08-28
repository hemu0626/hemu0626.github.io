# 站点维护指南（Mu He 个人主页）

> 本文档供**人**和**AI 助手**阅读，用于维护本仓库（个人学术主页）。
> 本文件被 `_config.yml` 的 `exclude` 排除，**不会出现在网页上**。
> 修改网站时，优先按本指南操作；改完后 push 到 `main` 即可，无需其他步骤。

## 1. 站点概况

- **线上地址**：<https://hemu0626.github.io>
- **技术栈**：al-folio v1.x（Jekyll 4 + 运行时 gem 化架构），GitHub Pages
- **部署链路**：push 到 `main` → GitHub Actions（`.github/workflows/deploy.yml`）自动构建 → 发布到 `gh-pages` 分支 → Pages 服务
- **生效时间**：push 后约 2–4 分钟（期间旧版本仍在服务）
- **Pages 配置**（已设置好，无需再动）：Settings → Pages → Source: Deploy from a branch → `gh-pages` / root；Actions 权限为 read & write
- **仓库地址**：`hemu0626/hemu0626.github.io`，默认分支 `main`

## 2. 目录结构

| 路径 | 作用 |
| --- | --- |
| `_config.yml` | 全站配置（姓名、联系、宽度、文献样式等）。改动影响全站 |
| `_pages/` | 页面：`about.md`（首页）、`publications.md`、`projects.md`、`teaching.md`、`students.md`、`cv.md`、`news.md`、`blog.md`、`404.md` |
| `_bibliography/papers.bib` | **全部论文**（BibTeX，jekyll-scholar 渲染） |
| `_projects/` | 项目卡片：`fyp.md` + 每年一个 `surf-YYYY-*.md` |
| `_teachings/` | 课程条目，每个"课程×学年"一个文件 |
| `_posts/` | 博客文章（`YYYY-MM-DD-slug.md`） |
| `_drafts/` | 隐藏的帖子（不构建、不删除）。要发布时移回 `_posts/` |
| `_news/` | 首页公告（`inline: true` 显示为一行） |
| `_data/socials.yml` | 邮箱、Google Scholar、ORCID |
| `assets/img/` | 头像 `prof_pic.jpg`、项目封面 `projects-*.svg`、海报缩略图 `surf-YYYY-thumb.jpg` |
| `assets/surf/` | **SURF 海报原图**（命名约定见 §5.5） |
| `_includes/courses.liquid` | 本地覆盖：课程列表渲染（不可点击、Sem 2 在前、Resources 最后） |

## 3. 常见修改任务（按任务查）

### 3.1 更新论文（最常见、最需谨慎）

1. 编辑 `_bibliography/papers.bib`，按现有条目格式添加：
   ```bibtex
   @article{<key>2026xxx,
     abbr         = {期刊缩写},
     bibtex_show  = {true},
     selected     = {true},          % 只有首页要 featured 的论文才加这行
     title        = {论文标题},
     author       = {Family, Given and Family2, Given2},
     journal      = {期刊全名},
     volume/pages/year/doi/url/publisher = {…}
   }
   ```
2. **作者名单必须用官方数据核对**（历史上出现过名字错误）：用 CrossRef API 按 DOI 查询：
   `https://api.crossref.org/works/<DOI>` → JSON 的 `message.author`（given/family）是权威全名。
3. **通讯作者标注**：在条目中加 `annotation = {*Corresponding author*}`（或 *Co-corresponding author* / *First author*），会以斜体显示在条目下。
4. **所有作者完整列出**，不要用 "and others"（`max_author_limit` 已设为空 = 全部显示）。
5. 首页展示规则：`selected = {true}` 的条目自动出现在首页 Selected Publications。
6. 专利条目用 `@misc` 类型，作者用 CV 中的缩写（如 `Zhao, S.`）。
7. 作者简历信息源头（本地）：`D:\Code\infor20260828\CV.txt`（不在仓库里）。

### 3.2 添加/修改课程（Teaching 页）

- 每个"课程×学年"一个文件，位于 `_teachings/`。模板：
  ```markdown
  ---
  layout: course
  title: MTHxxx 课程名
  description: 角色 · Semester N        # Module Leader / Co-instructor（可加 extra teaching load）
  instructor: Mu He
  year: 2025-26                          # 学年分组依据，格式 YYYY-YY
  term: Semester 1                       # Semester 1 / Semester 2 / Spring/Summer
  course_id: mthxxx-2025                 # 唯一 id
  ---

  <!-- TODO: add the course introduction here (paste from the official module page) -->
  ```
- 分组自动按学年倒序；组内 Semester 2 在前（`_includes/courses.liquid` 里控制）。
- 课程标题在列表页**不可点击**（有意为之）；简介填在第二个 `---` 之后（可留空）。
- `year: Resources` 的条目（Data Visualization 教学资源）固定排在最后。

### 3.3 添加新一年 SURF

1. `assets/surf/` 放入海报原图，命名 `<年份slug>.jpg|png|pdf`（slug 例：`2027-xxx`）。
2. `assets/img/` 生成 16:9 缩略图 `surf-2027-thumb.jpg`（约 640×360；可用 PowerShell System.Drawing 居中裁剪，或任意图片工具）。
3. 新建 `_projects/surf-2027-xxx.md`（复制上一年文件改 front matter：`img`、`title`、`description`、`importance` 按年份递增分配，最新年 importance 最小）。
4. 卡片自动出现在 Projects 页 SURF 网格（时间倒序、桌面每行 4 个）。

### 3.4 更新学生 / CV / 首页

- 学生：`_pages/students.md`（PhD 表 + Master 表，只写名字，**不要出现学号/ID**）。
- CV：`_pages/cv.md`（纯 Markdown 页面）。
- 首页简介、招募文案：`_pages/about.md`（正文在 front matter 之后；头像下的信息块已按需求移除，不要再加院系/办公室信息到首页）。

### 3.5 发博客 / 公告

- 博客：`_posts/YYYY-MM-DD-slug.md`，front matter：`layout: post`、`title`、`date`、`description`、`tags`、`thumbnail`（可选，指向 `assets/img/…`）。
- 隐藏帖子：移到 `_drafts/`（保留文件，不发布）。
- 公告：`_news/` 下新建文件，front matter：`layout: post`、`date`、`inline: true`、`related_posts: false`，正文一句话。

## 4. 页面与导航

- 导航 = 页面 front matter 中 `nav: true` + `nav_order`（1–7）。当前顺序：News(1)、Publications(2)、Projects(3)、Teaching(4)、Students(5)、CV(6)、Blog(7)。
- 页面标题（`title:`）**首字母大写**，导航直接显示该字段。
- Projects 页的网格布局由 `_pages/projects.md` 内嵌 `<style>` 控制（25% 宽卡片、1rem 间距、标题 1.15rem），FYP 独占第一行，SURF 自动换行。

## 5. 关键约定与历史坑（务必遵守）

1. **编码**：所有文本文件必须 **UTF-8 无 BOM**。
   - 用 PowerShell 写文件时：`[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding($false)))`。
   - 带 BOM 的文件会让 Jekyll 无法解析 front matter，**整批文件被静默丢弃**（曾导致 Teaching 页 16 个课程全部消失，构建不报错）。
2. **Liquid 陷阱**：空数组 `[]` 在 Liquid 中为**真值**（曾导致 Projects 页空白）。条件判断 `display_categories` 时注意。
3. **不要依赖 `row-cols-*` Bootstrap 类**：编译产物 CSS 中不存在这些类，布局会失控。网格样式写在页面内嵌 `<style>` 里（见 `_pages/projects.md`）。
4. **不要修改 gem 运行时文件**；但用户站点**可以本地覆盖** `_includes/`（先例：`_includes/courses.liquid`）。若升级 al-folio 版本，注意检查覆盖文件。
5. **`_config.yml`**：`max_width` 当前为 `1300px`（用户确认的宽度，历史改动 930→1300→min(1700px,94vw)→1300）。改动要谨慎，改回来用户会不满。
6. **部署失败排查**：GitHub 仓库 Actions 标签页看 `Deploy site` workflow 日志。历史失败案例：`actions/setup-python` 的 `cache: "pip"` 在仓库没有 `requirements.txt` 时报错（已修复：去掉该 cache 配置）。
7. **论文不出错**：作者名以 CrossRef 为准；DOI 不可凭空写；通讯作者按 CV 标注。
8. **隐私**：站点中不出现学生 ID、成绩数据文件（已清理过一次）。
9. **research-map（科研图谱）**：用户多次要求移除，目前**不放**在站点中。原图在 `D:\Code\infor20260828\MuHe_科研图谱.png`。不要重新添加，除非用户明确要求。
10. **宽度、卡片大小等视觉参数**是用户多轮迭代的结果，调整前先看本文档；改后要在线上验证。

## 6. 提交与验证流程

```powershell
git add -A
git commit -m "描述改动"
# 推送（若有 PAT；否则用户自己 push）
git -c credential.helper= push "https://x-access-token:<PAT>@github.com/hemu0626/hemu0626.github.io.git" main
```

- 临时脚本（`*.js` 等）**不要提交**；`.gitignore` 已忽略 `check-*.js`、`wait-*.js`、`read-*.js`、`*.gem`、token 文件。
- **验证**（约 2–4 分钟后）：用 node/https 抓取线上页面检查关键内容（本机 PowerShell 的 HTTPS 被环境拦截，用 git/node 的 TLS 栈）。示例：
  ```js
  node -e "const https=require('https');https.get({hostname:'hemu0626.github.io',path:'/teaching/',headers:{'User-Agent':'Mozilla/5.0'}},r=>{let b='';r.on('data',c=>b+=c);r.on('end',()=>console.log(r.statusCode,b.includes('MTH303')))})"
  ```
- 也可以直接看 GitHub Actions 的 workflow 是否绿色（`success`）。

## 7. GitHub 账号现状（2026-08 整理）

- 账号 `hemu0626` 共 30 个仓库：
  - **public（13）**：`hemu0626.github.io`（本主页，**唯一保持 public 的自有仓库**）+ 11 个 fork 他人仓库（cam-notes、ML_Notes、ng-video-lecture、pykan、RidgeVar、satpred、statsmodels、SurvNet、tutorial、UK_Biobank_GWAS、xaringan）+ `academicpages.github.io`（模板 fork，暂留 public）。
  - **private（17）**：其余全部（多数同时处于 archived 状态）。
- 旧站相关仓库（blog、modeling、Final-Year-Project、first_quarto、educ_stat）已**删除**，其内容已整合进本站（博客帖子在 `_posts/`，FYP/SURF 旧材料在 git 历史中）。
- 隐私/归档操作记录：34 个仓库曾全部 archive；11 个已设 private（操作方式：解档→设 private→重新归档）。
- **PAT**：历史操作曾使用全权限 classic PAT（push/归档/私有化）。token 用后应提醒用户吊销；仓库操作也可用 `GH_TOKEN` 环境变量 + GitHub REST API（node）。

## 8. 修改前 checklist（给 AI）

- [ ] 目标文件路径确认（§2 表格）
- [ ] 新文本文件用 UTF-8 无 BOM 写
- [ ] 涉及论文时用 CrossRef 核对作者
- [ ] 涉及视觉/布局时参考 §5 的历史结论
- [ ] 提交后等 2–4 分钟并用 §6 方式线上验证
- [ ] 不提交临时脚本、不把敏感信息写进仓库
