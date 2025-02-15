<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class MessageController extends Controller
{
    public function index()
{
    $user = JWTAuth::parseToken()->authenticate();

    // フォローしているユーザーの ID を取得
    $followingUsers = Follow::where('follower_id', $user->id)
                            ->pluck('following_id');

    // フォロー中のユーザー情報を取得（id, name だけ）
    $users = User::whereIn('id', $followingUsers)
                ->select('id', 'name')
                ->get();

    // 各フォロー中ユーザーごとの最新メッセージを取得
    $latestMessages = Message::where(function ($query) use ($user, $followingUsers) {
                                    $query->whereIn('sender_id', $followingUsers)
                                        ->where('receiver_id', $user->id)
                                        ->orWhere(function ($q) use ($user, $followingUsers) {
                                            $q->whereIn('receiver_id', $followingUsers)
                                                ->where('sender_id', $user->id);
                                        });
                                })
                                ->with(['sender:id,name', 'receiver:id,name'])
                                ->orderBy('created_at', 'desc')
                                ->get()
                                ->groupBy(function ($message) use ($user) {
                                    return $message->sender_id === $user->id ? $message->receiver_id : $message->sender_id;
                                })
                                ->map(function ($messages) {
                                    return $messages->first();
                                });

    // ユーザー一覧に、それぞれの最新メッセージを結びつける
    $result = $users->map(function ($user) use ($latestMessages) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'latest_message' => $latestMessages[$user->id] ?? null,
        ];
    });

    return response()->json($result);
}


}
