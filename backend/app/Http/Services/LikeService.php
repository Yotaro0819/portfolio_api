<?php
namespace App\Http\Services;

use App\Models\Like;
use Tymon\JWTAuth\Facades\JWTAuth;

class LikeService
{
    public function likePost($postId)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $like = new Like();
        $like->user_id = $user->id;
        $like->post_id = $postId;
        $like->save();

        // return ['message' => 'liked'];
    }

    public function unlikePost($postId)
    {
        $user = JWTAuth::parseToken()->authenticate();
        Like::where('post_id', $postId)
        ->where('user_id', $user->id)
        ->delete();

    }
}
