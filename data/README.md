# `data/` — reproducibility archive

This directory exists so the package can be reproduced and contested without trusting the site's prose. Every load-bearing quantitative claim and every persona deployment is mapped to a file here.

> The agents in this session ran inside the Claude Code harness with web-search tools enabled. Reproducing exactly requires that harness; reproducing the methodology requires only the prompts in `prompts/` and an LLM with comparable tool access.

## Contents

```
data/
├── README.md                   ← you are here
├── index.md                    ← claim → artifact map
├── prompts/
│   ├── claim-research-template.md
│   ├── persona-lens-primers.md
│   ├── idea-research-prompts.md
│   ├── roundtable-R1.md
│   ├── roundtable-R2.md
│   ├── roundtable-synthesis.md
│   ├── angle-research.md
│   ├── citation-verification.md
│   ├── claim-port.md
│   ├── design-pass.md
│   └── super-prompt-redesign.md
├── transcripts/
│   ├── roundtable.md           ← full R1 + R2 + synthesis (mirror of ~/Developer/roundtables/2026-05-09-active-context-hygiene.md)
│   ├── idea-doc.md             ← the pivoted idea, with status/killed_by/pivot
│   ├── angle-A-library.md
│   ├── angle-B-protocol.md
│   ├── angle-C-service.md
│   └── angle-synthesis.md
├── verifications/
│   └── citation-pass-1.json    ← 14-paper verification, 2026-05-10
└── manifests/
    └── pipeline.json           ← every agent dispatch in the main session
```

## How to read this

If you want to **contest a verdict**: open the corresponding claim MDX (`site/src/content/claims/claim-NN.mdx`) and the matching dossier in the brain wiki — the dossier lists the persona lenses applied. Use `prompts/persona-lens-primers.md` to see the exact framing each lens received. File a verdict-contest issue with primary-source evidence.

If you want to **re-run a research stage**: the prompt templates in `prompts/` are the actual prompts used. Substitute your model and tool harness. The 50–80 word lens primers in `persona-lens-primers.md` were the only persona signal the 10 claim agents received; the roundtable agents additionally loaded full persona skills via Anthropic's skill registry, which is harness-specific.

If you want to **verify a citation**: see `verifications/citation-pass-1.json` for the 14 load-bearing references re-fetched on 2026-05-10. Each entry shows cited title vs. actual title, cited authors vs. actual authors, and a status flag.

If you want the **observatory benchmark numbers**: see `eval/results/needle-retention.json` (real measured) and re-run with `python -m eval.benchmarks.needle_retention --seeds 10`. Numbers are deterministic per seed.

## What's NOT in this archive

- **The web search results** themselves. Each claim agent ran 8–12 searches; the search queries and result URLs were not logged in a structured form during the session. This is the largest reproducibility gap.
- **The full agent execution traces** (model thoughts, intermediate tool calls). Available in the harness logs at `/private/tmp/claude-501/.../tasks/*.output` for the duration of the session, but these are ephemeral and have been rotated.
- **The Bret Victor design-pass implementation diff**. The prompt is in `prompts/design-pass.md`; the resulting code is the commit that introduced `MultiSeedFigure.tsx` seed-scrubber + `ClaimsExplorer.tsx` + `/design-notes` (commit `b2b1a84`).

## Honest caveats

- Persona lens primers are reconstructed from dispatch records, not extracted from a separate registry. They are ≤ 80 words each and were embedded in the agent prompts.
- The 10 claim-research agents loaded **prompt-level** persona primers; only the 8 roundtable agents and the 1 design-pass agent loaded the full persona skills. See `/agents` on the site for the deployment table.
- The data here is a **reconstruction** in the sense that prompts existed in transient agent dispatches; they are presented in the form they were sent.
- Some of these prompts contain Claude-specific tool references (`Skill`, `WebFetch`, `WebSearch`, `Agent`). Reproducing on a different harness requires translating those.
