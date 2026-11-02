# Ma'waArabic

Website pembelajaran bahasa Arab untuk MI Kelas V–VI (Fase C, CEFR A1). Next.js + TypeScript + Tailwind CSS.

## Jalankan di komputer
```bash
npm install
npm run dev      # http://localhost:3000
```

## Upload ke GitHub lalu deploy ke Vercel
```bash
git init && git add . && git commit -m "Ma'waArabic versi dasar"
git branch -M main
git remote add origin https://github.com/USERNAME/mawaarabic.git
git push -u origin main
```
Di vercel.com: **Add New → Project → Import** repositori tersebut → **Deploy** (Next.js terdeteksi otomatis, tanpa pengaturan tambahan).

## Isi versi dasar (Tahap 1)
Beranda, Peta Belajar 9 tema Fase C, Kamus Bergambar dengan audio, kuis (menyimak + membaca), bintang dan progres (disimpan di `localStorage` perangkat siswa).

## Mengubah isi
- Kosakata dan tema: `lib/data.ts`
- Audio: saat ini memakai suara bawaan peramban (`ar-SA`), kualitasnya bergantung pada perangkat. Untuk rekaman guru, taruh mp3 di `public/audio/` dan ubah fungsi `speak` di `lib/util.ts`.
- Gambar: emoji hanya penanda sementara; ganti dengan ilustrasi 2D di `lib/data.ts`.

## Belum dibuat (Tahap 2–4 pada rancangan)
Memanah Kata, Balok Kalimat, Cocokkan Gambar, Baca Cerita Mini, Ruang Menulis, Misi Presentasi, Kamera AR 2D, Panel Guru, pilihan Kelas V/VI, dan Supabase.
