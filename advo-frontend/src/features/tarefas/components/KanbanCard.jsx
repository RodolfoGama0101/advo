import { Draggable } from '@hello-pangea/dnd'
import { Calendar, AlertCircle } from 'lucide-react'
import { formatDateTime, formatDate } from '../../../lib/utils'

const getPriorityColor = (prioridade) => {
  switch (prioridade) {
    case 'URGENTE': return 'var(--color-danger)'
    case 'ALTA': return 'var(--color-warning)'
    case 'MEDIA': return 'var(--color-info)'
    case 'BAIXA': return 'var(--color-success)'
    default: return 'var(--color-text-secondary)'
  }
}

export const KanbanCard = ({ tarefa, index, onClick }) => {
  const isOverdue = tarefa.dataVencimento && new Date(tarefa.dataVencimento) < new Date(new Date().setHours(0,0,0,0))
  const isDone = tarefa.status === 'CONCLUIDO'

  return (
    <Draggable draggableId={tarefa.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick && onClick(tarefa)}
          style={{
            ...provided.draggableProps.style,
            userSelect: 'none',
            padding: '16px',
            margin: '0 0 12px 0',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid',
            borderColor: snapshot.isDragging ? 'var(--color-primary)' : 'var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            opacity: isDone ? 0.7 : 1,
            cursor: 'grab'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h4 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: 'var(--color-text-primary)',
              margin: 0,
              textDecoration: isDone ? 'line-through' : 'none'
            }}>
              {tarefa.titulo}
            </h4>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: getPriorityColor(tarefa.prioridade),
              flexShrink: 0,
              marginTop: '4px'
            }} title={`Prioridade: ${tarefa.prioridade}`} />
          </div>

          {tarefa.descricao && (
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-text-secondary)', 
              marginBottom: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {tarefa.descricao}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: (isOverdue && !isDone) ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}>
              {isOverdue && !isDone ? <AlertCircle size={14} /> : <Calendar size={14} />}
              <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>
                {tarefa.dataVencimento ? formatDate(tarefa.dataVencimento) : 'Sem data'}
              </span>
            </div>
            
            {tarefa.processoId && (
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'var(--color-bg-base)', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                Proc: {tarefa.processoId}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
