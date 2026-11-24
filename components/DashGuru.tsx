"use client";
import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { GAMES, themes } from "@/lib/data";
import { SC, allSiswa, csv, exportJSON, gameName, importJSON, pct, statOf, tgl, topKata, unduh, type Siswa } from "@/lib/dash";
import Avatar from "./Avatar";

// PIN hanya pembatas sederhana di sisi peramban, bukan keamanan sungguhan. Ubah lewat variabel NEXT_PUBLIC_GURU_PIN di Vercel.
const PIN = process.env.NEXT_PUBLIC_GURU_PIN ?? "guru123";
const col = (p: number | null) => (p === null ? "#e5e7eb" : p >= 80 ? "#86efac" : p >= 60 ? "#fde68a" : "#fca5a5");
const mean = (a: (number | null)[]) => { const v = a.filter((x): x is number => x !== null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };

export default function DashGuru() {
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [list, setList] = useState<Siswa[]>([]);
  const [sort, setSort] = useState("absen");
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { try { if (sessionStorage.getItem("mw-guru") === "1") setOk(true); } catch {} }, []);
  useEffect(() => { if (ok) setList(allSiswa()); }, [ok]);

  if (!ok) {
    return (
      <main className="mx-auto max-w-sm px-4 py-12 text-center">
        <form className="card bg-white p-6" style={{ "--c": "#a78bfa" } as CSSProperties} onSubmit={(e) => { e.preventDefault(); if (pin === PIN) { try { sessionStorage.setItem("mw-guru", "1"); } catch {} setOk(true); } else setErr("PIN belum tepat, coba lagi ya."); }}>
          <p className="text-5xl">🧑‍🏫</p>
          <h1 className="text-2xl font-extrabold">Dashboard Guru</h1>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Masukkan PIN guru" aria-label="PIN guru" className="mt-4 w-full rounded-2xl border-4 border-[#a78bfa] px-4 py-2 text-center text-xl font-bold" />
          {err && <p className="mt-2 font-bold text-red-700">{err}</p>}
          <button type="submit" className="btn mt-4 w-full justify-center text-xl">Masuk</button>
        </form>
      </main>
    );
  }

  const rows = list.map((s) => ({ s, st: statOf(s.prog) }));
  rows.sort((a, b) => sort === "poin" ? b.st.poin - a.st.poin : sort === "nilai" ? (b.st.avg ?? -1) - (a.st.avg ?? -1) : Number(a.s.absen) - Number(b.s.absen));
  const kelas = mean(rows.map((r) => r.st.avg));
  const sulit = topKata(rows.reduce<Record<string, number>>((a, r) => { Object.entries(r.st.kata).forEach(([k, n]) => { a[k] = (a[k] ?? 0) + n; }); return a; }, {}), 10);
  const gameAvg = SC.map((id) => ({ id, v: mean(list.flatMap((s) => themes.map((t) => { const r = s.prog[t.slug]?.[id]; return r && r.total ? (r.score / r.total) * 100 : null; }))) }));

  const csvRingkas = () => unduh("rekap-kelas.csv", csv([["Absen", "Nama", "Poin", "Tema selesai", "Game selesai", "Rata-rata (%)", "Jumlah salah", "Terakhir", ...themes.map((t) => t.id)], ...rows.map(({ s, st }) => [s.absen, s.nama, st.poin, st.themesDone, st.gamesDone, st.avg === null ? "" : Math.round(st.avg), st.salah, tgl(st.last), ...themes.map((t) => { const v = st.perTheme[t.slug]; return v === null ? "" : Math.round(v); })])]), "text/csv");
  const csvRinci = () => unduh("rincian-game.csv", csv([["Absen", "Nama", "Tema", "Game", "Skor", "Total", "Jumlah salah", "Kata yang salah", "Waktu"], ...rows.flatMap(({ s }) => themes.flatMap((t) => GAMES.flatMap((g) => { const r = s.prog[t.slug]?.[g.id]; return r ? [[s.absen, s.nama, t.id, gameName(t.slug, g.id), r.score, r.total, r.salah ?? "", (r.kata ?? []).join(" | "), tgl(r.at)]] : []; })))]), "text/csv");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="card bg-white p-5 text-center" style={{ "--c": "#a78bfa" } as CSSProperties}>
        <h1 className="text-3xl font-extrabold">🧑‍🏫 Dashboard Guru</h1>
        <p className="font-bold">Rekap hasil belajar siswa yang tersimpan di perangkat ini.</p>
        <div className="no-print mt-3 flex flex-wrap justify-center gap-2">
          <button className="btn" onClick={() => setList(allSiswa())}>🔄 Muat ulang</button>
          <button className="btn" onClick={csvRingkas}>📄 Rekap (CSV)</button>
          <button className="btn" onClick={csvRinci}>📋 Rincian game (CSV)</button>
          <button className="btn" onClick={() => unduh("data-ma-warabic.json", exportJSON(list), "application/json")}>💾 Cadangkan data</button>
          <button className="btn" onClick={() => window.print()}>🖨️ Cetak</button>
        </div>
        <label className="no-print mt-3 inline-block rounded-2xl bg-[#f3ecff] px-4 py-2 text-sm font-bold">📥 Gabungkan data dari perangkat lain (.json):{" "}
          <input type="file" accept="application/json" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const n = importJSON(await f.text()); setMsg(`${n} siswa berhasil digabungkan.`); setList(allSiswa()); } catch { setMsg("Berkas tidak bisa dibaca."); } e.target.value = ""; }} />
        </label>
        {msg && <p className="mt-2 font-bold" aria-live="polite">{msg}</p>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["👥", `${rows.length}`, "Jumlah siswa"], ["🎯", pct(kelas), "Rata-rata nilai kelas"], ["🗺️", rows.length ? (rows.reduce((a, r) => a + r.st.themesDone, 0) / rows.length).toFixed(1) : "0", "Rata-rata tema selesai"], ["🔁", `${rows.reduce((a, r) => a + r.st.salah, 0)}`, "Total jawaban salah"]].map(([e, v, l]) => (
          <div key={l} className="card bg-white p-3 text-center" style={{ "--c": "#ffd23f" } as CSSProperties}><p className="text-2xl">{e}</p><p className="text-2xl font-extrabold">{v}</p><p className="text-sm font-bold">{l}</p></div>
        ))}
      </div>

      <div className="card mt-6 bg-white p-4" style={{ "--c": "#5aa0ff" } as CSSProperties}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold">Daftar siswa</h2>
          <label className="no-print text-sm font-bold">Urutkan:{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border-2 border-[#5aa0ff] px-2 py-1"><option value="absen">Nomor absen</option><option value="poin">Poin</option><option value="nilai">Nilai</option></select>
          </label>
        </div>
        {rows.length === 0 ? <p className="mt-3 font-bold">Belum ada data siswa di perangkat ini. Minta siswa masuk dan bermain, atau gabungkan data dari perangkat lain.</p> : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead><tr className="bg-[#dbe8ff] font-extrabold">{["Absen", "Nama", "Poin", "Tema", "Game", "Nilai", "Salah", "Terakhir"].map((h) => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map(({ s, st }) => (
                  <Fragment key={s.id}>
                    <tr onClick={() => setOpen(open === s.id ? null : s.id)} className="cursor-pointer border-b font-bold hover:bg-[#f3ecff]">
                      <td className="px-2 py-2">{s.absen}</td>
                      <td className="flex items-center gap-2 px-2 py-1">{s.avatar && <Avatar look={s.avatar} size={32} />}{s.nama}</td>
                      <td className="px-2">{st.poin}</td><td className="px-2">{st.themesDone}/{themes.length}</td><td className="px-2">{st.gamesDone}/{themes.length * GAMES.length}</td>
                      <td className="px-2"><span className="rounded-full px-2 py-0.5" style={{ background: col(st.avg) }}>{pct(st.avg)}</span></td>
                      <td className="px-2">{st.salah}</td><td className="px-2">{tgl(st.last)}</td>
                    </tr>
                    {open === s.id && (
                      <tr><td colSpan={8} className="bg-[#f8f5ff] p-3">
                        <div className="grid gap-2 sm:grid-cols-3">
                          {themes.map((t) => (
                            <div key={t.slug} className="rounded-xl bg-white p-2"><p className="text-sm font-extrabold">{t.id} <span className="rounded-full px-2" style={{ background: col(st.perTheme[t.slug]) }}>{pct(st.perTheme[t.slug])}</span></p>
                              <p className="flex flex-wrap gap-1 text-xs font-bold">{GAMES.map((g) => { const r = s.prog[t.slug]?.[g.id]; return <span key={g.id} title={gameName(t.slug, g.id)} className="rounded px-1" style={{ background: r ? (SC.includes(g.id) ? col((r.score / r.total) * 100) : "#d9f7e6") : "#eee" }}>{g.e} {r ? (SC.includes(g.id) ? `${r.score}/${r.total}` : "✔") : "–"}</span>; })}</p>
                            </div>
                          ))}
                        </div>
                        {topKata(st.kata, 8).length > 0 && <p className="mt-2 text-sm font-bold">Perlu diulang: {topKata(st.kata, 8).map(([k, n]) => <span key={k} className="arab mr-2 inline-block rounded bg-[#ffe3e3] px-2 text-lg">{k} ×{n}</span>)}</p>}
                      </td></tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="card bg-white p-4" style={{ "--c": "#2fbf71" } as CSSProperties}>
          <h2 className="text-xl font-extrabold">Rata-rata nilai per tema</h2>
          <ul className="mt-2 grid gap-2">{themes.map((t) => { const v = mean(list.map((s) => statOf(s.prog).perTheme[t.slug])); return (
            <li key={t.slug}><div className="flex justify-between text-sm font-bold"><span>{t.id}</span><span>{pct(v)}</span></div><div className="h-3 rounded-full bg-[#eef]"><div className="h-3 rounded-full" style={{ width: `${v ?? 0}%`, background: t.c }} /></div></li>); })}</ul>
        </div>
        <div className="grid gap-5">
          <div className="card bg-white p-4" style={{ "--c": "#ff9f1c" } as CSSProperties}>
            <h2 className="text-xl font-extrabold">Rata-rata nilai per game</h2>
            <ul className="mt-2 grid gap-1 text-sm font-bold">{gameAvg.map((g) => <li key={g.id} className="flex justify-between rounded-lg px-2 py-1" style={{ background: col(g.v) }}><span>{GAMES.find((x) => x.id === g.id)?.n ?? "Misi Tema"}</span><span>{pct(g.v)}</span></li>)}</ul>
          </div>
          <div className="card bg-white p-4" style={{ "--c": "#ff6b6b" } as CSSProperties}>
            <h2 className="text-xl font-extrabold">Kata tersulit di kelas</h2>
            {sulit.length ? <p className="mt-2 flex flex-wrap gap-2">{sulit.map(([k, n]) => <span key={k} className="arab rounded-xl bg-[#ffe3e3] px-3 py-1 text-xl font-extrabold">{k} <span className="text-xs">×{n}</span></span>)}</p> : <p className="mt-1 font-bold">Belum ada data.</p>}
          </div>
        </div>
      </div>
      <p className="no-print mt-6 text-center text-sm font-bold">Data tersimpan di peramban perangkat ini. Untuk menggabungkan dari beberapa perangkat, minta siswa menekan &ldquo;Unduh hasilku&rdquo; di Dashboard mereka, lalu gabungkan berkasnya di atas.</p>
    </main>
  );
}
