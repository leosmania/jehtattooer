import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlForImage } from '@/sanity/lib/image';
import RoletaClient from './RoletaClient';
import styles from './Roleta.module.css';

export const metadata: Metadata = {
  title: 'Roleta da Sorte | JehTattooer',
  description: 'Gire a roleta e ganhe um presente exclusivo para a sua próxima tatuagem com a Jeh!',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RoletaPage() {
  let settings: any = null;
  try {
    settings = await client.fetch(`*[_type == "siteSettings"][0]{ logo }`);
  } catch {}

  const logoSrc = settings?.logo ? urlForImage(settings.logo).width(160).height(160).url() : '/logo.png';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src={logoSrc} alt="JehTattooer Logo" width={80} height={80} className={styles.logo} />
        </Link>
      </header>
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <h1 className={styles.title}>Gire a Roleta e Ganhe um Presente Exclusivo!</h1>
            <p className={styles.subtitle}>
              Insira seus dados abaixo para tentar a sorte. Todos os prêmios são válidos para sua próxima tatuagem com a Jeh.
            </p>
          </div>
          <RoletaClient />
        </div>
      </main>
    </div>
  );
}
