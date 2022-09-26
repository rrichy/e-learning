<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'category_id',
        'image',
        'title',
        'content',
        'study_time',
        'priority',
        'is_whole_period',
        'start_period',
        'end_period',
        'target',
    ];

    public const STATUS = [
        'private' => 1,
        'public' => 2,
    ];

    public const TARGET = [
        'everyone' => 1,
        'group' => 2,
        'individual' => 3,
    ];
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }

    // public function signature(): BelongsTo
    // {
    //     return $this->belongsTo(Signature::class);
    // }

    // public function groups(): HasMany
    // {
    //     return $this->hasMany(Group::class);
    // }

    // public function conditionalMails(): HasMany
    // {
    //     return $this->hasMany(ConditionalMail::class);
    // }

    // public function notice(): HasOne
    // {
    //     return $this->hasOne(Notice::class);
    // }
}
