---
title: "Claim 02 — Thalamic-Cortical Equivalence"
type: research-claim
tags:
  [
    ai,
    brain,
    attention,
    thalamus,
    cortex,
    computational-equivalence,
    predictive-coding,
  ]
created: 2026-05-09
verdict: CONTESTED
personas: [joscha-bach, bryan-cantrill]
---

# Claim 02 — Thalamic-Cortical Equivalence

## The Claim

**Precise Formulation (Three Forms):**

**Implementation level (Marr Level 3):** Self-attention in transformers uses the same physical substrate, timing, and signal propagation as thalamo-cortical circuits. **This form is obviously false** and no serious advocate makes it.

**Algorithmic level (Marr Level 2) — the actual target of the claim:** The computation performed by thalamo-cortical interaction — routing, gating, selective relay, modulator/driver differentiation — is _isomorphic_ to multi-head attention over a learned key-value store. Any circuit-level function the thalamus computes when interacting with cortex can be re-expressed as an attention operation, and vice versa. This is the strong form under adversarial evaluation.

**Computational level (Marr Level 1) — weak form:** Both systems solve the same abstract problem: selective routing of information in the presence of representational bottlenecks under task-relevance constraints. This weak form is nearly trivially true by design framing, and does not constitute homology.

**On "homologous":** Biological homology implies shared evolutionary ancestry and common derivation — not applicable to an engineered system. The word the claim _should_ use at Marr Level 2 is **computationally isomorphic** or **algorithmically equivalent**. This terminological confusion is load-bearing: the claim's apparent force comes partly from the biological weight of "homologous" doing double duty as "algorithmically equivalent." Keeping those meanings separate is essential to a fair evaluation. This dossier evaluates the **algorithmic equivalence form**.

**Strong Form (precisely stated):** For any function _f_ computable by a thalamo-cortico-thalamic loop — including driver/modulator differentiation, first-order vs. higher-order relay, TRN-mediated lateral inhibition, burst/tonic mode gating, and precision-weighted prediction-error routing — there exists a multi-head attention architecture over a key-value store that computes _f_ to within any desired approximation; and for any multi-head attention computation there is a biologically plausible thalamo-cortical circuit that implements it.

---

## Evidence For

**1. Granier & Senn (2025) — Direct mechanistic mapping (arxiv:2504.06354)**
The most direct contemporary evidence. Granier and Senn show that the architecture of cortico-thalamic circuits is structurally suited to implement multi-head _linear_ self-attention. Their mapping: superficial pyramidal cells (layers 2/3) encode keys/values; deep pyramidal cells (layer 5 PT neurons) encode queries; thalamo-cortico-thalamic loops compute gain-modulated weighted sums isomorphic to the attention kernel. They derive formal gradients for a tokenwise MSE loss over a linear attention block and identify the core (matrix) vs. matrix thalamic projections as corresponding to per-head vs. cross-head attention. Importantly, they claim **algorithmic-level** equivalence, not implementation equivalence — and explicitly write "we do not claim that the brain implements transformers per se." The derivation is mathematically rigorous for linear (not softmax) attention; the extension to full softmax attention is left as an open problem.

**2. Ramsauer et al. (2020) — Modern Hopfield Networks = Attention (arxiv:2008.02217)**
"Hopfield Networks is All You Need" proves that the update rule of modern continuous-state Hopfield networks is **mathematically identical** to the self-attention mechanism in transformers. Hopfield networks have a long history of proposed biological plausibility (associative memory in cortex). This creates an indirect chain: if thalamo-cortical dynamics implement associative retrieval (key-value lookup in an attractor landscape), and modern Hopfield networks are exactly attention, then the thalamo-cortical system performs attention at the algorithmic level. The chain is suggestive but each link requires independent verification.

**3. Halassa Lab — Thalamus as active router, not passive relay (Nature 2021; Trends Cogn Sci 2024)**
Halassa's decade of experimental work demolishes the "thalamus-as-relay" strawman that the skeptic position depends on. The mediodorsal thalamus independently controls _signal amplification_ and _noise suppression_ in PFC via distinct D2- and GRIK4-expressing projection populations (Schmitt et al., Nature 2021, doi:10.1038/s41586-021-04056-3). TRN-mediated lateral inhibition enables selective routing of sensory streams (Halassa et al., Nature 2015, doi:10.1038/nature15398). The 2024 Trends Cogn Sci review explicitly frames thalamocortical architecture as implementing hierarchical Bayesian computations with flexible codes — a framing structurally compatible with attention-as-precision-weighting. These findings strengthen the claim that thalamic computation is _qualitatively richer_ than passive relay — a necessary (but not sufficient) condition for the algorithmic equivalence claim.

