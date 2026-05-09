"""Tests for pure-function views over an EventLog."""

from observatory import EventLog
from observatory.importance import (
    compose,
    recency,
    recency_attention,
    role_priority,
    task_relevance,
)
from observatory.views import compare, view


def _seed_log(n: int = 8) -> EventLog:
    log = EventLog()
    for i in range(n):
        role = ("user", "assistant", "tool")[i % 3]
        log.append({"role": role, "content": f"event {i}"})
    return log


def test_view_empty_log_returns_empty_set() -> None:
    log = EventLog()
    ws = view(log, scorer=recency(), window=8)
    assert len(ws) == 0
    assert ws.events == ()
    assert ws.budget == 8


def test_view_respects_window_budget() -> None:
    log = _seed_log(20)
    ws = view(log, scorer=recency(), window=5)
    assert len(ws) == 5
    assert len(ws.dropped) == 15


def test_view_keeps_chronological_order() -> None:
    """Even though selection is by score, kept events are returned in log order."""
    log = _seed_log(10)
    ws = view(log, scorer=recency(), window=4)
    steps = [e.id.step for e in ws.events]
    assert steps == sorted(steps)


def test_recency_prefers_recent_events() -> None:
    log = _seed_log(10)
    ws = view(log, scorer=recency(half_life_steps=2), window=3)
    steps = [e.id.step for e in ws.events]
    # Newest 3 should win under aggressive recency decay
    assert steps == [7, 8, 9]


def test_role_priority_pulls_in_high_priority_events() -> None:
    log = EventLog()
    log.append({"role": "user", "content": "u"})
    for _ in range(10):
        log.append({"role": "tool", "content": "noise"})  # low priority
    log.append({"role": "system", "content": "system message"})

    ws = view(log, scorer=role_priority(), window=2)
    roles = sorted(e.payload["role"] for e in ws.events)
    assert "system" in roles  # system priority should make it survive


def test_task_relevance_picks_query_matched_events() -> None:
    log = EventLog()
    log.append({"role": "tool", "content": "weather report sunny"})
    log.append({"role": "tool", "content": "stock prices fell"})
    log.append({"role": "user", "content": "tell me about the weather"})

    ws = view(log, scorer=task_relevance(query="weather forecast"), window=2)
    contents = [e.payload["content"] for e in ws.events]
    assert any("weather" in c for c in contents)


def test_compose_combines_scorers() -> None:
    log = _seed_log(8)
    sc = compose(recency(), role_priority(), weights=(0.5, 0.5))
    ws = view(log, scorer=sc, window=3)
    assert len(ws) == 3


def test_recency_attention_default_works() -> None:
    log = _seed_log(8)
    ws = view(log, scorer=recency_attention(), window=4)
    assert len(ws) == 4


def test_compare_finds_overlap_and_diff() -> None:
    log = _seed_log(10)
    a = view(log, scorer=recency(half_life_steps=2), window=3)  # newest 3
    b = view(log, scorer=recency(half_life_steps=20), window=3)  # roughly all weighted similarly

    delta = compare(a, b)
    assert isinstance(delta.kept_by_both, tuple)
    assert isinstance(delta.only_a, tuple)
    assert isinstance(delta.only_b, tuple)
    # By construction, a + delta.only_a should be subset of a; sanity check
    a_ids = {e.id for e in a.events}
    for e in delta.only_a:
        assert e.id in a_ids


def test_view_is_deterministic() -> None:
    """A/B testing scorers requires deterministic replay."""
    log = _seed_log(12)
    sc = recency_attention()
    ws1 = view(log, scorer=sc, window=5)
    ws2 = view(log, scorer=sc, window=5)
    assert [e.id for e in ws1.events] == [e.id for e in ws2.events]
    assert ws1.scores == ws2.scores
