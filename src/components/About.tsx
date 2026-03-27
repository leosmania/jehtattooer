import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="sobre" className={styles.about}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image 
              src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop" 
              alt="Jéssica Barboza trabalhando" 
              fill 
              className={styles.image}
            />
            <div className={styles.accentBox}></div>
          </div>
        </div>
        <div className={styles.textColumn}>
          <span className="section-subtitle">Sobre Mim</span>
          <h2 className={styles.title}>Prazer, Jéssica Barboza</h2>
          <p className={styles.bio}>
            Sou apaixonada por traços finos e detalhes sutis. Minha missão como tatuadora é transformar suas ideias e memórias em uma arte corporal eterna, elegante e delicada.
          </p>
          <p className={styles.bio}>
            Com especialização em fineline e florais autorais, ofereço um atendimento personalizado em meu estúdio no Centro de Florianópolis, garantindo que cada cliente se sinta confortável e tenha uma experiência única.
          </p>
          <a href="#contato" className="btn-outline" style={{ marginTop: '2rem' }}>Vamos Conversar</a>
        </div>
      </div>
    </section>
  );
}
