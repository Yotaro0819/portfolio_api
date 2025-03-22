<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Pusher\Pusher;

class PusherController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function broadcast(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'sender_id' => 'required',
            'receiver_id' => 'required',
        ]);

        $senderId = $request->input('sender_id');

        // メッセージをデータベースに保存
        $chat = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $request->input('receiver_id'),
            'content' => $request->input('message'),
        ]);

        // Pusher インスタンスを作成
        $pusher = new Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
            [
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
                'useTLS' => config('broadcasting.connections.pusher.options.useTLS'),
            ]
        );

        // Pusher でイベントを送信
        $pusher->trigger('public', 'chat', [
            'message' => $request->get('message'),
            'sender_id' => $request->get('sender_id'),
            'receiver_id' => $request->get('receiver_id'),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $chat,
        ]);
    }

    public function receive(Request $request)
    {
        $receiverId = $request->query('receiver_id');
        $senderId = $request->query('sender_id');

        $messages = Message::where(function ($query) use ($senderId, $receiverId) {
                $query->where('sender_id', $senderId)
                      ->where('receiver_id', $receiverId);
            })
            ->orWhere(function ($query) use ($senderId, $receiverId) {
                $query->where('sender_id', $receiverId)
                      ->where('receiver_id', $senderId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'messages' => $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'message' => $message->message,
                    'created_at' => $message->created_at->format('Y-m-d H:i:s'),
                ];
            }),
        ]);
    }
}
