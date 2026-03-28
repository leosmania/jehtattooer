'use client';

import { useEffect, useCallback } from 'react';
import styles from './Lightbox.module.css';

interface LightboxProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
                ✕
            </button>
            <div className={styles.imageWrapper} onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className={styles.image} />
            </div>
        </div>
    );
}
