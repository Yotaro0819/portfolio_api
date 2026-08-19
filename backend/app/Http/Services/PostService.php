<?php
namespace App\Http\Services;

use App\Models\Post;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PostService {
    public function getPosts($user, $perPage = 24) {
        $posts = Post::with('user')
        ->withCount('likes')
        ->paginate($perPage);

        $posts->getCollection()->transform(function($post) use ($user) {
            $post->image = $post->image;
            $post->isLiked = $user ? $post->likes()->where('user_id', $user->id)->exists() : false;
            return $post;
        });

        $message = !$posts->hasMorePages() ? 'This is the last Page' : null;

        return [$posts, $message];
        }

        public function createPost(array $fields, $user)
        {
            if (isset($fields['image']) && $fields['image'] instanceof UploadedFile) {
                $path = $fields['image']->store('posts', 's3');
                $fields['image'] = Storage::disk('s3')->url($path);
            }

            return Post::create(array_merge(
                $fields,
                ['user_id' => $user->id, 'owner_id' => $user->id]
            ));
        }
}
