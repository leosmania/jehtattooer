import { client } from '../sanity/client';
import { urlForImage } from '../sanity/lib/image';
import TestimonialsClient from './TestimonialsClient';
import styles from './Testimonials.module.css';

export const revalidate = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Testimonial {
  _id: string;
  name?: string;
  text?: string;
  service?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
}

export default async function Testimonials() {
  let feedback: Testimonial[] = [];

  try {
    const result = await client.fetch<Testimonial[]>(
      `*[_type == "testimonial"] | order(_createdAt desc)[0...6]{ _id, name, text, service, image }`
    );
    if (result && result.length > 0) {
      feedback = result;
    }
  } catch (error) {
    console.error("Sanity testimonial fetch failed:", error);
  }

  // Fallback demo data
  if (feedback.length === 0) {
    feedback = [
      {
        _id: '1',
        name: 'Mariana S.',
        text: 'A Jéssica foi incrível! O traço dela é o mais fino e delicado que já vi. Fiz uma homenagem pra minha mãe e ficou melhor do que eu sonhava.',
        service: 'Tatuagem Floral Autoral'
      },
      {
        _id: '2',
        name: 'Camila T.',
        text: 'Ambiente super acolhedor e profissional. Eu tinha muito medo de dor, mas a mão dela é super leve. O fineline ficou perfeito, nem precisou de retoque.',
        service: 'Micro-tatuagem Fineline'
      },
      {
        _id: '3',
        name: 'Letícia B.',
        text: 'Deixei a criação por conta dela e foi a melhor escolha. A Jéssica conseguiu traduzir exatamente o que eu queria numa arte única e exclusiva.',
        service: 'Tatuagem Delicada Personalizada'
      }
    ];
  }

  // Pre-process image URLs on the server
  const items = feedback.map((item) => {
    let imgSrc: string | null = null;
    try {
      if (item.image) {
        imgSrc = urlForImage(item.image).url();
      }
    } catch {
      console.error(`Failed to resolve image for testimonial ${item._id}`);
    }

    const hasText = !!item.text;
    const hasImage = !!imgSrc;

    return {
      _id: item._id,
      name: item.name,
      text: item.text,
      service: item.service,
      imgSrc,
      isImageOnly: !hasText && hasImage,
    };
  });

  return (
    <section id="depoimentos" className={styles.testimonials}>
      <div className="container">
        <span className="section-subtitle">O Que Dizem</span>
        <h2 className="section-title">Experiências</h2>

        <TestimonialsClient items={items} />
      </div>
    </section>
  );
}
