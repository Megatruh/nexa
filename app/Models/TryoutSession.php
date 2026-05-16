<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TryoutSession extends Model
{
    use HasFactory;

    // Tambahkan kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'user_id',
        'tryout_id',
        'started_at',
        'finished_at',
        'study_program_id',
        'total_score',
        'score_details',
        'choice_1_id',
        'choice_2_id',
        'admission_status',
        'admitted_program',
    ];

    protected $casts = [
        'score_details' => 'array',
        'started_at'    => 'datetime',
        'finished_at'   => 'datetime',
    ];

    /**
     * Relasi ke Master Tryout
     */
    public function tryout()
    {
        return $this->belongsTo(Tryout::class);
    }

    /**
     * Relasi ke detail pengerjaan subtest
     */
    public function sessionSubtests()
    {
        return $this->hasMany(TryoutSessionSubtest::class);
    }

    /**
     * Relasi ke semua jawaban di sesi ini
     */
    public function answers()
    {
        return $this->hasMany(TryoutAnswer::class);
    }

    /**
     * Relasi ke pilihan jurusan 1
     */
    public function choice1()
    {
        return $this->belongsTo(StudyProgramDescription::class, 'choice_1_id');
    }

    /**
     * Relasi ke pilihan jurusan 2
     */
    public function choice2()
    {
        return $this->belongsTo(StudyProgramDescription::class, 'choice_2_id');
    }

    /**
     * Relasi ke user pemilik sesi
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}