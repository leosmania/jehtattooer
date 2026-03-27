import { MessageCircle, PenTool, Syringe, Heart } from 'lucide-react';
import styles from './Process.module.css';

export default function Process() {
  const steps = [
    {
      icon: <MessageCircle size={32} strokeWidth={1.5} />,
      title: 'Conversa Inicial',
      desc: 'Entendemos suas ideias, referências e a história por trás da tatuagem que você deseja fazer.'
    },
    {
      icon: <PenTool size={32} strokeWidth={1.5} />,
      title: 'Criação',
      desc: 'Desenvolvo uma arte exclusiva, refinando os traços até chegarmos no design perfeito.'
    },
    {
      icon: <Syringe size={32} strokeWidth={1.5} />,
      title: 'Sessão',
      desc: 'O dia da tatuagem. Um ambiente acolhedor, seguro e focado no seu conforto.'
    },
    {
      icon: <Heart size={32} strokeWidth={1.5} />,
      title: 'Cuidados',
      desc: 'Acompanhamento do processo de cicatrização com as melhores orientações para sua pele.'
    }
  ];

  return (
    <section id="processo" className={styles.processSection}>
      <div className="container">
        <span className="section-subtitle">Como Funciona</span>
        <h2 className="section-title">O Processo</h2>
        
        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.iconBox}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {index < steps.length - 1 && <div className={styles.line}></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
