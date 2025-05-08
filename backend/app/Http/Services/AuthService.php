<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    /**
     * 新規ユーザー登録＋JWT発行
     *
     * @param  array  $data  validated data
     * @return array  ['user'=>User, 'accessToken'=>string, 'refreshToken'=>string]
     */
    public function registerUser(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $accessToken  = JWTAuth::fromUser($user);
        $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);

        return compact('user', 'accessToken', 'refreshToken');
    }

    public function loginUser(array $data): array
{
    $user = User::where('email', $data['email'])->first();

    if (!$user || !Hash::check($data['password'], $user->password)) {
        throw ValidationException::withMessages([
            'password' => ['The password does not match our records.'],
        ]);
    }

    $accessToken  = JWTAuth::fromUser($user);
    $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);

    return [
        'user' => $user,
        'accessToken' => $accessToken,
        'refreshToken' => $refreshToken,
    ];
}

}
