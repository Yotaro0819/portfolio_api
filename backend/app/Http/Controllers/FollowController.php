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
        $authUser = JWTAuth::parseToken()->authenticate();

        $followers = Follow::where('following_id', $user->id)
        ->with('follower:id,name,avatar')
        ->get()
        ->map(function ($follow) use ($authUser) {
            return [
                'id' => $follow->follower->id,
                'name' => $follow->follower->name,
                'avatar' => $follow->follower->avatar ? asset('storage/'. $follow->follower->avatar) : null,
                'isFollowing' => Follow::where('follower_id', $authUser->id)
                                        ->where('following_id', $follow->follower->id)
                                        ->exists(),
            ];
        });

        // foreach($followers as $follower) {
        //     if($follower->follower) {
        //         if($follower->follower->avatar !== null) { //null以外の時はstorageのパスへ
        //             $follower->follower->avatar = asset('storage/'. $follower->follower->avatar);
        //         }
        //         // nullは特に処理を行わない
        //     }
        // }

        return response()->json($followers);
    }

    public function fetchFollowing(Request $request, $id)
    {
        $jwt = $request->cookie('jwt');

        if (!$jwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::findOrFail($id);

        $authUser = JWTAuth::parseToken()->authenticate();

        $followings = Follow::where('follower_id', $user->id)
        ->with('following:id,name,avatar')
        ->get()
        ->map(function ($follow) use ($authUser) {
            return [
                'id' => $follow->following->id,
                'name' => $follow->following->name,
                'avatar' => $follow->following->avatar ? asset('storage/'. $follow->following->avatar) : null,
                'isFollowing' => Follow::where('follower_id', $authUser->id)
                                        ->where('following_id', $follow->following->id)
                                        ->exists(),
            ];
        });

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

    public function follow($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if(Follow::where('follower_id', $user->id)->where('following_id', $id)->exists()) {
            return response()->json(['message' => 'already following this user' ]);
        }

        Follow::create([
            'follower_id' => $user->id,
            'following_id' => $id
        ]);

        return response()->json(['message' => 'successfully follow this user']);
    }

    public function unfollow($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        Follow::where('follower_id', $user->id)->where('following_id', $id)->delete();

        return response()->json(['message' => 'successfully unfollow this user']);
    }
}
