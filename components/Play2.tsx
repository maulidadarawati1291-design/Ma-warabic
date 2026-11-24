"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { sentOf, type Theme, type Word } from "@/lib/data";
import { dor, kempis, reaksi, shuffle, speak, tepukTangan } from "@/lib/util";
import { Illus } from "./Illus";
import { Done, type Nav, type Rv, type Save } from "./Play1";

type Pair = { k: string; lt: string; rp?: string; rt?: string; rv: Rv };
// Pasangan: gambar, arti, dan kalimat; urutannya diacak.
function pairs(t: Theme): Pair[] {
  const ws = shuffle(t.words);
  const easy = ws.slice(0, 3).map((w) => ({ k: w.ar, lt: w.ar, rp: w.e, rv: { ar: w.ar, id: w.id } }));
  const mid = ws.slice(3, 6).map((w) => ({ k: w.ar, lt: w.ar, rt: w.id, rv: { ar: w.ar, id: w.id } }));
  const rest = ws.slice(6);
  const hw = rest.filter((w) => w.g).slice(0, 2);
  const hard = hw.map((w) => { const s = sentOf(w); return { k: w.ar, lt: s.ar, rt: s.id, rv: { ar: s.ar, id: s.id } }; });
  const fill = rest.filter((w) => !hw.includes(w)).slice(0, 2 - hw.length).map((w) => ({ k: w.ar, lt: w.ar, rt: w.id, rv: { ar: w.ar, id: w.id } }));
  return [...easy, ...mid, ...hard, ...fill];
}

export function Match({ t, onSave, nav }: { t: Theme; onSave: Save; nav: Nav }) {
  const [pr, setPr] = useState<Pair[]>([]);
  const [lf, setLf] = useState<Pair[]>([]);
  const [rg, setRg] = useState<Pair[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [ok, setOk] = useState<string[]>([]);
  const [wrong, setWrong] = useState<Rv[]>([]);
  const [miss, setMiss] = useState(0);
  const start = () => { const p = pairs(t); setPr(p); setLf(shuffle(p)); setRg(shuffle(p)); setSel(null); setOk([]); setWrong([]); setMiss(0); };
  useEffect(start, []);
  if (pr.length && ok.length === pr.length) return <Done title="🃏 Semua kartu cocok!" bg="felt" score={pr.length - wrong.length} total={pr.length} salah={miss} wrong={wrong} again={start} nav={nav} />;

  function right(p: Pair) {
    if (!sel || ok.includes(p.k)) return;
    if (sel === p.k) {
      reaksi(true);
      const n = [...ok, p.k];
      setOk(n); setSel(null);
      if (n.length === pr.length) {
        onSave("cocok", { score: pr.length - wrong.length, total: pr.length, salah: miss, kata: wrong.map((x) => x.ar) });
        if (miss === 0) tepukTangan();
      }
    } else {
      reaksi(false);
      setMiss(miss + 1);
      const bad = pr.find((x) => x.k === sel)!;
      if (!wrong.some((x) => x.ar === bad.rv.ar)) setWrong([...wrong, bad.rv]);
      setSel(null);
    }
  }
  return (
    <div className="panel felt mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">🃏 Cocokkan Kartu</h2>
      <p className="font-bold">Ketuk kartu Arab di kiri, lalu ketuk pasangannya di kanan. Teliti ya, kamu pasti bisa!</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          {lf.map((p) => (
            <button key={p.k} onClick={() => { if (!ok.includes(p.k)) { speak(p.lt); setSel(p.k); } }}
              className={`btn arab justify-center text-xl ${ok.includes(p.k) ? "opacity-40" : ""} ${sel === p.k ? "ring-4 ring-[#2b2350]" : ""}`}>{p.lt}</button>
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
  const [wrong, setWrong] = useState<Rv[]>([]);
  const [done, setDone] = useState(false);
  // Petunjuk bervariasi: gambar + suara, suara saja, atau arti tertulis; jumlah balon 3 sampai 5. Urutan diacak.
  const start = () => {
    const lvs = shuffle<1 | 2 | 3>([1, 1, 2, 2, 2, 3, 3, 3]);
    setRs(shuffle(t.words).slice(0, 8).map((w, n) => ({ w, lv: lvs[n], o: shuffle([w, ...shuffle(t.words.filter((x) => x.ar !== w.ar)).slice(0, lvs[n] + 1)]) })));
    setI(0); setPick(null); setSc(0); setWrong([]); setDone(false);
  };
  useEffect(start, []);
  const r = rs[i];
  useEffect(() => { if (r && r.lv < 3) speak(r.w.ar); }, [r]);
  if (done) return <Done title="🎈 Balon selesai!" bg="sky" score={sc} total={rs.length} salah={rs.length - sc} wrong={wrong} again={start} nav={nav} />;
  if (!r) return null;

  function hit(a: string) {
    if (pick) return;
    setPick(a);
    const ok = a === r.w.ar;
    if (ok) dor(); else kempis();
    reaksi(ok);
    if (ok) setSc(sc + 1); else setWrong([...wrong, { ar: r.w.ar, id: r.w.id }]);
  }
  function next() {
    if (i + 1 < rs.length) { setI(i + 1); setPick(null); return; }
    onSave("balon", { score: sc, total: rs.length, salah: rs.length - sc, kata: wrong.map((x) => x.ar) });
    if (sc === rs.length) tepukTangan();
    setDone(true);
  }
  return (
    <div className="panel sky mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">🎈 Pecah Balon</h2>
      <p className="font-bold">Putaran {i + 1} dari {rs.length}. Pecahkan balon yang bertuliskan kata yang tepat!</p>
      <div className="my-2 flex items-center justify-center gap-3">
        {r.lv === 1 && <Illus e={r.w.e} size={80} />}
        {r.lv === 3 ? <p className="rounded-2xl bg-white px-5 py-2 text-3xl font-extrabold">{r.w.id}</p> : <button onClick={() => speak(r.w.ar)} className="btn">🔊 Dengarkan</button>}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {r.o.map((o, n) => {
          const popped = pick === o.ar && o.ar === r.w.ar;
          const sad = pick === o.ar && o.ar !== r.w.ar;
          const col = BC[(n + i) % 6];
          return (
            <div key={o.ar} className="relative">
              <button className={`balloon arab text-2xl ${popped ? "letus" : ""} ${sad ? "kempis" : ""} ${pick && !popped && !sad && o.ar === r.w.ar ? "ring-4 ring-green-400" : ""}`}
                style={{ background: col, animationDelay: popped || sad ? "0s" : `${n * 0.4}s`, opacity: pick && !popped && !sad && o.ar !== r.w.ar ? 0.4 : 1 }} onClick={() => hit(o.ar)} aria-label={o.ar}>{o.ar}</button>
              {popped && Array.from({ length: 10 }, (_, k) => <i key={k} className="shard" style={{ background: col, "--sx": `${Math.cos(k * 0.63) * 90}px`, "--sy": `${Math.sin(k * 0.63) * 90}px` } as CSSProperties} />)}
            </div>
          );
        })}
      </div>
      {pick && (
        <div className="pop mt-8">
          <p className="text-xl font-extrabold">{pick === r.w.ar ? "Dor! Balonnya pecah, hebat! 🎉" : "😢 Hampir! Jawaban yang benar:"}</p>
          {pick !== r.w.ar && <div className="mx-auto mt-2 max-w-xs"><p className="rounded-xl bg-white p-3"><span className="arab block text-2xl font-extrabold">{r.w.ar}</span><span className="font-bold">{r.w.id}</span></p></div>}
          <button onClick={next} className="btn mt-3">{i + 1 < rs.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}
