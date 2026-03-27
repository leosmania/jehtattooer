import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logo.png" alt="JehTattooer Logo" width={60} height={60} className={styles.logo} />
        </Link>
        <nav className={styles.nav}>
          <Link href="#sobre">Sobre</Link>
          <Link href="#servicos">Serviços</Link>
          <Link href="#portfolio">Portfólio</Link>
          <Link href="#depoimentos">Depoimentos</Link>
          <Link href="#contato" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Agendar</Link>
        </nav>
      </div>
    </header>
  );
}
