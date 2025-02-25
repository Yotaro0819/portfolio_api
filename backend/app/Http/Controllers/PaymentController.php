<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class PaymentController extends Controller
{
    public function ongoingOrders()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $orders = Payment::where('payer_id', $user->id)->where('process_status', 'pending')->with('payer:id,name')->get();

        return response()->json(['orders' => $orders]);
    }
}
