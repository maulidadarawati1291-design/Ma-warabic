const stars = [[40, 30], [110, 60], [190, 25], [260, 70], [340, 35], [420, 22], [470, 66], [560, 100], [30, 100], [150, 112], [400, 104], [590, 30]];
const lamps = [[70, "#ffd23f", 0], [150, "#ff6b6b", 0.5], [450, "#5aa0ff", 0.2]] as const;

// Latar header: pemandangan senja dengan bulan sabit, masjid, bukit, dan lampion bergoyang.
export default function Hero() {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="hsk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b3fc4" /><stop offset=".5" stopColor="#c96bd8" /><stop offset=".8" stopColor="#ff8fa3" /><stop offset="1" stopColor="#ffc46b" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#hsk)" />
      {stars.map(([x, y], i) => <circle key={i} className="twinkle" style={{ animationDelay: `${i * 0.3}s` }} cx={x} cy={y} r="2.2" fill="#fff" />)}
      <path d="M520 40 a28 28 0 1 0 22 46 a22 22 0 1 1 -22 -46Z" fill="#ffe9a8" />
      <circle className="sun" cx="300" cy="252" r="62" fill="#ffe27a" opacity=".95" />
      <g className="drift" fill="#ffd6e8" opacity=".9"><ellipse cx="110" cy="150" rx="50" ry="14" /><ellipse cx="150" cy="160" rx="40" ry="12" /></g>
      <g className="drift" fill="#ffd6e8" opacity=".8"><ellipse cx="430" cy="130" rx="46" ry="13" /></g>
      <path d="M-20 255 Q120 205 240 250 T480 240 T640 245 V330 H-20Z" fill="#7a4fb8" />
      <g fill="#5b3a99">
        <path d="M255 242 Q255 202 280 202 Q305 202 305 242Z" /><rect x="236" y="198" width="9" height="46" /><rect x="315" y="198" width="9" height="46" />
        <path d="M236 198 L240.5 186 L245 198Z" /><path d="M315 198 L319.5 186 L324 198Z" /><circle cx="280" cy="198" r="3" />
      </g>
      <path d="M-20 292 Q150 247 300 287 T640 277 V330 H-20Z" fill="#3b2a7a" />
      {lamps.map(([x, c, d]) => (
        <g key={x} className="sway" style={{ animationDelay: `${d}s` }}>
          <line x1={x} y1="0" x2={x} y2="40" stroke="#ffd6e8" strokeWidth="2" />
          <rect x={x - 6} y="36" width="12" height="6" fill="#c98700" />
          <rect x={x - 11} y="42" width="22" height="30" rx="8" fill={c} />
          <circle cx={x} cy="57" r="5" fill="#fff" opacity=".75" />
        </g>
      ))}
    </svg>
  );
}
