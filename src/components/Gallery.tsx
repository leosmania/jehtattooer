import Image from 'next/image';
import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import styles from './Gallery.module.css';

// Remove Next.js default caching to ensure fresh data over time for Demo
export const revalidate = 60; 

export default async function Gallery() {
  const query = `*[_type == "portfolio"] | order(_createdAt desc)[0...20]`;
  let works = [];
  
  try {
    works = await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch failed:", error);
  }

  // Fallback demo data
  if (!works || works.length === 0) {
    works = [
      { _id: '1', title: 'Borboleta e Flores', category: 'Fineline', image: null, demoUrl: 'https://images.unsplash.com/photo-1611082570075-814ae39665bc?q=80&w=600&auto=format&fit=crop' },
      { _id: '2', title: 'Ramo Delicado', category: 'Floral', image: null, demoUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=600&auto=format&fit=crop' },
      { _id: '3', title: 'Minimalista', category: 'Delicada', image: null, demoUrl: 'https://images.unsplash.com/photo-1582255740417-6d2c4bdeec52?q=80&w=600&auto=format&fit=crop' }
    ];
  }

  return (
    <section id="portfolio" className={styles.gallerySection}>
      <div className="container">
        <span className="section-subtitle">Meu Trabalho</span>
        <h2 className="section-title">Portfólio</h2>
        
        <div className={styles.grid}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {works.map((work: { _id: string; title: string; category: string; image?: any; demoUrl?: string }) => {
            const imgSrc = work.image ? urlForImage(work.image).url() : (work.demoUrl || '');
            return (
              <div key={work._id} className={styles.item}>
                <Image 
                  src={imgSrc} 
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
