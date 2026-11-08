"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { ADJ, dem, sentOf, type Theme, type Word } from "@/lib/data";
import { shuffle, speak, type Res } from "@/lib/util";
import { Confetti, Illus } from "./Illus";

export type Save = (g: string, r: Res) => void;
export type Nav = { next: () => void; canAgain: boolean; last: boolean };

function Sound({ text, label = "Dengarkan" }: { text: string; label?: string }) {
  return <button onClick={() => speak(text)} className="btn">🔊 {label}</button>;
}

// Dua pilihan setelah satu permainan selesai.
export function Choice({ ok, again, nav }: { ok: boolean; again: () => void; nav: Nav }) {
  return (
    <div className="mt-5 text-center">
      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn" disabled={ok && !nav.canAgain} onClick={again}>🔁 Mulai permainan</button>
        <button className="btn" disabled={!ok} onClick={nav.next} style={{ "--c": "#ffd23f" } as CSSProperties}>{nav.last ? "🏆 Selesai" : "▶ Lanjut permainan"}</button>
      </div>
      {ok && !nav.canAgain && <p className="mt-2 text-sm font-bold">Permainan yang sudah sempurna baru bisa diulang setelah seluruh game di tema ini selesai.</p>}
    </div>
  );
}

export function Kamus({ t, onSave, nav }: { t: Theme; onSave: Save; nav: Nav }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const list = t.words.filter((w) => w.id.toLowerCase().includes(q.toLowerCase()) || w.ar.includes(q));
  const all = seen.length === t.words.length;
  function tap(w: Word) {
    speak(w.ar);
    setOpen(open === w.ar ? null : w.ar);
    if (!seen.includes(w.ar)) {
      const n = [...seen, w.ar];
      setSeen(n);
      if (n.length === t.words.length) onSave("kamus", { score: 1, total: 1 });
    }
  }
  return (
    <div className="mt-6">
      <div className="card bg-white p-4 text-center">
        <p className="text-xl font-extrabold">📌 Hafalkan kata-kata ini, ya!</p>
        <p className="font-bold">Kata-kata ini akan kamu pakai untuk menjawab misi-misi berikutnya. Kumpulkan bintangmu ⭐ sebanyak-banyaknya (tiap jawaban benar = 10 poin).</p>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Cari kata…" aria-label="Cari kata"
        className="mt-4 w-full rounded-full border-4 border-white bg-white/90 px-5 py-2 text-lg font-bold shadow" />
      <p className="mt-2 text-center font-bold">Ketuk kartu untuk mendengar dan melihat artinya ({seen.length}/{t.words.length} kartu dibuka)</p>
      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {list.map((w, i) => (
          <button key={w.ar} aria-label={`${w.ar}, ${w.id}`} className={`flip h-64 text-center ${open === w.ar ? "open" : ""}`}
            style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }} onClick={() => tap(w)}>
            <span className="flip-in">
              <span className="face" style={{ background: t.bg }}>
                <Illus e={w.e} size={96} />
                <span className="arab text-3xl font-extrabold">{w.ar}</span>
                <span className="rounded-full bg-white px-3 text-sm font-bold">🔊 ketuk</span>
              </span>
              <span className="face back" style={{ background: t.c }}>
                <span className="text-2xl font-extrabold">{w.id}</span>
                <span className="arab text-2xl">{w.ar}</span>
                {w.g && <span className="arab rounded-full bg-white/80 px-3 text-lg font-bold">{dem(w)} {w.ar}</span>}
                {w.g && <span className="text-xs font-extrabold">{w.g === "f" ? "♀ muannats" : "♂ mudzakkar"}</span>}
              </span>
            </span>
          </button>
        ))}
      </div>
      {!list.length && <p className="mt-6 text-center font-bold">Kata tidak ditemukan. Coba kata lain.</p>}
      {t.words.some((w) => w.g) && (
        <div className="card mt-8 bg-white p-4 text-center">
          <p className="text-lg font-extrabold">💡 Aturan kata tunjuk</p>
          <p className="font-bold"><span className="arab text-xl">هَذَا</span> untuk benda mudzakkar (laki-laki), <span className="arab text-xl">هَذِهِ</span> untuk benda muannats (perempuan). Kata benda berakhiran <span className="arab text-xl">ة</span> biasanya muannats. Sifat juga mengikuti: <span className="arab text-xl">كَبِيرٌ</span> → <span className="arab text-xl">كَبِيرَةٌ</span>. Pengecualian: <span className="arab text-xl">عَيْنٌ، يَدٌ، شَمْسٌ</span> tetap muannats.</p>
        </div>
      )}
      <div className="card mt-6 bg-white p-5 text-center">
        <p className="font-bold">Contoh kalimat</p>
        {t.ex.map((s) => (
          <div key={s.ar} className="my-3">
            <p className="arab text-3xl font-extrabold">{s.ar}</p>
            <p className="mb-2">{s.id}</p>
            <Sound text={s.ar} label="Dengarkan kalimat" />
          </div>
        ))}
      </div>
      {all && (
        <div className="card mt-6 bg-white p-5 text-center">
          <p className="text-xl font-extrabold">Semua kartu sudah dibuka! Sudah hafal?</p>
          <Choice ok again={() => { setSeen([]); setOpen(null); }} nav={nav} />
        </div>
      )}
    </div>
  );
}

