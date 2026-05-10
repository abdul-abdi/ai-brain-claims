/**
 * ClaimsExplorer — filterable grid + thread×verdict matrix.
 *
 * The matrix makes visible what the home page only states: every claim
 * lands in CONTESTED or SPLIT. When you can see the structure, the
 * convergence becomes undeniable. Clicking a cell filters the grid below.
 *
 * This is the difference between reading a finding and seeing it.
 */
import { useState, useMemo } from "react";
import type { ClaimSummary, Verdict } from "../lib/verdicts";
import { VERDICTS, THREADS } from "../lib/verdicts";

interface Props {
  claims: ClaimSummary[];
  base: string; // BASE URL prefix for links
}

const THREAD_ORDER = [
  "memory",
  "architecture",
  "metacognition",
  "social",
] as const;
const VERDICT_ORDER: Verdict[] = [
  "VINDICATED",
  "PLAUSIBLE",
  "CONTESTED",
  "SPLIT",
  "REFUTED",
  "UNFALSIFIABLE",
];

const THREAD_LABELS: Record<string, string> = {
  memory: "Memory & Context",
  architecture: "Architecture",
  metacognition: "Metacognition",
  social: "Social & Identity",
};

const TEXT_INK = "#1A1714";
const TEXT_MUTED = "#5A524A";
const ACCENT = "#CC785C";
const BG_CARD = "#FDFCF9";

// Tailwind-based verdict colors (must match tailwind.config)
const VERDICT_HEX: Record<Verdict, { fill: string; bg: string; text: string }> =
  {
    VINDICATED: { fill: "#587C5A", bg: "#EDF4EC", text: "#3A5E3C" },
    PLAUSIBLE: { fill: "#4A7A8A", bg: "#EAF3F5", text: "#2E5E6A" },
    CONTESTED: { fill: "#B07D2C", bg: "#FBF3E4", text: "#8A5F1A" },
    SPLIT: { fill: "#8B5E3C", bg: "#F7EDE3", text: "#6B3E1C" },
    REFUTED: { fill: "#9C4943", bg: "#F5DDDA", text: "#7A2E28" },
    UNFALSIFIABLE: { fill: "#5A4E8A", bg: "#EDEAF5", text: "#3A2E6A" },
  };

function VerdictBadge({
  verdict,
  small = false,
  muted = false,
}: {
  verdict: Verdict;
  small?: boolean;
  muted?: boolean;
}) {
  const { bg, text, fill } = VERDICT_HEX[verdict];
  return (
    <span
      className="inline-flex items-center rounded-full font-sans font-medium"
      style={{
        background: muted ? "transparent" : bg,
        color: muted ? TEXT_MUTED : text,
        border: `1px solid ${muted ? "rgba(168,156,136,0.3)" : fill + "55"}`,
        fontSize: small ? "0.6rem" : "0.7rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: small ? "0.1rem 0.45rem" : "0.15rem 0.6rem",
        opacity: muted ? 0.6 : 1,
      }}
    >
      {VERDICTS[verdict].label}
    </span>
  );
}

