<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
use Illuminate\Support\Facades\Route;

Route::get('/books', [BookController::class, 'index'])->name('api.books.index');

Route::apiResource('authors', AuthorController::class);
Route::apiResource('genres', GenreController::class);
