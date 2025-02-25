<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'comment' => 'required|string|max:500',
        ]);

        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;
            $postId = $request->post_id;
            $comment = $request->comment;

            Comment::create([
                'user_id' => $userId,
                'post_id' => $postId,
                'body' => $comment,
            ]);

            return  response()->json(['message' => 'Comment added successfully'], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'failed to post your comment'], 500);
        }


    }
}
