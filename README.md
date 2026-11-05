# Putra Asgar FC – Laskar Domba Sakti (Situs Resmi)

Situs statis (HTML5, CSS3, JavaScript ES6, Tailwind CSS via CDN, ikon Lucide) untuk GitHub Pages. Tanpa PHP/server.

## Struktur
`index, profil, akademi, prestasi, berita, galeri, pendaftaran, kontak .html` · `assets/{css,js,images}` · `data/{berita,prestasi,galeri}.json` · `.nojekyll`

## Menjalankan lokal
Data dimuat lewat `fetch`, jadi gunakan server lokal (bukan klik dua kali berkas):
```
python3 -m http.server 8000   # lalu buka http://localhost:8000
```

## Deploy ke GitHub Pages
1. Buat repositori, unggah seluruh isi folder ini ke cabang `main` (root).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Situs aktif di `https://<user>.github.io/<repo>/`. Semua path bersifat relatif.

## Menghubungkan formulir pendaftaran (WAJIB)
Formulir **belum mengirim data** sampai dikonfigurasi, dan situs menampilkan pemberitahuan tersebut.
1. Buat Google Form dengan kolom: nama, tanggal lahir, kategori usia, jenis kelamin, wali, WhatsApp, alamat, pengalaman.
2. Menu ⋮ → *Dapatkan link yang sudah diisi sebelumnya*, isi tiap kolom, kirim, lalu salin ID `entry.xxxxxxx`.
3. Di `assets/js/main.js`, isi `FORM_CONFIG.actionUrl` (URL form berakhiran `/formResponse`) dan `FORM_CONFIG.entries`.
Catatan: pengiriman memakai `no-cors`, sehingga browser tidak bisa memastikan keberhasilan; periksa tab Responses di Google Form.

## Konten yang perlu dilengkapi pengurus
- Foto/video asli (`gambar (letakkan di folder utama)`, `data/galeri.json`); logo resmi klub (belum ada, saat ini hanya tulisan nama).
- Sejarah rinci, visi-misi, struktur organisasi, staf pelatih (profil.html).
- Kontak resmi (kontak.html). Artikel di `data/berita.json` berstatus draf.
- Materi program akademi (akademi.html) bersifat garis besar; sesuaikan dengan kurikulum klub.
