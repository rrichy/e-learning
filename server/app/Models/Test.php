<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Test extends Model
{
    use HasFactory;

    protected $fillable = [
        'chapter_id',
        'test_type',
        'title',
        'overview',
        'passing_score',
    ];

    public const CHAPTER = 1;
    public const COMPREHENSION = 1;

    public const TEST_TYPES = [
        'chapter' => self::CHAPTER,
        'comprehension' => self::COMPREHENSION,
    ];

    public const PASSING_SCORES = [25, 50, 75, 100];

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function testResults(): HasMany
    {
        return $this->hasMany(TestResult::class);
    }
}
