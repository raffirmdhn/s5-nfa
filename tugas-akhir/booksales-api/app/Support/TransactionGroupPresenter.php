<?php

namespace App\Support;

use App\Models\Transaction;
use Illuminate\Support\Collection;

class TransactionGroupPresenter
{
    /**
     * Mengekstrak kode order dasar tanpa nomor urut item (-01, -02, dst).
     * Contoh: BS-261118-8F2K-01 => BS-261118-8F2K
     */
    public static function extractBaseCode(string $orderNumber): string
    {
        return preg_replace('/-\d+$/', '', $orderNumber);
    }

    /**
     * Memformat kode faktur resmi BookSales ala Tokopedia.
     * Contoh: INV/20261118/BS/8F2K
     */
    public static function formatInvoiceCode(string $baseCode, $createdAt = null): string
    {
        $date = $createdAt ? date('Ymd', strtotime($createdAt)) : date('Ymd');
        $clean = preg_replace('/[^a-zA-Z0-9]/', '', $baseCode);

        // Ambil 4 karakter acak di akhir base code jika sesuai format BS-YYMMDD-XXXX
        if (preg_match('/^BS-\d{6}-([A-Z0-9]+)$/i', $baseCode, $matches)) {
            return "INV/{$date}/BS/{$matches[1]}";
        }

        return "INV/{$date}/BS/{$clean}";
    }

    /**
     * Menggabungkan koleksi baris transaksi dengan base order yang sama menjadi 1 objek utuh.
     */
    public static function presentOrder(string $baseCode, Collection $rows): array
    {
        $first = $rows->first();
        if (! $first) {
            return [];
        }

        $items = $rows->map(function (Transaction $row) {
            return [
                'id' => $row->id,
                'order_number' => $row->order_number,
                'book_id' => $row->book_id,
                'title' => $row->book?->title ?? 'Buku Tidak Diketahui',
                'author' => $row->book?->author?->name ?? 'Penulis Tidak Diketahui',
                'genre' => $row->book?->genre?->name ?? null,
                'cover_photo' => $row->book?->cover_photo,
                'price' => (float) ($row->book?->price ?? 0),
                'quantity' => (int) $row->quantity,
                'subtotal' => (float) $row->total_amount,
                'notes' => $row->notes,
                'book' => $row->book,
            ];
        })->values()->all();

        $totalAmount = (float) $rows->sum('total_amount');
        $totalItems = (int) $rows->sum('quantity');

        return [
            'id' => $first->id,
            'order_number' => $baseCode,
            'invoice_code' => self::formatInvoiceCode($baseCode, $first->created_at),
            'customer_id' => $first->customer_id,
            'customer' => $first->customer,
            'recipient_name' => $first->recipient_name ?? $first->customer?->name,
            'phone' => $first->phone,
            'shipping_address' => $first->shipping_address,
            'notes' => $first->notes,
            'payment_method' => $first->payment_method ?? 'bank_transfer',
            'status' => $first->status ?? 'pending',
            'created_at' => $first->created_at?->toISOString() ?? (string) $first->created_at,
            'updated_at' => $first->updated_at?->toISOString() ?? (string) $first->updated_at,
            'total_amount' => $totalAmount,
            'total_items' => $totalItems,
            'items' => $items,
            // Fallback relasi untuk komponen lama yang membaca transaksi tunggal
            'book' => $first->book,
            'quantity' => $totalItems,
        ];
    }

    /**
     * Mengelompokkan seluruh riwayat pesanan berdasarkan base code.
     */
    public static function groupCollection(Collection $transactions): array
    {
        return $transactions
            ->groupBy(function (Transaction $t) {
                return self::extractBaseCode($t->order_number);
            })
            ->map(function (Collection $group, string $baseCode) {
                return self::presentOrder($baseCode, $group);
            })
            ->values()
            ->all();
    }
}
