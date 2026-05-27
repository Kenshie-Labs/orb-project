---
title: "testing first"
excerpt: "tanpa direktori sub folder."
date: 2024-01-01
---

# KONVENSI COMMIT GIT (CONVENTIONAL COMMITS)

## 1. STRUKTUR DASAR

Format pesan commit mengikuti pola berikut:

```text
<tipe>(<scope>): <deskripsi>
```

```text
[body opsional]
````

```text
[footer opsional]
```

Keterangan:
- `<tipe>:` Jenis perubahan (wajib).
- `(<scope>):` Lingkup perubahan (opsional, dalam tanda kurung).
- `<deskripsi>:` Ringkasan singkat perubahan (wajib).
- `[body]:` Penjelasan detail (opsional, pisahkan dengan satu baris kosong).
- `[footer]:` Referensi isu atau perubahan merusak (opsional).


## 2. JENIS-JENIS TIPE (TYPE)

Gunakan kata kunci berikut untuk mengklasifikasikan commit:

- feat: Menambahkan fitur baru (meningkatkan versi MINOR).
- fix: Memperbaiki bug (meningkatkan versi PATCH).
- docs: Perubahan pada dokumentasi.
- style: Perubahan format kode (spasi, indentasi) tanpa mengubah logika.
- refactor: Perubahan struktur kode tanpa mengubah perilaku.
- perf: Perubahan untuk meningkatkan performa.
- test: Menambahkan atau memperbaiki pengujian.
- build: Perubahan pada sistem build atau dependensi.
- ci: Perubahan pada konfigurasi CI/CD.
- chore: Tugas pemeliharaan lainnya.
- revert: Membatalkan commit sebelumnya.

## 3. CONTOH PENGGUNAAN

a. Commit Fitur Baru:
feat: tambahkan fitur login pengguna
feat(auth): implementasi OAuth2 Google

b. Commit Perbaikan Bug:
fix: perbaiki error pada kalkulasi total harga
fix(cart): handle item dengan jumlah nol

c. Commit Dokumentasi:
docs: perbarui instruksi instalasi di README
docs(api): tambahkan contoh penggunaan endpoint user

d. Commit Perubahan Merusak (Breaking Change):
Gunakan tanda seru (!) setelah tipe atau footer BREAKING CHANGE.

feat(api)!: hapus endpoint versi lama
chore!: hentikan dukungan untuk Node.js 14
BREAKING CHANGE: API sekarang memerlukan token autentikasi di header.

e. Commit dengan Body Lengkap:
fix(payment): perbaiki gagal transaksi pada gateway X

Gateway pembayaran sering timeout karena logika retry yang salah.
Perubahan ini mengimplementasikan exponential backoff.

Refs: #123
Reviewed-by: Budi Santoso

## 4. ATURAN PENULISAN (BEST PRACTICES)

- Gunakan kalimat perintah (imperatif): Tulis "tambahkan" bukan "menambahkan" atau "ditambahkan".
- Huruf kecil: Gunakan huruf kecil untuk tipe dan deskripsi (kecuali nama diri).
- Tanpa titik: Jangan akhiri baris pertama (subjek) dengan tanda titik.
- Batas karakter: Usahakan baris pertama maksimal 50 karakter.
- Pisahkan body: Selalu beri satu baris kosong antara judul dan body.
- Wrap body: Batasi panjang baris body sekitar 72 karakter agar rapi di terminal.

## 5. MANFAAT KONVENSI INI

- Changelog Otomatis: Alat dapat membuat daftar perubahan secara otomatis.
- Penomoran Versi: Menentukan kenaikan versi (Major, Minor, Patch) secara otomatis.
- Kejelasan: Memudahkan tim memahami riwayat perubahan kode.
- Standar Industri: Format yang diakui secara luas dalam ekosistem pengembang.   