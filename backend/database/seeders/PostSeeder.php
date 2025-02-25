<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $images = [
            'post1.jpeg',
            'post2.jpeg',
            'post3.jpeg',
            'post4.jpeg',
            'post5.jpeg',
            'post6.jpeg',
            'post7.jpeg',
            'post8.jpeg',
            'post9.jpeg',
            'post10.jpeg',
            'post11.jpeg',
            'post12.jpeg',
            'post13.jpeg',
            'post14.jpeg',
            'post15.jpeg',
            'post16.jpeg',
            'post17.jpeg',
            'post18.jpeg',
            'post19.jpeg',
            'post20.jpeg',
            'post21.jpeg',
            'post22.jpeg',
            'post23.jpeg',
            'post24.jpeg',
            'post25.jpeg',
            'post26.jpeg',
            'post27.jpeg',
            'post28.jpeg',
            'post29.jpeg',
            'post30.jpeg',
            'post31.jpeg',
            'post32.jpeg',
            'post33.jpeg',
            'post34.jpeg',
            'post35.jpeg',
            'post36.jpeg',
            'post37.jpeg',
            'post38.jpeg',
            'post39.jpeg',
            'post40.jpeg',
            'post41.jpeg',
            'post42.jpeg',
            'post43.jpeg',
            'post44.jpeg',
            'post45.jpeg',
            'post46.jpeg',
            'post47.jpeg',
            'post48.jpeg',
            'post49.jpeg',
            'post50.jpeg',
        ];

        $imageIndex = 0; // 画像のインデックス

        foreach ($users as $user) {
            for ($i = 0; $i < 10; $i++) {
                if ($imageIndex >= count($images)) {
                    $imageIndex = 0; // 画像のリストが尽きたら最初に戻る
                }

                $image = $images[$imageIndex]; // 画像を順番に選択
                $imageIndex++;

                // 保存先のパスを設定
                $destinationPath = "posts/{$image}";

                // 画像をコピー
                Storage::copy("posts/{$image}", $destinationPath);

                // DB に保存
                Post::create([
                    'user_id' => $user->id,
                    'title' => "Post by User {$user->id}",
                    'body' => "This is a sample post by User {$user->id}.",
                    'owner_id' => $user->id,
                    'price' => rand(100, 10000),
                    'image' => "posts/{$image}", // 一意なファイル名ではなく、指定されたファイル名を使用
                ]);
            }
        }
    }
}
