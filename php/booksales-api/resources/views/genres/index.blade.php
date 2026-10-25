@extends('layouts.app')

@section('title', 'Daftar Genre')

@section('content')
    <div class="page-header">
        <h1 class="page-title">Daftar Genre</h1>
        <p class="page-subtitle">Data kategori genre buku yang bersumber dari Model Genre (Array).</p>
    </div>

    <div class="table-card">
        <table>
            <thead>
                <tr>
                    <th style="width: 80px;">ID</th>
                    <th style="width: 220px;">Nama Genre</th>
                    <th>Deskripsi</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($genres as $genre)
                    <tr>
                        <td>
                            <span class="badge">#{{ $genre['id'] }}</span>
                        </td>
                        <td>
                            <strong>{{ $genre['name'] }}</strong>
                        </td>
                        <td>{{ $genre['description'] }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3" style="text-align: center; color: #94a3b8; padding: 2rem;">
                            Tidak ada data genre.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
