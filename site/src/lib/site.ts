// Single source of truth for project identity & site-wide config.
// Renaming the project means changing values here, not chasing strings.

export const SITE = {
  title: "10 Claims at the Frontier",
  tagline: "Adversarial validation at the AI ↔ brain boundary",
  description:
    "Ten ambitious hypotheses about working memory, attention, metacognition, theory of mind, sleep consolidation, forgetting, and the architecture of mind — stress-tested across the AI / context / brain frontier. Plus a working observatory primitive.",
  url: "https://ai-brain-claims.example.com",
  repo: "https://github.com/abdul-abdi/ai-brain-claims",
  author: {
    name: "Abdullahi Abdi",
    role: "Agent Engineer · Nethermind",
  },
  date: "2026-05-09",
  citation: "10 Claims at the Frontier (2026)",
  twitterCard: "summary_large_image",
} as const;

export const NAV = [
  { label: "Read", href: "/" },
  { label: "Claims", href: "/#claims" },
  { label: "Synthesis", href: "/synthesis" },
  { label: "Observatory", href: "/observatory" },
  { label: "Reading list", href: "/reading-list" },
  { label: "GitHub", href: SITE.repo, external: true },
] as const;
