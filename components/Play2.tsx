"use client";
import { useEffect, useState } from "react";
import { sentOf, type Theme, type Word } from "@/lib/data";
import { reaksi, shuffle, speak } from "@/lib/util";
import { Confetti, Illus } from "./Illus";
import { Choice, Koreksi, type Nav, type Save } from "./Play1";

function Done({ title, bg, score, total, wrong, again, nav }: { title: string; bg: string; score: number; total: number; wrong: string[]; again: () => void; nav: Nav }) {
  return (
    <div className={`panel ${bg} mt-6 p-6 text-center`}>
      {score === total && <Confetti />}
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <p className="text-xl font-bold">Skor {score} dari {total} (+{score * 10} poin)</p>
      <p className="my-2 font-extrabold">{score === total ? "Sempurna! 🎉" : "Game berikutnya terbuka 🔓"}</p>
      <Koreksi items={wrong} />
      <Choice ok again={again} nav={nav} />
    </div>
  );
}

type Pair = { k: string; lt: string; rp?: string; rt?: string; lv: number; rev: string };
// 3 pasangan mudah (Arab-gambar), 3 sedang (Arab-arti), 2 sulit (kalimat-terjemahan), diacak.
function pairs(t: Theme): Pair[] {
  const ws = shuffle(t.words);
  const rev = (w: Word) => `${w.ar} = ${w.id}`;
  const easy = ws.slice(0, 3).map((w) => ({ k: w.ar, lt: w.ar, rp: w.e, lv: 1, rev: rev(w) }));
  const mid = ws.slice(3, 6).map((w) => ({ k: w.ar, lt: w.ar, rt: w.id, lv: 2, rev: rev(w) }));
  const rest = ws.slice(6);
  const hw = rest.filter((w) => w.g).slice(0, 2);
  const hard = hw.map((w) => { const s = sentOf(w); return { k: w.ar, lt: s.ar, rt: s.id, lv: 3, rev: `${s.ar} = ${s.id}` }; });
  const fill = rest.filter((w) => !hw.includes(w)).slice(0, 2 - hw.length).map((w) => ({ k: w.ar, lt: w.ar, rt: w.id, lv: 2, rev: rev(w) }));
  return [...easy, ...mid, ...hard, ...fill];
}

