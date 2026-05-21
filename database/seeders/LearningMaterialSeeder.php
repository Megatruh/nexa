<?php
namespace Database\Seeders;
use App\Models\LearningMaterial;
use App\Models\Subtest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class LearningMaterialSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan folder 'materials' utama sudah ada di storage public
        if (!Storage::disk('public')->exists('materials')) {
            Storage::disk('public')->makeDirectory('materials');
        }
        // =====================================================================
        // PENTING: Gunakan nama slug yang PERSIS SAMA dengan nama folder di
        // database/materials/ — huruf kecil, underscore, tanpa spasi.
        // ID di sini harus cocok dengan urutan insert SubtestSeeder.php.
        // =====================================================================
        $subtestMapping = [
            'penalaran-umum'                          => 'pu',
            'pengetahuan-dan-pemahaman-umum'          => 'ppu',
            'pemahaman-bacaan-dan-menulis'            => 'pbm',
            'pengetahuan-kuantitatif'                 => 'pk',
            'literasi-dalam-bahasa-indonesia'         => 'literasi_indo',
            'literasi-dalam-bahasa-inggris'           => 'literasi_inggris',
            'penalaran-matematika'                    => 'pm',
        ];
        // Hapus semua learning material lama agar tidak duplikat saat re-seed
        LearningMaterial::query()->delete();
        // Bersihkan juga file lama di storage public/materials
        if (Storage::disk('public')->exists('materials')) {
            Storage::disk('public')->deleteDirectory('materials');
            Storage::disk('public')->makeDirectory('materials');
        }
        foreach ($subtestMapping as $subtestSlug => $folderName) {
            // Cari subtest berdasarkan slug (lebih aman daripada hardcode ID)
            $subtest = Subtest::where('slug', $subtestSlug)->first();
            if (!$subtest) {
                $this->command->warn("⚠️  Subtest dengan slug '{$subtestSlug}' tidak ditemukan di database. Skip.");
                continue;
            }
            // Path absolut ke folder PDF sumber
            $directoryPath = database_path("materials/{$folderName}");
            if (!File::isDirectory($directoryPath)) {
                $this->command->warn("⚠️  Folder '{$directoryPath}' tidak ditemukan. Skip.");
                continue;
            }
            // Ambil semua file di dalam folder (termasuk subfolder jika ada)
            $files = File::allFiles($directoryPath);
            if (empty($files)) {
                $this->command->warn("⚠️  Folder '{$folderName}' kosong. Skip.");
                continue;
            }
            foreach ($files as $file) {
                // Hanya proses file PDF
                if (strtolower($file->getExtension()) !== 'pdf') {
                    continue;
                }
                // Judul = nama file asli TANPA ekstensi, tetap dengan spasi & kapitalisasi
                // Contoh: "Kalimat Efektif (Ke..." -> "Kalimat Efektif"
                $title = $file->getFilenameWithoutExtension();
                // Nama file unik di storage agar tidak bentrok antar subtest
                $uniqueFileName = $folderName . '_' . uniqid() . '.pdf';
                $storagePath    = 'materials/' . $uniqueFileName;
                // Copy file ke storage/app/public/materials/
                Storage::disk('public')->put(
                    $storagePath,
                    File::get($file->getPathname())
                );
                // Insert ke database
                LearningMaterial::create([
                    'subtest_id'  => $subtest->id,
                    'title'       => $title,
                    'description' => 'Materi ' . $title,
                    'type'        => 'materi',
                    'file_path'   => $storagePath,
                ]);
                $this->command->line("  ✅ [{$subtest->name}] '{$title}' berhasil di-seed.");
            }
        }
        $this->command->info('🎉 Semua materi PDF berhasil di-seed!');
    }
}