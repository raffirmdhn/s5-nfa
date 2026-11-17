<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('role', 'customer')->first();
        $book = Book::first();

        if ($customer && $book) {
            Transaction::firstOrCreate(
                ['order_number' => 'ORD-001'],
                [
                    'customer_id' => $customer->id,
                    'book_id' => $book->id,
                    'quantity' => 1,
                    'total_amount' => $book->price,
                    'status' => 'diproses',
                ]
            );
        }
    }
}

