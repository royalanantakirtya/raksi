// Halaman
const pages = {
  home: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer" onclick="bukaTabKunjungan()">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Lokasi Kunjungan</p>
          <p id="pekerjaan-count" class="text-xl font-bold text-secondary dark:text-blue-400">
            0 Lokasi
          </p>
        </div>
        <span class="material-symbols-rounded text-secondary dark:text-blue-400 text-3xl">
          edit
        </span>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h2 class="font-semibold mb-2 flex justify-between">
        <span>Status Terakhir</span>
        <button id="btn-update" class="text-secondary dark:text-blue-400 text-sm flex items-center gap-1 cursor-pointer">
          <span class="material-symbols-rounded text-sm">refresh</span>
          Perbarui
        </button>
      </h2>
      <ul id="status-list" class="text-sm space-y-1">
        <li><b>Waktu</b> : --:--:--</li>
        <li><b>Tanggal</b> : --/--/----</li>
        <li><b>Latitude</b> : --</li>
        <li><b>Longitude</b> : --</li>
      </ul>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h2 class="font-semibold mb-2">Berita</h2>
      <p class="text-gray-500 dark:text-gray-400 text-center">Berita tidak ditemukan</p>
    </div>
  `,
  kunjungan: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3 mt-4">
      <h2 class="font-semibold mb-2 flex justify-between">Rute Kunjungan</h2>
      
      <!-- Tab Navigation -->
      <div class="tabs flex mt-4 gap-2 border-b border-gray-300 dark:border-gray-700 text-sm">
        <button class="tab-btn px-3 py-2" data-tab="tab-kunjungan">Kunjungan</button>
        <button class="tab-btn px-3 py-2" data-tab="tab-belum">Belum Terkirim</button>
        <button class="tab-btn px-3 py-2" data-tab="tab-arsip">Arsip</button>
      </div>

      <!-- Tab Content -->
      <div id="tab-kunjungan" class="tab-content space-y-3 mt-4"></div>
      <div id="tab-belum" class="tab-content hidden space-y-3 mt-4"></div>
      <div id="tab-arsip" class="tab-content hidden space-y-3 mt-4"></div>
    </div>
  `,
  takterjadwal: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3 mt-4">
      <h2 class="font-semibold mb-2 flex justify-between">
        <span>Kunjungan Tak Terjadwal</span>
        <button id="btn-tambah" class="text-secondary dark:text-blue-400 text-sm flex items-center gap-1">
          <span class="material-symbols-rounded text-sm">add</span>
          Tambah Lokasi
        </button>
      </h2>
      <!-- Tab Navigation -->
      <div class="tabs flex mt-4 gap-2 border-b border-gray-300 dark:border-gray-700 text-sm">
        <button class="tab-btn px-3 py-2" data-tab="tab-kunjungan">Kunjungan Tak Terjadwal</button>
        <button class="tab-btn px-3 py-2" data-tab="tab-belum">Belum Terkirim</button>
        <button class="tab-btn px-3 py-2" data-tab="tab-arsip">Arsip</button>
      </div>

      <!-- Tab Content -->
      <div id="tab-kunjungan" class="tab-content space-y-3 mt-4"></div>
      <div id="tab-belum" class="tab-content hidden space-y-3 mt-4"></div>
      <div id="tab-arsip" class="tab-content hidden space-y-3 mt-4"></div>

      <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded shadow flex justify-between items-center cursor-pointer" onclick="openForm('JKT.Indomaret Raya Bekasi 2 (TK06)')">
        <div>
          <p class="font-semibold">JKT.Indomaret Raya Bekasi 2 (TK06)</p>
          <p class="text-xs dark:text-gray-300">Jl. Raya Bekasi KM.17 Jakarta Timur</p>
        </div>
      </div>
    </div>
  `,
  lainnya: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3 mt-4">
      <h2 class="font-semibold mb-2">Lainnya</h2>

      <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded shadow flex items-center cursor-pointer">
        <span class="material-symbols-rounded text-gray-600 dark:text-gray-200 mr-3">person</span>
        <p class="text-gray-700 dark:text-gray-200">Profil</p>
      </div>

      <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded shadow flex items-center cursor-pointer">
        <span class="material-symbols-rounded text-gray-600 dark:text-gray-200 mr-3">settings</span>
        <p class="text-gray-700 dark:text-gray-200">Pengaturan</p>
      </div>

      <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded shadow flex items-center cursor-pointer" onclick="logout()">
        <span class="material-symbols-rounded text-gray-600 dark:text-gray-200 mr-3">logout</span>
        <p class="text-gray-700 dark:text-gray-200">Keluar</p>
      </div>
    </div>
  `,
};

