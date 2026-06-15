import { useState, useEffect } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { Plus, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { KanbanColumn } from './KanbanColumn'
import { TarefaFormModal } from './TarefaFormModal'

const COLUMNS = [
  { id: 'A_FAZER', title: 'A Fazer', color: 'var(--color-neutral)' },
  { id: 'EM_ANDAMENTO', title: 'Em Andamento', color: 'var(--color-info)' },
  { id: 'CONCLUIDO', title: 'Concluído', color: 'var(--color-success)' }
]

export const TarefasKanbanPage = () => {
  const [tarefas, setTarefas] = useState({
    A_FAZER: [],
    EM_ANDAMENTO: [],
    CONCLUIDO: []
  })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Filters
  const [processos, setProcessos] = useState([])
  const [processoFilter, setProcessoFilter] = useState('')

  const fetchTarefas = async () => {
    try {
      setLoading(true)
      const queryParams = processoFilter ? `?processoId=${processoFilter}` : ''
      const res = await api.get(`/api/tarefas${queryParams}`)
      
      const grouped = {
        A_FAZER: [],
        EM_ANDAMENTO: [],
        CONCLUIDO: []
      }
      
      res.data.forEach(t => {
        if (grouped[t.status]) {
          grouped[t.status].push(t)
        } else {
          // fallback if status is null or unknown
          grouped.A_FAZER.push(t)
        }
      })
      
      setTarefas(grouped)
    } catch (error) {
      console.error('Failed to fetch tarefas:', error)
      toast.error('Erro ao buscar tarefas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTarefas()
    // Fetch processos for filter
    api.get('/api/processos').then(res => setProcessos(res.data)).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processoFilter])

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result

    // Dropped outside the list
    if (!destination) return
    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = source.droppableId
    const destCol = destination.droppableId
    const taskId = parseInt(draggableId, 10)

    // Optimistic UI update
    const sourceTasks = Array.from(tarefas[sourceCol])
    const destTasks = sourceCol === destCol ? sourceTasks : Array.from(tarefas[destCol])
    
    const [movedTask] = sourceTasks.splice(source.index, 1)
    movedTask.status = destCol
    destTasks.splice(destination.index, 0, movedTask)

    setTarefas({
      ...tarefas,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks
    })

    // API update (Only if moving between columns)
    if (sourceCol !== destCol) {
      try {
        await api.patch(`/api/tarefas/${taskId}/status?novoStatus=${destCol}`)
        toast.success(`Movido para ${COLUMNS.find(c => c.id === destCol).title}`)
      } catch (error) {
        console.error('Failed to move task:', error)
        toast.error('Erro ao mover a tarefa. Revertendo...')
        fetchTarefas() // Revert changes by refetching
      }
    }
  }

  const handleTaskClick = (tarefa) => {
    setSelectedTask(tarefa)
    setIsModalOpen(true)
  }

  const handleOpenNewTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', height: 'calc(100vh - 120px)' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
            Quadro Kanban
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Acompanhe o andamento das tarefas do escritório arrastando-as entre as colunas.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '200px' }}>
            <Select 
              value={processoFilter}
              onChange={(e) => setProcessoFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os processos' },
                ...processos.map(p => ({ value: p.id.toString(), label: p.numeroProcesso || p.titulo }))
              ]}
            />
          </div>
          <Button variant="primary" onClick={handleOpenNewTask} icon={<Plus size={18} />}>
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ 
        flexGrow: 1, 
        display: 'flex', 
        gap: '24px', 
        overflowX: 'auto', 
        paddingBottom: '16px',
        alignItems: 'flex-start'
      }} className="kanban-board-container">
        {loading ? (
          <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
            <div className="skeleton" style={{ flex: 1, minWidth: '280px', height: '600px', borderRadius: 'var(--radius-lg)' }} />
            <div className="skeleton" style={{ flex: 1, minWidth: '280px', height: '600px', borderRadius: 'var(--radius-lg)' }} />
            <div className="skeleton" style={{ flex: 1, minWidth: '280px', height: '600px', borderRadius: 'var(--radius-lg)' }} />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            {COLUMNS.map(col => (
              <KanbanColumn 
                key={col.id}
                droppableId={col.id}
                title={col.title}
                color={col.color}
                tarefas={tarefas[col.id]}
                onTaskClick={handleTaskClick}
              />
            ))}
          </DragDropContext>
        )}
      </div>

      <TarefaFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tarefaToEdit={selectedTask}
        onCreated={fetchTarefas}
      />
    </div>
  )
}
