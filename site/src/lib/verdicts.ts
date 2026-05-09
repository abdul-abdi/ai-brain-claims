// Verdict taxonomy — single source of truth for color, label, and ordering.

export type Verdict =
  | "VINDICATED"
  | "PLAUSIBLE"
  | "CONTESTED"
  | "SPLIT"
  | "REFUTED"
  | "UNFALSIFIABLE";

export const VERDICTS: Record<
  Verdict,
  { label: string; color: string; bg: string; description: string }
> = {
  VINDICATED: {
    label: "Vindicated",
    color: "text-verdict-vindicated",
    bg: "bg-verdict-vindicated/10 border-verdict-vindicated/30",
    description: "Strong evidence supports the literal claim.",
  },
  PLAUSIBLE: {
    label: "Plausible",
    color: "text-verdict-plausible",
    bg: "bg-verdict-plausible/10 border-verdict-plausible/30",
    description: "Consistent with evidence; not yet proven.",
  },
  CONTESTED: {
    label: "Contested",
    color: "text-verdict-contested",
    bg: "bg-verdict-contested/10 border-verdict-contested/30",
    description:
      "Mixed evidence, important caveats. Strong form often refuted.",
  },
  SPLIT: {
    label: "Split",
    color: "text-verdict-split",
    bg: "bg-verdict-split/10 border-verdict-split/30",
    description: "Strong form fails or is unfalsifiable; weak form survives.",
  },
  REFUTED: {
    label: "Refuted",
    color: "text-verdict-refuted",
    bg: "bg-verdict-refuted/10 border-verdict-refuted/30",
    description: "Evidence directly contradicts the claim.",
  },
  UNFALSIFIABLE: {
    label: "Unfalsifiable",
    color: "text-verdict-unfalsifiable",
    bg: "bg-verdict-unfalsifiable/10 border-verdict-unfalsifiable/30",
    description: "Interesting but currently untestable.",
  },
};

// Compact summary of all 10 claims — used by home grid.
// Sourced from the synthesis verdict table.
export interface ClaimSummary {
  id: string; // slug, e.g. "claim-01"
  number: number;
  title: string;
  shortTitle: string;
  verdict: Verdict;
  thread: "memory" | "architecture" | "metacognition" | "social";
  personas: [string, string];
  oneLineFor: string;
  oneLineAgainst: string;
}

