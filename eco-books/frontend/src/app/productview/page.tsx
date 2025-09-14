"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import styles from './productview.module.css';

// Define the interface for the book
interface Book {
  book_id: number;
  name: string;
  cover: string;
  description: string;
  publication_date: string;
  purchase_price: number;
  author_id: number;
  category_id: number;
  author?: {
    name: string;
  };
  category?: {
    name:string;
  };
}

// Component that uses useSearchParams
function ProductContent() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id');
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Function to fetch book data
  const fetchBookById = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/book/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('📖 Datos del libro:', data);
        setBook(data);
      } else {
        console.error('Libro no encontrado');
        setBook(null);
      }
    } catch (error) {
      console.error('Error al obtener el libro:', error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchBookById(bookId);
    } else {
      setLoading(false);
    }
  }, [bookId]);

  // Functions to handle quantity
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  // Loading and error states
  if (loading) {
    return (
      <main className={styles.wrapper}>
        <div className={styles.loading}>
          <p>Cargando libro...</p>
        </div>
      </main>
    );
  }

  if (!bookId) {
    return (
      <main className={styles.wrapper}>
        <div className={styles.error}>
          <h2>Libro no especificado</h2>
          <p>No se proporcionó un ID de libro válido.</p>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className={styles.wrapper}>
        <div className={styles.error}>
          <h2>Libro no encontrado</h2>
          <p>No se pudo encontrar el libro solicitado.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.card}>
        {/* Image */}
        <div className={styles.media}>
          <button className={styles.fav} aria-label="Agregar a favoritos">♡</button>
          <div className={styles.imgBox}>
            <Image
              src={book.cover ? `/Images/BookCovers/${book.cover}` : '/Images/default-cover.jpg'}
              alt={book.name}
              fill
              sizes="(max-width: 900px) 90vw, 50vw"
              priority
            />
            <div className={styles.imgPlaceholder} aria-hidden />
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h1 className={styles.title}>{book.name}</h1>
          <p className={styles.author}>por {book.author?.name || 'Autor desconocido'}</p>
          <p className={styles.price}>Q{Number(book.purchase_price).toFixed(2)}</p>
          <p className={styles.desc}>{book.description}</p>

          <div className={styles.meta}>
            <span className={styles.metaItem}>★ <b>4.8</b> (1,873)</span>
            <span className={styles.dot} />
            <span className={styles.metaItem}>📚 {book.category?.name || 'Categoría'}</span>
          </div>

          <div className={styles.qtyRow} aria-label="Cantidad">
            <button 
              className={styles.qtyBtn} 
              onClick={() => handleQuantityChange(-1)}
              aria-label="Disminuir"
            >
              −
            </button>
            <span className={styles.qty}>{quantity}</span>
            <button 
              className={styles.qtyBtn} 
              onClick={() => handleQuantityChange(1)}
              aria-label="Aumentar"
            >
              +
            </button>
          </div>

          <div className={styles.actions}>
            <button className={styles.primary}>Pedir Ahora</button>
            <button className={styles.ghost}>Agregar al carrito</button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Main component with Suspense
export default function ProductViewPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className={styles.wrapper}>
          <div className={styles.loading}>
            <p>Cargando...</p>
          </div>
        </main>
      }>
        <ProductContent />
      </Suspense>
      <Footer />
    </>
  );
}
