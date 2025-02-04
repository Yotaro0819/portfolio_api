<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileController extends Controller
{
    public function fetchFollows(Request $request)
    {

        $jwt = $request->cookie('jwt');
        $refreshJwt = $request->cookie('refreshJwt');

        if (!$jwt || !$refreshJwt) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = JWTAuth::parseToken()->authenticate()->id;

        $authUser = User::find($userId);

        return response()->json([ 'authUser' => $authUser ]);
    }
}
