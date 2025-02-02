<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Log;

class AuthenticateJWT extends Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed  ...$guards
     * @return \Symfony\Component\HttpFoundation\Response|\Illuminate\Http\Response|mixed
     */


    public function handle($request, Closure $next, ...$guards)
    {
        if ($jwt = $request->cookie('jwt')) {
            Log::info('JWT Token: ' . $jwt);

            $request->headers->set('Authorization', 'Bearer ' . $jwt);
            Log::info('Authorization Header: ' . $request->header('Authorization'));

        }
        return $next($request);
    }
}




// namespace App\Http\Middleware;

// use Closure;
// use Tymon\JWTAuth\Facades\JWTAuth;
// use Illuminate\Http\Request;

// class AuthenticateJWT
// {
//     public function handle(Request $request, Closure $next)
//     {
//         // httpOnly Cookie から JWT トークンを取得
//         $token = $request->cookie('jwt');

//         if (!$token) {
//             return response()->json(['error' => 'noJwtToken'], 401);
//         }

//         // トークンをセットして認証
//         JWTAuth::setToken($token);

//         try {
//             // トークンの検証とユーザーの認証
//             $user = JWTAuth::authenticate();
//         } catch (\Exception $e) {
//             return response()->json(['error' => 'Unauthorized'], 401);
//         }

//         // 認証したユーザーをリクエストに設定
//         $request->attributes->add(['user' => $user]);

//         return $next($request);
//     }
// }
