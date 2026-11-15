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
  { id: "kalimat", n: "Kosakata dalam Kalimat", e: "💬" },
  { id: "kamus", n: "Kamus Bergambar", e: "📖" },
  { id: "kuis", n: "Kuis Pintar", e: "🎮" },
  { id: "cocok", n: "Cocokkan Kartu", e: "🃏" },
  { id: "huruf", n: "Susun Huruf", e: "✍️" },
  { id: "balon", n: "Pecah Balon", e: "🎈" },
  { id: "misi", n: "Misi Tema", e: "🚀" },
];

// Kata tunjuk dan sifat harus sesuai jenis kata benda: هَذَا + mudzakkar, هَذِهِ + muannats; sifat muannats berakhiran ة.
export const dem = (w: Word) => (w.g === "f" ? "هَذِهِ" : "هَذَا");
export const ADJ = [["كَبِيرٌ", "كَبِيرَةٌ", "besar"], ["جَمِيلٌ", "جَمِيلَةٌ", "indah"], ["جَدِيدٌ", "جَدِيدَةٌ", "baru"], ["صَغِيرٌ", "صَغِيرَةٌ", "kecil"]];
export function sentOf(w: Word, adj = false, k?: number): Sent {
  const a = ADJ[k !== undefined ? k % ADJ.length : Math.floor(Math.random() * ADJ.length)];
  const id = w.id.toLowerCase();
  return adj ? { ar: `${dem(w)} ${w.ar} ${w.g === "f" ? a[1] : a[0]}`, id: `Ini ${id} ${a[2]}.` } : { ar: `${dem(w)} ${w.ar}`, id: `Ini ${id}.` };
}

// Profil karakter. min = poin yang dibutuhkan; f = khusus "b" (laki-laki) atau "g" (perempuan).
export type Look = { sex: number; skin: number; face: number; hair: number; hijab: number; hc: number; mood: number; outfit: number; oc: number; acc: number[] };
export const DEFAULT_LOOK: Look = { sex: 0, skin: 0, face: 0, hair: 0, hijab: 0, hc: 0, mood: 0, outfit: 0, oc: 0, acc: [] };
export const SKINS = ["#ffe0c2", "#f6c99b", "#e0a070", "#b97a4a", "#8d5524"];
export const HAIRC = ["#2b2350", "#6b3e26", "#e9b44c", "#ff5fa2", "#3a86ff", "#8e6bff", "#2fbf71", "#f4f4f4"];
export const OUTC = ["#5aa0ff", "#ff6b6b", "#2fbf71", "#a78bfa", "#ffb830", "#ff5fa2", "#2ec4b6", "#2b2350", "#f4f4f4"];
export type Opt = { n: string; min: number; f?: "b" | "g" };
export const FACES: Opt[] = [{ n: "Bulat", min: 0 }, { n: "Oval", min: 0 }, { n: "Kotak", min: 150 }];
export const HAIRS: Opt[] = [
  { n: "Rapi", min: 0, f: "b" }, { n: "Jabrik", min: 0, f: "b" }, { n: "Belah Samping", min: 80, f: "b" }, { n: "Cepak", min: 0, f: "b" }, { n: "Keriting", min: 120, f: "b" },
  { n: "Panjang", min: 0, f: "g" }, { n: "Kuncir Kuda", min: 0, f: "g" }, { n: "Kepang Dua", min: 80, f: "g" }, { n: "Bob", min: 0, f: "g" }, { n: "Cepol", min: 120, f: "g" }, { n: "Ikal", min: 200, f: "g" },
];
export const HIJABS: Opt[] = [{ n: "Tanpa Hijab", min: 0 }, { n: "Pashmina", min: 0 }, { n: "Segi Empat", min: 0 }, { n: "Instan", min: 0 }, { n: "Syar'i", min: 100 }];
export const OUTFITS: Opt[] = [
  { n: "Kaos", min: 0 }, { n: "Hoodie", min: 0 }, { n: "Jersey Bola", min: 100 }, { n: "Baju Koko", min: 0, f: "b" }, { n: "Gamis", min: 0, f: "g" },
  { n: "Dress", min: 100, f: "g" }, { n: "Seragam", min: 0 }, { n: "Jaket Varsity", min: 200 }, { n: "Pahlawan", min: 400 }, { n: "Astronot", min: 700 },
];
export const ACCS: Opt[] = [
  { n: "Kacamata", min: 0 }, { n: "Kacamata Hitam", min: 100 }, { n: "Topi", min: 50 }, { n: "Kupluk", min: 100 }, { n: "Peci", min: 0, f: "b" }, { n: "Headphone", min: 250 },
  { n: "Bando", min: 0, f: "g" }, { n: "Pita", min: 50, f: "g" }, { n: "Jepit Bintang", min: 150, f: "g" }, { n: "Syal", min: 200 }, { n: "Mahkota", min: 600 },
];
export const MOODS: Opt[] = [{ n: "Senang", min: 0 }, { n: "Semangat", min: 0 }, { n: "Keren", min: 200 }, { n: "Jahil", min: 300 }];

