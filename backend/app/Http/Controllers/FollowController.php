<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class FollowController extends Controller
{
    public function fetchFollowers(Request $request)
    {

        $jwt = $request->cookie('jwt');

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = JWTAuth::parseToken()->authenticate()->id;
        // $authUser = User::find($userId);

        $followers = Follow::where('following_id', $userId)
        ->with('follower:id,name,avatar')->get();

        return response()->json($followers);
    }

    public function fetchFollowing(Request $request)
    {
        $jwt = $request->cookie('jwt');

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = JWTAuth::parseToken()->authenticate()->id;
        // $authUser = User::find($userId);

        $following = Follow::where('follower_id', $userId)
        ->with('following:id,name,avatar')->get();

        return response()->json($following);
    }

    public function countFollows(Request $request)
    {
        $jwt = $request->cookie('jwt');

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = JWTAuth::parseToken()->authenticate()->id;

        $followerCount = User::find($userId)->followers()->count();
        $followingCount = User::find($userId)->following()->count();
        return response()->json(['followerCount' => $followerCount, 'followingCount' => $followingCount]);

    }
}
