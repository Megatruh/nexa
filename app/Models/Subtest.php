<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subtest extends Model
{
    /** @use HasFactory<\Database\Factories\SubtestFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];
}
