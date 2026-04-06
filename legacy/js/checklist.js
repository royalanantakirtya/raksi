// ====================
// Variabel Global
// ====================
let waktuMulai = null;
let saveBtn;
let durationInterval = null;
let currentDurationMinutes = 0;
const MIN_DURATION_MINUTES = 5;

// ===================================
// Fungsi Simpan dan Hapus Waktu Mulai
// ===================================

// Fungsi untuk inisialisasi waktu mulai kunjungan
function initializeWaktuMulai() {
  // 🚨 1. Ambil status ReadOnly dari URL
  const params = new URLSearchParams(window.location.search);
  const isReadOnly =
    params.get("arsip") === "1" || params.get("from") === "belum_terkirim";

  // 🚨 2. CEK UTAMA: JANGAN catat waktu jika halaman dibuka dalam mode ReadOnly
  if (isReadOnly) {
    console.log("Mode ReadOnly terdeteksi. Waktu mulai tidak dicatat.");
    return;
  }

  // --- Logika Pencatatan Waktu (HANYA dijalankan jika TIDAK ReadOnly) ---
  const now = new Date();
  // Format Tanggal untuk perbandingan (Contoh: 09-10-2025)
  const today = now
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  // Ambil tanggal mulai yang tersimpan di localStorage
  const savedDate = localStorage.getItem("tanggal_mulai");

  // Cek jika tanggal yang tersimpan berbeda dengan hari ini (Kadaluarsa)
  if (savedDate && savedDate !== today) {
    console.warn("Waktu mulai kadaluarsa, mereset sesi.");
    localStorage.removeItem("waktu_mulai");
    localStorage.removeItem("tanggal_mulai");
  }

  // Logika Persistensi: HANYA atur waktu baru jika belum ada
  if (localStorage.getItem("waktu_mulai")) {
    console.log("Waktu mulai sudah ada:", localStorage.getItem("waktu_mulai"));
    return;
  }

  // Jika belum ada (atau baru saja di-reset): catat yang baru
  const newWaktuMulai = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedTime = newWaktuMulai.replace(/\./g, ":");

  localStorage.setItem("waktu_mulai", formattedTime);
  localStorage.setItem("tanggal_mulai", today); // Simpan tanggal baru
  console.log(`Waktu mulai kunjungan baru dicatat ${today}, ${formattedTime}`);
}

// Fungsi untuk menghapus waktu mulai setelah kunjungan selesai
function clearWaktuMulai() {
  localStorage.removeItem("waktu_mulai");
  localStorage.removeItem("tanggal_mulai"); // 🚨 Hapus tanggal juga
  console.log("Waktu mulai kunjungan telah dihapus.");
}

// ====================
// Helper Functions
// ====================

// Fungsi untuk membuat kode kunjungan
function generateKodeKunjungan(kodeUser) {
  const kode6 = kodeUser.slice(-6);
  const now = new Date();
  const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
  const hhmmss = now.toTimeString().slice(0, 8).replace(/:/g, "");
  return kode6 + yymmdd + hhmmss;
}

// Fungsi untuk membuat nomor tiket
function generateNomorTiket(kodeUser) {
  const kode6 = kodeUser.slice(-6);
  const now = new Date();
  const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
  const hhmmss = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const rand = Math.floor(100 + Math.random() * 900); // 3 digit random
  return kode6 + yymmdd + hhmmss + rand;
}

// Fungsi untuk membersihkan label dari karakter yang tidak diinginkan
function normalizeLabel(text) {
  return text
    .toLowerCase() // abaikan kapital
    .replace(/\s?\*\s?/g, "") // hapus tanda "*"
    .replace(/[\/]/g, " ") // ubah "/" menjadi spasi
    .replace(/[^a-z0-9\s]/gi, "") // hapus karakter non-alfanumerik (kecuali spasi)
    .replace(/\s+/g, " ") // rapikan spasi ganda
    .trim(); // hapus spasi depan/belakang
}

