<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TryoutAnswer extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'tryout_session_id',
        'tryout_question_id',
        'answer'
    ];
}
