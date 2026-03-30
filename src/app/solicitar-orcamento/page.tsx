import { Metadata } from 'next'
import QuotationForm from './QuotationForm'

export const metadata: Metadata = {
  title: 'Solicitar Orçamento | JehTattooer',
  description: 'Solicite um orçamento para sua tatuagem delicada, floral ou fineline com Jéssica Barboza em Florianópolis.',
  openGraph: {
    title: 'Solicitar Orçamento | JehTattooer',
    description: 'Solicite seu orçamento de tatuagem personalizada',
    url: 'https://jehtattooer.com.br/solicitar-orcamento',
  },
}

export default function SolicitarOrcamentoPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)' }}>
      <QuotationForm />
    </div>
  )
}
