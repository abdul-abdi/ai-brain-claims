"""Console entry point: `observatory <command>`."""

from __future__ import annotations

import sys

from observatory.eval import main as eval_main


def main(argv: list[str] | None = None) -> int:
    argv = argv if argv is not None else sys.argv[1:]
    if not argv:
        print(__doc__ or "observatory CLI")
        print("\nusage: observatory <command> [args...]")
        print("commands:")
        print("  eval baseline    — run naive truncation eval")
        print("  eval hygiene     — run importance-weighted eval")
        print("  eval compare     — write baseline-vs-hygiene.json")
        return 0

    cmd = argv[0]
    rest = argv[1:]

    if cmd == "eval":
        return eval_main(rest)

    print(f"unknown command: {cmd}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
