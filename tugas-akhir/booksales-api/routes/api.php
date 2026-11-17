<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('/books', BookController::class)->only(['index', 'show']);
Route::apiResource('/authors', AuthorController::class)->only(['index', 'show']);
Route::apiResource('/genres', GenreController::class)->only(['index', 'show']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Transaksi untuk user terautentikasi (Customer melihat miliknya, Admin melihat semua)
    Route::apiResource('/transactions', TransactionController::class)->only(['index', 'store', 'show', 'update']);

    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('/books', BookController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('/authors', AuthorController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('/genres', GenreController::class)->only(['store', 'update', 'destroy']);

        // Destroy transaksi hanya untuk admin
        Route::apiResource('/transactions', TransactionController::class)->only(['destroy']);
    });
});
