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
}
