import Link from "next/link";
import { notFound } from "next/navigation";
import { themes } from "@/lib/data";
import ThemeView from "@/components/ThemeView";

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export default async function TemaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = themes.find((t) => t.slug === slug);
  if (!theme) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/#peta" className="font-bold text-hijau">← Peta Belajar</Link>
      <ThemeView theme={theme} />
    </main>
  );
}
