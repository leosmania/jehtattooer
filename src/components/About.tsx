import Image from 'next/image';
import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import styles from './About.module.css';

export default async function About() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let settings: any = null;
  try {
    settings = await client.fetch(`*[_type == "siteSettings"][0]{ aboutPhoto, aboutTitle, aboutText1, aboutText2 }`);
  } catch {
    // silently fail
  }

  const photoSrc = settings?.aboutPhoto 
    ? urlForImage(settings.aboutPhoto).width(800).height(1000).url() 
    : 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop';
  
  const title = settings?.aboutTitle || 'Prazer, Jéssica Barboza';
  const text1 = settings?.aboutText1 || 'Sou apaixonada por traços finos e detalhes sutis. Minha missão como tatuadora é transformar suas ideias e memórias em uma arte corporal eterna, elegante e delicada.';
  const text2 = settings?.aboutText2 || 'Com especialização em fineline e florais autorais, ofereço um atendimento personalizado em meu estúdio no Centro de Florianópolis, garantindo que cada cliente se sinta confortável e tenha uma experiência única.';

  return (
    <section id="sobre" className={styles.about}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image 
              src={photoSrc} 
              alt="Jéssica Barboza trabalhando" 
              fill 
              className={styles.image}
            />
            <div className={styles.accentBox}></div>
          </div>
        </div>
        <div className={styles.textColumn}>
          <span className="section-subtitle">Sobre Mim</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.bio}>{text1}</p>
          <p className={styles.bio}>{text2}</p>
          <a href="#contato" className="btn-outline" style={{ marginTop: '2rem' }}>Vamos Conversar</a>
        </div>
      </div>
    </section>
  );
}
