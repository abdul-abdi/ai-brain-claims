/**
 * Linked-instrument home — hero / matrix / constellation / scatter
 * all share a focus state via context. Hover anywhere; everything else
 * on the page answers. The hero scrubbers actually filter shown counts.
 *
 * Mirrors the second iteration of the "Ten Claims at the Frontier" design.
 */

import {
  Fragment,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ClaimSummary, Verdict } from "../lib/verdicts";
import { VERDICT_KEY } from "../lib/verdicts";
import {
  PERSONAS,
  PERSONAS_BY_ID,
  personaIdFromName,
  type PersonaId,
} from "../lib/personas";
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

interface Focus {
  verdict?: Verdict;
  thread?: string;
  persona?: PersonaId;
  claim?: string; // claim id (slug)
}

const FocusCtx = createContext<{
  focus: Focus;
  setFocus: (f: Focus) => void;
}>({ focus: {}, setFocus: () => {} });

const useFocus = () => useContext(FocusCtx);

/** Augment each claim with its lens persona ids (as a tuple). */
function lensesOf(c: ClaimSummary): PersonaId[] {
  return c.personas
    .map((n) => personaIdFromName(n))
    .filter((x): x is PersonaId => x != null);
}

/* ---------- Scrub primitive ---------- */
function ScrubNum({
  value,
  min,
  max,
  onChange,
  format,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  format?: (v: number) => string | number;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const drag = useRef({ active: false, startY: 0, startV: value });
  function down(e: React.PointerEvent<HTMLSpanElement>) {
    e.preventDefault();
    drag.current = { active: true, startY: e.clientY, startV: value };
    ref.current?.setPointerCapture?.(e.pointerId);
  }
  function move(e: React.PointerEvent<HTMLSpanElement>) {
    if (!drag.current.active) return;
    const dy = drag.current.startY - e.clientY;
    const next = Math.round(drag.current.startV + dy / 6);
    onChange(Math.max(min, Math.min(max, next)));
  }
  function up(e: React.PointerEvent<HTMLSpanElement>) {
    drag.current.active = false;
    ref.current?.releasePointerCapture?.(e.pointerId);
  }
  function key(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      onChange(Math.min(max, value + 1));
      e.preventDefault();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      onChange(Math.max(min, value - 1));
      e.preventDefault();
    }
  }
  return (
    <span
      ref={ref}
      className="num"
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onKeyDown={key}
      title="Drag vertically or use arrow keys. The page below answers."
    >
      {format ? format(value) : value}
    </span>
  );
}

/* ---------- Hero ambient: three drifting waves echoing the timeline strip ---------- */
function HeroAmbient({ shownClaims }: { shownClaims: number }) {
  // The waves nudge slightly when shownClaims changes — the ambient is alive
  // because the page is alive.
  const phase = shownClaims / 10;
  return (
    <svg
      className="hero-ambient"
      viewBox="0 0 320 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fadeR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--bone)" stopOpacity="1" />
          <stop offset="0.2" stopColor="var(--bone)" stopOpacity="0" />
        </linearGradient>
        <mask id="leftFade">
          <rect width="320" height="200" fill="white" />
          <rect width="320" height="200" fill="url(#fadeR)" />
        </mask>
      </defs>
      <g mask="url(#leftFade)" style={{ ["--phase" as never]: phase }}>
        <path
          className="wave wave-1"
          d="M -20 60 Q 60 30 140 60 T 320 60"
          stroke="var(--wave-research)"
          fill="none"
          strokeWidth="1.5"
        />
        <path
          className="wave wave-2"
          d="M -20 110 Q 60 80 140 110 T 320 110"
          stroke="var(--wave-roundtable)"
          fill="none"
          strokeWidth="1.5"
        />
        <path
          className="wave wave-3"
          d="M -20 160 Q 60 130 140 160 T 320 160"
          stroke="var(--wave-build)"
          fill="none"
          strokeWidth="1.5"
        />
        {/* Tiny markers travel along the build wave — a claim drifting. */}
        <circle className="drifter d-1" r="3" fill="var(--accent)" cx="40" cy="60" />
        <circle className="drifter d-2" r="2.5" fill="var(--wave-roundtable)" cx="100" cy="110" />
        <circle className="drifter d-3" r="3" fill="var(--wave-build)" cx="180" cy="160" />
      </g>
    </svg>
  );
}

