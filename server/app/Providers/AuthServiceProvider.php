<?php

namespace App\Providers;

use App\Models\MembershipType;
use App\Models\User;
use App\Policies\GeneralPolicy;
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

        // Defining Gates
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
        Gate::define('view-course', [GeneralPolicy::class, 'viewCourse']);
        Gate::define('update-course', [GeneralPolicy::class, 'updateCourse']);
        Gate::define('delete-course', [GeneralPolicy::class, 'deleteCourse']);
        Gate::define('mass-update-course', [GeneralPolicy::class, 'massUpdateCourse']);
        Gate::define('update-category', [GeneralPolicy::class, 'updateCategory']);
        Gate::define('delete-category', [GeneralPolicy::class, 'deleteCategory']);
        Gate::define('update-department', [GeneralPolicy::class, 'updateDepartment']);
        Gate::define('delete-department', [GeneralPolicy::class, 'deleteDepartment']);
        Gate::define('update-mailtemplate', [GeneralPolicy::class, 'updateMailTemplate']);
        Gate::define('delete-mailtemplate', [GeneralPolicy::class, 'deleteMailTemplate']);
        Gate::define('mass-update-mailtemplate', [GeneralPolicy::class,' massUpdateMailTemplate']);
    }
}
