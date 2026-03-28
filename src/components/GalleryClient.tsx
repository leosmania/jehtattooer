'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';
import styles from './Gallery.module.css';

interface Work {
    _id: string;
    title: string;
    category: string;
    imageUrl: string;
}

export default function GalleryClient({ works }: { works: Work[] }) {
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('Todos');

    // Extract unique categories from actual data
    const categories = useMemo(() => {
        const cats = Array.from(new Set(works.map((w) => w.category).filter(Boolean)));
        return ['Todos', ...cats.sort()];
    }, [works]);

    const filteredWorks = useMemo(() => {
        if (activeFilter === 'Todos') return works;
        return works.filter((w) => w.category === activeFilter);
    }, [works, activeFilter]);

    return (
        <>
            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterActive : ''}`}
                        onClick={() => setActiveFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {filteredWorks.map((work) => (
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

            {lightbox && (
                <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
            )}
        </>
    );
}
