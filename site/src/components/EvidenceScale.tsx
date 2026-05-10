import { useEffect, useMemo, useRef, useState } from "react";
import type { Verdict } from "../lib/verdicts";
import { VERDICT_KEY } from "../lib/verdicts";

interface Citation {
  yr: number;
  ttl: string;
  authors: string;
}

interface Props {
  claimId: string;
  verdict: Verdict;
  forCount: number;
  againstCount: number;
  papers: Citation[];
}

interface Pip {
  side: "for" | "against" | "steelman";
  pos: number;
  label: string;
}

const VERDICT_TARGET: Record<Verdict, number> = {
  VINDICATED: 22,
  PLAUSIBLE: 38,
  CONTESTED: 56,
  SPLIT: 50,
  REFUTED: 78,
  UNFALSIFIABLE: 50,
};

export function EvidenceScale({
  claimId,
  verdict,
  forCount,
  againstCount,
  papers,
}: Props) {
  const items = useMemo<Pip[]>(() => {
    const out: Pip[] = [];
    function rand(seed: number, i: number) {
      let x = (seed + i * 73) >>> 0;
      x ^= x << 13;
      x >>>= 0;
      x ^= x >> 17;
      x ^= x << 5;
      x >>>= 0;
      return (x % 1000) / 1000;
    }
    const seed =
      Math.abs(
        claimId.split("").reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 7),
      ) || 7;
    for (let i = 0; i < forCount; i++) {
      out.push({
        side: "for",
        pos: 50 - (10 + rand(seed, i) * 38),
        label: papers[i % Math.max(papers.length, 1)]?.authors || "for",
      });
    }
    for (let i = 0; i < againstCount; i++) {
      out.push({
        side: "against",
        pos: 50 + (10 + rand(seed, i + 30) * 38),
        label:
          papers[(i + 1) % Math.max(papers.length, 1)]?.authors || "against",
      });
    }
    out.push({ side: "steelman", pos: 52, label: "steelman" });
    return out;
  }, [claimId, forCount, againstCount, papers]);

  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [needle, setNeedle] = useState(50);
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<number | null>(null);

  function play() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setPhase("playing");
    setRevealed(0);
    setNeedle(50);
    const total = items.length;
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i++;
      setRevealed(i);
      const sofar = items.slice(0, i);
      const f = sofar.filter((x) => x.side === "for").length;
      const a = sofar.filter((x) => x.side === "against").length;
      const s = sofar.filter((x) => x.side === "steelman").length;
      const tilt = a - f + s * 0.6;
      const target = VERDICT_TARGET[verdict] ?? 50;
      const blended = 50 + tilt * 4 + (target - 50) * (i / total);
      setNeedle(Math.max(8, Math.min(92, blended)));
      if (i >= total) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setNeedle(target);
        setPhase("done");
      }
    }, 220);
  }

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(items.length);
      setNeedle(VERDICT_TARGET[verdict] ?? 50);
      setPhase("done");
    } else {
      const t = window.setTimeout(play, 600);
      return () => {
        window.clearTimeout(t);
        if (timerRef.current) window.clearInterval(timerRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId]);

  return (
    <div className="evidence">
      <header>
        <span>Evidence accumulating</span>
        <span>
          <b>{revealed}</b> / {items.length} points considered
        </span>
      </header>
      <div className="scale">
        {items.slice(0, revealed).map((it, i) => (
          <span
            key={i}
            className="pip"
            data-side={it.side}
            style={{
              left: `${it.pos}%`,
              height: it.side === "steelman" ? "70%" : "100%",
            }}
            tabIndex={0}
          >
            <span className="pip-label">{it.label}</span>
          </span>
        ))}
        <span
          className="needle"
          style={{ left: `${needle}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="verdict-row">
        <span>
          <span style={{ marginRight: "0.6rem" }}>For ←</span> support · steelman
          · against{" "}
          <span style={{ marginLeft: "0.6rem" }}>→ Against</span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "1rem" }}>
          <span className="verdict-pill" data-v={VERDICT_KEY[verdict]}>
            {verdict.toLowerCase()}
          </span>
          <button className="replay" onClick={play} disabled={phase === "playing"}>
            {phase === "playing" ? "Playing…" : "Play again"}
          </button>
        </span>
      </div>
    </div>
  );
}

export default EvidenceScale;
