<?php

namespace Database\Seeders;

use App\Models\BankSoal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BankSoalSeeder extends Seeder
{
    /**
     * Nama file CSV di dalam folder database/data/
     */
    private const CSV_FILE = 'utbk_snbt_2025 (1).csv';

    /**
     * Delimiter yang digunakan di file CSV ini.
     */
    private const DELIMITER = '|';

    /**
     * Jumlah baris yang di-insert sekaligus (chunk) untuk efisiensi memori.
     * Turunkan ke 100 jika CSV sangat besar dan RAM terbatas.
     */
    private const CHUNK_SIZE = 500;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('data/' . self::CSV_FILE);

        // ── Validasi file ──────────────────────────────────────────────────
        if (! file_exists($path)) {
            $this->command->error("❌  File tidak ditemukan: {$path}");
            $this->command->line("   Pastikan file CSV berada di folder <project>/database/data/");
            return;
        }

        $this->command->info("📂  Membaca file: " . self::CSV_FILE);

        // ── Buka file ─────────────────────────────────────────────────────
        $handle = fopen($path, 'r');
        if ($handle === false) {
            $this->command->error("❌  Gagal membuka file. Periksa permission file.");
            return;
        }

        // Atur encoding agar karakter UTF-8 terbaca dengan benar
        stream_filter_append($handle, 'convert.iconv.UTF-8/UTF-8//IGNORE');

        // ── Lewati baris header ────────────────────────────────────────────
        $header = fgetcsv($handle, 0, self::DELIMITER);
        $this->command->line("   Header terdeteksi: " . implode(' | ', $header));

        // ── Kosongkan tabel sebelum import (opsional) ─────────────────────
        $this->command->info("🗑️   Membersihkan tabel bank_soal sebelum import...");
        DB::table('bank_soal')->truncate();

        // ── Proses baris data ──────────────────────────────────────────────
        $chunk       = [];
        $totalInsert = 0;
        $totalSkip   = 0;
        $baris       = 1; // mulai dari 1 karena baris 0 = header

        while (($row = fgetcsv($handle, 0, self::DELIMITER)) !== false) {
            $baris++;

            // Lewati baris yang kolomnya tidak lengkap (minimal 10 kolom wajib)
            if (count($row) < 10) {
                $this->command->warn("   ⚠️  Baris {$baris} dilewati (hanya " . count($row) . " kolom).");
                $totalSkip++;
                continue;
            }

            // Mapping kolom CSV → kolom database
            // Urutan: Mata_Pelajaran|Topik|Nomor_Soal|Pertanyaan|Opsi_A|Opsi_B|Opsi_C|Opsi_D|Opsi_E|Kunci_Jawaban|Pembahasan
            $chunk[] = [
                'mata_pelajaran' => $this->sanitize($row[0]),
                'topik'          => $this->sanitize($row[1]) ?: null,
                'nomor_soal'     => is_numeric(trim($row[2])) ? (int) trim($row[2]) : null,
                'pertanyaan'     => $this->sanitize($row[3]),
                'opsi_a'         => $this->sanitize($row[4]) ?: null,
                'opsi_b'         => $this->sanitize($row[5]) ?: null,
                'opsi_c'         => $this->sanitize($row[6]) ?: null,
                'opsi_d'         => $this->sanitize($row[7]) ?: null,
                'opsi_e'         => isset($row[8]) ? ($this->sanitize($row[8]) ?: null) : null,
                'kunci_jawaban'  => isset($row[9]) ? strtoupper(trim($row[9])) ?: null : null,
                'pembahasan'     => isset($row[10]) ? ($this->sanitize($row[10]) ?: null) : null,
                'created_at'     => now(),
                'updated_at'     => now(),
            ];

            // Insert per chunk agar tidak kehabisan memori
            if (count($chunk) >= self::CHUNK_SIZE) {
                DB::table('bank_soal')->insert($chunk);
                $totalInsert += count($chunk);
                $this->command->line("   ✅  {$totalInsert} soal berhasil dimasukkan...");
                $chunk = [];
            }
        }

        // Insert sisa data yang belum masuk chunk terakhir
        if (! empty($chunk)) {
            DB::table('bank_soal')->insert($chunk);
            $totalInsert += count($chunk);
        }

        fclose($handle);

        // ── Ringkasan ──────────────────────────────────────────────────────
        $this->command->newLine();
        $this->command->info("🎉  Import selesai!");
        $this->command->table(
            ['Keterangan', 'Jumlah'],
            [
                ['Total baris dibaca',    $baris - 1],
                ['Berhasil dimasukkan',   $totalInsert],
                ['Baris dilewati (skip)', $totalSkip],
            ]
        );
    }

    /**
     * Bersihkan whitespace berlebih dan karakter tidak terlihat
     * yang sering muncul di file CSV yang di-export dari Excel.
     */
    private function sanitize(?string $value): string
    {
        if ($value === null) return '';

        // Hapus BOM (Byte Order Mark) dan whitespace awal/akhir
        $value = preg_replace('/^\x{FEFF}/u', '', $value);

        return trim($value);
    }
}