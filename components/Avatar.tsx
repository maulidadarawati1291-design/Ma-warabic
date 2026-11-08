import { HAIRC, PARTS, SKINS, type Look } from "@/lib/data";

const ink = "#2b2350";

export default function Avatar({ look: l, size = 80 }: { look: Look; size?: number }) {
  const sk = SKINS[l.skin], hc = HAIRC[l.hc], oc = PARTS.outfit[l.outfit].c;
  const eye = (x: number, r = 3) => <circle cx={x} cy={47} r={r} fill={ink} />;
  const mouth = (d: string) => <path d={d} stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />;
  const cheeks = <><circle cx="33" cy="57" r="4" fill="#ff8fa3" opacity=".55" /><circle cx="67" cy="57" r="4" fill="#ff8fa3" opacity=".55" /></>;
  const moods = [
    <>{eye(40)}{eye(60)}{mouth("M40 58 Q50 68 60 58")}{cheeks}</>,
    <>{eye(40, 5)}{eye(60, 5)}<circle cx="42" cy="45" r="1.8" fill="#fff" /><circle cx="62" cy="45" r="1.8" fill="#fff" /><path d="M38 57 Q50 75 62 57Z" fill="#c0392b" />{cheeks}</>,
    <><rect x="29" y="42" width="19" height="10" rx="4" fill={ink} /><rect x="52" y="42" width="19" height="10" rx="4" fill={ink} />{mouth("M38 62 Q52 68 62 58")}</>,
    <>{eye(40)}{mouth("M55 47 h10")}{mouth("M40 58 Q50 66 60 58")}<path d="M47 62 Q51 74 56 62Z" fill="#ff5fa2" />{cheeks}</>,
  ];
  const accs = [
    null,
    <g fill="none" stroke={ink} strokeWidth="3"><circle cx="40" cy="47" r="8" /><circle cx="60" cy="47" r="8" /><path d="M48 47h4" /></g>,
    <><path d="M22 32 Q50 2 78 32Z" fill="#ff6b6b" /><rect x="18" y="30" width="46" height="6" rx="3" fill="#ff6b6b" /></>,
    <><path d="M22 46 Q22 10 50 10 Q78 10 78 46" stroke={ink} strokeWidth="5" fill="none" /><rect x="16" y="40" width="10" height="18" rx="4" fill="#ff5fa2" /><rect x="74" y="40" width="10" height="18" rx="4" fill="#ff5fa2" /></>,
    <path d="M24 34 Q50 10 76 34" stroke="#ff5fa2" strokeWidth="6" fill="none" />,
    <path d="M32 22 L36 6 L44 16 L50 4 L56 16 L64 6 L68 22Z" fill="#ffd23f" stroke="#c98700" strokeWidth="2" />,
  ];
  const short = <path d="M24 44 Q22 16 50 16 Q78 16 76 44 Q66 30 50 30 Q34 30 24 44Z" fill={hc} />;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Profil karakter" className="inline-block overflow-visible">
      {l.outfit === 3 && <path d="M18 100 L26 68 L74 68 L82 100Z" fill="#ff5fa2" />}
      {l.hair === 3 && <path d="M22 48 Q22 12 50 12 Q78 12 78 48 L82 84 L18 84Z" fill={hc} />}
      {l.hair === 4 && <path d="M16 56 Q14 8 50 8 Q86 8 84 56 Q84 90 50 96 Q16 90 16 56Z" fill={hc} />}
      <path d="M12 100 Q12 74 50 74 Q88 74 88 100Z" fill={oc} />
      {l.outfit === 1 && <path d="M32 77 Q50 92 68 77" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />}
      {l.outfit === 2 && <text x="50" y="97" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">10</text>}
      {l.outfit === 3 && <circle cx="50" cy="90" r="6" fill="#ffd23f" />}
      {l.outfit === 4 && <ellipse cx="50" cy="77" rx="22" ry="6" fill="none" stroke="#9aa5b1" strokeWidth="4" />}
      <rect x="43" y="64" width="14" height="14" fill={sk} />
      {l.face === 0 ? <circle cx="50" cy="46" r="26" fill={sk} /> : l.face === 1 ? <ellipse cx="50" cy="47" rx="22" ry="28" fill={sk} /> : <rect x="25" y="20" width="50" height="52" rx="14" fill={sk} />}
      {l.hair === 1 ? <path d="M24 42 L28 14 L38 28 L46 10 L54 28 L64 12 L70 28 L78 16 L76 42 Q50 28 24 42Z" fill={hc} />
        : l.hair === 4 ? <path d="M24 36 Q50 12 76 36 Q50 26 24 36Z" fill={hc} /> : short}
      {l.hair === 2 && <circle cx="50" cy="12" r="9" fill={hc} />}
      {moods[l.mood]}
      {accs[l.acc]}
    </svg>
  );
}