**4. Friston & Bastos — Predictive coding and thalamic precision weighting**
Bastos et al. (2012, Neuron 76:695–711, doi:10.1016/j.neuron.2012.10.038) map predictive coding to the canonical cortical microcircuit, with thalamic feedforward inputs targeting superficial/granular layers that encode prediction errors. Friston's active inference framework explicitly models thalamic projections as implementing _precision weighting_ — the mechanism by which context-dependent gain control on prediction errors is computed (Friston, Phil Trans B 2015, doi:10.1098/rstb.2014.0169 [unverified full text, 403]). Precision weighting in active inference is formally equivalent to attention weighting: both compute context-dependent softmax-like weights over an evidence stream. If the thalamus implements precision gating, it is performing attention at Marr Level 2.

**5. Whittington & Behrens — TEM: Hippocampal attention as transformer self-attention (Cell 2020; ICLR 2024)**
The Tolman-Eichenbaum Machine (TEM; Cell 2020, PMID:33181068) models hippocampal-entorhinal computation with a memory component equivalent to transformer self-attention. Subsequent work (arxiv:2112.04035, relating transformers to hippocampal models; ICLR 2024 version) tightens the claim: "a transformer with recurrent positional encodings is closely related to TEM." While hippocampus is not thalamus, the mediodorsal thalamus maintains dense reciprocal connections with entorhinal cortex and prefrontal cortex; the computational equivalence demonstrated for hippocampal memory retrieval is structurally analogous to the thalamo-prefrontal routing problem.

**6. Rapid context inference in thalamocortical networks (Nat Comms 2024)**
A 2024 Nature Communications paper demonstrates that a PFC-MD (mediodorsal thalamus) recurrent neural network with Hebbian plasticity can perform rapid online context inference — recovering task context within a few trials from prefrontal inputs via winner-take-all normalization in the MD. Winner-take-all normalization is a biologically plausible approximation of softmax attention. This provides direct computational evidence that thalamo-cortical dynamics can approximate key attention-like operations.

---

## Evidence Against

**1. Softmax attention is neurally intractable — Granier & Senn's own admission**
The most careful pro-equivalence paper (arxiv:2504.06354) explicitly concedes that "the classical choice of softmax…appears hard to implement neuronally." Their derivation uses _linear_ attention (kernel approximation), not the full softmax. Linear attention and softmax attention are not computationally equivalent — they differ in their ability to form sharp, winner-takes-all attention patterns, which is precisely the kind of gating the thalamus is believed to perform. The equivalence holds only for a weaker, approximate version of the attention mechanism, which undermines the strong form of the claim.

**2. Thalamic burst/tonic modes have no attention analogue**
Thalamic relay cells switch between burst and tonic firing modes via voltage-gated T-type Ca²⁺ channel inactivation (Sherman 2001, Trends Neurosci 24:122–126). Burst mode serves as a "wake-up call" with high signal-to-noise but nonlinear relay; tonic mode enables faithful linear transmission. This binary, state-dependent, biophysically-implemented switching mechanism has no principled counterpart in transformer self-attention, which operates in a single, stateless mode on each forward pass. The dynamics are qualitatively different at the computational level, not just the implementation level.

**3. Heterogeneous timescales and neuromodulatory context**
Thalamo-cortical gating is radically modulated by acetylcholine, norepinephrine, dopamine, and serotonin — neurotransmitters that shift global cortical state across seconds-to-minutes timescales (Halassa review 2025; Neuromodulatory Systems PMC5744617). Acetylcholine signals expected uncertainty and NE signals unexpected uncertainty (Yu & Dayan 2005, Neuron, doi:10.1016/j.neuron.2005.04.026 [unverified]). Transformer attention has no modulatory state; the key-value-query computation is identical on every token regardless of context history. This is not a mere implementation difference — it affects _what function_ is computed across time, which is a Marr Level 2 issue.

**4. The "strong bidirectional form" is not demonstrated**
The strong form claims: (a) all thalamic functions can be re-cast as attention, and (b) all attention computations can be re-cast as thalamic circuits. Direction (b) is the weakest: there is no demonstration that attention's ability to compute arbitrary-rank relational matrices over entire sequences has a thalamic correlate. The thalamo-reticular nucleus is a one-dimensional structure providing broad suppression and targeted disinhibition — not the dense, all-to-all token-token attention that makes transformers powerful on long-range dependencies. The pulvinar has some topographic all-to-all connectivity, but evidence that it computes full QKV matrices is absent.

