'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
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

export default function AvailableArtClient({ works }: { works: ArtWork[] }) {
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

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

    return (
        <>
            <div className={styles.grid}>
                {works.map((work) => {
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
                })}
            </div>

            {lightbox && (
                <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
            )}
        </>
    );
}
