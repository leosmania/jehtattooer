import { Star } from 'lucide-react';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: 'Amanda Oliveira',
      text: 'O trabalho da Jéssica é impecável! Ela fez um ramo de flores no meu braço, o traço é o mais fino e delicado que já vi. O ambiente do estúdio em Floripa é super aconchegante e me senti muito confortável o tempo todo.',
      role: 'Primeira Tatuagem'
    },
    {
      id: 2,
      name: 'Carolina Mendes',
      text: 'Queria fazer uma homenagem para minha mãe e a arte que ela criou superou todas as expectativas. O processo de criação foi muito cuidadoso, ela escutou tudo que eu queria e eternizou com uma perfeição incrível.',
      role: 'Tatuagem Delicada'
    },
    {
      id: 3,
      name: 'Fernanda Costa',
      text: 'Já fiz três tatuagens fineline com a Jeh e o resultado é sempre maravilhoso. A cicatrização é ótima, o traço continua fininho e elegante. Recomendo de olhos fechados pra quem busca arte sofisticada.',
      role: 'Fineline'
    }
  ];

  return (
    <section className={styles.testimonials} id="depoimentos">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.subtitle}>Experiências Reais</span>
          <h2 className={styles.title}>O que minhas clientes dizem</h2>
        </div>

        <div className={styles.grid}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.card}>
              <div className={styles.stars}>
                <Star className={styles.star} size={18} fill="currentColor" />
                <Star className={styles.star} size={18} fill="currentColor" />
                <Star className={styles.star} size={18} fill="currentColor" />
                <Star className={styles.star} size={18} fill="currentColor" />
                <Star className={styles.star} size={18} fill="currentColor" />
              </div>
              <p className={styles.text}>"{review.text}"</p>
              <div className={styles.author}>
                <h4 className={styles.name}>{review.name}</h4>
                <span className={styles.role}>{review.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
