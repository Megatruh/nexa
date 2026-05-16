<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyProgramDescription extends Model
{
    protected $fillable = [
        'name',
        'passing_grade_min',
        'passing_grade_max',
        'career_prospects',
        'description',
        'rating',
        'accreditation',
        'ukt_range',
        'enthusiasts',
        'related_subjects',
        'capacity',
    ];
}