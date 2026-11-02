import type { Metadata } from "next";
import { Nunito, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const sans = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const arab = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-arab" });

export const metadata: Metadata = {
  title: "Ma'waArabic – Belajar Bahasa Arab untuk MI Kelas V–VI",
  description: "Media pembelajaran bahasa Arab interaktif untuk MI Fase C (CEFR A1).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${arab.variable}`}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
