<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSurveyResponse extends Model
{
    /** @use HasFactory<\Database\Factories\UserSurveyResponseFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'survey_id',
        'user_answer',
        'is_correct',
    ];

    // relasi dengan model survey(soal yang dikerjakan user)
    public function survey(){
        return $this->belongsTo(Survey::class);
    }

    // relasi dengan model user(survey hanya bisa dikerjakan oleh satu user)
    public function user(){
        return $this->belongsTo(User::class);
    }
}
