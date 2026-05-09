---
title: "Claim 09 — Active Forgetting as Capability"
type: research-claim
tags:
  [
    ai,
    brain,
    forgetting,
    unlearning,
    continual-learning,
    regularization,
    memory-hygiene,
  ]
created: 2026-05-09
verdict: WEAK-FORM-TRUE / STRONG-FORM-UNPROVEN
personas: [hickey, karpathy]
---

# Claim 09 — Active Forgetting as Capability

## The Claim

**Strong form**: Active forgetting mechanisms added to LLMs (machine unlearning, scheduled memory decay, importance-weighted pruning) _improve_ downstream task performance in continual learning and reasoning. Forgetting is a _capability_, and ablating it hurts performance.

**Weak form**: Forgetting is necessary in narrow cases (privacy, copyright compliance) but is neutral-to-negative for capability.

---

## Verdict

**WEAK-FORM TRUE, STRONG-FORM UNPROVEN — with a critical nuance.**

The strong form conflates three distinct phenomena that must be held separate:

1. **Regularization-as-forgetting** (weight decay, dropout): clearly and robustly capability-improving. This is the trivially true reading of the claim.
2. **Continual learning interference reduction** (selective forgetting of obsolete or conflicting representations): moderately supported; reduces spurious forgetting and improves plasticity, but is not equivalent to "active forgetting as general capability."
3. **Machine unlearning** (privacy-motivated removal of specific training examples post-hoc): almost universally degrades nearby capabilities; the state of the art as of 2025 cannot achieve targeted forgetting without collateral damage to general competence. The strong form is **not supported** in this domain.

The cognitive psychology literature (Bjork & Bjork, 1992; Anderson, 2003) provides the strongest theoretical foundation for the strong form — but the bridge from human inhibitory control to LLM weight-space mechanics is not empirically closed.

---

## Section 1: Cognitive Psychology — Forgetting as Adaptive Design

The theoretical anchor for the strong claim is Robert A. Bjork and Elizabeth Bjork's **New Theory of Disuse** (1992, reprinted with pedagogical implications 2006). The theory distinguishes _storage strength_ (how entrenched a memory trace is) from _retrieval strength_ (current accessibility). Storage strength monotonically increases with each successful retrieval and never decays; retrieval strength can decline with disuse, and this decline is _adaptive_. Reduced retrieval strength creates "desirable difficulty": when the learner must effortfully reconstruct an item, the retrieval itself boosts storage strength far more than a trivially accessible memory would. The memory system therefore uses forgetting as a mechanism to _select for importance_ — items that need to survive are the ones that get practiced enough to remain accessible.

Michael C. Anderson's **Rethinking Interference Theory** (2003, _Journal of Memory and Language_) extends this. Anderson proposes that retrieval-induced forgetting (RIF) is not a passive byproduct of interference but an active inhibitory mechanism. When competing memories interfere during retrieval, executive control suppresses the non-target traces. The functional consequence is precisely the strong claim's intuition: suppressing irrelevant competitors reduces cognitive load and sharpens retrieval of target knowledge. fMRI evidence cited in the PMC review (Mechanisms Underlying Interference and Inhibition, 2021) shows prefrontal control demands decline over repeated retrievals as competing memories are forgotten — a clean empirical signature of inhibitory forgetting _improving_ future retrieval efficiency.

**Bridge to LLMs**: This cognitive grounding is theoretically compelling but the analogy is imprecise. Human RIF operates at the level of episodic traces in a hippocampal-neocortical system with clear representational modularity. LLM "forgetting" via gradient manipulation operates on distributed weight matrices with no architectural analog to hippocampal indexing. The mechanism is radically different, so the functional benefit does not transfer automatically.

---

## Section 2: Regularization as Forgetting — The Trivially True Case

At the level of training mechanics, the strong claim is **trivially true** and uncontroversial:

- **Weight decay (L2 regularization)** penalizes large weight magnitudes, continuously attenuating weights that are not reinforced by training signal. This is scheduled forgetting built into every major LLM training run. Its improvement to generalization is a bedrock empirical fact across all of deep learning.
- **Dropout** stochastically silences neurons each forward pass, preventing co-adaptation of units and forcing the network to learn redundant, distributed representations. It is architectural forgetting at inference time.
- **Gradient clipping** and **learning rate scheduling** control the rate and direction of weight updates, implicitly managing what the model "remembers" from each batch.

The Markaicode and Medium writeups on LLM training regularization confirm that weight decay is standard practice in all current foundation model training and that its omission degrades generalization. At this level, forgetting is unambiguously capability-positive. The claim's strong form, interpreted narrowly as "forgetting during pre-training improves performance," is true and boring.

