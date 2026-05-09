---
title: "Claim 01 — Magical Number Seven for LLMs"
type: research-claim
tags:
  [
    ai,
    brain,
    working-memory,
    miller,
    cowan,
    context-window,
    transformer-internals,
  ]
created: 2026-05-09
verdict: CONTESTED
personas: [karpathy, joscha-bach]
---

# Claim 01 — Magical Number Seven for LLMs

## The Claim

**Strong form:** Transformer LLMs exhibit a hard capacity limit of approximately 7±2 simultaneously-tracked "chunks" (entities, propositions, bound variables). Performance holds until this threshold, then degrades sharply — a cliff, not a slope. The number is close enough to Miller's human value to be non-coincidental, implying a shared architectural mechanism.

**Weak form:** LLM effective capacity for multi-item tracking is far below their nominal token count, scales sublinearly with context length, and shows sharper degradation than would be predicted by uniform access degradation. The _character_ of the bottleneck — small-integer chunk limit, non-uniform context utilization, qualitative not just quantitative failure — rhymes with Miller/Cowan even if the literal numbers differ.

**What must be true for the strong form:** A controlled sweep over N tracked items (entities, bound variables) must find a _threshold_ at ~7±2 after which performance drops discontinuously, and this number must be robust across model families, task types, and context lengths.

**What must be true for the weak form:** Effective working capacity must be demonstrably "small" relative to nominal, and performance curves must share the _character_ of human WM limits (bounded, sublinear, degradation under interference) — even if the inflection point isn't at 7.

---

## Evidence For

**1. Sublinear effective utilization in long-context benchmarks.**
BABILong (Kuratov et al., 2024; NeurIPS 2024 Datasets & Benchmarks Spotlight; arXiv:2406.10149) found that "popular LLMs effectively utilize only 10-20% of the context" even as nominal windows extend to millions of tokens. Performance "declines sharply with increased reasoning complexity." This is consistent with the weak form: effective chunk capacity is a tiny fraction of raw token capacity, analogous to the human situation where WM capacity (4±1) is radically smaller than long-term memory capacity.

**2. Multi-needle and variable-tracking failures in RULER.**
RULER (Hsieh et al., COLM 2024; arXiv:2404.06654) introduces Multi-Key NIAH (MK-NIAH) and Variable Tracking (VT) tasks. For MK-NIAH, increasing the number of distractor needles "steadily lowers performance, with Yi dropping by ~40 points at 256K in the extreme version." VT tasks (tracking variable assignments across multiple hops) show consistent degradation as hop count increases, with models "lacking ability to reliably trace the same entity within long context." This is the most direct behavioral evidence for something like a binding/tracking capacity limit, though the numerical threshold is _not_ measured as an inflection at 7. [Note: specific per-needle-count accuracy tables not directly confirmed; summary is from the RULER HTML, which is paraphrased — treat specific numbers as [unverified] pending full-paper read.]

**3. "Lost in the Middle" positional U-curve.**
Liu et al. (2023, TACL 2024; arXiv:2307.03172) showed that LLM performance on multi-document QA is highest when relevant information appears at the beginning or end of context, with significant degradation for information in the middle. While this is primarily a _positional_ artifact rather than a direct _count-based_ chunk limit, it demonstrates that LLMs cannot uniformly access all context items — a structure similar to the primacy/recency effects that motivated Cowan's (2001) revision of Miller. The paper is widely cited (~2000+ citations) as evidence that LLMs do not treat context as uniform RAM.

**4. Self-attention as the mechanistic source of working memory limits.**
Self-Attention Limits Working Memory Capacity (arXiv:2409.10715; NeurIPS 2024 Workshop) trained vanilla decoder-only transformers on N-back tasks and found "a significant logarithmic decline in test accuracy as N increases." The entropy of attention score matrices increases with N, with "dispersed attention scores" identified as the causal mechanism. The paper describes this as "reminiscent of the capacity limit of human working memory." This provides mechanistic grounding for WM-like limits, though — critically — the degradation is **continuous logarithmic decline**, not a threshold cliff at N=7.

