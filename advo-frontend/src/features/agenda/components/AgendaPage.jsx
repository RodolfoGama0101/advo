import { useState, useRef, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { CompromissoFormModal } from './CompromissoFormModal'
import { CompromissoDetailModal } from './CompromissoDetailModal'

export const AgendaPage = () => {
  const { user } = useAuthStore()
  const calendarRef = useRef(null)
  
  const [events, setEvents] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null })
  const [selectedCompromisso, setSelectedCompromisso] = useState(null)
  
  // Custom fetch function for fullcalendar datesSet hook
  const fetchEvents = useCallback(async (fetchInfo) => {
    if (!user?.usuarioId) return

    try {
      const response = await api.get('/api/agenda', {
        params: {
          usuarioId: user.usuarioId,
          inicio: fetchInfo.startStr,
          fim: fetchInfo.endStr
        }
      })
      
      const mappedEvents = response.data.map(comp => {
        // Try to assign colors based on title keywords for a premium feel
        const titleLower = comp.titulo.toLowerCase()
        let color = 'var(--color-primary)'
        if (titleLower.includes('audiência') || titleLower.includes('audiencia')) color = 'var(--color-danger)'
        if (titleLower.includes('prazo')) color = 'var(--color-warning)'
        if (titleLower.includes('reunião') || titleLower.includes('reuniao')) color = 'var(--color-info)'

        return {
          id: comp.id.toString(),
          title: comp.titulo,
          start: comp.dataHoraInicio,
          end: comp.dataHoraFim,
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            ...comp
          }
        }
      })
      
      setEvents(mappedEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
      toast.error('Erro ao carregar compromissos.')
    }
  }, [user?.usuarioId])

  // Click on empty space
  const handleDateSelect = (selectInfo) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end
    })
    setIsFormOpen(true)
    
    // Clear selection so the user can re-select the same date later
    selectInfo.view.calendar.unselect()
  }

  // Click on existing event
  const handleEventClick = (clickInfo) => {
    setSelectedCompromisso(clickInfo.event.extendedProps)
    setIsDetailOpen(true)
  }

  // When a new event is created from modal, refetch
  const handleEventCreated = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const view = calendarApi.view
      fetchEvents({ startStr: view.activeStart.toISOString(), endStr: view.activeEnd.toISOString() })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
            Agenda
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Acompanhe audiências, reuniões e prazos.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => { setSelectedDates({ start: null, end: null }); setIsFormOpen(true) }} 
          icon={<Plus size={18} />}
        >
          Novo Compromisso
        </Button>
      </div>

      {/* Calendar Card */}
      <Card style={{ padding: '24px' }}>
        <div className="calendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia'
            }}
            locale="pt-br"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            datesSet={fetchEvents}
            height="auto"
            contentHeight={700}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
          />
        </div>
      </Card>

      <CompromissoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialStart={selectedDates.start}
        initialEnd={selectedDates.end}
        onCreated={handleEventCreated}
      />

      <CompromissoDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        compromisso={selectedCompromisso}
      />

    </div>
  )
}
