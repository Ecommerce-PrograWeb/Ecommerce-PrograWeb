export default function Footer() {
  return (
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
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <div className="language-select">🌐 English ▼</div>
          <p>Copyright © 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
