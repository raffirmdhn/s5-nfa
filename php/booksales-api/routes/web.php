<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'BookSales API Service',
        'endpoints' => [
            'books' => url('/api/books'),
            'authors' => url('/api/authors'),
            'genres' => url('/api/genres'),
        ],
    ]);
});
