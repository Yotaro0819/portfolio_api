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

        $allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173', 'https://d39hmozy4wec8b.cloudfront.net'];

    $origin = $request->headers->get('Origin');

    if (in_array($origin, $allowedOrigins)) {
        $response->headers->set('Access-Control-Allow-Origin', $origin);
    }
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        // $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
        // 追加のCORSヘッダー
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept, Origin');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        // OPTIONSリクエスト（プリフライトリクエスト）に対しては200を返す
        if ($request->getMethod() == "OPTIONS") {
            // return response('', 200);
            return response('', 200)
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept, Origin')
          ->header('Access-Control-Allow-Origin', 'true');
        }

        return $response;
    }
}
