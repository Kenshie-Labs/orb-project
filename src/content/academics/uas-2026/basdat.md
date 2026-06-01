---
title: "ujian Basis Data"
excerpt: "Tafsir kisi kisi basdat dari Bu Dewi."
date: 2026-06-04
---

## Overview

Yah begitulah ~  
Minimal tauk perintah dasar SQL.  
Inget aja tiap akhiran ditutup `;` itu artinya satu perintah.

![gif](https://media.tenor.com/U0-jS5nwtRkAAAAM/tree-wise.gif)

### 1. CREATE DATABASE & TABLE (Sekolah)

**Yang ditanyakan:** Buat database `sekolah` dan tabel `murid` dengan kolom:

```text
--------- ini datanya ----------
- id_murid: Primary Key, AUTO_INCREMENT
- nama_murid: VARCHAR(100)
- tanggal_lahir: DATE
- jenis_kelamin: CHAR(1), hanya boleh 'L' atau 'P'
- no_hp_orang_tua: VARCHAR(20)
- id_kelas: Foreign Key ke tabel kelas
```

**Jawaban:**

```sql
-- step 1:
CREATE DATABASE sekolah;

-- step 2:
USE sekolah;

-- step 3:
CREATE TABLE kelas (
  id_kelas INT PRIMARY KEY AUTO_INCREMENT,
  nama_kelas VARCHAR(50)
);

CREATE TABLE murid (
  id_murid INT PRIMARY KEY AUTO_INCREMENT,
  nama_murid VARCHAR(100),
  tanggal_lahir DATE,
  jenis_kelamin CHAR(1),
  no_hp_orang_tua VARCHAR(20),
  id_kelas INT,
  FOREIGN KEY (id_kelas) REFERENCES kelas(id_kelas)
);
```

---

### 2. ALTER TABLE (Karyawan Toko)

**Yang ditanyakan:** Pada tabel berikut  
`karyawan(id_karyawan, nama, upah, cabang)` lakukan:

1. Tambah kolom `nomor_rekening` bertipe VARCHAR(30) dan UNIQUE
2. Ubah tipe data `upah` dari INT ke DECIMAL(10,2)
3. Hapus kolom `cabang`

**Jawaban:**

```sql
ALTER TABLE karyawan ADD nomor_rekening VARCHAR(30) UNIQUE;
ALTER TABLE karyawan MODIFY upah DECIMAL(10,2);
ALTER TABLE karyawan DROP cabang;
```

---

### 3. UPDATE & DELETE (Menu Restoran)

**Yang ditanyakan:** Tabel `menu(id_menu, nama_menu, kategori, harga, stok)` berisi data:

| id_menu | nama_menu           | kategori | harga | stok |
| ------- | ------------------- | -------- | ----- | ---- |
| 1       | Nasi Goreng Spesial | makanan  | 25000 | 8    |
| 2       | Es Teh Manis        | minuman  | 8000  | 3    |
| 3       | Ayam Bakar          | makanan  | 35000 | 12   |

Tuliskan query untuk:

1. Naikkan harga menu kategori `makanan` sebesar 15%
2. Kurangi stok `Es Teh Manis` sebanyak 1
3. Hapus menu dengan stok kurang dari 5

**Jawaban:**

```sql
UPDATE menu SET harga = harga * 1.15 WHERE kategori = 'makanan';
UPDATE menu SET stok = stok - 1 WHERE nama_menu = 'Es Teh Manis';
DELETE FROM menu WHERE stok < 5;
```

---

### 4. SELECT (Pelanggan Toko Online)

**Yang ditanyakan:** Dari tabel `pelanggan(id, nama, kota, total_belanja, status_member)` tuliskan query untuk:

1. Tampilkan nama dan total_belanja pelanggan dari Surabaya atau Malang dengan total_belanja > 500000, urutkan dari terbesar, batasi 5 data.
2. Tampilkan pelanggan dengan total_belanja antara 200000 hingga 800000.

**Jawaban:**

```sql
SELECT nama, total_belanja
FROM pelanggan
WHERE (kota='Surabaya' OR kota='Malang')
AND total_belanja > 500000
ORDER BY total_belanja DESC
LIMIT 5;

SELECT * FROM pelanggan
WHERE total_belanja BETWEEN 200000 AND 800000;
```

---

### 5. GROUP BY + HAVING (Penjualan Toko)

**Yang ditanyakan:** Dari tabel `penjualan(id_jual, id_produk, nama_kategori, qty, total_harga)` hitung jumlah transaksi, rata-rata, total terbesar, dan total terkecil per kategori. Tampilkan hanya kategori dengan rata-rata total_harga di atas 100000.

**Jawaban:**

```sql
SELECT nama_kategori,
       COUNT(*) AS jumlah,
       AVG(total_harga) AS rata,
       MAX(total_harga) AS terbesar,
       MIN(total_harga) AS terkecil
FROM penjualan
GROUP BY nama_kategori
HAVING AVG(total_harga) > 100000;
```

---

### 6. JOIN (Staf & Jadwal Piket)

**Yang ditanyakan:** Dari tabel `staf(id_staf, nama_staf, divisi)` dan `piket(id_piket, id_staf, hari, lokasi)` tuliskan:

1. INNER JOIN: tampilkan nama_staf, divisi, hari, lokasi untuk staf yang punya jadwal piket.
2. LEFT JOIN: tampilkan semua staf beserta jadwal piketnya.
3. Jelaskan konsep NATURAL JOIN dan risikonya.

**Jawaban:**

```sql
-- INNER JOIN
SELECT staf.nama_staf, staf.divisi, piket.hari, piket.lokasi
FROM staf
INNER JOIN piket ON staf.id_staf = piket.id_staf;

-- LEFT JOIN
SELECT staf.nama_staf, staf.divisi, piket.hari, piket.lokasi
FROM staf
LEFT JOIN piket ON staf.id_staf = piket.id_staf;

-- NATURAL JOIN: otomatis gabung kolom dengan nama sama.
-- Risiko: bisa salah gabung jika ada kolom nama sama tapi arti berbeda.
```

---

### 7. CASE STATEMENT (Kategori Umur)

**Yang ditanyakan:** Dari tabel `pelanggan(id_pelanggan, nama, umur)` buat query CASE untuk menampilkan kolom kategori_umur:

- <18 tahun: Remaja
- 18–30 tahun: Dewasa Muda
- 31–50 tahun: Dewasa
- umurnya >50 tahun: Lansia

**Jawaban:**

```sql
SELECT nama, umur,
CASE
  WHEN umur < 18 THEN 'Remaja'
  WHEN umur >= 18 AND umur <= 30 THEN 'Dewasa Muda'
  WHEN umur >= 31 AND umur <= 50 THEN 'Dewasa'
  ELSE 'Lansia'
END AS kategori_umur
FROM pelanggan;
```

---

### 8. ERD (Tiket Bioskop)

**Yang ditanyakan:** Sistem pemesanan tiket bioskop: entitas Penonton, Film, Studio, Pemesanan. Relasi: Penonton bisa pesan banyak tiket, Film bisa dipesan banyak penonton, Film hanya di satu Studio, Studio bisa memutar banyak Film. Identifikasi entitas, PK, relasi, kardinalitas.

**Jawaban:**

- **Entitas:**

```text
Penonton(id_penonton), Film(id_film), Studio(id_studio), Pemesanan(id_pemesanan)
```

- **Relasi:**

```text
Penonton–Pemesanan (1:N), Film–Pemesanan (1:N), Film–Studio (N:1)
```

- **Kardinalitas:**  
Penonton bisa banyak pemesanan, Film bisa banyak pemesanan, Studio bisa memutar banyak film, tapi satu film hanya di satu studio.

---

### 9. Primary Key (Hotel)

**Yang ditanyakan:** Database hotel: tamu, kamar, reservasi. Developer ingin menjadikan nomor_kamar sebagai PK menggantikan id_kamar. Apakah setuju?

**Jawaban:** Tidak setuju. Nomor_kamar bisa berubah (renovasi, penomoran ulang). PK harus stabil dan unik. id_kamar lebih tepat.

---

### 10. GRANT & REVOKE (Perpustakaan)

**Yang ditanyakan:** Database `db_perpustakaan` digunakan oleh:

- Kepala Perpustakaan: akses penuh
- Petugas: hanya bisa lihat & tambah peminjaman
- Pengunjung: hanya bisa lihat buku  
  Tuliskan perintah SQL untuk membuat user, memberi hak akses, dan REVOKE jika petugas mencoba hapus data.

**Jawaban:**

```sql
-- Kepala
CREATE USER 'kepala' IDENTIFIED BY '123';
GRANT ALL ON db_perpustakaan.* TO 'kepala';

-- Petugas
CREATE USER 'petugas' IDENTIFIED BY '123';
GRANT SELECT, INSERT ON db_perpustakaan.peminjaman TO 'petugas';

-- Pengunjung
CREATE USER 'pengunjung' IDENTIFIED BY '123';
GRANT SELECT ON db_perpustakaan.buku TO 'pengunjung';

-- REVOKE
REVOKE DELETE ON db_perpustakaan.peminjaman FROM 'petugas';
```

---
