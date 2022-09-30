<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipType extends Model
{
    use HasFactory;

    protected $fillable = [ 'name' ];

    public const TRIAL = 1;
    public const INDIVIDUAL = 2;
    public const CORPORATE = 3;
    public const ADMIN = 4;

    public const TYPES = [
        self::TRIAL,
        self::INDIVIDUAL,
        self::CORPORATE,
        self::ADMIN,
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
