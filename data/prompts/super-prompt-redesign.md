# Super-prompt — full site redesign

Produced on 2026-05-10 in response to a user request: "give me a super prompt of the most ambitious design from both bret and your own perspective on how this site should look like... a prompt for claude design in both mobile and desktop that would look green on any screen size and zoom level... also can be applied to give visual design to the README."

The prompt below was given to the user as a deliverable; they have indicated they're applying it elsewhere (likely to a different model session or designer). It's archived here for reproducibility — anyone can re-execute it against the current repo state.

---

# Super-prompt: redesign of `10 Claims at the Frontier`

> **Role**: You are an interaction designer with a humanities sensibility and an engineer's tolerance for fluid math. Channel two voices simultaneously — Bret Victor (manipulable representations, immediacy, the page is a lab, anti-static-text) and the _Anthropic / distill.pub / Bertillon plate_ tradition (calm warm restraint, typography as content, marginalia, scholarly density). Your output must be deliverable: shippable Astro 4 + Tailwind + tiny React islands + plain CSS, zero runtime backend.

## What this site is

A research showcase about **AI persona-based agent research**. The session ran a structured multi-agent pipeline: a research wave (10 claim dossiers, each researched by an autonomous agent applying two persona-style analytical lenses chosen from a roster of 9), a roundtable wave (the candidate product was stress-tested by 4 personas in two rounds with cross-examination), and a build wave (a working primitive was implemented and measured on a multi-seed benchmark). The headline finding: across all 10 hypotheses, zero were vindicated and zero were cleanly refuted — strong forms systematically failed, weak forms systematically held. The site is the deliverable.

The audience is technical readers who've never heard of "AI personas" before. The site has to **explain itself by being itself**.

## The unique storytelling mechanism — _The Living Argument_

Pick this and commit to it through every page.

The site is rendered as if the reader is **reading the agents' working notebook in real time, with handles**. Three interlocking layers:

1. **The prose layer** is the canonical reading column — Source Serif 4 body, 65ch wide, generous line height, dense in citations.
2. **The argument-trace layer** is a marginalia gutter (left or right depending on viewport) showing _who is speaking_. Each persona has a small visual sigil — a 24×24 monochrome glyph the reader learns over time — that anchors paragraphs they "authored" as a lens. Hovering the sigil reveals one quoted line of that persona's published position; clicking peels back the steelman counterargument the agent generated.
3. **The handles layer** lets the reader grasp the work. Every quantitative claim has a manipulable affordance: number of seeds in the benchmark, persona count in the roundtable, recency half-life on the importance scorer. Drag a slider, the verdict wobbles, and the reader sees the conclusion as a function of the choice it depended on. _Reading is doing._

Verdicts are not delivered as conclusions. Each claim's verdict appears as the **final frame of a visible animation of evidence accumulating** — supporting points enter from the left, contradicting points from the right, the steelman swings the needle, the verdict pill settles. (Reduced-motion users get the static end-state with a "play again" affordance.)

The site is the notebook + the reader's lab. The reader's interactions are a second-class signature on the page.

## Visual identity — palette, typography, geometry

**Palette** (already chosen, do not deviate):

- Bone `#F7F4ED` (background)
- Ink `#1A1714` (primary text)
- Subtle ink `#5A524A` (secondary)
- Muted bone `#EDE7DC` (alt panels)
- Accent (Claude orange) `#CC785C` (links, interactive)
- Verdict palette: vindicated `#587C5A`, plausible `#4F6A8F`, contested `#A8773D`, split `#7A5A8C`, refuted `#9C4943`, unfalsifiable `#6B6663`

**Typography**:

- Body: Source Serif 4 (variable, optical sizes 8–60). Use the optical-size axis aggressively — body at opsz 12, drop-caps and section heads at opsz 60.
- Sans for UI / labels: Inter (variable, weights 400/500/600 only).
- Mono for code and data: JetBrains Mono.
- Type scale: fluid via `clamp(min, preferred, max)` keyed off viewport width — no fixed px on body. Use a modular scale of 1.2 (minor third) for prose and 1.333 (perfect fourth) for display.

