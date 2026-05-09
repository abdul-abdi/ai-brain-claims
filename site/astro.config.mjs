import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import pagefind from "astro-pagefind";

// NOTE: sitemap integration removed for first-ship — re-add once a real domain
// is set via `npm install @astrojs/sitemap` and the integrations array.
// pagefind also runs only after a real build with content; comment-out if it
// causes friction on `npm run dev`.

export default defineConfig({
  site: "https://abdul-abdi.github.io",
  base: "/ai-brain-claims",
  trailingSlash: "ignore",
  integrations: [
    mdx(),
    react(),
    tailwind({ applyBaseStyles: false }),
    pagefind(),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "min-light", dark: "min-dark" },
      wrap: true,
    },
  },
  build: {
    format: "directory",
  },
});
