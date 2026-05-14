<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankSoal extends Model
{
    use HasFactory;

    /**
     * Nama tabel di database.
     * (Laravel akan menebak 'bank_soals' tanpa ini, jadi kita set eksplisit.)
     */
    protected $table = 'bank_soal';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'mata_pelajaran',
        'topik',
        'nomor_soal',
        'pertanyaan',
        'opsi_a',
        'opsi_b',
        'opsi_c',
        'opsi_d',
        'opsi_e',
        'kunci_jawaban',
        'pembahasan',
    ];

    /**
     * Cast otomatis untuk tipe data tertentu.
     */
    protected $casts = [
        'nomor_soal' => 'integer',
    ];

    // ─── Scopes (opsional, untuk kemudahan query) ────────────────────────────

    /**
     * Filter soal berdasarkan mata pelajaran.
     *
     * Contoh: BankSoal::mapel('Penalaran Umum')->get()
     */
    public function scopeMapel($query, string $mapel)
    {
        return $query->where('mata_pelajaran', $mapel);
    }

    /**
     * Filter soal berdasarkan topik.
     *
     * Contoh: BankSoal::topik('Silogisme')->get()
     */
    public function scopeTopik($query, string $topik)
    {
        return $query->where('topik', $topik);
    }
}