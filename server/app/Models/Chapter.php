<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Chapter extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'item_number',
        'title',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function explainerVideos(): HasMany
    {
        return $this->hasMany(ExplainerVideo::class);
    }
    
    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }

    public function chapterTest(): HasOne
    {
        return $this->hasOne(Test::class)->where('test_type', Test::TEST_TYPES['chapter']);
    }

    public function comprehensionTest(): HasOne
    {
        return $this->hasOne(Test::class)->where('test_type', Test::TEST_TYPES['comprehension']);
    }
}
