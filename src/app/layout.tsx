import type { Metadata } from 'next';
import { Raleway, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'JehTattooer | Tatuagens Florais e Fineline Delicadas em Florianópolis',
  description: 'Especialista em tatuagens delicadas, fineline e florais no Centro de Florianópolis, SC. Agende seu horário com Jéssica Barboza.',
  keywords: ['Tatuagem floral Florianópolis', 'Fineline tattoo Florianópolis', 'Tatuadora delicada Florianópolis', 'JehTattooer Florianópolis', 'Tatuagem feminina Florianópolis'],
  openGraph: {
    title: 'JehTattooer | Arte Delicada na Pele',
    description: 'Tatuagens exclusivas e delicadas no Calçadão João Pinto, Florianópolis.',
    url: 'https://jehtattooer.com',
    siteName: 'JehTattooer',
    images: [{ url: '/logo.png', width: 800, height: 600, alt: 'JehTattooer Logo' }],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TattooParlor', 'Person'],
    name: 'JehTattooer - Jéssica Barboza',
    image: 'https://jehtattooer.com/logo.png',
    '@id': 'https://jehtattooer.com',
    url: 'https://jehtattooer.com',
    telephone: '+5548998158191',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calçadão João Pinto - Centro',
      addressLocality: 'Florianópolis',
      addressRegion: 'SC',
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -27.5932971,
      longitude: -48.5539561
    },
    description: 'Especialista em tatuagens delicadas, florais autorais e fineline no centro de Florianópolis.',
    sameAs: ['https://instagram.com/jehtattooer']
  };

  return (
    <html lang="pt-BR">
      <body className={`${raleway.variable} ${cormorant.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
