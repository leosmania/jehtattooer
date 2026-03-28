'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Testimonials.module.css';

interface TestimonialItem {
    _id: string;
    name?: string;
    text?: string;
    service?: string;
    imgSrc: string | null;
    isImageOnly: boolean;
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 576);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

export default function TestimonialsClient({ items }: { items: TestimonialItem[] }) {
    const [page, setPage] = useState(0);
    const isMobile = useIsMobile();

    const totalPages = isMobile ? items.length : 1;
    const displayItems = isMobile ? items.slice(page, page + 1) : items;
    const safePage = Math.min(page, Math.max(totalPages - 1, 0));

    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [page, safePage]);

    const renderCard = (item: TestimonialItem) => (
        <div key={item._id} className={`${styles.card} ${item.isImageOnly ? styles.imageOnly : ''}`}>
            {item.text && (
                <>
                    <Quote size={40} className={styles.quoteIcon} />
                    <p className={styles.text}>&quot;{item.text}&quot;</p>
                </>
            )}

            {item.imgSrc && (
                <div className={styles.testimonialImage}>
                    <Image
                        src={item.imgSrc}
                        alt={item.name ? `Depoimento de ${item.name}` : 'Depoimento em imagem'}
                        width={500}
                        height={400}
                        className={styles.testimonialImg}
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                </div>
            )}

            {(item.name || item.service) && (
                <div className={styles.authorGroup}>
                    {item.name && <span className={styles.name}>{item.name}</span>}
                    {item.service && <span className={styles.service}>{item.service}</span>}
                </div>
            )}
        </div>
    );

    return (
        <>
            {isMobile ? (
                <div className={styles.carouselWrapper}>
                    {totalPages > 1 && (
                        <button
                            className={`${styles.arrow} ${styles.arrowLeft}`}
                            onClick={() => setPage(Math.max(0, safePage - 1))}
                            disabled={safePage === 0}
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <div className={styles.grid}>
                        {displayItems.map(renderCard)}
                    </div>

                    {totalPages > 1 && (
                        <button
                            className={`${styles.arrow} ${styles.arrowRight}`}
                            onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
                            disabled={safePage === totalPages - 1}
                            aria-label="Próximo"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            ) : (
                <div className={styles.grid}>
                    {displayItems.map(renderCard)}
                </div>
            )}

            {isMobile && totalPages > 1 && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${safePage === i ? styles.dotActive : ''}`}
                            onClick={() => setPage(i)}
                            aria-label={`Página ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
