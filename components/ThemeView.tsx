"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { GAMES, type Theme } from "@/lib/data";
import { getProfil, loadProg, perfect, resetIncomplete, saveRes, type Prog, type Res } from "@/lib/util";
import { Scene } from "./Illus";
import { Kamus, Quiz, type Nav } from "./Play1";
import { Balon, Match } from "./Play2";

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
  const complete = GAMES.every((x) => perfect(mine[x.id]));
  const save = (game: string, res: Res) => { saveRes(theme.slug, game, res); setProg(loadProg()); };
  const open = (i: number) => i === 0 || perfect(mine[GAMES[i - 1].id]);
  const gi = GAMES.findIndex((x) => x.id === g);
  const nav: Nav = {
    next: () => setG(GAMES[gi + 1]?.id ?? null),
    canAgain: complete || !perfect(mine[g ?? ""]),
    last: gi === GAMES.length - 1,
  };

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
            <p className="mt-5 rounded-2xl bg-white/80 p-3 text-center font-bold">⚠️ Selesaikan semua game tanpa keluar dari halaman ini. Jika keluar atau memuat ulang, tema diulang dari awal.</p>
          )}
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {GAMES.map((x, i) => {
              const res = mine[x.id];
              const done = perfect(res);
              const can = complete || (open(i) && !done);
              return (
                <li key={x.id}>
                  <button disabled={!can} onClick={() => setG(x.id)} className="card wiggle flex w-full items-center gap-3 p-4 text-left disabled:opacity-60 disabled:grayscale" style={{ background: theme.bg }}>
                    <span className="text-4xl">{can ? x.e : done ? "✅" : "🔒"}</span>
                    <span>
                      <span className="block text-xl font-extrabold">{i + 1}. {x.n}</span>
                      <span className="block text-sm font-bold">
                        {done ? (complete ? "✔ Sempurna! Boleh berlatih lagi" : "✔ Selesai") : res ? `Terbaik ${res.score}/${res.total}` : open(i) ? "Ayo main!" : "Selesaikan game sebelumnya dengan sempurna"}
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
          {g === "kamus" && <Kamus t={theme} onSave={save} nav={nav} />}
          {g === "kuis" && <Quiz t={theme} onSave={save} nav={nav} />}
          {g === "cocok" && <Match t={theme} onSave={save} nav={nav} />}
          {g === "balon" && <Balon t={theme} onSave={save} nav={nav} />}
        </div>
      )}
    </div>
  );
}
