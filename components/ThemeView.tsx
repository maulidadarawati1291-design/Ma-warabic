"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { GAMES, type Theme } from "@/lib/data";
import { getProfil, loadProg, perfect, saveRes, type Prog, type Res } from "@/lib/util";
import { Scene } from "./Illus";
import { Kamus, Quiz } from "./Play1";
import { Balon, Match } from "./Play2";

export default function ThemeView({ theme }: { theme: Theme }) {
  const r = useRouter();
  const [prog, setProg] = useState<Prog>({});
  const [g, setG] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getProfil()) { r.replace("/"); return; }
    setProg(loadProg()); setReady(true);
  }, [r]);
  if (!ready) return null;

  const mine = prog[theme.slug] ?? {};
  const save = (game: string, res: Res) => { saveRes(theme.slug, game, res); setProg(loadProg()); };
  const open = (i: number) => i === 0 || perfect(mine[GAMES[i - 1].id]);

  return (
    <div style={{ "--c": theme.c } as CSSProperties}>
      <div className="mt-4"><Scene t={theme} /></div>
      <div className="mt-3 text-center">
        <h1 className="arab text-3xl font-extrabold">{theme.ar}</h1>
        <p className="text-xl font-bold">{theme.id}</p>
      </div>
      {!g ? (
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {GAMES.map((x, i) => {
            const res = mine[x.id];
            return (
              <li key={x.id}>
                <button disabled={!open(i)} onClick={() => setG(x.id)} className="card wiggle flex w-full items-center gap-3 p-4 text-left disabled:opacity-50 disabled:grayscale" style={{ background: theme.bg }}>
                  <span className="text-4xl">{open(i) ? x.e : "🔒"}</span>
                  <span>
                    <span className="block text-xl font-extrabold">{i + 1}. {x.n}</span>
                    <span className="block text-sm font-bold">
                      {perfect(res) ? "✔ Sempurna!" : res ? `Terbaik ${res.score}/${res.total}` : open(i) ? "Ayo main!" : "Selesaikan game sebelumnya dengan sempurna"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div>
          <button onClick={() => setG(null)} className="btn mt-4">← Daftar game</button>
          {g === "kamus" && <Kamus t={theme} onSave={save} />}
          {g === "kuis" && <Quiz t={theme} onSave={save} />}
          {g === "cocok" && <Match t={theme} onSave={save} />}
          {g === "balon" && <Balon t={theme} onSave={save} />}
        </div>
      )}
    </div>
  );
}
