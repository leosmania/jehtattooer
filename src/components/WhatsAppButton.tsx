import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/5548998158191" 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.floatButton}
      aria-label="Fale comigo no WhatsApp"
    >
      <MessageCircle size={32} color="#ffffff" />
      <span className={styles.tooltip}>Fale comigo!</span>
    </a>
  );
}
