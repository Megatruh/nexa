<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// Tambahkan import ini di atas
use Illuminate\Support\Facades\URL;

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
        // Tambahkan baris sakti ini:
        if (config('app.env') !== 'local') {
            URL::forceScheme('https');
        }
        
        // Atau kalau mau lebih pasti buat Ngrok, pakai ini saja:
        if (str_contains(config('app.url'), 'https')) {
            URL::forceScheme('https');
        }
    }
}