import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import styles from './RouletteSection.module.css';

export default function RouletteSection() {
  return (
    <section id="roleta" className={styles.rouletteSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Sparkles size={32} className={styles.icon} />
            <h2 className={styles.title}>Roleta de Brindes Exclusivos</h2>
          </div>

          <p className={styles.description}>
            Gire a roleta e concorra a prêmios incríveis! Ao preencher o formulário, você terá a chance de ganhar EcoBags personalizadas, descontos especiais, pomadas cicatrizantes, mini tatuagens grátis e muito mais.
          </p>

          <p className={styles.highlight}>
            <strong>Todos os brindes são exclusivos para clientes que realizarem uma tatuagem com a profissional.</strong>
          </p>

          <Link href="/roleta" className={styles.button}>
            <Sparkles size={20} />
            Girar a Roleta Agora
          </Link>
        </div>
      </div>
    </section>
  );
}
