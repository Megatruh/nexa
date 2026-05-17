<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tryout extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
        'batch'     => 'integer',
    ];

    /**
     * Relasi ke daftar subtes
     */
    public function subtests()
    {
        return $this->hasMany(TryoutSubtest::class);
    }

    /**
     * Relasi ke semua sesi pengerjaan
     */
    public function sessions()
    {
        return $this->hasMany(TryoutSession::class);
    }
}