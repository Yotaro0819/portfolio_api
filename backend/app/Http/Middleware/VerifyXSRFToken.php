<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VerifyXSRFToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-XSRF-TOKEN');
        $csrfCookie = $request->cookie('XSRF-TOKEN');


        if ($token !== $csrfCookie) {
            // CSRFトークンが一致しない場合のエラーログ
            Log::error('CSRF token mismatch or missing.', [
                'token' => $token,
                'csrf_cookie' => $csrfCookie
            ]);

            // JSONレスポンスを返す
            return response()->json(['message' => 'CSRF Token mismatch or missing.'], 403);
        }

        return $next($request);
    }
}
