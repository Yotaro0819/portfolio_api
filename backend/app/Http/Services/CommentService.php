<?php
namespace App\Http\Services;

use App\Models\Comment;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentService
{
    public function getComments($postId)
    {
        $comments = Comment::where('post_id', $postId)
            ->with(['user:id,name,avatar'])
            ->get()
            ->map(function ($comment) {
                if ($comment->user->avatar) {
                    $avatar = $comment->user->avatar;

                    if (!str_starts_with($avatar, 'http')) {
                        $comment->user->avatar = asset('storage/' . ltrim($avatar, '/'));
                    }
                }
                return $comment;
            });

        return $comments;
    }

    public function createComment($data)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            Comment::create([
                'user_id' => $user->id,
                'post_id' => $data['post_id'],
                'body' => $data['comment'],
            ]);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to create comment: ' . $e->getMessage());
            return false;
        }
    }
}
