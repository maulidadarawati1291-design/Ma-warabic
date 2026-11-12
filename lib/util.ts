import type { Look } from "./data";
export type Res = { score: number; total: number };
export type Prog = Record<string, Record<string, Res>>; // tema -> game -> hasil terbaik
export type Profil = { nama: string; absen: string; avatar: Look };
const PK = "mawarabic:profil";

// Suara memakai Web Speech API peramban. Untuk audio rekaman guru, ganti dengan file di /public/audio.
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export const idOf = (nama: string, absen: string) => `${absen.trim()}-${nama.trim().toLowerCase()}`;
export function getProfil(): Profil | null {
  try { const p = JSON.parse(localStorage.getItem(PK) || "null"); return p && typeof p.avatar?.sex === "number" && Array.isArray(p.avatar.acc) ? p : null; } catch { return null; }
}
export function setProfil(p: Profil) {
  try { localStorage.setItem(PK, JSON.stringify(p)); } catch {}
}
const cur = () => { const p = getProfil(); return p ? idOf(p.nama, p.absen) : "tamu"; };

// Progres disimpan per siswa (nama + nomor absen), jadi satu perangkat bisa dipakai bergantian.
export function loadProg(id = cur()): Prog {
  try { return JSON.parse(localStorage.getItem("mawarabic:v2:" + id) || "{}"); } catch { return {}; }
}
export function saveRes(slug: string, game: string, r: Res) {
  const p = loadProg();
  const o = p[slug]?.[game];
  if (!o || r.score >= o.score) p[slug] = { ...p[slug], [game]: r };
  try { localStorage.setItem("mawarabic:v2:" + cur(), JSON.stringify(p)); } catch {}
}
export const points = (p: Prog) => Object.values(p).flatMap((g) => Object.values(g)).reduce((a, r) => a + r.score * 10, 0);
export const perfect = (r?: Res) => !!r && r.score >= r.total;
export const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// Anti-curang: tema yang belum selesai seluruhnya diulang dari awal saat siswa keluar atau masuk kembali.
export function resetIncomplete(slug: string, games: number) {
  const p = loadProg();
  if (p[slug] && Object.values(p[slug]).filter(perfect).length < games) {
    delete p[slug];
    try { localStorage.setItem("mawarabic:v2:" + cur(), JSON.stringify(p)); } catch {}
  }
}
