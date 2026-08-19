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
        $placeholderUrl = Storage::disk('public')->url('posts/default-post.svg');

        foreach ($users as $user) {
            for ($i = 0; $i < 10; $i++) {
                Post::create([
                    'user_id' => $user->id,
                    'title' => "Post by User {$user->id}",
                    'body' => "This is a sample post by User {$user->id}.",
                    'owner_id' => $user->id,
                    'price' => rand(100, 10000),
                    'image' => $placeholderUrl,
                ]);
            }
        }
    }
}
