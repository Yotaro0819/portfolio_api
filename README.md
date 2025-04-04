# ロゴ・イラスト販売マーケットプレイスサイト
このプロジェクトはSNSのようなUIをもつ、ロゴやイラストの販売サイトです。
ユーザーは自身の作品を投稿・販売することができ、購入者は気に入った作品を購入することができます。
（デプロイはしておらず、ローカル環境でのみの開発となります。）

##デプロイURL
https://d39hmozy4wec8b.cloudfront.net

##技術スタック

**フロントエンド: React
**バックエンド: laravel11
**認証: JWT(Tymon/jwt-auth)
**決済処理: stripe(stripe/stripe-php)
**httpクライアント: axios

##主な機能
JWTを使用したユーザー管理
Stripe API(authorize)を用いて販売者・購入者双方の承認が必要な決済体系
またStripe connectを使用したstripeアカウントとの連携
投稿・販売機能
無限スクロールの実装(intersection-observer)


## ⚠️ 注意事項
本アプリは `Tymon/jwt-auth` を使用した認証と `Stripe API (Sandbox)` を利用するため、  
ローカル環境でのセットアップには追加の設定が必要になります。  
そのため、コードの確認をメインにしていただければと思います。
