# Spesifikasi & Prompt Presisi 7 Layar (Sesuai Video Praktikum NF Academy)

Dokumen ini memuat panduan desain dan prompt Stitch berpresisi tinggi dengan layout to-the-point, visual card besar, dan elemen yang persis dengan modul praktikum dosen.

---

## Palet Warna & Karakter Visual

- **Header / CTA Accent**: `#EB6921` (Mustard / Warm Orange khas STTNF)
- **Primary Text**: `#1E293B` (Dark Slate / Hitam Bersih)
- **Secondary Text**: `#64748B` (Muted Gray)
- **Background**: `#FFFFFF` (Card & Content) dan `#F8FAFC` (Canvas Area)
- **Border Input**: `#E2E8F0`
- **Border Radius**: `14px` untuk Card/Image, `8px` untuk Button & Input

---

## 7 Prompt Stitch Berpresisi Tinggi

### Screen 1: Halaman Masuk Aplikasi (Login)
```text
Design a clean, modern desktop login screen (1440x900) matching the minimalist style of NF Academy library portal.

Layout & Elements:
- Center-aligned card container (width: 480px) with clean borders and subtle shadow on a soft background (#F8FAFC):
  1. Top Banner (Height: 280px):
     - Warm Mustard-Orange background (#EB6921) with a soft background photo overlay of an aesthetic open book on a desk.
     - Center text: Large bold white heading (32px) "Halaman Masuk Aplikasi" with subtle subtitle "Perpustakaan Digital STTNF".
  2. Bottom Form Area (White #FFFFFF background, 32px padding):
     - Field 1: Label "Login" in bold dark text (#1E293B), single-line input field with light gray border (#E2E8F0), height 48px, rounded 8px, placeholder "Masukkan NIM atau Username".
     - Field 2: Label "Password" in bold dark text, password input field with light gray border, height 48px, rounded 8px, placeholder "Masukkan Kata Sandi".
     - Action Button: Full-width solid Orange button (#EB6921), height 48px, rounded 8px, bold white text "Masuk".
     - Minimal footer text: "Perpustakaan STT Terpadu Nurul Fikri".
- Strictly avoid complex dashboard panels, sidebars, or cluttered tables.
```

---

### Screen 2: Rekomendasi (Beranda)
```text
Design a minimalist desktop recommendation/home screen (1440x900) for NF Library.

Layout & Elements:
- Top Area: Clean title "Rekomendasi" (32px bold, #1E293B) aligned to the left with 48px margin.
- Center Featured Showcase (Card Slider / Carousel):
  - Large vertical image card (width: 420px, height: 560px) with smooth rounded corners (16px) showing a cozy, aesthetic library bookshelf full of books.
  - Overlay gradient at the bottom of the card with clean white text: Title "Literacy Books" (24px bold) and subtitle "Koleksi Rekomendasi Terbaik Pekan Ini".
  - Subtle pagination indicator dots (3 dots, first dot active in #EB6921).
- Bottom Action Area:
  - Solid Orange CTA button (#EB6921), rounded 8px, padding 14px 32px, bold white text "Buka Katalog Buku →".
- Background: Crisp white (#FFFFFF), clean whitespace, modern editorial feel.
```

---

### Screen 3: Katalog Buku (Grid Cards)
```text
Design a clean desktop book catalog screen (1440x900) for NF Library.

Layout & Elements:
- Top Header:
  - Heading: "Katalog" (32px bold, #1E293B).
  - Search Bar: Clean horizontal search input with search icon, height 44px, placeholder "Cari judul buku, pengarang, atau kategori...".
- Book Grid (2 rows x 3 columns of vertical rounded image cards, width: 260px each):
  1. Card 1 (Focus Book): Cover photo of an open notebook, Title "Shelves", Subtitle "Motivational", Stock badge "Tersedia".
  2. Card 2: Cover photo of a dark artistic book, Title "Stand", Subtitle "Casual Books".
  3. Card 3: Cover photo of vintage books, Title "Nursery", Subtitle "Casual books".
  4. Card 4: Cover photo of stacked colorful textbooks, Title "Self-learning", Subtitle "Motivational".
  5. Card 5: Cover photo of a landscape book, Title "Landscape", Subtitle "Photography".
  6. Card 6: Cover photo of library interior, Title "Architecture", Subtitle "Design Guide".
- Card details: Each card has 14px rounded corners, photo filling top 70%, title in bold 16px, subtitle in muted 13px (#64748B). Card 1 has an orange button (#EB6921) "Pilih Buku".
```

---

