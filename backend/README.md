# Toko Sepatu - LangkahKita

Web e-commerce sepatu sederhana. Backend: Node.js + Express + MySQL. Frontend: HTML/CSS/JS biasa.

## Struktur Project

```
toko-sepatu-backend/    -> REST API
toko-sepatu-frontend/   -> Tampilan web (buka dengan Live Server / http-server)
```

## Cara Setup

### 1. Setup Database
Pastikan MySQL sudah terinstall dan berjalan. Lalu jalankan:
```bash
mysql -u root -p < toko-sepatu-backend/database/schema.sql
```
Ini akan membuat database `toko_sepatu` beserta semua tabelnya.

### 2. Setup Backend
```bash
cd toko-sepatu-backend
npm install
cp .env.example .env
```
Edit file `.env` sesuai konfigurasi MySQL kamu (user, password, dll).

Jalankan server:
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`

### 3. Buat Akun Admin
Karena registrasi default selalu jadi role `user`, kamu perlu ubah salah satu user jadi admin manual lewat MySQL setelah register:
```sql
UPDATE users SET role = 'admin' WHERE email = 'emailkamu@contoh.com';
```

### 4. Setup Frontend
Buka folder `toko-sepatu-frontend` dengan ekstensi **Live Server** (VS Code) atau jalankan:
```bash
cd toko-sepatu-frontend
npx http-server -p 5500
```
Lalu akses di browser: `http://localhost:5500`

> Pastikan backend (port 3000) sudah jalan duluan sebelum membuka frontend.

## Fitur

- Register & Login (JWT)
- Katalog produk + search & filter (nama, brand, kategori, rentang harga)
- Detail produk + review & rating
- Keranjang belanja
- Checkout & riwayat pesanan
- Panel admin: kelola produk, lihat pesanan & user

## Catatan

Web ini dibuat dengan pola coding standar (tanpa sengaja menanam vulnerability).
Cocok dipakai untuk latihan security testing (misal: SQL Injection) di endpoint-endpoint
seperti login, search produk, filter, dll — silakan eksplorasi sendiri titik-titik mana
yang berisiko dan bagaimana cara memperbaikinya.
