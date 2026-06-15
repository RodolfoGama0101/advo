import { RegisterUserForm } from './RegisterUserForm'

export const RegisterPage = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #07070a 0%, #16162a 50%, #07070a 100%)',
      padding: 'var(--spacing-lg)'
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <RegisterUserForm />
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem' }}>
          <a 
            href="/login" 
            style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
          >
            Voltar para o Login
          </a>
        </div>
      </div>
    </div>
  )
}
