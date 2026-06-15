import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/Button'

export const SessionExpiredModal = () => {
  const { sessionExpired, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!sessionExpired) return null

  const handleRelogin = () => {
    logout() // This will also reset sessionExpired to false
    navigate('/login')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999, // Super high z-index to block everything
      animation: 'fadeIn var(--transition-fast)'
    }}>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-danger-subtle)',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px'
        }}>
          <Lock size={32} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
          Sessão Expirada
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Sua sessão expirou por inatividade ou por motivos de segurança. Por favor, faça login novamente para continuar.
        </p>
        <Button 
          variant="primary" 
          onClick={handleRelogin}
          style={{ width: '100%', marginTop: '16px' }}
        >
          Fazer Login Novamente
        </Button>
      </div>
    </div>
  )
}
