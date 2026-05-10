# Roundtable: Should we build "Active Context Hygiene for Agent Systems"?

**Date:** 2026-05-09
**Participants:** pg (startup/product), carmack (systems engineering), taleb (risk/fragility), hickey (information model / simplicity)
**Mode:** Full (Round 1 + Cross-Examination + Synthesis)

## Project Context

Pitch: "git for agent context — append-only history, importance-pruned working set, forgettable-by-design." A Python library wrapping an agent loop with importance-weighted active pruning, retrieval/generation confidence dissociation tracking, two-tier working/consolidated memory with auto-promotion/demotion, append-only event log with git-style branching, scheduled consolidation.

Grounded in a 10-claim adversarial AI↔brain research package completed earlier today (`~/Brain/wiki/research/2026-05-09-ai-brain-context/`) — claims 1, 5, 8, 9 converge on agent context hygiene as the highest-leverage engineering surface. Demand validated ($24M Mem0 round, production incidents at Claude Code/LangGraph/AutoGen, Stanford/RULER 30%+ accuracy degradation). Tech feasibility credible (1-2 week MVP). Defensibility weak (composes off-the-shelf primitives; Anthropic could ship native in 0-6 months; "git for agent context" framing already taken by Git Context Controller arxiv:2508.00031 +13% SWE-Bench).

## Round 1: Independent Takes

### pg — KILL with benchmark pivot

> "Kill it — not because the problem is wrong, but because this is a library, and libraries don't become companies."

PG's frame: the proposal correctly identifies a real problem (Claude Code #28984, 20-hour subagent deaths), then proposes to solve it with the lowest-defensibility artifact possible. The "wrapper-not-product trap" listed as a risk deserves to be the _premise_. Libraries get forked, absorbed, or shipped as a three-line dependency.

The interesting pivot: **eval-benchmark ownership** as defensibility moat is the right instinct, but it points away from a library. If nobody knows how to measure intra-session context quality — no agreed benchmark, no leaderboard — then the valuable thing is the benchmark, not the library. Be the standard. Papers cite it. Frameworks optimize against it. Model providers care.

What would flip to BUILD: a concrete answer to "who are the first ten users? Are you in Slack threads with them now watching their 20-hour subagent jobs die?" If yes, ship embarrassingly simple version (single function call: prune by recency + task-relevance) and iterate from user pain.

> "This reads like someone reasoned their way to a product rather than lived their way to one. The research is real. The risks are accurately enumerated. But accurate risk enumeration is a sign you've been thinking, not building."

### carmack — KILL the library framing, run the experiment

Empirical basis is real (BABILong, RULER, Lost-in-the-Middle, production incidents). But the architecture is "a layer cake of complexity stacked on top of complexity," and integration of N proven-in-isolation components doesn't multiply benefits — you get the intersection of their worst failure modes plus new interaction bugs.

Critical missing number: **what does importance-weighted pruning cost in latency at inference time?** If 50ms per agent step, you've traded a context problem for a latency problem. Anthropic has direct access to attention patterns and can do importance scoring with far less overhead than any external wrapper.

The "things still hard" list — unified importance signal — is mislabeled as a secondary problem. It's THE primary problem. Without a reliable importance signal, the whole pruning architecture makes wrong decisions confidently.

> "Verdict: KILL the 'library' framing. Run the experiment instead. Build the smallest possible version that isolates ONE hard question: does importance-weighted active pruning preserve accuracy better than naive truncation on a 5-step agent loop, at what latency cost? Ship that eval harness in a week."

### taleb — KILL library, BARBELL research

> "What you are describing is not a product. It is a collection of reasonable-sounding patches applied to a system you do not control."

Taleb's frame: concave payoff, negative convexity, bounded upside, unbounded downside. Anthropic shipping native context management is not a tail risk — it's the modal outcome.

> "A Phoenician trader does not open a stall inside a competitor's warehouse and call it a business. Every line of code you write is an option sold to Anthropic — they capture the value when they natively implement what you prototyped... picking up pennies in front of Anthropic's steamroller."

The "git for agent context" framing: charming the way a beautiful proof of a wrong theorem is charming. Git solves deterministic version control; transformer attention is continuous, stochastic, context-dependent. Aesthetically pleasing, epistemically empty. Already taken by Git Context Controller (+13% SWE-Bench).

