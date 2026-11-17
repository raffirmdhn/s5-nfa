<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin BookSales',
                'password' => Hash::make('pass123'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@gmail.com'],
            [
                'name' => 'Customer BookSales',
                'password' => Hash::make('pass123'),
                'role' => 'customer',
            ]
        );
    }
}
