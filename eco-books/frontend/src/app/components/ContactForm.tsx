'use client'

import styles from '../home/Home.module.css'

export default function ContactForm() {
  return (
    <form className={styles['subscribe-form']} onSubmit={e => e.preventDefault()}>
      <input type="email" placeholder="Ingresa tu Email" required />
      <button type="submit">Suscribirse</button>
    </form>
  );
}