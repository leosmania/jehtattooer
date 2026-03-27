import { MessageCircle, PenTool, Syringe, Heart } from 'lucide-react';
import styles from './Process.module.css';

export default function Process() {
  const steps = [
    {
      id: 1,
      title: 'Conversa Inicial',
      description: 'Entendemos a sua ideia, referências e a mensagem que a tatuagem deve transmitir. Um papo sem compromisso.',
      icon: <MessageCircle className={styles.icon} size={28} />
    },
    {
      id: 2,
      title: 'Criação do Desenho',
      description: 'Desenvolvo uma arte exclusiva e delicada, ajustando detalhes até que fique perfeitamente do seu gosto.',
      icon: <PenTool className={styles.icon} size={28} />
    },
    {
      id: 3,
      title: 'Dia da Tatuagem',
      description: 'Em um ambiente seguro e acolhedor, transformamos o desenho em realidade na sua pele com máximo cuidado.',
      icon: <Syringe className={styles.icon} size={28} />
    },
    {
      id: 4,
      title: 'Cuidados Pós',
      description: 'Acompanhamento e orientações claras para que a cicatrização seja perfeita e o traço continue fino.',
      icon: <Heart className={styles.icon} size={28} />
    }
  ];

  return (
    <section className={styles.process}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.subtitle}>Como Funciona</span>
          <h2 className={styles.title}>O Processo Criativo</h2>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div key={step.id} className={styles.step}>
              <div className={styles.iconWrapper}>
                {step.icon}
                <div className={styles.stepNumber}>{index + 1}</div>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
