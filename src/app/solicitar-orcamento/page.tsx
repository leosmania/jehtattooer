import { Metadata } from 'next'
import QuotationForm from './QuotationForm'
import TattooSimulator from '../simulador/TattooSimulator'

export const metadata: Metadata = {
  title: 'Solicitar Orçamento | JehTattooer',
  description: 'Solicite um orçamento para sua tatuagem delicada, floral ou fineline com Jéssica Barboza em Florianópolis. Teste como ficará no corpo com nosso simulador!',
  openGraph: {
    title: 'Solicitar Orçamento | JehTattooer',
    description: 'Solicite seu orçamento de tatuagem personalizada e visualize como ficará no corpo.',
    url: 'https://jehtattooer.com.br/solicitar-orcamento',
  },
}

export default function SolicitarOrcamentoPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)' }}>
      <QuotationForm />
      <TattooSimulator />
    </div>
  )
}
