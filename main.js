/* Putra Asgar FC – skrip utama: layout bersama, navigasi, beranda, pendaftaran */
const SITE = {
  nama: "Putra Asgar FC",
  julukan: "Laskar Domba Sakti",
  halaman: [
    ["index.html", "Beranda"], ["profil.html", "Profil Klub"], ["akademi.html", "Program Akademi"],
    ["prestasi.html", "Prestasi"], ["berita.html", "Berita"], ["galeri.html", "Galeri"], ["kontak.html", "Kontak"]
  ]
};

/* === KONFIGURASI FORMULIR ===
   Isi actionUrl dengan URL ".../formResponse" milik Google Form Anda dan
   isi setiap ID "entry.xxxxx" sesuai kolom. Selama kosong, formulir TIDAK mengirim data. */
const FORM_CONFIG = {
  actionUrl: "",
  entries: { nama: "", lahir: "", kategori: "", gender: "", wali: "", wa: "", alamat: "", pengalaman: "" }
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const getJSON = async p => { const r = await fetch(p); if (!r.ok) throw new Error(p + " gagal dimuat"); return r.json(); };
const fmtTanggal = d => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
window.PAFC = { esc, getJSON, fmtTanggal };

function renderLayout() {
  const cur = location.pathname.split("/").pop() || "index.html";
  const links = SITE.halaman.map(([h, t]) => `<a class="link" href="${h}" ${h === cur ? 'aria-current="page"' : ""}>${t}</a>`).join("");
  document.getElementById("site-header").innerHTML = `
  <a class="skip" href="#konten">Lompat ke konten</a>
  <nav class="nav" aria-label="Navigasi utama"><div class="container flex items-center justify-between py-3">
    <a href="index.html" class="wordmark" aria-label="${SITE.nama} – Beranda">${SITE.nama}<small>${SITE.julukan}</small></a>
    <div class="hidden lg:flex items-center gap-1">${links}<a href="pendaftaran.html" class="btn btn-red ml-3 !py-2">Daftar</a></div>
    <button id="menu-btn" class="lg:hidden text-white p-2" aria-label="Buka menu" aria-expanded="false" aria-controls="menu"><i data-lucide="menu"></i></button>
  </div>
  <div id="menu" class="hidden lg:hidden border-t border-white/10 pb-4"><div class="container flex flex-col">${links}<a href="pendaftaran.html" class="btn btn-red mt-3 justify-center">Daftar Sekarang</a></div></div></nav>`;
  document.getElementById("site-footer").innerHTML = `
  <footer class="bg-black text-gray-300 pt-14 pb-8 border-t-4 border-[#B91C1C]"><div class="container grid gap-10 md:grid-cols-3">
    <div><p class="wordmark">${SITE.nama}<small>${SITE.julukan}</small></p>
      <p class="mt-4 text-sm">Akademi sepak bola di Garut, Jawa Barat. Berdiri sejak 2018.</p></div>
    <div><h2 class="text-white text-xl mb-3">Navigasi</h2><ul class="grid grid-cols-2 gap-1 text-sm">${SITE.halaman.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}<li><a href="pendaftaran.html">Pendaftaran</a></li></ul></div>
    <div><h2 class="text-white text-xl mb-3">Lokasi</h2><p class="text-sm">Garut, Jawa Barat, Indonesia</p>
      <a href="pendaftaran.html" class="btn btn-gold mt-4">Daftar Siswa Baru</a></div>
  </div><p class="container text-xs text-gray-500 mt-10 pt-6 border-t border-white/10">© ${new Date().getFullYear()} ${SITE.nama}. Seluruh hak cipta dilindungi.</p></footer>`;
  const b = document.getElementById("menu-btn"), m = document.getElementById("menu");
  b.addEventListener("click", () => { const o = m.classList.toggle("hidden") === false; b.setAttribute("aria-expanded", o); });
}

async function initBeranda() {
  if (!document.getElementById("home-stats")) return;
  try {
    const p = await getJSON("data/prestasi.json");
    document.getElementById("home-stats").innerHTML = p.statistik.map(s =>
      `<div><div class="stat" data-n="${s.nilai}" ${s.tanpaHitung ? 'data-static="1"' : ""}>${s.nilai}</div><p class="mt-2 text-gray-300">${esc(s.label)}</p></div>`).join("");
    document.querySelectorAll("[data-n]:not([data-static])").forEach(el => {
      const n = +el.dataset.n; let i = 0; el.textContent = 0;
      const t = setInterval(() => { el.textContent = ++i; if (i >= n) clearInterval(t); }, 90);
    });
  } catch (e) { console.error(e); }
  try {
    const b = (await getJSON("data/berita.json")).berita.slice(0, 3);
    document.getElementById("home-news").innerHTML = b.map(newsCard).join("");
  } catch (e) { console.error(e); }
  try {
    const g = (await getJSON("data/galeri.json")).foto.slice(0, 4);
    document.getElementById("home-gallery").innerHTML = g.map(f => f.src
      ? `<a href="galeri.html"><img src="${esc(f.src)}" alt="${esc(f.alt)}" loading="lazy" class="rounded w-full aspect-square object-cover"></a>`
      : `<a href="galeri.html" class="ph rounded !aspect-square"><i data-lucide="image"></i>${esc(f.judul)}</a>`).join("");
    lucide.createIcons();
  } catch (e) { console.error(e); }
}

function newsCard(n) {
  const img = n.gambar ? `<img src="${esc(n.gambar)}" alt="" loading="lazy" class="w-full aspect-[16/10] object-cover">` : `<div class="ph"><i data-lucide="newspaper"></i>Foto belum tersedia</div>`;
  return `<article class="card flex flex-col">${img}<div class="p-5 flex-1 flex flex-col">
    <div class="flex items-center gap-3 text-sm text-gray-500"><span class="tag">${esc(n.kategori)}</span><time datetime="${n.tanggal}">${fmtTanggal(n.tanggal)}</time></div>
    <h3 class="text-2xl mt-3"><a href="berita.html?artikel=${encodeURIComponent(n.slug)}" class="hover:text-[#B91C1C]">${esc(n.judul)}</a></h3>
    <p class="mt-2 text-gray-600 flex-1">${esc(n.ringkasan)}</p>
    <a class="mt-4 font-bold text-[#B91C1C] inline-flex items-center gap-1" href="berita.html?artikel=${encodeURIComponent(n.slug)}">Baca selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></a></div></article>`;
}
window.PAFC.newsCard = newsCard;

function initForm() {
  const f = document.getElementById("form-daftar"); if (!f) return;
  const ok = !!FORM_CONFIG.actionUrl;
  const status = document.getElementById("form-status");
  if (!ok) status.innerHTML = `<div class="notice" role="status"><strong>Formulir belum terhubung.</strong> Data yang diisi <u>belum dapat dikirim atau disimpan</u> sampai Google Form dihubungkan (lihat README). Untuk saat ini, silakan hubungi pengurus melalui halaman <a class="underline font-bold" href="kontak.html">Kontak</a>.</div>`;
  f.querySelector("button[type=submit]").disabled = !ok;
  f.addEventListener("submit", async e => {
    e.preventDefault();
    let valid = true;
    f.querySelectorAll("[required]").forEach(el => {
      const bad = el.type === "checkbox" ? !el.checked : !el.value.trim();
      el.setAttribute("aria-invalid", bad); const m = document.getElementById("err-" + el.name); if (m) m.textContent = bad ? "Bagian ini wajib diisi." : "";
      if (bad) valid = false;
    });
    const wa = f.elements.wa; if (wa.value && !/^(\+62|62|0)8\d{7,12}$/.test(wa.value.replace(/[\s-]/g, ""))) { valid = false; wa.setAttribute("aria-invalid", true); document.getElementById("err-wa").textContent = "Format nomor WhatsApp tidak valid (contoh: 08123456789)."; }
    if (!valid) { f.querySelector("[aria-invalid=true]")?.focus(); return; }
    const d = new FormData();
    Object.entries(FORM_CONFIG.entries).forEach(([k, id]) => { if (id && f.elements[k]) d.append(id, f.elements[k].value); });
    const btn = f.querySelector("button[type=submit]"); btn.disabled = true;
    try {
      await fetch(FORM_CONFIG.actionUrl, { method: "POST", mode: "no-cors", body: d });
      // Mode no-cors: browser tidak bisa memverifikasi hasil, jadi pesan dibuat jujur.
      status.innerHTML = `<div class="notice" role="status">Permintaan pengiriman telah dikirim ke Google Form. Browser tidak dapat memastikan penerimaan; pengurus akan menghubungi melalui WhatsApp.</div>`; f.reset();
    } catch (err) { status.innerHTML = `<div class="notice" role="alert">Gagal mengirim. Periksa koneksi lalu coba lagi.</div>`; }
    btn.disabled = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderLayout(); initBeranda(); initForm();
  if (window.lucide) lucide.createIcons();
});
