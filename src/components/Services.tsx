import { Leaf, PenTool, Sparkles } from 'lucide-react';
import styles from './Services.module.css';

export default function Services() {
  const services = [
    {
      id: 1,
      title: 'Tatuagens Florais Autorais',
      description: 'Desenhos únicos inspirados na natureza, criados para florescer na sua pele com fluidez e leveza.',
      icon: <Leaf className={styles.icon} size={32} />
    },
    {
      id: 2,
      title: 'Fineline & Micro-tatuagens',
      description: 'Traços incrivelmente finos e detalhes intrincados que exigem precisão, técnica e muita delicadeza.',
      icon: <PenTool className={styles.icon} size={32} />
    },
    {
      id: 3,
      title: 'Delicadas Personalizadas',
      description: 'Artes criadas sob medida para traduzir a sua história e sentimentos em uma tatuagem exclusiva e marcante.',
      icon: <Sparkles className={styles.icon} size={32} />
    }
  ];

  return (
    <section className={styles.services} id="servicos">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.subtitle}>Especialidades</span>
          <h2 className={styles.title}>Nossos Serviços</h2>
        </div>
        
        <div className={styles.grid}>
          {services.map(service => (
            <div key={service.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                {service.icon}
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
