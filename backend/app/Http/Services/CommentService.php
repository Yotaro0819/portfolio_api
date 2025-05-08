<?php
namespace App\Http\Services;

use App\Models\Comment;
use Illuminate\http\Request;

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

    public function storeComment(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'comment' => 'required|string|max:500',
        ]);

        $user = auth()->user();
        $userId = $user->id;
        $postId = $validated['post_id'];
        $commentBody = $validated['comment'];

        try {
            // コメントを保存
            $comment = Comment::create([
                'user_id' => $userId,
                'post_id' => $postId,
                'body' => $commentBody,
            ]);
            return $comment;
        } catch (\Exception $e) {
            throw new \Exception('Failed to add comment');
        }
    }
}
