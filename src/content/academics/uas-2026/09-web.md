---
title: "ujian Web"
excerpt: "Tafsir kisi kisi p pauzy."
date: 2026-06-04
---

:::tip
yang sabar aja ya bos, emang rumit aseli 😑😩💀
:::

## Overview

Intinya di ujian mapel web ini yang jadi pertanyaan adalah bahasa pemrograman PHP-nya

### 1. Data Produk

**Yang ditanyakan:** Sebuah toko ingin menyimpan data produk: nama, harga, stok, dan status tersedia. Tentukan tipe data yang tepat, lalu buat kode PHP-nya dan tampilkan menggunakan `echo`.  
**Jawaban:**

```php
<?php
$nama = "Pensil";
$harga = 2500.00;
$stok = 100;
$status = true;

echo "Nama: $nama<br>";
echo "Harga: Rp$harga<br>";
echo "Stok: $stok<br>";
echo "Tersedia: " . ($status ? "Ya" : "Tidak");
?>
```

---

### 2. Total Biaya Study Tour

**Yang ditanyakan:** OSIS ingin menghitung total biaya study tour dari harga bus, biaya makan per hari, dan jumlah hari. Buat program PHP dengan variabel dan operator aritmatika, lalu tampilkan hasilnya dalam format rupiah.  
**Jawaban:**

```php
<?php
$bus = 3000000;
$makan = 50000;
$hari = 3;
$total = $bus + ($makan * $hari);
echo "Total biaya: Rp" . number_format($total, 0, ',', '.');
?>
```

---

### 3. Status Kelulusan

**Yang ditanyakan:** Buat program PHP untuk menentukan status kelulusan siswa: nilai ≥75 = Lulus, 60–74 = Remidi, <60 = Tidak Lulus. Gunakan `if-elseif-else` dan uji dengan 3 nilai berbeda.  
**Jawaban:**

```php
<?php
$nilai = [80, 65, 50];
foreach ($nilai as $n) {
    if ($n >= 75) echo "$n = Lulus<br>";
    elseif ($n >= 60) echo "$n = Remidi<br>";
    else echo "$n = Tidak Lulus<br>";
}
?>
```

---

### 4. Ekskul (Switch-Case)

**Yang ditanyakan:** Siswa memilih ekstrakurikuler dengan memasukkan kode (1–5). Buat program PHP menggunakan `switch-case` yang menampilkan nama ekskul dan jadwal latihan, serta pesan error jika kode tidak valid.  
**Jawaban:**

```php
<?php
$kode = 3;
switch ($kode) {
    case 1: echo "Basket - Selasa 15.00"; break;
    case 2: echo "Futsal - Rabu 15.00"; break;
    case 3: echo "Paduan Suara - Kamis 14.00"; break;
    case 4: echo "Pramuka - Jumat 13.00"; break;
    case 5: echo "Tari - Sabtu 10.00"; break;
    default: echo "Kode tidak valid";
}
?>
```

---

### 5. Kelayakan Beasiswa

**Yang ditanyakan:** Beasiswa diberikan jika nilai ≥85 dan hadir ≥90%, atau siswa kurang mampu dengan nilai ≥75. Buat program PHP menggunakan operator logika `&&` dan `||` untuk menentukan kelayakan.  
**Jawaban:**

```php
<?php
$nilai = 80;
$hadir = 92;
$kurangMampu = false;

$layak = ($nilai >= 85 && $hadir >= 90) || ($kurangMampu && $nilai >= 75);
echo $layak ? "Layak Beasiswa" : "Tidak Layak";
?>
```

---

### 6. Hari & Jam Sekolah

**Yang ditanyakan:** Buat program PHP menggunakan `for` untuk menampilkan hari sekolah (Senin–Jumat) beserta nomornya. Tambahkan nested loop untuk menampilkan jam pelajaran 1–8 di setiap harinya.  
**Jawaban:**

```php
<?php
$hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
for ($i = 0; $i < count($hari); $i++) {
    echo "$hari[$i]<br>";
    for ($j = 1; $j <= 8; $j++) {
        echo "- Jam $j<br>";
    }
}
?>
```

---

### 7. Cicilan Pinjaman

**Yang ditanyakan:** Koperasi sekolah memberi pinjaman Rp1.200.000 dengan cicilan Rp200.000/bulan. Buat program PHP menggunakan `while` yang menampilkan tabel cicilan tiap bulan hingga pinjaman lunas.  
**Jawaban:**

```php
<?php
$pinjaman = 1200000;
$cicilan = 200000;
$bulan = 1;

while ($pinjaman > 0) {
    echo "Bulan $bulan: Sisa Rp" . number_format($pinjaman, 0, ',', '.') . "<br>";
    $pinjaman -= $cicilan;
    $bulan++;
}
?>
```

---

### 8. Nilai Ulangan

**Yang ditanyakan:** Tersedia data nilai ulangan 10 siswa dalam array. Gunakan `foreach` untuk menampilkan semua nilai, lalu hitung dan tampilkan nilai tertinggi, terendah, dan rata-rata kelas.  
**Jawaban:**

```php
<?php
$nilai = [70, 85, 90, 60, 75, 88, 92, 55, 80, 78];
foreach ($nilai as $n) echo "$n<br>";

echo "Tertinggi: " . max($nilai) . "<br>";
echo "Terendah: " . min($nilai) . "<br>";
echo "Rata-rata: " . array_sum($nilai)/count($nilai);
?>
```

---

### 9. Buku Perpustakaan

**Yang ditanyakan:** Buat array asosiatif untuk menyimpan data 5 buku perpustakaan (judul, pengarang, status). Tampilkan semua buku menggunakan perulangan, lalu filter hanya yang berstatus 'tersedia'.  
**Jawaban:**

```php
<?php
$buku = [
    ["judul"=>"Laskar Pelangi","pengarang"=>"Andrea Hirata","status"=>"tersedia"],
    ["judul"=>"Negeri 5 Menara","pengarang"=>"A. Fuadi","status"=>"dipinjam"],
    ["judul"=>"Bumi","pengarang"=>"Tere Liye","status"=>"tersedia"],
    ["judul"=>"Dilan","pengarang"=>"Pidi Baiq","status"=>"dipinjam"],
    ["judul"=>"Ayah","pengarang"=>"Andrea Hirata","status"=>"tersedia"]
];

foreach ($buku as $b) {
    if ($b["status"] == "tersedia")
        echo "{$b['judul']} - {$b['pengarang']}<br>";
}
?>
```

---

### 10. Nilai Siswa (Array Multidimensi)

**Yang ditanyakan:** Buat array multidimensional untuk menyimpan nilai 5 siswa pada 3 mata pelajaran. Gunakan nested loop untuk menampilkan data dalam bentuk tabel dan hitung rata-rata nilai setiap siswa.  
**Jawaban:**

```php
<?php
$nilai = [
    ["Ani"=>[80,85,90]],
    ["Budi"=>[70,75,80]],
    ["Cici"=>[90,88,92]],
    ["Deni"=>[60,65,70]],
    ["Eka"=>[85,80,88]]
];

foreach ($nilai as $siswa) {
    foreach ($siswa as $nama=>$n) {
        $rata = array_sum($n)/count($n);
        echo "$nama: " . implode(", ", $n) . " | Rata: $rata<br>";
    }
}
?>
```

---
