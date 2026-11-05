(async () => {
  const grid = document.getElementById("foto-grid"); if (!grid) return;
  const { getJSON, esc } = window.PAFC;
  let d; try { d = await getJSON("galeri.json"); } catch (e) { grid.innerHTML = `<p class="notice">Galeri gagal dimuat. Jalankan situs melalui server (lihat README).</p>`; return; }
  let items = d.foto, idx = 0;
  grid.innerHTML = items.map((f, i) => `<button class="relative overflow-hidden rounded group text-left" data-i="${i}" aria-label="Buka foto: ${esc(f.judul)}">
    ${f.src ? `<img src="${esc(f.src)}" alt="${esc(f.alt)}" loading="lazy" class="w-full aspect-[4/3] object-cover group-hover:scale-105 transition">` : `<div class="ph !aspect-[4/3]"><i data-lucide="image"></i>Foto belum tersedia</div>`}
    <span class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 p-3 text-white text-sm font-semibold">${esc(f.judul)}</span></button>`).join("");
  document.getElementById("video-grid").innerHTML = d.video.map(v => v.youtubeId
    ? `<div class="card"><iframe class="w-full aspect-video" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}" title="${esc(v.judul)}" loading="lazy" allowfullscreen></iframe><p class="p-3 font-semibold">${esc(v.judul)}</p></div>`
    : `<div class="card"><div class="ph !aspect-video"><i data-lucide="video"></i>Video belum tersedia</div><p class="p-3 font-semibold">${esc(v.judul)}</p></div>`).join("");
  lucide.createIcons();
  const lb = document.getElementById("lightbox"), body = document.getElementById("lb-body"), cap = document.getElementById("lb-cap");
  const show = i => { idx = (i + items.length) % items.length; const f = items[idx];
    body.innerHTML = f.src ? `<img src="${esc(f.src)}" alt="${esc(f.alt)}">` : `<div class="ph rounded !w-[min(90vw,640px)]"><i data-lucide="image"></i>Foto belum tersedia</div>`; cap.textContent = f.judul; lucide.createIcons(); };
  const open = i => { show(i); lb.classList.add("open"); lb.querySelector("[data-close]").focus(); };
  const close = () => lb.classList.remove("open");
  grid.addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) open(+b.dataset.i); });
  lb.addEventListener("click", e => { if (e.target === lb || e.target.closest("[data-close]")) close(); if (e.target.closest("[data-prev]")) show(idx - 1); if (e.target.closest("[data-next]")) show(idx + 1); });
  document.addEventListener("keydown", e => { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
})();
