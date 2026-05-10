"""Needle-Retention Benchmark.

Multi-seed measurement of how well different context-management strategies
preserve semantically-important events ("needles") under a fixed working-set
budget.

Pre-registered hypotheses:
    H1 — needle-aware oracle scorer > 95% retention.
    H2 — query-anchored task_relevance approaches the oracle.
    H3 — replay determinism = 100% across all strategies.

Reproduce:
    PYTHONPATH=observatory/src \\
        python -m eval.benchmarks.needle_retention --seeds 10
"""

from __future__ import annotations

import argparse
import json
import random
import statistics
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from observatory import EventLog, view
from observatory.importance import compose, recency, role_priority, task_relevance
from observatory.views import Scorer

NOISE_TEMPLATES = [
    "checked the weather forecast",
    "scrolled through unrelated documentation",
    "ran a syntax-check tool with no findings",
    "received an empty status update",
    "closed an unrelated tab",
    "cached a module from previous session",
    "performed a minor formatting fix",
    "logged a debug ping with no action taken",
    "verified an unrelated configuration value",
    "read an unrelated commit message",
]

NEEDLE_TEMPLATES = [
    "the deadline is {value}",
    "the API key lives in environment variable {value}",
    "remember the user's preferred timezone is {value}",
    "the canonical answer to question Q-{value} is alpha",
    "secret token id is {value}",
    "the system constraint requires output below {value}",
    "the schema migration version is pinned at {value}",
    "the experiment seed for this run is {value}",
]


def generate_trace(
    needles: int,
    total: int,
    *,
    rng: random.Random,
) -> tuple[EventLog, list[str]]:
    if needles >= total:
        raise ValueError("needles must be < total")

    log = EventLog()
    needle_ids: list[str] = []
    needle_set = set(rng.sample(range(total), needles))

    for i in range(total):
        if i in needle_set:
            value = f"NDL{i:04d}"
            content = rng.choice(NEEDLE_TEMPLATES).format(value=value)
            log.append(
                {"role": "needle", "content": content, "needle_id": value},
                meta={"position": i},
            )
            needle_ids.append(value)
        else:
            content = rng.choice(NOISE_TEMPLATES)
            role = rng.choice(["user", "assistant", "tool"])
            log.append({"role": role, "content": content}, meta={"position": i})

    return log, needle_ids


def truncation_view(log: EventLog, window: int):
    return log.snapshot()[-window:]


def hygiene_view(log: EventLog, window: int, scorer: Scorer, name: str):
    return view(log, scorer=scorer, window=window, scorer_name=name).events


def needle_aware_scorer() -> Scorer:
    """Privileged oracle: scores 'needle' role at 1.0; the upper bound."""
    rec = recency(half_life_steps=8)
    role = role_priority(weights={"needle": 1.0})

    def _score(snapshot: tuple, e) -> float:  # type: ignore[no-untyped-def]
        if str(e.payload.get("role")) == "needle":
            return 1.0
        return 0.6 * rec(snapshot, e) + 0.4 * role(snapshot, e)

    _score.__name__ = "needle_aware"
    return _score


def retention_rate(working_set, all_needle_ids: list[str]) -> float:
    if not all_needle_ids:
        return 1.0
    needle_ids_in_ws = {
        e.payload.get("needle_id")
        for e in working_set
        if e.payload.get("role") == "needle"
    }
    needle_ids_in_ws.discard(None)
    return len(needle_ids_in_ws) / len(all_needle_ids)


def run_strategy(
    callable_view: Callable[[EventLog], tuple],
    log: EventLog,
    needle_ids: list[str],
    *,
    replays: int = 3,
) -> tuple[float, float, bool]:
    runs = []
    for _ in range(replays):
        t0 = time.perf_counter_ns()
        ws = callable_view(log)
        elapsed_ms = (time.perf_counter_ns() - t0) / 1e6
        runs.append((tuple(e.id for e in ws), elapsed_ms))

    ids_first = runs[0][0]
    replay_ok = all(r[0] == ids_first for r in runs)
    median_latency = statistics.median(r[1] for r in runs)
    retention = retention_rate(callable_view(log), needle_ids)

    return retention, median_latency, replay_ok


