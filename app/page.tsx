"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ACCS, DEFAULT_LOOK, FACES, HAIRC, HAIRS, HIJABS, MOODS, OUTC, OUTFITS, SKINS, type Look, type Opt } from "@/lib/data";
import { getProfil, idOf, loadProg, points, setProfil } from "@/lib/util";
import { Illus } from "@/components/Illus";
import Avatar from "@/components/Avatar";
import Hero from "@/components/Hero";

const TABS = [["sex", "Karakter", "🧒"], ["skin", "Kulit", "🖐️"], ["face", "Wajah", "🙂"], ["hair", "Rambut", "💇"], ["hc", "Warna Rambut", "🎨"], ["hijab", "Hijab", "🧕"],
  ["outfit", "Baju", "👕"], ["oc", "Warna Baju", "🌈"], ["acc", "Aksesori", "🕶️"], ["mood", "Ekspresi", "😄"]] as const;
const SW: Record<string, string[]> = { skin: SKINS, hc: HAIRC, oc: OUTC };
const LIST: Record<string, Opt[]> = { sex: [{ n: "Laki-laki", min: 0 }, { n: "Perempuan", min: 0 }], face: FACES, hair: HAIRS, hijab: HIJABS, outfit: OUTFITS, acc: ACCS, mood: MOODS };
const shadow = { textShadow: "0 3px 0 #2b2350, 0 0 10px #2b2350" };

