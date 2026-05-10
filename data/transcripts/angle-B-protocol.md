---
title: "Angle B — Protocol / Open Standard: Deep Research"
type: research-angle
tags: [ai, agents, protocol, standards, network-effects, defensibility]
created: 2026-05-09
verdict: CONDITIONAL
related:
  [
    active-context-hygiene.md,
    active-context-hygiene-roundtable.md,
    angle-A-library.md,
    angle-C-service.md,
  ]
---

# Angle B — Protocol / Open Standard: Deep Research

## The Specific Pitch (Protocol Form)

The pitch: publish a specification — call it the **Context State Protocol (CSP)** — that defines a structured interchange format for agent context lifecycle events. The spec covers:

1. **Event schema**: a typed log record capturing what entered context, when, why, confidence/retrieval score, token cost, and decay parameters
2. **Importance scoring semantics**: a normalized relevance field (0.0–1.0) with provenance (model-assigned, retrieval-similarity, explicit annotation)
3. **Snapshot format**: a portable "context state blob" — the set of active items at a checkpoint, their weights, and eviction history — that can be written by one framework and consumed by another
4. **Operations vocabulary**: INGEST, PROMOTE, DEMOTE, EVICT, CHECKPOINT, RESTORE — mimicking Git's durable model (directly inspired by GCC paper's COMMIT/BRANCH/MERGE/CONTEXT primitives)
5. **Eval harness interface**: a standard hook for measurement tools to observe context transitions without modifying agent behavior

Reference implementations: one in Python (LangChain/LangGraph plugin), one in TypeScript (Vercel AI SDK plugin). The protocol itself is the asset; implementations are proof-of-interoperability. The stewardship play is to donate to a neutral foundation (Linux Foundation/AAIF) once adoption crosses a meaningful threshold, retaining a board seat and building a hosted eval harness on top.

Adoption path: position as the missing layer between MCP (tool/resource connectivity) and A2A (agent-to-agent messaging). Neither addresses context lifecycle management. CSP fills the gap orthogonally to both.

---

## Recent Protocol Outcomes in AI/Agent Space (2024-2026)

**Model Context Protocol (MCP)** is the most instructive data point. Launched by Anthropic in November 2024, it grew from ~100K SDK downloads to 97M+ monthly downloads in twelve months. By April 2026, there are 10,000+ active MCP servers, first-class client support in ChatGPT, Cursor, Gemini, and VS Code, and 1,200 attendees at the first MCP Dev Summit. The protocol was donated to the Linux Foundation's Agentic AI Foundation (AAIF) in December 2025 alongside OpenAI's AGENTS.md and Block's goose. MCP was not simply "released open-source" — it shipped with SDKs in four languages from day one, had Claude as a working reference client, and targeted a concrete gap (tool/data connectivity) that every framework felt.

**Agent2Agent (A2A)**, launched by Google Cloud in April 2025, followed the same pattern: strong vendor backing, concrete problem scope (peer-to-peer agent coordination), Linux Foundation governance by June 2025. It now has 150+ organizations and is in production at major cloud platforms.

**AGNTCY** (Cisco-led, 2025) addressed discovery, identity, messaging, and observability for multi-agent systems. Linux Foundation took custody. AGNTCY now integrates with both A2A and MCP, covering the coordination layer, and has 170+ member organizations in AAIF by April 2026.

**LangChain Agent Protocol** is a narrower spec for standardizing the input/output interface of individual agents. Less ecosystem-wide adoption than MCP or A2A, but influential within the LangChain ecosystem.

**Key pattern**: Every protocol that achieved meaningful adoption in 2024-2026 had (a) a concrete problem scope that existing protocols demonstrably did not cover, (b) vendor credibility at launch (Anthropic, Google, Cisco), and (c) working reference implementations on day one. Protocols launched by neutral parties without vendor anchor struggled to reach escape velocity.

**The context-state gap confirmed**: A detailed comparison of MCP, A2A, LangChain Protocol, and AGNTCY shows that none address context state lifecycle. MCP manages context injection (what goes in), not lifecycle hygiene (what gets pruned, ranked, or checkpointed). A2A tracks session state for coordination, not for memory management. No existing protocol defines importance scoring, eviction policy, snapshot/restore, or context state interchange. This gap is real and unaddressed.

---

## Protocol Economics & Timeline

**Timeline reality check**: MCP is the fastest protocol adoption in AI history and it still took 12 months to reach what most would call "canonical." OpenTelemetry (2019) took 3-4 years to reach 49% production adoption. OAuth 2.0 (2012) took ~3 years for broad library support. GraphQL (open-sourced 2015, Linux Foundation 2019) took 4 years to reach 33% adoption. REST's widespread API use only emerged 10+ years after Fielding's 2000 dissertation, triggered by SOAP's failures.

