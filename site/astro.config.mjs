import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import pagefind from "astro-pagefind";

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
