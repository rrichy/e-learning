<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Affiliation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'priority',
    ];

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // public function affiliationGroups(): HasMany
    // {
    //     return $this->hasMany(AffiliationGroup::class);
    // }
}
