"""Pure-function views over an EventLog."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from observatory.log import Event, EventLog

Scorer = Callable[[tuple["Event", ...], "Event"], float]


@dataclass(frozen=True, slots=True)
class WorkingSet:
    events: tuple[Event, ...]
    scores: tuple[float, ...]
    budget: int
    scorer_name: str = "anonymous"
    dropped: tuple[Event, ...] = field(default_factory=tuple)

    def __len__(self) -> int:
        return len(self.events)


@dataclass(frozen=True, slots=True)
class Delta:
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
    snapshot = log.snapshot()
    if not snapshot:
        return WorkingSet(events=(), scores=(), budget=window, scorer_name=scorer_name)

    sized = [(scorer(snapshot, e), e) for e in snapshot]
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

    kept_pairs = sorted(zip(kept, kept_scores, strict=True), key=lambda p: p[0].id.step)
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
    a_ids = {e.id for e in a.events}
    b_ids = {e.id for e in b.events}

    return Delta(
        kept_by_both=tuple(e for e in a.events if e.id in b_ids),
        only_a=tuple(e for e in a.events if e.id not in b_ids),
        only_b=tuple(e for e in b.events if e.id not in a_ids),
    )
