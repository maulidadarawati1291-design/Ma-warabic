import type { Theme } from "@/lib/data";

// Ilustrasi vektor 2D flat (Twemoji, CC-BY 4.0) dari CDN. Ganti fungsi ini untuk memakai gambar sendiri.
export const src = (e: string) => {
  const c = [...e].map((x) => x.codePointAt(0)!.toString(16));
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${(c.includes("200d") ? c : c.filter((x) => x !== "fe0f")).join("-")}.svg`;
};

export function Illus({ e, size = 64 }: { e: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src(e)} width={size} height={size} alt="" loading="lazy" className="inline-block object-contain" />;
}

// Pemandangan 2D per tema: langit, matahari, awan, bukit, dan tiga kosakata tema.
export function Scene({ t }: { t: Theme }) {
  return (
    <svg viewBox="0 0 600 220" className="w-full rounded-3xl border-4 border-white shadow-md" role="img" aria-label={`Ilustrasi tema ${t.id}`}>
      <rect width="600" height="220" fill={t.bg} />
      <circle cx="530" cy="52" r="30" fill="#ffd23f" />
      <ellipse cx="110" cy="48" rx="55" ry="17" fill="#fff" /><ellipse cx="150" cy="60" rx="45" ry="15" fill="#fff" />
      <ellipse cx="370" cy="38" rx="45" ry="14" fill="#fff" />
      <path d="M0 165 Q150 105 300 155 T600 145 V220 H0Z" fill={t.c} />
      <path d="M0 200 Q200 160 400 195 T600 185 V220 H0Z" fill="#3fb86a" />
      {t.words.slice(0, 3).map((w, i) => (
        <image key={w.ar} href={src(w.e)} x={95 + i * 170} y={65 + (i % 2) * 28} width="115" height="115" />
      ))}
    </svg>
  );
}
