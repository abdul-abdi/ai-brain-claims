import { useState, useCallback } from "react";
import type { CSSProperties } from "react";

export interface BenchmarkStrategy {
  name: string;
  mean_retention: number;
  std_retention: number;
  min_retention: number;
  max_retention: number;
  retentions_per_seed: number[];
  mean_latency_ms: number;
  p99_latency_ms: number;
  replay_consistency: number;
}

export interface BenchmarkResult {
  schema: string;
  config: {
    benchmark: string;
    needles_per_trace: number;
    total_events: number;
    noise_events: number;
    working_window: number;
    seeds: number;
    replays_per_strategy: number;
  };
  strategies: BenchmarkStrategy[];
  seeds: number[];
  timestamp: string;
}

interface Props {
  data: BenchmarkResult;
}

const BG = "#FBFAF6";
const BAR_DIM = "#E0D9C9";
const ORACLE_FILL = "#587C5A";
const HYGIENE_FILL = "#CC785C";
const NEUTRAL_FILL = "#807565";
const FAILURE_FILL = "#9C4943";
const TEXT_INK = "#1A1714";
const TEXT_MUTED = "#5A524A";
const DOT_HIGHLIGHT = "#CC785C";
const DOT_DIM = "rgba(90,82,74,0.22)";
const SEED_ACTIVE_BG = "#CC785C";
const SEED_INACTIVE_BG = "transparent";

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function barColor(name: string, mean: number, baseline: number): string {
  if (name.includes("oracle")) return ORACLE_FILL;
  if (mean < baseline) return FAILURE_FILL;
  if (mean > baseline + 0.15) return HYGIENE_FILL;
  return NEUTRAL_FILL;
}

// Returns a color for a dot — dimmed by default, strategy color when highlighted
function dotFill(
  strategyName: string,
  strategyMean: number,
  baseline: number,
  isHighlighted: boolean,
): string {
  if (!isHighlighted) return DOT_DIM;
  return barColor(strategyName, strategyMean, baseline);
}