The interesting question — does _scheduled, content-specific_ forgetting post-training improve capability? — is a different claim and remains contested.

---

## Section 3: Machine Unlearning — The Overloaded Term

The machine unlearning literature (Cao & Yang, 2015; Bourtoule et al., 2021; Nguyen et al., 2022) developed primarily as a _compliance_ mechanism, not a capability mechanism. The GDPR's right to be forgotten and analogous regulations demand that a model behave as if a specific user's data was never used in training. This is a legal/ethical obligation, not a performance optimization.

**Bourtoule et al. (2021) — SISA Training**: The SISA (Sharded, Isolated, Sliced, Aggregated) framework partitions training data and trains sub-models in isolation so that unlearning a data point requires retraining only the containing shard. For the Purchase dataset, SISA yields 4.63x speedup over full retraining for unlearning; for SVHN, 2.45x. However, these gains are in _compute efficiency for the unlearning operation_, not in downstream task performance. SISA's limitation is explicit: performance degrades as unlearning volume increases, making it unsuitable for large-scale scenarios.

**Nguyen et al. (2022) — Survey**: The ACM survey taxonomy covers exact unlearning (retrain-based, computationally expensive, guarantees accuracy parity) vs. approximate unlearning (direct weight modification, cheaper, inevitably reduces accuracy). The survey notes: "an unlearned model typically has worse model utility than the model retrained from scratch." The dominant concern is utility _preservation_, not utility _improvement_. Forgetting here is a regulatory burden that practitioners try to minimize the cost of.

**Chen & Yang (2023) — "Unlearn What You Want to Forget"** (EMNLP 2023, arXiv:2310.20150): Proposes lightweight unlearning adapter modules trained with a selective teacher-student objective. Gradient ascent on the forget set is the canonical baseline; Chen & Yang's approach confines unlearning to adapters, avoiding full-model weight distortion. The approach is a mitigation strategy against capability degradation, not evidence that unlearning adds capability.

**Critical problem — gradient ascent collapse**: The 2025 paper "Rethinking LLM Unlearning Objectives" (arXiv:2502.19301) provides the clearest empirical characterization of the failure mode. Standard gradient ascent on forget sets exhibits an "inverse confidence mechanism" — tokens with lower confidence receive disproportionately high gradient weight, causing excessive unlearning. Crucially, shallow layers encoding general linguistic knowledge suffer _substantially more_ degradation than deep task-specific layers. This means targeted forgetting of specific content systematically corrupts foundational language competence as collateral damage. The paper's proposed fixes (Weighted Gradient Ascent, Token-wise NPO) improve retention substantially but the originally-trained model remains the performance ceiling.

**TOFU Benchmark** (Maini et al., 2024, arXiv:2401.06121): The first controlled benchmark for LLM unlearning, using 200 fictitious authors (GPT-4 generated). Finding: **none of the baseline unlearning methods achieve effective unlearning** when measured holistically across forget set, retain set, real author knowledge, and world facts. Methods either fail to forget (the forget set knowledge remains) or over-forget (collateral damage to retain set). This is a two-sided failure demonstrating that the capability-forgetting trade-off is not yet solvable with current methods.

---

## Section 4: Continual Learning — Interference Reduction as Selective Forgetting

Continual learning is the regime where the strong claim has the most genuine empirical support, but the evidence is more nuanced than "active forgetting improves performance" straightforwardly.

**Catastrophic forgetting** (McCloskey & Cohen, 1989; French, 1999) — not a feature, a failure mode. When an LLM is fine-tuned on new tasks, previously learned weights are overwritten, degrading performance on prior tasks. This is the _absence_ of protective forgetting mechanisms, not active forgetting. The stability-plasticity dilemma formalizes the trade-off: stability (retaining old knowledge) competes with plasticity (acquiring new knowledge).

**Spurious forgetting** (ICLR 2025, arXiv:2501.13453): A key finding distinguishes _spurious forgetting_ (performance drops due to disrupted output-layer alignment, not actual knowledge loss) from _true forgetting_ (genuine erasure of weight-encoded knowledge). The ICLR 2025 paper shows that spurious forgetting is reversible with minimal fine-tuning (~3 epochs), while true forgetting requires full dataset retraining. A freezing strategy that fixes bottom layers of the model yields "substantial improvements in four continual learning scenarios." This is a form of selective forgetting (protecting lower layers) that improves continual learning performance. The claim's strong form is partially instantiated here: intelligently _deciding what not to update_ (a form of active forgetting-prevention) improves performance.

