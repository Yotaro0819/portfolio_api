<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->delete();

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

        foreach ($users as $user) {
            DB::table('users')->insert([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'avatar' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
