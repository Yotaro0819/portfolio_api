<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUser($id)
    {
        $user = User::select('id', 'name', 'avatar')
        ->withCount(['followers', 'following'])
        ->findOrFail($id);

        if($user->avatar == null) {
            return $user->avatar == null;
        }

        $user->avatar = asset('storage/' . $user->avatar);

        return response()->json($user);
    }
}

