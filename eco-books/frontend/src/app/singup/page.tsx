"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './singup.module.css';
import { getApiBase, jsonFetch } from "../lib/api";

type CreateUserResponse = {
  user_id: number;
  name: string;
  email: string;
  role?: string;
};

export default function SingUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    console.log('[singup] Iniciando registro...');

    if (!name || !email || !password || !confirm) {
      const msg = 'Por favor completa todos los campos';
      console.error('[singup]', msg);
      setError(msg);
      return;
    }
    if (password !== confirm) {
      const msg = 'Las contraseñas no coinciden';
      console.error('[singup]', msg);
      setError(msg);
      return;
    }

    try {
      setLoading(true);
      const API = getApiBase();
      const body = { name, email, password, role: "Customer" };

      console.log('[singup] Enviando request a /auth/register:', { name, email, role: body.role });

      const response = await jsonFetch<{ message: string; user: CreateUserResponse }>(
        `${API}/auth/register`, 
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      console.log('[singup] Usuario registrado exitosamente:', response);

      //When signup is successful: show message and redirect after a short delay
      setSuccess("Cuenta creada correctamente. Redirigiendo al login...");
      setTimeout(() => {
        console.log('[singup] Redirigiendo a /login');
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al crear usuario";
      console.error('[singup] Error al registrar usuario:', errorMsg, err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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
