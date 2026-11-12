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

// Info kaidah bahasa Arab yang berkaitan dengan tiap tema (ditampilkan di Kamus Bergambar).
export const TIPS: Record<string, { h: string; p: string }[]> = {
  "anggota-tubuh": [
    { h: "Muannats bukan hanya yang berakhiran ة", p: "Kata benda muannats ada 3 macam. (1) Berakhiran ة (ta marbuthah): رُكْبَةٌ، عَضَلَةٌ. (2) Bermakna perempuan walau tanpa ة: أُمٌّ (ibu), بِنْتٌ (anak perempuan). (3) Muannats menurut kebiasaan orang Arab, terutama anggota tubuh yang berpasangan: عَيْنٌ، أُذُنٌ، يَدٌ، رِجْلٌ، قَدَمٌ، سِنٌّ. Jadi yang benar هَذِهِ يَدٌ." },
    { h: "Anggota tubuh yang mudzakkar", p: "Tidak semua anggota tubuh muannats. Yang mudzakkar: رَأْسٌ، أَنْفٌ، فَمٌ، وَجْهٌ، قَلْبٌ، شَعْرٌ، لِسَانٌ. Jadi yang benar هَذَا أَنْفٌ." },
    { h: "Bentuk berpasangan (mutsanna)", p: "Untuk dua benda tambahkan ـَانِ: يَدٌ menjadi يَدَانِ، عَيْنٌ menjadi عَيْنَانِ، أُذُنٌ menjadi أُذُنَانِ. Pada posisi nashab dan jar, ـَانِ berubah menjadi ـَيْنِ: يَدَيْنِ، عَيْنَيْنِ." },
  ],
  "kebun-binatang": [
    { h: "Sifat mengikuti kata benda", p: "Kata sifat harus sama jenisnya dengan kata benda: أَسَدٌ كَبِيرٌ (singa besar), زَرَافَةٌ كَبِيرَةٌ (jerapah besar)." },
    { h: "Jamak hewan dianggap muannats tunggal", p: "Jamak dari hewan dan benda diperlakukan seperti muannats tunggal, jadi memakai هَذِهِ dan sifat berakhiran ة: هَذِهِ حَيَوَانَاتٌ كَبِيرَةٌ (ini hewan-hewan besar)." },
    { h: "Huruf jar فِي", p: "Setelah فِي, kata benda berharakat kasrah: فِي حَدِيقَةِ الْحَيَوَانَاتِ (di kebun binatang). حَدِيقَةُ الْحَيَوَانَاتِ adalah susunan idhafah: kebun milik hewan-hewan." },
  ],
  "ruang-tamu-belajar": [
    { h: "Nama alat berawalan مِـ", p: "Banyak nama alat berawalan مِـ: مِفْتَاحٌ (kunci), مِصْبَاحٌ (lampu), مِسْطَرَةٌ (penggaris), مِكْنَسَةٌ (sapu), مِقَصٌّ (gunting)." },
    { h: "Menyebut letak benda", p: "Kata sesudah huruf jar berharakat kasrah: عَلَى (di atas), فِي (di dalam), تَحْتَ (di bawah). Contoh: الْكِتَابُ عَلَى الطَّاوِلَةِ، الْقَلَمُ فِي الْحَقِيبَةِ." },
    { h: "Fungsi alif lam (الـ)", p: "Tanpa الـ, kata bersifat umum dan bertanwin: كِتَابٌ (sebuah buku). Dengan الـ menjadi tertentu dan tanwin hilang: الْكِتَابُ (buku itu)." },
  ],
  "perpustakaan": [
    { h: "Nama tempat berawalan مَـ", p: "Banyak kata tempat berawalan مَـ: مَكْتَبَةٌ (perpustakaan), مَدْرَسَةٌ (sekolah), مَطْعَمٌ (restoran), مَلْعَبٌ (lapangan)." },
    { h: "Pasangan laki-laki dan perempuan", p: "Untuk pelaku perempuan tambahkan ة: مُعَلِّمٌ menjadi مُعَلِّمَةٌ (guru), طَالِبٌ menjadi طَالِبَةٌ (siswa). Contoh: هَذَا مُعَلِّمٌ، هَذِهِ مُعَلِّمَةٌ." },
    { h: "Kata tanya", p: "مَا untuk benda, مَنْ untuk orang, أَيْنَ untuk tempat. Contoh: مَا هَذَا؟ هَذَا كِتَابٌ. مَنْ هَذِهِ؟ هَذِهِ مُعَلِّمَةٌ. أَيْنَ الْكِتَابُ؟" },
  ],
  "kantin": [
    { h: "Meminta sesuatu", p: "Setelah أُرِيدُ (saya ingin), benda yang diinginkan berakhiran fathah atau tanwin fathah: أُرِيدُ مَاءً، أُرِيدُ خُبْزًا، أُرِيدُ عَصِيرًا." },
    { h: "Bentuk kolektif dan satuan", p: "Nama buah dan sayur biasanya bentuk kolektif (mudzakkar). Untuk satuannya tambahkan ة (muannats): تُفَّاحٌ menjadi تُفَّاحَةٌ (sebuah apel), مَوْزٌ menjadi مَوْزَةٌ (sebuah pisang), بَيْضٌ menjadi بَيْضَةٌ (sebutir telur)." },
    { h: "Makan dan minum", p: "آكُلُ berarti saya makan, أَشْرَبُ berarti saya minum. Awalan أ pada kata kerja berarti saya: آكُلُ خُبْزًا، أَشْرَبُ مَاءً." },
  ],
  "jam-waktu": [
    { h: "Menyebut jam", p: "سَاعَةٌ muannats, jadi angka urutnya juga muannats: السَّاعَةُ الْوَاحِدَةُ (jam 1), الثَّانِيَةُ (jam 2), الثَّالِثَةُ (jam 3), sampai السَّابِعَةُ (jam 7). Tanya: كَمِ السَّاعَةُ؟ Jawab: السَّاعَةُ السَّابِعَةُ." },
    { h: "Setengah dan seperempat", p: "السَّابِعَةُ وَالنِّصْفُ berarti 07.30. السَّابِعَةُ وَالرُّبْعُ berarti 07.15. السَّابِعَةُ إِلَّا رُبْعًا berarti 06.45." },
    { h: "Keterangan waktu dan jenis kata", p: "Kata waktu seperti صَبَاحًا، ظُهْرًا، مَسَاءً، غَدًا berakhiran tanwin fathah. Hari, pekan, dan bulan mudzakkar: يَوْمٌ، أُسْبُوعٌ، شَهْرٌ. Tahun dan menit muannats: سَنَةٌ، دَقِيقَةٌ." },
  ],
  "saya-suka-bahasa-arab": [
    { h: "Awalan kata kerja", p: "Kata kerja masa kini berawalan أَ/أُ/آ berarti saya: أَقْرَأُ، أَكْتُبُ، آكُلُ. Awalan نَـ berarti kami: نَقْرَأُ. Bentuk untuk saya sama untuk laki-laki dan perempuan." },
    { h: "Menyebut yang disuka", p: "Benda yang disukai berakhiran fathah: أُحِبُّ الْقِرَاءَةَ (saya suka membaca), أَنَا أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ. Kata أَنَا (saya) boleh dihilangkan." },
    { h: "Sifat mengikuti jenis kata", p: "اللُّغَةُ muannats, jadi sifatnya muannats: اللُّغَةُ الْعَرَبِيَّةُ. Bandingkan dengan mudzakkar: الْكِتَابُ الْعَرَبِيُّ." },
  ],
  "kegiatan-liburan": [
    { h: "Huruf jar", p: "إِلَى berarti ke, مَعَ berarti bersama, بِـ berarti dengan atau naik. Contoh: أَذْهَبُ إِلَى الْحَدِيقَةِ، أَلْعَبُ مَعَ أَصْدِقَائِي، أُسَافِرُ بِالْقِطَارِ." },
    { h: "Menyatakan kepemilikan", p: "Tambahkan akhiran: ـِي (milikku), ـكَ (milikmu, laki-laki), ـكِ (milikmu, perempuan), ـهُ (miliknya, laki-laki), ـهَا (miliknya, perempuan). Contoh: كِتَابِي، كِتَابُكَ، كِتَابُكِ، كِتَابُهُ، كِتَابُهَا." },
    { h: "Alat transportasi", p: "قِطَارٌ mudzakkar, sedangkan سَيَّارَةٌ، طَائِرَةٌ، سَفِينَةٌ، دَرَّاجَةٌ muannats: هَذَا قِطَارٌ، هَذِهِ سَيَّارَةٌ." },
  ],
  "piknik": [
    { h: "Benda alam yang muannats", p: "Beberapa benda alam muannats menurut kebiasaan walau tanpa ة: شَمْسٌ (matahari), سَمَاءٌ (langit). Sedangkan قَمَرٌ، نَهْرٌ، مَطَرٌ mudzakkar. Contoh: الشَّمْسُ جَمِيلَةٌ." },
    { h: "Jamak manusia dan bukan manusia", p: "Untuk banyak orang pakai هَؤُلَاءِ: هَؤُلَاءِ أَصْدِقَاءُ. Untuk jamak benda atau hewan pakai هَذِهِ: هَذِهِ أَزْهَارٌ." },
    { h: "Mengajak", p: "لِنَذْهَبْ berarti mari kita pergi (kata kerja bersukun setelah لِـ): لِنَذْهَبْ إِلَى الْحَدِيقَةِ. Bisa juga هَيَّا بِنَا نَذْهَبْ." },
  ],
};
