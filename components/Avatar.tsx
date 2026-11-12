import type { ReactNode } from "react";
import { HAIRC, OUTC, SKINS, type Look } from "@/lib/data";

const ink = "#2b2350";
const fr = "M23 46 Q20 14 50 14 Q80 14 77 46 Q70 30 50 30 Q30 30 23 46Z";
const FRONT: Record<number, string> = {
  0: "M23 46 Q18 12 50 12 Q82 12 77 46 Q72 28 50 26 Q28 28 23 46Z",
  1: "M24 42 L26 14 L37 28 L45 8 L54 27 L65 10 L70 28 L79 14 L76 42 Q50 28 24 42Z",
  2: "M23 46 Q18 14 50 12 Q82 12 78 44 Q72 22 46 28 Q28 32 23 46Z",
  3: "M24 40 Q24 18 50 18 Q76 18 76 40 Q64 28 50 28 Q36 28 24 40Z",
  4: "M26 40 Q50 22 74 40 Q50 32 26 40Z",
  5: fr, 6: fr, 9: fr, 10: fr,
  7: "M23 46 Q20 14 50 14 Q80 14 77 46 Q66 24 50 30 Q34 24 23 46Z",
  8: "M24 42 Q24 14 50 14 Q76 14 76 42 L76 34 Q50 26 24 34Z",
};
// Model hijab: bentuk luar; lubang wajah (HOLE) memotong sehingga dahi tidak terlihat.
const HOLE = "M28 50 Q28 29 50 29 Q72 29 72 50 Q72 72 50 74 Q28 72 28 50Z";
const HIJAB = [
  "",
  "M12 58 Q10 4 50 4 Q90 4 88 58 Q92 96 50 100 Q8 96 12 58Z ",
  "M14 56 Q12 6 50 6 Q88 6 86 56 L90 92 L50 100 L10 92Z ",
  "M14 56 Q12 6 50 6 Q88 6 86 56 Q88 82 50 84 Q12 82 14 56Z ",
  "M10 56 Q8 2 50 2 Q92 2 90 56 L98 100 L2 100Z ",
];

