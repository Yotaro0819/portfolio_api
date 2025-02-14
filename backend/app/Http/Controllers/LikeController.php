<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class LikeController extends Controller
{
    public function store($postId)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $like = new Like();
        $like->user_id = $user->id;
        $like->post_id = $postId;

        $like->save();

        return response()->json(['message' => 'liked']);
    }

    public function delete($postId)
    {
        $user = JWTAuth::parseToken()->authenticate();
        Like::where('post_id', $postId)
                ->where('user_id', $user->id)
                ->delete();

        return response()->json(['message' => 'unliked']);
    }
}
