<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TryoutSession extends Model
{
    /** @use HasFactory<\Database\Factories\TryoutSessionFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'study_program_id',
        'started_at',
        'finished_at',
        'total_score',
        'score_details',
    ];
    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function studyProgram(): BelongsTo
    {
        return $this->belongsTo(StudyProgram::class);
    }
}
