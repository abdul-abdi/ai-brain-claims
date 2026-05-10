import type { PersonaId } from "../lib/personas";

const PATHS: Record<PersonaId, JSX.Element> = {
  karpathy: (
    <g>
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="5" y1="8" x2="5" y2="16" />
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="13" y1="9" x2="13" y2="15" />
      <line x1="17" y1="7" x2="17" y2="17" />
      <line x1="21" y1="10" x2="21" y2="14" />
    </g>
  ),
  bach: (
    <g>
      <path d="M5 9 C 5 4, 13 4, 14 9 C 15 14, 5 14, 5 19" />
      <path d="M19 15 C 19 20, 11 20, 10 15 C 9 10, 19 10, 19 5" />
    </g>
  ),
  hickey: (
    <g>
      <rect x="3" y="8" width="7" height="8" />
      <circle cx="18" cy="12" r="3.5" />
      <line x1="10" y1="12" x2="14.5" y2="12" />
      <polyline points="12.8,10.5 14.5,12 12.8,13.5" />
    </g>
  ),
  carmack: (
    <g>
      <line x1="3" y1="20" x2="21" y2="20" />
      <line x1="5" y1="20" x2="5" y2="17" />
      <line x1="9" y1="20" x2="9" y2="13" />
      <line x1="13" y1="20" x2="13" y2="6" />
      <line x1="17" y1="20" x2="17" y2="11" />
      <line x1="20" y1="20" x2="20" y2="15" />
    </g>
  ),
  victor: (
    <g>
      <circle cx="12" cy="12" r="4" />
      <path d="M5 7  L 9 11" />
      <path d="M5 17 L 9 13" />
      <path d="M19 7  L 15 11" />
      <path d="M19 17 L 15 13" />
    </g>
  ),
  cantrill: (
    <g>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2 L 12 6" />
      <path d="M12 18 L 12 22" />
      <path d="M2 12 L 6 12" />
      <path d="M18 12 L 22 12" />
      <path d="M5 5 L 7 7" />
      <path d="M19 19 L 17 17" />
    </g>
  ),
  ayanokoji: (
    <g>
      <path d="M12 4 C 6 4, 4 9, 4 13 C 4 18, 8 21, 12 21 C 16 21, 20 18, 20 13 C 20 9, 18 4, 12 4 Z" />
      <line x1="8.5" y1="11" x2="10.5" y2="11" />
      <line x1="13.5" y1="11" x2="15.5" y2="11" />
    </g>
  ),
  pg: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5 C 9 7, 15 7, 15 10 C 15 12, 12 12.5, 12 14.5" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" />
    </g>
  ),
  taleb: (
    <g>
      <path d="M2 18 C 6 18, 8 17, 9 14 C 10 9, 11 6, 12 6 C 13 6, 14 9, 15 14 C 16 17, 18 18, 22 18" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </g>
  ),
};

export interface SigilProps {
  id: PersonaId;
  size?: number;
  className?: string;
}

export function Sigil({ id, size = 24, className = "" }: SigilProps) {
  const s = PATHS[id];
  if (!s) return null;
  return (
    <span className={"sigil " + className} aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {s}
      </svg>
    </span>
  );
}

export default Sigil;
