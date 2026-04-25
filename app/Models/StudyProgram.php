<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyProgram extends Model
{
    /** @use HasFactory<\Database\Factories\StudyProgramFactory> */
    use HasFactory;
    protected $fillable = [
        'name', 
        'weight_num',
        'weight_abst',
        'weight_verb',
        'passing_grade_avg', 
    ];



}
