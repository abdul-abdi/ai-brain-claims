# Angle-research prompts (A / B / C)

Wave 5. Three Sonnet agents dispatched after the user pointed out (correctly) that the original three go-to-market angles (Library / Protocol / Service) had not been given dedicated deep research — they had only been touched at a high level by the idea-research wave + the roundtable. Each agent engaged explicitly with the roundtable's KILL logic per angle.

No personas at this stage; the roundtable's persona-grounded conclusions were inputs to these dispatches.

---

## Common framing

Each agent received:

1. The same project context (empirical basis, demand, tech feasibility) as Wave 3.
2. The roundtable's verdict: unanimous KILL of the proposed library, with hickey's architectural restructure as the surviving direction.
3. The four kill-reasons (pg's "wrappers don't become companies", carmack's "integration multiplies failure modes", taleb's "every line of code is an option sold to Anthropic", hickey's "complected concerns").
4. The instruction to engage with whether the kill logic _applies_ to their specific angle — or whether it's structurally different and the angle survives.
5. A required verdict: SURVIVES_KILL / CONFIRMS_KILL / CONDITIONAL.

Each agent did 8–12 web searches scoped to its angle and wrote a ~2000-word dossier.

---

## Angle A — Library middleware

```
You are doing a deep research pass on ONE specific go-to-market angle for an
"Active Context Hygiene" (ACH) idea. Your angle is **A: Library middleware**
— drop-in Python/JS library that wraps an agent loop (LangGraph/AutoGen/
Claude SDK/OpenAI Assistants), providing: importance-weighted active pruning,
retrieval-confidence/generation-confidence dissociation tracking, two-tier
working/consolidated memory, append-only event log with branching, scheduled
consolidation. (Restructured per Hickey's roundtable feedback to: immutable
event log + pure-function views over the log, NOT mutable two-tier storage.)

CONTEXT THAT YOU MUST ENGAGE WITH:
A 4-persona roundtable just delivered a unanimous KILL verdict on the library
framing. The kill reasons were:
1. pg: "Libraries don't become companies"
2. carmack: Integration multiplies failure modes
3. taleb: "Every line of code is an option sold to Anthropic"
4. hickey: Original architecture complected 5 concerns

Your job: deep dive on A specifically — including engaging with whether the
roundtable's KILL logic actually holds.

[8–12 web searches across: library market reality, library-to-product
transitions, library-killed-by-platform-native examples, adjacent context-
management libraries, library defensibility, distribution economics]

OUTPUT (1500–2500 words) with verdict ∈ {SURVIVES_KILL | CONFIRMS_KILL |
CONDITIONAL}.
```

**Result:** CONFIRMS_KILL. Decisive new evidence: Anthropic shipped native persistent memory to Managed Agents on 2026-04-23 (Netflix in production) — 16 days before the session ran. Mem0 owns the library-to-service escape hatch ($24M, AWS exclusive). The library framing was already obsolete by the time of dispatch.

---

## Angle B — Protocol / open standard

Same template, scoped to: defining and evangelizing an interchange format / spec for "agent context state" — schema for events, importance scores, retrieval/generation confidence, log structure — that multiple frameworks adopt for interoperability.

**Result:** CONDITIONAL → base case CONFIRMS_KILL. Real gap exists (no current protocol — MCP, A2A, ACP, AGNTCY, OpenInference — covers context-state lifecycle), but Anthropic's Q3 2026 joint MCP/A2A spec effort threatens to absorb context-state lifecycle within 60 days. Outsider odds <30%. Survival path: submit RFC to AAIF working group within 60 days; binary outcome.

---

## Angle C — Managed service

Same template, scoped to: agents send context state to a managed service that compresses/branches/scores/tracks confidence and returns curated context. Telemetry across customer agent runs as moat.

**Result:** CONDITIONAL → 4 strict gates required. Naive positioning DOA (Anthropic Managed Agents + Mem0/AWS already cover the obvious segments). Surviving niche: model-agnostic, async-telemetry-first, failure-rate-ROI positioning. Realistic ceiling: $5–20M ARR pre-acquisition (Helicone $1M acquired pre-$5M; Portkey $5M ARR best-in-class). Not venture-scale standalone.

---

## Comparative synthesis

After all three angle agents returned, a synthesis pass compared their verdicts. The cross-cutting recommendation was the **observatory** angle — an emergent fourth option that the roundtable surfaced (publish the immutable-log primitive + eval harness as scientific contribution rather than productized library/protocol/service). All three angle agents implicitly endorse this fourth path because it is the substrate that A/B/C would all need anyway.

This is what the package now ships: the observatory.

Full angle dossiers in `data/transcripts/angle-{A,B,C,synthesis}.md`.
