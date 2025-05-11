<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function getUser($id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $user = User::select('id', 'name', 'avatar', 'stripe_account_id', 'bio')
        ->withCount(['followers', 'following'])
        ->findOrFail($id);

        if($user->avatar !== null) {
        $user->avatar = $user->avatar ? Storage::disk('s3')->url($user->avatar) : null;
        }
        $user->isFollowing = Follow::where('follower_id', $authUser->id)->where('following_id', $id)->exists();

        return response()->json($user);
    }
}

