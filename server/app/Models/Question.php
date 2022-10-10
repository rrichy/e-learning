<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_id',
        'item_number',
        'title',
        'statement',
        'format',
        'score',
        'explanation'
    ];

    public const FORMAT = [
        'radio' => 1,
        'pulldown' => 2,
        'description' => 3
    ];

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function userAnswers(): HasMany
    {
        return $this->hasMany(UserAnswer::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class);
    }
}