### Screen 4: Detail Buku
```text
Design a clean, spacious desktop book detail screen (1440x900) for NF Library.

Layout & Elements:
- Top Bar: Text link "← Kembali ke Katalog" in #0F5394.
- 2-Column Content Layout (max-width: 900px, centered):
  - Left Column (40%): Large vertical book cover "Shelves" with 16px rounded corners, subtle shadow, and a green availability badge "● Tersedia di Perpustakaan".
  - Right Column (60%):
    - Category: "Motivational & Self-Development" in muted tag (#64748B).
    - Title: "Shelves: Motivational Guide" (32px bold, #1E293B).
    - Author & Publisher: "Penulis: Tim Akademik STTNF • 2024".
    - Info Badges: "Stok: 4 Eks" • "Lokasi: Rak B-01".
    - Description: 2 short readable paragraphs explaining the book's core takeaways on productivity and study habits for college students.
    - CTA Button: Large solid Orange button (#EB6921), height 50px, rounded 8px, bold white text "Pinjam Buku Ini →".
```

---

### Screen 5: Konfirmasi Peminjaman (Form Peminjaman)
```text
Design a clean desktop loan confirmation screen (1440x900) for NF Library.

Layout & Elements:
- Header: Back link "← Kembali ke Detail Buku" and Heading "Formulir Peminjaman Buku" (28px bold).
- Centered White Card Container (width: 580px, padding 32px, rounded 12px, subtle border #E2E8F0):
  - Selected Book Summary: Mini thumbnail of "Shelves", Title "Shelves: Motivational Guide", Author "Tim Akademik STTNF".
  - Parameter 1: "Durasi Peminjaman" with 2 selectable pills: "7 Hari (Reguler)" [Selected in #EB6921 with white text] and "14 Hari (Riset)".
  - Parameter 2: "Tanggal Pengambilan" -> Text "Kamis, 24 September 2026".
  - Parameter 3: "Batas Pengembalian" -> Banner with calendar icon "Kamis, 08 Oktober 2026 (Pukul 17:00 WIB)".
  - Agreement checkbox: Checked box "Saya bertanggung jawab menjaga kondisi fisik buku selama masa pinjam."
  - Action Button: Solid Orange button (#EB6921), full width, height 48px, bold white text "Konfirmasi & Ambil Buku".
```

---

### Screen 6: Bukti Tiket & QR Code Pengambilan
```text
Design a clean desktop loan success and pickup ticket screen (1440x900) for NF Library.

Layout & Elements:
- Centered Ticket Card (width: 520px, white background, rounded 16px, border #E2E8F0, padding 36px):
  - Success Icon: Circular green checkmark icon.
  - Headline: "Peminjaman Berhasil!" (26px bold, #1E293B).
  - Subtitle: "Tunjukkan kode ini kepada petugas perpustakaan saat mengambil buku fisik."
  - Ticket Box (Light gray container #F8FAFC, rounded 12px, padding 20px):
    - Booking ID: "#BK-STTNF-9482" in bold mono font.
    - Large clean high-contrast QR Code in the center (180x180 px).
    - Details: Buku: "Shelves (Motivational)" • Nama: "Raffi Ramadhan (0110224204)" • Lokasi: "Perpustakaan Kampus B".
  - Action Button: Solid Orange button (#EB6921), full width, height 48px, bold white text "Lihat Daftar Pinjaman Saya →".
```

---

### Screen 7: Daftar Pinjaman Aktif
```text
Design a clean desktop "Pinjaman Saya" active loans screen (1440x900) for NF Library.

Layout & Elements:
- Top Header: Title "Pinjaman Saya" (32px bold, #1E293B) and subtitle "Daftar buku yang sedang Anda pinjam saat ini".
- Active Loan Card (width: 720px, white background, rounded 12px, border #E2E8F0, padding 24px, flex layout):
  - Left: Thumbnail of book "Shelves" (rounded 8px).
  - Center Info:
    - Title: "Shelves: Motivational Guide"
    - Tanggal Pinjam: 24 Sep 2026
    - Status Badge: Green pill "● Sisa 14 Hari (Jatuh Tempo: 08 Okt 2026)"
  - Right Action:
    - Solid Orange button (#EB6921), height 40px, rounded 8px, text "Perpanjang Waktu".
- Bottom Navigation:
  - Outline button "← Kembali ke Katalog Buku".
- Clean, minimal, airy layout.
```

---

## Panduan Interaksi Figma (Linear Flow)

1. `01_Login` ➔ Klik tombol **"Masuk"** ➔ Navigate to `02_Rekomendasi`
2. `02_Rekomendasi` ➔ Klik tombol **"Buka Katalog Buku →"** ➔ Navigate to `03_Katalog`
3. `03_Katalog` ➔ Klik Card **"Shelves"** / tombol **"Pilih Buku"** ➔ Navigate to `04_Detail_Buku`
4. `04_Detail_Buku` ➔ Klik tombol **"Pinjam Buku Ini →"** ➔ Navigate to `05_Konfirmasi_Pinjam`
5. `05_Konfirmasi_Pinjam` ➔ Klik tombol **"Konfirmasi & Ambil Buku"** ➔ Navigate to `06_Bukti_QR`
6. `06_Bukti_QR` ➔ Klik tombol **"Lihat Daftar Pinjaman Saya →"** ➔ Navigate to `07_Pinjaman_Saya`
7. `07_Pinjaman_Saya` ➔ Klik tombol **"← Kembali ke Katalog Buku"** ➔ Navigate to `03_Katalog` (Looping)
