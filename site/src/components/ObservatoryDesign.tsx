/**
 * Observatory — interactive figure with handles (window, needles, seed).
 * Mirrors the design's `observatory.jsx`.
 */
import { useMemo, useState } from "react";
import { OBS } from "../lib/personas";

type HandleProps<T> = {
  label: string;
  value: T;
  options: readonly T[];
  hint?: string;
  format?: (v: T) => string;
  onChange: (v: T) => void;
};

function Handle<T extends number>({
  label,
  value,
  options,
  hint,
  format,
  onChange,
}: HandleProps<T>) {
  return (
    <div className="handle">
      <div className="head">
        <b>{label}</b>
        <span className="v">{format ? format(value) : String(value)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={options.length - 1}
        step={1}
        value={options.indexOf(value)}
        onChange={(e) => onChange(options[parseInt(e.target.value, 10)])}
        aria-label={label}
        aria-valuetext={String(value)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--mono)",
          fontSize: "0.6875rem",
          color: "var(--ink-mute)",
        }}
      >
        {options.map((o) => (
          <span key={String(o)}>{format ? format(o) : String(o)}</span>
        ))}
      </div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

function Chart({
  win,
  needles,
  seed,
}: {
  win: number;
  needles: number;
  seed: number;
}) {
  const series = OBS.data[`${win}_${needles}`];
  const halflives = OBS.halflives;
  const W = 640,
    H = 280,
    padL = 44,
    padR = 16,
    padT = 16,
    padB = 36;
  const innerW = W - padL - padR,
    innerH = H - padT - padB;

  if (!series) {
    return (
      <div className="unavail">
        <div>
          <div
            className="tracked"
            style={{ marginBottom: "0.4rem", color: "var(--ink-sub)" }}
          >
            Configuration not measured
          </div>
          window={win}k · needles={needles} was not in the run grid.
          <br />
          <em>File a PR.</em>
        </div>
      </div>
    );
  }

  const means = halflives.map((_, i) => {
    let s = 0;
    for (const sd of series) s += sd[i];
    return s / series.length;
  });
  const xPos = (i: number) =>
    padL + (i / (halflives.length - 1)) * innerW;
  const yPos = (v: number) => padT + (1 - (v - 0.2) / 0.8) * innerH;

  const meanPath = means
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`,
    )
    .join(" ");
  const seedPath = series[seed]
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`,
    )
    .join(" ");

  const lows = halflives.map((_, i) =>
    Math.min(...series.map((s) => s[i])),
  );
  const highs = halflives.map((_, i) =>
    Math.max(...series.map((s) => s[i])),
  );
  const bandPath =
    "M" +
    halflives
      .map((_, i) => `${xPos(i).toFixed(1)},${yPos(highs[i]).toFixed(1)}`)
      .join(" L") +
    " L" +
    halflives
      .map(
        (_, i) =>
          `${xPos(halflives.length - 1 - i).toFixed(1)},${yPos(
            lows[halflives.length - 1 - i],
          ).toFixed(1)}`,
      )
      .join(" L") +
    " Z";

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Retention vs recency half-life"
    >
      {[0.2, 0.4, 0.6, 0.8, 1.0].map((g) => (
        <g key={g}>
          <line
            className="grid-line"
            x1={padL}
            y1={yPos(g)}
            x2={W - padR}
            y2={yPos(g)}
          />
          <text
            className="axis-label"
            x={padL - 6}
            y={yPos(g) + 3}
            textAnchor="end"
          >
            {g.toFixed(1)}
          </text>
        </g>
      ))}
      <line
        className="axis-line"
        x1={padL}
        y1={H - padB}
        x2={W - padR}
        y2={H - padB}
      />
      {halflives.map((h, i) => (
        <g key={h}>
          <line
            className="grid-line"
            x1={xPos(i)}
            y1={padT}
            x2={xPos(i)}
            y2={H - padB}
          />
          <text
            className="axis-label"
            x={xPos(i)}
            y={H - padB + 14}
            textAnchor="middle"
          >
            {h}k
          </text>
        </g>
      ))}
      <text
        className="axis-label"
        x={padL}
        y={padT + 10}
        style={{
          fontFamily: "var(--sans)",
          letterSpacing: "0.1em",
          fontSize: 9,
          textTransform: "uppercase",
        }}
        fill="var(--ink-sub)"
      >
        retention
      </text>
      <text
        className="axis-label"
        x={W - padR}
        y={H - 6}
        textAnchor="end"
        style={{
          fontFamily: "var(--sans)",
          letterSpacing: "0.1em",
          fontSize: 9,
          textTransform: "uppercase",
        }}
        fill="var(--ink-sub)"
      >
        half-life (tokens)
      </text>

      <path d={bandPath} fill="var(--accent)" opacity="0.10" />
      {series.map((s, i) => (
        <path
          key={i}
          d={s
            .map(
              (v, j) =>
                `${j === 0 ? "M" : "L"}${xPos(j).toFixed(1)},${yPos(v).toFixed(1)}`,
            )
            .join(" ")}
          stroke="var(--ink)"
          strokeWidth="0.7"
          fill="none"
          opacity={i === seed ? 0 : 0.18}
        />
      ))}
      <path
        d={meanPath}
        stroke="var(--ink)"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d={seedPath}
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
      />
      {series[seed].map((v, i) => (
        <circle
          key={i}
          cx={xPos(i)}
          cy={yPos(v)}
          r="3"
          fill="var(--accent)"
          stroke="var(--bone)"
          strokeWidth="1.5"
        />
      ))}
      <g transform={`translate(${padL + 8}, ${padT + 16})`}>
        <line x1="0" y1="0" x2="14" y2="0" stroke="var(--accent)" strokeWidth="2" />
        <text className="legend" x="20" y="3">
          seed {seed}
        </text>
        <line
          x1="80"
          y1="0"
          x2="94"
          y2="0"
          stroke="var(--ink)"
          strokeWidth="1.4"
        />
        <text className="legend" x="100" y="3">
          mean (8 seeds)
        </text>
        <rect x="170" y="-5" width="14" height="10" fill="var(--accent)" opacity="0.10" />
        <text className="legend" x="190" y="3">
          min/max band
        </text>
      </g>
    </svg>
  );
}

