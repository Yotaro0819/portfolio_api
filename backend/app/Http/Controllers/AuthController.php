<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Services\AuthService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    protected $authService;
    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function checkAuth(Request $request)
{
    try {
        $jwt = $request->cookie('jwt');  // CookieからJWTを取得

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }


        $userId = JWTAuth::parseToken()->authenticate()->id;

        $authUser = User::find($userId);

        return response()->json(['message' => 'authorize']);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }
}

public function register(RegisterRequest $request)
{
    $data = $request->validated();

    $result = $this->authService->registerUser($data);

    $cookieXsrftoken = Cookie::forget('XSRF-TOKEN');
    $cookieSession   = Cookie::forget('laravel_session');

    return response()->json([
        'message' => 'Registration successful',
        'user'    => [
            'name'   => $result['user']->name,
            'email'  => $result['user']->email,
            'user_id'=> $result['user']->id,
        ],
        'token'   => $result['accessToken'],
    ], 201);
}

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => 'required|min:8'
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                throw ValidationException::withMessages([
                    'email' => ['The provided email is not registered.'],
                ]);
            }

            // パスワードを確認
            if (!Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'password' => ['The password does not match our records.'],
                ]);
            }

            // JWTトークンを生成
            try {
                $accessToken = JWTAuth::fromUser($user);
                $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);
            } catch (JWTException $e) {
                return response()->json(['error' => 'Could not create token'], 500);
            }

            // CSRFトークンを生成
            $csrfToken = bin2hex(random_bytes(32));

            return Response::json([
                'message' => 'Logged in successfully',
                'authUser' => [
                    'name' => $user->name,
                    'user_id' => $user->id,
                    'avatar' => $user->avatar,
                ]
            ])
            ->cookie('XSRF-TOKEN', $csrfToken, 120, '/', '127.0.0.1', false, false, true, 'Lax') // CSRFトークン
            ->cookie('jwt', $accessToken, 60, '/', '127.0.0.1' , false, true, true, 'Lax') // アクセストークン
            ->cookie('refreshJwt', $refreshToken, 20160, '/', '127.0.0.1', false, true, true, 'Lax'); // リフレッシュトークン


        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 500);
        }
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
            ])->cookie('jwt', $newAccessToken, 15, '/', 'd39hmozy4wec8b.cloudfront.net',null, true, true, 'None');
        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid refresh token'], 403);
        }
        return response()->json(['message' => 'something wrong']);
    }

    public function getAvatar()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if($user->avatar == null) {
            return $user->avatar = null;
        }
        $user->avatar = $user->avatar;


        return response()->json($user->avatar);
    }


}
