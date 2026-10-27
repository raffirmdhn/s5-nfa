@extends('layouts.app')

@section('title', 'Daftar Buku')

@section('content')
    <div class="page-header">
        <h1 class="page-title">Daftar Buku (Book)</h1>
        <p class="page-subtitle">Data koleksi buku yang bersumber dari database (Eloquent Model Book) beserta relasi Penulis dan Genre.</p>
    </div>

    <div class="table-card">
        <table>
            <thead>
                <tr>
                    <th style="width: 70px;">ID</th>
                    <th style="width: 260px;">Judul Buku</th>
                    <th style="width: 170px;">Penulis</th>
                    <th style="width: 130px;">Genre</th>
                    <th style="width: 120px;">Harga</th>
                    <th style="width: 80px;">Stok</th>
                    <th>Deskripsi</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($books as $book)
                    <tr>
                        <td>
                            <span class="badge">#{{ $book->id }}</span>
                        </td>
                        <td>
                            <strong>{{ $book->title }}</strong>
                        </td>
                        <td>
                            {{ $book->author->name ?? '-' }}
                        </td>
                        <td>
                            <span class="badge">{{ $book->genre->name ?? '-' }}</span>
                        </td>
                        <td>
                            Rp {{ number_format($book->price, 0, ',', '.') }}
                        </td>
                        <td>
                            {{ $book->stock }}
                        </td>
                        <td>
                            {{ $book->description ?? '-' }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">
                            Tidak ada data buku.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