export function MultiSeedFigure({ data }: Props) {
  const [activeSeed, setActiveSeed] = useState<number | null>(null);

  const handleSeedClick = useCallback((idx: number) => {
    setActiveSeed((prev) => (prev === idx ? null : idx));
  }, []);

  const cardStyle: CSSProperties = {
    background: BG,
    borderColor: "rgba(168, 156, 136, 0.35)",
  };

  const baseline =
    data.strategies.find((s) => s.name === "truncation")?.mean_retention ?? 0;

  const showSeed = activeSeed !== null;

  return (
    <figure
      className="my-10 rounded-lg border p-6 lg:p-8 font-sans"
      style={cardStyle}
      aria-label="Needle-retention benchmark — multi-seed measurement"
    >
      <figcaption className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-500">
          Needle-Retention Benchmark · {data.config.seeds} seeds ·
          ach-benchmark-1
        </p>
        <h3
          className="mt-1 font-serif text-2xl font-medium"
          style={{ color: TEXT_INK }}
        >
          Working-set retention by strategy
        </h3>
        <p
          className="mt-2 max-w-prose text-sm leading-relaxed"
          style={{ color: TEXT_MUTED }}
        >
          Real run of{" "}
          <code className="rounded bg-bone-200 px-1 py-0.5 text-[0.85em]">
            python -m eval.benchmarks.needle_retention
          </code>
          . {data.config.needles_per_trace} needles randomly placed among{" "}
          {data.config.noise_events} noise events; budget ={" "}
          {data.config.working_window} events. Higher is better. Bars show mean
          retention ± 1 std. Each dot is one seed run — click a seed to see how
          that single configuration played out across all strategies.
        </p>
      </figcaption>

      {/* Seed scrubber */}
      <div
        className="mb-6 flex items-center gap-2"
        role="group"
        aria-label="Seed selector"
      >
        <span
          className="text-[0.7rem] uppercase tracking-[0.15em] mr-1"
          style={{ color: TEXT_MUTED }}
        >
          Seed
        </span>
        {data.seeds.map((seed, idx) => {
          const isActive = activeSeed === idx;
          return (
            <button
              key={seed}
              onClick={() => handleSeedClick(idx)}
              aria-pressed={isActive}
              aria-label={`Seed ${seed}`}
              className="h-7 w-7 rounded text-xs font-mono font-medium transition-all duration-150"
              style={{
                background: isActive ? SEED_ACTIVE_BG : SEED_INACTIVE_BG,
                color: isActive ? "#FBFAF6" : TEXT_MUTED,
                border: `1px solid ${isActive ? SEED_ACTIVE_BG : "rgba(168,156,136,0.4)"}`,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {seed}
            </button>
          );
        })}
        <span
          className="ml-2 text-[0.7rem] leading-tight"
          style={{
            color: TEXT_MUTED,
            fontStyle: showSeed ? "normal" : "italic",
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {showSeed
            ? `seed ${data.seeds[activeSeed!]} highlighted across all strategies`
            : "click a seed to see the variance"}
        </span>
      </div>

      <div className="space-y-5">
        {data.strategies.map((s) => {
          const fill = barColor(s.name, s.mean_retention, baseline);
          const meanW = `${Math.max(2, s.mean_retention * 100)}%`;
          const errLeft = `${Math.max(0, (s.mean_retention - s.std_retention) * 100)}%`;
          const errRight = `${Math.min(100, (s.mean_retention + s.std_retention) * 100)}%`;
          const isFailure = s.mean_retention < baseline;

          const highlightedValue =
            activeSeed !== null ? s.retentions_per_seed[activeSeed] : null;

          return (
            <div key={s.name} className="space-y-1">
              <div className="grid grid-cols-[10rem_1fr_5.5rem] items-center gap-4 text-xs">
                <div className="flex flex-col">
                  <span style={{ color: TEXT_INK }} className="font-medium">
                    {s.name}
                  </span>
                  {isFailure && (
                    <span
                      style={{ color: FAILURE_FILL }}
                      className="text-[0.65rem] italic"
                    >
                      underperforms baseline
                    </span>
                  )}
                </div>
                <div
                  className="relative h-3 rounded-full"
                  style={{ background: BAR_DIM }}
                  aria-hidden="true"
                >
                  {/* Mean bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: meanW,
                      background: fill,
                      opacity: showSeed ? 0.35 : 1,
                      transition: "opacity 0.2s",
                    }}
                  />
                  {/* Error whiskers */}
                  <div
                    className="absolute -top-1 h-5 w-px"
                    style={{
                      left: errLeft,
                      background: TEXT_MUTED,
                      opacity: showSeed ? 0.3 : 1,
                      transition: "opacity 0.2s",
                    }}
                  />
                  <div
                    className="absolute -top-1 h-5 w-px"
                    style={{
                      left: errRight,
                      background: TEXT_MUTED,
                      opacity: showSeed ? 0.3 : 1,
                      transition: "opacity 0.2s",
                    }}
                  />
                  <div
                    className="absolute top-1/2 h-px -translate-y-1/2"
                    style={{
                      left: errLeft,
                      right: `calc(100% - ${errRight})`,
                      background: TEXT_MUTED,
                      opacity: showSeed ? 0.3 : 1,
                      transition: "opacity 0.2s",
                    }}
                  />
                  {/* Active seed marker — a vertical tick on the bar */}
                  {highlightedValue !== null && (
                    <div
                      className="absolute -top-2 h-7 w-0.5 rounded-full"
                      style={{
                        left: `${Math.max(1, highlightedValue * 100)}%`,
                        background: DOT_HIGHLIGHT,
                        transition: "left 0.15s",
                        boxShadow: "0 0 4px rgba(204,120,92,0.5)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="text-right tabular-nums">
                  {showSeed && highlightedValue !== null ? (
                    <>
                      <div
                        style={{ color: DOT_HIGHLIGHT }}
                        className="font-medium"
                      >
                        {pct(highlightedValue)}
                      </div>
                      <div
                        className="text-[0.7rem]"
                        style={{ color: TEXT_MUTED }}
                      >
                        μ={pct(s.mean_retention).replace("%", "")}%
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: TEXT_INK }}>
                        {pct(s.mean_retention)}
                      </div>
                      <div
                        className="text-[0.7rem]"
                        style={{ color: TEXT_MUTED }}
                      >
                        ±{pct(s.std_retention).replace("%", "")}%
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dot strip — one dot per seed, all 10.
                  Must match the bar's grid column: [10rem] + gap-4(1rem) = 11rem left offset.
                  Right gutter: [5.5rem] + gap-4(1rem) = 6.5rem. */}
              <div
                className="ml-[11rem] mr-[6.5rem] relative h-2"
                aria-hidden="true"
              >
                <div className="absolute inset-0 flex items-center">
                  {s.retentions_per_seed.map((v, idx) => {
                    const isHighlighted = activeSeed === idx;
                    const leftPct = `${Math.max(0.5, v * 100)}%`;
                    return (
                      <div
                        key={idx}
                        className="absolute w-2 h-2 rounded-full -translate-x-1/2"
                        style={{
                          left: leftPct,
                          background: dotFill(
                            s.name,
                            s.mean_retention,
                            baseline,
                            isHighlighted,
                          ),
                          transform: `translateX(-50%) scale(${isHighlighted ? 1.4 : 1})`,
                          transition: "transform 0.15s, background 0.15s",
                          zIndex: isHighlighted ? 2 : 1,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-7 grid gap-4 border-t border-ink-400/15 pt-5 text-xs lg:grid-cols-3"
        style={{ color: TEXT_MUTED }}
      >
        <div>
          <p className="font-medium" style={{ color: TEXT_INK }}>
            Replay determinism
          </p>
          <p className="mt-1">
            {data.strategies.every((s) => s.replay_consistency === 1)
              ? "All strategies returned byte-identical working sets across 3 replays per seed (100%)."
              : "Replay consistency varies — see JSON for per-strategy breakdown."}
          </p>
        </div>
        <div>
          <p className="font-medium" style={{ color: TEXT_INK }}>
            What "underperforms baseline" means
          </p>
          <p className="mt-1">
            <code className="rounded bg-bone-200 px-1">recency+role</code> uses
            default role weights that do not know about needles, so it actively
            deprioritizes the marker role — a real failure mode of imperfect
            importance signals.
          </p>
        </div>
        <div>
          <p className="font-medium" style={{ color: TEXT_INK }}>
            Reproduce
          </p>
          <pre className="mt-1 whitespace-pre-wrap text-[0.7rem] leading-relaxed font-mono">
            {`PYTHONPATH=observatory/src \\
  python -m eval.benchmarks.needle_retention \\
    --seeds ${data.config.seeds}`}
          </pre>
        </div>
      </div>

      <p className="mt-4 text-[0.7rem]" style={{ color: TEXT_MUTED }}>
        Run timestamp: {data.timestamp} · seeds: [{data.seeds.join(", ")}]
      </p>
    </figure>
  );
}