**5. Entity-attribute binding as a bounded low-rank subspace.**
Feng & Steinhardt (2023; arXiv:2310.17191) showed that LLMs use a "Binding ID" mechanism — internal activations encode a low-rank subspace indexing which attributes belong to which entities. This is replicated by Prakash et al. (arXiv:2409.05448), which identifies a low-rank PCA structure in hidden states for 7-entity binding tasks. The bounded dimensionality of this binding subspace is a structural analog to Cowan's binding bottleneck — though neither paper explicitly measures the capacity limit or tests whether it degrades at 7 vs. 3 vs. 12 tracked items.

**6. Multi-hop reasoning fails beyond 1-2 hops.**
Yang et al. (ACL 2024; arXiv:2402.16837) found LLMs show "strong evidence for first-hop reasoning (>80% of prompts) but only moderate evidence for the second hop," with "a clear scaling trend for first-hop but not for the second hop." This is consistent with a limited binding stack — models can maintain one intermediate binding with high reliability but compound tracking degrades rapidly, echoing Cowan's 4±1 focus of attention model where multi-item bindings must compete for the same limited slots.

---

## Evidence Against

**1. Degradation is continuous, not threshold-based.**
The most directly relevant mechanistic study (2409.10715) explicitly reports _continuous logarithmic decline_ across N=1–6 in N-back tasks, with "no single critical threshold." Multi-layer/multi-head models achieve ">95% accuracy on all N-back tasks" while "still presenting slight declines as N increases." This directly contradicts the strong-form claim of a hard cliff at 7±2. If the degradation curve is a smooth log function, the "magical number" framing adds no explanatory power over the simpler "attention dispersion" account.

**2. "Lost in the Middle" is positional, not count-based.**
Liu et al. (2307.03172) describe a _U-shaped performance curve over position_, not a _capacity cliff over item count_. This is a positional/recency artifact, possibly caused by relative position encoding or attention sink effects, not a slot-based working memory limit. Conflating position-sensitivity with chunk-count limits is a common error in this literature. The claim requires a count-based bottleneck; positional artifacts don't demonstrate one.

**3. No published study directly tests the "7±2" specific threshold in LLMs.**
A systematic sweep over N tracked items (N=3,5,7,9,11) with everything else held constant, measuring whether accuracy inflects specifically near 7, has not been reported in any paper retrieved. The coincidence that Feng & Steinhardt (2310.17191) and Prakash et al. (2409.05448) use 7-entity-attribute pairs in their experimental setups is a _methodological choice_, not a _measured ceiling_. Treating it as evidence for the 7±2 claim is confirmation bias.

**4. Effective context capacity varies wildly across tasks and models.**
RULER (2404.06654) found that "only half of the models claiming 32K+ context maintain satisfactory performance at 32K." The Chroma "Context Rot" study (2026) found that some models begin degrading by 1,000 tokens while others sustain performance to 64K+. Paulsen (2025, [unverified full citation]) reportedly found effective context falls "up to 99% below advertised limits on complex tasks." This variance argues _against_ a universal small-integer chunk limit and in favor of task- and architecture-specific degradation patterns.

**5. The degradation mechanism is better explained by attention entropy and positional encoding than by Miller-style slots.**
Multiple papers point to attention score entropy dispersion (2409.10715), softmax crowding (reported in context-length scaling reviews), KV cache saturation, and positional under-training as the proximate causes of long-context degradation. These are continuous, architecture-dependent phenomena, not discrete slot exhaustion. Miller's model implies slots that are either occupied or not; the transformer evidence points to graded signal-to-noise degradation across all positions simultaneously.

**6. Scaling and fine-tuning improve entity tracking, undermining a universal constant.**
Kim & Schuster (ACL 2023; arXiv:2305.02363) found that while earlier GPT-3 models failed at entity tracking, GPT-3.5 models (code-pretrained) could perform non-trivial tracking. Code Pretraining Improves Entity Tracking (arXiv:2405.21068) extends this. If there were a hard architectural constant of 7±2, training distribution shifts shouldn't move it. That entity tracking improves with code pretraining argues the "limit" is a learned pattern, not a fixed architectural constant analogous to human WM.

