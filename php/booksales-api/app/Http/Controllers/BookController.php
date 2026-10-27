<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    public function index(): JsonResponse
    {
        $books = Book::with(['author', 'genre'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar buku berhasil diambil',
            'data' => $books,
        ], 200);
    }
}
