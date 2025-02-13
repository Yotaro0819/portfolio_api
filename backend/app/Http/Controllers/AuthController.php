<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Response;
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

        // JWTを設定してユーザーを認証
        // $user = JWTAuth::setToken($jwt)->authenticate();

        $userId = JWTAuth::parseToken()->authenticate()->id;

// そのIDを使ってユーザー情報を取得
        $authUser = User::find($userId);

        // $user->load([
        //     'followers:name,avatar',
        //     'following:name,avatar'
        // ]);

        return response()->json([
            // 'user' => [
            //     'name' => $user->name,
            //     'avatar' => $user->avatar,
            //     'followers' => $user->followers,
            //     'following' => $user->following
            // ]
            // 'authUser' => $authUser,
        ]);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }
}

    public function register(Request $request)
    {
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
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|min:8'
        ]);

        $credentials = $request->only('email', 'password', 'avatar');

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        $userName = $user->name;
        $userId   = $user->id;
        $avatar   = $user->avatar;
        $accessToken = JWTAuth::fromUser($user);
        $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);

        return Response::json([
            'message' => 'Logged in successfully',
            'authUser' => [
                'name' => $userName,
                'user_id' => $userId,
                'avatar' => $avatar],
        ])
        ->cookie('jwt', $accessToken, 60, null, null, false, true)
        ->cookie('refreshJwt', $refreshToken, 20160, null, null, false, true);
    }

    return Response::json(['error' => 'Unauthorized your'], 401);
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

        $user->avatar = asset('storage/' . $user->avatar);

        return response()->json($user->avatar);
    }


}
