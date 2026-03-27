import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Process from '@/components/Process';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TattooParlor', 'Person'],
    name: 'JehTattooer - Jéssica Barboza',
    image: 'https://images.unsplash.com/photo-1574340321743-f66141cd1973?q=80&w=1000&auto=format&fit=crop',
    '@id': 'https://jehtattooer.com',
    url: 'https://jehtattooer.com',
    telephone: '+5548998158191',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calçadão João Pinto',
      addressLocality: 'Florianópolis',
      addressRegion: 'SC',
      postalCode: '88010-420',
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -27.5932971,
      longitude: -48.5539561
    },
    description: 'Especialista em tatuagens delicadas, florais autorais e fineline no centro de Florianópolis.',
    sameAs: [
      'https://instagram.com/jehtattooer'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Process />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
