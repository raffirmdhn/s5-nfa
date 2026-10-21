-- ========================================================
-- DESAIN BASIS DATA HASIL NORMALISASI 3NF
-- Mahasiswa : Raffi Ramadhan
-- NIM       : 0110224204
-- Kampus    : STT Terpadu Nurul Fikri
-- ========================================================

CREATE DATABASE IF NOT EXISTS db_penugasan;
USE db_penugasan;

-- 1. Tabel Master Personel
CREATE TABLE IF NOT EXISTS personel (
    id_personel INT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    alamat VARCHAR(150),
    kesatuan VARCHAR(20),
    agama VARCHAR(20)
);

-- 2. Tabel Master Kota (Eliminasi Transitive Dependency Kota -> Wilayah)
CREATE TABLE IF NOT EXISTS kota (
    kota VARCHAR(50) PRIMARY KEY,
    wilayah VARCHAR(50) NOT NULL
);

-- 3. Tabel Surat Tugas (Tabel Transaksi / Penugasan)
CREATE TABLE IF NOT EXISTS surat_tugas (
    no_surat_tugas VARCHAR(50) PRIMARY KEY,
    id_personel INT NOT NULL,
    mulai DATE NOT NULL,
    akhir DATE NOT NULL,
    kota VARCHAR(50) NOT NULL,
    CONSTRAINT fk_surat_tugas_personel FOREIGN KEY (id_personel) 
        REFERENCES personel(id_personel) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_surat_tugas_kota FOREIGN KEY (kota) 
        REFERENCES kota(kota) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- ========================================================
-- DATA DUMMY (Sesuai Soal Tugas)
-- ========================================================

-- Insert Master Kota
INSERT INTO kota (kota, wilayah) VALUES
('Bandung', 'Wilayah II'),
('Jakarta', 'Wilayah II'),
('Medan', 'Wilayah I'),
('Samarinda', 'Wilayah III'),
('Balikpapan', 'Wilayah III'),
('Denpasar', 'Wilayah IV'),
('Yogyakarta', 'Wilayah IV')
ON DUPLICATE KEY UPDATE wilayah=VALUES(wilayah);

-- Insert Master Personel
INSERT INTO personel (id_personel, nama, alamat, kesatuan, agama) VALUES
(1, 'Faiz Fikri', 'Depok 1', 'AD', 'Islam'),
(2, 'John Sadewa', 'Bekasi Timur', 'AD', 'Khatolik'),
(3, 'Dewi Sri', 'Bogor', 'AU', 'Hindu'),
(4, 'Ahmad Bayu', 'Jakarta Timur', 'AL', 'Islam'),
(5, 'Ike Rahayu', 'Tanggerang', 'AL', 'Budha')
ON DUPLICATE KEY UPDATE nama=VALUES(nama);

-- Insert Data Surat Tugas
INSERT INTO surat_tugas (no_surat_tugas, id_personel, mulai, akhir, kota) VALUES
('ST.001/2008', 1, '2008-01-01', '2008-01-05', 'Bandung'),
('ST.030/2009', 1, '2009-01-06', '2011-04-20', 'Samarinda'),
('ST.021/2011', 1, '2011-04-21', '2014-12-30', 'Jakarta'),
('ST.002/2010', 2, '2010-01-01', '2010-12-31', 'Medan'),
('ST.001/2011', 2, '2011-01-01', '2011-12-31', 'Jakarta'),
('ST.002/2011', 3, '2011-01-01', '2012-12-31', 'Denpasar'),
('ST.008/2011', 4, '2011-01-01', '2012-12-31', 'Jakarta'),
('ST.003/2009', 5, '2009-01-01', '2010-12-31', 'Yogyakarta'),
('ST.100/2010', 5, '2010-01-01', '2011-12-31', 'Balikpapan')
ON DUPLICATE KEY UPDATE kota=VALUES(kota);
