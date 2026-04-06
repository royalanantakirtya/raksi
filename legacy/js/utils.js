// ==================
// DARK MODE
// ==================
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById("toggle-theme");

  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light"); // simpan preferensi
    if (btn) btn.textContent = "dark_mode";
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark"); // simpan preferensi
    if (btn) btn.textContent = "light_mode";
  }
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const html = document.documentElement;
  const btn = document.getElementById("toggle-theme");

  if (saved === "dark") {
    html.classList.add("dark");
    if (btn) btn.textContent = "light_mode";
  } else if (saved === "light") {
    html.classList.remove("dark");
    if (btn) btn.textContent = "dark_mode";
  } else {
    // fallback ke tema OS
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }
}

// ==================
// SIMPAN STATE
// ==================
function saveState(page, tab) {
  localStorage.setItem("lastState", JSON.stringify({ page, tab }));
}

function loadState() {
  const state = localStorage.getItem("lastState");
  return state ? JSON.parse(state) : null;
}

// ==================
// AMBIL PARAMETER DI CHECKLIST
// ==================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const lokasi = params.get("lokasi");
  if (lokasi && document.getElementById("namaLokasi")) {
    document.getElementById("namaLokasi").textContent = lokasi;
  }
});

// Ambil array dari localStorage, kalau belum ada return []
function getData(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

// Simpan array ke localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// Hapus data dari localStorage
function deleteData(key) {
  localStorage.removeItem(key);
}

// ==================
// SYNC BELUM TERKIRIM
// ==================
async function syncBelumTerkirim() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  let belum = getData("belumTerkirim");
  if (!belum.length) {
    console.log("Tidak ada data lokal untuk sync.");
    return;
  }

  console.log(`Mulai sync ${belum.length} data lokal...`);

  for (let kunjungan of [...belum]) {
    try {
      // kirim kunjungan
      await fetch("http://localhost:3000/kunjungan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kunjungan),
      });

      // kirim temuan jika ada
      const temuanLocal = getData("temuan").filter(
        (t) => t.kode_kunjungan === kunjungan.kode_kunjungan
      );

      for (let t of temuanLocal) {
        await fetch("http://localhost:3000/temuan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t),
        });
      }

      // sukses → pindahkan ke arsip
      let arsip = getData("arsip");
      arsip.push(kunjungan);
      saveData("arsip", arsip);

      // hapus dari belumTerkirim
      belum = belum.filter(
        (b) => b.kode_kunjungan !== kunjungan.kode_kunjungan
      );
      saveData("belumTerkirim", belum);

      console.log(`Berhasil sync kunjungan ${kunjungan.kode_kunjungan}`);
    } catch (err) {
      console.warn(`Gagal sync kunjungan ${kunjungan.kode_kunjungan}`, err);
      // jangan dihapus, nanti dicoba lagi
    }
  }
}
