@extends('layouts.app')

@section('title', 'Daftar Author')

@section('content')
    <div class="page-header">
        <h1 class="page-title">Daftar Penulis (Author)</h1>
        <p class="page-subtitle">Data profil penulis buku yang bersumber dari database (Eloquent Model Author).</p>
    </div>

    <div class="table-card">
        <table>
            <thead>
                <tr>
                    <th style="width: 80px;">ID</th>
                    <th style="width: 80px;">Foto</th>
                    <th style="width: 240px;">Nama Penulis</th>
                    <th>Biografi</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($authors as $author)
                    <tr>
                        <td>
                            <span class="badge">#{{ $author->id }}</span>
                        </td>
                        <td>
                            @if ($author->photo)
                                <img src="{{ $author->photo }}" alt="{{ $author->name }}" class="avatar">
                            @else
                                <span class="badge">-</span>
                            @endif
                        </td>
                        <td>
                            <strong>{{ $author->name }}</strong>
                        </td>
                        <td>{{ $author->bio ?? '-' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align: center; color: #94a3b8; padding: 2rem;">
                            Tidak ada data penulis.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
