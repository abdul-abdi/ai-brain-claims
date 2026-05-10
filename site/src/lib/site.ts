// Single source of truth for project identity & site-wide config.
// Renaming the project means changing values here, not chasing strings.

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

// Prefix internal absolute paths with Astro's BASE_URL so links work whether
// the site is deployed at the root (custom domain) or under a subpath (GitHub
// Pages project site at /<repo>/).
const RAW_BASE = (import.meta.env?.BASE_URL ?? "/") as string;
export const BASE = RAW_BASE.replace(/\/$/, "");

/**
 * Build an internal URL. Pass external URLs (http(s)://) through unchanged.
 *   u("/observatory")        → "/ai-brain-claims/observatory"
 *   u("https://...")         → "https://..."
 */
export function u(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("#")) return path;
  return `${BASE}${path.startsWith("/") ? path : "/" + path}`;
}

export const NAV = [
  { label: "Read", href: "/" },
  { label: "Claims", href: "/#claims" },
  { label: "Synthesis", href: "/synthesis" },
  { label: "Observatory", href: "/observatory" },
  { label: "Reading list", href: "/reading-list" },
  { label: "Search", href: "/search" },
  { label: "GitHub", href: SITE.repo, external: true },
] as const;
