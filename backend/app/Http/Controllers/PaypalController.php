<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Post;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalController extends Controller
{
    public function paypal(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();

        $postId = $request->input('post_id');
        $post = Post::find($postId);

        $response = $provider->createOrder([
            "intent" => "AUTHORIZE",
            "application_context" => [
                "return_url" => url('/paypal/success'),
                "cancel_url" => url('/paypal/cancel')
            ],
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "JPY",
                        "value" => 40, // サンプル価格
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null) {
            foreach ($response['links'] as $link) {
                if ($link['rel'] == 'approve') {
                    // フロントエンドにリダイレクトURLを返す
                    return response()->json([
                        'redirectUrl' => $link['href']
                    ]);
                }
            }
        } else {
            return response()->json(['error' => 'Failed to create order'], 400);
        }
    }


    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request->token);
        //dd($response);
        if(isset($response['status']) && $response['status'] == 'COMPLETED') {

            // Insert data into database
            $payment = new Payment;
            $payment->payment_id = $response['id'];
            $payment->product_name = session()->get('product_name');
            $payment->quantity = session()->get('quantity');
            $payment->amount = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value'];
            $payment->currency = $response['purchase_units'][0]['payments']['captures'][0]['amount']['currency_code'];
            $payment->payer_name = $response['payer']['name']['given_name'];
            $payment->payer_email = $response['payer']['email_address'];
            $payment->payment_status = $response['status'];
            $payment->payment_method = "PayPal";
            $payment->save();

            return "Payment is successful";

            unset($_SESSION['product_name']);
            unset($_SESSION['quantity']);

        } else {
            // return redirect()->route('cancel');
        }
    }
    public function cancel()
    {
        return "Payment is cancelled.";
    }
}
