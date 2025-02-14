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

        foreach($followers as $follower) {
            if($follower->follower) {
                if($follower->follower->avatar !== null) { //null以外の時はstorageのパスへ
                    $follower->follower->avatar = asset('storage/'. $follower->follower->avatar);
                }
                // nullは特に処理を行わない
            }
        }

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

        $followings = Follow::where('follower_id', $user->id)
        ->with('following:id,name,avatar')->get();

        foreach($followings as $following) {
            if($following->following) {
                if($following->following->avatar !== null) { //null以外の時はstorageのパスへ
                    $following->following->avatar = asset('storage/'. $following->following->avatar);
                }
                // nullは特に処理を行わない
            }
        }

        return response()->json($followings);
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
