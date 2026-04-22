# Proyek Kunjungan (Visit Management System)

Proyek ini adalah sistem manajemen kunjungan yang terdiri dari API Backend (Laravel) dan Frontend Web (Next.js). Dokumen ini bertujuan untuk membantu pengembang dalam menyiapkan lingkungan pengembangan di mesin baru.

## Tech Stack

### Backend
- **Framework**: Laravel 13
- **Bahasa**: PHP 8.3+
- **Database**: PostgreSQL (Supabase)
- **Tooling**: Composer, Artisan

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4, Framer Motion
- **Tooling**: npm, TypeScript

---

## Prasyarat (Prerequisites)

Pastikan Anda telah menginstal software berikut di PC Anda:
1.  **PHP 8.3 atau versi terbaru**
2.  **Composer** (Manajer dependensi PHP)
3.  **Node.js (v20 atau terbaru)** & npm
4.  **Database PostgreSQL** (atau akses ke instance Supabase)
5.  **Git**

---

## Langkah Setup (Instalasi)

### 1. Clone Repositori
```bash
git clone [URL_REPOSITORI]
cd kunjungan
```

### 2. Setup Backend
Masuk ke direktori backend dan jalankan perintah instalasi:
```bash
cd backend

# Salin file environment
cp .env.example .env

# Jalankan skrip setup otomatis (jika ada di composer.json)
composer run setup

# Jika perintah di atas gagal, jalankan secara manual:
# composer install
# php artisan key:generate
# php artisan migrate
```
> [!IMPORTANT]
> Jangan lupa sesuaikan nilai di file `.env` khususnya bagian `DB_HOST`, `DB_USERNAME`, dan `DB_PASSWORD` dengan kredensial database lokal Anda.

### 3. Setup Frontend
Masuk ke direktori frontend dan jalankan perintah berikut:
```bash
cd ../frontend

# Salin file environment
cp .env.example .env.local

# Instal dependensi
npm install
```

---

## Cara Menjalankan Project

### Menjalankan Backend
Di terminal pertama (direktori `backend`):
```bash
php artisan serve
```
Backend akan berjalan di `http://127.0.0.1:8000`.

### Menjalankan Frontend
Di terminal kedua (direktori `frontend`):
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:3000`.

---

## Tips Pengembangan Tim

1.  **Environment Variables**: Selalu perbarui `.env.example` jika Anda menambahkan kunci baru di `.env` agar anggota tim lain tahu variabel apa yang diperlukan.
2.  **Migrasi Database**: Setiap ada perubahan skema database, segera buat migrasi (`php artisan make:migration`) dan bagikan ke tim. Jangan mengubah database secara manual.
3.  **Branching**: Gunakan fitur branch (misal: `feature/nama-fitur`) untuk pengembangan fitur baru agar tidak mengganggu `main` branch.
4.  **Dokumentasi API**: Jika memungkinkan, gunakan tools seperti Postman atau Scalar untuk mendokumentasikan endpoint API.

---

## Troubleshooting Umum

- **Error: `Class "..." not found`**: Jalankan `composer dump-autoload` di folder backend.
- **Error: `Module not found`**: Jalankan `npm install` kembali di folder frontend.
- **Database Connection Refused**: Pastikan PostgreSQL Anda menyala dan kredensial di `.env` sudah benar.