export function ObservatoryFigure() {
  const [win, setWin] = useState<number>(32);
  const [needles, setNeedles] = useState<number>(8);
  const [seed, setSeed] = useState<number>(3);

  const series = OBS.data[`${win}_${needles}`];
  const peakAt = useMemo(() => {
    if (!series) return null;
    const means = OBS.halflives.map((_, i) => {
      let s = 0;
      for (const sd of series) s += sd[i];
      return s / series.length;
    });
    const idx = means.indexOf(Math.max(...means));
    return OBS.halflives[idx];
  }, [series]);

  return (
    <div className="obs-grid">
      <aside className="obs-controls">
        <h4>Configuration</h4>
        <Handle
          label="Context window"
          value={win}
          options={OBS.W}
          format={(x) => `${x}k`}
          hint="Longer windows = more haystack."
          onChange={setWin}
        />
        <Handle
          label="Needle count"
          value={needles}
          options={OBS.N}
          hint="More needles = more retrieval load."
          onChange={setNeedles}
        />
        <Handle
          label="Seed"
          value={seed}
          options={[0, 1, 2, 3, 4, 5, 6, 7]}
          hint="Eight independent seeds were measured."
          onChange={setSeed}
        />

        <hr className="rule" style={{ margin: "1.5rem 0" }} />
        <h4>Headline</h4>
        {series ? (
          <p
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              color: "var(--ink-sub)",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            At{" "}
            <b style={{ color: "var(--ink)", fontStyle: "normal" }}>
              {win}k × {needles}
            </b>
            , the optimal half-life sits near{" "}
            <b
              style={{
                color: "var(--accent)",
                fontStyle: "normal",
                fontFamily: "var(--mono)",
              }}
            >
              {peakAt}k
            </b>{" "}
            tokens. Seed-to-seed band is wide enough that the &ldquo;optimal&rdquo;
            can shift one step in either direction.
          </p>
        ) : (
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.75rem",
              color: "var(--ink-mute)",
            }}
          >
            —
          </p>
        )}
      </aside>

      <div className="obs-fig">
        <Chart win={win} needles={needles} seed={seed} />
        <p className="caption">
          <b>Figure 1.</b> Retention as a function of recency half-life, holding
          window={win}k and needles={needles}. Orange is the highlighted seed;
          gray is the per-seed cloud; the dark line is the mean. The variance
          band is wider than the mean's curvature — which is the whole point of
          the verdict.
        </p>

        <hr className="rule" style={{ margin: "2rem 0 1.5rem" }} />

        <div className="tracked" style={{ marginBottom: "0.6rem" }}>
          Per-seed retention at the current configuration
        </div>
        <div className="dot-strip">
          {series ? (
            series.map((arr, i) => {
              const m = arr.reduce((a, b) => a + b, 0) / arr.length;
              return (
                <button
                  key={i}
                  className={"dot" + (i === seed ? " active" : "")}
                  style={
                    {
                      "--c": `oklch(0.6 0.05 ${30 + m * 180})`,
                    } as React.CSSProperties
                  }
                  onClick={() => setSeed(i)}
                  aria-label={`Seed ${i}, mean retention ${m.toFixed(3)}`}
                  title={`seed ${i}: ${m.toFixed(3)}`}
                />
              );
            })
          ) : (
            <span>—</span>
          )}
          <span style={{ marginLeft: "auto" }}>
            color = mean retention · click to scrub
          </span>
        </div>
      </div>
    </div>
  );
}

export default ObservatoryFigure;
