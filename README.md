# Predictive Lead Scoring for Bank Marketing

Proyek ini bertujuan untuk memprediksi probabilitas seorang nasabah (client) akan berlangganan (deposito berjangka) setelah kampanye pemasaran telemarketing (Bank Marketing Data Set) dan memberikan scoring prioritas untuk tim sales.

Aplikasi frontend ini dibangun sebagai Single Page Application (SPA) dengan React, Tailwind CSS, dan Chart.js, terintegrasi penuh dengan layanan backend untuk autentikasi, prediksi Machine Learning (ML), dan manajemen data nasabah.

## Teknologi yang Digunakan

**Frontend**

**Framework:** React (Vite)
**Styling & UI:** Tailwind CSS, Shadcn UI (Custom Components)
**Visualisasi Data:** Chart.js (untuk menampilkan statistik lead)

**Backend & API**

**Layanan:** Node.js / Express (asumsi)
**Model ML:** Terintegrasi melalui endpoint /api/predict

## Instalasi dan Setup (Simulasi Lingkungan Vite)

Karena proyek ini dikembangkan sebagai aplikasi React standar, berikut langkah-langkah untuk menjalankan proyek di lingkungan lokal (asumsi menggunakan npm/yarn):

**Clone Repositori:**

```git clone [LINK_REPOSITORY_ANDA]
cd predictive-leadscoring-bank


Instalasi Dependensi:

npm install
# atau
pnpm install


Jalankan Aplikasi:

npm run dev
# atau
pnpm dev
```

Aplikasi akan berjalan di http://localhost:5173 (atau port default Vite).

## Autentikasi dan Kredensial

Aplikasi ini menggunakan JWT (JSON Web Tokens) untuk mengamankan endpoint manajemen data nasabah.

* **Tipe Akun**
* **Email Default (Dapat digunakan untuk Demo)**
* **Password Default**
* **Admin/Sales**


Catatan: Kredensial di atas harus didaftarkan terlebih dahulu melalui form Register jika belum ada di database backend. Token yang berhasil didapat akan disimpan di localStorage.

## Struktur Folder

Aplikasi dipecah menjadi modul-modul untuk pemeliharaan yang lebih mudah:

```
src/
├── api/              # Klien API (apiClient) dan konfigurasi BASE_URL
├── auth/             # Komponen Login dan Register (AuthForms)
├── components/       # Komponen UI Reusable (ui, charts)
├── data/             # Mock Data dan Konstanta
├── layout/           # Struktur Tata Letak Utama (DashboardLayout)
├── pages/            # Halaman utama (Dashboard, Nasabah, Scoring, Prediction)
└── App.jsx           # Komponen Router Utama (SPA Logic)
```

## API Reference (Endpoint Penting)

Semua endpoint terproteksi memerlukan Header: Authorization: Bearer <JWT_TOKEN>.

**1. Prediksi**

* **Endpoint**
* **Keterangan**
* **Status Autentikasi**
* **POST** ```/api/predict```
* **Prediksi Cepat (tanpa menyimpan data nasabah ke database).**
* **PUBLIK (TANPA AUTH)**
* **POST** ```/api/nasabah/predict```

Prediksi dan Simpan hasilnya (termasuk Nama, HP, dll.) ke database.

PROTECTED (Memerlukan Token)

**2. Manajemen Lead Nasabah**

* **Endpoint**
*  **Keterangan**
* **Method**
* **GET** ```/api/nasabah```
* **Mengambil daftar nasabah (digunakan di Tabel Lead Nasabah).**
* **GET**
* **PATCH** ```/api/nasabah/:id/status```
* **Mengubah status follow-up nasabah (contoh: called, failed, not_interested).**
* **PATCH**

**3. Ringkasan Admin**

Endpoint
Keterangan
Method
GET /api/admin/summary
Mengambil data ringkasan dashboard (Total Nasabah, ringkasan Prediksi, dan status Call Tracking).
GET

## Fitur Utama Dashboard

Prediksi Baru (/predict):

* Formulir lengkap untuk memasukkan 15+ fitur ML.
* Opsi Prediksi Cepat (tanpa login).
* Opsi Prediksi & Simpan Nasabah (memerlukan login).
* Statistik & Ringkasan ```(/dashboard)```: Menampilkan ringkasan volume lead, tingkat konversi (mock), dan statistik penting lainnya menggunakan Chart.js.
Tabel Lead Nasabah ```(/nasabah)```: Menampilkan daftar nasabah dengan skor prioritas (prediksi) dan menyediakan tombol aksi cepat untuk memperbarui status kontak (Panggil, Gagal Kontak, Tdk Berminat).