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
                'photo' => 'https://media.vanityfair.com/photos/6436ec99f4cbb22f9cf6d4d2/1:1/w_2330,h_2330,c_limit/53243599',
                'bio' => 'British author, best known for the Harry Potter series.',
            ],
            [
                'name' => 'George R.R. Martin',
                'photo' => 'https://hips.hearstapps.com/hmg-prod/images/george-r-r-martin-attends-the-fyc-special-screening-for-hbo-news-photo-1695312908.jpg',
                'bio' => 'American novelist and short story writer, known for A Song of Ice and Fire.',
            ],
            [
                'name' => 'Isaac Asimov',
                'photo' => 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-3240525jpg--.jpg',
                'bio' => 'American author and professor of biochemistry, known for his works in science fiction.',
            ],
            [
                'name' => 'Andrea Hirata',
                'photo' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpp2lKfN5Ma7RxG1UUAqXjloJy1mFhcwoOhNiuTpRtK_C6NTtL4rhuBFc&s=10',
                'bio' => 'Penulis novel terkemuka asal Belitung, pencipta mahakarya Laskar Pelangi.',
            ],
            [
                'name' => 'Tere Liye',
                'photo' => 'https://img.okezone.com/content/2023/09/15/33/2883518/profil-dan-biodata-tere-liye-novelis-best-seller-indonesia-I1mNKYTUxE.jpg',
                'bio' => 'Prolific Indonesian author with various best-sellers.',
            ],
        ];

        foreach ($authors as $author) {
            Author::create($author);
        }
    }
}