export const CLAIMS: ClaimSummary[] = [
  {
    id: "claim-01",
    number: 1,
    title: "Magical Number Seven for LLMs",
    shortTitle: "Magical Number Seven",
    verdict: "CONTESTED",
    thread: "memory",
    personas: ["Karpathy", "Joscha Bach"],
    oneLineFor:
      "Effective transformer capacity is far below nominal — BABILong shows 10–20% of context effectively used.",
    oneLineAgainst:
      "N-back tests on transformers reveal continuous logarithmic decline, not a 7±2 cliff.",
  },
  {
    id: "claim-02",
    number: 2,
    title: "Thalamic-Cortical Equivalence",
    shortTitle: "Thalamic-Cortical Equivalence",
    verdict: "CONTESTED",
    thread: "architecture",
    personas: ["Joscha Bach", "Bryan Cantrill"],
    oneLineFor:
      "Granier & Senn (2025) derive a rigorous cortico-thalamic ↔ linear attention mapping.",
    oneLineAgainst:
      "Burst/tonic firing, driver/modulator asymmetry, and neuromodulation break strong homology.",
  },
  {
    id: "claim-03",
    number: 3,
    title: "Persona-Induced State Differentiation",
    shortTitle: "Persona States",
    verdict: "CONTESTED",
    thread: "social",
    personas: ["Karpathy", "Ayanokoji"],
    oneLineFor:
      "Anthropic's Persona Vectors are causal linear directions in activation space.",
    oneLineAgainst:
      "No CFA on behavioral outputs against human Big-Five state model; 20% scale shifts from item reordering.",
  },
  {
    id: "claim-04",
    number: 4,
    title: "Emergent Metacognition Threshold",
    shortTitle: "Metacognition",
    verdict: "SPLIT",
    thread: "metacognition",
    personas: ["Joscha Bach", "Hickey"],
    oneLineFor:
      "Anthropic's concept-injection 2025 shows ~20% mechanistic introspective access.",
    oneLineAgainst:
      "Schaeffer et al. (NeurIPS 2023) shows phase transitions are mostly metric artifacts.",
  },
  {
    id: "claim-05",
    number: 5,
    title: "RAG Tip-of-the-Tongue Phenomenon",
    shortTitle: "RAG TOT",
    verdict: "CONTESTED",
    thread: "memory",
    personas: ["Hickey", "Karpathy"],
    oneLineFor:
      "Persistent confusables, FOK dissociation, and recovery dynamics share structural signatures.",
    oneLineAgainst:
      "Mechanism inversion: TOT is form-access failure with semantic intact; RAG is the opposite.",
  },
  {
    id: "claim-06",
    number: 6,
    title: "Chain-of-Thought Phenomenology",
    shortTitle: "CoT Phenomenology",
    verdict: "SPLIT",
    thread: "metacognition",
    personas: ["Joscha Bach", "Bret Victor"],
    oneLineFor:
      "GWT-style functional signatures; Butlin/Long/Chalmers indicator framework operationalizes.",
    oneLineAgainst:
      "IIT 4.0 predicts near-zero Φ for transformers; CoT faithfulness fails systematically (Manuvinakurike 2025).",
  },
  {
    id: "claim-07",
    number: 7,
    title: "Spontaneous ToM in Multi-Agent Loops",
    shortTitle: "Spontaneous ToM",
    verdict: "REFUTED",
    thread: "social",
    personas: ["Karpathy", "Carmack"],
    oneLineFor:
      "Behavioral ToM signatures appear in Hoodwinked, AgentVerse, generative agents.",
    oneLineAgainst:
      "Frozen weights → no gradient flow → 'growth' must be in-context accumulation, not new capability.",
  },
  {
    id: "claim-08",
    number: 8,
    title: "Sleep-Consolidation Is the Missing Mechanism",
    shortTitle: "Sleep Consolidation",
    verdict: "SPLIT",
    thread: "memory",
    personas: ["Joscha Bach", "Carmack"],
    oneLineFor:
      "CLS framework + Diekelmann & Born causal evidence + brain-inspired replay (van de Ven 2020).",
    oneLineAgainst:
      "7 years of progressively faithful replay implementations close some, not most, of the gap.",
  },
  {
    id: "claim-09",
    number: 9,
    title: "Active Forgetting as Capability",
    shortTitle: "Active Forgetting",
    verdict: "SPLIT",
    thread: "memory",
    personas: ["Hickey", "Karpathy"],
    oneLineFor:
      "Agent context-window management is the one place where active forgetting is empirically a capability lever.",
    oneLineAgainst:
      "Post-hoc machine unlearning damages capabilities; gradient ascent breaks general competence.",
  },
  {
    id: "claim-10",
    number: 10,
    title: "Cortical Column ≈ Transformer Block",
    shortTitle: "Cortical Column",
    verdict: "SPLIT",
    thread: "architecture",
    personas: ["Joscha Bach", "Bryan Cantrill"],
    oneLineFor:
      "Hopfield-attention equivalence (Ramsauer 2020) is the strongest formal brain-AI bridge.",
    oneLineAgainst:
      "Cortical column itself is a contested empirical unit (Horton & Adams 2005).",
  },
];

export const THREADS: Record<
  ClaimSummary["thread"],
  { label: string; description: string; claims: number[] }
> = {
  memory: {
    label: "Memory & Context",
    description:
      "LLMs are place-oriented memory systems with shallow effective capacity and no native consolidation/forgetting machinery.",
    claims: [1, 5, 8, 9],
  },
  architecture: {
    label: "Architecture & Computation",
    description:
      "Brain ↔ transformer mappings hold at the algorithmic level on a restricted subspace; strong 'homology' claims fail.",
    claims: [2, 10],
  },
  metacognition: {
    label: "Metacognition & Self-Model",
    description:
      "LLM self-models are real but shallow; the legible CoT trace cannot be trusted as a window into them.",
    claims: [4, 6],
  },
  social: {
    label: "Social & Identity",
    description:
      "What looks like emergent social cognition is mostly pretraining-derived capability being elicited, not generated.",
    claims: [3, 7],
  },
};
