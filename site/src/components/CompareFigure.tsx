import type { CSSProperties } from "react";

// Live comparison figure — reads the eval result JSON shape produced by
// `python -m observatory.eval compare`. Renders accuracy + p50 latency as
// horizontal bars; both metrics share the same vertical axis (variant) but
// each occupies its own row pair so the visual story is "what improved" vs
// "what cost."
//
// Accepts the result JSON as a prop so the page can fetch it once and render
// at build time.

export interface EvalRecord {
  name: string;
  n_steps: number;
  n_events: number;
  window: number;
  accuracy: number;
  p50_latency_ms: number;
  p99_latency_ms: number;
  notes: string;
}

export interface CompareData {
  baseline: EvalRecord;
  hygiene: EvalRecord;
  delta: { accuracy: number; p50_latency_ms: number };
}

interface Props {
  data: CompareData;
}

const BG = "#F7F4ED";
const BAR_DIM = "#E0D9C9";
const BASELINE_FILL = "#807565";
const HYGIENE_FILL = "#CC785C";
const TEXT_INK = "#1A1714";
const TEXT_MUTED = "#5A524A";

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function ms(n: number) {
  return n < 0.01 ? `${(n * 1000).toFixed(2)}μs` : `${n.toFixed(3)}ms`;
}

export function CompareFigure({ data }: Props) {
  const { baseline, hygiene, delta } = data;

  // Accuracy axis [0,1]; latency axis scaled to max p50 across the two.
  const latMax = Math.max(
    baseline.p50_latency_ms,
    hygiene.p50_latency_ms,
    0.001,
  );

  const cardStyle: CSSProperties = {
    background: BG,
    borderColor: "rgba(168, 156, 136, 0.35)",
  };

  const accuracyDeltaPositive = delta.accuracy >= 0;
  const accuracyDeltaColor = accuracyDeltaPositive ? "#587C5A" : "#9C4943";

  return (
    <figure
      className="my-10 rounded-lg border p-6 lg:p-8 font-sans"
      style={cardStyle}
      aria-label="Baseline vs hygiene observatory eval comparison"
    >
      <figcaption className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-500">
          Live observatory eval
        </p>
        <h3
          className="mt-1 font-serif text-2xl font-medium"
          style={{ color: TEXT_INK }}
        >
          Importance-weighted view vs naive truncation
        </h3>
        <p
          className="mt-2 max-w-prose text-sm leading-relaxed"
          style={{ color: TEXT_MUTED }}
        >
          {baseline.n_events} events, window {baseline.window}. Output of{" "}
          <code className="rounded bg-bone-200 px-1 py-0.5 text-[0.85em]">
            python -m observatory.eval compare
          </code>
          . Accuracy figures are placeholders pending v0.2 RULER integration;
          latency is real.
        </p>
      </figcaption>

      {/* Accuracy bars */}
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-medium" style={{ color: TEXT_INK }}>
            Accuracy
          </span>
          <span
            className="rounded px-2 py-0.5 text-[0.7rem] font-medium"
            style={{
              background: accuracyDeltaPositive ? "#E5EFE3" : "#F5DDDA",
              color: accuracyDeltaColor,
            }}
          >
            Δ {accuracyDeltaPositive ? "+" : ""}
            {pct(delta.accuracy)}
          </span>
        </div>
        <BarRow
          label="baseline"
          fill={BASELINE_FILL}
          dim={BAR_DIM}
          frac={baseline.accuracy}
          right={pct(baseline.accuracy)}
        />
        <BarRow
          label="hygiene"
          fill={HYGIENE_FILL}
          dim={BAR_DIM}
          frac={hygiene.accuracy}
          right={pct(hygiene.accuracy)}
        />
      </div>

      <div
        className="my-7 h-px w-full"
        style={{ background: "rgba(168,156,136,0.25)" }}
      ></div>

      {/* Latency bars */}
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-medium" style={{ color: TEXT_INK }}>
            p50 latency
          </span>
          <span
            className="rounded px-2 py-0.5 text-[0.7rem] font-medium"
            style={{ background: "#F5DDDA", color: "#9C4943" }}
          >
            Δ +{ms(delta.p50_latency_ms)}
          </span>
        </div>
        <BarRow
          label="baseline"
          fill={BASELINE_FILL}
          dim={BAR_DIM}
          frac={baseline.p50_latency_ms / latMax}
          right={ms(baseline.p50_latency_ms)}
        />
        <BarRow
          label="hygiene"
          fill={HYGIENE_FILL}
          dim={BAR_DIM}
          frac={hygiene.p50_latency_ms / latMax}
          right={ms(hygiene.p50_latency_ms)}
        />
      </div>

      <p className="mt-7 text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>
        The latency cost is Carmack's missing number. Both view-construction
        calls operate over the same immutable log; the hygiene path runs the
        importance scorer once per event. Real-world cost will dominate by your
        model inference, not by view construction.
      </p>
    </figure>
  );
}

function BarRow({
  label,
  fill,
  dim,
  frac,
  right,
}: {
  label: string;
  fill: string;
  dim: string;
  frac: number;
  right: string;
}) {
  const width = `${Math.max(2, Math.min(100, frac * 100))}%`;
  return (
    <div className="grid grid-cols-[5rem_1fr_4.5rem] items-center gap-3 text-xs">
      <span style={{ color: TEXT_MUTED }}>{label}</span>
      <div
        className="relative h-2.5 rounded-full"
        style={{ background: dim }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
          style={{ width, background: fill }}
        />
      </div>
      <span className="text-right tabular-nums" style={{ color: TEXT_INK }}>
        {right}
      </span>
    </div>
  );
}
