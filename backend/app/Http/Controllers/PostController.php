<?php

namespace App\Http\Controllers;

use App\Http\Services\PostService;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService) {
        $this->postService = $postService;
    }

    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();

        [$posts, $message] = $this->postService->getPosts($user);

        return response()->json([
            'data' => $posts->items(),
            'next_page_url' => $posts->nextPageUrl(),
            'message' => $message,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'body'  => 'required',
            'image' => 'required|image',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        try {
            // バリデーション済みデータを取得
            $fields = $validator->validated();

            // Service に委譲
            $post = $this->postService->createPost($fields, $user);

            return response()->json($post, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create post',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        // $post = Post::findOrFail($id);
        $post = Post::with('user')->withCount('likes')->findOrFail($id);
        $post->isLiked = $user ? $post->likes()->where('user_id', $user->id)->exists() : false;
        $post->image = $post->image;

        return response()->json($post);
    }

    public function update(Request $request, Post $post)
    {
        try {
            Gate::authorize('modify', $post);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'error' => 'You do not have permission to modify this post',
                'message' => $e->getMessage()
            ], 403);
        }

        $fields = $request->validate([
            'title' => 'required|max:255',
            'body'  => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads', 's3');
            $fields['image'] = Storage::disk('s3')->url($imagePath);

            if ($post->image) {
                $oldPath = str_replace(Storage::disk('s3')->url(''), '', $post->image);
                Storage::disk('s3')->delete($oldPath);
            }

        }

        // データを更新
        $post->update($fields);

        // 成功した場合のレスポンスを返す
        return response()->json([
            'message' => 'Post updated successfully!',
            'post' => $post
        ], 200);
    }

    public function destroy($postId)
    {
        $post = Post::find($postId);
        if ($post) {

            if($post->image) {
                Storage::delete($post->image);
            }
            $post->delete();
        }

        return ['message' => 'post was deleted'];
    }

    public function getYourPosts($id)
    {
        try {
            $user = User::findOrFail($id);
            $my_posts = Post::where('user_id', $user->id)->latest()->limit(6)->get();

            $my_posts->each(function ($post) {
                $post->image = $post->image;
            });

            return response()->json($my_posts);
        } catch(\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function getLikePosts($id)
    {
        try {
            $user = User::findOrFail($id);
            $liked_posts = $user->likedPosts()->latest()->limit(6)->get();

            $liked_posts->each(function ($post) {
                $post->image = $post->image;
            });

            return response()->json($liked_posts);
        } catch(\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function getOwnPosts($id)
    {
        try {
            $user = User::findOrFail($id);
            $own_posts = Post::where('owner_id', $user->id)->latest()->limit(6)->get();

            $own_posts->each(function($post) {
                $post->image = $post->image;
            });

            return response()->json($own_posts);
        } catch(\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}