ONE convex thing in the proposal: the empirical research layer. BABILong measurements, Lost-in-the-Middle, retrieval-confidence dissociation tracking — that's real and durable.

> "Build the OBSERVATORY, not the patch kit. Publish the eval framework. Become the people who measure context degradation rigorously. Evals are Lindy. The measurement survives even when the thing being measured changes. That is a convex position. KILL the library. BARBELL the research."

### hickey — RESTRUCTURE significantly

> "The proposal names five concerns in one breath: importance scoring, confidence dissociation, two-tier storage, event log branching, scheduled consolidation. That's not a design. That's a list of mechanisms that _feel_ related... Feeling related and being inseparable are different things. We've complected them."

Hickey's frame: ask the foundational question — what is your information model? An agent processes observations over time. Each observation is a fact — immutable. Attention patterns are facts. The inference that something is "important" is a _derived value_. None of these are places needing updates.

The append-only event log is correct — it's a value sequence. But the importance scorer mutating tier promotion brings place-oriented programming back through the side door. Two paradigms braided together.

> "Why do you need TIERS at all as a runtime concern? Tiers are a _query concern_. Given an immutable log of events, you can always derive 'what's in working memory right now' by querying with an importance function and a window. Tiers are a _view_ of the log, not a separate storage layer. Compute them when you need them. Don't maintain them."

His architectural prescription: kill two-tier storage as runtime primitive. Keep append-only log. Make importance scoring and confidence tracking PURE FUNCTIONS over the log. Tier membership = derived, lazy, computed view. Scheduled consolidation = function returning a compressed summary value, appended to the log as a new fact.

The "git" framing is misleading: git models _diff intention_; agent log is a _fact stream_. Different complexity model.

> "Build this: an immutable event log with derived, functional views. Keep scoring and confidence as pure functions you pass in. That's composable. That's a library, not a framework."

## Round 2: Cross-Examination

### pg → DISMANTLE Taleb / STEELMAN Hickey / NO SHIFT

PG dismantled Taleb's "every line of code is an option sold to Anthropic":

> "That's a great sentence and it's almost completely wrong. The same logic would have killed Stripe... The fact that a platform vendor _could_ natively implement what you're building is not a fatal argument against building it. It's the standard condition for every developer tool ever made... Calling it 'concave payoff, negative convexity' is doing a lot of work without actual math behind it. The payoff on API layer businesses is not concave — it's bimodal. Most fail, a few win big."

PG steelmanned Hickey beyond his original framing:

> "Importance is always _relative to a query_. It's not a property of a piece of information; it's a property of a pair (information, query). A system that computes importance at write time and promotes chunks to working memory is making bets about what future queries will care about. Those bets will be systematically wrong at precisely the worst moments — the long-tail, the surprising, the novel. The immutable log plus functional views approach doesn't just simplify the architecture. It defers the importance judgment until you actually know what you're looking for. That's not just cleaner code. It's epistemically better."

SHIFT: No on KILL the library. Yes on what to _measure_: "the benchmark needs to test _when deferred importance scoring beats eager scoring_, and by how much. That's actually an interesting empirical question that nobody has good numbers on. The measurement framing Taleb endorsed isn't just a fallback — it might be the _actual_ research contribution here."

### carmack → DISMANTLE Taleb / STEELMAN Hickey / PARTIAL SHIFT

Carmack dismantled Taleb's framing:

> "Taleb's entire argument rests on 'you don't control the platform' — okay, neither did id Software control the DOS/Windows platform, neither did anyone control the Linux kernel when they built critical infrastructure on top of it. 'Build on top of something you don't control' isn't automatically a concave position... The reason to build the eval framework isn't fat-tail convexity. It's that evals are the actual scientific contribution. The business argument and the research argument happen to point the same direction, but Taleb's Phoenician trader metaphor smuggled in a conclusion the underlying argument doesn't fully support."

Carmack steelmanned Hickey with a stronger argument: pure-function scoring over an immutable log = **deterministic replay**. "When your agent gets into a bad state — wrong context, lost track of a constraint — you need to reproduce it. With two-tier mutable storage, you're debugging a runtime state that you can't reconstruct deterministically. With an immutable log and pure scoring functions, you can replay any past context window derivation exactly." A/B test scoring strategies against historical event logs without re-running the agent.

