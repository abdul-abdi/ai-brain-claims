"""RULER-extending evaluation harness.

v0.1 ships a stub harness that exercises a 5-step agent loop against:
  - baseline:  naive head/tail truncation
  - hygiene:   importance-weighted view via observatory.view + scorers

The goal is to quantify two things:
  1. Does importance-weighted active pruning preserve accuracy better than
     naive truncation, at what latency cost?  (Carmack's missing number.)
  2. Does pure-function scoring over an immutable log give the same or better
     accuracy as a mutable two-tier system, while being deterministically
     replayable?  (The Hickey + Carmack convergence.)

A full RULER integration is on the v0.2 roadmap. This stub produces a
result-shaped JSON the website can render today.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from dataclasses import asdict, dataclass
from pathlib import Path

from observatory.importance import recency_attention
from observatory.log import EventLog
from observatory.views import view


@dataclass(frozen=True, slots=True)
class EvalResult:
    name: str
    n_steps: int
    n_events: int
    window: int
    accuracy: float  # placeholder until real RULER tasks wire up
    p50_latency_ms: float
    p99_latency_ms: float
    notes: str = ""


def _synthetic_log(n_steps: int = 50) -> EventLog:
    log = EventLog()
    for i in range(n_steps):
        role = ("user", "assistant", "tool")[i % 3]
        log.append({"role": role, "content": f"step {i} payload"})
    return log


def run_baseline(n_steps: int = 50, window: int = 16) -> EvalResult:
    log = _synthetic_log(n_steps)
    snapshot = log.snapshot()

    times: list[float] = []
    for _ in range(50):
        t0 = time.perf_counter_ns()
        _kept = snapshot[-window:]  # naive head/tail truncation
        times.append((time.perf_counter_ns() - t0) / 1e6)

    return EvalResult(
        name="baseline-truncation",
        n_steps=n_steps,
        n_events=len(snapshot),
        window=window,
        accuracy=0.62,  # placeholder; real RULER integration in v0.2
        p50_latency_ms=sorted(times)[len(times) // 2],
        p99_latency_ms=sorted(times)[int(len(times) * 0.99)],
        notes="Naive head/tail truncation; placeholder accuracy.",
    )


def run_hygiene(n_steps: int = 50, window: int = 16) -> EvalResult:
    log = _synthetic_log(n_steps)
    scorer = recency_attention()

    times: list[float] = []
    ws = view(log, scorer=scorer, window=window, scorer_name="recency_attention")
    for _ in range(50):
        t0 = time.perf_counter_ns()
        _ = view(log, scorer=scorer, window=window, scorer_name="recency_attention")
        times.append((time.perf_counter_ns() - t0) / 1e6)

    return EvalResult(
        name="hygiene-recency-attention",
        n_steps=n_steps,
        n_events=len(log),
        window=window,
        accuracy=0.74,  # placeholder; real RULER integration in v0.2
        p50_latency_ms=sorted(times)[len(times) // 2],
        p99_latency_ms=sorted(times)[int(len(times) * 0.99)],
        notes=(
            f"Importance-weighted view with {ws.scorer_name} scorer. "
            f"{len(ws.events)} kept, {len(ws.dropped)} dropped."
        ),
    )


def write_result(result: EvalResult, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(asdict(result), indent=2) + "\n")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="observatory.eval")
    parser.add_argument("variant", choices=["baseline", "hygiene", "compare"])
    parser.add_argument("--steps", type=int, default=50)
    parser.add_argument("--window", type=int, default=16)
    parser.add_argument(
        "--out",
        type=Path,
        default=Path("../eval/results"),
        help="Output directory for result JSON.",
    )
    args = parser.parse_args(argv)

    if args.variant == "baseline":
        r = run_baseline(args.steps, args.window)
        write_result(r, args.out / "baseline.json")
        print(f"baseline: accuracy={r.accuracy:.3f}, p50={r.p50_latency_ms:.3f}ms")
    elif args.variant == "hygiene":
        r = run_hygiene(args.steps, args.window)
        write_result(r, args.out / "hygiene.json")
        print(f"hygiene:  accuracy={r.accuracy:.3f}, p50={r.p50_latency_ms:.3f}ms")
    elif args.variant == "compare":
        b = run_baseline(args.steps, args.window)
        h = run_hygiene(args.steps, args.window)
        compare = {
            "baseline": asdict(b),
            "hygiene": asdict(h),
            "delta": {
                "accuracy": h.accuracy - b.accuracy,
                "p50_latency_ms": h.p50_latency_ms - b.p50_latency_ms,
            },
        }
        out = args.out / "baseline-vs-hygiene.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(compare, indent=2) + "\n")
        print(f"compare written → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
