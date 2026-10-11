import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import initialBooks from './utils/books'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Book from './components/Book'
import NotFound from './components/NotFound'
import Footer from './components/Footer'

function App() {
  const [books, setBooks] = useState(initialBooks)

  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [newBook, ...prevBooks])
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar totalBooks={books.length} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home books={books} />} />
          <Route path="/book" element={<Book books={books} onAddBook={handleAddBook} />} />
          <Route path="/books" element={<Book books={books} onAddBook={handleAddBook} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