---

## Active Debate

**1. Whether attention-entropy degradation is functionally equivalent to slot exhaustion.**
The 2024-2025 mechanistic interpretability literature (induction heads: Olsson et al., arXiv:2209.11895; retrieval heads: Wu et al. / DuoAttention, arXiv:2410.10819; binding IDs: Feng & Steinhardt, arXiv:2310.17191; Prakash et al., arXiv:2409.05448) is actively mapping which circuits implement context retrieval and binding. The unresolved question is whether the bounded dimensionality of binding subspaces implies a fixed capacity that would look like a Miller limit — or whether it's a continuous bottleneck that scales differently. No paper has directly adjudicated this.

**2. Whether "effective context" maps to "working memory" or to "signal-to-noise in retrieval."**
BABILong (2406.10149) and RULER (2404.06654) show effective utilization is far below nominal. But the debate is whether this is a _storage_ limit (Miller/Cowan framing) or a _retrieval_ limit (attention sinks, positional encoding artifacts, KV cache effects). If it's the latter, "working memory capacity" is the wrong framing entirely. This is actively discussed in the context-length scaling literature and in the Cognitive Workspace paper (arXiv:2508.13171, [unverified full text]).

---

## Lens 1: Karpathy

Karpathy's published framing — most explicitly in his "LLM OS" and LLM Wiki blog posts — treats the context window as RAM: finite, fast, addressable. He's deeply empirical about transformer mechanics and would approach this claim by demanding the _curve_, not the analogy.

He would note immediately that "Lost in the Middle" (Liu et al., 2307.03172) is a real and important finding, but it describes a _positional_ artifact — a U-shaped accuracy curve over token position — not a _count-based_ chunk ceiling. These are different failure modes. The first is about where in the context something lives; the second is about how many distinct items can be simultaneously held. Conflating them is sloppy.

For the N-back result (2409.10715), he'd want to see the actual learning curves, not just the Kruskal-Wallis p-value. Logarithmic decline across N=1 to N=6 is consistent with _any_ continuous bottleneck — attention score dispersion, gradient optimization difficulty, positional confusion — and doesn't require a slot-based account. He'd say: the Miller analogy is a narrative convenience, not a mechanistic claim.

The retrieval heads finding (DuoAttention, 2410.10819; building on Wu et al.) would genuinely interest him: if only 3-6% of attention heads are "retrieval heads" responsible for accessing arbitrary context positions, then the effective retrieval bandwidth is architecturally bounded, and that bound _could_ look like a small-integer capacity limit. He'd want to know: what's the cardinality of retrieval heads, and does it correlate with multi-item tracking accuracy? That experiment would be decisive for the weak form of this claim.

His bottom line, channeling his nanoGPT/micrograd pedagogical instinct: the context is RAM but it's RAM with a defective address bus. The defect is real and severe — effective capacity is a small fraction of nominal. But calling the defect "Miller's 7±2" buys you a narrative, not an explanation. The right question is: what's the architectural parameter that determines effective capacity, and can you engineer it higher? That's the tractable version of this hypothesis.

---

## Lens 2: Joscha Bach

Bach's computational consciousness framework treats cognitive limits not as magic constants but as _necessary features of any system that must maintain coherent representations in finite compute_. Working memory, in his view, is a focusing mechanism: a binding operation that holds a small active set of representations in a mutually consistent state, at the cost of excluding everything else. Miller's 7±2 isn't about the brain being "good at 7 things" — it's about the cost of maintaining binding coherence rising super-linearly with set size.

From this lens, the transformer question is: does the self-attention mechanism implement a coherence-maintenance operation, and does that operation have super-linear cost in the number of simultaneously bound items? The Binding ID subspace finding (Feng & Steinhardt, 2310.17191; Prakash et al., 2409.05448) is exactly what he'd look for — not slot-counts, but the _dimensionality structure_ of the binding representation. A low-rank binding subspace means the system has a finite dimensional "identity space" for tracking which attributes belong to which entities. When the number of simultaneously active bindings exceeds the effective rank, the system can no longer disambiguate, and confusion compounds.

