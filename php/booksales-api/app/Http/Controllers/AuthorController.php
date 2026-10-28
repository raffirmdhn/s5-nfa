<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index(): JsonResponse
    {
        $authors = Author::all();

        return response()->json([
            'success' => true,
            'message' => 'Daftar penulis berhasil diambil',
            'data' => $authors,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $author = Author::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Penulis berhasil ditambahkan',
            'data' => $author,
        ], 201);
    }
}