export default function Masuk() {
  const r = useRouter();
  const [nama, setNama] = useState("");
  const [absen, setAbsen] = useState("");
  const [look, setLook] = useState<Look>(DEFAULT_LOOK);
  const [pts, setPts] = useState(0);
  const [tab, setTab] = useState("sex");
  useEffect(() => { const p = getProfil(); if (p) { setNama(p.nama); setAbsen(p.absen); setLook(p.avatar); } }, []);
  useEffect(() => { setPts(nama.trim() && absen.trim() ? points(loadProg(idOf(nama, absen))) : 0); }, [nama, absen]);

  const side = look.sex ? "g" : "b";
  const tabs = TABS.filter((t) => t[0] !== "hijab" || look.sex === 1);
  const cur = tabs.some((t) => t[0] === tab) ? tab : "sex";
  const need = Math.max(FACES[look.face].min, look.hijab ? HIJABS[look.hijab].min : HAIRS[look.hair].min, OUTFITS[look.outfit].min, MOODS[look.mood].min, ...look.acc.map((a) => ACCS[a].min));
  const can = !!nama.trim() && !!absen.trim() && need <= pts;

  const preview = (k: string, i: number): Look =>
    k === "sex" ? { ...look, sex: i, hair: i ? 5 : 0, hijab: 0, outfit: 0, acc: [] } : k === "hair" ? { ...look, hair: i, hijab: 0 } : k === "acc" ? { ...look, acc: [i] } : { ...look, [k]: i };
  const on = (k: string, i: number) => k === "acc" ? look.acc.includes(i) : k === "hair" ? look.hijab === 0 && look.hair === i : look[k as keyof Look] === i;
  function choose(k: string, i: number) {
    if (k === "acc") setLook({ ...look, acc: look.acc.includes(i) ? look.acc.filter((x) => x !== i) : [...look.acc, i] });
    else if (k === "sex") setLook({ ...look, sex: i, hair: i ? 5 : 0, hijab: 0, outfit: 0, acc: look.acc.filter((a) => !ACCS[a].f || ACCS[a].f === (i ? "g" : "b")) });
    else if (k === "hair") setLook({ ...look, hair: i, hijab: 0 });
    else setLook({ ...look, [k]: i });
  }
  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!can) return;
    setProfil({ nama: nama.trim(), absen: absen.trim(), avatar: look });
    r.push("/peta");
  }
  const field = "w-full rounded-2xl border-4 border-[#ffd23f] bg-white px-4 py-2 text-xl font-bold";
  const opts = (LIST[cur] ?? []).map((o, i) => ({ o, i })).filter(({ o }) => !o.f || o.f === side);

  return (
    <main className="mx-auto max-w-xl px-4 py-8 text-center">
      <div className="relative overflow-hidden rounded-[2rem] px-4 py-10 text-white shadow-xl">
        <Hero />
        <div className="relative">
          <p className="wiggle mx-auto mb-3 w-fit rounded-full bg-white px-5 py-1 text-xl font-extrabold text-[#2b2350]">🔥 <span className="arab inline-block">حَمَاسٌ وَنَشَاطٌ!</span> 🔥</p>
          <p className="arab text-7xl font-extrabold" style={{ textShadow: "0 5px 0 #2b2350" }}>مَرْحَبًا</p>
          <h1 className="text-5xl font-extrabold" style={shadow}>Ma'warabic</h1>
          <p className="arab mt-2 text-2xl font-extrabold" style={shadow}>هَيَّا بِنَا نَتَعَلَّمِ اللُّغَةَ الْعَرَبِيَّةَ بِاللَّعِبِ!</p>
        </div>
      </div>
      <form onSubmit={go} className="card mt-6 bg-white p-5 text-left" style={{ "--c": "#ff8fc0" } as CSSProperties}>
        <label className="block font-extrabold">Namamu
          <input className={field} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Tulis namamu" maxLength={30} autoComplete="off" />
        </label>
        <label className="mt-3 block font-extrabold">Nomor absen
          <input className={field} value={absen} onChange={(e) => setAbsen(e.target.value.replace(/\D/g, ""))} placeholder="Contoh: 7" inputMode="numeric" maxLength={3} />
        </label>
        <p className="mt-5 text-center text-xl font-extrabold">Buat karaktermu! <span className="text-base">(⭐ {pts} poin)</span></p>
        <div className="bob text-center"><Avatar look={look} size={150} /></div>
        <p className="text-center text-sm font-bold">Kumpulkan poin dari jawaban benar untuk membuka gaya yang lebih keren.</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2" role="tablist">
          {tabs.map(([k, n, e]) => (
            <button type="button" key={k} role="tab" aria-selected={cur === k} onClick={() => setTab(k)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-extrabold ${cur === k ? "bg-[#ff8fc0] shadow-[0_3px_0_#c24f86]" : "bg-[#f3ecff]"}`}><Illus e={e} size={20} />{n}</button>
          ))}
        </div>
        {SW[cur] ? (
          <div className="mt-2 flex flex-wrap gap-3">
            {SW[cur].map((c, i) => (
              <button type="button" key={c} aria-label={`Warna ${i + 1}`} aria-pressed={on(cur, i)} onClick={() => choose(cur, i)}
                className={`wiggle h-12 w-12 rounded-full border-4 ${on(cur, i) ? "border-[#2b2350] ring-4 ring-[#ffd23f]" : "border-white shadow"}`} style={{ background: c }} />
            ))}
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {opts.map(({ o, i }) => (
              <button type="button" key={o.n} disabled={o.min > pts} aria-pressed={on(cur, i)} onClick={() => choose(cur, i)}
                className={`wiggle flex flex-col items-center rounded-2xl p-1 text-xs font-extrabold disabled:opacity-60 ${on(cur, i) ? "bg-[#ffd23f] ring-4 ring-[#2b2350]" : "bg-[#f3ecff]"}`}>
                <Avatar look={preview(cur, i)} size={64} />
                <span>{o.n}{o.min > pts && ` 🔒${o.min}`}</span>
              </button>
            ))}
          </div>
        )}
        {cur === "acc" && <p className="mt-2 text-xs font-bold">Aksesori bisa dipakai bersamaan. Ketuk lagi untuk melepas.</p>}
        <button type="submit" disabled={!can} className="btn mt-6 w-full justify-center text-2xl">▶ Masuk</button>
      </form>
    </main>
  );
}