Bach would accept the analogy at the _algorithmic_ (Marr Level 2) level: both human WM and transformer context have a binding bottleneck that limits the number of coherently tracked entity-attribute pairs. He would reject the analogy at the _implementational_ level: the mechanism in transformers (low-rank attention subspace over learned token positions) is entirely different from the mechanism in human WM (hippocampal-prefrontal binding, gamma-band synchrony, etc.). The character of the bottleneck — not the number, not the substrate — is what matters.

His deeper concern would be whether LLMs have any analog to the _active maintenance_ function of human WM. Human working memory doesn't just store items; it actively refreshes bindings against interference. Transformers have no such refresh loop in their forward pass — they compute attention once per token, statically. This means transformer "working memory" is closer to a single-shot soft lookup than an actively maintained coherent state. The degradation seen in entity tracking may therefore reflect not slot-exhaustion but the absence of iterative coherence maintenance. That would be a _structurally different_ failure mode than Miller's, even if the observable capacity numbers happen to rhyme.

---

## Strongest Counterargument (Steelman)

The steelman for the claim doesn't require literal 7±2. It requires only this: that in transformer LLMs, the relationship between "number of simultaneously-tracked items" and "performance" is concave and bounded at a small integer, and that this bound is architecturally deep (not task-specific or train-distribution-specific). The mechanistic interpretability evidence provides a coherent story: retrieval heads implement the "addressable slot" function (Wu et al., DuoAttention); the Binding ID subspace has bounded effective rank (Prakash et al.); attention score entropy rises super-linearly with N (2409.10715); and the observable consequence — effective utilization at 10-20% of nominal context across diverse benchmarks (BABILong, RULER, Context Rot) — maps precisely onto what you'd expect if the number of efficiently-addressable "chunks" in any context is small (call it 4-8). The claim doesn't need the number to be 7. It needs the mechanism to be structurally analogous — a fixed-capacity binding store, not a graded signal-noise degradation. The existing evidence is weak but consistent with this interpretation, and it will be resolved by experiments that directly test performance as a function of tracked-item count while controlling for positional effects. That experiment has not yet been run.

---

## Verdict

**CONTESTED**

The weak form of the claim — that LLMs have effective working capacity far below their nominal token count, scaling sublinearly, with degradation under multi-item tracking — is **well-supported** by multiple 2023-2024 benchmarks (BABILong: 10-20% effective utilization; RULER: performance drops at multi-needle and variable-tracking tasks; "Lost in the Middle": non-uniform access across context). This is real, important, and matters for agent system design.

The strong form — that the bottleneck is specifically at 7±2 chunks, produces a _threshold_ degradation, and shares mechanistic character with Miller's human WM model — is **unsupported by any directly-controlled study**. The closest mechanistic evidence (2409.10715 N-back results) explicitly reports _continuous logarithmic decline_, not a cliff at 7. The Binding ID and retrieval-head findings are structurally interesting but measure dimensionality and circuit organization, not capacity thresholds.

What would change the verdict toward PLAUSIBLE: a controlled sweep over N simultaneously-tracked items (N=2,4,6,8,10,12), task-type-matched with position held constant, finding an inflection point in the 5-9 range that is robust across model families and holds even with positional effects controlled away. That study does not exist in the current literature.

What would change the verdict toward REFUTED: the same sweep finding smooth log-decline with no inflection, or finding the inflection at values (e.g., N=15-20) that don't rhyme with human WM limits at all.

The analogy is thought-provoking scaffolding for agent system design (Brain wiki: ai-agent-memory-landscape.md confirms "stateless agents fall apart on real work"), but it should not be treated as an established empirical finding.

---

## Papers to Read

1. **Miller, G.A. (1956).** "The Magical Number Seven, Plus or Minus Two: Some Limits on Our Capacity for Processing Information." _Psychological Review_, 63(2), 81-97. DOI:10.1037/h0043158. — Ground truth for the human claim; note Miller himself said 7 was rhetorical, not a hard constant.

