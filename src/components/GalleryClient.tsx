'use client';

import { useState, useMemo } from 'react';
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

const ITEMS_PER_PAGE = 6;

export default function GalleryClient({ works }: { works: Work[] }) {
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('Todos');
    const [page, setPage] = useState(0);

    // Extract unique categories from actual data
    const categories = useMemo(() => {
        const cats = Array.from(new Set(works.map((w) => w.category).filter(Boolean)));
        return ['Todos', ...cats.sort()];
    }, [works]);

    const filteredWorks = useMemo(() => {
        if (activeFilter === 'Todos') return works;
        return works.filter((w) => w.category === activeFilter);
    }, [works, activeFilter]);

    const totalPages = Math.ceil(filteredWorks.length / ITEMS_PER_PAGE);
    const currentWorks = filteredWorks.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const handleFilterChange = (cat: string) => {
        setActiveFilter(cat);
        setPage(0); // Reset to first page on filter change
    };

    const goNext = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const goPrev = () => {
        if (page > 0) setPage(page - 1);
    };

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
                        disabled={page === 0}
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
                        disabled={page === totalPages - 1}
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
                            className={`${styles.dot} ${page === i ? styles.dotActive : ''}`}
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
