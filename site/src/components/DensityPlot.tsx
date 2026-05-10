import { useState } from "react";

export interface DensityPaper {
  yr: number;
  ttl: string;
  authors: string;
  prov?: number;
}

interface Props {
  papers: DensityPaper[];
  minYear?: number;
  maxYear?: number;
}

export function DensityPlot({ papers, minYear = 1950, maxYear = 2026 }: Props) {
  const [tip, setTip] = useState<{ p: DensityPaper; left: number } | null>(null);
  const span = maxYear - minYear || 1;
  return (
    <div className="density">
      <div className="axis-row">
        {papers.map((p, i) => {
          const left = ((p.yr - minYear) / span) * 100;
          const h = 30 + (p.prov ?? 3) * 7 + (i % 3) * 5;
          return (
            <button
              key={i}
              className="tick"
              style={{ left: `${left}%`, height: `${h}px` }}
              onMouseEnter={() => setTip({ p, left })}
              onMouseLeave={() => setTip(null)}
              onFocus={() => setTip({ p, left })}
              onBlur={() => setTip(null)}
              aria-label={`${p.yr} — ${p.authors}: ${p.ttl}`}
            />
          );
        })}
        {tip && (
          <span
            className="tip"
            style={{ left: `${tip.left}%`, transform: "translateX(-50%)" }}
          >
            <b>{tip.p.yr}</b> · {tip.p.authors}
            <br />
            <em>{tip.p.ttl}</em>
          </span>
        )}
      </div>
      <div className="axis" />
      <div className="axis-marks">
        <span>{minYear}</span>
        <span>1980</span>
        <span>2000</span>
        <span>2017</span>
        <span>2024</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}

export default DensityPlot;
