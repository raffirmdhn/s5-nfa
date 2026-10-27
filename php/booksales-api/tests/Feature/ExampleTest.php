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

    public function test_root_redirects_to_books(): void
    {
        $response = $this->get('/');
        $response->assertRedirect(route('books.index'));
    }

    public function test_books_page_displays_books_and_relations(): void
    {
        $response = $this->get('/books');
        $response->assertStatus(200);
        $response->assertSee('Harry Potter and the Sorcerer&#039;s Stone', false);
        $response->assertSee('J.K. Rowling');
        $response->assertSee('Fiction');
    }

    public function test_authors_page_displays_authors(): void
    {
        $response = $this->get('/authors');
        $response->assertStatus(200);
        $response->assertSee('J.K. Rowling');
        $response->assertSee('Andrea Hirata');
    }

    public function test_genres_page_displays_genres(): void
    {
        $response = $this->get('/genres');
        $response->assertStatus(200);
        $response->assertSee('Fiction');
        $response->assertSee('Science Fiction');
    }
}
