"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { GAMES, themes } from "@/lib/data";
import { getProfil, loadProg, perfect, points, type Profil, type Prog } from "@/lib/util";
import { Illus } from "./Illus";
import Avatar from "./Avatar";

export default function ThemeMap() {
  const r = useRouter();
  const [pf, setPf] = useState<Profil | null>(null);
  const [p, setP] = useState<Prog>({});
  const [all, setAll] = useState(false);
  useEffect(() => {
    const x = getProfil();
    if (!x) { r.replace("/"); return; }
    setPf(x); setP(loadProg());
  }, [r]);
  if (!pf) return null;
  const n = (slug: string) => GAMES.filter((g) => perfect(p[slug]?.[g.id])).length;

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <div className="card flex items-center gap-3 bg-white p-3" style={{ "--c": "#ffd23f" } as CSSProperties}>
        <span className="bob"><Avatar look={pf.avatar} size={64} /></span>
        <div>
          <p className="text-xl font-extrabold">{pf.nama}</p>
          <p className="text-sm font-bold">No. absen {pf.absen}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-extrabold">⭐ {points(p)} poin</p>
          <Link href="/" className="text-sm font-bold underline">Ganti profil</Link>
        </div>
      </div>
      <h1 className="mt-6 text-center text-4xl font-extrabold">Peta Petualangan</h1>
      <p className="mt-1 text-center font-bold">Selesaikan semua game dengan sempurna untuk membuka tema berikutnya. Jika keluar sebelum satu tema selesai, tema itu diulang dari awal.</p>
      <label className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-bold">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Buka semua tema (mode guru)
      </label>
      <ol className="mt-8 flex flex-col gap-6">
        {themes.map((t, i) => {
          const open = all || i === 0 || n(themes[i - 1].slug) === GAMES.length;
          const cls = `card wiggle flex w-[92%] items-center gap-3 p-4 ${i % 2 ? "self-end" : "self-start"}`;
          const st = { "--c": t.c, background: t.bg } as CSSProperties;
          const inner = (
            <>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-2xl font-extrabold" style={{ border: `4px solid ${t.c}` }}>{open ? i + 1 : "🔒"}</span>
              <span className="bob"><Illus e={t.e} size={64} /></span>
              <span className="min-w-0 flex-1">
                <span className="arab block text-left text-xl font-extrabold">{t.ar}</span>
                <span className="block font-bold">{t.id}</span>
                <span className="text-sm font-bold">{n(t.slug) === GAMES.length ? "🏆 Tema selesai!" : open ? `${n(t.slug)}/${GAMES.length} game sempurna` : "Selesaikan tema sebelumnya"}</span>
              </span>
            </>
          );
          return (
            <li key={t.slug} className="contents">
              {open ? <Link href={`/tema/${t.slug}`} className={cls} style={st}>{inner}</Link> : <div className={`${cls} opacity-60 grayscale`} style={st}>{inner}</div>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