A realistic ACH context-state protocol timeline: 12-18 months from launch to meaningful framework integration, 3 years to production adoption at scale. MCP's timeline is the exception, not the rule, and it had Anthropic's distribution behind it.

**Stewardship models and sustainability**: Protocol stewardship separates into three models: (1) **Vendor-controlled, later donated** (MCP: Anthropic controlled, then donated to LF/AAIF — fast adoption, neutral ending), (2) **Committee-from-birth** (W3C/IETF: slow, bureaucratic, but durable), (3) **Outsider-academic** (REST: dissertation to defacto standard via industry adoption of the idea, not the spec). The sustainable model for an outsider without vendor anchor is closest to OpenTelemetry: build under CNCF/LF from the start, maintain with a Governance Committee structure that prevents any single-company takeover, attract corporate sponsors (Bloomberg funded OTel stewardship in Q2 2026).

**Funding path**: OpenTelemetry's model is instructive. CNCF provides organizational home and infrastructure. Corporate members (Bloomberg, Google, Microsoft, AWS) contribute engineering and fund mentorship programs. The steward organization may be pre-revenue for 2-3 years. A protocol cannot itself be monetized — the API era proved "once the connection layer is standardized, value doesn't live there." Money lives in the measurement harness, the hosted eval platform, and vertical integrations on top.

---

## The Anthropic-MCP Lesson

MCP's success is not replicable by an outsider on the same terms. Three structural advantages Anthropic had that an ACH protocol founder does not:

1. **Owned the reference client**: Claude was MCP's first client. Every Claude user was already a proof-of-adoption. An outsider has no captive user base.
2. **Infrastructure for distribution**: Anthropic shipped Python and TypeScript SDKs on launch day. The protocol was simultaneously a spec and working software.
3. **Temporal gap**: MCP launched into a genuine vacuum — no tool/data connectivity standard existed. That vacuum closed. The remaining gaps are narrower and more contested.

What a non-Anthropic-led context-state protocol can learn: timing is the variable. The gap in context state interchange exists right now, and no major vendor has claimed it. The window is roughly 12-18 months before either Anthropic extends MCP's spec to cover context lifecycle (their roadmap mentions "better context control" and "session migration"), or a framework like LangGraph simply defines their own de-facto format that becomes canonical by adoption.

The governance move Anthropic made — donating to AAIF early — is the right model. A neutral stewardship structure lowers the barrier for competing frameworks to adopt a spec they don't fear being locked into.

**Critical risk**: If Anthropic extends MCP to cover context state (their November 2025 spec already soft-deprecated the `includeContext` parameter, replacing it with explicit capability declarations), the gap closes before an outsider can plant a flag. MCP already has 97M monthly SDK downloads and would absorb the context-state layer with no friction. This is the highest-probability kill scenario for Angle B.

---

## Outsider-Led Protocol Cases

