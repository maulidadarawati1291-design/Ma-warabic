import { GAMES, MISI, themes, type Look } from "./data";
import { loadProg, points, type Prog } from "./util";

export type Siswa = { id: string; nama: string; absen: string; avatar?: Look; prog: Prog };
export const SC = ["kuis", "cocok", "huruf", "balon", "misi"]; // game yang dinilai (kalimat dan kamus hanya penanda selesai)
const P2 = "mawarabic:v2:";

export const gameName = (slug: string, id: string) => (id === "misi" ? MISI[slug].n : GAMES.find((g) => g.id === id)?.n ?? id);

// Semua siswa yang pernah masuk di perangkat ini.
export function allSiswa(): Siswa[] {
  const out: Siswa[] = [];
  try {
    const reg = JSON.parse(localStorage.getItem("mawarabic:siswa") || "{}") as Record<string, { nama: string; absen: string; avatar?: Look }>;
    const ids = new Set<string>(Object.keys(reg));
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(P2)) ids.add(k.slice(P2.length)); }
    ids.forEach((id) => {
      if (id === "tamu") return;
      const r = reg[id], cut = id.indexOf("-");
      out.push({ id, nama: r?.nama ?? id.slice(cut + 1), absen: r?.absen ?? id.slice(0, cut), avatar: r?.avatar, prog: loadProg(id) });
    });
  } catch {}
  return out;
}

export function statOf(prog: Prog) {
  let gamesDone = 0, themesDone = 0, salah = 0, last = 0, sum = 0, n = 0;
  const kata: Record<string, number> = {};
  const perTheme: Record<string, number | null> = {};
  themes.forEach((t) => {
    const g = prog[t.slug] ?? {};
    const done = GAMES.filter((x) => !!g[x.id]).length;
    gamesDone += done;
    if (done === GAMES.length) themesDone++;
    let s = 0, c = 0;
    SC.forEach((id) => { const r = g[id]; if (r && r.total) { s += (r.score / r.total) * 100; c++; } });
    perTheme[t.slug] = c ? s / c : null;
    sum += s; n += c;
    Object.values(g).forEach((r) => { salah += r.salah ?? 0; last = Math.max(last, r.at ?? 0); (r.kata ?? []).forEach((k) => { kata[k] = (kata[k] ?? 0) + 1; }); });
  });
  return { poin: points(prog), gamesDone, themesDone, salah, last, avg: n ? sum / n : null, perTheme, kata };
}

export const topKata = (k: Record<string, number>, n = 10) => Object.entries(k).sort((a, b) => b[1] - a[1]).slice(0, n);

export function badges(s: ReturnType<typeof statOf>): string[] {
  const b: (string | false)[] = [s.themesDone >= 1 && "🧭 Penjelajah Kosakata", s.themesDone >= 3 && "📖 Pembaca Cilik", s.themesDone >= 6 && "🏅 Jagoan Arab", s.themesDone >= 9 && "🏆 Bintang Maharah", s.poin >= 500 && "⭐ Kolektor Bintang", s.gamesDone >= 5 && (s.avg ?? 0) >= 90 && "🎯 Teliti"];
  return b.filter((x): x is string => !!x);
}

export const exportJSON = (list: Siswa[]) => JSON.stringify({ v: 1, siswa: list }, null, 1);

// Gabungkan data dari perangkat lain (hasil unduhan siswa atau guru). Data yang lebih baru menang.
export function importJSON(txt: string): number {
  const d = JSON.parse(txt) as { v?: number; siswa?: Siswa[] };
  if (!d || !Array.isArray(d.siswa)) throw new Error("Format berkas tidak dikenali");
  const reg = JSON.parse(localStorage.getItem("mawarabic:siswa") || "{}");
  let n = 0;
  d.siswa.forEach((s) => {
    if (typeof s.id !== "string" || s.id === "tamu" || typeof s.prog !== "object" || !s.prog) return;
    const merged: Prog = { ...loadProg(s.id) };
    Object.entries(s.prog).forEach(([slug, g]) => {
      merged[slug] = { ...(merged[slug] ?? {}) };
      Object.entries(g).forEach(([gid, r]) => { const o = merged[slug][gid]; if (!o || (r.at ?? 0) > (o.at ?? 0)) merged[slug][gid] = r; });
    });
    localStorage.setItem(P2 + s.id, JSON.stringify(merged));
    reg[s.id] = { nama: s.nama, absen: s.absen, avatar: s.avatar };
    n++;
  });
  localStorage.setItem("mawarabic:siswa", JSON.stringify(reg));
  return n;
}

export function unduh(nama: string, isi: string, tipe: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([isi], { type: tipe }));
  a.download = nama;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const csv = (rows: (string | number)[][]) => "\ufeff" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
export const tgl = (at?: number) => (at ? new Date(at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "-");
export const pct = (v: number | null) => (v === null ? "-" : `${Math.round(v)}%`);
