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

/** Primary navigation — kept short. Secondary pages live in the footer. */
export const NAV = [
  { label: "Index", href: "/" },
  { label: "Dossiers", href: "/claims/claim-01" },
  { label: "Roundtable", href: "/roundtable" },
  { label: "Observatory", href: "/observatory" },
  { label: "Reading", href: "/reading-list" },
  { label: "Paper", href: "/paper" },
  { label: "GitHub ↗", href: SITE.repo, external: true },
] as const;

/** Secondary navigation — surfaced in the footer. */
export const NAV_SECONDARY = [
  { label: "Synthesis", href: "/synthesis" },
  { label: "How it was made", href: "/agents" },
  { label: "Methodology", href: "/methodology" },
  { label: "Reproduce", href: "/reproduce" },
  { label: "Design notes", href: "/design-notes" },
  { label: "Search", href: "/search" },
] as const;
