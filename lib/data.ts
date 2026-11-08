export type Word = { ar: string; id: string; e: string; g: "m" | "f" | "" };
export type Sent = { ar: string; id: string };
export type Theme = { slug: string; ar: string; id: string; e: string; c: string; bg: string; words: Word[]; ex: Sent[] };

// Satu baris = "Arab|Indonesia|emoji ilustrasi". Tambah baris untuk menambah kosakata (target 50 per tema).
// Jenis kata: m = mudzakkar, f = muannats, "" = bukan kata benda. Kata benda berakhiran ة = muannats, kecuali daftar FEM di bawah.
const FEM = ["عَيْنٌ", "أُذُنٌ", "يَدٌ", "رِجْلٌ", "سِنٌّ", "شَمْسٌ", "سَمَاءٌ", "قَدَمٌ"];
const NOG = ["صَبَاحًا", "ظُهْرًا", "مَسَاءً", "غَدًا", "أَصْدِقَاءُ", "إِصْبَعٌ"];
const gen = (ar: string): Word["g"] => (NOG.includes(ar) || !/[ٌٍ]/.test(ar) ? "" : FEM.includes(ar) || /ةٌ$/.test(ar) ? "f" : "m");
const W = (s: string): Word[] => s.trim().split("\n").map((l) => { const [ar, id, e] = l.trim().split("|"); return { ar, id, e, g: gen(ar) }; });
const S = (ar: string, id: string): Sent => ({ ar, id });

