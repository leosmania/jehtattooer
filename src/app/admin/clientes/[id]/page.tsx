import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import styles from './ClientDetail.module.css'

interface ClientDetailPageProps {
  params: {
    id: string
  }
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = params

  // Buscar cliente
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  // Buscar quotation
  const { data: quotation } = await supabase
    .from('quotation_requests')
    .select('*')
    .eq('client_id', id)
    .single()

  // Buscar anamnesis
  const { data: anamnesis } = await supabase
    .from('anamnesis_forms')
    .select('*')
    .eq('client_id', id)
    .single()

  if (clientError || !client) {
    return (
      <div className={styles.container}>
        <Link href="/admin/clientes" className={styles.backLink}>
          ← Voltar
        </Link>
        <div className={styles.error}>Cliente não encontrado</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Link href="/admin/clientes" className={styles.backLink}>
        ← Voltar
      </Link>

      <div className={styles.header}>
        <h1>{client.nome}</h1>
        <span className={styles.status}>{client.status.replace(/_/g, ' ').toUpperCase()}</span>
      </div>

      <div className={styles.grid}>
        {/* Cliente Info */}
        <section className={styles.section}>
          <h2>📋 Dados do Cliente</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Email</label>
              <p>{client.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>WhatsApp</label>
              <p>{client.whatsapp}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Status</label>
              <p>{client.status}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Criado em</label>
              <p>{new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
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
        <button className={styles.primaryBtn}>
          📧 Gerar e Enviar Link de Anamnese
        </button>
      </div>
    </div>
  )
}
