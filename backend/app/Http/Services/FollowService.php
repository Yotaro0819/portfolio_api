<?php

namespace App\Http\Services;

use App\Models\Follow;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class FollowService
{
    public function followUser($followedUserId)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (Follow::where('follower_id', $user->id)->where('following_id', $followedUserId)->exists()) {
            return ['success' => false, 'message' => 'already following this user'];
        }

        Follow::create([
            'follower_id' => $user->id,
            'following_id' => $followedUserId,
        ]);

        return ['success' => true, 'message' => 'successfully follow this user'];
    }

    public function unfollowUser($followedUserId)
    {
        $user = JWTAuth::parseToken()->authenticate();

        Follow::where('follower_id', $user->id)->where('following_id', $followedUserId)->delete();

        return ['success' => true, 'message' => 'successfully unfollow this user'];
    }

    public function getFollowers($userId)
    {
        $user = User::findOrFail($userId);
        $authUser = JWTAuth::parseToken()->authenticate();

        $followers = Follow::where('following_id', $user->id)
            ->with('follower:id,name,avatar')
            ->get()
            ->map(function ($follow) use ($authUser) {
                return [
                    'id' => $follow->follower->id,
                    'name' => $follow->follower->name,
                    'avatar' => $follow->follower->avatar ? asset($follow->follower->avatar) : null,
                    'isFollowing' => Follow::where('follower_id', $authUser->id)
                        ->where('following_id', $follow->follower->id)
                        ->exists(),
                ];
            });
        return $followers;
    }

    public function getFollowing($userId)
    {
        $user = User::findOrFail($userId);

        $authUser = JWTAuth::parseToken()->authenticate();

        $followings = Follow::where('follower_id', $user->id)
            ->with('following:id,name,avatar')
            ->get()
            ->map(function ($follow) use ($authUser) {
                return [
                    'id' => $follow->following->id,
                    'name' => $follow->following->name,
                    'avatar' => $follow->following->avatar ? asset($follow->following->avatar) : null,
                    'isFollowing' => Follow::where('follower_id', $authUser->id)
                                ->where('following_id', $follow->following->id)
                                ->exists(),
            ];
        });
        return $followings;
    }
}
