'use client'

export default function ExploreButton() {
  return (
    <button
      className="cta-button"
      onClick={() =>
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
      }
    >
      Explorar Productos
    </button>
  )
}