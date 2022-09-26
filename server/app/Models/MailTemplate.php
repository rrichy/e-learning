<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'signature_id',
        'priority',
    ];

    public function signature(): BelongsTo
    {
        return $this->belongsTo(Signature::class);
    }
}
