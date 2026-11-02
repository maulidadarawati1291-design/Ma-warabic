"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { themes } from "@/lib/data";
import { loadProgress, stars, type Progress } from "@/lib/util";

export default function ThemeMap() {
  const [p, setP] = useState<Progress>({});
  useEffect(() => { setP(loadProgress()); }, []);
  const done = themes.filter((t) => p[t.slug]).length;

  return (
    <section id="peta" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-3xl font-extrabold text-hijau-tua">Peta Belajar</h2>
      <p className="mt-1 text-hijau-tua/80">{done} dari {themes.length} tema sudah kamu coba. Pilih tema sesuai arahan gurumu.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((t) => {
          const r = p[t.slug];
          const s = r ? stars(r) : 0;
          return (
            <Link key={t.slug} href={`/tema/${t.slug}`}
              className="rounded-3xl bg-pastel p-5 text-center shadow-sm ring-2 ring-transparent transition hover:ring-hijau">
              <div className="text-5xl">{t.e}</div>
              <div className="arab mt-2 text-xl font-bold text-hijau-tua">{t.ar}</div>
              <div className="font-bold">{t.id}</div>
              <div className="mt-2 text-sm font-semibold text-hijau">
                {r ? <span className="text-lg text-emas">{"★".repeat(s)}{"☆".repeat(3 - s)}</span> : "▶ Mulai"}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
