"use client";

import { useState, useEffect } from 'react';
import ContactForm from '../components/ContactForm';
import ExploreButton from '../components/ExploreButton';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Define the type for the books
interface Book {
  book_id: number;
  cover: string;
  name: string;
  category_id: number;
  author_id: number;
  description: string;
  purchase_price: number;
  author?: {
    name: string;
  };
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]); // State to store books
  const [category, setCategory] = useState('1'); // Selected category (default "1")

  // Function to fetch books by category
  const fetchBooksByCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/book/category/${categoryId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setBooks(data); // Update state only if response is an array
      } else {
        console.error('API response is not an array:', data);
        setBooks([]); // Set empty array if response is invalid
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]); // Set empty array on error
    }
  };

  // Call API when category changes
  useEffect(() => {
    fetchBooksByCategory(category);
  }, [category]);

  return (
    <>
      <Header />
      {/* HERO */}
      <section id="home">
        <h2>Bienvenido a e-Co Books</h2>
        <p>Tu librería online favorita para descubrir los mejores libros</p>
        <ExploreButton />
      </section>

      <main>
        {/* PRODUCTOS */}
        <section id="products">
          <h3>Explora nuestra selección de libros</h3>
          <h2>Productos Destacados</h2>
          <div className="product-grid">
            {/* Check that books is an array before using .map() */}
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book) => (
                <article key={book.book_id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={book.cover ? `/Images/BookCovers/${book.cover}` : '/Images/default-cover.jpg'} 
                      alt={`Portada de ${book.name}`} 
                    />
                    <span className="product-badge">{book.category_id}</span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{book.name}</h3>
                    <p className="product-author">Por: {book.author?.name || 'Autor desconocido'}</p>
                    <p className="product-description">{book.description}</p>
                    <div className="product-price">
                      <span className="price">Q{book.purchase_price}</span>
                    </div>
                    <button className="add-to-cart-btn">Pedir Ahora</button>
                  </div>
                </article>
              ))
            ) : (
              <p>No hay libros disponibles en esta categoría.</p>
            )}
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="Categories">
          <h3>Nuestras Historias</h3>
          <h2>Elige tu Categoria Favorita</h2>
          <div className="categories-section">
            <div className="category-item">
              <button className="category-btn" onClick={() => setCategory('1')}>
                <span className="category-icon">⚔️</span>
              </button>
              <span className="category-label">Acción</span>
            </div>
            <div className="category-item">
              <button className="category-btn" onClick={() => setCategory('2')}>
                <span className="category-icon">🏞️</span>
              </button>
              <span className="category-label">Aventura</span>
            </div>
            <div className="category-item">
              <button className="category-btn" onClick={() => setCategory('3')}>
                <span className="category-icon">💖</span>
              </button>
              <span className="category-label">Romance</span>
            </div>
            <div className="category-item">
              <button className="category-btn" onClick={() => setCategory('4')}>
                <span className="category-icon">🧙‍♂️</span>
              </button>
              <span className="category-label">Fantasía</span>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact-membership" className="contact-section">
          <h2>Ponte en contacto</h2>
          <p>¡Únete a nosotros y recibe novedades exclusivas!</p>
          <ContactForm />
        </section>
      </main>
      <Footer />
    </>
  );
}