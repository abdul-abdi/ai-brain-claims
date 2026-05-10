/**
 * DesignNotesDemo — an inline live demonstration for the design-notes page.
 *
 * Shows 4 strategies from the actual benchmark data (a subset of the full
 * needle-retention JSON), seed-scrubber enabled. The page's argument is that
 * a number is not a representation — this widget is the demonstration.
 *
 * Data is literal from needle-retention.json — nothing fabricated.
 */
import { useState } from "react";

const TEXT_INK = "#1A1714";
const TEXT_MUTED = "#5A524A";
const ACCENT = "#CC785C";
const BG = "#FBFAF6";
const BAR_DIM = "#E0D9C9";

// Actual data from needle-retention.json — four strategies
const STRATEGIES = [
  {
    name: "needle_aware (oracle)",
    retentions: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    mean: 1.0,
    color: "#587C5A",
    label: "oracle",
  },
  {
    name: "task_relevance",
    retentions: [0.75, 0.625, 0.375, 0.75, 0.875, 0.75, 0.5, 0.75, 0.5, 0.625],
    mean: 0.65,
    color: "#CC785C",
    label: "task_relevance",
  },
  {
    name: "truncation",
    retentions: [
      0.375, 0.375, 0.375, 0.25, 0.125, 0.375, 0.125, 0.375, 0.125, 0.25,
    ],
    mean: 0.275,
    color: "#807565",
    label: "truncation",
  },
  {
    name: "recency+role",
    retentions: [
      0.125, 0.25, 0.375, 0.25, 0.125, 0.25, 0.0, 0.375, 0.125, 0.25,
    ],
    mean: 0.2125,
    color: "#9C4943",
    label: "recency+role",
  },
];

const SEEDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export function DesignNotesDemo() {
  const [activeSeed, setActiveSeed] = useState<number | null>(null);

  const showSeed = activeSeed !== null;

  // Find the max divergence for the currently active seed annotation
  const divergeAnnotation =
    activeSeed !== null
      ? (() => {
          const vals = STRATEGIES.map((s) => ({
            name: s.label,
            v: s.retentions[activeSeed],
            color: s.color,
          }));
          const max = vals.reduce((a, b) => (a.v > b.v ? a : b));
          const min = vals.reduce((a, b) => (a.v < b.v ? a : b));
          if (max.v === min.v) return null;
          const ratio = min.v === 0 ? null : max.v / min.v;
          return { max, min, ratio };
        })()
      : null;

  return (
    <figure
      className="rounded-lg border p-6 font-sans"
      style={{
        background: BG,
        borderColor: "rgba(168,156,136,0.35)",
      }}
      aria-label="Live demonstration: seed-by-seed retention across four strategies"
    >
      <figcaption className="mb-5">
        <p
          className="text-xs uppercase tracking-[0.18em]"
          style={{ color: TEXT_MUTED }}
        >
          Live demonstration · 4 strategies · 10 seeds
        </p>
        <p
          className="mt-1 font-serif text-lg font-medium"
          style={{ color: TEXT_INK }}
        >
          The same measured data, two representations
        </p>
        <p className="mt-1 text-sm" style={{ color: TEXT_MUTED }}>
          Aggregate:{" "}
          <code className="text-[0.85em]">task_relevance = 65.0% ± 15.4%</code>.
          Select a seed to see what that spread actually contains.
        </p>
      </figcaption>

      {/* Seed scrubber */}
      <div
        className="mb-5 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Seed selector"
      >
        <span
          className="text-[0.7rem] uppercase tracking-[0.15em] mr-1"
          style={{ color: TEXT_MUTED }}
        >
          Seed
        </span>
        {SEEDS.map((seed) => {
          const isActive = activeSeed === seed;
          return (
            <button
              key={seed}
              onClick={() => setActiveSeed((p) => (p === seed ? null : seed))}
              aria-pressed={isActive}
              aria-label={`Seed ${seed}`}
              className="h-7 w-7 rounded text-xs font-mono font-medium transition-all duration-150"
              style={{
                background: isActive ? ACCENT : "transparent",
                color: isActive ? "#FBFAF6" : TEXT_MUTED,
                border: `1px solid ${isActive ? ACCENT : "rgba(168,156,136,0.4)"}`,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {seed}
            </button>
          );
        })}
        {!showSeed && (
          <span
            className="ml-1 text-[0.7rem] italic"
            style={{ color: TEXT_MUTED }}
          >
            click a seed
          </span>
        )}
      </div>

      {/* Divergence callout — appears when a seed is selected */}
      {showSeed && divergeAnnotation && (
        <div
          className="mb-4 rounded px-4 py-3 text-sm"
          style={{
            background: "rgba(204,120,92,0.07)",
            border: "1px solid rgba(204,120,92,0.2)",
            color: TEXT_INK,
          }}
        >
          <span className="font-medium" style={{ color: ACCENT }}>
            Seed {activeSeed}:
          </span>{" "}
          <span style={{ color: divergeAnnotation.max.color }}>
            {divergeAnnotation.max.name}
          </span>{" "}
          reaches <strong>{pct(divergeAnnotation.max.v)}</strong> while{" "}
          <span style={{ color: divergeAnnotation.min.color }}>
            {divergeAnnotation.min.name}
          </span>{" "}
          returns <strong>{pct(divergeAnnotation.min.v)}</strong>.
          {divergeAnnotation.ratio !== null && (
            <>
              {" "}
              That is a{" "}
              <strong>
                {divergeAnnotation.ratio.toFixed(1)}× difference
              </strong>{" "}
              on the same configuration.
            </>
          )}
          {divergeAnnotation.ratio === null &&
            divergeAnnotation.min.v === 0 && (
              <>
                {" "}
                <strong>{divergeAnnotation.min.name}</strong> retains nothing.
              </>
            )}
        </div>
      )}

      {/* Strategy rows */}
      <div className="space-y-4">
        {STRATEGIES.map((s) => {
          const liveVal = showSeed ? s.retentions[activeSeed!] : null;
          const displayVal = liveVal !== null ? liveVal : s.mean;
          const barW = `${Math.max(2, displayVal * 100)}%`;

          return (
            <div key={s.name} className="space-y-1">
              <div className="grid grid-cols-[9rem_1fr_4.5rem] items-center gap-4 text-xs">
                <span
                  className="font-medium truncate"
                  style={{ color: TEXT_INK }}
                >
                  {s.label}
                </span>
                <div
                  className="relative h-2.5 rounded-full"
                  style={{ background: BAR_DIM }}
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: barW,
                      background: s.color,
                      opacity: showSeed ? 0.9 : 0.6,
                      transition: "width 0.2s ease, opacity 0.2s",
                    }}
                  />
                </div>
                <div
                  className="text-right tabular-nums font-medium"
                  style={{
                    color: showSeed ? s.color : TEXT_MUTED,
                    transition: "color 0.2s",
                  }}
                >
                  {pct(displayVal)}
                </div>
              </div>

              {/* Dot strip — must align with bar's grid column.
                  Grid: [9rem] + gap-4(1rem) = 10rem left offset.
                  Right gutter: [4.5rem] + gap-4(1rem) = 5.5rem. */}
              <div
                className="ml-[10rem] mr-[5.5rem] relative h-2"
                aria-hidden="true"
              >
                {s.retentions.map((v, i) => {
                  const isActive = activeSeed === i;
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${Math.max(0.5, v * 100)}%`,
                        top: 0,
                        transform: `translateX(-50%) scale(${isActive ? 1.5 : 1})`,
                        background: isActive ? s.color : "rgba(90,82,74,0.2)",
                        transition: "transform 0.15s, background 0.15s",
                        zIndex: isActive ? 2 : 1,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[0.68rem]" style={{ color: TEXT_MUTED }}>
        Data: <code>needle-retention.json</code> · 8 needles / 56 noise events /
        window 16 · 10 seeds · nothing fabricated
      </p>
    </figure>
  );
}
