export const SITE = {
  title: "10 Claims at the Frontier",
  tagline: "Adversarial validation at the AI ↔ brain boundary",
  description:
    "Ten ambitious hypotheses about working memory, attention, metacognition, theory of mind, sleep consolidation, forgetting, and the architecture of mind — stress-tested across the AI / context / brain frontier. Plus a working observatory primitive.",
  url: "https://abdul-abdi.github.io/ai-brain-claims",
  repo: "https://github.com/abdul-abdi/ai-brain-claims",
  author: {
    name: "Abdullahi Abdi",
    role: "Agent Engineer · Nethermind",
  },
  date: "2026-05-09",
  citation: "10 Claims at the Frontier (2026)",
  twitterCard: "summary_large_image",
} as const;

const RAW_BASE = (import.meta.env?.BASE_URL ?? "/") as string;
export const BASE = RAW_BASE.replace(/\/$/, "");

export function u(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("#")) return path;
  return `${BASE}${path.startsWith("/") ? path : "/" + path}`;
}

export const NAV = [
  { label: "Read", href: "/" },
  { label: "Paper", href: "/paper" },
  { label: "How it was made", href: "/agents" },
  { label: "Claims", href: "/#claims" },
  { label: "Synthesis", href: "/synthesis" },
  { label: "Observatory", href: "/observatory" },
  { label: "Reading list", href: "/reading-list" },
  { label: "Reproduce", href: "/reproduce" },
  { label: "GitHub", href: SITE.repo, external: true },
] as const;
