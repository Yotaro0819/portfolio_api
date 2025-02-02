<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;

class AuthenticateJWT
{
    public function handle(Request $request, Closure $next)
    {
        // httpOnly Cookie から JWT トークンを取得
        $token = $request->cookie('jwt');

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // トークンをセットして認証
        JWTAuth::setToken($token);

        try {
            // トークンの検証とユーザーの認証
            $user = JWTAuth::authenticate();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // 認証したユーザーをリクエストに設定
        $request->attributes->add(['user' => $user]);

        return $next($request);
    }
}
