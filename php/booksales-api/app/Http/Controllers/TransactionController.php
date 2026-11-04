<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(): JsonResponse
    {
        $transactions = Transaction::with(['customer', 'book'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar transaksi berhasil diambil',
            'data' => $transactions,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = auth('api')->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $orderNumber = 'ORD-'.strtoupper(uniqid());

        $transaction = DB::transaction(function () use ($validated, $orderNumber, $user) {
            $book = Book::lockForUpdate()->find($validated['book_id']);

            if ($book->stock < $validated['quantity']) {
                return null;
            }

            $totalAmount = $book->price * $validated['quantity'];

            $book->stock -= $validated['quantity'];
            $book->save();

            return Transaction::create([
                'order_number' => $orderNumber,
                'customer_id' => $user->id,
                'book_id' => $book->id,
                'quantity' => $validated['quantity'],
                'total_amount' => $totalAmount,
            ]);
        });

        if (! $transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Stok buku tidak mencukupi',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat',
            'data' => $transaction->load(['customer', 'book']),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $transaction = Transaction::with(['customer', 'book'])->find($id);

        if (! $transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }

        $user = auth('api')->user();
        if ($user->role !== 'admin' && (int) $transaction->customer_id !== (int) $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Bukan transaksi milik Anda',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi berhasil diambil',
            'data' => $transaction,
        ], 200);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $transaction = Transaction::find($id);

        if (! $transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }

        $user = auth('api')->user();
        if ($user->role !== 'admin' && (int) $transaction->customer_id !== (int) $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Bukan transaksi milik Anda',
            ], 403);
        }

        $validated = $request->validate([
            'book_id' => 'sometimes|required|exists:books,id',
            'quantity' => 'sometimes|required|integer|min:1',
        ]);

        $updated = DB::transaction(function () use ($transaction, $validated) {
            $oldBook = Book::lockForUpdate()->find($transaction->book_id);
            $newBookId = (int) ($validated['book_id'] ?? $transaction->book_id);
            $newQuantity = (int) ($validated['quantity'] ?? $transaction->quantity);

            $isSameBook = $oldBook->id === $newBookId;
            $newBook = $isSameBook ? $oldBook : Book::lockForUpdate()->find($newBookId);

            $availableStock = $newBook->stock + ($isSameBook ? $transaction->quantity : 0);

            if ($availableStock < $newQuantity) {
                return null;
            }

            $oldBook->stock += $transaction->quantity;
            $oldBook->save();

            $newBook->stock -= $newQuantity;
            $newBook->save();

            $transaction->update([
                'book_id' => $newBook->id,
                'quantity' => $newQuantity,
                'total_amount' => $newBook->price * $newQuantity,
            ]);

            return $transaction;
        });

        if (! $updated) {
            return response()->json([
                'success' => false,
                'message' => 'Stok buku tidak mencukupi',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui',
            'data' => $updated->load(['customer', 'book']),
        ], 200);
    }

    public function destroy(string $id): JsonResponse
    {
        $transaction = Transaction::find($id);

        if (! $transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }

        DB::transaction(function () use ($transaction) {
            $book = Book::lockForUpdate()->find($transaction->book_id);
            if ($book) {
                $book->stock += $transaction->quantity;
                $book->save();
            }

            $transaction->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus',
        ], 200);
    }
}

