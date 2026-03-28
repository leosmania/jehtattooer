'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Lightbox from './Lightbox';
import styles from './AvailableArt.module.css';

interface ArtWork {
    _id: string;
    title: string;
    imageUrl: string;
    description?: string;
    size?: string;
    category?: string;
    status: string;
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

export default function AvailableArtClient({ works }: { works: ArtWork[] }) {
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('Todos');
    const [page, setPage] = useState(0);
    const isMobile = useIsMobile();

    const categories = useMemo(() => {
        const cats = Array.from(new Set(works.map((w) => w.category).filter((c): c is string => !!c)));
        return ['Todos', ...cats.sort()];
    }, [works]);

    const filteredWorks = useMemo(() => {
        if (activeFilter === 'Todos') return works;
        return works.filter((w) => w.category === activeFilter);
    }, [works, activeFilter]);

    const handleFilterChange = (cat: string) => {
        setActiveFilter(cat);
        setPage(0);
    };

    // On mobile: 1 per page. On desktop: show all
    const totalPages = isMobile ? filteredWorks.length : 1;
    const displayWorks = isMobile ? filteredWorks.slice(page, page + 1) : filteredWorks;
    const safePage = Math.min(page, Math.max(totalPages - 1, 0));

    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [page, safePage]);

    if (works.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Em breve novas artes disponíveis! Fique de olho 🌸</p>
                <a
                    href="https://wa.me/5548998158191?text=Oi%20Jéssica!%20Quero%20saber%20sobre%20artes%20disponíveis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.ctaButton} ${styles.ctaAvailable}`}
                >
                    <MessageCircle size={18} />
                    Fale comigo para criar a sua
                </a>
            </div>
        );
    }

    const renderCard = (work: ArtWork) => {
        const isAvailable = work.status === 'disponivel';
        const whatsappMsg = encodeURIComponent(
            `Oi Jéssica! Tenho interesse na arte "${work.title}". Ela ainda está disponível?`
        );

        return (
            <div key={work._id} className={styles.card}>
                <div
                    className={styles.imageWrapper}
                    onClick={() => setLightbox({ src: work.imageUrl, alt: work.title })}
                >
                    <Image
                        src={work.imageUrl}
                        alt={work.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <span className={`${styles.badge} ${isAvailable ? styles.available : styles.reserved}`}>
                        {isAvailable ? 'Disponível' : 'Reservada'}
                    </span>
                </div>

                <div className={styles.info}>
                    <h3 className={styles.title}>{work.title}</h3>
                    <div className={styles.meta}>
                        {work.category && <span className={styles.category}>{work.category}</span>}
                        {work.size && <span className={styles.size}>~{work.size}</span>}
                    </div>

                    {work.description && (
                        <p className={styles.description}>{work.description}</p>
                    )}

                    {isAvailable ? (
                        <a
                            href={`https://wa.me/5548998158191?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.ctaButton} ${styles.ctaAvailable}`}
                        >
                            <MessageCircle size={18} />
                            Quero essa!
                        </a>
                    ) : (
                        <span className={`${styles.ctaButton} ${styles.ctaReserved}`}>
                            Reservada
                        </span>
                    )}
                </div>
            </div>
        );
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
                        {displayWorks.map(renderCard)}
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
                    {displayWorks.map(renderCard)}
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

            {lightbox && (
                <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
            )}
        </>
    );
}
