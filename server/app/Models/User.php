<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'image',
        'password',
        'birthday',
        'sex',
        'membership_type_id',
        'remarks',
        'affiliation_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function membershipType(): BelongsTo
    {
        return $this->belongsTo(MembershipType::class);
    }

    public function departmentUsers(): HasMany
    {
        return $this->hasMany(DepartmentUser::class);
    }

    public function departments(): HasManyThrough
    {
        return $this->hasManyThrough(
            Department::class, 
            DepartmentUser::class,
            'user_id',
            'id',
            'id',
            'department_id',
        );
    }

    public function parentDepartment(): HasOneThrough
    {
        return $this->hasOneThrough(
            Department::class, 
            DepartmentUser::class,
            'user_id',
            'id',
            'id',
            'department_id',
        )->where('order', 1);
    }

    public function childDepartment(): HasOneThrough
    {
        return $this->hasOneThrough(
            Department::class, 
            DepartmentUser::class,
            'user_id',
            'id',
            'id',
            'department_id',
        )->where('order', 2);
    }
    
    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class);
    }

    public function isAdmin(): bool
    {
        return $this->membership_type_id === MembershipType::ADMIN;
    }

    public function isCorporate(): bool
    {
        return $this->membership_type_id === MembershipType::CORPORATE;
    }
    
    public function isIndividual(): bool
    {
        return $this->membership_type_id === MembershipType::INDIVIDUAL;
    }
    
    public function attendingCourses(): HasMany
    {
        return $this->hasMany(AttendingCourse::class);
    }

    public function courses(): HasManyThrough
    {
        return $this->hasManyThrough(Course::class, AttendingCourse::class, 'user_id', 'id', 'id', 'course_id');
    }

    public function userAnswer(): HasMany
    {
        return $this->hasMany(UserAnswer::class);
    }
}
