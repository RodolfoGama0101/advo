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
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']),
  dataVencimento: z.string().optional(),
  processoId: z.string().optional()
})

export const TarefaFormModal = ({ isOpen, onClose, initialStatus = 'A_FAZER', onCreated, tarefaToEdit = null }) => {
  const { user } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [processos, setProcessos] = useState([])

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: '',
      descricao: '',
      prioridade: 'MEDIA',
      dataVencimento: '',
      processoId: ''
    }
  })

  useEffect(() => {
    if (isOpen) {
      // Load processes
      api.get('/api/processos').then(res => setProcessos(res.data)).catch(() => {})

      if (tarefaToEdit) {
        setValue('titulo', tarefaToEdit.titulo || '')
        setValue('descricao', tarefaToEdit.descricao || '')
        setValue('prioridade', tarefaToEdit.prioridade || 'MEDIA')
        setValue('dataVencimento', tarefaToEdit.dataVencimento || '')
        setValue('processoId', tarefaToEdit.processoId ? tarefaToEdit.processoId.toString() : '')
      } else {
        reset()
      }
    }
  }, [isOpen, tarefaToEdit, setValue, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    if (!user?.usuarioId) {
      toast.error('Usuário inválido.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade,
        dataVencimento: data.dataVencimento || null,
        processoId: data.processoId ? parseInt(data.processoId, 10) : null,
        responsavelId: user.usuarioId
      }

      if (tarefaToEdit) {
        // The API OpenAPI spec doesn't show a PUT /api/tarefas/{id} for updating details.
        // It only shows PATCH /api/tarefas/{id}/status
        // If there's no update endpoint, we must notify the user.
        toast.error('A API não possui rota para editar tarefas no momento.')
      } else {
        await api.post('/api/tarefas', payload)
        // If the task belongs in another column by default (status is not set on create endpoint, but handled by API usually default A_FAZER)
        // A patch might be needed if initialStatus != A_FAZER, but normally newly created task is A_FAZER
        toast.success('Tarefa criada com sucesso!')
        onCreated && onCreated()
        handleClose()
      }
    } catch (error) {
      console.error('Failed to save task:', error)
      toast.error('Erro ao salvar tarefa.')
    } finally {
      setSaving(false)
    }
  }

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose} disabled={saving}>Cancelar</Button>
      {!tarefaToEdit && (
        <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={saving}>
          {saving ? 'Criando...' : 'Criar Tarefa'}
        </Button>
      )}
      {tarefaToEdit && (
        <Button variant="primary" disabled>
          Apenas Visualização
        </Button>
      )}
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={tarefaToEdit ? "Visualizar Tarefa" : "Nova Tarefa"} footer={footer}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
        <Input 
          label="Título *" 
          placeholder="Ex: Peticionar recurso" 
          {...register('titulo')} 
          error={errors.titulo?.message} 
          disabled={!!tarefaToEdit}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select 
            label="Prioridade *" 
            {...register('prioridade')}
            error={errors.prioridade?.message}
            disabled={!!tarefaToEdit}
            options={[
              { value: 'BAIXA', label: 'Baixa' },
              { value: 'MEDIA', label: 'Média' },
              { value: 'ALTA', label: 'Alta' },
              { value: 'URGENTE', label: 'Urgente' }
            ]}
          />
          <Input 
            label="Data de Vencimento" 
            type="date"
            {...register('dataVencimento')} 
            error={errors.dataVencimento?.message} 
            disabled={!!tarefaToEdit}
          />
        </div>

        <Select 
          label="Vincular a Processo (Opcional)" 
          {...register('processoId')}
          disabled={!!tarefaToEdit}
          options={[
            { value: '', label: 'Nenhum' },
            ...processos.map(p => ({ value: p.id.toString(), label: p.numeroProcesso || p.titulo }))
          ]}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-primary)' }}>
            Descrição
          </label>
          <textarea 
            {...register('descricao')}
            disabled={!!tarefaToEdit}
            style={{
              minHeight: '80px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit',
              resize: 'vertical',
              opacity: tarefaToEdit ? 0.7 : 1
            }}
            placeholder="Detalhes sobre a tarefa..."
          />
        </div>
      </form>
    </Modal>
  )
}
