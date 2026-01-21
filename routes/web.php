<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\Auth\SocialLoginController;
use App\Http\Controllers\Auth\SmsVerificationController;

Route::get('/', HomeController::class)->middleware('verified.home')->name('home');

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

    Route::resource('wishlists', WishlistController::class);
});

// Public listing routes (wildcard routes come last)
Route::get('listings', [ListingController::class, 'index'])->name('listings.index');
Route::get('/listing/{state}/{city}/{category}/{listing}', [ListingController::class, 'show'])
    ->name('listing.show');

require __DIR__.'/settings.php';
