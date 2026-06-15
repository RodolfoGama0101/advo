import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Card } from '../../../components/ui/Card'

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').trim().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
})

export const LoginPage = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore(state => state.login)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', data)
      loginStore(response.data)
      toast.success('Login efetuado com sucesso!')
      
      // Redirect based on role
      const userRole = response.data.role
      if (userRole === 'ADMIN' || userRole === 'ADVOGADO') {
        navigate('/dashboard')
      } else {
        navigate('/clientes')
      }
    } catch (error) {
      console.error(error)
      const errorMsg = error.response?.data?.message || 'Erro de autenticação. Verifique suas credenciais.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #07070a 0%, #16162a 50%, #07070a 100%)',
      padding: 'var(--spacing-lg)'
    }}>
      <Card variant="glass" style={{
        maxWidth: '420px',
        width: '100%',
        padding: 'var(--spacing-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)',
            marginBottom: '8px'
          }}>
            <Shield size={24} />
          </div>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.75rem', 
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ADVO
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Gerenciamento de Serviços Jurídicos
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="E-mail"
            type="text"
            placeholder="exemplo@advo.dev"
            error={errors.email?.message}
            startIcon={<Mail size={16} />}
            {...register('email')}
          />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.senha?.message}
            startIcon={<Lock size={16} />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('senha')}
          />

          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            style={{ width: '100%', height: '44px', marginTop: '8px' }}
          >
            Acessar Sistema
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Não tem uma conta? </span>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigate('/registro'); }}
              style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
            >
              Criar conta
            </a>
          </div>
        </form>

        {/* Demo Accounts Notice */}
        <div style={{ 
          marginTop: '8px', 
          padding: '12px', 
          borderRadius: '8px', 
          backgroundColor: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Contas de Demonstração:</span>
          <div>• Admin: <code>admin@advo.dev</code> / <code>admin123</code></div>
          <div>• Advogado: <code>advogado@advo.dev</code> / <code>advogado123</code></div>
          <div>• Estagiário: <code>estagiario@advo.dev</code> / <code>estagiario123</code></div>
        </div>
      </Card>
    </div>
  )
}
