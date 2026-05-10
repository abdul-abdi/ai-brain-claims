# Citation verification prompt

One Haiku agent dispatched on day 2 (2026-05-10) to re-fetch the most load-bearing arXiv references on the site and verify that the cited title and authors match the actual paper.

The output JSON is in `data/verifications/citation-pass-1.json`.

---

## Prompt

```
You are verifying the existence and content of academic / arxiv citations
referenced in a research package. For each item below, use WebFetch on the
canonical source (arxiv.org abstract page, journal DOI, or institutional
page) and report:

1. EXISTS — paper found at the cited identifier
2. TITLE_MISMATCH — paper exists but title differs from cited
3. NOT_FOUND — no paper at this identifier
4. CANNOT_VERIFY — page exists but couldn't extract metadata cleanly

For each, also extract the actual title and authors from the abstract page.

Citations to verify:
1. arxiv:2504.06354 — "From Cortico-Thalamic Circuits to Linear Attention"
   (Granier & Senn 2025)
2. arxiv:2406.10149 — "BABILong" (Kuratov et al. 2024)
3. arxiv:2404.06654 — "RULER" (Hsieh et al. 2024)
4. arxiv:2307.03172 — "Lost in the Middle" (Liu et al. 2023)
5. arxiv:2008.02217 — "Hopfield Networks Is All You Need" (Ramsauer et al.
   2020)
6. arxiv:2207.05221 — "Language Models (Mostly) Know What They Know"
   (Kadavath et al. 2022)
7. arxiv:2308.08708 — "Consciousness in Artificial Intelligence"
   (Butlin, Long, Chalmers et al. 2023)
8. arxiv:2302.08399 — "LLMs Fail on Trivial Alterations to ToM Tasks"
   (Ullman 2023)
9. arxiv:2307.00184 — "Personality Traits in LLMs" (Serapio-García et al.)
10. arxiv:2212.03827 — "Discovering Latent Knowledge in LMs Without
    Supervision" (Burns et al. 2022)
11. arxiv:2508.00031 — "Git Context Controller" (cited as +13% SWE-Bench)
12. arxiv:2507.21509 — Anthropic "Persona Vectors"
13. arxiv:1706.03762 — "Attention Is All You Need" (Vaswani et al. 2017)
14. NeurIPS 2023 / arxiv:2304.15004 — "Are Emergent Abilities a Mirage?"
    (Schaeffer, Miranda & Koyejo 2023)

Use this WebFetch pattern:
WebFetch(url="https://arxiv.org/abs/<id>",
         prompt="Extract the paper's title, all authors, abstract first
                 sentence, and submission date. Return as JSON.")

OUTPUT: a single JSON object with `verifications: [...]` and `summary`.
Return only the JSON.
```

---

## Outcome

- **6 EXISTS** (clean): Hopfield, Kadavath, Ullman, Serapio-García, Burns CCS, Vaswani, Schaeffer
- **7 TITLE_MISMATCH**: most were subtitle shorthands, two were real attribution errors
- **0 NOT_FOUND**: every cited arxiv ID existed
- **0 CANNOT_VERIFY**

The two attribution errors that mattered:

1. **Granier & Senn 2025** — actual title is _"Multihead self-attention in cortico-thalamic circuits"_, not _"From Cortico-Thalamic Circuits to Linear Attention"_ as cited.
2. **Butlin et al. 2023** — David Chalmers is **NOT** an author. Actual co-authors include Bengio, Birch, Frith, et al. The "Butlin, Long, Chalmers et al." attribution was wrong.

Both corrections were applied to `site/src/lib/reading-list.ts` and the corresponding annotations note the change explicitly. See `data/verifications/citation-pass-1.json` for the full structured output.

---

## What was NOT verified

This pass covered the cross-package reading list. It did **not** cover citations that appear only inside individual claim dossiers. There are ~35 additional unique citations in the dossiers; a future verification pass would cover those.

Some dossiers (claims 7 in particular) reference arxiv IDs with future-plausible dates (e.g., 2603.x = March 2026, 2604.x = April 2026) that were not on this verification list because they aren't in the cross-package reading list. **Those citations remain unverified.** A reader contesting verdicts that depend on them should re-fetch independently.
