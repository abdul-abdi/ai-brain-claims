/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        bone: {
          50: "#FBFAF6",
          100: "#F7F4ED",
          200: "#EDE7DC",
          300: "#E0D9C9",
        },
        ink: {
          900: "#1A1714",
          800: "#2C2823",
          700: "#3D3832",
          600: "#5A524A",
          500: "#807565",
          400: "#A89C88",
        },
        accent: {
          DEFAULT: "#CC785C",
          50: "#FAEFE9",
          100: "#F2D8CC",
          500: "#CC785C",
          600: "#B8624A",
          700: "#964F3C",
        },
        verdict: {
          vindicated: "#587C5A",
          plausible: "#4F6A8F",
          contested: "#A8773D",
          split: "#7A5A8C",
          refuted: "#9C4943",
          unfalsifiable: "#6B6663",
        },
      },
      fontFamily: {
        serif: [
          "Source Serif 4",
          "Source Serif Pro",
          "Charter",
          "Georgia",
          "serif",
        ],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        prose: ["1.125rem", { lineHeight: "1.7", letterSpacing: "0" }],
        "prose-lg": ["1.25rem", { lineHeight: "1.65" }],
        sidenote: ["0.85rem", { lineHeight: "1.5" }],
      },
      maxWidth: {
        prose: "65ch",
        wide: "78rem",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.ink.800"),
            "--tw-prose-headings": theme("colors.ink.900"),
            "--tw-prose-links": theme("colors.accent.600"),
            "--tw-prose-bold": theme("colors.ink.900"),
            "--tw-prose-quotes": theme("colors.ink.700"),
            "--tw-prose-quote-borders": theme("colors.accent.500"),
          },
        },
      }),
      animation: {
        "fade-in": "fade-in 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 320ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
