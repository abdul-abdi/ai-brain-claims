---
title: "AI ↔ Context ↔ Brain: 10-Claim Adversarial Research Package"
type: research-index
tags: [ai, brain, cognition, neuroai, context-engineering, index]
created: 2026-05-09
status: complete
---

# AI ↔ Context ↔ Brain: 10-Claim Adversarial Research Package

A multi-disciplinary research exercise generating, stress-testing, and adjudicating ten ambitious hypotheses at the intersection of artificial intelligence, context engineering, computational neuroscience, and human cognition.

**Methodology**: Each claim formulated with a strong form (theory-grade equivalence) and an implicit weak form. Adversarial validation per claim: literature search (8-12 sources), two analytical lenses from the persona roster, explicit steelman counterargument, verdict ∈ {VINDICATED, PLAUSIBLE, CONTESTED, REFUTED, UNFALSIFIABLE}, 5-10 papers to read.

**Headline finding**: Across all 10 claims, **0 came back VINDICATED, 0 came back cleanly REFUTED. All 10 landed in CONTESTED or SPLIT** — strong forms systematically fail, weak forms systematically hold. See `synthesis.md` for the full meta-analysis.

---

## Verdict Table

| #                                               | Claim                                 | Strong Form                      | Weak Form                                    | Personas                     |
| ----------------------------------------------- | ------------------------------------- | -------------------------------- | -------------------------------------------- | ---------------------------- |
| [01](claim-01-magical-number-seven.md)          | Magical Number Seven for LLMs         | ❌ Refuted                       | ✅ Supported                                 | Karpathy + Joscha Bach       |
| [02](claim-02-thalamic-cortical-equivalence.md) | Thalamic-Cortical Equivalence         | ❌ Refuted                       | ✅ Supported                                 | Joscha Bach + Bryan Cantrill |
| [03](claim-03-persona-state-differentiation.md) | Persona-Induced State Differentiation | ⚠️ Undemonstrated                | ✅ Supported                                 | Karpathy + Ayanokoji         |
| [04](claim-04-emergent-metacognition.md)        | Emergent Metacognition Threshold      | ❌ Refuted                       | ⚠️ Partial                                   | Joscha Bach + Hickey         |
| [05](claim-05-rag-tip-of-tongue.md)             | RAG Tip-of-the-Tongue                 | ❌ Refuted (mechanism inversion) | ✅ Supported                                 | Hickey + Karpathy            |
| [06](claim-06-cot-phenomenology.md)             | Chain-of-Thought Phenomenology        | 🔮 Unfalsifiable                 | ⚠️ Partial                                   | Joscha Bach + Bret Victor    |
| [07](claim-07-spontaneous-tom.md)               | Spontaneous ToM in Multi-Agent Loops  | ❌ Refuted (structural)          | ⚠️ Confounded                                | Karpathy + Carmack           |
| [08](claim-08-sleep-consolidation.md)           | Sleep-Consolidation Is Missing        | 🔮 Partially unfalsifiable       | ✅ Supported                                 | Joscha Bach + Carmack        |
| [09](claim-09-active-forgetting.md)             | Active Forgetting as Capability       | ⚠️ Mostly unsupported (post-hoc) | ✅ Supported (regularization, agent context) | Hickey + Karpathy            |
| [10](claim-10-cortical-column.md)               | Cortical Column ≈ Transformer Block   | ❌ Refuted                       | ✅ Supported (with caveats)                  | Joscha Bach + Bryan Cantrill |

Legend: ✅ Supported · ⚠️ Partial / Undemonstrated · ❌ Refuted · 🔮 Unfalsifiable

---

## How to Read This Package

**If you have 10 minutes**: Read `synthesis.md`. The verdict table, cross-cutting threads, and engineering recommendations are there.

**If you have 1 hour**: Read `synthesis.md`, then the executive summaries / verdicts of the 3-4 claims most relevant to your current work (memory: 1, 5, 8, 9; architecture: 2, 10; introspection: 4, 6; social: 3, 7).

**If you have 3 hours**: Read all 10 dossiers in order. Each is self-contained 1800-2500 words with citations.

**If you want to verify the verdicts yourself**: Each dossier's "Papers to Read" section gives you 5-10 primary sources per claim. Start with the curated cross-package reading list below.

---

## Curated Cross-Package Reading List

The 25 most load-bearing primary sources across all 10 dossiers, organized by thread. Read these and you'll have ground-truth on the empirical state of every claim.

### Memory & Context (Claims 1, 5, 8, 9)

1. **Miller (1956)** — "The Magical Number Seven, Plus or Minus Two." _Psychological Review_ 63(2). The original. Read before believing any 7±2 LLM analogy.
2. **Cowan (2001)** — "The magical number 4 in short-term memory." _BBS_ 24. The revision. 4±1 is the better human number when chunking is controlled for.
3. **Liu et al. (2023)** — "Lost in the Middle: How Language Models Use Long Contexts." arXiv:2307.03172. The positional U-curve.
4. **Hsieh et al. (2024)** — "RULER: What's the Real Context Size of Your Long-Context Language Models?" arXiv:2404.06654. Multi-needle benchmark; effective vs. nominal context.
5. **Kuratov et al. (2024)** — "BABILong: Testing the Limits of LLMs with Long Context Reasoning-in-a-Haystack." arXiv:2406.10149. 10-20% effective utilization finding.
6. **McClelland, McNaughton & O'Reilly (1995)** — "Why there are complementary learning systems in the hippocampus and neocortex." _Psychological Review_ 102. The CLS framework still the best architectural recipe.
7. **Diekelmann & Born (2010)** — "The memory function of sleep." _Nature Reviews Neuroscience_ 11. Two-phase consolidation evidence.
8. **van de Ven, Siegelmann & Tolias (2020)** — "Brain-inspired replay for continual learning with artificial neural networks." _Nature Communications_ 11. State-of-the-art neuro-inspired continual learning.
9. **Brown & McNeill (1966)** — "The 'Tip of the Tongue' Phenomenon." _J. Verbal Learning & Verbal Behavior_ 5. The original TOT paper. Form/content separation is the load-bearing distinction.
10. **Bourtoule et al. (2021)** — "Machine Unlearning." _IEEE S&P_. The starting point for unlearning literature.

