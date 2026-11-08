"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOOK, HAIRC, PARTS, SKINS, type Look } from "@/lib/data";
import { getProfil, idOf, loadProg, points, setProfil } from "@/lib/util";
import { Illus } from "@/components/Illus";
import Avatar from "@/components/Avatar";

const CATS: { k: keyof Look; t: string; list: { n: string; min: number }[] }[] = [
  { k: "face", t: "Bentuk wajah", list: PARTS.face }, { k: "hair", t: "Rambut atau hijab", list: PARTS.hair },
  { k: "mood", t: "Ekspresi wajah", list: PARTS.mood }, { k: "outfit", t: "Pakaian", list: PARTS.outfit }, { k: "acc", t: "Aksesori", list: PARTS.acc },
];

export default function Masuk() {
  const r = useRouter();
  const [nama, setNama] = useState("");
  const [absen, setAbsen] = useState("");
  const [look, setLook] = useState<Look>(DEFAULT_LOOK);
  const [pts, setPts] = useState(0);
  useEffect(() => { const p = getProfil(); if (p) { setNama(p.nama); setAbsen(p.absen); setLook(p.avatar); } }, []);
  useEffect(() => { setPts(nama.trim() && absen.trim() ? points(loadProg(idOf(nama, absen))) : 0); }, [nama, absen]);
  const set = (k: keyof Look, v: number) => setLook({ ...look, [k]: v });
  const can = !!nama.trim() && !!absen.trim() && CATS.every((c) => c.list[look[c.k]].min <= pts);

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!can) return;
    setProfil({ nama: nama.trim(), absen: absen.trim(), avatar: look });
    r.push("/peta");
  }
  const field = "w-full rounded-2xl border-4 border-[#ffd23f] bg-white px-4 py-2 text-xl font-bold";
  const swatch = (k: keyof Look, cols: string[], label: string) => (
    <div className="flex gap-2">
      {cols.map((c, i) => (
        <button type="button" key={c} aria-label={`${label} ${i + 1}`} aria-pressed={look[k] === i} onClick={() => set(k, i)}
          className={`h-9 w-9 rounded-full border-4 ${look[k] === i ? "border-[#2b2350]" : "border-white"}`} style={{ background: c }} />
      ))}
    </div>
  );
  return (
    <main className="mx-auto max-w-xl px-4 py-8 text-center">
      <div className="grad rounded-[2rem] px-4 py-8 shadow-lg" style={{ backgroundImage: "linear-gradient(135deg,#ffb830,#ff8fc0,#c4a8ff,#7fd8ff)" }}>
        <p className="wiggle mx-auto mb-3 w-fit rounded-full bg-white px-5 py-1 text-xl font-extrabold">🔥 <span className="arab inline-block">حَمَاسٌ وَنَشَاطٌ!</span> 🔥</p>
        <div className="flex justify-center gap-2">
          {["🚀", "🎮", "⭐", "🏆", "🎨"].map((e, i) => <span key={e} className="bob" style={{ animationDelay: `${i * 0.3}s` }}><Illus e={e} size={52} /></span>)}
        </div>
        <p className="arab text-7xl font-extrabold text-white" style={{ textShadow: "0 5px 0 #2b2350" }}>مَرْحَبًا</p>
        <h1 className="text-4xl font-extrabold">Ma'warabic</h1>
        <p className="arab text-2xl font-extrabold">هَيَّا بِنَا نَتَعَلَّمِ اللُّغَةَ الْعَرَبِيَّةَ بِاللَّعِبِ!</p>
      </div>
      <form onSubmit={go} className="card mt-6 bg-white p-5 text-left" style={{ "--c": "#ff8fc0" } as CSSProperties}>
        <label className="block font-extrabold">Namamu
          <input className={field} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Tulis namamu" maxLength={30} autoComplete="off" />
        </label>
        <label className="mt-3 block font-extrabold">Nomor absen
          <input className={field} value={absen} onChange={(e) => setAbsen(e.target.value.replace(/\D/g, ""))} placeholder="Contoh: 7" inputMode="numeric" maxLength={3} />
        </label>
        <p className="mt-5 text-center text-xl font-extrabold">Buat karaktermu! <span className="text-base">(⭐ {pts} poin)</span></p>
        <div className="bob text-center"><Avatar look={look} size={130} /></div>
        <p className="text-center text-sm font-bold">Kumpulkan poin dari jawaban benar untuk membuka pakaian, aksesori, dan gaya keren lainnya.</p>
        <p className="mt-3 font-extrabold">Warna kulit</p>{swatch("skin", SKINS, "Warna kulit")}
        {CATS.slice(0, 2).map((c) => <Row key={c.k} c={c} look={look} pts={pts} set={set} />)}
        <p className="mt-3 font-extrabold">Warna rambut / hijab</p>{swatch("hc", HAIRC, "Warna rambut")}
        {CATS.slice(2).map((c) => <Row key={c.k} c={c} look={look} pts={pts} set={set} />)}
        <button type="submit" disabled={!can} className="btn mt-6 w-full justify-center text-2xl">▶ Masuk</button>
      </form>
    </main>
  );
}

function Row({ c, look, pts, set }: { c: (typeof CATS)[number]; look: Look; pts: number; set: (k: keyof Look, v: number) => void }) {
  return (
    <div>
      <p className="mt-3 font-extrabold">{c.t}</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {c.list.map((o, i) => (
          <button type="button" key={o.n} disabled={o.min > pts} aria-pressed={look[c.k] === i} onClick={() => set(c.k, i)}
            className={`wiggle rounded-full px-3 py-1 text-sm font-extrabold disabled:opacity-50 ${look[c.k] === i ? "bg-[#ffd23f] ring-4 ring-[#2b2350]" : "bg-[#f3ecff]"}`}>
            {o.min > pts ? `🔒 ${o.n} (${o.min})` : o.n}
          </button>
        ))}
      </div>
    </div>
  );
}
