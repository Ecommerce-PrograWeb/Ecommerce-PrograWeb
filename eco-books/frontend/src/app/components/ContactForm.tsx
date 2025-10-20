'use client'

import styles from '../Home.module.css'

export default function ContactForm() {
  return (
    <form className={styles['subscribe-form']} onSubmit={e => e.preventDefault()}>
      <input type="email" placeholder="Ingresa tu Email" required />
      <button type="submit">Suscribirse</button>
    </form>
  );
}