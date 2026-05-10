import { useState } from "react";
import { ROUNDTABLE, PERSONAS_BY_ID } from "../lib/personas";
import { Sigil } from "./Sigil";

function PersonaInline({ id, role }: { id: keyof typeof PERSONAS_BY_ID; role?: string }) {
  const p = PERSONAS_BY_ID[id];
  if (!p) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
      <Sigil id={p.id} size={20} />
      <b
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontWeight: 400,
          color: "var(--ink)",
        }}
      >
        {p.name}
      </b>
      {role && (
        <span
          style={{
            fontFamily: "var(--sans)",
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
          }}
        >
          {role}
        </span>
      )}
    </span>
  );
}

function RTCard({
  persona,
  round,
  kind,
  text,
  fromName,
}: {
  persona: keyof typeof PERSONAS_BY_ID;
  round: 1 | 2;
  kind?: "dismantle" | "steelman" | "shift";
  text: string;
  fromName?: string;
}) {
  const labelMap: Record<string, string> = {
    dismantle: `${fromName} → dismantle`,
    steelman: `${fromName} → steelman`,
    shift: `${fromName} → shift`,
  };
  return (
    <article className={"rt-card" + (round === 2 ? " r2 " + (kind ?? "") : "")}>
      <div className="head">
        <PersonaInline id={persona} />
        <span className="round-tag">R{round}</span>
      </div>
      {round === 2 && kind && <span className="arrow">{labelMap[kind]}</span>}
      <div>{text}</div>
    </article>
  );
}

export function RoundtableTree() {
  const [showR2, setShowR2] = useState(true);
  const personas = ROUNDTABLE.r1.map((c) => c.p);
  return (
    <>
      <div className="rt-controls" role="group" aria-label="Round visibility">
        <button aria-pressed={!showR2} onClick={() => setShowR2(false)}>
          R1 only
        </button>
        <button aria-pressed={showR2} onClick={() => setShowR2(true)}>
          R1 + R2
        </button>
      </div>

      <div className="rt-tree">
        {ROUNDTABLE.r1.map((c, i) => (
          <RTCard key={i} persona={c.p} round={1} text={c.text} />
        ))}
      </div>

      {showR2 && (
        <>
          <div className="rt-arrow" aria-hidden="true">
            cross-examination
          </div>
          <div className="rt-tree">
            {personas.map((targetId) => {
              const card = ROUNDTABLE.r2.find((c) => c.to === targetId);
              if (!card) return <div key={targetId} />;
              const fromName = PERSONAS_BY_ID[card.from]?.name ?? "";
              return (
                <RTCard
                  key={targetId}
                  persona={card.to}
                  round={2}
                  kind={card.kind}
                  text={card.text}
                  fromName={fromName}
                />
              );
            })}
          </div>
          <div
            style={{
              marginTop: "3rem",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1rem",
              maxWidth: "65ch",
            }}
          >
            <div className="tracked">What changed between rounds</div>
            <p style={{ color: "var(--ink-sub)" }}>
              No persona fully reversed. <b style={{ color: "var(--ink)" }}>Hickey</b> moved
              — the only mover — from "stable named identities" to "named-pair presets,"
              which is the position the v1 actually shipped. The orchestrator interpreted
              this as the strongest possible verdict: the roundtable agreed on the
              narrowest design, not the most ambitious one.
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default RoundtableTree;
