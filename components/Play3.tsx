"use client";
import { useEffect, useMemo, useState } from "react";
import { MISI, ORD, sentences, type MItem, type MisiDef, type Theme, type Word } from "@/lib/data";
import { getProfil, reaksi, shuffle, speak, tepukTangan } from "@/lib/util";
import { Illus } from "./Illus";
import { Choice, Done, RvView, Sound, type Nav, type Rv, type Save } from "./Play1";

type P = { t: Theme; onSave: Save; nav: Nav };

/* ---------- Menu: Kosakata dalam Kalimat ---------- */
export function Kalimat({ t, onSave, nav }: P) {
  const list = useMemo(() => sentences(t), [t]);
  const [heard, setHeard] = useState<string[]>([]);
  function tap(ar: string) {
    speak(ar);
    if (!heard.includes(ar)) {
      const n = [...heard, ar];
      setHeard(n);
      if (n.length === list.length) onSave("kalimat", { score: 1, total: 1 });
    }
  }
  return (
    <div className="mt-6">
      <div className="panel lv2 p-4 text-center">
        <p className="text-xl font-extrabold">💬 Kata-kata dalam kalimat</p>
        <p className="font-bold">Dengarkan tiap kalimat dan perhatikan cara kata-kata dipakai. Ketuk kartu untuk mendengarnya ({heard.length}/{list.length}).</p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {list.map((s) => (
          <button key={s.ar} onClick={() => tap(s.ar)} className="card p-4 text-center" style={{ background: t.bg }}>
            <Illus e={s.e} size={64} />
            <span className="arab block text-2xl font-extrabold">{s.ar}</span>
            <span className="block font-bold">{s.id}</span>
            <span className="text-sm font-extrabold">{heard.includes(s.ar) ? "✔ sudah didengar" : "🔊 ketuk untuk mendengar"}</span>
          </button>
        ))}
      </div>
      {heard.length === list.length && (
        <div className="card mt-6 bg-white p-5 text-center">
          <p className="text-xl font-extrabold">Keren! Sekarang saatnya mengenal kosakatanya.</p>
          <Choice ok again={() => setHeard([])} nav={nav} />
        </div>
      )}
    </div>
  );
}

/* ---------- Susun Huruf Hijaiyah ---------- */
const strip = (s: string) => [...s].filter((c) => !/[\u064B-\u0652\u0670]/.test(c));
const GRP = ["بتثنيئ", "جحخ", "دذ", "رز", "سش", "صض", "طظ", "عغ", "فق", "كل", "مه", "وؤ", "اأإآ"];
const ALL = [..."ابتثجحخدذرزسشصضطظعغفقكلمنهوي"];
type H = { w: Word; k: "rumpang" | "susun" | "dengar"; L: string[]; m: number; opts: string[]; toks: string[] };

function buildH(t: Theme): H[] {
  const ws = shuffle(t.words.filter((w) => { const n = strip(w.ar).length; return n >= 3 && n <= 6; }));
  const ks = shuffle<H["k"]>(["rumpang", "rumpang", "rumpang", "susun", "susun", "susun", "dengar", "dengar"]);
  return ks.slice(0, Math.min(8, ws.length)).map((k, i) => {
    const w = ws[i], L = strip(w.ar), m = Math.floor(Math.random() * L.length), a = L[m];
    const near = shuffle([...(GRP.find((x) => x.includes(a)) ?? "")].filter((c) => c !== a));
    const rest = shuffle(ALL.filter((c) => c !== a && !near.includes(c)));
    return { w, k, L, m, opts: shuffle([a, ...[...near, ...rest].slice(0, 3)]), toks: shuffle(L) };
  });
}

const Box = ({ c, on }: { c: string; on?: boolean }) => (
  <span className={`arab grid h-14 w-14 place-items-center rounded-xl text-3xl font-extrabold shadow ${on ? "bg-[#ffd23f]" : "bg-white"}`}>{c}</span>
);

