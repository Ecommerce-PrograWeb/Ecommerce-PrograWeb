"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple frontend validation only (this page is UI-only)
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña');
      return;
    }
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    // For now just navigate to home to simulate successful login
    router.push('/');
  };

  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <div className={styles.overlay} aria-hidden />
        <section className={styles.card}>
          <h1 className={styles.title}>Iniciar Sesión</h1>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />

            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="submit" className={styles.primary}>Ingresar</button>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => router.push('/singup')}
              >
                Crear cuenta
              </button>
            </div>
          </form>

          <div className={styles.meta}>
            <p>¿Olvidaste tu contraseña? <button className={styles.link}>Recuperar</button></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
