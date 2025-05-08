<?php

namespace App\Http\Controllers;


use App\Models\Comment;
use App\Http\Services\CommentService;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentController extends Controller
{
    protected $commentService;
    public function __construct(CommentService $commentService) {
        $this->commentService = $commentService;
    }

    public function getComments($id)
    {
        $comments = $this->commentService->getComments($id);
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
