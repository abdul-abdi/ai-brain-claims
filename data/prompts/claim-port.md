# Claim-port prompts

Wave 6 (later in the project). Nine Haiku agents dispatched to port the brain-wiki dossiers into site MDX with the site's stricter frontmatter schema. **Claim 9 was hand-ported earlier as the design exemplar; the other 9 dossiers were ported by these agents.**

This wave is the most mechanically translatable in the pipeline. No personas. No new research. The agents performed a structured copy with frontmatter munging and MDX-safe escapes.

---

## Per-agent prompt

Each agent received a prompt of this shape (parameterized per claim):

````
You are porting a research dossier from the user's Brain wiki into a styled
MDX page for an Astro site. This is a mechanical-but-careful content
transformation.

SOURCE (read this in full): `<brain-path>`
EXEMPLAR (read this in full to match the rendering style):
  `/site/src/content/claims/claim-09.mdx`

OUTPUT TARGET (write here): `/site/src/content/claims/claim-NN.mdx`

REQUIRED FRONTMATTER (use these exact values — do NOT improvise):
```yaml
---
title: "<full title>"
number: <NN>
shortTitle: "<short>"
verdict: "<VERDICT>"
personas: ["<Persona A>", "<Persona B>"]
thread: "<thread>"
date: "2026-05-09"
description: "<one-paragraph claim summary>"
tags: [<tags>]
---
````

TRANSFORMATION RULES:

1. Body content: port the full body of the brain dossier. Keep all citations,
   evidence, persona analysis, verdict reasoning, "Papers to Read".
2. Strip duplicated H1 if present (the MDX page renders title from frontmatter).
3. Keep all H2/H3 headings as written.
4. MDX safety: escape any literal `<` followed by a letter or digit
   (e.g. `p<.001`). Wrap in inline code: `` `p<.001` ``.
5. Match the exemplar's tone for the verdict section.
6. Internal links: rewrite `[claim-09.md]` → `/claims/claim-09`; "the
   Observatory" → `[the Observatory](/observatory)`; drop brain-internal paths.
7. DO NOT: invent content; change the verdict; reorder major sections; add
   meta-commentary about porting.
8. Length: should be ~80–95% of the brain dossier word count. Light trims
   of redundant phrases are OK; substantial cuts are NOT.

After writing, return a 100-word confirmation of what you did and any issues
encountered.

```

---

## Why this stage was Haiku, not Sonnet

The transformation is a structured copy with light schema munging. The agent does not need to argue, evaluate, or produce novel content — only translate frontmatter formats and escape MDX-hostile patterns. Haiku is the right cost-quality point for this. The 9 dossiers ported in parallel in ~5 minutes wall-clock.

The MDX-hostile patterns surfaced two real issues (caught in build):

- **claim-03**: literal `p<.001` in prose — MDX parsed `<` followed by `.` as JSX tag opener and crashed the build. Fixed with backtick wrap.
- **claim-05**: literal `p < 0.01` in prose — same issue, same fix.

Both are now documented in `STATUS.md` under "MDX gotchas" and in `CONTRIBUTING.md` for future authors.

---

## Source-of-truth concern

After this port, the **brain dossiers and the site MDX dossiers diverged** as artifacts. The brain originals at `~/Brain/wiki/research/2026-05-09-ai-brain-context/claim-NN.md` are the human-readable archive; the site MDX is the rendered version. **Updates to one do not propagate to the other.**

For future dossier edits:

- Edit the **site MDX** (it's what readers see).
- The brain copy can be updated by the user manually if they want their wiki to reflect the latest.
- A `scripts/sync-from-brain.sh` exists to mirror brain → drafts (one-way; not a continuous sync).

This is acceptable for a v0.1 ship but is the kind of soft-constraint that a reproducer should know about.
```
