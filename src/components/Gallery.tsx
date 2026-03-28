import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import GalleryClient from './GalleryClient';
import styles from './Gallery.module.css';

// Remove Next.js default caching to ensure fresh data over time for Demo
export const revalidate = 60;

export default async function Gallery() {
  const query = `*[_type == "portfolio"] | order(_createdAt desc)`;
  let rawWorks: { _id: string; title: string; category: string; image?: any; demoUrl?: string }[] = [];

  try {
    rawWorks = await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch failed:", error);
  }

  // Fallback demo data
  if (!rawWorks || rawWorks.length === 0) {
    rawWorks = [
      { _id: '1', title: 'Borboleta e Flores', category: 'Fineline', image: null, demoUrl: 'https://images.unsplash.com/photo-1611082570075-814ae39665bc?q=80&w=600&auto=format&fit=crop' },
      { _id: '2', title: 'Ramo Delicado', category: 'Floral', image: null, demoUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=600&auto=format&fit=crop' },
      { _id: '3', title: 'Minimalista', category: 'Botanica', image: null, demoUrl: 'https://images.unsplash.com/photo-1582255740417-6d2c4bdeec52?q=80&w=600&auto=format&fit=crop' }
    ];
  }

  // Resolve image URLs on the server so we can pass plain strings to the client component
  const works = rawWorks.map((work) => ({
    _id: work._id,
    title: work.title,
    category: work.category,
    imageUrl: work.image ? urlForImage(work.image).url() : (work.demoUrl || ''),
  }));

  return (
    <section id="portfolio" className={styles.gallerySection}>
      <div className="container">
        <span className="section-subtitle">Meu Trabalho</span>
        <h2 className="section-title">Portfólio</h2>

        <GalleryClient works={works} />
      </div>
    </section>
  );
}
