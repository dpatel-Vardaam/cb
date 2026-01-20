<?php

namespace App\Http\Middleware;

use App\UserCategory;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== UserCategory::ADMIN->value) {
            auth()->guard('admin')->logout();

            return redirect()->route('filament.admin.auth.login')
                ->withErrors([
                    'email' => 'You are not authorized to access the admin panel.',
                ]);
        }

        return $next($request);
    }
}
