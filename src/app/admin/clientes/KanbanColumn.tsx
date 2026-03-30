'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'
import styles from './Kanban.module.css'

interface Client {
  id: string
  nome: string
  email: string
  whatsapp: string
  status: string
  created_at: string
}

interface KanbanColumnProps {
  id: string
  title: string
  clients: Client[]
}

export default function KanbanColumn({ id, title, clients }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div className={styles.column} ref={setNodeRef}>
      <div className={styles.columnHeader}>
        <h3>{title}</h3>
        <span className={styles.count}>{clients.length}</span>
      </div>

      <SortableContext items={clients.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.cardList}>
          {clients.length === 0 ? (
            <div className={styles.emptyState}>Nenhum cliente</div>
          ) : (
            clients.map((client) => <KanbanCard key={client.id} client={client} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}
