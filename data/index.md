# Claim-to-artifact map

Every load-bearing quantitative claim on the site, mapped to the file that proves it. If a claim cannot be mapped, it shouldn't be on the site.

## Counts

| Claim on site                                   | Verified by                                                                                        |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **21 parallel research dispatches**             | `data/manifests/pipeline.json`                                                                     |
| **10 claim dossiers**                           | `site/src/content/claims/claim-{01..10}.mdx`                                                       |
| **9 personas in roster**                        | `data/prompts/persona-lens-primers.md`                                                             |
| **8 roundtable agents (4 personas × 2 rounds)** | `data/prompts/roundtable-R1.md`, `data/prompts/roundtable-R2.md`, `data/transcripts/roundtable.md` |
| **3 idea-research agents (no personas)**        | `data/prompts/idea-research-prompts.md`                                                            |
| **3 angle-research agents (A/B/C)**             | `data/prompts/angle-research.md`, `data/transcripts/angle-{A,B,C,synthesis}.md`                    |
| **1 citation-verification agent**               | `data/prompts/citation-verification.md`, `data/verifications/citation-pass-1.json`                 |
| **1 design-pass agent**                         | `data/prompts/design-pass.md`                                                                      |

## Persona deployment counts

These numbers appear in the `/agents` deployment table. The source-of-truth lives in `site/src/lib/verdicts.ts` (the `CLAIMS` array) for the dossier counts, and `data/manifests/pipeline.json` for the roundtable + design-pass counts.

| Persona        | Site claims                     | Verified by                       |
| -------------- | ------------------------------- | --------------------------------- |
| Joscha Bach    | 6 (1, 2, 4, 6, 8, 10)           | `verdicts.ts` `CLAIMS[].personas` |
| Karpathy       | 5 (1, 3, 5, 7, 9)               | `verdicts.ts`                     |
| Hickey         | 3 dossiers + R1 + R2 = 5        | `verdicts.ts` + `pipeline.json`   |
| Carmack        | 2 dossiers + R1 + R2 = 4        | `verdicts.ts` + `pipeline.json`   |
| Bryan Cantrill | 2 (2, 10)                       | `verdicts.ts`                     |
| pg             | R1 + R2 = 2                     | `pipeline.json`                   |
| Taleb          | R1 + R2 = 2                     | `pipeline.json`                   |
| Bret Victor    | 1 (claim 6) + 1 design pass = 2 | `verdicts.ts` + `pipeline.json`   |
| Ayanokoji      | 1 (claim 3)                     | `verdicts.ts`                     |

## Verdict distribution

| Site claim                                                       | Verified by                                                     |
| ---------------------------------------------------------------- | --------------------------------------------------------------- |
| **0 VINDICATED**                                                 | `verdicts.ts` `CLAIMS[].verdict` (count of `"VINDICATED"` is 0) |
| **0 cleanly REFUTED**                                            | same source                                                     |
| **All 10 in CONTESTED or SPLIT**                                 | same source                                                     |
| **Verdict matrix layout** (4 threads × N verdicts, claim counts) | `verdicts.ts` `CLAIMS[].thread` + `[].verdict`                  |

## Benchmark results

| Site claim                                                     | Verified by                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Truncation: 27.5% ± 11.5%**                                  | `eval/results/needle-retention.json` `strategies[0]`           |
| **Recency: 27.5% ± 11.5%**                                     | `strategies[1]`                                                |
| **Recency+Role: 21.2% ± 11.9%** (underperforms baseline)       | `strategies[2]`                                                |
| **Task_relevance: 65.0% ± 15.4%**                              | `strategies[3]`                                                |
| **Needle_aware oracle: 100.0% ± 0.0%**                         | `strategies[4]`                                                |
| **Replay determinism: 100% across all 50 strategy×seed pairs** | `strategies[].replay_consistency` (all = 1.0)                  |
| **Reproduce command**                                          | `eval/benchmarks/needle_retention.py` (deterministic per seed) |

## Citation corrections

| Site claim                                                                                      | Verified by                                       |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Granier & Senn 2025 actual title is "Multihead self-attention in cortico-thalamic circuits"** | `data/verifications/citation-pass-1.json`         |
| **Butlin et al. 2023 — Chalmers is NOT an author; Bengio + Birch are**                          | `data/verifications/citation-pass-1.json`         |
| **"Persona Vectors" is by Chen, Arditi, Sleight, Evans, Lindsey (not "Anthropic" wholesale)**   | `data/verifications/citation-pass-1.json`         |
| **6 verified clean / 7 title-shorthand corrections / 0 not-found / 0 unverifiable**             | `data/verifications/citation-pass-1.json` summary |

## Architecture

| Site claim                                                 | Verified by                                                                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Immutable event log + pure-function views over the log** | `observatory/src/observatory/log.py`, `observatory/src/observatory/views.py`                                |
| **22 passing pytest cases**                                | `observatory/tests/test_log.py` (11) + `observatory/tests/test_views.py` (11)                               |
| **Deterministic replay**                                   | `observatory/src/observatory/log.py` `EventLog.replay()` + tested in `test_log.py:test_replay_at_step` etc. |
| **Library MIT-licensed, importable as `observatory`**      | `observatory/pyproject.toml` (PyPI dist name `claim-observatory`)                                           |

## What's NOT mapped

If you find a quantitative claim on the site that's not in this document, that's a bug — file an issue. The standard is: every number on the site should trace to a file in this repo.
