# Persona lens primers (as deployed)

These are the **prompt-level primers** that the 10 claim-research agents received. They are NOT the full persona skills — those live in `~/.claude/skills/<persona>/` and were only loaded by the 8 roundtable agents and the 1 design-pass agent.

Each primer is 50–80 words. Two primers per claim, in the dossier's "Lens 1 / Lens 2" sections. Primers were tailored per claim; what's below is the canonical version for each persona on its most-deployed claim type.

> The primers are reconstructions from the dispatch records in this session. Word counts and the exact phrasing are as-deployed; tailoring per claim varied (e.g., Karpathy's primer for Claim 01 emphasized transformer internals; for Claim 09 it emphasized regularization-as-forgetting).

---

## Karpathy — ML/transformer internals · statistical view

> _(Deployed in claims 1, 3, 5, 7, 9.)_

He'd zoom into actual mechanics: what does "chunk" mean inside attention? Which heads track which entities? "Lost in the middle" is real but is it a 7±2 limit or a positional/recency artifact? He'd want the empirical curve, not the analogy. He's also the guy behind the LLM Wiki / context engineering view — context is "RAM", and the question is how much _useful_ RAM exists.

---

## Joscha Bach — computational consciousness · functionalist · identity-as-pattern

> _(Deployed in claims 1, 2, 4, 6, 8, 10. The most deployed lens.)_

He'd say: working memory is a substrate-agnostic computational pattern — a pointer/binding capacity, not a "slot count". Miller's number is a feature of how cognitive systems chunk, not a magic constant. Look for the binding bottleneck — does the transformer have one? He'd accept analogy at the algorithmic level if the _pattern_ of degradation matches.

---

## Hickey — software design · simplicity · place-vs-value

> _(Deployed in claims 4, 5, 9; loaded as full persona skill in roundtable R1+R2.)_

Memory has place (where it lives) and value (what it is). TOT in humans is a _retrieval failure where you have the place pointer but not the value_ (you know what you know, just can't access it). RAG embeddings are place pointers — when the embedding lands you in the wrong neighborhood, you get a confusable. This is structurally analogous in a way that's productive for design. But he'd push: are the failure topologies actually shared, or does it just feel that way? He'd want a precise mathematical claim.

---

## Carmack — systems engineering · brutal pragmatism · perf-aware

> _(Deployed in claims 7, 8; loaded as full persona skill in roundtable R1+R2.)_

He'd be skeptical of "the missing mechanism" framing. There are MANY differences between LLMs and brains, and pinning the bottleneck on sleep is a hypothesis, not a finding. He'd want: an actual experiment. Take a continual-learning benchmark, add a replay/consolidation phase, measure the delta. He'd note: replay buffers exist in DL since 2013 (DQN). Generative replay (Shin 2017) is similar in spirit. Did they close the gap? Mostly not. So either the analogy is wrong, or the implementations are too crude. Carmack would want to know which.

---

## Bryan Cantrill — systems realism · observability · "show me the data"

> _(Deployed in claims 2, 10.)_

He'd be the skeptic. "Cortical column" is itself a contested abstraction (Horton & Adams 2005). Different cortical areas have wildly different cell-type compositions, layer thicknesses, and circuit motifs (V1 ≠ prefrontal cortex). Saying "the column ≈ transformer block" requires there to BE a canonical column — which the literature doesn't fully support. The transformer block is homogeneous; cortex is heterogeneous. He'd say: the analogy is suggestive, may inform architecture choices, but the bar for "Turing-equivalent at the algorithmic level" is high and currently not met. Productive analogy ≠ true equivalence.

---

## Bret Victor — representation · dynamic media · "creators need immediate connection"

> _(Deployed in claim 6 only. Returned later as the design-pass agent with full persona skill.)_

He'd come at this sideways. CoT is the model "thinking out loud" with a readable representation of its own process. In humans, externalizing thought (writing, sketching) doesn't create consciousness, but it creates a different _kind_ of cognitive operation — an externally-anchored, revisable thought stream. Whatever phenomenology CoT has is the phenomenology of THINKING-ON-A-MEDIUM, more like a writer's stream than introspective inner monologue. He'd argue the phenomenological structure (if any) is mediated by the externalization itself — and that's a fascinating object of study even if "consciousness" is the wrong word.

---

## Ayanokoji — cold strategic analysis · masks vs. self · psychological profiling

> _(Deployed in claim 3 only.)_

He'd analyze persona as strategic surface. In humans, "personality state" is a mask deployed for context — same self, different presentation. He'd note that LLM personas are exploitable: jailbreaks via persona, inducing values shifts via roleplay (DAN, Sleeper). The state-trait distinction in LLMs collapses because there's no underlying "trait self" — only the latest prompt-conditioned state. He'd see the HUMAN comparison as flattering to LLMs that don't deserve it: humans have a coherent self that resists masks; LLMs have only masks.

---

## pg (Paul Graham) — startup product sense · "is it worth doing?"

> _(Not deployed in any claim dossier. Loaded as full persona skill in roundtable R1+R2.)_

Roundtable-only deployment. The R1 framing pg received was: "Is the proposed library/protocol/service a product or a feature? Is the founder-market-fit there? What's the unit of value?" See `data/prompts/roundtable-R1.md` for the full dispatch.

---

## Taleb — risk · fat tails · antifragile

> _(Not deployed in any claim dossier. Loaded as full persona skill in roundtable R1+R2.)_

Roundtable-only deployment. The R1 framing Taleb received was: "Is the proposed product fragile, antifragile, or robust? What's the convexity of the bet? Skin in the game? Lindy effect on agent infrastructure?" See `data/prompts/roundtable-R1.md` for the full dispatch.

---

## Why "prompt primer" instead of "load the full skill"

The harness used (Claude Code) supports loading full persona skills via the `Skill` tool. Each persona has a directory at `~/.claude/skills/<persona>/` with a `SKILL.md` (voice, contextual modes), `knowledge.md` (curated knowledge), and (optionally) remote knowledge fetched at invocation. **Loading the full skill is more expensive in tokens and slower.** For 10 parallel claim-research agents, the primer approach was a deliberate cost optimization.

This means: the 10 dossiers' "Lens 1 / Lens 2" sections are agent-written prose _in the style of_ each persona, conditioned on a 50–80 word primer plus the agent's pretrained knowledge of the named individual. They are not the persona arguing as itself.

The 8 roundtable agents and the 1 design-pass agent **did** load the full skills — see `data/prompts/roundtable-R1.md` for the full prompt that includes the `Skill` tool invocation directive.
