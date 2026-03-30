import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AnamnesisLinkButton from './AnamnesisLinkButton'
import styles from './ClientDetail.module.css'

interface ClientDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params

  console.log('🔍 Buscando cliente com ID:', id)

  // Buscar cliente
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)

  console.log('Cliente encontrado:', client)
  console.log('Erro:', clientError)

  if (clientError || !client || client.length === 0) {
    console.error('❌ Cliente não encontrado:', clientError)
    return (
      <div className={styles.container}>
        <Link href="/admin/clientes" className={styles.backLink}>
          ← Voltar
        </Link>
        <div className={styles.error}>
          <p>Cliente não encontrado</p>
          <p className={styles.errorDetails}>ID: {id}</p>
        </div>
      </div>
    )
  }

  const clientData = client[0]

  // Buscar quotation
  const { data: quotations } = await supabase
    .from('quotation_requests')
    .select('*')
    .eq('client_id', id)

  const quotation = quotations?.[0]

  // Buscar anamnesis
  const { data: anamnesises } = await supabase
    .from('anamnesis_forms')
    .select('*')
    .eq('client_id', id)

  const anamnesis = anamnesises?.[0]

  return (
    <div className={styles.container}>
      <Link href="/admin/clientes" className={styles.backLink}>
        ← Voltar
      </Link>

      <div className={styles.header}>
        <h1>{clientData.nome}</h1>
        <span className={styles.status}>{clientData.status.replace(/_/g, ' ').toUpperCase()}</span>
      </div>

      <div className={styles.grid}>
        {/* Cliente Info */}
        <section className={styles.section}>
          <h2>📋 Dados do Cliente</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Email</label>
              <p>{clientData.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>WhatsApp</label>
              <p>{clientData.whatsapp}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Status</label>
              <p>{clientData.status}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Criado em</label>
              <p>{new Date(clientData.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </section>

        {/* Quotation */}
        {quotation && (
          <section className={styles.section}>
            <h2>🎨 Pedido de Orçamento</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Tipo de Tatuagem</label>
                <p>{quotation.tipo_tatuagem}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Local do Corpo</label>
                <p>{quotation.local_corpo}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Tamanho Estimado</label>
                <p>{quotation.tamanho_estimado}</p>
              </div>
              <div className={styles.infoItem}>
                <label>Faixa de Orçamento</label>
                <p>{quotation.budget_range}</p>
              </div>
              {quotation.descricao && (
                <div className={styles.infoItem}>
                  <label>Descrição</label>
                  <p>{quotation.descricao}</p>
                </div>
              )}
            </div>
            {quotation.imagens_referencia && quotation.imagens_referencia.length > 0 && (
              <div className={styles.referenceImages}>
                <label>Imagens de Referência</label>
                <div className={styles.imageGrid}>
                  {quotation.imagens_referencia.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={styles.imageThumb}>
                      <img src={url} alt={`Referência ${i + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Anamnesis */}
        {anamnesis ? (
          <section className={styles.section}>
            <h2>✅ Ficha de Anamnese Preenchida</h2>
            <div className={styles.anamnesisInfo}>
              <p className={styles.success}>Ficha preenchida em {new Date(anamnesis.submitted_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </section>
        ) : (
          <section className={styles.section}>
            <h2>⏳ Ficha de Anamnese</h2>
            <div className={styles.emptyState}>
              <p>Ficha ainda não preenchida</p>
              <p className={styles.hint}>Clique no botão abaixo para gerar e enviar o link</p>
            </div>
          </section>
        )}
      </div>

      <div className={styles.actions}>
        <AnamnesisLinkButton
          clientId={clientData.id}
          alreadySent={clientData.anamnesis_link_sent || false}
          alreadyFilled={clientData.anamnesis_filled || false}
        />
      </div>
    </div>
  )
}