SHIFT: Partial on the eval angle. "The missing number isn't just 'does importance-weighted pruning preserve accuracy vs. naive truncation at what latency cost' — it's 'does a pure-function scoring approach over an immutable log give you the same or better accuracy as a mutable two-tier system, while being deterministically replayable?' If yes, that's a clean result: you get the research benefit and you get the engineering benefit simultaneously."

### taleb → DISMANTLE Carmack / STEELMAN Hickey / NO SHIFT

Taleb dismantled Carmack's experimental framing:

> "Carmack chose the wrong question. The hard question is not 'does pruning beat truncation at 5 steps?' The hard question is 'does this architecture _survive_ at 500 steps when the agent loop has accumulated correlated errors in its importance scores?' The 5-step benchmark is the turkey experiment — it builds confidence precisely in the regime where the catastrophe hasn't happened yet. You're measuring success in Mediocristan, then deploying in Extremistan."

Taleb steelmanned Hickey by raising the architecture to ergodicity:

> "The tier-promotion decision becomes a _point of ruin_. If your importance scorer makes a wrong promotion decision at step 47 of a 200-step agent run, that error is now baked into the 'consolidated' tier and propagates forward. You've converted a recoverable error into a structural one. The append-only log doesn't have this property — wrong signals are isolated events, not architectural state. This is precisely the ergodicity argument applied to software... The immutable log + functional views is not just elegant — it's _antifragile in exactly the right dimension_."

SHIFT: None. "The patch kit is concave. The observatory is convex."

### hickey → DISMANTLE Carmack / STEELMAN Taleb / SHARPENED, NO SHIFT

Hickey dismantled Carmack's "integration multiplies failure modes" claim:

> "That's true of complected components. It is not true of composed independent concerns. The argument conflates two fundamentally different things. If you braid five things together into one mutable hairball, yes — you inherit all failure modes. But if each concern is a pure function over immutable data, composition is just function application. The interaction bugs Carmack fears arise from _shared mutable state between components_, not from having five concerns."

Hickey steelmanned Taleb at the level of correctness, not business:

> "The reason importance scoring is the unsolved problem — Carmack notices it, doesn't explain it — is that importance is _context-relative_. It cannot be a property of an event in isolation. It is a property of an event _with respect to a query_ or a future task. This means there is no correct importance scorer independent of an evaluation harness that knows what tasks the agent will face. The only thing that generalizes across agent implementations is the measurement framework... Taleb's 'observatory over patch kit' is not a business argument. It's a correctness argument about what the research problem actually is."

SHIFT: No, sharpened. "The benchmark pivot from PG and Taleb doesn't contradict the immutable log + functional views architecture. It _requires_ it. You cannot have a benchmark without a canonical representation of what happened. You cannot compare approaches without a shared fact substrate. The log is not an alternative to the observatory — the log is the foundation on which the observatory is built." Latency concern dissolves if decomposed correctly because consolidation is scheduled, not on the critical path.

## Synthesis

### Convergence

1. **All 4 panelists KILLED the proposed library architecture as stated.** Unanimous on this. Even Hickey, who offered a restructure, was killing the original architecture — not endorsing a build of what was proposed.

2. **Hickey's information model is the strongest architectural thread.** PG, Carmack, and Taleb all explicitly steelmanned Hickey in Round 2 — not their own positions. PG raised it to "epistemically better" (importance is query-relative). Carmack raised it to "deterministic replay" + A/B testing scoring strategies historically. Taleb raised it to "antifragile / ergodic" (no point of ruin in tier promotion). Hickey himself sharpened: the log architecture _enables_ rather than competes with the benchmark.

3. **The valuable contribution is research/eval/observatory, not a productized library.** PG (benchmark as defensibility), Carmack (eval harness as the experiment), Taleb (publish the observatory). Hickey unifies: the immutable log is the substrate; the eval framework is the scientific instrument built on top.

4. **The "git for agent context" framing is wrong.** Unanimous. Already taken (Git Context Controller +13% SWE-Bench), wrong metaphor (git = diff intention; agent = fact stream), aesthetically pleasing but epistemically empty.

