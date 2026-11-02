export type Word = { ar: string; id: string; e: string };
export type Sent = { ar: string; id: string };
export type Theme = { slug: string; ar: string; id: string; e: string; c: string; bg: string; words: Word[]; ex: Sent[] };

// Satu baris = "Arab|Indonesia|emoji ilustrasi". Tambah baris untuk menambah kosakata (target 50 per tema).
const W = (s: string): Word[] => s.trim().split("\n").map((l) => { const [ar, id, e] = l.trim().split("|"); return { ar, id, e }; });
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
عَضَلَةٌ|Otot|💪`),
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
جَمَلٌ|Unta|🐪`),
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
مِفْتَاحٌ|Kunci|🔑`),
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
نَظَّارَةٌ|Kacamata|👓`),
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
جُبْنٌ|Keju|🧀`),
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
غَدًا|Besok|🔜`),
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
أُصَلِّي|Saya salat|🕌`),
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
فُنْدُقٌ|Hotel|🏨`),
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
نَهْرٌ|Sungai|🏞️`),
    ex: [S("هَذَا طَعَامٌ", "Ini makanan."), S("مَعِيَ مَاءٌ", "Saya membawa air.")] },
];
