<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Post;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalController extends Controller
{
    public function order(Request $request, $post_id)
    {

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        $postId = $post_id;
        $post = Post::findOrFail($postId);
        $price = $request->input('price');
        // この辺は後でpost_detailのapi作ったら修正

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
                        "value" => $post->price, // サンプル価格
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null) {

            Payment::create([
                // 'user_id' => $request->input('user_id');
                // ログインしてるユーザーのpaypalアカウントとは限らない。親のとか
                // これ足りてない
                'post_id' => $post_id,
                'amount' => $price,
                'currency' => 'JPY',
                'status' => 'pending',  // 初期ステータスは 'pending'
                // 'payer_id' => これも足りてない
                // payment_idもない
                'payment_token' => $response['id'],
                // payment_tokenなんてカラム作ってない
            ]);
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

    public function showLink(Request $request, $post_id)
    {

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        // この辺は後でpost_detailのapi作ったら修正

        $postId = $post_id;
        $post = Post::findOrFail($postId);


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
                        "value" => $post->price, // サンプル価格
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


    public function approved(Request $request)
    {
        // PayPalからのトークンとPayerIDを取得
        $token = $request->input('token');
        $payerId = $request->input('PayerID');

        // PayPalサービスインスタンス
        $provider = new PayPalClient();
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();

        // 支払いの承認をキャプチャするリクエスト
        $response = $provider->capturePaymentOrder($token, [
            'payer_id' => $payerId,
        ]);

        // 成功した場合
        if ($response['status'] == 'COMPLETED') {
            // 支払い成功
            return response()->json(['message' => 'Payment completed successfully']);
        }

        // 失敗した場合
        return response()->json(['error' => 'Payment failed'], 400);
    }

    // 支払いキャンセル時
    public function rejected()
    {
        // 支払いがキャンセルされた場合の処理
        return response()->json(['message' => 'Payment cancelled']);
    }

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