// mapping label -> key singkat
const kondisiMap = {
  // Perhatikan, kunci-kunci di sini TIDAK memiliki tanda bintang
  "Kondisi LCD Monitor": "kondisi_lcd_monitor",
  "Kondisi AC": "kondisi_ac",
  "Fascia Bagian Atas Mesin": "fascia_bagian_atas_mesin",
  "Fascia Bagian Bawah Mesin": "fascia_bagian_bawah_mesin",
  "Kondisi Lampu Booth Akrilik": "kondisi_lampu_booth_akrilik",
  "Pintu Booth Kerangkeng": "pintu_booth_kerangkeng",
  "Tempat Sampah": "tempat_sampah",
  "Stiker ID ATM": "stiker_id_atm",
  "Stiker Denom": "stiker_denom",
  "Stiker Kaca Pintu": "stiker_kaca_pintu",
  "Kondisi Pintu Ruangan": "kondisi_pintu_ruangan",
  "Kondisi Instalasi Kabel": "kondisi_instalasi_kabel",
  Plafond: "plafond",
  "Lampu Ruangan": "lampu_ruangan",
  "Dinding Ruangan": "dinding_ruangan",
  "Lantai Ruangan": "lantai_ruangan",
  "ID Pelanggan KWH Meter": "id_pelanggan_kwh_meter",
  "Sisa Token Listrik": "sisa_token_listrik",
};

// mapping label foto -> key singkat
const fotoMap = {
  "foto mesin": "foto_mesin",
  "foto ruangan": "foto_ruangan",
  "foto lantai": "foto_lantai",
  "foto tempat sampah": "foto_tempat_sampah",
  "foto kaca ruangan": "foto_kaca_ruangan",
  "foto atas booth": "foto_atas_booth",
  "foto kwh meter": "foto_kwh_meter",
};

// ====================
// Fungsi Simpan Checklist
// ====================
async function simpanChecklist() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("User tidak ditemukan, silakan login ulang.");
    return;
  }

  const now = new Date();
  const params = new URLSearchParams(window.location.search);
  const namaLokasi = document.getElementById("namaLokasi").textContent.trim();
  const tanggal = now
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
  const terjadwal = params.get("from")?.includes("kunjungan")
    ? "terjadwal"
    : "tidak terjadwal";

  // Hitung durasi dengan presisi detik
  const [hMulai, mMulai, sMulai] = waktuMulai.split(":").map(Number);
  const [hSelesai, mSelesai, sSelesai] = waktuSelesai.split(":").map(Number);

  let start = hMulai * 3600 + mMulai * 60 + sMulai;
  let end = hSelesai * 3600 + mSelesai * 60 + sSelesai;
  if (end < start) end += 24 * 3600; // antisipasi lintas tengah malam

  let durasiDetik = end - start;
  const durasiMenit = Math.floor(durasiDetik / 60);
  const durasiSisaDetik = durasiDetik % 60;

  // Format mm:ss
  const durasi = `${durasiMenit.toString().padStart(2, "0")}:${durasiSisaDetik
    .toString()
    .padStart(2, "0")}`;

  // --- ambil jadwal ---
  let jadwal = null;
  try {
    const res = await fetch(
      `http://localhost:3000/jadwal?kode_user=${
        user.kode_user
      }&lokasi=${encodeURIComponent(namaLokasi)}&tanggal=${tanggal}`
    );
    const data = await res.json();
    jadwal = data.length > 0 ? data[0] : null;
  } catch (e) {
    console.warn("Tidak bisa ambil jadwal:", e);
  }

  // --- buat objek kunjungan ---
  const kodeKunjungan = generateKodeKunjungan(user.kode_user);
  const kunjungan = {
    kode_kunjungan: kodeKunjungan,
    tanggal,
    kode_user: user.kode_user,
    nama_user: user.nama_user,
    cabang: user.cabang,
    kode_lokasi: jadwal ? jadwal.kode_lokasi : "-",
    nama_lokasi: namaLokasi,
    id_mesin: jadwal ? jadwal.id_mesin : "-",
    jenis_kunjungan: jadwal ? jadwal.tipe : "-",
    terjadwal,
    waktu_mulai: waktuMulai,
    waktu_selesai: waktuSelesai,
    durasi: `${durasi} menit`,
  };

  // --- bagian KONDISI ---
  document
    .querySelectorAll(
      "#section-kondisi select, #section-kondisi input[type='number']"
    )
    .forEach((el) => {
      const rawLabel = el
        .closest("label")
        .querySelector("span")
        .textContent.trim();
      const clean = normalizeLabel(rawLabel);
      const key = kondisiMap[clean] || clean.toLowerCase().replace(/\s+/g, "_");
      if (el.value && el.value !== "-") {
        kunjungan[key] = el.value;
      }
    });

  // FOTO VISUAL // Memastikan hanya elemen di dalam #section-visual yang diproses
  document
    .querySelectorAll("#section-visual input[type='file']")
    .forEach((el) => {
      if (el.files.length > 0) {
        const rawLabel = el
          .closest("label")
          .querySelector("span")
          .textContent.trim();
        const clean = normalizeLabel(rawLabel);
        const key = fotoMap[clean];
        if (key) {
          kunjungan[key] = `uploads/${kodeKunjungan}-${key}.jpg`;
        } else {
          // Logika fallback diubah: hanya menambahkan foto_lainnya jika ada label lain
          if (!kunjungan.foto_lainnya) {
            kunjungan.foto_lainnya = `uploads/${kodeKunjungan}-foto_lainnya.jpg`;
          }
          console.warn(`Label foto tidak ditemukan di fotoMap: ${clean}`);
        }
      }
    });

  // --- Bagian TEMUAN ---
  const temuanList = [];
  for (const card of document.querySelectorAll("#temuanContainer > div")) {
    const jenis = card.querySelector("select").value;
    const foto = card.querySelector("input[type='file']")?.files[0];
    if (jenis && jenis !== "-") {
      const nomorTiket = generateNomorTiket(user.kode_user);
      temuanList.push({
        nomor_tiket: nomorTiket,
        kode_kunjungan: kodeKunjungan,
        tanggal,
        kode_user: user.kode_user,
        kode_lokasi: kunjungan.kode_lokasi,
        temuan: jenis,
        foto_temuan: foto
          ? `uploads/${nomorTiket}-${jenis
              .toLowerCase()
              .replace(/\s+/g, "-")}.jpg`
          : null,
      });
    }
  }

  // --- Simpan ke localStorage ---
  const belum = getData("belumTerkirim");
  belum.push({ kunjungan, temuan: temuanList });
  saveData("belumTerkirim", belum);

  try {
    if (durationInterval) clearInterval(durationInterval);

    // --- kirim kunjungan ke server ---
    await fetch("http://localhost:3000/kunjungan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kunjungan),
    });

    // --- kirim temuan ke server ---
    for (const t of temuanList) {
      await fetch("http://localhost:3000/temuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
    }

    // --- pindahkan ke arsip ---
    const arsip = getData("arsip");
    arsip.push({ kunjungan, temuan: temuanList });
    saveData("arsip", arsip);

    // --- hapus dari belumTerkirim ---
    const updatedBelum = getData("belumTerkirim").filter(
      (k) => k.kunjungan.kode_kunjungan !== kodeKunjungan
    );
    saveData("belumTerkirim", updatedBelum);

    alert("Checklist berhasil disimpan!");
    clearWaktuMulai();
    setTimeout(goBack, 0);
  } catch (err) {
    console.warn("Gagal sync ke server, simpan lokal:", err);

    // tetap masuk arsip juga
    const arsip = getData("arsip");
    arsip.push({ kunjungan, temuan: temuanList });
    saveData("arsip", arsip);

    alert("Tidak ada koneksi. Data disimpan lokal (belum terkirim).");
    clearWaktuMulai();
    setTimeout(goBack, 0);
  }
}

