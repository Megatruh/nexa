<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningMaterial extends Model
{
    /** @use HasFactory<\Database\Factories\LearningMaterialFactory> */
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'type',
        'subtest_id',
        'file_path',
    ];
    public function subtest()
    {
        return $this->belongsTo(Subtest::class);
    }
}
