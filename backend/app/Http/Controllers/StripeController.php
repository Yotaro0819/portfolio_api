<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Post;
use App\Models\User;
use App\Http\Services\StripeService;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class StripeController extends Controller
{
    protected $stripeService;
    public function __construct(StripeService $stripeService) {
        $this->stripeService = $stripeService;
    }

    public function createOrder(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'price' => 'required|numeric',
            'postId' => 'required|exists:posts,id'
        ]);

        $result = $this->stripeService->createCheckoutSession($id, $request->title, $request->price, $request->postId);

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], $result['status']);
        }

        return response()->json(['checkout_url' => $result['checkout_url']]);
    }

    public function success(Request $request)
    {
        $result = $this->stripeService->handleSuccessCallback($request->session_id);

        if (isset($result['error'])) {
            return response()->json(['message' => $result['error']], $result['status']);
        }
        return redirect()->away($result['redirect_url']);
    }

    public function approve($paymentId)
    {
        $payment = Payment::where('payment_id', $paymentId)->first();
        $post    = Post::where('id', $payment->post_id);

        $payment->update(['process_status' => 'approved']);
        $post->update(['owner_id' => $payment->payer_id]);

        return response()->json(['message' => 'The order approved']);
    }

    public function captureOrder($paymentId)
    {
        $result = $this->stripeService->captureOrder($paymentId);
        return response()->json(['message' => $result]);
    }

    public function cancelOrder($paymentId)
    {
        try {
            $message = $this->stripeService->cancelOrder($paymentId);
            return response()->json(['message' => $message]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
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
            'failure_url' => 'https://d39hmozy4wec8b.cloudfront.net',
            'success_url' => 'https://d39hmozy4wec8b.cloudfront.net/edit-profile',
            'type' => 'account_onboarding',
        ]);

        return response()->json([
            'url' => $accountLink->url,
        ]);
    }
}
