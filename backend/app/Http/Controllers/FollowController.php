<?php

namespace App\Http\Controllers;

use App\Http\Services\FollowService;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class FollowController extends Controller
{
    protected $followService;
    public function __construct(FollowService $followService) {
        $this->followService = $followService;
    }

    public function fetchFollowers($id)
    {
        $followers = $this->followService->getFollowers($id);
        return response()->json($followers);
    }

    public function fetchFollowing($id)
    {
        $followings = $this->followService->getFollowing($id);
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
        $result = $this->followService->followUser($id);

        return response()->json(['message' => $result['message']]);
    }

    public function unfollow($id)
    {
        $result = $this->followService->unfollowUser($id);

        return response()->json(['message' => $result['message']]);
    }
}
