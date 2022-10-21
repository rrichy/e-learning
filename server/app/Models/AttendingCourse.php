<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendingCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'status',
        'progress_rate',
        'highest_score',
        'latest_score',
        'start_date',
        'completion_date',
    ];

    public const ATTENDING = 1;
    public const COMPLETE = 2;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function scopeIsActive($query)
    {
        return $query->where('status', 1);
    }
}
