import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.bgImage}>
        <Image 
          src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=2000&auto=format&fit=crop" 
          alt="Tatuagem Fineline Delicada" 
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>
      
      <div className={`container ${styles.heroContent}`}>
        <span className={styles.subtitle}>Exclusividade & Personalização</span>
        <h1 className={styles.title}>
          Tatuagens Florais e Fineline Delicadas em Florianópolis
        </h1>
        <p className={styles.description}>
          Transformando sua história em arte minimalista, com conforto e profissionalismo no coração de Floripa.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="#portfolio" className="btn animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Ver Meus Trabalhos
          </Link>
          <a href="https://wa.me/5548998158191" target="_blank" rel="noopener noreferrer" className="btn btn-outline animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Solicitar Orçamento
          </a>
        </div>
      </div>
    </section>
  );
}
