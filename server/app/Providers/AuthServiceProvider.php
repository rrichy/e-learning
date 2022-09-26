<?php

namespace App\Providers;

use App\Models\User;
use App\Policies\CoursePolicy;
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
        Gate::define('viewAny-course', [CoursePolicy::class, 'viewAny']);
        Gate::define('view-course', [CoursePolicy::class, 'view']);
        Gate::define('create-course', [CoursePolicy::class, 'create']);
        Gate::define('update-course', [CoursePolicy::class, 'update']);
        Gate::define('delete-course', [CoursePolicy::class, 'delete']);
    }
}
