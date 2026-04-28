<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tryout extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // TAMBAHKAN INI:
    public function subtests()
    {
        return $this->hasMany(TryoutSubtest::class);
    }
}