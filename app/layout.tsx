import type { Metadata } from "next";
import { Baloo_2, Noto_Naskh_Arabic } from "next/font/google";
import Bg from "@/components/Bg";
import "./globals.css";

const sans = Baloo_2({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-baloo" });
const arab = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-arab" });

export const metadata: Metadata = {
  title: "Ma'warabic – Belajar Bahasa Arab Seru",
  description: "Belajar bahasa Arab sambil bermain: kamus bergambar, kuis, cocokkan kartu, dan pecah balon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${arab.variable}`}>
      <body className="font-sans min-h-screen">
        <Bg />
        <div className="relative z-10">{children}</div>
        <footer className="relative z-10 px-4 pb-6 text-center text-xs font-semibold">
          Ilustrasi kata: Twemoji © Twitter, Inc. dan kontributor, lisensi CC-BY 4.0.
        </footer>
      </body>
    </html>
  );
}
