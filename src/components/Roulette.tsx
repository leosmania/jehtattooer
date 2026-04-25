'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { submitLead } from '@/app/actions/saveLead';
import styles from './Roulette.module.css';

function getPrizeMessage(prize: string): string {
  if (prize.includes('Mini Tattoo')) {
    return 'Parabéns! Você ganhou uma Mini Tattoo ao gastar R$300 comigo.';
  }
  if (prize.includes('10%')) {
    return 'Parabéns! Você ganhou 10% de desconto ao realizar uma tattoo acima de R$500.';
  }
  return `Parabéns! Você ganhou ${prize} ao realizar uma tattoo de qualquer valor comigo.`;
}

const PRIZES = [
  "EcoBag Personalizada",
  "10% DESC. Acima de R$500",
  "Pomada Cicatrizante Grátis",
  "Mini Tattoo Grátis 3cm",
  "Pomada Cicatrizante Grátis",
  "EcoBag Personalizada",
  "Mini Tattoo Grátis 3cm",
  "Kit Pós Tattoo Completo",
  "Kit Pós Tattoo Completo",
  "Mini Tattoo Grátis 3cm",
];

export default function Roulette() {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', birthDate: '' });
  const [formValid, setFormValid] = useState(false);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeWon, setPrizeWon] = useState<string | null>(null);
  const [showPrizes, setShowPrizes] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('jeh_roleta_played');
    if (stored) {
      setHasPlayed(true);
      setPrizeWon(stored);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'whatsapp') {
      newValue = newValue.replace(/\D/g, "");
      newValue = newValue.replace(/^(\d{2})(\d)/g, "($1) $2");
      newValue = newValue.replace(/(\d)(\d{4})$/, "$1-$2");
      if (newValue.length > 15) newValue = newValue.substring(0, 15);
    }

    const newData = { ...formData, [name]: newValue };
    setFormData(newData);

    const isValid =
      newData.name.trim().length > 2 &&
      newData.email.includes('@') &&
      newData.whatsapp.length >= 14 &&
      newData.birthDate.length > 0;
    setFormValid(isValid);
  };

  const handleSpin = async () => {
    if (!formValid || isSpinning || hasPlayed) return;

    setIsSpinning(true);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const selectedPrize = PRIZES[prizeIndex];

    const sliceAngle = 360 / PRIZES.length;
    const randomOffset = Math.floor(Math.random() * 8) + 1;
    const targetRotation = (360 * 5) - (prizeIndex * sliceAngle) - (sliceAngle / 2) + randomOffset;

    const newRotation = rotation + targetRotation;
    setRotation(newRotation);

    setTimeout(async () => {
      setPrizeWon(selectedPrize);
      localStorage.setItem('jeh_roleta_played', selectedPrize);

      const end = Date.now() + 2.5 * 1000;
      const colors = ['#081C15', '#22C55E', '#D9F99D', '#FFFFFF'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      await submitLead(formData.name, formData.email, formData.whatsapp, selectedPrize, formData.birthDate);
      setIsSpinning(false);
      setHasPlayed(true);

    }, 5000);
  };

  const whatsappMessage = encodeURIComponent(
    `Oi Jeh! Girei a roleta no site e ganhei ${prizeWon}. Quero agendar minha tattoo!`
  );

  return (
    <section id="promocoes" className={styles.roletteSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Roleta de Brindes Exclusivos</h2>
        <p className={styles.subtitle}>Gire a roleta e ganhe um presente exclusivo para a sua próxima tatuagem com a Jeh!</p>

        <div className={styles.roletaGrid}>
          {/* FORM */}
          <div className={styles.formSection}>
            {prizeWon ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>
                  <CheckCircle size={48} color="#22c55e" />
                </div>
                <h3>{getPrizeMessage(prizeWon)}</h3>
                <p className={styles.successDesc}>Tire um print ou clique abaixo para validar seu prêmio no WhatsApp.</p>
                <a
                  href={`https://wa.me/5548998158191?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSuccess}
                >
                  <MessageCircle size={20} />
                  Resgatar meu Prêmio
                </a>
              </div>
            ) : (
              <div className={styles.captureForm}>
                <h3>Preencha para Girar</h3>
                <button
                  type="button"
                  className={styles.btnShowPrizes}
                  onClick={() => setShowPrizes(!showPrizes)}
                >
                  {showPrizes ? '✕ Ocultar Prêmios' : '🎁 Ver Prêmios Possíveis'}
                </button>
                {showPrizes && (
                  <div className={styles.prizesList}>
                    <p className={styles.prizesTitle}>🎁 Prêmios Possíveis:</p>
                    <ul>
                      {PRIZES.map((prize, idx) => (
                        <li key={idx}>{prize}</li>
                      ))}
                    </ul>
                    <div className={styles.prizeWarning}>
                      <p>Os brindes da roleta são exclusivos para clientes que agendarem e realizarem uma tatuagem com a profissional.</p>
                    </div>
                    <div className={styles.voucherAlert}>
                      <p><strong>⚠️ ATENÇÃO:</strong> Você <strong>PRECISA informar que ganhou este voucher</strong> no momento do agendamento com a profissional. Caso não informe antes do procedimento ser realizado, <strong>não poderá utilizar o voucher</strong>.</p>
                    </div>
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label>Seu Nome *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ex: Maria Clara"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSpinning}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Seu E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ex: maria@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSpinning}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Seu WhatsApp *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    disabled={isSpinning}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Data de Nascimento *</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={isSpinning}
                  />
                </div>
                <button
                  className={styles.btnSpin}
                  disabled={!formValid || isSpinning}
                  onClick={handleSpin}
                >
                  {isSpinning ? 'Girando...' : 'Quero Girar a Roleta!'}
                </button>
              </div>
            )}
          </div>

          {/* WHEEL */}
          <div className={styles.wheelSection}>
            <div className={styles.wheelContainer}>
              <div className={styles.pointer}></div>
              <div
                className={styles.wheel}
                style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 5s cubic-bezier(0.14, 0.86, 0.28, 1)' }}
              >
                {PRIZES.map((prize, idx) => {
                  const rotateAngle = idx * (360 / PRIZES.length);

                  return (
                    <div
                      key={idx}
                      className={styles.sliceGroup}
                      style={{ transform: `rotate(${rotateAngle}deg)` }}
                    >
                      <div className={`${styles.slice} ${idx % 2 === 0 ? styles.sliceEven : styles.sliceOdd}`}></div>
                      <div className={styles.sliceText}>
                        <span>{prize}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.wheelCenterBtn}>JEH</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
