<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\UserCategory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'phone' => ['required', 'string', 'regex:/^\\+?[1-9]\\d{9,14}$/', 'unique:users,phone'],
            'sms_code' => ['required', 'string'],
            'password' => $this->passwordRules(),
        ])->validate();

        $cachedCode = Cache::get($this->codeCacheKey($input['phone']));
        $verifiedAt = Cache::get($this->verifiedCacheKey($input['phone']));

        if ($cachedCode === null || $cachedCode !== $input['sms_code']) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'sms_code' => 'Invalid or expired SMS verification code.',
            ]);
        }

        $verifiedAt = $verifiedAt ?: now();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'phone' => $input['phone'],
            'password' => $input['password'],
            'role' => UserCategory::CONSUMER->value,
            'phone_verified_at' => $verifiedAt,
        ]);

        Cache::forget($this->codeCacheKey($input['phone']));
        Cache::forget($this->verifiedCacheKey($input['phone']));

        return $user;
    }

    private function codeCacheKey(string $phone): string
    {
        return 'sms_code_'.$phone;
    }

    private function verifiedCacheKey(string $phone): string
    {
        return 'sms_verified_'.$phone;
    }
}
