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
        'user_id',
        'explainer_video_id',
        'is_complete',
        'playback_position',
    ];

    protected $casts = [
        'is_complete' => 'boolean',
        'playback_position' => 'float'
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
        return $this->where('user_id', $id)->first();
    }
}