// Urutan tema mengikuti ruang lingkup CP Fase C.
export const themes: Theme[] = [
  { slug: "anggota-tubuh", ar: "أَعْضَاءُ الْجِسْمِ", id: "Anggota Tubuh", e: "🧑", c: "#ff6b6b", bg: "#ffe3e3",
    words: W(`
رَأْسٌ|Kepala|🧑
عَيْنٌ|Mata|👁️
أَنْفٌ|Hidung|👃
أُذُنٌ|Telinga|👂
فَمٌ|Mulut|👄
سِنٌّ|Gigi|🦷
يَدٌ|Tangan|✋
رِجْلٌ|Kaki|🦶
لِسَانٌ|Lidah|👅
قَلْبٌ|Jantung|❤️
إِصْبَعٌ|Jari|👆
عَضَلَةٌ|Otot|💪
وَجْهٌ|Wajah|🙂
شَعْرٌ|Rambut|🦱
رُكْبَةٌ|Lutut|🦵
قَدَمٌ|Telapak kaki|👣
دَمٌ|Darah|🩸
عَظْمٌ|Tulang|🦴`),
    ex: [S("هَذَا رَأْسٌ", "Ini kepala."), S("هَذِهِ يَدٌ", "Ini tangan.")] },
  { slug: "kebun-binatang", ar: "فِي حَدِيقَةِ الْحَيَوَانَاتِ", id: "Kebun Binatang", e: "🦁", c: "#ff9f1c", bg: "#fff0d1",
    words: W(`
أَسَدٌ|Singa|🦁
فِيلٌ|Gajah|🐘
قِرْدٌ|Monyet|🐒
زَرَافَةٌ|Jerapah|🦒
طَائِرٌ|Burung|🐦
نَمِرٌ|Harimau|🐯
دُبٌّ|Beruang|🐻
تِمْسَاحٌ|Buaya|🐊
ثُعْبَانٌ|Ular|🐍
سُلَحْفَاةٌ|Kura-kura|🐢
بَطْرِيقٌ|Penguin|🐧
جَمَلٌ|Unta|🐪
ذِئْبٌ|Serigala|🐺
أَرْنَبٌ|Kelinci|🐰
ضِفْدَعٌ|Katak|🐸
نَحْلَةٌ|Lebah|🐝
حِصَانٌ|Kuda|🐴
بَقَرَةٌ|Sapi|🐄`),
    ex: [S("هَذَا أَسَدٌ", "Ini singa."), S("أُحِبُّ الْفِيلَ", "Saya suka gajah.")] },
  { slug: "ruang-tamu-belajar", ar: "فِي غُرْفَةِ الْجُلُوسِ وَغُرْفَةِ الدِّرَاسَةِ", id: "Ruang Tamu dan Ruang Belajar", e: "🛋️", c: "#a78bfa", bg: "#ece6ff",
    words: W(`
كُرْسِيٌّ|Kursi|🪑
طَاوِلَةٌ|Meja|🗄️
كِتَابٌ|Buku|📖
مِصْبَاحٌ|Lampu|💡
قَلَمٌ|Pena|🖊️
بَابٌ|Pintu|🚪
نَافِذَةٌ|Jendela|🪟
سَرِيرٌ|Tempat tidur|🛏️
تِلْفَازٌ|Televisi|📺
حَاسُوبٌ|Komputer|💻
هَاتِفٌ|Telepon|📱
مِفْتَاحٌ|Kunci|🔑
حَقِيبَةٌ|Tas|🎒
مِسْطَرَةٌ|Penggaris|📏
مِقَصٌّ|Gunting|✂️
مِرْآةٌ|Cermin|🪞
مِكْنَسَةٌ|Sapu|🧹
ثَلَّاجَةٌ|Kulkas|🧊`),
    ex: [S("هَذَا كُرْسِيٌّ", "Ini kursi."), S("الْكِتَابُ عَلَى الطَّاوِلَةِ", "Buku di atas meja.")] },
  { slug: "perpustakaan", ar: "فِي الْمَكْتَبَةِ", id: "Perpustakaan", e: "📚", c: "#2ec4b6", bg: "#d9f6f2",
    words: W(`
مَكْتَبَةٌ|Perpustakaan|📚
كِتَابٌ|Buku|📖
قِصَّةٌ|Cerita|📜
رَفٌّ|Rak|🗄️
مَجَلَّةٌ|Majalah|📰
دَفْتَرٌ|Buku tulis|📓
قَامُوسٌ|Kamus|📕
مُعَلِّمٌ|Guru|🧑‍🏫
طَالِبٌ|Siswa|🧑‍🎓
هُدُوءٌ|Tenang|🤫
خَرِيطَةٌ|Peta|🗺️
نَظَّارَةٌ|Kacamata|👓
مُعَلِّمَةٌ|Guru perempuan|👩‍🏫
طَالِبَةٌ|Siswi|👩‍🎓
صَفْحَةٌ|Halaman|📄
عُنْوَانٌ|Judul|🏷️
جَرِيدَةٌ|Koran|🗞️
حَرْفٌ|Huruf|🔤`),
    ex: [S("أَيْنَ الْكِتَابُ؟", "Di mana buku itu?"), S("هَذَا كِتَابٌ جَدِيدٌ", "Ini buku baru.")] },
  { slug: "kantin", ar: "فِي الْمَقْصَفِ", id: "Kantin", e: "🍎", c: "#ff5fa2", bg: "#ffe0ee",
    words: W(`
مَاءٌ|Air|💧
خُبْزٌ|Roti|🍞
أَرُزٌّ|Nasi|🍚
حَلِيبٌ|Susu|🥛
تُفَّاحٌ|Apel|🍎
مَوْزٌ|Pisang|🍌
بَيْضٌ|Telur|🥚
سَمَكٌ|Ikan|🐟
دَجَاجٌ|Ayam|🍗
عَصِيرٌ|Jus|🧃
بُرْتُقَالٌ|Jeruk|🍊
جُبْنٌ|Keju|🧀
شَايٌ|Teh|🍵
عِنَبٌ|Anggur|🍇
فَرَاوِلَةٌ|Stroberi|🍓
بَطِّيخٌ|Semangka|🍉
مَلْعَقَةٌ|Sendok|🥄
جَزَرٌ|Wortel|🥕`),
    ex: [S("أُرِيدُ مَاءً", "Saya ingin air."), S("هَذَا خُبْزٌ", "Ini roti.")] },
  { slug: "jam-waktu", ar: "السَّاعَةُ وَالْوَقْتُ", id: "Jam dan Waktu", e: "🕒", c: "#5aa0ff", bg: "#dbe8ff",
    words: W(`
سَاعَةٌ|Jam|🕒
صَبَاحًا|Pagi|🌅
ظُهْرًا|Siang|☀️
مَسَاءً|Sore/malam|🌇
لَيْلٌ|Malam|🌙
يَوْمٌ|Hari|📅
أُسْبُوعٌ|Minggu (sepekan)|🗓️
شَهْرٌ|Bulan (kalender)|📆
سَنَةٌ|Tahun|🎉
دَقِيقَةٌ|Menit|⏱️
مُنَبِّهٌ|Weker|⏰
غَدًا|Besok|🔜
أَمْسِ|Kemarin|⏪
الْآنَ|Sekarang|▶️
شِتَاءٌ|Musim dingin|❄️
صَيْفٌ|Musim panas|🌞
خَرِيفٌ|Musim gugur|🍂
رَبِيعٌ|Musim semi|🌷`),
    ex: [S("كَمِ السَّاعَةُ؟", "Jam berapa?"), S("السَّاعَةُ السَّابِعَةُ", "Jam tujuh.")] },
  { slug: "saya-suka-bahasa-arab", ar: "أَنَا أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ", id: "Saya Suka Bahasa Arab", e: "💚", c: "#2fbf71", bg: "#d9f7e6",
    words: W(`
أُحِبُّ|Saya suka|💚
أَقْرَأُ|Saya membaca|📖
أَكْتُبُ|Saya menulis|✍️
أَتَكَلَّمُ|Saya berbicara|🗣️
أَسْمَعُ|Saya mendengar|👂
أَرْسُمُ|Saya menggambar|🎨
أَجْرِي|Saya berlari|🏃
آكُلُ|Saya makan|🍽️
أَشْرَبُ|Saya minum|🥤
أَنَامُ|Saya tidur|😴
أَدْرُسُ|Saya belajar|🎒
أُصَلِّي|Saya salat|🕌
أَفْتَحُ|Saya membuka|🔓
أُغْلِقُ|Saya menutup|🔒
أَرْكَبُ|Saya mengendarai|🚲
أَفْهَمُ|Saya mengerti|💡
أُسَاعِدُ|Saya membantu|🤝
أَغْسِلُ|Saya mencuci|🧼`),
    ex: [S("أَنَا أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ", "Saya suka bahasa Arab."), S("أُحِبُّ الْقِرَاءَةَ", "Saya suka membaca.")] },
  { slug: "kegiatan-liburan", ar: "أَنْشِطَةُ الْعُطْلَةِ", id: "Kegiatan Liburan", e: "🏖️", c: "#00b4d8", bg: "#d4f3fb",
    words: W(`
عُطْلَةٌ|Liburan|🏖️
أَلْعَبُ|Saya bermain|⚽
أَزُورُ|Saya mengunjungi|🏠
أَسْبَحُ|Saya berenang|🏊
أُسَافِرُ|Saya bepergian|✈️
بَحْرٌ|Laut|🌊
شَاطِئٌ|Pantai|🏝️
جَبَلٌ|Gunung|⛰️
قِطَارٌ|Kereta|🚆
سَيَّارَةٌ|Mobil|🚗
صُورَةٌ|Foto|📷
فُنْدُقٌ|Hotel|🏨
خَيْمَةٌ|Tenda|⛺
تَذْكِرَةٌ|Tiket|🎫
طَائِرَةٌ|Pesawat|🛩️
دَرَّاجَةٌ|Sepeda|🚲
سَفِينَةٌ|Kapal|🚢
قَلْعَةٌ|Benteng|🏰`),
    ex: [S("أَذْهَبُ إِلَى الْحَدِيقَةِ", "Saya pergi ke taman."), S("أَلْعَبُ مَعَ أَصْدِقَائِي", "Saya bermain dengan teman-temanku.")] },
  { slug: "piknik", ar: "النُّزْهَةُ", id: "Piknik", e: "🧺", c: "#f4b400", bg: "#fff4c7",
    words: W(`
نُزْهَةٌ|Piknik|🏕️
حَدِيقَةٌ|Taman|🌳
طَعَامٌ|Makanan|🍱
مَاءٌ|Air|💧
أَصْدِقَاءُ|Teman-teman|🧑‍🤝‍🧑
شَمْسٌ|Matahari|☀️
شَجَرَةٌ|Pohon|🌲
زَهْرَةٌ|Bunga|🌸
كُرَةٌ|Bola|⚽
فَرَاشَةٌ|Kupu-kupu|🦋
سَلَّةٌ|Keranjang|🧺
نَهْرٌ|Sungai|🏞️
غَيْمَةٌ|Awan|☁️
مَطَرٌ|Hujan|🌧️
نَجْمَةٌ|Bintang|⭐
عُشْبٌ|Rumput|🌿
سَمَاءٌ|Langit|🌤️
وَرْدَةٌ|Mawar|🌹`),
    ex: [S("هَذَا طَعَامٌ", "Ini makanan."), S("مَعِيَ مَاءٌ", "Saya membawa air.")] },
];

