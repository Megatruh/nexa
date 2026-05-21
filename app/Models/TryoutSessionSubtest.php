<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TryoutSessionSubtest extends Model
{
    use HasFactory;
    protected $fillable = [
        'tryout_session_id',
        'tryout_subtest_id',
        'started_at',
        'finished_at',
    ];
    
    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];
    
    public function subtest()
    {
        return $this->belongsTo(TryoutSubtest::class, 'tryout_subtest_id');
    }
}
