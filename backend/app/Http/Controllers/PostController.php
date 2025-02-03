<?php

namespace App\Http\Controllers;

use App\Http\Middleware\AuthenticateJWT;
use App\Models\Post;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostController extends Controller
{
    public function index()
    {
        return Post::all();
    }

    /**
     * Store a newly created resource in storage.
     */

public function store(Request $request)
{
    // JWT トークンが送信されていることを確認
    // これによってjwtトークンのペイロードをデコードしてuserを取得する。
    $user = JWTAuth::parseToken()->authenticate();

    // ユーザーが認証されていなければ 401 エラーを返す
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    try {
        $fields = $request->validate([
            'title' => 'required|max:255',
            'body'  => 'required',
            'image' => 'nullable',
            'price' => 'required|numeric|min:0',
        ]);

        // 画像の保存
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
            $fields['image'] = $imagePath;
        }

        // デコードしたuserからid取得
        $post = Post::create(array_merge($fields, ['user_id' => $user->id]));

        return response()->json($post, 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to create post',
            'message' => $e->getMessage(),
        ], 500);
    }
}


    public function show(Post $post)
    {
        return $post;
    }

    public function update(Request $request, Post $post)
{
    try {
        Gate::authorize('modify', $post);
    } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
        // カスタムメッセージを追加
        return response()->json([
            'error' => 'You do not have permission to modify this post',
            'message' => $e->getMessage(),
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


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
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


        $post->delete();

        return ['message' => 'post was deleted'];
    }
}
