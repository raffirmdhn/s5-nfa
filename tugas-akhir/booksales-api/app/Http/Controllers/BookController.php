<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'cover_photo' => 'nullable|string',
            'genre_id' => 'required|exists:genres,id',
            'author_id' => 'required|exists:authors,id',
        ]);

        $book = Book::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil ditambahkan',
            'data' => $book,
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $book = Book::with(['author', 'genre'])->find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail buku berhasil diambil',
            'data' => $book,
        ], 200);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'stock' => 'sometimes|required|integer',
            'cover_photo' => 'nullable|string',
            'genre_id' => 'sometimes|required|exists:genres,id',
            'author_id' => 'sometimes|required|exists:authors,id',
        ]);

        $book->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil diperbarui',
            'data' => $book,
        ], 200);
    }

    public function destroy(string $id): JsonResponse
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dihapus',
        ], 200);
    }
}
