<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class StripeController extends Controller
{
    public function createOrder(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $seller = User::findOrFail($id);
        if($seller->stripe_account_id) {
            return response()->json(['error' => 'You have not registered Stripe yet.'],400);
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
                    'seller_id' => $seller->id,
                ],
            ],
            'success_url' => url('/api/stripe/success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => url('/api/stripe/cancel'),
        ]);

        if(isset($response->id) && $response->id != '') {
            session()->put('product_name', $request->product_name);
            session()->put('quantity', $request->quantity);
            session()->put('price', $request->price);
            // session()->put('payment_intent_id', $response->payment_intent);
            return response()->json([
                'checkout_url' => $response->url,
                // 'payment_intent_id' => $response->payment_intent,
            ]);
        }

        return response()->json(['error' => 'Failed to create Stripe session'], 400);
    }
}
