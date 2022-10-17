<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ViewingInformation extends Model
{
    use HasFactory;

    protected $fillable = [
        'chapter_id',
        'item_number',
        'title',
        'content',
        'video_file_path',
    ];

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function viewingInformations(): HasMany
    {
        return $this->hasMany(ViewingInformation::class);
    }

    public function scopeWhoseUserIdIs($query, $id)
    {
        return $this->where('user_id', $id);
    }
}
