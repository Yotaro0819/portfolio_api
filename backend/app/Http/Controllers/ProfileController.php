<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
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
                $filePath = $file->storeAs('avatars' , $fileName, 's3');

            } else {
                return response()->json(['message' => 'No file uploaded'], 400);
            }

            if ($user->avatar) {
                Storage::disk('s3')->delete($user->avatar);
            }

            $user->avatar = $filePath;
            $user->save();

            return response()->json([
                'message' => 'Avatar Uploaded Successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'failed uploading avatar', 'error' => $e->getMessage()], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ], [
            'current_password.required' => 'Current password is required',
            'new_password.required' => 'New password is required',
            'new_password.min' => 'New password must be at least 8 characters',
            'new_password.confirmed' => 'New password and confirmation do not match',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        $user = JWTAuth::parseToken()->authenticate();

        if(!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'incorrect password']);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Password is successfully changed']);
    }

    public function updateWebsite(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'website' =>'nullable|url',
        ],[
            'website.url' => 'The url format is incorrect',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $user->update(['website' => $request->website]);

        return response()->json(['message' => 'Website url is successfully changed!']);
    }

    public function updateBio(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bio' => 'nullable|max:255',
        ], [
            'bio.max' => 'Too long your introduction',
        ]);

        if($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $user->update(['bio' => $request->bio]);

        return response()->json(['message' => 'Bio is successfully changed!']);
    }

}
