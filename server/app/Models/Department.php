<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'affiliation_id',
        'name',
        'priority'
    ];

    public function parentDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    public function childDepartments(): HasMany
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }

    public function departmentUsers(): HasMany
    {
        return $this->hasMany(DepartmentUser::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'department_users')
            ->using(DepartmentUser::class)
            ->withPivot('order')
            ->as('users');
        // return $this->hasManyThrough(
        //     User::class,
        //     DepartmentUser::class,
        //     'department_id',
        //     'id',
        //     'id',
        //     'user_id',
        // );
    }
}
