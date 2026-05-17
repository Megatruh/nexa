<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TryoutAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'tryout_session_id',
        'tryout_question_id',
        'answer',
        'is_doubtful',
    ];

    /**
     * Relasi ke soal yang dijawab
     */
    public function question()
    {
        return $this->belongsTo(TryoutQuestion::class, 'tryout_question_id');
    }

    /**
     * Relasi ke sesi tryout
     */
    public function session()
    {
        return $this->belongsTo(TryoutSession::class, 'tryout_session_id');
    }
}
