import Image from 'next/image';
import Link from 'next/link';
import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import styles from './Header.module.css';

export default async function Header() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let settings: any = null;
  try {
    settings = await client.fetch(`*[_type == "siteSettings"][0]{ logo }`);
  } catch {
    // silently fail
  }

  const logoSrc = settings?.logo ? urlForImage(settings.logo).width(120).height(120).url() : '/logo.png';

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link href="/" className={styles.logoLink}>
          <Image src={logoSrc} alt="JehTattooer Logo" width={60} height={60} className={styles.logo} />
        </Link>
        <nav className={styles.nav}>
          <Link href="#sobre">Sobre</Link>
          <Link href="#servicos">Serviços</Link>
          <Link href="#portfolio">Portfólio</Link>
          <Link href="/blog">Blog</Link>
          <Link href="#promocoes" className={`${styles.btnRoleta} ${styles.promoBtn}`}>🎁 Promoções</Link>
          <Link href="#artes-disponiveis">Artes Disponíveis</Link>
          <Link href="#depoimentos">Depoimentos</Link>
          <Link href="#contato" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Agendar</Link>
        </nav>
      </div>
    </header>
  );
}