@dataclass(frozen=True)
class BenchmarkResult:
    schema: str
    config: dict
    strategies: list[dict]
    seeds: list[int]
    timestamp: str

    def to_json(self) -> dict:
        return {
            "schema": self.schema,
            "config": self.config,
            "strategies": self.strategies,
            "seeds": self.seeds,
            "timestamp": self.timestamp,
        }


def run_benchmark(
    *, needles: int, total: int, window: int, seeds: int
) -> BenchmarkResult:
    seed_list = list(range(seeds))
    strategies = [
        ("truncation", lambda log: truncation_view(log, window)),
        ("recency", lambda log: hygiene_view(log, window, recency(), "recency")),
        (
            "recency+role",
            lambda log: hygiene_view(
                log,
                window,
                compose(recency(), role_priority(), weights=(0.7, 0.3)),
                "recency+role",
            ),
        ),
        (
            "task_relevance",
            lambda log: hygiene_view(
                log,
                window,
                task_relevance(query="deadline API key timezone secret token"),
                "task_relevance",
            ),
        ),
        (
            "needle_aware (oracle)",
            lambda log: hygiene_view(
                log, window, needle_aware_scorer(), "needle_aware"
            ),
        ),
    ]

    per_strategy: dict[str, dict] = {
        name: {
            "name": name,
            "retentions": [],
            "latencies_ms": [],
            "replay_consistent_count": 0,
        }
        for name, _ in strategies
    }

    for seed in seed_list:
        rng = random.Random(seed)
        log, needle_ids = generate_trace(needles=needles, total=total, rng=rng)
        for name, fn in strategies:
            r, lat, replay_ok = run_strategy(fn, log, needle_ids)
            per_strategy[name]["retentions"].append(r)
            per_strategy[name]["latencies_ms"].append(lat)
            per_strategy[name]["replay_consistent_count"] += int(replay_ok)

    aggregated = []
    for name, data in per_strategy.items():
        retentions = data["retentions"]
        lats = data["latencies_ms"]
        aggregated.append(
            {
                "name": name,
                "mean_retention": statistics.mean(retentions),
                "std_retention": statistics.stdev(retentions)
                if len(retentions) > 1
                else 0.0,
                "min_retention": min(retentions),
                "max_retention": max(retentions),
                "retentions_per_seed": retentions,
                "mean_latency_ms": statistics.mean(lats),
                "p99_latency_ms": max(lats),
                "replay_consistency": data["replay_consistent_count"] / len(seed_list),
            }
        )

    return BenchmarkResult(
        schema="ach-benchmark-1",
        config={
            "benchmark": "needle_retention",
            "needles_per_trace": needles,
            "total_events": total,
            "noise_events": total - needles,
            "working_window": window,
            "seeds": len(seed_list),
            "replays_per_strategy": 3,
        },
        strategies=aggregated,
        seeds=seed_list,
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    )


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="eval.benchmarks.needle_retention")
    p.add_argument("--needles", type=int, default=8)
    p.add_argument("--total", type=int, default=64)
    p.add_argument("--window", type=int, default=16)
    p.add_argument("--seeds", type=int, default=10)
    p.add_argument(
        "--out",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "results",
    )
    args = p.parse_args(argv)

    result = run_benchmark(
        needles=args.needles, total=args.total, window=args.window, seeds=args.seeds
    )
    args.out.mkdir(parents=True, exist_ok=True)
    out_file = args.out / "needle-retention.json"
    out_file.write_text(json.dumps(result.to_json(), indent=2) + "\n")

    print(
        f"Needle-retention benchmark — {args.seeds} seeds, "
        f"window={args.window}, needles={args.needles}/{args.total}"
    )
    print()
    print(f"  {'strategy':<25}  {'mean':>7}  {'± std':>7}  {'replay':>7}")
    print(f"  {'-' * 25}  {'-' * 7}  {'-' * 7}  {'-' * 7}")
    for s in result.strategies:
        print(
            f"  {s['name']:<25}  "
            f"{s['mean_retention'] * 100:>6.1f}%  "
            f"±{s['std_retention'] * 100:>5.1f}%  "
            f"{s['replay_consistency'] * 100:>6.0f}%"
        )
    print()
    print(f"Wrote → {out_file}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
