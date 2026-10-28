<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
use Illuminate\Support\Facades\Route;

Route::get('/books', [BookController::class, 'index'])->name('api.books.index');

Route::get('/authors', [AuthorController::class, 'index'])->name('api.authors.index');
Route::post('/authors', [AuthorController::class, 'store'])->name('api.authors.store');

Route::get('/genres', [GenreController::class, 'index'])->name('api.genres.index');
Route::post('/genres', [GenreController::class, 'store'])->name('api.genres.store');
