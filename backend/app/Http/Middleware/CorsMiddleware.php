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

        $allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173']; // 許可するオリジン

    $origin = $request->headers->get('Origin');

    if (in_array($origin, $allowedOrigins)) {
        $response->headers->set('Access-Control-Allow-Origin', $origin);
    }
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
