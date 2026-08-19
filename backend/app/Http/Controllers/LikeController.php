<?php

namespace App\Http\Controllers;

use App\Http\Services\LikeService;
use App\Models\Like;

class LikeController extends Controller
{
    protected $likeService;
    public function __construct(LikeService $likeService) {
        $this->likeService = $likeService;
    }

    public function store($postId)
    {
        $result = $this->likeService->likePost($postId);
        return response()->json($result);
    }

    public function delete($postId)
    {
        $result = $this->likeService->unlikePost($postId);
        return response()->json($result);
    }
}
