import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

const schema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  descricao: z.string().optional(),
  dataHoraInicio: z.string().min(1, 'Data de início obrigatória'),
  dataHoraFim: z.string().min(1, 'Data de término obrigatória'),
  localCompromisso: z.string().optional(),
  processoId: z.string().optional(),
  clienteId: z.string().optional(),
})

// Format Date object to YYYY-MM-DDThh:mm for datetime-local input
const formatForInput = (dateObj) => {
  if (!dateObj) return ''
  const d = new Date(dateObj)
  // Fix timezone offset for local display
  const tzoffset = (new Date()).getTimezoneOffset() * 60000
  const localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, 16)
  return localISOTime
}

export const CompromissoFormModal = ({ isOpen, onClose, initialStart, initialEnd, onCreated }) => {
  const { user } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [processos, setProcessos] = useState([])
  const [clientes, setClientes] = useState([])

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: '',
      descricao: '',
      dataHoraInicio: '',
      dataHoraFim: '',
      localCompromisso: '',
      processoId: '',
      clienteId: ''
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (initialStart) setValue('dataHoraInicio', formatForInput(initialStart))
      if (initialEnd) setValue('dataHoraFim', formatForInput(initialEnd))
      else if (initialStart) {
        // Default end time to 1 hour after start if not provided
        const d = new Date(initialStart)
        d.setHours(d.getHours() + 1)
        setValue('dataHoraFim', formatForInput(d))
      }

      // Fetch processes and clients for selects
      const fetchDeps = async () => {
        try {
          const [pRes, cRes] = await Promise.all([
            api.get('/api/processos').catch(() => ({ data: [] })),
            api.get('/api/clientes').catch(() => ({ data: [] }))
          ])
          setProcessos(pRes.data)
          setClientes(cRes.data)
        } catch (e) {
          console.error(e)
        }
      }
      fetchDeps()
    }
  }, [isOpen, initialStart, initialEnd, setValue])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    if (!user?.usuarioId) {
      toast.error('Usuário não autenticado corretamente.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        titulo: data.titulo,
        descricao: data.descricao,
        // API expects standard ISO strings for date-time
        dataHoraInicio: new Date(data.dataHoraInicio).toISOString(),
        dataHoraFim: new Date(data.dataHoraFim).toISOString(),
        localCompromisso: data.localCompromisso,
        usuarioId: user.usuarioId,
        processoId: data.processoId ? parseInt(data.processoId, 10) : null,
        clienteId: data.clienteId ? parseInt(data.clienteId, 10) : null
      }

      await api.post('/api/agenda', payload)
      toast.success('Compromisso agendado com sucesso!')
      onCreated && onCreated()
      handleClose()
    } catch (error) {
      console.error('Failed to create compromisso:', error)
      toast.error('Erro ao agendar compromisso.')
    } finally {
      setSaving(false)
    }
  }

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose} disabled={saving}>Cancelar</Button>
      <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={saving}>
        {saving ? 'Agendando...' : 'Agendar Compromisso'}
      </Button>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Compromisso" footer={footer}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
        <Input 
          label="Título *" 
          placeholder="Ex: Reunião com Cliente" 
          {...register('titulo')} 
          error={errors.titulo?.message} 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input 
            label="Início *" 
            type="datetime-local"
            {...register('dataHoraInicio')} 
            error={errors.dataHoraInicio?.message} 
          />
          <Input 
            label="Término *" 
            type="datetime-local"
            {...register('dataHoraFim')} 
            error={errors.dataHoraFim?.message} 
          />
        </div>

        <Input 
          label="Local do Compromisso" 
          placeholder="Ex: Fórum Central, Google Meet" 
          {...register('localCompromisso')} 
          error={errors.localCompromisso?.message} 
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select 
            label="Vincular a Processo" 
            {...register('processoId')}
            options={[
              { value: '', label: 'Nenhum' },
              ...processos.map(p => ({ value: p.id.toString(), label: p.numeroProcesso || p.titulo }))
            ]}
          />
          <Select 
            label="Vincular a Cliente" 
            {...register('clienteId')}
            options={[
              { value: '', label: 'Nenhum' },
              ...clientes.map(c => ({ value: c.id.toString(), label: c.nome }))
            ]}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-primary)' }}>
            Descrição
          </label>
          <textarea 
            {...register('descricao')}
            style={{
              minHeight: '80px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Pautas, anotações..."
          />
        </div>
      </form>
    </Modal>
  )
}
