export type Word = { ar: string; id: string; e: string };
export type Theme = { slug: string; ar: string; id: string; e: string; words: Word[]; ex: { ar: string; id: string } };

const w = (ar: string, id: string, e: string): Word => ({ ar, id, e });

// Emoji = penanda sementara; ganti dengan ilustrasi 2D di Tahap 3.
export const themes: Theme[] = [
  { slug: "anggota-tubuh", ar: "أَعْضَاءُ الْجِسْمِ", id: "Anggota Tubuh", e: "🧍",
    words: [w("رَأْسٌ", "Kepala", "🧑"), w("عَيْنٌ", "Mata", "👁️"), w("أَنْفٌ", "Hidung", "👃"), w("يَدٌ", "Tangan", "✋"), w("رِجْلٌ", "Kaki", "🦶")],
    ex: { ar: "هَذَا رَأْسٌ", id: "Ini kepala." } },
  { slug: "kebun-binatang", ar: "فِي حَدِيقَةِ الْحَيَوَانَاتِ", id: "Kebun Binatang", e: "🦁",
    words: [w("أَسَدٌ", "Singa", "🦁"), w("فِيلٌ", "Gajah", "🐘"), w("قِرْدٌ", "Monyet", "🐒"), w("زَرَافَةٌ", "Jerapah", "🦒"), w("طَائِرٌ", "Burung", "🐦")],
    ex: { ar: "هَذَا أَسَدٌ", id: "Ini singa." } },
  { slug: "ruang-tamu-belajar", ar: "فِي غُرْفَةِ الْجُلُوسِ وَغُرْفَةِ الدِّرَاسَةِ", id: "Ruang Tamu dan Ruang Belajar", e: "🛋️",
    words: [w("كُرْسِيٌّ", "Kursi", "🪑"), w("طَاوِلَةٌ", "Meja", "🗄️"), w("كِتَابٌ", "Buku", "📖"), w("مِصْبَاحٌ", "Lampu", "💡")],
    ex: { ar: "هَذَا كُرْسِيٌّ", id: "Ini kursi." } },
  { slug: "perpustakaan", ar: "فِي الْمَكْتَبَةِ", id: "Perpustakaan", e: "📚",
    words: [w("مَكْتَبَةٌ", "Perpustakaan", "📚"), w("كِتَابٌ", "Buku", "📖"), w("قِصَّةٌ", "Cerita", "📜"), w("رَفٌّ", "Rak", "🗄️")],
    ex: { ar: "أَيْنَ الْكِتَابُ؟", id: "Di mana buku itu?" } },
  { slug: "kantin", ar: "فِي الْمَقْصَفِ", id: "Kantin", e: "🍎",
    words: [w("مَاءٌ", "Air", "💧"), w("خُبْزٌ", "Roti", "🍞"), w("أَرُزٌّ", "Nasi", "🍚"), w("حَلِيبٌ", "Susu", "🥛"), w("تُفَّاحٌ", "Apel", "🍎")],
    ex: { ar: "أُرِيدُ مَاءً", id: "Saya ingin air." } },
  { slug: "jam-waktu", ar: "السَّاعَةُ وَالْوَقْتُ", id: "Jam dan Waktu", e: "🕒",
    words: [w("سَاعَةٌ", "Jam", "🕒"), w("صَبَاحًا", "Pagi", "🌅"), w("ظُهْرًا", "Siang", "☀️"), w("مَسَاءً", "Sore/malam", "🌇")],
    ex: { ar: "كَمِ السَّاعَةُ؟", id: "Jam berapa?" } },
  { slug: "saya-suka-bahasa-arab", ar: "أَنَا أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ", id: "Saya Suka Bahasa Arab", e: "💚",
    words: [w("أُحِبُّ", "Saya suka", "💚"), w("أَقْرَأُ", "Saya membaca", "📖"), w("أَكْتُبُ", "Saya menulis", "✍️"), w("أَتَكَلَّمُ", "Saya berbicara", "🗣️")],
    ex: { ar: "أَنَا أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ", id: "Saya suka bahasa Arab." } },
  { slug: "kegiatan-liburan", ar: "أَنْشِطَةُ الْعُطْلَةِ", id: "Kegiatan Liburan", e: "🏖️",
    words: [w("عُطْلَةٌ", "Liburan", "🏖️"), w("أَلْعَبُ", "Saya bermain", "⚽"), w("أَزُورُ", "Saya mengunjungi", "🏠"), w("أَسْبَحُ", "Saya berenang", "🏊")],
    ex: { ar: "أَذْهَبُ إِلَى الْحَدِيقَةِ", id: "Saya pergi ke taman." } },
  { slug: "piknik", ar: "النُّزْهَةُ", id: "Piknik", e: "🧺",
    words: [w("نُزْهَةٌ", "Piknik", "🧺"), w("حَدِيقَةٌ", "Taman", "🌳"), w("طَعَامٌ", "Makanan", "🍱"), w("مَاءٌ", "Air", "💧"), w("أَصْدِقَاءُ", "Teman-teman", "🧑‍🤝‍🧑")],
    ex: { ar: "هَذَا طَعَامٌ", id: "Ini makanan." } },
];
