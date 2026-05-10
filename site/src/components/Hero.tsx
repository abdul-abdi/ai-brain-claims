import { useEffect, useRef, useState } from "react";

interface ScrubProps {
  value: number;
  min: number;
  max: number;
  format?: (v: number) => string | number;
  ariaLabel: string;
}

export function ScrubNum({ value, min, max, format, ariaLabel }: ScrubProps) {
  const [v, setV] = useState(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const drag = useRef({ active: false, startY: 0, startV: value });

  useEffect(() => {
    setV(value);
  }, [value]);

  function down(e: React.PointerEvent<HTMLSpanElement>) {
    e.preventDefault();
    drag.current = { active: true, startY: e.clientY, startV: v };
    ref.current?.setPointerCapture?.(e.pointerId);
  }
  function move(e: React.PointerEvent<HTMLSpanElement>) {
    if (!drag.current.active) return;
    const dy = drag.current.startY - e.clientY;
    const next = Math.round(drag.current.startV + dy / 4);
    setV(Math.max(min, Math.min(max, next)));
  }
  function up(e: React.PointerEvent<HTMLSpanElement>) {
    drag.current.active = false;
    ref.current?.releasePointerCapture?.(e.pointerId);
  }
  function key(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      setV((x) => Math.min(max, x + 1));
      e.preventDefault();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      setV((x) => Math.max(min, x - 1));
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
      aria-valuenow={v}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onKeyDown={key}
      title="Drag vertically or use arrow keys"
    >
      {format ? format(v) : v}
    </span>
  );
}

export function HeroHeadline() {
  return (
    <h1 id="hero-h">
      We tested{" "}
      <ScrubNum value={10} min={1} max={10} ariaLabel="claim count" /> claims
      about AI ↔ brain at the frontier, ran them through{" "}
      <ScrubNum value={9} min={1} max={9} ariaLabel="persona count" /> persona
      lenses, and produced{" "}
      <ScrubNum
        value={0}
        min={0}
        max={10}
        format={(x) => (x === 0 ? "zero" : x)}
        ariaLabel="vindicated count"
      />{" "}
      clean verdicts.
    </h1>
  );
}
