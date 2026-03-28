'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { submitLead } from '../actions/saveLead';
import styles from './Roleta.module.css';

const PRIZES = [
  "EcoBag Personalizada",
  "10% DESC. Acima de R$300",
  "20% DESC. Acima de R$500",
  "Pomada Cicatrizante Grátis",
  "Mini Tattoo Grátis",
  "Pomada Cicatrizante Grátis",
  "EcoBag Personalizada",
  "Mini Tattoo Grátis",
];

export default function RoletaClient() {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', birthDate: '' });
  const [formValid, setFormValid] = useState(false);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeWon, setPrizeWon] = useState<string | null>(null);
  const [showPrizes, setShowPrizes] = useState(false);

  useEffect(() => {
    // Check local storage so they don't abuse it (simple client-side check)
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
    
    // Validate
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

    // Randomize prize
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const selectedPrize = PRIZES[prizeIndex];

    // Math for wheel rotation
    const sliceAngle = 360 / PRIZES.length;
    // We want the WINNING prize to land on TOP (270 degrees usually, but here we'll align the CSS pointer to the top)
    // Actually, let's say the pointer points to the RIGHT (0 degrees). 
    // To land on prizeIndex, we rotate backwards the slice offset + multiple spins.
    const randomOffset = Math.floor(Math.random() * (sliceAngle - 2)) + 1; // minor random inside the slice
    const targetRotation = (360 * 5) - (prizeIndex * sliceAngle) - randomOffset; 
    
    // Accumulate rotation so it keeps spinning further continuously if played again (not possible here due to hasPlayed, but good practice)
    const newRotation = rotation + targetRotation;
    setRotation(newRotation);

    // Wait for the CSS transition (5 seconds)
    setTimeout(async () => {
      setPrizeWon(selectedPrize);
      localStorage.setItem('jeh_roleta_played', selectedPrize);
      
      // Fire confetti
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

      // Save lead in backend
      await submitLead(formData.name, formData.email, formData.whatsapp, selectedPrize, formData.birthDate);
      
    }, 5000);
  };

  const whatsappMessage = encodeURIComponent(
    `Oi Jeh! Girei a roleta no site e ganhei ${prizeWon}. Quero agendar minha tattoo!`
  );

  return (
    <div className={styles.roletaGrid}>
      {/* LEFT: FORM OR SUCCESS MSG */}
      <div className={styles.formSection}>
        {prizeWon ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} color="#22c55e" />
            </div>
            <h3>Parabéns!</h3>
            <p>Você ganhou:</p>
            <div className={styles.prizeHighlight}>
              {prizeWon}
            </div>
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
                <p className={styles.prizesTitle}>Prêmios possíveis:</p>
                <ul>
                  {PRIZES.map((prize, idx) => (
                    <li key={idx}>{prize}</li>
                  ))}
                </ul>
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

      {/* RIGHT: THE WHEEL */}
      <div className={styles.wheelSection}>
        <div className={styles.wheelContainer}>
          <div className={styles.pointer}></div>
          <div 
            className={styles.wheel} 
             style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 5s cubic-bezier(0.14, 0.86, 0.28, 1)' }}
          >
            {PRIZES.map((prize, idx) => {
              // Creating a conic gradient dynamically or using CSS slices
              // The easiest approach for text in a 8-slice wheel is positioning absolute 
              // rotated slices around the center.
              const rotateAngle = idx * (360 / PRIZES.length);
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={idx} 
                  className={styles.sliceGroup} 
                  style={{ transform: `rotate(${rotateAngle}deg)` }}
                >
                  <div className={`${styles.slice} ${isEven ? styles.sliceEven : styles.sliceOdd}`}></div>
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
  );
}
