<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class FollowController extends Controller
{
    public function fetchFollowers(Request $request, $id)
    {

        $jwt = $request->cookie('jwt');

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::findOrFail($id);
        // $authUser = User::find($userId);

        $followers = Follow::where('following_id', $user->id)
        ->with('follower:id,name,avatar')->get();

        return response()->json($followers);
    }

    public function fetchFollowing(Request $request, $id)
    {
        $jwt = $request->cookie('jwt');

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::findOrFail($id);
        // $authUser = User::find($userId);

        $following = Follow::where('follower_id', $user->id)
        ->with('following:id,name,avatar')->get();

        return response()->json($following);
    }

    public function countFollows(Request $request, $id)
    {
        $jwt = $request->cookie('jwt');

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::findOrFail($id);

        $followerCount = $user->followers()->count();
        $followingCount = $user->following()->count();
        return response()->json(['followerCount' => $followerCount, 'followingCount' => $followingCount]);

    }
}
