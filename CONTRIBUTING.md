# Contributing

Thanks for considering a contribution. This repo ships two surfaces — the research dossiers and the observatory primitive — and contributions are welcome to both.

## Where to start

- **Disagree with a verdict?** Open an issue with the dossier you're contesting + the specific evidence (paper, citation, experimental result) that should change the verdict. The bar is the same as the verdict-issuing standard: explicit primary sources.
- **Found a bad citation?** PR welcome. Several dossiers reference 2025–2026 arXiv papers that may be agent-generated; verification is a real contribution.
- **Have a new claim?** Open an issue with the strong/weak form formulation and 3–5 candidate primary sources for and against.
- **Have a new importance scorer or benchmark?** PR to `observatory/src/observatory/importance.py` or `eval/benchmarks/`.

## Site

```bash
cd site
npm install
npm run dev          # http://localhost:4321
npm run build        # static export to dist/
npm run typecheck    # astro check
```

Content lives in `site/src/content/claims/*.mdx` and the typed lookup tables in `site/src/lib/`. The exemplar for a styled claim page is `claim-09.mdx` (Active Forgetting). Frontmatter schema lives in `src/content/config.ts` — claim pages must validate against it.

### MDX gotchas

The MDX parser treats `<` followed by a letter, digit, or `.` as a JSX tag opener. Inline statistical notation breaks builds. Wrap such content in inline code:

- ❌ `For p<.001 we observed...`
- ✅ ``For `p<.001` we observed...``

## Observatory (Python)

```bash
cd observatory
pip install -e ".[dev]"
pytest -q            # 22 currently passing
ruff check .
mypy .
```

The library follows a pure-functional shape: scorers and views never mutate the log. New scorers in `importance.py` should be functions returning `Scorer` (a callable); add a test in `tests/test_views.py` confirming determinism over the same log.

## Eval

```bash
python -m observatory.eval baseline      # naive truncation
python -m observatory.eval hygiene       # importance-weighted view
python -m observatory.eval compare       # writes baseline-vs-hygiene.json
```

To wire a new benchmark, drop a script under `eval/benchmarks/` that imports observatory and writes a JSON result into `eval/results/`. The site picks up `site/src/data/baseline-vs-hygiene.json` (manually copied for now; CI deployment uses the file as committed).

## Commit style

`<type>: <description>` — feat, fix, refactor, docs, test, chore, perf, ci. No attribution lines.

## License

By contributing you agree to license your contributions under MIT.