// ==================
// STATUS (Home)
// ==================
function setDate() {
  const list = document.getElementById("status-list");
  if (!list) return;
  const now = new Date();
  const tanggal = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  list.querySelector(
    "li:nth-child(2)"
  ).innerHTML = `<b>Tanggal</b> : ${tanggal}`;
}

function updateTime() {
  const list = document.getElementById("status-list");
  if (!list) return;
  const now = new Date();
  const waktu = now.toLocaleTimeString("id-ID");
  list.querySelector("li:first-child").innerHTML = `<b>Waktu</b> : ${waktu}`;
}

function updateCoords() {
  const list = document.getElementById("status-list");
  if (!list) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        list.querySelector(
          "li:nth-child(3)"
        ).innerHTML = `<b>Latitude</b> : ${latitude.toFixed(5)}`;
        list.querySelector(
          "li:nth-child(4)"
        ).innerHTML = `<b>Longitude</b> : ${longitude.toFixed(5)}`;
        // simpan ke localStorage
        localStorage.setItem("coords", JSON.stringify({ latitude, longitude }));
      },
      (err) => {
        list.querySelector(
          "li:nth-child(3)"
        ).innerHTML = `<b>Latitude</b> : Gagal (${err.message})`;
        list.querySelector(
          "li:nth-child(4)"
        ).innerHTML = `<b>Longitude</b> : Gagal (${err.message})`;
      }
    );
  }
}

// ==================
// RENDER HALAMAN
// ==================
function renderPage(page, tab) {
  const content = document.getElementById("content");
  if (pages[page]) {
    content.innerHTML = pages[page];

    saveState(page, tab);
    if (tab) {
      window.location.hash = `${page}/${tab}`;
    } else {
      window.location.hash = page;
    }

    // inisialisasi halaman spesifik
    if (page === "home") {
      setDate();
      setInterval(updateTime, 1000);
      updateTime();
      updateCoords();
      const btn = document.getElementById("btn-update");
      if (btn) btn.addEventListener("click", updateCoords);
      loadData().then(({ jadwal, belumTerkirim, arsip }) => {
        updatePekerjaanCount(jadwal, belumTerkirim, arsip);
      });
    }

    if (page === "kunjungan") {
      const activeTab = tab || "tab-kunjungan";
      initTabs(activeTab);
      loadData().then(({ jadwal, belumTerkirim, arsip }) => {
        renderTabKunjungan(jadwal, belumTerkirim, arsip);
        renderTabBelumTerkirim(belumTerkirim);
        renderTabArsip(arsip);
      });
    }

    if (page === "takterjadwal") {
      const activeTab = tab || "tab-kunjungan";
      initTabs(activeTab);
    }
  } else {
    content.innerHTML =
      "<p class='text-center text-gray-500 dark:text-gray-400'>Halaman tidak ditemukan</p>";
  }
}

// ==================
// TABS
// ==================
function initTabs(defaultTab) {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) =>
        b.classList.remove(
          "border-b-2",
          "border-primary",
          "dark:border-blue-400",
          "text-primary",
          "dark:text-blue-400",
          "font-semibold"
        )
      );
      tabContents.forEach((c) => c.classList.add("hidden"));

      btn.classList.add(
        "border-b-2",
        "border-primary",
        "dark:border-blue-400",
        "text-primary",
        "dark:text-blue-400",
        "font-semibold"
      );
      document.getElementById(btn.dataset.tab).classList.remove("hidden");

      const tabName = btn.dataset.tab;
      window.location.hash = `kunjungan/${tabName}`;
      saveState("kunjungan", tabName);
    });
  });

  if (defaultTab) {
    const btn = document.querySelector(`.tab-btn[data-tab="${defaultTab}"]`);
    if (btn) btn.click();
  } else if (tabButtons.length > 0) {
    tabButtons[0].click();
  }
}

