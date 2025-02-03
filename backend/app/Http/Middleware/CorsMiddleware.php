<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // CORSヘッダーを設定
        $response->headers->set('Access-Control-Allow-Origin', 'http://127.0.0.1:5173'); // または許可するオリジン
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        // OPTIONSリクエスト（プリフライトリクエスト）に対しては200を返す
        if ($request->getMethod() == "OPTIONS") {
            return response('', 200);
        }

        return $response;
    }
}