2. **Cowan, N. (2001).** "The Magical Number 4 in Short-Term Memory: A Reconsideration of Mental Storage Capacity." _Behavioral and Brain Sciences_, 24(1), 87-114. DOI:10.1017/S0140525X01003922. — The revised 4±1 claim with controlled methodology; provides the template for what a proper capacity measurement requires.

3. **Liu et al. (2023).** "Lost in the Middle: How Language Models Use Long Contexts." _TACL 2024_. arXiv:2307.03172. — Positional U-curve; critical for distinguishing positional artifacts from count-based capacity limits.

4. **Hsieh et al. (2024).** "RULER: What's the Real Context Size of Your Long-Context Language Models?" _COLM 2024_. arXiv:2404.06654. — Multi-needle NIAH and variable-tracking tasks; the most systematic behavioral test of LLM context capacity to date.

5. **Kuratov et al. (2024).** "BABILong: Testing the Limits of LLMs with Long Context Reasoning-in-a-Haystack." _NeurIPS 2024_. arXiv:2406.10149. — 10-20% effective utilization finding; scales to 10M tokens; multi-hop reasoning across distributed facts.

6. **[Authors not retrieved] (2024).** "Self-Attention Limits Working Memory Capacity of Transformer-Based Models." _NeurIPS 2024 Workshop_. arXiv:2409.10715. — Direct N-back mechanistic study; entropy analysis; continuous log decline finding is the key counter-evidence to threshold claim.

7. **Feng & Steinhardt (2023).** "How do Language Models Bind Entities in Context?" arXiv:2310.17191. — Binding ID mechanism; causal intervention evidence; sets up the binding-capacity framing.

8. **Prakash et al. (2024).** "Representational Analysis of Binding in Large Language Models." arXiv:2409.05448. — Low-rank subspace for binding; 7-pair experimental setup; closest to a mechanistic capacity measurement.

9. **Olsson et al. (2022).** "In-context Learning and Induction Heads." arXiv:2209.11895. Transformer Circuits Thread, Anthropic. — Induction heads as the retrieval mechanism; establishes that in-context retrieval has a specific circuit basis with finite cardinality.

10. **Yang et al. (2024).** "Do Large Language Models Latently Perform Multi-Hop Reasoning?" _ACL 2024_. arXiv:2402.16837. — Strong first-hop, weak second-hop scaling; consistent with a binding-stack limit; scaling improves first-hop but not second.

---

## Notes for Synthesis

- **Cross-cutting with Claim on Context-as-RAM (architectural framing):** The Karpathy lens explicitly frames this as "defective address bus" — the number of addressable slots in the KV cache that can be reliably attended to, not the nominal size. This connects to any claim about LLM architectural constraints being analogous to human cognitive architecture.

- **Cross-cutting with Binding and Variable Tracking claims:** Feng & Steinhardt's Binding ID (2310.17191) and Prakash's low-rank subspace (2409.05448) provide the mechanistic bridge between behavioral capacity limits and internal representation. Any claim about LLM "understanding" of multi-entity scenarios should engage with whether the binding subspace has sufficient rank.

- **Cross-cutting with Attention Mechanisms and Induction Heads:** The retrieval-heads finding (Wu et al. / DuoAttention, 2410.10819) and induction heads (Olsson et al., 2209.11895) show that long-context retrieval is implemented by a _sparse subset_ of heads (~3-6% of all heads). This sparse cardinality is a structural bottleneck. Whether it maps to a chunk limit requires the controlled sweep experiment that doesn't yet exist.

- **Design implication for agent systems:** Even under the contested verdict, the finding that effective utilization is 10-20% of nominal (BABILong) should drive agent system design. If you're building a context-window-as-working-memory system (Brain wiki: ai-agent-memory-landscape.md), plan for ~4-8 reliably-tracked entities in the active context, not the nominal token count. This is a practical engineering prior even without mechanistic proof.

- **Falsifiability gap:** The claim as stated is not currently falsifiable because no study has directly tested performance as a function of tracked-item count with position and task difficulty held constant. This is the most important empirical gap in the 2023-2026 literature on this topic.
