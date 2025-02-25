<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class SearchController extends Controller
{
    public function search(Request $request)
    {

        $user = JWTAuth::parseToken()->authenticate();

        $query = $request->query('query');
        $type = $request->query('type');


        if(empty($query)) {
            $posts = Post::with('user')->get();
        } else {
            if ($type === 'user') {
                $posts = Post::whereHas('user', function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%"); // 修正
                })
                ->with('user')
                ->get();
            } elseif ($type === 'post') {
                $posts = Post::where('title', 'like', "%{$query}%") // 修正
                                    ->with('user')
                                    ->get();
            }
        }


        $posts->each(function ($post) use ($user) {
            $post->image = asset('storage/'. $post->image);
            $post->isLiked = $user ? $post->likes()->where('user_id', $user->id)->exists() : false;
        });

        if ($posts->isEmpty()) {
            return response()->json(['posts' => []]);
        }

        return response()->json(['posts' => $posts]);
    }
}
