import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export const ForbiddenPage = () => {
  const navigate = useNavigate()
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--color-bg-base)',
      padding: 'var(--spacing-lg)'
    }}>
      <Card variant="glass" style={{
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-danger-subtle)',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          Acesso Restrito
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
          Seu perfil de acesso não tem permissão para visualizar esta página. Caso ache que isso seja um erro, entre em contato com o administrador do sistema.
        </p>
        <Button variant="primary" style={{ marginTop: '8px', width: '100%' }} onClick={() => navigate('/')}>
          Voltar para Início
        </Button>
      </Card>
    </div>
  )
}
