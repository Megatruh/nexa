<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    /** @use HasFactory<\Database\Factories\SurveyFactory> */
    use HasFactory;
    protected $fillable = [
        'category',
        'question',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',
        'item_weight',
    ];

    // relasi dengan model user_survey_responses(jawaban user)
    public function responses(){
        return $this->hasMany(UserSurveyResponse::class);
    }
}
