"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './singup.module.css';

export default function SingUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirm) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      setError('Por favor ingresa un correo válido');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    //When signup is successful: show message and redirect after a short delay
    setSuccess('Cuenta creada correctamente. Ahora puedes iniciar sesión. Redirigiendo...');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <div className={styles.overlay} aria-hidden />
        <section className={styles.card}>
          <h1 className={styles.title}>Crear Cuenta</h1>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.label} htmlFor="name">Nombre completo</label>
            <input id="name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />

            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />

            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input id="password" type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />

            <label className={styles.label} htmlFor="confirm">Confirmar contraseña</label>
            <input id="confirm" type="password" className={styles.input} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="********" />

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <div className={styles.actions}>
              <button type="submit" className={styles.primary}>Crear cuenta</button>
              <button type="button" className={styles.ghost} onClick={() => router.push('/login')}>Volver a iniciar sesión</button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
