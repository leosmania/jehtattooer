import Image from 'next/image';
import { client } from '../sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import styles from './Gallery.module.css';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 60; // Revalidate every minute

export default async function Gallery() {
  const query = `*[_type == "portfolio"] | order(_createdAt desc) [0...9] {
    _id,
    title,
    category,
    image,
    description
  }`;

  let works = [];
  try {
    works = await client.fetch(query);
  } catch (error) {
    console.error("Failed to fetch sanity portfolio", error);
    // Provide some fallback empty state or mock data if demo environment
  }

  // Fallback data if no Sanity data is present
  if (!works || works.length === 0) {
    works = [
      { _id: '1', title: 'Ramo de Flores', category: 'floral', image: { url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=600&auto=format&fit=crop'} },
      { _id: '2', title: 'Borboleta Fineline', category: 'fineline', image: { url: 'https://images.unsplash.com/photo-1623548906560-449e6f3dfdb6?q=80&w=600&auto=format&fit=crop' } },
      { _id: '3', title: 'Peônia Delicada', category: 'floral', image: { url: 'https://images.unsplash.com/photo-1582255740417-6d2c4bdeec52?q=80&w=600&auto=format&fit=crop' } },
      { _id: '4', title: 'Constelação', category: 'fineline', image: { url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=600&auto=format&fit=crop' } },
      { _id: '5', title: 'Ramo de Oliveira', category: 'delicada', image: { url: 'https://images.unsplash.com/photo-1611082570075-814ae39665bc?q=80&w=600&auto=format&fit=crop' } },
      { _id: '6', title: 'Lua e Sol', category: 'fineline', image: { url: 'https://images.unsplash.com/photo-1594247065910-c1eb4fc10899?q=80&w=600&auto=format&fit=crop' } }
    ];
  }

  return (
    <section className={styles.gallerySection} id="portfolio">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.subtitle}>Meu Trabalho</span>
          <h2 className={styles.title}>Portfólio em Destaque</h2>
          <p className={styles.description}>
            Uma seleção de tatuagens delicadas, florais e finelines, desenhadas especialmente para cada cliente.
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {works.map((work: any) => {
            const imgSrc = work.image?.url ? work.image.url : urlFor(work.image).width(600).height(600).url();
            return (
              <div key={work._id} className={styles.item}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={imgSrc} 
                    alt={work.title} 
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className={styles.overlay}>
                    <h3 className={styles.itemTitle}>{work.title}</h3>
                    <span className={styles.itemCategory}>{work.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actionArea}>
          <a href="https://instagram.com/jehtattooer" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Ver Mais no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
