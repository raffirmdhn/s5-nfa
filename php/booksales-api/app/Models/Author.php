<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class Author extends Model
{
    protected static array $authors = [
        [
            'id' => 1,
            'name' => 'Pramoedya Ananta Toer',
            'photo' => 'https://ui-avatars.com/api/?name=Pramoedya+Ananta+Toer&background=1e293b&color=fff',
            'bio' => 'Penulis sastra legendaris Indonesia yang terkenal lewat Tetralogi Buru dan berbagai karya bertema humanisme.',
        ],
        [
            'id' => 2,
            'name' => 'Tere Liye',
            'photo' => 'https://ui-avatars.com/api/?name=Tere+Liye&background=0f766e&color=fff',
            'bio' => 'Penulis produktif asal Indonesia dengan puluhan novel populer bertema keluarga, petualangan dunia paralel, dan sosial.',
        ],
        [
            'id' => 3,
            'name' => 'Andrea Hirata',
            'photo' => 'https://ui-avatars.com/api/?name=Andrea+Hirata&background=0369a1&color=fff',
            'bio' => 'Penulis novel fenomenal Laskar Pelangi yang karyanya telah diterjemahkan ke puluhan bahasa internasional.',
        ],
        [
            'id' => 4,
            'name' => 'Dee Lestari',
            'photo' => 'https://ui-avatars.com/api/?name=Dee+Lestari&background=6d28d9&color=fff',
            'bio' => 'Novelis dan musisi berbakat, pencipta seri fiksi sains Supernova, Filosofi Kopi, serta Aroma Karsa.',
        ],
        [
            'id' => 5,
            'name' => 'Ahmad Fuadi',
            'photo' => 'https://ui-avatars.com/api/?name=Ahmad+Fuadi&background=b45309&color=fff',
            'bio' => 'Novelis dan mantan jurnalis, dikenal luas melalui novel inspiratif trilogi Negeri 5 Menara.',
        ],
    ];

    public static function all($columns = ['*']): Collection
    {
        return collect(self::$authors);
    }
}
