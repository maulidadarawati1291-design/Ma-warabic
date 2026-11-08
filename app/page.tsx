"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AVATARS } from "@/lib/data";
import { getProfil, idOf, loadProg, points, setProfil } from "@/lib/util";
import { Illus } from "@/components/Illus";

export default function Masuk() {
  const r = useRouter();
  const [nama, setNama] = useState("");
  const [absen, setAbsen] = useState("");
  const [av, setAv] = useState("");
  const [pts, setPts] = useState(0);
  useEffect(() => { const p = getProfil(); if (p) { setNama(p.nama); setAbsen(p.absen); setAv(p.avatar); } }, []);
  useEffect(() => { setPts(nama.trim() && absen.trim() ? points(loadProg(idOf(nama, absen))) : 0); }, [nama, absen]);
  const can = nama.trim() && absen.trim() && AVATARS.some((a) => a.e === av && pts >= a.min);

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!can) return;
    setProfil({ nama: nama.trim(), absen: absen.trim(), avatar: av });
    r.push("/peta");
  }
  const field = "w-full rounded-2xl border-4 border-[#ffd23f] bg-white px-4 py-2 text-xl font-bold";
  return (
    <main className="mx-auto max-w-xl px-4 py-8 text-center">
      <div className="grad rounded-[2rem] px-4 py-8 shadow-lg" style={{ backgroundImage: "linear-gradient(135deg,#ffb830,#ff8fc0,#c4a8ff,#7fd8ff)" }}>
        <div className="flex justify-center gap-2">
          {["🦁", "🐘", "🐼", "🦄", "🐲"].map((e, i) => <span key={e} className="bob" style={{ animationDelay: `${i * 0.3}s` }}><Illus e={e} size={52} /></span>)}
        </div>
        <p className="arab text-7xl font-extrabold text-white" style={{ textShadow: "0 5px 0 #2b2350" }}>مَرْحَبًا</p>
        <h1 className="text-4xl font-extrabold">Ma'warabic</h1>
        <p className="text-lg font-bold">Ayo belajar bahasa Arab sambil bermain!</p>
      </div>
      <form onSubmit={go} className="card mt-6 bg-white p-5 text-left" style={{ "--c": "#ff8fc0" } as CSSProperties}>
        <label className="block font-extrabold">Namamu
          <input className={field} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Tulis namamu" maxLength={30} autoComplete="off" />
        </label>
        <label className="mt-3 block font-extrabold">Nomor absen
          <input className={field} value={absen} onChange={(e) => setAbsen(e.target.value.replace(/\D/g, ""))} placeholder="Contoh: 7" inputMode="numeric" maxLength={3} />
        </label>
        <p className="mt-4 font-extrabold">Pilih profilmu <span className="text-sm">(⭐ {pts} poin)</span></p>
        <p className="text-sm font-bold">Kumpulkan poin dari jawaban benar untuk membuka profil keren lainnya.</p>
        <div className="mt-2 grid grid-cols-5 gap-2" role="radiogroup" aria-label="Pilih profil">
          {AVATARS.map((a) => {
            const lock = pts < a.min;
            return (
              <button type="button" key={a.e} role="radio" aria-checked={av === a.e} disabled={lock} onClick={() => setAv(a.e)}
                className={`wiggle grid place-items-center rounded-2xl p-1 text-xs font-bold disabled:opacity-50 disabled:grayscale ${av === a.e ? "bg-[#ffd23f] ring-4 ring-[#2b2350]" : "bg-[#f3ecff]"}`}>
                <Illus e={a.e} size={44} />
                {lock ? `🔒 ${a.min}` : a.n}
              </button>
            );
          })}
        </div>
        <button type="submit" disabled={!can} className="btn mt-5 w-full justify-center text-2xl">▶ Masuk</button>
      </form>
    </main>
  );
}
