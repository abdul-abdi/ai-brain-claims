# Idea-research prompts

Three Haiku agents dispatched in Wave 2, after the strongest engineering surface emerged from the 10 dossiers (active forgetting in agent context-window management → "Active Context Hygiene" candidate). No personas. Bounded prior-art / demand / feasibility scope.

Each prompt below was self-contained.

---

## Subagent A — Prior art & competitors

```
You are a research agent for an idea-validation pipeline. The idea: **Active
Context Hygiene for Agent Systems** — a library/service that manages LLM
agent context window as actively-managed memory: scheduled summarization,
importance-weighted pruning, separate retrieval-confidence vs generation-
confidence tracking, two-tier working/consolidated storage. Pitch: "git for
agent context — append-only, importance-pruned, forgettable-by-design."

YOUR JOB: Survey prior art and competitors. What exists today? What's been
tried? What gaps remain?

Run 8–12 web searches. Cover:
1. Direct competitors / similar tools (search: "agent context management
   library", "LLM context pruning", etc.)
2. Memory libraries (verify currency: Mem0, Letta, Zep, claude-mem,
   claude-brain, agentmemory, MemPalace, MemGPT)
3. Framework-built-in approaches (LangGraph, AutoGen, MetaGPT, CAMEL,
   Claude Code, OpenAI Assistants thread management)
4. Academic/research projects 2024–2026
5. What's specifically MISSING — anyone separating retrieval-confidence from
   generation-confidence? "Place vs value" distinction? CLS-style two-tier?

OUTPUT (under 1200 words):
- Existing tools table: name | what they do | what they DON'T do | URL
- The Gap: 3–5 bullets on what's missing across the entire landscape
- Differentiation possibilities: 2–3 concrete angles for ACH
- Killer risks: anyone close enough that we'd be a wrapper

Cite full URLs. GitHub stars + last-commit dates where findable.
```

---

## Subagent B — Market & demand signals

```
You are a research agent for an idea-validation pipeline. The idea: Active
Context Hygiene (above).

YOUR JOB: Find demand signals. Are people actively wanting this? Where's
the pain?

Run 8–12 web searches. Cover:
1. Pain points expressed publicly (HN, Twitter/X, Reddit r/LocalLLaMA,
   r/MachineLearning, r/AI_Agents, GitHub issues): "context window full",
   "agent forgets", "context truncation broke", "lost in the middle",
   "agent loop loses track", "claude code context", "long context degradation"
2. GitHub issue patterns on LangGraph, AutoGen, MetaGPT, Claude Code, AutoGPT
3. Blog posts / essays
4. Survey/benchmark frustrations
5. Adjacent product traction (Mem0 funding, Letta, Anthropic blog, etc.)

OUTPUT (under 1000 words):
- Pain Inventory: 5–8 specific public complaints with source links + dates
- Demand Strength: rate STRONG / MODERATE / WEAK with evidence
- Audience: frontier app devs vs framework maintainers vs hobbyists
- Adjacent Funding/Traction
- Killer signal: any major framework about to ship this themselves?

Cite full URLs.
```

---

## Subagent C — Technical feasibility

```
You are a research agent for an idea-validation pipeline. The idea: Active
Context Hygiene (above).

YOUR JOB: Assess technical feasibility. What's hard? What's solved? What's
the MVP?

Run 8–12 web searches. Cover:
1. Importance-weighted pruning research
2. Summarization-based context compression
3. Confidence tracking in RAG
4. Two-tier memory architectures already shipped (Letta, MemGPT, Mem0)
5. The "missing primitive" — append-only context history with branching
6. Eval frameworks (RULER, BABILong, LongBench, agent context evals)

OUTPUT (under 1200 words):
- Building blocks already solved: 5–8 components off-the-shelf with sources
- Things still hard: 3–5 components needing novel work
- MVP scope: smallest useful version (< 2 weeks of solo dev)
- Differentiation feasibility: rank A=Library / B=Protocol / C=Service by
  tech risk
- Eval bench: cleanest empirical demonstration "this works"

Cite full URLs.
```

---

## Notes

- All three agents ran on Haiku (fast, exploration-grade).
- Outputs were not strictly mutually exclusive — Subagent A's "differentiation feasibility" overlapped with Subagent C's "rank A/B/C" — this overlap was intentional, the three angles surfaced from multiple directions converged on the same conclusion (managed-service angle has the highest tech cost; library angle is feasible-but-undefensible).
- Subagent C's "Differentiation feasibility" output was what later directly informed the angle-research dispatches in Wave 5.
