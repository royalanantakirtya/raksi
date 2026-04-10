<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\VisitRepositoryInterface::class,
            \App\Repositories\EloquentVisitRepository::class
        );
        $this->app->bind(
            \App\Repositories\ScheduleRepositoryInterface::class,
            \App\Repositories\EloquentScheduleRepository::class
        );
        $this->app->bind(
            \App\Repositories\VisitRequestRepositoryInterface::class,
            \App\Repositories\EloquentVisitRequestRepository::class
        );
        $this->app->bind(
            \App\Repositories\UserRepositoryInterface::class,
            \App\Repositories\EloquentUserRepository::class
        );
        $this->app->bind(
            \App\Repositories\NewsRepositoryInterface::class,
            \App\Repositories\EloquentNewsRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
