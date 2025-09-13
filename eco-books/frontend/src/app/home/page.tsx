/* ----- HOME PAGE -----*/

import ContactForm from '../components/ContactForm'
import ExploreButton from '../components/ExploreButton'
import Header from '../components/Header'
import Footer from '../components/Footer'


export default function Home() {
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
            {/* Product 1 */}
            <article className="product-card">
              <div className="product-image">
                <img src="/Images/Book Covers/Onyx Storm.jpg" alt="Portada de Libro 1" />
                <span className="product-badge">Nuevo</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">Onyx Storm</h3>
                <p className="product-author">Por: Rebecca Yarros</p>
                <p className="product-description">
                  Una épica de acción y romance en un mundo de dragones y guerra.
                </p>
                <div className="product-price">
                  <span className="price">Q199,99</span>
                </div>
                <button className="add-to-cart-btn">Pedir Ahora</button>
              </div>
            </article>

            {/* Product 2 */}
            <article className="product-card">
              <div className="product-image">
                <img src="/Images/Book Covers/The Let Them Theory.jpg" alt="Portada del Libro 2" />
                <span className="product-badge bestseller">Bestseller</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">The Let Them Theory</h3>
                <p className="product-author">Por: Mel Robbins</p>
                <p className="product-description">
                  Una guía motivacional para superar bloqueos mentales y encontrar empoderamiento.
                </p>
                <div className="product-price">
                  <span className="price">Q234,99</span>
                </div>
                <button className="add-to-cart-btn">Pedir Ahora</button>
              </div>
            </article>

            {/* Product 3 */}
            <article className="product-card">
              <div className="product-image">
                <img src="/Images/Book Covers/Sunrise on the Reaping.jpg" alt="Portada del Libro 3" />
                <span className="product-badge sale">Oferta</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">Sunrise on the Reaping</h3>
                <p className="product-author">Por: Suzanne Collins</p>
                <p className="product-description">Una precuela de Los Juegos del Hambre.</p>
                <div className="product-price">
                  <span className="price">Q199,99</span>
                </div>
                <button className="add-to-cart-btn">Pedir Ahora</button>
              </div>
            </article>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="Categories">
          <h3>Nuestras Historias</h3>
          <h2>Elige tu Categoria Favorita</h2>
          <div className="categories-section">
            <div className="category-item">
              <button className="category-btn"><span className="category-icon">⚔️</span></button>
              <span className="category-label">Acción</span>
            </div>
            <div className="category-item">
              <button className="category-btn"><span className="category-icon">🏞️</span></button>
              <span className="category-label">Aventura</span>
            </div>
            <div className="category-item">
              <button className="category-btn"><span className="category-icon">💖</span></button>
              <span className="category-label">Romance</span>
            </div>
            <div className="category-item">
              <button className="category-btn"><span className="category-icon">🧙‍♂️</span></button>
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
  )
}