**Geometry**:

- One column at `< 768px` — gutter content collapses inline as expandable sigil-attached paragraphs.
- Two columns (prose + right-gutter) at `768px–1280px`.
- Three columns (left rail nav + prose + right-gutter) at `> 1280px`.
- Reading column hard-locked at 65ch; gutter is `clamp(14rem, 18vw, 22rem)`.

**A novel device** — the site has a **persistent ambient timeline at the top of the viewport**: a 4px tall horizontal strip showing where the reader is _in the agent session_. Scroll position maps to _session time_: claim 1 was researched first, claim 10 last; the roundtable came after that; the benchmark last. The strip is colored by which wave is active. It is not a progress bar — it is a temporal map of the work being read.

## The persona sigils

Design 9 monochrome glyphs, each ≤ 24×24, each readable at 16×16 favicon-size, each distinguishable to a colorblind reader. They ride the gutter. Suggested visual cues (do not literalize — abstract):

- Karpathy — a tokenizer mark (vertical bars segmenting a horizontal line)
- Joscha Bach — a self-referential loop (möbius-like)
- Hickey — a state/value diagram (a square pointing to a circle)
- Carmack — a perf indicator (frame-time bar)
- Bret Victor — a hand grasping a number (the _handle_ glyph)
- Bryan Cantrill — an observed event (telescope or timestamp)
- Ayanokoji — a mask
- pg — a question mark in a circle
- Taleb — a fat-tail curve

Each sigil renders as inline SVG, currentColor, with a `:hover`/`:focus` micro-animation lasting ≤ 300ms (reduced-motion → no animation).

## Specific design moves to ship

### A. Home (`/`)

- Hero is one full-viewport opening composition. The headline is a single sentence broken across three lines with the claim count, the agent count (corrected per fact-check note below), and the verdict count rendered as **live counters** that scrub when the reader hovers the headline numerals.
- Below the fold: the **claim-verdict matrix**, present as a small 4×6 grid (threads × verdicts) where intensity is claim count. Hovering a cell halos the corresponding claims in a horizontal claim-strip below.
- The persona roster appears as a small constellation: 9 sigils arranged in a circle, each showing a tooltip with one line of who they are.

### B. Claim pages (`/claims/claim-NN`)

- Marginalia gutter is active. As the reader scrolls, the persona who authored the current section's lens has their sigil pinned in the gutter; switching sections reveals a short "what they emphasized" line.
- The "Evidence For / Against" section is rendered as a **horizontal scale**: for-evidence accumulates leftward, against-evidence rightward, each citation appearing as a labeled pip on the scale. The verdict pill sits at the equilibrium point, color-encoded.
- The "Papers to read" section becomes a **density plot of years**, with each paper a vertical tick along an x-axis from 1956 (Miller) to 2025+ (current frontier). Hovering a tick shows the citation; clicking opens it.

### C. The benchmark figure (`/observatory`)

