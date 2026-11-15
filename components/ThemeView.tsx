"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { GAMES, MISI, type Theme } from "@/lib/data";
import { getProfil, loadProg, finished, resetIncomplete, saveRes, type Prog, type Res } from "@/lib/util";
import { Scene } from "./Illus";
import { Kamus, Quiz, type Nav } from "./Play1";
import { Balon, Match } from "./Play2";
import { Huruf, Kalimat, Misi } from "./Play3";

const GB = ["linear-gradient(135deg,#ffe0f0,#fff3c4)", "linear-gradient(135deg,#fff3c4,#ffd9a0)", "linear-gradient(135deg,#e6dcff,#cbbaff)", "linear-gradient(135deg,#b8f2e6,#d9f0ff)", "linear-gradient(135deg,#d4fbe6,#b9f0d2)", "linear-gradient(135deg,#8fd3ff,#d8f3ff)", "linear-gradient(135deg,#ffd9a0,#ffb3c7)"];

export default function ThemeView({ theme }: { theme: Theme }) {
  const r = useRouter();
  const [prog, setProg] = useState<Prog>({});
  const [g, setG] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Anti-curang: keluar/refresh sebelum tema selesai = tema diulang dari awal.
  useEffect(() => {
    if (!getProfil()) { r.replace("/"); return; }
    const reset = () => resetIncomplete(theme.slug, GAMES.length);
    reset(); setProg(loadProg()); setReady(true);
    window.addEventListener("pagehide", reset);
    return () => { window.removeEventListener("pagehide", reset); reset(); };
  }, [r, theme.slug]);
  if (!ready) return null;

  const mine = prog[theme.slug] ?? {};
  const complete = GAMES.every((x) => finished(mine[x.id]));
  const save = (game: string, res: Res) => { saveRes(theme.slug, game, res); setProg(loadProg()); };
  const open = (i: number) => i === 0 || finished(mine[GAMES[i - 1].id]);
  const gi = GAMES.findIndex((x) => x.id === g);
  const nav: Nav = {
    next: () => setG(GAMES[gi + 1]?.id ?? null),
    canAgain: complete,
    last: gi === GAMES.length - 1,
  };
  const misi = MISI[theme.slug];
  const p = { t: theme, onSave: save, nav };

  return (
    <div style={{ "--c": theme.c } as CSSProperties}>
      <div className="mt-4"><Scene t={theme} /></div>
      <div className="mt-3 text-center">
        <h1 className="arab text-3xl font-extrabold">{theme.ar}</h1>
        <p className="text-xl font-bold">{theme.id}</p>
      </div>
      {!g ? (
        <>
          {complete ? (
            <div className="card mt-5 bg-white p-4 text-center">
              <p className="text-xl font-extrabold">🏆 Tema selesai! Semua game terbuka untuk berlatih.</p>
              <Link href="/peta" className="btn mt-2">🗺️ Lanjut ke Peta</Link>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-white/80 p-3 text-center font-bold">Selesaikan semua game satu per satu, ya! Jangan keluar halaman sebelum selesai, kalau tidak, tema diulang dari awal.</p>
          )}
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {GAMES.map((x, i) => {
              const res = mine[x.id];
              const done = finished(res);
              const can = complete || (open(i) && !done);
              const name = x.id === "misi" ? misi.n : x.n;
              const icon = x.id === "misi" ? misi.e : x.e;
              return (
                <li key={x.id}>
                  <button disabled={!can} onClick={() => setG(x.id)} className="card wiggle flex w-full items-center gap-3 p-4 text-left disabled:opacity-60 disabled:grayscale" style={{ background: GB[i] }}>
                    <span className="text-4xl">{can ? icon : done ? "✅" : "🔒"}</span>
                    <span>
                      <span className="block text-xl font-extrabold">{i + 1}. {name}</span>
                      <span className="block text-sm font-bold">
                        {done ? (complete ? "✔ Selesai · boleh berlatih lagi" : `✔ Selesai · nilai ${res?.score}/${res?.total}${res?.salah !== undefined ? ` · salah ${res.salah}` : ""}`) : open(i) ? "Ayo main!" : "Selesaikan game sebelumnya dulu"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <div>
          <button onClick={() => setG(null)} className="btn mt-4">← Daftar game</button>
          {g === "kalimat" && <Kalimat {...p} />}
          {g === "kamus" && <Kamus {...p} />}
          {g === "kuis" && <Quiz {...p} />}
          {g === "cocok" && <Match {...p} />}
          {g === "huruf" && <Huruf {...p} />}
          {g === "balon" && <Balon {...p} />}
          {g === "misi" && <Misi {...p} />}
        </div>
      )}
    </div>
  );
}
