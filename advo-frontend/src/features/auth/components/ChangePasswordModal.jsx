import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useState } from 'react'

const changePasswordSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória')
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
})

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(changePasswordSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/api/auth/senha', {
        email: user.email,
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha
      })
      toast.success('Senha alterada com sucesso!')
      reset()
      onClose()
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Erro ao alterar a senha. Verifique a senha atual.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Alterar Senha"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={loading}>
            Confirmar
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Input
          label="Senha Atual"
          type="password"
          error={errors.senhaAtual?.message}
          {...register('senhaAtual')}
        />
        
        <Input
          label="Nova Senha"
          type="password"
          error={errors.novaSenha?.message}
          {...register('novaSenha')}
        />
        
        <Input
          label="Confirmar Nova Senha"
          type="password"
          error={errors.confirmarSenha?.message}
          {...register('confirmarSenha')}
        />
      </form>
    </Modal>
  )
}