// Info kaidah bahasa Arab per tema: penjelasan Indonesia (p) dan contoh Arab-Indonesia (ex) dipisah agar rapi dibaca.
type Tip = { h: string; p: string; ex: [string, string][] };
export const TIPS: Record<string, Tip[]> = {
  "anggota-tubuh": [
    { h: "Muannats tidak hanya yang berakhiran ة", p: "Ada tiga jenis kata muannats: berakhiran ta marbuthah (ة), bermakna perempuan walau tanpa ة, dan muannats menurut kebiasaan orang Arab, misalnya anggota tubuh yang berpasangan.", ex: [["رُكْبَةٌ", "lutut (berakhiran ة)"], ["أُمٌّ", "ibu (bermakna perempuan)"], ["عَيْنٌ", "mata (kebiasaan)"], ["يَدٌ", "tangan (kebiasaan)"], ["رِجْلٌ", "kaki (kebiasaan)"], ["أُذُنٌ", "telinga (kebiasaan)"]] },
    { h: "Kata tunjuk mengikuti jenis kata", p: "Benda muannats memakai kata tunjuk muannats, benda mudzakkar memakai kata tunjuk mudzakkar.", ex: [["هَذِهِ يَدٌ", "Ini tangan (muannats)"], ["هَذَا أَنْفٌ", "Ini hidung (mudzakkar)"], ["هَذَا رَأْسٌ", "Ini kepala (mudzakkar)"]] },
    { h: "Anggota tubuh berpasangan (mutsanna)", p: "Untuk dua benda, tambahkan akhiran ـَانِ. Pada posisi nashab dan jar, akhiran berubah menjadi ـَيْنِ.", ex: [["يَدَانِ", "dua tangan"], ["عَيْنَانِ", "dua mata"], ["اِفْتَحْ عَيْنَيْكَ", "bukalah kedua matamu"]] },
  ],
  "kebun-binatang": [
    { h: "Sifat mengikuti kata benda", p: "Kata sifat harus sama jenisnya dengan kata benda. Untuk muannats, sifat diberi akhiran ة.", ex: [["أَسَدٌ كَبِيرٌ", "singa yang besar"], ["زَرَافَةٌ كَبِيرَةٌ", "jerapah yang besar"]] },
    { h: "Jamak hewan dianggap muannats tunggal", p: "Jamak dari hewan atau benda memakai kata tunjuk dan sifat muannats tunggal.", ex: [["هَذِهِ حَيَوَانَاتٌ كَبِيرَةٌ", "Ini hewan-hewan besar"]] },
    { h: "Huruf jar dan idhafah", p: "Kata benda sesudah huruf jar berharakat kasrah. Dua kata benda yang disusun berurutan menyatakan kepemilikan dan disebut idhafah.", ex: [["فِي حَدِيقَةِ الْحَيَوَانَاتِ", "di kebun binatang"]] },
  ],
  "ruang-tamu-belajar": [
    { h: "Nama alat berawalan م", p: "Banyak nama alat diawali huruf mim berkasrah.", ex: [["مِفْتَاحٌ", "kunci"], ["مِصْبَاحٌ", "lampu"], ["مِسْطَرَةٌ", "penggaris"], ["مِكْنَسَةٌ", "sapu"], ["مِقَصٌّ", "gunting"]] },
    { h: "Menyebut letak benda", p: "Setelah kata letak, kata benda berharakat kasrah.", ex: [["الْكِتَابُ عَلَى الطَّاوِلَةِ", "Buku di atas meja"], ["الْقَلَمُ فِي الْحَقِيبَةِ", "Pena di dalam tas"], ["الْكُرَةُ تَحْتَ الْكُرْسِيِّ", "Bola di bawah kursi"]] },
    { h: "Fungsi alif lam (الـ)", p: "Tanpa alif lam, kata bersifat umum dan bertanwin. Dengan alif lam, kata menjadi tertentu dan tanwin hilang.", ex: [["كِتَابٌ", "sebuah buku"], ["الْكِتَابُ", "buku itu"]] },
  ],
  "perpustakaan": [
    { h: "Nama tempat berawalan م", p: "Banyak kata tempat diawali huruf mim berfathah.", ex: [["مَكْتَبَةٌ", "perpustakaan"], ["مَدْرَسَةٌ", "sekolah"], ["مَطْعَمٌ", "restoran"], ["مَلْعَبٌ", "lapangan"]] },
    { h: "Pasangan laki-laki dan perempuan", p: "Untuk pelaku perempuan, tambahkan ة di akhir kata.", ex: [["مُعَلِّمٌ", "guru laki-laki"], ["مُعَلِّمَةٌ", "guru perempuan"], ["طَالِبٌ", "siswa laki-laki"], ["طَالِبَةٌ", "siswa perempuan"]] },
    { h: "Kata tanya", p: "Pilih kata tanya sesuai yang ditanyakan: benda, orang, atau tempat.", ex: [["مَا هَذَا؟", "Apa ini?"], ["مَنْ هَذِهِ؟", "Siapa ini?"], ["أَيْنَ الْكِتَابُ؟", "Di mana buku itu?"]] },
  ],
  "kantin": [
    { h: "Meminta sesuatu", p: "Benda yang diminta berakhiran fathah atau tanwin fathah.", ex: [["أُرِيدُ مَاءً", "Saya ingin air"], ["أُرِيدُ خُبْزًا", "Saya ingin roti"], ["أُرِيدُ عَصِيرًا", "Saya ingin jus"]] },
    { h: "Bentuk kolektif dan satuan", p: "Nama buah biasanya bentuk kolektif (mudzakkar). Untuk satu buah, tambahkan ة (muannats).", ex: [["تُفَّاحٌ", "apel (umum)"], ["تُفَّاحَةٌ", "sebuah apel"], ["مَوْزَةٌ", "sebuah pisang"], ["بَيْضَةٌ", "sebutir telur"]] },
    { h: "Makan dan minum", p: "Awalan hamzah pada kata kerja masa kini berarti saya.", ex: [["آكُلُ خُبْزًا", "Saya makan roti"], ["أَشْرَبُ مَاءً", "Saya minum air"]] },
  ],
  "jam-waktu": [
    { h: "Menyebut jam", p: "Kata jam termasuk muannats, jadi angka urutnya juga muannats.", ex: [["كَمِ السَّاعَةُ؟", "Jam berapa?"], ["السَّاعَةُ الْوَاحِدَةُ", "Jam satu"], ["السَّاعَةُ السَّابِعَةُ", "Jam tujuh"]] },
    { h: "Setengah dan seperempat", p: "Sebutkan jamnya, lalu tambahkan setengah atau seperempat. Untuk waktu kurang, ada kata khusus yang berarti kecuali.", ex: [["السَّابِعَةُ وَالنِّصْفُ", "07.30"], ["السَّابِعَةُ وَالرُّبْعُ", "07.15"], ["السَّابِعَةُ إِلَّا رُبْعًا", "06.45"]] },
    { h: "Keterangan waktu", p: "Kata waktu berakhiran tanwin fathah. Hari, pekan, dan bulan mudzakkar; tahun dan menit muannats.", ex: [["صَبَاحًا", "pagi hari"], ["مَسَاءً", "sore atau malam"], ["يَوْمٌ", "hari (mudzakkar)"], ["سَنَةٌ", "tahun (muannats)"]] },
  ],
  "saya-suka-bahasa-arab": [
    { h: "Awalan kata kerja", p: "Kata kerja masa kini berawalan hamzah berarti saya, berawalan nun berarti kami. Bentuk untuk saya sama bagi laki-laki dan perempuan.", ex: [["أَقْرَأُ", "saya membaca"], ["أَكْتُبُ", "saya menulis"], ["نَقْرَأُ", "kami membaca"]] },
    { h: "Menyebut yang disuka", p: "Benda yang disukai berakhiran fathah. Kata ganti saya di awal kalimat boleh dihilangkan.", ex: [["أُحِبُّ الْقِرَاءَةَ", "Saya suka membaca"], ["أَنَا أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ", "Saya suka bahasa Arab"]] },
    { h: "Sifat mengikuti jenis kata", p: "Kata bahasa termasuk muannats, jadi sifatnya muannats. Kata buku mudzakkar, jadi sifatnya mudzakkar.", ex: [["اللُّغَةُ الْعَرَبِيَّةُ", "bahasa Arab"], ["الْكِتَابُ الْعَرَبِيُّ", "buku Arab"]] },
  ],
  "kegiatan-liburan": [
    { h: "Huruf jar", p: "Huruf jar menunjukkan arah, kebersamaan, atau alat. Kata benda sesudahnya berharakat kasrah.", ex: [["أَذْهَبُ إِلَى الْحَدِيقَةِ", "Saya pergi ke taman"], ["أَلْعَبُ مَعَ أَصْدِقَائِي", "Saya bermain bersama teman-temanku"], ["أُسَافِرُ بِالْقِطَارِ", "Saya bepergian naik kereta"]] },
    { h: "Menyatakan kepemilikan", p: "Tambahkan akhiran di belakang kata benda untuk menyatakan milik siapa.", ex: [["كِتَابِي", "bukuku"], ["كِتَابُكَ", "bukumu (laki-laki)"], ["كِتَابُكِ", "bukumu (perempuan)"], ["كِتَابُهُ", "bukunya (laki-laki)"], ["كِتَابُهَا", "bukunya (perempuan)"]] },
    { h: "Alat transportasi", p: "Kereta mudzakkar, sedangkan mobil, pesawat, kapal, dan sepeda muannats.", ex: [["هَذَا قِطَارٌ", "Ini kereta"], ["هَذِهِ سَيَّارَةٌ", "Ini mobil"]] },
  ],
  "piknik": [
    { h: "Benda alam yang muannats", p: "Beberapa benda alam muannats menurut kebiasaan walau tanpa ة. Lainnya mudzakkar.", ex: [["الشَّمْسُ جَمِيلَةٌ", "Matahari itu indah (muannats)"], ["النَّهْرُ جَمِيلٌ", "Sungai itu indah (mudzakkar)"]] },
    { h: "Jamak manusia dan bukan manusia", p: "Untuk banyak orang, pakai kata tunjuk jamak khusus. Untuk jamak benda atau hewan, pakai kata tunjuk muannats tunggal.", ex: [["هَؤُلَاءِ أَصْدِقَاءُ", "Mereka adalah teman-teman"], ["هَذِهِ أَزْهَارٌ", "Ini bunga-bunga"]] },
    { h: "Mengajak", p: "Awalan lam sebelum kata kerja bermakna ajakan, dan kata kerjanya bersukun.", ex: [["لِنَذْهَبْ إِلَى الْحَدِيقَةِ", "Mari kita pergi ke taman"], ["هَيَّا بِنَا نَذْهَبْ", "Ayo kita pergi"]] },
  ],
};

