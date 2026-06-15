import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { ShieldCheck } from 'lucide-react'

const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA'], {
    errorMap: () => ({ message: 'Selecione um perfil válido' })
  })
})

export const RegisterUserForm = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'ADVOGADO'
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/api/auth/registro', data)
      toast.success('Novo colaborador cadastrado com sucesso!')
      reset()
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Erro ao registrar usuário.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card variant="glass" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
              Cadastrar Colaborador
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Crie novas credenciais de acesso para a equipe do escritório.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Nome Completo"
            placeholder="Ex: João da Silva"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <Input
            label="E-mail Corporativo"
            placeholder="Ex: joao@advo.dev"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha Inicial"
            type="password"
            placeholder="Minímo 6 caracteres"
            error={errors.senha?.message}
            {...register('senha')}
          />

          <Select
            label="Perfil de Acesso (Role)"
            error={errors.role?.message}
            options={[
              { value: 'ADMIN', label: 'ADMIN - Acesso total e gerenciamento de usuários' },
              { value: 'ADVOGADO', label: 'ADVOGADO - Acesso operacional e relatórios' },
              { value: 'ESTAGIARIO', label: 'ESTAGIÁRIO - Acesso operacional limitado' },
              { value: 'SECRETARIA', label: 'SECRETÁRIA - Acesso administrativo e agenda' }
            ]}
            {...register('role')}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => reset()}
              disabled={loading}
            >
              Limpar
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading}
            >
              Registrar Colaborador
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