// ==================
// EVENT
// ==================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initTheme === "function") initTheme();
  syncBelumTerkirim(); // ⬅️ cek & kirim otomatis data lokal

  const btnTheme = document.getElementById("toggle-theme");
  if (btnTheme) {
    btnTheme.addEventListener("click", toggleTheme);
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const userIdEl = document.getElementById("userId");

  if (user && user.kode_user && userIdEl) {
    userIdEl.textContent = `Hai, ${user.kode_user}`;
  } else if (userIdEl) {
    userIdEl.textContent = "Hai, -";
  }

  document
    .getElementById("toggle-theme")
    .addEventListener("click", toggleTheme);

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const [page, tab] = hash.split("/");
    if (pages[page]) {
      renderPage(page, tab);
    } else {
      renderPage("home");
    }
  } else {
    renderPage("home");
  }

  document
    .getElementById("nav-home")
    .addEventListener("click", () => renderPage("home"));
  document
    .getElementById("nav-kunjungan")
    .addEventListener("click", () => renderPage("kunjungan"));
  document
    .getElementById("nav-takterjadwal")
    .addEventListener("click", () => renderPage("takterjadwal"));
  document
    .getElementById("nav-lainnya")
    .addEventListener("click", () => renderPage("lainnya"));
});

// ==================
// OPEN FORM
// ==================
// function openForm(kode_lokasi, kode_kunjungan = null, isArsip = false) {
//   // Gunakan kode_lokasi sebagai parameter utama
//   const paramLokasi = `kode_lokasi=${encodeURIComponent(kode_lokasi)}`;
//   const paramKunjungan = kode_kunjungan
//     ? `&kode_kunjungan=${encodeURIComponent(kode_kunjungan)}`
//     : "";
//   const paramArsip = isArsip ? `&arsip=1` : "";

//   const hash = window.location.hash.replace("#", "");
//   window.location.href = `checklist.html?${paramLokasi}${paramKunjungan}${paramArsip}&from=${hash}`;
// }
async function openForm(kode_lokasi, kode_kunjungan = null, isArsip = false) {
  // Jika mode arsip (readOnly), langsung buka tanpa batas jarak
  if (isArsip) {
    const paramLokasi = `kode_lokasi=${encodeURIComponent(kode_lokasi)}`;
    const paramKunjungan = kode_kunjungan
      ? `&kode_kunjungan=${encodeURIComponent(kode_kunjungan)}`
      : "";
    const paramArsip = "&arsip=1";
    const hash = window.location.hash.replace("#", "");
    window.location.href = `checklist.html?${paramLokasi}${paramKunjungan}${paramArsip}&from=${hash}`;
    return;
  }

  // Ambil koordinat user dari localStorage (hasil updateCoords di home)
  const userCoords = JSON.parse(localStorage.getItem("coords"));
  if (!userCoords || !userCoords.latitude || !userCoords.longitude) {
    alert(
      "Koordinat Anda belum tersedia. Aktifkan GPS dan tekan tombol Update Lokasi di halaman utama."
    );
    return;
  }

  // Ambil data lokasi dari localStorage
  const lokasiData = getData("lokasi") || [];
  const lokasi = lokasiData.find((l) => l.kode_lokasi === kode_lokasi);

  if (!lokasi || !lokasi.latitude || !lokasi.longitude) {
    alert("Koordinat lokasi tidak ditemukan. Tidak dapat memverifikasi jarak.");
    return;
  }

  // Hitung jarak user ↔ lokasi (Haversine)
  const jarak = hitungJarak(
    userCoords.latitude,
    userCoords.longitude,
    parseFloat(lokasi.latitude),
    parseFloat(lokasi.longitude)
  );

  if (jarak > 250) {
    alert(
      `Anda berada di luar radius lokasi (jarak ${Math.round(
        jarak
      )} meter). Checklist tidak dapat dibuka.`
    );
    return;
  }

  // Jika jarak masih dalam radius aman, lanjutkan buka checklist
  const paramLokasi = `kode_lokasi=${encodeURIComponent(kode_lokasi)}`;
  const paramKunjungan = kode_kunjungan
    ? `&kode_kunjungan=${encodeURIComponent(kode_kunjungan)}`
    : "";
  const hash = window.location.hash.replace("#", "");
  window.location.href = `checklist.html?${paramLokasi}${paramKunjungan}&from=${hash}`;
}

