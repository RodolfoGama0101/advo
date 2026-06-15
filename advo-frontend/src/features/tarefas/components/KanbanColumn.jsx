import { Droppable } from '@hello-pangea/dnd'
import { KanbanCard } from './KanbanCard'

export const KanbanColumn = ({ droppableId, title, color, tarefas, onTaskClick }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minWidth: '280px',
      background: 'var(--color-bg-base)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      border: '1px solid var(--color-border-subtle)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: color }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</h3>
        </div>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          background: 'var(--color-bg-elevated)', 
          padding: '2px 8px', 
          borderRadius: '12px',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)'
        }}>
          {tarefas.length}
        </span>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flexGrow: 1,
              minHeight: '200px',
              transition: 'background-color 0.2s ease',
              backgroundColor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.02)' : 'transparent',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {tarefas.map((tarefa, index) => (
              <KanbanCard 
                key={tarefa.id} 
                tarefa={tarefa} 
                index={index} 
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