**REST** (Roy Fielding, 2000): The decisive lesson is that REST succeeded not as a formal spec but as an _idea_ that solved a real problem (SOAP's complexity). Fielding did not campaign for REST adoption — industry pulled it in to escape SOAP. The protocol never had a formal standards body; "RESTful" remains loosely defined. The success mode was: articulate a better architectural style so clearly that practitioners self-adopted. Direct implication: an ACH protocol that is first and foremost a clearly articulated _conceptual model_ — with a formal spec as secondary artifact — has a plausible outsider-adoption path.

**OpenTelemetry** (CNCF, 2019): The strongest analog. OTel succeeded by merging two competing projects (OpenCensus + OpenTracing) under neutral governance, shipping a concrete wire format (OTLP), and attracting major vendor buy-in at formation. The key enabler was that observability tools _needed_ a neutral telemetry standard — it reduced their integration burden. Analogously, agent frameworks all need a neutral context-state format; a common format reduces per-framework implementation burden.

**OAuth** (2010-2012): Community-driven from the start (not vendor-driven), standardized a security pattern that every developer needed. RFC process gave it credibility. Timeline to ubiquity: ~3 years.

**GraphQL** (Facebook-led 2015, LF 2019): Facebook had first-mover advantage as a major consumer. LF neutralization was critical for cross-industry adoption. Without Facebook's credibility at launch, GraphQL would have struggled to displace REST conventions.

**Common pattern**: Outsider protocol success requires (a) a problem so widespread that all players benefit from the solution, (b) working software alongside the spec, (c) neutral governance before competitors feel threatened, and (d) a pull mechanism — practitioners seeking the standard rather than being pushed toward it. The context-state gap qualifies on (a); (b) and (c) are execution choices; (d) is the uncertainty.

---

## Adjacent Active Protocols

**What currently exists for context/memory/state:**

- **MCP Resources**: defines how context is _retrieved_ from external stores, not how it's managed once inside the agent
- **OpenInference** (Arize): extends OpenTelemetry with AI-specific span kinds — CHAIN, LLM, TOOL, RETRIEVER, EMBEDDING, AGENT, RERANKER, GUARDRAIL, EVALUATOR, PROMPT. This is the closest existing adjacent standard. It defines _observation_ of AI operations but not _serialized context state interchange_
- **OpenLLMetry** (Traceloop, proposed for OTel donation February 2025): similar observability instrumentation on top of OTel, focused on tracing, not state interchange
- **LangGraph checkpointing**: a de-facto format within LangGraph for persisting graph state between runs — not a cross-framework standard, but a working implementation of the concept
- **Mem0** (ECAI 2025 paper, arXiv:2504.19413): benchmarks 10 AI memory approaches, focuses on memory architecture comparison, not on interchange format standardization

**Critical finding**: There is no existing open protocol addressing context state _interchange_ — the ability to serialize a running agent's context state in a framework-agnostic format and restore it in a different framework or session. OpenInference observes; LangGraph persists internally; MCP retrieves. The interchange layer is genuinely open.

**The prompt injection gap** in existing protocols (documented in Zylos Research Q1 2026) is also relevant: no protocol standardizes context-level defenses against injection. A CSP that includes integrity fields per context item could address this as a protocol-level primitive — a strong technical motivation for adoption.

---

## GCC Paper as Protocol Substrate

The **Git Context Controller** (arXiv:2508.00031) delivers the strongest empirical foundation available for a context-state protocol. Key facts:

- +13% relative improvement on SWE-Bench Verified over strong long-context baselines
- Achieves >80% success rate, outperforms 26 open and commercial systems
- Core operations: COMMIT (checkpoint), BRANCH (alternative reasoning path), MERGE (trajectory combination), CONTEXT (hierarchical retrieval)
- Organizes agent memory as a "versioned file system" — directly parallel to Git's DAG model
- Implementation is being open-sourced; incorporated at one-context.com

**Protocol substrate potential**: GCC's four operations map cleanly onto a formal protocol schema. COMMIT corresponds to a context CHECKPOINT event; BRANCH corresponds to a FORK event; MERGE to a MERGE event; CONTEXT to a RETRIEVE query. The +13% benchmark result is the kind of empirical proof that gives a standard credibility. A protocol that codifies GCC's model as a formal interchange spec can cite this paper as its performance rationale.

**Standardization status**: The paper mentions no standardization plans. The authors plan to open-source but not to formalize a protocol. The "one-context.com" implementation is a commercial venture, suggesting commercialization intent at the implementation layer, not the protocol layer.

**The gap to bridge**: GCC defines operations, not a wire format or interchange schema. Converting GCC's model into a formal protocol specification — JSON Schema for event records, OpenAPI for the query interface, semantic versioning for the spec — is non-trivial implementation work, but it is tractable. A founder with protocol design experience (IETF RFC authorship, OTel contribution) could produce a credible draft spec in 4-6 weeks.

**Risk**: The GCC authors could themselves define a proprietary format at one-context.com that becomes de-facto standard before an open spec emerges.

---

## Defensibility Through Spec Stewardship

The Anthropic case study is instructive but inverted: Anthropic captures value not _from_ MCP but _through_ MCP (inference revenue, Claude adoption). MCP's donation to AAIF was a strategic move, not a monetization play. Protocol stewardship is a cost center, not a revenue center, for its direct owners.

**How outsider protocol authors actually capture value:**

1. **Hosted measurement tools on top of the spec** — this is the pg play. If you define the measurement standard, you can sell the measurement instrument. OpenInference/Arize raised $70M Series C in February 2025 building an observability platform that happens to implement OTel + their spec. The spec is the loss leader; the platform is the product.
2. **Vertical integration** — the API era lesson: generic connective tissue doesn't monetize; domain specialists do. A CSP steward that also builds a context-quality dashboard for regulated industries (healthcare AI compliance, financial services AI audit trails) can monetize via the vertical product, not the protocol.
3. **Certification and conformance** — standards bodies generate revenue from conformance testing. W3C member dues, CNCF project graduation fees, Linux Foundation membership. These are sustaining revenues (six-to-seven figures annually) not venture-scale outcomes.
4. **First-mover implementation advantage** — spec authors typically ship the reference implementation first and best. Being the reference implementation for a context-state protocol in LangChain and LangGraph (dominant frameworks) creates distribution that compounds.

**When protocol authors can't capture value**: When the spec becomes truly generic infrastructure, it gets absorbed into the frameworks it targeted. LangGraph will add context-state serialization; MCP will extend its spec; neither will pay royalties to a protocol author. This is the base case for any protocol that succeeds.

---

## Engaging the Roundtable Kill Logic for B

**Does the library KILL logic apply to a protocol?**

The roundtable's KILL on the library framing cited: (1) no defensibility — any major framework ships a compatible library in a week; (2) Anthropic-platform-dependence; (3) distribution problem — reaching every framework requires selling to each separately. Each applies differently to a protocol:

- **Defensibility**: A protocol is _less_ defensible than a library at the level of the spec itself (anyone can implement it), but potentially _more_ defensible at the level of spec ownership. REST's constraints were freely implementable; that's what gave REST network effects. If CSP becomes canonical, implementing it is mandatory, not optional — and the canonical spec author has coordination rights over evolution. This is a different defensibility shape than a library, not stronger or weaker in absolute terms.
- **Anthropic-platform dependence**: A protocol is _less_ exposed to this risk than a library, provided governance is neutral from the start. If CSP is stewarded under AAIF/LF from day one (or shortly after), it cannot be absorbed by Anthropic extending MCP without that being a hostile standards-body action — which LF governance prevents. However, if Anthropic extends MCP to cover context state _before_ CSP is formed, the window closes and the protocol never gets the chance to exist.
- **Distribution problem**: A protocol solves this asymmetrically. You only need one compelling reference implementation (LangGraph is likely the right target — dominant for stateful agent workflows) plus the spec document. Other frameworks implement or bridge it, driven by interoperability demand, not by the spec author selling to them.

**Does pg's "ownership of measurement standard" defense work?**

Yes, partially. Pg's eval-benchmark ownership claim is the strongest component of this angle. If CSP defines how context state _quality is measured_ — not just how it is exchanged — the spec becomes an eval harness spec, not just an interchange format. An eval benchmark for context hygiene (did this agent context improve or degrade task performance?) is Lindy in exactly Taleb's sense: measurement survives even when the thing measured changes architecturally.

The practical implementation: CSP version 1.0 defines the interchange format. CSP version 1.1 adds a canonical benchmark suite — a test harness for measuring whether a context management implementation improves task performance. The benchmark, not the format, becomes the moat.

**Does hickey's append-only log + pure-function views architecture support the protocol framing?**

Directly. Hickey's preferred architecture maps onto the protocol with low friction: the CSP event log is append-only; context snapshots are derived views computed over the log. The protocol specifies the log record format and the query interface for views; implementations are pure functions from log state to context state. This is exactly what a well-designed protocol should do — specify the data model, not the computation.

**Residual kill risks for B (not present for A):**

1. **MCP extension risk** (highest probability): Anthropic's own roadmap mentions "better context control" and session state migration. A MCP v2.0 that absorbs context lifecycle management kills the gap before the protocol exists.
2. **No-first-mover problem**: Without a Anthropic-equivalent anchor, the protocol may generate interest but not adoption. 170 AAIF member orgs proves there's appetite for standards, but every one of those orgs is aligned with an existing vendor.
3. **Complexity of the problem**: Context state is harder to standardize than tool/data connectivity (MCP's domain). Importance scoring semantics are model-dependent; eviction policy is framework-dependent; snapshot format must be forward-compatible with architectural changes in underlying models. Getting to a stable spec v1.0 is 12-18 months of focused standardization work.

---

## Verdict

**CONDITIONAL** — with a binary race condition that has roughly <30% favorable odds, making the honest base case CONFIRMS_KILL unless the race is entered immediately.

The protocol angle survives the library kill logic structurally but is gated on a timing race with unfavorable odds.

**Why it survives structurally**: The gap in context state interchange is confirmed — no existing protocol (MCP, A2A, ACP, AGNTCY, OpenInference) addresses context lifecycle management as a formal interchange format. The GCC paper provides empirical substrate (+13% SWE-Bench improvement) that gives a spec credibility. Pg's "own the measurement standard" insight is the strongest defensibility angle — a CSP that defines the eval harness for context quality becomes a moat that survives even if the interchange format layer gets absorbed by MCP.

**The observatory convergence**: Critically, the surviving form of Angle B converges with the observatory framing the roundtable proposed rather than competing with it. Strip away the "protocol is the product" framing and what remains is: an immutable append-only event log (Hickey's model), an eval harness for measurement (pg's moat), and a portable snapshot format (Hickey's pure-function views). That _is_ the observatory. The protocol spec is the distribution mechanism for the observatory's data model — they are complementary, not competing.

**The three conditions for survival**: (1) A v0.1 draft must reach the AAIF working group before the documented Q3 2026 joint MCP/A2A spec work absorbs this layer — this is the binary kill condition with <30% odds for an outsider with no vendor anchor; (2) The first reference implementation must target LangGraph — execution choice, tractable; (3) An eval benchmark module must ship in v1.1 or earlier — design choice, tractable.

**The base case for failure**: Anthropic extends MCP to cover context state in the Q3 2026 joint MCP/A2A specification work (already publicly documented as planned). The 97M monthly MCP SDK download base absorbs the context-lifecycle layer with no friction. An outsider protocol never reaches escape velocity.

**Recommended next step if pursuing B**: Within 60 days, submit a formal gap-analysis RFC to the AAIF working group documenting what MCP/A2A/AGNTCY leave uncovered in context state lifecycle. If AAIF acknowledges the gap and does not assign it to the MCP/A2A joint effort, pursue it. If Anthropic assigns it to the joint effort, the window is confirmed closed — pivot immediately to Angle C (service) or the observatory framing as a standalone product.

---

## Sources

- [Model Context Protocol — Wikipedia](https://en.wikipedia.org/wiki/Model_Context_Protocol)
- [Introducing the Model Context Protocol — Anthropic](https://www.anthropic.com/news/model-context-protocol)
- [A Year of MCP: From Internal Experiment to Industry Standard — Pento](https://www.pento.ai/blog/a-year-of-mcp-2025-review)
- [Donating the Model Context Protocol and establishing the AAIF — Anthropic](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)
- [One Year of MCP — Zuplo](https://zuplo.com/blog/one-year-of-mcp)
- [Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF)](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
- [A2A Protocol Surpasses 150 Organizations — PR Newswire](https://www.prnewswire.com/news-releases/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year-302737641.html)
- [Agent Interoperability Protocols 2026: MCP, A2A, ACP Convergence — Zylos Research](https://zylos.ai/research/2026-03-26-agent-interoperability-protocols-mcp-a2a-acp-convergence)
- [Open Standards for AI Agents: Technical Comparison of A2A, MCP, LangChain Agent Protocol, and AGNTCY — Jin Tan Ruan, Medium](https://jtanruan.medium.com/open-standards-for-ai-agents-a-technical-comparison-of-a2a-mcp-langchain-agent-protocol-and-482be1101ad9)
- [A Survey of Agent Interoperability Protocols (MCP, ACP, A2A, ANP) — arXiv:2505.02279](https://arxiv.org/html/2505.02279v1)
- [Git Context Controller: Manage the Context of LLM-based Agents like Git — arXiv:2508.00031](https://arxiv.org/abs/2508.00031)
- [contexa GitHub (GCC implementation) — swadhinbiswas](https://github.com/swadhinbiswas/contexa)
- [Sustaining OpenTelemetry: Moving from dependency management to stewardship — CNCF](https://www.cncf.io/blog/2026/03/31/sustaining-opentelemetry-moving-from-dependency-management-to-stewardship/)
- [OpenTelemetry for AI Agents: The Missing Observability Standard — AgentMarketCap](https://agentmarketcap.ai/blog/2026/04/07/opentelemetry-ai-agents-observability-standard)
- [OpenInference Specification — Arize AI](https://arize-ai.github.io/openinference/spec/)
- [MCPs: Value Creation, Capture, and Destruction — Lessons from the API Era — Leonis Newsletter](https://leonisnewsletter.substack.com/p/mcps-value-creation-capture-and-destructionlesso)
- [Roy Fielding's Misappropriated REST Dissertation — Two Bit History](https://twobithistory.org/2020/06/28/rest.html)
- [GraphQL Project Governance](https://graphql.org/community/contribute/governance/)
- [State of AI Agent Memory 2026 — Mem0](https://mem0.ai/blog/state-of-ai-agent-memory-2026)
- [Evaluation and Benchmarking of LLM Agents: A Survey — arXiv:2507.21504](https://arxiv.org/html/2507.21504v1)
- [MCP Governance — modelcontextprotocol.io](https://modelcontextprotocol.io/community/governance)
- [Linux Foundation Launches the Agent2Agent Protocol Project](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents)