function tampilChecklist(kunjungan, temuanList) {
  if (!kunjungan) return;

  console.log("tampil data:", kunjungan);

  // tampil kondisi (select / number)
  Object.keys(kondisiMap).forEach((label) => {
    const key = kondisiMap[label];
    const value = kunjungan[key];
    if (value) {
      const field = [
        ...document.querySelectorAll(
          "#section-kondisi select, #section-kondisi input[type='number']"
        ),
      ].find((el) => {
        const span = el.closest("label")?.querySelector("span");
        return normalizeLabel(span.textContent) === normalizeLabel(label);
      });
      if (field) field.value = value;
    }
  });

  // tampil visual (foto)
  Object.keys(fotoMap).forEach((label) => {
    const key = fotoMap[label];
    const value = kunjungan[key];
    if (value) {
      const input = [
        ...document.querySelectorAll("#section-visual input[type='text']"),
      ].find((el) => {
        const span = el.closest("label")?.querySelector("span");
        return normalizeLabel(span.textContent) === normalizeLabel(label);
      });
      if (input) input.value = value;
    }
  });

  // tampil temuan
  const container = document.getElementById("temuanContainer");
  container.innerHTML = "";
  temuanList
    .filter((t) => t.kode_kunjungan === kunjungan.kode_kunjungan)
    .forEach((t) => {
      const card = document.createElement("div");
      card.className =
        "relative p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 shadow space-y-3";
      card.innerHTML = `
        <label class="flex flex-col text-sm">
          <span class="mb-2">Jenis Temuan</span>
          <select disabled class="w-full border rounded p-2 text-gray-600 dark:text-gray-400 dark:bg-gray-600 dark:border-gray-500">
            <option>-</option>
            <option ${
              t.temuan === "Kebersihan" ? "selected" : ""
            }>Kebersihan</option>
            <option ${
              t.temuan === "Kerusakan Fisik" ? "selected" : ""
            }>Kerusakan Fisik</option>
            <option ${
              t.temuan === "Kelistrikan" ? "selected" : ""
            }>Kelistrikan</option>
            <option ${t.temuan === "Lainnya" ? "selected" : ""}>Lainnya</option>
          </select>
        </label>
        <label class="flex flex-col text-sm">
          <span class="mb-2">Foto Temuan</span>
          <input
              disabled
              type="text"
              class="w-full border rounded p-2 text-gray-600 dark:text-gray-400 dark:bg-gray-600 dark:border-gray-500"
              value="${t.foto_temuan}"
            /></input>
        </label>
      `;
      container.appendChild(card);
    });

  // Tampilkan Durasi tersimpan jika ada
  const displayElement = document.getElementById("durationDisplay");
  if (displayElement && kunjungan.durasi) {
    displayElement.textContent = `Durasi: ${kunjungan.durasi}`;

    // Opsional: atur warna durasi tersimpan menjadi netral/hijau
    displayElement.classList.remove("text-gray-700", "dark:text-gray-300");
    displayElement.classList.add("text-green-600", "dark:text-green-400");
  }
}

