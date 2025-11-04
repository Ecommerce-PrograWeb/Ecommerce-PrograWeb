"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getApiBase } from "../lib/api";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Verificar si el usuario está logueado
    const userId = localStorage.getItem("user_id");
    const name = localStorage.getItem("user_name");
    
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name || "Usuario");
    }
  }, []);

  const handleLogout = async () => {
    try {
      console.log('[Header] Cerrando sesión...');
      
      const API = getApiBase();
      
      // Llamar al endpoint de logout para limpiar la cookie
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Limpiar localStorage
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_role");

      console.log('[Header] Sesión cerrada, redirigiendo a login...');
      
      setIsLoggedIn(false);
      setUserName("");
      
      router.push("/login");
    } catch (error) {
      console.error('[Header] Error al cerrar sesión:', error);
      // Aún así limpiar y redirigir
      localStorage.clear();
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

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
          {isLoggedIn ? (
            <>
              <span className="user-name" title={`Sesión: ${userName}`}>
                {userName}
              </span>
              <button 
                onClick={handleLogout} 
                aria-label="Cerrar sesión" 
                className="icon-logout"
                title="Cerrar sesión"
              >
                <span className="symbols">logout</span>
              </button>
            </>
          ) : (
            <Link href="/login" aria-label="User" className="icon-user">
              <span className="symbols">person</span>
            </Link>
          )}

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

      <style jsx>{`
        .user-name {
          color: #333;
          font-size: 14px;
          margin-right: 10px;
          font-weight: 500;
        }
        
        .icon-logout {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .icon-logout:hover {
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        
        .icon-logout .symbols {
          font-size: 24px;
          color: #333;
        }
      `}</style>
    </header>
  );
}
