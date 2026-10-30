<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_root_returns_api_overview_json(): void
    {
        $response = $this->getJson('/');
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'BookSales API Service',
            ]);
    }

    public function test_api_books_returns_json_with_author_and_genre(): void
    {
        $response = $this->getJson('/api/books');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'description',
                        'price',
                        'stock',
                        'cover_photo',
                        'genre_id',
                        'author_id',
                        'author' => ['id', 'name'],
                        'genre' => ['id', 'name'],
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonCount(5, 'data');
    }

    public function test_api_authors_returns_json(): void
    {
        $response = $this->getJson('/api/authors');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'photo',
                        'bio',
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonCount(5, 'data');
    }

    public function test_api_genres_returns_json(): void
    {
        $response = $this->getJson('/api/genres');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonCount(5, 'data');
    }

    public function test_api_genres_can_create_genre(): void
    {
        $payload = [
            'name' => 'Horror',
            'description' => 'Genre yang menghadirkan rasa takut dan ketegangan.',
        ];

        $response = $this->postJson('/api/genres', $payload);
        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Genre berhasil ditambahkan',
                'data' => [
                    'name' => 'Horror',
                    'description' => 'Genre yang menghadirkan rasa takut dan ketegangan.',
                ],
            ]);

        $this->assertDatabaseHas('genres', [
            'name' => 'Horror',
        ]);
    }

    public function test_api_genres_validation_fails_when_name_is_missing(): void
    {
        $response = $this->postJson('/api/genres', [
            'description' => 'Deskripsi tanpa nama genre',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_api_authors_can_create_author(): void
    {
        $payload = [
            'name' => 'Pramoedya Ananta Toer',
            'photo' => 'https://ui-avatars.com/api/?name=Pramoedya+Ananta+Toer',
            'bio' => 'Salah satu sastrawan terkemuka Indonesia, penulis Tetralogi Buru.',
        ];

        $response = $this->postJson('/api/authors', $payload);
        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Penulis berhasil ditambahkan',
                'data' => [
                    'name' => 'Pramoedya Ananta Toer',
                    'photo' => 'https://ui-avatars.com/api/?name=Pramoedya+Ananta+Toer',
                    'bio' => 'Salah satu sastrawan terkemuka Indonesia, penulis Tetralogi Buru.',
                ],
            ]);

        $this->assertDatabaseHas('authors', [
            'name' => 'Pramoedya Ananta Toer',
        ]);
    }

    public function test_api_authors_validation_fails_when_name_is_missing(): void
    {
        $response = $this->postJson('/api/authors', [
            'bio' => 'Penulis tanpa nama',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_api_genres_can_show_genre(): void
    {
        $response = $this->getJson('/api/genres/1');
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Detail genre berhasil diambil',
                'data' => [
                    'id' => 1,
                ],
            ]);
    }

    public function test_api_genres_returns_404_when_genre_not_found(): void
    {
        $response = $this->getJson('/api/genres/999');
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);
    }

    public function test_api_genres_update_returns_404_when_genre_not_found(): void
    {
        $response = $this->putJson('/api/genres/999', [
            'name' => 'Fiction Updated',
        ]);
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);
    }

    public function test_api_genres_delete_returns_404_when_genre_not_found(): void
    {
        $response = $this->deleteJson('/api/genres/999');
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);
    }

    public function test_api_genres_can_update_genre(): void
    {
        $response = $this->putJson('/api/genres/1', [
            'name' => 'Fiction Updated',
            'description' => 'Updated fiction description',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Genre berhasil diperbarui',
                'data' => [
                    'id' => 1,
                    'name' => 'Fiction Updated',
                ],
            ]);

        $this->assertDatabaseHas('genres', [
            'id' => 1,
            'name' => 'Fiction Updated',
        ]);
    }

    public function test_api_genres_can_delete_genre(): void
    {
        $genre = \App\Models\Genre::create([
            'name' => 'Genre to Delete',
            'description' => 'Temporary genre',
        ]);

        $response = $this->deleteJson('/api/genres/'.$genre->id);
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Genre berhasil dihapus',
            ]);

        $this->assertDatabaseMissing('genres', [
            'id' => $genre->id,
        ]);
    }

    public function test_api_authors_can_show_author(): void
    {
        $response = $this->getJson('/api/authors/1');
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Detail penulis berhasil diambil',
                'data' => [
                    'id' => 1,
                ],
            ]);
    }

    public function test_api_authors_returns_404_when_author_not_found(): void
    {
        $response = $this->getJson('/api/authors/999');
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);
    }

    public function test_api_authors_update_returns_404_when_author_not_found(): void
    {
        $response = $this->putJson('/api/authors/999', [
            'name' => 'Author Updated',
        ]);
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);
    }

    public function test_api_authors_delete_returns_404_when_author_not_found(): void
    {
        $response = $this->deleteJson('/api/authors/999');
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);
    }

    public function test_api_authors_can_update_author(): void
    {
        $response = $this->putJson('/api/authors/1', [
            'name' => 'J.K. Rowling Updated',
            'bio' => 'Updated bio information',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Penulis berhasil diperbarui',
                'data' => [
                    'id' => 1,
                    'name' => 'J.K. Rowling Updated',
                ],
            ]);

        $this->assertDatabaseHas('authors', [
            'id' => 1,
            'name' => 'J.K. Rowling Updated',
        ]);
    }

    public function test_api_authors_can_delete_author(): void
    {
        $author = \App\Models\Author::create([
            'name' => 'Author to Delete',
            'bio' => 'Temporary bio',
        ]);

        $response = $this->deleteJson('/api/authors/'.$author->id);
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Penulis berhasil dihapus',
            ]);

        $this->assertDatabaseMissing('authors', [
            'id' => $author->id,
        ]);
    }
}
