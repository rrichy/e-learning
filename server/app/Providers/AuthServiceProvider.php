<?php

namespace App\Providers;

use App\Models\MembershipType;
use App\Models\User;
use App\Policies\AccountPolicy;
use App\Policies\AffiliationPolicy;
use App\Policies\CoursePolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\GeneralPolicy;
use App\Policies\NoticePolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\MemcachedLock;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function ($notifiable, $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // Registering policies
        //course
        Gate::define('viewAny-course', [CoursePolicy::class, 'viewAny']);
        Gate::define('view-course', [CoursePolicy::class, 'view']);
        Gate::define('create-course', [CoursePolicy::class, 'create']);
        Gate::define('update-course', [CoursePolicy::class, 'update']);
        Gate::define('delete-course', [CoursePolicy::class, 'delete']);

        Gate::define('check-membership', function (User $user, array $allowed) {
            $allowed_ids = array_map(function ($str) {
                switch($str) {
                    case 'trial':
                        return MembershipType::TRIAL;
                    case 'individual':
                        return MembershipType::INDIVIDUAL;
                    case 'corporate':
                        return MembershipType::CORPORATE;
                    case 'admin':
                        return MembershipType::ADMIN;
                }
            }, $allowed);
            
            return in_array($user->membership_type_id, $allowed_ids);
        });
    
        Gate::define('view-account', [GeneralPolicy::class, 'viewAccount']);
        Gate::define('update-account', [GeneralPolicy::class, 'updateAccount']);
        Gate::define('delete-account', [GeneralPolicy::class, 'deleteAccount']);
    }
}
