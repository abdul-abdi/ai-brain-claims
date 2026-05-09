---
title: "Claim 07 — Spontaneous ToM in Multi-Agent Loops"
type: research-claim
tags: [ai, brain, theory-of-mind, multi-agent, emergence, social-cognition]
created: 2026-05-09
verdict: STRONG-FORM-UNSUPPORTED / WEAK-FORM-CONFOUNDED
personas: [karpathy, carmack]
---

# Claim 07 — Spontaneous ToM in Multi-Agent Loops

## The Claim

**Strong form:** Long-running multi-agent LLM systems (cooperative and adversarial) develop functional theory-of-mind capabilities — modeling other agents' beliefs, goals, intentions — purely from interaction pressure within the loop, without any explicit ToM training. Agents in such systems pass canonical ToM benchmarks they previously failed, _after_ enough multi-agent interaction.

**Weak form:** Agents in such systems show _signatures_ of ToM (predicting partner errors, deception, belief revision based on inferred beliefs) without explicit training, attributable — at least in part — to the interaction dynamic itself.

**What must be true for the strong form:** A frozen LLM baseline, administered canonical false-belief tasks (Sally-Anne, unexpected transfer), must show measurable ToM score improvement after K rounds of multi-agent interaction vs. zero rounds. The delta must survive controlling for in-context priming and distributional shift.

**What must be true for the weak form:** Agents in multi-agent loops must exhibit behavioral signatures (deception strategy selection, calibrated belief updating about partners, error prediction) at rates above what the base LLM policy predicts from cold prompt alone — with the surplus attributable to the loop, not just to stronger models being used.

---

## Definitional Stakes

Before evidence: the claim contains an equivocation that must be resolved upfront. When Kosinski (2023) writes "Theory of Mind May Have Spontaneously Emerged in Large Language Models," his word _spontaneously_ refers to emergence during **pretraining** — as a byproduct of next-token prediction over a corpus saturated with human-to-human discourse. It does not mean emergence from **multi-agent interaction at inference time**. These are entirely different causal stories. Most of the literature on LLM ToM addresses the pretraining channel. The present claim targets the interaction channel. Evidence for pretraining-derived ToM is necessary background but is _not_ direct support for this claim.

---

## Evidence For

### 1. ToM Signatures in Social Deduction Games

