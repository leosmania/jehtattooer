'use client'

import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import KanbanColumn from './KanbanColumn'
import { updateClientStatusAction } from '@/app/actions/crm/updateClientStatus'
import styles from './Kanban.module.css'

interface Client {
  id: string
  nome: string
  email: string
  whatsapp: string
  status: string
  created_at: string
}

const KANBAN_COLUMNS = [
  { id: 'novo_orcamento', title: '📋 Novo Orçamento' },
  { id: 'em_consultoria', title: '💬 Em Consultoria' },
  { id: 'design_aprovado', title: '✅ Design Aprovado' },
  { id: 'agendado', title: '📅 Agendado' },
  { id: 'finalizado', title: '🎨 Finalizado' },
  { id: 'arquivado', title: '📦 Arquivado' },
]

interface KanbanBoardProps {
  clients: Client[]
}

export default function KanbanBoard({ clients }: KanbanBoardProps) {
  const [items, setItems] = useState<Client[]>(clients)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (!over) return

    const movingClient = items.find((c) => c.id === active.id)
    if (!movingClient) return

    const newStatus = over.data?.current?.sortable?.containerId || over.id

    // Atualizar estado local imediatamente (otimista)
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === movingClient.id ? { ...item, status: newStatus } : item
      )
    )

    // Chamar Server Action para atualizar no banco
    try {
      await updateClientStatusAction(movingClient.id, newStatus)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      // Reverter estado se falhar
      setItems(clients)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className={styles.kanbanContainer}>
        {KANBAN_COLUMNS.map((column) => {
          const columnClients = items.filter((c) => c.status === column.id)
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              clients={columnClients}
            />
          )
        })}
      </div>
    </DndContext>
  )
}
