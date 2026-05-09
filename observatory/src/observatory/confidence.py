"""Retrieval-confidence vs generation-confidence as separate signals.

Overconfidence on wrong-retrieved context is the dominant RAG failure mode.
The library surfaces these as *separate* signals so callers can detect
divergence and trigger verification before acting on bad context.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Signal:
    """Confidence dissociation signal between retrieval and generation."""

    retrieval: float
    generation: float

    @property
    def gap(self) -> float:
        """Signed difference. Positive = retrieval more confident than generation."""
        return self.retrieval - self.generation

    def diverged(self, threshold: float = 0.4) -> bool:
        """True when retrieval and generation confidence differ enough to suspect.

        The dominant RAG failure mode: high retrieval-confidence + low
        generation-confidence (the model can't make sense of what was retrieved)
        OR low retrieval-confidence + high generation-confidence (the model is
        confabulating from nothing).
        """
        return abs(self.gap) >= threshold

    def overconfident_on_wrong(self, threshold: float = 0.6) -> bool:
        """Surfaces the specific failure mode: model confidently uses bad context.

        High generation-confidence with low retrieval-confidence.
        """
        return self.generation >= threshold and self.retrieval <= 1.0 - threshold


def dissociation(*, retrieval_score: float, generation_score: float) -> Signal:
    """Construct a confidence dissociation signal."""
    if not 0.0 <= retrieval_score <= 1.0:
        raise ValueError(f"retrieval_score must be in [0,1], got {retrieval_score}")
    if not 0.0 <= generation_score <= 1.0:
        raise ValueError(f"generation_score must be in [0,1], got {generation_score}")
    return Signal(retrieval=retrieval_score, generation=generation_score)