async function tampilChecklistDariServer() {
  const params = new URLSearchParams(window.location.search);
  const kodeKunjungan = params.get("kode_kunjungan");
  if (!kodeKunjungan) return;

  let kunjungan = null;
  let temuanList = [];

  try {
    // coba fetch dari server
    const resKunjungan = await fetch(
      `http://localhost:3000/kunjungan?kode_kunjungan=${kodeKunjungan}`
    );
    const dataKunjungan = await resKunjungan.json();
    kunjungan = dataKunjungan[0] || null;

    const resTemuan = await fetch(
      `http://localhost:3000/temuan?kode_kunjungan=${kodeKunjungan}`
    );
    temuanList = await resTemuan.json();
  } catch (err) {
    console.warn("Offline, pakai localStorage:", err);

    const arsip = getData("arsip");
    const temuanLocal = getData("temuan");

    kunjungan = arsip.find((k) => k.kode_kunjungan === kodeKunjungan) || null;
    temuanList = temuanLocal.filter((t) => t.kode_kunjungan === kodeKunjungan);
  }

  if (kunjungan) tampilChecklist(kunjungan, temuanList);
}

// ======================
// Fungsi update status section
// ======================
function updateSectionStatus(section) {
  if (!section) return;

  const icon = section.querySelector(".check-icon");
  if (!icon) return;

  const requiredFields = section.querySelectorAll("[required]");

  let allFilled = Array.from(requiredFields).every((f) => {
    if (f.type === "file") {
      return f.files.length > 0;
    }
    if (f.tagName.toLowerCase() === "select") {
      return f.value && f.value.trim() !== "" && f.value !== "-";
    }
    return f.value && f.value.trim() !== "";
  });

  if (section.id === "section-temuan") {
    const cards = section.querySelectorAll("#temuanContainer > div");
    if (cards.length > 0) {
      allFilled = Array.from(cards).every((card) => {
        const select = card.querySelector("select");
        const file = card.querySelector("input[type='file']");
        return (
          select &&
          select.value &&
          select.value !== "-" &&
          file &&
          file.files.length > 0
        );
      });
    } else {
      allFilled = false;
    }
  }

  if (allFilled) {
    icon.classList.remove("!hidden");
  } else {
    icon.classList.add("!hidden");
  }
  updateSaveButton();
}

