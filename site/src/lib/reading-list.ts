export type VerificationStatus =
  | "verified"
  | "verified-with-correction"
  | "verified-by-name"
  | "unverified";

export interface Reference {
  authors: string;
  year: number;
  title: string;
  venue: string;
  link?: string;
  arxiv?: string;
  doi?: string;
  annotation: string;
  loadBearing?: boolean;
  verification: VerificationStatus;
}

export interface ReadingThread {
  key: "memory" | "architecture" | "metacognition" | "social";
  label: string;
  description: string;
  refs: Reference[];
}

export const READING_LIST: ReadingThread[] = [
  {
    key: "memory",
    label: "Memory & Context (Claims 1, 5, 8, 9)",
    description:
      "Working memory, retrieval failure, sleep consolidation, active forgetting — convergent on 'LLMs as place-oriented memory systems with no native consolidation.'",
    refs: [
      {
        authors: "Miller, G. A.",
        year: 1956,
        title: "The Magical Number Seven, Plus or Minus Two",
        venue: "Psychological Review 63(2)",
        annotation: "The original. Read before believing any 7±2 LLM analogy.",
        loadBearing: true,
        verification: "verified-by-name",
      },
      {
        authors: "Cowan, N.",
        year: 2001,
        title: "The magical number 4 in short-term memory",
        venue: "Behavioral and Brain Sciences 24",
        annotation:
          "The revision. 4±1 is the better human number once chunking is controlled for.",
        verification: "verified-by-name",
      },
      {
        authors: "Liu, Lin, Hewitt, Paranjape, Bevilacqua, Petroni & Liang",
        year: 2023,
        title: "Lost in the Middle: How Language Models Use Long Contexts",
        venue: "TACL",
        arxiv: "2307.03172",
        link: "https://arxiv.org/abs/2307.03172",
        annotation:
          "The positional U-curve. ~30% accuracy drop on mid-context relevant info.",
        verification: "verified",
      },
      {
        authors: "Hsieh, Sun, Kriman, Acharya, Rekesh, Jia, Zhang & Ginsburg",
        year: 2024,
        title:
          "RULER: What's the Real Context Size of Your Long-Context Language Models?",
        venue: "arXiv",
        arxiv: "2404.06654",
        link: "https://arxiv.org/abs/2404.06654",
        annotation: "Multi-needle benchmark. Effective vs. nominal context.",
        verification: "verified",
      },
      {
        authors:
          "Kuratov, Bulatov, Anokhin, Rodkin, Sorokin, Sorokin & Burtsev",
        year: 2024,
        title:
          "BABILong: Testing the Limits of LLMs with Long Context Reasoning-in-a-Haystack",
        venue: "NeurIPS Datasets & Benchmarks",
        arxiv: "2406.10149",
        link: "https://arxiv.org/abs/2406.10149",
        annotation: "10–20% effective utilization finding.",
        verification: "verified",
      },
      {
        authors: "McClelland, McNaughton & O'Reilly",
        year: 1995,
        title:
          "Why there are complementary learning systems in the hippocampus and neocortex",
        venue: "Psychological Review 102",
        annotation:
          "The CLS framework. Still the best architectural recipe for two-tier memory.",
        loadBearing: true,
        verification: "verified-by-name",
      },
      {
        authors: "Diekelmann & Born",
        year: 2010,
        title: "The memory function of sleep",
        venue: "Nature Reviews Neuroscience 11",
        annotation:
          "Two-phase consolidation evidence; causal role of sharp-wave ripples.",
        verification: "verified-by-name",
      },
      {
        authors: "van de Ven, Siegelmann & Tolias",
        year: 2020,
        title:
          "Brain-inspired replay for continual learning with artificial neural networks",
        venue: "Nature Communications 11",
        annotation: "State-of-the-art neuro-inspired continual learning.",
        verification: "verified-by-name",
      },
      {
        authors: "Brown & McNeill",
        year: 1966,
        title: "The 'Tip of the Tongue' Phenomenon",
        venue: "Journal of Verbal Learning & Verbal Behavior 5",
        annotation:
          "The original TOT paper. Form/content separation is the load-bearing distinction.",
        verification: "verified-by-name",
      },
      {
        authors: "Bourtoule et al.",
        year: 2021,
        title: "Machine Unlearning",
        venue: "IEEE S&P",
        annotation: "Starting point for the unlearning literature.",
        verification: "verified-by-name",
      },
    ],
  },
  {
    key: "architecture",
    label: "Architecture & Computation (Claims 2, 10)",
    description:
      "Brain ↔ transformer mappings hold at the algorithmic level on a restricted subspace; the strong 'homology' claims fail.",
    refs: [
      {
        authors:
          "Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser & Polosukhin",
        year: 2017,
        title: "Attention Is All You Need",
        venue: "NeurIPS",
        arxiv: "1706.03762",
        link: "https://arxiv.org/abs/1706.03762",
        annotation: "Required reading.",
        verification: "verified",
      },
      {
        authors: "Ramsauer, Schäfl, Lehner, Seidl et al.",
        year: 2020,
        title: "Hopfield Networks is All You Need",
        venue: "NeurIPS",
        arxiv: "2008.02217",
        link: "https://arxiv.org/abs/2008.02217",
        annotation:
          "Modern Hopfield = attention. The strongest formal brain–AI bridge.",
        loadBearing: true,
        verification: "verified",
      },
      {
        authors: "Granier & Senn",
        year: 2025,
        title: "Multihead self-attention in cortico-thalamic circuits",
        venue: "arXiv",
        arxiv: "2504.06354",
        link: "https://arxiv.org/abs/2504.06354",
        annotation:
          "Maps cortico-thalamic circuits to linear attention. The newest most-important brain-AI paper in this package. (Title corrected from earlier shorthand 'From Cortico-Thalamic Circuits to Linear Attention' on 2026-05-10.)",
        loadBearing: true,
        verification: "verified-with-correction",
      },
      {
        authors: "Horton & Adams",
        year: 2005,
        title: "The cortical column: a structure without a function",
        venue: "Phil. Trans. R. Soc. B 360",
        annotation:
          "The skeptical paper. Read before any 'column ≈ block' analogy.",
        loadBearing: true,
        verification: "verified-by-name",
      },
      {
        authors: "Sherman & Guillery",
        year: 1998,
        title:
          "On the actions that one nerve cell can have on another: distinguishing 'drivers' from 'modulators'",
        venue: "PNAS 95",
        annotation:
          "Driver/modulator asymmetry that breaks symmetric attention QKV homology.",
        verification: "verified-by-name",
      },
      {
        authors: "Bastos et al.",
        year: 2012,
        title: "Canonical Microcircuits for Predictive Coding",
        venue: "Neuron 76",
        annotation:
          "Closer to a residual stream with layer specialization than to multi-head lateral attention.",
        verification: "verified-by-name",
      },
    ],
  },
  {
    key: "metacognition",
    label: "Metacognition & Self-Model (Claims 4, 6)",
    description:
      "LLM self-models are real but shallow; the legible CoT trace cannot be trusted as a window into them.",
    refs: [
      {
        authors: "Kadavath, Conerly, Askell et al.",
        year: 2022,
        title: "Language Models (Mostly) Know What They Know",
        venue: "arXiv (Anthropic)",
        arxiv: "2207.05221",
        link: "https://arxiv.org/abs/2207.05221",
        annotation: "Foundational behavioral metacognition paper.",
        verification: "verified",
      },
      {
        authors: "Schaeffer, Miranda & Koyejo",
        year: 2023,
        title: "Are Emergent Abilities of Large Language Models a Mirage?",
        venue: "NeurIPS 2023",
        arxiv: "2304.15004",
        link: "https://arxiv.org/abs/2304.15004",
        annotation: "Read this before believing any phase-transition claim.",
        loadBearing: true,
        verification: "verified",
      },
      {
        authors: "Burns, Ye, Klein & Steinhardt",
        year: 2022,
        title:
          "Discovering Latent Knowledge in Language Models Without Supervision",
        venue: "arXiv",
        arxiv: "2212.03827",
        link: "https://arxiv.org/abs/2212.03827",
        annotation: "CCS, mechanistic introspection.",
        verification: "verified",
      },
      {
        authors: "Huang et al.",
        year: 2024,
        title: "Large Language Models Cannot Self-Correct Reasoning Yet",
        venue: "ICLR 2024",
        annotation:
          "The self-correction limit. Intrinsic self-correction often degrades.",
        verification: "verified-by-name",
      },
      {
        authors:
          "Butlin, Long, Elmoznino, Bengio, Birch, Constant, Deane, Fleming, Frith, Ji, Kanai, Klein, Lindsay, Michel, Mudrik, Peters, Schwitzgebel, Simon & VanRullen",
        year: 2023,
        title:
          "Consciousness in Artificial Intelligence: Insights from the Science of Consciousness",
        venue: "arXiv",
        arxiv: "2308.08708",
        link: "https://arxiv.org/abs/2308.08708",
        annotation:
          "The major paper applying multiple consciousness theories to LLMs. (Author list corrected on 2026-05-10 — Chalmers is not an author; Bengio and Birch are among the actual co-authors.)",
        loadBearing: true,
        verification: "verified-with-correction",
      },
      {
        authors: "Albantakis et al.",
        year: 2023,
        title:
          "Integrated information theory (IIT) 4.0: Formulating the properties of phenomenal existence in physics, computation, and biology",
        venue: "PMC10581496",
        annotation: "IIT 4.0 — predicts near-zero Φ for transformers.",
        verification: "verified-by-name",
      },
    ],
  },
  {
    key: "social",
    label: "Social & Identity (Claims 3, 7)",
    description:
      "What looks like emergent social cognition in LLMs is mostly pretraining-derived capability being elicited, not generated.",
    refs: [
      {
        authors:
          "Serapio-García, Safdari, Crepy, Sun, Fitz, Romero, Abdulhai, Faust & Matarić",
        year: 2023,
        title: "Personality Traits in Large Language Models",
        venue: "arXiv",
        arxiv: "2307.00184",
        link: "https://arxiv.org/abs/2307.00184",
        annotation:
          "Reliable psychometric measurement in instruction-tuned models.",
        verification: "verified",
      },
      {
        authors: "Chen, Arditi, Sleight, Evans & Lindsey",
        year: 2025,
        title:
          "Persona Vectors: Monitoring and Controlling Character Traits in Language Models",
        venue: "arXiv",
        arxiv: "2507.21509",
        link: "https://arxiv.org/abs/2507.21509",
        annotation:
          "Mechanistic confirmation that traits are causal linear directions in activation space. (Earlier shorthand attribution as 'Anthropic Persona Vectors' was overbroad — only one of the five authors is at Anthropic; corrected 2026-05-10.)",
        loadBearing: true,
        verification: "verified-with-correction",
      },
      {
        authors: "Ullman",
        year: 2023,
        title:
          "Large Language Models Fail on Trivial Alterations to Theory-of-Mind Tasks",
        venue: "arXiv",
        arxiv: "2302.08399",
        link: "https://arxiv.org/abs/2302.08399",
        annotation:
          "Required counter-reading to Kosinski 2023. Adversarial-perturbation critique.",
        loadBearing: true,
        verification: "verified",
      },
    ],
  },
];

export const ALL_REFS: Reference[] = READING_LIST.flatMap((t) => t.refs);
