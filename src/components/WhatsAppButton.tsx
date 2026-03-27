import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/5548998158191?text=Olá,%20Jéssica!%20Gostaria%20de%20solicitar%20um%20orçamento%20para%20uma%20tatuagem." 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.float}
      aria-label="Fale comigo no WhatsApp"
    >
      <MessageCircle className={styles.myFloat} size={30} />
    </a>
  );
}
