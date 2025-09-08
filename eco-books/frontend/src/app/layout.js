// app/layout.js
import './globals.css'
import { PT_Sans_Caption } from 'next/font/google'

const ptSans = PT_Sans_Caption({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  title: 'Home',
  description: 'Tu librería online favorita',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Google Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={ptSans.className}>{children}</body>
    </html>
  )
}
