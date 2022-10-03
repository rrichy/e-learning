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
        'affiliation_id',
    ];

    public function signature(): BelongsTo
    {
        return $this->belongsTo(Signature::class);
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
