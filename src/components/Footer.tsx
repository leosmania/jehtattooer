import Image from 'next/image';
import Link from 'next/link';
import { default as CustomInstagramIcon } from './icons/Instagram';
import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import styles from './Footer.module.css';

export default async function Footer() {
  // Fetch site settings for logo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let settings: any = null;
  try {
    settings = await client.fetch(`*[_type == "siteSettings"][0]{ logo }`);
  } catch {
    // silently fail
  }
  const logoSrc = settings?.logo ? urlForImage(settings.logo).width(160).height(160).url() : '/logo.png';

  // Try to fetch the 4 most recent portfolio items from Sanity for the Instagram-style grid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recentWorks: { _id: string; title: string; image?: any }[] = [];
  try {
    recentWorks = await client.fetch(`*[_type == "portfolio"] | order(_createdAt desc)[0...4]{ _id, title, image }`);
  } catch {
    // silently fail
  }

  const fallbackImages = [
    'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623548906560-449e6f3dfdb6?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582255740417-6d2c4bdeec52?q=80&w=200&auto=format&fit=crop'
  ];

  // Build the image list: use Sanity images if available, else fallback
  const igImages = recentWorks.length > 0
    ? recentWorks.map(w => ({
        src: w.image ? urlForImage(w.image).width(200).height(200).url() : fallbackImages[0],
        alt: w.title || 'Instagram post'
      }))
    : fallbackImages.map(src => ({ src, alt: 'Instagram post' }));

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image src={logoSrc} alt="JehTattooer Logo" width={80} height={80} className={styles.logo} />
          <h3 className={styles.brandName}>Jéssica Barboza</h3>
          <p className={styles.brandDesc}>
            Arte na pele. Tatuagens florais e fineline delicadas desenvolvidas com exclusividade em Florianópolis.
          </p>
        </div>

        <div className={styles.links}>
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link href="#sobre">A Artista</Link></li>
            <li><Link href="#servicos">Estilos</Link></li>
            <li><Link href="#portfolio">Portfólio</Link></li>
            <li><Link href="#processo">Como Funciona</Link></li>
          </ul>
        </div>

        <div className={styles.instagram}>
          <h4>Siga no Instagram</h4>
          <a href="https://instagram.com/jehtattooer" target="_blank" rel="noopener noreferrer" className={styles.igHandle}>
            <CustomInstagramIcon size={18} /> @jehtattooer
          </a>
          <div className={styles.igGrid}>
            {igImages.map((img, i) => (
              <a key={i} href="https://instagram.com/jehtattooer" target="_blank" rel="noopener noreferrer" className={styles.igItem}>
                <Image src={img.src} alt={img.alt} fill className={styles.igImage} sizes="100px" />
                <div className={styles.igOverlay}><CustomInstagramIcon size={20} /></div>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.copy}>
        <p>&copy; {new Date().getFullYear()} Jéssica Barboza - JehTattooer. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