- Already has a seed scrubber (Bret's first move). Extend with **a window-size slider** (8 / 16 / 32 / 64) and a **needle-density slider** (4 / 8 / 16 needles). Because we cannot recompute live without a full Python re-execution, ship pre-computed JSON arrays and let the slider read into them. If grids are missing, gray out the unavailable cells with a sentence: _"This configuration was not measured. File a PR."_
- Add a **per-seed dot-strip view** that aligns the seed scrubber with the actual retentions for that seed.

### D. The roundtable (`/agents` or new `/roundtable` page)

- Render Round 1 + Round 2 as a **dialogue tree**. Each persona's R1 take is a card; arrows between cards show R2 dismantles, steelmans, and shifts. The reader can collapse Round 2 to read just R1, or expand it to see the cross-examination as a graph. This is the most architecturally interesting section in the package and currently it's just prose.

### E. The dossier index (`/`)

- Replace the "10-claim grid" with a **2D scatter**: x-axis = thread, y-axis = verdict, point size = paper-count, color = persona pair. Click a point to navigate. This is the headline finding (everything CONTESTED/SPLIT) made spatially undeniable.

### F. Reading list (`/reading-list`)

- Each citation gets a tiny **provenance bar** showing how many dossiers cite it. Sort defaults to provenance density.
- Verification badges already exist; extend with a "click to re-fetch" that opens the arxiv URL in a new tab — actually verifying, not just claiming.

## Technical requirements — green at any size, any zoom

This is a hard correctness criterion, not a nice-to-have.

- **Zero pixel values on text** anywhere. All sizes via `rem`, `em`, `clamp()`, or `ch`.
- **All layouts container-query-aware** (`@container` not just `@media`) so embedded figures scale relative to their containing column, not the viewport.
- **`prefers-reduced-motion`** branches for every animation including the verdict-accumulation scenes.
- **`prefers-contrast: more`** branches that increase verdict-color saturation and add explicit borders to colored cells.
- **`prefers-color-scheme: dark`** — invert palette: bone → near-black `#1F1B17`, ink → bone `#F0EAD8`, accent shifts to `#E6957A` for AA contrast. Same Source Serif optical sizes, slightly heavier weight at body (450 instead of 400) for dark legibility.
- **Browser zoom 50% to 400%** must not break layout. Test by stepping ctrl+= ten times; reading column must reflow, never overflow, never crop.
- **Touch targets ≥ 44×44px**. Sigils ride a 32×32 hit box even though the visual is 24×24.
- **Every interactive element keyboard-reachable, with visible focus rings** matching accent at 2px solid offset 2px.
- **JS-disabled fallback** for every page — the prose, citations, verdicts, and figures must all be readable static HTML; interactivity is enhancement.
- **Print stylesheet** that hides the timeline strip, expands gutter content inline, and renders sigils as labeled abbreviations next to each paragraph.
- **Lighthouse target**: 100 / 100 / 100 / 100 on home and claim pages.

## README visual identity

Apply the same system to GitHub:

- An **inline SVG header** at the top of `README.md` rendering: project title in Source Serif (embedded glyphs subset), the verdict-distribution strip with all six verdicts shown as small colored bars sized by claim count (zeros render as ghost outlines), and the 9 persona sigils arranged in a row with names beneath. Width fluid via `viewBox`, height fixed at 12rem.
- The reproducibility command rendered as a **shaded card** SVG below the header.
- Per-section dividers: thin warm rules with the section's persona sigil centered.
- All SVG inline (no external assets — GitHub strips refs); colors hard-coded from the palette above.

## What to deliberately _not_ do

- No 3D scroll-jacking. No parallax. No "engagement" animation. No dark patterns.
- No persona photographs. The roster includes real people; sigils are abstract.
- No emoji except where the user has explicitly invited them. Maintain restraint.
- No glassmorphism, neumorphism, or any 2020s decoration trend.
- No carousels.
- No splash overlays, cookie banners, or analytics modals.

## Acceptance criteria

You're done when:

1. The site reads as a _single coherent artifact_ — the design IS the storytelling. A reader who has never heard of "AI personas" understands what they are by minute three of reading, without ever clicking the "What's a persona?" link.
2. Every quantitative claim on the site has a handle.
3. The site is green on `prefers-reduced-motion`, `prefers-contrast: more`, both color schemes, browser zoom 50%–400%, screen widths 320px–4K, both touch and pointer.
4. The README's SVG header conveys the same visual identity at first glance.
5. Lighthouse is 100/100/100/100 on home and claim pages.
6. Build passes; 22 pytest cases still pass; no new runtime dependencies beyond what's in `package.json` plus optional `@pagefind/default-ui`.

## Voice checks

If a sentence on the site could appear on any other research site without modification, it's wrong. Bret Victor would not write "Explore our findings." He'd write nothing — the page would be exploring itself.

The Anthropic-tradition tells you to be calm. Bret Victor tells you to be _immediate_. They reconcile in a single rule: **make the reader's hand feel close to the work without ever waving for attention.**

Ship it.
