import type { CSSProperties } from "react";
import { Illus } from "./Illus";

const it = [
  { e: "☁️", x: 8, y: 6, s: 80, d: 30 }, { e: "☁️", x: 62, y: 14, s: 96, d: 38 }, { e: "🎈", x: 88, y: 66, s: 52, d: 9 },
  { e: "⭐", x: 14, y: 58, s: 38, d: 5 }, { e: "🦋", x: 72, y: 40, s: 42, d: 7 }, { e: "🌈", x: 38, y: 86, s: 80, d: 12 }, { e: "🎈", x: 4, y: 30, s: 46, d: 8 },
];

export default function Bg() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {it.map((o, i) => (
        <span key={i} className="float absolute opacity-70" style={{ left: `${o.x}%`, top: `${o.y}%`, "--d": `${o.d}s` } as CSSProperties}>
          <Illus e={o.e} size={o.s} />
        </span>
      ))}
    </div>
  );
}