type Q = { t: "arti" | "gambar" | "arab" | "bs" | "gen" | "sfat" | "susun"; w: Word; x?: Word; opts: string[]; ans: string; rev: string; toks?: string[]; hint?: string };

function build(t: Theme): Q[] {
  const ws = shuffle(t.words);
  const gw = ws.filter((w) => w.g);
  const used = new Set<string>();
  const take = (src: Word[]) => { const w = src.find((x) => !used.has(x.ar)) ?? ws.find((x) => !used.has(x.ar))!; used.add(w.ar); return w; };
  const types = shuffle(["arti", "gambar", "arab", "bs", "gen", "sfat", "arti", "gambar", "arab"] as Q["t"][]);
  const qs: Q[] = types.map((ty) => {
    const w = take(ty === "gen" || ty === "sfat" ? gw : ws);
    const others = shuffle(t.words.filter((x) => x.ar !== w.ar));
    const rev = `${w.ar} = ${w.id}`;
    if (ty === "bs") {
      const x = Math.random() < 0.5 ? w : others[0];
      return { t: ty, w, x, opts: ["ya", "tidak"], ans: x.ar === w.ar ? "ya" : "tidak", rev };
    }
    if (w.g && ty === "gen") {
      return { t: ty, w, opts: ["هَذَا", "هَذِهِ"], ans: dem(w), rev: `${dem(w)} ${w.ar} = Ini ${w.id.toLowerCase()}. ${w.ar} termasuk ${w.g === "f" ? "muannats, maka memakai هَذِهِ" : "mudzakkar, maka memakai هَذَا"}.` };
    }
    if (w.g && ty === "sfat") {
      const a = ADJ[Math.floor(Math.random() * ADJ.length)];
      const ans = w.g === "f" ? a[1] : a[0];
      return { t: ty, w, opts: shuffle([a[0], a[1]]), ans, rev: `${dem(w)} ${w.ar} ${ans} = Ini ${w.id.toLowerCase()} ${a[2]}. Sifat mengikuti jenis kata bendanya.` };
    }
    const t2: Q["t"] = ty === "gen" || ty === "sfat" ? "arti" : ty;
    return { t: t2, w, opts: shuffle([w, ...others.slice(0, 3)]).map((o) => o.ar), ans: w.ar, rev };
  });
  const s = gw.length ? sentOf(gw[Math.floor(Math.random() * gw.length)], true) : shuffle(t.ex)[0];
  qs.push({ t: "susun", w: ws[0], opts: [], ans: s.ar, rev: `${s.ar} = ${s.id}`, toks: shuffle(s.ar.split(" ")), hint: s.id });
  return shuffle(qs);
}

export function Quiz({ t, onSave, nav }: { t: Theme; onSave: Save; nav: Nav }) {
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
    onSave("kuis", { score, total: qs.length });
    setDone(true);
  }

  if (!qs.length) {
    return (
      <div className="card mt-6 bg-white p-6 text-center">
        <p className="text-xl font-extrabold">Kuis 10 soal, tiap main soalnya berbeda!</p>
        <p className="mb-4">Ada tebak arti, tebak gambar, kata Arab, benar-salah, kata tunjuk, sifat, dan menyusun kalimat.</p>
        <button onClick={start} className="btn text-xl">▶ Mulai Kuis</button>
      </div>
    );
  }

  if (done) {
    const perfect = score === qs.length;
    return (
      <div className="card mt-6 bg-white p-6 text-center">
        {perfect && <Confetti />}
        <h2 className="text-2xl font-extrabold">Keren! Misimu selesai</h2>
        <p className="my-2 text-2xl font-extrabold">{perfect ? "Sempurna! Game berikutnya terbuka 🔓" : "Ayo ulangi sampai 10 dari 10 untuk membuka game berikutnya"}</p>
        <p className="text-xl font-bold">Skor {score} dari {qs.length} (+{score * 10} poin)</p>
        {wrong.length > 0 && (
          <div className="mt-4"><p className="font-bold">Yang perlu dilatih:</p>
            {wrong.map((x) => <p key={x} className="text-lg font-bold">{x}</p>)}</div>
        )}
        <Choice ok={perfect} again={start} nav={nav} />
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
      {q.t === "gen" && <div className="my-3"><p className="font-bold">Pilih kata tunjuk yang tepat:</p><Illus e={q.w.e} size={96} /><p className="arab text-4xl font-extrabold">_____ {q.w.ar}</p></div>}
      {q.t === "sfat" && <div className="my-3"><p className="font-bold">Lengkapi dengan sifat yang sesuai:</p><Illus e={q.w.e} size={96} /><p className="arab text-3xl font-extrabold">{dem(q.w)} {q.w.ar} _____</p></div>}
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
              {q.t === "arti" ? byAr(k).id : q.t === "gambar" ? <Illus e={byAr(k).e} size={72} /> : q.t === "bs" ? (k === "ya" ? "✔ Benar" : "✘ Salah") : <span className="arab text-2xl">{k}</span>}
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