**AdaDARE-γ** (CVPR 2025): Addresses stability-plasticity in multimodal LLMs through adaptive weight allocation. Evidence that architectural mechanisms that control what gets forgotten during fine-tuning improve performance on both old and new tasks.

**Importance-weighted pruning — COPAL (ICML 2024) and Wanda**: Pruning connections weighted by importance scores (magnitude × activation) achieves sparsification (a form of forgetting unimportant information) that performs competitively against dense models while reducing compute. The SparseLLM paper (NeurIPS 2024) shows that newer pruning methods "preserve most of the knowledge from the dense model" — the benefit is framed as _minimizing_ capability loss, not _improving_ capability. There is no published evidence that pruning _alone_ improves downstream task performance over the dense model; the benefit is efficiency-with-preservation.

---

## Section 5: Task Arithmetic and Model Negation — Structured Forgetting

Ilharco et al.'s task arithmetic framework (2023) treats capability vectors (LoRA delta weights or full fine-tune deltas) as composable. **Negation** (subtracting a task vector) removes a learned capability with limited interference to unrelated capabilities. This is the most surgical form of active forgetting in the LLM literature.

The practical use case is capability removal for safety (subtracting "harmful generation" vectors) rather than capability addition through forgetting. The NVIDIA model merging survey (2024) notes that negation "reduces performance on one specific task without deterring performance on others," which is precisely the targeted forgetting the strong claim needs. However, the empirical benefit is _capability-neutral_ on retained tasks, not capability-positive. Forgetting here achieves isolation, not improvement.

---

## Section 6: Agent Context Management — Active Forgetting as Runtime Capability

The strongest _operational_ evidence for the strong form comes not from weights but from context window management in agent systems.

The 2025 survey "Memory for Autonomous LLM Agents" (arXiv:2603.07670) notes that MemoryAgentBench explicitly evaluates "selective forgetting" as one of four memory competencies alongside retrieval, test-time learning, and long-range understanding. MemGPT's design treats forgetting as essential: strategic summarization and targeted deletion of context are mechanisms that make context windows tractable. The 2025 review from Weaviate's Context Engineering survey frames active forgetting (compression, deletion, summarization of stale information) as a prerequisite for reasoning quality over long agent sessions.

This is cognitively coherent: an agent that cannot selectively forget irrelevant intermediate states accumulates interference that degrades retrieval precision for relevant memories — exactly the Anderson RIF mechanism applied at runtime. The claim is well-supported _at the context management level_ even if not at the weight-surgery level.

---

## Analytical Lenses

### Lens 1 — Rich Hickey

Hickey would embrace the claim's framing and sharpen it. He'd identify the core problem as **place-orientation**: LLM weights are a place — a mutable, stateful blob that accumulates training signal without any principled mechanism to distinguish _values_ (durable, composable facts) from _ephemeral state_ (training noise, outdated associations). The model has no explicit garbage collector, no time-to-live on information, no way to say "this weight cluster served training task T at step N and should not complect with task T' at step N+1."

Hickey's critique: the word "forgetting" is itself confused. What we call machine unlearning is reactive decomplection — patching after the fact because no principled separation was made at training time. The _right_ solution is to never complect the information in the first place. Regularization (weight decay, dropout) is the closest existing mechanism — it continuously simplifies the weight space, preventing accidental entanglement. But it operates uniformly and blindly, not with semantic awareness of what should be isolated from what.

His prescriptive conclusion: the strong claim should be rephrased as "**architectures with principled information lifecycle management — where what gets encoded and what gets discarded is a first-class design decision — outperform architectures that accumulate without discipline**." This is true. Weight decay proves it at the coarse level; the current machine unlearning literature fails because it tries to bolt selective decomplection onto a place-oriented system after the fact.

### Lens 2 — Karpathy

Karpathy would call this claim "technically true in the boring case, empirically mixed in the interesting case, and systematically overstated in the marketing case."

The boring case: weight decay is forgetting, dropout is forgetting, these help, end of discussion. This part of the claim is not interesting — it's standard practice for a reason.

The interesting case: can we do _scheduled, content-specific_ unlearning that improves downstream performance? The empirical evidence (TOFU, gradient ascent collapse, collateral capability damage in shallow layers) says the current toolset is not there. The problem is that LLM weights are densely entangled — you cannot surgically excise knowledge of "author X" without disturbing the neighboring representation manifold for related concepts. This is a fundamental consequence of how transformers compress information through distributed representations.

