<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
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

        Auth::viaRequest('custom-token', function (Request $request) {
            error_log("executing custom token");
            $token = PersonalAccessToken::findToken(trim(substr($request->header('Authorization'), 6)));
            return User::findOrFail($token->tokenable_id);
        });
    }
}
