'use client';

import { useState } from 'react';
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

    return (
        <>
            <div className={styles.grid}>
                {works.map((work) => (
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
