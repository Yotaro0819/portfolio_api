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
        if ($request->is('api/refresh-token')) {
            return $next($request);
        }

        if ($jwt = $request->cookie('jwt')) {
            Log::info('JWT Token: ' . $jwt);
            $request->headers->set('Authorization', 'Bearer ' . $jwt);
            Log::info('Authorization Header: ' . $request->header('Authorization'));
        } else {
            return response()->json(['error' => 'Oops! Unauthorized'], 401);
        }



        return $next($request);
    }
}


