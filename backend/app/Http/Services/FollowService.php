<?php

namespace App\Http\Services;

use App\Models\Follow;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class FollowService
{
    protected $user;
    public function __construct()
    {
        $this->user = JWTAuth::parseToken()->authenticate();
    }

    public function followUser($followedUserId)
    {
        if (Follow::where('follower_id', $this->user->id)->where('following_id', $followedUserId)->exists()) {
            return ['success' => false, 'message' => 'already following this user'];
        }

        Follow::create([
            'follower_id' => $this->user->id,
            'following_id' => $followedUserId,
        ]);

        return ['success' => true, 'message' => 'successfully follow this user'];
    }

    public function unfollowUser($followedUserId)
    {
        Follow::where('follower_id', $this->user->id)->where('following_id', $followedUserId)->delete();

        return ['success' => true, 'message' => 'successfully unfollow this user'];
    }

    public function getFollowers($userId)
    {
        $user = User::findOrFail($userId);
        $authUser = $this->user;

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

        $authUser = $this->user;

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

    public function countFollows($userId)
    {
        $user = User::findOrFail($userId);

        return [
            'followerCount' => $user->followers()->count(),
            'followingCount' => $user->following()->count(),
        ];
    }
}
