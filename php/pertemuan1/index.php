<?php
$nama = '';
$email = '';
$nilai = '';
$status = '';
$submitted = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = htmlspecialchars(trim($_POST['nama'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $nilaiInput = trim($_POST['nilai'] ?? '');

    if ($nama !== '' && $email !== '' && is_numeric($nilaiInput)) {
        $nilai = (float) $nilaiInput;
        $submitted = true;

        if ($nilai >= 70) {
            $status = 'Lulus';
        } else {
            $status = 'Remedial';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Praktikum PHP 1 - Form Nilai Ujian</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f4f6f8;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            background: #ffffff;
            width: 100%;
            max-width: 480px;
            padding: 28px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        h1 {
            font-size: 1.4rem;
            margin-bottom: 8px;
            color: #1a202c;
        }

        p.desc {
            font-size: 0.9rem;
            color: #718096;
            margin-bottom: 24px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        label {
            display: block;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 6px;
            color: #2d3748;
        }

        input[type="text"],
        input[type="email"],
        input[type="number"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #cbd5e0;
            border-radius: 6px;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s;
        }

        input:focus {
            border-color: #3182ce;
        }

        button {
            width: 100%;
            padding: 11px;
            background-color: #3182ce;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-top: 8px;
        }

        button:hover {
            background-color: #2b6cb0;
        }

        .result-card {
            margin-top: 24px;
            padding: 18px;
            border-radius: 6px;
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
        }

        .result-card h2 {
            font-size: 1.1rem;
            margin-bottom: 12px;
            color: #2d3748;
        }

        .result-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 0.9rem;
            border-bottom: 1px solid #edf2f7;
        }

        .result-row:last-child {
            border-bottom: none;
            padding-top: 10px;
            font-weight: 600;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .badge-lulus {
            background-color: #c6f6d5;
            color: #22543d;
        }

        .badge-remedial {
            background-color: #fed7d7;
            color: #742a2a;
        }
    </style>
</head>
<body>

<main class="container">
    <h1>Form Penilaian Ujian</h1>
    <p class="desc">Masukkan data mahasiswa dan nilai ujian untuk melihat status kelulusan.</p>

    <form action="" method="POST">
        <div class="form-group">
            <label for="nama">Nama Mahasiswa</label>
            <input type="text" id="nama" name="nama" value="<?= $nama; ?>" placeholder="Contoh: Raffi Ramadhan" required>
        </div>

        <div class="form-group">
            <label for="email">Alamat Email</label>
            <input type="email" id="email" name="email" value="<?= $email; ?>" placeholder="Contoh: raffi@example.com" required>
        </div>

        <div class="form-group">
            <label for="nilai">Nilai Ujian</label>
            <input type="number" id="nilai" name="nilai" value="<?= $nilai !== '' ? $nilai : ''; ?>" min="0" max="100" step="any" placeholder="0 - 100" required>
        </div>

        <button type="submit">Proses Nilai</button>
    </form>

    <?php if ($submitted): ?>
        <section class="result-card">
            <h2>Hasil Evaluasi</h2>
            <div class="result-row">
                <span>Nama:</span>
                <span><?= $nama; ?></span>
            </div>
            <div class="result-row">
                <span>Email:</span>
                <span><?= $email; ?></span>
            </div>
            <div class="result-row">
                <span>Nilai Ujian:</span>
                <span><?= $nilai; ?></span>
            </div>
            <div class="result-row">
                <span>Status:</span>
                <span class="badge <?= $status === 'Lulus' ? 'badge-lulus' : 'badge-remedial'; ?>">
                    <?= $status; ?>
                </span>
            </div>
        </section>
    <?php endif; ?>
</main>

</body>
</html>
