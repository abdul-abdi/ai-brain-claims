# 10 Claims at the Frontier

**A showcase of what AI agents and persona-style analytical lenses can produce when given an open-ended research prompt and the freedom to run.**

The whole site, the dossiers, the verdicts, the roundtable that killed a product idea, the architecture that survived, and the multi-seed benchmark that measured it — all of it was produced in a single autonomous session by a swarm of 21 AI agents arguing through curated personas.

→ Live site: **https://abdul-abdi.github.io/ai-brain-claims/**
→ How it was made: **https://abdul-abdi.github.io/ai-brain-claims/agents/**
→ Paper: **https://abdul-abdi.github.io/ai-brain-claims/paper/**

## What's here

The session began with a deliberately wild prompt: generate ten ambitious hypotheses at the intersection of AI, context engineering, and the brain — make them strong enough to fail — research each with persona analytical lenses, and adjudicate verdicts. If anything looked like a real product, stress-test it. Build whatever survives.

What came back:

- **Ten ~2,500-word PhD-level dossiers**, one per hypothesis. Each: 4–6 supporting + 4–6 contradicting primary sources, two persona lenses (Karpathy, Joscha Bach, Hickey, Carmack, Bret Victor, Bryan Cantrill, Ayanokoji), a steelman, a verdict, and 5–10 papers to read.
- **Headline meta-finding**: across all 10 hypotheses, **0 verdicts returned VINDICATED, 0 returned cleanly REFUTED.** Every claim landed in CONTESTED or SPLIT. Strong forms systematically fail; weak forms systematically hold.
- **A 4-persona roundtable** (pg + carmack + taleb + hickey, full mode with cross-examination) that unanimously killed the proposed product architecture and pushed the agents toward a sharper one.
- **An observatory primitive** in Python — an immutable event log with importance and confidence as pure functions over the log — implementing the architecture that survived. 22 passing pytest cases.
- **A multi-seed needle-retention benchmark** (10 seeds × 5 strategies × 3 replays = 150 measurements) that tests three pre-registered hypotheses about the architecture. Real numbers, real error bars, embedded as a live figure on the site.
- **A 25-paper curated reading list** with verification status — six load-bearing arXiv citations re-fetched and confirmed; two had attribution corrections (the Granier & Senn 2025 paper title was wrong; "Persona Vectors" is by Chen et al., not "Anthropic" wholesale).

## What "persona" means here

Throughout the dossiers and the roundtable you'll see seven recurring names — Karpathy, Joscha Bach, Hickey, Carmack, Bret Victor, Bryan Cantrill, Ayanokoji — plus pg and Taleb on the roundtable. These are **analytical lenses**, not endorsements. Each is a curated profile (published positions, pet questions, characteristic objections, vocabulary) that an agent loads when arguing from that lens. "Think rigorously" is a vague instruction; "think the way Hickey thinks about state" is much sharper.

For each claim, two lenses are picked deliberately to surface different blind spots — Joscha Bach + Bryan Cantrill on architecture (functionalist + systems-realist; convergence is informative), Hickey + Karpathy on memory (information model + ML internals). Read the **[How it was made](https://abdul-abdi.github.io/ai-brain-claims/agents/)** page for the full pipeline and persona roster.

## Reproduce the benchmark

```bash
git clone https://github.com/abdul-abdi/ai-brain-claims
cd ai-brain-claims/observatory
pip install -e ".[dev]"
pytest -q                                          # 22 passing

cd ..
PYTHONPATH=observatory/src \
    python -m eval.benchmarks.needle_retention --seeds 10
```

You should see, byte-identically (deterministic seeds):

```
strategy                      mean    ± std   replay
-------------------------  -------  -------  -------
truncation                   27.5%  ± 11.5%     100%
recency                      27.5%  ± 11.5%     100%
recency+role                 21.2%  ± 11.9%     100%
task_relevance               65.0%  ± 15.4%     100%
needle_aware (oracle)       100.0%  ±  0.0%     100%
```

The query-anchored `task_relevance` scorer — which has **no privileged knowledge of the "needle" role** — achieves 2.4× the retention of naive truncation. The composite `recency+role` scorer underperforms truncation because the default role-priority table doesn't include the "needle" role and so actively deprioritizes it — a real failure mode of imperfect importance signals that the architecture surfaces cleanly.

## Install the observatory

```bash
pip install claim-observatory
```

```python
from observatory import EventLog, view, importance, confidence

log = EventLog()
log.append({"role": "user", "content": "..."})
log.append({"role": "assistant", "content": "..."})

working = view(log, scorer=importance.recency_attention(), window=4096)

alt = view(log, scorer=importance.task_relevance(query="..."), window=4096)
```

## Repository layout

```
ai-brain-claims/
├── site/           Astro + Tailwind + MDX site
├── observatory/    Python lib (MIT) — the architectural primitive
├── eval/           benchmark scripts + result JSON
└── content/        10 claim dossiers (single source of truth, MDX)
```

## Read the research

| Time    | Read                                                                    |
| ------- | ----------------------------------------------------------------------- |
| 5 min   | [How it was made](https://abdul-abdi.github.io/ai-brain-claims/agents/) |
| 15 min  | [The paper](https://abdul-abdi.github.io/ai-brain-claims/paper/)        |
| 1 hour  | The synthesis + the 3-4 claims most relevant to your work               |
| 3 hours | All 10 dossiers + the curated reading list                              |

## License & cite

MIT throughout (research, code, prose).

```bibtex
@misc{abdi-ai-brain-claims-2026,
  author       = {Abdi, Abdullahi},
  title        = {10 Claims at the Frontier: Adversarial Validation at the AI ↔ Context ↔ Brain Boundary, with a Measured Architectural Primitive},
  year         = {2026},
  howpublished = {GitHub repository},
  url          = {https://github.com/abdul-abdi/ai-brain-claims},
  note         = {v0.1 ship 2026-05-09. Methodology: 21 parallel AI agents with persona analytical lenses; observatory primitive at observatory/.}
}
```
