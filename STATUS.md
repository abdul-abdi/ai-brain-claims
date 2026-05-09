# Status

Last updated: 2026-05-09 (post first-ship + claim ports + live figure + methodology + reading list + clean build).

## Shipped

### Repo

- [x] `README.md` — research + observatory pitch + citation
- [x] `LICENSE` (MIT), `.gitignore`
- [x] `STATUS.md` (this file)
- [x] `scripts/sync-from-brain.sh` — mirrors brain dossiers to `site/src/content/drafts/`

### Site (Astro + Tailwind + MDX)

- [x] Build passes cleanly: `npm run build` → 15 static pages in 3.67s, pagefind index over all content
- [x] Design system: warm bone palette, Source Serif 4 + Inter + JetBrains Mono, 65ch reading width with sidenote gutter, restrained motion, accessible skip-link
- [x] Single source of truth files: `lib/site.ts`, `lib/verdicts.ts`, `lib/reading-list.ts`
- [x] Layout + components: `BaseLayout`, `Nav`, `Footer`, `VerdictPill`, `ClaimCard`, `Sidenote`, `CompareFigure` (React island)
- [x] Pages:
  - [x] `/` (home) — hero, headline finding, verdict-distribution strip, 10-claim grid, cross-cutting threads, observatory pitch with code preview, "how to read" 3-tier guide
  - [x] `/synthesis` — full meta-analysis with verdict matrix, five recurring failure modes, threads, 8 engineering recommendations
  - [x] `/observatory` — full design narrative + **live comparison figure** consuming the eval JSON
  - [x] `/reading-list` — 25 curated primary sources organized by thread, ★ load-bearing markers, citation-verification disclaimer
  - [x] `/methodology` — process documentation + honest caveats
  - [x] `/claims/[slug]` — dynamic route rendering all 10 dossiers
- [x] All 10 claim MDX pages (`claim-01` through `claim-10`) with valid frontmatter and full body content (~1,595 lines total, 80–95% of original brain dossier word count)
- [x] Pagefind search wired (auto-indexes content at build)
- [x] Claim-page pager (prev/next navigation)
- [x] OpenGraph metadata in BaseLayout
- [x] Favicon (custom SVG)

### Observatory (Python lib)

- [x] `pyproject.toml` (hatchling, Python 3.10+, optional `[dev]` and `[eval]` extras)
- [x] `EventLog` — immutable append-only log with content-addressable IDs and `replay(at=...)`
- [x] `view()` + `compare()` — pure-function views over the log; A/B-test-friendly
- [x] `importance` module — `recency()`, `role_priority()`, `task_relevance()`, `recency_attention()` (composite default), `compose()` for arbitrary linear combinations
- [x] `confidence` module — `dissociation()` and `Signal` with `diverged()` + `overconfident_on_wrong()` checks
- [x] `eval` module — CLI for baseline / hygiene / compare runs producing real result JSON
- [x] `cli` module — `observatory <command>` console entry
- [x] **22 passing pytest cases** across `test_log.py` (11) and `test_views.py` (11)
- [x] Sample eval result JSON in both `eval/results/` and `site/src/data/`

### Eval

- [x] `eval/results/baseline-vs-hygiene.json` — real output of `python -m observatory.eval compare`, mirrored to `site/src/data/` for consumption by the site

## Next (toward "strikingly amazing")

### Site polish

- [ ] Real OG image (`/public/og-default.png`) — currently a 404 fallback
- [ ] Search UI on a `/search` page using Pagefind's pre-built index
- [ ] Mobile breakpoints — desktop-first for now
- [ ] Sidenote integration into the claim MDX pages (component exists; not yet wired into the rendered prose)
- [ ] Better in-MDX figure components (verdict matrix, mini comparison cards)
- [ ] Re-add `@astrojs/sitemap` integration once a real domain is set (currently removed because sitemap crashed on the placeholder URL)
- [ ] Custom syntax highlighting tweaks for the Anthropic palette

### Observatory v0.2

- [ ] Real RULER integration — replace placeholder accuracies with measured ones (the harness is in place; only the task wiring is missing)
- [ ] `importance.attention_norm()` scorer — requires hooking into model attention; works on open-weights first
- [ ] Replay determinism property tests with hypothesis
- [ ] Optional `numpy` accelerated paths for large logs (>10K events)
- [ ] PyPI publish as soon as the canonical name is chosen (rename out of `observatory` if the slug is taken on PyPI)

### Distribution

- [ ] `gh repo create abdul-abdi/ai-brain-claims --public` (manual — needs your auth)
- [ ] Push initial scaffold + first ship
- [ ] Cloudflare Pages or GitHub Pages deployment with the real domain
- [ ] Show HN / Twitter / arXiv-companion-paper once the v0.2 RULER eval has real numbers

### Decisions still open

- [ ] **PyPI library name** — `observatory` is likely taken; candidates: `agent-observatory`, `ctx-observatory`, `claim-observatory`, `ach-observatory`. Rename in `pyproject.toml`, `__init__.py`, and the README/site code samples.
- [ ] **Site title / project brand** — working title is "10 Claims at the Frontier"; rename in `site/src/lib/site.ts` (single source of truth).
- [ ] **Domain** — working assumption is GitHub Pages at `<owner>.github.io/ai-brain-claims` for first ship; consider a custom domain at v1.

## Verification commands

```bash
# Run library tests
cd observatory
PYTHONPATH=src python -m pytest -q
# 22 passed

# Re-run the eval (writes JSON to ../eval/results/)
PYTHONPATH=src python -m observatory.eval compare --steps 50 --window 16 --out ../eval/results
# Then mirror into the site:
cp ../eval/results/baseline-vs-hygiene.json ../site/src/data/baseline-vs-hygiene.json

# Build the site
cd ../site
npm install         # first time only
npm run build       # → dist/, 15 pages, pagefind index
npm run dev         # http://localhost:4321
```

## MDX gotchas (for future content authors)

When writing claim MDX prose, the following patterns break the MDX parser and must be wrapped in backticks or escaped:

- `<` followed by a digit or `.` (e.g. `p<.001`, `<5%`, `<200ms`) — MDX tries to parse as JSX. Wrap in inline code: `` `p<.001` ``.
- `<` followed by a letter that doesn't form a valid HTML tag — same fix.
- Curly braces `{}` containing JS-like expressions in prose. Either escape (`\{`) or wrap in code.

Two such instances were caught and fixed in the first ship (claim-03 and claim-05 had `p<.001` / `p < 0.01` literals).
