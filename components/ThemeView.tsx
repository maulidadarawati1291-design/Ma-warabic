"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Theme, Word } from "@/lib/data";
import { saveResult, shuffle, speak, stars } from "@/lib/util";

type Q = { w: Word; mode: "dengar" | "baca"; opts: string[] };

function SoundBtn({ text, label = "Dengarkan" }: { text: string; label?: string }) {
  return (
    <button onClick={() => speak(text)} className="rounded-full bg-hijau px-4 py-2 font-bold text-krem">
      🔊 {label}
    </button>
  );
}

function Quiz({ theme }: { theme: Theme }) {
  const [qs, setQs] = useState<Q[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<Word[]>([]);
  const [done, setDone] = useState(false);
  const q = qs[i];

  function start() {
    setQs(shuffle(theme.words).map((w, n) => ({
      w, mode: n % 2 ? "dengar" : "baca",
      opts: shuffle([w.id, ...shuffle(theme.words.filter((x) => x.id !== w.id)).slice(0, 3).map((x) => x.id)]),
    })));
    setI(0); setPick(null); setScore(0); setWrong([]); setDone(false);
  }

  useEffect(() => { if (q?.mode === "dengar") speak(q.w.ar); }, [q]);

  function choose(o: string) {
    if (pick) return;
    setPick(o);
    if (o === q.w.id) setScore(score + 1); else setWrong([...wrong, q.w]);
  }

  function next() {
    if (i + 1 < qs.length) { setI(i + 1); setPick(null); return; }
    saveResult(theme.slug, { score, total: qs.length, wrong: wrong.map((x) => x.ar) });
    setDone(true);
  }

  if (!qs.length) {
    return <button onClick={start} className="mt-6 rounded-full bg-emas px-8 py-3 text-xl font-extrabold text-hijau-tua">Mulai Kuis</button>;
  }

  if (done) {
    const s = stars({ score, total: qs.length, wrong: [] });
    return (
      <div className="mt-6 rounded-3xl bg-pastel p-6 text-center">
        <h2 className="text-2xl font-extrabold text-hijau-tua">Keren! Misimu selesai</h2>
        <p className="my-2 text-4xl text-emas">{"★".repeat(s)}{"☆".repeat(3 - s)}</p>
        <p className="text-xl font-bold">Skor {score} dari {qs.length}</p>
        {wrong.length > 0 && (
          <div className="mt-4">
            <p className="font-bold">Kosakata yang perlu dilatih:</p>
            {wrong.map((x) => <p key={x.ar}><span className="arab text-xl">{x.ar}</span> — {x.id}</p>)}
          </div>
        )}
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={start} className="rounded-full bg-hijau px-5 py-2 font-bold text-krem">Coba lagi</button>
          <Link href="/#peta" className="rounded-full bg-emas px-5 py-2 font-bold text-hijau-tua">Peta Belajar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-3xl bg-pastel p-6 text-center">
      <p className="text-sm font-bold text-hijau">Soal {i + 1} dari {qs.length}</p>
      {q.mode === "dengar"
        ? <div className="my-4"><p className="mb-2 font-bold">Dengarkan, lalu pilih artinya:</p><SoundBtn text={q.w.ar} label="Putar lagi" /></div>
        : <div className="my-4"><p className="mb-1 font-bold">Apa arti kata ini?</p><p className="arab text-5xl font-bold">{q.w.ar}</p></div>}
      <div className="grid gap-3 sm:grid-cols-2">
        {q.opts.map((o) => {
          const style = !pick ? "bg-white" : o === q.w.id ? "bg-green-300" : o === pick ? "bg-red-200" : "bg-white opacity-60";
          return <button key={o} onClick={() => choose(o)} className={`rounded-2xl p-4 text-lg font-bold shadow-sm ${style}`}>{o}</button>;
        })}
      </div>
      {pick && (
        <div className="mt-4">
          <p className="font-bold">{pick === q.w.id ? "Benar, hebat! 🎉" : <>Hampir! Jawabannya: <span className="arab">{q.w.ar}</span> = {q.w.id}</>}</p>
          <button onClick={next} className="mt-3 rounded-full bg-hijau px-6 py-2 font-bold text-krem">
            {i + 1 < qs.length ? "Lanjut" : "Lihat hasil"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ThemeView({ theme }: { theme: Theme }) {
  const [tab, setTab] = useState<"kamus" | "kuis">("kamus");
  return (
    <div>
      <div className="mt-4 text-center">
        <p className="text-6xl">{theme.e}</p>
        <h1 className="arab text-3xl font-extrabold text-hijau-tua">{theme.ar}</h1>
        <p className="text-lg font-bold">{theme.id}</p>
      </div>
      <div className="mt-5 flex justify-center gap-2" role="tablist">
        {(["kamus", "kuis"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-full px-6 py-2 font-bold ${tab === t ? "bg-hijau text-krem" : "bg-pastel text-hijau-tua"}`}>
            {t === "kamus" ? "Kamus Bergambar" : "Kuis"}
          </button>
        ))}
      </div>
      {tab === "kamus" ? (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {theme.words.map((x) => (
              <div key={x.ar} className="rounded-3xl bg-pastel p-4 text-center">
                <div className="text-5xl">{x.e}</div>
                <div className="arab text-3xl font-bold">{x.ar}</div>
                <div className="mb-2 font-semibold">{x.id}</div>
                <SoundBtn text={x.ar} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm font-bold text-hijau">Contoh kalimat</p>
            <p className="arab text-3xl font-bold">{theme.ex.ar}</p>
            <p className="mb-3">{theme.ex.id}</p>
            <SoundBtn text={theme.ex.ar} label="Dengarkan kalimat" />
          </div>
        </div>
      ) : <Quiz theme={theme} />}
    </div>
  );
}
