import type { Look } from "./data";
export type Res = { score: number; total: number };
export type Prog = Record<string, Record<string, Res>>; // tema -> game -> hasil terbaik
export type Profil = { nama: string; absen: string; avatar: Look };
const PK = "mawarabic:profil";

// Suara: pilih suara Arab sesuai jenis karakter (perempuan/laki-laki). Jika perangkat hanya punya satu suara, nada diubah.
const FEMV = /hoda|zariyah|salma|laila|layla|fatima|amina|maryam|hala|noura|zira|female/i;
const MALV = /naayf|hamed|shakir|tarik|maged|omar|\bmale\b/i;
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const female = getProfil()?.avatar.sex === 1;
  const u = new SpeechSynthesisUtterance(text);
  const vs = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("ar"));
  u.voice = vs.find((v) => (female ? FEMV : MALV).test(v.name)) ?? vs.find((v) => !(female ? MALV : FEMV).test(v.name)) ?? vs[0] ?? null;
  u.lang = "ar-SA";
  u.rate = 0.8;
  u.pitch = female ? 1.3 : 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// Efek suara dibuat dengan WebAudio (tanpa file mp3).
let ctx: AudioContext | null = null;
const ac = () => {
  if (typeof window === "undefined") return null;
  const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return (ctx = ctx ?? (C ? new C() : null));
};
function tone(f: number, t0: number, d: number, type: OscillatorType, v: number) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d);
}
function applause() {
  const c = ac(); if (!c) return;
  const n = Math.floor(c.sampleRate * 0.9), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < 0.015 ? 1 : 0.12) * (1 - i / n);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = b; f.type = "bandpass"; f.frequency.value = 2200; g.gain.value = 0.5;
  s.connect(f); f.connect(g); g.connect(c.destination); s.start(c.currentTime + 0.1);
}
// Benar: sorak, tepuk tangan, semprotan konfeti, dan ucapan "صَحِيحٌ". Salah: bunyi "tet-tot" dan emoji sedih.
export function reaksi(ok: boolean) {
  if (ok) { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, "triangle", 0.2)); applause(); }
  else { tone(200, 0, 0.18, "square", 0.15); tone(150, 0.22, 0.3, "square", 0.15); }
  window.dispatchEvent(new CustomEvent("mw-reaksi", { detail: ok }));
  if (ok) setTimeout(() => speak(`صَحِيحٌ! ${getProfil()?.avatar.sex === 1 ? "أَحْسَنْتِ" : "أَحْسَنْتَ"}`), 450);
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
export const finished = (r?: Res) => !!r; // game dianggap selesai setelah dimainkan sampai akhir, tidak harus sempurna
export const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// Anti-curang: tema yang belum selesai seluruhnya diulang dari awal saat siswa keluar atau masuk kembali.
export function resetIncomplete(slug: string, games: number) {
  const p = loadProg();
  if (p[slug] && Object.values(p[slug]).filter(finished).length < games) {
    delete p[slug];
    try { localStorage.setItem("mawarabic:v2:" + cur(), JSON.stringify(p)); } catch {}
  }
}
