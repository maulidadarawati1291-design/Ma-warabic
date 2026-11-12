import type { CSSProperties } from "react";
import { Illus } from "./Illus";

const it = [
  { e: "☁️", x: 8, y: 6, s: 80, d: 30 }, { e: "☁️", x: 52, y: 12, s: 96, d: 38 }, { e: "🎈", x: 90, y: 58, s: 46, d: 9 },
  { e: "🦋", x: 72, y: 42, s: 40, d: 7 }, { e: "🌈", x: 34, y: 78, s: 76, d: 12 }, { e: "🎈", x: 3, y: 34, s: 42, d: 8 },
  { e: "📚", x: 18, y: 62, s: 38, d: 10 }, { e: "🕌", x: 82, y: 80, s: 56, d: 14 },
];
const cols = ["#ffffff", "#ffd23f", "#ff8fc0", "#7fd8ff"];
const sp = Array.from({ length: 18 }, (_, i) => ({ x: (i * 53) % 97 + 1, y: (i * 37) % 78 + 3, d: 2 + (i % 5) * 0.7, c: cols[i % 4], s: 14 + (i % 3) * 6 }));

export default function Bg() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]">
        <defs>
          <pattern id="star8" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M56 32 L43.1 36.6 L49 49 L36.6 43.1 L32 56 L27.4 43.1 L15 49 L20.9 36.6 L8 32 L20.9 27.4 L15 15 L27.4 20.9 L32 8 L36.6 20.9 L49 15 L43.1 27.4Z" fill="#2b2350" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#star8)" />
      </svg>
      <svg viewBox="0 0 120 120" className="absolute -right-6 -top-6 h-40 w-40">
        <g className="spin">
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1="60" y1="6" x2="60" y2="20" transform={`rotate(${i * 30} 60 60)`} stroke="#ffd23f" strokeWidth="5" strokeLinecap="round" />)}
        </g>
        <circle cx="60" cy="60" r="28" fill="#ffd23f" />
      </svg>
      {sp.map((o, i) => (
        <span key={i} className="twinkle absolute font-extrabold" style={{ left: `${o.x}%`, top: `${o.y}%`, color: o.c, fontSize: o.s, "--d": `${o.d}s` } as CSSProperties}>✦</span>
      ))}
      {it.map((o, i) => (
        <span key={i} className="float absolute opacity-80" style={{ left: `${o.x}%`, top: `${o.y}%`, "--d": `${o.d}s` } as CSSProperties}>
          <Illus e={o.e} size={o.s} />
        </span>
      ))}
      <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute bottom-0 h-40 w-full">
        <path className="drift" d="M-100 120 Q150 40 400 110 T900 100 T1300 110 V200 H-100Z" fill="#a8ecbd" opacity=".75" />
        <path d="M0 150 Q200 90 450 145 T950 135 T1200 140 V200 H0Z" fill="#6fd699" opacity=".8" />
        <path className="drift" style={{ animationDuration: "14s" }} d="M-100 180 Q200 130 500 175 T1000 170 T1300 175 V200 H-100Z" fill="#3fb86a" opacity=".85" />
      </svg>
    </div>
  );
}