/* ---------- Hero ---------- */
function Hero({
  shownClaims,
  setShownClaims,
  shownPersonas,
  setShownPersonas,
}: {
  shownClaims: number;
  setShownClaims: (n: number) => void;
  shownPersonas: number;
  setShownPersonas: (n: number) => void;
}) {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <HeroAmbient shownClaims={shownClaims} />
      <div className="eyebrow">
        A research notebook · Session 04 · Personas as analytical lenses
      </div>
      <h1 id="hero-h">
        We tested{" "}
        <ScrubNum
          value={shownClaims}
          min={1}
          max={10}
          onChange={setShownClaims}
          ariaLabel="claim count"
        />{" "}
        claims about AI ↔ brain at the frontier, ran them through{" "}
        <ScrubNum
          value={shownPersonas}
          min={1}
          max={9}
          onChange={setShownPersonas}
          ariaLabel="persona count"
        />{" "}
        persona lenses, and produced{" "}
        <span className="num" tabIndex={-1} style={{ cursor: "default" }}>
          zero
        </span>{" "}
        clean verdicts.
      </h1>
      <p className="lede">
        Strong forms systematically failed. Weak forms systematically held. The
        interesting object isn't the table of results &mdash; it's the shape of
        the disagreement. The page below is the agents' working notebook, with
        handles. Drag a numeral above; the page beneath rearranges. Reading is
        doing.
      </p>
      <div className="meta">
        <span>
          <b>{shownClaims}</b> claim dossiers
        </span>
        <span>
          <b>{shownPersonas}</b> persona lenses
        </span>
        <span>
          <b>4</b>-persona roundtable, 2 rounds
        </span>
        <span>
          <b>1</b> primitive shipped
        </span>
        <span>
          <b>21</b> autonomous research dispatches
        </span>
      </div>
    </section>
  );
}

