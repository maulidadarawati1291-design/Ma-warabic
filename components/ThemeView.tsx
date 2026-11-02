"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { Theme, Word } from "@/lib/data";
import { saveResult, shuffle, speak, stars } from "@/lib/util";
import { Illus, Scene } from "./Illus";

function Sound({ text, label = "Dengarkan" }: { text: string; label?: string }) {
  return <button onClick={() => speak(text)} className="btn">🔊 {label}</button>;
}

function Kamus({ t }: { t: Theme }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = t.words.filter((w) => w.id.toLowerCase().includes(q.toLowerCase()) || w.ar.includes(q));
  return (
    <div className="mt-6">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Cari kata…" aria-label="Cari kata"
        className="w-full rounded-full border-4 border-white bg-white/90 px-5 py-2 text-lg font-bold shadow" />
      <p className="mt-2 text-center font-bold">Ketuk kartu untuk mendengar kata dan melihat artinya</p>
      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {list.map((w, i) => (
          <button key={w.ar} aria-label={`${w.ar}, ${w.id}`} className={`flip h-60 text-center ${open === w.ar ? "open" : ""}`}
            style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }} onClick={() => { speak(w.ar); setOpen(open === w.ar ? null : w.ar); }}>
            <span className="flip-in">
              <span className="face" style={{ background: t.bg }}>
                <Illus e={w.e} size={96} />
                <span className="arab text-3xl font-extrabold">{w.ar}</span>
                <span className="rounded-full bg-white px-3 text-sm font-bold">🔊 ketuk</span>
              </span>
              <span className="face back" style={{ background: t.c }}>
                <span className="text-3xl font-extrabold">{w.id}</span>
                <span className="arab text-2xl">{w.ar}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      {!list.length && <p className="mt-6 text-center font-bold">Kata tidak ditemukan. Coba kata lain.</p>}
      <div className="card mt-8 bg-white p-5 text-center">
        <p className="font-bold">Contoh kalimat</p>
        {t.ex.map((s) => (
          <div key={s.ar} className="my-3">
            <p className="arab text-3xl font-extrabold">{s.ar}</p>
            <p className="mb-2">{s.id}</p>
            <Sound text={s.ar} label="Dengarkan kalimat" />
          </div>
        ))}
      </div>
    </div>
  );
}

type Q = { t: "arti" | "gambar" | "arab" | "bs" | "susun"; w: Word; x?: Word; opts: string[]; ans: string; rev: string; toks?: string[]; hint?: string };

function build(t: Theme): Q[] {
  const ws = shuffle(t.words);
  const types = ["arti", "gambar", "arab", "bs"] as const;
  const qs: Q[] = ws.slice(0, 9).map((w, n) => {
    const ty = types[n % 4];
    const rev = `${w.ar} = ${w.id}`;
    const others = shuffle(t.words.filter((x) => x.ar !== w.ar));
    if (ty === "bs") {
      const x = Math.random() < 0.5 ? w : others[0];
      return { t: ty, w, x, opts: ["ya", "tidak"], ans: x.ar === w.ar ? "ya" : "tidak", rev };
    }
    return { t: ty, w, opts: shuffle([w, ...others.slice(0, 3)]).map((o) => o.ar), ans: w.ar, rev };
  });
  const s = shuffle(t.ex)[0];
  qs.push({ t: "susun", w: ws[0], opts: [], ans: s.ar, rev: `${s.ar} = ${s.id}`, toks: shuffle(s.ar.split(" ")), hint: s.id });
  return shuffle(qs);
}

function Quiz({ t }: { t: Theme }) {
  const [qs, setQs] = useState<Q[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [built, setBuilt] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const q = qs[i];
  const byAr = (a: string) => t.words.find((x) => x.ar === a)!;

  function start() { setQs(build(t)); setI(0); setPick(null); setBuilt([]); setScore(0); setWrong([]); setDone(false); }
  useEffect(() => { if (q?.t === "gambar") speak(q.w.ar); }, [q]);

  function choose(k: string) {
    if (pick !== null) return;
    setPick(k);
    if (k === q.ans) setScore(score + 1); else setWrong([...wrong, q.rev]);
  }
  function next() {
    if (i + 1 < qs.length) { setI(i + 1); setPick(null); setBuilt([]); return; }
    saveResult(t.slug, { score, total: qs.length, wrong });
    setDone(true);
  }

  if (!qs.length) {
    return (
      <div className="card mt-6 bg-white p-6 text-center">
        <p className="text-xl font-extrabold">Kuis 10 soal, tiap main soalnya berbeda!</p>
        <p className="mb-4">Ada tebak arti, tebak gambar, pilih kata Arab, benar-salah, dan menyusun kalimat.</p>
        <button onClick={start} className="btn text-xl">▶ Mulai Kuis</button>
      </div>
    );
  }

  if (done) {
    const s = stars({ score, total: qs.length, wrong: [] });
    return (
      <div className="card mt-6 bg-white p-6 text-center">
        <h2 className="text-2xl font-extrabold">Keren! Misimu selesai</h2>
        <p className="my-2 text-5xl motion-safe:animate-bounce" style={{ color: "#f4b400" }}>{"★".repeat(s)}{"☆".repeat(3 - s)}</p>
        <p className="text-xl font-bold">Skor {score} dari {qs.length}</p>
        {wrong.length > 0 && (
          <div className="mt-4"><p className="font-bold">Kosakata yang perlu dilatih:</p>
            {wrong.map((x) => <p key={x} className="text-lg font-bold">{x}</p>)}</div>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button onClick={start} className="btn">🔁 Coba lagi</button>
          <Link href="/#peta" className="btn" style={{ "--c": "#ffd23f" } as CSSProperties}>🗺️ Peta Petualangan</Link>
        </div>
      </div>
    );
  }

  const oc = (k: string) => pick === null ? "bg-white" : k === q.ans ? "bg-green-300" : k === pick ? "bg-red-200" : "bg-white opacity-50";
  const opt = "rounded-2xl p-3 text-xl font-extrabold shadow-[0_4px_0_rgba(0,0,0,.15)] ";
  return (
    <div className="card mt-6 p-5 text-center" style={{ background: t.bg }}>
      <div className="mb-3 h-3 rounded-full bg-white"><div className="h-3 rounded-full" style={{ width: `${(i / qs.length) * 100}%`, background: t.c }} /></div>
      <p className="font-bold">Soal {i + 1} dari {qs.length}</p>
      {q.t === "arti" && <div className="my-3"><p className="font-bold">Apa arti kata ini?</p><p className="arab text-5xl font-extrabold">{q.w.ar}</p></div>}
      {q.t === "gambar" && <div className="my-3"><p className="mb-2 font-bold">Dengarkan, lalu pilih gambarnya:</p><Sound text={q.w.ar} label="Putar lagi" /></div>}
      {q.t === "arab" && <div className="my-3"><p className="font-bold">Pilih kata Arab untuk gambar ini:</p><Illus e={q.w.e} size={96} /><p className="text-2xl font-extrabold">{q.w.id}</p></div>}
      {q.t === "bs" && <div className="my-3"><p className="font-bold">Cocokkah gambar dan katanya?</p><Illus e={q.w.e} size={96} /><p className="arab text-4xl font-extrabold">{q.x!.ar}</p></div>}
      {q.t === "susun" ? (
        <div>
          <p className="font-bold">Susun kalimat untuk: “{q.hint}”</p>
          <div className="arab my-3 flex min-h-16 flex-wrap justify-center gap-2 rounded-2xl bg-white p-3 text-2xl">
            {built.map((b) => <button key={b} disabled={pick !== null} onClick={() => setBuilt(built.filter((x) => x !== b))} className="btn">{q.toks![b]}</button>)}
          </div>
          <div className="arab flex flex-wrap justify-center gap-2 text-2xl">
            {q.toks!.map((tk, b) => !built.includes(b) && <button key={b} disabled={pick !== null} onClick={() => setBuilt([...built, b])} className="rounded-full bg-white px-4 py-2 font-bold shadow">{tk}</button>)}
          </div>
          {pick === null && <button className="btn mt-4" disabled={built.length < q.toks!.length} onClick={() => choose(built.map((b) => q.toks![b]).join(" "))}>✔ Periksa</button>}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {q.opts.map((k) => (
            <button key={k} onClick={() => choose(k)} className={opt + oc(k)}>
              {q.t === "arti" ? byAr(k).id : q.t === "gambar" ? <Illus e={byAr(k).e} size={72} /> : q.t === "arab" ? <span className="arab text-2xl">{k}</span> : k === "ya" ? "✔ Benar" : "✘ Salah"}
            </button>
          ))}
        </div>
      )}
      {pick !== null && (
        <div className="pop mt-4">
          <p className="text-xl font-extrabold">{pick === q.ans ? "Benar, hebat! 🎉" : `Hampir! Jawabannya: ${q.rev}`}</p>
          <button onClick={next} className="btn mt-3">{i + 1 < qs.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}

export default function ThemeView({ theme }: { theme: Theme }) {
  const [tab, setTab] = useState<"kamus" | "kuis">("kamus");
  return (
    <div style={{ "--c": theme.c } as CSSProperties}>
      <div className="mt-4"><Scene t={theme} /></div>
      <div className="mt-3 text-center">
        <h1 className="arab text-3xl font-extrabold">{theme.ar}</h1>
        <p className="text-xl font-bold">{theme.id}</p>
      </div>
      <div className="mt-4 flex justify-center gap-3" role="tablist">
        {(["kamus", "kuis"] as const).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className="rounded-full px-6 py-2 text-lg font-extrabold shadow" style={{ background: tab === k ? theme.c : "#fff" }}>
            {k === "kamus" ? "📖 Kamus Bergambar" : "🎮 Kuis"}
          </button>
        ))}
      </div>
      {tab === "kamus" ? <Kamus t={theme} /> : <Quiz t={theme} />}
    </div>
  );
}
