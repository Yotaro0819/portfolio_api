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

        $orders = Payment::where(function ($query) use ($user) {
            $query->where('seller_id', $user->id)
                ->orWhere('payer_id', $user->id);
        })
        ->where(function ($query) {
            $query->where('process_status', 'approved')
                ->orWhere('process_status', 'pending');
        })
        ->with('payer:id,name')->get();

        return response()->json(['orders' => $orders]);
    }

    public function purchases()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $purchases = Payment::where('payer_id', $user->id)
                            ->where('process_status', 'paid')
                            ->with('seller:id,name')
                            ->get();

        return response()->json(['purchases' => $purchases]);
    }

    public function sales()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $sales = Payment::where('seller_id', $user->id)
                        ->where('process_status', 'paid')
                        ->with('payer:id,name')
                        ->get();

        return response()->json(['sales' => $sales]);
    }
}