### Architecture & Computation (Claims 2, 10)

11. **Vaswani et al. (2017)** — "Attention Is All You Need." arXiv:1706.03762. Required reading.
12. **Ramsauer et al. (2020)** — "Hopfield Networks Is All You Need." arXiv:2008.02217. **Modern Hopfield = attention.** The strongest formal brain-AI bridge.
13. **Granier & Senn (2025)** — "From Cortico-Thalamic Circuits to Linear Attention." arxiv:2504.06354. Rigorous mathematical mapping. The newest most-important brain-AI paper in this package.
14. **Horton & Adams (2005)** — "The cortical column: a structure without a function." _Phil. Trans. R. Soc. B_ 360. The skeptical paper. Read before any "column ≈ block" analogy.
15. **Sherman & Guillery (1998)** — "On the actions that one nerve cell can have on another: distinguishing 'drivers' from 'modulators.'" _PNAS_ 95. The driver/modulator asymmetry that breaks symmetric attention QKV homology.
16. **Bastos et al. (2012)** — "Canonical Microcircuits for Predictive Coding." _Neuron_ 76. The canonical microcircuit account; closer to residual stream than to attention.

### Metacognition & Self-Model (Claims 4, 6)

17. **Kadavath et al. (2022)** — "Language Models (Mostly) Know What They Know." arXiv:2207.05221. Foundational behavioral metacognition paper.
18. **Schaeffer, Miranda & Koyejo (2023)** — "Are Emergent Abilities of Large Language Models a Mirage?" NeurIPS 2023. The metric-artifact paper. **Read this before believing any phase-transition claim.**
19. **Burns et al. (2022)** — "Discovering Latent Knowledge in Language Models Without Supervision." arXiv:2212.03827. CCS, mechanistic introspection.
20. **Huang et al. (2024)** — "Large Language Models Cannot Self-Correct Reasoning Yet." ICLR 2024. The self-correction limit.
21. **Butlin, Long, Chalmers et al. (2023)** — "Consciousness in Artificial Intelligence: Insights from the Science of Consciousness." arXiv:2308.08708. The major paper applying multiple consciousness theories to LLMs.
22. **Albantakis et al. (2023)** — "Integrated information theory (IIT) 4.0: Formulating the properties of phenomenal existence in physics, computation, and biology." PMC10581496. IIT 4.0 — predicts near-zero Φ for transformers.

### Social & Identity (Claims 3, 7)

23. **Serapio-García et al. (2023)** — "Personality Traits in Large Language Models." arXiv:2307.00184. Reliable psychometric measurement.
24. **Anthropic — Persona Vectors (2025)** — arxiv:2507.21509. Mechanistic confirmation that traits are causal linear directions in activation space.
25. **Ullman (2023)** — "Large Language Models Fail on Trivial Alterations to Theory-of-Mind Tasks." arXiv:2302.08399. The adversarial-perturbation critique. Required counter-reading to Kosinski 2023.

---

## Open Experiments

Each dossier surfaced a precisely-specified missing experiment. The 8 most decisive (collated in `synthesis.md`):

1. Controlled N-back sweep, N ∈ {2,4,6,8,10,12}, position held constant (claim 1)
2. RAG confusion-matrix vs. embedding distance (claim 5)
3. Frozen-base × interaction-rounds × Ullman-perturbed ToMi (claim 7)
4. CFA on persona behavioral outputs vs. human Big Five state model (claim 3)
5. Replay-augmented continual fine-tuning vs. joint-training upper bound (claim 8)
6. CCS/concept-injection generalization to Ullman-perturbed metacognitive tasks (claim 4)
7. CoT faithfulness intervention study (claim 6)
8. Empirical test of Granier & Senn cortico-thalamic ↔ linear-attention mapping (claim 2)

---

## Engineering Recommendations (8-point summary from `synthesis.md`)

1. Architect for ~4-8 reliably-tracked entities regardless of nominal context window
2. Track retrieval-confidence and generation-confidence as separate signals
3. Don't trust intrinsic self-correction; close monitoring loops with external verifiers
4. Build active forgetting into context-management pipelines
5. Implement CLS-inspired dual-store with replay; explore REM-analog generative recomposition
6. Design multi-agent loops to elicit pretraining-derived ToM, not generate new capability
7. Persona safety analysis must cover both semantic and activation-space pathways
8. Use neuroscience as inspiration for new architectures, not as validation of current ones

---

## Files

- `synthesis.md` — Cross-cutting meta-analysis (~3,500 words). Start here.
- `index.md` — This file. Navigation + curated reading list.
- `claim-01-magical-number-seven.md` through `claim-10-cortical-column.md` — Ten dossiers (~2,000-3,000 words each).

Total package: ~33,500 words.
