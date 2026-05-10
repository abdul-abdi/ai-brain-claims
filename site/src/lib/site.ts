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
  { label: "Index", href: "/" },
  { label: "Dossiers", href: "/claims/claim-01" },
  { label: "Roundtable", href: "/roundtable" },
  { label: "Observatory", href: "/observatory" },
  { label: "Reading", href: "/reading-list" },
  { label: "Synthesis", href: "/synthesis" },
  { label: "Paper", href: "/paper" },
  { label: "Agents", href: "/agents" },
  { label: "Reproduce", href: "/reproduce" },
  { label: "Methodology", href: "/methodology" },
  { label: "Notes", href: "/design-notes" },
  { label: "GitHub ↗", href: SITE.repo, external: true },
] as const;
