<div align="center">

# Ten Claims at the Frontier
### *a working notebook · ten dossiers · one primitive that survived*

```
0 vindicated.  0 cleanly refuted.  10 in CONTESTED or SPLIT.
strong forms systematically fail.   weak forms systematically hold.
```

**[Live notebook ↗](https://abdul-abdi.github.io/ai-brain-claims/)** ·
[Paper ↗](https://abdul-abdi.github.io/ai-brain-claims/paper/) ·
[How it was made ↗](https://abdul-abdi.github.io/ai-brain-claims/agents/) ·
[Roundtable ↗](https://abdul-abdi.github.io/ai-brain-claims/roundtable/) ·
[Observatory ↗](https://abdul-abdi.github.io/ai-brain-claims/observatory/)

</div>

---

A single autonomous session. **21 parallel research dispatches**. Ten ambitious hypotheses at the seam between AI, context engineering, and the brain — strong enough to fail. The agents argued through nine analytical lenses (Karpathy, Joscha Bach, Hickey, Carmack, Bret Victor, Bryan Cantrill, Ayanokōji, pg, Taleb), staged a four-persona roundtable that killed the proposed product, then implemented and benchmarked the architecture that survived.

Nothing was hand-edited for the verdict.

## The headline

> The interesting object isn't the table of results — it's the **shape of the disagreement**.

| | What it landed on |
|---|---|
| **0 / 10** | strong forms vindicated |
| **0 / 10** | strong forms cleanly refuted |
| **10 / 10** | weak forms survived |
| **5 / 5 / 5** | five recurring failure modes · five threads · five engineering recommendations |
| **2.4×** | retention lift over naive truncation, no privileged role info |
| **100%** | replay determinism across all 50 (strategy × seed) pairs |

## What's in the box

- **Ten ~2,500-word PhD-level dossiers**, one per hypothesis. Each: 4–6 supporting and 4–6 contradicting primary sources, two persona lenses, an explicit steelman, a verdict, and 5–10 papers to read — every dossier is committed as MDX at `site/src/content/claims/`.
- **A 4-persona roundtable** that killed the proposed product. pg, Carmack, Taleb, Hickey — full persona-skill mode, two rounds with forced cross-examination. Hickey moved. The v1 that shipped is the position he moved to.
- **An observatory primitive**, in Python: an immutable event log with importance and confidence as pure functions over the log. **22 passing pytest cases.** The architecture that survived everything above.
- **A multi-seed benchmark** — 10 seeds × 5 strategies × 3 replays = 150 measurements — embedded as a live, scrubbable figure on the [Observatory page](https://abdul-abdi.github.io/ai-brain-claims/observatory/). Real numbers, real error bars, deterministic seeds.
- **A 25-paper curated reading list** with per-citation verification status. Six load-bearing arXiv papers were re-fetched on 2026-05-10; two had attribution corrections (the Granier & Senn 2025 paper title was wrong; "Persona Vectors" is by Chen et al., not Anthropic-wholesale). Every correction is recorded in place.
- **A live notebook**, with handles. Drag a numeral in the hero, the page rearranges. Hover a verdict cell, the persona-pair graph and the scatter answer. Reading is doing.

## On the word "persona"

These are **analytical lenses**, not endorsements. Each is a curated profile — published positions, pet questions, characteristic objections, vocabulary — that an agent *loads* when it argues from that lens. "Think rigorously" is vague; "think the way Hickey thinks about state" is sharp. For every claim, two lenses were chosen for **expected disagreement** — surfacing different blind spots.

The deployment was uneven and the [agents page](https://abdul-abdi.github.io/ai-brain-claims/agents/) is honest about it: Joscha Bach 6×, Karpathy 5×, Hickey 5×, Carmack 4×, the rest 1–2×. Only the eight roundtable agents and one design-pass loaded the **full persona skills** via the skill registry. The other twelve had prompt-level primers — research workers shaped by personas, not personas themselves.

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

Byte-identical output, deterministic seeds:

```
strategy                      mean    ± std   replay
-------------------------  -------  -------  -------
truncation                   27.5%  ± 11.5%     100%
recency                      27.5%  ± 11.5%     100%
recency+role                 21.2%  ± 11.9%     100%
task_relevance               65.0%  ± 15.4%     100%
needle_aware (oracle)       100.0%  ±  0.0%     100%
```

The `task_relevance` scorer — which has **no privileged knowledge of the "needle" role** — gets 2.4× the retention of naive truncation. The composite `recency+role` scorer falls **below** truncation because the default role-priority table doesn't include "needle" and so actively deprioritizes it. *Imperfect importance signals don't fail neutrally — they fail toward the wrong answer.* The pure-function architecture surfaces this cleanly: swap the scorer, replay the log, diff.

## Use the observatory

```python
from observatory import EventLog, view, importance, confidence

log = EventLog()
log.append({"role": "user", "content": "..."})
log.append({"role": "assistant", "content": "..."})
log.append({"role": "tool", "name": "search", "content": "..."})

# Working memory is a derived view, not stored state.
working = view(log, scorer=importance.recency_attention(), window=4096)

# Track retrieval and generation confidence separately —
# the dominant RAG failure mode is overconfidence on wrong context.
sig = confidence.dissociation(retrieval_score=0.92, generation_score=0.41)
if sig.diverged():
    log.append({"role": "verifier", "action": "re-query", "trigger": sig})

# A/B test scorers against the same log — replay-deterministic.
alt = view(log, scorer=importance.task_relevance(query="..."), window=4096)
delta = compare(working, alt)
```

```bash
pip install claim-observatory
```

## Repository layout

```
ai-brain-claims/
├── site/           Astro + MDX + React-island notebook  →  abdul-abdi.github.io/ai-brain-claims/
├── observatory/    Python lib (MIT) — the architectural primitive that survived the roundtable
├── eval/           benchmark scripts + result JSON (consumed by the live figures on the site)
└── data/           prompts, transcripts, verification outputs, pipeline manifest — every number traces here
```

## Read in 10 / 60 / 180 minutes

| time    | route                                                              |
| ------- | ------------------------------------------------------------------ |
| 10 min  | [Synthesis](https://abdul-abdi.github.io/ai-brain-claims/synthesis/) — the convergent pattern, five failure modes, eight recommendations |
| 1 hour  | Synthesis + the 3–4 [dossiers](https://abdul-abdi.github.io/ai-brain-claims/#claims) most relevant to your work + the [paper](https://abdul-abdi.github.io/ai-brain-claims/paper/) |
| 3 hours | All ten dossiers in order + the [reading list](https://abdul-abdi.github.io/ai-brain-claims/reading-list/) + the [observatory](https://abdul-abdi.github.io/ai-brain-claims/observatory/) |

## A note on what survives

Every dossier ends with **what would change its verdict**. The benchmark is reproducible from a single command. The reading list flags which citations were re-fetched and which were corrected.

We expect the verdicts to age. The repository is the unit of revision. **Disagree with a verdict — file an [issue](https://github.com/abdul-abdi/ai-brain-claims/issues/new/choose), there's a template.** Open a PR with a new importance scorer, a citation correction, or an additional persona lens.

## License & cite

MIT throughout (research, code, prose).

```bibtex
@misc{abdi-ai-brain-claims-2026,
  author       = {Abdi, Abdullahi},
  title        = {10 Claims at the Frontier: Adversarial Validation at the
                  AI \(\leftrightarrow\) Context \(\leftrightarrow\) Brain Boundary,
                  with a Measured Architectural Primitive},
  year         = {2026},
  howpublished = {GitHub repository},
  url          = {https://github.com/abdul-abdi/ai-brain-claims},
  note         = {v0.1 ship 2026-05-09.}
}
```

<sub>by **Abdullahi Abdi**, Nethermind · drafted by autonomous agents · curated, not authored</sub>
