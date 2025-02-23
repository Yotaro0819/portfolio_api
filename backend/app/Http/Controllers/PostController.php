<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostController extends Controller
{
    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();
        // withCount('リレーション')とするとテーブル名の単数_countという変数名で合計を取得できる
        $posts = Post::with('user')->withCount('likes')->where('user_id', '!=', $user->id)->get();

        $posts->each(function ($post) use ($user) {
            $post->image = asset('storage/'. $post->image);
            $post->isLiked = $user ? $post->likes()->where('user_id', $user->id)->exists() : false;
        });
        

        return response()->json([
            'posts' => $posts
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
        'image' => 'required|image', // 画像ファイルであることを明示
        'price' => 'required|numeric|min:0',
    ]);

    // バリデーション失敗時の処理
    if ($validator->fails()) {
        return response()->json([
            'error' => 'Validation failed',
            'messages' => $validator->errors() // 各フィールドごとのエラーメッセージを取得
        ], 422);
    }

    try {
        // $fields = $request->validate([
        //     'title' => 'required|max:255',
        //     'body'  => 'required',
        //     'image' => 'required',
        //     'price' => 'required|numeric|min:0',
        // ]);

        $fields = $request->all();

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
            $fields['image'] = $imagePath;
        }

        $post = Post::create(array_merge($fields, ['user_id' => $user->id, 'owner_id' => $user->id]));

        return response()->json($post, 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to create post',
            'message' => $e->getMessage(),
        ], 500);
    }
}


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        // $post = Post::findOrFail($id);
        $post = Post::with('user')->withCount('likes')->findOrFail($id);
        $post->isLiked = $user ? $post->likes()->where('user_id', $user->id)->exists() : false;
        $post->image = asset('storage/'. $post->image);

        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        try {
            Gate::authorize('modify', $post);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            // カスタムメッセージを追加
            return response()->json([
                'error' => 'You do not have permission to modify this post',
                'message' => $e->getMessage(), // オリジナルのメッセージ
            ], 403);
        }

        $fields = $request->validate([
            'title' => 'required|max:255',
            'body'  => 'required',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // 新しい画像を保存
            $imagePath = $request->file('image')->store('uploads', 'public');

            // 古い画像があれば削除（任意）
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }

            // 画像パスを `$fields` に追加
            $fields['image'] = $imagePath;
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
                $post->image = asset('storage/'. $post->image);
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
                $post->image = asset('storage/'. $post->image);
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
                $post->image = asset('storage/'. $post->image);
            });

            return response()->json($own_posts);
        } catch(\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}
