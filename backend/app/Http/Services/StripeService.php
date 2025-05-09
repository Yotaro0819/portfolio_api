<?php
namespace App\Http\Services;

use App\Models\Payment;
use App\Models\User;
use Stripe\StripeClient;
use Tymon\JWTAuth\Facades\JWTAuth;

class StripeService
{
    protected $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('stripe.stripe_sk'));
    }

    public function createCheckoutSession($sellerId, $title, $price, $postId)
    {
        $seller = User::findOrFail($sellerId);
        $payer = JWTAuth::parseToken()->authenticate();

        if (!$seller->stripe_account_id) {
            return ['error' => 'This user has not registered Stripe yet.', 'status' => 400];
        }

        $session = $this->stripe->checkout->sessions->create([
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => ['name' => $title],
                    'unit_amount' => $price * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'payment_intent_data' => [
                'capture_method' => 'manual',
                'transfer_data' => ['destination' => $seller->stripe_account_id],
                'metadata' => [
                    'post_id' => $postId,
                    'payer_id' => $payer->id,
                    'seller_id' => $seller->id,
                    'product_name' => $title,
                    'quantity' => 1,
                    'price' => $price,
                ],
            ],
            'success_url' => url('/api/stripe/success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => url('/api/stripe/cancel'),
        ]);

        return ['checkout_url' => $session->url];
    }

    public function handleSuccessCallback($sessionId)
    {
        if (empty($sessionId)) {
            return ['error' => 'The order not found', 'status' => 404];
        }

        try {

            $session = $this->stripe->checkout->sessions->retrieve($sessionId);

            if (empty($session->payment_intent)) {
                return ['error' => 'Invalid payment session', 'status' => 400];
            }

            $paymentIntent = $this->stripe->paymentIntents->retrieve($session->payment_intent);
        } catch (\Exception $e) {
            return ['error' => 'Error retrieving payment session: ' . $e->getMessage(), 'status' => 500];
        }

        $seller = User::find($paymentIntent->metadata->seller_id);
        if (!$seller) {
            return ['error' => 'The seller not found', 'status' => 404];
        }

        $payment = Payment::create([
            'session_id'      => $sessionId,
            'payment_id'      => $paymentIntent->id,
            'product_name'    => $paymentIntent->metadata->product_name,
            'quantity'        => $paymentIntent->metadata->quantity,
            'amount'          => $paymentIntent->metadata->price,
            'currency'        => $paymentIntent->currency,
            'post_id'         => $paymentIntent->metadata->post_id,
            'payer_id'        => $paymentIntent->metadata->payer_id,
            'seller_id'       => $paymentIntent->metadata->seller_id,
            'seller_stripe_account_id' => $seller->stripe_account_id,
            'payment_status'  => $paymentIntent->status,
            'process_status'  => 'pending',
            'payment_method'  => "Stripe",
        ]);
        // return ['redirect_url' => 'https://d39hmozy4wec8b.cloudfront.net/payment/success'];
        return ['redirect_url' => 'http://127.0.0.1:5173/payment/success'];
    }
}
