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

        $followingUsers = Follow::where('follower_id', $user->id)->pluck('following_id');
        $followerUsers = Follow::where('following_id', $user->id)->pluck('follower_id');

        $allRelatedUsers = $followingUsers->merge($followerUsers)->unique();

        $users = User::whereIn('id', $allRelatedUsers)
                    ->select('id', 'name')
                    ->get();

        $latestMessages = Message::where(function ($query) use ($user, $allRelatedUsers) {
                                    $query->whereIn('sender_id', $allRelatedUsers)
                                        ->where('receiver_id', $user->id)
                                        ->orWhere(function ($q) use ($user, $allRelatedUsers) {
                                            $q->whereIn('receiver_id', $allRelatedUsers)
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

        $result = $users->map(function ($user) use ($latestMessages) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'latest_message' => $latestMessages[$user->id] ?? null,
            ];
        });

        return response()->json($result);
    }

    public function show($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $receiver = User::findOrFail($id);

        $result = Message::where(function ($query) use ($user, $receiver) {
                                $query->where('sender_id', $user->id)
                                    ->where('receiver_id', $receiver->id)
                                    ->orWhere(function ($q) use ($user, $receiver) {
                                        $q->where('receiver_id', $user->id)
                                            ->where('sender_id', $receiver->id);
                                    });
                            })
                            ->with(['sender:id,name', 'receiver:id,name'])
                            ->orderBy('created_at', 'asc')
                            ->get();

        return response()->json($result);
    }

    public function store(Request $request, $id)
    {
        $field = $request->validate([
            'content' => 'required|string|max:255',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        $message = new Message();

        $message->create([
            'sender_id' => $user->id,
            'receiver_id' => $id,
            'content' => $field['content'],
        ]);

        return response()->json(['message' => 'Message sent successfully']);
    }


}