// Misi Tema: permainan khusus tiap tema, mengikuti aktivitas pada rancangan awal.
export type MItem = { ar: string; id: string; w?: string; f?: string; e?: string; ans?: string; opts?: string[]; s?: number; o?: number };
export type MisiDef = { n: string; e: string; kind: "perintah" | "jam" | "lengkapi" | "urut"; items: MItem[] };
const P = (ar: string, id: string, w: string, f?: string): MItem => ({ ar, id, w, f });
const L = (ar: string, ans: string, opts: string[], id: string): MItem => ({ ar, ans, opts, id });
const U = (s: number, o: number, ar: string, id: string, e: string): MItem => ({ s, o, ar, id, e });
export const ORD = ["الْوَاحِدَةُ", "الثَّانِيَةُ", "الثَّالِثَةُ", "الرَّابِعَةُ", "الْخَامِسَةُ", "السَّادِسَةُ", "السَّابِعَةُ", "الثَّامِنَةُ", "التَّاسِعَةُ", "الْعَاشِرَةُ", "الْحَادِيَةَ عَشْرَةَ", "الثَّانِيَةَ عَشْرَةَ"];
export const MISI: Record<string, MisiDef> = {
  "anggota-tubuh": { n: "Perintah Guru", e: "🧑‍🏫", kind: "perintah", items: [
    P("اِفْتَحْ عَيْنَيْكَ", "Bukalah matamu", "عَيْنٌ", "اِفْتَحِي عَيْنَيْكِ"), P("أَشِرْ إِلَى أَنْفِكَ", "Tunjuklah hidungmu", "أَنْفٌ", "أَشِيرِي إِلَى أَنْفِكِ"),
    P("اِرْفَعْ يَدَكَ", "Angkatlah tanganmu", "يَدٌ", "اِرْفَعِي يَدَكِ"), P("اِفْتَحْ فَمَكَ", "Bukalah mulutmu", "فَمٌ", "اِفْتَحِي فَمَكِ"),
    P("حَرِّكْ رِجْلَكَ", "Gerakkan kakimu", "رِجْلٌ", "حَرِّكِي رِجْلَكِ"), P("اِلْمِسْ رَأْسَكَ", "Sentuhlah kepalamu", "رَأْسٌ", "اِلْمِسِي رَأْسَكِ")] },
  "kebun-binatang": { n: "Tebak Hewan", e: "🔍", kind: "perintah", items: [
    P("أَيْنَ الْأَسَدُ؟", "Di mana singa?", "أَسَدٌ"), P("أَيْنَ الْفِيلُ؟", "Di mana gajah?", "فِيلٌ"), P("أَيْنَ الْقِرْدُ؟", "Di mana monyet?", "قِرْدٌ"),
    P("أَيْنَ الزَّرَافَةُ؟", "Di mana jerapah?", "زَرَافَةٌ"), P("أَيْنَ الطَّائِرُ؟", "Di mana burung?", "طَائِرٌ"), P("أَيْنَ الْجَمَلُ؟", "Di mana unta?", "جَمَلٌ")] },
  "ruang-tamu-belajar": { n: "Cari Benda", e: "🔎", kind: "perintah", items: [
    P("أَيْنَ الْكُرْسِيُّ؟", "Di mana kursi?", "كُرْسِيٌّ"), P("أَيْنَ الطَّاوِلَةُ؟", "Di mana meja?", "طَاوِلَةٌ"), P("أَيْنَ الْكِتَابُ؟", "Di mana buku?", "كِتَابٌ"),
    P("أَيْنَ الْمِصْبَاحُ؟", "Di mana lampu?", "مِصْبَاحٌ"), P("أَيْنَ الْبَابُ؟", "Di mana pintu?", "بَابٌ"), P("أَيْنَ النَّافِذَةُ؟", "Di mana jendela?", "نَافِذَةٌ")] },
  "perpustakaan": { n: "Cari Buku", e: "📚", kind: "perintah", items: [
    P("أَيْنَ الْقِصَّةُ؟", "Di mana cerita?", "قِصَّةٌ"), P("أَيْنَ الرَّفُّ؟", "Di mana rak?", "رَفٌّ"), P("أَيْنَ الْمَجَلَّةُ؟", "Di mana majalah?", "مَجَلَّةٌ"),
    P("أَيْنَ الْقَامُوسُ؟", "Di mana kamus?", "قَامُوسٌ"), P("أَيْنَ الدَّفْتَرُ؟", "Di mana buku tulis?", "دَفْتَرٌ"), P("أَيْنَ الْمُعَلِّمُ؟", "Di mana guru?", "مُعَلِّمٌ")] },
  "kantin": { n: "Pesan Makanan", e: "🍽️", kind: "perintah", items: [
    P("أُرِيدُ مَاءً", "Saya ingin air", "مَاءٌ"), P("أُرِيدُ خُبْزًا", "Saya ingin roti", "خُبْزٌ"), P("أُرِيدُ أَرُزًّا", "Saya ingin nasi", "أَرُزٌّ"),
    P("أُرِيدُ حَلِيبًا", "Saya ingin susu", "حَلِيبٌ"), P("أُرِيدُ تُفَّاحًا", "Saya ingin apel", "تُفَّاحٌ"), P("أُرِيدُ مَوْزًا", "Saya ingin pisang", "مَوْزٌ")] },
  "jam-waktu": { n: "Atur Jarum Jam", e: "🕒", kind: "jam", items: [] },
  "saya-suka-bahasa-arab": { n: "Lengkapi Kalimat", e: "✏️", kind: "lengkapi", items: [
    L("___ الْكِتَابَ", "أَقْرَأُ", ["أَقْرَأُ", "أَشْرَبُ", "أَنَامُ", "أَجْرِي"], "Saya membaca buku."), L("___ الْقِرَاءَةَ", "أُحِبُّ", ["أُحِبُّ", "أَكْتُبُ", "أَشْرَبُ", "أَنَامُ"], "Saya suka membaca."),
    L("___ الْمَاءَ", "أَشْرَبُ", ["أَشْرَبُ", "أَقْرَأُ", "أَرْسُمُ", "أَجْرِي"], "Saya minum air."), L("___ الدَّرْسَ", "أَكْتُبُ", ["أَكْتُبُ", "أَنَامُ", "أَشْرَبُ", "أَجْرِي"], "Saya menulis pelajaran."),
    L("أَنَا ___ اللُّغَةَ الْعَرَبِيَّةَ", "أُحِبُّ", ["أُحِبُّ", "أَجْرِي", "أَنَامُ", "أَشْرَبُ"], "Saya suka bahasa Arab.")] },
  "kegiatan-liburan": { n: "Urutkan Cerita", e: "🗂️", kind: "urut", items: [
    U(0, 0, "أَوَّلًا، أَذْهَبُ إِلَى الشَّاطِئِ", "Pertama, saya pergi ke pantai.", "🏖️"), U(0, 1, "ثُمَّ أَسْبَحُ فِي الْبَحْرِ", "Lalu saya berenang di laut.", "🏊"),
    U(0, 2, "بَعْدَ ذَلِكَ أَلْعَبُ مَعَ أَصْدِقَائِي", "Setelah itu saya bermain dengan teman-temanku.", "⚽"), U(0, 3, "أَخِيرًا أَعُودُ إِلَى الْبَيْتِ", "Terakhir, saya pulang ke rumah.", "🏠"),
    U(1, 0, "أَوَّلًا، أَرْكَبُ الْقِطَارَ", "Pertama, saya naik kereta.", "🚆"), U(1, 1, "ثُمَّ أَزُورُ بَيْتَ جَدِّي", "Lalu saya mengunjungi rumah kakekku.", "🏠"),
    U(1, 2, "بَعْدَ ذَلِكَ أَذْهَبُ إِلَى الْحَدِيقَةِ", "Setelah itu saya pergi ke taman.", "🌳"), U(1, 3, "أَخِيرًا أَلْتَقِطُ صُورَةً", "Terakhir, saya mengambil foto.", "📷")] },
  "piknik": { n: "Siapkan Bekal", e: "🧺", kind: "perintah", items: [
    P("أَحْتَاجُ إِلَى مَاءٍ", "Saya butuh air", "مَاءٌ"), P("أَحْتَاجُ إِلَى طَعَامٍ", "Saya butuh makanan", "طَعَامٌ"),
    P("أَحْتَاجُ إِلَى كُرَةٍ", "Saya butuh bola", "كُرَةٌ"), P("أَحْتَاجُ إِلَى سَلَّةٍ", "Saya butuh keranjang", "سَلَّةٌ")] },
};

// Kalimat contoh untuk menu "Kosakata dalam Kalimat".
export function sentences(t: Theme): { ar: string; id: string; e: string }[] {
  const m = MISI[t.slug];
  const a = [...t.ex.map((s) => ({ ...s, e: t.e })), ...t.words.filter((w) => w.g).slice(0, 4).map((w, i) => ({ ...sentOf(w, true, i), e: w.e }))];
  const b = m.kind === "perintah" ? m.items.slice(0, 3).map((x) => ({ ar: x.ar, id: x.id, e: t.words.find((w) => w.ar === x.w)?.e ?? t.e }))
    : m.kind === "lengkapi" ? m.items.slice(0, 4).map((x) => ({ ar: x.ar.replace("___", x.ans ?? ""), id: x.id, e: t.e }))
    : m.kind === "urut" ? m.items.filter((x) => x.s === 0).map((x) => ({ ar: x.ar, id: x.id, e: x.e ?? t.e }))
    : [0, 1, 2].map((k) => ({ ar: `السَّاعَةُ ${ORD[k]}`, id: `Jam ${k + 1}.`, e: "🕒" }));
  const seen = new Set<string>();
  return [...a, ...b].filter((x) => (seen.has(x.ar) ? false : (seen.add(x.ar), true)));
}
