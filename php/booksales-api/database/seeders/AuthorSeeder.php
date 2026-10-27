<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        $authors = [
            [
                'name' => 'J.K. Rowling',
                'photo' => 'https://ui-avatars.com/api/?name=J+K+Rowling&background=1e293b&color=fff',
                'bio' => 'British author, best known for the Harry Potter series.',
            ],
            [
                'name' => 'George R.R. Martin',
                'photo' => 'https://ui-avatars.com/api/?name=George+R+R+Martin&background=0f766e&color=fff',
                'bio' => 'American novelist and short story writer, known for A Song of Ice and Fire.',
            ],
            [
                'name' => 'Isaac Asimov',
                'photo' => 'https://ui-avatars.com/api/?name=Isaac+Asimov&background=0369a1&color=fff',
                'bio' => 'American author and professor of biochemistry, known for his works in science fiction.',
            ],
            [
                'name' => 'Andrea Hirata',
                'photo' => 'https://ui-avatars.com/api/?name=Andrea+Hirata&background=6d28d9&color=fff',
                'bio' => 'Penulis novel terkemuka asal Belitung, pencipta mahakarya Laskar Pelangi.',
            ],
            [
                'name' => 'Tere Liye',
                'photo' => 'https://ui-avatars.com/api/?name=Tere+Liye&background=b45309&color=fff',
                'bio' => 'Prolific Indonesian author with various best-sellers.',
            ],
        ];

        foreach ($authors as $author) {
            Author::create($author);
        }
    }
}
