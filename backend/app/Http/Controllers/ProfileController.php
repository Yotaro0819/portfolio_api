<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileController extends Controller
{
    public function uploadAvatar(Request $request)
    {

        try {
            $user = JWTAuth::parseToken()->authenticate();

            if(!$user) {
                return response()->json(['message' => 'fetch error'], 404);
            }

            if($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('avatars/' . $fileName . 'public');
            } else {
                return response()->json(['message' => 'No file uploaded'], 400); // ファイルがアップロードされていない場合
            }

            $user->avatar = $filePath;
            $user->save();

            return response()->json([
                'message' => 'Avatar Uploaded Successfully',
                'avatar_url' => asset('storage/'. $filePath),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'failed uploading avatar', 'error' => $e->getMessage()], 500);
        }
    }
}
