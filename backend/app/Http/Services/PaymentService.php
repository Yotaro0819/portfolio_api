<?php
namespace App\Http\Services;

use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class PaymentService
{

    protected $user;

    public function __construct()
    {
        $this->user = JWTAuth::parseToken()->authenticate();
    }
    public function ongoingOrders()
    {
        try {
            $user = $this->user;

            $orders = Payment::where(function ($query) use ($user) {
                $query->where('seller_id', $user->id)
                      ->orWhere('payer_id', $user->id);
            })
            ->where(function ($query) {
                $query->where('process_status', 'approved')
                      ->orWhere('process_status', 'pending');
            })
            ->with('payer:id,name')
            ->get();

            return $orders;
        } catch (\Exception $e) {
            Log::error('Failed to fetch ongoing orders: ' . $e->getMessage());
            return null;
        }
    }

    public function purcheses()
    {
        $purchases = Payment::where('payer_id', $this->user->id)
        ->where('process_status', 'paid')
        ->with('seller:id,name')
        ->get();
        return $purchases;
    }

    public function sales()
    {
        $sales = Payment::where('seller_id', $this->user->id)
        ->where('process_status', 'paid')
        ->with('payer:id,name')
        ->get();
        return $sales;
    }
}
