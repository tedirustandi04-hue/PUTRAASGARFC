(async () => {
  const root = document.getElementById("berita-root"); if (!root) return;
  const { getJSON, esc, fmtTanggal, newsCard } = window.PAFC;
  let data; try { data = (await getJSON("berita.json")).berita; } catch (e) { root.innerHTML = `<p class="notice">Berita gagal dimuat. Jalankan situs melalui server (lihat README).</p>`; return; }
  const slug = new URLSearchParams(location.search).get("artikel");
  if (slug) {
    const n = data.find(x => x.slug === slug);
    document.getElementById("list-ui").hidden = true;
    root.innerHTML = n ? `<a href="berita.html" class="font-bold text-[#B91C1C] inline-flex gap-1 items-center mb-6"><i data-lucide="arrow-left" class="w-4 h-4"></i>Semua berita</a>
      <article class="prose"><span class="tag">${esc(n.kategori)}</span><h2 class="title mt-3">${esc(n.judul)}</h2><time class="text-gray-500 block mb-6" datetime="${n.tanggal}">${fmtTanggal(n.tanggal)}</time>${n.isi.map(p => `<p>${esc(p)}</p>`).join("")}</article>`
      : `<p>Artikel tidak ditemukan. <a class="underline" href="berita.html">Kembali</a></p>`;
    if (n) document.title = n.judul + " – Putra Asgar FC";
    lucide.createIcons(); return;
  }
  const cats = ["Semua", ...new Set(data.map(n => n.kategori))];
  const bar = document.getElementById("kategori"); let aktif = "Semua";
  const q = document.getElementById("cari");
  const render = () => {
    const kw = q.value.trim().toLowerCase();
    const hasil = data.filter(n => (aktif === "Semua" || n.kategori === aktif) && (n.judul + n.ringkasan).toLowerCase().includes(kw));
    root.innerHTML = hasil.length ? `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${hasil.map(newsCard).join("")}</div>` : `<p class="text-gray-600">Tidak ada berita yang cocok.</p>`;
    lucide.createIcons();
  };
  bar.innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c === aktif}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  bar.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; aktif = b.dataset.c; bar.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); render(); });
  q.addEventListener("input", render); render();
})();
