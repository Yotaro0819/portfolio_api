<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{

    public function checkAuth(Request $request)
{
    try {
        $jwt = $request->cookie('jwt');  // CookieからJWTを取得

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }


        $userId = JWTAuth::parseToken()->authenticate()->id;

        $authUser = User::find($userId);

        return response()->json(['message' => 'authorize']);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }
}

    public function register(Request $request)
    {
        try {
            $fields = $request->validate([
                'name' => 'required|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|confirmed'
            ]);

            $user = User::create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'password' => bcrypt($fields['password']),
            ]);

            $accessToken = JWTAuth::fromUser($user);
            $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);

            $cookieXsrftoken = Cookie::forget('XSRF-TOKEN');
            $cookieSession = Cookie::forget('laravel_session');

            return response([
                'message' => 'Registration successful',
                'token' => $accessToken
            ])
              ->cookie('jwt', $accessToken, 60, null, null, false, false)
              ->cookie('refreshJwt', $refreshToken, 20160, null, null, false, false);
        } catch(ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => 'required|min:8'
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                \Log::warning('ログイン失敗: ユーザーが見つかりません', ['email' => $request->email]);
                throw ValidationException::withMessages([
                    'email' => ['The provided email is not registered.'],
                ]);
            }

            if (!Hash::check($request->password, $user->password)) {
                \Log::warning('ログイン失敗: パスワード不一致', ['email' => $request->email]);
                throw ValidationException::withMessages([
                    'password' => ['The password does not match our records.'],
                ]);
            }

            try {
                $accessToken = JWTAuth::fromUser($user);
                $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);
            } catch (JWTException $e) {
                \Log::error('JWT生成エラー: ' . $e->getMessage());
                return response()->json(['error' => 'Could not create token'], 500);
            }

            $csrfToken = bin2hex(random_bytes(32));
            $cookieDomain = app()->environment('local') ? null : parse_url(config('app.url'), PHP_URL_HOST);

            return Response::json([
                'message' => 'Logged in successfully',
                'authUser' => [
                    'name' => $user->name,
                    'user_id' => $user->id,
                    'avatar' => $user->avatar,
                ]
            ])
            ->cookie('XSRF-TOKEN', $csrfToken, 120, '/', $cookieDomain, false, false, false, app()->environment('local') ? 'Lax' : 'None')
            ->cookie('jwt', $accessToken, 60, '/', $cookieDomain, false, true, false, app()->environment('local') ? 'Lax' : 'None')
            ->cookie('refreshJwt', $refreshToken, 20160, '/', $cookieDomain, false, true, false, app()->environment('local') ? 'Lax' : 'None');

        } catch (ValidationException $e) {
            \Log::error('ログインバリデーションエラー: ' . json_encode($e->errors()));
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('ログインエラー: ' . $e->getMessage());
            return response()->json(['error' => 'Unauthorized'], 500);
        }
    }

    public function logout()
    {
        $response = response()->json(['message' => 'success']);

        return $response
            ->withCookie(Cookie::forget('jwt'))
            ->withCookie(Cookie::forget('refreshJwt'))
            ->withCookie(Cookie::forget('XSRF-TOKEN'));
    }

    public function refreshToken(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refreshJwt');

            if(!$refreshToken) {
                return response()->json(['error' => 'unauthorized'], 401);
            }

            $newAccessToken = JWTAuth::setToken($refreshToken)->refresh();
            $cookieDomain = app()->environment('local') ? null : parse_url(config('app.url'), PHP_URL_HOST);

            return response()->json([
                'message' => 'Token refreshed'
            ])->cookie('jwt', $newAccessToken, 15, '/', $cookieDomain, false, true, false, app()->environment('local') ? 'Lax' : 'None');
        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid refresh token'], 403);
        }
        return response()->json(['message' => 'something wrong']);
    }

    public function getAvatar()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if($user->avatar == null) {
            return $user->avatar = null;
        }
        $user->avatar = $user->avatar;


        return response()->json($user->avatar);
    }


}
