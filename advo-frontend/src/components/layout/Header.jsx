import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut, Key, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/Button'

export const Header = ({ onChangePasswordClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Toggle theme dark/light
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    setTheme(newTheme)
  }

  // Generate breadcrumb from url path
  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === '/') return 'Home'
    if (path === '/dashboard') return 'Dashboard'
    
    const segments = path.split('/').filter(Boolean)
    return segments.map((seg, idx) => {
      let segmentName = seg.charAt(0).toUpperCase() + seg.slice(1)
      if (segmentName === 'Clientes') return 'Clientes'
      if (segmentName === 'Processos') return 'Processos'
      if (segmentName === 'Agenda') return 'Agenda'
      if (segmentName === 'Tarefas') return 'Quadro Kanban'
      if (segmentName === 'Documentos') return 'Documentos'
      if (segmentName === 'Financeiro') return 'Financeiro'
      if (segmentName === 'Novo') return 'Novo Cadastro'
      
      // If it is a number (ID), we could call it "Detalhes"
      if (!isNaN(seg)) return 'Visualização'
      
      return segmentName
    }).join('  /  ')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClose = () => setShowProfileMenu(false)
    if (showProfileMenu) {
      window.addEventListener('click', handleClose)
    }
    return () => window.removeEventListener('click', handleClose)
  }, [showProfileMenu])

  return (
    <header className="header">
      {/* Breadcrumb path indicator */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'var(--color-text-secondary)'
      }}>
        {getBreadcrumb()}
      </div>

      {/* Action controls (Theme switch, profile menu) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Theme toggle switch */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme}
          style={{ minWidth: 'auto', padding: '8px', borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* User profile dropdown menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowProfileMenu(!showProfileMenu)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              {user?.email?.charAt(0).toUpperCase() || <User size={18} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }} className="hide-mobile">
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {user?.email || 'Usuário'}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
          </button>

          {/* Profile options overlay menu */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '180px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              padding: '6px',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowProfileMenu(false)
                  onChangePasswordClick()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8125rem',
                  width: '100%',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                <Key size={14} />
                <span>Alterar Senha</span>
              </button>
              
              <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '4px 0' }} />

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8125rem',
                  width: '100%',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-danger-subtle)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <LogOut size={14} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