5. **The hard problem is unsolved**: importance scoring with a unified signal that generalizes. Carmack flags it; Hickey explains _why_ (importance is context-relative, only generalizes via evaluation infrastructure).

### Divergence

**1. Where to start (4-way fork):**

| Persona | Starting move                                                                 | What they value            |
| ------- | ----------------------------------------------------------------------------- | -------------------------- |
| pg      | Talk to first 10 users with dying jobs; ship embarrassingly simple version    | Founder-market-fit         |
| carmack | Ship eval harness in a week; isolate one hard question                        | Empirical validation first |
| taleb   | Refuse to ship a library; only the observatory/eval framework                 | Lindy / convex position    |
| hickey  | Ship the immutable log + functional views as the right primitive; eval on top | Technical correctness      |

The user's core decision: do you start with users (pg), with the experiment (carmack), with evals only (taleb), or with the right primitive (hickey)?

**2. Is "build on Anthropic's platform" a knockout argument?**

- **Taleb**: yes — concave payoff, options sold to Anthropic.
- **PG + Carmack** (converged in R2 against Taleb): no — same logic would have killed Stripe / id Software / every Linux infrastructure project. It's normal API-layer business risk, not a knockout. Bimodal outcome distribution, not concave.

**3. Is the 5-step experiment the right one?**

- **Carmack**: yes, smallest version that isolates the question.
- **Taleb**: no — Mediocristan thinking, "turkey experiment" before the 500-step catastrophe.
- **Hickey**: latency concern dissolves if decomposed correctly (consolidation off critical path).

### Blind Spots

1. **Founder fit was not engaged.** PG flagged "are you in Slack threads with users whose jobs are dying?" but no panelist engaged with whether this matches the asker's strengths and current obligations. The roundtable was about product/architectural fit, not founder fit. The asker is at Nethermind on agent infrastructure work.
2. **Anthropic-internal angle.** The proposal could be a contribution _inside_ Anthropic (research, library, SDK extension) rather than as an external library. The 10-claim research framing assumed "Anthropic engineer building agent systems" as the reader. Nobody on the panel engaged with whether the asker has access to that path.
3. **Open-source vs commercial conflated.** Panelists argued past each other on "feature vs product" without disambiguating commercial-product vs OSS-reference-implementation. An OSS reference implementation + benchmark could be a high-value research contribution independent of monetization.
4. **The pivot is more aligned with the source research than the original proposal.** The 10-claim package's meta-finding was that strong forms fail and weak forms (algorithmic-level analogies, productive-on-restricted-subspace) survive. The "publish the observatory" pivot maps directly onto this: the productive contribution is the _measurement framework_, not the implementation.

### Decision Map

- **If you prioritize SCIENTIFIC CONTRIBUTION**: ship the immutable-log primitive + eval harness as OSS. This is the strongest signal across the panel — Hickey + Carmack architectural convergence + PG + Taleb business/correctness convergence. Publish the benchmark for the field. ~1-2 weeks for the primitive, ~1-2 months for the harness with credible evals.
- **If you prioritize STARTUP-VIABLE PRODUCT**: kill it. The roundtable says this isn't a venture-scale opportunity unless framing shifts substantially. PG offered a path: founder-market-fit via talking to real users with dying jobs first; only build after that grounding produces a coherent unit of value. Taleb's caution stands.
- **If you prioritize PERSONAL LEARNING / OWN AGENT QUALITY**: build the smallest immutable-log + eval harness for your own use (~1 week per Carmack). Use it on your own agent workflows. Generates the empirical data PG demands and the experiment Carmack wants, with no commercial commitment.
- **Regardless of direction**: the proposed two-tier mutable storage architecture is **wrong**. Whatever you build, build it on Hickey's information model — append-only log + pure-function views. The "git for agent context" framing should be dropped (already taken, wrong metaphor).

## Gap Analysis

Two genuine gaps were not addressed by the panel composition:

1. **No "user research" persona** to push deeper on PG's founder-market-fit concern (could be addressed by /persona-builder for someone like Cassidy Williams or Steve Krug, or running this past actual agent-product builders).
2. **No "open-source steward" persona** to engage with the OSS-reference-implementation path independently of commercial defensibility (could be addressed via someone like Linus Torvalds or DHH).

The panel's strongest signal is sufficient to act on without filling these gaps: kill the library, build the observatory.
