# Status

Last updated: 2026-05-10 — full first-class repo + GitHub Pages deploy + PyPI release pipeline.

## Live

- **Site**: https://abdul-abdi.github.io/ai-brain-claims/
- **Repo**: https://github.com/abdul-abdi/ai-brain-claims
- **Discussions**: https://github.com/abdul-abdi/ai-brain-claims/discussions
- **CI/CD**: GitHub Actions on every push to `main`; deploys to Pages on green

## Shipped

### Repo + governance

- [x] Public GitHub repo at `abdul-abdi/ai-brain-claims` with topics, homepage, MIT license
- [x] `README.md`, `LICENSE`, `CONTRIBUTING.md`, `STATUS.md`, `.gitignore`
- [x] Issue templates: contest-a-verdict, observatory-bug, scorer-or-benchmark + config (blank disabled, links to Discussions)
- [x] GitHub Discussions enabled
- [x] `scripts/sync-from-brain.sh` — mirrors brain dossiers into `site/src/content/drafts/`

### CI/CD

- [x] `.github/workflows/ci.yml` — three jobs:
  - **observatory** — pip install, pytest (22 cases), ruff, eval smoke test
  - **site** — npm ci, astro build (16 pages), pagefind index, upload artifact
  - **deploy** — GitHub Pages on push to main
- [x] `.github/workflows/release.yml` — PyPI Trusted Publisher on `observatory-v*` tag
- [x] CI green at HEAD; Pages serving HTTP 200 globally

### Site (Astro + Tailwind + MDX)

- [x] **16 static pages**: home, synthesis, observatory, reading-list, methodology, search, 10 claim dossiers
- [x] Anthropic-aesthetic design system: Source Serif 4 + Inter + JetBrains Mono, warm bone palette, 65ch reading width with sidenote gutter
- [x] Components: `BaseLayout`, `Nav` (responsive, horizontal-scroll fallback at narrow widths), `Footer`, `VerdictPill`, `ClaimCard`, `Sidenote`, `CompareFigure` (React island)
- [x] Pages:
  - `/` home — hero, headline finding, verdict-distribution strip, 10-claim grid, cross-cutting threads, observatory pitch with code preview, "how to read" 3-tier guide
  - `/synthesis` — verdict matrix, 5 recurring failure modes, threads, 8 engineering recommendations
  - `/observatory` — design narrative + **live CompareFigure** consuming the eval JSON
  - `/reading-list` — 25 curated primary sources, ★ load-bearing markers
  - `/methodology` — process documentation + honest caveats
  - `/search` — Pagefind UI with the warm-bone palette tones
  - `/claims/[slug]` — 10 dossiers with prev/next pager
- [x] All 10 claim MDX pages rendered with full body (1,595 lines, 80-95% of brain dossier word count)
- [x] **Pagefind search** wired (auto-builds index over all 16 pages)
- [x] **Sitemap** at `/sitemap.xml` (hand-rolled — `@astrojs/sitemap` 3.x has a known bug with our base-path config)
- [x] **robots.txt** with sitemap declaration
- [x] OpenGraph metadata in BaseLayout
- [x] Custom favicon (SVG)
- [x] Subpath-aware URLs via `u()` helper in `lib/site.ts` — works at `/ai-brain-claims/` on Pages and at `/` if moved to a custom domain (just remove the `base` config)
- [x] Mobile breakpoints: nav scrolls horizontally on narrow, hero typography scales, all reading layouts collapse cleanly to single column

### Observatory (Python lib, MIT)

- [x] PyPI distribution: `claim-observatory` (import name stays `observatory`)
- [x] `pyproject.toml` (hatchling, Python 3.10+, dev/eval extras)
- [x] **Wheel + sdist build cleanly** locally (`python -m build`)
- [x] `EventLog` — immutable append-only log with content-addressable IDs and `replay(at=...)`
- [x] `view()` + `compare()` — pure-function views; A/B-test scorers against the same log
- [x] `importance` — `recency()`, `role_priority()`, `task_relevance()`, `recency_attention()` composite default, `compose()` for arbitrary linear combinations
- [x] `confidence.dissociation()` — separate retrieval / generation confidence, `diverged()` and `overconfident_on_wrong()` checks
- [x] `eval` CLI — baseline / hygiene / compare; produces real result JSON
- [x] `cli` console entry point
- [x] **22 passing pytest cases**, ruff clean

### Eval

- [x] `eval/results/baseline-vs-hygiene.json` — real output, mirrored to `site/src/data/` for consumption by the site

## Next (incremental, not blocking)

### Observatory v0.2

- [ ] Real **NVIDIA RULER** integration — currently a placeholder accuracy; harness shape is right; needs task wiring
- [ ] `importance.attention_norm()` scorer for open-weights models
- [ ] Replay determinism property tests via Hypothesis
- [ ] Optional numpy-accelerated paths for >10K-event logs
- [ ] First PyPI release: tag `observatory-v0.1.0` after the one-time PyPI Trusted Publisher setup (instructions in `release.yml`)

### Site polish

- [ ] OG images per page (currently a 404 fallback) — `astro-og-canvas` or static SVG-to-PNG
- [ ] Sidenote component wired into 1-2 dossiers as exemplar (currently exists but unused)
- [ ] Real `@astrojs/sitemap` once the upstream bug is fixed
- [ ] Footer/header dark-mode toggle
- [ ] Better in-MDX figure components (verdict spectrum widget, bar comparisons)
- [ ] Bump GitHub Actions to Node 24 (deprecation warnings on Node 20 ahead of June 2026)

### Distribution

- [ ] Custom domain (CNAME via `gh repo edit --homepage` + DNS) once chosen
- [ ] Show HN / arXiv-companion-paper once v0.2 RULER eval has real numbers
- [ ] Citation file (`CITATION.cff`)

## Dev workflow

```bash
# Site
cd site
npm install              # first time only
npm run dev              # http://localhost:4321/ai-brain-claims/
npm run build            # static export to dist/

# Observatory
cd ../observatory
pip install -e ".[dev]"
pytest -q                # 22 passing
ruff check .
python -m observatory.eval compare --out ../eval/results

# Refresh the eval figure on the site
cp ../eval/results/baseline-vs-hygiene.json ../site/src/data/

# Push and CI takes care of the rest
git push                 # CI runs ~50s, deploys to Pages on green
```

## MDX gotchas

The MDX parser treats `<` followed by a letter, digit, or `.` as a JSX tag opener. Inline statistical notation breaks builds. Wrap in inline code:

- ❌ `For p<.001 we observed...`
- ✅ ``For `p<.001` we observed...``

Two such instances were caught and fixed during the first ship (claim-03 had `p<.001`, claim-05 had `p < 0.01`).

## PyPI publish (one-time setup the user must do)

PyPI Trusted Publishing requires a one-time configuration on the PyPI side. After that, tagging the repo (`git tag observatory-v0.1.0 && git push --tags`) auto-publishes via the workflow.

1. Create a PyPI account if needed.
2. Visit https://pypi.org/manage/account/publishing/
3. Add a new pending publisher with:
   - **PyPI Project Name**: `claim-observatory`
   - **Owner**: `abdul-abdi`
   - **Repository name**: `ai-brain-claims`
   - **Workflow name**: `release.yml`
   - **Environment name**: `pypi`
4. Tag the first release: `git tag observatory-v0.1.0 && git push --tags`
5. The release workflow runs, builds wheel + sdist, publishes via OIDC — no token needed.
