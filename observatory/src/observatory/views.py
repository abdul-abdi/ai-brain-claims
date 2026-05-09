"""Pure functions over an EventLog.

A `view` returns a working set — the events that would be in active context
right now given a particular importance scorer and a token budget. Tier
membership is a query concern, not a stored place.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from observatory.log import Event, EventLog

# A scorer is a pure function from (log_snapshot, event) -> score in [0.0, 1.0].
# Higher score = more important. Scorers should be deterministic given their args.
Scorer = Callable[[tuple["Event", ...], "Event"], float]


@dataclass(frozen=True, slots=True)
class WorkingSet:
    """A derived view of the log. Pure value, no place.

    Attributes:
        events: events kept in the working set, ordered by their original log step.
        scores: aligned per-event importance scores.
        budget: the token / item budget the view was computed against.
        scorer_name: identifier of the scorer used (for telemetry / replay).
    """

    events: tuple[Event, ...]
    scores: tuple[float, ...]
    budget: int
    scorer_name: str = "anonymous"
    dropped: tuple[Event, ...] = field(default_factory=tuple)

    def __len__(self) -> int:
        return len(self.events)


@dataclass(frozen=True, slots=True)
class Delta:
    """Comparison between two WorkingSets over the same log.

    Used to A/B test scorers against the same historical events without
    re-running the agent.
    """

    kept_by_both: tuple[Event, ...]
    only_a: tuple[Event, ...]
    only_b: tuple[Event, ...]


def view(
    log: EventLog,
    *,
    scorer: Scorer,
    window: int,
    scorer_name: str = "anonymous",
    token_count: Callable[[Event], int] | None = None,
) -> WorkingSet:
    """Compute the working set: the highest-scored events fitting in `window`.

    Args:
        log: the EventLog to view over.
        scorer: pure function (snapshot, event) -> [0,1].
        window: budget in items (default) or tokens (when `token_count` provided).
        scorer_name: identifier for replay / telemetry.
        token_count: optional function returning per-event size; without it,
            `window` is interpreted as a count of events.

    Returns:
        A WorkingSet with kept events, dropped events, and aligned scores.
    """
    snapshot = log.snapshot()
    if not snapshot:
        return WorkingSet(events=(), scores=(), budget=window, scorer_name=scorer_name)

    sized = [(scorer(snapshot, e), e) for e in snapshot]
    # Sort by score descending; on tie, prefer most recent (higher step)
    ranked = sorted(sized, key=lambda x: (-x[0], -x[1].id.step))

    kept: list[Event] = []
    kept_scores: list[float] = []
    used = 0

    for score, event in ranked:
        cost = token_count(event) if token_count else 1
        if used + cost > window:
            continue
        kept.append(event)
        kept_scores.append(score)
        used += cost

    # Restore original log order for the kept events (chronology matters for context).
    kept_pairs = sorted(zip(kept, kept_scores), key=lambda p: p[0].id.step)
    kept_events = tuple(e for e, _ in kept_pairs)
    kept_score_tuple = tuple(s for _, s in kept_pairs)

    dropped = tuple(e for _, e in ranked if e not in kept)

    return WorkingSet(
        events=kept_events,
        scores=kept_score_tuple,
        budget=window,
        scorer_name=scorer_name,
        dropped=dropped,
    )


def compare(a: WorkingSet, b: WorkingSet) -> Delta:
    """Compare two WorkingSets over the same log. A/B test scorers."""
    a_ids = {e.id for e in a.events}
    b_ids = {e.id for e in b.events}

    kept_by_both = tuple(e for e in a.events if e.id in b_ids)
    only_a = tuple(e for e in a.events if e.id not in b_ids)
    only_b = tuple(e for e in b.events if e.id not in a_ids)

    return Delta(kept_by_both=kept_by_both, only_a=only_a, only_b=only_b)