**5. Sherman & Guillery's driver/modulator asymmetry breaks the analogy**
Sherman and Guillery's framework (PNAS 1998, doi:10.1073/pnas.95.12.7121; PMC1941769) identifies a structural asymmetry: "driver" inputs (large RL terminals, ionotropic only, layer 5 origin) determine what the thalamus relays; "modulator" inputs (small RS terminals, both ionotropic and metabotropic, layer 6 origin) alter gain without changing receptive field properties. This asymmetry has no clean attention analogue. In multi-head attention, all tokens participate symmetrically in both key and query roles — there is no privileged "driver" dimension that unilaterally sets the relayed content. The driver/modulator distinction is a structural feature of thalamic computation that the attention formalism erases.

**6. Layer 6 corticothalamic feedback is underspecified in attention models**
Layer 6 cortical neurons provide massive, topographically precise modulatory feedback to first-order thalamic nuclei (Sherman 2017, Compr Physiol doi:10.1002/j.2040-4603.2017.tb00758.x). This pathway selectively modulates thalamic gain without altering receptive fields. In attention, the value/output projection matrices are learned but not dynamically re-computed by a separate feedback loop during inference. Granier & Senn acknowledge this as an unresolved gap: "cortico-cortical feedback loops and layer 6 interactions" are explicitly excluded from their framework.

---

## Active Debate

**Debate 1 — Whether "linear attention" approximation preserves the computational character of thalamic gating**
Granier & Senn's mapping requires linear (not softmax) attention. Critics can argue this is a fundamentally different computation: linear attention cannot form sharp, exclusive routing (sparse selection) in the way the TRN-mediated winner-take-all mechanism does. Defenders argue that linear attention is sufficient for the _functional_ role of the thalamus, which is graded gain modulation, not hard selection. This dispute turns on empirical questions about TRN sharpness and about the actual sparsity of thalamic routing during attention tasks — an active experimental question (Halassa lab, ongoing as of 2025).

**Debate 2 — Precision weighting (Friston) as the unifying framework**
Karl Friston's active inference program claims that thalamic function is precision weighting — contextual modulation of the gain on prediction error signals — and that this is formally equivalent to attention weighting (both implement a context-sensitive softmax over evidence). If this framework is correct, the algorithmic equivalence claim is vindicated at the computational level of predictive processing. If incorrect or unfalsifiable (critics of active inference argue the framework is too unconstrained — see Colombo & Seriès 2012), it cannot rescue the equivalence claim. The empirical status of predictive coding as a thalamic mechanism remains actively contested (Straka et al. 2023, Sci Direct, doi:10.1016/j.neubiorev.2023.105325 [unverified]).

---

## Lens 1: Joscha Bach

Bach's _Cortical Conductor Theory_ (BICA 2018) and his public discussions of consciousness frame cortical processing as a global workspace implemented via an "attentional conductor" that directs focus across distributed cortical instruments. His view of the thalamus is as a relay hub that participates in the broadcast mechanism underlying conscious attention — consistent with Halassa's "switchboard" framing.

