import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans+Caption:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>

      <header className={styles.header}>
        <nav className={styles.navContainer}>
          <div className={styles.logo}>
            <span className="symbols">star</span>
            LOGO
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#home">Home</a></li>
            <li><a href="#discover">Discover</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className={styles.navIcons}>
            <button className={styles.iconUser} aria-label="User">
              <span className="symbols">person</span>
            </button>
            <button className={styles.iconCart} aria-label="Cart">
              <span className="symbols">shopping_cart</span>
            </button>
            <button className={styles.iconMenu} aria-label="Menu">
              <span className="symbols">menu</span>
            </button>
          </div>
        </nav>
      </header>

      <section id="home" className={styles.heroSection}>
        <h2>Bienvenido a e-Co Books</h2>
        <p>Tu librería online favorita para descubrir los mejores libros</p>
        <button className={styles.ctaButton} onClick={() => {
          document.getElementById('products').scrollIntoView({behavior: 'smooth'});
        }}>
          Explorar Productos
        </button>
      </section>

      <main>
        <section id="products" className={styles.productsSection}>
          <h3>Explora nuestra selección de libros</h3>
          <h2>Productos Destacados</h2>
          <div className={styles.productGrid}>
            {/* Product Card 1 */}
            <article className={styles.productCard}>
              <div className={styles.productImage}>
                <img src="/Book Covers/Onyx Storm.jpg" alt="Portada de Libro 1" />
                <span className={styles.productBadge}>Nuevo</span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>Onyx Storm</h3>
                <p className={styles.productAuthor}>Por: Rebecca Yarros</p>
                <p className={styles.productDescription}>Una épica de acción y romance en un mundo de dragones y guerra.</p>
                <div className={styles.productPrice}>
                  <span className={styles.price}>Q199,99</span>
                </div>
                <button className={styles.addToCartBtn}>Pedir Ahora</button>
              </div>
            </article>
            {/* Product Card 2 */}
            <article className={styles.productCard}>
              <div className={styles.productImage}>
                <img src="/Book Covers/The Let Them Theory.jpg" alt="Portada del Libro 2" />
                <span className={`${styles.productBadge} ${styles.bestseller}`}>Bestseller</span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>The Let Them Theory</h3>
                <p className={styles.productAuthor}>Por: Mel Robbins</p>
                <p className={styles.productDescription}>Una guía motivacional para superar bloqueos mentales y encontrar empoderamiento.</p>
                <div className={styles.productPrice}>
                  <span className={styles.price}>Q234,99</span>
                </div>
                <button className={styles.addToCartBtn}>Pedir Ahora</button>
              </div>
            </article>
            {/* Product Card 3 */}
            <article className={styles.productCard}>
              <div className={styles.productImage}>
                <img src="/Book Covers/Sunrise on the Reaping.jpg" alt="Portada del Libro 3" />
                <span className={`${styles.productBadge} ${styles.sale}`}>Oferta</span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>Sunrise on the Reaping</h3>
                <p className={styles.productAuthor}>Por: Suzanne Collins</p>
                <p className={styles.productDescription}>Una precuela de Los Juegos del Hambre.</p>
                <div className={styles.productPrice}>
                  <span className={styles.price}>Q199,99</span>
                </div>
                <button className={styles.addToCartBtn}>Pedir Ahora</button>
              </div>
            </article>
          </div>
        </section>

        <section id="Categories" className={styles.categoriesSection}>
          <h3>Nuestras Historias</h3>
          <h2>Elige tu Categoria Favorita</h2>
          <div className={styles.categories}>
            <div className={styles.categoryItem}>
              <button className={styles.categoryBtn}><span className={styles.categoryIcon}>⚔️</span></button>
              <span className={styles.categoryLabel}>Acción</span>
            </div>
            <div className={styles.categoryItem}>
              <button className={styles.categoryBtn}><span className={styles.categoryIcon}>🏞️</span></button>
              <span className={styles.categoryLabel}>Aventura</span>
            </div>
            <div className={styles.categoryItem}>
              <button className={styles.categoryBtn}><span className={styles.categoryIcon}>💖</span></button>
              <span className={styles.categoryLabel}>Romance</span>
            </div>
            <div className={styles.categoryItem}>
              <button className={styles.categoryBtn}><span className={styles.categoryIcon}>🧙‍♂️</span></button>
              <span className={styles.categoryLabel}>Fantasía</span>
            </div>
          </div>
        </section>

        <section id="contact-membership" className={styles.contactSection}>
          <h2>Ponte en contacto</h2>
          <p>¡Únete a nosotros y recibe novedades exclusivas!</p>
          <form className={styles.subscribeForm}>
            <input type="email" placeholder="Ingresa tu Email" required />
            <button type="submit">Suscribirse</button>
          </form>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h2>e-Co Books</h2>
            <p><strong>Contact us</strong></p>
            <p>ecobooks@gmail.com</p>
            <p>+1-2345-6789</p>
            <p>456 Library Ave, New York, USA</p>
            <div className={styles.socialIcons}>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" /></a>
            </div>
          </div>
          <div className={styles.footerSection}>
            <p><strong>Products</strong></p>
            <p>Libros digitales</p>
            <p>Revistas académicas</p>
            <p>Audios narrados</p>
            <p>Libros interactivos</p>
            <p>Biblioteca en línea</p>
          </div>
          <div className={styles.footerSection}>
            <p><strong>About</strong></p>
            <p>Quiénes somos</p>
            <p>Política de privacidad</p>
            <p>Condiciones de uso</p>
            <p>Preguntas frecuentes</p>
            <p>Contáctanos</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.languageSelect}>🌐 English ▼</div>
          <p>Copyright © 2025. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}