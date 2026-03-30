'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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

  const handleClick = () => {
    if (!isDragging) {
      router.push(`/admin/clientes/${client.id}`)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.card}
      onClick={handleClick}
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
  )
}
