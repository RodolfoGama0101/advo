import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  FileText, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  UserPlus
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { clsx } from '../../lib/utils'

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { role } = useAuthStore()

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['ADMIN', 'ADVOGADO']
    },
    {
      label: 'Clientes',
      path: '/clientes',
      icon: Users,
      allowedRoles: ['ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA']
    },
    {
      label: 'Processos',
      path: '/processos',
      icon: Briefcase,
      allowedRoles: ['ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA']
    },
    {
      label: 'Agenda',
      path: '/agenda',
      icon: Calendar,
      allowedRoles: ['ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA']
    },
    {
      label: 'Tarefas',
      path: '/tarefas',
      icon: CheckSquare,
      allowedRoles: ['ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA']
    },
    {
      label: 'Documentos',
      path: '/documentos',
      icon: FileText,
      allowedRoles: ['ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA']
    },
    {
      label: 'Financeiro',
      path: '/financeiro',
      icon: DollarSign,
      allowedRoles: ['ADMIN', 'ADVOGADO']
    },
    {
      label: 'Colaboradores',
      path: '/usuarios',
      icon: UserPlus,
      allowedRoles: ['ADMIN']
    }
  ]

  // Filter items based on user role
  const filteredItems = menuItems.filter(item => item.allowedRoles.includes(role))

  return (
    <aside className={clsx('sidebar', isCollapsed && 'sidebar-collapsed')}>
      {/* Brand logo header */}
      <div style={{ 
        height: '70px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: isCollapsed ? '0' : '0 var(--spacing-lg)',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              background: 'var(--gradient-primary)', 
              color: 'white', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)'
            }}>
              AD
            </div>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              fontFamily: 'var(--font-heading)',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ADVO
            </span>
          </div>
        )}
        {isCollapsed && (
          <div style={{ 
            background: 'var(--gradient-primary)', 
            color: 'white', 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)'
          }}>
            A
          </div>
        )}
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation menu list */}
      <nav style={{ 
        flex: 1, 
        padding: 'var(--spacing-md) var(--spacing-sm)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        overflowY: 'auto' 
      }}>
        {filteredItems.map(item => {
          const IconComponent = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px var(--spacing-md)',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all var(--transition-fast)'
              })}
            >
              <IconComponent size={20} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Sidebar footer with collapse action or profile role indicator */}
      <div style={{
        padding: 'var(--spacing-md)',
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '12px',
        flexShrink: 0
      }}>
        {isCollapsed ? (
          <button 
            onClick={() => setIsCollapsed(false)}
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <ShieldAlert size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>PAINEL</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                {role}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
