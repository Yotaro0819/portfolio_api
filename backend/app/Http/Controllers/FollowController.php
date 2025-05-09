<?php

namespace App\Http\Controllers;

use App\Http\Services\FollowService;

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

    public function countFollows($id)
    {
        $counts = $this->followService->countFollows($id);
        return response()->json($counts);

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
