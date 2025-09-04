/* ----- HOME PAGE -----*/

import ContactForm from '../components/ContactForm'
import ExploreButton from '../components/ExploreButton'

export default function Home() {
  return (
    <>
      <header className="header">
        <nav className="nav-container">
          <div className="logo">
            <span className="symbols">star</span>
            LOGO
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#discover">Discover</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-icons">
            <button className="icon-user" aria-label="User">
              <span className="symbols">person</span>
            </button>
            <button className="icon-cart" aria-label="Cart">
              <span className="symbols">shopping_cart</span>
            </button>
            <button className="icon-menu" aria-label="Menu">
              <span className="symbols">menu</span>
            </button>
          </div>
        </nav>
      </header>

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

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h2>e-Co Books</h2>
            <p><strong>Contact us</strong></p>
            <p>ecobooks@gmail.com</p>
            <p>+1-2345-6789</p>
            <p>456 Library Ave, New York, USA</p>
            <div className="social-icons">
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" /></a>
            </div>
          </div>

          <div className="footer-section">
            <p><strong>Products</strong></p>
            <p>Libros digitales</p>
            <p>Revistas académicas</p>
            <p>Audios narrados</p>
            <p>Libros interactivos</p>
            <p>Biblioteca en línea</p>
          </div>

          <div className="footer-section">
            <p><strong>About</strong></p>
            <p>Quiénes somos</p>
            <p>Política de privacidad</p>
            <p>Condiciones de uso</p>
            <p>Preguntas frecuentes</p>
            <p>Contáctanos</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="language-select">🌐 English ▼</div>
          <p>Copyright © 2025. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
