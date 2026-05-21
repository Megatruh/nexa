<?php

namespace Database\Seeders;

use App\Models\Tryout;
use App\Models\TryoutSubtest;
use App\Models\TryoutQuestion;
use Illuminate\Database\Seeder;

/**
 * TryoutBatch1Seeder
 *
 * FORMAT CSV PER SUBTES:
 * ──────────────────────────────────────────────────────────────────
 * Header baris pertama (wajib, nama bebas):
 *   question_text, question_image, option_a, option_b, option_c, option_d, option_e, correct_answer, score_weight, discussion
 *
 * Kolom:
 *  [0] question_text   — teks soal (wajib, bisa HTML)
 *  [1] question_image  — nama file gambar relatif dari /storage/public/soal/
 *                        Kosongkan jika tidak ada gambar. Contoh: "pu_soal1.png"
 *  [2] option_a        — teks pilihan A (wajib)
 *  [3] option_b        — teks pilihan B (wajib)
 *  [4] option_c        — teks pilihan C (wajib)
 *  [5] option_d        — teks pilihan D (wajib)
 *  [6] option_e        — teks pilihan E (wajib)
 *  [7] correct_answer  — huruf jawaban benar: A/B/C/D/E (wajib)
 *  [8] score_weight    — bobot nilai (opsional, default: 1)
 *  [9] discussion      — pembahasan (opsional, bisa HTML)
 *
 * CATATAN PENTING UNTUK CSV:
 *  - Gunakan delimiter koma (,)
 *  - Enklosur teks dengan tanda kutip ganda (") agar koma dalam teks tidak
 *    dianggap delimiter. Contoh: "Perhatikan grafik berikut, kemudian..."
 *  - Jika teks mengandung kutip ganda, escape dengan dua kutip: ""
 *  - Simpan file dengan encoding UTF-8 (BOM atau tanpa BOM sama-sama bisa)
 *  - Baris kosong akan otomatis dilewati
 *
 * STRUKTUR FILE:
 *   database/data/
 *     ├── batch1_pu.csv           (Penalaran Umum)
 *     ├── batch1_ppu.csv          (Pengetahuan & Pemahaman Umum)
 *     ├── batch1_pku.csv          (Pengetahuan Kuantitatif)
 *     ├── batch1_literasi_indo.csv
 *     └── batch1_literasi_ing.csv
 *
 * CONTOH BARIS CSV:
 *   "Perhatikan pola berikut: 2, 4, 8, 16, .... Angka selanjutnya adalah?","","32","64","128","16","8","A",1,"Pola kelipatan 2. 16×2=32."
 *   "Perhatikan gambar di samping!","pu_soal2.png","2","4","6","8","10","C",1,""
 */
class TryoutBatch1Seeder extends Seeder
{
    /**
     * Daftar subtes: [ Nama Subtes => file CSV ]
     * Sesuaikan nama file dengan yang ada di database/data/
     */
    /**
     * Daftar konfigurasi subtes SNBT Resmi.
     *
     * Durasi (menit) mengikuti aturan resmi SNBT:
     *  - Penalaran Umum               : 30 menit
     *  - Pengetahuan & Pemahaman Umum : 15 menit
     *  - Pemahaman Bacaan dan Menulis  : 25 menit
     *  - Pengetahuan Kuantitatif       : 20 menit
     *  - Literasi Bahasa Indonesia     : 42.5 menit (42 menit 30 detik)
     *  - Literasi Bahasa Inggris       : 20 menit
     *  - Penalaran Matematika          : 42.5 menit (42 menit 30 detik)
     *
     * Nilai desimal (42.5) diizinkan karena controller menggunakan `$subtest->duration * 60`
     * untuk mengkonversi ke detik → 42.5 * 60 = 2550 detik.
     */
    private array $subtestConfig = [
        [
            'name'     => 'Penalaran Umum',
            'file'     => 'batch1_pu.csv',
            'duration' => 30,    // 30 menit (SNBT resmi)
            'order'    => 1,
        ],
        [
            'name'     => 'Pengetahuan & Pemahaman Umum',
            'file'     => 'batch1_ppu.csv',
            'duration' => 15,    // 15 menit (SNBT resmi) — sebelumnya salah: 30
            'order'    => 2,
        ],
        [
            'name'     => 'Pengetahuan Kuantitatif',
            'file'     => 'batch1_pku.csv',
            'duration' => 20,    // 20 menit (SNBT resmi) — sebelumnya salah: 25
            'order'    => 3,
        ],
        [
            'name'     => 'Literasi Bahasa Indonesia',
            'file'     => 'batch1_literasi_indo.csv',
            'duration' => 42.5,  // 42 menit 30 detik (SNBT resmi) — sebelumnya salah: 30
            'order'    => 4,
        ],
        [
            'name'     => 'Literasi Bahasa Inggris',
            'file'     => 'batch1_literasi_ing.csv',
            'duration' => 20,    // 20 menit (SNBT resmi) — sebelumnya salah: 25
            'order'    => 5,
        ],
        [
            'name'     => 'Pemahaman Bacaan dan Menulis',
            'file'     => 'batch1_pbm.csv',
            'duration' => 25,    // 25 menit (SNBT resmi) — sebelumnya salah: 20
            'order'    => 6,
        ],
        [
            'name'     => 'Penalaran Matematika',
            'file'     => 'batch1_pm.csv',
            'duration' => 42.5,  // 42 menit 30 detik (SNBT resmi) — sebelumnya salah: 30
            'order'    => 7,
        ],
    ];

