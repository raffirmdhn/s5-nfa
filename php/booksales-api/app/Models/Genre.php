<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class Genre extends Model
{
    protected static array $genres = [
        [
            'id' => 1,
            'name' => 'Fiction',
            'description' => 'Karya sastra berisi cerita rekaan atau imajinatif dari penulis.',
        ],
        [
            'id' => 2,
            'name' => 'Non-Fiction',
            'description' => 'Tulisan informatif berbasis fakta, realitas, dan peristiwa nyata.',
        ],
        [
            'id' => 3,
            'name' => 'Science Fiction',
            'description' => 'Genre fiksi spekulatif dengan konsep sains, teknologi masa depan, dan eksplorasi antariksa.',
        ],
        [
            'id' => 4,
            'name' => 'Mystery',
            'description' => 'Kisah berfokus pada penyelidikan teka-teki, kejahatan, atau peristiwa penuh tanda tanya.',
        ],
        [
            'id' => 5,
            'name' => 'Self-Improvement',
            'description' => 'Buku panduan pengembangan diri untuk meningkatkan kualitas kepribadian dan pola pikir.',
        ],
    ];

    public static function all($columns = ['*']): Collection
    {
        return collect(self::$genres);
    }
}
