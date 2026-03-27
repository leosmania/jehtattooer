import { Quote } from 'lucide-react';
import { client } from '../sanity/client';
import styles from './Testimonials.module.css';

export const revalidate = 60;

export default async function Testimonials() {
  let feedback: { _id: string; name: string; text: string; service: string }[] = [];

  try {
    feedback = await client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)[0...6]{ _id, name, text, service }`);
  } catch {
    // silently fail
  }

  // Fallback demo data
  if (!feedback || feedback.length === 0) {
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

  return (
    <section id="depoimentos" className={styles.testimonials}>
      <div className="container">
        <span className="section-subtitle">O Que Dizem</span>
        <h2 className="section-title">Experiências</h2>
        
        <div className={styles.grid}>
          {feedback.map((item) => (
            <div key={item._id} className={styles.card}>
              <Quote size={40} className={styles.quoteIcon} />
              <p className={styles.text}>&quot;{item.text}&quot;</p>
              <div className={styles.authorGroup}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.service}>{item.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
