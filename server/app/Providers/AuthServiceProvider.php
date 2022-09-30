<?php

namespace App\Providers;

use App\Models\User;
use App\Policies\AccountPolicy;
use App\Policies\AffiliationPolicy;
use App\Policies\CoursePolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\NoticePolicy;
use Illuminate\Auth\Notifications\ResetPassword;
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

        //account
        Gate::define('viewAny-account', [AccountPolicy::class, 'viewAny']);
        Gate::define('view-account', [AccountPolicy::class, 'view']);
        Gate::define('create-account', [AccountPolicy::class, 'create']);
        Gate::define('update-account', [AccountPolicy::class, 'update']);
        Gate::define('massDelete-account', [AccountPolicy::class, 'massDelete']);
     
        //notice
        Gate::define('viewAny-notice', [NoticePolicy::class, 'viewAny']);
        Gate::define('view-notice', [NoticePolicy::class, 'view']);
        Gate::define('create-notice', [NoticePolicy::class, 'create']);
        Gate::define('update-notice', [NoticePolicy::class, 'update']);
        Gate::define('massDelete-notice', [NoticePolicy::class, 'massDelete']);

        //affiliation
        Gate::define('viewAny-affiliation', [AffiliationPolicy::class, 'viewAny']);
        Gate::define('view-affiliation', [AffiliationPolicy::class, 'view']);
        Gate::define('create-affiliation', [AffiliationPolicy::class, 'create']);
        Gate::define('update-affiliation', [AffiliationPolicy::class, 'update']);
        Gate::define('massDelete-affiliation', [AffiliationPolicy::class, 'massDelete']);

        //department
        Gate::define('viewAny-department', [DepartmentPolicy::class, 'viewAny']);
        Gate::define('view-department', [DepartmentPolicy::class, 'view']);
        Gate::define('create-department', [DepartmentPolicy::class, 'create']);
        Gate::define('update-department', [DepartmentPolicy::class, 'update']);
        Gate::define('massDelete-department', [DepartmentPolicy::class, 'massDelete']);

    }
}
