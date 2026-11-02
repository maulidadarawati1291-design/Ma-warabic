import type { CSSProperties } from "react";
import ThemeMap from "@/components/ThemeMap";
import { Illus } from "@/components/Illus";

export default function Home() {
  return (
    <main>
      <header className="relative overflow-hidden px-4 pb-20 pt-12 text-center" style={{ background: "linear-gradient(135deg,#ffb830,#ff8fc0 55%,#c4a8ff)" }}>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3">
          <div className="flex gap-2">
            {["🦁", "🐘", "🍎", "📚", "🐒"].map((e, i) => (
              <span key={e} className={i % 2 ? "motion-safe:animate-bounce" : ""}><Illus e={e} size={56} /></span>
            ))}
          </div>
          <p className="arab text-7xl font-extrabold text-white" style={{ textShadow: "0 5px 0 #2b2350" }}>مَرْحَبًا</p>
          <h1 className="text-4xl font-extrabold">Ma'waArabic</h1>
          <p className="text-xl font-bold">Ayo belajar bahasa Arab sambil bermain!</p>
          <a href="#peta" className="btn mt-2 text-2xl" style={{ "--c": "#ffd23f" } as CSSProperties}>▶ Mulai Petualangan</a>
          <p className="text-sm font-bold">MI Kelas V–VI • Fase C • CEFR A1</p>
        </div>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full" aria-hidden="true">
          <path d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0Z" fill="#bfe9ff" />
        </svg>
      </header>
      <ThemeMap />
      <footer className="px-4 pb-8 text-center text-xs font-semibold">
        Ilustrasi kata: Twemoji © Twitter, Inc. dan kontributor, lisensi CC-BY 4.0.
      </footer>
    </main>
  );
}