/* ---------- Matrix + FocusReadout ---------- */
function Matrix({
  shownClaims,
  claims,
  base,
}: {
  shownClaims: number;
  claims: ClaimSummary[];
  base: string;
}) {
  const { focus, setFocus } = useFocus();
  const visible = claims.slice(0, shownClaims);

  const grid = useMemo(() => {
    const g: Record<string, ClaimSummary[]> = {};
    for (const t of THREADS) for (const v of ALL_VERDICTS) g[`${t}|${v}`] = [];
    for (const c of visible) g[`${c.thread}|${c.verdict}`].push(c);
    return g;
  }, [shownClaims, claims]);

  const personaClaims = focus.persona
    ? new Set(
        visible
          .filter((c) => lensesOf(c).includes(focus.persona!))
          .map((c) => c.id),
      )
    : null;

  return (
    <section className="matrix-section" aria-label="Claim verdict matrix">
      <h2>The shape of the disagreement.</h2>
      <p className="sub">
        Each cell counts claims (rows) by verdict (columns). The empty{" "}
        <em>vindicated</em> column is the headline. Hover a cell, a chip, a
        persona &mdash; everything else on this page answers.
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
          <div
            className="h"
            key={v}
            data-active={focus.verdict === v ? "1" : "0"}
          >
            {VERDICT_KEY[v]}
          </div>
        ))}
        {THREADS.map((t) => (
          <Fragment key={t}>
            <div
              className="row-label"
              data-active={focus.thread === t ? "1" : "0"}
            >
              {t}
            </div>
            {ALL_VERDICTS.map((v) => {
              const k = `${t}|${v}`;
              const cClaims = grid[k];
              const n = cClaims.length;
              const max = 4;
              const intensity = n ? 0.25 + (n / max) * 0.75 : 0;
              const cellHasFocused =
                personaClaims && cClaims.some((c) => personaClaims.has(c.id));
              const active =
                (focus.verdict === v && focus.thread === t) || cellHasFocused;
              return (
                <button
                  key={v}
                  className="cell"
                  data-active={active ? "1" : "0"}
                  data-haloed={cellHasFocused ? "1" : "0"}
                  style={
                    {
                      "--bg": `var(--v-${VERDICT_KEY[v]})`,
                      "--int": intensity,
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => setFocus({ verdict: v, thread: t })}
                  onFocus={() => setFocus({ verdict: v, thread: t })}
                  onMouseLeave={() => setFocus({})}
                  onBlur={() => setFocus({})}
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

      <FocusReadout claims={visible} base={base} />
    </section>
  );
}

function FocusReadout({
  claims,
  base,
}: {
  claims: ClaimSummary[];
  base: string;
}) {
  const { focus, setFocus } = useFocus();
  let matched: ClaimSummary[] = [];
  let label = "Hover anything; the matched dossiers appear here.";
  if (focus.persona) {
    const p = PERSONAS_BY_ID[focus.persona];
    matched = claims.filter((c) => lensesOf(c).includes(focus.persona!));
    label = `Researched under ${p?.name}:`;
  } else if (focus.verdict && focus.thread) {
    matched = claims.filter(
      (c) => c.verdict === focus.verdict && c.thread === focus.thread,
    );
    label = `${focus.thread} × ${VERDICT_KEY[focus.verdict]}:`;
  } else if (focus.verdict) {
    matched = claims.filter((c) => c.verdict === focus.verdict);
    label = `Verdict: ${VERDICT_KEY[focus.verdict]}`;
  } else if (focus.claim) {
    matched = claims.filter((c) => c.id === focus.claim);
    label = `Claim ${focus.claim}:`;
  }
  return (
    <div className="readout">
      <div className="readout-head">
        <span className="tracked">{label}</span>
        <span className="tracked" style={{ color: "var(--ink-mute)" }}>
          {matched.length || "—"}{" "}
          {matched.length === 1 ? "match" : "matches"}
        </span>
      </div>
      <div className="claim-strip" role="list" aria-live="polite">
        {claims.map((c) => {
          const haloed = matched.includes(c);
          const dim = matched.length > 0 && !haloed;
          return (
            <a
              key={c.id}
              className={
                "claim-chip" +
                (haloed ? " haloed" : "") +
                (dim ? " dimmed" : "")
              }
              href={`${base}/claims/${c.id}`}
              style={
                {
                  "--bg": `var(--v-${VERDICT_KEY[c.verdict]})`,
                } as React.CSSProperties
              }
              role="listitem"
              onMouseEnter={() => setFocus({ claim: c.id })}
              onMouseLeave={() => setFocus({})}
            >
              <span className="num">{String(c.number).padStart(2, "0")}</span>
              <span className="dot" />
              <span>{c.shortTitle}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Constellation (real graph: persona nodes + paired-claim edges) ---------- */
function Constellation({
  shownPersonas,
  shownClaims,
  claims,
}: {
  shownPersonas: number;
  shownClaims: number;
  claims: ClaimSummary[];
}) {
  const { focus, setFocus } = useFocus();
  const visiblePersonas = PERSONAS.slice(0, shownPersonas);
  const visiblePersonaIds = new Set(visiblePersonas.map((p) => p.id));
  const visibleClaims = claims.slice(0, shownClaims);

  const edges = useMemo(() => {
    const map: Record<
      string,
      { a: PersonaId; b: PersonaId; claims: ClaimSummary[] }
    > = {};
    for (const c of visibleClaims) {
      const ls = lensesOf(c);
      if (ls.length < 2) continue;
      const [a, b] = ls;
      if (a === b) continue;
      if (!visiblePersonaIds.has(a) || !visiblePersonaIds.has(b)) continue;
      const k = [a, b].sort().join("|");
      if (!map[k])
        map[k] = {
          a: k.split("|")[0] as PersonaId,
          b: k.split("|")[1] as PersonaId,
          claims: [],
        };
      map[k].claims.push(c);
    }
    return Object.values(map);
  }, [shownClaims, shownPersonas, claims]);

  const N = visiblePersonas.length;
  const RAD = 42;
  const positions = visiblePersonas.map((p, i) => {
    const angle = (i / Math.max(N, 1)) * Math.PI * 2 - Math.PI / 2;
    return {
      id: p.id,
      x: 50 + Math.cos(angle) * RAD,
      y: 50 + Math.sin(angle) * RAD,
    };
  });
  const posOf = (id: PersonaId) => positions.find((q) => q.id === id);

  const focusedEdges = focus.claim
    ? edges.filter((e) => e.claims.some((c) => c.id === focus.claim))
    : focus.persona
      ? edges.filter((e) => e.a === focus.persona || e.b === focus.persona)
      : focus.verdict || focus.thread
        ? edges.filter((e) =>
            e.claims.some(
              (c) =>
                (!focus.verdict || c.verdict === focus.verdict) &&
                (!focus.thread || c.thread === focus.thread),
            ),
          )
        : [];

  function isFocusedEdge(e: { a: PersonaId; b: PersonaId }) {
    return focusedEdges.some((fe) => fe.a === e.a && fe.b === e.b);
  }

  // Center text adapts to focus
  let center: React.ReactNode = (
    <span>Each claim picked two of these to argue with itself.</span>
  );
  if (focus.persona) {
    const p = PERSONAS_BY_ID[focus.persona];
    center = (
      <span>
        <em>{p?.name}</em>
        <br />
        co-researched <b>{focusedEdges.length}</b> claim
        {focusedEdges.length !== 1 && "s"}
      </span>
    );
  } else if (focus.claim) {
    center = (
      <span>
        <em>Claim {focus.claim.replace("claim-", "")}</em>
        <br />
        two lenses light up
      </span>
    );
  } else if (focus.verdict || focus.thread) {
    center = (
      <span>
        <em>
          {focus.thread ?? ""}
          {focus.thread && focus.verdict ? " × " : ""}
          {focus.verdict ? VERDICT_KEY[focus.verdict] : ""}
        </em>
        <br />
        <b>{focusedEdges.length}</b> persona pair
        {focusedEdges.length !== 1 && "s"}
      </span>
    );
  }

  return (
    <section
      className="constellation-section"
      aria-label="Persona co-research graph"
    >
      <h2>The roster, as a network.</h2>
      <p className="sub">
        Nine analytical lenses. An edge runs between two personas whenever they
        were paired on a claim &mdash; thicker for more papers in that dossier.
        Hover a persona to see what it touched; hover a verdict cell above to
        see which pairs produced that verdict.
      </p>

      <div className="constellation">
        <svg
          className="const-edges"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map((e, i) => {
            const pa = posOf(e.a);
            const pb = posOf(e.b);
            if (!pa || !pb) return null;
            const mx = (pa.x + pb.x) / 2;
            const my = (pa.y + pb.y) / 2;
            const cx = 50 + (mx - 50) * 0.35;
            const cy = 50 + (my - 50) * 0.35;
            const weight = e.claims.reduce(
              (s, c) => s + (c.papersCount ?? 5),
              0,
            );
            const focused = isFocusedEdge(e);
            const dimmed = focusedEdges.length > 0 && !focused;
            return (
              <path
                key={i}
                d={`M ${pa.x} ${pa.y} Q ${cx} ${cy} ${pb.x} ${pb.y}`}
                stroke="currentColor"
                strokeWidth={(0.3 + weight / 60).toFixed(2)}
                fill="none"
                opacity={focused ? 0.9 : dimmed ? 0.06 : 0.22}
                style={{ transition: "opacity 200ms ease" }}
              />
            );
          })}
        </svg>

        <div className="center">{center}</div>

        {positions.map(({ id, x, y }) => {
          const p = PERSONAS_BY_ID[id];
          const isFocus = focus.persona === id;
          const inEdge = focusedEdges.some(
            (e) => e.a === id || e.b === id,
          );
          const dimmed =
            (focus.persona && !isFocus && !inEdge) ||
            (focus.claim && !inEdge) ||
            ((focus.verdict || focus.thread) &&
              focusedEdges.length > 0 &&
              !inEdge);
          return (
            <button
              key={id}
              className={
                "node" +
                (isFocus ? " focused" : "") +
                (dimmed ? " dimmed" : "")
              }
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setFocus({ persona: id })}
              onMouseLeave={() => setFocus({})}
              onFocus={() => setFocus({ persona: id })}
              onBlur={() => setFocus({})}
              aria-label={`${p.name}: ${p.blurb}`}
            >
              <Sigil id={id} size={28} />
              <span className="nm">{p.name}</span>
              {isFocus && (
                <span className="tip" role="tooltip">
                  &ldquo;{p.quote}&rdquo;
                </span>
              )}
            </button>
          );
        })}

        {/* Personas hidden by the scrubber render as faint ghosts */}
        {PERSONAS.slice(shownPersonas).map((p, i) => {
          const angle =
            ((shownPersonas + i) / PERSONAS.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * RAD;
          const y = 50 + Math.sin(angle) * RAD;
          return (
            <span
              key={p.id}
              className="node ghost"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-hidden="true"
            >
              <Sigil id={p.id} size={28} />
              <span className="nm">{p.name}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Scatter ---------- */
function Scatter({
  shownClaims,
  claims,
  base,
}: {
  shownClaims: number;
  claims: ClaimSummary[];
  base: string;
}) {
  const { focus, setFocus } = useFocus();
  const visible = claims.slice(0, shownClaims);
  return (
    <section
      className="scatter-section"
      aria-label="Claim scatter: thread vs verdict"
    >
      <h2>Every claim, plotted.</h2>
      <p className="sub">
        x: research thread &nbsp;·&nbsp; y: verdict &nbsp;·&nbsp; size: papers
        cited &nbsp;·&nbsp; color: verdict. Click to read the dossier; hover to
        light up its lenses above.
      </p>
      <div className="scatter">
        <div className="y-axis-label">
          {[...ALL_VERDICTS].reverse().map((v) => (
            <span key={v} data-active={focus.verdict === v ? "1" : "0"}>
              {VERDICT_KEY[v]}
            </span>
          ))}
        </div>
        <div className="grid" />
        <div className="x-axis-label">
          {THREADS.map((t) => (
            <span key={t} data-active={focus.thread === t ? "1" : "0"}>
              {t}
            </span>
          ))}
        </div>
        <div className="pts">
          {visible.map((c) => {
            const tx = THREADS.indexOf(c.thread as typeof THREADS[number]);
            const vy = ALL_VERDICTS.indexOf(c.verdict);
            const sameCell = visible.filter(
              (o) => o.thread === c.thread && o.verdict === c.verdict,
            );
            const idx = sameCell.indexOf(c);
            const j = (idx - (sameCell.length - 1) / 2) * 14;
            const x = ((tx + 0.5) / THREADS.length) * 100;
            const y = ((vy + 0.5) / ALL_VERDICTS.length) * 100;
            const size = 14 + (c.papersCount ?? 5) * 1.6;
            const isFocus = focus.claim === c.id;
            const haloByPersona =
              focus.persona && lensesOf(c).includes(focus.persona);
            const haloByCell =
              focus.verdict === c.verdict && focus.thread === c.thread;
            const halo = isFocus || haloByPersona || haloByCell;
            const dim =
              (focus.persona ||
                focus.claim ||
                (focus.verdict && focus.thread)) &&
              !halo;
            return (
              <a
                key={c.id}
                className={"pt" + (halo ? " halo" : "") + (dim ? " dim" : "")}
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
                onMouseEnter={() => setFocus({ claim: c.id })}
                onMouseLeave={() => setFocus({})}
                onFocus={() => setFocus({ claim: c.id })}
                onBlur={() => setFocus({})}
                aria-label={`Claim ${c.number}: ${c.title} (${c.verdict})`}
              >
                {String(c.number).padStart(2, "0")}
                {isFocus && (
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

/* ---------- Top-level: the linked instrument ---------- */
export function ClaimsExplorer({ claims, base }: Props) {
  const [focus, setFocus] = useState<Focus>({});
  const [shownClaims, setShownClaims] = useState(claims.length);
  const [shownPersonas, setShownPersonas] = useState(PERSONAS.length);

  return (
    <FocusCtx.Provider value={{ focus, setFocus }}>
      <Hero
        shownClaims={shownClaims}
        setShownClaims={setShownClaims}
        shownPersonas={shownPersonas}
        setShownPersonas={setShownPersonas}
      />
      <Matrix shownClaims={shownClaims} claims={claims} base={base} />
      <Constellation
        shownPersonas={shownPersonas}
        shownClaims={shownClaims}
        claims={claims}
      />
      <Scatter shownClaims={shownClaims} claims={claims} base={base} />
    </FocusCtx.Provider>
  );
}

export default ClaimsExplorer;
