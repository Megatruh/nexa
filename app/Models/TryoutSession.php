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
        'total_score'
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
}