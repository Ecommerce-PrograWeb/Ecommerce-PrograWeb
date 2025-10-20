import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <Link href="/home">
            <Image
              src="/Images/logo-eco-books.jpg"
              alt="EcoBooks Logo"
              width={50}
              height={50}
              className="logo-image"
              priority
            />
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link href="/home">Home</Link></li>
          <li><Link href="/search">Discover</Link></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="nav-icons">
          <Link href="/login" aria-label="User" className="icon-user">
            <span className="symbols">person</span>
          </Link>

          <Link href="/cart" aria-label="Cart" className="icon-cart">
            <span className="symbols">shopping_cart</span>
          </Link>

          <Link href="/history" aria-label="Historial de compras" className="icon-bag">
            <Image
              src="/Images/historialIMG/historial-de-compras.png"
              alt="Historial de compras"
              width={24}
              height={24}
              priority
            />
          </Link>

          <button className="icon-menu" aria-label="Menu">
            <span className="symbols">menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
