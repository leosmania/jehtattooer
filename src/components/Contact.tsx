import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { default as CustomInstagramIcon } from './icons/Instagram';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contato" className={styles.contactSection}>
      <div className={`container ${styles.content}`}>
        <span className="section-subtitle">Vamos Conversar</span>
        <h2 className={styles.title}>Agende seu Horário</h2>
        <p className={styles.text}>
          Entre em contato diretamente pelo WhatsApp para conversarmos sobre sua próxima tatuagem. Atendimento personalizado e exclusivo.
        </p>

        <div className={styles.infoCards}>
          <div className={styles.card}>
            <div className={styles.iconWrap}><MapPin size={24} /></div>
            <h4>Localização</h4>
            <p>Calçadão João Pinto - Centro<br/>Florianópolis, SC</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconWrap}><Phone size={24} /></div>
            <h4>Telefone</h4>
            <p>(48) 99815-8191</p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconWrap}><CustomInstagramIcon size={24} /></div>
            <h4>Instagram</h4>
            <a href="https://instagram.com/jehtattooer" target="_blank" rel="noopener noreferrer">
              @jehtattooer
            </a>
          </div>
        </div>

        <a 
          href="https://wa.me/5548998158191?text=Olá%20Jéssica!%20Gostaria%20de%20saber%20mais%20sobre%20tatuagens." 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.whatsappBtn}
        >
          <MessageCircle size={24} />
          Falar pelo WhatsApp
        </a>
      </div>
    </section>
  );
}