export const GAMES = [
  { id: "kamus", n: "Kamus Bergambar", e: "📖" },
  { id: "kuis", n: "Kuis Pintar", e: "🎮" },
  { id: "cocok", n: "Cocokkan Kartu", e: "🃏" },
  { id: "balon", n: "Pecah Balon", e: "🎈" },
];

// Kata tunjuk dan sifat harus sesuai jenis kata benda: هَذَا + mudzakkar, هَذِهِ + muannats; sifat muannats berakhiran ة.
export const dem = (w: Word) => (w.g === "f" ? "هَذِهِ" : "هَذَا");
export const ADJ = [["كَبِيرٌ", "كَبِيرَةٌ", "besar"], ["جَمِيلٌ", "جَمِيلَةٌ", "indah"], ["جَدِيدٌ", "جَدِيدَةٌ", "baru"], ["صَغِيرٌ", "صَغِيرَةٌ", "kecil"]];
export function sentOf(w: Word, adj = false): Sent {
  const a = ADJ[Math.floor(Math.random() * ADJ.length)];
  const id = w.id.toLowerCase();
  return adj ? { ar: `${dem(w)} ${w.ar} ${w.g === "f" ? a[1] : a[0]}`, id: `Ini ${id} ${a[2]}.` } : { ar: `${dem(w)} ${w.ar}`, id: `Ini ${id}.` };
}

