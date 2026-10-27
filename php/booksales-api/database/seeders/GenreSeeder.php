<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            [
                'name' => 'Fiction',
                'description' => 'A literary work based on the imagination and not necessarily on fact.',
            ],
            [
                'name' => 'Non-Fiction',
                'description' => 'A literary work based on facts and real events.',
            ],
            [
                'name' => 'Science Fiction',
                'description' => 'A genre that deals with imaginative and futuristic concepts.',
            ],
            [
                'name' => 'Fantasy',
                'description' => 'Genre sastra yang menyajikan dunia imajinatif, sihir, dan petualangan magis.',
            ],
            [
                'name' => 'Mystery',
                'description' => 'Plot driven by suspense, crime, and puzzle-solving.',
            ],
        ];

        foreach ($genres as $genre) {
            Genre::create($genre);
        }
    }
}