    public function run(): void
    {
        $this->command->info('=== TryoutBatch1Seeder mulai ===');

        // Buat atau update master Tryout
        $tryout = Tryout::updateOrCreate(
            ['batch_name'      => 'UTBK SNBT 2026 - Batch 1'],
            ['is_active' => true]
        );

        $this->command->info("Tryout dibuat: {$tryout->batch_name} (ID: {$tryout->id})");

        foreach ($this->subtestConfig as $config) {
            $this->command->info("\n→ Memproses subtes: {$config['name']}");

            $subtest = TryoutSubtest::updateOrCreate(
                [
                    'tryout_id' => $tryout->id,
                    'name'      => $config['name'],
                ],
                [
                    'duration'  => $config['duration'],
                    'order'     => $config['order'],
                ]
            );

            // Hapus pertanyaan lama agar tidak ada duplikat saat seeder dijalankan ulang
            TryoutQuestion::where('tryout_subtest_id', $subtest->id)->delete();

            $this->importSoal($subtest->id, $config['file']);
        }

        $this->command->info("\n=== Seeder selesai! ===");
    }

    /**
     * Import soal dari file CSV ke database.
     *
     * @param int    $subtestId  - ID TryoutSubtest
     * @param string $fileName   - Nama file CSV (di dalam database/data/)
     */
    private function importSoal(int $subtestId, string $fileName): void
    {
        $path = database_path("data/{$fileName}");

        if (! file_exists($path)) {
            $this->command->warn("  ⚠ File tidak ditemukan, dilewati: {$path}");
            return;
        }

        $handle = fopen($path, 'r');
        if ($handle === false) {
            $this->command->error("  ✗ Gagal membuka file: {$path}");
            return;
        }

        // Deteksi dan hapus BOM UTF-8 jika ada
        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            // Bukan BOM, kembalikan pointer ke awal
            rewind($handle);
        }

        $lineNumber  = 0;
        $importCount = 0;
        $skipCount   = 0;
        $isFirstLine = true;