function updateDurasi() {
  const startTimeStr = localStorage.getItem("waktu_mulai");
  const displayElement = document.getElementById("durationDisplay");

  if (!startTimeStr) {
    if (displayElement) {
      displayElement.textContent = "Durasi: N/A";
    }
    return;
  }

  // Mengurai waktu mulai dari format HH:MM:SS
  const fixTime = (t) => t.replace(/\./g, ":");
  const timeParts = fixTime(startTimeStr).split(":");

  // Pastikan ada 3 bagian (Jam, Menit, Detik)
  if (timeParts.length < 3) {
    console.error("Format waktu mulai salah. Harus HH:MM:SS.");
    return;
  }

  const [hMulai, mMulai, sMulai] = timeParts.map(Number);

  const now = new Date();
  // Gunakan tanggal hari ini untuk membuat objek waktu mulai
  const startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hMulai,
    mMulai,
    sMulai
  );

  // Hitung selisih dalam milidetik
  let diffMs = now.getTime() - startTime.getTime();

  // Penyesuaian jika melewati tengah malam
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000;
  }

  // Hitung total detik
  const totalSeconds = Math.floor(diffMs / 1000);

  // Hitung menit (untuk tampilan) dan detik (untuk tampilan)
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Perbarui variabel global yang dipakai di updateSaveButton
  currentDurationMinutes = minutes;

  // Formatting MM:SS (tambahkan nol di depan jika kurang dari 10)
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // Tampilkan di footer
  if (displayElement) {
    const displayStr = `Durasi: ${formattedMinutes}:${formattedSeconds}`;
    displayElement.textContent = displayStr;

    // Tentukan pasangan kelas yang akan digunakan
    const redText = "text-red-700";
    const darkRedText = "dark:text-red-300";
    const greenText = "text-green-600";
    const darkGreenText = "dark:text-green-400";

    // Pengecekan Durasi Minimum
    if (currentDurationMinutes >= MIN_DURATION_MINUTES) {
      // Jika durasi terpenuhi: Tambahkan Hijau, Hapus Abu-abu
      displayElement.classList.add(greenText, darkGreenText);
      displayElement.classList.remove(redText, darkRedText);
    } else {
      // Jika durasi BELUM terpenuhi: Tambahkan Abu-abu, Hapus Hijau
      displayElement.classList.add(redText, darkRedText);
      displayElement.classList.remove(greenText, darkGreenText);
    }
  }

  // Panggil updateSaveButton
  updateSaveButton();
}

// ======================
// Fungsi update status tombol simpan
// ======================
function updateSaveButton() {
  const allSectionsFilled = Array.from(
    document.querySelectorAll("details")
  ).every((section) => {
    if (section.id === "section-temuan") {
      const cards = section.querySelectorAll("#temuanContainer > div");
      if (cards.length === 0) {
        return true;
      }
    }
    const checkIcon = section.querySelector(".check-icon");
    return checkIcon && !checkIcon.classList.contains("!hidden");
  });

  // Pengecekan Durasi Minimum
  const isMinimumDurationMet = currentDurationMinutes >= MIN_DURATION_MINUTES;
  // Kondisi Akhir: Lengkap DAN Durasi Minimum terpenuhi
  const canSave = allSectionsFilled && isMinimumDurationMet;

  if (saveBtn) {
    if (canSave) {
      saveBtn.disabled = false;
      saveBtn.classList.remove("opacity-50", "cursor-not-allowed");
      saveBtn.classList.add("cursor-pointer");
    } else {
      saveBtn.disabled = true;
      saveBtn.classList.add("opacity-50", "cursor-not-allowed");
      saveBtn.classList.remove("cursor-pointer");
    }
  }
}

