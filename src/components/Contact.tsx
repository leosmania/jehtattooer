import { MapPin, Phone, MessageSquare } from 'lucide-react';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contato" className={styles.contactSection}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.info}>
          <span className="section-subtitle" style={{ textAlign: 'left' }}>Faça um Orçamento</span>
          <h2 className={styles.title}>Agende seu Horário</h2>
          <p className={styles.text}>Preencha o formulário ou entre em contato diretamente pelo WhatsApp para conversarmos sobre sua próxima tatuagem.</p>
          
          <ul className={styles.contactList}>
            <li>
              <div className={styles.iconWrap}><MapPin size={20} /></div>
              <span>Calçadão João Pinto - Centro<br/>Florianópolis, SC</span>
            </li>
            <li>
              <div className={styles.iconWrap}><Phone size={20} /></div>
              <a href="https://wa.me/5548998158191" target="_blank" rel="noopener noreferrer">
                (48) 99815-8191
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.formWrapper}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input type="text" id="name" placeholder="Como gosta de ser chamado(a)?" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="phone">WhatsApp</label>
              <input type="tel" id="phone" placeholder="(48) 90000-0000" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="details">Detalhes da Tatuagem</label>
              <textarea id="details" rows={4} placeholder="Tamanho aproximado, local do corpo e referências..." required></textarea>
            </div>
            <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
              Enviar Mensagem <MessageSquare size={18} style={{ display: 'inline', marginLeft: '8px' }}/>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
