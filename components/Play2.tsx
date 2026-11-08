"use client";
import { useEffect, useState } from "react";
import type { Theme, Word } from "@/lib/data";
import { shuffle, speak } from "@/lib/util";
import { Confetti, Illus } from "./Illus";
import type { Save } from "./Play1";

function Done({ title, score, total, again }: { title: string; score: number; total: number; again: () => void }) {
  const ok = score === total;
  return (
    <div className="card mt-6 bg-white p-6 text-center">
      {ok && <Confetti />}
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <p className="text-xl font-bold">Skor {score} dari {total} (+{score * 10} poin)</p>
      <p className="my-2 font-extrabold">{ok ? "Sempurna! Game berikutnya terbuka 🔓" : "Ulangi sampai sempurna untuk membuka game berikutnya"}</p>
      <button onClick={again} className="btn">🔁 Main lagi</button>
    </div>
  );
}

export function Match({ t, onSave }: { t: Theme; onSave: Save }) {
  const [ws, setWs] = useState<Word[]>([]);
  const [rt, setRt] = useState<Word[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [ok, setOk] = useState<string[]>([]);
  const [miss, setMiss] = useState(0);
  const [msg, setMsg] = useState("");
  const start = () => { const a = shuffle(t.words).slice(0, 6); setWs(a); setRt(shuffle(a)); setSel(null); setOk([]); setMiss(0); setMsg(""); };
  useEffect(start, []);
  if (ws.length && ok.length === ws.length) return <Done title="🃏 Semua kartu cocok!" score={Math.max(0, ws.length - miss)} total={ws.length} again={start} />;

  function pic(w: Word) {
    if (!sel || ok.includes(w.ar)) return;
    if (sel === w.ar) {
      const n = [...ok, w.ar];
      setOk(n); setSel(null); setMsg("Cocok! 🎉");
      if (n.length === ws.length) onSave("cocok", { score: Math.max(0, ws.length - miss), total: ws.length });
    } else { setMiss(miss + 1); setSel(null); setMsg("Belum cocok, coba lagi ya!"); }
  }
  return (
    <div className="card mt-6 bg-white p-5 text-center">
      <h2 className="text-2xl font-extrabold">🃏 Cocokkan Kartu</h2>
      <p className="font-bold">Ketuk kata Arab, lalu ketuk gambar yang cocok. Salah: {miss}</p>
      <p className="min-h-7 text-lg font-extrabold" aria-live="polite">{msg}</p>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          {ws.map((w) => (
            <button key={w.ar} onClick={() => { if (!ok.includes(w.ar)) { speak(w.ar); setSel(w.ar); } }}
              className={`btn arab justify-center text-2xl ${ok.includes(w.ar) ? "opacity-40" : ""} ${sel === w.ar ? "ring-4 ring-[#2b2350]" : ""}`}>{w.ar}</button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {rt.map((w) => (
            <button key={w.ar} onClick={() => pic(w)} aria-label={w.id}
              className={`grid place-items-center rounded-full bg-white py-1 shadow-[0_4px_0_rgba(0,0,0,.2)] ${ok.includes(w.ar) ? "opacity-40" : ""}`}><Illus e={w.e} size={52} /></button>
          ))}
        </div>
      </div>
    </div>
  );
}

const BC = ["#ff6b6b", "#ffb830", "#2fbf71", "#5aa0ff", "#a78bfa", "#ff5fa2"];

export function Balon({ t, onSave }: { t: Theme; onSave: Save }) {
  const [rs, setRs] = useState<{ w: Word; o: Word[] }[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [sc, setSc] = useState(0);
  const [done, setDone] = useState(false);
  const start = () => {
    setRs(shuffle(t.words).slice(0, 8).map((w) => ({ w, o: shuffle([w, ...shuffle(t.words.filter((x) => x.ar !== w.ar)).slice(0, 3)]) })));
    setI(0); setPick(null); setSc(0); setDone(false);
  };
  useEffect(start, []);
  const r = rs[i];
  useEffect(() => { if (r) speak(r.w.ar); }, [r]);
  if (done) return <Done title="🎈 Balon selesai!" score={sc} total={rs.length} again={start} />;
  if (!r) return null;

  function next() {
    if (i + 1 < rs.length) { setI(i + 1); setPick(null); } else { onSave("balon", { score: sc, total: rs.length }); setDone(true); }
  }
  return (
    <div className="card mt-6 bg-white p-5 text-center">
      <h2 className="text-2xl font-extrabold">🎈 Pecah Balon</h2>
      <p className="font-bold">Putaran {i + 1} dari {rs.length}. Pecahkan balon dengan kata untuk gambar ini:</p>
      <div className="my-2 flex items-center justify-center gap-3"><Illus e={r.w.e} size={80} /><button onClick={() => speak(r.w.ar)} className="btn">🔊 Dengarkan</button></div>
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {r.o.map((o, n) => (
          <button key={o.ar} className="balloon arab text-2xl" style={{ background: BC[(n + i) % 6], animationDelay: `${n * 0.4}s`, opacity: pick && o.ar !== r.w.ar && o.ar !== pick ? 0.4 : 1 }}
            onClick={() => { if (pick) return; setPick(o.ar); if (o.ar === r.w.ar) setSc(sc + 1); }} aria-label={o.ar}>
            {pick === o.ar && o.ar === r.w.ar ? "💥" : o.ar}
          </button>
        ))}
      </div>
      {pick && (
        <div className="pop mt-8">
          <p className="text-xl font-extrabold">{pick === r.w.ar ? "Dor! Balonnya pecah, hebat! 🎉" : `Hampir! Jawabannya: ${r.w.ar} = ${r.w.id}`}</p>
          <button onClick={next} className="btn mt-3">{i + 1 < rs.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}
