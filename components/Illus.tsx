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

const SPOTS = [[40, 125, 84], [135, 100, 104], [250, 62, 130], [385, 100, 104], [480, 125, 84]];
const HILLS = [
  "M0 170 Q150 110 300 160 T600 150 V240 H0Z",
  "M0 190 L90 120 L170 175 L260 100 L360 180 L450 125 L540 175 L600 140 V240 H0Z",
  "M0 190 Q50 130 100 190 T200 190 T300 190 T400 190 T500 190 T600 190 V240 H0Z",
];

// Diorama 2D per tema: langit gradasi, lambang tema transparan, bukit (bentuk berbeda tiap tema), dan lima benda berbayang yang berdiri di tanah.
export function Scene({ t }: { t: Theme }) {
  return (
    <svg viewBox="0 0 600 240" className="w-full rounded-3xl border-4 border-white shadow-md" role="img" aria-label={`Ilustrasi tema ${t.id}`}>
      <defs>
        <linearGradient id="scg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.bg} /><stop offset="1" stopColor="#fff" /></linearGradient>
      </defs>
      <rect width="600" height="240" fill="url(#scg)" />
      <image href={src(t.e)} x="205" y="-25" width="200" height="200" opacity=".13" />
      <circle className="sun" cx="540" cy="50" r="28" fill="#ffd23f" />
      <g className="drift" fill="#fff"><ellipse cx="100" cy="46" rx="52" ry="15" /><ellipse cx="140" cy="58" rx="40" ry="13" /></g>
      <ellipse className="drift" cx="400" cy="34" rx="44" ry="13" fill="#fff" />
      {[[70, 30], [330, 60], [560, 110], [30, 90], [450, 20]].map(([x, y], i) => <text key={i} className="twinkle" style={{ animationDelay: `${i * 0.4}s` }} x={x} y={y} fontSize="18" fill={t.c}>✦</text>)}
      <path d={HILLS[t.slug.length % 3]} fill={t.c} opacity=".45" />
      <path d="M0 205 Q150 160 320 200 T600 190 V240 H0Z" fill={t.c} />
      <path d="M0 222 Q200 192 400 220 T600 212 V240 H0Z" fill="#3fb86a" />
      {t.words.slice(0, 5).map((w, i) => {
        const [x, y, s] = SPOTS[i];
        return (
          <g key={w.ar}>
            <ellipse cx={x + s / 2} cy={y + s - 2} rx={s * 0.4} ry="7" fill="#000" opacity=".18" />
            <circle cx={x + s / 2} cy={y + s / 2} r={s * 0.58} fill="#fff" opacity=".35" />
            <image className="bob" style={{ animationDelay: `${i * 0.4}s`, filter: "drop-shadow(0 4px 3px rgba(0,0,0,.25))" }} href={src(w.e)} x={x} y={y} width={s} height={s} />
          </g>
        );
      })}
    </svg>
  );
}

const KC = ["#ff6b6b", "#ffd23f", "#2fbf71", "#5aa0ff", "#ff5fa2", "#a78bfa"];
export function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 40 }, (_, i) => (
        <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, background: KC[i % 6], animationDelay: `${(i % 10) * 0.15}s`, animationDuration: `${2 + (i % 5) * 0.4}s` }} />
      ))}
    </div>
  );
}
