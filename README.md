# Ma'waArabic

Website pembelajaran bahasa Arab untuk MI Kelas V–VI (Fase C, CEFR A1). Next.js + TypeScript + Tailwind CSS.

## Jalankan
```bash
npm install
npm run dev      # http://localhost:3000
```

## GitHub dan Vercel
```bash
git init && git add . && git commit -m "Ma'waArabic"
git branch -M main
git remote add origin https://github.com/USERNAME/mawaarabic.git
git push -u origin main
```
Di vercel.com: Add New → Project → Import repositori → Deploy (Next.js terdeteksi otomatis).

## Mengisi kosakata (target 50 per tema)
Buka `lib/data.ts`. Tiap tema punya blok `W(\`...\`)`; tambahkan baris `Arab berharakat|Arti|emoji`. Kuis dan kamus menyesuaikan otomatis. Mohon guru memeriksa harakat dan arti setiap kata.

## Ilustrasi dan audio
- Gambar kata: ilustrasi vektor 2D flat Twemoji (CC-BY 4.0) dari CDN jsDelivr, sehingga butuh internet. Pemandangan tiap tema digambar sebagai SVG di `components/Illus.tsx`. Untuk gambar sendiri, ubah fungsi `src`/`Illus` di file itu.
- Audio: suara bawaan peramban (`ar-SA`). Untuk rekaman guru, simpan mp3 di `public/audio/` dan ubah `speak` di `lib/util.ts`.
- Progres tersimpan di `localStorage` perangkat siswa.
