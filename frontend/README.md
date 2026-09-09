# 🏥 Mini Clinic Information System

Web-based Mini Clinic Information System untuk membantu proses administrasi dan pelayanan pasien secara terintegrasi, mulai dari pengelolaan data pasien, pendaftaran kunjungan, antrean, hingga pencatatan pemeriksaan dokter.

Project ini dibuat sebagai **Technical Assignment – Programmer Program MagangHub Kemnaker**.

---

## 🚀 Features

### 🔐 Authentication
- Login & Logout
- JWT Authentication
- Role-based Authorization
- Administrator
- Dokter
- Petugas Pendaftaran

### 👤 Patient Management
- Tambah data pasien
- Edit data pasien
- Hapus data pasien
- Detail pasien
- Search pasien
- Pagination
- Auto Generate Nomor Rekam Medis
- Validasi NIK unik

### 📝 Patient Registration
- Pendaftaran kunjungan pasien
- Pemilihan dokter
- Pemilihan poli
- Tanggal kunjungan
- Jenis pembayaran
- Keluhan awal
- Status kunjungan

### 🎫 Queue Management
- Generate nomor antrean otomatis
- Daftar antrean
- Panggil antrean berikutnya
- Update status antrean

### 🩺 Doctor Examination
Pemeriksaan menggunakan metode **SOAP**:
- Subjective – Keluhan pasien
- Objective – Tekanan darah, suhu, berat badan, tinggi badan
- Assessment – Diagnosa
- Plan – Rencana terapi
- Tindakan medis
- Resep obat
- Riwayat pemeriksaan pasien

### 📊 Dashboard
- Total pasien
- Total pasien hari ini
- Total antrean hari ini
- Total pasien menunggu
- Total pasien selesai

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- JWT

**Database**
- MySQL

**API Testing**
- Postman

**Version Control**
- Git & GitHub

---

## 📁 Project Structure

```text
mini-clinic-system/
├── frontend/
├── backend/
├── database/
├── postman/
├── docs/
├── .env.example
└── README.md