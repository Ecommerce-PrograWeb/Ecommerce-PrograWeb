import Head from 'next/head';
import styles from './Home.module.css';
import ContactForm from './components/ContactForm'

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans+Caption:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <title>Home</title>
      </Head>

      <nav>
        <ul className={styles.navList}>
          {/* ...nav items... */}
        </ul>
      </nav>

      <header>
        <h1 className={styles.headerTitle}>
          {/* ...header content... */}
        </h1>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Bienvenido a e-Co Books</h2>
            <p className={styles.heroText}>Tu librería online favorita para descubrir los mejores libros</p>
            <button className={styles['cta-button']}>
              Explorar Productos
            </button>
          </div>
        </section>
        <section id="products">
          <h3>Explora nuestra selección de libros</h3>
          <h2>Productos Destacados</h2>
          <div className={styles['product-grid']}>
            {/* Product Card 1 */}
            <article className={styles['product-card']}>
              <div className={styles['product-image']}>
                <img src="/Images/Book Covers/Onyx Storm.jpg" alt="Portada de Libro 1" />
                <span className={styles['product-badge']}>Nuevo</span>
              </div>
              <div className={styles['product-info']}>
                <h3 className={styles['product-title']}>Onyx Storm</h3>
                <p className={styles['product-author']}>Por: Rebecca Yarros</p>
                <p className={styles['product-description']}>Una épica de acción y romance en un mundo de dragones y guerra.</p>
                <div className={styles['product-price']}>
                  <span className={styles.price}>Q199,99</span>
                </div>
                <button className={styles['add-to-cart-btn']}>Pedir Ahora</button>
              </div>
            </article>
            {/* Product Card 2 */}
            <article className={styles['product-card']}>
              <div className={styles['product-image']}>
                <img src="/Images/Book Covers/The Let Them Theory.jpg" alt="Portada del Libro 2" />
                <span className={`${styles['product-badge']} ${styles.bestseller}`}>Bestseller</span>
              </div>
              <div className={styles['product-info']}>
                <h3 className={styles['product-title']}>The Let Them Theory</h3>
                <p className={styles['product-author']}>Por: Mel Robbins</p>
                <p className={styles['product-description']}>Una guía motivacional para superar bloqueos mentales y encontrar empoderamiento.</p>
                <div className={styles['product-price']}>
                  <span className={styles.price}>Q234,99</span>
                </div>
                <button className={styles['add-to-cart-btn']}>Pedir Ahora</button>
              </div>
            </article>
            {/* Product Card 3 */}
            <article className={styles['product-card']}>
              <div className={styles['product-image']}>
                <img src="/Images/Book Covers/Sunrise on the Reaping.jpg" alt="Portada del Libro 3" />
                <span className={`${styles['product-badge']} ${styles.sale}`}>Oferta</span>
              </div>
              <div className={styles['product-info']}>
                <h3 className={styles['product-title']}>Sunrise on the Reaping</h3>
                <p className={styles['product-author']}>Por: Suzanne Collins</p>
                <p className={styles['product-description']}>Una precuela de Los Juegos del Hambre.</p>
                <div className={styles['product-price']}>
                  <span className={styles.price}>Q199,99</span>
                </div>
                <button className={styles['add-to-cart-btn']}>Pedir Ahora</button>
              </div>
            </article>
          </div>
        </section>

        <section id="Categories">
          <h3>Nuestras Historias</h3>
          <h2>Elige tu Categoria Favorita</h2>
          <div className={styles['categories-section']}>
            <div className={styles['category-item']}>
              <button className={styles['category-btn']}><span className={styles['category-icon']}>⚔️</span></button>
              <span className={styles['category-label']}>Acción</span>
            </div>
            <div className={styles['category-item']}>
              <button className={styles['category-btn']}><span className={styles['category-icon']}>🏞️</span></button>
              <span className={styles['category-label']}>Aventura</span>
            </div>
            <div className={styles['category-item']}>
              <button className={styles['category-btn']}><span className={styles['category-icon']}>💖</span></button>
              <span className={styles['category-label']}>Romance</span>
            </div>
            <div className={styles['category-item']}>
              <button className={styles['category-btn']}><span className={styles['category-icon']}>🧙‍♂️</span></button>
              <span className={styles['category-label']}>Fantasía</span>
            </div>
          </div>
        </section>

        <section id="contact-membership" className={styles['contact-section']}>
          <h2>Ponte en contacto</h2>
          <p>¡Únete a nosotros y recibe novedades exclusivas!</p>
          <ContactForm />
        </section>
      </main>

      <footer className={styles.footerContainer}>
        <div className={styles['footer-container']}>
          <div className={styles['footer-section']}>
            <h2>e-Co Books</h2>
            <p><strong>Contact us</strong></p>
            <p>ecobooks@gmail.com</p>
            <p>+1-2345-6789</p>
            <p>456 Library Ave, New York, USA</p>
            <div className={styles['social-icons']}>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" /></a>
            </div>
          </div>
          <div className={styles['footer-section']}>
            <p><strong>Products</strong></p>
            <p>Libros digitales</p>
            <p>Revistas académicas</p>
            <p>Audios narrados</p>
            <p>Libros interactivos</p>
            <p>Biblioteca en línea</p>
          </div>
          <div className={styles['footer-section']}>
            <p><strong>About</strong></p>
            <p>Quiénes somos</p>
            <p>Política de privacidad</p>
            <p>Condiciones de uso</p>
            <p>Preguntas frecuentes</p>
            <p>Contáctanos</p>
          </div>
        </div>
        <div className={styles['footer-bottom']}>
          <div className={styles['language-select']}>🌐 English ▼</div>
          <p>Copyright © 2025. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}