// Profil karakter: min = poin yang dibutuhkan untuk membuka bagian tersebut.
export type Look = { skin: number; face: number; hair: number; hc: number; mood: number; outfit: number; acc: number };
export const DEFAULT_LOOK: Look = { skin: 0, face: 0, hair: 0, hc: 0, mood: 0, outfit: 0, acc: 0 };
export const SKINS = ["#ffdbb4", "#f1c27d", "#c68642", "#8d5524"];
export const HAIRC = ["#2b2350", "#6b3e26", "#e9b44c", "#ff5fa2", "#3a86ff"];
export const PARTS = {
  face: [{ n: "Bulat", min: 0 }, { n: "Oval", min: 0 }, { n: "Kotak", min: 150 }],
  hair: [{ n: "Pendek", min: 0 }, { n: "Jabrik", min: 0 }, { n: "Kuncir", min: 100 }, { n: "Panjang", min: 100 }, { n: "Hijab", min: 0 }],
  mood: [{ n: "Senang", min: 0 }, { n: "Semangat", min: 0 }, { n: "Keren", min: 200 }, { n: "Jahil", min: 300 }],
  outfit: [{ n: "Kaos", c: "#5aa0ff", min: 0 }, { n: "Hoodie", c: "#ff6b6b", min: 0 }, { n: "Jersey", c: "#2fbf71", min: 150 }, { n: "Pahlawan", c: "#a78bfa", min: 400 }, { n: "Astronot", c: "#f4f4f4", min: 700 }],
  acc: [{ n: "Tanpa", min: 0 }, { n: "Kacamata", min: 0 }, { n: "Topi", min: 100 }, { n: "Headphone", min: 250 }, { n: "Bando", min: 50 }, { n: "Mahkota", min: 600 }],
};
