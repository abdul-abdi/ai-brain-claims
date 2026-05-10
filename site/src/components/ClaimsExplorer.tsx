/**
 * ClaimsExplorer — the home page's interactive surfaces, redesigned to match
 * the "Ten Claims at the Frontier" notebook design:
 *
 *   1. Matrix (thread × verdict)
 *   2. Claim strip below — chips halo when their cell is hovered
 *   3. Persona constellation
 *   4. Scatter (thread vs verdict, sized by papersCount)
 */

import { Fragment, useMemo, useState } from "react";
import type { ClaimSummary, Verdict } from "../lib/verdicts";
import { VERDICT_KEY, VERDICTS } from "../lib/verdicts";
import { PERSONAS, personaIdFromName } from "../lib/personas";
import { Sigil } from "./Sigil";

interface Props {
  claims: ClaimSummary[];
  base: string;
}

const THREADS = ["memory", "architecture", "metacognition", "social"] as const;
const ALL_VERDICTS: Verdict[] = [
  "VINDICATED",
  "PLAUSIBLE",
  "CONTESTED",
  "SPLIT",
  "REFUTED",
  "UNFALSIFIABLE",
];

interface Hovered {
  t: string;
  v: Verdict;
  claims: ClaimSummary[];
}

function Matrix({
  claims,
  hovered,
  onHover,
}: {
  claims: ClaimSummary[];
  hovered: Hovered | null;
  onHover: (h: Hovered | null) => void;
}) {
  const grid = useMemo(() => {
    const g: Record<string, ClaimSummary[]> = {};
    for (const t of THREADS) for (const v of ALL_VERDICTS) g[`${t}|${v}`] = [];
    for (const c of claims) g[`${c.thread}|${c.verdict}`].push(c);
    return g;
  }, [claims]);

  return (
    <section className="matrix-section" aria-label="Claim verdict matrix">
      <h2>The shape of the disagreement.</h2>
      <p className="sub">
        Each cell counts claims (rows) by verdict (columns). The empty{" "}
        <em>vindicated</em> column is the headline. Hover a cell; the matching
        claims halo below.
      </p>
      <div
        className="matrix"
        role="grid"
        style={{
          gridTemplateColumns: `minmax(7rem, max-content) repeat(${ALL_VERDICTS.length}, 1fr)`,
        }}
      >
        <div className="row-label">&nbsp;</div>
        {ALL_VERDICTS.map((v) => (
          <div className="h" key={v}>
            {VERDICT_KEY[v]}
          </div>
        ))}
        {THREADS.map((t) => (
          <Fragment key={t}>
            <div className="row-label">{t}</div>
            {ALL_VERDICTS.map((v) => {
              const k = `${t}|${v}`;
              const cClaims = grid[k];
              const n = cClaims.length;
              const max = 4;
              const intensity = n ? 0.25 + (n / max) * 0.75 : 0;
              const active = hovered && hovered.t === t && hovered.v === v;
              return (
                <button
                  key={v}
                  className="cell"
                  data-active={active ? "1" : "0"}
                  style={
                    {
                      "--bg": `var(--v-${VERDICT_KEY[v]})`,
                      "--int": intensity,
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => onHover({ t, v, claims: cClaims })}
                  onFocus={() => onHover({ t, v, claims: cClaims })}
                  onMouseLeave={() => onHover(null)}
                  aria-label={`${t} × ${VERDICT_KEY[v]}: ${n} claim${n !== 1 ? "s" : ""}`}
                >
                  <span className="n">{n || "·"}</span>
                  <span className="bar" />
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function ClaimStrip({
  claims,
  base,
  hovered,
}: {
  claims: ClaimSummary[];
  base: string;
  hovered: Hovered | null;
}) {
  const haloed = hovered ? new Set(hovered.claims.map((c) => c.id)) : new Set<string>();
  return (
    <div className="claim-strip" role="list">
      {claims.map((c) => (
        <a
          key={c.id}
          className={"claim-chip" + (haloed.has(c.id) ? " haloed" : "")}
          href={`${base}/claims/${c.id}`}
          style={{ ["--bg" as never]: `var(--v-${VERDICT_KEY[c.verdict]})` }}
          role="listitem"
        >
          <span className="num">{String(c.number).padStart(2, "0")}</span>
          <span className="dot" />
          <span>{c.shortTitle}</span>
        </a>
      ))}
    </div>
  );
}

function Constellation() {
  const [tip, setTip] = useState<{
    p: typeof PERSONAS[number];
    x: number;
    y: number;
  } | null>(null);
  const N = PERSONAS.length;
  return (
    <section className="constellation-section" aria-label="Persona roster">
      <h2>The roster.</h2>
      <p className="sub">
        Nine analytical lenses. Each claim was researched under two of them,
        chosen by the orchestrator for fit. Hover a sigil to learn the voice.
      </p>
      <div className="constellation">
        <div className="center">
          Each claim picked two of these to argue with itself.
        </div>
        {PERSONAS.map((p, i) => {
          const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
          const r = 44;
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          return (
            <button
              key={p.id}
              className="node"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setTip({ p, x, y })}
              onMouseLeave={() => setTip(null)}
              onFocus={() => setTip({ p, x, y })}
              onBlur={() => setTip(null)}
              aria-label={`${p.name}: ${p.blurb}`}
            >
              <Sigil id={p.id} size={28} />
              <span className="nm">{p.name}</span>
            </button>
          );
        })}
        {tip && (
          <div
            className="persona-tooltip"
            style={{ left: `${tip.x}%`, top: `${tip.y}%` }}
            role="tooltip"
          >
            <i>{tip.p.name}</i>
            “{tip.p.quote}”
          </div>
        )}
      </div>
    </section>
  );
}

function Scatter({ claims, base }: { claims: ClaimSummary[]; base: string }) {
  const [tipId, setTipId] = useState<string | null>(null);
  const verdictOrder = ALL_VERDICTS;
  return (
    <section
      className="scatter-section"
      aria-label="Claim scatter: thread vs verdict"
    >
      <h2>Every claim, plotted.</h2>
      <p className="sub">
        x: research thread &nbsp;·&nbsp; y: verdict &nbsp;·&nbsp; size: papers
        cited &nbsp;·&nbsp; color: verdict. Click a point to read the dossier.
      </p>
      <div className="scatter">
        <div className="y-axis-label">
          {[...verdictOrder].reverse().map((v) => (
            <span key={v}>{VERDICT_KEY[v]}</span>
          ))}
        </div>
        <div className="grid" />
        <div className="x-axis-label">
          {THREADS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="pts">
          {claims.map((c) => {
            const tx = THREADS.indexOf(c.thread as typeof THREADS[number]);
            const vy = verdictOrder.indexOf(c.verdict);
            const sameCell = claims.filter(
              (o) => o.thread === c.thread && o.verdict === c.verdict,
            );
            const idx = sameCell.indexOf(c);
            const j = (idx - (sameCell.length - 1) / 2) * 14;
            const x = ((tx + 0.5) / THREADS.length) * 100;
            const y = ((vy + 0.5) / verdictOrder.length) * 100;
            const size = 16 + (c.papersCount ?? 5) * 1.6;
            return (
              <a
                key={c.id}
                className="pt"
                href={`${base}/claims/${c.id}`}
                style={
                  {
                    left: `calc(${x}% + ${j}px)`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    "--bg": `var(--v-${VERDICT_KEY[c.verdict]})`,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setTipId(c.id)}
                onMouseLeave={() => setTipId(null)}
                onFocus={() => setTipId(c.id)}
                onBlur={() => setTipId(null)}
                aria-label={`Claim ${c.number}: ${c.title} (${c.verdict})`}
              >
                {String(c.number).padStart(2, "0")}
                {tipId === c.id && (
                  <span className="pt-tip">
                    {String(c.number).padStart(2, "0")} · {c.shortTitle} ·{" "}
                    <em>{VERDICT_KEY[c.verdict]}</em>
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ClaimsExplorer({ claims, base }: Props) {
  const [hovered, setHovered] = useState<Hovered | null>(null);
  return (
    <>
      <Matrix claims={claims} hovered={hovered} onHover={setHovered} />
      <section
        style={{
          padding: "0 clamp(1rem, 4vw, 3rem) clamp(2rem, 4vh, 3rem)",
          borderBottom: "1px solid var(--bone-line)",
        }}
      >
        <ClaimStrip claims={claims} base={base} hovered={hovered} />
      </section>
      <Constellation />
      <Scatter claims={claims} base={base} />
    </>
  );
}

// Default export retained for compatibility
export default ClaimsExplorer;
