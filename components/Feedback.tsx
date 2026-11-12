"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { Illus } from "./Illus";

const cols = ["#ff6b6b", "#ffd23f", "#2fbf71", "#5aa0ff", "#ff5fa2", "#a78bfa"];

// Mendengarkan "mw-reaksi": benar = semprotan konfeti dari dua sisi, salah = emoji sedih.
export default function Feedback() {
  const [ev, setEv] = useState<{ k: number; ok: boolean } | null>(null);
  useEffect(() => {
    let n = 0, timer = 0;
    const h = (e: Event) => {
      n++; setEv({ k: n, ok: (e as CustomEvent<boolean>).detail });
      window.clearTimeout(timer); timer = window.setTimeout(() => setEv(null), 1700);
    };
    window.addEventListener("mw-reaksi", h);
    return () => { window.removeEventListener("mw-reaksi", h); window.clearTimeout(timer); };
  }, []);
  if (!ev) return null;
  return (
    <div key={ev.k} aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {ev.ok
        ? Array.from({ length: 44 }, (_, i) => {
            const left = i % 2 === 0;
            return <span key={i} className="shoot" style={{ [left ? "left" : "right"]: "4%", background: cols[i % 6], "--dx": `${(left ? 1 : -1) * (40 + ((i * 47) % 260))}px`, "--dy": `${-(260 + ((i * 61) % 380))}px`, animationDelay: `${(i % 6) * 0.04}s` } as CSSProperties} />;
          })
        : <div className="pop absolute inset-0 grid place-items-center"><Illus e="😢" size={120} /></div>}
    </div>
  );
}
