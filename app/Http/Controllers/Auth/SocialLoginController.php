<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    protected array $providers = ['google', 'apple'];

    public function redirect(string $provider): RedirectResponse
    {
        $this->guardProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        $this->guardProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')->with('status', 'Unable to authenticate with '.ucfirst($provider).'.');
        }

        $email = $socialUser->getEmail();

        if (! $email) {
            return redirect()->route('login')->with('status', 'No email provided by '.ucfirst($provider).'.');
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $socialUser->getName() ?: $socialUser->getNickname() ?: $email,
                'password' => Str::random(40),
                'email_verified_at' => now(),
            ],
        );

        Auth::login($user, remember: true);

        return redirect()->intended('/dashboard');
    }

    protected function guardProvider(string $provider): void
    {
        if (! in_array($provider, $this->providers, true)) {
            abort(404);
        }
    }
}
