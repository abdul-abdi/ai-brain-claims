# observatory

Active Context Hygiene for agent systems — an immutable event log with importance and confidence as pure functions over the log.

```python
from observatory import EventLog, view, importance, confidence

log = EventLog()
log.append({"role": "user", "content": "hello"})
log.append({"role": "assistant", "content": "hi"})
log.append({"role": "tool", "name": "search", "content": "..."})

# Tier membership is a derived view, not stored state
working = view(log, scorer=importance.recency(), window=4096)

# A/B test scorers against the same log — replay-deterministic
alt = view(log, scorer=importance.task_relevance(query="hello"), window=4096)

# Track retrieval and generation confidence as separate signals
sig = confidence.dissociation(retrieval_score=0.92, generation_score=0.41)
assert sig.diverged()  # the dominant RAG failure mode
```

## Why this shape

- **Immutable log** — every event is a fact. Wrong signals are isolated events, not architectural state. No "point of ruin" where a bad promotion poisons all future reasoning.
- **Pure-function views** — different scorers can be A/B'd against the same historical log. Failure modes become deterministically replayable. Retrospective analysis after new evals or new models works without re-running the agent.
- **Importance is context-relative** — there is no "correct" importance scorer independent of the task. Different scorers are first-class; the choice is exposed, not buried.
- **Retrieval-confidence ≠ generation-confidence** — overconfidence on wrong context is the dominant RAG failure mode. The library surfaces these as separate signals.

The architecture survived a 4-persona roundtable (pg + carmack + taleb + hickey) and 3 dedicated angle-research agents (library / protocol / service). See [the research](https://abdul-abdi.github.io/ai-brain-claims).

## Install

```bash
pip install observatory                 # once published to PyPI
# or:
pip install -e .                        # from a clone
```

## API

```python
EventLog()
EventLog.append(event: dict) -> EventId
EventLog.snapshot() -> tuple[Event, ...]
EventLog.replay(at: EventId | int) -> tuple[Event, ...]
len(log)

view(log, *, scorer, window) -> WorkingSet
compare(working_a, working_b) -> Delta

importance.recency()           -> Scorer
importance.recency_attention() -> Scorer
importance.task_relevance(query: str) -> Scorer
importance.compose(*scorers, weights=None) -> Scorer

confidence.dissociation(retrieval_score, generation_score) -> Signal
Signal.diverged(threshold=0.4) -> bool

eval.ruler_extended(model, task: str) -> EvalResult
```

## Eval

```bash
python -m observatory.eval baseline      # naive truncation
python -m observatory.eval hygiene       # importance-weighted view
python -m observatory.eval compare       # produces eval/results/*.json
```

The result JSON is consumed by the [website](https://abdul-abdi.github.io/ai-brain-claims) to render comparison figures.

## License

MIT.