// ======================
// Inisialisasi setelah DOM siap
// ======================
document.addEventListener("DOMContentLoaded", () => {
  // --- param dari URL ---
  const params = new URLSearchParams(window.location.search);
  const kodeLokasi = params.get("kode_lokasi");
  const kodeKunjungan = params.get("kode_kunjungan");
  const isArsip = params.get("arsip") === "1";
  const isReadOnly =
    isArsip || (kodeKunjungan && params.get("from") === "belum_terkirim");

  // --- tampilkan nama lokasi berdasarkan kode lokasi ---
  // bisa langsung tampilkan kodeLokasi, atau cari nama lokasi dari localStorage jika ada
  if (kodeLokasi && document.getElementById("namaLokasi")) {
    // Jika kamu punya data jadwal tersimpan di localStorage, kita ambil nama lokasi-nya dari situ
    const jadwal = getData("jadwal") || [];
    const dataLokasi = jadwal.find((j) => j.kode_lokasi === kodeLokasi);
    document.getElementById("namaLokasi").textContent = dataLokasi
      ? dataLokasi.lokasi
      : kodeLokasi;
  }

  // Tampilkan data checklist
  tampilChecklistDariServer(); // --- LOGIKA PENGUNCIAN FORMULIR --- // --- inisialisasi saveBtn dan Event Listener ---

  // --- inisialisasi waktu & theme ---
  initializeWaktuMulai();
  if (typeof initTheme === "function") {
    initTheme();
  }

  // Inisialisasi tombol simpan
  saveBtn = document.getElementById("saveBtn"); // Gunakan ID baru dari markup HTML
  if (saveBtn) {
    // 1. Tambahkan Event Listener (Hanya jika tidak dalam mode Read-Only)
    if (!isReadOnly) {
      // Lebih baik menggunakan isReadOnly yang sudah kita definisikan
      saveBtn.addEventListener("click", simpanChecklist);
      // --- START DURASI BERJALAN HANYA SAAT AKTIF ---
      if (durationInterval) clearInterval(durationInterval); // Jalankan update sekarang
      updateDurasi();
      durationInterval = setInterval(updateDurasi, 1000);
    } else {
      // 2. Jika Read-Only, sembunyikan/nonaktifkan tombol (sebagai tindakan pencegahan ekstra)
      saveBtn.classList.add("hidden");
    }
  }

  // --- LOGIKA PENGUNCIAN FORMULIR (Read-Only) ---
  if (isReadOnly) {
    // 1. Ganti input file menjadi teks biasa
    document.querySelectorAll("input[type='file']").forEach((fileInput) => {
      fileInput.type = "text";
    });

    // 2. Kunci semua input, select, dan textarea
    document.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = true;
      field.classList.add("text-gray-600", "dark:text-gray-400");
      field.classList.remove("cursor-pointer");
    });

    // 3. Sembunyikan Tombol Simpan (atau ganti teks)
    saveBtn = document.getElementById("saveBtn"); // Gunakan ID baru dari markup HTML
    if (saveBtn) {
      saveBtn.classList.add("hidden"); // Gunakan Tailwind untuk menyembunyikan
    }

    // 4. Sembunyikan Tombol Tambah Temuan (jika ada)
    const btnTambah = document.getElementById("btnTambahTemuan");
    if (btnTambah) {
      btnTambah.classList.add("hidden");
    }
  }

  // --- behavior accordion ---
  const sections = document.querySelectorAll("details");
  sections.forEach((sec) => {
    sec.addEventListener("toggle", () => {
      if (sec.open) {
        sections.forEach((other) => {
          if (other !== sec) other.removeAttribute("open");
        });
      }
    });

    sec.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => updateSectionStatus(sec));
      field.addEventListener("change", () => updateSectionStatus(sec));
    });

    updateSectionStatus(sec);
  });

  // --- temuan dynamic card ---
  const container = document.getElementById("temuanContainer");
  const btnTambah = document.getElementById("btnTambahTemuan");

  if (btnTambah && container) {
    btnTambah.addEventListener("click", () => {
      const card = document.createElement("div");
      card.className =
        "relative p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 shadow space-y-3";
      card.innerHTML = `
        <button type="button" class="absolute top-2 right-2 text-red-600 hover:text-red-700" title="Hapus">
          <span class="material-symbols-rounded">cancel</span>
        </button>
        <label class="flex flex-col text-sm">
          <span class="mb-2">Jenis Temuan</span>
          <select class="w-full border rounded p-2 dark:bg-gray-600 dark:border-gray-500" required>
            <option>-</option>
            <option>Kebersihan</option>
            <option>Kerusakan Fisik</option>
            <option>Kelistrikan</option>
            <option>Lainnya</option>
          </select>
        </label>
        <label class="flex flex-col text-sm">
          <span class="mb-2">Foto Temuan</span>
          <input type="file" accept="image/*" capture="camera"
            class="w-full border rounded p-2 dark:bg-gray-600 dark:border-gray-500" required />
        </label>
      `;

      card.querySelector("button").addEventListener("click", () => {
        card.remove();
        updateSectionStatus(document.getElementById("section-temuan"));
      });

      card.querySelectorAll("input, select").forEach((field) => {
        field.addEventListener("input", () =>
          updateSectionStatus(document.getElementById("section-temuan"))
        );
        field.addEventListener("change", () =>
          updateSectionStatus(document.getElementById("section-temuan"))
        );
      });

      container.appendChild(card);
      updateSectionStatus(document.getElementById("section-temuan"));
    });
  }
});

// ==================
// GO BACK
// ==================
function goBack() {
  const last = localStorage.getItem("lastState");
  let target = "app.html#home";
  if (last) {
    const state = JSON.parse(last);
    target = `app.html#${state.page}${state.tab ? "/" + state.tab : ""}`;
  }
  clearWaktuMulai();
  window.location.href = target;
}
