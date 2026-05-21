<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subtest extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Relasi ke soal-soal (questions) dalam subtest ini.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Relasi ke materi belajar dalam subtest ini.
     */
    public function learningMaterials(): HasMany
    {
        return $this->hasMany(LearningMaterial::class);
    }
}