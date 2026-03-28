'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Lightbox from './Lightbox';
import styles from './Gallery.module.css';

interface Work {
    _id: string;
    title: string;
    category: string;
    imageUrl: string;
}

function useItemsPerPage() {
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        function calculate() {
            const w = window.innerWidth;
            if (w <= 576) return 1;
            if (w <= 992) return 4;
            return 6;
        }
        setItemsPerPage(calculate());

        const handleResize = () => setItemsPerPage(calculate());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return itemsPerPage;
}

export default function GalleryClient({ works }: { works: Work[] }) {
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('Todos');
    const [page, setPage] = useState(0);
    const itemsPerPage = useItemsPerPage();

    // Extract unique categories from actual data
    const categories = useMemo(() => {
        const cats = Array.from(new Set(works.map((w) => w.category).filter(Boolean)));
        return ['Todos', ...cats.sort()];
    }, [works]);

    const filteredWorks = useMemo(() => {
        if (activeFilter === 'Todos') return works;
        return works.filter((w) => w.category === activeFilter);
    }, [works, activeFilter]);

    const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);

    // Clamp page when itemsPerPage or filter changes
    const safePage = Math.min(page, Math.max(totalPages - 1, 0));
    const currentWorks = filteredWorks.slice(safePage * itemsPerPage, (safePage + 1) * itemsPerPage);

    const handleFilterChange = (cat: string) => {
        setActiveFilter(cat);
        setPage(0);
    };

    const goNext = () => {
        if (safePage < totalPages - 1) setPage(safePage + 1);
    };

    const goPrev = () => {
        if (safePage > 0) setPage(safePage - 1);
    };

    // Sync page if it went out of bounds
    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [page, safePage]);

    return (
        <>
            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterActive : ''}`}
                        onClick={() => handleFilterChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.carouselWrapper}>
                {totalPages > 1 && (
                    <button
                        className={`${styles.arrow} ${styles.arrowLeft}`}
                        onClick={goPrev}
                        disabled={safePage === 0}
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={28} />
                    </button>
                )}

                <div className={styles.grid}>
                    {currentWorks.map((work) => (
                        <div
                            key={work._id}
                            className={styles.item}
                            onClick={() => setLightbox({ src: work.imageUrl, alt: work.title })}
                        >
                            <Image
                                src={work.imageUrl}
                                alt={work.title}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className={styles.overlay}>
                                <h3>{work.title}</h3>
                                <span>{work.category}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <button
                        className={`${styles.arrow} ${styles.arrowRight}`}
                        onClick={goNext}
                        disabled={safePage === totalPages - 1}
                        aria-label="Próximo"
                    >
                        <ChevronRight size={28} />
                    </button>
                )}
            </div>

            {totalPages > 1 && (
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

            {lightbox && (
                <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
            )}
        </>
    );
}
