<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use App\Socialite\PortalProvider;
use Laravel\Socialite\Facades\Socialite;
use App\Models\UserPosition;
use App\Observers\UserPositionObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // Register model observers
        UserPosition::observe(UserPositionObserver::class);

        // 2. Paksa HTTPS jika aplikasi berjalan di lingkungan produksi
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }
        Socialite::extend('portal', function ($app) {
            $config = $app['config']['services.portal'];
            return Socialite::buildProvider(PortalProvider::class, $config);
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
                : null,
        );
    }
}