// ========================
// Fungsi pembantu hitung jarak antar dua koordinat (Haversine formula)
// ========================
function hitungJarak(lat1, lon1, lat2, lon2) {
  const R = 6371000; // radius bumi (meter)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ==================
// LOAD DATA
// ==================
async function loadData() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.kode_user)
    return { jadwal: [], belumTerkirim: [], arsip: [] };

  const today = new Date();
  const todayFormatted = `${today.getDate().toString().padStart(2, "0")}-${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${today.getFullYear()}`;

  let jadwal = [];
  try {
    const res = await fetch("http://localhost:3000/jadwal");
    const all = await res.json();

    // filter hanya milik user + hari ini
    jadwal = all.filter(
      (j) => j.kode_user === user.kode_user && j.tanggal === todayFormatted
    );

    // ✅ simpan jadwal harian ke localStorage
    localStorage.setItem("jadwal", JSON.stringify(jadwal));
  } catch (err) {
    console.error("Gagal load jadwal:", err);
  }

  const belumTerkirim = getData("belumTerkirim") || [];
  const arsip = getData("arsip") || [];

  return { jadwal, belumTerkirim, arsip };
}

// ==================
// RENDER TABS
// ==================
function renderTabKunjungan(jadwal, belumTerkirim, arsip) {
  const container = document.getElementById("tab-kunjungan");
  if (!container) return;

  // lokasi aktif = jadwal yang belum ada di arsip maupun belumTerkirim
  const aktif = jadwal.filter(
    (j) =>
      !arsip.find((a) => a.kode_lokasi === j.kode_lokasi) &&
      !belumTerkirim.find((b) => b.kode_lokasi === j.kode_lokasi)
  );

  container.innerHTML = aktif.length
    ? aktif
        .map(
          (item) => `
      <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded shadow flex justify-between items-center cursor-pointer"
           onclick="openForm('${item.kode_lokasi}')">
        <div>
          <p class="font-semibold">${item.lokasi}</p>
          <p class="text-xs text-secondary dark:text-blue-400">${item.alamat}</p>
        </div>
        <span class="material-symbols-rounded text-secondary dark:text-blue-400">edit</span>
      </div>`
        )
        .join("")
    : "<p class='text-gray-500'>Tidak ada lokasi kunjungan aktif.</p>";

  updatePekerjaanCount(jadwal, belumTerkirim, arsip);
}

function renderTabBelumTerkirim(belum) {
  const container = document.getElementById("tab-belum");
  if (!container) return;

  container.innerHTML = belum.length
    ? belum
        .map(
          (k) => `
      <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded shadow flex justify-between items-center cursor-pointer"
           onclick="openForm('${k.kode_lokasi}', '${k.kode_kunjungan}')">
        <div>
          <p class="font-semibold">${k.nama_lokasi}</p>
          <p class="text-xs text-secondary dark:text-blue-400">Belum terkirim</p>
        </div>
        <span class="material-symbols-rounded text-gray-500 dark:text-gray-400">pending</span>
      </div>`
        )
        .join("")
    : "<p class='text-gray-500'>Tidak ada data belum terkirim.</p>";
}

