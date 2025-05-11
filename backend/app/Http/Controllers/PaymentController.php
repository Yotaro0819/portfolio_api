<?php

namespace App\Http\Controllers;

use App\Http\Services\PaymentService;
use App\Models\Payment;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class PaymentController extends Controller
{
    protected $paymentService;
    public function __construct(PaymentService $paymentService) {
        $this->paymentService = $paymentService;
    }

    public function ongoingOrders()
    {
        $orders = $this->paymentService->ongoingOrders();
        return response()->json(['orders' => $orders]);
    }

    public function purchases()
    {
        $purchases = $this->paymentService->purcheses();
        return response()->json(['purchases' => $purchases]);
    }

    public function sales()
    {
        $sales = $this->paymentService->sales();
        return response()->json(['sales' => $sales]);
    }
}