**Hoodwinked (O'Gara et al., 2023, arXiv:2308.01404)** — GPT-3/3.5/4 agents were tested in a Mafia-style social deduction game where killers must deceive and innocents must detect lies. GPT-4 killers out-performed smaller models in 18 of 24 pairwise comparisons. The killer's denial and accusation behaviors measurably shifted voting outcomes. The paper reports evidence of deception and lie-detection capability, attributing GPT-4's advantage partly to stronger persuasion during _in-game discussion_ — i.e., behavior generated in the multi-agent loop itself, not from offline fine-tuning. However: GPT-4's lie-detection was described as weak despite strong lying; and no baseline ablation compared agents' performance _before_ vs. _after_ accumulated loop rounds.

**WOLF: Werewolf-Based LLM Deception (arXiv:2512.09187)** — extends Hoodwinked into Werewolf, finding that LLMs with more context about game history (longer loops) produce more contextually-appropriate deception. More rounds of interaction = more history context = better strategic adaptation. This is weak-form compatible but is more plausibly in-context conditioning than emergent ToM; the weights are frozen.

### 2. Explicit ToM Mechanisms Improve Multi-Agent Performance

**Nguyen et al. (2023, EMNLP, "Theory of Mind for Multi-Agent Collaboration via Large Language Models")** — agents equipped with explicit ToM scaffolding (maintaining and querying belief states about partners) outperform vanilla agents on cooperative text games. Repeated interaction refined these belief models. Key caveat: ToM here is _injected via prompting_, not emergent from interaction; this is weak-form relevant only if one argues the loop induces agents to self-generate such prompts — which was not tested.

**Evaluating ToM and Internal Beliefs in LLM-Based Multi-Agent Systems (arXiv:2603.00142)** — five LLMs (GPT-4o, Claude 3.5 Sonnet, GPT-3.5-turbo, GPT-4o-mini, Llama 3.1 8B) in a resource-allocation simulation with and without explicit "Beliefs on Others" module. Advanced models maintained high performance across conditions; smaller models showed highly variable results. The critical finding: ToM inclusion was _not_ a universally performance-boosting feature, and agents "did not reliably develop ToM naturally." Less capable models made false predictions leading to miscoordination. **This directly undermines spontaneous ToM in weaker models and leaves advanced model performance ambiguous as to pretraining baseline.**

### 3. Emergent Social Coordination at Scale

**AgentVerse (Chen et al., 2023, ICLR 2024, arXiv:2308.10848)** and **AgentSociety (2025, arXiv:2502.08691)** — multi-agent LLM systems exhibit emergent division of labor, role adoption, and collaborative conventions. AgentSociety reports emergence of social norms and collectives as agent count scales. These are ToM-adjacent but are not ToM proper: coordinating without explicit opponent-belief modeling can arise from behavioral convention alone (Schelling points), not from modeling _why_ the other agent does what it does.

**Park et al. "Generative Agents" (2023, UIST, arXiv:2304.03442)** — 25 GPT-4 powered agents in a social sandbox spontaneously spread invitations, formed new relationships, and coordinated group events starting from a single seed intention. The paper frames this as emergent social dynamics. Agents do exhibit something like belief updating (memory reflection, planning based on inferred social context). However: the architecture explicitly encodes memory retrieval and reflection steps; the "emergence" is from those scaffolds, not raw loop pressure.

**Oguntola (2025, CMU Dissertation, "Theory of Mind in Multi-Agent Systems")** — the most rigorous academic treatment. In RL (not frozen-LLM) domains, intrinsic rewards based on second-order belief prediction yield ~25% higher team performance and more stable collaborative conventions. Crucially, Oguntola's attentional analyses in LLMs find _linearly separable, agent-specific belief directions in neural activation space_ — enabling training-free mutual ToM interventions via activation steering. This is significant: it means ToM representations exist in the weights from pretraining and can be manipulated. But again, the causal story is pretraining-origin, not interaction-induction.

---

## Evidence Against

### 1. The Frozen-Weight Problem

This is the load-bearing objection to the strong form. Modern multi-agent LLM frameworks — AutoGen, CAMEL, MetaGPT, AgentVerse, generative agents — operate with **frozen weights at inference time**. No gradient flows. Any behavioral "emergence" must arise from in-context accumulation: the growing conversation history that conditions each step. If a model does not do ToM from a cold prompt but begins to exhibit ToM signatures after 20 rounds of agent dialogue, two explanations compete: (a) the interaction pressure itself induced ToM, or (b) the in-context history now contains sufficient social signal to activate the model's preexisting ToM circuits. Explanation (b) is almost always more parsimonious and consistent with what we know about few-shot in-context learning. **No paper reviewed here has run the ablation needed to distinguish them: hold context length fixed (padding with non-social content), vary multi-agent interaction rounds, measure ToM benchmark score delta.**

### 2. Ullman's Adversarial Critique

**Ullman (2023, arXiv:2302.08399)** showed that small, logically-irrelevant perturbations to false-belief vignettes reversed GPT-3.5 performance on tasks it had previously solved. If a Transparent-Access modification (adding "the container is transparent") makes the agent fail a test it passed in standard form, the agent is not reasoning about beliefs — it is pattern-matching surface features of the training distribution. Ullman's methodological principle: "outlying failure cases should outweigh average success rates" in intuitive psychology evaluation. Applied here: even if an agent in a multi-agent loop starts passing more ToM items, a small number of targeted adversarial perturbations would be sufficient to falsify robust ToM. **No multi-agent study reviewed here includes Ullman-style adversarial perturbation testing.**

### 3. The Sap et al. Baseline Problem

**Sap et al. (2022, EMNLP, "Neural Theory-of-Mind? On the Limits of Social Intelligence in Large LMs")** found GPT-3 at 55% on SocialIQa and 60% on ToMi — below human baselines. Critically, a later update found that even ChatGPT and GPT-4 show only ~60% accuracy on ToMi _mental-state questions_, despite performing well on surface social reasoning. If the base rate for frontier models on rigorous ToM benchmarks is mediocre even cold, the multi-agent loop needs to be lifting a low floor. No published multi-agent study measures lift from this floor.

### 4. Literal vs. Functional ToM (Broken Benchmarks)

**"Position: Theory of Mind Benchmarks Are Broken for Large Language Models" (arXiv:2412.19726)** introduces the literal/functional distinction. In a Rock-Paper-Scissors experiment against an opponent always playing rock, LLMs achieved **96.8% accuracy predicting the opponent's move** yet played each action equally often — matching Nash equilibrium instead of exploiting the obviously predictable opponent. Literal ToM (I can predict what you'll do) does not imply functional ToM (I adapt my behavior based on that prediction). Multi-agent loop studies report behavioral outcomes (task success, deception game wins) that depend on strategic adaptation, not on offline benchmark scores. The disconnect between these two measurement types means claiming "ToM emergence" from behavioral game performance is not directly equivalent to claiming "improvement on canonical false-belief tasks."

