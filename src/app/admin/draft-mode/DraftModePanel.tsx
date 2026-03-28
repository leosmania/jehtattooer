'use client';

import { useState, useEffect } from 'react';

export default function DraftModePanel() {
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [secret, setSecret] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);

  // Detectar se Draft Mode está ativo
  useEffect(() => {
    // O Draft Mode é detectado se a página foi servida do roteador (tem cookies específicos)
    // Para simplificar, vamos checar via API
    const checkDraftMode = async () => {
      try {
        const res = await fetch('/api/draft-mode/status');
        if (res.ok) {
          const data = await res.json();
          setIsDraftMode(data.isDraftMode);
        }
      } catch (err) {
        console.error('Erro ao verificar Draft Mode:', err);
      }
    };

    checkDraftMode();
  }, []);

  const handleEnable = async () => {
    if (!secret) {
      setMessage('❌ Digite a secret para ativar Draft Mode');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/draft-mode/enable?secret=${encodeURIComponent(secret)}`);

      if (response.ok) {
        setIsDraftMode(true);
        setMessage('✅ Draft Mode Ativado! Mudanças do Sanity aparecem em tempo real');
        setSecret('');
        setShowSecretInput(false);
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('❌ Secret incorreta. Tente novamente.');
      }
    } catch (err) {
      setMessage('❌ Erro ao ativar Draft Mode');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/draft-mode/disable');

      if (response.ok) {
        setIsDraftMode(false);
        setMessage('✅ Draft Mode Desativado');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      setMessage('❌ Erro ao desativar Draft Mode');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(217, 249, 157, 0.3)',
      borderRadius: '12px',
      padding: '2.5rem',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '1.8rem',
        background: 'linear-gradient(135deg, #d9f99d 0%, #4ade80 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        🎨 Draft Mode Admin
      </h1>

      <p style={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '2rem',
        fontSize: '0.95rem',
        lineHeight: '1.5',
      }}>
        Ative o Draft Mode para visualizar mudanças do Sanity em tempo real, sem esperar por deploy.
      </p>

      {/* Status */}
      <div style={{
        background: isDraftMode
          ? 'rgba(76, 175, 80, 0.1)'
          : 'rgba(244, 67, 54, 0.1)',
        border: `1px solid ${isDraftMode ? '#4caf50' : '#f44336'}`,
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}>
          {isDraftMode ? '✅' : '⚠️'}
        </div>
        <div style={{
          color: isDraftMode ? '#4caf50' : '#f44336',
          fontWeight: 600,
          fontSize: '1.1rem',
        }}>
          {isDraftMode ? 'Draft Mode ATIVO' : 'Draft Mode INATIVO'}
        </div>
        <div style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.85rem',
          marginTop: '0.5rem',
        }}>
          {isDraftMode
            ? 'Atualizações do Sanity aparecem em tempo real'
            : 'Ative para ver mudanças do Sanity instantaneamente'
          }
        </div>
      </div>

      {/* Input da Secret */}
      {!isDraftMode && (
        <div style={{
          marginBottom: '1.5rem',
        }}>
          <label style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 600,
          }}>
            Secret para Ativar Draft Mode
          </label>
          <input
            type={showSecretInput ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Cole a secret aqui"
            onKeyPress={(e) => e.key === 'Enter' && handleEnable()}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(217, 249, 157, 0.3)',
              color: '#fff',
              borderRadius: '6px',
              fontSize: '0.95rem',
              marginBottom: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={() => setShowSecretInput(!showSecretInput)}
            style={{
              background: 'none',
              border: 'none',
              color: '#d9f99d',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {showSecretInput ? 'Ocultar' : 'Mostrar'} secret
          </button>
        </div>
      )}

      {/* Botões de Ação */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {!isDraftMode ? (
          <button
            onClick={handleEnable}
            disabled={loading || !secret}
            style={{
              flex: 1,
              padding: '0.9rem',
              background: secret
                ? 'linear-gradient(135deg, #d9f99d 0%, #4ade80 100%)'
                : 'rgba(217, 249, 157, 0.2)',
              color: '#081c15',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              textTransform: 'uppercase',
              cursor: secret ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              opacity: secret ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (secret && !loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 249, 157, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Ativando...' : '✅ Ativar Draft Mode'}
          </button>
        ) : (
          <button
            onClick={handleDisable}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.9rem',
              background: 'rgba(244, 67, 54, 0.2)',
              color: '#f44336',
              border: '1px solid #f44336',
              borderRadius: '6px',
              fontWeight: 700,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(244, 67, 54, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(244, 67, 54, 0.2)';
            }}
          >
            {loading ? 'Desativando...' : '❌ Desativar Draft Mode'}
          </button>
        )}
      </div>

      {/* Mensagem */}
      {message && (
        <div style={{
          padding: '1rem',
          background: message.includes('✅')
            ? 'rgba(76, 175, 80, 0.15)'
            : 'rgba(244, 67, 54, 0.15)',
          border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`,
          borderRadius: '6px',
          color: message.includes('✅') ? '#4caf50' : '#f44336',
          textAlign: 'center',
          fontSize: '0.9rem',
          marginBottom: '1rem',
        }}>
          {message}
        </div>
      )}

      {/* Info Footer */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(217, 249, 157, 0.1)',
        padding: '1rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: '1.6',
      }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          💡 <strong>Dica:</strong> Com Draft Mode ativo, qualquer mudança que você fizer no Sanity será refletida no site instantaneamente!
        </p>
        <p style={{ margin: 0 }}>
          🔒 Esta página está protegida e não aparece nos resultados de busca.
        </p>
      </div>
    </div>
  );
}