His statistical framing: machine unlearning at the individual-data-point level is asking for a feature the training objective never optimized for. The model never learned to store individual training examples in isolable slots — it learned _compressed statistics_ of the training corpus. Asking it to "forget" a specific example is asking it to undo a statistical compression that was applied to billions of examples simultaneously. The compression is lossy and non-invertible for individual data points.

His prediction on the forward path: the methods that will work are those that operate at the representation level (concept erasure, activation steering) rather than the weight-update level, and they will show capability-neutral-to-positive results only when the forgotten concept was genuinely interfering with target task performance.

---

## Evidence Summary Table

| Domain             | Forgetting mechanism              | Capability effect             | Evidence quality                  |
| ------------------ | --------------------------------- | ----------------------------- | --------------------------------- |
| Pre-training       | Weight decay / dropout            | Positive (generalization)     | Strong, replicated                |
| Continual learning | Spurious forgetting prevention    | Positive (stability)          | Moderate (ICLR 2025)              |
| Continual learning | Importance-weighted pruning       | Neutral (efficiency)          | Moderate                          |
| Machine unlearning | Gradient ascent                   | Negative (capability damage)  | Strong (TOFU, 2502.19301)         |
| Machine unlearning | Adapter-based (Chen 2023)         | Neutral-negative (mitigated)  | Moderate                          |
| Model editing      | Task arithmetic negation          | Neutral (targeted only)       | Moderate                          |
| Agent context      | Active forgetting / summarization | Positive (reasoning quality)  | Emerging (2025 surveys)           |
| Cognitive psych    | Retrieval-induced forgetting      | Positive (selection pressure) | Strong (but no direct LLM analog) |

---

## Key Sources

- Bjork, R.A. & Bjork, E.L. (1992). A new theory of disuse and an old theory of stimulus fluctuation. [PDF via Bjork Lab](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/RBjork_EBjork_1992.pdf)
- Anderson, M.C. (2003). Rethinking interference theory: Executive control and the mechanisms of forgetting. [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0749596X03001128)
- Bourtoule et al. (2021). Machine Unlearning. [arXiv:1912.03817](https://arxiv.org/abs/1912.03817)
- Nguyen et al. (2022). A Survey of Machine Unlearning. [arXiv:2209.02299](https://arxiv.org/abs/2209.02299)
- Chen & Yang (2023). Unlearn What You Want to Forget. [arXiv:2310.20150](https://arxiv.org/abs/2310.20150)
- Maini et al. (2024). TOFU: A Task of Fictitious Unlearning for LLMs. [arXiv:2401.06121](https://arxiv.org/abs/2401.06121)
- Zhang et al. (2025). Rethinking LLM Unlearning Objectives: A Gradient Perspective. [arXiv:2502.19301](https://arxiv.org/abs/2502.19301)
- Machine Unlearning Comprehensive Survey (2024). [arXiv:2405.07406](https://arxiv.org/html/2405.07406v3)
- Spurious Forgetting in Continual Learning of Language Models (ICLR 2025). [arXiv:2501.13453](https://arxiv.org/abs/2501.13453)
- Memory for Autonomous LLM Agents (2025). [arXiv:2603.07670](https://arxiv.org/html/2603.07670v1)
- Ilharco et al. Task Arithmetic. [vitalab](https://vitalab.github.io/article/2024/05/09/task-arithmetic.html)

---

## Implications for Anthropic Engineers Building Agent Systems

1. **Use active forgetting in context management** — the evidence is clearest here. Agent systems that compress, summarize, and delete stale context outperform those that accumulate unboundedly. This is not controversial; build it.

2. **Do not expect machine unlearning to add capability** — current post-hoc weight surgery degrades performance. If capability-preserving unlearning is required for compliance, use adapter-based methods (Chen 2023) or representation-level erasure rather than gradient ascent on full weights.

3. **Regularization is the canonical form of capability-improving forgetting** — ensure pre-training and fine-tuning regimes use appropriate weight decay and dropout schedules. This is not a research frontier; it is table stakes.

4. **Continual learning with selective layer freezing** — the ICLR 2025 spurious-forgetting finding is directly actionable: freeze bottom layers during domain adaptation fine-tuning to prevent disruption of general language competence. This is a form of active forgetting (deciding not to update certain representations) that demonstrably improves continual learning.

5. **Task arithmetic negation for capability isolation** — for deployment scenarios requiring capability removal (e.g., preventing specific behavior domains), task arithmetic negation is currently the least destructive approach, achieving targeted forgetting with minimal collateral damage. [unverified: long-term stability of negated vectors over many subsequent fine-tuning steps]
