"""Retrieval-confidence vs generation-confidence as separate signals."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Signal:
    retrieval: float
    generation: float

    @property
    def gap(self) -> float:
        return self.retrieval - self.generation

    def diverged(self, threshold: float = 0.4) -> bool:
        return abs(self.gap) >= threshold

    def overconfident_on_wrong(self, threshold: float = 0.6) -> bool:
        """High generation-confidence with low retrieval-confidence — the
        dominant RAG failure mode."""
        return self.generation >= threshold and self.retrieval <= 1.0 - threshold


def dissociation(*, retrieval_score: float, generation_score: float) -> Signal:
    if not 0.0 <= retrieval_score <= 1.0:
        raise ValueError(f"retrieval_score must be in [0,1], got {retrieval_score}")
    if not 0.0 <= generation_score <= 1.0:
        raise ValueError(f"generation_score must be in [0,1], got {generation_score}")
    return Signal(retrieval=retrieval_score, generation=generation_score)
