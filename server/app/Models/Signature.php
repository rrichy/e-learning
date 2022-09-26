<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Signature extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'from_email',
        'from_name',
        'content',
        'priority',
    ];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    // public function mailTemplates(): HasMany
    // {
    //     return $this->hasMany(MailTemplate::class);
    // }

    // public function notice(): HasOne
    // {
    //     return $this->hasOne(Notice::class);
    // }
}