async function renderTabArsip(_arsip) {
  const container = document.getElementById("tab-arsip");
  if (!container) return;

  // 1. Ambil Kode User dari Local Storage
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.kode_user) {
    container.innerHTML =
      "<p class='text-red-500'>Informasi pengguna tidak ditemukan.</p>";
    return;
  }
  const kodeUser = user.kode_user;

  // 2. Tentukan Tanggal Hari Ini (dalam format yang sama dengan data arsip)
  const today = formatTanggalID(new Date());

  // 3. Ambil Data Arsip dari Server atau Local Storage
  let data = [];

  try {
    // 3. Ambil data kunjungan dari server
    // Catatan: Jika server Anda mendukung filter, lebih baik filter di server (Contoh: /kunjungan?kode_user=...)
    const res = await fetch("http://localhost:3000/kunjungan");
    const all = await res.json();

    // 4. FILTER data berdasarkan kode_user DAN tanggal hari ini
    data = all.filter((a) => a.tanggal === today && a.kode_user === kodeUser);

    // simpan juga ke localStorage
    simpanArsipLokal(data);
    bersihkanArsip();
  } catch (err) {
    console.warn("Offline, ambil arsip dari localStorage");
    // Saat offline, filter juga harus diterapkan pada data lokal
    const allLocal = ambilArsipLokal();
    data = allLocal.filter(
      (a) => a.tanggal === today && a.kode_user === kodeUser
    );
  }

  container.innerHTML = data.length
    ? data
        .map(
          (k) => `
        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded shadow flex justify-between items-center cursor-pointer"
             onclick="openForm('${k.kode_lokasi}', '${k.kode_kunjungan}', true)">
          <div>
            <p class="font-semibold">${k.nama_lokasi}</p>
            <p class="text-xs text-secondary dark:text-blue-400">
              Selesai pada ${k.tanggal} pukul ${k.waktu_selesai} (Durasi: ${k.durasi})
            </p>
          </div>
          <span class="material-symbols-rounded text-green-500">check_circle</span>
        </div>`
        )
        .join("")
    : "<p class='text-gray-500'>Belum ada arsip hari ini.</p>";
}

// ==================
// UPDATE PEKERJAAN COUNT DI HOME
// ==================
function updatePekerjaanCount(jadwal, belumTerkirim, arsip) {
  // lokasi yang belum dikerjakan = jadwal - arsip - belumTerkirim
  const aktif = jadwal.filter(
    (j) =>
      !arsip.find((a) => a.kode_lokasi === j.kode_lokasi) &&
      !belumTerkirim.find((b) => b.kode_lokasi === j.kode_lokasi)
  );
  const countEl = document.getElementById("pekerjaan-count");
  if (countEl) {
    countEl.textContent =
      aktif.length > 0 ? `${aktif.length} Lokasi` : "Tidak ada lokasi";
  }
}

// ==================
// BUKA TAB KUNJUNGAN DARI HOME
// ==================
function bukaTabKunjungan() {
  const countEl = document.getElementById("pekerjaan-count");
  const count = parseInt(countEl.textContent);
  if (count > 0) {
    renderPage("kunjungan", "tab-kunjungan");
  } else {
    alert("Belum ada lokasi kunjungan.");
  }
}

function formatTanggalID(date) {
  return date
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
}

function simpanArsipLokal(data) {
  const today = formatTanggalID(new Date()); // "02-10-2025"
  localStorage.setItem("arsip_" + today, JSON.stringify(data));
}

function ambilArsipLokal() {
  const today = formatTanggalID(new Date());
  const raw = localStorage.getItem("arsip_" + today);
  return raw ? JSON.parse(raw) : [];
}

function bersihkanArsip() {
  const today = formatTanggalID(new Date());
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("arsip_") && key !== "arsip_" + today) {
      localStorage.removeItem(key);
    }
  });
}

// ==================
// LOGOUT
// ==================
function logout() {
  localStorage.removeItem("lastState");
  window.location.href = "index.html";
}

window.bukaTabKunjungan = bukaTabKunjungan; // agar bisa diakses dari HTML