        while (($row = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
            $lineNumber++;

            // Skip baris header (baris pertama)
            if ($isFirstLine) {
                $isFirstLine = false;
                continue;
            }

            // Skip baris kosong
            if (empty(array_filter($row, fn($cell) => trim($cell) !== ''))) {
                continue;
            }

            // Validasi: minimal 8 kolom (question_text s/d correct_answer)
            if (count($row) < 8) {
                $this->command->warn("  ⚠ Baris {$lineNumber}: kolom kurang dari 8, dilewati.");
                $skipCount++;
                continue;
            }

            // -- Ekstrak & bersihkan data --

            $questionText   = $this->cleanText($row[0]);
            $questionImage  = $this->parseImage($row[1] ?? '');
            $optionA        = $this->cleanText($row[2]);
            $optionB        = $this->cleanText($row[3]);
            $optionC        = $this->cleanText($row[4]);
            $optionD        = $this->cleanText($row[5]);
            $optionE        = $this->cleanText($row[6]);
            $correctAnswer  = $this->parseCorrectAnswer($row[7] ?? '');
            $scoreWeight    = $this->parseScoreWeight($row[8] ?? '');
            $discussion     = $this->cleanText($row[9] ?? '');

            // Validasi data wajib
            if (empty($questionText)) {
                $this->command->warn("  ⚠ Baris {$lineNumber}: question_text kosong, dilewati.");
                $skipCount++;
                continue;
            }

            if (! in_array($correctAnswer, ['A', 'B', 'C', 'D', 'E'])) {
                $this->command->warn("  ⚠ Baris {$lineNumber}: correct_answer '{$correctAnswer}' tidak valid (harus A-E), dilewati.");
                $skipCount++;
                continue;
            }

            if (empty($optionA) || empty($optionB) || empty($optionC) || empty($optionD) || empty($optionE)) {
                $this->command->warn("  ⚠ Baris {$lineNumber}: ada pilihan jawaban (A-E) yang kosong, dilewati.");
                $skipCount++;
                continue;
            }

            // -- Simpan ke database --
            TryoutQuestion::create([
                'tryout_subtest_id' => $subtestId,
                'question_text'     => $questionText,
                'question_image'    => $questionImage,
                'option_a'          => $optionA,
                'option_b'          => $optionB,
                'option_c'          => $optionC,
                'option_d'          => $optionD,
                'option_e'          => $optionE,
                'correct_answer'    => $correctAnswer,
                'score_weight'      => $scoreWeight,
                'discussion'        => $discussion ?: null,
            ]);

            $importCount++;
        }

        fclose($handle);

        $this->command->info("  ✓ Berhasil: {$importCount} soal diimpor, {$skipCount} baris dilewati.");
    }

    // ─── Helper Methods ───────────────────────────────────────────────────────

    /**
     * Bersihkan teks: trim whitespace dan newline yang tidak perlu.
     * Mengganti "US$" menjadi "USD " agar tidak dibaca sebagai
     * pembuka blok matematika (LaTeX) oleh frontend.
     */
    private function cleanText(string $text): string
    {
        $text = trim($text);
        // Mencegah format rusak akibat $ pada mata uang
        $text = str_replace('US$', 'USD ', $text);
        $text = str_replace('Rp.', 'Rp', $text);
        return $text;
    }

    /**
     * Parse kolom question_image.
     * Mengembalikan null jika kolom kosong, whitespace saja, atau tanda '-'.
     * Path gambar disimpan relatif dari storage/app/public/soal/.
     *
     * @param  string $value
     * @return string|null
     */
    private function parseImage(string $value): ?string
    {
        $cleaned = trim($value);

        // Anggap kosong jika: string kosong, hanya spasi, atau placeholder '-'
        if ($cleaned === '' || $cleaned === '-' || $cleaned === 'null' || $cleaned === 'NULL') {
            return null;
        }

        // Simpan dengan prefix folder agar mudah diakses via /storage/
        // Pastikan tidak ada double prefix jika data sudah mengandung 'soal/'
        if (str_starts_with($cleaned, 'soal/')) {
            return $cleaned;
        }

        return 'soal/' . $cleaned;
    }

    /**
     * Parse correct_answer: ambil huruf pertama dan uppercase.
     * Toleran terhadap input seperti "a", "A.", "(A)", dll.
     */
    private function parseCorrectAnswer(string $value): string
    {
        $cleaned = strtoupper(trim($value));

        // Ekstrak huruf A-E dari string (toleran terhadap format seperti "(A)", "A.")
        if (preg_match('/[A-E]/', $cleaned, $matches)) {
            return $matches[0];
        }

        return $cleaned; // Kembalikan apa adanya; validasi di caller akan menolaknya
    }

    /**
     * Parse score_weight: pastikan integer positif, default ke 1.
     */
    private function parseScoreWeight(string $value): int
    {
        $trimmed = trim($value);

        if ($trimmed === '' || ! is_numeric($trimmed)) {
            return 1;
        }

        $int = (int) $trimmed;
        return $int > 0 ? $int : 1;
    }
}