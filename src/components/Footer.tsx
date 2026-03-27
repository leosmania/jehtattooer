import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contato">
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brandSection}>
          <div className={styles.logoWrapper}>
            <Image src="/logo.png" alt="JehTattooer Logo" width={60} height={60} className={styles.logo} />
            <h3 className={styles.brandTitle}>Jéssica Barboza<br/><span>JehTattooer</span></h3>
          </div>
          <p className={styles.brandDescription}>
            Especialista em tatuagens delicadas, florais autorais e fineline, transformando sua história em arte minimalista e atemporal.
          </p>
        </div>

        <div className={styles.contactSection}>
          <h4 className={styles.sectionTitle}>Contato & Local</h4>
          <ul className={styles.contactList}>
            <li>
              <MapPin size={18} className={styles.icon} />
              <span>Calçadão João Pinto - Centro<br/>Florianópolis, SC</span>
            </li>
            <li>
              <Phone size={18} className={styles.icon} />
              <a href="https://wa.me/5548998158191" target="_blank" rel="noopener noreferrer">
                (48) 99815-8191
              </a>
            </li>
            <li>
              <Instagram size={18} className={styles.icon} />
              <a href="https://instagram.com/jehtattooer" target="_blank" rel="noopener noreferrer">
                @jehtattooer
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <h4 className={styles.sectionTitle}>Links Rápidos</h4>
          <ul className={styles.linksList}>
            <li><Link href="#sobre">Sobre Mim</Link></li>
            <li><Link href="#servicos">Serviços</Link></li>
            <li><Link href="#portfolio">Portfólio</Link></li>
            <li><Link href="#depoimentos">Depoimentos</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Jéssica Barboza - JehTattooer. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
