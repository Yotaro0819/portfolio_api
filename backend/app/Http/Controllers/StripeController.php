<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Stripe\StripeClient;
use Tymon\JWTAuth\Facades\JWTAuth;

class StripeController extends Controller
{
    public function createOrder(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $seller = User::findOrFail($id);
        $payer  = JWTAuth::parseToken()->authenticate();

        if(!$seller->stripe_account_id) {
            return response()->json(['error' => 'This user have not registered Stripe yet.'],400);
        }

        $stripe = new StripeClient(config('stripe.stripe_sk'));
        $response = $stripe->checkout->sessions->create([
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $request->title,
                        ],
                        'unit_amount' => $request->price * 100,
                    ],
                    'quantity' => 1,
                ],
            ],
            'mode' => 'payment',
            'payment_intent_data' => [
                'capture_method' => 'manual',
                'transfer_data' => [
                    'destination' => $seller->stripe_account_id,
                ],
                'metadata' => [
                    'payer_id' => $payer->id,
                    'seller_id' => $seller->id,
                    'product_name' => $request->title,
                    'quantity' => 1,
                    'price' => $request->price,
                ],
            ],
            'success_url' => url('/api/stripe/success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => url('/api/stripe/cancel'),
        ]);

        if(isset($response->id) && $response->id != '') {
            return response()->json([
                'checkout_url' => $response->url,
            ]);
        }

        return response()->json(['error' => 'Failed to create Stripe session'], 400);
    }

    public function success(Request $request)
    {
        if(empty($request->session_id)) {
            return response()->json(['message' => 'The order not found']);
        }

        try {
            $stripe = new StripeClient(config('stripe.stripe_sk'));
            $response = $stripe->checkout->sessions->retrieve($request->session_id);

            if(empty($response->payment_intent)) {
                return response()->json(['message' => 'Invalid payment session']);
            }

            $paymentIntent = $stripe->paymentIntents->retrieve($response->payment_intent);
        } catch (\Exception $e) {
            abort(500, 'Error retrieving payment session: '. $e->getMessage());
        }

        $paymentIntentId = $paymentIntent->id;
        $paymentStatus = $paymentIntent->status;
        $sellerId = $paymentIntent->metadata->seller_id;
        $seller = User::find($sellerId);
        if(!$seller) {
            return response()->json(['message' => 'The seller not found']);
        }

        Payment::create([
            'payment_id'      => $paymentIntentId,
            'product_name'    => $paymentIntent->metadata->product_name,
            'quantity'        => $paymentIntent->metadata->quantity,
            'amount'          => $paymentIntent->metadata->price,
            'currency'        => $paymentIntent->currency,
            'payer_id'        => $paymentIntent->metadata->payer_id,
            'seller_id'       => $sellerId,
            'seller_stripe_account_id' => $seller->stripe_account_id,
            'payment_status'  => $paymentStatus,
            'process_status'  => 'pending',
            'payment_method'  => "Stripe",
        ]);

        return redirect()->away('http://127.0.0.1:5173/payment/success');
    }

    public function approve($paymentId)
    {
        $payment = Payment::where('payment_id', $paymentId);

        $payment->update(['process_status' => 'approved']);

        return response()->json(['message' => 'The order approved']);
    }

    public function captureOrder($paymentId)
    {
        $stripe = new StripeClient(config('stripe.stripe_sk'));

        try {
            $payment = Payment::where('payment_id', $paymentId)->first();

            if(!$payment) return response()->json(['message' => 'The order not found']);

            $stripe->paymentIntents->capture($paymentId);
            $payment->update(['payment_status' => 'succeded']);

            return response()->json(['message' => 'Capture is successful']);
        } catch(\Exception $e) {
            return response()->json(['message' => 'Failed to capture']);
        }
    }

    public function cancelOrder($paymentId)
    {
        $stripe = new StripeClient(config('stripe.stripe_sk'));

        try {
            $stripe->paymentIntents->cancel($paymentId);

            Payment::where('payment_id', $paymentId)->update(['payment_status' => 'canceled']);

            return response()->json(['message' => 'The order canceled']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to cancel order']);
        }
    }

    public function connectStripe($id)
    {
        $stripe = new StripeClient(config('stripe.stripe_sk'));

        $user = User::findOrFail($id);
        if(!empty($user->stripe_account_id)) {
            $stripe->accounts->delete($user->stripe_account_id);
        };

        $account = $stripe->accounts->create([
            'type' => 'express',
        ]);

        $user->stripe_account_id = $account->id;
        $user->save();

        $accountLink = $stripe->accountLinks->create([
            'account' => $account->id,
            'failure_url' => 'http://127.0.0.1:5173/payment/failure',
            'success_url' => 'http://127.0.0.1:5173/payment/success',
            'type' => 'account_onboarding',
        ]);

        return response()->json([
            'url' => $accountLink->url,
        ]);
    }
}
