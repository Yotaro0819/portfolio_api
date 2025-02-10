<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\PaypalController;
use App\Http\Controllers\PostController;
use App\Http\Middleware\AuthenticateJWT;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware([ CorsMiddleware::class, AuthenticateJWT::class])->group(function () {
    Route::apiResource('posts', PostController::class);
    Route::get('/check-auth', [AuthController::class, 'checkAuth']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::get('/fetch-followers', [FollowController::class, 'fetchFollowers']);
    Route::get('/fetch-following', [FollowController::class, 'fetchFollowing']);
    Route::get('/count-follows', [FollowController::class, 'countFollows']);
    Route::post('/paypal/create-order/{id}', [PaypalController::class, 'createOrder']);
    Route::get('/payment/success', [PaypalController::class, 'success'])->name('api.success');
    Route::get('/payment/cancel', [PaypalController::class, 'cancel'])->name('api.cancel');
    Route::get('/paypal/config', [PaypalController::class, 'getConfig']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
