import { Metadata } from 'next'
import TattooSimulator from './TattooSimulator'

export const metadata: Metadata = {
  title: 'Simulador de Tatuagem | JehTattooer',
  description: 'Visualize como sua tatuagem ficará no corpo antes de tatuar. Faça upload do desenho e da foto do corpo para simular o resultado.',
  openGraph: {
    title: 'Simulador de Tatuagem | JehTattooer',
    description: 'Visualize como sua tatuagem ficará no corpo antes de tatuar.',
    url: 'https://jehtattooer.com.br/simulador',
  },
}

export default function SimuladorPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)' }}>
      <TattooSimulator />
    </div>
  )
}
