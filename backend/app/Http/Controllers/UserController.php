<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function getUser($id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $user = User::select('id', 'name', 'avatar')
        ->withCount(['followers', 'following'])
        ->findOrFail($id);

        if($user->avatar !== null) {
        $user->avatar = asset('storage/' . $user->avatar);
        }
        $user->isFollowing = Follow::where('follower_id', $authUser->id)->where('following_id', $id)->exists();

        return response()->json($user);
    }
}

