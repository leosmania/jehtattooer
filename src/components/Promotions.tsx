import { client } from '@/sanity/client';
import { urlForImage } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Promotions.module.css';

interface Promotion {
  _id: string;
  title: string;
  description?: string;
  discount?: string;
  image?: {
    asset: {
      _id: string;
    };
  };
  link?: string;
  active: boolean;
}

async function getPromotions() {
  try {
    const data = await client.fetch(
      `*[_type == "promotion" && active == true] | order(_createdAt desc) {
        _id,
        title,
        description,
        discount,
        image,
        link,
        active
      }`
    );
    return data || [];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

export default async function Promotions() {
  const promotions = await getPromotions();

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section id="promocoes-ofertas" className={styles.promotionsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Promoções e Ofertas Especiais</h2>
        <p className={styles.subtitle}>Confira nossas promoções exclusivas</p>

        <div className={styles.grid}>
          {promotions.map((promo: Promotion) => {
            const imageUrl = promo.image
              ? urlForImage(promo.image).width(400).height(400).url()
              : '/logo.png';

            return (
              <div key={promo._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={imageUrl}
                    alt={promo.title}
                    width={400}
                    height={400}
                    className={styles.image}
                  />
                  {promo.discount && (
                    <div className={styles.badge}>{promo.discount}</div>
                  )}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{promo.title}</h3>
                  {promo.description && (
                    <p className={styles.description}>{promo.description}</p>
                  )}
                  {promo.link ? (
                    <a href={promo.link} target="_blank" rel="noopener noreferrer" className={styles.button}>
                      Saiba Mais
                    </a>
                  ) : (
                    <Link href="#contato" className={styles.button}>
                      Agendar
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
