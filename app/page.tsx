import ThemeMap from "@/components/ThemeMap";

export default function Home() {
  return (
    <main>
      <header className="bg-hijau text-krem">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-14 text-center">
          <p className="arab text-6xl font-bold sm:text-7xl">مَرْحَبًا</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Assalāmu’alaikum, Sahabat Arab!</h1>
          <p className="max-w-md text-lg">Belajar bahasa Arab di Ma'waArabic: dengarkan, tirukan, lalu kerjakan misinya.</p>
          <a href="#peta" className="mt-3 rounded-full bg-emas px-8 py-3 text-xl font-extrabold text-hijau-tua shadow-md">
            Mulai Belajar
          </a>
          <p className="text-sm opacity-80">MI Kelas V–VI • Fase C • CEFR A1</p>
        </div>
      </header>
      <ThemeMap />
    </main>
  );
}
