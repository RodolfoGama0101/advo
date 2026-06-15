import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

const schema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  descricao: z.string().optional(),
  dataMovimentacao: z.string().min(1, 'Data obrigatória'),
})

export const MovimentacaoModal = ({ isOpen, onClose, processoId, onCreated }) => {
  const { user } = useAuthStore()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: '',
      descricao: '',
      dataMovimentacao: new Date().toISOString().split('T')[0] // Today
    }
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    if (!user?.usuarioId) {
      toast.error('Usuário não autenticado corretamente para realizar esta ação.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        processoId: parseInt(processoId, 10),
        usuarioId: user.usuarioId,
        titulo: data.titulo,
        descricao: data.descricao,
        dataMovimentacao: data.dataMovimentacao
      }

      await api.post(`/api/processos/${processoId}/movimentacoes`, payload)
      toast.success('Movimentação adicionada com sucesso!')
      onCreated && onCreated()
      handleClose()
    } catch (error) {
      console.error('Failed to add movimentacao:', error)
      toast.error('Erro ao adicionar movimentação.')
    } finally {
      setSaving(false)
    }
  }

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose} disabled={saving}>Cancelar</Button>
      <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={saving}>
        {saving ? 'Adicionando...' : 'Adicionar Movimentação'}
      </Button>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nova Movimentação" footer={footer}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
        <Input 
          label="Título *" 
          placeholder="Ex: Juntada de Petição" 
          {...register('titulo')} 
          error={errors.titulo?.message} 
        />
        <Input 
          label="Data da Movimentação *" 
          type="date"
          {...register('dataMovimentacao')} 
          error={errors.dataMovimentacao?.message} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-primary)' }}>
            Descrição Detalhada
          </label>
          <textarea 
            {...register('descricao')}
            style={{
              minHeight: '100px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Descreva o que ocorreu..."
          />
        </div>
      </form>
    </Modal>
  )
}
