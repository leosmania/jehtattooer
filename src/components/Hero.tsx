import Image from 'next/image';
import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import styles from './Hero.module.css';

export default async function Hero() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let settings: any = null;
  try {
    settings = await client.fetch(`*[_type == "siteSettings"][0]{ heroImage }`);
  } catch {
    // silently fail
  }

  const bgSrc = settings?.heroImage
    ? urlForImage(settings.heroImage).width(1920).quality(80).url()
    : 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=1920&auto=format&fit=crop';

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.background}>
        <Image
          src={bgSrc}
          alt="Tatuagem delicada floral nas costas"
          fill
          priority
          className={styles.bgImage}
        />
      </div>
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Tatuagens Florais e Fineline Delicadas <br />em Florianópolis</h1>
        <p className={styles.subtitle}>Especialista em traduzir histórias em arte delicada. Atendimento exclusivo e trabalhos minimalistas desenhados sob medida para você.</p>
        <div className={styles.actions}>
          <a href="#portfolio" className="btn-primary">Ver Meus Trabalhos</a>
          <a href="#contato" className="btn-outline">Solicitar Orçamento</a>
        </div>
      </div>
    </section>
  );
}
