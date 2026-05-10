"""Importance scorers: pure functions (snapshot, event) -> [0, 1]."""

from __future__ import annotations

import math
from collections.abc import Iterable

from observatory.log import Event
from observatory.views import Scorer


def recency(half_life_steps: int = 8) -> Scorer:
    def _score(snapshot: tuple[Event, ...], e: Event) -> float:
        if not snapshot:
            return 0.0
        delta = snapshot[-1].id.step - e.id.step
        if delta < 0:
            return 0.0
        return math.exp(-math.log(2) * delta / max(1, half_life_steps))

    _score.__name__ = f"recency(half_life_steps={half_life_steps})"
    return _score


def role_priority(weights: dict[str, float] | None = None) -> Scorer:
    default_weights = {
        "system": 1.0,
        "user": 0.85,
        "assistant": 0.7,
        "tool": 0.5,
        "verifier": 0.95,
    }
    table = {**default_weights, **(weights or {})}

    def _score(snapshot: tuple[Event, ...], e: Event) -> float:
        return float(table.get(str(e.payload.get("role", "")), 0.5))

    _score.__name__ = f"role_priority({sorted(table.items())})"
    return _score


def task_relevance(query: str) -> Scorer:
    """Query-anchored Jaccard scorer. Defers importance until query is known."""
    q_tokens = _tokenize(query)

    def _score(snapshot: tuple[Event, ...], e: Event) -> float:
        text = _extract_text(e.payload)
        if not text:
            return 0.0
        e_tokens = _tokenize(text)
        if not q_tokens or not e_tokens:
            return 0.0
        intersection = len(q_tokens & e_tokens)
        union = len(q_tokens | e_tokens)
        return intersection / union if union else 0.0

    _score.__name__ = f"task_relevance(query={query[:32]!r})"
    return _score


def recency_attention(
    half_life_steps: int = 8,
    role_weights: dict[str, float] | None = None,
) -> Scorer:
    return compose(
        recency(half_life_steps=half_life_steps),
        role_priority(weights=role_weights),
        weights=(0.7, 0.3),
        name="recency_attention",
    )


def compose(
    *scorers: Scorer,
    weights: Iterable[float] | None = None,
    name: str = "composite",
) -> Scorer:
    """Linear combination of scorers, clipped to [0, 1]."""
    scorer_list = list(scorers)
    if not scorer_list:
        raise ValueError("compose() requires at least one scorer")

    if weights is None:
        weight_list = [1.0 / len(scorer_list)] * len(scorer_list)
    else:
        weight_list = list(weights)
        if len(weight_list) != len(scorer_list):
            raise ValueError("weights length must match number of scorers")
        total = sum(weight_list)
        if total <= 0:
            raise ValueError("weights must sum to a positive value")
        weight_list = [w / total for w in weight_list]

    def _score(snapshot: tuple[Event, ...], e: Event) -> float:
        s = sum(w * sc(snapshot, e) for w, sc in zip(weight_list, scorer_list, strict=True))
        return max(0.0, min(1.0, s))

    _score.__name__ = name
    return _score


def _tokenize(text: str) -> set[str]:
    return {t for t in (s.strip(".,!?;:\"'()[]") for s in text.lower().split()) if t}


def _extract_text(payload: dict) -> str:
    for key in ("content", "text", "body", "message"):
        v = payload.get(key)
        if isinstance(v, str):
            return v
        if isinstance(v, list):
            return " ".join(str(x) for x in v)
    return str(payload)
