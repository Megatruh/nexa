<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subtest extends Model
{
    /** @use HasFactory<\Database\Factories\SubtestFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];
    public function questions():HasMany
    {
        return $this->hasMany(Question::class);
    }
    public function learningMaterials():HasMany
    {
        return $this->hasMany(LearningMaterial::class);
    }
}
