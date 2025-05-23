# ロゴ・イラスト販売マーケットプレイスサイト
このプロジェクトはSNSのようなUIをもつ、ロゴやイラストの販売サイトです。
ユーザーは自身の作品を投稿・販売することができ、購入者は気に入った作品を購入することができます。


## デプロイURL
https://d39hmozy4wec8b.cloudfront.net

## 技術スタック

* フロントエンド: React
* バックエンド: Laravel11
* 認証: JWT(Tymon/jwt-auth)
* 決済処理: Stripe(stripe/stripe-php)
* httpクライアント: axios

## 主な機能
* JWTを使用したユーザー管理
* Stripe API(authorize)を用いて販売者・購入者双方の承認が必要な決済体系
またStripe connectを使用したstripeアカウントとの連携
* 投稿・販売機能
* 無限スクロールの実装(intersection-observer)


## ホーム画面
<img width="1508" alt="スクリーンショット 2025-04-17 午後4 53 18" src="https://github.com/user-attachments/assets/7b76c654-b33e-4cb8-a384-86605ce699b7" />



## stripe connect画面
<img width="1509" alt="スクリーンショット 2025-04-17 午後4 57 45" src="https://github.com/user-attachments/assets/0b3a87fd-b492-4077-9ce8-bb2d4cd8b14d" />
<img width="1507" alt="スクリーンショット 2025-04-17 午後4 57 54" src="https://github.com/user-attachments/assets/e9543726-0002-4344-9b15-be2babfe13a0" />

## エスクロー決済のようなイメージで相互承認が必要になっています
販売者画面(購入者がstripeにて購入ボタンを押すとオーソリ状態となり決済が保留状態となります)
<img width="1511" alt="スクリーンショット 2025-05-09 午前12 03 17" src="https://github.com/user-attachments/assets/0b4eb92e-ed3f-45fd-9638-c42c9e8a5b2f" />
購入者画面(販売者がapproveボタンを押すとconfirmとして最終確認ができます)
<img width="1503" alt="スクリーンショット 2025-05-09 午前12 07 37" src="https://github.com/user-attachments/assets/529eb134-a4b3-4f14-882e-225c9867fb0e" />

