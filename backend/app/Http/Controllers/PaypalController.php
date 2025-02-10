<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\Post;
use Srmklive\PayPal\Services\PayPal as PayPalClient;


class PaypalController extends Controller
{
    protected $provider;
    protected $payPalPayoutService;

    public function __construct() {
        $this->provider = new PayPalClient;
        $this->provider->setApiCredentials(config('paypal'));
    }
    public function createOrder($id)
    {

        $post = Post::findOrFail($id);

        $sellerId = $post->user->id;
        $sellerEmail = $post->user->email;

        session()->put('seller_id', $sellerId);
        session()->put('seller_email', $sellerEmail);
        session()->save();

        $provider = new PayPalClient;
        $provider->getAccessToken();
        $response = $provider->createOrder([
            "intent" => "AUTHORIZE",
            "application_context" => [
                "return_url" => url('/api/payment/success') . '?seller_id=' . $sellerId . '&seller_email=' . $sellerEmail,
                "cancel_url" => url('/api/payment/cancel')
            ],
            "purchase_units" => [
                [
                    // この辺のデータはデコイなので実際には$requestからとってきた情報などを書き込む必要あり
                    "product_name" => $post->title,
                    "quantity" => '1',
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $post->price
                    ],
                ]
            ]
        ]);

        //dd($response);
        if (isset($response['id']) && $response['id'] != null) {
            foreach ($response['links'] as $link) {
                if ($link['rel'] == 'approve') {
                    // リダイレクトURLをフロントエンドに返す

                    return response()->json([
                        'status' => 'success',
                        'redirect_url' => $link['href'],
                        'order_id' => $response['id'],
                    ]);
                }
            }
        } else {
            return response()->json(['status' => 'error'], 400);
        }
    }

    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        $sellerId = $request->query('seller_id');
        $sellerEmail = $request->query('seller_email');

        $response = $provider->authorizePaymentOrder($request->token);//srmkliveではauthorizePaymentOrderが用意されている


        if(isset($response['status']) && $response['status'] == 'COMPLETED') {

            // Insert data into database
            $payment = new Order;
            $payment->payment_id = $response['purchase_units'][0]['payments']['authorizations'][0]['id'];
            $payment->invoice_id = $response['purchase_units'][0]['payments']['authorizations'][0]['id'];
            $payment->order_id = $response['id'];
            $payment->amount = $response['purchase_units'][0]['payments']['authorizations'][0]['amount']['value'];
            $payment->currency = $response['purchase_units'][0]['payments']['authorizations'][0]['amount']['currency_code'];//ここをauthorizationに変更
            $payment->payer_name = $response['payer']['name']['given_name'];
            $payment->payer_email = $response['payer']['email_address'];
            $payment->order_status = 'AUTHORIZED';
            $payment->seller_id = $sellerId;
            $payment->seller_email = $sellerEmail;
            $payment->order_method = "PayPal";
            //このseller_email,idはデコイなので実際は$requestから取得
            $payment->save();


            return redirect()->to('http://127.0.0.1:5173');
        } else {
            return redirect()->to('http://127.0.0.1:5173');
        }
    }
    public function cancel()
    {
        return "Payment is cancelled.";
    }

    public function approveOrder($orderId)
    {
        $order = Order::where('order_id', $orderId)->first();
            $orderId = $order->order_id;
            $invoiceId = $order->invoice_id;
            $amount = $order->amount;
            $paymentId = $order->payment_id;
            $note = 'Order approved';
            $this->provider->getAccessToken();

        try {
            // PayPalの注文情報を取得
            $response = $this->provider->captureAuthorizedPayment($paymentId, $invoiceId, $amount, $note);
            // 第一引数order_id, 第二引数invoice_id, 第三引数amount

            // dd($response);
            if (isset($response['status']) && $response['status'] == 'COMPLETED') {

                $order = Order::where('order_id', $orderId)->first();
                $order->payment_status = 'COMPLETED';
                $order->save();

                return redirect()->route('payment.index')->with('success', 'this order approved');
            } else {
                return redirect()->route('payment.index')->with('error', 'this order disapproved');
            }
        } catch (\Exception $e) {
            return redirect()->route('payment.index')->with('error', 'エラー: ' . $e->getMessage());
        }
    }

        public function cancelOrder($orderId)
    {

        $order = Order::where('order_id', $orderId)->first();
            $paymentId = $order->payment_id;
            $this->provider->getAccessToken();


        try {
            // PayPalで注文をキャンセル
                $this->provider->voidAuthorizedPayment($paymentId);

                $order->payment_status = 'CANCELLED';  // キャンセルされた状態
                $order->save();

                return redirect()->route('payment.index')->with('success', 'this order canceled');

        } catch (\Exception $e) {
            return redirect()->route('payment.index')->with('error', 'エラー: ' . $e->getMessage());
        }
    }

    // public function sendPayout(Request $request)
    // {
    //     // 受取人のメールアドレスと送金額を取得

    //     $receiverEmail = $request->input('receiver_email');
    //     $amount = $request->input('amount'); // 例えば、USDで送金額

    //     // PayPal送金サービスを呼び出し
    //     $response = $this->payPalPayoutService->payoutToUser($receiverEmail, $amount);

    //     // 送金結果に基づいて適切なビューを返す
    //     if (isset($response['batch_header']) && $response['batch_header']['batch_status'] == 'PENDING') {
    //         return view('payouts.success', ['response' => $response]);
    //     } else {
    //         dd($response);
    //         return view('payouts.failure')->with('error', 'something wrong');
    //     }
    // }

    public function getConfig()
    {
        // configファイルからPayPalのclient_idを取得して返す
        $paypalConfig = [
            'client_id' => config('paypal.sandbox.client_id'),
            'currency' => config('paypal.currency'),
        ];

        return response()->json($paypalConfig);
    }
}
