// app/search/page.tsx
"use client";

import "./search.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Book {
  book_id: number;
  cover: string;
  name: string;
  category_id: number;
  author_id: number;
  description: string;
  publication_date: string;
  purchase_price: number | string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

type CartItem = {
  book_id: number;
  name: string;
  cover?: string;
  purchase_price: number;
  quantity: number;
};

export default function SearchPage() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Helper function to format price
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  // Fetch all books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/book');
        const data = await response.json();
        if (Array.isArray(data)) {
          setBooks(data);
          setFilteredBooks(data);
        } else {
          console.error('API response is not an array:', data);
          setBooks([]);
          setFilteredBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = books.filter((book) =>
        book.name.toLowerCase().includes(query) ||
        book.author?.name.toLowerCase().includes(query) ||
        book.category?.name.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clear = () => setSelected(new Set());

  const addToCart = () => {
    if (selected.size === 0) {
      console.log("❌ No hay libros seleccionados");
      return;
    }

    console.log("📚 Libros seleccionados:", Array.from(selected));
    const selectedBooks = filteredBooks.filter((b) => selected.has(b.book_id));
    console.log("📖 Datos de los libros seleccionados:", selectedBooks);
    console.log("📖 Primer libro completo:", JSON.stringify(selectedBooks[0], null, 2));

    let current: CartItem[] = [];
    try {
      const raw = localStorage.getItem("cart");
      console.log("🛒 Carrito actual en localStorage:", raw);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) current = parsed;
      }
    } catch (error) {
      console.error("❌ Error al leer localStorage:", error);
    }

    for (const b of selectedBooks) {
      const idx = current.findIndex((x: CartItem) => x.book_id === b.book_id);
      const price = typeof b.purchase_price === 'string' ? parseFloat(b.purchase_price) : b.purchase_price;
      
      console.log(`➕ Agregando libro: ${b.name} (ID: ${b.book_id}), Precio: ${price}`);
      
      if (idx >= 0) {
        console.log(`  📦 Libro ya existe en carrito, incrementando cantidad`);
        current[idx].quantity = Number(current[idx].quantity || 0) + 1;
      } else {
        console.log(`  🆕 Libro nuevo en carrito`);
        current.push({
          book_id: b.book_id,
          name: b.name,
          cover: b.cover,
          purchase_price: price,
          quantity: 1,
        });
      }
    }

    console.log("💾 Guardando carrito actualizado:", current);
    localStorage.setItem("cart", JSON.stringify(current));
    setSelected(new Set());
    
    console.log("🚀 Navegando a /cart");
    router.push("/cart");
  };

  const handleBookClick = (bookId: number) => {
    router.push(`/productview?id=${bookId}`);
  };

  return (
    <>
      <Header />
      <main className="srch">
        <section className="srch-head">
          <h1 className="srch-title">Descubre Libros</h1>
          <p className="srch-sub">Explora nuestra colección completa de libros.</p>
          
          {/* Search Bar */}
          <div className="srch-search">
            <input
              type="text"
              className="srch-search-input"
              placeholder="Buscar por título, autor, categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="srch-search-icon">🔍</span>
          </div>

          <div className="srch-toolbar">
            <span className="srch-count">
              {selected.size} seleccionados {filteredBooks.length > 0 && `de ${filteredBooks.length} libros`}
            </span>
            <button className="srch-action" onClick={clear} disabled={selected.size === 0}>
              Limpiar selección
            </button>
            <button
              className="srch-action srch-action--primary"
              onClick={addToCart}
              disabled={selected.size === 0}
            >
              Añadir al carrito ({selected.size})
            </button>
          </div>
        </section>

        {loading ? (
          <div className="srch-loading">
            <p>Cargando libros...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="srch-empty">
            <p>No se encontraron libros {searchQuery && `para "${searchQuery}"`}</p>
          </div>
        ) : (
          <section className="srch-grid">
            {filteredBooks.map((book) => {
              const isSel = selected.has(book.book_id);
              return (
                <article 
                  key={book.book_id} 
                  className={`srch-book-card ${isSel ? "is-selected" : ""}`}
                >
                  {/* Checkbox for selection */}
                  <div className="srch-select-overlay">
                    <input
                      type="checkbox"
                      className="srch-checkbox"
                      checked={isSel}
                      onChange={() => toggle(book.book_id)}
                      aria-label={`Seleccionar ${book.name}`}
                    />
                    <span className="srch-checkmark">✓</span>
                  </div>

                  {/* Book Image */}
                  <div 
                    className="srch-book-image"
                    onClick={() => handleBookClick(book.book_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={book.cover ? `/Images/BookCovers/${book.cover}` : '/Images/BookCovers/default-cover.jpg'} 
                      alt={`Portada de ${book.name}`} 
                    />
                    {book.category?.name && (
                      <span className="srch-book-badge">{book.category.name}</span>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="srch-book-info">
                    <h3 
                      className="srch-book-title"
                      onClick={() => handleBookClick(book.book_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {book.name}
                    </h3>
                    <p className="srch-book-author">
                      Por: {book.author?.name || 'Autor desconocido'}
                    </p>
                    <p className="srch-book-description">
                      {book.description.length > 100 
                        ? `${book.description.substring(0, 100)}...` 
                        : book.description}
                    </p>
                    <div className="srch-book-footer">
                      <span className="srch-book-price">Q{formatPrice(book.purchase_price)}</span>
                      <button 
                        className={`srch-book-btn ${isSel ? 'selected' : ''}`}
                        onClick={() => toggle(book.book_id)}
                      >
                        {isSel ? 'Seleccionado' : 'Seleccionar'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
