<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Twilio\Rest\Client;

class SmsVerificationController
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'regex:/^\\+?[1-9]\\d{9,14}$/'],
        ]);

        $throttleKey = $this->throttleKey($request, $validated['phone']);

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response()->json([
                'message' => 'Too many attempts. Please try again later.',
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        RateLimiter::hit($throttleKey, 60 * 10);

        $code = (string) random_int(100000, 999999);

        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.from');

        if (! $sid || ! $token || ! $from) {
            return response()->json([
                'message' => 'SMS service is not configured.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $client = new Client($sid, $token);
        $client->messages->create($validated['phone'], [
            'from' => $from,
            'body' => "Your verification code is {$code}",
        ]);

        Cache::put($this->codeCacheKey($validated['phone']), $code, now()->addMinutes(10));

        return response()->json([
            'message' => 'Verification code sent.',
        ]);
    }

    private function codeCacheKey(string $phone): string
    {
        return 'sms_code_'.$phone;
    }

    private function throttleKey(Request $request, string $phone): string
    {
        return Str::lower($phone).'|'.$request->ip();
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'regex:/^\\+?[1-9]\\d{9,14}$/'],
            'sms_code' => ['required', 'string'],
        ]);

        $cachedCode = Cache::get($this->codeCacheKey($validated['phone']));

        if ($cachedCode === null || $cachedCode !== $validated['sms_code']) {
            return response()->json([
                'message' => 'Invalid or expired code.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $verifiedAt = now();
        Cache::put($this->verifiedCacheKey($validated['phone']), $verifiedAt, now()->addMinutes(30));

        return response()->json([
            'message' => 'Phone verified.',
            'verified_at' => $verifiedAt,
        ]);
    }

    private function verifiedCacheKey(string $phone): string
    {
        return 'sms_verified_'.$phone;
    }
}
