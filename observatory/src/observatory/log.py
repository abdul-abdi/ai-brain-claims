"""Immutable append-only event log."""

from __future__ import annotations

import hashlib
import json
import time
from dataclasses import dataclass, field
from typing import Any

EventPayload = dict[str, Any]


@dataclass(frozen=True, slots=True)
class EventId:
    step: int
    digest: str

    def __str__(self) -> str:
        return f"{self.step:08d}-{self.digest}"


@dataclass(frozen=True, slots=True)
class Event:
    id: EventId
    payload: EventPayload
    ts: float
    meta: dict[str, Any] = field(default_factory=dict)


class EventLog:
    """Append-only log; events are facts. Snapshots are immutable values."""

    __slots__ = ("_events", "_step")

    def __init__(self) -> None:
        self._events: list[Event] = []
        self._step: int = 0

    def __len__(self) -> int:
        return len(self._events)

    def __iter__(self):
        return iter(self.snapshot())

    def append(self, payload: EventPayload, *, meta: dict[str, Any] | None = None) -> EventId:
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
        return tuple(self._events)

    def replay(self, *, at: EventId | int) -> tuple[Event, ...]:
        if isinstance(at, EventId):
            return tuple(e for e in self._events if e.id.step <= at.step)
        if isinstance(at, int):
            if at < 0:
                raise ValueError("step must be non-negative")
            return tuple(e for e in self._events if e.id.step < at)
        raise TypeError(f"at must be EventId or int, got {type(at).__name__}")

    def head(self) -> Event | None:
        return self._events[-1] if self._events else None

    @staticmethod
    def _hash(payload: EventPayload, step: int) -> str:
        canonical = json.dumps({"step": step, "payload": payload}, sort_keys=True, default=str)
        return hashlib.sha256(canonical.encode()).hexdigest()[:16]