export function Match({ t, onSave, nav }: { t: Theme; onSave: Save; nav: Nav }) {
  const [pr, setPr] = useState<Pair[]>([]);
  const [lf, setLf] = useState<Pair[]>([]);
  const [rg, setRg] = useState<Pair[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [ok, setOk] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const start = () => { const p = pairs(t); setPr(p); setLf(shuffle(p)); setRg(shuffle(p)); setSel(null); setOk([]); setWrong([]); };
  useEffect(start, []);
  if (pr.length && ok.length === pr.length) return <Done title="🃏 Semua kartu cocok!" bg="felt" score={pr.length - wrong.length} total={pr.length} wrong={wrong} again={start} nav={nav} />;

  function right(p: Pair) {
    if (!sel || ok.includes(p.k)) return;
    if (sel === p.k) {
      reaksi(true);
      const n = [...ok, p.k];
      setOk(n); setSel(null);
      if (n.length === pr.length) onSave("cocok", { score: pr.length - wrong.length, total: pr.length });
    } else {
      reaksi(false);
      const bad = pr.find((x) => x.k === sel)!;
      if (!wrong.includes(bad.rev)) setWrong([...wrong, bad.rev]);
      setSel(null);
    }
  }
  return (
    <div className="panel felt mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">🃏 Cocokkan Kartu</h2>
      <p className="font-bold">Ketuk kartu Arab, lalu ketuk pasangannya. Ada 3 tingkat: ⭐ gambar, ⭐⭐ arti, ⭐⭐⭐ kalimat.</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          {lf.map((p) => (
            <button key={p.k} onClick={() => { if (!ok.includes(p.k)) { speak(p.lt); setSel(p.k); } }}
              className={`btn arab justify-center text-xl ${ok.includes(p.k) ? "opacity-40" : ""} ${sel === p.k ? "ring-4 ring-[#2b2350]" : ""}`}>
              <span className="text-xs">{"⭐".repeat(p.lv)}</span> {p.lt}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {rg.map((p) => (
            <button key={p.k} onClick={() => right(p)} className={`grid min-h-12 place-items-center rounded-full bg-white px-2 py-1 font-bold shadow-[0_4px_0_rgba(0,0,0,.2)] ${ok.includes(p.k) ? "opacity-40" : ""}`}>
              {p.rp ? <Illus e={p.rp} size={44} /> : <span>{p.rt}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const BC = ["#ff6b6b", "#ffb830", "#2fbf71", "#5aa0ff", "#a78bfa", "#ff5fa2"];
type R = { w: Word; o: Word[]; lv: 1 | 2 | 3 };

export function Balon({ t, onSave, nav }: { t: Theme; onSave: Save; nav: Nav }) {
  const [rs, setRs] = useState<R[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [sc, setSc] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  // Putaran mudah: gambar + suara, 3 balon. Sedang: suara saja, 4 balon. Sulit: hanya arti tertulis, 5 balon. Urutan diacak.
  const start = () => {
    const lvs = shuffle<1 | 2 | 3>([1, 1, 2, 2, 2, 3, 3, 3]);
    setRs(shuffle(t.words).slice(0, 8).map((w, n) => ({ w, lv: lvs[n], o: shuffle([w, ...shuffle(t.words.filter((x) => x.ar !== w.ar)).slice(0, lvs[n] + 1)]) })));
    setI(0); setPick(null); setSc(0); setWrong([]); setDone(false);
  };
  useEffect(start, []);
  const r = rs[i];
  useEffect(() => { if (r && r.lv < 3) speak(r.w.ar); }, [r]);
  if (done) return <Done title="🎈 Balon selesai!" bg="sky" score={sc} total={rs.length} wrong={wrong} again={start} nav={nav} />;
  if (!r) return null;

  function hit(a: string) {
    if (pick) return;
    setPick(a);
    reaksi(a === r.w.ar);
    if (a === r.w.ar) setSc(sc + 1); else setWrong([...wrong, `${r.w.ar} = ${r.w.id}`]);
  }
  function next() {
    if (i + 1 < rs.length) { setI(i + 1); setPick(null); } else { onSave("balon", { score: sc, total: rs.length }); setDone(true); }
  }
  return (
    <div className="panel sky mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">🎈 Pecah Balon</h2>
      <p className="font-bold">Putaran {i + 1} dari {rs.length} <span className="ml-2 rounded-full bg-white px-3 py-0.5 text-sm">{"⭐".repeat(r.lv)} {["Mudah", "Sedang", "Sulit"][r.lv - 1]}</span></p>
      <p className="mt-2 font-bold">Pecahkan balon dengan kata Arab yang tepat:</p>
      <div className="my-2 flex items-center justify-center gap-3">
        {r.lv === 1 && <Illus e={r.w.e} size={80} />}
        {r.lv === 3 ? <p className="rounded-2xl bg-white px-5 py-2 text-3xl font-extrabold">{r.w.id}</p> : <button onClick={() => speak(r.w.ar)} className="btn">🔊 Dengarkan</button>}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {r.o.map((o, n) => (
          <button key={o.ar} className="balloon arab text-2xl" style={{ background: BC[(n + i) % 6], animationDelay: `${n * 0.4}s`, opacity: pick && o.ar !== r.w.ar && o.ar !== pick ? 0.4 : 1 }} onClick={() => hit(o.ar)} aria-label={o.ar}>
            {pick === o.ar && o.ar === r.w.ar ? "💥" : o.ar}
          </button>
        ))}
      </div>
      {pick && (
        <div className="pop mt-8">
          <p className="text-xl font-extrabold">{pick === r.w.ar ? "Dor! Balonnya pecah, hebat! 🎉" : `😢 Hampir! Jawabannya: ${r.w.ar} = ${r.w.id}`}</p>
          <button onClick={next} className="btn mt-3">{i + 1 < rs.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}
