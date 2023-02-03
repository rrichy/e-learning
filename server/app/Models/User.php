<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $appends = ['parentDepartment', 'childDepartment', 'image'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        // 'image',
        'password',
        'birthday',
        'sex',
        'membership_type_id',
        'remarks',
        'affiliation_id',
        'email_verified_at',
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
        'last_login_date' => 'datetime',
    ];

    public function sendEmailVerificationNotification($mail = null)
    {
        $this->notify(new VerifyEmail($mail));
    }

    public function imagePolymorphic()
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function membershipType(): BelongsTo
    {
        return $this->belongsTo(MembershipType::class);
    }

    public function departmentUsers(): HasMany
    {
        return $this->hasMany(DepartmentUser::class);
    }

    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class, 'department_users')
            ->using(DepartmentUser::class)
            ->withPivot('order')
            ->as('departments');
    }

    public function getParentDepartmentAttribute()
    {
        return $this->departments()->where('order', 1)->first();
    }

    public function getChildDepartmentAttribute()
    {
        return $this->departments()->where('order', 2)->first();
    }

    public function getImageAttribute()
    {
        return Storage::disk('public')->url($this->imagePolymorphic?->url);
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

    public function isTrial(): bool
    {
        return $this->membership_type_id === MembershipType::TRIAL;
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

    public function testResults(): HasMany
    {
        return $this->hasMany(TestResult::class);
    }

    public function temporaryUrls(): HasMany
    {
        return $this->hasMany(TemporaryUrl::class);
    }

    public function viewingInformations(): HasMany
    {
        return $this->hasMany(ViewingInformation::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    // Scopes
    public function scopeWhoAreIndividual($query)
    {
        return $query->where('membership_type_id', MembershipType::INDIVIDUAL);
    }
}
