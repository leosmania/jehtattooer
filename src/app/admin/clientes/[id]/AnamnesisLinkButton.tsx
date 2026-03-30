'use client'

import { useState } from 'react'
import { generateAnamnesisLinkAction } from '@/app/actions/crm/generateAnamnesisLink'
import styles from './ClientDetail.module.css'

interface AnamnesisLinkButtonProps {
  clientId: string
  alreadySent: boolean
  alreadyFilled: boolean
}

export default function AnamnesisLinkButton({ clientId, alreadySent, alreadyFilled }: AnamnesisLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ url: string; email: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  if (alreadyFilled) {
    return null
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')

    try {
      const res = await generateAnamnesisLinkAction(clientId)

      if (!res.success) {
        setError(res.error || 'Erro ao gerar link')
        setIsLoading(false)
        return
      }

      setResult({ url: res.anamnesisUrl!, email: res.email! })
      setIsLoading(false)
    } catch (err) {
      setError('Erro ao gerar link. Tente novamente.')
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (result?.url) {
      await navigator.clipboard.writeText(result.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (result) {
    return (
      <div className={styles.linkResult}>
        <h3>Link Gerado com Sucesso!</h3>
        <p>Email enviado para: <strong>{result.email}</strong></p>

        <div className={styles.linkBox}>
          <input type="text" value={result.url} readOnly className={styles.linkInput} />
          <button onClick={handleCopy} className={styles.copyBtn}>
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <p className={styles.linkHint}>
          Envie este link para o cliente preencher a ficha de anamnese
        </p>
      </div>
    )
  }

  return (
    <div>
      {error && <p className={styles.errorText}>{error}</p>}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className={styles.primaryBtn}
      >
        {isLoading
          ? 'Gerando...'
          : alreadySent
            ? '📧 Reenviar Link de Anamnese'
            : '📧 Gerar e Enviar Link de Anamnese'
        }
      </button>
    </div>
  )
}
