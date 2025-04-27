<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentController extends Controller
{
    public function getComments($id)
    {
        $comments = Comment::where('post_id', $id)
                            ->with(['user:id,name,avatar'])
                            ->get()
                            ->map(function ($comment) {
                                if ($comment->user->avatar) {
                                    $avatar = $comment->user->avatar;

                                    // すでに http から始まるならそのまま、それ以外ならフルパスに変換
                                    if (!str_starts_with($avatar, 'http')) {
                                        $comment->user->avatar = asset('storage/' . ltrim($avatar, '/'));
                                    }
                                }
                                return $comment;
                            });

        return response()->json($comments);
    }

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
