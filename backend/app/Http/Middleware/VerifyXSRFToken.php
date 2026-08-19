<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class VerifyXSRFToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-XSRF-TOKEN');

        $csrfCookie = $request->cookie('XSRF-TOKEN');

        if ($token !== $csrfCookie) {
            // トークンが一致しない場合の処理
            Log::error('CSRF token mismatch or missing.');
            return response()->json(['message' => 'CSRF Token mismatch'], 403);
        }

        return $next($request);
    }
}
