<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaypalController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthenticateJWT;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware([ CorsMiddleware::class, AuthenticateJWT::class])->group(function () {
    Route::apiResource('posts', PostController::class);

    // profile
    Route::get('/my-posts/{id}', [PostController::class, 'getYourPosts']);
    Route::get('/like-posts/{id}', [PostController::class, 'getLikePosts']);
    Route::get('/own-posts/{id}', [PostController::class, 'getOwnPosts']);
    Route::get('/user-info/{id}', [UserController::class, 'getUser']);
    Route::patch('/avatar-update', [ProfileController::class, 'uploadAvatar']);

    Route::get('/check-auth', [AuthController::class, 'checkAuth']);
    Route::get('/get-avatar', [AuthController::class, 'getAvatar']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);


    // comments
    Route::post('/comment/store', [CommentController::class, 'store']);

    // messages
    Route::get('/messages/index', [MessageController::class, 'index']);
    Route::get('/messages/show/{id}', [MessageController::class, 'show']);
    Route::post('/messages/store/{id}', [MessageController::class, 'store']);

    // likes
    Route::delete('/like/{id}', [LikeController::class, 'delete']);
    Route::post('/like/{id}', [LikeController::class, 'store']);

    // follows
    Route::get('/fetch-followers/{id}', [FollowController::class, 'fetchFollowers']);
    Route::get('/fetch-following/{id}', [FollowController::class, 'fetchFollowing']);
    Route::get('/count-follows/{id}', [FollowController::class, 'countFollows']);
    Route::post('/follow/{id}', [FollowController::class, 'follow']);
    Route::post('/unfollow/{id}', [FollowController::class, 'unfollow']);

    // paypal
    Route::post('/paypal/create-order/{id}', [PaypalController::class, 'createOrder']);
    Route::get('/payment/cancel', [PaypalController::class, 'cancel'])->name('api.cancel');
    Route::get('/paypal/config', [PaypalController::class, 'getConfig']);

    // stripe
    Route::post('/stripe/connect-account/{id}', [StripeController::class, 'connectStripe']);
    Route::post('/stripe/create-order/{id}', [StripeController::class,'createOrder']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/payment/success', [PaypalController::class, 'success'])->name('api.success');
