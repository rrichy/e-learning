<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject',
        'content',
        'priority',
        'shown_in_bulletin',
        'shown_in_mail',
        // 'target_student',
        // 'group_id',
        // 'target_course',
        'date_publish_start',
        'date_publish_end',
        'signature_id',
        'affiliation_id',
    ];

    public function signature(): BelongsTo
    {
        return $this->belongsTo(Signature::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
