"""Immutable append-only event log.

Each event is a fact. Wrong signals are isolated events, not architectural state.
No "point of ruin" where a bad promotion poisons all future reasoning.
"""

from __future__ import annotations

import hashlib
import json
import time
from dataclasses import dataclass, field
from typing import Any

EventPayload = dict[str, Any]


@dataclass(frozen=True, slots=True)
class EventId:
    """Stable, content-addressable identifier for an event in the log.

    Combines a monotonic step number with a content hash so events sort by
    insertion order while remaining individually addressable.
    """

    step: int
    digest: str  # 16-char prefix of sha256 over canonical JSON of payload + step

    def __str__(self) -> str:
        return f"{self.step:08d}-{self.digest}"


@dataclass(frozen=True, slots=True)
class Event:
    """A single fact appended to the log. Immutable by construction."""

    id: EventId
    payload: EventPayload
    ts: float  # unix seconds
    meta: dict[str, Any] = field(default_factory=dict)


class EventLog:
    """Append-only event log. Events are facts; the log is values, not places.

    The internal store is a tuple. Append returns a new log? No — the log is a
    handle that *exposes* an immutable snapshot via .snapshot(); .append mutates
    the internal append cursor only, never re-writes existing events. To get
    value semantics for a slice of history, call .replay(at=...) — pure function.

    This is the "place containing values" pattern: the log is the place, the
    snapshots are the values. Importance and confidence operate on snapshots.
    """

    __slots__ = ("_events", "_step")

    def __init__(self) -> None:
        self._events: list[Event] = []
        self._step: int = 0

    def __len__(self) -> int:
        return len(self._events)

    def __iter__(self):
        return iter(self.snapshot())

    def append(self, payload: EventPayload, *, meta: dict[str, Any] | None = None) -> EventId:
        """Append a fact. Returns the event's stable id."""
        if not isinstance(payload, dict):
            raise TypeError(f"event payload must be a dict, got {type(payload).__name__}")
        step = self._step
        digest = self._hash(payload, step)
        eid = EventId(step=step, digest=digest)
        event = Event(id=eid, payload=dict(payload), ts=time.time(), meta=dict(meta or {}))
        self._events.append(event)
        self._step += 1
        return eid

    def snapshot(self) -> tuple[Event, ...]:
        """Return an immutable view of all events appended so far."""
        return tuple(self._events)

    def replay(self, *, at: EventId | int) -> tuple[Event, ...]:
        """Return the snapshot of the log as it would have looked at a given step.

        Pure function over the log's history. Either pass an EventId (replay up
        to and including that event) or an int step number (replay up to but
        not including that step).
        """
        if isinstance(at, EventId):
            return tuple(e for e in self._events if e.id.step <= at.step)
        if isinstance(at, int):
            if at < 0:
                raise ValueError("step must be non-negative")
            return tuple(e for e in self._events if e.id.step < at)
        raise TypeError(f"at must be EventId or int, got {type(at).__name__}")

    def head(self) -> Event | None:
        """The most recent event, if any."""
        return self._events[-1] if self._events else None

    @staticmethod
    def _hash(payload: EventPayload, step: int) -> str:
        canonical = json.dumps({"step": step, "payload": payload}, sort_keys=True, default=str)
        return hashlib.sha256(canonical.encode()).hexdigest()[:16]
