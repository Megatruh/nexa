<?php

namespace Database\Seeders;

use App\Models\Tryout;
use App\Models\TryoutSubtest;
use App\Models\TryoutQuestion;
use Illuminate\Database\Seeder;

class TryoutBatch1Seeder extends Seeder
{
    public function run(): void
{
    // 1. Buat Master Tryout
    $tryout = Tryout::create(['name' => 'UTBK SNBT 2026 - Batch 1', 'is_active' => true]);

    // 2. Daftar Subtest yang mau dibuat (Nama Subtest => Nama File CSV)
    $subtests = [
        'Penalaran Umum' => 'batch1_penalaran_umum.csv',
        'Pengetahuan Kuantitatif' => 'batch1_kuantitatif.csv',
        'Literasi Bahasa Indonesia' => 'batch1_literasi_indo.csv',
    ];

    $order = 1;
    foreach ($subtests as $name => $fileName) {
        // Buat Subtest-nya
        $subtest = TryoutSubtest::create([
            'tryout_id' => $tryout->id,
            'name' => $name,
            'duration' => 30, // Bisa kamu sesuaikan per subtes jika mau
            'order' => $order++,
        ]);

        // Import Soal untuk subtest ini
        $this->importSoal($subtest->id, $fileName);
    }
}

private function importSoal($subtestId, $fileName)
{
    // PERBAIKAN: Gunakan $fileName langsung setelah folder data/
    $path = database_path("data/" . $fileName);
    
    // Cek apakah filenya ada sebelum dijalankan
    if (!file_exists($path)) {
        $this->command->error("File tidak ditemukan: " . $path);
        return;
    }

    $csvFile = fopen($path, "r");
    $firstline = true;
    while (($data = fgetcsv($csvFile, 0, ",")) !== FALSE) {
        if (!$firstline) {
            \App\Models\TryoutQuestion::create([
                "tryout_subtest_id" => $subtestId,
                "question_text"     => $data[0],
                "question_image"    => $data[1] ?: null, 
                "option_a"          => $data[2],
                "option_b"          => $data[3],
                "option_c"          => $data[4],
                "option_d"          => $data[5],
                "option_e"          => $data[6],
                "correct_answer"    => $data[7],
                "score_weight"      => $data[8] ?? 1,
            ]);
        }
        $firstline = false;
    }
    fclose($csvFile);
    $this->command->info("Berhasil mengimpor soal dari: " . $fileName);
}
}