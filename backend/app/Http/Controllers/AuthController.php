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

            // JWTトークンを発行
            $accessToken = JWTAuth::fromUser($user);
            $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);

            // 不要なセッションクッキーを削除
            $cookieXsrftoken = Cookie::forget('XSRF-TOKEN');
            $cookieSession = Cookie::forget('laravel_session');

            return response([
                'message' => 'Registration successful',
                'token' => $accessToken
            ])->withCookie($cookieXsrftoken)
              ->withCookie($cookieSession)
              ->cookie('jwt', $accessToken, 60, null, null, false, true)
              ->cookie('refreshJwt', $refreshToken, 20160, null, null, false, true );
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

            if(!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'password' => ['The password do not match our records.'],
                ]);
            }

            $userName = $user->name;
            $userId   = $user->id;
            $avatar   = $user->avatar;

            // noneになってないかだけ確認
            // $parts = explode('.', $accessToken);
            // $header = json_decode(base64_decode($parts[0]), true);
            // \Log::info('JWT Algorithm: ' . ($header['alg'] ?? 'Not found'));
            // dd($header);
            $accessToken = JWTAuth::fromUser($user);
            $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);

            $csrfToken = bin2hex(random_bytes(32));

            return Response::json([
                'message' => 'Logged in successfully',
                'authUser' => [
                    'name' => $userName,
                    'user_id' => $userId,
                    'avatar' => $avatar],
            ])
            ->cookie('XSRF-TOKEN', $csrfToken, 120, '/', null, false, false)
            ->cookie('jwt', $accessToken, 60, null, null, false, true)
            ->cookie('refreshJwt', $refreshToken, 20160, null, null, false, true);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 500);
        }
    }

    public function logout()
    {
        $cookieAccess = Cookie::forget('jwt');
        $cookieRefresh = Cookie::forget('refreshJwt');

        return response([
            'message' => 'success',
        ])
        ->withCookie($cookieAccess)
        ->withCookie($cookieRefresh);
    }

    public function refreshToken(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refreshJwt');

            if(!$refreshToken) {
                return response()->json(['error' => 'unauthorized'], 401);
            }

            $newAccessToken = JWTAuth::setToken($refreshToken)->refresh();

            return response()->json([
                'message' => 'Token refreshed'
            ])->cookie('jwt', $newAccessToken, 15, null,null, false, true);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid refresh token'], 403);
        }
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