export function Huruf({ t, onSave, nav }: P) {
  const [hs, setHs] = useState<H[]>([]);
  const [i, setI] = useState(0);
  const [built, setBuilt] = useState<number[]>([]);
  const [pick, setPick] = useState<string | null>(null);
  const [sc, setSc] = useState(0);
  const [wrong, setWrong] = useState<Rv[]>([]);
  const [done, setDone] = useState(false);
  const start = () => { setHs(buildH(t)); setI(0); setBuilt([]); setPick(null); setSc(0); setWrong([]); setDone(false); };
  useEffect(start, []);
  const h = hs[i];
  useEffect(() => { if (h && h.k === "dengar") speak(h.w.ar); }, [h]);
  if (done) return <Done title="✍️ Menulis kata selesai!" bg="lv1" score={sc} total={hs.length} salah={hs.length - sc} wrong={wrong} again={start} nav={nav} />;
  if (!h) return null;

  function judge(a: string, ok: boolean) {
    if (pick !== null) return;
    setPick(a);
    reaksi(ok);
    if (ok) setSc(sc + 1); else setWrong([...wrong, { ar: h.w.ar, id: h.w.id, note: `Hurufnya: ${h.L.join(" ")}` }]);
  }
  function next() {
    if (i + 1 < hs.length) { setI(i + 1); setBuilt([]); setPick(null); return; }
    onSave("huruf", { score: sc, total: hs.length, salah: hs.length - sc });
    if (sc === hs.length) tepukTangan();
    setDone(true);
  }
  const good = h.k === "rumpang" ? pick === h.L[h.m] : pick === "ok";
  return (
    <div className="panel lv1 mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">✍️ Susun Huruf</h2>
      <p className="font-bold">Soal {i + 1} dari {hs.length}</p>
      <p className="mt-2 font-bold">{h.k === "rumpang" ? "Lengkapi huruf yang hilang!" : h.k === "susun" ? "Susun huruf-huruf ini menjadi kata yang benar!" : "Dengarkan, lalu susun huruf-hurufnya menjadi kata!"}</p>
      <div className="my-2 flex flex-wrap items-center justify-center gap-3">
        {h.k !== "dengar" && <><Illus e={h.w.e} size={72} /><span className="text-2xl font-extrabold">{h.w.id}</span></>}
        {h.k === "dengar" && <Sound text={h.w.ar} label="Putar lagi" />}
      </div>
      {h.k === "rumpang" ? (
        <>
          <div className="arab my-3 flex justify-center gap-2">{h.L.map((c, k) => <Box key={k} c={k === h.m ? (pick ?? "؟") : c} on={k === h.m} />)}</div>
          <div className="flex flex-wrap justify-center gap-3">
            {h.opts.map((o) => (
              <button key={o} onClick={() => judge(o, o === h.L[h.m])} className={`arab grid h-16 w-16 place-items-center rounded-2xl text-4xl font-extrabold shadow ${pick === null ? "bg-white" : o === h.L[h.m] ? "bg-green-300" : o === pick ? "bg-red-200" : "bg-white opacity-50"}`}>{o}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="arab my-3 flex min-h-16 flex-wrap justify-center gap-2 rounded-2xl bg-white/70 p-2">
            {built.map((b) => <button key={b} disabled={pick !== null} onClick={() => setBuilt(built.filter((x) => x !== b))}><Box c={h.toks[b]} on /></button>)}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {h.toks.map((c, k) => !built.includes(k) && <button key={k} disabled={pick !== null} onClick={() => setBuilt([...built, k])}><Box c={c} /></button>)}
          </div>
          {pick === null && <button className="btn mt-4" disabled={built.length < h.L.length} onClick={() => { const ok = built.map((b) => h.toks[b]).join("") === h.L.join(""); judge(ok ? "ok" : "no", ok); }}>✔ Periksa</button>}
        </>
      )}
      {pick !== null && (
        <div className="pop mt-4">
          <p className="mb-2 text-xl font-extrabold">{good ? "Benar, hebat! 🎉" : "😢 Hampir! Kata yang benar:"}</p>
          <RvView r={{ ar: h.w.ar, id: h.w.id, note: `Hurufnya: ${h.L.join(" ")}` }} />
          <button onClick={next} className="btn mt-3">{i + 1 < hs.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Misi Tema (sesuai aktivitas tiap tema pada rancangan) ---------- */
type MQ = { say: string; show: string; opts: { k: string; e?: string }[]; ans: string; rv: Rv };
type PM = P & { m: MisiDef };

function buildMC(t: Theme, m: MisiDef): MQ[] {
  const female = getProfil()?.avatar.sex === 1;
  return shuffle(m.items).slice(0, 5).map((it: MItem) => {
    if (m.kind === "perintah") {
      const w = t.words.find((x) => x.ar === it.w)!;
      const ar = female && it.f ? it.f : it.ar;
      return { say: ar, show: ar, opts: shuffle([w, ...shuffle(t.words.filter((x) => x.ar !== w.ar)).slice(0, 3)]).map((x) => ({ k: x.ar, e: x.e })), ans: w.ar, rv: { ar, id: it.id } };
    }
    const full = it.ar.replace("___", it.ans ?? "");
    return { say: "", show: it.ar, opts: shuffle(it.opts ?? []).map((o) => ({ k: o })), ans: it.ans ?? "", rv: { ar: full, id: it.id } };
  });
}

function MC({ t, m, onSave, nav }: PM) {
  const [qs, setQs] = useState<MQ[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [sc, setSc] = useState(0);
  const [wrong, setWrong] = useState<Rv[]>([]);
  const [done, setDone] = useState(false);
  const start = () => { setQs(buildMC(t, m)); setI(0); setPick(null); setSc(0); setWrong([]); setDone(false); };
  useEffect(start, []);
  const q = qs[i];
  useEffect(() => { if (q?.say) speak(q.say); }, [q]);
  if (done) return <Done title={`${m.e} ${m.n} selesai!`} bg="lv2" score={sc} total={qs.length} salah={qs.length - sc} wrong={wrong} again={start} nav={nav} />;
  if (!q) return null;
  function choose(k: string) {
    if (pick !== null) return;
    setPick(k);
    reaksi(k === q.ans);
    if (k === q.ans) setSc(sc + 1); else setWrong([...wrong, q.rv]);
  }
  function next() {
    if (i + 1 < qs.length) { setI(i + 1); setPick(null); return; }
    onSave("misi", { score: sc, total: qs.length, salah: qs.length - sc });
    if (sc === qs.length) tepukTangan();
    setDone(true);
  }
  return (
    <div className="panel lv2 mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">{m.e} {m.n}</h2>
      <p className="font-bold">Soal {i + 1} dari {qs.length}. {m.kind === "perintah" ? "Dengarkan, baca, lalu pilih gambar yang tepat!" : "Lengkapi kalimatnya dengan kata yang tepat!"}</p>
      <p className="arab my-3 text-4xl font-extrabold">{q.show}</p>
      {q.say && <Sound text={q.say} label="Putar lagi" />}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {q.opts.map((o) => (
          <button key={o.k} onClick={() => choose(o.k)} className={`rounded-2xl p-3 text-2xl font-extrabold shadow-[0_4px_0_rgba(0,0,0,.15)] ${pick === null ? "bg-white" : o.k === q.ans ? "bg-green-300" : o.k === pick ? "bg-red-200" : "bg-white opacity-50"}`}>
            {o.e ? <Illus e={o.e} size={72} /> : <span className="arab">{o.k}</span>}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="pop mt-4">
          <p className="mb-2 text-xl font-extrabold">{pick === q.ans ? "Benar, hebat! 🎉" : "😢 Hampir! Jawaban yang benar:"}</p>
          <RvView r={q.rv} />
          <button onClick={next} className="btn mt-3">{i + 1 < qs.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}

function Jam({ t, m, onSave, nav }: PM) {
  const [hs, setHs] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [h, setH] = useState(12);
  const [checked, setChecked] = useState(false);
  const [sc, setSc] = useState(0);
  const [wrong, setWrong] = useState<Rv[]>([]);
  const [done, setDone] = useState(false);
  const start = () => { setHs(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6)); setI(0); setH(12); setChecked(false); setSc(0); setWrong([]); setDone(false); };
  useEffect(start, []);
  const target = hs[i];
  const say = target ? `السَّاعَةُ ${ORD[target - 1]}` : "";
  useEffect(() => { if (say) speak(say); }, [say]);
  if (done) return <Done title={`${m.e} ${m.n} selesai!`} bg="sky" score={sc} total={hs.length} salah={hs.length - sc} wrong={wrong} again={start} nav={nav} />;
  if (!target) return null;
  const good = h === target;
  function check() {
    setChecked(true);
    reaksi(good);
    if (good) setSc(sc + 1); else setWrong([...wrong, { ar: say, id: `Jam ${target}.`, note: `Jarum pendek menunjuk angka ${target}.` }]);
  }
  function next() {
    if (i + 1 < hs.length) { setI(i + 1); setH(12); setChecked(false); return; }
    onSave("misi", { score: sc, total: hs.length, salah: hs.length - sc });
    if (sc === hs.length) tepukTangan();
    setDone(true);
  }
  return (
    <div className="panel sky mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">{m.e} {m.n}</h2>
      <p className="font-bold">Soal {i + 1} dari {hs.length}. Dengarkan, lalu putar jarum pendek ke jam yang disebutkan!</p>
      <p className="arab my-2 text-4xl font-extrabold">{say}</p>
      <Sound text={say} label="Putar lagi" />
      <svg viewBox="0 0 200 200" className="mx-auto my-3 w-56" role="img" aria-label="Jam analog">
        <circle cx="100" cy="100" r="94" fill="#fff" stroke={t.c} strokeWidth="8" />
        {Array.from({ length: 12 }, (_, k) => { const a = ((k + 1) * 30 - 90) * Math.PI / 180; return <text key={k} x={100 + 74 * Math.cos(a)} y={100 + 74 * Math.sin(a) + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill="#2b2350">{k + 1}</text>; })}
        <line x1="100" y1="100" x2="100" y2="30" stroke="#8d8aa8" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="100" x2="100" y2="54" stroke="#2b2350" strokeWidth="8" strokeLinecap="round" transform={`rotate(${h * 30} 100 100)`} />
        <circle cx="100" cy="100" r="7" fill="#ff6b6b" />
      </svg>
      <div className="flex items-center justify-center gap-4">
        <button className="btn" disabled={checked} onClick={() => setH(h === 1 ? 12 : h - 1)} aria-label="Mundur satu jam">◀</button>
        <span className="text-3xl font-extrabold">{h}</span>
        <button className="btn" disabled={checked} onClick={() => setH(h === 12 ? 1 : h + 1)} aria-label="Maju satu jam">▶</button>
      </div>
      {!checked && <button className="btn mt-4" onClick={check}>✔ Periksa</button>}
      {checked && (
        <div className="pop mt-4">
          <p className="mb-2 text-xl font-extrabold">{good ? "Tepat sekali! 🎉" : "😢 Hampir! Jarum pendek seharusnya menunjuk angka " + target}</p>
          <button onClick={next} className="btn mt-1">{i + 1 < hs.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}

function Urut({ t, m, onSave, nav }: PM) {
  const [ss, setSs] = useState<MItem[][]>([]);
  const [i, setI] = useState(0);
  const [tk, setTk] = useState<number[]>([]);
  const [built, setBuilt] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [sc, setSc] = useState(0);
  const [wrong, setWrong] = useState<Rv[]>([]);
  const [done, setDone] = useState(false);
  const start = () => {
    const st = shuffle([0, 1]).map((s) => m.items.filter((x) => x.s === s).sort((a, b) => (a.o ?? 0) - (b.o ?? 0)));
    setSs(st); setI(0); setTk(shuffle(st[0].map((_, k) => k))); setBuilt([]); setChecked(false); setSc(0); setWrong([]); setDone(false);
  };
  useEffect(start, []);
  const s = ss[i];
  if (done) return <Done title={`${m.e} ${m.n} selesai!`} bg="felt" score={sc} total={ss.reduce((a, x) => a + x.length, 0)} salah={ss.reduce((a, x) => a + x.length, 0) - sc} wrong={wrong} again={start} nav={nav} />;
  if (!s) return null;
  const right = built.filter((b, pos) => b === pos).length;
  function check() {
    setChecked(true);
    reaksi(right === s.length);
    setSc(sc + right);
    if (right < s.length) setWrong([...wrong, ...s.map((x) => ({ ar: x.ar, id: x.id }))]);
  }
  function next() {
    if (i + 1 < ss.length) { setI(i + 1); setTk(shuffle(ss[i + 1].map((_, k) => k))); setBuilt([]); setChecked(false); return; }
    const total = ss.reduce((a, x) => a + x.length, 0);
    onSave("misi", { score: sc, total, salah: total - sc });
    if (sc === total) tepukTangan();
    setDone(true);
  }
  return (
    <div className="panel felt mt-6 p-5 text-center">
      <h2 className="text-2xl font-extrabold">{m.e} {m.n}</h2>
      <p className="font-bold">Cerita {i + 1} dari {ss.length}. Baca kata penunjuk urutannya, lalu ketuk kartu dari kejadian pertama sampai terakhir!</p>
      <div className="my-3 grid gap-2">
        {built.map((b, pos) => (
          <button key={b} disabled={checked} onClick={() => setBuilt(built.filter((x) => x !== b))} className={`flex items-center justify-between gap-2 rounded-xl p-2 font-bold shadow ${checked ? (b === pos ? "bg-green-300" : "bg-red-200") : "bg-[#ffd23f]"}`}>
            <span>{pos + 1}.</span><Illus e={s[b].e ?? t.e} size={32} /><span className="arab text-xl">{s[b].ar}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {tk.map((k) => !built.includes(k) && (
          <button key={k} onClick={() => { speak(s[k].ar); setBuilt([...built, k]); }} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 font-bold shadow">
            <Illus e={s[k].e ?? t.e} size={32} /><span className="arab text-xl">{s[k].ar}</span>
          </button>
        ))}
      </div>
      {!checked && <button className="btn mt-4" disabled={built.length < s.length} onClick={check}>✔ Periksa</button>}
      {checked && (
        <div className="pop mt-4">
          <p className="mb-2 text-xl font-extrabold">{right === s.length ? "Urutannya benar semua! 🎉" : `😢 ${right} dari ${s.length} sudah tepat. Urutan yang benar:`}</p>
          {right < s.length && <div className="grid gap-2">{s.map((x) => <RvView key={x.ar} r={{ ar: x.ar, id: x.id }} />)}</div>}
          <button onClick={next} className="btn mt-3">{i + 1 < ss.length ? "Lanjut ▶" : "Lihat hasil"}</button>
        </div>
      )}
    </div>
  );
}

export function Misi(p: P) {
  const m = MISI[p.t.slug];
  return m.kind === "jam" ? <Jam {...p} m={m} /> : m.kind === "urut" ? <Urut {...p} m={m} /> : <MC {...p} m={m} />;
}
