<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSurveyResponse extends Model
{
    /** @use HasFactory<\Database\Factories\UserSurveyResponseFactory> */
    use HasFactory;
    protected $fillable = [
        'survey_id',
        'user_answer',
        'is_correct',
    ];
}
