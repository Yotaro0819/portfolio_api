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

        $success = $this->commentService->createComment($request->only('post_id', 'comment'));

        if ($success) {
            return response()->json(['message' => 'Comment added successfully'], 201);
        } else {
            return response()->json(['message' => 'Failed to post your comment'], 500);
        }
    }
}
