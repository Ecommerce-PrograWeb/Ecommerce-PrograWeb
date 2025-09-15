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
            />
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link href="/home">Home</Link></li>
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
  )
}
