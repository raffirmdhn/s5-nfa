<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use App\Support\TransactionGroupPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth('api')->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $query = Transaction::with(['customer', 'book.author', 'book.genre'])->latest();

        if ($user->role !== 'admin') {
            $query->where('customer_id', $user->id);
        }

        $transactions = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar transaksi berhasil diambil',
            'data' => TransactionGroupPresenter::groupCollection($transactions),
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.book_id' => 'required|exists:books,id',
            'items.*.quantity' => 'required|integer|min:1',
            'recipient_name' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:30',
            'shipping_address' => 'nullable|string',
            'notes' => 'nullable|string',
            'payment_method' => 'nullable|string|max:30',
        ]);

        $user = auth('api')->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        // Generate nomor order dasar BookSales: BS-YYMMDD-XXXX
        do {
            $randomPart = strtoupper(Str::random(4));
            $baseCode = 'BS-'.date('ymd').'-'.$randomPart;
        } while (Transaction::where('order_number', 'like', $baseCode.'%')->exists());

        $commonData = [
            'customer_id' => $user->id,
            'status' => 'pending',
            'recipient_name' => $validated['recipient_name'] ?? $user->name,
            'phone' => $validated['phone'] ?? null,
            'shipping_address' => $validated['shipping_address'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'payment_method' => $validated['payment_method'] ?? 'bank_transfer',
        ];

        try {
            $createdIds = DB::transaction(function () use ($validated, $baseCode, $commonData) {
                $ids = [];
                $index = 0;

                foreach ($validated['items'] as $item) {
                    $index++;
                    $book = Book::lockForUpdate()->find($item['book_id']);

                    if (! $book || $book->stock < $item['quantity']) {
                        $title = $book ? $book->title : 'Buku #'.$item['book_id'];
                        throw new \RuntimeException("Stok buku '{$title}' tidak mencukupi (tersisa: ".($book ? $book->stock : 0).').');
                    }

                    $book->stock -= $item['quantity'];
                    $book->save();

                    $itemOrderNumber = $baseCode.'-'.sprintf('%02d', $index);
                    $totalAmount = $book->price * $item['quantity'];

                    $tx = Transaction::create(array_merge($commonData, [
                        'order_number' => $itemOrderNumber,
                        'book_id' => $book->id,
                        'quantity' => $item['quantity'],
                        'total_amount' => $totalAmount,
                    ]));

                    $ids[] = $tx->id;
                }

                return $ids;
            });
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses transaksi: '.$e->getMessage(),
            ], 500);
        }

        $createdRows = Transaction::with(['customer', 'book.author', 'book.genre'])
            ->whereIn('id', $createdIds)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat',
            'data' => TransactionGroupPresenter::presentOrder($baseCode, $createdRows),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $baseCode = null;

        if (is_numeric($id)) {
            $single = Transaction::find($id);
            if (! $single) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaksi tidak ditemukan',
                ], 404);
            }
            $baseCode = TransactionGroupPresenter::extractBaseCode($single->order_number);
        } else {
            $baseCode = TransactionGroupPresenter::extractBaseCode($id);
        }

        $rows = Transaction::with(['customer', 'book.author', 'book.genre'])
            ->where(function ($q) use ($baseCode) {
                $q->where('order_number', $baseCode)
                    ->orWhere('order_number', 'like', $baseCode.'-%');
            })
            ->get();

        if ($rows->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }

        $user = auth('api')->user();
        if ($user && $user->role !== 'admin' && (int) $rows->first()->customer_id !== (int) $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Bukan transaksi milik Anda',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi berhasil diambil',
            'data' => TransactionGroupPresenter::presentOrder($baseCode, $rows),
        ], 200);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = auth('api')->user();

        if (! $user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Hanya admin yang dapat mengubah status pesanan',
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,diproses,dikirim,selesai',
        ]);

        $baseCode = null;

        if (is_numeric($id)) {
            $single = Transaction::find($id);
            if (! $single) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaksi tidak ditemukan',
                ], 404);
            }
            $baseCode = TransactionGroupPresenter::extractBaseCode($single->order_number);
        } else {
            $baseCode = TransactionGroupPresenter::extractBaseCode($id);
        }

        $rows = Transaction::where(function ($q) use ($baseCode) {
            $q->where('order_number', $baseCode)
                ->orWhere('order_number', 'like', $baseCode.'-%');
        })->get();

        if ($rows->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }

        Transaction::whereIn('id', $rows->pluck('id'))->update(['status' => $validated['status']]);

        $updatedRows = Transaction::with(['customer', 'book.author', 'book.genre'])
            ->whereIn('id', $rows->pluck('id'))
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Status transaksi berhasil diperbarui',
            'data' => TransactionGroupPresenter::presentOrder($baseCode, $updatedRows),
        ], 200);
    }

    public function destroy(string $id): JsonResponse
    {
        $user = auth('api')->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $baseCode = null;

        if (is_numeric($id)) {
            $single = Transaction::find($id);
            if (! $single) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaksi tidak ditemukan',
                ], 404);
            }
            $baseCode = TransactionGroupPresenter::extractBaseCode($single->order_number);
        } else {
            $baseCode = TransactionGroupPresenter::extractBaseCode($id);
        }

        $rows = Transaction::where(function ($q) use ($baseCode) {
            $q->where('order_number', $baseCode)
                ->orWhere('order_number', 'like', $baseCode.'-%');
        })->get();

        if ($rows->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }

        if ($user->role !== 'admin' && (int) $rows->first()->customer_id !== (int) $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Bukan transaksi milik Anda',
            ], 403);
        }

        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $book = Book::lockForUpdate()->find($row->book_id);
                if ($book) {
                    $book->stock += $row->quantity;
                    $book->save();
                }
                $row->delete();
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Seluruh data transaksi dalam pesanan berhasil dihapus dan stok dikembalikan',
        ], 200);
    }
}
