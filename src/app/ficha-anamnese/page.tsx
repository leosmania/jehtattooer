import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import AnamnesisForm from './AnamnesisForm'

export const metadata: Metadata = {
  title: 'Ficha de Anamnese | JehTattooer',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function FichaAnamnesePage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) {
    return <ErrorState message="Link inválido. Verifique o email que você recebeu." />
  }

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, nome, email, whatsapp, anamnesis_filled')
    .eq('anamnesis_token', token)

  if (error || !clients || clients.length === 0) {
    return <ErrorState message="Link inválido ou expirado. Verifique o email que você recebeu." />
  }

  const client = clients[0]

  if (client.anamnesis_filled) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
        <div style={{ maxWidth: 500, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
            Ficha já preenchida!
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Sua ficha de anamnese já foi preenchida anteriormente. Qualquer dúvida, entre em contato com a Jéssica pelo WhatsApp.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)' }}>
      <AnamnesisForm
        token={token}
        clientNome={client.nome}
        clientEmail={client.email}
        clientWhatsapp={client.whatsapp}
      />
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: 500, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-lg)' }}>⚠️</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
          Link inválido
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  )
}
