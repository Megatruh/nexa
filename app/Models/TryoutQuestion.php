<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TryoutQuestion extends Model
{
    use HasFactory;

    // Tambahkan properti fillable agar bisa simpan data dari Seeder/CSV
    protected $fillable = [
        'tryout_subtest_id',
        'question_text',
        'question_image',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'option_e',
        'correct_answer',
        'score_weight',
    ];

    /**
     * Relasi ke Subtest (Satu soal milik satu subtest)
     */
    public function subtest()
    {
        return $this->belongsTo(TryoutSubtest::class, 'tryout_subtest_id');
    }

    /**
     * Relasi ke Jawaban (Satu soal bisa punya banyak record jawaban dari user)
     */
    public function answers()
    {
        return $this->hasMany(TryoutAnswer::class);
    }
}