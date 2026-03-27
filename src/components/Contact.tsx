import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section className={styles.contact} id="contato-form">
      <div className={`container ${styles.contactGrid}`}>
        <div className={styles.info}>
          <span className={styles.subtitle}>Localização e Contato</span>
          <h2 className={styles.title}>Vamos criar algo lindo juntos?</h2>
          <p className={styles.description}>
            Preencha o formulário para enviar sua ideia ou, se preferir, mande uma mensagem direta no WhatsApp. O estúdio fica no coração de Florianópolis, de fácil acesso e muito bem localizado.
          </p>
          
          <div className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.0076292558237!2d-48.553956123491176!3d-27.593297123306915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952738221bcbafe1%3A0xcb13e1dc0ea410d4!2sCal%C3%A7ad%C3%A3o%20Jo%C3%A3o%20Pinto%20-%20Centro%2C%20Florian%C3%B3polis%20-%20SC%2C%2088010-420!5e0!3m2!1spt-BR!2sbr!4v1703087284729!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="300" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form} action="https://wa.me/5548998158191" method="get" target="_blank">
            <h3 className={styles.formTitle}>Solicitar Orçamento</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="name">Seu Nome</label>
              <input type="text" id="name" name="text" placeholder="Como gosta de ser chamado?" required className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="idea">Sua Ideia</label>
              <textarea id="idea" rows={5} placeholder="Descreva brevemente a ideia da sua tatuagem, tamanho aproximado e local do corpo." className={styles.textarea} required></textarea>
            </div>

            <p className={styles.formNote}>
              * Ao clicar em enviar, você será redirecionado para o WhatsApp com uma mensagem pré-preenchida. Lá você poderá enviar as fotos de referência!
            </p>

            <button type="submit" className={`btn ${styles.submitBtn}`}>
              Enviar para o WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
