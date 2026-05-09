# 10 Claims at the Frontier

An adversarial-validation research package and working primitive at the intersection of artificial intelligence, context engineering, computational neuroscience, and human cognition.

> **Headline finding** — Across ten "wild" hypotheses spanning memory, attention, architecture, metacognition, social cognition, consciousness, and learning: **0/10 came back VINDICATED. 0/10 came back cleanly REFUTED. All 10 landed in CONTESTED or SPLIT.** Strong forms systematically fail; weak forms systematically hold. The convergent pattern is the finding.

This repository ships two surfaces:

1. **The research** — ten ~2,500-word PhD-level dossiers + a cross-cutting synthesis + a curated 25-paper cross-package reading list. Each dossier was produced by a parallel adversarial research agent applying two analytical lenses from a roster (Karpathy, Joscha Bach, Hickey, Carmack, Bret Victor, Bryan Cantrill, Ayanokoji), with explicit steelman counterargument and verdict adjudication.

2. **The observatory** — a working Python primitive implementing the post-roundtable architecture: an append-only event log, pure-function views over the log, importance scoring, retrieval/generation confidence dissociation tracking, and a RULER-extending eval harness. Designed to be `pip install`-able and run against any agent loop.

```bash
pip install observatory
```

```python
from observatory import EventLog, view, importance

log = EventLog()
log.append({"role": "user", "content": "..."})
log.append({"role": "assistant", "content": "..."})

# Tier membership is a derived view, not a stored place
working_set = view(log, scorer=importance.recency_attention(), window=4096)
```

## Why this exists

Most "agent memory" libraries treat the context window as a sliding buffer with naive truncation. The 10-claim research surfaces a sharper finding: the _one_ place where active forgetting is empirically a capability lever (rather than a regulatory burden) is **agent context-window management**. But the right architecture isn't two-tier mutable storage — it's an **immutable event log with importance and confidence as pure functions over the log**. Tier membership is a query concern, not a storage concern.

The observatory is the minimum viable substrate for treating context that way. Importance scoring becomes a function you pass in. Different scorers can be A/B'd against the same historical log. Failure modes become deterministically replayable. The eval harness extends NVIDIA RULER with hygiene-aware metrics so the field has something to measure against.

## Repository layout

```
ai-brain-claims/
├── site/           # Astro + Tailwind + MDX site
│   ├── src/
│   └── public/
├── observatory/    # Python library (MIT)
│   ├── src/observatory/
│   └── tests/
├── eval/           # Benchmark fixtures + result JSON
│   ├── benchmarks/
│   ├── fixtures/
│   └── results/
└── content/        # 10 claim dossiers (single source of truth, MDX)
    └── claims/
```

## Read the research

If you have **10 minutes**: read `content/synthesis.mdx`. Verdict table, cross-cutting threads, engineering recommendations all in one place.

If you have **1 hour**: read the synthesis, then the executive summaries / verdicts of the 3-4 claims most relevant to your work.

If you have **3 hours**: read all 10 dossiers in order. Each is self-contained 1,800-2,500 words with citations.

If you want to **verify the verdicts yourself**: each dossier has a "Papers to Read" section with 5-10 primary sources. The README at `/content/reading-list.md` curates the 25 most load-bearing primary sources across the package.

## Run the observatory

```bash
cd observatory/
pip install -e .
pytest                                  # run library tests
python -m observatory.eval baseline     # run baseline RULER eval
python -m observatory.eval ach          # run hygiene-aware eval
python scripts/compare.py               # compute deltas, generate result JSON
```

Result JSON in `eval/results/` is consumed by the site to render live comparison figures.

## Site

```bash
cd site/
npm install
npm run dev      # http://localhost:4321
npm run build    # static export to dist/
```

## Methodology (one paragraph)

Each of the 10 claims was deliberately formulated with a _strong form_ (theory-grade equivalence: "homologous", "spontaneous emergence", "phenomenally conscious", "the missing mechanism") and an implicit _weak form_ (the underlying engineering or algorithmic intuition). For each claim: 8-12 web searches across peer-reviewed neuroscience, ML conferences, and credible commentary; 4-6 supporting and 4-6 contradicting sources; two analytical lenses applied with attention to the persona's actual published positions; explicit steelman counterargument; verdict ∈ {VINDICATED, PLAUSIBLE, CONTESTED, REFUTED, UNFALSIFIABLE} with justification of what would change it.

The product/GTM angles (library, protocol, service, observatory) were stress-tested by a 4-persona roundtable (pg, carmack, taleb, hickey) in full mode (Round 1 + cross-examination + synthesis), then by 3 dedicated angle-research agents engaging the roundtable's KILL logic per angle. The architecture this repository ships (immutable log + pure-function views) is what survived all of that scrutiny.

## License

MIT — research, code, and prose. Cite the repository if you build on it.

## Citation

```bibtex
@misc{ai-brain-claims-2026,
  title  = {10 Claims at the Frontier: Adversarial Validation at the AI {\(\leftrightarrow\)} Brain Boundary},
  year   = {2026},
  url    = {https://github.com/abdul-abdi/ai-brain-claims},
  note   = {Methodology: parallel multi-agent adversarial validation with persona analytical lenses}
}
```

## Status

First ship: 2026-05-09. Active development. See [`STATUS.md`](./STATUS.md) for what's shipped vs. what's next.
