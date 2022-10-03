<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

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

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function courses(): HasManyThrough
    {
        return $this->hasManyThrough(Course::class, Category::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class);
    }

    public function mailTemplates(): HasMany
    {
        return $this->hasMany(MailTemplate::class);
    }
    
    // public function affiliationGroups(): HasMany
    // {
    //     return $this->hasMany(AffiliationGroup::class);
    // }
}
