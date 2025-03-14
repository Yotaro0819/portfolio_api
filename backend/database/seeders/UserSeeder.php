<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $avatars = [
            'avatars/avatar1.jpeg',
            'avatars/avatar2.jpeg',
            'avatars/avatar3.jpeg',
            'avatars/avatar4.jpeg',
            'avatars/avatar5.jpeg',
            'avatars/avatar6.jpeg',
            'avatars/avatar7.jpeg',
            'avatars/avatar8.jpeg',
            'avatars/avatar9.jpeg',
            'avatars/avatar10.jpeg',
        ];

        $users = [
            ['name' => 'Johndoe', 'email' => 'johndoe@example.com'],
            ['name' => 'Janedue', 'email' => 'janedue@example.com'],
            ['name' => 'Charlie', 'email' => 'charlie@example.com'],
            ['name' => 'David', 'email' => 'david@example.com'],
            ['name' => 'Eve', 'email' => 'eve@example.com'],
            ['name' => 'Frank', 'email' => 'frank@example.com'],
            ['name' => 'Grace', 'email' => 'grace@example.com'],
            ['name' => 'Hank', 'email' => 'hank@example.com'],
            ['name' => 'Ivy', 'email' => 'ivy@example.com'],
            ['name' => 'Jack', 'email' => 'jack@example.com'],
        ];

        foreach ($users as $index => $user) {
            DB::table('users')->insert([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'avatar' => Storage::disk('s3')->url($avatars[$index]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