export default function Avatar({ look: l, size = 80 }: { look: Look; size?: number }) {
  const sk = SKINS[l.skin], hc = HAIRC[l.hc], oc = OUTC[l.oc], o = l.outfit, h = l.hair, hj = l.hijab, girl = l.sex === 1;
  const eye = (x: number, r = 3) => <circle cx={x} cy={47} r={r} fill={ink} />;
  const mouth = (d: string) => <path d={d} stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />;
  const cheeks = <><circle cx="33" cy="57" r="4" fill="#ff8fa3" opacity=".55" /><circle cx="67" cy="57" r="4" fill="#ff8fa3" opacity=".55" /></>;
  const lash = girl ? <path d="M34 44 l-3 -2 M66 44 l3 -2" stroke={ink} strokeWidth="2" strokeLinecap="round" /> : null;
  const moods = [
    <>{eye(40)}{eye(60)}{lash}{mouth("M40 58 Q50 68 60 58")}{cheeks}</>,
    <>{eye(40, 5)}{eye(60, 5)}<circle cx="42" cy="45" r="1.8" fill="#fff" /><circle cx="62" cy="45" r="1.8" fill="#fff" />{lash}<path d="M38 57 Q50 75 62 57Z" fill="#c0392b" />{cheeks}</>,
    <><rect x="29" y="42" width="19" height="10" rx="4" fill={ink} /><rect x="52" y="42" width="19" height="10" rx="4" fill={ink} />{mouth("M38 62 Q52 68 62 58")}</>,
    <>{eye(40)}{mouth("M55 47 h10")}{lash}{mouth("M40 58 Q50 66 60 58")}<path d="M47 62 Q51 74 56 62Z" fill="#ff5fa2" />{cheeks}</>,
  ];
  const back: Record<number, ReactNode> = {
    4: <>{[[28, 30], [40, 19], [60, 19], [72, 30], [21, 44], [79, 44]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="11" fill={hc} />)}</>,
    5: <path d="M21 48 Q18 8 50 8 Q82 8 79 48 L84 92 L16 92Z" fill={hc} />,
    6: <><path d="M70 24 Q98 18 92 56 Q90 70 82 74 Q88 44 68 34Z" fill={hc} /><circle cx="72" cy="27" r="4" fill="#ff5fa2" /></>,
    7: <>{[64, 76, 88].map((y) => <g key={y}><circle cx="19" cy={y} r="7" fill={hc} /><circle cx="81" cy={y} r="7" fill={hc} /></g>)}</>,
    8: <path d="M20 50 Q16 8 50 8 Q84 8 80 50 L80 66 Q70 68 68 56 L32 56 Q30 68 20 66Z" fill={hc} />,
    9: <><circle cx="50" cy="9" r="11" fill={hc} /><rect x="42" y="16" width="16" height="4" rx="2" fill="#ff5fa2" /></>,
    10: <><path d="M21 48 Q18 8 50 8 Q82 8 79 48 L82 80 L18 80Z" fill={hc} />{[50, 64, 78].map((y) => <g key={y}><circle cx="18" cy={y} r="9" fill={hc} /><circle cx="82" cy={y} r="9" fill={hc} /></g>)}</>,
  };
  const decor: ReactNode[] = [
    <path d="M38 75 Q50 85 62 75" stroke="#0003" strokeWidth="3" fill="none" />,
    <><path d="M30 76 Q50 94 70 76" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M45 87 v10 M55 87 v10" stroke="#fff" strokeWidth="2" /></>,
    <><path d="M12 84 H88" stroke="#fff" strokeWidth="3" opacity=".7" /><text x="50" y="98" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">10</text></>,
    <><path d="M50 76 V100" stroke="#fff" strokeWidth="2.5" />{[84, 91, 98].map((y) => <circle key={y} cx="50" cy={y} r="1.6" fill="#fff" />)}</>,
    <><path d="M12 90 H88" stroke="#ffd23f" strokeWidth="3" /><path d="M36 76 Q50 86 64 76" stroke="#ffd23f" strokeWidth="3" fill="none" /></>,
    <><path d="M34 75 Q42 87 50 79 Q58 87 66 75Z" fill={sk} /><circle cx="50" cy="93" r="4" fill="#fff" /></>,
    <><path d="M36 74 L50 90 L64 74 L58 72 L50 80 L42 72Z" fill="#e5e7eb" />{girl ? <path d="M50 86 L40 81 L40 91Z M50 86 L60 81 L60 91Z" fill={oc} /> : <path d="M47 84 H53 L55 99 L50 102 L45 99Z" fill={oc} />}</>,
    <><path d="M50 76 V100" stroke="#fff" strokeWidth="2.5" /><path d="M12 92 H34 M66 92 H88" stroke="#fff" strokeWidth="4" /><path d="M36 75 Q50 84 64 75" stroke="#fff" strokeWidth="4" fill="none" /></>,
    <circle cx="50" cy="90" r="6" fill="#ffd23f" />,
    <><ellipse cx="50" cy="77" rx="22" ry="6" fill="none" stroke="#9aa5b1" strokeWidth="4" /><circle cx="30" cy="92" r="4" fill="#ff6b6b" /></>,
  ];
  const accs: ReactNode[] = [
    <g fill="none" stroke={ink} strokeWidth="3"><circle cx="40" cy="47" r="8" /><circle cx="60" cy="47" r="8" /><path d="M48 47h4" /></g>,
    <><rect x="29" y="42" width="19" height="10" rx="4" fill={ink} /><rect x="52" y="42" width="19" height="10" rx="4" fill={ink} /><path d="M48 46h4" stroke={ink} strokeWidth="2" /></>,
    <><path d="M23 34 Q50 4 77 34Z" fill="#ff6b6b" /><rect x="16" y="32" width="40" height="6" rx="3" fill="#ff6b6b" /></>,
    <><path d="M23 36 Q24 6 50 6 Q76 6 77 36Z" fill="#ffb830" /><rect x="22" y="30" width="56" height="9" rx="4" fill="#ff8a00" /><circle cx="50" cy="5" r="5" fill="#fff" /></>,
    <><path d="M28 30 L30 12 Q50 6 70 12 L72 30Z" fill="#1f1f1f" /><path d="M28 28 H72" stroke="#c98700" strokeWidth="2.5" /></>,
    <><path d="M22 46 Q22 10 50 10 Q78 10 78 46" stroke={ink} strokeWidth="5" fill="none" /><rect x="16" y="40" width="10" height="18" rx="4" fill="#ff5fa2" /><rect x="74" y="40" width="10" height="18" rx="4" fill="#ff5fa2" /></>,
    <path d="M24 34 Q50 10 76 34" stroke="#ff5fa2" strokeWidth="6" fill="none" />,
    <><path d="M64 20 L50 11 L50 29Z M64 20 L78 11 L78 29Z" fill="#ff5fa2" /><circle cx="64" cy="20" r="4" fill="#ff8fc0" /></>,
    <path d="M68 22 l2.5 6 6.5 .5 -5 4.2 1.7 6.3 -5.7 -3.5 -5.7 3.5 1.7 -6.3 -5 -4.2 6.5 -.5Z" fill="#ffd23f" stroke="#c98700" strokeWidth="1" />,
    <><path d="M34 72 Q50 84 66 72 L66 80 Q50 92 34 80Z" fill="#ff6b6b" /><path d="M58 82 L62 98 L68 96 L64 80Z" fill="#ff6b6b" /></>,
    <path d="M32 22 L36 6 L44 16 L50 4 L56 16 L64 6 L68 22Z" fill="#ffd23f" stroke="#c98700" strokeWidth="2" />,
  ];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Profil karakter" className="inline-block overflow-visible">
      {o === 8 && <path d="M18 100 L26 68 L74 68 L82 100Z" fill="#ff5fa2" />}
      {!hj && back[h]}
      <path d="M12 100 Q12 74 50 74 Q88 74 88 100Z" fill={o === 6 || o === 9 ? "#fff" : oc} />
      {decor[o]}
      <rect x="43" y="64" width="14" height="14" fill={sk} />
      {l.face === 0 ? <circle cx="50" cy="46" r="26" fill={sk} /> : l.face === 1 ? <ellipse cx="50" cy="47" rx="22" ry="28" fill={sk} /> : <rect x="25" y="20" width="50" height="52" rx="14" fill={sk} />}
      {hj > 0
        ? <><path fillRule="evenodd" d={HIJAB[hj] + HOLE} fill={hc} /><path d={HOLE} fill="none" stroke="#0002" strokeWidth="2.5" /></>
        : <path d={FRONT[h]} fill={hc} />}
      {moods[l.mood]}
      {l.acc.map((a) => <g key={a}>{accs[a]}</g>)}
    </svg>
  );
}