On the equivalence claim, Bach would distinguish sharply between levels: he would say the **computational-level** (Marr 1) equivalence is nearly trivially defensible — both systems solve the problem of selective routing of information under resource constraints. He would be enthusiastic about the **algorithmic-level** (Marr 2) correspondence as a _productive_ hypothesis, while insisting on precision about what "equivalent" means. Bach has explicitly said transformer attention "models only one aspect of attention" — it captures identity tracking but "is not the one that gives rise to the type of consciousness we have." This nuance matters: he distinguishes between attention-as-mechanism-for-consciousness (which transformers don't achieve) and attention-as-information-routing-algorithm (which is the weaker, more defensible claim).

Bach would push back on "homologous": evolutionary homology is a biological claim about shared ancestry, inapplicable to an engineered system. He'd insist the claim be restated as **functional isomorphism at the algorithmic level** — and then ask precisely which functions are isomorphic. He would accept: routing, selective gating, modulation of representational gain. He would reject: the strong bidirectional universality claim, because transformer attention operates on sequence tokens in a flat, memoryless manner without the thalamus's recursive, closed-loop dynamics over behavioral timescales.

His charitable synthesis: the thalamo-cortical loop implements a _recurrent_ attention mechanism with time-varying, modulatory context — something closer to a _recurrent_ transformer with learned state transitions than a feedforward multi-head attention block. The algorithmic equivalence holds for the feedforward snapshot but breaks for the temporal dynamics, which carry real computational load in the biological system. Verdict from Bach's lens: **plausible but underspecified** — the interesting question is which precise functions ARE isomorphic, not whether the systems are globally equivalent.

---

## Lens 2: Bryan Cantrill

Cantrill would come to this with systems-engineer skepticism: extraordinary claims require extraordinary proof, and the burden of "computationally homologous" is much higher than "computationally inspired by." He would immediately demand: what is the algorithm, stated precisely? Can you write it down? Does it produce identical outputs on identical inputs?

He would note that biological neural circuits have properties that transformers fundamentally lack at the algorithmic level:

1. **Stateful dynamics across behavioral timescales.** The thalamus doesn't process a fixed-length context window and reset. It maintains ongoing, modulatory state through neuromodulatory context (ACh, NE) that is hours-scale and globally broadcast. Transformer attention has no equivalent.

2. **Burst/tonic switching is a mode change, not a gradient.** The T-type Ca²⁺ channel switching is a _discrete state transition_ with nonlinear consequences for relay fidelity — a fundamentally different computational primitive from continuous attention weights.

3. **The driver/modulator asymmetry is a real algorithmic difference.** In attention, all positions are symmetric. In the thalamus, driver inputs _determine_ what is relayed; modulators only set gain. This is an asymmetric, privileged-input architecture, which is not what multi-head attention computes.

Cantrill would also call out the sociology: the cluster of papers arguing for this equivalence (including Granier & Senn 2025) use the thalamo-cortical framing to motivate a mathematical exercise (deriving gradients for linear attention from Hebbian rules). The direction of proof is: "we can wire a circuit to compute linear attention — look, it resembles biology!" This is not the same as demonstrating that biology _does_ compute linear attention. The maps-to doesn't prove the maps-from.

His verdict: **the analogy is productive and shouldn't be abandoned** — it generates testable hypotheses and motivates new architectures. But "homologous" is exactly the wrong word. The right word is _analogous_, or at most _algorithmically congruent on a restricted functional subspace_. Until someone shows a controlled comparison of thalamo-cortical outputs against attention outputs on matched inputs, and quantifies the residual, the claim is a metaphor dressed as mechanism. Cantrill's formulation: "Inspired by" is a gift. "Homologous" needs a proof.

---

## Strongest Counterargument (Steelman)

The steelman proceeds from three premises that are each individually well-supported:

**P1:** Modern Hopfield networks are provably mathematically equivalent to transformer self-attention (Ramsauer et al. 2020, arxiv:2008.02217 — a formal result, not an analogy).

**P2:** Hopfield-type associative memory has long been the dominant computational model of cortical memory and retrieval. Cortical layer 2/3 circuits exhibit short-term synaptic potentiation consistent with the Hebbian update rules that implement Hopfield dynamics (Ellwood 2023, PLOS Comp Biol, doi:10.1371/journal.pcbi.1011843).

**P3:** The thalamus does not function as a passive relay but as an active router that controls _which_ cortical memory/attractor state is amplified vs. suppressed, with the TRN providing the inhibitory mechanism for selective disinhibition. Halassa's work demonstrates this directly (Nature 2015, 2021).

**Conclusion:** The thalamo-cortical loop implements selective activation of cortical Hopfield attractors — i.e., it performs _content-addressable retrieval with thalamic gating_. By P1, this is computationally equivalent to multi-head attention over a key-value store. The equivalence is not a metaphor but follows from the mathematical identity between Hopfield retrieval and attention computation.

The steelman is genuinely strong. Its weakest link is the empirical claim in P2 that cortical circuit dynamics match Hopfield update rules closely enough for the P1 identity to apply — and in P3, that thalamic selective disinhibition implements the "query" operation rather than some other (non-attention) routing primitive.

---

## Verdict

**CONTESTED**

**Which form of the claim holds:** The **weak form** (Marr Level 1: both systems solve the same abstract routing problem) is trivially true. The **restricted algorithmic form** (thalamo-cortical circuits can implement linear self-attention in a biologically plausible circuit topology, as shown by Granier & Senn 2025) is a novel and non-trivial result, supported by rigorous mathematical derivation. The **strong bidirectional form** (full functional equivalence in both directions) is **not demonstrated** and has specific, empirically grounded counterevidence: burst/tonic mode switching, driver/modulator asymmetry, and neuromodulatory context have no current attention analogue.

**Critical disqualifier for the strong form:** "Homologous" is the wrong word at every level. The engineering lineage of transformers has no documented biological inspiration in thalamic circuits (Vaswani et al. 2017 makes no such claim). The most defensible framing is **functional convergence on a restricted subspace of computations**, not universal equivalence.

**What would change the verdict toward VINDICATED:**

1. An empirical demonstration that thalamo-cortical outputs match multi-head attention outputs on matched inputs, with quantified residual.
2. Extension of the Granier/Senn mapping to softmax (not just linear) attention.
3. A mechanism for burst/tonic switching within the attention formalism.

**What would change toward REFUTED:**

1. Demonstration that thalamic gating computes a function outside the attention family (e.g., a pure gain-control function with no query-key matching).
2. Evidence that driver/modulator asymmetry is computationally essential and cannot be approximated by any attention variant.

---

## Papers to Read

1. **Granier & Senn (2025)** — "Multihead self-attention in cortico-thalamic circuits." arxiv:2504.06354. _The direct mechanistic mapping paper; key reference for the restricted algorithmic equivalence claim._

2. **Ramsauer et al. (2020)** — "Hopfield Networks is All You Need." arxiv:2008.02217. _Formal proof that modern Hopfield update = transformer attention; the chain from associative memory to attention._

3. **Halassa et al. (2015)** — "Thalamic control of sensory selection in divided attention." Nature 526, doi:10.1038/nature15398. _Experimental demonstration of TRN-mediated selective routing — the biological anchor for the routing claim._

4. **Schmitt et al. (2021)** — "Thalamic circuits for independent control of prefrontal signal and noise." Nature 600, doi:10.1038/s41586-021-04056-3. _Signal/noise decomposition by distinct MD populations; empirical grounding for thalamic active computation._

5. **Bastos et al. (2012)** — "Canonical Microcircuits for Predictive Coding." Neuron 76:695–711, doi:10.1016/j.neuron.2012.10.038. _Thalamic feedforward as prediction-error signal; links to Friston precision-weighting = attention._

6. **Sherman & Guillery (1998)** — "On the actions that one nerve cell can have on another: Distinguishing drivers from modulators." PNAS 95:7121–7126, doi:10.1073/pnas.95.12.7121. _Foundational driver/modulator distinction; the structural asymmetry that attention formalism does not capture._

7. **Sherman (2001)** — "Tonic and burst firing: dual modes of thalamocortical relay." Trends Neurosci 24:122–126, doi:10.1016/S0166-2236(00)01714-8. _Burst/tonic biophysics; the mode-switching mechanism absent from attention models._

8. **Whittington & Behrens et al. (2020)** — "The Tolman-Eichenbaum Machine." Cell 183, PMID:33181068. _Hippocampal memory retrieval as transformer attention; structural precedent for the equivalence argument._

9. **Ellwood (2024)** — "Short-term Hebbian learning can implement transformer-like attention." PLOS Comput Biol, doi:10.1371/journal.pcbi.1011843. _Cortical pyramidal neuron mechanism for Hebbian attention; important limitation: requires 8× LTP, biologically borderline._

10. **Mukherjee & Halassa (2024)** — "The Associative Thalamus: A Switchboard for Cortical Operations." Neuroscientist, doi:10.1177/10738584221112861. _Review framing thalamus as active routing hub; "switchboard" metaphor structurally consistent with attention gating._

---

## Notes for Synthesis

- **The Hopfield bridge is the strongest link.** The Ramsauer (2020) mathematical identity (Hopfield = attention) combined with the long-standing biologically plausible status of Hopfield-type cortical dynamics is the most rigorous path to defending the algorithmic equivalence claim. The debate should be centered here, not on informal analogies.

- **Marr-level precision is essential.** Much apparent disagreement in this literature is a failure to specify which level the equivalence is claimed at. The computational-level weak form and the algorithmic-level restricted form are both defensible; the strong bidirectional algorithmic equivalence is not. Papers frequently slide between levels, which inflates perceived consensus.

- **Driver/modulator asymmetry is the deepest structural disanalogy.** Transformer attention is symmetric: every token can be query, key, or value. The thalamus has an _asymmetric privileged-input_ architecture (drivers set content, modulators set gain). This structural asymmetry would require extending the attention formalism — perhaps to something like cross-attention with frozen keys — to accommodate.

- **Burst/tonic switching is a under-discussed falsification target.** If empirical measurement showed that burst-mode thalamic responses produce outputs that _cannot_ be approximated by any attention weight matrix (due to nonlinear gain distortion), this would be concrete evidence against even the restricted equivalence claim.

- **The claim is most useful as a design principle, not a factual assertion.** The Granier/Senn result and the Ramsauer identity together suggest that building attention-like inductive biases into neuromorphic or hybrid architectures may produce systems with thalamus-like properties. The productive question is not "are they equivalent?" but "what algorithmic primitives do they share, and which are they missing from each other?"