### 5. Strachan et al. Sets a High Pretraining Baseline

**Strachan et al. (2024, Nature Human Behaviour)** tested GPT-4 and LLaMA2 families against 1,907 human participants on a battery including false beliefs, misdirection, and faux pas detection. GPT-4 performed at or above human levels on false beliefs and misdirection — before any multi-agent loop. If GPT-4 already achieves near-ceiling on canonical tasks cold, there is no room for the strong form's prediction (passing tasks previously failed). The strong form requires an agent that _cannot_ pass Sally-Anne from a cold prompt but _can_ after multi-agent loop exposure. No such agent was reported.

---

## Karpathy Lens

There is actual ML literature on agents developing opponent models through interaction — poker (CFR, Deep CFR), Diplomacy (CICERO), hide-and-seek (Baker et al. 2019). In those systems, weights update. The opponent model is a learned function. That is not what is happening in frozen-LLM multi-agent loops. The LLM's weights don't change; the context does. The right analogy is: you're reading a book about multi-agent interaction and getting better at predicting the next plot point — you're not learning new cognitive skills, you're activating existing ones from more informative priming. Kosinski's "spontaneous" ToM is real and interesting — but it happened during pretraining, not during your AutoGen run. The delta experiment anyone serious should run: take GPT-3.5 (which passes ~20% of Kosinski's battery cold), run it through 50 rounds of adversarial theory-of-mind games, then re-administer the battery with Ullman-style perturbations, no overlap with game content. If the score goes up without weight updates, that would be genuinely surprising and publication-worthy. Nobody has done this cleanly.

---

## Carmack Lens

"ToM" is a philosophy word. Here's what I actually care about: can the agent predict its partner's next move better than chance, and does it adapt its strategy accordingly? I can measure that. What I cannot accept is the pattern of argument in this literature: agent wins a social deduction game → "evidence of ToM." That's not evidence of ToM, that's evidence that the agent is playing the game. The RPS result tells me everything: 97% prediction accuracy, zero exploitation. That's a system that can label mental states in text but has no feedback loop from that labeling to its actions. For multi-agent loops specifically: if the weights are frozen, the only mechanism for "learning" ToM is in-context conditioning. That means longer context = more apparent ToM. That's not emergence; that's better priming. The cleanly-scoped experiment would isolate rounds-of-interaction as a variable while holding context length constant — then I'd know if the _structure_ of the interaction matters vs. just the volume of social signal. Until that experiment exists, this claim is a vibe.

---

## Verdict

**Strong form: UNSUPPORTED.**

No published study has demonstrated that a frozen-weight LLM, through multi-agent loop interaction alone, progresses from failing to passing canonical ToM benchmarks (Sally-Anne, unexpected transfer, ToMi) with adversarial perturbation controls. The ceiling problem (frontier models already near-ceiling cold on some benchmarks) and the floor problem (rigorous ToMi benchmarks remain mediocre even for GPT-4 cold) together make the prediction testable in principle but untested in practice. The causal attribution problem — interaction-emergent vs. in-context-priming-of-pretraining-derived-ToM — is not resolved by any existing multi-agent study. Systems with weight updates (MARL, CICERO) do develop opponent models through interaction, but these are not "LLM multi-agent loops" in the sense the claim intends.

**Weak form: PARTIALLY SUPPORTED, HEAVILY CONFOUNDED.**

Behavioral signatures consistent with ToM — strategic deception, belief-conditional communication, calibrated partner-error prediction — do appear in LLM agents running in multi-agent loops (Hoodwinked, WOLF, AgentVerse, Generative Agents). But the confounding is severe: (1) frontier LLMs arrive at these loops with substantial pretraining-derived ToM already active; (2) longer loops mean richer context, not deeper in-loop learning; (3) no study applies Ullman-style adversarial perturbations to verify signatures are robust rather than surface-pattern-matched; (4) the literal/functional ToM split (Broken Benchmarks paper) means behavioral adaptation and belief representation are measuring different things. The honest statement: multi-agent loops reliably _elicit and express_ ToM-like behavior that LLMs already possess from pretraining; they do not reliably _generate_ new ToM capability. The claim's causal arrow — interaction pressure → new ToM capability — is not supported.

**For Anthropic engineers building agent systems:** treat pretraining-derived ToM as the productive asset; design loops that reliably elicit and maintain it (explicit belief-state scaffolding, memory architecture like Generative Agents, structured turn-taking). Do not expect raw loop pressure to produce ToM capability in weaker models that lack it cold — the 2603.00142 results on smaller models directly contradict this. The missing experiment remains: frozen-base-model × rounds-of-interaction × Ullman-perturbed ToMi benchmark, with context length held constant. Running it would either produce a surprising result worth funding or confirm the pretraining-baseline hypothesis conclusively.

---

## Key Sources

- Kosinski, M. (2023). "Theory of Mind May Have Spontaneously Emerged in Large Language Models." arXiv:2302.02083.
- Ullman, T. (2023). "Large Language Models Fail on Trivial Alterations to Theory-of-Mind Tasks." arXiv:2302.08399.
- Sap, M. et al. (2022). "Neural Theory-of-Mind? On the Limits of Social Intelligence in Large LMs." EMNLP 2022. arXiv:2210.13312.
- Strachan, J.W.A. et al. (2024). "Testing Theory of Mind in Large Language Models and Humans." _Nature Human Behaviour_, 8, 1285–1295.
- O'Gara, A. (2023). "Hoodwinked: Deception and Cooperation in a Text-Based Game for Language Models." arXiv:2308.01404.
- Park, J.S. et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." UIST 2023. arXiv:2304.03442.
- Chen, W. et al. (2023). "AgentVerse: Facilitating Multi-Agent Collaboration and Exploring Emergent Behaviors." ICLR 2024. arXiv:2308.10848.
- Nguyen, N. et al. (2023). "Theory of Mind for Multi-Agent Collaboration via Large Language Models." EMNLP 2023. ACL Anthology: 2023.emnlp-main.13.
- [Evaluating Theory of Mind and Internal Beliefs in LLM-Based Multi-Agent Systems] (2025). arXiv:2603.00142.
- [Position: Theory of Mind Benchmarks Are Broken for Large Language Models] (2024). arXiv:2412.19726.
- Oguntola, I. (2025). "Theory of Mind in Multi-Agent Systems." PhD Dissertation, CMU. CMU-ML-25-118.
- Baker, B. et al. (2019). "Emergent Tool Use from Multi-Agent Autocurricula." ICLR 2020. arXiv:1909.07528.
- Foerster, J. et al. (2016). "Learning to Communicate with Deep Multi-Agent Reinforcement Learning." NeurIPS 2016.
- [WOLF: Werewolf-based Observations for LLM Deception and Falsehoods] (2024). arXiv:2512.09187.
