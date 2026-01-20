<?php

use App\Http\Controllers\Auth\SocialLoginController;
use App\Http\Controllers\Auth\SmsVerificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ListingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

// Category routes
Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware('guest')->group(function () {
    Route::post('/sms/send', [SmsVerificationController::class, 'send'])->name('sms.send');
    Route::post('/sms/verify', [SmsVerificationController::class, 'verify'])->name('sms.verify');

    Route::get('/auth/{provider}/redirect', [SocialLoginController::class, 'redirect'])
        ->whereIn('provider', ['google', 'apple'])
        ->name('social.redirect');

    Route::get('/auth/{provider}/callback', [SocialLoginController::class, 'callback'])
        ->whereIn('provider', ['google', 'apple'])
        ->name('social.callback');
});

// Protected listing routes (require authentication) - MUST come before wildcard routes
Route::middleware(['auth'])->group(function () {
    Route::get('listings/create', [ListingController::class, 'create'])->name('listings.create');
    Route::post('listings', [ListingController::class, 'store'])->name('listings.store');
    Route::get('listings/{listing}/edit', [ListingController::class, 'edit'])->name('listings.edit');
    Route::put('listings/{listing}', [ListingController::class, 'update'])->name('listings.update');
    Route::patch('listings/{listing}', [ListingController::class, 'update']);
    Route::delete('listings/{listing}', [ListingController::class, 'destroy'])->name('listings.destroy');
});

// Public listing routes (wildcard routes come last)
Route::get('listings', [ListingController::class, 'index'])->name('listings.index');
Route::get('listings/{listing}', [ListingController::class, 'show'])->name('listings.show');

require __DIR__.'/settings.php';
