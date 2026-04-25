<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TryoutSubtest extends Model
{
    protected $guarded = ['id'];

    // Relasi ke Tryout Master
    public function tryout()
    {
        return $this->belongsTo(Tryout::class);
    }

    // Relasi ke Bank Soal
    public function questions()
    {
        return $this->hasMany(TryoutQuestion::class);
    }
}