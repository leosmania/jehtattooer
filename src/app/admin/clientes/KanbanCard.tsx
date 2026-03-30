'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import styles from './Kanban.module.css'

interface Client {
  id: string
  nome: string
  email: string
  whatsapp: string
  status: string
  created_at: string
}

interface KanbanCardProps {
  client: Client
}

export default function KanbanCard({ client }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: client.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const date = new Date(client.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <Link href={`/admin/clientes/${client.id}`}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={styles.card}
      >
        <div className={styles.cardHeader}>
          <h4>{client.nome}</h4>
          <span className={styles.date}>{date}</span>
        </div>

        <p className={styles.email}>{client.email}</p>
        <p className={styles.whatsapp}>{client.whatsapp}</p>

        <div className={styles.cardFooter}>
          <span className={styles.dragHint}>⋮⋮ Arraste para mover</span>
        </div>
      </div>
    </Link>
  )
}
