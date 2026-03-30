import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import KanbanBoard from './KanbanBoard'
import styles from './ClientesPage.module.css'

export const metadata: Metadata = {
  title: 'Clientes | Admin',
}

interface Client {
  id: string
  nome: string
  email: string
  whatsapp: string
  status: string
  created_at: string
}

export default async function ClientesPage() {
  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, nome, email, whatsapp, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar clientes:', error)
    return <div>Erro ao carregar clientes</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Meus Clientes</h1>
        <p>Gerencie seus orçamentos e agendamentos</p>
      </div>
      <KanbanBoard clients={clients as Client[]} />
    </div>
  )
}
