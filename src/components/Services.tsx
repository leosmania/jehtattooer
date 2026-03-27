import { Leaf, PenTool, Sparkles } from 'lucide-react';
import styles from './Services.module.css';

export default function Services() {
  const services = [
    {
      icon: <Leaf size={32} strokeWidth={1.5} />,
      title: 'Florais Autorais',
      description: 'Desenhos únicos inspirados na natureza, criados para fluir com a anatomia do seu corpo.'
    },
    {
      icon: <PenTool size={32} strokeWidth={1.5} />,
      title: 'Fineline',
      description: 'Traços finos e precisos para detalhes intrincados. Minimalismo elegante com alta durabilidade.'
    },
    {
      icon: <Sparkles size={32} strokeWidth={1.5} />,
      title: 'Personalizadas',
      description: 'Artes exclusivas criadas sob medida, traduzindo suas memórias e histórias em tatuagens delicadas.'
    }
  ];

  return (
    <section id="servicos" className={styles.services}>
      <div className="container">
        <span className="section-subtitle">Minhas Especialidades</span>
        <h2 className="section-title">Serviços</h2>
        
        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {service.icon}
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
