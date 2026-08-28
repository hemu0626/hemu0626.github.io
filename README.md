# hemu0626.github.io

Academic homepage of [Mu He](https://hemu0626.github.io), Assistant Professor in the School of Mathematics and Physics at Xi'an Jiaotong-Liverpool University (XJTLU). Built with [al-folio](https://github.com/alshedivat/al-folio) (Jekyll) and hosted on GitHub Pages.

## Repository structure

| Path | Purpose |
| --- | --- |
| `_config.yml` | Site-wide settings (name, contacts, features) |
| `_pages/` | Homepage (`about.md`), publications, projects, teaching, news, blog |
| `_bibliography/papers.bib` | Publications (add `selected = {true}` to feature a paper on the homepage) |
| `_news/` | News items shown on the homepage |
| `_posts/` | Blog posts |
| `_projects/` | Project cards |
| `_teachings/` | Courses |
| `_data/socials.yml` | Social links (email, Google Scholar, ORCID) |
| `assets/img/prof_pic.jpg` | Profile picture |

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the Jekyll site and publishes it to the `gh-pages` branch.

**One-time setup:** in the GitHub repo, go to *Settings → Pages* and set **Source** to *Deploy from a branch*, branch `gh-pages`, folder `/ (root)`.

## Local development (optional)

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

Requires Ruby 3.3+ and Bundler.
