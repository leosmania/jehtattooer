import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  return (
    <section className={styles.about} id="sobre">
      <div className={`container ${styles.aboutGrid}`}>
        <div className={styles.imageWrapper}>
          <Image 
            src="https://images.unsplash.com/photo-1574340321743-f66141cd1973?q=80&w=1000&auto=format&fit=crop" 
            alt="Jéssica Barboza - JehTattooer trabalhando no estúdio" 
            width={500}
            height={600}
            className={styles.image}
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.accentCircle}></div>
        </div>
        
        <div className={styles.textContent}>
          <span className={styles.subtitle}>Sobre a Artista</span>
          <h2 className={styles.title}>Jéssica Barboza</h2>
          
          <div className={styles.prose}>
            <p>
              Olá! Sou a Jéssica, a artista por trás da JehTattooer. Há anos venho desenvolvendo minha paixão profunda pelos traços finos e pela arte delicada. Para mim, a tatuagem é mais do que tinta na pele — é a tradução visual da sua história, das suas paixões e da sua essência.
            </p>
            <p>
              Minha trajetória começou com a fascinação pelas formas naturais, o que me levou a especializar-me em tatuagens florais e botânicas autorais. Cada desenho que crio é único, pensado exclusivamente para se harmonizar com a anatomia e a personalidade de quem o veste.
            </p>
            <p>
              No meu estúdio, localizado no calçadão João Pinto em Florianópolis, proporciono um ambiente seguro, acolhedor e tranquilo. Meu objetivo é que sua experiência seja tão bonita e marcante quanto o resultado final da arte que levaremos para a sua pele.
            </p>
          </div>
          
          <div className={styles.signature}>
            <span>Tatuadora Especialista em Fineline & Botânica</span>
          </div>
        </div>
      </div>
    </section>
  );
}
