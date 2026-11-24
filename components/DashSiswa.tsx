"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { GAMES, themes } from "@/lib/data";
import { getProfil, idOf, loadProg, type Profil, type Prog } from "@/lib/util";
import { badges, exportJSON, gameName, pct, statOf, tgl, topKata, unduh } from "@/lib/dash";
import Avatar from "./Avatar";

const Tile = ({ e, v, l }: { e: string; v: string; l: string }) => (
  <div className="card bg-white p-3 text-center" style={{ "--c": "#ffd23f" } as CSSProperties}>
    <p className="text-2xl">{e}</p><p className="text-2xl font-extrabold">{v}</p><p className="text-sm font-bold">{l}</p>
  </div>
);

export default function DashSiswa() {
  const r = useRouter();
  const [pf, setPf] = useState<Profil | null>(null);
  const [prog, setProg] = useState<Prog>({});
  useEffect(() => {
    const p = getProfil();
    if (!p) { r.replace("/"); return; }
    setPf(p); setProg(loadProg());
  }, [r]);
  if (!pf) return null;

  const s = statOf(prog);
  const bd = badges(s);
  const rows = themes.flatMap((t) => GAMES.flatMap((g) => { const x = prog[t.slug]?.[g.id]; return x ? [{ t: t.id, g: gameName(t.slug, g.id), x }] : []; })).sort((a, b) => (b.x.at ?? 0) - (a.x.at ?? 0)).slice(0, 8);
  const ulang = topKata(s.kata, 8);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/peta" className="btn no-print">← Peta Petualangan</Link>
      <div className="card mt-5 flex items-center gap-4 bg-white p-4" style={{ "--c": "#ff8fc0" } as CSSProperties}>
        <span className="bob"><Avatar look={pf.avatar} size={90} /></span>
        <div>
          <h1 className="text-3xl font-extrabold">{pf.nama}</h1>
          <p className="font-bold">No. absen {pf.absen} · ⭐ {s.poin} poin</p>
          <p className="mt-1 flex flex-wrap gap-2">{bd.map((b) => <span key={b} className="rounded-full bg-[#ffd23f] px-3 py-0.5 text-sm font-extrabold">{b}</span>)}{!bd.length && <span className="text-sm font-bold">Selesaikan satu tema untuk mendapat lencana pertama!</span>}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile e="🗺️" v={`${s.themesDone}/${themes.length}`} l="Tema selesai" />
        <Tile e="🎮" v={`${s.gamesDone}/${themes.length * GAMES.length}`} l="Game selesai" />
        <Tile e="🎯" v={pct(s.avg)} l="Nilai rata-rata" />
        <Tile e="🔁" v={`${s.salah}`} l="Jumlah salah" />
      </div>
      <div className="card mt-6 bg-white p-4" style={{ "--c": "#5aa0ff" } as CSSProperties}>
        <h2 className="text-xl font-extrabold">Progres tiap tema</h2>
        <ul className="mt-3 grid gap-3">
          {themes.map((t) => {
            const g = prog[t.slug] ?? {};
            const d = GAMES.filter((x) => !!g[x.id]).length;
            return (
              <li key={t.slug}>
                <div className="flex justify-between text-sm font-bold"><span>{t.id}</span><span>{d}/{GAMES.length} game · nilai {pct(s.perTheme[t.slug])}</span></div>
                <div className="h-3 rounded-full bg-[#f3ecff]"><div className="h-3 rounded-full" style={{ width: `${(d / GAMES.length) * 100}%`, background: t.c }} /></div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="card mt-6 bg-white p-4" style={{ "--c": "#ff6b6b" } as CSSProperties}>
        <h2 className="text-xl font-extrabold">Ayo ulangi kata-kata ini</h2>
        {ulang.length ? (
          <p className="mt-2 flex flex-wrap gap-2">{ulang.map(([k, n]) => <span key={k} className="arab rounded-xl bg-[#ffe3e3] px-3 py-1 text-xl font-extrabold">{k} <span className="text-xs">×{n}</span></span>)}</p>
        ) : <p className="mt-1 font-bold">Belum ada kata yang perlu diulang. Hebat, pertahankan!</p>}
      </div>
      <div className="card mt-6 bg-white p-4" style={{ "--c": "#2fbf71" } as CSSProperties}>
        <h2 className="text-xl font-extrabold">Riwayat terbaru</h2>
        {rows.length ? (
          <ul className="mt-2 grid gap-2">{rows.map((x, i) => <li key={i} className="flex flex-wrap justify-between gap-2 rounded-xl bg-[#d9f7e6] px-3 py-2 text-sm font-bold"><span>{x.t} · {x.g}</span><span>{x.x.score}/{x.x.total} · {tgl(x.x.at)}</span></li>)}</ul>
        ) : <p className="mt-1 font-bold">Belum ada game yang selesai. Ayo mulai petualanganmu!</p>}
      </div>
      <button className="btn no-print mt-6" onClick={() => unduh(`hasil-${idOf(pf.nama, pf.absen)}.json`, exportJSON([{ id: idOf(pf.nama, pf.absen), nama: pf.nama, absen: pf.absen, avatar: pf.avatar, prog }]), "application/json")}>📤 Unduh hasilku untuk guru</button>
    </main>
  );
}