export function ClaimsExplorer({ claims, base }: Props) {
  const [filterVerdict, setFilterVerdict] = useState<Verdict | null>(null);
  const [filterThread, setFilterThread] = useState<string | null>(null);

  // Build matrix: thread × verdict → claims[]
  const matrix = useMemo(() => {
    const m: Record<string, Record<Verdict, ClaimSummary[]>> = {};
    for (const t of THREAD_ORDER) {
      m[t] = {} as Record<Verdict, ClaimSummary[]>;
      for (const v of VERDICT_ORDER) {
        m[t][v] = [];
      }
    }
    for (const c of claims) {
      if (m[c.thread] && m[c.thread][c.verdict] !== undefined) {
        m[c.thread][c.verdict].push(c);
      }
    }
    return m;
  }, [claims]);

  // Verdicts that actually appear
  const activeVerdicts = useMemo(
    () => VERDICT_ORDER.filter((v) => claims.some((c) => c.verdict === v)),
    [claims],
  );

  const filtered = useMemo(() => {
    return claims.filter((c) => {
      if (filterVerdict && c.verdict !== filterVerdict) return false;
      if (filterThread && c.thread !== filterThread) return false;
      return true;
    });
  }, [claims, filterVerdict, filterThread]);

  const hasFilter = filterVerdict !== null || filterThread !== null;

  function handleCellClick(thread: string, verdict: Verdict) {
    const cellClaims = matrix[thread][verdict];
    if (cellClaims.length === 0) return;
    if (filterThread === thread && filterVerdict === verdict) {
      // same cell → clear
      setFilterThread(null);
      setFilterVerdict(null);
    } else {
      setFilterThread(thread);
      setFilterVerdict(verdict);
    }
  }

  function clearFilters() {
    setFilterThread(null);
    setFilterVerdict(null);
  }

  return (
    <div>
      {/* The matrix — thread rows × verdict columns */}
      <div className="mb-8">
        <p
          className="mb-3 font-sans text-xs uppercase tracking-[0.18em]"
          style={{ color: TEXT_MUTED }}
        >
          Claims by thread × verdict — click any cell to filter
        </p>
        <div className="overflow-x-auto">
          <table
            className="w-full text-left font-sans text-xs"
            style={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th
                  className="pb-2 pr-4 font-medium"
                  style={{ color: TEXT_MUTED, minWidth: "9rem" }}
                >
                  Thread
                </th>
                {activeVerdicts.map((v) => (
                  <th
                    key={v}
                    className="pb-2 pr-2 text-center font-medium"
                    style={{ color: TEXT_MUTED, minWidth: "6rem" }}
                  >
                    <button
                      className="transition-opacity hover:opacity-80"
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        opacity: filterVerdict && filterVerdict !== v ? 0.4 : 1,
                      }}
                      onClick={() =>
                        setFilterVerdict((prev) => (prev === v ? null : v))
                      }
                      aria-pressed={filterVerdict === v}
                      aria-label={`Filter by verdict: ${VERDICTS[v].label}`}
                    >
                      <VerdictBadge verdict={v} small />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {THREAD_ORDER.map((thread) => (
                <tr key={thread}>
                  <td
                    className="pr-4 py-1.5 align-middle"
                    style={{
                      color:
                        filterThread && filterThread !== thread
                          ? TEXT_MUTED
                          : TEXT_INK,
                      opacity:
                        filterThread && filterThread !== thread ? 0.4 : 1,
                      fontWeight: 500,
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textAlign: "left",
                        color: "inherit",
                        font: "inherit",
                        opacity: 1,
                      }}
                      onClick={() =>
                        setFilterThread((prev) =>
                          prev === thread ? null : thread,
                        )
                      }
                      aria-pressed={filterThread === thread}
                      aria-label={`Filter by thread: ${THREAD_LABELS[thread]}`}
                    >
                      {THREAD_LABELS[thread]}
                    </button>
                  </td>
                  {activeVerdicts.map((v) => {
                    const cell = matrix[thread][v];
                    const isEmpty = cell.length === 0;
                    const isActive =
                      filterThread === thread && filterVerdict === v;
                    const isDimmed =
                      hasFilter &&
                      !isActive &&
                      (filterThread !== null
                        ? filterThread !== thread
                        : true) &&
                      (filterVerdict !== null ? filterVerdict !== v : true);

                    const { fill, bg } = VERDICT_HEX[v];

                    return (
                      <td
                        key={v}
                        className="py-1.5 pr-2 align-middle text-center"
                      >
                        {isEmpty ? (
                          <span
                            className="inline-block rounded"
                            style={{
                              width: "2.5rem",
                              height: "1.5rem",
                              background: "rgba(168,156,136,0.08)",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => handleCellClick(thread, v)}
                            aria-pressed={isActive}
                            aria-label={`${THREAD_LABELS[thread]}, ${VERDICTS[v].label}: ${cell.length} claim${cell.length > 1 ? "s" : ""}`}
                            className="rounded transition-all duration-150"
                            style={{
                              background: isActive ? fill : bg,
                              color: isActive ? "#FDFCF9" : fill,
                              border: `1.5px solid ${isActive ? fill : fill + "60"}`,
                              padding: "0.2rem 0.55rem",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              fontVariantNumeric: "tabular-nums",
                              opacity: isDimmed ? 0.3 : 1,
                              transition:
                                "background 0.15s, color 0.15s, opacity 0.15s",
                              minWidth: "2.5rem",
                            }}
                          >
                            {cell.length}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter status + clear */}
      <div
        className="mb-6 flex items-center gap-3 font-sans text-sm"
        style={{ minHeight: "2rem" }}
      >
        {hasFilter ? (
          <>
            <span style={{ color: TEXT_MUTED }}>
              Showing {filtered.length} of {claims.length} claims
              {filterThread && (
                <>
                  {" "}
                  ·{" "}
                  <strong style={{ color: TEXT_INK }}>
                    {THREAD_LABELS[filterThread]}
                  </strong>
                </>
              )}
              {filterVerdict && (
                <>
                  {" "}
                  ·{" "}
                  <strong style={{ color: VERDICT_HEX[filterVerdict].text }}>
                    {VERDICTS[filterVerdict].label}
                  </strong>
                </>
              )}
            </span>
            <button
              onClick={clearFilters}
              className="rounded border px-3 py-1 text-xs transition-colors"
              style={{
                background: "transparent",
                border: "1px solid rgba(168,156,136,0.4)",
                color: TEXT_MUTED,
                cursor: "pointer",
              }}
            >
              Clear ×
            </button>
          </>
        ) : (
          <span style={{ color: TEXT_MUTED, fontSize: "0.8rem" }}>
            All {claims.length} claims
          </span>
        )}
      </div>

      {/* Claims grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const numStr = String(c.number).padStart(2, "0");
          const { bg, text, fill } = VERDICT_HEX[c.verdict];
          const href = `${base}/claims/${c.id}`;
          return (
            <a
              key={c.id}
              href={href}
              className="group block rounded-lg border no-underline transition-all duration-200"
              style={{
                background: BG_CARD,
                borderColor: "rgba(168,156,136,0.2)",
                padding: "1.5rem",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  ACCENT + "80";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 30px -12px rgba(204,120,92,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(168,156,136,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <span
                  className="font-mono text-sm"
                  style={{ color: TEXT_MUTED }}
                >
                  Claim {numStr}
                </span>
                <VerdictBadge verdict={c.verdict} small />
              </div>

              <h3
                className="mt-3 font-serif text-xl font-medium leading-snug"
                style={{ color: TEXT_INK }}
              >
                {c.title}
              </h3>

              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: TEXT_MUTED }}
              >
                <p>
                  <span
                    className="font-sans font-medium uppercase"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      color: VERDICT_HEX["VINDICATED"].fill,
                    }}
                  >
                    For
                  </span>
                  <span className="ml-2" style={{ color: "#3A3530" }}>
                    {c.oneLineFor}
                  </span>
                </p>
                <p>
                  <span
                    className="font-sans font-medium uppercase"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      color: VERDICT_HEX["REFUTED"].fill,
                    }}
                  >
                    Against
                  </span>
                  <span className="ml-2" style={{ color: "#3A3530" }}>
                    {c.oneLineAgainst}
                  </span>
                </p>
              </div>

              <div
                className="mt-5 flex items-center justify-between border-t pt-4 font-sans text-xs"
                style={{
                  borderColor: "rgba(168,156,136,0.15)",
                  color: TEXT_MUTED,
                }}
              >
                <span>Lenses: {c.personas.join(" + ")}</span>
                <span className="capitalize">{c.thread}</span>
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="py-16 text-center font-serif"
          style={{ color: TEXT_MUTED }}
        >
          No claims match this filter combination.
          <button
            onClick={clearFilters}
            className="ml-3 underline"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: ACCENT,
              font: "inherit",
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
