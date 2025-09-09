import Header from '../components/Header'
import Footer from '../components/Footer'
import Image from 'next/image'
import styles from './productview.module.css'

export default function ProductViewPage() {
    const product = {
        title: 'Onyx Storm',
        author: 'Rebecca Yarros',
        priceQ: 199.99,
        cover: '/Images/Book Covers/Onyx Storm.jpg',
        category: 'Fantasía',
        rating: 4.8,
        reviews: 1873,
        desc:
            'Tercera entrega del universo Empyrean: magia, alianzas y un peligro inminente que pondrá a prueba a sus protagonistas.'
    }

    return (
        <>
            <Header />

            <main className={styles.wrapper}>
                <section className={styles.card}>
                    {/* Imagen */}
                    <div className={styles.media}>
                        <button className={styles.fav} aria-label="Agregar a favoritos">♡</button>
                        <div className={styles.imgBox}>
                            <Image
                                src={product.cover}
                                alt={product.title}
                                fill
                                sizes="(max-width: 900px) 90vw, 50vw"
                                priority
                            />
                            <div className={styles.imgPlaceholder} aria-hidden />
                        </div>
                    </div>

                    {/* Info */}
                    <div className={styles.info}>
                        <h1 className={styles.title}>{product.title}</h1>
                        <p className={styles.author}>por {product.author}</p>
                        <p className={styles.price}>Q{product.priceQ.toFixed(2)}</p>
                        <p className={styles.desc}>{product.desc}</p>

                        <div className={styles.meta}>
                            <span className={styles.metaItem}>★ <b>{product.rating}</b> ({product.reviews.toLocaleString()})</span>
                            <span className={styles.dot} />
                            <span className={styles.metaItem}>📚 {product.category}</span>
                        </div>

                        <div className={styles.qtyRow} aria-label="Cantidad">
                            <button className={styles.qtyBtn} aria-label="Disminuir">−</button>
                            <span className={styles.qty}>1</span>
                            <button className={styles.qtyBtn} aria-label="Aumentar">+</button>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.primary}>Order Now</button>
                            <button className={styles.ghost}>Add to Cart</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}
