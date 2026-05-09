"""Tests for the immutable EventLog primitive."""

import pytest

from observatory import EventLog
from observatory.log import EventId


def test_empty_log() -> None:
    log = EventLog()
    assert len(log) == 0
    assert log.snapshot() == ()
    assert log.head() is None


def test_append_returns_stable_id() -> None:
    log = EventLog()
    eid = log.append({"role": "user", "content": "hello"})
    assert isinstance(eid, EventId)
    assert eid.step == 0
    assert len(eid.digest) == 16


def test_step_monotonic() -> None:
    log = EventLog()
    a = log.append({"role": "user", "content": "a"})
    b = log.append({"role": "assistant", "content": "b"})
    c = log.append({"role": "tool", "content": "c"})
    assert (a.step, b.step, c.step) == (0, 1, 2)


def test_snapshot_is_tuple() -> None:
    log = EventLog()
    log.append({"role": "user", "content": "a"})
    log.append({"role": "assistant", "content": "b"})
    snap = log.snapshot()
    assert isinstance(snap, tuple)
    assert len(snap) == 2
    assert snap[0].payload["content"] == "a"


def test_event_immutable_after_append() -> None:
    log = EventLog()
    payload = {"role": "user", "content": "original"}
    log.append(payload)
    payload["content"] = "mutated"
    snap = log.snapshot()
    assert snap[0].payload["content"] == "original", "log must defensively copy payloads"


def test_replay_at_step() -> None:
    log = EventLog()
    for i in range(5):
        log.append({"role": "user", "content": f"step {i}"})
    earlier = log.replay(at=3)
    assert len(earlier) == 3
    assert [e.payload["content"] for e in earlier] == ["step 0", "step 1", "step 2"]


def test_replay_at_event_id() -> None:
    log = EventLog()
    a = log.append({"role": "user", "content": "a"})
    log.append({"role": "assistant", "content": "b"})
    log.append({"role": "tool", "content": "c"})
    earlier = log.replay(at=a)
    assert len(earlier) == 1
    assert earlier[0].id == a


def test_replay_negative_step_raises() -> None:
    log = EventLog()
    log.append({"role": "user", "content": "x"})
    with pytest.raises(ValueError):
        log.replay(at=-1)


def test_append_rejects_non_dict() -> None:
    log = EventLog()
    with pytest.raises(TypeError):
        log.append("not a dict")  # type: ignore[arg-type]


def test_head_returns_most_recent() -> None:
    log = EventLog()
    log.append({"role": "user", "content": "a"})
    log.append({"role": "assistant", "content": "b"})
    head = log.head()
    assert head is not None
    assert head.payload["content"] == "b"


def test_two_logs_with_same_payloads_have_same_digests() -> None:
    """Content-addressable digests are reproducible."""
    log1 = EventLog()
    log2 = EventLog()
    eid1 = log1.append({"role": "user", "content": "x"})
    eid2 = log2.append({"role": "user", "content": "x"})
    assert eid1.digest == eid2.digest


def test_iteration_yields_events_in_order() -> None:
    log = EventLog()
    for i in range(4):
        log.append({"role": "user", "content": f"e{i}"})
    contents = [e.payload["content"] for e in log]
    assert contents == ["e0", "e1", "e2", "e3"]
