<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'priority',
        'start_period',
        'end_period',
        'affiliation_id',
    ];

    public function parentCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function childCategories(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
