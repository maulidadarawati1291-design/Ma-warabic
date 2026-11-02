"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { themes } from "@/lib/data";
import { loadProgress, stars, type Progress } from "@/lib/util";
import { Illus } from "./Illus";

export default function ThemeMap() {
  const [p, setP] = useState<Progress>({});
  const [all, setAll] = useState(false);
  useEffect(() => { setP(loadProgress()); }, []);
  const passed = (slug: string) => !!p[slug] && p[slug].score / p[slug].total >= 0.6;
  const done = themes.filter((t) => p[t.slug]).length;

  return (
    <section id="peta" className="mx-auto max-w-2xl px-4 py-10">
      <h2 className="text-center text-4xl font-extrabold">Peta Petualangan</h2>
      <p className="mt-1 text-center font-bold">
        {done} dari {themes.length} tema sudah dicoba. Raih skor minimal 6 dari 10 untuk membuka tema berikutnya.
      </p>
      <label className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-bold">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Buka semua tema (mode guru)
      </label>
      <ol className="mt-8 flex flex-col gap-6">
        {themes.map((t, i) => {
          const open = all || i === 0 || passed(themes[i - 1].slug);
          const r = p[t.slug];
          const s = r ? stars(r) : 0;
          const cls = `card flex w-[92%] items-center gap-3 p-4 ${i % 2 ? "self-end" : "self-start"}`;
          const st = { "--c": t.c, background: t.bg } as CSSProperties;
          const inner = (
            <>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-2xl font-extrabold" style={{ border: `4px solid ${t.c}` }}>
                {open ? i + 1 : "🔒"}
              </span>
              <Illus e={t.e} size={64} />
              <span className="min-w-0 flex-1">
                <span className="arab block text-left text-xl font-extrabold">{t.ar}</span>
                <span className="block font-bold">{t.id}</span>
                <span className="text-lg font-bold">{r ? <span style={{ color: "#c98700" }}>{"★".repeat(s)}{"☆".repeat(3 - s)}</span> : open ? "Ayo mulai!" : "Selesaikan tema sebelumnya"}</span>
              </span>
            </>
          );
          return (
            <li key={t.slug} className="contents">
              {open ? <Link href={`/tema/${t.slug}`} className={cls} style={st}>{inner}</Link>
                : <div className={`${cls} opacity-60 grayscale`} style={st}>{inner}</div>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
