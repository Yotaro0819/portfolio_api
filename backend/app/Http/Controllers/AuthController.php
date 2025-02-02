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
        $user = JWTAuth::setToken($jwt)->authenticate();

        return response()->json(['user' => $user]);
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
        $token = JWTAuth::fromUser($user);

        // 不要なセッションクッキーを削除
        $cookieXsrftoken = Cookie::forget('XSRF-TOKEN');
        $cookieSession = Cookie::forget('laravel_session');

        return response([
            'message' => 'Registration successful',
            'token' => $token
        ])->withCookie($cookieXsrftoken)
          ->withCookie($cookieSession);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|min:8'
        ]);

        $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        $token = JWTAuth::fromUser($user);

        return Response::json([
            'message' => 'Logged in successfully',
        ])->cookie('jwt', $token, 60, null, null, false, true); // httpOnly CookieにJWTを格納
    }

    return Response::json(['error' => 'Unauthorized'], 401);
    }

    public function logout()
    {
        $cookie = Cookie::forget('jwt');
        return response([
            'message' => 'success',
        ])->withCookie($cookie);
    }



}
