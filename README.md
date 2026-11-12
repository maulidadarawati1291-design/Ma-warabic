# Ma'warabic

Website belajar bahasa Arab untuk anak MI. Next.js + TypeScript + Tailwind CSS.

## Jalankan
```bash
npm install
npm run dev      # http://localhost:3000
```

## GitHub dan Vercel
```bash
git init && git add . && git commit -m "Ma'warabic"
git branch -M main
git remote add origin https://github.com/USERNAME/ma-warabic.git
git push -u origin main
```
Di vercel.com: Add New → Project → Import repositori → Deploy.

## Alur
Halaman masuk (nama, nomor absen, karakter yang bisa dihias) → Peta Petualangan → tema → 4 game berurutan (Kamus Bergambar, Kuis Pintar, Cocokkan Kartu, Pecah Balon).
Game berikutnya terbuka jika game sebelumnya sempurna. Tema berikutnya terbuka jika 4 game tema sebelumnya sempurna.
1 jawaban benar = 10 poin (nilai terbaik tiap game). Poin membuka profil baru (`AVATARS` di `lib/data.ts`).
Progres tersimpan di `localStorage` per siswa (nama + nomor absen) pada perangkat yang sama.

## Mengisi kosakata
`lib/data.ts`: tambahkan baris `Arab berharakat|Arti|emoji` pada blok `W(...)` tiap tema. Guru perlu memeriksa harakat dan arti.

## Ilustrasi dan audio
- Gambar: vektor 2D Twemoji (CC-BY 4.0) dari CDN jsDelivr (butuh internet); pemandangan tema berupa SVG di `components/Illus.tsx`.
- Audio: suara peramban (`ar-SA`). Untuk rekaman guru, ubah `speak` di `lib/util.ts`.

## Aturan
- Keluar atau memuat ulang halaman sebelum satu tema selesai = tema itu diulang dari awal (anti-curang).
- Game yang sudah sempurna tidak bisa dibuka ulang sampai seluruh game di tema itu selesai.
- Kata tunjuk dan sifat mengikuti jenis kata benda (`dem`, `ADJ`, `sentOf` di `lib/data.ts`). Jenis kata dideteksi otomatis (berakhiran ة = muannats) dengan pengecualian di daftar `FEM`/`NOG`.

## Penilaian
Game berikutnya terbuka setelah game sebelumnya selesai (tidak harus sempurna). Setelah tiap game selesai, siswa melihat nilai dan koreksi jawaban yang salah. Soal diacak dengan tiga tingkat: Mudah, Sedang, Sulit.
Suara mengikuti jenis karakter (perempuan atau laki-laki). Efek suara sorak dan "tet-tot" dibuat dengan WebAudio.
