'use client'

import { useState } from 'react'
import { submitQuotationAction } from '@/app/actions/crm/submitQuotation'
import styles from './QuotationForm.module.css'

type Step = 1 | 2 | 3 | 'success'

interface FormData {
  nome: string
  email: string
  whatsapp: string
  tipo_tatuagem: string
  local_corpo: string
  tamanho_estimado: string
  descricao: string
  budget_range: string
}

export default function QuotationForm() {
  const [step, setStep] = useState<Step>(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    whatsapp: '',
    tipo_tatuagem: '',
    local_corpo: '',
    tamanho_estimado: '',
    descricao: '',
    budget_range: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateStep1 = () => {
    if (!formData.nome || !formData.email || !formData.whatsapp) {
      setError('Preencha todos os campos obrigatórios')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.tipo_tatuagem || !formData.local_corpo || !formData.tamanho_estimado) {
      setError('Preencha todos os campos obrigatórios')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.budget_range) {
      setError('Selecione uma faixa de orçamento')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep3()) return

    setIsLoading(true)
    setError('')
    try {
      const result = await submitQuotationAction(formData)

      if (!result.success) {
        setError(result.error || 'Erro ao enviar pedido')
        setIsLoading(false)
        return
      }

      setStep('success')
      setIsLoading(false)
    } catch (err) {
      setError('Erro ao enviar pedido. Tente novamente.')
      setIsLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className={styles.success}>
        <h2>✅ Pedido Recebido!</h2>
        <p>Obrigada por entrar em contato, {formData.nome}!</p>
        <p>Em breve entraremos em contato para discutir sua tatuagem.</p>
        <p className={styles.note}>
          Você receberá um email com mais informações em breve.
        </p>
        <button
          onClick={() => {
            setStep(1)
            setFormData({
              nome: '',
              email: '',
              whatsapp: '',
              tipo_tatuagem: '',
              local_corpo: '',
              tamanho_estimado: '',
              descricao: '',
              budget_range: '',
            })
          }}
          className={styles.resetBtn}
        >
          Fazer outro pedido
        </button>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <h1>Solicitar Orçamento</h1>
        <p>Preencha os dados abaixo para solicitar seu orçamento</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.steps}>
        <div className={`${styles.step} ${step === 1 ? styles.active : ''} ${step > 1 ? styles.done : ''}`}>
          1. Dados Pessoais
        </div>
        <div className={`${styles.step} ${step === 2 ? styles.active : ''} ${step > 2 ? styles.done : ''}`}>
          2. Tatuagem
        </div>
        <div className={`${styles.step} ${step === 3 ? styles.active : ''}`}>
          3. Orçamento
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Dados Pessoais */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.group}>
              <label htmlFor="nome">Nome *</label>
              <input
                id="nome"
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="whatsapp">WhatsApp *</label>
              <input
                id="whatsapp"
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="(48) 99999-9999"
                required
              />
            </div>

            <button type="button" onClick={handleNext} className={styles.nextBtn}>
              Próximo →
            </button>
          </div>
        )}

        {/* Step 2: Tatuagem */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.group}>
              <label htmlFor="tipo_tatuagem">Tipo de Tatuagem *</label>
              <select
                id="tipo_tatuagem"
                name="tipo_tatuagem"
                value={formData.tipo_tatuagem}
                onChange={handleChange}
                required
              >
                <option value="">Escolha um tipo</option>
                <option value="Floral">Floral</option>
                <option value="Fineline">Fineline</option>
                <option value="Botanica">Botânica</option>
                <option value="Animais">Animais</option>
                <option value="Ornamental">Ornamental</option>
                <option value="Cicatrizadas">Cicatrizadas</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className={styles.group}>
              <label htmlFor="local_corpo">Local do Corpo *</label>
              <input
                id="local_corpo"
                type="text"
                name="local_corpo"
                value={formData.local_corpo}
                onChange={handleChange}
                placeholder="Ex: Costas, Braço, Tornozelo"
                required
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="tamanho_estimado">Tamanho Estimado *</label>
              <select
                id="tamanho_estimado"
                name="tamanho_estimado"
                value={formData.tamanho_estimado}
                onChange={handleChange}
                required
              >
                <option value="">Escolha um tamanho</option>
                <option value="Pequeno (até 5cm)">Pequeno (até 5cm)</option>
                <option value="Médio (5-10cm)">Médio (5-10cm)</option>
                <option value="Grande (10-20cm)">Grande (10-20cm)</option>
                <option value="Muito Grande (20cm+)">Muito Grande (20cm+)</option>
              </select>
            </div>

            <div className={styles.group}>
              <label htmlFor="descricao">Descrição da Ideia</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva sua ideia, inspirações, o que você imagina..."
                rows={4}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>
                ← Voltar
              </button>
              <button type="button" onClick={handleNext} className={styles.nextBtn}>
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Orçamento */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.group}>
              <label htmlFor="budget_range">Faixa de Orçamento *</label>
              <select
                id="budget_range"
                name="budget_range"
                value={formData.budget_range}
                onChange={handleChange}
                required
              >
                <option value="">Escolha uma faixa</option>
                <option value="Até R$ 300">Até R$ 300</option>
                <option value="R$ 300 - R$ 500">R$ 300 - R$ 500</option>
                <option value="R$ 500 - R$ 800">R$ 500 - R$ 800</option>
                <option value="R$ 800 - R$ 1200">R$ 800 - R$ 1200</option>
                <option value="Acima de R$ 1200">Acima de R$ 1200</option>
                <option value="Sem orçamento definido">Sem orçamento definido</option>
              </select>
            </div>

            <div className={styles.summary}>
              <h3>Resumo do Pedido</h3>
              <p><strong>Nome:</strong> {formData.nome}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Tipo:</strong> {formData.tipo_tatuagem}</p>
              <p><strong>Local:</strong> {formData.local_corpo}</p>
              <p><strong>Tamanho:</strong> {formData.tamanho_estimado}</p>
              <p><strong>Orçamento:</strong> {formData.budget_range}</p>
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => setStep(2)} className={styles.backBtn}>
                ← Voltar
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Pedido'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
