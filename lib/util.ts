export type Result = { score: number; total: number; wrong: string[] };
export type Progress = Record<string, Result>;
const KEY = "mawaarabic:v1";

// Suara memakai Web Speech API peramban. Untuk audio rekaman guru, ganti dengan file di /public/audio.
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export function loadProgress(): Progress {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function saveResult(slug: string, r: Result) {
  const p = loadProgress();
  if (!p[slug] || r.score >= p[slug].score) p[slug] = r;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export const stars = (r: Result) => { const x = r.score / r.total; return x >= 0.8 ? 3 : x >= 0.6 ? 2 : 1; };
export const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
