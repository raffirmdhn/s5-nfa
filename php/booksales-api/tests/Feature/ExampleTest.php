<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Genre;
use App\Models\User;
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

    protected function getAdminToken(): string
    {
        $admin = User::where('email', 'admin@gmail.com')->first();

        return auth('api')->login($admin);
    }

    protected function getUserToken(): string
    {
        $user = User::where('email', 'user@gmail.com')->first();

        return auth('api')->login($user);
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

    public function test_auth_can_register_and_login(): void
    {
        $registerResponse = $this->postJson('/api/register', [
            'name' => 'Budi Santoso',
            'email' => 'budi@gmail.com',
            'password' => 'secret123',
            'role' => 'user',
        ]);

        $registerResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['user', 'token', 'token_type', 'expires_in'],
            ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => 'budi@gmail.com',
            'password' => 'secret123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['user', 'token', 'token_type', 'expires_in'],
            ]);

        $token = $loginResponse->json('data.token');

        $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logout berhasil',
            ]);
    }

    public function test_public_can_access_books_index(): void
    {
        $response = $this->getJson('/api/books');
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(5, 'data');
    }

    public function test_public_can_access_authors_index_and_show(): void
    {
        $responseIndex = $this->getJson('/api/authors');
        $responseIndex->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(5, 'data');

        $responseShow = $this->getJson('/api/authors/1');
        $responseShow->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', 1);
    }

    public function test_public_can_access_genres_index_and_show(): void
    {
        $responseIndex = $this->getJson('/api/genres');
        $responseIndex->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(5, 'data');

        $responseShow = $this->getJson('/api/genres/1');
        $responseShow->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', 1);
    }

    public function test_unauthenticated_cannot_create_genre_or_author(): void
    {
        $genreResponse = $this->postJson('/api/genres', [
            'name' => 'Horror',
        ]);
        $genreResponse->assertStatus(401);

        $authorResponse = $this->postJson('/api/authors', [
            'name' => 'Pramoedya',
        ]);
        $authorResponse->assertStatus(401);
    }

    public function test_non_admin_user_cannot_create_genre_or_author(): void
    {
        $token = $this->getUserToken();

        $genreResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/genres', [
                'name' => 'Horror',
            ]);
        $genreResponse->assertStatus(403);

        $authorResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/authors', [
                'name' => 'Pramoedya',
            ]);
        $authorResponse->assertStatus(403);
    }

    public function test_admin_can_create_update_delete_genre(): void
    {
        $token = $this->getAdminToken();

        // Create
        $createResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/genres', [
                'name' => 'Horror',
                'description' => 'Mencekam dan penuh misteri',
            ]);
        $createResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Horror');

        $genreId = $createResponse->json('data.id');

        // Update
        $updateResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/genres/'.$genreId, [
                'name' => 'Horror Thriller',
            ]);
        $updateResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Horror Thriller');

        // Delete
        $deleteResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/genres/'.$genreId);
        $deleteResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('genres', ['id' => $genreId]);
    }

    public function test_admin_can_create_update_delete_author(): void
    {
        $token = $this->getAdminToken();

        // Create
        $createResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/authors', [
                'name' => 'Pramoedya Ananta Toer',
                'bio' => 'Penulis Tetralogi Buru',
            ]);
        $createResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Pramoedya Ananta Toer');

        $authorId = $createResponse->json('data.id');

        // Update
        $updateResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/authors/'.$authorId, [
                'name' => 'Pramoedya A. Toer',
            ]);
        $updateResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Pramoedya A. Toer');

        // Delete
        $deleteResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/authors/'.$authorId);
        $deleteResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('authors', ['id' => $authorId]);
    }

    public function test_genre_and_author_not_found_returns_404(): void
    {
        $token = $this->getAdminToken();

        $genreShow = $this->getJson('/api/genres/999');
        $genreShow->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);

        $genreUpdate = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/genres/999', ['name' => 'Test']);
        $genreUpdate->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);

        $authorShow = $this->getJson('/api/authors/999');
        $authorShow->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);

        $authorUpdate = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/authors/999', ['name' => 'Test']);
        $authorUpdate->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ]);
    }
}
